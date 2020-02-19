(function() {
  var pkg;

  pkg = require("../package");

  describe("MarkdownWriter", function() {
    var activationPromise, ditor, editorView, ref, workspaceView;
    ref = [], workspaceView = ref[0], ditor = ref[1], editorView = ref[2], activationPromise = ref[3];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("test");
      });
      return runs(function() {
        var editor;
        workspaceView = atom.views.getView(atom.workspace);
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage("markdown-writer");
      });
    });
    pkg.activationCommands["atom-workspace"].forEach(function(cmd) {
      return it("registered workspace commands " + cmd, function() {
        atom.config.set("markdown-writer._skipAction", true);
        atom.commands.dispatch(workspaceView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
    return pkg.activationCommands["atom-text-editor"].forEach(function(cmd) {
      return it("registered editor commands " + cmd, function() {
        atom.config.set("markdown-writer._skipAction", true);
        atom.commands.dispatch(editorView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvbWFya2Rvd24td3JpdGVyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVI7O0VBT04sUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7QUFDekIsUUFBQTtJQUFBLE1BQXdELEVBQXhELEVBQUMsc0JBQUQsRUFBZ0IsY0FBaEIsRUFBdUIsbUJBQXZCLEVBQW1DO0lBRW5DLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE1BQXBCO01BQUgsQ0FBaEI7YUFDQSxJQUFBLENBQUssU0FBQTtBQUNILFlBQUE7UUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7UUFDaEIsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtRQUNULFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7ZUFDYixpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsaUJBQTlCO01BSmpCLENBQUw7SUFGUyxDQUFYO0lBWUEsR0FBRyxDQUFDLGtCQUFtQixDQUFBLGdCQUFBLENBQWlCLENBQUMsT0FBekMsQ0FBaUQsU0FBQyxHQUFEO2FBQy9DLEVBQUEsQ0FBRyxnQ0FBQSxHQUFpQyxHQUFwQyxFQUEyQyxTQUFBO1FBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsRUFBK0MsSUFBL0M7UUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsR0FBdEM7UUFFQSxlQUFBLENBQWdCLFNBQUE7aUJBQUc7UUFBSCxDQUFoQjtlQUNBLElBQUEsQ0FBSyxTQUFBO2lCQUFHLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCO1FBQUgsQ0FBTDtNQU55QyxDQUEzQztJQUQrQyxDQUFqRDtXQVNBLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQSxrQkFBQSxDQUFtQixDQUFDLE9BQTNDLENBQW1ELFNBQUMsR0FBRDthQUNqRCxFQUFBLENBQUcsNkJBQUEsR0FBOEIsR0FBakMsRUFBd0MsU0FBQTtRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLElBQS9DO1FBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLEdBQW5DO1FBRUEsZUFBQSxDQUFnQixTQUFBO2lCQUFHO1FBQUgsQ0FBaEI7ZUFDQSxJQUFBLENBQUssU0FBQTtpQkFBRyxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsSUFBYixDQUFrQixJQUFsQjtRQUFILENBQUw7TUFOc0MsQ0FBeEM7SUFEaUQsQ0FBbkQ7RUF4QnlCLENBQTNCO0FBUEEiLCJzb3VyY2VzQ29udGVudCI6WyJwa2cgPSByZXF1aXJlIFwiLi4vcGFja2FnZVwiXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuI1xuIyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbiMgb3IgYGZkZXNjcmliZWApLiBSZW1vdmUgdGhlIGBmYCB0byB1bmZvY3VzIHRoZSBibG9jay5cblxuZGVzY3JpYmUgXCJNYXJrZG93bldyaXRlclwiLCAtPlxuICBbd29ya3NwYWNlVmlldywgZGl0b3IsIGVkaXRvclZpZXcsIGFjdGl2YXRpb25Qcm9taXNlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwidGVzdFwiKVxuICAgIHJ1bnMgLT5cbiAgICAgIHdvcmtzcGFjZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgYWN0aXZhdGlvblByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShcIm1hcmtkb3duLXdyaXRlclwiKVxuXG4gICMgVG8gdGVzdCBkaXNwYXRjaCBjb21tYW5kcywgcmVtb3ZlIHRoZSBjb21tZW50cyBpbiBtYXJrZG93bi13cml0ZXIuY29mZmVlIHRvXG4gICMgbWFrZSBzdXJlIF9za2lwQWN0aW9uIG5vdCBhY3R1YWxseSB0cmlnZ2VyIGV2ZW50cy5cbiAgI1xuICAjIFRPRE8gVXBkYXRlIGluZGl2aWR1YWwgY29tbWFuZCBzcGVjcyB0byB0ZXN0IGNvbW1hbmQgZGlzcGF0Y2hlcyBpbiBmdXR1cmUuXG4gIHBrZy5hY3RpdmF0aW9uQ29tbWFuZHNbXCJhdG9tLXdvcmtzcGFjZVwiXS5mb3JFYWNoIChjbWQpIC0+XG4gICAgaXQgXCJyZWdpc3RlcmVkIHdvcmtzcGFjZSBjb21tYW5kcyAje2NtZH1cIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5fc2tpcEFjdGlvblwiLCB0cnVlKVxuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZVZpZXcsIGNtZClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGFjdGl2YXRpb25Qcm9taXNlXG4gICAgICBydW5zIC0+IGV4cGVjdCh0cnVlKS50b0JlKHRydWUpXG5cbiAgcGtnLmFjdGl2YXRpb25Db21tYW5kc1tcImF0b20tdGV4dC1lZGl0b3JcIl0uZm9yRWFjaCAoY21kKSAtPlxuICAgIGl0IFwicmVnaXN0ZXJlZCBlZGl0b3IgY29tbWFuZHMgI3tjbWR9XCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIuX3NraXBBY3Rpb25cIiwgdHJ1ZSlcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCBjbWQpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgcnVucyAtPiBleHBlY3QodHJ1ZSkudG9CZSh0cnVlKVxuIl19
