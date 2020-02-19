(function() {
  var NewFileView, NewPostView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NewFileView = require("./new-file-view");

  module.exports = NewPostView = (function(superClass) {
    extend(NewPostView, superClass);

    function NewPostView() {
      return NewPostView.__super__.constructor.apply(this, arguments);
    }

    NewPostView.fileType = "Post";

    NewPostView.pathConfig = "sitePostsDir";

    NewPostView.fileNameConfig = "newPostFileName";

    return NewPostView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9uZXctcG9zdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTs7O0VBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osV0FBQyxDQUFBLFFBQUQsR0FBWTs7SUFDWixXQUFDLENBQUEsVUFBRCxHQUFjOztJQUNkLFdBQUMsQ0FBQSxjQUFELEdBQWtCOzs7O0tBSE07QUFIMUIiLCJzb3VyY2VzQ29udGVudCI6WyJOZXdGaWxlVmlldyA9IHJlcXVpcmUgXCIuL25ldy1maWxlLXZpZXdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBOZXdQb3N0VmlldyBleHRlbmRzIE5ld0ZpbGVWaWV3XG4gIEBmaWxlVHlwZSA9IFwiUG9zdFwiXG4gIEBwYXRoQ29uZmlnID0gXCJzaXRlUG9zdHNEaXJcIlxuICBAZmlsZU5hbWVDb25maWcgPSBcIm5ld1Bvc3RGaWxlTmFtZVwiXG4iXX0=
