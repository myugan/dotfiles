(function() {
  var JumpTo;

  JumpTo = require("../../lib/commands/jump-to");

  describe("JumpTo", function() {
    var editor;
    editor = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-gfm");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".trigger", function() {
      it("triggers correct command", function() {
        var jumpTo;
        jumpTo = new JumpTo("next-heading");
        spyOn(jumpTo, "nextHeading");
        jumpTo.trigger({
          abortKeyBinding: function() {
            return {};
          }
        });
        return expect(jumpTo.nextHeading).toHaveBeenCalled();
      });
      return it("jumps to correct position", function() {
        var jumpTo;
        jumpTo = new JumpTo("previous-heading");
        jumpTo.previousHeading = function() {
          return [5, 5];
        };
        spyOn(jumpTo.editor, "setCursorBufferPosition");
        jumpTo.trigger();
        return expect(jumpTo.editor.setCursorBufferPosition).toHaveBeenCalledWith([5, 5]);
      });
    });
    describe(".previousHeading", function() {
      var text;
      text = "# Title\n\ncontent content\n\n```\n### Code title\n```\n\n## Subtitle\n\ncontent content";
      it("finds nothing if no headings", function() {
        var jumpTo;
        jumpTo = new JumpTo();
        return expect(jumpTo.previousHeading()).toBe(false);
      });
      it("finds nothing if no previous heading", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([0, 1]);
        jumpTo = new JumpTo();
        return expect(jumpTo.previousHeading()).toEqual(false);
      });
      it("finds previous subtitle", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([10, 6]);
        jumpTo = new JumpTo();
        return expect(jumpTo.previousHeading()).toEqual({
          row: 8,
          column: 0
        });
      });
      it("finds previous title", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([4, 1]);
        jumpTo = new JumpTo();
        return expect(jumpTo.previousHeading()).toEqual({
          row: 0,
          column: 0
        });
      });
      return it("skip code blocks in markdown", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([8, 6]);
        jumpTo = new JumpTo();
        return expect(jumpTo.previousHeading()).toEqual({
          row: 0,
          column: 0
        });
      });
    });
    describe(".nextHeading", function() {
      var text;
      text = "# Title\n\ncontent content\n\n## Subtitle\n\ncontent content\n\n```\n### Code title\n```";
      it("finds nothing if no headings", function() {
        var jumpTo;
        jumpTo = new JumpTo();
        return expect(jumpTo.nextHeading()).toBe(false);
      });
      it("finds next subtitle", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([3, 6]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextHeading()).toEqual({
          row: 4,
          column: 0
        });
      });
      return it("finds top title", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([6, 5]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextHeading()).toEqual({
          row: 0,
          column: 0
        });
      });
    });
    describe(".referenceDefinition", function() {
      var text;
      text = "empty line with no link\nempty line with orphan [link][link]\n\nlink to [zhuochun/md-writer][cfc27b01] should work\nlink to [Markdown-Writer for Atom][] should work as well\n\n  [cfc27b01]: https://github.com/zhuochun/md-writer \"Markdown-Writer for Atom\"\n  [Markdown-Writer for Atom]: https://github.com/zhuochun/md-writer \"Markdown-Writer for Atom\"\n  [nofound]: https://example.com\n\nfootnotes[^fn] is a kind of special link\n\n  [^fn]: footnote definition";
      it("finds nothing if no word under cursor", function() {
        var jumpTo;
        jumpTo = new JumpTo();
        return expect(jumpTo.referenceDefinition()).toBe(false);
      });
      it("finds nothing if no link found", function() {
        var jumpTo;
        editor.setText(text);
        editor.setCursorBufferPosition([0, 2]);
        jumpTo = new JumpTo();
        return expect(jumpTo.referenceDefinition()).toBe(false);
      });
      describe("links", function() {
        beforeEach(function() {
          return editor.setText(text);
        });
        it("finds nothing if no link definition", function() {
          var jumpTo;
          editor.setCursorBufferPosition([1, 2]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toBe(false);
        });
        it("finds nothing if no link reference", function() {
          var jumpTo;
          editor.setCursorBufferPosition([8, 2]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toBe(false);
        });
        it("finds definition (on the line)", function() {
          var jumpTo;
          editor.setCursorBufferPosition([3, 0]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toEqual([6, 0]);
        });
        it("finds definition (empty id label)", function() {
          var jumpTo;
          editor.setCursorBufferPosition([4, 8]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toEqual([7, 0]);
        });
        it("finds reference (on the line)", function() {
          var jumpTo;
          editor.setCursorBufferPosition([6, 0]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toEqual([3, 8]);
        });
        return it("finds reference (empty id label)", function() {
          var jumpTo;
          editor.setCursorBufferPosition([7, 4]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toEqual([4, 8]);
        });
      });
      return describe("foonotes", function() {
        beforeEach(function() {
          return editor.setText(text);
        });
        it("finds definition", function() {
          var jumpTo;
          editor.setCursorBufferPosition([10, 12]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toEqual([12, 2]);
        });
        return it("finds reference", function() {
          var jumpTo;
          editor.setCursorBufferPosition([12, 6]);
          jumpTo = new JumpTo();
          return expect(jumpTo.referenceDefinition()).toEqual([10, 9]);
        });
      });
    });
    return describe(".nextTableCell", function() {
      beforeEach(function() {
        return editor.setText("this is a table:\n\n| Header One | Header Two |\n|:-----------|:-----------|\n| Item One   | Item Two   |\n\nthis is another table:\n\nHeader One    |   Header Two | Header Three\n:-------------|-------------:|:-----------:\nItem One      |     Item Two |  Item Three");
      });
      it("finds nothing if it is not a table row", function() {
        var jumpTo;
        editor.setCursorBufferPosition([0, 2]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextTableCell()).toBe(false);
      });
      it("finds row 1, cell 2 in table 1", function() {
        var jumpTo;
        editor.setCursorBufferPosition([2, 2]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextTableCell()).toEqual([2, 25]);
      });
      it("finds row 2, cell 1 in table 1 from end of row 1", function() {
        var jumpTo;
        editor.setCursorBufferPosition([2, 25]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextTableCell()).toEqual([4, 10]);
      });
      it("finds row 2, cell 1 in table 1 from row separator", function() {
        var jumpTo;
        editor.setCursorBufferPosition([3, 0]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextTableCell()).toEqual([4, 10]);
      });
      it("finds row 1, cell 3 in table 2", function() {
        var jumpTo;
        editor.setCursorBufferPosition([8, 24]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextTableCell()).toEqual([8, 43]);
      });
      return it("finds row 2, cell 1 in table 2", function() {
        var jumpTo;
        editor.setCursorBufferPosition([8, 42]);
        jumpTo = new JumpTo();
        return expect(jumpTo.nextTableCell()).toEqual([10, 8]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvanVtcC10by1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSw0QkFBUjs7RUFFVCxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBO0FBQ2pCLFFBQUE7SUFBQSxNQUFBLEdBQVM7SUFFVCxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEI7TUFBSCxDQUFoQjtNQUNBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QjtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7ZUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQVosQ0FBTDtJQUhTLENBQVg7SUFLQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBO01BQ25CLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBO0FBQzdCLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBSSxNQUFKLENBQVcsY0FBWDtRQUNULEtBQUEsQ0FBTSxNQUFOLEVBQWMsYUFBZDtRQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWU7VUFBQSxlQUFBLEVBQWlCLFNBQUE7bUJBQUc7VUFBSCxDQUFqQjtTQUFmO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxXQUFkLENBQTBCLENBQUMsZ0JBQTNCLENBQUE7TUFONkIsQ0FBL0I7YUFRQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtBQUM5QixZQUFBO1FBQUEsTUFBQSxHQUFTLElBQUksTUFBSixDQUFXLGtCQUFYO1FBRVQsTUFBTSxDQUFDLGVBQVAsR0FBeUIsU0FBQTtpQkFB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SUFBSSxNQUFKLENBQUE7ZUFDVCxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFQLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2QztNQUhxRCxDQUF2RDtNQUtBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBO0FBQ3RELFlBQUE7UUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE1BQUEsR0FBUyxJQUFJLE1BQUosQ0FBQTtlQUNULE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQVAsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZDO01BSHNELENBQXhEO01BS0EsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUE7QUFDbkMsWUFBQTtRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CO1FBQ0EsTUFBQSxHQUFTLElBQUksTUFBSixDQUFBO2VBQ1QsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBUCxDQUE4QixDQUFDLE9BQS9CLENBQXVDLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkM7TUFIbUMsQ0FBckM7YUFLQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQTtBQUNuQyxZQUFBO1FBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0I7UUFDQSxNQUFBLEdBQVMsSUFBSSxNQUFKLENBQUE7ZUFDVCxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFQLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2QztNQUhtQyxDQUFyQztJQXpDeUIsQ0FBM0I7RUF0TGlCLENBQW5CO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJKdW1wVG8gPSByZXF1aXJlIFwiLi4vLi4vbGliL2NvbW1hbmRzL2p1bXAtdG9cIlxuXG5kZXNjcmliZSBcIkp1bXBUb1wiLCAtPlxuICBlZGl0b3IgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZW1wdHkubWFya2Rvd25cIilcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJsYW5ndWFnZS1nZm1cIilcbiAgICBydW5zIC0+IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIGRlc2NyaWJlIFwiLnRyaWdnZXJcIiwgLT5cbiAgICBpdCBcInRyaWdnZXJzIGNvcnJlY3QgY29tbWFuZFwiLCAtPlxuICAgICAganVtcFRvID0gbmV3IEp1bXBUbyhcIm5leHQtaGVhZGluZ1wiKVxuICAgICAgc3B5T24oanVtcFRvLCBcIm5leHRIZWFkaW5nXCIpXG5cbiAgICAgIGp1bXBUby50cmlnZ2VyKGFib3J0S2V5QmluZGluZzogLT4ge30pXG5cbiAgICAgIGV4cGVjdChqdW1wVG8ubmV4dEhlYWRpbmcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgaXQgXCJqdW1wcyB0byBjb3JyZWN0IHBvc2l0aW9uXCIsIC0+XG4gICAgICBqdW1wVG8gPSBuZXcgSnVtcFRvKFwicHJldmlvdXMtaGVhZGluZ1wiKVxuXG4gICAgICBqdW1wVG8ucHJldmlvdXNIZWFkaW5nID0gLT4gWzUsIDVdXG4gICAgICBzcHlPbihqdW1wVG8uZWRpdG9yLCBcInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uXCIpXG5cbiAgICAgIGp1bXBUby50cmlnZ2VyKClcblxuICAgICAgZXhwZWN0KGp1bXBUby5lZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFs1LCA1XSlcblxuICBkZXNjcmliZSBcIi5wcmV2aW91c0hlYWRpbmdcIiwgLT5cbiAgICB0ZXh0ID0gXCJcIlwiXG4gICAgIyBUaXRsZVxuXG4gICAgY29udGVudCBjb250ZW50XG5cbiAgICBgYGBcbiAgICAjIyMgQ29kZSB0aXRsZVxuICAgIGBgYFxuXG4gICAgIyMgU3VidGl0bGVcblxuICAgIGNvbnRlbnQgY29udGVudFxuICAgIFwiXCJcIlxuXG4gICAgaXQgXCJmaW5kcyBub3RoaW5nIGlmIG5vIGhlYWRpbmdzXCIsIC0+XG4gICAgICBqdW1wVG8gPSBuZXcgSnVtcFRvKClcbiAgICAgIGV4cGVjdChqdW1wVG8ucHJldmlvdXNIZWFkaW5nKCkpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcImZpbmRzIG5vdGhpbmcgaWYgbm8gcHJldmlvdXMgaGVhZGluZ1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMV0pXG5cbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5wcmV2aW91c0hlYWRpbmcoKSkudG9FcXVhbChmYWxzZSlcblxuICAgIGl0IFwiZmluZHMgcHJldmlvdXMgc3VidGl0bGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KHRleHQpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLCA2XSlcblxuICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICBleHBlY3QoanVtcFRvLnByZXZpb3VzSGVhZGluZygpKS50b0VxdWFsKHJvdzogOCwgY29sdW1uOiAwKVxuXG4gICAgaXQgXCJmaW5kcyBwcmV2aW91cyB0aXRsZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNCwgMV0pXG5cbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5wcmV2aW91c0hlYWRpbmcoKSkudG9FcXVhbChyb3c6IDAsIGNvbHVtbjogMClcblxuICAgIGl0IFwic2tpcCBjb2RlIGJsb2NrcyBpbiBtYXJrZG93blwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbOCwgNl0pXG5cbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5wcmV2aW91c0hlYWRpbmcoKSkudG9FcXVhbChyb3c6IDAsIGNvbHVtbjogMClcblxuXG4gIGRlc2NyaWJlIFwiLm5leHRIZWFkaW5nXCIsIC0+XG4gICAgdGV4dCA9IFwiXCJcIlxuICAgICMgVGl0bGVcblxuICAgIGNvbnRlbnQgY29udGVudFxuXG4gICAgIyMgU3VidGl0bGVcblxuICAgIGNvbnRlbnQgY29udGVudFxuXG4gICAgYGBgXG4gICAgIyMjIENvZGUgdGl0bGVcbiAgICBgYGBcbiAgICBcIlwiXCJcblxuICAgIGl0IFwiZmluZHMgbm90aGluZyBpZiBubyBoZWFkaW5nc1wiLCAtPlxuICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICBleHBlY3QoanVtcFRvLm5leHRIZWFkaW5nKCkpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcImZpbmRzIG5leHQgc3VidGl0bGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KHRleHQpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDZdKVxuXG4gICAgICBqdW1wVG8gPSBuZXcgSnVtcFRvKClcbiAgICAgIGV4cGVjdChqdW1wVG8ubmV4dEhlYWRpbmcoKSkudG9FcXVhbChyb3c6IDQsIGNvbHVtbjogMClcblxuICAgIGl0IFwiZmluZHMgdG9wIHRpdGxlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCh0ZXh0KVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs2LCA1XSlcblxuICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICBleHBlY3QoanVtcFRvLm5leHRIZWFkaW5nKCkpLnRvRXF1YWwocm93OiAwLCBjb2x1bW46IDApXG5cbiAgZGVzY3JpYmUgXCIucmVmZXJlbmNlRGVmaW5pdGlvblwiLCAtPlxuICAgIHRleHQgPSBcIlwiXCJcbiAgICBlbXB0eSBsaW5lIHdpdGggbm8gbGlua1xuICAgIGVtcHR5IGxpbmUgd2l0aCBvcnBoYW4gW2xpbmtdW2xpbmtdXG5cbiAgICBsaW5rIHRvIFt6aHVvY2h1bi9tZC13cml0ZXJdW2NmYzI3YjAxXSBzaG91bGQgd29ya1xuICAgIGxpbmsgdG8gW01hcmtkb3duLVdyaXRlciBmb3IgQXRvbV1bXSBzaG91bGQgd29yayBhcyB3ZWxsXG5cbiAgICAgIFtjZmMyN2IwMV06IGh0dHBzOi8vZ2l0aHViLmNvbS96aHVvY2h1bi9tZC13cml0ZXIgXCJNYXJrZG93bi1Xcml0ZXIgZm9yIEF0b21cIlxuICAgICAgW01hcmtkb3duLVdyaXRlciBmb3IgQXRvbV06IGh0dHBzOi8vZ2l0aHViLmNvbS96aHVvY2h1bi9tZC13cml0ZXIgXCJNYXJrZG93bi1Xcml0ZXIgZm9yIEF0b21cIlxuICAgICAgW25vZm91bmRdOiBodHRwczovL2V4YW1wbGUuY29tXG5cbiAgICBmb290bm90ZXNbXmZuXSBpcyBhIGtpbmQgb2Ygc3BlY2lhbCBsaW5rXG5cbiAgICAgIFteZm5dOiBmb290bm90ZSBkZWZpbml0aW9uXG4gICAgXCJcIlwiXG5cbiAgICBpdCBcImZpbmRzIG5vdGhpbmcgaWYgbm8gd29yZCB1bmRlciBjdXJzb3JcIiwgLT5cbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5yZWZlcmVuY2VEZWZpbml0aW9uKCkpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcImZpbmRzIG5vdGhpbmcgaWYgbm8gbGluayBmb3VuZFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMl0pXG5cbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5yZWZlcmVuY2VEZWZpbml0aW9uKCkpLnRvQmUoZmFsc2UpXG5cbiAgICBkZXNjcmliZSBcImxpbmtzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRUZXh0KHRleHQpXG5cbiAgICAgIGl0IFwiZmluZHMgbm90aGluZyBpZiBubyBsaW5rIGRlZmluaXRpb25cIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAyXSlcbiAgICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICAgIGV4cGVjdChqdW1wVG8ucmVmZXJlbmNlRGVmaW5pdGlvbigpKS50b0JlKGZhbHNlKVxuXG4gICAgICBpdCBcImZpbmRzIG5vdGhpbmcgaWYgbm8gbGluayByZWZlcmVuY2VcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs4LCAyXSlcbiAgICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICAgIGV4cGVjdChqdW1wVG8ucmVmZXJlbmNlRGVmaW5pdGlvbigpKS50b0JlKGZhbHNlKVxuXG4gICAgICBpdCBcImZpbmRzIGRlZmluaXRpb24gKG9uIHRoZSBsaW5lKVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDBdKVxuICAgICAgICBqdW1wVG8gPSBuZXcgSnVtcFRvKClcbiAgICAgICAgZXhwZWN0KGp1bXBUby5yZWZlcmVuY2VEZWZpbml0aW9uKCkpLnRvRXF1YWwoWzYsIDBdKVxuXG4gICAgICBpdCBcImZpbmRzIGRlZmluaXRpb24gKGVtcHR5IGlkIGxhYmVsKVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzQsIDhdKVxuICAgICAgICBqdW1wVG8gPSBuZXcgSnVtcFRvKClcbiAgICAgICAgZXhwZWN0KGp1bXBUby5yZWZlcmVuY2VEZWZpbml0aW9uKCkpLnRvRXF1YWwoWzcsIDBdKVxuXG4gICAgICBpdCBcImZpbmRzIHJlZmVyZW5jZSAob24gdGhlIGxpbmUpXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNiwgMF0pXG4gICAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgICBleHBlY3QoanVtcFRvLnJlZmVyZW5jZURlZmluaXRpb24oKSkudG9FcXVhbChbMywgOF0pXG5cbiAgICAgIGl0IFwiZmluZHMgcmVmZXJlbmNlIChlbXB0eSBpZCBsYWJlbClcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs3LCA0XSlcbiAgICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICAgIGV4cGVjdChqdW1wVG8ucmVmZXJlbmNlRGVmaW5pdGlvbigpKS50b0VxdWFsKFs0LCA4XSlcblxuICAgIGRlc2NyaWJlIFwiZm9vbm90ZXNcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldFRleHQodGV4dClcblxuICAgICAgaXQgXCJmaW5kcyBkZWZpbml0aW9uXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsIDEyXSlcbiAgICAgICAganVtcFRvID0gbmV3IEp1bXBUbygpXG4gICAgICAgIGV4cGVjdChqdW1wVG8ucmVmZXJlbmNlRGVmaW5pdGlvbigpKS50b0VxdWFsKFsxMiwgMl0pXG5cbiAgICAgIGl0IFwiZmluZHMgcmVmZXJlbmNlXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTIsIDZdKVxuICAgICAgICBqdW1wVG8gPSBuZXcgSnVtcFRvKClcbiAgICAgICAgZXhwZWN0KGp1bXBUby5yZWZlcmVuY2VEZWZpbml0aW9uKCkpLnRvRXF1YWwoWzEwLCA5XSlcblxuICBkZXNjcmliZSBcIi5uZXh0VGFibGVDZWxsXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICB0aGlzIGlzIGEgdGFibGU6XG5cbiAgICAgIHwgSGVhZGVyIE9uZSB8IEhlYWRlciBUd28gfFxuICAgICAgfDotLS0tLS0tLS0tLXw6LS0tLS0tLS0tLS18XG4gICAgICB8IEl0ZW0gT25lICAgfCBJdGVtIFR3byAgIHxcblxuICAgICAgdGhpcyBpcyBhbm90aGVyIHRhYmxlOlxuXG4gICAgICBIZWFkZXIgT25lICAgIHwgICBIZWFkZXIgVHdvIHwgSGVhZGVyIFRocmVlXG4gICAgICA6LS0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tOnw6LS0tLS0tLS0tLS06XG4gICAgICBJdGVtIE9uZSAgICAgIHwgICAgIEl0ZW0gVHdvIHwgIEl0ZW0gVGhyZWVcbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJmaW5kcyBub3RoaW5nIGlmIGl0IGlzIG5vdCBhIHRhYmxlIHJvd1wiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAyXSlcbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5uZXh0VGFibGVDZWxsKCkpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcImZpbmRzIHJvdyAxLCBjZWxsIDIgaW4gdGFibGUgMVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyLCAyXSlcbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5uZXh0VGFibGVDZWxsKCkpLnRvRXF1YWwoWzIsIDI1XSlcblxuICAgIGl0IFwiZmluZHMgcm93IDIsIGNlbGwgMSBpbiB0YWJsZSAxIGZyb20gZW5kIG9mIHJvdyAxXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDI1XSlcbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5uZXh0VGFibGVDZWxsKCkpLnRvRXF1YWwoWzQsIDEwXSlcblxuICAgIGl0IFwiZmluZHMgcm93IDIsIGNlbGwgMSBpbiB0YWJsZSAxIGZyb20gcm93IHNlcGFyYXRvclwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFszLCAwXSlcbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5uZXh0VGFibGVDZWxsKCkpLnRvRXF1YWwoWzQsIDEwXSlcblxuICAgIGl0IFwiZmluZHMgcm93IDEsIGNlbGwgMyBpbiB0YWJsZSAyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzgsIDI0XSlcbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5uZXh0VGFibGVDZWxsKCkpLnRvRXF1YWwoWzgsIDQzXSlcblxuICAgIGl0IFwiZmluZHMgcm93IDIsIGNlbGwgMSBpbiB0YWJsZSAyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzgsIDQyXSlcbiAgICAgIGp1bXBUbyA9IG5ldyBKdW1wVG8oKVxuICAgICAgZXhwZWN0KGp1bXBUby5uZXh0VGFibGVDZWxsKCkpLnRvRXF1YWwoWzEwLCA4XSlcbiJdfQ==
