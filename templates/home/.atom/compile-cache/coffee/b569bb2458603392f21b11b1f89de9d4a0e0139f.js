
/*
Requires [formatR](https://github.com/yihui/formatR)
 */

(function() {
  var Beautifier, R, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  module.exports = R = (function(superClass) {
    extend(R, superClass);

    function R() {
      return R.__super__.constructor.apply(this, arguments);
    }

    R.prototype.name = "formatR";

    R.prototype.link = "https://github.com/yihui/formatR";

    R.prototype.executables = [
      {
        name: "Rscript",
        cmd: "rscript",
        homepage: "https://github.com/yihui/formatR",
        installation: "https://github.com/yihui/formatR",
        version: {
          parse: function(text) {
            return text.match(/version (\d+\.\d+\.\d+) /)[1];
          },
          runOptions: {
            returnStderr: true
          }
        },
        docker: {
          image: "unibeautify/rscript"
        }
      }
    ];

    R.prototype.options = {
      R: true
    };

    R.prototype.beautify = function(text, language, options) {
      var r_beautifier, rscript;
      rscript = this.exe("rscript");
      r_beautifier = path.resolve(__dirname, "formatR.r");
      return rscript.run([r_beautifier, options.indent_size, this.tempFile("input", text)]);
    };

    return R;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZm9ybWF0Ui9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7OztFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUDs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7Z0JBQ3JCLElBQUEsR0FBTTs7Z0JBQ04sSUFBQSxHQUFNOztnQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxTQURSO1FBRUUsR0FBQSxFQUFLLFNBRlA7UUFHRSxRQUFBLEVBQVUsa0NBSFo7UUFJRSxZQUFBLEVBQWMsa0NBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLDBCQUFYLENBQXVDLENBQUEsQ0FBQTtVQUFqRCxDQURBO1VBRVAsVUFBQSxFQUFZO1lBQ1YsWUFBQSxFQUFjLElBREo7V0FGTDtTQUxYO1FBV0UsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHFCQUREO1NBWFY7T0FEVzs7O2dCQWtCYixPQUFBLEdBQVM7TUFDUCxDQUFBLEVBQUcsSUFESTs7O2dCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUw7TUFDVixZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLFdBQXhCO2FBQ2YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUNWLFlBRFUsRUFFVixPQUFPLENBQUMsV0FGRSxFQUdWLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUhVLENBQVo7SUFIUTs7OztLQXpCcUI7QUFSakMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtmb3JtYXRSXShodHRwczovL2dpdGh1Yi5jb20veWlodWkvZm9ybWF0UilcbiMjI1xucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJmb3JtYXRSXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20veWlodWkvZm9ybWF0UlwiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJSc2NyaXB0XCJcbiAgICAgIGNtZDogXCJyc2NyaXB0XCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vZ2l0aHViLmNvbS95aWh1aS9mb3JtYXRSXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20veWlodWkvZm9ybWF0UlwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvdmVyc2lvbiAoXFxkK1xcLlxcZCtcXC5cXGQrKSAvKVsxXVxuICAgICAgICBydW5PcHRpb25zOiB7XG4gICAgICAgICAgcmV0dXJuU3RkZXJyOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9yc2NyaXB0XCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgUjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByc2NyaXB0ID0gQGV4ZShcInJzY3JpcHRcIilcbiAgICByX2JlYXV0aWZpZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImZvcm1hdFIuclwiKVxuICAgIHJzY3JpcHQucnVuKFtcbiAgICAgIHJfYmVhdXRpZmllcixcbiAgICAgIG9wdGlvbnMuaW5kZW50X3NpemUsXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KSxcbiAgICBdKVxuIl19
