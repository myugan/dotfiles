(function() {
  "use strict";
  var Beautifier, LatexBeautify, fs, path, temp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require("fs");

  temp = require("temp").track();

  module.exports = LatexBeautify = (function(superClass) {
    extend(LatexBeautify, superClass);

    function LatexBeautify() {
      return LatexBeautify.__super__.constructor.apply(this, arguments);
    }

    LatexBeautify.prototype.name = "Latex Beautify";

    LatexBeautify.prototype.link = "https://github.com/cmhughes/latexindent.pl";

    LatexBeautify.prototype.isPreInstalled = false;

    LatexBeautify.prototype.options = {
      LaTeX: true
    };

    LatexBeautify.prototype.buildConfigFile = function(options) {
      var config, delim, i, indentChar, len, ref;
      indentChar = options.indent_char;
      if (options.indent_with_tabs) {
        indentChar = "\\t";
      }
      config = "defaultIndent: \"" + indentChar + "\"\nalwaysLookforSplitBraces: " + (+options.always_look_for_split_braces) + "\nalwaysLookforSplitBrackets: " + (+options.always_look_for_split_brackets) + "\nindentPreamble: " + (+options.indent_preamble) + "\nremoveTrailingWhitespace: " + (+options.remove_trailing_whitespace) + "\nlookForAlignDelims:\n";
      ref = options.align_columns_in_environments;
      for (i = 0, len = ref.length; i < len; i++) {
        delim = ref[i];
        config += "\t" + delim + ": 1\n";
      }
      return config;
    };

    LatexBeautify.prototype.setUpDir = function(dirPath, text, config) {
      this.texFile = path.join(dirPath, "latex.tex");
      fs.writeFile(this.texFile, text, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.configFile = path.join(dirPath, "localSettings.yaml");
      fs.writeFile(this.configFile, config, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.logFile = path.join(dirPath, "indent.log");
      return fs.writeFile(this.logFile, "", function(err) {
        if (err) {
          return reject(err);
        }
      });
    };

    LatexBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        return temp.mkdir("latex", function(err, dirPath) {
          if (err) {
            return reject(err);
          }
          return resolve(dirPath);
        });
      }).then((function(_this) {
        return function(dirPath) {
          var run;
          _this.setUpDir(dirPath, text, _this.buildConfigFile(options));
          return run = _this.run("latexindent", ["-s", "-l", "-c=" + dirPath, _this.texFile, "-o", _this.texFile], {
            help: {
              link: "https://github.com/cmhughes/latexindent.pl"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(_this.texFile);
        };
      })(this));
    };

    return LatexBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbGF0ZXgtYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQTs7RUFHUCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozs0QkFDckIsSUFBQSxHQUFNOzs0QkFDTixJQUFBLEdBQU07OzRCQUNOLGNBQUEsR0FBZ0I7OzRCQUVoQixPQUFBLEdBQVM7TUFDUCxLQUFBLEVBQU8sSUFEQTs7OzRCQU1ULGVBQUEsR0FBaUIsU0FBQyxPQUFEO0FBQ2YsVUFBQTtNQUFBLFVBQUEsR0FBYSxPQUFPLENBQUM7TUFDckIsSUFBRyxPQUFPLENBQUMsZ0JBQVg7UUFDRSxVQUFBLEdBQWEsTUFEZjs7TUFHQSxNQUFBLEdBQVMsbUJBQUEsR0FDbUIsVUFEbkIsR0FDOEIsZ0NBRDlCLEdBRTJCLENBQUMsQ0FBQyxPQUFPLENBQUMsNEJBQVYsQ0FGM0IsR0FFa0UsZ0NBRmxFLEdBRzZCLENBQUMsQ0FBQyxPQUFPLENBQUMsOEJBQVYsQ0FIN0IsR0FHc0Usb0JBSHRFLEdBSWlCLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBVixDQUpqQixHQUkyQyw4QkFKM0MsR0FLMkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBVixDQUwzQixHQUtnRTtBQUd6RTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsTUFBQSxJQUFVLElBQUEsR0FBSyxLQUFMLEdBQVc7QUFEdkI7QUFFQSxhQUFPO0lBZlE7OzRCQXFCakIsUUFBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsTUFBaEI7TUFDUixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixXQUFuQjtNQUNYLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLE9BQWQsRUFBdUIsSUFBdkIsRUFBNkIsU0FBQyxHQUFEO1FBQzNCLElBQXNCLEdBQXRCO0FBQUEsaUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7TUFEMkIsQ0FBN0I7TUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixvQkFBbkI7TUFDZCxFQUFFLENBQUMsU0FBSCxDQUFhLElBQUMsQ0FBQSxVQUFkLEVBQTBCLE1BQTFCLEVBQWtDLFNBQUMsR0FBRDtRQUNoQyxJQUFzQixHQUF0QjtBQUFBLGlCQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O01BRGdDLENBQWxDO01BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsWUFBbkI7YUFDWCxFQUFFLENBQUMsU0FBSCxDQUFhLElBQUMsQ0FBQSxPQUFkLEVBQXVCLEVBQXZCLEVBQTJCLFNBQUMsR0FBRDtRQUN6QixJQUFzQixHQUF0QjtBQUFBLGlCQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O01BRHlCLENBQTNCO0lBUlE7OzRCQVlWLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7ZUFDWCxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVgsRUFBb0IsU0FBQyxHQUFELEVBQU0sT0FBTjtVQUNsQixJQUFzQixHQUF0QjtBQUFBLG1CQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O2lCQUNBLE9BQUEsQ0FBUSxPQUFSO1FBRmtCLENBQXBCO01BRFcsQ0FBYixDQU1BLENBQUMsSUFORCxDQU1NLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLEtBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixFQUF5QixLQUFDLENBQUEsZUFBRCxDQUFpQixPQUFqQixDQUF6QjtpQkFDQSxHQUFBLEdBQU0sS0FBQyxDQUFBLEdBQUQsQ0FBSyxhQUFMLEVBQW9CLENBQ3hCLElBRHdCLEVBRXhCLElBRndCLEVBR3hCLEtBQUEsR0FBUSxPQUhnQixFQUl4QixLQUFDLENBQUEsT0FKdUIsRUFLeEIsSUFMd0IsRUFNeEIsS0FBQyxDQUFBLE9BTnVCLENBQXBCLEVBT0g7WUFBQSxJQUFBLEVBQU07Y0FDUCxJQUFBLEVBQU0sNENBREM7YUFBTjtXQVBHO1FBRkY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTk4sQ0FtQkEsQ0FBQyxJQW5CRCxDQW1CTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0wsS0FBQyxDQUFBLFFBQUQsQ0FBVSxLQUFDLENBQUEsT0FBWDtRQURLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQW5CUDtJQURROzs7O0tBNUNpQztBQVA3QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbmZzID0gcmVxdWlyZShcImZzXCIpXG50ZW1wID0gcmVxdWlyZShcInRlbXBcIikudHJhY2soKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTGF0ZXhCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJMYXRleCBCZWF1dGlmeVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2NtaHVnaGVzL2xhdGV4aW5kZW50LnBsXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIExhVGVYOiB0cnVlXG4gIH1cblxuICAjIFRoZXJlIGFyZSB0b28gbWFueSBvcHRpb25zIHdpdGggbGF0ZXhtaywgSSBoYXZlIHRyaWVkIHRvIHNsaW0gdGhpcyBkb3duIHRvIHRoZSBtb3N0IHVzZWZ1bCBvbmVzLlxuICAjIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBjb25maWd1cmF0aW9uIGZpbGUgZm9yIGxhdGV4aW5kZW50LlxuICBidWlsZENvbmZpZ0ZpbGU6IChvcHRpb25zKSAtPlxuICAgIGluZGVudENoYXIgPSBvcHRpb25zLmluZGVudF9jaGFyXG4gICAgaWYgb3B0aW9ucy5pbmRlbnRfd2l0aF90YWJzXG4gICAgICBpbmRlbnRDaGFyID0gXCJcXFxcdFwiXG4gICAgIyArdHJ1ZSA9IDEgYW5kICtmYWxzZSA9IDBcbiAgICBjb25maWcgPSBcIlwiXCJcbiAgICAgICAgICAgICBkZWZhdWx0SW5kZW50OiBcXFwiI3tpbmRlbnRDaGFyfVxcXCJcbiAgICAgICAgICAgICBhbHdheXNMb29rZm9yU3BsaXRCcmFjZXM6ICN7K29wdGlvbnMuYWx3YXlzX2xvb2tfZm9yX3NwbGl0X2JyYWNlc31cbiAgICAgICAgICAgICBhbHdheXNMb29rZm9yU3BsaXRCcmFja2V0czogI3srb3B0aW9ucy5hbHdheXNfbG9va19mb3Jfc3BsaXRfYnJhY2tldHN9XG4gICAgICAgICAgICAgaW5kZW50UHJlYW1ibGU6ICN7K29wdGlvbnMuaW5kZW50X3ByZWFtYmxlfVxuICAgICAgICAgICAgIHJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZTogI3srb3B0aW9ucy5yZW1vdmVfdHJhaWxpbmdfd2hpdGVzcGFjZX1cbiAgICAgICAgICAgICBsb29rRm9yQWxpZ25EZWxpbXM6XFxuXG4gICAgICAgICAgICAgXCJcIlwiXG4gICAgZm9yIGRlbGltIGluIG9wdGlvbnMuYWxpZ25fY29sdW1uc19pbl9lbnZpcm9ubWVudHNcbiAgICAgIGNvbmZpZyArPSBcIlxcdCN7ZGVsaW19OiAxXFxuXCJcbiAgICByZXR1cm4gY29uZmlnXG5cbiAgIyBMYXRleGluZGVudCBhY2NlcHRzIGNvbmZpZ3VyYXRpb24gX2ZpbGVzXyBvbmx5LlxuICAjIFRoaXMgZmlsZSBoYXMgdG8gYmUgbmFtZWQgbG9jYWxTZXR0aW5ncy55YW1sIGFuZCBiZSBpbiB0aGUgc2FtZSBmb2xkZXIgYXMgdGhlIHRleCBmaWxlLlxuICAjIEl0IGFsc28gaW5zaXN0cyBvbiBjcmVhdGluZyBhIGxvZyBmaWxlIHNvbWV3aGVyZS5cbiAgIyBTbyB3ZSBzZXQgdXAgYSBkaXJlY3Rvcnkgd2l0aCBhbGwgdGhlIGZpbGVzIGluIHBsYWNlLlxuICBzZXRVcERpcjogKGRpclBhdGgsIHRleHQsIGNvbmZpZykgLT5cbiAgICBAdGV4RmlsZSA9IHBhdGguam9pbihkaXJQYXRoLCBcImxhdGV4LnRleFwiKVxuICAgIGZzLndyaXRlRmlsZSBAdGV4RmlsZSwgdGV4dCwgKGVycikgLT5cbiAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICBAY29uZmlnRmlsZSA9IHBhdGguam9pbihkaXJQYXRoLCBcImxvY2FsU2V0dGluZ3MueWFtbFwiKVxuICAgIGZzLndyaXRlRmlsZSBAY29uZmlnRmlsZSwgY29uZmlnLCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgIEBsb2dGaWxlID0gcGF0aC5qb2luKGRpclBhdGgsIFwiaW5kZW50LmxvZ1wiKVxuICAgIGZzLndyaXRlRmlsZSBAbG9nRmlsZSwgXCJcIiwgKGVycikgLT5cbiAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcblxuICAjQmVhdXRpZmllciBkb2VzIG5vdCBjdXJyZW50bHkgaGF2ZSBhIG1ldGhvZCBmb3IgY3JlYXRpbmcgZGlyZWN0b3JpZXMsIHNvIHdlIGNhbGwgdGVtcCBkaXJlY3RseS5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHRlbXAubWtkaXIoXCJsYXRleFwiLCAoZXJyLCBkaXJQYXRoKSAtPlxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgIHJlc29sdmUoZGlyUGF0aClcbiAgICAgIClcbiAgICApXG4gICAgLnRoZW4oKGRpclBhdGgpPT5cbiAgICAgIEBzZXRVcERpcihkaXJQYXRoLCB0ZXh0LCBAYnVpbGRDb25maWdGaWxlKG9wdGlvbnMpKVxuICAgICAgcnVuID0gQHJ1biBcImxhdGV4aW5kZW50XCIsIFtcbiAgICAgICAgXCItc1wiICAgICAgICAgICAgI1NpbGVudCBtb2RlXG4gICAgICAgIFwiLWxcIiAgICAgICAgICAgICNUZWxsIGxhdGV4aW5kZW50IHdlIGhhdmUgYSBsb2NhbCBjb25maWd1cmF0aW9uIGZpbGVcbiAgICAgICAgXCItYz1cIiArIGRpclBhdGggI1RlbGwgbGF0ZXhpbmRlbnQgdG8gcGxhY2UgdGhlIGxvZyBmaWxlIGluIHRoaXMgZGlyZWN0b3J5XG4gICAgICAgIEB0ZXhGaWxlXG4gICAgICAgIFwiLW9cIiAgICAgICAgICAgICNPdXRwdXQgdG8gdGhlIHNhbWUgbG9jYXRpb24gYXMgZmlsZSwgLXcgY3JlYXRlcyBhIGJhY2t1cCBmaWxlLCB3aGVyZWFzIHRoaXMgZG9lcyBub3RcbiAgICAgICAgQHRleEZpbGVcbiAgICAgIF0sIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vY21odWdoZXMvbGF0ZXhpbmRlbnQucGxcIlxuICAgICAgfVxuICAgIClcbiAgICAudGhlbiggPT5cbiAgICAgIEByZWFkRmlsZShAdGV4RmlsZSlcbiAgICApXG4iXX0=
