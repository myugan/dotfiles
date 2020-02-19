(function() {
  var ManagePostCategoriesView, ManagePostTagsView;

  ManagePostCategoriesView = require("../../lib/views/manage-post-categories-view");

  ManagePostTagsView = require("../../lib/views/manage-post-tags-view");

  describe("ManageFrontMatterView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("ManagePostCategoriesView", function() {
      var categoriesView, editor, ref;
      ref = [], editor = ref[0], categoriesView = ref[1];
      beforeEach(function() {
        return categoriesView = new ManagePostCategoriesView({});
      });
      describe("when editor has malformed front matter", function() {
        return it("does nothing", function() {
          atom.confirm = function() {
            return {};
          };
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("---\ntitle: Markdown Writer (Jekyll)\n----\n---");
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(false);
        });
      });
      return describe("when editor has front matter", function() {
        beforeEach(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
        it("display edit panel", function() {
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(true);
        });
        return it("updates editor text", function() {
          categoriesView.display();
          categoriesView.saveFrontMatter();
          expect(categoriesView.panel.isVisible()).toBe(false);
          return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories:\n  - Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
      });
    });
    return describe("ManagePostTagsView", function() {
      var editor, ref, tagsView;
      ref = [], editor = ref[0], tagsView = ref[1];
      beforeEach(function() {
        return tagsView = new ManagePostTagsView({});
      });
      it("rank tags", function() {
        var fixture, tags;
        fixture = "ab ab cd ab ef gh ef";
        tags = ["ab", "cd", "ef", "ij"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "ab",
            count: 3
          }, {
            name: "ef",
            count: 2
          }, {
            name: "cd",
            count: 1
          }, {
            name: "ij",
            count: 0
          }
        ]);
      });
      return it("rank tags with regex escaped", function() {
        var fixture, tags;
        fixture = "c++ c.c^abc $10.0 +abc";
        tags = ["c++", "\\", "^", "$", "+abc"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "c++",
            count: 1
          }, {
            name: "^",
            count: 1
          }, {
            name: "$",
            count: 1
          }, {
            name: "+abc",
            count: 1
          }, {
            name: "\\",
            count: 0
          }
        ]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvbWFuYWdlLWZyb250LW1hdHRlci12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSx3QkFBQSxHQUEyQixPQUFBLENBQVEsNkNBQVI7O0VBQzNCLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1Q0FBUjs7RUFFckIsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7SUFDaEMsVUFBQSxDQUFXLFNBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsdUJBQXBCO01BQUgsQ0FBaEI7SUFEUyxDQUFYO0lBR0EsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUE7QUFDbkMsVUFBQTtNQUFBLE1BQTJCLEVBQTNCLEVBQUMsZUFBRCxFQUFTO01BRVQsVUFBQSxDQUFXLFNBQUE7ZUFDVCxjQUFBLEdBQWlCLElBQUksd0JBQUosQ0FBNkIsRUFBN0I7TUFEUixDQUFYO01BR0EsUUFBQSxDQUFTLHdDQUFULEVBQW1ELFNBQUE7ZUFDakQsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQTtVQUNqQixJQUFJLENBQUMsT0FBTCxHQUFlLFNBQUE7bUJBQUc7VUFBSDtVQUNmLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7VUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLGlEQUFmO1VBT0EsY0FBYyxDQUFDLE9BQWYsQ0FBQTtpQkFDQSxNQUFBLENBQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFyQixDQUFBLENBQVAsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxLQUE5QztRQVhpQixDQUFuQjtNQURpRCxDQUFuRDthQWNBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO1FBQ3ZDLFVBQUEsQ0FBVyxTQUFB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ZXF1aXJlIFwiLi4vLi4vbGliL3ZpZXdzL21hbmFnZS1wb3N0LWNhdGVnb3JpZXMtdmlld1wiXG5NYW5hZ2VQb3N0VGFnc1ZpZXcgPSByZXF1aXJlIFwiLi4vLi4vbGliL3ZpZXdzL21hbmFnZS1wb3N0LXRhZ3Mtdmlld1wiXG5cbmRlc2NyaWJlIFwiTWFuYWdlRnJvbnRNYXR0ZXJWaWV3XCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcImZyb250LW1hdHRlci5tYXJrZG93blwiKVxuXG4gIGRlc2NyaWJlIFwiTWFuYWdlUG9zdENhdGVnb3JpZXNWaWV3XCIsIC0+XG4gICAgW2VkaXRvciwgY2F0ZWdvcmllc1ZpZXddID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGNhdGVnb3JpZXNWaWV3ID0gbmV3IE1hbmFnZVBvc3RDYXRlZ29yaWVzVmlldyh7fSlcblxuICAgIGRlc2NyaWJlIFwid2hlbiBlZGl0b3IgaGFzIG1hbGZvcm1lZCBmcm9udCBtYXR0ZXJcIiwgLT5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlybSA9IC0+IHt9ICMgRG91YmxlLCBtdXRlIGNvbmZpcm1cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICAgIC0tLVxuICAgICAgICAgIHRpdGxlOiBNYXJrZG93biBXcml0ZXIgKEpla3lsbClcbiAgICAgICAgICAtLS0tXG4gICAgICAgICAgLS0tXG4gICAgICAgIFwiXCJcIlxuXG4gICAgICAgIGNhdGVnb3JpZXNWaWV3LmRpc3BsYXkoKVxuICAgICAgICBleHBlY3QoY2F0ZWdvcmllc1ZpZXcucGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUoZmFsc2UpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZWRpdG9yIGhhcyBmcm9udCBtYXR0ZXJcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICAgIC0tLVxuICAgICAgICAgIHRpdGxlOiBNYXJrZG93biBXcml0ZXIgKEpla3lsbClcbiAgICAgICAgICBkYXRlOiAyMDE1LTA4LTEyIDIzOjE5XG4gICAgICAgICAgY2F0ZWdvcmllczogTWFya2Rvd25cbiAgICAgICAgICB0YWdzOlxuICAgICAgICAgICAgLSBXcml0ZXJcbiAgICAgICAgICAgIC0gSmVreWxsXG4gICAgICAgICAgLS0tXG5cbiAgICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDFcbiAgICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDJcbiAgICAgICAgXCJcIlwiXG5cbiAgICAgIGl0IFwiZGlzcGxheSBlZGl0IHBhbmVsXCIsIC0+XG4gICAgICAgIGNhdGVnb3JpZXNWaWV3LmRpc3BsYXkoKVxuICAgICAgICBleHBlY3QoY2F0ZWdvcmllc1ZpZXcucGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUodHJ1ZSlcblxuICAgICAgaXQgXCJ1cGRhdGVzIGVkaXRvciB0ZXh0XCIsIC0+XG4gICAgICAgIGNhdGVnb3JpZXNWaWV3LmRpc3BsYXkoKVxuICAgICAgICBjYXRlZ29yaWVzVmlldy5zYXZlRnJvbnRNYXR0ZXIoKVxuXG4gICAgICAgIGV4cGVjdChjYXRlZ29yaWVzVmlldy5wYW5lbC5pc1Zpc2libGUoKSkudG9CZShmYWxzZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgLS0tXG4gICAgICAgICAgdGl0bGU6IE1hcmtkb3duIFdyaXRlciAoSmVreWxsKVxuICAgICAgICAgIGRhdGU6ICcyMDE1LTA4LTEyIDIzOjE5J1xuICAgICAgICAgIGNhdGVnb3JpZXM6XG4gICAgICAgICAgICAtIE1hcmtkb3duXG4gICAgICAgICAgdGFnczpcbiAgICAgICAgICAgIC0gV3JpdGVyXG4gICAgICAgICAgICAtIEpla3lsbFxuICAgICAgICAgIC0tLVxuXG4gICAgICAgICAgc29tZSByYW5kb20gdGV4dCAxXG4gICAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlIFwiTWFuYWdlUG9zdFRhZ3NWaWV3XCIsIC0+XG4gICAgW2VkaXRvciwgdGFnc1ZpZXddID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHRhZ3NWaWV3ID0gbmV3IE1hbmFnZVBvc3RUYWdzVmlldyh7fSlcblxuICAgIGl0IFwicmFuayB0YWdzXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJhYiBhYiBjZCBhYiBlZiBnaCBlZlwiXG4gICAgICB0YWdzID0gW1wiYWJcIiwgXCJjZFwiLCBcImVmXCIsIFwiaWpcIl0ubWFwICh0KSAtPiBuYW1lOiB0XG5cbiAgICAgIHRhZ3NWaWV3LnJhbmtUYWdzKHRhZ3MsIGZpeHR1cmUpXG5cbiAgICAgIGV4cGVjdCh0YWdzKS50b0VxdWFsIFtcbiAgICAgICAge25hbWU6IFwiYWJcIiwgY291bnQ6IDN9XG4gICAgICAgIHtuYW1lOiBcImVmXCIsIGNvdW50OiAyfVxuICAgICAgICB7bmFtZTogXCJjZFwiLCBjb3VudDogMX1cbiAgICAgICAge25hbWU6IFwiaWpcIiwgY291bnQ6IDB9XG4gICAgICBdXG5cbiAgICBpdCBcInJhbmsgdGFncyB3aXRoIHJlZ2V4IGVzY2FwZWRcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcImMrKyBjLmNeYWJjICQxMC4wICthYmNcIlxuICAgICAgdGFncyA9IFtcImMrK1wiLCBcIlxcXFxcIiwgXCJeXCIsIFwiJFwiLCBcIithYmNcIl0ubWFwICh0KSAtPiBuYW1lOiB0XG5cbiAgICAgIHRhZ3NWaWV3LnJhbmtUYWdzKHRhZ3MsIGZpeHR1cmUpXG5cbiAgICAgIGV4cGVjdCh0YWdzKS50b0VxdWFsIFtcbiAgICAgICAge25hbWU6IFwiYysrXCIsIGNvdW50OiAxfVxuICAgICAgICB7bmFtZTogXCJeXCIsIGNvdW50OiAxfVxuICAgICAgICB7bmFtZTogXCIkXCIsIGNvdW50OiAxfVxuICAgICAgICB7bmFtZTogXCIrYWJjXCIsIGNvdW50OiAxfVxuICAgICAgICB7bmFtZTogXCJcXFxcXCIsIGNvdW50OiAwfVxuICAgICAgXVxuIl19
