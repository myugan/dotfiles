(function() {
  "use strict";
  var Beautifier, PugBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PugBeautify = (function(superClass) {
    extend(PugBeautify, superClass);

    function PugBeautify() {
      return PugBeautify.__super__.constructor.apply(this, arguments);
    }

    PugBeautify.prototype.name = "Pug Beautify";

    PugBeautify.prototype.link = "https://github.com/vingorius/pug-beautify";

    PugBeautify.prototype.options = {
      Jade: {
        fill_tab: [
          'indent_char', function(indent_char) {
            return indent_char === "\t";
          }
        ],
        omit_div: true,
        tab_size: "indent_size"
      }
    };

    PugBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var error, pugBeautify;
        pugBeautify = require("pug-beautify");
        try {
          return resolve(pugBeautify(text, options));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return PugBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHVnLWJlYXV0aWZ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MEJBQ3JCLElBQUEsR0FBTTs7MEJBQ04sSUFBQSxHQUFNOzswQkFDTixPQUFBLEdBQVM7TUFFUCxJQUFBLEVBQ0U7UUFBQSxRQUFBLEVBQVU7VUFBQyxhQUFELEVBQWdCLFNBQUMsV0FBRDtBQUV4QixtQkFBUSxXQUFBLEtBQWU7VUFGQyxDQUFoQjtTQUFWO1FBSUEsUUFBQSxFQUFVLElBSlY7UUFLQSxRQUFBLEVBQVUsYUFMVjtPQUhLOzs7MEJBV1QsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFFUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7QUFDZDtpQkFDRSxPQUFBLENBQVEsV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEIsQ0FBUixFQURGO1NBQUEsY0FBQTtVQUVNO2lCQUVKLE1BQUEsQ0FBTyxLQUFQLEVBSkY7O01BRmtCLENBQWI7SUFGQzs7OztLQWQrQjtBQUgzQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQdWdCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQdWcgQmVhdXRpZnlcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92aW5nb3JpdXMvcHVnLWJlYXV0aWZ5XCJcbiAgb3B0aW9uczoge1xuICAgICMgQXBwbHkgdGhlc2Ugb3B0aW9ucyBmaXJzdCAvIGdsb2JhbGx5LCBmb3IgYWxsIGxhbmd1YWdlc1xuICAgIEphZGU6XG4gICAgICBmaWxsX3RhYjogWydpbmRlbnRfY2hhcicsIChpbmRlbnRfY2hhcikgLT5cbiAgICAgICAgIyBTaG91bGQgdXNlIHRhYnM/XG4gICAgICAgIHJldHVybiAoaW5kZW50X2NoYXIgaXMgXCJcXHRcIilcbiAgICAgIF1cbiAgICAgIG9taXRfZGl2OiB0cnVlXG4gICAgICB0YWJfc2l6ZTogXCJpbmRlbnRfc2l6ZVwiXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgcHVnQmVhdXRpZnkgPSByZXF1aXJlKFwicHVnLWJlYXV0aWZ5XCIpXG4gICAgICB0cnlcbiAgICAgICAgcmVzb2x2ZShwdWdCZWF1dGlmeSh0ZXh0LCBvcHRpb25zKSlcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICMgRXJyb3Igb2NjdXJyZWRcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgIClcbiJdfQ==
