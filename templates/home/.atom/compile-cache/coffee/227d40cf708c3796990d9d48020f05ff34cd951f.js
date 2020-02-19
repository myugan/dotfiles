(function() {
  var CreateProjectConfigs, config, fs;

  fs = require("fs-plus");

  config = require("../config");

  module.exports = CreateProjectConfigs = (function() {
    function CreateProjectConfigs() {}

    CreateProjectConfigs.prototype.trigger = function() {
      var configFile, content, err;
      configFile = config.getProjectConfigFile();
      if (!this.inProjectFolder(configFile)) {
        return;
      }
      if (this.fileExists(configFile)) {
        return;
      }
      content = fs.readFileSync(config.getSampleConfigFile());
      err = fs.writeFileSync(configFile, content);
      if (!err) {
        return atom.workspace.open(configFile);
      }
    };

    CreateProjectConfigs.prototype.inProjectFolder = function(configFile) {
      if (configFile) {
        return true;
      }
      atom.confirm({
        message: "[Markdown Writer] Error!",
        detailedMessage: "Cannot create file if you are not in a project folder.",
        buttons: ['OK']
      });
      return false;
    };

    CreateProjectConfigs.prototype.fileExists = function(configFile) {
      var exists;
      exists = fs.existsSync(configFile);
      if (exists) {
        atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Project config file already exists:\n" + configFile,
          buttons: ['OK']
        });
      }
      return exists;
    };

    return CreateProjectConfigs;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9jcmVhdGUtcHJvamVjdC1jb25maWdzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7bUNBQ0osT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxvQkFBUCxDQUFBO01BRWIsSUFBQSxDQUFjLElBQUMsQ0FBQSxlQUFELENBQWlCLFVBQWpCLENBQWQ7QUFBQSxlQUFBOztNQUNBLElBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLENBQVY7QUFBQSxlQUFBOztNQUVBLE9BQUEsR0FBVSxFQUFFLENBQUMsWUFBSCxDQUFnQixNQUFNLENBQUMsbUJBQVAsQ0FBQSxDQUFoQjtNQUNWLEdBQUEsR0FBTSxFQUFFLENBQUMsYUFBSCxDQUFpQixVQUFqQixFQUE2QixPQUE3QjtNQUVOLElBQUEsQ0FBdUMsR0FBdkM7ZUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsRUFBQTs7SUFUTzs7bUNBV1QsZUFBQSxHQUFpQixTQUFDLFVBQUQ7TUFDZixJQUFlLFVBQWY7QUFBQSxlQUFPLEtBQVA7O01BQ0EsSUFBSSxDQUFDLE9BQUwsQ0FDRTtRQUFBLE9BQUEsRUFBUywwQkFBVDtRQUNBLGVBQUEsRUFBaUIsd0RBRGpCO1FBRUEsT0FBQSxFQUFTLENBQUMsSUFBRCxDQUZUO09BREY7YUFJQTtJQU5lOzttQ0FRakIsVUFBQSxHQUFZLFNBQUMsVUFBRDtBQUNWLFVBQUE7TUFBQSxNQUFBLEdBQVMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkO01BQ1QsSUFBRyxNQUFIO1FBQ0UsSUFBSSxDQUFDLE9BQUwsQ0FDRTtVQUFBLE9BQUEsRUFBUywwQkFBVDtVQUNBLGVBQUEsRUFBaUIsdUNBQUEsR0FBd0MsVUFEekQ7VUFFQSxPQUFBLEVBQVMsQ0FBQyxJQUFELENBRlQ7U0FERixFQURGOzthQUtBO0lBUFU7Ozs7O0FBekJkIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlKFwiZnMtcGx1c1wiKVxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ3JlYXRlUHJvamVjdENvbmZpZ3NcbiAgdHJpZ2dlcjogLT5cbiAgICBjb25maWdGaWxlID0gY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlKClcblxuICAgIHJldHVybiB1bmxlc3MgQGluUHJvamVjdEZvbGRlcihjb25maWdGaWxlKVxuICAgIHJldHVybiBpZiBAZmlsZUV4aXN0cyhjb25maWdGaWxlKVxuXG4gICAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhjb25maWcuZ2V0U2FtcGxlQ29uZmlnRmlsZSgpKVxuICAgIGVyciA9IGZzLndyaXRlRmlsZVN5bmMoY29uZmlnRmlsZSwgY29udGVudClcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oY29uZmlnRmlsZSkgdW5sZXNzIGVyclxuXG4gIGluUHJvamVjdEZvbGRlcjogKGNvbmZpZ0ZpbGUpIC0+XG4gICAgcmV0dXJuIHRydWUgaWYgY29uZmlnRmlsZVxuICAgIGF0b20uY29uZmlybVxuICAgICAgbWVzc2FnZTogXCJbTWFya2Rvd24gV3JpdGVyXSBFcnJvciFcIlxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkNhbm5vdCBjcmVhdGUgZmlsZSBpZiB5b3UgYXJlIG5vdCBpbiBhIHByb2plY3QgZm9sZGVyLlwiXG4gICAgICBidXR0b25zOiBbJ09LJ11cbiAgICBmYWxzZVxuXG4gIGZpbGVFeGlzdHM6IChjb25maWdGaWxlKSAtPlxuICAgIGV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoY29uZmlnRmlsZSlcbiAgICBpZiBleGlzdHNcbiAgICAgIGF0b20uY29uZmlybVxuICAgICAgICBtZXNzYWdlOiBcIltNYXJrZG93biBXcml0ZXJdIEVycm9yIVwiXG4gICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJQcm9qZWN0IGNvbmZpZyBmaWxlIGFscmVhZHkgZXhpc3RzOlxcbiN7Y29uZmlnRmlsZX1cIlxuICAgICAgICBidXR0b25zOiBbJ09LJ11cbiAgICBleGlzdHNcbiJdfQ==
