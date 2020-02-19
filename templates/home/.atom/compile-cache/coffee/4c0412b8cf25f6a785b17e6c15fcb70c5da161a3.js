(function() {
  var StyleText;

  StyleText = require("../../lib/commands/style-text");

  describe("StyleText", function() {
    describe(".isStyleOn", function() {
      it("check a style is added", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "**bold**";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any bold style is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "hello **bold** world";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any italic is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic_ yah _text_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any strike is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("strikethrough");
        fixture = "**bold** one ~~strike~~ two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any deletion is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("deletion");
        fixture = "**bold** one {--deletion--} two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any addition is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("addition");
        fixture = "**bold** one {++addition++} two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any substitution is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("substitution");
        fixture = "**bold** one {~~substitution of~>~~} two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any comment is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("comment");
        fixture = "**bold** one {>>comment<<} two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any highlight is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("highlight");
        fixture = "**bold** one {==highlighted==}{>><<} two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      return it("check a style is not added", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "_not bold_";
        return expect(cmd.isStyleOn(fixture)).toBe(false);
      });
    });
    describe(".removeStyle", function() {
      it("remove a style from text", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic text_";
        return expect(cmd.removeStyle(fixture)).toEqual("italic text");
      });
      it("remove bold style from text", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "**bold text** in a string";
        return expect(cmd.removeStyle(fixture)).toEqual("bold text in a string");
      });
      return it("remove italic styles from text", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic_ yah _text_ loh _more_";
        return expect(cmd.removeStyle(fixture)).toEqual("italic yah text loh more");
      });
    });
    describe(".addStyle", function() {
      return it("add a style to text", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "bold text";
        return expect(cmd.addStyle(fixture)).toEqual("**bold text**");
      });
    });
    return describe(".trigger", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("insert empty bold style", function() {
        new StyleText("bold").trigger();
        expect(editor.getText()).toBe("****");
        return expect(editor.getCursorBufferPosition().column).toBe(2);
      });
      it("apply italic style to word", function() {
        editor.setText("italic");
        editor.setCursorBufferPosition([0, 2]);
        new StyleText("italic").trigger();
        expect(editor.getText()).toBe("_italic_");
        return expect(editor.getCursorBufferPosition().column).toBe(8);
      });
      it("remove italic style from word", function() {
        editor.setText("_italic_");
        editor.setCursorBufferPosition([0, 3]);
        new StyleText("italic").trigger();
        expect(editor.getText()).toBe("italic");
        return expect(editor.getCursorBufferPosition().column).toBe(6);
      });
      return it("toggle code style on selection", function() {
        editor.setText("some code here");
        editor.setSelectedBufferRange([[0, 5], [0, 9]]);
        new StyleText("code").trigger();
        expect(editor.getText()).toBe("some `code` here");
        return expect(editor.getCursorBufferPosition().column).toBe(11);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvc3R5bGUtdGV4dC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSwrQkFBUjs7RUFFWixRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBO0lBQ3BCLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUE7TUFDckIsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7QUFDM0IsWUFBQTtRQUFBLEdBQUEsR0FBTSxJQUFJLFNBQUosQ0FBYyxNQUFkO1FBQ04sT0FBQSxHQUFVO2VBQ1YsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsSUFBcEM7TUFIMkIsQ0FBN0I7TUFLQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQTtBQUN0QyxZQUFBO1FBQUEsR0FBQSxHQUFNLElBQUksU0FBSixDQUFjLE1BQWQ7UUFDTixPQUFBLEdBQVU7ZUFDVixNQUFBLENBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxPQUFkLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxJQUFwQztNQUhzQyxDQUF4QztNQUtBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO0FBQ2xDLFlBQUE7UUFBQSxHQUFBLEdBQU0sSUFBSSxTQUFKLENBQWMsUUFBZDtRQUNOLE9BQUEsR0FBVTtlQUNWLE1BQUEsQ0FBTyxHQUFHLENBQUMsU0FBSixDQUFjLE9BQWQsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLElBQXBDO01BSGtDLENBQXBDO01BS0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7QUFDbEMsWUFBQTtRQUFBLEdBQUEsR0FBTSxJQUFJLFNBQUosQ0FBYyxlQUFkO1FBQ04sT0FBQSxHQUFVO2VB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ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxNQUF4QyxDQUErQyxDQUFDLElBQWhELENBQXFELENBQXJEO01BUCtCLENBQWpDO01BU0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7UUFDbEMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFQSxJQUFJLFNBQUosQ0FBYyxRQUFkLENBQXVCLENBQUMsT0FBeEIsQ0FBQTtRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLE1BQXhDLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsQ0FBckQ7TUFQa0MsQ0FBcEM7YUFTQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQTtRQUNuQyxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmO1FBQ0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQTlCO1FBRUEsSUFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixDQUFDLE9BQXRCLENBQUE7UUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsTUFBeEMsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxFQUFyRDtNQVBtQyxDQUFyQztJQS9CbUIsQ0FBckI7RUExRW9CLENBQXRCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJcblN0eWxlVGV4dCA9IHJlcXVpcmUgXCIuLi8uLi9saWIvY29tbWFuZHMvc3R5bGUtdGV4dFwiXG5cbmRlc2NyaWJlIFwiU3R5bGVUZXh0XCIsIC0+XG4gIGRlc2NyaWJlIFwiLmlzU3R5bGVPblwiLCAtPlxuICAgIGl0IFwiY2hlY2sgYSBzdHlsZSBpcyBhZGRlZFwiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcImJvbGRcIilcbiAgICAgIGZpeHR1cmUgPSBcIioqYm9sZCoqXCJcbiAgICAgIGV4cGVjdChjbWQuaXNTdHlsZU9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGFueSBib2xkIHN0eWxlIGlzIGluIHN0cmluZ1wiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcImJvbGRcIilcbiAgICAgIGZpeHR1cmUgPSBcImhlbGxvICoqYm9sZCoqIHdvcmxkXCJcbiAgICAgIGV4cGVjdChjbWQuaXNTdHlsZU9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGFueSBpdGFsaWMgaXMgaW4gc3RyaW5nXCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiaXRhbGljXCIpXG4gICAgICBmaXh0dXJlID0gXCJfaXRhbGljXyB5YWggX3RleHRfXCJcbiAgICAgIGV4cGVjdChjbWQuaXNTdHlsZU9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGFueSBzdHJpa2UgaXMgaW4gc3RyaW5nXCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwic3RyaWtldGhyb3VnaFwiKVxuICAgICAgZml4dHVyZSA9IFwiKipib2xkKiogb25lIH5+c3RyaWtlfn4gdHdvIF9pdGFsaWNfXCJcbiAgICAgIGV4cGVjdChjbWQuaXNTdHlsZU9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGFueSBkZWxldGlvbiBpcyBpbiBzdHJpbmdcIiwgLT5cbiAgICAgIGNtZCA9IG5ldyBTdHlsZVRleHQoXCJkZWxldGlvblwiKVxuICAgICAgZml4dHVyZSA9IFwiKipib2xkKiogb25lIHstLWRlbGV0aW9uLS19IHR3byBfaXRhbGljX1wiXG4gICAgICBleHBlY3QoY21kLmlzU3R5bGVPbihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBhbnkgYWRkaXRpb24gaXMgaW4gc3RyaW5nXCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiYWRkaXRpb25cIilcbiAgICAgIGZpeHR1cmUgPSBcIioqYm9sZCoqIG9uZSB7KythZGRpdGlvbisrfSB0d28gX2l0YWxpY19cIlxuICAgICAgZXhwZWN0KGNtZC5pc1N0eWxlT24oZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiY2hlY2sgYW55IHN1YnN0aXR1dGlvbiBpcyBpbiBzdHJpbmdcIiwgLT5cbiAgICAgIGNtZCA9IG5ldyBTdHlsZVRleHQoXCJzdWJzdGl0dXRpb25cIilcbiAgICAgIGZpeHR1cmUgPSBcIioqYm9sZCoqIG9uZSB7fn5zdWJzdGl0dXRpb24gb2Z+Pn5+fSB0d28gX2l0YWxpY19cIlxuICAgICAgZXhwZWN0KGNtZC5pc1N0eWxlT24oZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiY2hlY2sgYW55IGNvbW1lbnQgaXMgaW4gc3RyaW5nXCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiY29tbWVudFwiKVxuICAgICAgZml4dHVyZSA9IFwiKipib2xkKiogb25lIHs+PmNvbW1lbnQ8PH0gdHdvIF9pdGFsaWNfXCJcbiAgICAgIGV4cGVjdChjbWQuaXNTdHlsZU9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGFueSBoaWdobGlnaHQgaXMgaW4gc3RyaW5nXCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiaGlnaGxpZ2h0XCIpXG4gICAgICBmaXh0dXJlID0gXCIqKmJvbGQqKiBvbmUgez09aGlnaGxpZ2h0ZWQ9PX17Pj48PH0gdHdvIF9pdGFsaWNfXCJcbiAgICAgIGV4cGVjdChjbWQuaXNTdHlsZU9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGEgc3R5bGUgaXMgbm90IGFkZGVkXCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiYm9sZFwiKVxuICAgICAgZml4dHVyZSA9IFwiX25vdCBib2xkX1wiXG4gICAgICBleHBlY3QoY21kLmlzU3R5bGVPbihmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICBkZXNjcmliZSBcIi5yZW1vdmVTdHlsZVwiLCAtPlxuICAgIGl0IFwicmVtb3ZlIGEgc3R5bGUgZnJvbSB0ZXh0XCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiaXRhbGljXCIpXG4gICAgICBmaXh0dXJlID0gXCJfaXRhbGljIHRleHRfXCJcbiAgICAgIGV4cGVjdChjbWQucmVtb3ZlU3R5bGUoZml4dHVyZSkpLnRvRXF1YWwoXCJpdGFsaWMgdGV4dFwiKVxuXG4gICAgaXQgXCJyZW1vdmUgYm9sZCBzdHlsZSBmcm9tIHRleHRcIiwgLT5cbiAgICAgIGNtZCA9IG5ldyBTdHlsZVRleHQoXCJib2xkXCIpXG4gICAgICBmaXh0dXJlID0gXCIqKmJvbGQgdGV4dCoqIGluIGEgc3RyaW5nXCJcbiAgICAgIGV4cGVjdChjbWQucmVtb3ZlU3R5bGUoZml4dHVyZSkpLnRvRXF1YWwoXCJib2xkIHRleHQgaW4gYSBzdHJpbmdcIilcblxuICAgIGl0IFwicmVtb3ZlIGl0YWxpYyBzdHlsZXMgZnJvbSB0ZXh0XCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiaXRhbGljXCIpXG4gICAgICBmaXh0dXJlID0gXCJfaXRhbGljXyB5YWggX3RleHRfIGxvaCBfbW9yZV9cIlxuICAgICAgZXhwZWN0KGNtZC5yZW1vdmVTdHlsZShmaXh0dXJlKSkudG9FcXVhbChcIml0YWxpYyB5YWggdGV4dCBsb2ggbW9yZVwiKVxuXG4gIGRlc2NyaWJlIFwiLmFkZFN0eWxlXCIsIC0+XG4gICAgaXQgXCJhZGQgYSBzdHlsZSB0byB0ZXh0XCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiYm9sZFwiKVxuICAgICAgZml4dHVyZSA9IFwiYm9sZCB0ZXh0XCJcbiAgICAgIGV4cGVjdChjbWQuYWRkU3R5bGUoZml4dHVyZSkpLnRvRXF1YWwoXCIqKmJvbGQgdGV4dCoqXCIpXG5cbiAgZGVzY3JpYmUgXCIudHJpZ2dlclwiLCAtPlxuICAgIGVkaXRvciA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZW1wdHkubWFya2Rvd25cIilcbiAgICAgIHJ1bnMgLT4gZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBpdCBcImluc2VydCBlbXB0eSBib2xkIHN0eWxlXCIsIC0+XG4gICAgICBuZXcgU3R5bGVUZXh0KFwiYm9sZFwiKS50cmlnZ2VyKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCIqKioqXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkuY29sdW1uKS50b0JlKDIpXG5cbiAgICBpdCBcImFwcGx5IGl0YWxpYyBzdHlsZSB0byB3b3JkXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIml0YWxpY1wiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAyXSlcblxuICAgICAgbmV3IFN0eWxlVGV4dChcIml0YWxpY1wiKS50cmlnZ2VyKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCJfaXRhbGljX1wiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLmNvbHVtbikudG9CZSg4KVxuXG4gICAgaXQgXCJyZW1vdmUgaXRhbGljIHN0eWxlIGZyb20gd29yZFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJfaXRhbGljX1wiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAzXSlcblxuICAgICAgbmV3IFN0eWxlVGV4dChcIml0YWxpY1wiKS50cmlnZ2VyKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCJpdGFsaWNcIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5jb2x1bW4pLnRvQmUoNilcblxuICAgIGl0IFwidG9nZ2xlIGNvZGUgc3R5bGUgb24gc2VsZWN0aW9uXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcInNvbWUgY29kZSBoZXJlXCIpXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbWzAsIDVdLCBbMCwgOV1dKVxuXG4gICAgICBuZXcgU3R5bGVUZXh0KFwiY29kZVwiKS50cmlnZ2VyKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCJzb21lIGBjb2RlYCBoZXJlXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkuY29sdW1uKS50b0JlKDExKVxuIl19
