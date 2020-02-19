
/*
Requires https://github.com/lspitzner/brittany
 */

(function() {
  "use strict";
  var Beautifier, Brittany,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Brittany = (function(superClass) {
    extend(Brittany, superClass);

    function Brittany() {
      return Brittany.__super__.constructor.apply(this, arguments);
    }

    Brittany.prototype.name = "brittany";

    Brittany.prototype.link = "https://github.com/lspitzner/brittany";

    Brittany.prototype.isPreInstalled = false;

    Brittany.prototype.options = {
      Haskell: false
    };

    Brittany.prototype.beautify = function(text, language, options) {
      return this.run("brittany", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/lspitzner/brittany"
        }
      });
    };

    return Brittany;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYnJpdHRhbnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG9CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt1QkFDckIsSUFBQSxHQUFNOzt1QkFDTixJQUFBLEdBQU07O3VCQUNOLGNBQUEsR0FBZ0I7O3VCQUVoQixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVMsS0FERjs7O3VCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQ2YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGUsQ0FBakIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx1Q0FERjtTQURMO09BRkw7SUFEUTs7OztLQVQ0QjtBQVB4QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2xzcGl0em5lci9icml0dGFueVxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCcml0dGFueSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJicml0dGFueVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2xzcGl0em5lci9icml0dGFueVwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBIYXNrZWxsOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwiYnJpdHRhbnlcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2xzcGl0em5lci9icml0dGFueVwiXG4gICAgICAgIH1cbiAgICAgIH0pXG4iXX0=
