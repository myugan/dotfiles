(function() {
  "use strict";
  var Beautifier, NginxBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = NginxBeautify = (function(superClass) {
    extend(NginxBeautify, superClass);

    function NginxBeautify() {
      return NginxBeautify.__super__.constructor.apply(this, arguments);
    }

    NginxBeautify.prototype.name = "Nginx Beautify";

    NginxBeautify.prototype.link = "https://github.com/denysvitali/nginxbeautify";

    NginxBeautify.prototype.options = {
      Nginx: {
        spaces: [
          "indent_with_tabs", "indent_size", "indent_char", function(indent_with_tabs, indent_size, indent_char) {
            if (indent_with_tabs || indent_char === "\t") {
              return 0;
            } else {
              return indent_size;
            }
          }
        ],
        tabs: [
          "indent_with_tabs", "indent_size", "indent_char", function(indent_with_tabs, indent_size, indent_char) {
            if (indent_with_tabs || indent_char === "\t") {
              return indent_size;
            } else {
              return 0;
            }
          }
        ],
        dontJoinCurlyBracet: true
      }
    };

    NginxBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var Beautify, error, instance;
        Beautify = require("nginxbeautify");
        instance = new Beautify(options);
        try {
          return resolve(instance.parse(text));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return NginxBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbmdpbngtYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozs0QkFDckIsSUFBQSxHQUFNOzs0QkFDTixJQUFBLEdBQU07OzRCQUVOLE9BQUEsR0FBUztNQUNQLEtBQUEsRUFBTztRQUNMLE1BQUEsRUFBUTtVQUFDLGtCQUFELEVBQXFCLGFBQXJCLEVBQW9DLGFBQXBDLEVBQW1ELFNBQUMsZ0JBQUQsRUFBbUIsV0FBbkIsRUFBZ0MsV0FBaEM7WUFDekQsSUFBRyxnQkFBQSxJQUFvQixXQUFBLEtBQWUsSUFBdEM7cUJBQ0UsRUFERjthQUFBLE1BQUE7cUJBR0UsWUFIRjs7VUFEeUQsQ0FBbkQ7U0FESDtRQU9MLElBQUEsRUFBTTtVQUFDLGtCQUFELEVBQXFCLGFBQXJCLEVBQW9DLGFBQXBDLEVBQW1ELFNBQUMsZ0JBQUQsRUFBbUIsV0FBbkIsRUFBZ0MsV0FBaEM7WUFDdkQsSUFBRyxnQkFBQSxJQUFvQixXQUFBLEtBQWUsSUFBdEM7cUJBQ0UsWUFERjthQUFBLE1BQUE7cUJBR0UsRUFIRjs7VUFEdUQsQ0FBbkQ7U0FQRDtRQWFMLG1CQUFBLEVBQXFCLElBYmhCO09BREE7Ozs0QkFrQlQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFFUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGVBQVI7UUFDWCxRQUFBLEdBQVcsSUFBSSxRQUFKLENBQWEsT0FBYjtBQUNYO2lCQUNFLE9BQUEsQ0FBUSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsQ0FBUixFQURGO1NBQUEsY0FBQTtVQUVNO2lCQUVKLE1BQUEsQ0FBTyxLQUFQLEVBSkY7O01BSGtCLENBQWI7SUFGQzs7OztLQXRCaUM7QUFIN0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTmdpbnhCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJOZ2lueCBCZWF1dGlmeVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2Rlbnlzdml0YWxpL25naW54YmVhdXRpZnlcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBOZ2lueDoge1xuICAgICAgc3BhY2VzOiBbXCJpbmRlbnRfd2l0aF90YWJzXCIsIFwiaW5kZW50X3NpemVcIiwgXCJpbmRlbnRfY2hhclwiLCAoaW5kZW50X3dpdGhfdGFicywgaW5kZW50X3NpemUsIGluZGVudF9jaGFyKSAtPlxuICAgICAgICBpZiBpbmRlbnRfd2l0aF90YWJzIG9yIGluZGVudF9jaGFyIGlzIFwiXFx0XCJcbiAgICAgICAgICAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbmRlbnRfc2l6ZVxuICAgICAgXVxuICAgICAgdGFiczogW1wiaW5kZW50X3dpdGhfdGFic1wiLCBcImluZGVudF9zaXplXCIsIFwiaW5kZW50X2NoYXJcIiwgKGluZGVudF93aXRoX3RhYnMsIGluZGVudF9zaXplLCBpbmRlbnRfY2hhcikgLT5cbiAgICAgICAgaWYgaW5kZW50X3dpdGhfdGFicyBvciBpbmRlbnRfY2hhciBpcyBcIlxcdFwiXG4gICAgICAgICAgaW5kZW50X3NpemVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIDBcbiAgICAgIF1cbiAgICAgIGRvbnRKb2luQ3VybHlCcmFjZXQ6IHRydWVcbiAgICB9XG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgQmVhdXRpZnkgPSByZXF1aXJlKFwibmdpbnhiZWF1dGlmeVwiKVxuICAgICAgaW5zdGFuY2UgPSBuZXcgQmVhdXRpZnkob3B0aW9ucylcbiAgICAgIHRyeVxuICAgICAgICByZXNvbHZlKGluc3RhbmNlLnBhcnNlKHRleHQpKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgIyBFcnJvciBvY2N1cnJlZFxuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgKVxuIl19
