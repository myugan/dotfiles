(function() {
  "use strict";
  var Beautifier, Cljfmt, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  Beautifier = require('../beautifier');

  module.exports = Cljfmt = (function(superClass) {
    extend(Cljfmt, superClass);

    function Cljfmt() {
      return Cljfmt.__super__.constructor.apply(this, arguments);
    }

    Cljfmt.prototype.name = "cljfmt";

    Cljfmt.prototype.link = "https://github.com/snoe/node-cljfmt";

    Cljfmt.prototype.options = {
      Clojure: false
    };

    Cljfmt.prototype.beautify = function(text, language, options) {
      var cljfmt, formatPath;
      formatPath = path.resolve(__dirname, "fmt.edn");
      cljfmt = path.resolve(__dirname, "..", "..", "..", "node_modules/.bin/cljfmt");
      return this.tempFile("input", text).then((function(_this) {
        return function(filePath) {
          return _this.run(cljfmt, [filePath, "--edn=" + formatPath]).then(function() {
            return _this.readFile(filePath);
          });
        };
      })(this));
    };

    return Cljfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY2xqZm10L2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOzs7RUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3FCQUVyQixJQUFBLEdBQU07O3FCQUNOLElBQUEsR0FBTTs7cUJBRU4sT0FBQSxHQUFTO01BQ1AsT0FBQSxFQUFTLEtBREY7OztxQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLFNBQXhCO01BQ2IsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQyxJQUFwQyxFQUEwQywwQkFBMUM7YUFDVCxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtpQkFDNUIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLEVBQWEsQ0FDWCxRQURXLEVBRVgsUUFBQSxHQUFXLFVBRkEsQ0FBYixDQUdFLENBQUMsSUFISCxDQUdRLFNBQUE7bUJBQ04sS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBRE0sQ0FIUjtRQUQ0QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7SUFIUTs7OztLQVQwQjtBQUp0QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ2xqZm10IGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6IFwiY2xqZm10XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vc25vZS9ub2RlLWNsamZtdFwiXG5cbiAgb3B0aW9uczoge1xuICAgIENsb2p1cmU6IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIGZvcm1hdFBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImZtdC5lZG5cIilcbiAgICBjbGpmbXQgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCIuLlwiLCBcIm5vZGVfbW9kdWxlcy8uYmluL2NsamZtdFwiKVxuICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpLnRoZW4oKGZpbGVQYXRoKSA9PlxuICAgICAgQHJ1bihjbGpmbXQsIFtcbiAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIFwiLS1lZG49XCIgKyBmb3JtYXRQYXRoXG4gICAgICBdKS50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZShmaWxlUGF0aCkpKVxuIl19
