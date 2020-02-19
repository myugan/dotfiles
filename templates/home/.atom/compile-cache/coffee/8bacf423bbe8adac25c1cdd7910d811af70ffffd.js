(function() {
  var CreateDefaultKeymaps, fs, path, utils;

  fs = require("fs-plus");

  path = require("path");

  utils = require("../utils");

  module.exports = CreateDefaultKeymaps = (function() {
    function CreateDefaultKeymaps() {}

    CreateDefaultKeymaps.prototype.trigger = function() {
      var keymaps, userKeymapFile;
      keymaps = fs.readFileSync(this.sampleKeymapFile());
      userKeymapFile = this.userKeymapFile();
      return fs.appendFile(userKeymapFile, keymaps, function(err) {
        if (!err) {
          return atom.workspace.open(userKeymapFile);
        }
      });
    };

    CreateDefaultKeymaps.prototype.userKeymapFile = function() {
      return path.join(atom.getConfigDirPath(), "keymap.cson");
    };

    CreateDefaultKeymaps.prototype.sampleKeymapFile = function() {
      return utils.getPackagePath("keymaps", this._sampleFilename());
    };

    CreateDefaultKeymaps.prototype._sampleFilename = function() {
      return {
        "darwin": "sample-osx.cson",
        "linux": "sample-linux.cson",
        "win32": "sample-win32.cson"
      }[process.platform] || "sample-osx.cson";
    };

    return CreateDefaultKeymaps;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9jcmVhdGUtZGVmYXVsdC1rZXltYXBzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBRVIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O21DQUNKLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLE9BQUEsR0FBVSxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFoQjtNQUVWLGNBQUEsR0FBaUIsSUFBQyxDQUFBLGNBQUQsQ0FBQTthQUNqQixFQUFFLENBQUMsVUFBSCxDQUFjLGNBQWQsRUFBOEIsT0FBOUIsRUFBdUMsU0FBQyxHQUFEO1FBQ3JDLElBQUEsQ0FBMkMsR0FBM0M7aUJBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQXBCLEVBQUE7O01BRHFDLENBQXZDO0lBSk87O21DQU9ULGNBQUEsR0FBZ0IsU0FBQTthQUNkLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyxhQUFuQztJQURjOzttQ0FHaEIsZ0JBQUEsR0FBa0IsU0FBQTthQUNoQixLQUFLLENBQUMsY0FBTixDQUFxQixTQUFyQixFQUFnQyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQWhDO0lBRGdCOzttQ0FHbEIsZUFBQSxHQUFpQixTQUFBO2FBQ2Y7UUFDRSxRQUFBLEVBQVUsaUJBRFo7UUFFRSxPQUFBLEVBQVUsbUJBRlo7UUFHRSxPQUFBLEVBQVUsbUJBSFo7T0FJRSxDQUFBLE9BQU8sQ0FBQyxRQUFSLENBSkYsSUFJdUI7SUFMUjs7Ozs7QUFwQm5CIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlKFwiZnMtcGx1c1wiKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ3JlYXRlRGVmYXVsdEtleW1hcHNcbiAgdHJpZ2dlcjogLT5cbiAgICBrZXltYXBzID0gZnMucmVhZEZpbGVTeW5jKEBzYW1wbGVLZXltYXBGaWxlKCkpXG5cbiAgICB1c2VyS2V5bWFwRmlsZSA9IEB1c2VyS2V5bWFwRmlsZSgpXG4gICAgZnMuYXBwZW5kRmlsZSB1c2VyS2V5bWFwRmlsZSwga2V5bWFwcywgKGVycikgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4odXNlcktleW1hcEZpbGUpIHVubGVzcyBlcnJcblxuICB1c2VyS2V5bWFwRmlsZTogLT5cbiAgICBwYXRoLmpvaW4oYXRvbS5nZXRDb25maWdEaXJQYXRoKCksIFwia2V5bWFwLmNzb25cIilcblxuICBzYW1wbGVLZXltYXBGaWxlOiAtPlxuICAgIHV0aWxzLmdldFBhY2thZ2VQYXRoKFwia2V5bWFwc1wiLCBAX3NhbXBsZUZpbGVuYW1lKCkpXG5cbiAgX3NhbXBsZUZpbGVuYW1lOiAtPlxuICAgIHtcbiAgICAgIFwiZGFyd2luXCI6IFwic2FtcGxlLW9zeC5jc29uXCIsXG4gICAgICBcImxpbnV4XCIgOiBcInNhbXBsZS1saW51eC5jc29uXCIsXG4gICAgICBcIndpbjMyXCIgOiBcInNhbXBsZS13aW4zMi5jc29uXCJcbiAgICB9W3Byb2Nlc3MucGxhdGZvcm1dIHx8IFwic2FtcGxlLW9zeC5jc29uXCJcbiJdfQ==
