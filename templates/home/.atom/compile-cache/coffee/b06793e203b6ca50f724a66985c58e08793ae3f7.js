
/*
Requires http://golang.org/cmd/gofmt/
 */

(function() {
  "use strict";
  var Beautifier, Gofmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Gofmt = (function(superClass) {
    extend(Gofmt, superClass);

    function Gofmt() {
      return Gofmt.__super__.constructor.apply(this, arguments);
    }

    Gofmt.prototype.name = "gofmt";

    Gofmt.prototype.link = "https://golang.org/cmd/gofmt/";

    Gofmt.prototype.isPreInstalled = false;

    Gofmt.prototype.options = {
      Go: true
    };

    Gofmt.prototype.beautify = function(text, language, options) {
      return this.run("gofmt", [this.tempFile("input", text)]);
    };

    return Gofmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZ29mbXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLGlCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztvQkFDckIsSUFBQSxHQUFNOztvQkFDTixJQUFBLEdBQU07O29CQUNOLGNBQUEsR0FBZ0I7O29CQUVoQixPQUFBLEdBQVM7TUFDUCxFQUFBLEVBQUksSUFERzs7O29CQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsQ0FDWixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEWSxDQUFkO0lBRFE7Ozs7S0FUeUI7QUFQckMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHA6Ly9nb2xhbmcub3JnL2NtZC9nb2ZtdC9cbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR29mbXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiZ29mbXRcIlxuICBsaW5rOiBcImh0dHBzOi8vZ29sYW5nLm9yZy9jbWQvZ29mbXQvXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIEdvOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJnb2ZtdFwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSlcbiJdfQ==
