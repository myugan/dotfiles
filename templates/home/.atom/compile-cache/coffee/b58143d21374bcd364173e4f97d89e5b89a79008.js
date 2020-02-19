
/*
Requires https://godoc.org/golang.org/x/tools/cmd/goimports
 */

(function() {
  "use strict";
  var Beautifier, Goimports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Goimports = (function(superClass) {
    extend(Goimports, superClass);

    function Goimports() {
      return Goimports.__super__.constructor.apply(this, arguments);
    }

    Goimports.prototype.name = "goimports";

    Goimports.prototype.link = "https://godoc.org/golang.org/x/tools/cmd/goimports";

    Goimports.prototype.executables = [
      {
        name: "goimports",
        cmd: "goimports",
        homepage: "https://godoc.org/golang.org/x/tools/cmd/goimports",
        installation: "https://godoc.org/golang.org/x/tools/cmd/goimports",
        version: {
          args: ['--help'],
          parse: function(text) {
            return text.indexOf("usage: goimports") !== -1 && "0.0.0";
          },
          runOptions: {
            ignoreReturnCode: true,
            returnStderr: true
          }
        },
        docker: {
          image: "unibeautify/goimports"
        }
      }
    ];

    Goimports.prototype.options = {
      Go: false
    };

    Goimports.prototype.beautify = function(text, language, options) {
      return this.exe("goimports").run([this.tempFile("input", text)]);
    };

    return Goimports;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZ29pbXBvcnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxxQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxXQURSO1FBRUUsR0FBQSxFQUFLLFdBRlA7UUFHRSxRQUFBLEVBQVUsb0RBSFo7UUFJRSxZQUFBLEVBQWMsb0RBSmhCO1FBS0UsT0FBQSxFQUFTO1VBRVAsSUFBQSxFQUFNLENBQUMsUUFBRCxDQUZDO1VBR1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsT0FBTCxDQUFhLGtCQUFiLENBQUEsS0FBc0MsQ0FBQyxDQUF2QyxJQUE2QztVQUF2RCxDQUhBO1VBSVAsVUFBQSxFQUFZO1lBQ1YsZ0JBQUEsRUFBa0IsSUFEUjtZQUVWLFlBQUEsRUFBYyxJQUZKO1dBSkw7U0FMWDtRQWNFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyx1QkFERDtTQWRWO09BRFc7Ozt3QkFxQmIsT0FBQSxHQUFTO01BQ1AsRUFBQSxFQUFJLEtBREc7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxDQUFpQixDQUFDLEdBQWxCLENBQXNCLENBQ3BCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURvQixDQUF0QjtJQURROzs7O0tBNUI2QjtBQVB6QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9nb2RvYy5vcmcvZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHNcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR29pbXBvcnRzIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImdvaW1wb3J0c1wiXG4gIGxpbms6IFwiaHR0cHM6Ly9nb2RvYy5vcmcvZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHNcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiZ29pbXBvcnRzXCJcbiAgICAgIGNtZDogXCJnb2ltcG9ydHNcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9nb2RvYy5vcmcvZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHNcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ29kb2Mub3JnL2dvbGFuZy5vcmcveC90b29scy9jbWQvZ29pbXBvcnRzXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgIyBEb2VzIG5vdCBkaXNwbGF5IHZlcnNpb25cbiAgICAgICAgYXJnczogWyctLWhlbHAnXSxcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0LmluZGV4T2YoXCJ1c2FnZTogZ29pbXBvcnRzXCIpIGlzbnQgLTEgYW5kIFwiMC4wLjBcIixcbiAgICAgICAgcnVuT3B0aW9uczoge1xuICAgICAgICAgIGlnbm9yZVJldHVybkNvZGU6IHRydWUsXG4gICAgICAgICAgcmV0dXJuU3RkZXJyOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9nb2ltcG9ydHNcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBHbzogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQGV4ZShcImdvaW1wb3J0c1wiKS5ydW4oW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0pXG4iXX0=
