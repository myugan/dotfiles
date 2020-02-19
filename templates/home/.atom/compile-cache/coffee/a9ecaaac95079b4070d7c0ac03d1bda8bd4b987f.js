(function() {
  var Beautifiers, JsDiff, beautifier, fs, isWindows, path, shellEnv, unsupportedLangs;

  Beautifiers = require("../src/beautifiers");

  beautifier = new Beautifiers();

  fs = require("fs");

  path = require("path");

  JsDiff = require('diff');

  shellEnv = require('shell-env');

  process.env = shellEnv.sync();

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  unsupportedLangs = {
    all: [],
    windows: ["ocaml", "r", "clojure", "apex", "bash", "csharp", "d", "elm", "java", "objectivec", "opencl"]
  };

  describe("BeautifyLanguages", function() {
    var allLanguages, config, configs, dependentPackages, fn, i, j, lang, len, len1, optionsDir, results;
    optionsDir = path.resolve(__dirname, "../examples");
    allLanguages = ["blade", "c", "clojure", "coffee-script", "css", "csharp", "d", "gfm", "go", "html", "html-swig", "java", "javascript", "json", "less", "lua", "mustache", "objective-c", "perl", "php", "python", "ruby", "sass", "sql", "svg", "xml"];
    dependentPackages = ['autocomplete-plus', 'fuse', 'react'];
    fn = function(lang) {
      return dependentPackages.push("language-" + lang);
    };
    for (i = 0, len = allLanguages.length; i < len; i++) {
      lang = allLanguages[i];
      fn(lang);
    }
    beforeEach(function() {
      var fn1, j, len1, packageName;
      fn1 = function(packageName) {
        return waitsForPromise(function() {
          return atom.packages.activatePackage(packageName);
        });
      };
      for (j = 0, len1 = dependentPackages.length; j < len1; j++) {
        packageName = dependentPackages[j];
        fn1(packageName);
      }
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        atom.config.set('atom-beautify.general.loggerLevel', 'info');
        return activationPromise;
      });
    });

    /*
    Directory structure:
     - examples
       - config1
         - lang1
           - original
             - 1 - test.ext
           - expected
             - 1 - test.ext
         - lang2
       - config2
     */
    configs = fs.readdirSync(optionsDir);
    results = [];
    for (j = 0, len1 = configs.length; j < len1; j++) {
      config = configs[j];
      results.push((function(config) {
        var langsDir, optionStats;
        langsDir = path.resolve(optionsDir, config);
        optionStats = fs.lstatSync(langsDir);
        if (optionStats.isDirectory()) {
          return describe("when using configuration '" + config + "'", function() {
            var k, langNames, len2, results1, shouldSkipLang;
            langNames = fs.readdirSync(langsDir);
            results1 = [];
            for (k = 0, len2 = langNames.length; k < len2; k++) {
              lang = langNames[k];
              shouldSkipLang = false;
              if (unsupportedLangs.all.indexOf(lang) !== -1) {
                shouldSkipLang = true;
              }
              if (isWindows && unsupportedLangs.windows.indexOf(lang) !== -1) {
                console.warn("Tests for Windows do not support " + lang);
                shouldSkipLang = true;
              }
              results1.push((function(lang) {
                var expectedDir, langStats, originalDir, testsDir;
                testsDir = path.resolve(langsDir, lang);
                langStats = fs.lstatSync(testsDir);
                if (langStats.isDirectory()) {
                  originalDir = path.resolve(testsDir, "original");
                  if (!fs.existsSync(originalDir)) {
                    console.warn("Directory for test originals/inputs not found." + (" Making it at " + originalDir + "."));
                    fs.mkdirSync(originalDir);
                  }
                  expectedDir = path.resolve(testsDir, "expected");
                  if (!fs.existsSync(expectedDir)) {
                    console.warn("Directory for test expected/results not found." + ("Making it at " + expectedDir + "."));
                    fs.mkdirSync(expectedDir);
                  }
                  return describe((shouldSkipLang ? '#' : '') + "when beautifying language '" + lang + "'", function() {
                    var l, len3, results2, testFileName, testNames;
                    testNames = fs.readdirSync(originalDir);
                    results2 = [];
                    for (l = 0, len3 = testNames.length; l < len3; l++) {
                      testFileName = testNames[l];
                      results2.push((function(testFileName) {
                        var ext, shouldSkip, testName;
                        ext = path.extname(testFileName);
                        testName = path.basename(testFileName, ext);
                        shouldSkip = false;
                        if (testFileName[0] === '_') {
                          shouldSkip = true;
                        }
                        return it("" + (shouldSkip ? '# ' : '') + testName + " " + testFileName, function() {
                          var allOptions, beautifyCompleted, completionFun, expectedContents, expectedTestPath, grammar, grammarName, language, originalContents, originalTestPath, ref, ref1;
                          originalTestPath = path.resolve(originalDir, testFileName);
                          expectedTestPath = path.resolve(expectedDir, testFileName);
                          originalContents = (ref = fs.readFileSync(originalTestPath)) != null ? ref.toString() : void 0;
                          if (!fs.existsSync(expectedTestPath)) {
                            throw new Error(("No matching expected test result found for '" + testName + "' ") + ("at '" + expectedTestPath + "'."));
                          }
                          expectedContents = (ref1 = fs.readFileSync(expectedTestPath)) != null ? ref1.toString() : void 0;
                          grammar = atom.grammars.selectGrammar(originalTestPath, originalContents);
                          grammarName = grammar.name;
                          allOptions = beautifier.getOptionsForPath(originalTestPath);
                          language = beautifier.getLanguage(grammarName, testFileName);
                          beautifyCompleted = false;
                          completionFun = function(text) {
                            var diff, e, fileName, newHeader, newStr, oldHeader, oldStr, opts, selectedBeautifier;
                            try {
                              expect(text instanceof Error).not.toEqual(true, text.message || text.toString());
                              if (text instanceof Error) {
                                return beautifyCompleted = true;
                              }
                              expect(text).not.toEqual(null, "Language or Beautifier not found");
                              if (text === null) {
                                return beautifyCompleted = true;
                              }
                              expect(typeof text).toEqual("string", "Text: " + text);
                              if (typeof text !== "string") {
                                return beautifyCompleted = true;
                              }
                              text = text.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                              expectedContents = expectedContents.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                              text = text.replace(/(?:\t)/g, '↹');
                              expectedContents = expectedContents.replace(/(?:\t)/g, '↹');
                              text = text.replace(/(?:\ )/g, '␣');
                              expectedContents = expectedContents.replace(/(?:\ )/g, '␣');
                              if (text !== expectedContents) {
                                fileName = expectedTestPath;
                                oldStr = text;
                                newStr = expectedContents;
                                oldHeader = "beautified";
                                newHeader = "expected";
                                diff = JsDiff.createPatch(fileName, oldStr, newStr, oldHeader, newHeader);
                                opts = beautifier.getOptionsForLanguage(allOptions, language);
                                selectedBeautifier = beautifier.getBeautifierForLanguage(language);
                                if (selectedBeautifier != null) {
                                  opts = beautifier.transformOptions(selectedBeautifier, language.name, opts);
                                }
                                expect(text).toEqual(expectedContents, "Beautifier '" + (selectedBeautifier != null ? selectedBeautifier.name : void 0) + "' output does not match expected output:\n" + diff + "\n\nWith options:\n" + (JSON.stringify(opts, void 0, 4)));
                              }
                              return beautifyCompleted = true;
                            } catch (error) {
                              e = error;
                              console.error(e);
                              return beautifyCompleted = e;
                            }
                          };
                          runs(function() {
                            var e;
                            try {
                              return beautifier.beautify(originalContents, allOptions, grammarName, testFileName).then(completionFun)["catch"](completionFun);
                            } catch (error) {
                              e = error;
                              return beautifyCompleted = e;
                            }
                          });
                          return waitsFor(function() {
                            if (beautifyCompleted instanceof Error) {
                              throw beautifyCompleted;
                            } else {
                              return beautifyCompleted;
                            }
                          }, "Waiting for beautification to complete", 60000);
                        });
                      })(testFileName));
                    }
                    return results2;
                  });
                }
              })(lang));
            }
            return results1;
          });
        }
      })(config));
    }
    return results;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcGVjL2JlYXV0aWZ5LWxhbmd1YWdlcy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUjs7RUFDZCxVQUFBLEdBQWEsSUFBSSxXQUFKLENBQUE7O0VBQ2IsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVI7O0VBQ1QsUUFBQSxHQUFXLE9BQUEsQ0FBUSxXQUFSOztFQUdYLE9BQU8sQ0FBQyxHQUFSLEdBQWMsUUFBUSxDQUFDLElBQVQsQ0FBQTs7RUFRZCxTQUFBLEdBQVksT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBcEIsSUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsUUFEWixJQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQjs7RUFFeEIsZ0JBQUEsR0FBbUI7SUFDakIsR0FBQSxFQUFLLEVBRFk7SUFHakIsT0FBQSxFQUFTLENBQ1AsT0FETyxFQUVQLEdBRk8sRUFHUCxTQUhPLEVBS1AsTUFMTyxFQU1QLE1BTk8sRUFPUCxRQVBPLEVBUVAsR0FSTyxFQVNQLEtBVE8sRUFVUCxNQVZPLEVBV1AsWUFYTyxFQVlQLFFBWk8sQ0FIUTs7O0VBbUJuQixRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQTtBQUU1QixRQUFBO0lBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixhQUF4QjtJQUdiLFlBQUEsR0FBZSxDQUNiLE9BRGEsRUFDSixHQURJLEVBQ0MsU0FERCxFQUNZLGVBRFosRUFDNkIsS0FEN0IsRUFDb0MsUUFEcEMsRUFDOEMsR0FEOUMsRUFFYixLQUZhLEVBRU4sSUFG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LENBQWMsQ0FBZDtxQ0FDQSxpQkFBQSxHQUFvQixFQXBEdEI7OzBCQURjOzBCQXVEaEIsSUFBQSxDQUFLLFNBQUE7QUFDSCxnQ0FBQTtBQUFBO3FDQUNFLFVBQVUsQ0FBQyxRQUFYLENBQW9CLGdCQUFwQixFQUFzQyxVQUF0QyxFQUFrRCxXQUFsRCxFQUErRCxZQUEvRCxDQUNBLENBQUMsSUFERCxDQUNNLGFBRE4sQ0FFQSxFQUFDLEtBQUQsRUFGQSxDQUVPLGFBRlAsRUFERjs2QkFBQSxhQUFBOzhCQUlNO3FDQUNKLGlCQUFBLEdBQW9CLEVBTHRCOzswQkFERyxDQUFMO2lDQVFBLFFBQUEsQ0FBUyxTQUFBOzRCQUNQLElBQUcsaUJBQUEsWUFBNkIsS0FBaEM7QUFDRSxvQ0FBTSxrQkFEUjs2QkFBQSxNQUFBO0FBR0UscUNBQU8sa0JBSFQ7OzBCQURPLENBQVQsRUFLRSx3Q0FMRixFQUs0QyxLQUw1Qzt3QkEzRmtFLENBQXBFO3NCQVRDLENBQUEsQ0FBSCxDQUFJLFlBQUo7QUFERjs7a0JBSm1GLENBQXJGLEVBZkY7O2NBTEMsQ0FBQSxDQUFILENBQUksSUFBSjtBQVRGOztVQUgrQyxDQUFqRCxFQUZGOztNQUxDLENBQUEsQ0FBSCxDQUFJLE1BQUo7QUFERjs7RUFuRTRCLENBQTlCO0FBdkNBIiwic291cmNlc0NvbnRlbnQiOlsiIyBCZWF1dGlmeSA9IHJlcXVpcmUgJy4uL3NyYy9iZWF1dGlmeSdcbkJlYXV0aWZpZXJzID0gcmVxdWlyZSBcIi4uL3NyYy9iZWF1dGlmaWVyc1wiXG5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbmZzID0gcmVxdWlyZSBcImZzXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5Kc0RpZmYgPSByZXF1aXJlKCdkaWZmJylcbnNoZWxsRW52ID0gcmVxdWlyZSgnc2hlbGwtZW52JylcblxuIyBGaXggaHR0cHM6Ly9kaXNjdXNzLmF0b20uaW8vdC9zcGVjcy1kby1ub3QtbG9hZC1zaGVsbC1lbnZpcm9ubWVudC12YXJpYWJsZXMtYWN0aXZhdGlvbmhvb2tzLWNvcmUtbG9hZGVkLXNoZWxsLWVudmlyb25tZW50LzQ0MTk5XG5wcm9jZXNzLmVudiA9IHNoZWxsRW52LnN5bmMoKVxuXG4jIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbiNcbiMgVG8gcnVuIGEgc3BlY2lmaWMgYGl0YCBvciBgZGVzY3JpYmVgIGJsb2NrIGFkZCBhbiBgZmAgdG8gdGhlIGZyb250IChlLmcuIGBmaXRgXG4jIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbiMgQ2hlY2sgaWYgV2luZG93c1xuaXNXaW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIG9yXG4gIHByb2Nlc3MuZW52Lk9TVFlQRSBpcyAnY3lnd2luJyBvclxuICBwcm9jZXNzLmVudi5PU1RZUEUgaXMgJ21zeXMnXG5cbnVuc3VwcG9ydGVkTGFuZ3MgPSB7XG4gIGFsbDogW1xuICBdXG4gIHdpbmRvd3M6IFtcbiAgICBcIm9jYW1sXCJcbiAgICBcInJcIlxuICAgIFwiY2xvanVyZVwiXG4gICAgIyBCcm9rZW5cbiAgICBcImFwZXhcIlxuICAgIFwiYmFzaFwiXG4gICAgXCJjc2hhcnBcIlxuICAgIFwiZFwiXG4gICAgXCJlbG1cIlxuICAgIFwiamF2YVwiXG4gICAgXCJvYmplY3RpdmVjXCJcbiAgICBcIm9wZW5jbFwiXG4gIF1cbn1cblxuZGVzY3JpYmUgXCJCZWF1dGlmeUxhbmd1YWdlc1wiLCAtPlxuXG4gIG9wdGlvbnNEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL2V4YW1wbGVzXCIpXG5cbiAgIyBBY3RpdmF0ZSBhbGwgb2YgdGhlIGxhbmd1YWdlc1xuICBhbGxMYW5ndWFnZXMgPSBbXG4gICAgXCJibGFkZVwiLCBcImNcIiwgXCJjbG9qdXJlXCIsIFwiY29mZmVlLXNjcmlwdFwiLCBcImNzc1wiLCBcImNzaGFycFwiLCBcImRcIixcbiAgICBcImdmbVwiLCBcImdvXCIsIFwiaHRtbFwiLCBcImh0bWwtc3dpZ1wiLCBcImphdmFcIiwgXCJqYXZhc2NyaXB0XCIsXG4gICAgXCJqc29uXCIsIFwibGVzc1wiLCBcImx1YVwiLCBcIm11c3RhY2hlXCIsIFwib2JqZWN0aXZlLWNcIixcbiAgICBcInBlcmxcIiwgXCJwaHBcIiwgXCJweXRob25cIiwgXCJydWJ5XCIsIFwic2Fzc1wiLCBcInNxbFwiLFxuICAgIFwic3ZnXCIsIFwieG1sXCJcbiAgICBdXG4gICMgQWxsIEF0b20gcGFja2FnZXMgdGhhdCBBdG9tIEJlYXV0aWZ5IGlzIGRlcGVuZGVudCBvblxuICBkZXBlbmRlbnRQYWNrYWdlcyA9IFtcbiAgICAnYXV0b2NvbXBsZXRlLXBsdXMnXG4gICAgJ2Z1c2UnXG4gICAgJ3JlYWN0J1xuICAgICMgJ2xpbnRlcidcbiAgICAjICAgJ2F0b20tdHlwZXNjcmlwdCcgIyBpdCBsb2dzIHRvbyBtdWNoLi4uXG4gIF1cbiAgIyBBZGQgbGFuZ3VhZ2UgcGFja2FnZXMgdG8gZGVwZW5kZW50UGFja2FnZXNcbiAgZm9yIGxhbmcgaW4gYWxsTGFuZ3VhZ2VzXG4gICAgZG8gKGxhbmcpIC0+XG4gICAgICBkZXBlbmRlbnRQYWNrYWdlcy5wdXNoKFwibGFuZ3VhZ2UtI3tsYW5nfVwiKVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICAjIEluc3RhbGwgYWxsIG9mIHRoZSBsYW5ndWFnZXNcbiAgICBmb3IgcGFja2FnZU5hbWUgaW4gZGVwZW5kZW50UGFja2FnZXNcbiAgICAgIGRvIChwYWNrYWdlTmFtZSkgLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UocGFja2FnZU5hbWUpXG5cbiAgICAjIEFjdGl2YXRlIHBhY2thZ2VcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tYmVhdXRpZnknKVxuICAgICAgIyBGb3JjZSBhY3RpdmF0ZSBwYWNrYWdlXG4gICAgICBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKFwiYXRvbS1iZWF1dGlmeVwiKVxuICAgICAgcGFjay5hY3RpdmF0ZU5vdygpXG4gICAgICAjIE5lZWQgbW9yZSBkZWJ1Z2dpbmcgb24gV2luZG93c1xuICAgICAgIyBDaGFuZ2UgbG9nZ2VyIGxldmVsXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tYmVhdXRpZnkuZ2VuZXJhbC5sb2dnZXJMZXZlbCcsICdpbmZvJylcbiAgICAgICMgUmV0dXJuIHByb21pc2VcbiAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gICAgIyBTZXQgVW5jcnVzdGlmeSBjb25maWcgcGF0aFxuICAgICMgdW5jcnVzdGlmeUNvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL2V4YW1wbGVzL25lc3RlZC1qc2JlYXV0aWZ5cmMvdW5jcnVzdGlmeS5jZmdcIilcbiAgICAjIHVuY3J1c3RpZnlMYW5ncyA9IFtcImFwZXhcIiwgXCJjXCIsIFwiY3BwXCIsIFwib2JqZWN0aXZlY1wiLCBcImNzXCIsIFwiZFwiLCBcImphdmFcIiwgXCJwYXduXCIsIFwidmFsYVwiXVxuICAgICMgZm9yIGxhbmcgaW4gdW5jcnVzdGlmeUxhbmdzXG4gICAgIyAgICAgZG8gKGxhbmcpIC0+XG4gICAgICAjIGF0b20uY29uZmlnLnNldChcImF0b20tYmVhdXRpZnkuI3tsYW5nfV9jb25maWdQYXRoXCIsIHVuY3J1c3RpZnlDb25maWdQYXRoKVxuICAgICAgIyBleHBlY3QoYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS4je2xhbmd9X2NvbmZpZ1BhdGhcIikpLnRvRXF1YWwoXCJURVNUXCIpXG5cbiAgIyMjXG4gIERpcmVjdG9yeSBzdHJ1Y3R1cmU6XG4gICAtIGV4YW1wbGVzXG4gICAgIC0gY29uZmlnMVxuICAgICAgIC0gbGFuZzFcbiAgICAgICAgIC0gb3JpZ2luYWxcbiAgICAgICAgICAgLSAxIC0gdGVzdC5leHRcbiAgICAgICAgIC0gZXhwZWN0ZWRcbiAgICAgICAgICAgLSAxIC0gdGVzdC5leHRcbiAgICAgICAtIGxhbmcyXG4gICAgIC0gY29uZmlnMlxuICAjIyNcblxuICAjIEFsbCBDb25maWd1cmF0aW9uc1xuICBjb25maWdzID0gZnMucmVhZGRpclN5bmMob3B0aW9uc0RpcilcbiAgZm9yIGNvbmZpZyBpbiBjb25maWdzXG4gICAgZG8gKGNvbmZpZykgLT5cbiAgICAgICMgR2VuZXJhdGUgdGhlIHBhdGggdG8gd2hlcmUgYWxsIG9mIHRoZSBsYW5ndWFnZXMgYXJlXG4gICAgICBsYW5nc0RpciA9IHBhdGgucmVzb2x2ZShvcHRpb25zRGlyLCBjb25maWcpXG4gICAgICBvcHRpb25TdGF0cyA9IGZzLmxzdGF0U3luYyhsYW5nc0RpcilcbiAgICAgICMgQ29uZmlybSB0aGF0IHRoaXMgcGF0aCBpcyBhIGRpcmVjdG9yeVxuICAgICAgaWYgb3B0aW9uU3RhdHMuaXNEaXJlY3RvcnkoKVxuICAgICAgICAjIENyZWF0ZSB0ZXN0aW5nIGdyb3VwIGZvciBjb25maWd1cmF0aW9uXG4gICAgICAgIGRlc2NyaWJlIFwid2hlbiB1c2luZyBjb25maWd1cmF0aW9uICcje2NvbmZpZ30nXCIsIC0+XG4gICAgICAgICAgIyBBbGwgTGFuZ3VhZ2VzIGZvciBjb25maWd1cmF0aW9uXG4gICAgICAgICAgbGFuZ05hbWVzID0gZnMucmVhZGRpclN5bmMobGFuZ3NEaXIpXG4gICAgICAgICAgZm9yIGxhbmcgaW4gbGFuZ05hbWVzXG5cbiAgICAgICAgICAgIHNob3VsZFNraXBMYW5nID0gZmFsc2VcbiAgICAgICAgICAgIGlmIHVuc3VwcG9ydGVkTGFuZ3MuYWxsLmluZGV4T2YobGFuZykgaXNudCAtMVxuICAgICAgICAgICAgICBzaG91bGRTa2lwTGFuZyA9IHRydWVcbiAgICAgICAgICAgIGlmIGlzV2luZG93cyBhbmQgdW5zdXBwb3J0ZWRMYW5ncy53aW5kb3dzLmluZGV4T2YobGFuZykgaXNudCAtMVxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJUZXN0cyBmb3IgV2luZG93cyBkbyBub3Qgc3VwcG9ydCAje2xhbmd9XCIpXG4gICAgICAgICAgICAgIHNob3VsZFNraXBMYW5nID0gdHJ1ZVxuXG4gICAgICAgICAgICBkbyAobGFuZykgLT5cbiAgICAgICAgICAgICAgIyBHZW5lcmF0ZSB0aGUgcGF0aCB0byB3aGVyZSBhbCBvZiB0aGUgdGVzdHMgYXJlXG4gICAgICAgICAgICAgIHRlc3RzRGlyID0gcGF0aC5yZXNvbHZlKGxhbmdzRGlyLCBsYW5nKVxuICAgICAgICAgICAgICBsYW5nU3RhdHMgPSBmcy5sc3RhdFN5bmModGVzdHNEaXIpXG4gICAgICAgICAgICAgICMgQ29uZmlybSB0aGF0IHRoaXMgcGF0aCBpcyBhIGRpcmVjdG9yeVxuICAgICAgICAgICAgICBpZiBsYW5nU3RhdHMuaXNEaXJlY3RvcnkoKVxuICAgICAgICAgICAgICAgICMgT3JpZ2luYWxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbERpciA9IHBhdGgucmVzb2x2ZSh0ZXN0c0RpciwgXCJvcmlnaW5hbFwiKVxuICAgICAgICAgICAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jKG9yaWdpbmFsRGlyKVxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRGlyZWN0b3J5IGZvciB0ZXN0IG9yaWdpbmFscy9pbnB1dHMgbm90IGZvdW5kLlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgTWFraW5nIGl0IGF0ICN7b3JpZ2luYWxEaXJ9LlwiKVxuICAgICAgICAgICAgICAgICAgZnMubWtkaXJTeW5jKG9yaWdpbmFsRGlyKVxuICAgICAgICAgICAgICAgICMgRXhwZWN0ZWRcbiAgICAgICAgICAgICAgICBleHBlY3RlZERpciA9IHBhdGgucmVzb2x2ZSh0ZXN0c0RpciwgXCJleHBlY3RlZFwiKVxuICAgICAgICAgICAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jKGV4cGVjdGVkRGlyKVxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRGlyZWN0b3J5IGZvciB0ZXN0IGV4cGVjdGVkL3Jlc3VsdHMgbm90IGZvdW5kLlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJNYWtpbmcgaXQgYXQgI3tleHBlY3RlZERpcn0uXCIpXG4gICAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoZXhwZWN0ZWREaXIpXG5cbiAgICAgICAgICAgICAgICAjIExhbmd1YWdlIGdyb3VwIHRlc3RzXG4gICAgICAgICAgICAgICAgZGVzY3JpYmUgXCIje2lmIHNob3VsZFNraXBMYW5nIHRoZW4gJyMnIGVsc2UgJyd9d2hlbiBiZWF1dGlmeWluZyBsYW5ndWFnZSAnI3tsYW5nfSdcIiwgLT5cblxuICAgICAgICAgICAgICAgICAgIyBBbGwgdGVzdHMgZm9yIGxhbmd1YWdlXG4gICAgICAgICAgICAgICAgICB0ZXN0TmFtZXMgPSBmcy5yZWFkZGlyU3luYyhvcmlnaW5hbERpcilcbiAgICAgICAgICAgICAgICAgIGZvciB0ZXN0RmlsZU5hbWUgaW4gdGVzdE5hbWVzXG4gICAgICAgICAgICAgICAgICAgIGRvICh0ZXN0RmlsZU5hbWUpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgZXh0ID0gcGF0aC5leHRuYW1lKHRlc3RGaWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0TmFtZSA9IHBhdGguYmFzZW5hbWUodGVzdEZpbGVOYW1lLCBleHQpXG4gICAgICAgICAgICAgICAgICAgICAgIyBJZiBwcmVmaXhlZCB3aXRoIHVuZGVyc2NvcmUgKF8pIHRoZW4gdGhpcyBpcyBhIGhpZGRlbiB0ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgc2hvdWxkU2tpcCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgaWYgdGVzdEZpbGVOYW1lWzBdIGlzICdfJ1xuICAgICAgICAgICAgICAgICAgICAgICAgIyBEbyBub3Qgc2hvdyB0aGlzIHRlc3RcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFNraXAgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgIyBDb25maXJtIHRoaXMgaXMgYSB0ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgaXQgXCIje2lmIHNob3VsZFNraXAgdGhlbiAnIyAnIGVsc2UgJyd9I3t0ZXN0TmFtZX0gI3t0ZXN0RmlsZU5hbWV9XCIsIC0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgR2VuZXJhdGUgcGF0aHMgdG8gdGVzdCBmaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUZXN0UGF0aCA9IHBhdGgucmVzb2x2ZShvcmlnaW5hbERpciwgdGVzdEZpbGVOYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRUZXN0UGF0aCA9IHBhdGgucmVzb2x2ZShleHBlY3RlZERpciwgdGVzdEZpbGVOYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBHZXQgY29udGVudHMgb2Ygb3JpZ2luYWwgdGVzdCBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbENvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKG9yaWdpbmFsVGVzdFBhdGgpPy50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZXhwZWN0ZWQgdGVzdCByZXN1dFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IGZzLmV4aXN0c1N5bmMoZXhwZWN0ZWRUZXN0UGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gbWF0Y2hpbmcgZXhwZWN0ZWQgdGVzdCByZXN1bHQgZm91bmQgZm9yICcje3Rlc3ROYW1lfScgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXQgJyN7ZXhwZWN0ZWRUZXN0UGF0aH0nLlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAjIGVyciA9IGZzLndyaXRlRmlsZVN5bmMoZXhwZWN0ZWRUZXN0UGF0aCwgb3JpZ2luYWxDb250ZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0aHJvdyBlcnIgaWYgZXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEdldCBjb250ZW50cyBvZiBleHBlY3RlZCB0ZXN0IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZXhwZWN0ZWRUZXN0UGF0aCk/LnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICMgZXhwZWN0KGV4cGVjdGVkQ29udGVudHMpLm5vdC50b0VxdWFsIG9yaWdpbmFsQ29udGVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICMgZXhwZWN0KGF0b20uZ3JhbW1hcnMuZ2V0R3JhbW1hcnMoKSkudG9FcXVhbCBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuc2VsZWN0R3JhbW1hcihvcmlnaW5hbFRlc3RQYXRoLCBvcmlnaW5hbENvbnRlbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBleHBlY3QoZ3JhbW1hcikudG9FcXVhbChcInRlc3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYW1tYXJOYW1lID0gZ3JhbW1hci5uYW1lXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgR2V0IHRoZSBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChvcmlnaW5hbFRlc3RQYXRoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEdldCBsYW5ndWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2UgPSBiZWF1dGlmaWVyLmdldExhbmd1YWdlKGdyYW1tYXJOYW1lLCB0ZXN0RmlsZU5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXV0aWZ5Q29tcGxldGVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25GdW4gPSAodGV4dCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHRleHQgaW5zdGFuY2VvZiBFcnJvcikubm90LnRvRXF1YWwodHJ1ZSwgdGV4dC5tZXNzYWdlIG9yIHRleHQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmVhdXRpZnlDb21wbGV0ZWQgPSB0cnVlIGlmIHRleHQgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAjICAgbG9nZ2VyLnZlcmJvc2UoZXhwZWN0ZWRUZXN0UGF0aCwgdGV4dCkgaWYgZXh0IGlzIFwiLmxlc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAjICAgaWYgdGV4dCBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICMgICAgIHJldHVybiBiZWF1dGlmeUNvbXBsZXRlZCA9IHRleHQgIyB0ZXh0ID09IEVycm9yXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QodGV4dCkubm90LnRvRXF1YWwobnVsbCwgXCJMYW5ndWFnZSBvciBCZWF1dGlmaWVyIG5vdCBmb3VuZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiZWF1dGlmeUNvbXBsZXRlZCA9IHRydWUgaWYgdGV4dCBpcyBudWxsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QodHlwZW9mIHRleHQpLnRvRXF1YWwoXCJzdHJpbmdcIiwgXCJUZXh0OiAje3RleHR9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5Q29tcGxldGVkID0gdHJ1ZSBpZiB0eXBlb2YgdGV4dCBpc250IFwic3RyaW5nXCJcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUmVwbGFjZSBOZXdsaW5lc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxuKS9nLCAn4o+OXFxuJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZENvbnRlbnRzID0gZXhwZWN0ZWRDb250ZW50c1xcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG4pL2csICfij45cXG4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUmVwbGFjZSB0YWJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKD86XFx0KS9nLCAn4oa5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZENvbnRlbnRzID0gZXhwZWN0ZWRDb250ZW50c1xcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XFx0KS9nLCAn4oa5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFJlcGxhY2Ugc3BhY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKD86XFwgKS9nLCAn4pCjJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZENvbnRlbnRzID0gZXhwZWN0ZWRDb250ZW50c1xcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XFwgKS9nLCAn4pCjJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgQ2hlY2sgZm9yIGJlYXV0aWZpY2F0aW9uIGVycm9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIHRleHQgaXNudCBleHBlY3RlZENvbnRlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGNvbnNvbGUud2FybihhbGxPcHRpb25zLCB0ZXh0LCBleHBlY3RlZENvbnRlbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBleHBlY3RlZFRlc3RQYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRTdHI9dGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RyPWV4cGVjdGVkQ29udGVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEhlYWRlcj1cImJlYXV0aWZpZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SGVhZGVyPVwiZXhwZWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IEpzRGlmZi5jcmVhdGVQYXRjaChmaWxlTmFtZSwgb2xkU3RyLCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBHZXQgb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0Zvckxhbmd1YWdlKGFsbE9wdGlvbnMsIGxhbmd1YWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRCZWF1dGlmaWVyID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVyRm9yTGFuZ3VhZ2UobGFuZ3VhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBzZWxlY3RlZEJlYXV0aWZpZXI/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSBiZWF1dGlmaWVyLnRyYW5zZm9ybU9wdGlvbnMoc2VsZWN0ZWRCZWF1dGlmaWVyLCBsYW5ndWFnZS5uYW1lLCBvcHRzKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFNob3cgZXJyb3IgbWVzc2FnZSB3aXRoIGRlYnVnIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QodGV4dCkudG9FcXVhbChleHBlY3RlZENvbnRlbnRzLCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkJlYXV0aWZpZXIgJyN7c2VsZWN0ZWRCZWF1dGlmaWVyPy5uYW1lfScgb3V0cHV0IGRvZXMgbm90IG1hdGNoIGV4cGVjdGVkIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDpcXG4je2RpZmZ9XFxuXFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2l0aCBvcHRpb25zOlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICN7SlNPTi5zdHJpbmdpZnkob3B0cywgdW5kZWZpbmVkLCA0KX1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIEFsbCBkb25lIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXV0aWZ5Q29tcGxldGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXV0aWZ5Q29tcGxldGVkID0gZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkob3JpZ2luYWxDb250ZW50cywgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIHRlc3RGaWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjb21wbGV0aW9uRnVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChjb21wbGV0aW9uRnVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVhdXRpZnlDb21wbGV0ZWQgPSBlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdhaXRzRm9yKC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGJlYXV0aWZ5Q29tcGxldGVkIGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBiZWF1dGlmeUNvbXBsZXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5Q29tcGxldGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAsIFwiV2FpdGluZyBmb3IgYmVhdXRpZmljYXRpb24gdG8gY29tcGxldGVcIiwgNjAwMDApXG4iXX0=
