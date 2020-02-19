(function() {
  var PublishDraft, path, pathSep;

  path = require("path");

  PublishDraft = require("../../lib/commands/publish-draft");

  pathSep = "[/\\\\]";

  describe("PublishDraft", function() {
    var editor, publishDraft, ref;
    ref = [], editor = ref[0], publishDraft = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".trigger", function() {
      return it("abort publish draft when not confirm publish", function() {
        publishDraft = new PublishDraft({});
        publishDraft.confirmPublish = function() {
          return {};
        };
        publishDraft.trigger();
        expect(publishDraft.draftPath).toMatch(RegExp(pathSep + "fixtures" + pathSep + "empty\\.markdown$"));
        return expect(publishDraft.postPath).toMatch(RegExp(pathSep + "\\d{4}" + pathSep + "\\d{4}-\\d\\d-\\d\\d-empty\\.markdown$"));
      });
    });
    describe(".getSlug", function() {
      it("get title from front matter by config", function() {
        atom.config.set("markdown-writer.publishRenameBasedOnTitle", true);
        editor.setText("---\ntitle: Markdown Writer\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft.getSlug()).toBe("markdown-writer");
      });
      it("get title from front matter if no draft path", function() {
        editor.setText("---\ntitle: Markdown Writer (New Post)\n---");
        publishDraft = new PublishDraft({});
        publishDraft.draftPath = void 0;
        return expect(publishDraft.getSlug()).toBe("markdown-writer-new-post");
      });
      it("get title from draft path", function() {
        publishDraft = new PublishDraft({});
        publishDraft.draftPath = path.join("test", "name-of-post.md");
        return expect(publishDraft.getSlug()).toBe("name-of-post");
      });
      return it("get new-post when no front matter/draft path", function() {
        publishDraft = new PublishDraft({});
        publishDraft.draftPath = void 0;
        return expect(publishDraft.getSlug()).toBe("new-post");
      });
    });
    return describe(".getExtension", function() {
      beforeEach(function() {
        return publishDraft = new PublishDraft({});
      });
      it("get draft path extname by config", function() {
        atom.config.set("markdown-writer.publishKeepFileExtname", true);
        publishDraft.draftPath = path.join("test", "name.md");
        return expect(publishDraft.getExtension()).toBe(".md");
      });
      return it("get default extname", function() {
        publishDraft.draftPath = path.join("test", "name.md");
        return expect(publishDraft.getExtension()).toBe(".markdown");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvcHVibGlzaC1kcmFmdC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLFlBQUEsR0FBZSxPQUFBLENBQVEsa0NBQVI7O0VBRWYsT0FBQSxHQUFVOztFQUVWLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUE7QUFDdkIsUUFBQTtJQUFBLE1BQXlCLEVBQXpCLEVBQUMsZUFBRCxFQUFTO0lBRVQsVUFBQSxDQUFXLFNBQUE7TUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCO01BQUgsQ0FBaEI7YUFDQSxJQUFBLENBQUssU0FBQTtlQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFBWixDQUFMO0lBRlMsQ0FBWDtJQUlBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUE7YUFDbkIsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUE7UUFDakQsWUFBQSxHQUFlLElBQUksWUFBSixDQUFpQixFQUFqQjtRQUNmLFlBQVksQ0FBQyxjQUFiLEdBQThCLFNBQUE7aUJBQUc7UUFBSDtRQUU5QixZQUFZLENBQUMsT0FBYixDQUFBO1FBRUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxTQUFwQixDQUE4QixDQUFDLE9BQS9CLENBQXVDLE1BQUEsQ0FBTSxPQUFELEdBQVMsVUFBVCxHQUFtQixPQUFuQixHQUEyQixtQkFBaEMsQ0FBdkM7ZUFDQSxNQUFBLENBQU8sWUFBWSxDQUFDLFFBQXBCLENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsTUFBQSxDQUFNLE9BQUQsR0FBUyxRQUFULEdBQWdCLE9BQWhCLEdBQXdCLHdDQUE3QixDQUF0QztNQVBpRCxDQUFuRDtJQURtQixDQUFyQjtJQVVBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUE7TUFDbkIsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUE7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJDQUFoQixFQUE2RCxJQUE3RDtRQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsa0NBQWY7UUFNQSxZQUFBLEdBQWUsSUFBSSxZQUFKLENBQWlCLEVBQWpCO2VBQ2YsTUFBQSxDQUFPLFlBQVksQ0FBQyxPQUFiLENBQUEsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLGlCQUFwQztNQVQwQyxDQUE1QztNQVdBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO1FBQ2pELE1BQU0sQ0FBQyxPQUFQLENBQWUsNkNBQWY7UUFNQSxZQUFBLEdBQWUsSUFBSSxZQUFKLENBQWlCLEVBQWpCO1FBQ2YsWUFBWSxDQUFDLFNBQWIsR0FBeUI7ZUFDekIsTUFBQSxDQUFPLFlBQVksQ0FBQyxPQUFiLENBQUEsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLDBCQUFwQztNQVRpRCxDQUFuRDtNQVdBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO1FBQzlCLFlBQUEsR0FBZSxJQUFJLFlBQUosQ0FBaUIsRUFBakI7UUFDZixZQUFZLENBQUMsU0FBYixHQUF5QixJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBa0IsaUJBQWxCO2VBQ3pCLE1BQUEsQ0FBTyxZQUFZLENBQUMsT0FBYixDQUFBLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxjQUFwQztNQUg4QixDQUFoQzthQUtBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO1FBQ2pELFlBQUEsR0FBZSxJQUFJLFlBQUosQ0FBaUIsRUFBakI7UUFDZixZQUFZLENBQUMsU0FBYixHQUF5QjtlQUN6QixNQUFBLENBQU8sWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsVUFBcEM7TUFIaUQsQ0FBbkQ7SUE1Qm1CLENBQXJCO1dBaUNBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7TUFDeEIsVUFBQSxDQUFXLFNBQUE7ZUFBRyxZQUFBLEdBQWUsSUFBSSxZQUFKLENBQWlCLEVBQWpCO01BQWxCLENBQVg7TUFFQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtRQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFEO1FBQ0EsWUFBWSxDQUFDLFNBQWIsR0FBeUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFNBQWxCO2VBQ3pCLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBYixDQUFBLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxLQUF6QztNQUhxQyxDQUF2QzthQUtBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBO1FBQ3hCLFlBQVksQ0FBQyxTQUFiLEdBQXlCLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFrQixTQUFsQjtlQUN6QixNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBQSxDQUFQLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsV0FBekM7TUFGd0IsQ0FBMUI7SUFSd0IsQ0FBMUI7RUFsRHVCLENBQXpCO0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuUHVibGlzaERyYWZ0ID0gcmVxdWlyZSBcIi4uLy4uL2xpYi9jb21tYW5kcy9wdWJsaXNoLWRyYWZ0XCJcblxucGF0aFNlcCA9IFwiWy9cXFxcXFxcXF1cIlxuXG5kZXNjcmliZSBcIlB1Ymxpc2hEcmFmdFwiLCAtPlxuICBbZWRpdG9yLCBwdWJsaXNoRHJhZnRdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJlbXB0eS5tYXJrZG93blwiKVxuICAgIHJ1bnMgLT4gZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZGVzY3JpYmUgXCIudHJpZ2dlclwiLCAtPlxuICAgIGl0IFwiYWJvcnQgcHVibGlzaCBkcmFmdCB3aGVuIG5vdCBjb25maXJtIHB1Ymxpc2hcIiwgLT5cbiAgICAgIHB1Ymxpc2hEcmFmdCA9IG5ldyBQdWJsaXNoRHJhZnQoe30pXG4gICAgICBwdWJsaXNoRHJhZnQuY29uZmlybVB1Ymxpc2ggPSAtPiB7fSAjIERvdWJsZSBjb25maXJtUHVibGlzaFxuXG4gICAgICBwdWJsaXNoRHJhZnQudHJpZ2dlcigpXG5cbiAgICAgIGV4cGVjdChwdWJsaXNoRHJhZnQuZHJhZnRQYXRoKS50b01hdGNoKC8vLyAje3BhdGhTZXB9Zml4dHVyZXMje3BhdGhTZXB9ZW1wdHlcXC5tYXJrZG93biQgLy8vKVxuICAgICAgZXhwZWN0KHB1Ymxpc2hEcmFmdC5wb3N0UGF0aCkudG9NYXRjaCgvLy8gI3twYXRoU2VwfVxcZHs0fSN7cGF0aFNlcH1cXGR7NH0tXFxkXFxkLVxcZFxcZC1lbXB0eVxcLm1hcmtkb3duJCAvLy8pXG5cbiAgZGVzY3JpYmUgXCIuZ2V0U2x1Z1wiLCAtPlxuICAgIGl0IFwiZ2V0IHRpdGxlIGZyb20gZnJvbnQgbWF0dGVyIGJ5IGNvbmZpZ1wiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnB1Ymxpc2hSZW5hbWVCYXNlZE9uVGl0bGVcIiwgdHJ1ZSlcbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgLS0tXG4gICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyXG4gICAgICAtLS1cbiAgICAgIFwiXCJcIlxuXG4gICAgICBwdWJsaXNoRHJhZnQgPSBuZXcgUHVibGlzaERyYWZ0KHt9KVxuICAgICAgZXhwZWN0KHB1Ymxpc2hEcmFmdC5nZXRTbHVnKCkpLnRvQmUoXCJtYXJrZG93bi13cml0ZXJcIilcblxuICAgIGl0IFwiZ2V0IHRpdGxlIGZyb20gZnJvbnQgbWF0dGVyIGlmIG5vIGRyYWZ0IHBhdGhcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgLS0tXG4gICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChOZXcgUG9zdClcbiAgICAgIC0tLVxuICAgICAgXCJcIlwiXG5cbiAgICAgIHB1Ymxpc2hEcmFmdCA9IG5ldyBQdWJsaXNoRHJhZnQoe30pXG4gICAgICBwdWJsaXNoRHJhZnQuZHJhZnRQYXRoID0gdW5kZWZpbmVkXG4gICAgICBleHBlY3QocHVibGlzaERyYWZ0LmdldFNsdWcoKSkudG9CZShcIm1hcmtkb3duLXdyaXRlci1uZXctcG9zdFwiKVxuXG4gICAgaXQgXCJnZXQgdGl0bGUgZnJvbSBkcmFmdCBwYXRoXCIsIC0+XG4gICAgICBwdWJsaXNoRHJhZnQgPSBuZXcgUHVibGlzaERyYWZ0KHt9KVxuICAgICAgcHVibGlzaERyYWZ0LmRyYWZ0UGF0aCA9IHBhdGguam9pbihcInRlc3RcIiwgXCJuYW1lLW9mLXBvc3QubWRcIilcbiAgICAgIGV4cGVjdChwdWJsaXNoRHJhZnQuZ2V0U2x1ZygpKS50b0JlKFwibmFtZS1vZi1wb3N0XCIpXG5cbiAgICBpdCBcImdldCBuZXctcG9zdCB3aGVuIG5vIGZyb250IG1hdHRlci9kcmFmdCBwYXRoXCIsIC0+XG4gICAgICBwdWJsaXNoRHJhZnQgPSBuZXcgUHVibGlzaERyYWZ0KHt9KVxuICAgICAgcHVibGlzaERyYWZ0LmRyYWZ0UGF0aCA9IHVuZGVmaW5lZFxuICAgICAgZXhwZWN0KHB1Ymxpc2hEcmFmdC5nZXRTbHVnKCkpLnRvQmUoXCJuZXctcG9zdFwiKVxuXG4gIGRlc2NyaWJlIFwiLmdldEV4dGVuc2lvblwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gcHVibGlzaERyYWZ0ID0gbmV3IFB1Ymxpc2hEcmFmdCh7fSlcblxuICAgIGl0IFwiZ2V0IGRyYWZ0IHBhdGggZXh0bmFtZSBieSBjb25maWdcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5wdWJsaXNoS2VlcEZpbGVFeHRuYW1lXCIsIHRydWUpXG4gICAgICBwdWJsaXNoRHJhZnQuZHJhZnRQYXRoID0gcGF0aC5qb2luKFwidGVzdFwiLCBcIm5hbWUubWRcIilcbiAgICAgIGV4cGVjdChwdWJsaXNoRHJhZnQuZ2V0RXh0ZW5zaW9uKCkpLnRvQmUoXCIubWRcIilcblxuICAgIGl0IFwiZ2V0IGRlZmF1bHQgZXh0bmFtZVwiLCAtPlxuICAgICAgcHVibGlzaERyYWZ0LmRyYWZ0UGF0aCA9IHBhdGguam9pbihcInRlc3RcIiwgXCJuYW1lLm1kXCIpXG4gICAgICBleHBlY3QocHVibGlzaERyYWZ0LmdldEV4dGVuc2lvbigpKS50b0JlKFwiLm1hcmtkb3duXCIpXG4iXX0=
