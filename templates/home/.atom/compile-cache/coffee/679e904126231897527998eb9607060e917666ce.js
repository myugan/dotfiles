
/*
Requires [puppet-link](http://puppet-lint.com/)
 */

(function() {
  "use strict";
  var Beautifier, PuppetFix,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PuppetFix = (function(superClass) {
    extend(PuppetFix, superClass);

    function PuppetFix() {
      return PuppetFix.__super__.constructor.apply(this, arguments);
    }

    PuppetFix.prototype.name = "puppet-lint";

    PuppetFix.prototype.link = "http://puppet-lint.com/";

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.executables = [
      {
        name: "puppet-lint",
        cmd: "puppet-lint",
        homepage: "http://puppet-lint.com/",
        installation: "http://puppet-lint.com/",
        version: {
          parse: function(text) {
            return text.match(/puppet-lint (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/puppet-lint"
        }
      }
    ];

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.exe("puppet-lint").run(['--fix', tempFile = this.tempFile("input", text)], {
        ignoreReturnCode: true,
        help: {
          link: "http://puppet-lint.com/"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return PuppetFix;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHVwcGV0LWZpeC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEscUJBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUVyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLElBREQ7Ozt3QkFJVCxXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxhQURSO1FBRUUsR0FBQSxFQUFLLGFBRlA7UUFHRSxRQUFBLEVBQVUseUJBSFo7UUFJRSxZQUFBLEVBQWMseUJBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLDZCQUFYLENBQTBDLENBQUEsQ0FBQTtVQUFwRCxDQURBO1NBTFg7UUFRRSxNQUFBLEVBQVE7VUFDTixLQUFBLEVBQU8seUJBREQ7U0FSVjtPQURXOzs7d0JBZWIsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxhQUFMLENBQW1CLENBQUMsR0FBcEIsQ0FBd0IsQ0FDdEIsT0FEc0IsRUFFdEIsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUZXLENBQXhCLEVBR0s7UUFDRCxnQkFBQSxFQUFrQixJQURqQjtRQUVELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx5QkFERjtTQUZMO09BSEwsQ0FTRSxDQUFDLElBVEgsQ0FTUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVFI7SUFEUTs7OztLQXhCNkI7QUFOekMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtwdXBwZXQtbGlua10oaHR0cDovL3B1cHBldC1saW50LmNvbS8pXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQdXBwZXRGaXggZXh0ZW5kcyBCZWF1dGlmaWVyXG4gICMgdGhpcyBpcyB3aGF0IGRpc3BsYXlzIGFzIHlvdXIgRGVmYXVsdCBCZWF1dGlmaWVyIGluIExhbmd1YWdlIENvbmZpZ1xuICBuYW1lOiBcInB1cHBldC1saW50XCJcbiAgbGluazogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG5cbiAgb3B0aW9uczoge1xuICAgIFB1cHBldDogdHJ1ZVxuICB9XG5cbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcInB1cHBldC1saW50XCJcbiAgICAgIGNtZDogXCJwdXBwZXQtbGludFwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cDovL3B1cHBldC1saW50LmNvbS9cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL3B1cHBldC1saW50IChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9wdXBwZXQtbGludFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZXhlKFwicHVwcGV0LWxpbnRcIikucnVuKFtcbiAgICAgICctLWZpeCdcbiAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZVxuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbig9PlxuICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICApXG4iXX0=
