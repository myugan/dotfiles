(function() {
  var OpenLink, child_process, config, fs, path, shell, utils;

  child_process = require("child_process");

  shell = require("shell");

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

  module.exports = OpenLink = (function() {
    function OpenLink(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    OpenLink.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this[fn](e);
    };

    OpenLink.prototype.openLinkInBrowser = function(e) {
      var link, range;
      range = utils.getTextBufferRange(this.editor, "link");
      link = utils.findLinkInRange(this.editor, range);
      if (!link || !link.url) {
        return e.abortKeyBinding();
      }
      switch (process.platform) {
        case 'darwin':
          return child_process.execFile("open", [link.url]);
        case 'linux':
          return child_process.execFile("xdg-open", [link.url]);
        case 'win32':
          return shell.openExternal(link.url);
      }
    };

    OpenLink.prototype.openLinkInFile = function(e) {
      var anchorName, filePath, link, localDir, range, ref, siteUrl;
      range = utils.getTextBufferRange(this.editor, "link");
      link = utils.findLinkInRange(this.editor, range);
      if (!link || !link.url) {
        return e.abortKeyBinding();
      }
      siteUrl = config.get("siteUrl") || "";
      if (!siteUrl || !link.url.startsWith(siteUrl)) {
        return e.abortKeyBinding();
      }
      ref = link.url.slice(siteUrl.length).split("#"), filePath = ref[0], anchorName = ref[1];
      localDir = utils.getSitePath(config.get("siteLocalDir"), this.editor.getPath());
      filePath = path.join(localDir, filePath);
      if (!fs.existsSync(filePath)) {
        return e.abortKeyBinding();
      }
      return atom.workspace.open(filePath);
    };

    return OpenLink;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9vcGVuLWxpbmsuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSOztFQUNoQixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxrQkFBQyxNQUFEO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBRkM7O3VCQUliLE9BQUEsR0FBUyxTQUFDLENBQUQ7QUFDUCxVQUFBO01BQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixVQUFoQixFQUE0QixTQUFDLENBQUQ7ZUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBTCxDQUFBO01BQVAsQ0FBNUI7YUFDTCxJQUFFLENBQUEsRUFBQSxDQUFGLENBQU0sQ0FBTjtJQUZPOzt1QkFJVCxpQkFBQSxHQUFtQixTQUFDLENBQUQ7QUFDakIsVUFBQTtNQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsSUFBQyxDQUFBLE1BQTFCLEVBQWtDLE1BQWxDO01BRVIsSUFBQSxHQUFPLEtBQUssQ0FBQyxlQUFOLENBQXNCLElBQUMsQ0FBQSxNQUF2QixFQUErQixLQUEvQjtNQUNQLElBQThCLENBQUMsSUFBRCxJQUFTLENBQUMsSUFBSSxDQUFDLEdBQTdDO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O0FBRUEsY0FBTyxPQUFPLENBQUMsUUFBZjtBQUFBLGFBQ08sUUFEUDtpQkFDcUIsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsTUFBdkIsRUFBK0IsQ0FBQyxJQUFJLENBQUMsR0FBTixDQUEvQjtBQURyQixhQUVPLE9BRlA7aUJBRXFCLGFBQWEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLENBQUMsSUFBSSxDQUFDLEdBQU4sQ0FBbkM7QUFGckIsYUFHTyxPQUhQO2lCQUdxQixLQUFLLENBQUMsWUFBTixDQUFtQixJQUFJLENBQUMsR0FBeEI7QUFIckI7SUFOaUI7O3VCQVduQixjQUFBLEdBQWdCLFNBQUMsQ0FBRDtBQUNkLFVBQUE7TUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLGtCQUFOLENBQXlCLElBQUMsQ0FBQSxNQUExQixFQUFrQyxNQUFsQztNQUVSLElBQUEsR0FBTyxLQUFLLENBQUMsZUFBTixDQUFzQixJQUFDLENBQUEsTUFBdkIsRUFBK0IsS0FBL0I7TUFDUCxJQUE4QixDQUFDLElBQUQsSUFBUyxDQUFDLElBQUksQ0FBQyxHQUE3QztBQUFBLGVBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUFQOztNQUVBLE9BQUEsR0FBVSxNQUFNLENBQUMsR0FBUCxDQUFXLFNBQVgsQ0FBQSxJQUF5QjtNQUNuQyxJQUE4QixDQUFDLE9BQUQsSUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVCxDQUFvQixPQUFwQixDQUEzQztBQUFBLGVBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUFQOztNQUVBLE1BQXlCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBVCxDQUFlLE9BQU8sQ0FBQyxNQUF2QixDQUE4QixDQUFDLEtBQS9CLENBQXFDLEdBQXJDLENBQXpCLEVBQUMsaUJBQUQsRUFBVztNQUVYLFFBQUEsR0FBVyxLQUFLLENBQUMsV0FBTixDQUFrQixNQUFNLENBQUMsR0FBUCxDQUFXLGNBQVgsQ0FBbEIsRUFBOEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsQ0FBOUM7TUFDWCxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLFFBQXBCO01BRVgsSUFBQSxDQUFrQyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBbEM7QUFBQSxlQUFPLENBQUMsQ0FBQyxlQUFGLENBQUEsRUFBUDs7YUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEI7SUFoQmM7Ozs7O0FBOUJsQiIsInNvdXJjZXNDb250ZW50IjpbImNoaWxkX3Byb2Nlc3MgPSByZXF1aXJlIFwiY2hpbGRfcHJvY2Vzc1wiXG5zaGVsbCA9IHJlcXVpcmUgXCJzaGVsbFwiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBPcGVuTGlua1xuICAjIGFjdGlvbjogb3Blbi1saW5rLWluLWJyb3dzZXIsIG9wZW4tbGluay1pbi1maWxlXG4gIGNvbnN0cnVjdG9yOiAoYWN0aW9uKSAtPlxuICAgIEBhY3Rpb24gPSBhY3Rpb25cbiAgICBAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgdHJpZ2dlcjogKGUpIC0+XG4gICAgZm4gPSBAYWN0aW9uLnJlcGxhY2UgLy1bYS16XS9pZywgKHMpIC0+IHNbMV0udG9VcHBlckNhc2UoKVxuICAgIEBbZm5dKGUpXG5cbiAgb3BlbkxpbmtJbkJyb3dzZXI6IChlKSAtPlxuICAgIHJhbmdlID0gdXRpbHMuZ2V0VGV4dEJ1ZmZlclJhbmdlKEBlZGl0b3IsIFwibGlua1wiKVxuXG4gICAgbGluayA9IHV0aWxzLmZpbmRMaW5rSW5SYW5nZShAZWRpdG9yLCByYW5nZSlcbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSBpZiAhbGluayB8fCAhbGluay51cmxcblxuICAgIHN3aXRjaCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICB3aGVuICdkYXJ3aW4nIHRoZW4gY2hpbGRfcHJvY2Vzcy5leGVjRmlsZShcIm9wZW5cIiwgW2xpbmsudXJsXSlcbiAgICAgIHdoZW4gJ2xpbnV4JyAgdGhlbiBjaGlsZF9wcm9jZXNzLmV4ZWNGaWxlKFwieGRnLW9wZW5cIiwgW2xpbmsudXJsXSlcbiAgICAgIHdoZW4gJ3dpbjMyJyAgdGhlbiBzaGVsbC5vcGVuRXh0ZXJuYWwobGluay51cmwpXG5cbiAgb3BlbkxpbmtJbkZpbGU6IChlKSAtPlxuICAgIHJhbmdlID0gdXRpbHMuZ2V0VGV4dEJ1ZmZlclJhbmdlKEBlZGl0b3IsIFwibGlua1wiKVxuXG4gICAgbGluayA9IHV0aWxzLmZpbmRMaW5rSW5SYW5nZShAZWRpdG9yLCByYW5nZSlcbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSBpZiAhbGluayB8fCAhbGluay51cmxcblxuICAgIHNpdGVVcmwgPSBjb25maWcuZ2V0KFwic2l0ZVVybFwiKSB8fCBcIlwiXG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgIXNpdGVVcmwgfHwgIWxpbmsudXJsLnN0YXJ0c1dpdGgoc2l0ZVVybClcblxuICAgIFtmaWxlUGF0aCwgYW5jaG9yTmFtZV0gPSBsaW5rLnVybC5zbGljZShzaXRlVXJsLmxlbmd0aCkuc3BsaXQoXCIjXCIpXG4gICAgIyBjb25zdHJ1Y3QgYWN0dWFsIGZpbGUgcGF0aFxuICAgIGxvY2FsRGlyID0gdXRpbHMuZ2V0U2l0ZVBhdGgoY29uZmlnLmdldChcInNpdGVMb2NhbERpclwiKSwgQGVkaXRvci5nZXRQYXRoKCkpXG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4obG9jYWxEaXIsIGZpbGVQYXRoKVxuICAgICMgY2hlY2sgZmlsZSBleGlzdHNcbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSB1bmxlc3MgZnMuZXhpc3RzU3luYyhmaWxlUGF0aClcbiAgICAjIFRPRE8ganVtcCB0byBhbmNob3JOYW1lXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcbiJdfQ==
