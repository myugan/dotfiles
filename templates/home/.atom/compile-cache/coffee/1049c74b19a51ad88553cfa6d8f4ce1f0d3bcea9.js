
/*
Requires https://github.com/avh4/elm-format
 */

(function() {
  "use strict";
  var Beautifier, ElmFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ElmFormat = (function(superClass) {
    extend(ElmFormat, superClass);

    function ElmFormat() {
      return ElmFormat.__super__.constructor.apply(this, arguments);
    }

    ElmFormat.prototype.name = "elm-format";

    ElmFormat.prototype.link = "https://github.com/avh4/elm-format";

    ElmFormat.prototype.executables = [
      {
        name: "elm-format",
        cmd: "elm-format",
        homepage: "https://github.com/avh4/elm-format",
        installation: "https://github.com/avh4/elm-format#installation-",
        version: {
          args: ['--help'],
          parse: function(text) {
            try {
              return text.match(/elm-format-\d+.\d+ (\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/elm-format (\d+\.\d+\.\d+)/)[1];
            }
          }
        },
        docker: {
          image: "unibeautify/elm-format"
        }
      }
    ];

    ElmFormat.prototype.options = {
      Elm: true
    };

    ElmFormat.prototype.beautify = function(text, language, options) {
      var tempfile;
      return tempfile = this.tempFile("input", text, ".elm").then((function(_this) {
        return function(name) {
          return _this.exe("elm-format").run(['--yes', name]).then(function() {
            return _this.readFile(name);
          });
        };
      })(this));
    };

    return ElmFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZWxtLWZvcm1hdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEscUJBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sWUFEUjtRQUVFLEdBQUEsRUFBSyxZQUZQO1FBR0UsUUFBQSxFQUFVLG9DQUhaO1FBSUUsWUFBQSxFQUFjLGtEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLElBQUEsRUFBTSxDQUFDLFFBQUQsQ0FEQztVQUVQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFDTDtBQUNFLHFCQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsb0NBQVgsQ0FBaUQsQ0FBQSxDQUFBLEVBRDFEO2FBQUEsYUFBQTtBQUdFLHFCQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsNEJBQVgsQ0FBeUMsQ0FBQSxDQUFBLEVBSGxEOztVQURLLENBRkE7U0FMWDtRQWFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyx3QkFERDtTQWJWO09BRFc7Ozt3QkFvQmIsT0FBQSxHQUFTO01BQ1AsR0FBQSxFQUFLLElBREU7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLE1BQXpCLENBQ1gsQ0FBQyxJQURVLENBQ0wsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQ0osS0FBQyxDQUFBLEdBQUQsQ0FBSyxZQUFMLENBQ0UsQ0FBQyxHQURILENBQ08sQ0FDSCxPQURHLEVBRUgsSUFGRyxDQURQLENBS0UsQ0FBQyxJQUxILENBS1EsU0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7VUFESSxDQUxSO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREs7SUFESDs7OztLQTNCNkI7QUFOekMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9hdmg0L2VsbS1mb3JtYXRcbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsbUZvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJlbG0tZm9ybWF0XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYXZoNC9lbG0tZm9ybWF0XCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcImVsbS1mb3JtYXRcIlxuICAgICAgY21kOiBcImVsbS1mb3JtYXRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL2F2aDQvZWxtLWZvcm1hdFwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL2F2aDQvZWxtLWZvcm1hdCNpbnN0YWxsYXRpb24tXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgYXJnczogWyctLWhlbHAnXVxuICAgICAgICBwYXJzZTogKHRleHQpIC0+XG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXR1cm4gdGV4dC5tYXRjaCgvZWxtLWZvcm1hdC1cXGQrLlxcZCsgKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgICAgIGNhdGNoXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5tYXRjaCgvZWxtLWZvcm1hdCAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwidW5pYmVhdXRpZnkvZWxtLWZvcm1hdFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIEVsbTogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICB0ZW1wZmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQsIFwiLmVsbVwiKVxuICAgIC50aGVuIChuYW1lKSA9PlxuICAgICAgQGV4ZShcImVsbS1mb3JtYXRcIilcbiAgICAgICAgLnJ1bihbXG4gICAgICAgICAgJy0teWVzJyxcbiAgICAgICAgICBuYW1lXG4gICAgICAgIF0pXG4gICAgICAgIC50aGVuICgpID0+XG4gICAgICAgICAgQHJlYWRGaWxlKG5hbWUpXG4iXX0=
