(function() {
  var InsertFootnoteView;

  InsertFootnoteView = require("../../lib/views/insert-footnote-view");

  describe("InsertFootnoteView", function() {
    var editor, insertFootnoteView, ref;
    ref = [], editor = ref[0], insertFootnoteView = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        insertFootnoteView = new InsertFootnoteView({});
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".display", function() {
      it("display without set footnote", function() {
        insertFootnoteView.display();
        expect(insertFootnoteView.footnote).toBeUndefined();
        return expect(insertFootnoteView.labelEditor.getText().length).toEqual(8);
      });
      return it("display with footnote set", function() {
        editor.setText("[^1]");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertFootnoteView.display();
        expect(insertFootnoteView.footnote).toEqual({
          label: "1",
          content: "",
          isDefinition: false
        });
        return expect(insertFootnoteView.labelEditor.getText()).toEqual("1");
      });
    });
    describe(".insertFootnote", function() {
      return it("insert footnote with content", function() {
        insertFootnoteView.display();
        insertFootnoteView.insertFootnote({
          label: "footnote",
          content: "content"
        });
        return expect(editor.getText()).toEqual("[^footnote]\n\n[^footnote]: content");
      });
    });
    return describe(".updateFootnote", function() {
      var expected, fixture;
      fixture = "[^footnote]\n\n[^footnote]:\ncontent";
      expected = "[^note]\n\n[^note]:\ncontent";
      beforeEach(function() {
        return editor.setText(fixture);
      });
      it("update footnote definition to new label", function() {
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertFootnoteView.display();
        insertFootnoteView.updateFootnote({
          label: "note",
          content: ""
        });
        return expect(editor.getText()).toEqual(expected);
      });
      return it("update footnote reference to new label", function() {
        editor.setCursorBufferPosition([2, 0]);
        editor.selectToBufferPosition([2, 13]);
        insertFootnoteView.display();
        insertFootnoteView.updateFootnote({
          label: "note",
          content: ""
        });
        return expect(editor.getText()).toEqual(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvaW5zZXJ0LWZvb3Rub3RlLXZpZXctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQ0FBUjs7RUFFckIsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7QUFDN0IsUUFBQTtJQUFBLE1BQStCLEVBQS9CLEVBQUMsZUFBRCxFQUFTO0lBRVQsVUFBQSxDQUFXLFNBQUE7TUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCO01BQUgsQ0FBaEI7YUFDQSxJQUFBLENBQUssU0FBQTtRQUNILGtCQUFBLEdBQXFCLElBQUksa0JBQUosQ0FBdUIsRUFBdkI7ZUFDckIsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUZOLENBQUw7SUFGUyxDQUFYO0lBTUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtNQUNuQixFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtRQUNqQyxrQkFBa0IsQ0FBQyxPQUFuQixDQUFBO1FBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLFFBQTFCLENBQW1DLENBQUMsYUFBcEMsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBL0IsQ0FBQSxDQUF3QyxDQUFDLE1BQWhELENBQXVELENBQUMsT0FBeEQsQ0FBZ0UsQ0FBaEU7TUFIaUMsQ0FBbkM7YUFLQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtRQUM5QixNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWY7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE1BQU0sQ0FBQyxpQkFBUCxDQUFBO1FBRUEsa0JBQWtCLENBQUMsT0FBbkIsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxRQUExQixDQUFtQyxDQUFDLE9BQXBDLENBQTRDO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxPQUFBLEVBQVMsRUFBckI7VUFBeUIsWUFBQSxFQUFjLEtBQXZDO1NBQTVDO2VBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxPQUEvQixDQUFBLENBQVAsQ0FBZ0QsQ0FBQyxPQUFqRCxDQUF5RCxHQUF6RDtNQVA4QixDQUFoQztJQU5tQixDQUFyQjtJQWVBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO2FBQzFCLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1FBQ2pDLGtCQUFrQixDQUFDLE9BQW5CLENBQUE7UUFDQSxrQkFBa0IsQ0FBQyxjQUFuQixDQUFrQztVQUFBLEtBQUEsRUFBTyxVQUFQO1VBQW1CLE9BQUEsRUFBUyxTQUE1QjtTQUFsQztlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxxQ0FBakM7TUFKaUMsQ0FBbkM7SUFEMEIsQ0FBNUI7V0FXQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQTtBQUMxQixVQUFBO01BQUEsT0FBQSxHQUFVO01BT1YsUUFBQSxHQUFXO01BT1gsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLE9BQWY7TUFEUyxDQUFYO01BR0EsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUE7UUFDNUMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtRQUVBLGtCQUFrQixDQUFDLE9BQW5CLENBQUE7UUFDQSxrQkFBa0IsQ0FBQyxjQUFuQixDQUFrQztVQUFBLEtBQUEsRUFBTyxNQUFQO1VBQWUsT0FBQSxFQUFTLEVBQXhCO1NBQWxDO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLFFBQWpDO01BUDRDLENBQTlDO2FBU0EsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7UUFDM0MsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5QjtRQUVBLGtCQUFrQixDQUFDLE9BQW5CLENBQUE7UUFDQSxrQkFBa0IsQ0FBQyxjQUFuQixDQUFrQztVQUFBLEtBQUEsRUFBTyxNQUFQO1VBQWUsT0FBQSxFQUFTLEVBQXhCO1NBQWxDO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLFFBQWpDO01BUDJDLENBQTdDO0lBM0IwQixDQUE1QjtFQW5DNkIsQ0FBL0I7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbIkluc2VydEZvb3Rub3RlVmlldyA9IHJlcXVpcmUgXCIuLi8uLi9saWIvdmlld3MvaW5zZXJ0LWZvb3Rub3RlLXZpZXdcIlxuXG5kZXNjcmliZSBcIkluc2VydEZvb3Rub3RlVmlld1wiLCAtPlxuICBbZWRpdG9yLCBpbnNlcnRGb290bm90ZVZpZXddID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJlbXB0eS5tYXJrZG93blwiKVxuICAgIHJ1bnMgLT5cbiAgICAgIGluc2VydEZvb3Rub3RlVmlldyA9IG5ldyBJbnNlcnRGb290bm90ZVZpZXcoe30pXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBkZXNjcmliZSBcIi5kaXNwbGF5XCIsIC0+XG4gICAgaXQgXCJkaXNwbGF5IHdpdGhvdXQgc2V0IGZvb3Rub3RlXCIsIC0+XG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcuZGlzcGxheSgpXG4gICAgICBleHBlY3QoaW5zZXJ0Rm9vdG5vdGVWaWV3LmZvb3Rub3RlKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChpbnNlcnRGb290bm90ZVZpZXcubGFiZWxFZGl0b3IuZ2V0VGV4dCgpLmxlbmd0aCkudG9FcXVhbCg4KVxuXG4gICAgaXQgXCJkaXNwbGF5IHdpdGggZm9vdG5vdGUgc2V0XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlteMV1cIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG5cbiAgICAgIGluc2VydEZvb3Rub3RlVmlldy5kaXNwbGF5KClcbiAgICAgIGV4cGVjdChpbnNlcnRGb290bm90ZVZpZXcuZm9vdG5vdGUpLnRvRXF1YWwobGFiZWw6IFwiMVwiLCBjb250ZW50OiBcIlwiLCBpc0RlZmluaXRpb246IGZhbHNlKVxuICAgICAgZXhwZWN0KGluc2VydEZvb3Rub3RlVmlldy5sYWJlbEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCIxXCIpXG5cbiAgZGVzY3JpYmUgXCIuaW5zZXJ0Rm9vdG5vdGVcIiwgLT5cbiAgICBpdCBcImluc2VydCBmb290bm90ZSB3aXRoIGNvbnRlbnRcIiwgLT5cbiAgICAgIGluc2VydEZvb3Rub3RlVmlldy5kaXNwbGF5KClcbiAgICAgIGluc2VydEZvb3Rub3RlVmlldy5pbnNlcnRGb290bm90ZShsYWJlbDogXCJmb290bm90ZVwiLCBjb250ZW50OiBcImNvbnRlbnRcIilcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwgXCJcIlwiXG5bXmZvb3Rub3RlXVxuXG5bXmZvb3Rub3RlXTogY29udGVudFxuICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgXCIudXBkYXRlRm9vdG5vdGVcIiwgLT5cbiAgICBmaXh0dXJlID0gXCJcIlwiXG5bXmZvb3Rub3RlXVxuXG5bXmZvb3Rub3RlXTpcbmNvbnRlbnRcbiAgICBcIlwiXCJcblxuICAgIGV4cGVjdGVkID0gXCJcIlwiXG5bXm5vdGVdXG5cbltebm90ZV06XG5jb250ZW50XG4gICAgXCJcIlwiXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChmaXh0dXJlKVxuXG4gICAgaXQgXCJ1cGRhdGUgZm9vdG5vdGUgZGVmaW5pdGlvbiB0byBuZXcgbGFiZWxcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBlZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuXG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcuZGlzcGxheSgpXG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcudXBkYXRlRm9vdG5vdGUobGFiZWw6IFwibm90ZVwiLCBjb250ZW50OiBcIlwiKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChleHBlY3RlZClcblxuICAgIGl0IFwidXBkYXRlIGZvb3Rub3RlIHJlZmVyZW5jZSB0byBuZXcgbGFiZWxcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMiwgMF0pXG4gICAgICBlZGl0b3Iuc2VsZWN0VG9CdWZmZXJQb3NpdGlvbihbMiwgMTNdKVxuXG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcuZGlzcGxheSgpXG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcudXBkYXRlRm9vdG5vdGUobGFiZWw6IFwibm90ZVwiLCBjb250ZW50OiBcIlwiKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChleHBlY3RlZClcbiJdfQ==
