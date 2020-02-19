(function() {
  "use strict";
  var Beautifier, CoffeeFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = CoffeeFormatter = (function(superClass) {
    extend(CoffeeFormatter, superClass);

    function CoffeeFormatter() {
      return CoffeeFormatter.__super__.constructor.apply(this, arguments);
    }

    CoffeeFormatter.prototype.name = "Coffee Formatter";

    CoffeeFormatter.prototype.link = "https://github.com/Glavin001/Coffee-Formatter";

    CoffeeFormatter.prototype.options = {
      CoffeeScript: false
    };

    CoffeeFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CF, curr, i, len, lines, p, result, resultArr;
        CF = require("coffee-formatter");
        lines = text.split("\n");
        resultArr = [];
        i = 0;
        len = lines.length;
        while (i < len) {
          curr = lines[i];
          p = CF.formatTwoSpaceOperator(curr);
          p = CF.formatOneSpaceOperator(p);
          p = CF.shortenSpaces(p);
          resultArr.push(p);
          i++;
        }
        result = resultArr.join("\n");
        return resolve(result);
      });
    };

    return CoffeeFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY29mZmVlLWZvcm1hdHRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsMkJBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzhCQUVyQixJQUFBLEdBQU07OzhCQUNOLElBQUEsR0FBTTs7OEJBRU4sT0FBQSxHQUFTO01BQ1AsWUFBQSxFQUFjLEtBRFA7Ozs4QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUVSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFFbEIsWUFBQTtRQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsa0JBQVI7UUFDTCxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO1FBQ1IsU0FBQSxHQUFZO1FBQ1osQ0FBQSxHQUFJO1FBQ0osR0FBQSxHQUFNLEtBQUssQ0FBQztBQUVaLGVBQU0sQ0FBQSxHQUFJLEdBQVY7VUFDRSxJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUE7VUFDYixDQUFBLEdBQUksRUFBRSxDQUFDLHNCQUFILENBQTBCLElBQTFCO1VBQ0osQ0FBQSxHQUFJLEVBQUUsQ0FBQyxzQkFBSCxDQUEwQixDQUExQjtVQUNKLENBQUEsR0FBSSxFQUFFLENBQUMsYUFBSCxDQUFpQixDQUFqQjtVQUNKLFNBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBZjtVQUNBLENBQUE7UUFORjtRQU9BLE1BQUEsR0FBUyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWY7ZUFDVCxPQUFBLENBQVEsTUFBUjtNQWhCa0IsQ0FBYjtJQUZDOzs7O0tBVG1DO0FBSC9DIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvZmZlZUZvcm1hdHRlciBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcIkNvZmZlZSBGb3JtYXR0ZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvQ29mZmVlLUZvcm1hdHRlclwiXG5cbiAgb3B0aW9uczoge1xuICAgIENvZmZlZVNjcmlwdDogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG5cbiAgICAgIENGID0gcmVxdWlyZShcImNvZmZlZS1mb3JtYXR0ZXJcIilcbiAgICAgIGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKVxuICAgICAgcmVzdWx0QXJyID0gW11cbiAgICAgIGkgPSAwXG4gICAgICBsZW4gPSBsaW5lcy5sZW5ndGhcblxuICAgICAgd2hpbGUgaSA8IGxlblxuICAgICAgICBjdXJyID0gbGluZXNbaV1cbiAgICAgICAgcCA9IENGLmZvcm1hdFR3b1NwYWNlT3BlcmF0b3IoY3VycilcbiAgICAgICAgcCA9IENGLmZvcm1hdE9uZVNwYWNlT3BlcmF0b3IocClcbiAgICAgICAgcCA9IENGLnNob3J0ZW5TcGFjZXMocClcbiAgICAgICAgcmVzdWx0QXJyLnB1c2ggcFxuICAgICAgICBpKytcbiAgICAgIHJlc3VsdCA9IHJlc3VsdEFyci5qb2luKFwiXFxuXCIpXG4gICAgICByZXNvbHZlIHJlc3VsdFxuXG4gICAgKVxuIl19
