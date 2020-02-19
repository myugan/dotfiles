(function() {
  "use strict";
  var Beautifier, ESLintFixer, Path, allowUnsafeNewFunction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Path = require('path');

  allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

  module.exports = ESLintFixer = (function(superClass) {
    extend(ESLintFixer, superClass);

    function ESLintFixer() {
      return ESLintFixer.__super__.constructor.apply(this, arguments);
    }

    ESLintFixer.prototype.name = "ESLint Fixer";

    ESLintFixer.prototype.link = "https://github.com/eslint/eslint";

    ESLintFixer.prototype.options = {
      JavaScript: false,
      Vue: false
    };

    ESLintFixer.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var editor, filePath, projectPath, result;
        editor = atom.workspace.getActiveTextEditor();
        filePath = editor.getPath();
        projectPath = atom.project.relativizePath(filePath)[0];
        result = null;
        return allowUnsafeNewFunction(function() {
          var CLIEngine, cli, err, importPath;
          importPath = Path.join(projectPath, 'node_modules', 'eslint');
          try {
            CLIEngine = require(importPath).CLIEngine;
            cli = new CLIEngine({
              fix: true,
              cwd: projectPath
            });
            result = cli.executeOnText(text).results[0];
            return resolve(result.output);
          } catch (error) {
            err = error;
            return reject(err);
          }
        });
      });
    };

    return ESLintFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZXNsaW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxxREFBQTtJQUFBOzs7RUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLHlCQUEwQixPQUFBLENBQVEsVUFBUjs7RUFFM0IsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MEJBQ3JCLElBQUEsR0FBTTs7MEJBQ04sSUFBQSxHQUFNOzswQkFFTixPQUFBLEdBQVM7TUFDUCxVQUFBLEVBQVksS0FETDtNQUVQLEdBQUEsRUFBSyxLQUZFOzs7MEJBS1QsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1FBQ1QsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDWCxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXNDLENBQUEsQ0FBQTtRQUVwRCxNQUFBLEdBQVM7ZUFDVCxzQkFBQSxDQUF1QixTQUFBO0FBQ3JCLGNBQUE7VUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLGNBQXZCLEVBQXVDLFFBQXZDO0FBQ2I7WUFDRSxTQUFBLEdBQVksT0FBQSxDQUFRLFVBQVIsQ0FBbUIsQ0FBQztZQUVoQyxHQUFBLEdBQU0sSUFBSSxTQUFKLENBQWM7Y0FBQSxHQUFBLEVBQUssSUFBTDtjQUFXLEdBQUEsRUFBSyxXQUFoQjthQUFkO1lBQ04sTUFBQSxHQUFTLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLENBQXVCLENBQUMsT0FBUSxDQUFBLENBQUE7bUJBRXpDLE9BQUEsQ0FBUSxNQUFNLENBQUMsTUFBZixFQU5GO1dBQUEsYUFBQTtZQU9NO21CQUNKLE1BQUEsQ0FBTyxHQUFQLEVBUkY7O1FBRnFCLENBQXZCO01BTmtCLENBQWI7SUFEQzs7OztLQVQrQjtBQU4zQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5cbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxue2FsbG93VW5zYWZlTmV3RnVuY3Rpb259ID0gcmVxdWlyZSAnbG9vcGhvbGUnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRVNMaW50Rml4ZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiRVNMaW50IEZpeGVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludFwiXG5cbiAgb3B0aW9uczoge1xuICAgIEphdmFTY3JpcHQ6IGZhbHNlXG4gICAgVnVlOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdXG5cbiAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgIGFsbG93VW5zYWZlTmV3RnVuY3Rpb24gLT5cbiAgICAgICAgaW1wb3J0UGF0aCA9IFBhdGguam9pbihwcm9qZWN0UGF0aCwgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKVxuICAgICAgICB0cnlcbiAgICAgICAgICBDTElFbmdpbmUgPSByZXF1aXJlKGltcG9ydFBhdGgpLkNMSUVuZ2luZVxuXG4gICAgICAgICAgY2xpID0gbmV3IENMSUVuZ2luZShmaXg6IHRydWUsIGN3ZDogcHJvamVjdFBhdGgpXG4gICAgICAgICAgcmVzdWx0ID0gY2xpLmV4ZWN1dGVPblRleHQodGV4dCkucmVzdWx0c1swXVxuXG4gICAgICAgICAgcmVzb2x2ZSByZXN1bHQub3V0cHV0XG4gICAgICAgIGNhdGNoIGVyclxuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgKVxuIl19
