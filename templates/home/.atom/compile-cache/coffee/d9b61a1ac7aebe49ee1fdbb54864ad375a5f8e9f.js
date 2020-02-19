
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = Rubocop = (function(superClass) {
    extend(Rubocop, superClass);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.link = "https://github.com/bbatsov/rubocop";

    Rubocop.prototype.isPreInstalled = false;

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.executables = [
      {
        name: "Rubocop",
        cmd: "rubocop",
        homepage: "http://rubocop.readthedocs.io/",
        installation: "http://rubocop.readthedocs.io/en/latest/installation/",
        version: {
          parse: function(text) {
            return text.match(/(\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    Rubocop.prototype.beautify = function(text, language, options, context) {
      var _relativePath, fullPath, projectPath, ref;
      fullPath = context.filePath || "";
      ref = atom.project.relativizePath(fullPath), projectPath = ref[0], _relativePath = ref[1];
      if (options.rubocop_path) {
        this.deprecateOptionForExecutable("Rubocop", "Ruby - Rubocop Path (rubocop_path)", "Path");
      }
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var config, configFile, exeOptions, rubocopArguments, rubocopPath, tempConfig, yaml;
          _this.debug('rubocop paths', paths);
          rubocopPath = paths.find(function(p) {
            return p && path.isAbsolute(p);
          }) || "rubocop";
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = _this.findFile(path.dirname(fullPath), ".rubocop.yml");
          if (configFile == null) {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            tempConfig = _this.tempFile("rubocop-config", yaml.safeDump(config));
          }
          rubocopArguments = ["--auto-correct", "--force-exclusion", "--stdin", fullPath || "atom-beautify.rb"];
          exeOptions = {
            ignoreReturnCode: true,
            cwd: configFile != null ? projectPath : void 0,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          };
          if (tempConfig != null) {
            rubocopArguments.push("--config", tempConfig);
          }
          _this.debug("rubocop arguments", rubocopArguments);
          return (options.rubocop_path ? _this.run(rubocopPath, rubocopArguments, exeOptions) : _this.exe("rubocop").run(rubocopArguments, exeOptions)).then(function(stdout) {
            var result;
            _this.debug("rubocop output", stdout);
            if (stdout.length === 0) {
              return text;
            }
            result = stdout.split("====================\n");
            if (result.length === 1) {
              result = stdout.split("====================\r\n");
            }
            return result[result.length - 1];
          });
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVib2NvcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEseUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztzQkFDckIsSUFBQSxHQUFNOztzQkFDTixJQUFBLEdBQU07O3NCQUNOLGNBQUEsR0FBZ0I7O3NCQUVoQixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsSUFBYjtRQUNBLFlBQUEsRUFBYyxJQURkO09BRks7OztzQkFNVCxXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxTQURSO1FBRUUsR0FBQSxFQUFLLFNBRlA7UUFHRSxRQUFBLEVBQVUsZ0NBSFo7UUFJRSxZQUFBLEVBQWMsdURBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLGlCQUFYLENBQThCLENBQUEsQ0FBQTtVQUF4QyxDQURBO1NBTFg7T0FEVzs7O3NCQVliLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCO0FBQ1IsVUFBQTtNQUFBLFFBQUEsR0FBVyxPQUFPLENBQUMsUUFBUixJQUFvQjtNQUMvQixNQUErQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsUUFBNUIsQ0FBL0IsRUFBQyxvQkFBRCxFQUFjO01BR2QsSUFBRyxPQUFPLENBQUMsWUFBWDtRQUNFLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixTQUE5QixFQUF5QyxvQ0FBekMsRUFBK0UsTUFBL0UsRUFERjs7YUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUNxQixPQUFPLENBQUMsWUFBeEMsR0FBQSxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQU8sQ0FBQyxZQUFmLENBQUEsR0FBQSxNQURXLEVBRVgsSUFBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLENBRlcsQ0FBYixDQUlBLENBQUMsSUFKRCxDQUlNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO0FBQ0osY0FBQTtVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZUFBUCxFQUF3QixLQUF4QjtVQUVBLFdBQUEsR0FBYyxLQUFLLENBQUMsSUFBTixDQUFXLFNBQUMsQ0FBRDttQkFBTyxDQUFBLElBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsQ0FBaEI7VUFBYixDQUFYLENBQUEsSUFBK0M7VUFDN0QsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLFdBQXhCO1VBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCLFdBQXRCLEVBQW1DLEtBQW5DO1VBR0EsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQVYsRUFBa0MsY0FBbEM7VUFDYixJQUFJLGtCQUFKO1lBQ0UsSUFBQSxHQUFPLE9BQUEsQ0FBUSxtQkFBUjtZQUNQLE1BQUEsR0FBUztjQUNQLHdCQUFBLEVBQ0U7Z0JBQUEsT0FBQSxFQUFTLE9BQU8sQ0FBQyxXQUFqQjtlQUZLOztZQUlULFVBQUEsR0FBYSxLQUFDLENBQUEsUUFBRCxDQUFVLGdCQUFWLEVBQTRCLElBQUksQ0FBQyxRQUFMLENBQWMsTUFBZCxDQUE1QixFQU5mOztVQVFBLGdCQUFBLEdBQW1CLENBQ2pCLGdCQURpQixFQUVqQixtQkFGaUIsRUFHakIsU0FIaUIsRUFHTixRQUFBLElBQVksa0JBSE47VUFLbkIsVUFBQSxHQUFhO1lBQ1gsZ0JBQUEsRUFBa0IsSUFEUDtZQUVYLEdBQUEsRUFBb0Isa0JBQWYsR0FBQSxXQUFBLEdBQUEsTUFGTTtZQUdYLE9BQUEsRUFBUyxTQUFDLEtBQUQ7cUJBQVcsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWO1lBQVgsQ0FIRTs7VUFLYixJQUFpRCxrQkFBakQ7WUFBQSxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixVQUF0QixFQUFrQyxVQUFsQyxFQUFBOztVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sbUJBQVAsRUFBNEIsZ0JBQTVCO2lCQUVBLENBQUksT0FBTyxDQUFDLFlBQVgsR0FDQyxLQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsZ0JBQWxCLEVBQW9DLFVBQXBDLENBREQsR0FFQyxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsQ0FBZSxDQUFDLEdBQWhCLENBQW9CLGdCQUFwQixFQUFzQyxVQUF0QyxDQUZGLENBR0MsQ0FBQyxJQUhGLENBR08sU0FBQyxNQUFEO0FBQ0wsZ0JBQUE7WUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLGdCQUFQLEVBQXlCLE1BQXpCO1lBRUEsSUFBZSxNQUFNLENBQUMsTUFBUCxLQUFpQixDQUFoQztBQUFBLHFCQUFPLEtBQVA7O1lBRUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxLQUFQLENBQWEsd0JBQWI7WUFDVCxJQUFxRCxNQUFNLENBQUMsTUFBUCxLQUFpQixDQUF0RTtjQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsS0FBUCxDQUFhLDBCQUFiLEVBQVQ7O21CQUVBLE1BQU8sQ0FBQSxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFoQjtVQVJGLENBSFA7UUE5Qkk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSk47SUFUUTs7OztLQXZCMkI7QUFSdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9iYmF0c292L3J1Ym9jb3BcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUnVib2NvcCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSdWJvY29wXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIFJ1Ynk6XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgcnVib2NvcF9wYXRoOiB0cnVlXG4gIH1cblxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiUnVib2NvcFwiXG4gICAgICBjbWQ6IFwicnVib2NvcFwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vcnVib2NvcC5yZWFkdGhlZG9jcy5pby9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHA6Ly9ydWJvY29wLnJlYWR0aGVkb2NzLmlvL2VuL2xhdGVzdC9pbnN0YWxsYXRpb24vXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC8oXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICBmdWxsUGF0aCA9IGNvbnRleHQuZmlsZVBhdGggb3IgXCJcIlxuICAgIFtwcm9qZWN0UGF0aCwgX3JlbGF0aXZlUGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZnVsbFBhdGgpXG5cbiAgICAjIERlcHJlY2F0ZSBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgIGlmIG9wdGlvbnMucnVib2NvcF9wYXRoXG4gICAgICBAZGVwcmVjYXRlT3B0aW9uRm9yRXhlY3V0YWJsZShcIlJ1Ym9jb3BcIiwgXCJSdWJ5IC0gUnVib2NvcCBQYXRoIChydWJvY29wX3BhdGgpXCIsIFwiUGF0aFwiKVxuXG4gICAgIyBGaW5kIHRoZSBydWJvY29wIHBhdGhcbiAgICBAUHJvbWlzZS5hbGwoW1xuICAgICAgQHdoaWNoKG9wdGlvbnMucnVib2NvcF9wYXRoKSBpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgICAgQHdoaWNoKCdydWJvY29wJylcbiAgICBdKVxuICAgIC50aGVuKChwYXRocykgPT5cbiAgICAgIEBkZWJ1ZygncnVib2NvcCBwYXRocycsIHBhdGhzKVxuICAgICAgIyBHZXQgZmlyc3QgdmFsaWQsIGFic29sdXRlIHBhdGhcbiAgICAgIHJ1Ym9jb3BQYXRoID0gcGF0aHMuZmluZCgocCkgLT4gcCBhbmQgcGF0aC5pc0Fic29sdXRlKHApKSBvciBcInJ1Ym9jb3BcIlxuICAgICAgQHZlcmJvc2UoJ3J1Ym9jb3BQYXRoJywgcnVib2NvcFBhdGgpXG4gICAgICBAZGVidWcoJ3J1Ym9jb3BQYXRoJywgcnVib2NvcFBhdGgsIHBhdGhzKVxuXG4gICAgICAjIEZpbmQgb3IgZ2VuZXJhdGUgYSBjb25maWcgZmlsZSBpZiBub24gZXhpc3RzXG4gICAgICBjb25maWdGaWxlID0gQGZpbmRGaWxlKHBhdGguZGlybmFtZShmdWxsUGF0aCksIFwiLnJ1Ym9jb3AueW1sXCIpXG4gICAgICBpZiAhY29uZmlnRmlsZT9cbiAgICAgICAgeWFtbCA9IHJlcXVpcmUoXCJ5YW1sLWZyb250LW1hdHRlclwiKVxuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgXCJTdHlsZS9JbmRlbnRhdGlvbldpZHRoXCI6XG4gICAgICAgICAgICBcIldpZHRoXCI6IG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgICAgfVxuICAgICAgICB0ZW1wQ29uZmlnID0gQHRlbXBGaWxlKFwicnVib2NvcC1jb25maWdcIiwgeWFtbC5zYWZlRHVtcChjb25maWcpKVxuXG4gICAgICBydWJvY29wQXJndW1lbnRzID0gW1xuICAgICAgICBcIi0tYXV0by1jb3JyZWN0XCJcbiAgICAgICAgXCItLWZvcmNlLWV4Y2x1c2lvblwiXG4gICAgICAgIFwiLS1zdGRpblwiLCBmdWxsUGF0aCBvciBcImF0b20tYmVhdXRpZnkucmJcIiAjIC0tc3RkaW4gcmVxdWlyZXMgYW4gYXJndW1lbnRcbiAgICAgIF1cbiAgICAgIGV4ZU9wdGlvbnMgPSB7XG4gICAgICAgIGlnbm9yZVJldHVybkNvZGU6IHRydWUsXG4gICAgICAgIGN3ZDogcHJvamVjdFBhdGggaWYgY29uZmlnRmlsZT8sXG4gICAgICAgIG9uU3RkaW46IChzdGRpbikgLT4gc3RkaW4uZW5kIHRleHRcbiAgICAgIH1cbiAgICAgIHJ1Ym9jb3BBcmd1bWVudHMucHVzaChcIi0tY29uZmlnXCIsIHRlbXBDb25maWcpIGlmIHRlbXBDb25maWc/XG4gICAgICBAZGVidWcoXCJydWJvY29wIGFyZ3VtZW50c1wiLCBydWJvY29wQXJndW1lbnRzKVxuXG4gICAgICAoaWYgb3B0aW9ucy5ydWJvY29wX3BhdGggdGhlbiBcXFxuICAgICAgICBAcnVuKHJ1Ym9jb3BQYXRoLCBydWJvY29wQXJndW1lbnRzLCBleGVPcHRpb25zKSBlbHNlIFxcXG4gICAgICAgIEBleGUoXCJydWJvY29wXCIpLnJ1bihydWJvY29wQXJndW1lbnRzLCBleGVPcHRpb25zKVxuICAgICAgKS50aGVuKChzdGRvdXQpID0+XG4gICAgICAgIEBkZWJ1ZyhcInJ1Ym9jb3Agb3V0cHV0XCIsIHN0ZG91dClcbiAgICAgICAgIyBSdWJvY29wIG91dHB1dCBhbiBlcnJvciBpZiBzdGRvdXQgaXMgZW1wdHlcbiAgICAgICAgcmV0dXJuIHRleHQgaWYgc3Rkb3V0Lmxlbmd0aCA9PSAwXG5cbiAgICAgICAgcmVzdWx0ID0gc3Rkb3V0LnNwbGl0KFwiPT09PT09PT09PT09PT09PT09PT1cXG5cIilcbiAgICAgICAgcmVzdWx0ID0gc3Rkb3V0LnNwbGl0KFwiPT09PT09PT09PT09PT09PT09PT1cXHJcXG5cIikgaWYgcmVzdWx0Lmxlbmd0aCA9PSAxXG5cbiAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXVxuICAgICAgKVxuICAgIClcbiJdfQ==
