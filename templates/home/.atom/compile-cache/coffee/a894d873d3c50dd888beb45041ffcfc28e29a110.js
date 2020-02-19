
/*
Requires https://github.com/commercialhaskell/hindent
 */

(function() {
  "use strict";
  var Beautifier, Hindent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Hindent = (function(superClass) {
    extend(Hindent, superClass);

    function Hindent() {
      return Hindent.__super__.constructor.apply(this, arguments);
    }

    Hindent.prototype.name = "hindent";

    Hindent.prototype.link = "https://github.com/commercialhaskell/hindent";

    Hindent.prototype.isPreInstalled = false;

    Hindent.prototype.options = {
      Haskell: false
    };

    Hindent.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("hindent", [tempFile = this.tempFile("temp", text)], {
        help: {
          link: "https://github.com/commercialhaskell/hindent"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Hindent;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvaGluZGVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsbUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBQ04sY0FBQSxHQUFnQjs7c0JBRWhCLE9BQUEsR0FBUztNQUNQLE9BQUEsRUFBUyxLQURGOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLEVBQWdCLENBQ2QsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQURHLENBQWhCLEVBRUs7UUFDRCxJQUFBLEVBQU07VUFDSixJQUFBLEVBQU0sOENBREY7U0FETDtPQUZMLENBT0UsQ0FBQyxJQVBILENBT1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVBSO0lBRFE7Ozs7S0FUMkI7QUFQdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9jb21tZXJjaWFsaGFza2VsbC9oaW5kZW50XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhpbmRlbnQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiaGluZGVudFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbW1lcmNpYWxoYXNrZWxsL2hpbmRlbnRcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgSGFza2VsbDogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcImhpbmRlbnRcIiwgW1xuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICBdLCB7XG4gICAgICAgIGhlbHA6IHtcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9jb21tZXJjaWFsaGFza2VsbC9oaW5kZW50XCJcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==
