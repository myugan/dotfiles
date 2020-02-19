(function() {
  var InsertImage, InsertImageClipboardView, InsertImageFileView, clipboard;

  clipboard = require('clipboard');

  InsertImageFileView = require("../views/insert-image-file-view");

  InsertImageClipboardView = require("../views/insert-image-clipboard-view");

  module.exports = InsertImage = (function() {
    function InsertImage() {}

    InsertImage.prototype.trigger = function(e) {
      var view;
      if (clipboard.readImage().isEmpty()) {
        view = new InsertImageFileView();
        return view.display();
      } else {
        view = new InsertImageClipboardView();
        return view.display();
      }
    };

    return InsertImage;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9pbnNlcnQtaW1hZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVI7O0VBRVosbUJBQUEsR0FBc0IsT0FBQSxDQUFRLGlDQUFSOztFQUN0Qix3QkFBQSxHQUEyQixPQUFBLENBQVEsc0NBQVI7O0VBRTNCLE1BQU0sQ0FBQyxPQUFQLEdBQ007OzswQkFDSixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLElBQUcsU0FBUyxDQUFDLFNBQVYsQ0FBQSxDQUFxQixDQUFDLE9BQXRCLENBQUEsQ0FBSDtRQUNFLElBQUEsR0FBTyxJQUFJLG1CQUFKLENBQUE7ZUFDUCxJQUFJLENBQUMsT0FBTCxDQUFBLEVBRkY7T0FBQSxNQUFBO1FBSUUsSUFBQSxHQUFPLElBQUksd0JBQUosQ0FBQTtlQUNQLElBQUksQ0FBQyxPQUFMLENBQUEsRUFMRjs7SUFETzs7Ozs7QUFQWCIsInNvdXJjZXNDb250ZW50IjpbImNsaXBib2FyZCA9IHJlcXVpcmUgJ2NsaXBib2FyZCdcblxuSW5zZXJ0SW1hZ2VGaWxlVmlldyA9IHJlcXVpcmUgXCIuLi92aWV3cy9pbnNlcnQtaW1hZ2UtZmlsZS12aWV3XCJcbkluc2VydEltYWdlQ2xpcGJvYXJkVmlldyA9IHJlcXVpcmUgXCIuLi92aWV3cy9pbnNlcnQtaW1hZ2UtY2xpcGJvYXJkLXZpZXdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbnNlcnRJbWFnZVxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICBpZiBjbGlwYm9hcmQucmVhZEltYWdlKCkuaXNFbXB0eSgpXG4gICAgICB2aWV3ID0gbmV3IEluc2VydEltYWdlRmlsZVZpZXcoKVxuICAgICAgdmlldy5kaXNwbGF5KClcbiAgICBlbHNlXG4gICAgICB2aWV3ID0gbmV3IEluc2VydEltYWdlQ2xpcGJvYXJkVmlldygpXG4gICAgICB2aWV3LmRpc3BsYXkoKVxuIl19
