(function() {
  var Beautifier, Executable, PHPCSFixer, isWindows, path;

  PHPCSFixer = require("../src/beautifiers/php-cs-fixer");

  Beautifier = require("../src/beautifiers/beautifier");

  Executable = require("../src/beautifiers/executable");

  path = require('path');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("PHP-CS-Fixer Beautifier", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        atom.config.set('atom-beautify.general.loggerLevel', 'info');
        return activationPromise;
      });
    });
    return describe("Beautifier::beautify", function() {
      var OSSpecificSpecs, beautifier, execSpawn;
      beautifier = null;
      execSpawn = null;
      beforeEach(function() {
        beautifier = new PHPCSFixer();
        return execSpawn = Executable.prototype.spawn;
      });
      afterEach(function() {
        return Executable.prototype.spawn = execSpawn;
      });
      OSSpecificSpecs = function() {
        var failWhichProgram, text;
        text = "<?php echo \"test\"; ?>";
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, language, options, p;
            language = "PHP";
            options = {
              fixers: "",
              levels: ""
            };
            Executable.prototype.spawn = function(exe, args, options) {
              var er;
              er = new Error('ENOENT');
              er.code = 'ENOENT';
              return beautifier.Promise.reject(er);
            };
            p = beautifier.loadExecutables().then(function() {
              return beautifier.beautify(text, language, options);
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
              expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        failWhichProgram = function(failingProgram) {
          return it("should error when '" + failingProgram + "' not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            if (!Executable.isWindows && failingProgram === "php") {
              return;
            }
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, language, options, p;
              language = "PHP";
              options = {
                fixers: "",
                levels: ""
              };
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
                expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
                expect(v.file).toBe(failingProgram);
                return v;
              };
              beautifier.which = function(exe, options) {
                if (exe == null) {
                  return beautifier.Promise.resolve(null);
                }
                if (exe === failingProgram) {
                  return beautifier.Promise.resolve(failingProgram);
                } else {
                  return beautifier.Promise.resolve("/" + exe);
                }
              };
              Executable.prototype.spawn = function(exe, args, options) {
                var er;
                if (exe === failingProgram) {
                  er = new Error('ENOENT');
                  er.code = 'ENOENT';
                  return beautifier.Promise.reject(er);
                } else {
                  return beautifier.Promise.resolve({
                    returnCode: 0,
                    stdout: 'stdout',
                    stderr: ''
                  });
                }
              };
              p = beautifier.loadExecutables().then(function() {
                return beautifier.beautify(text, language, options);
              });
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              p.then(cb, cb);
              return p;
            });
          });
        };
        return failWhichProgram('PHP');
      };
      if (!isWindows) {
        describe("Mac/Linux", function() {
          beforeEach(function() {
            return Executable.isWindows = function() {
              return false;
            };
          });
          return OSSpecificSpecs();
        });
      }
      return describe("Windows", function() {
        beforeEach(function() {
          return Executable.isWindows = function() {
            return true;
          };
        });
        return OSSpecificSpecs();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcGVjL2JlYXV0aWZpZXItcGhwLWNzLWZpeGVyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGlDQUFSOztFQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsK0JBQVI7O0VBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSwrQkFBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBUVAsU0FBQSxHQUFZLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXBCLElBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLFFBRFosSUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0I7O0VBRXhCLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBO0lBRWxDLFVBQUEsQ0FBVyxTQUFBO2FBR1QsZUFBQSxDQUFnQixTQUFBO0FBQ2QsWUFBQTtRQUFBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QjtRQUVwQixJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixlQUEvQjtRQUNQLElBQUksQ0FBQyxXQUFMLENBQUE7UUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLEVBQXFELE1BQXJEO0FBRUEsZUFBTztNQVJPLENBQWhCO0lBSFMsQ0FBWDtXQWFBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO0FBRS9CLFVBQUE7TUFBQSxVQUFBLEdBQWE7TUFDYixTQUFBLEdBQVk7TUFFWixVQUFBLENBQVcsU0FBQTtRQUNULFVBQUEsR0FBYSxJQUFJLFVBQUosQ0FBQTtlQUViLFNBQUEsR0FBWSxVQUFVLENBQUMsU0FBUyxDQUFDO01BSHhCLENBQVg7TUFLQSxTQUFBLENBQVUsU0FBQTtlQUNSLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBckIsR0FBNkI7TUFEckIsQ0FBVjtNQUdBLGVBQUEsR0FBa0IsU0FBQTtBQUNoQixZQUFBO1FBQUEsSUFBQSxHQUFPO1FBRVAsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7VUFDckQsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxHQUFHLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUI7VUFDQSxNQUFBLENBQU8sVUFBQSxZQUFzQixVQUE3QixDQUF3QyxDQUFDLElBQXpDLENBQThDLElBQTlDO2lCQUVBLGVBQUEsQ0FBZ0I7WUFBQSxZQUFBLEVBQWMsSUFBZDtXQUFoQixFQUFvQyxTQUFBO0FBQ2xDLGdCQUFBO1lBQUEsUUFBQSxHQUFXO1lBQ1gsT0FBQSxHQUFVO2NBQ1IsTUFBQSxFQUFRLEVBREE7Y0FFUixNQUFBLEVBQVEsRUFGQTs7WUFNVixVQUFVLENBQUMsU0FBUyxDQUFDLEtBQXJCLEdBQTZCLFNBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxPQUFaO0FBRTNCLGtCQUFBO2NBQUEsRUFBQSxHQUFLLElBQUksS0FBSixDQUFVLFFBQVY7Y0FDTCxFQUFFLENBQUMsSUFBSCxHQUFVO0FBQ1YscUJBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFuQixDQUEwQixFQUExQjtZQUpvQjtZQU03QixDQUFBLEdBQUksVUFBVSxDQUFDLGVBQVgsQ0FBQSxDQUE0QixDQUFDLElBQTdCLENBQWtDLFNBQUE7cUJBQU0sVUFBVSxDQUFDLFFBQVgsQ0FBb0IsSUFBcEIsRUFBMEIsUUFBMUIsRUFBb0MsT0FBcEM7WUFBTixDQUFsQztZQUNKLE1BQUEsQ0FBTyxDQUFQLENBQVMsQ0FBQyxHQUFHLENBQUMsSUFBZCxDQUFtQixJQUFuQjtZQUNBLE1BQUEsQ0FBTyxDQUFBLFlBQWEsVUFBVSxDQUFDLE9BQS9CLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsSUFBN0M7WUFDQSxFQUFBLEdBQUssU0FBQyxDQUFEO2NBRUgsTUFBQSxDQUFPLENBQVAsQ0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFkLENBQW1CLElBQW5CO2NBQ0EsTUFBQSxDQUFPLENBQUEsWUFBYSxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLElBQWhDLEVBQ0UsWUFBQSxHQUFhLENBQWIsR0FBZSwyQkFEakI7Y0FFQSxNQUFBLENBQU8sQ0FBQyxDQUFDLElBQVQsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsaUJBQXBCLEVBQ0UsZ0NBREY7QUFFQSxxQkFBTztZQVBKO1lBUUwsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQVcsRUFBWDtBQUNBLG1CQUFPO1VBMUIyQixDQUFwQztRQUpxRCxDQUF2RDtRQWdDQSxnQkFBQSxHQUFtQixTQUFDLGNBQUQ7aUJBQ2pCLEVBQUEsQ0FBRyxxQkFBQSxHQUFzQixjQUF0QixHQUFxQyxhQUF4QyxFQUFzRCxTQUFBO1lBQ3BELE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsR0FBRyxDQUFDLElBQXZCLENBQTRCLElBQTVCO1lBQ0EsTUFBQSxDQUFPLFVBQUEsWUFBc0IsVUFBN0IsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxJQUE5QztZQUVBLElBQUcsQ0FBSSxVQUFVLENBQUMsU0FBZixJQUE2QixjQUFBLEtBQWtCLEtBQWxEO0FBRUUscUJBRkY7O21CQUlBLGVBQUEsQ0FBZ0I7Y0FBQSxZQUFBLEVBQWMsSUFBZDthQUFoQixFQUFvQyxTQUFBO0FBQ2xDLGtCQUFBO2NBQUEsUUFBQSxHQUFXO2NBQ1gsT0FBQSxHQUFVO2dCQUNSLE1BQUEsRUFBUSxFQURBO2dCQUVSLE1BQUEsRUFBUSxFQUZBOztjQUlWLEVBQUEsR0FBSyxTQUFDLENBQUQ7Z0JBRUgsTUFBQSxDQUFPLENBQVAsQ0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFkLENBQW1CLElBQW5CO2dCQUNBLE1BQUEsQ0FBTyxDQUFBLFlBQWEsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxJQUFoQyxFQUNFLFlBQUEsR0FBYSxDQUFiLEdBQWUsMkJBRGpCO2dCQUVBLE1BQUEsQ0FBTyxDQUFDLENBQUMsSUFBVCxDQUFjLENBQUMsSUFBZixDQUFvQixpQkFBcEIsRUFDRSxnQ0FERjtnQkFFQSxNQUFBLENBQU8sQ0FBQyxDQUFDLElBQVQsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsY0FBcEI7QUFDQSx1QkFBTztjQVJKO2NBVUwsVUFBVSxDQUFDLEtBQVgsR0FBbUIsU0FBQyxHQUFELEVBQU0sT0FBTjtnQkFDakIsSUFDUyxXQURUO0FBQUEseUJBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFuQixDQUEyQixJQUEzQixFQUFQOztnQkFFQSxJQUFHLEdBQUEsS0FBTyxjQUFWO3lCQUNFLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBbkIsQ0FBMkIsY0FBM0IsRUFERjtpQkFBQSxNQUFBO3lCQUtFLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBbkIsQ0FBMkIsR0FBQSxHQUFJLEdBQS9CLEVBTEY7O2NBSGlCO2NBWW5CLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBckIsR0FBNkIsU0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLE9BQVo7QUFFM0Isb0JBQUE7Z0JBQUEsSUFBRyxHQUFBLEtBQU8sY0FBVjtrQkFDRSxFQUFBLEdBQUssSUFBSSxLQUFKLENBQVUsUUFBVjtrQkFDTCxFQUFFLENBQUMsSUFBSCxHQUFVO0FBQ1YseUJBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFuQixDQUEwQixFQUExQixFQUhUO2lCQUFBLE1BQUE7QUFLRSx5QkFBTyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQW5CLENBQTJCO29CQUNoQyxVQUFBLEVBQVksQ0FEb0I7b0JBRWhDLE1BQUEsRUFBUSxRQUZ3QjtvQkFHaEMsTUFBQSxFQUFRLEVBSHdCO21CQUEzQixFQUxUOztjQUYyQjtjQVk3QixDQUFBLEdBQUksVUFBVSxDQUFDLGVBQVgsQ0FBQSxDQUE0QixDQUFDLElBQTdCLENBQWtDLFNBQUE7dUJBQU0sVUFBVSxDQUFDLFFBQVgsQ0FBb0IsSUFBcEIsRUFBMEIsUUFBMUIsRUFBb0MsT0FBcEM7Y0FBTixDQUFsQztjQUNKLE1BQUEsQ0FBTyxDQUFQLENBQVMsQ0FBQyxHQUFHLENBQUMsSUFBZCxDQUFtQixJQUFuQjtjQUNBLE1BQUEsQ0FBTyxDQUFBLFlBQWEsVUFBVSxDQUFDLE9BQS9CLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsSUFBN0M7Y0FDQSxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsRUFBVyxFQUFYO0FBQ0EscUJBQU87WUE1QzJCLENBQXBDO1VBUm9ELENBQXREO1FBRGlCO2VBdURuQixnQkFBQSxDQUFpQixLQUFqQjtNQTFGZ0I7TUE2RmxCLElBQUEsQ0FBTyxTQUFQO1FBQ0UsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQTtVQUVwQixVQUFBLENBQVcsU0FBQTttQkFFVCxVQUFVLENBQUMsU0FBWCxHQUF1QixTQUFBO3FCQUFNO1lBQU47VUFGZCxDQUFYO2lCQUlHLGVBQUgsQ0FBQTtRQU5vQixDQUF0QixFQURGOzthQVNBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUE7UUFFbEIsVUFBQSxDQUFXLFNBQUE7aUJBRVQsVUFBVSxDQUFDLFNBQVgsR0FBdUIsU0FBQTttQkFBTTtVQUFOO1FBRmQsQ0FBWDtlQUlHLGVBQUgsQ0FBQTtNQU5rQixDQUFwQjtJQW5IK0IsQ0FBakM7RUFma0MsQ0FBcEM7QUFmQSIsInNvdXJjZXNDb250ZW50IjpbIlBIUENTRml4ZXIgPSByZXF1aXJlIFwiLi4vc3JjL2JlYXV0aWZpZXJzL3BocC1jcy1maXhlclwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSBcIi4uL3NyYy9iZWF1dGlmaWVycy9iZWF1dGlmaWVyXCJcbkV4ZWN1dGFibGUgPSByZXF1aXJlIFwiLi4vc3JjL2JlYXV0aWZpZXJzL2V4ZWN1dGFibGVcIlxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuI1xuIyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbiMgb3IgYGZkZXNjcmliZWApLiBSZW1vdmUgdGhlIGBmYCB0byB1bmZvY3VzIHRoZSBibG9jay5cblxuIyBDaGVjayBpZiBXaW5kb3dzXG5pc1dpbmRvd3MgPSBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMicgb3JcbiAgcHJvY2Vzcy5lbnYuT1NUWVBFIGlzICdjeWd3aW4nIG9yXG4gIHByb2Nlc3MuZW52Lk9TVFlQRSBpcyAnbXN5cydcblxuZGVzY3JpYmUgXCJQSFAtQ1MtRml4ZXIgQmVhdXRpZmllclwiLCAtPlxuXG4gIGJlZm9yZUVhY2ggLT5cblxuICAgICMgQWN0aXZhdGUgcGFja2FnZVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYWN0aXZhdGlvblByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYXRvbS1iZWF1dGlmeScpXG4gICAgICAjIEZvcmNlIGFjdGl2YXRlIHBhY2thZ2VcbiAgICAgIHBhY2sgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoXCJhdG9tLWJlYXV0aWZ5XCIpXG4gICAgICBwYWNrLmFjdGl2YXRlTm93KClcbiAgICAgICMgQ2hhbmdlIGxvZ2dlciBsZXZlbFxuICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLWJlYXV0aWZ5LmdlbmVyYWwubG9nZ2VyTGV2ZWwnLCAnaW5mbycpXG4gICAgICAjIFJldHVybiBwcm9taXNlXG4gICAgICByZXR1cm4gYWN0aXZhdGlvblByb21pc2VcblxuICBkZXNjcmliZSBcIkJlYXV0aWZpZXI6OmJlYXV0aWZ5XCIsIC0+XG5cbiAgICBiZWF1dGlmaWVyID0gbnVsbFxuICAgIGV4ZWNTcGF3biA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGJlYXV0aWZpZXIgPSBuZXcgUEhQQ1NGaXhlcigpXG4gICAgICAjIGNvbnNvbGUubG9nKCduZXcgYmVhdXRpZmllcicpXG4gICAgICBleGVjU3Bhd24gPSBFeGVjdXRhYmxlLnByb3RvdHlwZS5zcGF3blxuXG4gICAgYWZ0ZXJFYWNoIC0+XG4gICAgICBFeGVjdXRhYmxlLnByb3RvdHlwZS5zcGF3biA9IGV4ZWNTcGF3blxuXG4gICAgT1NTcGVjaWZpY1NwZWNzID0gLT5cbiAgICAgIHRleHQgPSBcIjw/cGhwIGVjaG8gXFxcInRlc3RcXFwiOyA/PlwiXG5cbiAgICAgIGl0IFwic2hvdWxkIGVycm9yIHdoZW4gYmVhdXRpZmllcidzIHByb2dyYW0gbm90IGZvdW5kXCIsIC0+XG4gICAgICAgIGV4cGVjdChiZWF1dGlmaWVyKS5ub3QudG9CZShudWxsKVxuICAgICAgICBleHBlY3QoYmVhdXRpZmllciBpbnN0YW5jZW9mIEJlYXV0aWZpZXIpLnRvQmUodHJ1ZSlcblxuICAgICAgICB3YWl0c0ZvclByb21pc2Ugc2hvdWxkUmVqZWN0OiB0cnVlLCAtPlxuICAgICAgICAgIGxhbmd1YWdlID0gXCJQSFBcIlxuICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBmaXhlcnM6IFwiXCJcbiAgICAgICAgICAgIGxldmVsczogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgICAjIE1vY2sgc3Bhd25cbiAgICAgICAgICAjIGJlYXV0aWZpZXIuc3Bhd25cbiAgICAgICAgICBFeGVjdXRhYmxlLnByb3RvdHlwZS5zcGF3biA9IChleGUsIGFyZ3MsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nKCdzcGF3bicsIGV4ZSwgYXJncywgb3B0aW9ucylcbiAgICAgICAgICAgIGVyID0gbmV3IEVycm9yKCdFTk9FTlQnKVxuICAgICAgICAgICAgZXIuY29kZSA9ICdFTk9FTlQnXG4gICAgICAgICAgICByZXR1cm4gYmVhdXRpZmllci5Qcm9taXNlLnJlamVjdChlcilcbiAgICAgICAgICAjIEJlYXV0aWZ5XG4gICAgICAgICAgcCA9IGJlYXV0aWZpZXIubG9hZEV4ZWN1dGFibGVzKCkudGhlbigoKSAtPiBiZWF1dGlmaWVyLmJlYXV0aWZ5KHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSlcbiAgICAgICAgICBleHBlY3QocCkubm90LnRvQmUobnVsbClcbiAgICAgICAgICBleHBlY3QocCBpbnN0YW5jZW9mIGJlYXV0aWZpZXIuUHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgICAgIGNiID0gKHYpIC0+XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nKHYpXG4gICAgICAgICAgICBleHBlY3Qodikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgIGV4cGVjdCh2IGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSwgXFxcbiAgICAgICAgICAgICAgXCJFeHBlY3RlZCAnI3t2fScgdG8gYmUgaW5zdGFuY2Ugb2YgRXJyb3JcIilcbiAgICAgICAgICAgIGV4cGVjdCh2LmNvZGUpLnRvQmUoXCJDb21tYW5kTm90Rm91bmRcIiwgXFxcbiAgICAgICAgICAgICAgXCJFeHBlY3RlZCB0byBiZSBDb21tYW5kTm90Rm91bmRcIilcbiAgICAgICAgICAgIHJldHVybiB2XG4gICAgICAgICAgcC50aGVuKGNiLCBjYilcbiAgICAgICAgICByZXR1cm4gcFxuXG4gICAgICBmYWlsV2hpY2hQcm9ncmFtID0gKGZhaWxpbmdQcm9ncmFtKSAtPlxuICAgICAgICBpdCBcInNob3VsZCBlcnJvciB3aGVuICcje2ZhaWxpbmdQcm9ncmFtfScgbm90IGZvdW5kXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIpLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIgaW5zdGFuY2VvZiBCZWF1dGlmaWVyKS50b0JlKHRydWUpXG5cbiAgICAgICAgICBpZiBub3QgRXhlY3V0YWJsZS5pc1dpbmRvd3MgYW5kIGZhaWxpbmdQcm9ncmFtIGlzIFwicGhwXCJcbiAgICAgICAgICAgICMgT25seSBhcHBsaWNhYmxlIG9uIFdpbmRvd3NcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIHNob3VsZFJlamVjdDogdHJ1ZSwgLT5cbiAgICAgICAgICAgIGxhbmd1YWdlID0gXCJQSFBcIlxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgZml4ZXJzOiBcIlwiXG4gICAgICAgICAgICAgIGxldmVsczogXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2IgPSAodikgLT5cbiAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZygnY2IgdmFsdWUnLCB2KVxuICAgICAgICAgICAgICBleHBlY3Qodikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgICAgZXhwZWN0KHYgaW5zdGFuY2VvZiBFcnJvcikudG9CZSh0cnVlLCBcXFxuICAgICAgICAgICAgICAgIFwiRXhwZWN0ZWQgJyN7dn0nIHRvIGJlIGluc3RhbmNlIG9mIEVycm9yXCIpXG4gICAgICAgICAgICAgIGV4cGVjdCh2LmNvZGUpLnRvQmUoXCJDb21tYW5kTm90Rm91bmRcIiwgXFxcbiAgICAgICAgICAgICAgICBcIkV4cGVjdGVkIHRvIGJlIENvbW1hbmROb3RGb3VuZFwiKVxuICAgICAgICAgICAgICBleHBlY3Qodi5maWxlKS50b0JlKGZhaWxpbmdQcm9ncmFtKVxuICAgICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICAgICAgIyB3aGljaCA9IGJlYXV0aWZpZXIud2hpY2guYmluZChiZWF1dGlmaWVyKVxuICAgICAgICAgICAgYmVhdXRpZmllci53aGljaCA9IChleGUsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICAgIHJldHVybiBiZWF1dGlmaWVyLlByb21pc2UucmVzb2x2ZShudWxsKSBcXFxuICAgICAgICAgICAgICAgIGlmIG5vdCBleGU/XG4gICAgICAgICAgICAgIGlmIGV4ZSBpcyBmYWlsaW5nUHJvZ3JhbVxuICAgICAgICAgICAgICAgIGJlYXV0aWZpZXIuUHJvbWlzZS5yZXNvbHZlKGZhaWxpbmdQcm9ncmFtKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgIyB3aGljaChleGUsIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZygnZmFrZSBleGUgcGF0aCcsIGV4ZSlcbiAgICAgICAgICAgICAgICBiZWF1dGlmaWVyLlByb21pc2UucmVzb2x2ZShcIi8je2V4ZX1cIilcblxuICAgICAgICAgICAgIyBvbGRTcGF3biA9IGJlYXV0aWZpZXIuc3Bhd24uYmluZChiZWF1dGlmaWVyKVxuICAgICAgICAgICAgIyBiZWF1dGlmaWVyLnNwYXduXG4gICAgICAgICAgICBFeGVjdXRhYmxlLnByb3RvdHlwZS5zcGF3biA9IChleGUsIGFyZ3MsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICAgICMgY29uc29sZS5sb2coJ3NwYXduJywgZXhlLCBhcmdzLCBvcHRpb25zKVxuICAgICAgICAgICAgICBpZiBleGUgaXMgZmFpbGluZ1Byb2dyYW1cbiAgICAgICAgICAgICAgICBlciA9IG5ldyBFcnJvcignRU5PRU5UJylcbiAgICAgICAgICAgICAgICBlci5jb2RlID0gJ0VOT0VOVCdcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVhdXRpZmllci5Qcm9taXNlLnJlamVjdChlcilcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBiZWF1dGlmaWVyLlByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICByZXR1cm5Db2RlOiAwLFxuICAgICAgICAgICAgICAgICAgc3Rkb3V0OiAnc3Rkb3V0JyxcbiAgICAgICAgICAgICAgICAgIHN0ZGVycjogJydcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBwID0gYmVhdXRpZmllci5sb2FkRXhlY3V0YWJsZXMoKS50aGVuKCgpIC0+IGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpKVxuICAgICAgICAgICAgZXhwZWN0KHApLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgICBleHBlY3QocCBpbnN0YW5jZW9mIGJlYXV0aWZpZXIuUHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgICAgICAgcC50aGVuKGNiLCBjYilcbiAgICAgICAgICAgIHJldHVybiBwXG5cbiAgICAgIGZhaWxXaGljaFByb2dyYW0oJ1BIUCcpXG4gICAgICAjIGZhaWxXaGljaFByb2dyYW0oJ3BocC1jcy1maXhlcicpXG5cbiAgICB1bmxlc3MgaXNXaW5kb3dzXG4gICAgICBkZXNjcmliZSBcIk1hYy9MaW51eFwiLCAtPlxuXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKCdtYWMvbGlueCcpXG4gICAgICAgICAgRXhlY3V0YWJsZS5pc1dpbmRvd3MgPSAoKSAtPiBmYWxzZVxuXG4gICAgICAgIGRvIE9TU3BlY2lmaWNTcGVjc1xuXG4gICAgZGVzY3JpYmUgXCJXaW5kb3dzXCIsIC0+XG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgIyBjb25zb2xlLmxvZygnd2luZG93cycpXG4gICAgICAgIEV4ZWN1dGFibGUuaXNXaW5kb3dzID0gKCkgLT4gdHJ1ZVxuXG4gICAgICBkbyBPU1NwZWNpZmljU3BlY3NcbiJdfQ==
