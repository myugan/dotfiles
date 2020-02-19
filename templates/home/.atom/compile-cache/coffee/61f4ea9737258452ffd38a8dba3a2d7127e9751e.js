
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, Crystal,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Crystal = (function(superClass) {
    extend(Crystal, superClass);

    function Crystal() {
      return Crystal.__super__.constructor.apply(this, arguments);
    }

    Crystal.prototype.name = "Crystal";

    Crystal.prototype.link = "http://crystal-lang.org";

    Crystal.prototype.executables = [
      {
        name: "Crystal",
        cmd: "crystal",
        homepage: "http://crystal-lang.org",
        installation: "https://crystal-lang.org/docs/installation/",
        version: {
          parse: function(text) {
            return text.match(/Crystal (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/crystal"
        }
      }
    ];

    Crystal.prototype.options = {
      Crystal: false
    };

    Crystal.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.exe("crystal").run(['tool', 'format', tempFile = this.tempFile("temp", text)], {
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Crystal;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY3J5c3RhbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsbUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sU0FEUjtRQUVFLEdBQUEsRUFBSyxTQUZQO1FBR0UsUUFBQSxFQUFVLHlCQUhaO1FBSUUsWUFBQSxFQUFjLDZDQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyx5QkFBWCxDQUFzQyxDQUFBLENBQUE7VUFBaEQsQ0FEQTtTQUxYO1FBUUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHFCQUREO1NBUlY7T0FEVzs7O3NCQWViLE9BQUEsR0FBUztNQUNQLE9BQUEsRUFBUyxLQURGOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLENBQWUsQ0FBQyxHQUFoQixDQUFvQixDQUNsQixNQURrQixFQUVsQixRQUZrQixFQUdsQixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBSE8sQ0FBcEIsRUFJSztRQUFDLGdCQUFBLEVBQWtCLElBQW5CO09BSkwsQ0FLRSxDQUFDLElBTEgsQ0FLUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTFI7SUFEUTs7OztLQXRCMkI7QUFQdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNwZXJ2ZGovc3R5bGlzaC1oYXNrZWxsXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENyeXN0YWwgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiQ3J5c3RhbFwiXG4gIGxpbms6IFwiaHR0cDovL2NyeXN0YWwtbGFuZy5vcmdcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiQ3J5c3RhbFwiXG4gICAgICBjbWQ6IFwiY3J5c3RhbFwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vY3J5c3RhbC1sYW5nLm9yZ1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9jcnlzdGFsLWxhbmcub3JnL2RvY3MvaW5zdGFsbGF0aW9uL1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvQ3J5c3RhbCAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwidW5pYmVhdXRpZnkvY3J5c3RhbFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIENyeXN0YWw6IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBleGUoXCJjcnlzdGFsXCIpLnJ1bihbXG4gICAgICAndG9vbCcsXG4gICAgICAnZm9ybWF0JyxcbiAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0KVxuICAgICAgXSwge2lnbm9yZVJldHVybkNvZGU6IHRydWV9KVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19
