
/*
Requires [black](https://github.com/ambv/black)
 */

(function() {
  "use strict";
  var Beautifier, Black, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = Black = (function(superClass) {
    extend(Black, superClass);

    function Black() {
      return Black.__super__.constructor.apply(this, arguments);
    }

    Black.prototype.name = "black";

    Black.prototype.link = "https://github.com/ambv/black";

    Black.prototype.executables = [
      {
        name: "black",
        cmd: "black",
        homepage: "https://github.com/ambv/black",
        installation: "https://github.com/ambv/black#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/black, version (\d+\.\d+)/)[1] + "." + text.match(/b(\d+)$/)[1];
            } catch (error) {
              return text.match(/black, version (\d+\.\d+)/)[1] + ".0";
            }
          }
        }
      }
    ];

    Black.prototype.options = {
      Python: false
    };

    Black.prototype.beautify = function(text, language, options, context) {
      var cwd;
      cwd = context.filePath && path.dirname(context.filePath);
      return this.exe("black").run(["-"], {
        cwd: cwd,
        onStdin: function(stdin) {
          return stdin.end(text);
        }
      });
    };

    return Black;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmxhY2suY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBLHVCQUFBO0lBQUE7OztFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7b0JBQ3JCLElBQUEsR0FBTTs7b0JBQ04sSUFBQSxHQUFNOztvQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxPQURSO1FBRUUsR0FBQSxFQUFLLE9BRlA7UUFHRSxRQUFBLEVBQVUsK0JBSFo7UUFJRSxZQUFBLEVBQWMsNENBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDtBQUVMO3FCQUNFLElBQUksQ0FBQyxLQUFMLENBQVcsMkJBQVgsQ0FBd0MsQ0FBQSxDQUFBLENBQXhDLEdBQTZDLEdBQTdDLEdBQW1ELElBQUksQ0FBQyxLQUFMLENBQVcsU0FBWCxDQUFzQixDQUFBLENBQUEsRUFEM0U7YUFBQSxhQUFBO3FCQUdFLElBQUksQ0FBQyxLQUFMLENBQVcsMkJBQVgsQ0FBd0MsQ0FBQSxDQUFBLENBQXhDLEdBQTZDLEtBSC9DOztVQUZLLENBREE7U0FMWDtPQURXOzs7b0JBaUJiLE9BQUEsR0FBUztNQUNQLE1BQUEsRUFBUSxLQUREOzs7b0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUI7QUFDUixVQUFBO01BQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxRQUFSLElBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLFFBQXJCO2FBRTNCLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxDQUFhLENBQUMsR0FBZCxDQUFrQixDQUFDLEdBQUQsQ0FBbEIsRUFBeUI7UUFDdkIsR0FBQSxFQUFLLEdBRGtCO1FBRXZCLE9BQUEsRUFBUyxTQUFDLEtBQUQ7aUJBQ1AsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWO1FBRE8sQ0FGYztPQUF6QjtJQUhROzs7O0tBeEJ5QjtBQVByQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgW2JsYWNrXShodHRwczovL2dpdGh1Yi5jb20vYW1idi9ibGFjaylcbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJsYWNrIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImJsYWNrXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYW1idi9ibGFja1wiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJibGFja1wiXG4gICAgICBjbWQ6IFwiYmxhY2tcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL2FtYnYvYmxhY2tcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbWJ2L2JsYWNrI2luc3RhbGxhdGlvblwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT5cbiAgICAgICAgICAjIFRyeSB0byByZWFkIGJldGEgdmFsdWVzLCBlZyBcImJsYWNrLCB2ZXJzaW9uIDE4LjZiNFwiIC0+IDE4LjYuNFxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgdGV4dC5tYXRjaCgvYmxhY2ssIHZlcnNpb24gKFxcZCtcXC5cXGQrKS8pWzFdICsgXCIuXCIgKyB0ZXh0Lm1hdGNoKC9iKFxcZCspJC8pWzFdXG4gICAgICAgICAgY2F0Y2hcbiAgICAgICAgICAgIHRleHQubWF0Y2goL2JsYWNrLCB2ZXJzaW9uIChcXGQrXFwuXFxkKykvKVsxXSArIFwiLjBcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBQeXRob246IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIGN3ZCA9IGNvbnRleHQuZmlsZVBhdGggYW5kIHBhdGguZGlybmFtZSBjb250ZXh0LmZpbGVQYXRoXG4gICAgIyBgLWAgYXMgZmlsZW5hbWUgcmVhZHMgZnJvbSBzdGRpblxuICAgIEBleGUoXCJibGFja1wiKS5ydW4oW1wiLVwiXSwge1xuICAgICAgY3dkOiBjd2RcbiAgICAgIG9uU3RkaW46IChzdGRpbikgLT5cbiAgICAgICAgc3RkaW4uZW5kIHRleHRcbiAgICB9KVxuIl19
