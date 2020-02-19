
/*
Requires terraform installed
 */

(function() {
  "use strict";
  var Beautifier, Terraformfmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Terraformfmt = (function(superClass) {
    extend(Terraformfmt, superClass);

    function Terraformfmt() {
      return Terraformfmt.__super__.constructor.apply(this, arguments);
    }

    Terraformfmt.prototype.name = "terraformfmt";

    Terraformfmt.prototype.link = "https://www.terraform.io/docs/commands/fmt.html";

    Terraformfmt.prototype.options = {
      Terraform: false
    };

    Terraformfmt.prototype.executables = [
      {
        name: "Terraform",
        cmd: "terraform",
        homepage: "https://www.terraform.io",
        installation: "https://www.terraform.io",
        version: {
          parse: function(text) {
            return text.match(/Terraform v(\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "hashicorp/terraform"
        }
      }
    ];

    Terraformfmt.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.exe("terraform").run(["fmt", tempFile = this.tempFile("input", text)]).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Terraformfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdGVycmFmb3JtZm10LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSx3QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MkJBQ3JCLElBQUEsR0FBTTs7MkJBQ04sSUFBQSxHQUFNOzsyQkFFTixPQUFBLEdBQVM7TUFDUCxTQUFBLEVBQVcsS0FESjs7OzJCQUlULFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFdBRFI7UUFFRSxHQUFBLEVBQUssV0FGUDtRQUdFLFFBQUEsRUFBVSwwQkFIWjtRQUlFLFlBQUEsRUFBYywwQkFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsNEJBQVgsQ0FBeUMsQ0FBQSxDQUFBO1VBQW5ELENBREE7U0FMWDtRQVFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyxxQkFERDtTQVJWO09BRFc7OzsyQkFlYixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsQ0FBaUIsQ0FBQyxHQUFsQixDQUFzQixDQUNwQixLQURvQixFQUVwQixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRlMsQ0FBdEIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlI7SUFEUTs7OztLQXZCZ0M7QUFQNUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIHRlcnJhZm9ybSBpbnN0YWxsZWRcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVGVycmFmb3JtZm10IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcInRlcnJhZm9ybWZtdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly93d3cudGVycmFmb3JtLmlvL2RvY3MvY29tbWFuZHMvZm10Lmh0bWxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBUZXJyYWZvcm06IGZhbHNlXG4gIH1cblxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiVGVycmFmb3JtXCJcbiAgICAgIGNtZDogXCJ0ZXJyYWZvcm1cIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cudGVycmFmb3JtLmlvXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy50ZXJyYWZvcm0uaW9cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL1RlcnJhZm9ybSB2KFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcImhhc2hpY29ycC90ZXJyYWZvcm1cIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQGV4ZShcInRlcnJhZm9ybVwiKS5ydW4oW1xuICAgICAgXCJmbXRcIlxuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==
