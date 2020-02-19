(function() {
  var config,
    slice = [].slice;

  config = require("./config");

  module.exports = {
    siteEngine: {
      title: "Site Engine",
      type: "string",
      "default": config.getDefault("siteEngine"),
      "enum": [config.getDefault("siteEngine")].concat(slice.call(config.engineNames()))
    },
    siteUrl: {
      title: "Site URL",
      type: "string",
      "default": config.getDefault("siteUrl")
    },
    siteLocalDir: {
      title: "Site Local Directory",
      description: "The absolute path to your site's local directory",
      type: "string",
      "default": config.getDefault("siteLocalDir")
    },
    siteDraftsDir: {
      title: "Site Drafts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteDraftsDir")
    },
    sitePostsDir: {
      title: "Site Posts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("sitePostsDir")
    },
    siteImagesDir: {
      title: "Site Images Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteImagesDir")
    },
    urlForTags: {
      title: "URL to Tags JSON definitions",
      type: "string",
      "default": config.getDefault("urlForTags")
    },
    urlForPosts: {
      title: "URL to Posts JSON definitions",
      type: "string",
      "default": config.getDefault("urlForPosts")
    },
    urlForCategories: {
      title: "URL to Categories JSON definitions",
      type: "string",
      "default": config.getDefault("urlForCategories")
    },
    newDraftFileName: {
      title: "New Draft File Name",
      type: "string",
      "default": config.getCurrentDefault("newDraftFileName")
    },
    newPostFileName: {
      title: "New Post File Name",
      type: "string",
      "default": config.getCurrentDefault("newPostFileName")
    },
    fileExtension: {
      title: "File Extension",
      type: "string",
      "default": config.getCurrentDefault("fileExtension")
    },
    relativeImagePath: {
      title: "Use Relative Image Path",
      description: "Use relative image path from the open file",
      type: "boolean",
      "default": config.getCurrentDefault("relativeImagePath")
    },
    renameImageOnCopy: {
      title: "Rename Image File Name",
      description: "Rename image filename when you chose to copy to image directory",
      type: "boolean",
      "default": config.getCurrentDefault("renameImageOnCopy")
    },
    tableAlignment: {
      title: "Table Cell Alignment",
      type: "string",
      "default": config.getDefault("tableAlignment"),
      "enum": ["empty", "left", "right", "center"]
    },
    tableExtraPipes: {
      title: "Table Extra Pipes",
      description: "Insert extra pipes at the start and the end of the table rows",
      type: "boolean",
      "default": config.getDefault("tableExtraPipes")
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb25maWctYmFzaWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxNQUFBO0lBQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxVQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sYUFBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixZQUFsQixDQUZUO01BR0EsQ0FBQSxJQUFBLENBQUEsRUFBTyxDQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBQWlDLFNBQUEsV0FBQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsQ0FBQSxDQUh4QztLQURGO0lBS0EsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFVBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FGVDtLQU5GO0lBU0EsWUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHNCQUFQO01BQ0EsV0FBQSxFQUFhLGtEQURiO01BRUEsSUFBQSxFQUFNLFFBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGNBQWxCLENBSFQ7S0FWRjtJQWNBLGFBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyx1QkFBUDtNQUNBLFdBQUEsRUFBYSxvREFEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixlQUFsQixDQUhUO0tBZkY7SUFtQkEsWUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHNCQUFQO01BQ0EsV0FBQSxFQUFhLG9EQURiO01BRUEsSUFBQSxFQUFNLFFBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGNBQWxCLENBSFQ7S0FwQkY7SUF3QkEsYUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHVCQUFQO01BQ0EsV0FBQSxFQUFhLG9EQURiO01BRUEsSUFBQSxFQUFNLFFBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGVBQWxCLENBSFQ7S0F6QkY7SUE2QkEsVUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLDhCQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBRlQ7S0E5QkY7SUFpQ0EsV0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLCtCQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGFBQWxCLENBRlQ7S0FsQ0Y7SUFxQ0EsZ0JBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxvQ0FBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixrQkFBbEIsQ0FGVDtLQXRDRjtJQXlDQSxnQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHFCQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixrQkFBekIsQ0FGVDtLQTFDRjtJQTZDQSxlQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sb0JBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLGlCQUFQLENBQXlCLGlCQUF6QixDQUZUO0tBOUNGO0lBaURBLGFBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxnQkFBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsZUFBekIsQ0FGVDtLQWxERjtJQXFEQSxpQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHlCQUFQO01BQ0EsV0FBQSxFQUFhLDRDQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixtQkFBekIsQ0FIVDtLQXRERjtJQTBEQSxpQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHdCQUFQO01BQ0EsV0FBQSxFQUFhLGlFQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixtQkFBekIsQ0FIVDtLQTNERjtJQStEQSxjQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sc0JBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsZ0JBQWxCLENBRlQ7TUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsT0FBbEIsRUFBMkIsUUFBM0IsQ0FITjtLQWhFRjtJQW9FQSxlQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sbUJBQVA7TUFDQSxXQUFBLEVBQWEsK0RBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsaUJBQWxCLENBSFQ7S0FyRUY7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25maWcgPSByZXF1aXJlIFwiLi9jb25maWdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNpdGVFbmdpbmU6XG4gICAgdGl0bGU6IFwiU2l0ZSBFbmdpbmVcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInNpdGVFbmdpbmVcIilcbiAgICBlbnVtOiBbY29uZmlnLmdldERlZmF1bHQoXCJzaXRlRW5naW5lXCIpLCBjb25maWcuZW5naW5lTmFtZXMoKS4uLl1cbiAgc2l0ZVVybDpcbiAgICB0aXRsZTogXCJTaXRlIFVSTFwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwic2l0ZVVybFwiKVxuICBzaXRlTG9jYWxEaXI6XG4gICAgdGl0bGU6IFwiU2l0ZSBMb2NhbCBEaXJlY3RvcnlcIlxuICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhYnNvbHV0ZSBwYXRoIHRvIHlvdXIgc2l0ZSdzIGxvY2FsIGRpcmVjdG9yeVwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwic2l0ZUxvY2FsRGlyXCIpXG4gIHNpdGVEcmFmdHNEaXI6XG4gICAgdGl0bGU6IFwiU2l0ZSBEcmFmdHMgRGlyZWN0b3J5XCJcbiAgICBkZXNjcmlwdGlvbjogXCJUaGUgcmVsYXRpdmUgcGF0aCBmcm9tIHlvdXIgc2l0ZSdzIGxvY2FsIGRpcmVjdG9yeVwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwic2l0ZURyYWZ0c0RpclwiKVxuICBzaXRlUG9zdHNEaXI6XG4gICAgdGl0bGU6IFwiU2l0ZSBQb3N0cyBEaXJlY3RvcnlcIlxuICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByZWxhdGl2ZSBwYXRoIGZyb20geW91ciBzaXRlJ3MgbG9jYWwgZGlyZWN0b3J5XCJcbiAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldERlZmF1bHQoXCJzaXRlUG9zdHNEaXJcIilcbiAgc2l0ZUltYWdlc0RpcjpcbiAgICB0aXRsZTogXCJTaXRlIEltYWdlcyBEaXJlY3RvcnlcIlxuICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByZWxhdGl2ZSBwYXRoIGZyb20geW91ciBzaXRlJ3MgbG9jYWwgZGlyZWN0b3J5XCJcbiAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldERlZmF1bHQoXCJzaXRlSW1hZ2VzRGlyXCIpXG4gIHVybEZvclRhZ3M6XG4gICAgdGl0bGU6IFwiVVJMIHRvIFRhZ3MgSlNPTiBkZWZpbml0aW9uc1wiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwidXJsRm9yVGFnc1wiKVxuICB1cmxGb3JQb3N0czpcbiAgICB0aXRsZTogXCJVUkwgdG8gUG9zdHMgSlNPTiBkZWZpbml0aW9uc1wiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwidXJsRm9yUG9zdHNcIilcbiAgdXJsRm9yQ2F0ZWdvcmllczpcbiAgICB0aXRsZTogXCJVUkwgdG8gQ2F0ZWdvcmllcyBKU09OIGRlZmluaXRpb25zXCJcbiAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldERlZmF1bHQoXCJ1cmxGb3JDYXRlZ29yaWVzXCIpXG4gIG5ld0RyYWZ0RmlsZU5hbWU6XG4gICAgdGl0bGU6IFwiTmV3IERyYWZ0IEZpbGUgTmFtZVwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXRDdXJyZW50RGVmYXVsdChcIm5ld0RyYWZ0RmlsZU5hbWVcIilcbiAgbmV3UG9zdEZpbGVOYW1lOlxuICAgIHRpdGxlOiBcIk5ldyBQb3N0IEZpbGUgTmFtZVwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXRDdXJyZW50RGVmYXVsdChcIm5ld1Bvc3RGaWxlTmFtZVwiKVxuICBmaWxlRXh0ZW5zaW9uOlxuICAgIHRpdGxlOiBcIkZpbGUgRXh0ZW5zaW9uXCJcbiAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldEN1cnJlbnREZWZhdWx0KFwiZmlsZUV4dGVuc2lvblwiKVxuICByZWxhdGl2ZUltYWdlUGF0aDpcbiAgICB0aXRsZTogXCJVc2UgUmVsYXRpdmUgSW1hZ2UgUGF0aFwiXG4gICAgZGVzY3JpcHRpb246IFwiVXNlIHJlbGF0aXZlIGltYWdlIHBhdGggZnJvbSB0aGUgb3BlbiBmaWxlXCJcbiAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXRDdXJyZW50RGVmYXVsdChcInJlbGF0aXZlSW1hZ2VQYXRoXCIpXG4gIHJlbmFtZUltYWdlT25Db3B5OlxuICAgIHRpdGxlOiBcIlJlbmFtZSBJbWFnZSBGaWxlIE5hbWVcIlxuICAgIGRlc2NyaXB0aW9uOiBcIlJlbmFtZSBpbWFnZSBmaWxlbmFtZSB3aGVuIHlvdSBjaG9zZSB0byBjb3B5IHRvIGltYWdlIGRpcmVjdG9yeVwiXG4gICAgdHlwZTogXCJib29sZWFuXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0Q3VycmVudERlZmF1bHQoXCJyZW5hbWVJbWFnZU9uQ29weVwiKVxuICB0YWJsZUFsaWdubWVudDpcbiAgICB0aXRsZTogXCJUYWJsZSBDZWxsIEFsaWdubWVudFwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwidGFibGVBbGlnbm1lbnRcIilcbiAgICBlbnVtOiBbXCJlbXB0eVwiLCBcImxlZnRcIiwgXCJyaWdodFwiLCBcImNlbnRlclwiXVxuICB0YWJsZUV4dHJhUGlwZXM6XG4gICAgdGl0bGU6IFwiVGFibGUgRXh0cmEgUGlwZXNcIlxuICAgIGRlc2NyaXB0aW9uOiBcIkluc2VydCBleHRyYSBwaXBlcyBhdCB0aGUgc3RhcnQgYW5kIHRoZSBlbmQgb2YgdGhlIHRhYmxlIHJvd3NcIlxuICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldERlZmF1bHQoXCJ0YWJsZUV4dHJhUGlwZXNcIilcbiJdfQ==
