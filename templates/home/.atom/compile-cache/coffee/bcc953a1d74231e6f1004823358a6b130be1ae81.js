(function() {
  var ManageFrontMatterView, ManagePostCategoriesView, config, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostCategoriesView = (function(superClass) {
    extend(ManagePostCategoriesView, superClass);

    function ManagePostCategoriesView() {
      return ManagePostCategoriesView.__super__.constructor.apply(this, arguments);
    }

    ManagePostCategoriesView.labelName = "Manage Post Categories";

    ManagePostCategoriesView.fieldName = config.get("frontMatterNameCategories", {
      allow_blank: false
    });

    ManagePostCategoriesView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForCategories");
      succeed = (function(_this) {
        return function(body) {
          return _this.displaySiteFieldItems(body.categories || []);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching categories from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    return ManagePostCategoriesView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9tYW5hZ2UtcG9zdC1jYXRlZ29yaWVzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4REFBQTtJQUFBOzs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLHdCQUFDLENBQUEsU0FBRCxHQUFZOztJQUNaLHdCQUFDLENBQUEsU0FBRCxHQUFZLE1BQU0sQ0FBQyxHQUFQLENBQVcsMkJBQVgsRUFBd0M7TUFBQSxXQUFBLEVBQWEsS0FBYjtLQUF4Qzs7dUNBRVosd0JBQUEsR0FBMEIsU0FBQTtBQUN4QixVQUFBO01BQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxHQUFQLENBQVcsa0JBQVg7TUFDTixPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQ1IsS0FBQyxDQUFBLHFCQUFELENBQXVCLElBQUksQ0FBQyxVQUFMLElBQW1CLEVBQTFDO1FBRFE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO01BRVYsS0FBQSxHQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO2lCQUNOLEtBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxnQkFBWSxHQUFHLENBQUUsaUJBQUwsSUFBZ0IsQ0FBQSxrQ0FBQSxHQUFtQyxHQUFuQyxHQUF1QyxHQUF2QyxDQUE1QjtRQURNO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUVSLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxFQUFtQixPQUFuQixFQUE0QixLQUE1QjtJQU53Qjs7OztLQUpXO0FBTnZDIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5cbk1hbmFnZUZyb250TWF0dGVyVmlldyA9IHJlcXVpcmUgXCIuL21hbmFnZS1mcm9udC1tYXR0ZXItdmlld1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1hbmFnZVBvc3RDYXRlZ29yaWVzVmlldyBleHRlbmRzIE1hbmFnZUZyb250TWF0dGVyVmlld1xuICBAbGFiZWxOYW1lOiBcIk1hbmFnZSBQb3N0IENhdGVnb3JpZXNcIlxuICBAZmllbGROYW1lOiBjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJOYW1lQ2F0ZWdvcmllc1wiLCBhbGxvd19ibGFuazogZmFsc2UpXG5cbiAgZmV0Y2hTaXRlRmllbGRDYW5kaWRhdGVzOiAtPlxuICAgIHVyaSA9IGNvbmZpZy5nZXQoXCJ1cmxGb3JDYXRlZ29yaWVzXCIpXG4gICAgc3VjY2VlZCA9IChib2R5KSA9PlxuICAgICAgQGRpc3BsYXlTaXRlRmllbGRJdGVtcyhib2R5LmNhdGVnb3JpZXMgfHwgW10pXG4gICAgZXJyb3IgPSAoZXJyKSA9PlxuICAgICAgQGVycm9yLnRleHQoZXJyPy5tZXNzYWdlIHx8IFwiRXJyb3IgZmV0Y2hpbmcgY2F0ZWdvcmllcyBmcm9tICcje3VyaX0nXCIpXG4gICAgdXRpbHMuZ2V0SlNPTih1cmksIHN1Y2NlZWQsIGVycm9yKVxuIl19
