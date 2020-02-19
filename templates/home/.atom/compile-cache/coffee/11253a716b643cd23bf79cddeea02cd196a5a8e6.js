(function() {
  "use strict";
  var AlignYaml, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = AlignYaml = (function(superClass) {
    extend(AlignYaml, superClass);

    function AlignYaml() {
      return AlignYaml.__super__.constructor.apply(this, arguments);
    }

    AlignYaml.prototype.name = "align-yaml";

    AlignYaml.prototype.link = "https://github.com/jonschlinkert/align-yaml";

    AlignYaml.prototype.options = {
      YAML: {
        padding: true
      }
    };

    AlignYaml.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var align, result;
        align = require('align-yaml');
        result = align(text, options.padding);
        return resolve(result);
      });
    };

    return AlignYaml;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYWxpZ24teWFtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLElBQVQ7T0FGSzs7O3dCQUtULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSO1FBQ1IsTUFBQSxHQUFTLEtBQUEsQ0FBTSxJQUFOLEVBQVksT0FBTyxDQUFDLE9BQXBCO2VBQ1QsT0FBQSxDQUFRLE1BQVI7TUFIa0IsQ0FBYjtJQURDOzs7O0tBVDZCO0FBSHpDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFsaWduWWFtbCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJhbGlnbi15YW1sXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9hbGlnbi15YW1sXCJcblxuICBvcHRpb25zOiB7XG4gICAgWUFNTDpcbiAgICAgIHBhZGRpbmc6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgYWxpZ24gPSByZXF1aXJlKCdhbGlnbi15YW1sJylcbiAgICAgIHJlc3VsdCA9IGFsaWduKHRleHQsIG9wdGlvbnMucGFkZGluZylcbiAgICAgIHJlc29sdmUocmVzdWx0KVxuICAgIClcbiJdfQ==
