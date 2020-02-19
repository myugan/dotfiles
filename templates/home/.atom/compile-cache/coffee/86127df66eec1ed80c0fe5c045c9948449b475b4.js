(function() {
  var FrontMatter;

  FrontMatter = require("../../lib/helpers/front-matter");

  describe("FrontMatter", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("editor without front matter", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
      it("is empty when editor is empty", function() {
        var frontMatter;
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
      it("is empty when editor has no front matter", function() {
        var frontMatter;
        editor.setText("some random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
      it("is empty when editor has invalid front matter", function() {
        var frontMatter;
        editor.setText("---\n---\n\nsome random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
      return it("is empty when editor has weird front matter", function() {
        var frontMatter;
        editor.setText("---\n1. [VLC media player](https://www.videolan.org/vlc/index.html) - VideoLAN, a project and a non-profit organization\n2. [Inkscape](https://inkscape.org/en/) - free and open-source vector graphics editor\n3. [GIMP](https://www.gimp.org/) -  GNU Image Manipulation Program) is a free and open-source raster graphics editor'\n---\n\nsome random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
    });
    describe("editor with jekyll front matter", function() {
      var editor, frontMatter, ref;
      ref = [], editor = ref[0], frontMatter = ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has fields", function() {
        expect(frontMatter.has("title")).toBe(true);
        expect(frontMatter.has("date")).toBe(true);
        expect(frontMatter.has("categories")).toBe(true);
        return expect(frontMatter.has("tags")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Jekyll)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      it("set field value", function() {
        frontMatter.set("title", "Markdown Writer");
        return expect(frontMatter.get("title")).toBe("Markdown Writer");
      });
      it("set field value if exists", function() {
        frontMatter.setIfExists("unknown", "Markdown Writer");
        expect(frontMatter.get("unknown")).toBe(void 0);
        frontMatter.setIfExists("title", "Markdown Writer (Wow)");
        return expect(frontMatter.get("title")).toBe("Markdown Writer (Wow)");
      });
      it("normalize field to an array", function() {
        expect(frontMatter.normalizeField("field")).toEqual([]);
        expect(frontMatter.normalizeField("categories")).toEqual(["Markdown"]);
        return expect(frontMatter.normalizeField("tags")).toEqual(["Writer", "Jekyll"]);
      });
      it("get content text with leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n");
      });
      return it("save the content to editor", function() {
        frontMatter.save();
        return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
      });
    });
    return describe("editor with hexo front matter", function() {
      var editor, frontMatter, ref;
      ref = [], editor = ref[0], frontMatter = ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("title: Markdown Writer (Hexo)\ndate: 2015-08-12 23:19\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has field title/date", function() {
        expect(frontMatter.has("title")).toBe(true);
        return expect(frontMatter.has("date")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Hexo)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      return it("get content text without leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("title: Markdown Writer (Hexo)\ndate: '2015-08-12 23:19'\n---\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvaGVscGVycy9mcm9udC1tYXR0ZXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0NBQVI7O0VBRWQsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtJQUN0QixVQUFBLENBQVcsU0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQix1QkFBcEI7TUFBSCxDQUFoQjtJQURTLENBQVg7SUFHQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQTtBQUN0QyxVQUFBO01BQUEsTUFBQSxHQUFTO01BRVQsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BREEsQ0FBWDtNQUdBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO0FBQ2xDLFlBQUE7UUFBQSxXQUFBLEdBQWMsSUFBSSxXQUFKLENBQWdCLE1BQWhCO1FBQ2QsTUFBQSxDQUFPLFdBQVcsQ0FBQyxPQUFuQixDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQWpDO2VBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxPQUFuQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLEVBQXBDO01BSGtDLENBQXBDO01BS0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUE7QUFDN0MsWUFBQTtRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsd0NBQWY7UUFLQSxXQUFBLEdBQWMsSUFBSSxXQUFKLENBQWdCLE1BQWhCO1FBQ2QsTUFBQSxDQUFPLFdBQVcsQ0FBQyxPQUFuQixDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQWpDO2VBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxPQUFuQixDQUEyQixDQUFD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QUFDLE9BQW5CLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsS0FBakM7TUFEaUIsQ0FBbkI7TUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQTtRQUN6QixNQUFBLENBQU8sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLElBQXRDO2VBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLE1BQWhCLENBQVAsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQztNQUZ5QixDQUEzQjtNQUlBLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBO1FBQ3BCLE1BQUEsQ0FBTyxXQUFXLENBQUMsR0FBWixDQUFnQixPQUFoQixDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0Msd0JBQXRDO2VBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLE1BQWhCLENBQVAsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxrQkFBckM7TUFGb0IsQ0FBdEI7YUFJQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQTtlQUMzQyxNQUFBLENBQU8sV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFQLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsZ0VBQTFDO01BRDJDLENBQTdDO0lBMUJ3QyxDQUExQztFQXRJc0IsQ0FBeEI7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbIkZyb250TWF0dGVyID0gcmVxdWlyZSBcIi4uLy4uL2xpYi9oZWxwZXJzL2Zyb250LW1hdHRlclwiXG5cbmRlc2NyaWJlIFwiRnJvbnRNYXR0ZXJcIiwgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZnJvbnQtbWF0dGVyLm1hcmtkb3duXCIpXG5cbiAgZGVzY3JpYmUgXCJlZGl0b3Igd2l0aG91dCBmcm9udCBtYXR0ZXJcIiwgLT5cbiAgICBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGl0IFwiaXMgZW1wdHkgd2hlbiBlZGl0b3IgaXMgZW1wdHlcIiwgLT5cbiAgICAgIGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKGVkaXRvcilcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5pc0VtcHR5KS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuY29udGVudCkudG9FcXVhbCh7fSlcblxuICAgIGl0IFwiaXMgZW1wdHkgd2hlbiBlZGl0b3IgaGFzIG5vIGZyb250IG1hdHRlclwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMVxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDJcbiAgICAgIFwiXCJcIlxuXG4gICAgICBmcm9udE1hdHRlciA9IG5ldyBGcm9udE1hdHRlcihlZGl0b3IpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaXNFbXB0eSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmNvbnRlbnQpLnRvRXF1YWwoe30pXG5cbiAgICBpdCBcImlzIGVtcHR5IHdoZW4gZWRpdG9yIGhhcyBpbnZhbGlkIGZyb250IG1hdHRlclwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIC0tLVxuICAgICAgICAtLS1cblxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDFcbiAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICBcIlwiXCJcblxuICAgICAgZnJvbnRNYXR0ZXIgPSBuZXcgRnJvbnRNYXR0ZXIoZWRpdG9yKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmlzRW1wdHkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5jb250ZW50KS50b0VxdWFsKHt9KVxuXG4gICAgaXQgXCJpcyBlbXB0eSB3aGVuIGVkaXRvciBoYXMgd2VpcmQgZnJvbnQgbWF0dGVyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgLS0tXG4gICAgICAgIDEuIFtWTEMgbWVkaWEgcGxheWVyXShodHRwczovL3d3dy52aWRlb2xhbi5vcmcvdmxjL2luZGV4Lmh0bWwpIC0gVmlkZW9MQU4sIGEgcHJvamVjdCBhbmQgYSBub24tcHJvZml0IG9yZ2FuaXphdGlvblxuICAgICAgICAyLiBbSW5rc2NhcGVdKGh0dHBzOi8vaW5rc2NhcGUub3JnL2VuLykgLSBmcmVlIGFuZCBvcGVuLXNvdXJjZSB2ZWN0b3IgZ3JhcGhpY3MgZWRpdG9yXG4gICAgICAgIDMuIFtHSU1QXShodHRwczovL3d3dy5naW1wLm9yZy8pIC0gIEdOVSBJbWFnZSBNYW5pcHVsYXRpb24gUHJvZ3JhbSkgaXMgYSBmcmVlIGFuZCBvcGVuLXNvdXJjZSByYXN0ZXIgZ3JhcGhpY3MgZWRpdG9yJ1xuICAgICAgICAtLS1cblxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDFcbiAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICBcIlwiXCJcblxuICAgICAgZnJvbnRNYXR0ZXIgPSBuZXcgRnJvbnRNYXR0ZXIoZWRpdG9yKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmlzRW1wdHkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5jb250ZW50KS50b0VxdWFsKHt9KVxuXG4gIGRlc2NyaWJlIFwiZWRpdG9yIHdpdGggamVreWxsIGZyb250IG1hdHRlclwiLCAtPlxuICAgIFtlZGl0b3IsIGZyb250TWF0dGVyXSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICAtLS1cbiAgICAgICAgdGl0bGU6IE1hcmtkb3duIFdyaXRlciAoSmVreWxsKVxuICAgICAgICBkYXRlOiAyMDE1LTA4LTEyIDIzOjE5XG4gICAgICAgIGNhdGVnb3JpZXM6IE1hcmtkb3duXG4gICAgICAgIHRhZ3M6XG4gICAgICAgICAgLSBXcml0ZXJcbiAgICAgICAgICAtIEpla3lsbFxuICAgICAgICAtLS1cblxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDFcbiAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICBcIlwiXCJcblxuICAgICAgZnJvbnRNYXR0ZXIgPSBuZXcgRnJvbnRNYXR0ZXIoZWRpdG9yKVxuXG4gICAgaXQgXCJpcyBub3QgZW1wdHlcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5pc0VtcHR5KS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJoYXMgZmllbGRzXCIsIC0+XG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaGFzKFwidGl0bGVcIikpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5oYXMoXCJkYXRlXCIpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaGFzKFwiY2F0ZWdvcmllc1wiKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmhhcyhcInRhZ3NcIikpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZ2V0IGZpZWxkIHZhbHVlXCIsIC0+XG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIikpLnRvQmUoXCJNYXJrZG93biBXcml0ZXIgKEpla3lsbClcIilcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5nZXQoXCJkYXRlXCIpKS50b0JlKFwiMjAxNS0wOC0xMiAyMzoxOVwiKVxuXG4gICAgaXQgXCJzZXQgZmllbGQgdmFsdWVcIiwgLT5cbiAgICAgIGZyb250TWF0dGVyLnNldChcInRpdGxlXCIsIFwiTWFya2Rvd24gV3JpdGVyXCIpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIikpLnRvQmUoXCJNYXJrZG93biBXcml0ZXJcIilcblxuICAgIGl0IFwic2V0IGZpZWxkIHZhbHVlIGlmIGV4aXN0c1wiLCAtPlxuICAgICAgZnJvbnRNYXR0ZXIuc2V0SWZFeGlzdHMoXCJ1bmtub3duXCIsIFwiTWFya2Rvd24gV3JpdGVyXCIpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwidW5rbm93blwiKSkudG9CZSh1bmRlZmluZWQpXG5cbiAgICAgIGZyb250TWF0dGVyLnNldElmRXhpc3RzKFwidGl0bGVcIiwgXCJNYXJrZG93biBXcml0ZXIgKFdvdylcIilcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5nZXQoXCJ0aXRsZVwiKSkudG9CZShcIk1hcmtkb3duIFdyaXRlciAoV293KVwiKVxuXG4gICAgaXQgXCJub3JtYWxpemUgZmllbGQgdG8gYW4gYXJyYXlcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5ub3JtYWxpemVGaWVsZChcImZpZWxkXCIpKS50b0VxdWFsKFtdKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLm5vcm1hbGl6ZUZpZWxkKFwiY2F0ZWdvcmllc1wiKSkudG9FcXVhbChbXCJNYXJrZG93blwiXSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5ub3JtYWxpemVGaWVsZChcInRhZ3NcIikpLnRvRXF1YWwoW1wiV3JpdGVyXCIsIFwiSmVreWxsXCJdKVxuXG4gICAgaXQgXCJnZXQgY29udGVudCB0ZXh0IHdpdGggbGVhZGluZyBmZW5jZVwiLCAtPlxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmdldENvbnRlbnRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgIC0tLVxuICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChKZWt5bGwpXG4gICAgICAgIGRhdGU6ICcyMDE1LTA4LTEyIDIzOjE5J1xuICAgICAgICBjYXRlZ29yaWVzOiBNYXJrZG93blxuICAgICAgICB0YWdzOlxuICAgICAgICAgIC0gV3JpdGVyXG4gICAgICAgICAgLSBKZWt5bGxcbiAgICAgICAgLS0tXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJzYXZlIHRoZSBjb250ZW50IHRvIGVkaXRvclwiLCAtPlxuICAgICAgZnJvbnRNYXR0ZXIuc2F2ZSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAtLS1cbiAgICAgICAgdGl0bGU6IE1hcmtkb3duIFdyaXRlciAoSmVreWxsKVxuICAgICAgICBkYXRlOiAnMjAxNS0wOC0xMiAyMzoxOSdcbiAgICAgICAgY2F0ZWdvcmllczogTWFya2Rvd25cbiAgICAgICAgdGFnczpcbiAgICAgICAgICAtIFdyaXRlclxuICAgICAgICAgIC0gSmVreWxsXG4gICAgICAgIC0tLVxuXG4gICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMVxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDJcbiAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlIFwiZWRpdG9yIHdpdGggaGV4byBmcm9udCBtYXR0ZXJcIiwgLT5cbiAgICBbZWRpdG9yLCBmcm9udE1hdHRlcl0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgdGl0bGU6IE1hcmtkb3duIFdyaXRlciAoSGV4bylcbiAgICAgICAgZGF0ZTogMjAxNS0wOC0xMiAyMzoxOVxuICAgICAgICAtLS1cblxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDFcbiAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICBcIlwiXCJcbiAgICAgIGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKGVkaXRvcilcblxuICAgIGl0IFwiaXMgbm90IGVtcHR5XCIsIC0+XG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaXNFbXB0eSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiaGFzIGZpZWxkIHRpdGxlL2RhdGVcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5oYXMoXCJ0aXRsZVwiKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmhhcyhcImRhdGVcIikpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZ2V0IGZpZWxkIHZhbHVlXCIsIC0+XG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIikpLnRvQmUoXCJNYXJrZG93biBXcml0ZXIgKEhleG8pXCIpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwiZGF0ZVwiKSkudG9CZShcIjIwMTUtMDgtMTIgMjM6MTlcIilcblxuICAgIGl0IFwiZ2V0IGNvbnRlbnQgdGV4dCB3aXRob3V0IGxlYWRpbmcgZmVuY2VcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5nZXRDb250ZW50VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChIZXhvKVxuICAgICAgICBkYXRlOiAnMjAxNS0wOC0xMiAyMzoxOSdcbiAgICAgICAgLS0tXG5cbiAgICAgIFwiXCJcIlxuIl19
