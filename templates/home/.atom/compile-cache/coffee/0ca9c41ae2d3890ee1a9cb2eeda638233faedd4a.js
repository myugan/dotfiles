
/*
Requires emacs with verilog-mode https://www.veripool.org/wiki/verilog-mode
 */

(function() {
  "use strict";
  var Beautifier, EmacsVerilogMode, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = EmacsVerilogMode = (function(superClass) {
    extend(EmacsVerilogMode, superClass);

    function EmacsVerilogMode() {
      return EmacsVerilogMode.__super__.constructor.apply(this, arguments);
    }

    EmacsVerilogMode.prototype.name = "Emacs Verilog Mode";

    EmacsVerilogMode.prototype.link = "https://www.veripool.org/projects/verilog-mode/";

    EmacsVerilogMode.prototype.isPreInstalled = false;

    EmacsVerilogMode.prototype.executables = [
      {
        name: "Emacs",
        cmd: "emacs",
        homepage: "https://www.gnu.org/software/emacs/",
        installation: "https://www.gnu.org/software/emacs/",
        version: {
          parse: function(text) {
            return text.match(/Emacs (\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    EmacsVerilogMode.prototype.options = {
      Verilog: {
        emacs_script_path: true
      }
    };

    EmacsVerilogMode.prototype.beautify = function(text, language, options) {
      var args, emacs_script_path, tempFile;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "verilog-mode.el");
      }
      this.debug('verilog-beautifier', 'emacs script path: ' + emacs_script_path);
      tempFile = this.tempFile("input", text);
      args = ["--batch", tempFile, "-l", emacs_script_path, "-f", "verilog-mode", "-f", "verilog-batch-indent"];
      this.debug('verilog-beautifier', 'emacs args: ' + args);
      return this.exe("emacs").run(args, {
        ignoreReturnCode: false
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return EmacsVerilogMode;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdmVyaWxvZy1tb2RlL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxrQ0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OytCQUNyQixJQUFBLEdBQU07OytCQUNOLElBQUEsR0FBTTs7K0JBQ04sY0FBQSxHQUFnQjs7K0JBQ2hCLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLE9BRFI7UUFFRSxHQUFBLEVBQUssT0FGUDtRQUdFLFFBQUEsRUFBVSxxQ0FIWjtRQUlFLFlBQUEsRUFBYyxxQ0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsdUJBQVgsQ0FBb0MsQ0FBQSxDQUFBO1VBQTlDLENBREE7U0FMWDtPQURXOzs7K0JBWWIsT0FBQSxHQUFTO01BQ1AsT0FBQSxFQUFTO1FBQ1AsaUJBQUEsRUFBbUIsSUFEWjtPQURGOzs7K0JBTVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsaUJBQUEsR0FBb0IsT0FBTyxDQUFDO01BRTVCLElBQUcsQ0FBSSxpQkFBUDtRQUNFLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixpQkFBeEIsRUFEdEI7O01BR0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBUCxFQUE2QixxQkFBQSxHQUF3QixpQkFBckQ7TUFFQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CO01BRVgsSUFBQSxHQUFPLENBQ0wsU0FESyxFQUVMLFFBRkssRUFHTCxJQUhLLEVBSUwsaUJBSkssRUFLTCxJQUxLLEVBTUwsY0FOSyxFQU9MLElBUEssRUFRTCxzQkFSSztNQVdQLElBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIsY0FBQSxHQUFpQixJQUE5QzthQUVBLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxDQUFhLENBQUMsR0FBZCxDQUFrQixJQUFsQixFQUF3QjtRQUFDLGdCQUFBLEVBQWtCLEtBQW5CO09BQXhCLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSO0lBdkJROzs7O0tBdEJvQztBQVJoRCIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgZW1hY3Mgd2l0aCB2ZXJpbG9nLW1vZGUgaHR0cHM6Ly93d3cudmVyaXBvb2wub3JnL3dpa2kvdmVyaWxvZy1tb2RlXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVtYWNzVmVyaWxvZ01vZGUgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiRW1hY3MgVmVyaWxvZyBNb2RlXCJcbiAgbGluazogXCJodHRwczovL3d3dy52ZXJpcG9vbC5vcmcvcHJvamVjdHMvdmVyaWxvZy1tb2RlL1wiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiRW1hY3NcIlxuICAgICAgY21kOiBcImVtYWNzXCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvRW1hY3MgKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBWZXJpbG9nOiB7XG4gICAgICBlbWFjc19zY3JpcHRfcGF0aDogdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgZW1hY3Nfc2NyaXB0X3BhdGggPSBvcHRpb25zLmVtYWNzX3NjcmlwdF9wYXRoXG5cbiAgICBpZiBub3QgZW1hY3Nfc2NyaXB0X3BhdGhcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJ2ZXJpbG9nLW1vZGUuZWxcIilcblxuICAgIEBkZWJ1ZygndmVyaWxvZy1iZWF1dGlmaWVyJywgJ2VtYWNzIHNjcmlwdCBwYXRoOiAnICsgZW1hY3Nfc2NyaXB0X3BhdGgpXG5cbiAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG5cbiAgICBhcmdzID0gW1xuICAgICAgXCItLWJhdGNoXCJcbiAgICAgIHRlbXBGaWxlXG4gICAgICBcIi1sXCJcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoXG4gICAgICBcIi1mXCJcbiAgICAgIFwidmVyaWxvZy1tb2RlXCJcbiAgICAgIFwiLWZcIlxuICAgICAgXCJ2ZXJpbG9nLWJhdGNoLWluZGVudFwiXG4gICAgICBdXG5cbiAgICBAZGVidWcoJ3Zlcmlsb2ctYmVhdXRpZmllcicsICdlbWFjcyBhcmdzOiAnICsgYXJncylcblxuICAgIEBleGUoXCJlbWFjc1wiKS5ydW4oYXJncywge2lnbm9yZVJldHVybkNvZGU6IGZhbHNlfSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==
