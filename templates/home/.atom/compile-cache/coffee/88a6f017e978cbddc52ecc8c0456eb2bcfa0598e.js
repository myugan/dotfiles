
/*
Requires https://github.com/google/yapf
 */

(function() {
  "use strict";
  var Beautifier, Yapf,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Yapf = (function(superClass) {
    extend(Yapf, superClass);

    function Yapf() {
      return Yapf.__super__.constructor.apply(this, arguments);
    }

    Yapf.prototype.name = "yapf";

    Yapf.prototype.link = "https://github.com/google/yapf";

    Yapf.prototype.isPreInstalled = false;

    Yapf.prototype.options = {
      Python: false
    };

    Yapf.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("yapf", ["-i", tempFile = this.tempFile("input", text)], {
        help: {
          link: "https://github.com/google/yapf"
        },
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          var editor, filePath, projectPath;
          if (options.sort_imports) {
            editor = atom.workspace.getActiveTextEditor();
            filePath = editor.getPath();
            projectPath = atom.project.relativizePath(filePath)[0];
            return _this.run("isort", ["-sp", projectPath, tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Yapf;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMveWFwZi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsZ0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O21CQUVyQixJQUFBLEdBQU07O21CQUNOLElBQUEsR0FBTTs7bUJBQ04sY0FBQSxHQUFnQjs7bUJBRWhCLE9BQUEsR0FBUztNQUNQLE1BQUEsRUFBUSxLQUREOzs7bUJBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLEVBQWEsQ0FDWCxJQURXLEVBRVgsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUZBLENBQWIsRUFHSztRQUFBLElBQUEsRUFBTTtVQUNQLElBQUEsRUFBTSxnQ0FEQztTQUFOO1FBRUEsZ0JBQUEsRUFBa0IsSUFGbEI7T0FITCxDQU1FLENBQUMsSUFOSCxDQU1RLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNKLGNBQUE7VUFBQSxJQUFHLE9BQU8sQ0FBQyxZQUFYO1lBQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtZQUNULFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFBO1lBQ1gsV0FBQSxHQUFjLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUFzQyxDQUFBLENBQUE7bUJBRXBELEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUNFLENBQUMsS0FBRCxFQUFRLFdBQVIsRUFBcUIsUUFBckIsQ0FERixFQUVFO2NBQUEsSUFBQSxFQUFNO2dCQUNKLElBQUEsRUFBTSx5Q0FERjtlQUFOO2FBRkYsQ0FLQSxDQUFDLElBTEQsQ0FLTSxTQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtZQURJLENBTE4sRUFMRjtXQUFBLE1BQUE7bUJBY0UsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBZEY7O1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTlI7SUFEUTs7OztLQVZ3QjtBQVBwQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS95YXBmXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFlhcGYgZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJ5YXBmXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL3lhcGZcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgUHl0aG9uOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwieWFwZlwiLCBbXG4gICAgICBcIi1pXCJcbiAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL3lhcGZcIlxuICAgICAgfSwgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIGlmIG9wdGlvbnMuc29ydF9pbXBvcnRzXG4gICAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdXG5cbiAgICAgICAgICBAcnVuKFwiaXNvcnRcIixcbiAgICAgICAgICAgIFtcIi1zcFwiLCBwcm9qZWN0UGF0aCwgdGVtcEZpbGVdLFxuICAgICAgICAgICAgaGVscDoge1xuICAgICAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS90aW1vdGh5Y3Jvc2xleS9pc29ydFwiXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==
