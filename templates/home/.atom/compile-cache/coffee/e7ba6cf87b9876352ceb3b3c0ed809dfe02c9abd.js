(function() {
  var InsertLinkView;

  InsertLinkView = require("../../lib/views/insert-link-view");

  describe("InsertLinkView", function() {
    var editor, insertLinkView, ref;
    ref = [], editor = ref[0], insertLinkView = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        insertLinkView = new InsertLinkView({});
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".insertLink", function() {
      it("insert inline link", function() {
        var link;
        insertLinkView.editor = {
          setTextInBufferRange: function() {
            return {};
          }
        };
        spyOn(insertLinkView.editor, "setTextInBufferRange");
        link = {
          text: "text",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.editor.setTextInBufferRange).toHaveBeenCalledWith(void 0, "[text](http://)");
      });
      it("insert reference link", function() {
        var link;
        spyOn(insertLinkView, "insertReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.insertReferenceLink).toHaveBeenCalledWith(link);
      });
      return it("update reference link", function() {
        var link;
        insertLinkView.definitionRange = {};
        spyOn(insertLinkView, "updateReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.updateReferenceLink).toHaveBeenCalledWith(link);
      });
    });
    describe(".updateReferenceLink", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.referenceIndentLength", 2);
      });
      it("update reference and definition", function() {
        var link;
        insertLinkView.referenceId = "ABC123";
        insertLinkView.range = "Range";
        insertLinkView.definitionRange = "DRange";
        insertLinkView.editor = {
          setTextInBufferRange: function() {
            return {};
          }
        };
        spyOn(insertLinkView.editor, "setTextInBufferRange");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.updateReferenceLink(link);
        expect(insertLinkView.editor.setTextInBufferRange.calls.length).toEqual(2);
        expect(insertLinkView.editor.setTextInBufferRange.calls[0].args).toEqual(["Range", "[text][ABC123]"]);
        return expect(insertLinkView.editor.setTextInBufferRange.calls[1].args).toEqual(["DRange", '  [ABC123]: http:// "this is title"']);
      });
      return it("update reference only if definition template is empty", function() {
        var link;
        atom.config.set("markdown-writer.referenceDefinitionTag", "");
        insertLinkView.referenceId = "ABC123";
        insertLinkView.range = "Range";
        insertLinkView.definitionRange = "DRange";
        insertLinkView.replaceReferenceLink = {};
        spyOn(insertLinkView, "replaceReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.updateReferenceLink(link);
        return expect(insertLinkView.replaceReferenceLink).toHaveBeenCalledWith("[text][ABC123]");
      });
    });
    describe(".setLink", function() {
      return it("sets all the editors", function() {
        var link;
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.setLink(link);
        expect(insertLinkView.textEditor.getText()).toBe(link.text);
        expect(insertLinkView.titleEditor.getText()).toBe(link.title);
        return expect(insertLinkView.urlEditor.getText()).toBe(link.url);
      });
    });
    describe(".getSavedLink", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("return undefined if text does not exists", function() {
        return expect(insertLinkView.getSavedLink("notExists")).toEqual(void 0);
      });
      return it("return the link with text, title, url", function() {
        expect(insertLinkView.getSavedLink("oldStyle")).toEqual({
          "text": "oldStyle",
          "title": "this is title",
          "url": "http://"
        });
        return expect(insertLinkView.getSavedLink("newStyle")).toEqual({
          "text": "NewStyle",
          "title": "this is title",
          "url": "http://"
        });
      });
    });
    describe(".isInSavedLink", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("return false if the text does not exists", function() {
        return expect(insertLinkView.isInSavedLink({
          text: "notExists"
        })).toBe(false);
      });
      it("return false if the url does not match", function() {
        var link;
        link = {
          text: "oldStyle",
          title: "this is title",
          url: "anything"
        };
        return expect(insertLinkView.isInSavedLink(link)).toBe(false);
      });
      return it("return true", function() {
        var link;
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        return expect(insertLinkView.isInSavedLink(link)).toBe(true);
      });
    });
    describe(".updateToLinks", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("saves the new link if it does not exists before and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "New Link",
          title: "this is title",
          url: "http://new.link"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["new link"]).toEqual(link);
      });
      it("does not save the new link if checkbox is unchecked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", false);
        link = {
          text: "New Link",
          title: "this is title",
          url: "http://new.link"
        };
        return expect(insertLinkView.updateToLinks(link)).toBe(false);
      });
      it("saves the link if it is modified and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "NewStyle",
          title: "this is new title",
          url: "http://"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["newstyle"]).toEqual(link);
      });
      it("does not saves the link if it is not modified and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        return expect(insertLinkView.updateToLinks(link)).toBe(false);
      });
      return it("removes the existed link if checkbox is unchecked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", false);
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["newstyle"]).toBe(void 0);
      });
    });
    return describe("integration", function() {
      beforeEach(function() {
        atom.config.set("markdown-writer.referenceIndentLength", 2);
        insertLinkView.fetchPosts = function() {
          return {};
        };
        insertLinkView.loadSavedLinks = function(cb) {
          return cb();
        };
        return insertLinkView._referenceLink = function(link) {
          link['indent'] = "  ";
          link['title'] = /^[-\*\!]$/.test(link.title) ? "" : link.title;
          link['label'] = insertLinkView.referenceId || 'GENERATED';
          return link;
        };
      });
      it("insert new link", function() {
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text](url)");
      });
      it("insert new link with text", function() {
        editor.setText("text");
        insertLinkView.display();
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text](url)");
      });
      it("insert new reference link", function() {
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text][GENERATED]\n\n  [GENERATED]: url \"title\"");
      });
      it("insert new reference link with text", function() {
        editor.setText("text");
        insertLinkView.display();
        insertLinkView.titleEditor.setText("*");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text][GENERATED]\n\n  [GENERATED]: url \"\"");
      });
      it("insert reference link without definition", function() {
        atom.config.set("markdown-writer.referenceInlineTag", "<a title='{title}' href='{url}' target='_blank'>{text}</a>");
        atom.config.set("markdown-writer.referenceDefinitionTag", "");
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("<a title='title' href='url' target='_blank'>text</a>");
      });
      it("update inline link", function() {
        editor.setText("[text](url)");
        editor.selectAll();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[new text](new url)");
      });
      it("update inline link to reference link", function() {
        editor.setText("[text](url)");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[new text][GENERATED]\n\n  [GENERATED]: new url \"title\"");
      });
      it("update reference link to inline link", function() {
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("[new text](new url)");
      });
      it("update reference link to config reference link", function() {
        atom.config.set("markdown-writer.referenceInlineTag", "<a title='{title}' href='{url}' target='_blank'>{text}</a>");
        atom.config.set("markdown-writer.referenceDefinitionTag", "");
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("new title");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("<a title='new title' href='new url' target='_blank'>new text</a>");
      });
      it("remove inline link", function() {
        editor.setText("[text](url)");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.urlEditor.setText("");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("text");
      });
      return it("remove reference link", function() {
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.urlEditor.setText("");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("text");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvaW5zZXJ0LWxpbmstdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVI7O0VBRWpCLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0FBQ3pCLFFBQUE7SUFBQSxNQUEyQixFQUEzQixFQUFDLGVBQUQsRUFBUztJQUVULFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQjtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7UUFDSCxjQUFBLEdBQWlCLElBQUksY0FBSixDQUFtQixFQUFuQjtlQUNqQixNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BRk4sQ0FBTDtJQUZTLENBQVg7SUFNQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO01BQ3RCLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO0FBQ3ZCLFlBQUE7UUFBQSxjQUFjLENBQUMsTUFBZixHQUF3QjtVQUFFLG9CQUFBLEVBQXNCLFNBQUE7bUJBQUc7VUFBSCxDQUF4Qjs7UUFDeEIsS0FBQSxDQUFNLGNBQWMsQ0FBQyxNQUFyQixFQUE2QixzQkFBN0I7UUFFQSxJQUFBLEdBQU87VUFBQSxJQUFBLEVBQU0sTUFBTjtVQUFjLEdBQUEsRUFBSyxTQUFuQjs7UUFDUCxjQUFjLENBQUMsVUFBZixDQUEwQixJQUExQjtlQUVBLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLG9CQUE3QixDQUFrRCxDQUFDLG9CQUFuRCxDQUF3RSxNQUF4RSxFQUFtRixpQkFBbkY7TUFQdUIsQ0FBekI7TUFTQSxFQUFBLENBQUcsdUJBQUgsRUFB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QUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBekIsQ0FBQSxDQUFQLENBQTBDLENBQUMsT0FBM0MsQ0FBbUQsS0FBbkQ7UUFFQSxjQUFjLENBQUMsU0FBUyxDQUFDLE9BQXpCLENBQWlDLEVBQWpDO1FBQ0EsY0FBYyxDQUFDLFNBQWYsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsSUFBakIsQ0FBQSxDQUFQLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsTUFBckM7TUFqQjBCLENBQTVCO0lBcktzQixDQUF4QjtFQTFKeUIsQ0FBM0I7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbIkluc2VydExpbmtWaWV3ID0gcmVxdWlyZSBcIi4uLy4uL2xpYi92aWV3cy9pbnNlcnQtbGluay12aWV3XCJcblxuZGVzY3JpYmUgXCJJbnNlcnRMaW5rVmlld1wiLCAtPlxuICBbZWRpdG9yLCBpbnNlcnRMaW5rVmlld10gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcImVtcHR5Lm1hcmtkb3duXCIpXG4gICAgcnVucyAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcgPSBuZXcgSW5zZXJ0TGlua1ZpZXcoe30pXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBkZXNjcmliZSBcIi5pbnNlcnRMaW5rXCIsIC0+XG4gICAgaXQgXCJpbnNlcnQgaW5saW5lIGxpbmtcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LmVkaXRvciA9IHsgc2V0VGV4dEluQnVmZmVyUmFuZ2U6IC0+IHt9IH1cbiAgICAgIHNweU9uKGluc2VydExpbmtWaWV3LmVkaXRvciwgXCJzZXRUZXh0SW5CdWZmZXJSYW5nZVwiKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJ0ZXh0XCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGluc2VydExpbmtWaWV3Lmluc2VydExpbmsobGluaylcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodW5kZWZpbmVkLCBcIlt0ZXh0XShodHRwOi8vKVwiKVxuXG4gICAgaXQgXCJpbnNlcnQgcmVmZXJlbmNlIGxpbmtcIiwgLT5cbiAgICAgIHNweU9uKGluc2VydExpbmtWaWV3LCBcImluc2VydFJlZmVyZW5jZUxpbmtcIilcblxuICAgICAgbGluayA9IHRleHQ6IFwidGV4dFwiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGluc2VydExpbmtWaWV3Lmluc2VydExpbmsobGluaylcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3Lmluc2VydFJlZmVyZW5jZUxpbmspLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGxpbmspXG5cbiAgICBpdCBcInVwZGF0ZSByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGVmaW5pdGlvblJhbmdlID0ge31cbiAgICAgIHNweU9uKGluc2VydExpbmtWaWV3LCBcInVwZGF0ZVJlZmVyZW5jZUxpbmtcIilcblxuICAgICAgbGluayA9IHRleHQ6IFwidGV4dFwiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGluc2VydExpbmtWaWV3Lmluc2VydExpbmsobGluaylcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVwZGF0ZVJlZmVyZW5jZUxpbmspLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGxpbmspXG5cbiAgZGVzY3JpYmUgXCIudXBkYXRlUmVmZXJlbmNlTGlua1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5yZWZlcmVuY2VJbmRlbnRMZW5ndGhcIiwgMilcblxuICAgIGl0IFwidXBkYXRlIHJlZmVyZW5jZSBhbmQgZGVmaW5pdGlvblwiLCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcucmVmZXJlbmNlSWQgPSBcIkFCQzEyM1wiXG4gICAgICBpbnNlcnRMaW5rVmlldy5yYW5nZSA9IFwiUmFuZ2VcIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGVmaW5pdGlvblJhbmdlID0gXCJEUmFuZ2VcIlxuXG4gICAgICBpbnNlcnRMaW5rVmlldy5lZGl0b3IgPSB7IHNldFRleHRJbkJ1ZmZlclJhbmdlOiAtPiB7fSB9XG4gICAgICBzcHlPbihpbnNlcnRMaW5rVmlldy5lZGl0b3IsIFwic2V0VGV4dEluQnVmZmVyUmFuZ2VcIilcblxuICAgICAgbGluayA9IHRleHQ6IFwidGV4dFwiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGluc2VydExpbmtWaWV3LnVwZGF0ZVJlZmVyZW5jZUxpbmsobGluaylcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZS5jYWxscy5sZW5ndGgpLnRvRXF1YWwoMilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5lZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UuY2FsbHNbMF0uYXJncykudG9FcXVhbChcbiAgICAgICAgW1wiUmFuZ2VcIiwgXCJbdGV4dF1bQUJDMTIzXVwiXSlcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5lZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UuY2FsbHNbMV0uYXJncykudG9FcXVhbChcbiAgICAgICAgW1wiRFJhbmdlXCIsICcgIFtBQkMxMjNdOiBodHRwOi8vIFwidGhpcyBpcyB0aXRsZVwiJ10pXG5cbiAgICBpdCBcInVwZGF0ZSByZWZlcmVuY2Ugb25seSBpZiBkZWZpbml0aW9uIHRlbXBsYXRlIGlzIGVtcHR5XCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIucmVmZXJlbmNlRGVmaW5pdGlvblRhZ1wiLCBcIlwiKVxuXG4gICAgICBpbnNlcnRMaW5rVmlldy5yZWZlcmVuY2VJZCA9IFwiQUJDMTIzXCJcbiAgICAgIGluc2VydExpbmtWaWV3LnJhbmdlID0gXCJSYW5nZVwiXG4gICAgICBpbnNlcnRMaW5rVmlldy5kZWZpbml0aW9uUmFuZ2UgPSBcIkRSYW5nZVwiXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnJlcGxhY2VSZWZlcmVuY2VMaW5rID0ge31cbiAgICAgIHNweU9uKGluc2VydExpbmtWaWV3LCBcInJlcGxhY2VSZWZlcmVuY2VMaW5rXCIpXG5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcInRleHRcIiwgdGl0bGU6IFwidGhpcyBpcyB0aXRsZVwiLCB1cmw6IFwiaHR0cDovL1wiXG4gICAgICBpbnNlcnRMaW5rVmlldy51cGRhdGVSZWZlcmVuY2VMaW5rKGxpbmspXG5cbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5yZXBsYWNlUmVmZXJlbmNlTGluaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXCJbdGV4dF1bQUJDMTIzXVwiKVxuXG4gIGRlc2NyaWJlIFwiLnNldExpbmtcIiwgLT5cbiAgICBpdCBcInNldHMgYWxsIHRoZSBlZGl0b3JzXCIsIC0+XG4gICAgICBsaW5rID0gdGV4dDogXCJ0ZXh0XCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuXG4gICAgICBpbnNlcnRMaW5rVmlldy5zZXRMaW5rKGxpbmspXG5cbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLmdldFRleHQoKSkudG9CZShsaW5rLnRleHQpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3IuZ2V0VGV4dCgpKS50b0JlKGxpbmsudGl0bGUpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLmdldFRleHQoKSkudG9CZShsaW5rLnVybClcblxuICBkZXNjcmliZSBcIi5nZXRTYXZlZExpbmtcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5saW5rcyA9XG4gICAgICAgIFwib2xkc3R5bGVcIjoge1widGl0bGVcIjogXCJ0aGlzIGlzIHRpdGxlXCIsIFwidXJsXCI6IFwiaHR0cDovL1wifVxuICAgICAgICBcIm5ld3N0eWxlXCI6IHtcInRleHRcIjogXCJOZXdTdHlsZVwiLCBcInRpdGxlXCI6IFwidGhpcyBpcyB0aXRsZVwiLCBcInVybFwiOiBcImh0dHA6Ly9cIn1cblxuICAgIGl0IFwicmV0dXJuIHVuZGVmaW5lZCBpZiB0ZXh0IGRvZXMgbm90IGV4aXN0c1wiLCAtPlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmdldFNhdmVkTGluayhcIm5vdEV4aXN0c1wiKSkudG9FcXVhbCh1bmRlZmluZWQpXG5cbiAgICBpdCBcInJldHVybiB0aGUgbGluayB3aXRoIHRleHQsIHRpdGxlLCB1cmxcIiwgLT5cbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5nZXRTYXZlZExpbmsoXCJvbGRTdHlsZVwiKSkudG9FcXVhbCh7XG4gICAgICAgIFwidGV4dFwiOiBcIm9sZFN0eWxlXCIsIFwidGl0bGVcIjogXCJ0aGlzIGlzIHRpdGxlXCIsIFwidXJsXCI6IFwiaHR0cDovL1wifSlcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmdldFNhdmVkTGluayhcIm5ld1N0eWxlXCIpKS50b0VxdWFsKHtcbiAgICAgICAgXCJ0ZXh0XCI6IFwiTmV3U3R5bGVcIiwgXCJ0aXRsZVwiOiBcInRoaXMgaXMgdGl0bGVcIiwgXCJ1cmxcIjogXCJodHRwOi8vXCJ9KVxuXG4gIGRlc2NyaWJlIFwiLmlzSW5TYXZlZExpbmtcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5saW5rcyA9XG4gICAgICAgIFwib2xkc3R5bGVcIjoge1widGl0bGVcIjogXCJ0aGlzIGlzIHRpdGxlXCIsIFwidXJsXCI6IFwiaHR0cDovL1wifVxuICAgICAgICBcIm5ld3N0eWxlXCI6IHtcInRleHRcIjogXCJOZXdTdHlsZVwiLCBcInRpdGxlXCI6IFwidGhpcyBpcyB0aXRsZVwiLCBcInVybFwiOiBcImh0dHA6Ly9cIn1cblxuICAgIGl0IFwicmV0dXJuIGZhbHNlIGlmIHRoZSB0ZXh0IGRvZXMgbm90IGV4aXN0c1wiLCAtPlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmlzSW5TYXZlZExpbmsodGV4dDogXCJub3RFeGlzdHNcIikpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcInJldHVybiBmYWxzZSBpZiB0aGUgdXJsIGRvZXMgbm90IG1hdGNoXCIsIC0+XG4gICAgICBsaW5rID0gdGV4dDogXCJvbGRTdHlsZVwiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJhbnl0aGluZ1wiXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuaXNJblNhdmVkTGluayhsaW5rKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwicmV0dXJuIHRydWVcIiwgLT5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcIk5ld1N0eWxlXCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmlzSW5TYXZlZExpbmsobGluaykpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIi51cGRhdGVUb0xpbmtzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcubGlua3MgPVxuICAgICAgICBcIm9sZHN0eWxlXCI6IHtcInRpdGxlXCI6IFwidGhpcyBpcyB0aXRsZVwiLCBcInVybFwiOiBcImh0dHA6Ly9cIn1cbiAgICAgICAgXCJuZXdzdHlsZVwiOiB7XCJ0ZXh0XCI6IFwiTmV3U3R5bGVcIiwgXCJ0aXRsZVwiOiBcInRoaXMgaXMgdGl0bGVcIiwgXCJ1cmxcIjogXCJodHRwOi8vXCJ9XG5cbiAgICBpdCBcInNhdmVzIHRoZSBuZXcgbGluayBpZiBpdCBkb2VzIG5vdCBleGlzdHMgYmVmb3JlIGFuZCBjaGVja2JveCBjaGVja2VkXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5zYXZlQ2hlY2tib3gucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSlcblxuICAgICAgbGluayA9IHRleHQ6IFwiTmV3IExpbmtcIiwgdGl0bGU6IFwidGhpcyBpcyB0aXRsZVwiLCB1cmw6IFwiaHR0cDovL25ldy5saW5rXCJcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cGRhdGVUb0xpbmtzKGxpbmspKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcubGlua3NbXCJuZXcgbGlua1wiXSkudG9FcXVhbChsaW5rKVxuXG4gICAgaXQgXCJkb2VzIG5vdCBzYXZlIHRoZSBuZXcgbGluayBpZiBjaGVja2JveCBpcyB1bmNoZWNrZWRcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LnNhdmVDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSlcblxuICAgICAgbGluayA9IHRleHQ6IFwiTmV3IExpbmtcIiwgdGl0bGU6IFwidGhpcyBpcyB0aXRsZVwiLCB1cmw6IFwiaHR0cDovL25ldy5saW5rXCJcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cGRhdGVUb0xpbmtzKGxpbmspKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJzYXZlcyB0aGUgbGluayBpZiBpdCBpcyBtb2RpZmllZCBhbmQgY2hlY2tib3ggY2hlY2tlZFwiLCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuc2F2ZUNoZWNrYm94LnByb3AoXCJjaGVja2VkXCIsIHRydWUpXG5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcIk5ld1N0eWxlXCIsIHRpdGxlOiBcInRoaXMgaXMgbmV3IHRpdGxlXCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cGRhdGVUb0xpbmtzKGxpbmspKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcubGlua3NbXCJuZXdzdHlsZVwiXSkudG9FcXVhbChsaW5rKVxuXG4gICAgaXQgXCJkb2VzIG5vdCBzYXZlcyB0aGUgbGluayBpZiBpdCBpcyBub3QgbW9kaWZpZWQgYW5kIGNoZWNrYm94IGNoZWNrZWRcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LnNhdmVDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJOZXdTdHlsZVwiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cGRhdGVUb0xpbmtzKGxpbmspKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJyZW1vdmVzIHRoZSBleGlzdGVkIGxpbmsgaWYgY2hlY2tib3ggaXMgdW5jaGVja2VkXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5zYXZlQ2hlY2tib3gucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpXG5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcIk5ld1N0eWxlXCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVwZGF0ZVRvTGlua3MobGluaykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5saW5rc1tcIm5ld3N0eWxlXCJdKS50b0JlKHVuZGVmaW5lZClcblxuICBkZXNjcmliZSBcImludGVncmF0aW9uXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnJlZmVyZW5jZUluZGVudExlbmd0aFwiLCAyKVxuXG4gICAgICAjIHN0dWJzXG4gICAgICBpbnNlcnRMaW5rVmlldy5mZXRjaFBvc3RzID0gLT4ge31cbiAgICAgIGluc2VydExpbmtWaWV3LmxvYWRTYXZlZExpbmtzID0gKGNiKSAtPiBjYigpXG4gICAgICBpbnNlcnRMaW5rVmlldy5fcmVmZXJlbmNlTGluayA9IChsaW5rKSAtPlxuICAgICAgICBsaW5rWydpbmRlbnQnXSA9IFwiICBcIlxuICAgICAgICBsaW5rWyd0aXRsZSddID0gaWYgL15bLVxcKlxcIV0kLy50ZXN0KGxpbmsudGl0bGUpIHRoZW4gXCJcIiBlbHNlIGxpbmsudGl0bGVcbiAgICAgICAgbGlua1snbGFiZWwnXSA9IGluc2VydExpbmtWaWV3LnJlZmVyZW5jZUlkIHx8ICdHRU5FUkFURUQnXG4gICAgICAgIGxpbmtcblxuICAgIGl0IFwiaW5zZXJ0IG5ldyBsaW5rXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcInRleHRcIilcbiAgICAgIGluc2VydExpbmtWaWV3LnVybEVkaXRvci5zZXRUZXh0KFwidXJsXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlt0ZXh0XSh1cmwpXCJcblxuICAgIGl0IFwiaW5zZXJ0IG5ldyBsaW5rIHdpdGggdGV4dFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJ0ZXh0XCJcbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJ1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiW3RleHRdKHVybClcIlxuXG4gICAgaXQgXCJpbnNlcnQgbmV3IHJlZmVyZW5jZSBsaW5rXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcInRleHRcIilcbiAgICAgIGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLnNldFRleHQoXCJ0aXRsZVwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJ1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICBbdGV4dF1bR0VORVJBVEVEXVxuXG4gICAgICAgICAgW0dFTkVSQVRFRF06IHVybCBcInRpdGxlXCJcbiAgICAgICAgXCJcIlwiXG5cbiAgICBpdCBcImluc2VydCBuZXcgcmVmZXJlbmNlIGxpbmsgd2l0aCB0ZXh0XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcInRleHRcIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGlzcGxheSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy50aXRsZUVkaXRvci5zZXRUZXh0KFwiKlwiKSAjIGZvcmNlIHJlZmVyZW5jZSBsaW5rXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcInVybFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcub25Db25maXJtKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgIFt0ZXh0XVtHRU5FUkFURURdXG5cbiAgICAgICAgICBbR0VORVJBVEVEXTogdXJsIFwiXCJcbiAgICAgICAgXCJcIlwiXG5cbiAgICBpdCBcImluc2VydCByZWZlcmVuY2UgbGluayB3aXRob3V0IGRlZmluaXRpb25cIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5yZWZlcmVuY2VJbmxpbmVUYWdcIixcbiAgICAgICAgXCI8YSB0aXRsZT0ne3RpdGxlfScgaHJlZj0ne3VybH0nIHRhcmdldD0nX2JsYW5rJz57dGV4dH08L2E+XCIpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIucmVmZXJlbmNlRGVmaW5pdGlvblRhZ1wiLCBcIlwiKVxuXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcInRleHRcIilcbiAgICAgIGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLnNldFRleHQoXCJ0aXRsZVwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJ1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICA8YSB0aXRsZT0ndGl0bGUnIGhyZWY9J3VybCcgdGFyZ2V0PSdfYmxhbmsnPnRleHQ8L2E+XG4gICAgICBcIlwiXCJcblxuICAgIGl0IFwidXBkYXRlIGlubGluZSBsaW5rXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIlt0ZXh0XSh1cmwpXCIpXG4gICAgICBlZGl0b3Iuc2VsZWN0QWxsKClcbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJ0ZXh0XCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInVybFwiKVxuXG4gICAgICBpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLnNldFRleHQoXCJuZXcgdGV4dFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJuZXcgdXJsXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIltuZXcgdGV4dF0obmV3IHVybClcIlxuXG4gICAgaXQgXCJ1cGRhdGUgaW5saW5lIGxpbmsgdG8gcmVmZXJlbmNlIGxpbmtcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiW3RleHRdKHVybClcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBlZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGlzcGxheSgpXG5cbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInRleHRcIilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidXJsXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcIm5ldyB0ZXh0XCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy50aXRsZUVkaXRvci5zZXRUZXh0KFwidGl0bGVcIilcbiAgICAgIGluc2VydExpbmtWaWV3LnVybEVkaXRvci5zZXRUZXh0KFwibmV3IHVybFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcub25Db25maXJtKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgIFtuZXcgdGV4dF1bR0VORVJBVEVEXVxuXG4gICAgICAgICAgW0dFTkVSQVRFRF06IG5ldyB1cmwgXCJ0aXRsZVwiXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJ1cGRhdGUgcmVmZXJlbmNlIGxpbmsgdG8gaW5saW5lIGxpbmtcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgW3RleHRdW0FCQzEyM11cblxuICAgICAgW0FCQzEyM106IHVybCBcInRpdGxlXCJcbiAgICAgIFwiXCJcIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRleHRFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInRpdGxlXCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInVybFwiKVxuXG4gICAgICBpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLnNldFRleHQoXCJuZXcgdGV4dFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3Iuc2V0VGV4dChcIlwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJuZXcgdXJsXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKS50cmltKCkpLnRvQmUgXCJbbmV3IHRleHRdKG5ldyB1cmwpXCJcblxuICAgIGl0IFwidXBkYXRlIHJlZmVyZW5jZSBsaW5rIHRvIGNvbmZpZyByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnJlZmVyZW5jZUlubGluZVRhZ1wiLFxuICAgICAgICBcIjxhIHRpdGxlPSd7dGl0bGV9JyBocmVmPSd7dXJsfScgdGFyZ2V0PSdfYmxhbmsnPnt0ZXh0fTwvYT5cIilcbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5yZWZlcmVuY2VEZWZpbml0aW9uVGFnXCIsIFwiXCIpXG5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgW3RleHRdW0FCQzEyM11cblxuICAgICAgW0FCQzEyM106IHVybCBcInRpdGxlXCJcbiAgICAgIFwiXCJcIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRleHRFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInRpdGxlXCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInVybFwiKVxuXG4gICAgICBpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLnNldFRleHQoXCJuZXcgdGV4dFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3Iuc2V0VGV4dChcIm5ldyB0aXRsZVwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJuZXcgdXJsXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKS50cmltKCkpLnRvQmUoXG4gICAgICAgIFwiPGEgdGl0bGU9J25ldyB0aXRsZScgaHJlZj0nbmV3IHVybCcgdGFyZ2V0PSdfYmxhbmsnPm5ldyB0ZXh0PC9hPlwiKVxuXG4gICAgaXQgXCJyZW1vdmUgaW5saW5lIGxpbmtcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiW3RleHRdKHVybClcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBlZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGlzcGxheSgpXG5cbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInRleHRcIilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidXJsXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnVybEVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcInRleHRcIlxuXG4gICAgaXQgXCJyZW1vdmUgcmVmZXJlbmNlIGxpbmtcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgW3RleHRdW0FCQzEyM11cblxuICAgICAgW0FCQzEyM106IHVybCBcInRpdGxlXCJcbiAgICAgIFwiXCJcIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRleHRFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInRpdGxlXCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInVybFwiKVxuXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcIlwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcub25Db25maXJtKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkudHJpbSgpKS50b0JlIFwidGV4dFwiXG4iXX0=
