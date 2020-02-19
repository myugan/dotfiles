
/*
Requires https://github.com/OCamlPro/ocp-indent
 */

(function() {
  "use strict";
  var Beautifier, OCPIndent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = OCPIndent = (function(superClass) {
    extend(OCPIndent, superClass);

    function OCPIndent() {
      return OCPIndent.__super__.constructor.apply(this, arguments);
    }

    OCPIndent.prototype.name = "ocp-indent";

    OCPIndent.prototype.link = "https://www.typerex.org/ocp-indent.html";

    OCPIndent.prototype.executables = [
      {
        name: "ocp-indent",
        cmd: "ocp-indent",
        homepage: "https://www.typerex.org/ocp-indent.html",
        installation: "https://www.typerex.org/ocp-indent.html#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/(\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/(\d+\.\d+)/)[1] + ".0";
            }
          }
        },
        docker: {
          image: "unibeautify/ocp-indent"
        }
      }
    ];

    OCPIndent.prototype.options = {
      OCaml: true
    };

    OCPIndent.prototype.beautify = function(text, language, options) {
      return this.run("ocp-indent", [this.tempFile("input", text)], {
        help: {
          link: "https://www.typerex.org/ocp-indent.html"
        }
      });
    };

    return OCPIndent;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvb2NwLWluZGVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEscUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sWUFEUjtRQUVFLEdBQUEsRUFBSyxZQUZQO1FBR0UsUUFBQSxFQUFVLHlDQUhaO1FBSUUsWUFBQSxFQUFjLHNEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFDTDtxQkFDRSxJQUFJLENBQUMsS0FBTCxDQUFXLGlCQUFYLENBQThCLENBQUEsQ0FBQSxFQURoQzthQUFBLGFBQUE7cUJBR0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYLENBQXlCLENBQUEsQ0FBQSxDQUF6QixHQUE4QixLQUhoQzs7VUFESyxDQURBO1NBTFg7UUFZRSxNQUFBLEVBQVE7VUFDTixLQUFBLEVBQU8sd0JBREQ7U0FaVjtPQURXOzs7d0JBbUJiLE9BQUEsR0FBUztNQUNQLEtBQUEsRUFBTyxJQURBOzs7d0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLFlBQUwsRUFBbUIsQ0FDakIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGlCLENBQW5CLEVBRUs7UUFDRCxJQUFBLEVBQU07VUFDSixJQUFBLEVBQU0seUNBREY7U0FETDtPQUZMO0lBRFE7Ozs7S0ExQjZCO0FBUHpDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vT0NhbWxQcm8vb2NwLWluZGVudFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBPQ1BJbmRlbnQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwib2NwLWluZGVudFwiXG4gIGxpbms6IFwiaHR0cHM6Ly93d3cudHlwZXJleC5vcmcvb2NwLWluZGVudC5odG1sXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIm9jcC1pbmRlbnRcIlxuICAgICAgY21kOiBcIm9jcC1pbmRlbnRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cudHlwZXJleC5vcmcvb2NwLWluZGVudC5odG1sXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy50eXBlcmV4Lm9yZy9vY3AtaW5kZW50Lmh0bWwjaW5zdGFsbGF0aW9uXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPlxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgdGV4dC5tYXRjaCgvKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgICAgIGNhdGNoXG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC8oXFxkK1xcLlxcZCspLylbMV0gKyBcIi4wXCJcbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9vY3AtaW5kZW50XCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgT0NhbWw6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcIm9jcC1pbmRlbnRcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cudHlwZXJleC5vcmcvb2NwLWluZGVudC5odG1sXCJcbiAgICAgICAgfVxuICAgICAgfSkiXX0=
