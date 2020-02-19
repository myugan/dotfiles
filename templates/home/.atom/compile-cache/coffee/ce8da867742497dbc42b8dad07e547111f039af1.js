
/*
Requires http://hhvm.com/
 */

(function() {
  "use strict";
  var Beautifier, HhFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = HhFormat = (function(superClass) {
    extend(HhFormat, superClass);

    function HhFormat() {
      return HhFormat.__super__.constructor.apply(this, arguments);
    }

    HhFormat.prototype.name = "hh_format";

    HhFormat.prototype.link = "http://hhvm.com/";

    HhFormat.prototype.isPreInstalled = false;

    HhFormat.prototype.options = {
      PHP: false
    };

    HhFormat.prototype.beautify = function(text, language, options) {
      return this.run("hh_format", [this.tempFile("input", text)], {
        help: {
          link: "http://hhvm.com/"
        }
      }).then(function(output) {
        if (output.trim()) {
          return output;
        } else {
          return this.Promise.resolve(new Error("hh_format returned an empty output."));
        }
      });
    };

    return HhFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvaGhfZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxvQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7dUJBQ3JCLElBQUEsR0FBTTs7dUJBQ04sSUFBQSxHQUFNOzt1QkFDTixjQUFBLEdBQWdCOzt1QkFFaEIsT0FBQSxHQUNFO01BQUEsR0FBQSxFQUFLLEtBQUw7Ozt1QkFFRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxFQUFrQixDQUNoQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEZ0IsQ0FBbEIsRUFHQTtRQUNFLElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSxrQkFERjtTQURSO09BSEEsQ0FPRSxDQUFDLElBUEgsQ0FPUSxTQUFDLE1BQUQ7UUFHTixJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBSDtpQkFDRSxPQURGO1NBQUEsTUFBQTtpQkFHRSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBaUIsSUFBSSxLQUFKLENBQVUscUNBQVYsQ0FBakIsRUFIRjs7TUFITSxDQVBSO0lBRFE7Ozs7S0FSNEI7QUFQeEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHA6Ly9oaHZtLmNvbS9cbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSGhGb3JtYXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiaGhfZm9ybWF0XCJcbiAgbGluazogXCJodHRwOi8vaGh2bS5jb20vXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczpcbiAgICBQSFA6IGZhbHNlXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwiaGhfZm9ybWF0XCIsIFtcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgXSxcbiAgICB7XG4gICAgICBoZWxwOiB7XG4gICAgICAgIGxpbms6IFwiaHR0cDovL2hodm0uY29tL1wiXG4gICAgICB9XG4gICAgfSkudGhlbigob3V0cHV0KSAtPlxuICAgICAgIyBoaF9mb3JtYXQgY2FuIGV4aXQgd2l0aCBzdGF0dXMgMCBhbmQgbm8gb3V0cHV0IGZvciBzb21lIGZpbGVzIHdoaWNoXG4gICAgICAjIGl0IGRvZXNuJ3QgZm9ybWF0LiAgSW4gdGhhdCBjYXNlIHdlIGp1c3QgcmV0dXJuIG9yaWdpbmFsIHRleHQuXG4gICAgICBpZiBvdXRwdXQudHJpbSgpXG4gICAgICAgIG91dHB1dFxuICAgICAgZWxzZVxuICAgICAgICBAUHJvbWlzZS5yZXNvbHZlKG5ldyBFcnJvcihcImhoX2Zvcm1hdCByZXR1cm5lZCBhbiBlbXB0eSBvdXRwdXQuXCIpKVxuICAgIClcbiJdfQ==
