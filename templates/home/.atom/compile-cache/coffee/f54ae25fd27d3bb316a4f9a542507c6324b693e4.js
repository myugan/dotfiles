
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, FortranBeautifier, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = FortranBeautifier = (function(superClass) {
    extend(FortranBeautifier, superClass);

    function FortranBeautifier() {
      return FortranBeautifier.__super__.constructor.apply(this, arguments);
    }

    FortranBeautifier.prototype.name = "Fortran Beautifier";

    FortranBeautifier.prototype.link = "https://www.gnu.org/software/emacs/";

    FortranBeautifier.prototype.executables = [
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

    FortranBeautifier.prototype.options = {
      Fortran: true
    };

    FortranBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs, emacs_path, emacs_script_path, tempFile;
      this.debug('fortran-beautifier', options);
      emacs = this.exe("emacs");
      emacs_path = options.emacs_path;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-fortran-formating-script.lisp");
      }
      this.debug('fortran-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'f90-batch-indent-region', tempFile = this.tempFile("temp", text)];
      if (emacs_path) {
        this.deprecateOptionForExecutable("Emacs", "emacs_path", "Path");
        return this.run(emacs_path, args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      } else {
        return emacs.run(args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return FortranBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZm9ydHJhbi1iZWF1dGlmaWVyL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxtQ0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O2dDQUNyQixJQUFBLEdBQU07O2dDQUNOLElBQUEsR0FBTTs7Z0NBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sT0FEUjtRQUVFLEdBQUEsRUFBSyxPQUZQO1FBR0UsUUFBQSxFQUFVLHFDQUhaO1FBSUUsWUFBQSxFQUFjLHFDQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyx1QkFBWCxDQUFvQyxDQUFBLENBQUE7VUFBOUMsQ0FEQTtTQUxYO09BRFc7OztnQ0FZYixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVMsSUFERjs7O2dDQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIsT0FBN0I7TUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMO01BRVIsVUFBQSxHQUFhLE9BQU8sQ0FBQztNQUNyQixpQkFBQSxHQUFvQixPQUFPLENBQUM7TUFFNUIsSUFBRyxDQUFJLGlCQUFQO1FBQ0UsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLHFDQUF4QixFQUR0Qjs7TUFHQSxJQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLHFCQUFBLEdBQXdCLGlCQUFyRDtNQUVBLElBQUEsR0FBTyxDQUNMLFNBREssRUFFTCxJQUZLLEVBR0wsaUJBSEssRUFJTCxJQUpLLEVBS0wseUJBTEssRUFNTCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBTk47TUFTUCxJQUFHLFVBQUg7UUFDRSxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsT0FBOUIsRUFBdUMsWUFBdkMsRUFBcUQsTUFBckQ7ZUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBaUIsSUFBakIsRUFBdUI7VUFBQyxnQkFBQSxFQUFrQixLQUFuQjtTQUF2QixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsRUFGRjtPQUFBLE1BQUE7ZUFPRSxLQUFLLENBQUMsR0FBTixDQUFVLElBQVYsRUFBZ0I7VUFBQyxnQkFBQSxFQUFrQixLQUFuQjtTQUFoQixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsRUFQRjs7SUFyQlE7Ozs7S0FuQnFDO0FBUmpEIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1xuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGb3J0cmFuQmVhdXRpZmllciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJGb3J0cmFuIEJlYXV0aWZpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIkVtYWNzXCJcbiAgICAgIGNtZDogXCJlbWFjc1wiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9lbWFjcy9cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL0VtYWNzIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgRm9ydHJhbjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoJ2ZvcnRyYW4tYmVhdXRpZmllcicsIG9wdGlvbnMpXG4gICAgZW1hY3MgPSBAZXhlKFwiZW1hY3NcIilcblxuICAgIGVtYWNzX3BhdGggPSBvcHRpb25zLmVtYWNzX3BhdGhcbiAgICBlbWFjc19zY3JpcHRfcGF0aCA9IG9wdGlvbnMuZW1hY3Nfc2NyaXB0X3BhdGhcblxuICAgIGlmIG5vdCBlbWFjc19zY3JpcHRfcGF0aFxuICAgICAgZW1hY3Nfc2NyaXB0X3BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImVtYWNzLWZvcnRyYW4tZm9ybWF0aW5nLXNjcmlwdC5saXNwXCIpXG5cbiAgICBAZGVidWcoJ2ZvcnRyYW4tYmVhdXRpZmllcicsICdlbWFjcyBzY3JpcHQgcGF0aDogJyArIGVtYWNzX3NjcmlwdF9wYXRoKVxuICAgIFxuICAgIGFyZ3MgPSBbXG4gICAgICAnLS1iYXRjaCdcbiAgICAgICctbCdcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoXG4gICAgICAnLWYnXG4gICAgICAnZjkwLWJhdGNoLWluZGVudC1yZWdpb24nXG4gICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dClcbiAgICAgIF1cblxuICAgIGlmIGVtYWNzX3BhdGhcbiAgICAgIEBkZXByZWNhdGVPcHRpb25Gb3JFeGVjdXRhYmxlKFwiRW1hY3NcIiwgXCJlbWFjc19wYXRoXCIsIFwiUGF0aFwiKVxuICAgICAgQHJ1bihlbWFjc19wYXRoLCBhcmdzLCB7aWdub3JlUmV0dXJuQ29kZTogZmFsc2V9KVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgKVxuICAgIGVsc2VcbiAgICAgIGVtYWNzLnJ1bihhcmdzLCB7aWdub3JlUmV0dXJuQ29kZTogZmFsc2V9KVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgKVxuIl19
