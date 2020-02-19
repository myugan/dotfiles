
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, VhdlBeautifier, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = VhdlBeautifier = (function(superClass) {
    extend(VhdlBeautifier, superClass);

    function VhdlBeautifier() {
      return VhdlBeautifier.__super__.constructor.apply(this, arguments);
    }

    VhdlBeautifier.prototype.name = "VHDL Beautifier";

    VhdlBeautifier.prototype.link = "https://www.gnu.org/software/emacs/";

    VhdlBeautifier.prototype.executables = [
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

    VhdlBeautifier.prototype.options = {
      VHDL: {
        emacs_script_path: true
      }
    };

    VhdlBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs, emacs_script_path, tempFile;
      this.debug('vhdl-beautifier', options);
      emacs = this.exe("emacs");
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-vhdl-formating-script.lisp");
      }
      this.debug('vhdl-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'vhdl-batch-indent-region', tempFile = this.tempFile("temp", text)];
      return emacs.run(args, {
        ignoreReturnCode: false
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return VhdlBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdmhkbC1iZWF1dGlmaWVyL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxnQ0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzZCQUNyQixJQUFBLEdBQU07OzZCQUNOLElBQUEsR0FBTTs7NkJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sT0FEUjtRQUVFLEdBQUEsRUFBSyxPQUZQO1FBR0UsUUFBQSxFQUFVLHFDQUhaO1FBSUUsWUFBQSxFQUFjLHFDQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyx1QkFBWCxDQUFvQyxDQUFBLENBQUE7VUFBOUMsQ0FEQTtTQUxYO09BRFc7Ozs2QkFZYixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQU07UUFDSixpQkFBQSxFQUFtQixJQURmO09BREM7Ozs2QkFNVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLGlCQUFQLEVBQTBCLE9BQTFCO01BQ0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTDtNQUVSLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQztNQUU1QixJQUFHLENBQUksaUJBQVA7UUFDRSxpQkFBQSxHQUFvQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0Isa0NBQXhCLEVBRHRCOztNQUdBLElBQUMsQ0FBQSxLQUFELENBQU8saUJBQVAsRUFBMEIscUJBQUEsR0FBd0IsaUJBQWxEO01BRUEsSUFBQSxHQUFPLENBQ0wsU0FESyxFQUVMLElBRkssRUFHTCxpQkFISyxFQUlMLElBSkssRUFLTCwwQkFMSyxFQU1MLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FOTjthQVNQLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixFQUFnQjtRQUFDLGdCQUFBLEVBQWtCLEtBQW5CO09BQWhCLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSO0lBcEJROzs7O0tBckJrQztBQVI5QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9lbWFjcy9cbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4uL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVmhkbEJlYXV0aWZpZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiVkhETCBCZWF1dGlmaWVyXCJcbiAgbGluazogXCJodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1wiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJFbWFjc1wiXG4gICAgICBjbWQ6IFwiZW1hY3NcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9lbWFjcy9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC9FbWFjcyAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIFZIREw6IHtcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoOiB0cnVlXG4gICAgfVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoJ3ZoZGwtYmVhdXRpZmllcicsIG9wdGlvbnMpXG4gICAgZW1hY3MgPSBAZXhlKFwiZW1hY3NcIilcblxuICAgIGVtYWNzX3NjcmlwdF9wYXRoID0gb3B0aW9ucy5lbWFjc19zY3JpcHRfcGF0aFxuXG4gICAgaWYgbm90IGVtYWNzX3NjcmlwdF9wYXRoXG4gICAgICBlbWFjc19zY3JpcHRfcGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZW1hY3MtdmhkbC1mb3JtYXRpbmctc2NyaXB0Lmxpc3BcIilcblxuICAgIEBkZWJ1ZygndmhkbC1iZWF1dGlmaWVyJywgJ2VtYWNzIHNjcmlwdCBwYXRoOiAnICsgZW1hY3Nfc2NyaXB0X3BhdGgpXG5cbiAgICBhcmdzID0gW1xuICAgICAgJy0tYmF0Y2gnXG4gICAgICAnLWwnXG4gICAgICBlbWFjc19zY3JpcHRfcGF0aFxuICAgICAgJy1mJ1xuICAgICAgJ3ZoZGwtYmF0Y2gtaW5kZW50LXJlZ2lvbidcbiAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0KVxuICAgICAgXVxuXG4gICAgZW1hY3MucnVuKGFyZ3MsIHtpZ25vcmVSZXR1cm5Db2RlOiBmYWxzZX0pXG4gICAgICAudGhlbig9PlxuICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICApXG4iXX0=
