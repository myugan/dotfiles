
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(superClass) {
    extend(Autopep8, superClass);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.link = "https://github.com/hhatto/autopep8";

    Autopep8.prototype.executables = [
      {
        name: "autopep8",
        cmd: "autopep8",
        homepage: "https://github.com/hhatto/autopep8",
        installation: "https://github.com/hhatto/autopep8#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/autopep8 (\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/autopep8 (\d+\.\d+)/)[1] + ".0";
            }
          },
          runOptions: {
            returnStdoutOrStderr: true
          }
        },
        docker: {
          image: "unibeautify/autopep8"
        }
      }, {
        name: "isort",
        cmd: "isort",
        optional: true,
        homepage: "https://github.com/timothycrosley/isort",
        installation: "https://github.com/timothycrosley/isort#installing-isort",
        version: {
          parse: function(text) {
            return text.match(/VERSION (\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options, context) {
      var tempFile;
      if (context == null) {
        context = {};
      }
      return this.exe("autopep8").run([tempFile = this.tempFile("input", text), "-i", options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0]).then((function(_this) {
        return function() {
          var filePath, projectPath;
          if (options.sort_imports) {
            filePath = context.filePath;
            projectPath = typeof atom !== "undefined" && atom !== null ? atom.project.relativizePath(filePath)[0] : void 0;
            return _this.exe("isort").run(["-sp", projectPath, tempFile]);
          }
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYXV0b3BlcDguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG9CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt1QkFFckIsSUFBQSxHQUFNOzt1QkFDTixJQUFBLEdBQU07O3VCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFVBRFI7UUFFRSxHQUFBLEVBQUssVUFGUDtRQUdFLFFBQUEsRUFBVSxvQ0FIWjtRQUlFLFlBQUEsRUFBYyxpREFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO0FBQ0w7cUJBQ0UsSUFBSSxDQUFDLEtBQUwsQ0FBVywwQkFBWCxDQUF1QyxDQUFBLENBQUEsRUFEekM7YUFBQSxhQUFBO3FCQUdFLElBQUksQ0FBQyxLQUFMLENBQVcscUJBQVgsQ0FBa0MsQ0FBQSxDQUFBLENBQWxDLEdBQXVDLEtBSHpDOztVQURLLENBREE7VUFNUCxVQUFBLEVBQVk7WUFDVixvQkFBQSxFQUFzQixJQURaO1dBTkw7U0FMWDtRQWVFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyxzQkFERDtTQWZWO09BRFcsRUFvQlg7UUFDRSxJQUFBLEVBQU0sT0FEUjtRQUVFLEdBQUEsRUFBSyxPQUZQO1FBR0UsUUFBQSxFQUFVLElBSFo7UUFJRSxRQUFBLEVBQVUseUNBSlo7UUFLRSxZQUFBLEVBQWMsMERBTGhCO1FBTUUsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHlCQUFYLENBQXNDLENBQUEsQ0FBQTtVQUFoRCxDQURBO1NBTlg7T0FwQlc7Ozt1QkFnQ2IsT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLElBREQ7Ozt1QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7O1FBRGtDLFVBQVU7O2FBQzVDLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxDQUFnQixDQUFDLEdBQWpCLENBQXFCLENBQ2pCLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FETSxFQUVqQixJQUZpQixFQUdzQywrQkFBdkQsR0FBQSxDQUFDLG1CQUFELEVBQXNCLEVBQUEsR0FBRyxPQUFPLENBQUMsZUFBakMsQ0FBQSxHQUFBLE1BSGlCLEVBSTZCLDJCQUE5QyxHQUFBLENBQUMsZUFBRCxFQUFpQixFQUFBLEdBQUcsT0FBTyxDQUFDLFdBQTVCLENBQUEsR0FBQSxNQUppQixFQUs2QixzQkFBOUMsR0FBQSxDQUFDLFVBQUQsRUFBWSxFQUFBLEdBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsQ0FBRCxDQUFkLENBQUEsR0FBQSxNQUxpQixDQUFyQixDQU9FLENBQUMsSUFQSCxDQU9RLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNKLGNBQUE7VUFBQSxJQUFHLE9BQU8sQ0FBQyxZQUFYO1lBQ0UsUUFBQSxHQUFXLE9BQU8sQ0FBQztZQUNuQixXQUFBLGtEQUFjLElBQUksQ0FBRSxPQUFPLENBQUMsY0FBZCxDQUE2QixRQUE3QixDQUF1QyxDQUFBLENBQUE7bUJBQ3JELEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxDQUFhLENBQUMsR0FBZCxDQUFrQixDQUFDLEtBQUQsRUFBUSxXQUFSLEVBQXFCLFFBQXJCLENBQWxCLEVBSEY7O1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUFIsQ0FhRSxDQUFDLElBYkgsQ0FhUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBYlI7SUFEUTs7OztLQXhDNEI7QUFQeEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9oaGF0dG8vYXV0b3BlcDhcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXV0b3BlcDggZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJhdXRvcGVwOFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOFwiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJhdXRvcGVwOFwiXG4gICAgICBjbWQ6IFwiYXV0b3BlcDhcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOFwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOCNpbnN0YWxsYXRpb25cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+XG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC9hdXRvcGVwOCAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICAgICAgY2F0Y2hcbiAgICAgICAgICAgIHRleHQubWF0Y2goL2F1dG9wZXA4IChcXGQrXFwuXFxkKykvKVsxXSArIFwiLjBcIlxuICAgICAgICBydW5PcHRpb25zOiB7XG4gICAgICAgICAgcmV0dXJuU3Rkb3V0T3JTdGRlcnI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L2F1dG9wZXA4XCJcbiAgICAgIH1cbiAgICB9XG4gICAge1xuICAgICAgbmFtZTogXCJpc29ydFwiXG4gICAgICBjbWQ6IFwiaXNvcnRcIlxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vZ2l0aHViLmNvbS90aW1vdGh5Y3Jvc2xleS9pc29ydFwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL3RpbW90aHljcm9zbGV5L2lzb3J0I2luc3RhbGxpbmctaXNvcnRcIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL1ZFUlNJT04gKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBQeXRob246IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQgPSB7fSkgLT5cbiAgICBAZXhlKFwiYXV0b3BlcDhcIikucnVuKFtcbiAgICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgICBcIi1pXCJcbiAgICAgICAgW1wiLS1tYXgtbGluZS1sZW5ndGhcIiwgXCIje29wdGlvbnMubWF4X2xpbmVfbGVuZ3RofVwiXSBpZiBvcHRpb25zLm1heF9saW5lX2xlbmd0aD9cbiAgICAgICAgW1wiLS1pbmRlbnQtc2l6ZVwiLFwiI3tvcHRpb25zLmluZGVudF9zaXplfVwiXSBpZiBvcHRpb25zLmluZGVudF9zaXplP1xuICAgICAgICBbXCItLWlnbm9yZVwiLFwiI3tvcHRpb25zLmlnbm9yZS5qb2luKCcsJyl9XCJdIGlmIG9wdGlvbnMuaWdub3JlP1xuICAgICAgXSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIGlmIG9wdGlvbnMuc29ydF9pbXBvcnRzXG4gICAgICAgICAgZmlsZVBhdGggPSBjb250ZXh0LmZpbGVQYXRoXG4gICAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tPy5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXVxuICAgICAgICAgIEBleGUoXCJpc29ydFwiKS5ydW4oW1wiLXNwXCIsIHByb2plY3RQYXRoLCB0ZW1wRmlsZV0pXG4gICAgICApXG4gICAgICAudGhlbig9PiBAcmVhZEZpbGUodGVtcEZpbGUpKVxuIl19
