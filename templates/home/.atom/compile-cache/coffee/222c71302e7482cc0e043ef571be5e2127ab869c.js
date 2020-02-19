(function() {
  var Beautifiers, Handlebars, _, beautifier, beautifierName, beautifierNames, beautifierOptions, beautifiers, beautifiersMap, beautifyLanguageCommands, context, exampleConfig, executableOptions, fs, j, keywords, languageNames, languageOptions, languagesMap, len, linkifyTitle, lo, optionDef, optionGroup, optionGroupTemplate, optionGroupTemplatePath, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, path, pkg, readmePath, readmeResult, readmeTemplate, readmeTemplatePath, ref, ref1, result, sortKeysBy, sortSettings, template;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  _ = require('lodash');

  path = require('path');

  pkg = require('../package.json');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  executableOptions = languageOptions.executables;

  delete languageOptions.executables;

  packageOptions = require('../src/config.coffee');

  packageOptions.executables = executableOptions;

  beautifiersMap = _.keyBy(beautifier.beautifiers, 'name');

  languagesMap = _.keyBy(beautifier.languages.languages, 'name');

  beautifierOptions = {};

  for (lo in languageOptions) {
    optionGroup = languageOptions[lo];
    ref = optionGroup.properties;
    for (optionName in ref) {
      optionDef = ref[optionName];
      beautifiers = (ref1 = optionDef.beautifiers) != null ? ref1 : [];
      for (j = 0, len = beautifiers.length; j < len; j++) {
        beautifierName = beautifiers[j];
        if (beautifierOptions[beautifierName] == null) {
          beautifierOptions[beautifierName] = {};
        }
        beautifierOptions[beautifierName][optionName] = optionDef;
      }
    }
  }

  console.log('Loading options template...');

  readmeTemplatePath = path.resolve(__dirname, '../README-template.md');

  readmePath = path.resolve(__dirname, '../README.md');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionGroupTemplatePath = __dirname + '/option-group-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionGroupTemplate = fs.readFileSync(optionGroupTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  readmeTemplate = fs.readFileSync(readmeTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  Handlebars.registerPartial('option-group', optionGroupTemplate);

  template = Handlebars.compile(optionsTemplate);

  readmeTemplate = Handlebars.compile(readmeTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('language-beautifiers-support', function(languageOptions, options) {
    var results, rows;
    rows = _.chain(languageOptions).filter(function(val, k) {
      return k !== "executables";
    }).map(function(val, k) {
      var defaultBeautifier, extensions, grammars, name;
      name = val.title;
      defaultBeautifier = _.get(val, "properties.default_beautifier.default");
      beautifiers = _.chain(val.beautifiers).sortBy().sortBy(function(b) {
        var isDefault;
        beautifier = beautifiersMap[b];
        isDefault = b === defaultBeautifier;
        return !isDefault;
      }).map(function(b) {
        var isDefault, r;
        beautifier = beautifiersMap[b];
        isDefault = b === defaultBeautifier;
        if (beautifier.link) {
          r = "[`" + b + "`](" + beautifier.link + ")";
        } else {
          r = "`" + b + "`";
        }
        if (isDefault) {
          r = "**" + r + "**";
        }
        return r;
      }).value();
      grammars = _.map(val.grammars, function(b) {
        return "`" + b + "`";
      });
      extensions = _.map(val.extensions, function(b) {
        return "`." + b + "`";
      });
      return "| " + name + " | " + (grammars.join(', ')) + " |" + (extensions.join(', ')) + " | " + (beautifiers.join(', ')) + " |";
    }).value();
    results = "| Language | Grammars | File Extensions | Supported Beautifiers |\n| --- | --- | --- | ---- |\n" + (rows.join('\n'));
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('language-options-support', function(languageOptions, options) {

    /*
    | Option | PrettyDiff | JS-Beautify |
    | --- | --- | --- |
    | `brace_style` | ? | ? |
    | `break_chained_methods` | ? | ? |
    | `end_with_comma` | ? | ? |
    | `end_with_newline` | ? | ? |
    | `eval_code` | ? | ? |
    | `indent_size` | :white_check_mark: | :white_check_mark: |
    | `indent_char` | :white_check_mark: | :white_check_mark: |
     */
    var headers, results, rows;
    rows = [];
    beautifiers = languageOptions.beautifiers.sort();
    headers = ['Option'].concat(beautifiers);
    rows.push(headers);
    rows.push(_.map(headers, function() {
      return '---';
    }));
    _.each(Object.keys(languageOptions.properties), function(op) {
      var field, support;
      field = languageOptions.properties[op];
      support = _.map(beautifiers, function(b) {
        if (_.includes(field.beautifiers, b) || _.includes(["disabled", "default_beautifier", "beautify_on_save"], op)) {
          return ':white_check_mark:';
        } else {
          return ':x:';
        }
      });
      return rows.push(["`" + op + "`"].concat(support));
    });
    results = _.map(rows, function(r) {
      return "| " + (r.join(' | ')) + " |";
    }).join('\n');
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('beautifiers-info', function(beautifiers, options) {

    /*
    | Beautifier | Preinstalled? | Installation Instructions |
    | --- | ---- |
    | Pretty Diff | :white_check_mark: | N/A |
    | AutoPEP8 | :x: | LINK |
     */
    var results, rows;
    rows = _.map(beautifiers, function(beautifier, k) {
      var dockerCell, dockerExecutables, executables, hasDockerExecutables, hasExecutables, installWithDocker, installationInstructions, isPreInstalled, link, name, preinstalledCell;
      name = beautifier.name;
      isPreInstalled = beautifier.isPreInstalled;
      if (typeof isPreInstalled === "function") {
        isPreInstalled = beautifier.isPreInstalled();
      }
      link = beautifier.link;
      executables = beautifier.executables || [];
      hasExecutables = executables.length > 0;
      dockerExecutables = executables.filter(function(exe) {
        return !!exe.docker;
      });
      hasDockerExecutables = dockerExecutables.length > 0;
      installWithDocker = dockerExecutables.map(function(d) {
        return "- " + d.docker.image;
      }).join('\n');
      preinstalledCell = (function() {
        if (isPreInstalled) {
          return ":white_check_mark:";
        } else {
          if (executables.length > 0) {
            return ":warning: " + executables.length + " executable" + (executables.length === 1 ? '' : 's');
          } else {
            return ":warning: Manual installation";
          }
        }
      })();
      dockerCell = (function() {
        if (isPreInstalled) {
          return ":ok_hand: Not necessary";
        } else {
          if (hasExecutables) {
            if (dockerExecutables.length === executables.length) {
              return ":white_check_mark: :100:% of executables";
            } else if (dockerExecutables.length > 0) {
              return ":warning: Only " + dockerExecutables.length + " of " + executables.length + " executables";
            } else {
              return ":x: No Docker support";
            }
          } else {
            return ":construction: Not an executable";
          }
        }
      })();
      installationInstructions = (function() {
        var executablesInstallation;
        if (isPreInstalled) {
          return ":smiley: Nothing!";
        } else {
          if (hasExecutables) {
            executablesInstallation = "";
            if (hasDockerExecutables) {
              executablesInstallation += ":whale: With [Docker](https://www.docker.com/):<br/>";
              dockerExecutables.forEach(function(e, i) {
                return executablesInstallation += (i + 1) + ". Install [" + (e.name || e.cmd) + " (`" + e.cmd + "`)](" + e.homepage + ") with `docker pull " + e.docker.image + "`<br/>";
              });
              executablesInstallation += "<br/>";
            }
            executablesInstallation += ":bookmark_tabs: Manually:<br/>";
            executables.forEach(function(e, i) {
              return executablesInstallation += (i + 1) + ". Install [" + (e.name || e.cmd) + " (`" + e.cmd + "`)](" + e.homepage + ") by following " + e.installation + "<br/>";
            });
            return executablesInstallation;
          } else {
            return ":page_facing_up: Go to " + link + " and follow the instructions.";
          }
        }
      })();
      return "| " + name + " | " + preinstalledCell + " | " + dockerCell + " | " + installationInstructions + " |";
    });
    results = "| Beautifier | Preinstalled | [:whale: Docker](https://www.docker.com/) | Installation |\n| --- | --- | --- |--- |\n" + (rows.join('\n'));
    return new Handlebars.SafeString(results);
  });

  sortKeysBy = function(obj, comparator) {
    var keys;
    keys = _.sortBy(_.keys(obj), function(key) {
      if (comparator) {
        return comparator(obj[key], key);
      } else {
        return key;
      }
    });
    return _.zipObject(keys, _.map(keys, function(key) {
      return obj[key];
    }));
  };

  sortSettings = function(settings) {
    var r;
    r = _.mapValues(settings, function(op) {
      if (op.type === "object" && op.properties) {
        op.properties = sortSettings(op.properties);
      }
      return op;
    });
    r = sortKeysBy(sortKeysBy(r), function(op) {
      return op.order;
    });
    return r;
  };

  context = {
    "package": pkg,
    packageOptions: sortSettings(packageOptions),
    languageOptions: sortSettings(languageOptions),
    beautifierOptions: sortSettings(beautifierOptions),
    beautifiers: _.sortBy(beautifier.beautifiers, function(beautifier) {
      return beautifier.name.toLowerCase();
    })
  };

  result = template(context);

  readmeResult = readmeTemplate(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  fs.writeFileSync(readmePath, readmeResult);

  console.log('Updating package.json');

  languageNames = _.map(Object.keys(languagesMap), function(a) {
    return a.toLowerCase();
  });

  beautifierNames = _.map(Object.keys(beautifiersMap), function(a) {
    return a.toLowerCase();
  });

  keywords = _.union(pkg.keywords, languageNames, beautifierNames);

  pkg.keywords = keywords;

  beautifyLanguageCommands = _.map(languageNames, function(languageName) {
    return "atom-beautify:beautify-language-" + languageName;
  });

  pkg.activationCommands["atom-workspace"] = _.union(pkg.activationCommands["atom-workspace"], beautifyLanguageCommands);

  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg, void 0, 2));

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9kb2NzL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtBQUFBLE1BQUE7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztFQUNiLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVI7O0VBQ2QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUjs7RUFFTixPQUFPLENBQUMsR0FBUixDQUFZLHVCQUFaOztFQUNBLFVBQUEsR0FBYSxJQUFJLFdBQUosQ0FBQTs7RUFDYixlQUFBLEdBQWtCLFVBQVUsQ0FBQzs7RUFDN0IsaUJBQUEsR0FBb0IsZUFBZSxDQUFDOztFQUNwQyxPQUFPLGVBQWUsQ0FBQzs7RUFDdkIsY0FBQSxHQUFpQixPQUFBLENBQVEsc0JBQVI7O0VBQ2pCLGNBQWMsQ0FBQyxXQUFmLEdBQTZCOztFQUU3QixjQUFBLEdBQWlCLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBVSxDQUFDLFdBQW5CLEVBQWdDLE1BQWhDOztFQUNqQixZQUFBLEdBQWUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQTdCLEVBQXdDLE1BQXhDOztFQUNmLGlCQUFBLEdBQW9COztBQUNwQixPQUFBLHFCQUFBOztBQUNFO0FBQUEsU0FBQSxpQkFBQTs7TUFDRSxXQUFBLG1EQUFzQztBQUN0QyxXQUFBLDZDQUFBOzs7VUFDRSxpQkFBa0IsQ0FBQSxjQUFBLElBQW1COztRQUNyQyxpQkFBa0IsQ0FBQSxjQUFBLENBQWdCLENBQUEsVUFBQSxDQUFsQyxHQUFnRDtBQUZsRDtBQUZGO0FBREY7O0VBT0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2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a0NBQUEsR0FBbUM7RUFBckQsQ0FBckI7O0VBQzNCLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQSxnQkFBQSxDQUF2QixHQUEyQyxDQUFDLENBQUMsS0FBRixDQUFRLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQSxnQkFBQSxDQUEvQixFQUFrRCx3QkFBbEQ7O0VBRTNDLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF1QixpQkFBdkIsQ0FBakIsRUFBNEQsSUFBSSxDQUFDLFNBQUwsQ0FBZSxHQUFmLEVBQW9CLE1BQXBCLEVBQStCLENBQS9CLENBQTVEOztFQUVBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWjtBQTNSQSIsInNvdXJjZXNDb250ZW50IjpbIlxuIyEvdXNyL2Jpbi9lbnYgY29mZmVlXG5cbiMgRGVwZW5kZW5jaWVzXG5IYW5kbGViYXJzID0gcmVxdWlyZSgnaGFuZGxlYmFycycpXG5CZWF1dGlmaWVycyA9IHJlcXVpcmUoXCIuLi9zcmMvYmVhdXRpZmllcnNcIilcbmZzID0gcmVxdWlyZSgnZnMnKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5wa2cgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKVxuXG5jb25zb2xlLmxvZygnR2VuZXJhdGluZyBvcHRpb25zLi4uJylcbmJlYXV0aWZpZXIgPSBuZXcgQmVhdXRpZmllcnMoKVxubGFuZ3VhZ2VPcHRpb25zID0gYmVhdXRpZmllci5vcHRpb25zXG5leGVjdXRhYmxlT3B0aW9ucyA9IGxhbmd1YWdlT3B0aW9ucy5leGVjdXRhYmxlc1xuZGVsZXRlIGxhbmd1YWdlT3B0aW9ucy5leGVjdXRhYmxlc1xucGFja2FnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi9zcmMvY29uZmlnLmNvZmZlZScpXG5wYWNrYWdlT3B0aW9ucy5leGVjdXRhYmxlcyA9IGV4ZWN1dGFibGVPcHRpb25zXG4jIEJ1aWxkIG9wdGlvbnMgYnkgQmVhdXRpZmllclxuYmVhdXRpZmllcnNNYXAgPSBfLmtleUJ5KGJlYXV0aWZpZXIuYmVhdXRpZmllcnMsICduYW1lJylcbmxhbmd1YWdlc01hcCA9IF8ua2V5QnkoYmVhdXRpZmllci5sYW5ndWFnZXMubGFuZ3VhZ2VzLCAnbmFtZScpXG5iZWF1dGlmaWVyT3B0aW9ucyA9IHt9XG5mb3IgbG8sIG9wdGlvbkdyb3VwIG9mIGxhbmd1YWdlT3B0aW9uc1xuICBmb3Igb3B0aW9uTmFtZSwgb3B0aW9uRGVmIG9mIG9wdGlvbkdyb3VwLnByb3BlcnRpZXNcbiAgICBiZWF1dGlmaWVycyA9IG9wdGlvbkRlZi5iZWF1dGlmaWVycyA/IFtdXG4gICAgZm9yIGJlYXV0aWZpZXJOYW1lIGluIGJlYXV0aWZpZXJzXG4gICAgICBiZWF1dGlmaWVyT3B0aW9uc1tiZWF1dGlmaWVyTmFtZV0gPz0ge31cbiAgICAgIGJlYXV0aWZpZXJPcHRpb25zW2JlYXV0aWZpZXJOYW1lXVtvcHRpb25OYW1lXSA9IG9wdGlvbkRlZlxuXG5jb25zb2xlLmxvZygnTG9hZGluZyBvcHRpb25zIHRlbXBsYXRlLi4uJylcbnJlYWRtZVRlbXBsYXRlUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9SRUFETUUtdGVtcGxhdGUubWQnKVxucmVhZG1lUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9SRUFETUUubWQnKVxub3B0aW9uc1RlbXBsYXRlUGF0aCA9IF9fZGlybmFtZSArICcvb3B0aW9ucy10ZW1wbGF0ZS5tZCdcbm9wdGlvblRlbXBsYXRlUGF0aCA9IF9fZGlybmFtZSArICcvb3B0aW9uLXRlbXBsYXRlLm1kJ1xub3B0aW9uR3JvdXBUZW1wbGF0ZVBhdGggPSBfX2Rpcm5hbWUgKyAnL29wdGlvbi1ncm91cC10ZW1wbGF0ZS5tZCdcbm9wdGlvbnNQYXRoID0gX19kaXJuYW1lICsgJy9vcHRpb25zLm1kJ1xuXG5vcHRpb25zVGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMob3B0aW9uc1RlbXBsYXRlUGF0aCkudG9TdHJpbmcoKVxub3B0aW9uR3JvdXBUZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhvcHRpb25Hcm91cFRlbXBsYXRlUGF0aCkudG9TdHJpbmcoKVxub3B0aW9uVGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMob3B0aW9uVGVtcGxhdGVQYXRoKS50b1N0cmluZygpXG5yZWFkbWVUZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhyZWFkbWVUZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKClcblxuY29uc29sZS5sb2coJ0J1aWxkaW5nIGRvY3VtZW50YXRpb24gZnJvbSB0ZW1wbGF0ZSBhbmQgb3B0aW9ucy4uLicpXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCgnb3B0aW9uJywgb3B0aW9uVGVtcGxhdGUpXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCgnb3B0aW9uLWdyb3VwJywgb3B0aW9uR3JvdXBUZW1wbGF0ZSlcbnRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKG9wdGlvbnNUZW1wbGF0ZSlcbnJlYWRtZVRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHJlYWRtZVRlbXBsYXRlKVxuXG5saW5raWZ5VGl0bGUgPSAodGl0bGUpIC0+XG4gIHRpdGxlID0gdGl0bGUudG9Mb3dlckNhc2UoKVxuICBwID0gdGl0bGUuc3BsaXQoL1tcXHMsKyM7LFxcLz86QCY9KyRdKy8pICMgc3BsaXQgaW50byBwYXJ0c1xuICBzZXAgPSBcIi1cIlxuICBwLmpvaW4oc2VwKVxuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdsaW5raWZ5JywgKHRpdGxlLCBvcHRpb25zKSAtPlxuICByZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyhcbiAgICBcIlsje29wdGlvbnMuZm4odGhpcyl9XShcXCMje2xpbmtpZnlUaXRsZSh0aXRsZSl9KVwiXG4gIClcbilcblxuZXhhbXBsZUNvbmZpZyA9IChvcHRpb24pIC0+XG4gICMgY29uc29sZS5sb2cob3B0aW9uKVxuICB0ID0gb3B0aW9uLnR5cGVcbiAgZCA9IHN3aXRjaFxuICAgIHdoZW4gb3B0aW9uLmRlZmF1bHQ/IHRoZW4gb3B0aW9uLmRlZmF1bHRcbiAgICB3aGVuIHQgaXMgXCJzdHJpbmdcIiB0aGVuIFwiXCJcbiAgICB3aGVuIHQgaXMgXCJpbnRlZ2VyXCIgdGhlbiAwXG4gICAgd2hlbiB0IGlzIFwiYm9vbGVhblwiIHRoZW4gZmFsc2VcbiAgICBlbHNlIG51bGxcblxuICBqc29uID0ge31cbiAgbmFtZXNwYWNlID0gb3B0aW9uLmxhbmd1YWdlLm5hbWVzcGFjZVxuICBrID0gb3B0aW9uLmtleVxuICBjID0ge31cbiAgY1trXSA9IGRcbiAganNvbltuYW1lc3BhY2VdID0gY1xuICByZXR1cm4gXCJcIlwiYGBganNvblxuICAje0pTT04uc3RyaW5naWZ5KGpzb24sIHVuZGVmaW5lZCwgNCl9XG4gIGBgYFwiXCJcIlxuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdleGFtcGxlLWNvbmZpZycsIChrZXksIG9wdGlvbiwgb3B0aW9ucykgLT5cbiAgcmVzdWx0cyA9IGV4YW1wbGVDb25maWcoa2V5LCBvcHRpb24pXG4gICMgY29uc29sZS5sb2cocmVzdWx0cylcbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcocmVzdWx0cylcbilcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbGFuZ3VhZ2UtYmVhdXRpZmllcnMtc3VwcG9ydCcsIChsYW5ndWFnZU9wdGlvbnMsIG9wdGlvbnMpIC0+XG5cbiAgcm93cyA9IF8uY2hhaW4obGFuZ3VhZ2VPcHRpb25zKVxuICAgIC5maWx0ZXIoKHZhbCwgaykgLT4gayBpc250IFwiZXhlY3V0YWJsZXNcIilcbiAgICAubWFwKCh2YWwsIGspIC0+XG4gICAgICBuYW1lID0gdmFsLnRpdGxlXG4gICAgICBkZWZhdWx0QmVhdXRpZmllciA9IF8uZ2V0KHZhbCwgXCJwcm9wZXJ0aWVzLmRlZmF1bHRfYmVhdXRpZmllci5kZWZhdWx0XCIpXG4gICAgICBiZWF1dGlmaWVycyA9IF8uY2hhaW4odmFsLmJlYXV0aWZpZXJzKVxuICAgICAgICAuc29ydEJ5KClcbiAgICAgICAgLnNvcnRCeSgoYikgLT5cbiAgICAgICAgICBiZWF1dGlmaWVyID0gYmVhdXRpZmllcnNNYXBbYl1cbiAgICAgICAgICBpc0RlZmF1bHQgPSBiIGlzIGRlZmF1bHRCZWF1dGlmaWVyXG4gICAgICAgICAgcmV0dXJuICFpc0RlZmF1bHRcbiAgICAgICAgKVxuICAgICAgICAubWFwKChiKSAtPlxuICAgICAgICAgIGJlYXV0aWZpZXIgPSBiZWF1dGlmaWVyc01hcFtiXVxuICAgICAgICAgIGlzRGVmYXVsdCA9IGIgaXMgZGVmYXVsdEJlYXV0aWZpZXJcbiAgICAgICAgICBpZiBiZWF1dGlmaWVyLmxpbmtcbiAgICAgICAgICAgIHIgPSBcIltgI3tifWBdKCN7YmVhdXRpZmllci5saW5rfSlcIlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHIgPSBcImAje2J9YFwiXG4gICAgICAgICAgaWYgaXNEZWZhdWx0XG4gICAgICAgICAgICByID0gXCIqKiN7cn0qKlwiXG4gICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgKVxuICAgICAgICAudmFsdWUoKVxuICAgICAgZ3JhbW1hcnMgPSBfLm1hcCh2YWwuZ3JhbW1hcnMsIChiKSAtPiBcImAje2J9YFwiKVxuICAgICAgZXh0ZW5zaW9ucyA9IF8ubWFwKHZhbC5leHRlbnNpb25zLCAoYikgLT4gXCJgLiN7Yn1gXCIpXG5cbiAgICAgIHJldHVybiBcInwgI3tuYW1lfSB8ICN7Z3JhbW1hcnMuam9pbignLCAnKX0gfCN7ZXh0ZW5zaW9ucy5qb2luKCcsICcpfSB8ICN7YmVhdXRpZmllcnMuam9pbignLCAnKX0gfFwiXG4gICAgKVxuICAgIC52YWx1ZSgpXG4gIHJlc3VsdHMgPSBcIlwiXCJcbiAgfCBMYW5ndWFnZSB8IEdyYW1tYXJzIHwgRmlsZSBFeHRlbnNpb25zIHwgU3VwcG9ydGVkIEJlYXV0aWZpZXJzIHxcbiAgfCAtLS0gfCAtLS0gfCAtLS0gfCAtLS0tIHxcbiAgI3tyb3dzLmpvaW4oJ1xcbicpfVxuICBcIlwiXCJcbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcocmVzdWx0cylcbilcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbGFuZ3VhZ2Utb3B0aW9ucy1zdXBwb3J0JywgKGxhbmd1YWdlT3B0aW9ucywgb3B0aW9ucykgLT5cblxuICAjIyNcbiAgfCBPcHRpb24gfCBQcmV0dHlEaWZmIHwgSlMtQmVhdXRpZnkgfFxuICB8IC0tLSB8IC0tLSB8IC0tLSB8XG4gIHwgYGJyYWNlX3N0eWxlYCB8ID8gfCA/IHxcbiAgfCBgYnJlYWtfY2hhaW5lZF9tZXRob2RzYCB8ID8gfCA/IHxcbiAgfCBgZW5kX3dpdGhfY29tbWFgIHwgPyB8ID8gfFxuICB8IGBlbmRfd2l0aF9uZXdsaW5lYCB8ID8gfCA/IHxcbiAgfCBgZXZhbF9jb2RlYCB8ID8gfCA/IHxcbiAgfCBgaW5kZW50X3NpemVgIHwgOndoaXRlX2NoZWNrX21hcms6IHwgOndoaXRlX2NoZWNrX21hcms6IHxcbiAgfCBgaW5kZW50X2NoYXJgIHwgOndoaXRlX2NoZWNrX21hcms6IHwgOndoaXRlX2NoZWNrX21hcms6IHxcbiAgIyMjXG5cbiAgcm93cyA9IFtdXG4gIGJlYXV0aWZpZXJzID0gbGFuZ3VhZ2VPcHRpb25zLmJlYXV0aWZpZXJzLnNvcnQoKVxuICBoZWFkZXJzID0gWydPcHRpb24nXS5jb25jYXQoYmVhdXRpZmllcnMpXG4gIHJvd3MucHVzaChoZWFkZXJzKVxuICByb3dzLnB1c2goXy5tYXAoaGVhZGVycywgKCkgLT4gJy0tLScpKVxuICAjIGNvbnNvbGUubG9nKGxhbmd1YWdlT3B0aW9ucylcbiAgXy5lYWNoKE9iamVjdC5rZXlzKGxhbmd1YWdlT3B0aW9ucy5wcm9wZXJ0aWVzKSwgKG9wKSAtPlxuICAgIGZpZWxkID0gbGFuZ3VhZ2VPcHRpb25zLnByb3BlcnRpZXNbb3BdXG4gICAgc3VwcG9ydCA9IF8ubWFwKGJlYXV0aWZpZXJzLCAoYikgLT5cbiAgICAgIGlmIChfLmluY2x1ZGVzKGZpZWxkLmJlYXV0aWZpZXJzLCBiKSBvciBfLmluY2x1ZGVzKFtcImRpc2FibGVkXCIsIFwiZGVmYXVsdF9iZWF1dGlmaWVyXCIsIFwiYmVhdXRpZnlfb25fc2F2ZVwiXSwgb3ApKVxuICAgICAgICByZXR1cm4gJzp3aGl0ZV9jaGVja19tYXJrOidcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICc6eDonXG4gICAgKVxuICAgIHJvd3MucHVzaChbXCJgI3tvcH1gXCJdLmNvbmNhdChzdXBwb3J0KSlcbiAgKVxuXG4gIHJlc3VsdHMgPSBfLm1hcChyb3dzLCAocikgLT4gXCJ8ICN7ci5qb2luKCcgfCAnKX0gfFwiKS5qb2luKCdcXG4nKVxuICByZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyhyZXN1bHRzKVxuKVxuXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2JlYXV0aWZpZXJzLWluZm8nLCAoYmVhdXRpZmllcnMsIG9wdGlvbnMpIC0+XG5cbiAgIyMjXG4gIHwgQmVhdXRpZmllciB8IFByZWluc3RhbGxlZD8gfCBJbnN0YWxsYXRpb24gSW5zdHJ1Y3Rpb25zIHxcbiAgfCAtLS0gfCAtLS0tIHxcbiAgfCBQcmV0dHkgRGlmZiB8IDp3aGl0ZV9jaGVja19tYXJrOiB8IE4vQSB8XG4gIHwgQXV0b1BFUDggfCA6eDogfCBMSU5LIHxcbiAgIyMjXG5cbiAgcm93cyA9IF8ubWFwKGJlYXV0aWZpZXJzLCAoYmVhdXRpZmllciwgaykgLT5cbiAgICBuYW1lID0gYmVhdXRpZmllci5uYW1lXG4gICAgaXNQcmVJbnN0YWxsZWQgPSBiZWF1dGlmaWVyLmlzUHJlSW5zdGFsbGVkXG4gICAgaWYgdHlwZW9mIGlzUHJlSW5zdGFsbGVkIGlzIFwiZnVuY3Rpb25cIlxuICAgICAgaXNQcmVJbnN0YWxsZWQgPSBiZWF1dGlmaWVyLmlzUHJlSW5zdGFsbGVkKClcbiAgICBsaW5rID0gYmVhdXRpZmllci5saW5rXG4gICAgZXhlY3V0YWJsZXMgPSBiZWF1dGlmaWVyLmV4ZWN1dGFibGVzIG9yIFtdXG4gICAgaGFzRXhlY3V0YWJsZXMgPSBleGVjdXRhYmxlcy5sZW5ndGggPiAwXG4gICAgZG9ja2VyRXhlY3V0YWJsZXMgPSBleGVjdXRhYmxlcy5maWx0ZXIoKGV4ZSkgLT4gISFleGUuZG9ja2VyKVxuICAgIGhhc0RvY2tlckV4ZWN1dGFibGVzID0gZG9ja2VyRXhlY3V0YWJsZXMubGVuZ3RoID4gMFxuICAgIGluc3RhbGxXaXRoRG9ja2VyID0gZG9ja2VyRXhlY3V0YWJsZXMubWFwKChkKSAtPiBcIi0gI3tkLmRvY2tlci5pbWFnZX1cIikuam9pbignXFxuJylcblxuICAgIHByZWluc3RhbGxlZENlbGwgPSBkbyAoKCkgLT5cbiAgICAgIGlmIGlzUHJlSW5zdGFsbGVkXG4gICAgICAgIFwiOndoaXRlX2NoZWNrX21hcms6XCJcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgZXhlY3V0YWJsZXMubGVuZ3RoID4gMFxuICAgICAgICAgIFwiOndhcm5pbmc6ICN7ZXhlY3V0YWJsZXMubGVuZ3RofSBleGVjdXRhYmxlI3tpZiBleGVjdXRhYmxlcy5sZW5ndGggaXMgMSB0aGVuICcnIGVsc2UgJ3MnfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBcIjp3YXJuaW5nOiBNYW51YWwgaW5zdGFsbGF0aW9uXCJcbiAgICApXG4gICAgZG9ja2VyQ2VsbCA9IGRvICgoKSAtPlxuICAgICAgaWYgaXNQcmVJbnN0YWxsZWRcbiAgICAgICAgXCI6b2tfaGFuZDogTm90IG5lY2Vzc2FyeVwiXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGhhc0V4ZWN1dGFibGVzXG4gICAgICAgICAgaWYgZG9ja2VyRXhlY3V0YWJsZXMubGVuZ3RoIGlzIGV4ZWN1dGFibGVzLmxlbmd0aFxuICAgICAgICAgICAgXCI6d2hpdGVfY2hlY2tfbWFyazogOjEwMDolIG9mIGV4ZWN1dGFibGVzXCJcbiAgICAgICAgICBlbHNlIGlmIGRvY2tlckV4ZWN1dGFibGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIFwiOndhcm5pbmc6IE9ubHkgI3tkb2NrZXJFeGVjdXRhYmxlcy5sZW5ndGh9IG9mICN7ZXhlY3V0YWJsZXMubGVuZ3RofSBleGVjdXRhYmxlc1wiXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgXCI6eDogTm8gRG9ja2VyIHN1cHBvcnRcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgXCI6Y29uc3RydWN0aW9uOiBOb3QgYW4gZXhlY3V0YWJsZVwiXG4gICAgKVxuICAgIGluc3RhbGxhdGlvbkluc3RydWN0aW9ucyA9IGRvICgoKSAtPlxuICAgICAgaWYgaXNQcmVJbnN0YWxsZWRcbiAgICAgICAgXCI6c21pbGV5OiBOb3RoaW5nIVwiXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGhhc0V4ZWN1dGFibGVzXG4gICAgICAgICAgZXhlY3V0YWJsZXNJbnN0YWxsYXRpb24gPSBcIlwiXG4gICAgICAgICAgaWYgaGFzRG9ja2VyRXhlY3V0YWJsZXNcbiAgICAgICAgICAgIGV4ZWN1dGFibGVzSW5zdGFsbGF0aW9uICs9IFwiOndoYWxlOiBXaXRoIFtEb2NrZXJdKGh0dHBzOi8vd3d3LmRvY2tlci5jb20vKTo8YnIvPlwiXG4gICAgICAgICAgICBkb2NrZXJFeGVjdXRhYmxlcy5mb3JFYWNoKChlLCBpKSAtPlxuICAgICAgICAgICAgICBleGVjdXRhYmxlc0luc3RhbGxhdGlvbiArPSBcIiN7aSsxfS4gSW5zdGFsbCBbI3tlLm5hbWUgb3IgZS5jbWR9IChgI3tlLmNtZH1gKV0oI3tlLmhvbWVwYWdlfSkgd2l0aCBgZG9ja2VyIHB1bGwgI3tlLmRvY2tlci5pbWFnZX1gPGJyLz5cIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgZXhlY3V0YWJsZXNJbnN0YWxsYXRpb24gKz0gXCI8YnIvPlwiXG4gICAgICAgICAgZXhlY3V0YWJsZXNJbnN0YWxsYXRpb24gKz0gXCI6Ym9va21hcmtfdGFiczogTWFudWFsbHk6PGJyLz5cIlxuICAgICAgICAgIGV4ZWN1dGFibGVzLmZvckVhY2goKGUsIGkpIC0+XG4gICAgICAgICAgICBleGVjdXRhYmxlc0luc3RhbGxhdGlvbiArPSBcIiN7aSsxfS4gSW5zdGFsbCBbI3tlLm5hbWUgb3IgZS5jbWR9IChgI3tlLmNtZH1gKV0oI3tlLmhvbWVwYWdlfSkgYnkgZm9sbG93aW5nICN7ZS5pbnN0YWxsYXRpb259PGJyLz5cIlxuICAgICAgICAgIClcbiAgICAgICAgICByZXR1cm4gZXhlY3V0YWJsZXNJbnN0YWxsYXRpb25cbiAgICAgICAgZWxzZVxuICAgICAgICAgIFwiOnBhZ2VfZmFjaW5nX3VwOiBHbyB0byAje2xpbmt9IGFuZCBmb2xsb3cgdGhlIGluc3RydWN0aW9ucy5cIlxuICAgIClcbiAgICByZXR1cm4gXCJ8ICN7bmFtZX0gfCAje3ByZWluc3RhbGxlZENlbGx9IHwgI3tkb2NrZXJDZWxsfSB8ICN7aW5zdGFsbGF0aW9uSW5zdHJ1Y3Rpb25zfSB8XCJcbiAgKVxuICByZXN1bHRzID0gXCJcIlwiXG4gIHwgQmVhdXRpZmllciB8IFByZWluc3RhbGxlZCB8IFs6d2hhbGU6IERvY2tlcl0oaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS8pIHwgSW5zdGFsbGF0aW9uIHxcbiAgfCAtLS0gfCAtLS0gfCAtLS0gfC0tLSB8XG4gICN7cm93cy5qb2luKCdcXG4nKX1cbiAgXCJcIlwiXG4gIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKHJlc3VsdHMpXG4pXG5cbnNvcnRLZXlzQnkgPSAob2JqLCBjb21wYXJhdG9yKSAtPlxuICBrZXlzID0gXy5zb3J0QnkoXy5rZXlzKG9iaiksIChrZXkpIC0+XG4gICAgcmV0dXJuIGlmIGNvbXBhcmF0b3IgdGhlbiBjb21wYXJhdG9yKG9ialtrZXldLCBrZXkpIGVsc2Uga2V5XG4gIClcbiAgcmV0dXJuIF8uemlwT2JqZWN0KGtleXMsIF8ubWFwKGtleXMsIChrZXkpIC0+XG4gICAgcmV0dXJuIG9ialtrZXldXG4gICkpXG5cbnNvcnRTZXR0aW5ncyA9IChzZXR0aW5ncykgLT5cbiAgIyBUT0RPOiBQcm9jZXNzIG9iamVjdCB0eXBlIG9wdGlvbnNcbiAgciA9IF8ubWFwVmFsdWVzKHNldHRpbmdzLCAob3ApIC0+XG4gICAgaWYgb3AudHlwZSBpcyBcIm9iamVjdFwiIGFuZCBvcC5wcm9wZXJ0aWVzXG4gICAgICBvcC5wcm9wZXJ0aWVzID0gc29ydFNldHRpbmdzKG9wLnByb3BlcnRpZXMpXG4gICAgcmV0dXJuIG9wXG4gIClcbiAgIyBQcm9jZXNzIHRoZXNlIHNldHRpbmdzXG4gIHIgPSBzb3J0S2V5c0J5KHNvcnRLZXlzQnkociksIChvcCkgLT4gb3Aub3JkZXIpXG4gICMgciA9IF8uY2hhaW4ocikuc29ydEJ5KChvcCkgLT4gb3Aua2V5KS5zb3J0QnkoKG9wKSAtPiBzZXR0aW5nc1tvcC5rZXldPy5vcmRlcikudmFsdWUoKVxuICAjIGNvbnNvbGUubG9nKCdzb3J0Jywgc2V0dGluZ3MsIHIpXG4gIHJldHVybiByXG5cbmNvbnRleHQgPSB7XG4gIHBhY2thZ2U6IHBrZyxcbiAgcGFja2FnZU9wdGlvbnM6IHNvcnRTZXR0aW5ncyhwYWNrYWdlT3B0aW9ucylcbiAgbGFuZ3VhZ2VPcHRpb25zOiBzb3J0U2V0dGluZ3MobGFuZ3VhZ2VPcHRpb25zKVxuICBiZWF1dGlmaWVyT3B0aW9uczogc29ydFNldHRpbmdzKGJlYXV0aWZpZXJPcHRpb25zKVxuICBiZWF1dGlmaWVyczogXy5zb3J0QnkoYmVhdXRpZmllci5iZWF1dGlmaWVycywgKGJlYXV0aWZpZXIpIC0+IGJlYXV0aWZpZXIubmFtZS50b0xvd2VyQ2FzZSgpKVxufVxucmVzdWx0ID0gdGVtcGxhdGUoY29udGV4dClcbnJlYWRtZVJlc3VsdCA9IHJlYWRtZVRlbXBsYXRlKGNvbnRleHQpXG5cbmNvbnNvbGUubG9nKCdXcml0aW5nIGRvY3VtZW50YXRpb24gdG8gZmlsZS4uLicpXG5mcy53cml0ZUZpbGVTeW5jKG9wdGlvbnNQYXRoLCByZXN1bHQpXG5mcy53cml0ZUZpbGVTeW5jKHJlYWRtZVBhdGgsIHJlYWRtZVJlc3VsdClcbiMgZnMud3JpdGVGaWxlU3luYyhfX2Rpcm5hbWUrJy9jb250ZXh0Lmpzb24nLCBKU09OLnN0cmluZ2lmeShjb250ZXh0LCB1bmRlZmluZWQsIDIpKVxuXG5jb25zb2xlLmxvZygnVXBkYXRpbmcgcGFja2FnZS5qc29uJylcbiMgQWRkIExhbmd1YWdlIGtleXdvcmRzXG5sYW5ndWFnZU5hbWVzID0gXy5tYXAoT2JqZWN0LmtleXMobGFuZ3VhZ2VzTWFwKSwgKGEpLT5hLnRvTG93ZXJDYXNlKCkpXG5cbiMgQWRkIEJlYXV0aWZpZXIga2V5d29yZHNcbmJlYXV0aWZpZXJOYW1lcyA9IF8ubWFwKE9iamVjdC5rZXlzKGJlYXV0aWZpZXJzTWFwKSwgKGEpLT5hLnRvTG93ZXJDYXNlKCkpXG5rZXl3b3JkcyA9IF8udW5pb24ocGtnLmtleXdvcmRzLCBsYW5ndWFnZU5hbWVzLCBiZWF1dGlmaWVyTmFtZXMpXG5wa2cua2V5d29yZHMgPSBrZXl3b3Jkc1xuXG4jIEFkZCBMYW5ndWFnZS1zcGVjaWZpYyBiZWF1dGlmeSBjb21tYW5kc1xuYmVhdXRpZnlMYW5ndWFnZUNvbW1hbmRzID0gXy5tYXAobGFuZ3VhZ2VOYW1lcywgKGxhbmd1YWdlTmFtZSkgLT4gXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWxhbmd1YWdlLSN7bGFuZ3VhZ2VOYW1lfVwiKVxucGtnLmFjdGl2YXRpb25Db21tYW5kc1tcImF0b20td29ya3NwYWNlXCJdID0gXy51bmlvbihwa2cuYWN0aXZhdGlvbkNvbW1hbmRzW1wiYXRvbS13b3Jrc3BhY2VcIl0sIGJlYXV0aWZ5TGFuZ3VhZ2VDb21tYW5kcylcblxuZnMud3JpdGVGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCcuLi9wYWNrYWdlLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkocGtnLCB1bmRlZmluZWQsIDIpKVxuXG5jb25zb2xlLmxvZygnRG9uZS4nKVxuIl19
