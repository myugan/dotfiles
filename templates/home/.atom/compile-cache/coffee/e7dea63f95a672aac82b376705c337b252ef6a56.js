(function() {
  var OpenCheatSheet, errMsg, errTitle, pkgs, utils;

  utils = require("../utils");

  pkgs = {
    "markdown-preview": "markdown-preview://",
    "markdown-preview-plus": "markdown-preview-plus://file/",
    "markdown-preview-enhanced": "mpe://"
  };

  errTitle = "Cannot Open Cheat Sheet";

  errMsg = "Please install and enable one of the following package:\n\n- [markdown-preview](https://atom.io/packages/markdown-preview)\n- [markdown-preview-plus](https://atom.io/packages/markdown-preview-plus)";

  module.exports = OpenCheatSheet = (function() {
    function OpenCheatSheet() {}

    OpenCheatSheet.prototype.trigger = function(e) {
      var protocal;
      protocal = this.getProtocal();
      if (!protocal) {
        atom.notifications.addError(errTitle, {
          description: errMsg,
          dismissable: true
        });
        return e.abortKeyBinding();
      }
      return atom.workspace.open(this.cheatsheetURL(protocal), {
        split: 'right',
        searchAllPanes: true
      });
    };

    OpenCheatSheet.prototype.getProtocal = function() {
      var pkg, protocal;
      for (pkg in pkgs) {
        protocal = pkgs[pkg];
        if (this.hasActivePackage(pkg)) {
          return protocal;
        }
      }
    };

    OpenCheatSheet.prototype.hasActivePackage = function(pkg) {
      return !!atom.packages.activePackages[pkg];
    };

    OpenCheatSheet.prototype.cheatsheetURL = function(protocal) {
      return protocal + utils.getPackagePath("CHEATSHEET.md");
    };

    return OpenCheatSheet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9vcGVuLWNoZWF0LXNoZWV0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUdSLElBQUEsR0FDRTtJQUFBLGtCQUFBLEVBQW9CLHFCQUFwQjtJQUNBLHVCQUFBLEVBQXlCLCtCQUR6QjtJQUVBLDJCQUFBLEVBQTZCLFFBRjdCOzs7RUFJRixRQUFBLEdBQVc7O0VBQ1gsTUFBQSxHQUFTOztFQU1ULE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs2QkFDSixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsV0FBRCxDQUFBO01BQ1gsSUFBRyxDQUFDLFFBQUo7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLFFBQTVCLEVBQXNDO1VBQUEsV0FBQSxFQUFhLE1BQWI7VUFBcUIsV0FBQSxFQUFhLElBQWxDO1NBQXRDO0FBQ0EsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBRlQ7O2FBSUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxhQUFELENBQWUsUUFBZixDQUFwQixFQUNFO1FBQUEsS0FBQSxFQUFPLE9BQVA7UUFBZ0IsY0FBQSxFQUFnQixJQUFoQztPQURGO0lBTk87OzZCQVNULFdBQUEsR0FBYSxTQUFBO0FBQ1gsVUFBQTtBQUFBLFdBQUEsV0FBQTs7UUFDRSxJQUFtQixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsR0FBbEIsQ0FBbkI7QUFBQSxpQkFBTyxTQUFQOztBQURGO0lBRFc7OzZCQUliLGdCQUFBLEdBQWtCLFNBQUMsR0FBRDthQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFlLENBQUEsR0FBQTtJQURmOzs2QkFHbEIsYUFBQSxHQUFlLFNBQUMsUUFBRDthQUNiLFFBQUEsR0FBVyxLQUFLLENBQUMsY0FBTixDQUFxQixlQUFyQjtJQURFOzs7OztBQWpDakIiLCJzb3VyY2VzQ29udGVudCI6WyJ1dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5cbiMgTWFya2Rvd24tUHJldmlldyBwYWNrYWdlcyBhbmQgdGhlaXIgcHJvdG9jYWxzXG5wa2dzID1cbiAgXCJtYXJrZG93bi1wcmV2aWV3XCI6IFwibWFya2Rvd24tcHJldmlldzovL1wiLFxuICBcIm1hcmtkb3duLXByZXZpZXctcGx1c1wiOiBcIm1hcmtkb3duLXByZXZpZXctcGx1czovL2ZpbGUvXCIsXG4gIFwibWFya2Rvd24tcHJldmlldy1lbmhhbmNlZFwiOiBcIm1wZTovL1wiXG5cbmVyclRpdGxlID0gXCJDYW5ub3QgT3BlbiBDaGVhdCBTaGVldFwiXG5lcnJNc2cgPSBcIlwiXCJQbGVhc2UgaW5zdGFsbCBhbmQgZW5hYmxlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHBhY2thZ2U6XG5cbi0gW21hcmtkb3duLXByZXZpZXddKGh0dHBzOi8vYXRvbS5pby9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3KVxuLSBbbWFya2Rvd24tcHJldmlldy1wbHVzXShodHRwczovL2F0b20uaW8vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzKVxuXCJcIlwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE9wZW5DaGVhdFNoZWV0XG4gIHRyaWdnZXI6IChlKSAtPlxuICAgIHByb3RvY2FsID0gQGdldFByb3RvY2FsKClcbiAgICBpZiAhcHJvdG9jYWwgIyBhYm9ydCBpZiB3ZSBjYW50IGZpbmQgcHJldmlldyBwYWNrYWdlc1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGVyclRpdGxlLCBkZXNjcmlwdGlvbjogZXJyTXNnLCBkaXNtaXNzYWJsZTogdHJ1ZSlcbiAgICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuIEBjaGVhdHNoZWV0VVJMKHByb3RvY2FsKSxcbiAgICAgIHNwbGl0OiAncmlnaHQnLCBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuXG4gIGdldFByb3RvY2FsOiAtPlxuICAgIGZvciBwa2csIHByb3RvY2FsIG9mIHBrZ3NcbiAgICAgIHJldHVybiBwcm90b2NhbCBpZiBAaGFzQWN0aXZlUGFja2FnZShwa2cpXG5cbiAgaGFzQWN0aXZlUGFja2FnZTogKHBrZykgLT5cbiAgICAhIWF0b20ucGFja2FnZXMuYWN0aXZlUGFja2FnZXNbcGtnXVxuXG4gIGNoZWF0c2hlZXRVUkw6IChwcm90b2NhbCkgLT5cbiAgICBwcm90b2NhbCArIHV0aWxzLmdldFBhY2thZ2VQYXRoKFwiQ0hFQVRTSEVFVC5tZFwiKVxuIl19
