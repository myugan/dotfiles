(function() {
  var $, FrontMatter, PublishDraft, config, fs, path, shell, templateHelper, utils;

  $ = require("atom-space-pen-views").$;

  fs = require("fs-plus");

  path = require("path");

  shell = require("shell");

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  FrontMatter = require("../helpers/front-matter");

  module.exports = PublishDraft = (function() {
    function PublishDraft() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.draftPath = this.editor.getPath();
      this.frontMatter = new FrontMatter(this.editor);
      this.dateTime = templateHelper.getDateTime();
    }

    PublishDraft.prototype.trigger = function(e) {
      this.updateFrontMatter();
      this.postPath = this.getPostPath();
      return this.confirmPublish((function(_this) {
        return function() {
          var error;
          try {
            _this.editor.saveAs(_this.postPath);
            if (_this.draftPath) {
              return shell.moveItemToTrash(_this.draftPath);
            }
          } catch (error1) {
            error = error1;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Publish Draft:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    };

    PublishDraft.prototype.confirmPublish = function(callback) {
      if (fs.existsSync(this.postPath)) {
        return atom.confirm({
          message: "Do you want to overwrite file?",
          detailedMessage: "Another file already exists at:\n" + this.postPath,
          buttons: {
            "Confirm": callback,
            "Cancel": null
          }
        });
      } else if (this.draftPath === this.postPath) {
        return atom.confirm({
          message: "This file is published!",
          detailedMessage: "This file already published at:\n" + this.draftPath,
          buttons: ['OK']
        });
      } else {
        return callback();
      }
    };

    PublishDraft.prototype.updateFrontMatter = function() {
      if (this.frontMatter.isEmpty) {
        return;
      }
      this.frontMatter.setIfExists("published", true);
      this.frontMatter.setIfExists("draft", false);
      this.frontMatter.setIfExists("date", templateHelper.getFrontMatterDate(this.dateTime));
      return this.frontMatter.save();
    };

    PublishDraft.prototype.getPostPath = function() {
      var fileName, frontMatter, localDir, postsDir;
      frontMatter = templateHelper.getFrontMatter(this);
      localDir = utils.getSitePath(config.get("siteLocalDir"), this.editor.getPath());
      postsDir = templateHelper.create("sitePostsDir", frontMatter, this.dateTime);
      fileName = templateHelper.create("newPostFileName", frontMatter, this.dateTime);
      return path.join(localDir, postsDir, fileName);
    };

    PublishDraft.prototype.getLayout = function() {
      return this.frontMatter.get("layout");
    };

    PublishDraft.prototype.getPublished = function() {
      return this.frontMatter.get("published");
    };

    PublishDraft.prototype.getTitle = function() {
      return this.frontMatter.get("title");
    };

    PublishDraft.prototype.getSlug = function() {
      var slug, useFrontMatter;
      useFrontMatter = !this.draftPath || !!config.get("publishRenameBasedOnTitle");
      if (useFrontMatter) {
        slug = utils.slugize(this.frontMatter.get("title"), config.get('slugSeparator'));
      }
      return slug || templateHelper.getFileSlug(this.draftPath) || utils.slugize("New Post", config.get('slugSeparator'));
    };

    PublishDraft.prototype.getDate = function() {
      return templateHelper.getFrontMatterDate(this.dateTime);
    };

    PublishDraft.prototype.getExtension = function() {
      var extname, keepExtension;
      keepExtension = this.draftPath && !!config.get("publishKeepFileExtname");
      if (keepExtension) {
        extname = path.extname(this.draftPath);
      }
      return extname || config.get("fileExtension");
    };

    return PublishDraft;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9wdWJsaXNoLWRyYWZ0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBQ04sRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBRVIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFDUixjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFDakIsV0FBQSxHQUFjLE9BQUEsQ0FBUSx5QkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msc0JBQUE7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNWLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7TUFDYixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksV0FBSixDQUFnQixJQUFDLENBQUEsTUFBakI7TUFDZixJQUFDLENBQUEsUUFBRCxHQUFZLGNBQWMsQ0FBQyxXQUFmLENBQUE7SUFKRDs7MkJBTWIsT0FBQSxHQUFTLFNBQUMsQ0FBRDtNQUNQLElBQUMsQ0FBQSxpQkFBRCxDQUFBO01BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsV0FBRCxDQUFBO2FBQ1osSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2QsY0FBQTtBQUFBO1lBQ0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBQyxDQUFBLFFBQWhCO1lBQ0EsSUFBcUMsS0FB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QVcsQ0FBQyxHQUFiLENBQWlCLE9BQWpCLENBQWQsRUFBeUMsTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYLENBQXpDLEVBQVA7O2FBQ0EsSUFBQSxJQUFRLGNBQWMsQ0FBQyxXQUFmLENBQTJCLElBQUMsQ0FBQSxTQUE1QixDQUFSLElBQWtELEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBZCxFQUEwQixNQUFNLENBQUMsR0FBUCxDQUFXLGVBQVgsQ0FBMUI7SUFMM0M7OzJCQU1ULE9BQUEsR0FBUyxTQUFBO2FBQUcsY0FBYyxDQUFDLGtCQUFmLENBQWtDLElBQUMsQ0FBQSxRQUFuQztJQUFIOzsyQkFDVCxZQUFBLEdBQWMsU0FBQTtBQUVaLFVBQUE7TUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxTQUFELElBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFQLENBQVcsd0JBQVg7TUFDaEMsSUFBc0MsYUFBdEM7UUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFDLENBQUEsU0FBZCxFQUFWOzthQUNBLE9BQUEsSUFBVyxNQUFNLENBQUMsR0FBUCxDQUFXLGVBQVg7SUFKQzs7Ozs7QUE1RWhCIiwic291cmNlc0NvbnRlbnQiOlsieyR9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbmZzID0gcmVxdWlyZSBcImZzLXBsdXNcIlxucGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcbnNoZWxsID0gcmVxdWlyZSBcInNoZWxsXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG50ZW1wbGF0ZUhlbHBlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL3RlbXBsYXRlLWhlbHBlclwiXG5Gcm9udE1hdHRlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL2Zyb250LW1hdHRlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFB1Ymxpc2hEcmFmdFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQGRyYWZ0UGF0aCA9IEBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgQGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKEBlZGl0b3IpXG4gICAgQGRhdGVUaW1lID0gdGVtcGxhdGVIZWxwZXIuZ2V0RGF0ZVRpbWUoKVxuXG4gIHRyaWdnZXI6IChlKSAtPlxuICAgIEB1cGRhdGVGcm9udE1hdHRlcigpXG5cbiAgICBAcG9zdFBhdGggPSBAZ2V0UG9zdFBhdGgoKVxuICAgIEBjb25maXJtUHVibGlzaCA9PlxuICAgICAgdHJ5XG4gICAgICAgIEBlZGl0b3Iuc2F2ZUFzKEBwb3N0UGF0aClcbiAgICAgICAgc2hlbGwubW92ZUl0ZW1Ub1RyYXNoKEBkcmFmdFBhdGgpIGlmIEBkcmFmdFBhdGhcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIGF0b20uY29uZmlybVxuICAgICAgICAgIG1lc3NhZ2U6IFwiW01hcmtkb3duIFdyaXRlcl0gRXJyb3IhXCJcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiUHVibGlzaCBEcmFmdDpcXG4je2Vycm9yLm1lc3NhZ2V9XCJcbiAgICAgICAgICBidXR0b25zOiBbJ09LJ11cblxuICBjb25maXJtUHVibGlzaDogKGNhbGxiYWNrKSAtPlxuICAgIGlmIGZzLmV4aXN0c1N5bmMoQHBvc3RQYXRoKVxuICAgICAgYXRvbS5jb25maXJtXG4gICAgICAgIG1lc3NhZ2U6IFwiRG8geW91IHdhbnQgdG8gb3ZlcndyaXRlIGZpbGU/XCJcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkFub3RoZXIgZmlsZSBhbHJlYWR5IGV4aXN0cyBhdDpcXG4je0Bwb3N0UGF0aH1cIlxuICAgICAgICBidXR0b25zOlxuICAgICAgICAgIFwiQ29uZmlybVwiOiBjYWxsYmFja1xuICAgICAgICAgIFwiQ2FuY2VsXCI6IG51bGxcbiAgICBlbHNlIGlmIEBkcmFmdFBhdGggPT0gQHBvc3RQYXRoXG4gICAgICBhdG9tLmNvbmZpcm1cbiAgICAgICAgbWVzc2FnZTogXCJUaGlzIGZpbGUgaXMgcHVibGlzaGVkIVwiXG4gICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJUaGlzIGZpbGUgYWxyZWFkeSBwdWJsaXNoZWQgYXQ6XFxuI3tAZHJhZnRQYXRofVwiXG4gICAgICAgIGJ1dHRvbnM6IFsnT0snXVxuICAgIGVsc2UgY2FsbGJhY2soKVxuXG4gIHVwZGF0ZUZyb250TWF0dGVyOiAtPlxuICAgIHJldHVybiBpZiBAZnJvbnRNYXR0ZXIuaXNFbXB0eVxuXG4gICAgQGZyb250TWF0dGVyLnNldElmRXhpc3RzKFwicHVibGlzaGVkXCIsIHRydWUpXG4gICAgQGZyb250TWF0dGVyLnNldElmRXhpc3RzKFwiZHJhZnRcIiwgZmFsc2UpXG4gICAgQGZyb250TWF0dGVyLnNldElmRXhpc3RzKFwiZGF0ZVwiLCB0ZW1wbGF0ZUhlbHBlci5nZXRGcm9udE1hdHRlckRhdGUoQGRhdGVUaW1lKSlcblxuICAgIEBmcm9udE1hdHRlci5zYXZlKClcblxuICBnZXRQb3N0UGF0aDogLT5cbiAgICBmcm9udE1hdHRlcj0gdGVtcGxhdGVIZWxwZXIuZ2V0RnJvbnRNYXR0ZXIodGhpcylcblxuICAgIGxvY2FsRGlyID0gdXRpbHMuZ2V0U2l0ZVBhdGgoY29uZmlnLmdldChcInNpdGVMb2NhbERpclwiKSwgQGVkaXRvci5nZXRQYXRoKCkpXG4gICAgcG9zdHNEaXIgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJzaXRlUG9zdHNEaXJcIiwgZnJvbnRNYXR0ZXIsIEBkYXRlVGltZSlcbiAgICBmaWxlTmFtZSA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcIm5ld1Bvc3RGaWxlTmFtZVwiLCBmcm9udE1hdHRlciwgQGRhdGVUaW1lKVxuXG4gICAgcGF0aC5qb2luKGxvY2FsRGlyLCBwb3N0c0RpciwgZmlsZU5hbWUpXG5cbiAgIyBjb21tb24gaW50ZXJmYWNlIGZvciBGcm9udE1hdHRlclxuICBnZXRMYXlvdXQ6IC0+IEBmcm9udE1hdHRlci5nZXQoXCJsYXlvdXRcIilcbiAgZ2V0UHVibGlzaGVkOiAtPiBAZnJvbnRNYXR0ZXIuZ2V0KFwicHVibGlzaGVkXCIpXG4gIGdldFRpdGxlOiAtPiBAZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIilcbiAgZ2V0U2x1ZzogLT5cbiAgICAjIGRlcml2ZSBzbHVnIGZyb20gZnJvbnQgbWF0dGVycyBpZiBjdXJyZW50IGZpbGUgaXMgbm90IHNhdmVkIChub3QgaGF2aW5nIGEgcGF0aCksIG9yXG4gICAgIyBjb25maWd1cmVkIHRvIHJlbmFtZSBiYXNlIG9uIHRpdGxlIG9yIHRoZSBmaWxlIHBhdGggZG9lbid0IGV4aXN0cy5cbiAgICB1c2VGcm9udE1hdHRlciA9ICFAZHJhZnRQYXRoIHx8ICEhY29uZmlnLmdldChcInB1Ymxpc2hSZW5hbWVCYXNlZE9uVGl0bGVcIilcbiAgICBzbHVnID0gdXRpbHMuc2x1Z2l6ZShAZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIiksIGNvbmZpZy5nZXQoJ3NsdWdTZXBhcmF0b3InKSkgaWYgdXNlRnJvbnRNYXR0ZXJcbiAgICBzbHVnIHx8IHRlbXBsYXRlSGVscGVyLmdldEZpbGVTbHVnKEBkcmFmdFBhdGgpIHx8IHV0aWxzLnNsdWdpemUoXCJOZXcgUG9zdFwiLCBjb25maWcuZ2V0KCdzbHVnU2VwYXJhdG9yJykpXG4gIGdldERhdGU6IC0+IHRlbXBsYXRlSGVscGVyLmdldEZyb250TWF0dGVyRGF0ZShAZGF0ZVRpbWUpXG4gIGdldEV4dGVuc2lvbjogLT5cbiAgICAjIGtlZXAgZmlsZSBleHRlbnNpb24gaWYgcGF0aCBleGlzdHMgYW5kIGhhcyBjb25maWd1cmVkIHRvIGtlZXAgaXQuXG4gICAga2VlcEV4dGVuc2lvbiA9IEBkcmFmdFBhdGggJiYgISFjb25maWcuZ2V0KFwicHVibGlzaEtlZXBGaWxlRXh0bmFtZVwiKVxuICAgIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoQGRyYWZ0UGF0aCkgaWYga2VlcEV4dGVuc2lvblxuICAgIGV4dG5hbWUgfHwgY29uZmlnLmdldChcImZpbGVFeHRlbnNpb25cIilcbiJdfQ==
