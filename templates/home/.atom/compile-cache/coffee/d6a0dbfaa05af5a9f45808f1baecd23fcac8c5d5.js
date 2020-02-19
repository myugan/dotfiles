(function() {
  "use strict";
  var Beautifier, CoffeeFmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = CoffeeFmt = (function(superClass) {
    extend(CoffeeFmt, superClass);

    function CoffeeFmt() {
      return CoffeeFmt.__super__.constructor.apply(this, arguments);
    }

    CoffeeFmt.prototype.name = "coffee-fmt";

    CoffeeFmt.prototype.link = "https://github.com/sterpe/coffee-fmt";

    CoffeeFmt.prototype.options = {
      CoffeeScript: {
        tab: [
          "indent_size", "indent_char", "indent_with_tabs", function(indentSize, indentChar, indentWithTabs) {
            if (indentWithTabs) {
              return "\t";
            }
            return Array(indentSize + 1).join(indentChar);
          }
        ]
      }
    };

    CoffeeFmt.prototype.beautify = function(text, language, options) {
      this.verbose('beautify', language, options);
      return new this.Promise(function(resolve, reject) {
        var e, fmt, results;
        options.newLine = "\n";
        fmt = require('coffee-fmt');
        try {
          results = fmt.format(text, options);
          return resolve(results);
        } catch (error) {
          e = error;
          return reject(e);
        }
      });
    };

    return CoffeeFmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY29mZmVlLWZtdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BRVAsWUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLO1VBQUMsYUFBRCxFQUNILGFBREcsRUFDWSxrQkFEWixFQUVILFNBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUIsY0FBekI7WUFDRSxJQUFlLGNBQWY7QUFBQSxxQkFBTyxLQUFQOzttQkFDQSxLQUFBLENBQU0sVUFBQSxHQUFXLENBQWpCLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsVUFBekI7VUFGRixDQUZHO1NBQUw7T0FISzs7O3dCQVdULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO01BQ1IsSUFBQyxDQUFBLE9BQUQsQ0FBUyxVQUFULEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CO0FBQ0EsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUVsQixZQUFBO1FBQUEsT0FBTyxDQUFDLE9BQVIsR0FBa0I7UUFFbEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSO0FBRU47VUFDRSxPQUFBLEdBQVUsR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFYLEVBQWlCLE9BQWpCO2lCQUVWLE9BQUEsQ0FBUSxPQUFSLEVBSEY7U0FBQSxhQUFBO1VBSU07aUJBQ0osTUFBQSxDQUFPLENBQVAsRUFMRjs7TUFOa0IsQ0FBYjtJQUZDOzs7O0tBZjZCO0FBSHpDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvZmZlZUZtdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJjb2ZmZWUtZm10XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vc3RlcnBlL2NvZmZlZS1mbXRcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICAjIEFwcGx5IGxhbmd1YWdlLXNwZWNpZmljIG9wdGlvbnNcbiAgICBDb2ZmZWVTY3JpcHQ6XG4gICAgICB0YWI6IFtcImluZGVudF9zaXplXCIsIFxcXG4gICAgICAgIFwiaW5kZW50X2NoYXJcIiwgXCJpbmRlbnRfd2l0aF90YWJzXCIsIFxcXG4gICAgICAgIChpbmRlbnRTaXplLCBpbmRlbnRDaGFyLCBpbmRlbnRXaXRoVGFicykgLT5cbiAgICAgICAgICByZXR1cm4gXCJcXHRcIiBpZiBpbmRlbnRXaXRoVGFic1xuICAgICAgICAgIEFycmF5KGluZGVudFNpemUrMSkuam9pbihpbmRlbnRDaGFyKVxuICAgICAgXVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAdmVyYm9zZSgnYmVhdXRpZnknLCBsYW5ndWFnZSwgb3B0aW9ucylcbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAjIEFkZCBuZXdMaW5lIG9wdGlvblxuICAgICAgb3B0aW9ucy5uZXdMaW5lID0gXCJcXG5cIlxuICAgICAgIyBSZXF1aXJlXG4gICAgICBmbXQgPSByZXF1aXJlKCdjb2ZmZWUtZm10JylcbiAgICAgICMgRm9ybWF0IVxuICAgICAgdHJ5XG4gICAgICAgIHJlc3VsdHMgPSBmbXQuZm9ybWF0KHRleHQsIG9wdGlvbnMpXG4gICAgICAgICMgUmV0dXJuIGJlYXV0aWZpZWQgQ29mZmVlU2NyaXB0IGNvZGVcbiAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgY2F0Y2ggZVxuICAgICAgICByZWplY3QoZSlcbiAgICApXG4iXX0=
