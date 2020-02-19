(function() {
  var ManageFrontMatterView, ManagePostTagsView, config, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostTagsView = (function(superClass) {
    extend(ManagePostTagsView, superClass);

    function ManagePostTagsView() {
      return ManagePostTagsView.__super__.constructor.apply(this, arguments);
    }

    ManagePostTagsView.labelName = "Manage Post Tags";

    ManagePostTagsView.fieldName = config.get("frontMatterNameTags", {
      allow_blank: false
    });

    ManagePostTagsView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForTags");
      succeed = (function(_this) {
        return function(body) {
          var tags;
          tags = body.tags.map(function(tag) {
            return {
              name: tag,
              count: 0
            };
          });
          _this.rankTags(tags, _this.editor.getText());
          return _this.displaySiteFieldItems(tags.map(function(tag) {
            return tag.name;
          }));
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching tags from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    ManagePostTagsView.prototype.rankTags = function(tags, content) {
      tags.forEach(function(tag) {
        var ref, tagRegex;
        tagRegex = RegExp("" + (utils.escapeRegExp(tag.name)), "ig");
        return tag.count = ((ref = content.match(tagRegex)) != null ? ref.length : void 0) || 0;
      });
      return tags.sort(function(t1, t2) {
        return t2.count - t1.count;
      });
    };

    return ManagePostTagsView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9tYW5hZ2UtcG9zdC10YWdzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3REFBQTtJQUFBOzs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLGtCQUFDLENBQUEsU0FBRCxHQUFZOztJQUNaLGtCQUFDLENBQUEsU0FBRCxHQUFZLE1BQU0sQ0FBQyxHQUFQLENBQVcscUJBQVgsRUFBa0M7TUFBQSxXQUFBLEVBQWEsS0FBYjtLQUFsQzs7aUNBRVosd0JBQUEsR0FBMEIsU0FBQTtBQUN4QixVQUFBO01BQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxHQUFQLENBQVcsWUFBWDtNQUNOLE9BQUEsR0FBVSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtBQUNSLGNBQUE7VUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFWLENBQWMsU0FBQyxHQUFEO21CQUFTO2NBQUEsSUFBQSxFQUFNLEdBQU47Y0FBVyxLQUFBLEVBQU8sQ0FBbEI7O1VBQVQsQ0FBZDtVQUNQLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFoQjtpQkFDQSxLQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFDLEdBQUQ7bUJBQVMsR0FBRyxDQUFDO1VBQWIsQ0FBVCxDQUF2QjtRQUhRO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUlWLEtBQUEsR0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFDTixLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsZ0JBQVksR0FBRyxDQUFFLGlCQUFMLElBQWdCLENBQUEsNEJBQUEsR0FBNkIsR0FBN0IsR0FBaUMsR0FBakMsQ0FBNUI7UUFETTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7YUFFUixLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsRUFBbUIsT0FBbkIsRUFBNEIsS0FBNUI7SUFSd0I7O2lDQVcxQixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sT0FBUDtNQUNSLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBQyxHQUFEO0FBQ1gsWUFBQTtRQUFBLFFBQUEsR0FBVyxNQUFBLENBQUEsRUFBQSxHQUFLLENBQUMsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsR0FBRyxDQUFDLElBQXZCLENBQUQsQ0FBTCxFQUFzQyxJQUF0QztlQUNYLEdBQUcsQ0FBQyxLQUFKLGlEQUFtQyxDQUFFLGdCQUF6QixJQUFtQztNQUZwQyxDQUFiO2FBR0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFDLEVBQUQsRUFBSyxFQUFMO2VBQVksRUFBRSxDQUFDLEtBQUgsR0FBVyxFQUFFLENBQUM7TUFBMUIsQ0FBVjtJQUpROzs7O0tBZnFCO0FBTmpDIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5cbk1hbmFnZUZyb250TWF0dGVyVmlldyA9IHJlcXVpcmUgXCIuL21hbmFnZS1mcm9udC1tYXR0ZXItdmlld1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1hbmFnZVBvc3RUYWdzVmlldyBleHRlbmRzIE1hbmFnZUZyb250TWF0dGVyVmlld1xuICBAbGFiZWxOYW1lOiBcIk1hbmFnZSBQb3N0IFRhZ3NcIlxuICBAZmllbGROYW1lOiBjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJOYW1lVGFnc1wiLCBhbGxvd19ibGFuazogZmFsc2UpXG5cbiAgZmV0Y2hTaXRlRmllbGRDYW5kaWRhdGVzOiAtPlxuICAgIHVyaSA9IGNvbmZpZy5nZXQoXCJ1cmxGb3JUYWdzXCIpXG4gICAgc3VjY2VlZCA9IChib2R5KSA9PlxuICAgICAgdGFncyA9IGJvZHkudGFncy5tYXAoKHRhZykgLT4gbmFtZTogdGFnLCBjb3VudDogMClcbiAgICAgIEByYW5rVGFncyh0YWdzLCBAZWRpdG9yLmdldFRleHQoKSlcbiAgICAgIEBkaXNwbGF5U2l0ZUZpZWxkSXRlbXModGFncy5tYXAoKHRhZykgLT4gdGFnLm5hbWUpKVxuICAgIGVycm9yID0gKGVycikgPT5cbiAgICAgIEBlcnJvci50ZXh0KGVycj8ubWVzc2FnZSB8fCBcIkVycm9yIGZldGNoaW5nIHRhZ3MgZnJvbSAnI3t1cml9J1wiKVxuICAgIHV0aWxzLmdldEpTT04odXJpLCBzdWNjZWVkLCBlcnJvcilcblxuICAjIHJhbmsgdGFncyBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZXkgYXBwZWFyZWQgaW4gY29udGVudFxuICByYW5rVGFnczogKHRhZ3MsIGNvbnRlbnQpIC0+XG4gICAgdGFncy5mb3JFYWNoICh0YWcpIC0+XG4gICAgICB0YWdSZWdleCA9IC8vLyAje3V0aWxzLmVzY2FwZVJlZ0V4cCh0YWcubmFtZSl9IC8vL2lnXG4gICAgICB0YWcuY291bnQgPSBjb250ZW50Lm1hdGNoKHRhZ1JlZ2V4KT8ubGVuZ3RoIHx8IDBcbiAgICB0YWdzLnNvcnQgKHQxLCB0MikgLT4gdDIuY291bnQgLSB0MS5jb3VudFxuIl19
