(function() {
  var helper;

  helper = require("../../lib/helpers/template-helper");

  describe("templateHelper", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe(".getFrontMatterDate", function() {
      return it("get date + time to string", function() {
        var date;
        date = helper.getFrontMatterDate(helper.getDateTime());
        return expect(date).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
      });
    });
    describe(".parseFrontMatterDate", function() {
      return it("parse date + time to hash", function() {
        var dateTime, expected, i, key, len, results, value;
        atom.config.set("markdown-writer.frontMatterDate", "{year}-{month}-{day} {hour}:{minute}");
        dateTime = helper.parseFrontMatterDate("2016-01-03 19:11");
        expected = {
          year: "2016",
          month: "01",
          day: "03",
          hour: "19",
          minute: "11"
        };
        results = [];
        for (value = i = 0, len = expected.length; i < len; value = ++i) {
          key = expected[value];
          results.push(expect(dateTime[key]).toEqual(value));
        }
        return results;
      });
    });
    return describe(".getFileSlug", function() {
      it("get title slug", function() {
        var fixture, slug;
        slug = "hello-world";
        fixture = "abc/hello-world.markdown";
        expect(helper.getFileSlug(fixture)).toEqual(slug);
        fixture = "abc/2014-02-12-hello-world.markdown";
        return expect(helper.getFileSlug(fixture)).toEqual(slug);
      });
      it("get title slug", function() {
        var fixture, slug;
        atom.config.set("markdown-writer.newPostFileName", "{slug}-{day}-{month}-{year}{extension}");
        slug = "hello-world";
        fixture = "abc/hello-world-02-12-2014.markdown";
        return expect(helper.getFileSlug(fixture)).toEqual(slug);
      });
      return it("get empty slug", function() {
        expect(helper.getFileSlug(void 0)).toEqual("");
        return expect(helper.getFileSlug("")).toEqual("");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvaGVscGVycy90ZW1wbGF0ZS1oZWxwZXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsbUNBQVI7O0VBRVQsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7SUFDekIsVUFBQSxDQUFXLFNBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsdUJBQXBCO01BQUgsQ0FBaEI7SUFEUyxDQUFYO0lBR0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7YUFDOUIsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7QUFDOUIsWUFBQTtRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUExQjtlQUNQLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxPQUFiLENBQXFCLCtCQUFyQjtNQUY4QixDQUFoQztJQUQ4QixDQUFoQztJQUtBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO2FBQ2hDLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO0FBQzlCLFlBQUE7UUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLEVBQW1ELHNDQUFuRDtRQUNBLFFBQUEsR0FBVyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsa0JBQTVCO1FBQ1gsUUFBQSxHQUFXO1VBQUEsSUFBQSxFQUFNLE1BQU47VUFBYyxLQUFBLEVBQU8sSUFBckI7VUFBMkIsR0FBQSxFQUFLLElBQWhDO1VBQXNDLElBQUEsRUFBTSxJQUE1QztVQUFrRCxNQUFBLEVBQVEsSUFBMUQ7O0FBQ1g7YUFBQSwwREFBQTs7dUJBQUEsTUFBQSxDQUFPLFFBQVMsQ0FBQSxHQUFBLENBQWhCLENBQXFCLENBQUMsT0FBdEIsQ0FBOEIsS0FBOUI7QUFBQTs7TUFKOEIsQ0FBaEM7SUFEZ0MsQ0FBbEM7V0FPQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBO01BQ3ZCLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBO0FBQ25CLFlBQUE7UUFBQSxJQUFBLEdBQU87UUFDUCxPQUFBLEdBQVU7UUFDVixNQUFBLENBQU8sTUFBTSxDQUFDLFdBQVAsQ0FBbUIsT0FBbkIsQ0FBUCxDQUFtQyxDQUFDLE9BQXBDLENBQTRDLElBQTVDO1FBQ0EsT0FBQSxHQUFVO2VBQ1YsTUFBQSxDQUFPLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE9BQW5CLENBQVAsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxJQUE1QztNQUxtQixDQUFyQjtNQU9BLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBO0FBQ25CLFlBQUE7UUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLEVBQW1ELHdDQUFuRDtRQUNBLElBQUEsR0FBTztRQUNQLE9BQUEsR0FBVTtlQUNWLE1BQUEsQ0FBTyxNQUFNLENBQUMsV0FBUCxDQUFtQixPQUFuQixDQUFQLENBQW1DLENBQUMsT0FBcEMsQ0FBNEMsSUFBNUM7TUFKbUIsQ0FBckI7YUFNQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQTtRQUNuQixNQUFBLENBQU8sTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBbkIsQ0FBUCxDQUFxQyxDQUFDLE9BQXRDLENBQThDLEVBQTlDO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEVBQW5CLENBQVAsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxFQUF2QztNQUZtQixDQUFyQjtJQWR1QixDQUF6QjtFQWhCeUIsQ0FBM0I7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbImhlbHBlciA9IHJlcXVpcmUgXCIuLi8uLi9saWIvaGVscGVycy90ZW1wbGF0ZS1oZWxwZXJcIlxuXG5kZXNjcmliZSBcInRlbXBsYXRlSGVscGVyXCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcImZyb250LW1hdHRlci5tYXJrZG93blwiKVxuXG4gIGRlc2NyaWJlIFwiLmdldEZyb250TWF0dGVyRGF0ZVwiLCAtPlxuICAgIGl0IFwiZ2V0IGRhdGUgKyB0aW1lIHRvIHN0cmluZ1wiLCAtPlxuICAgICAgZGF0ZSA9IGhlbHBlci5nZXRGcm9udE1hdHRlckRhdGUoaGVscGVyLmdldERhdGVUaW1lKCkpXG4gICAgICBleHBlY3QoZGF0ZSkudG9NYXRjaCgvXFxkezR9LVxcZHsyfS1cXGR7Mn0gXFxkezJ9OlxcZHsyfS8pXG5cbiAgZGVzY3JpYmUgXCIucGFyc2VGcm9udE1hdHRlckRhdGVcIiwgLT5cbiAgICBpdCBcInBhcnNlIGRhdGUgKyB0aW1lIHRvIGhhc2hcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5mcm9udE1hdHRlckRhdGVcIiwgXCJ7eWVhcn0te21vbnRofS17ZGF5fSB7aG91cn06e21pbnV0ZX1cIilcbiAgICAgIGRhdGVUaW1lID0gaGVscGVyLnBhcnNlRnJvbnRNYXR0ZXJEYXRlKFwiMjAxNi0wMS0wMyAxOToxMVwiKVxuICAgICAgZXhwZWN0ZWQgPSB5ZWFyOiBcIjIwMTZcIiwgbW9udGg6IFwiMDFcIiwgZGF5OiBcIjAzXCIsIGhvdXI6IFwiMTlcIiwgbWludXRlOiBcIjExXCJcbiAgICAgIGV4cGVjdChkYXRlVGltZVtrZXldKS50b0VxdWFsKHZhbHVlKSBmb3Iga2V5LCB2YWx1ZSBpbiBleHBlY3RlZFxuXG4gIGRlc2NyaWJlIFwiLmdldEZpbGVTbHVnXCIsIC0+XG4gICAgaXQgXCJnZXQgdGl0bGUgc2x1Z1wiLCAtPlxuICAgICAgc2x1ZyA9IFwiaGVsbG8td29ybGRcIlxuICAgICAgZml4dHVyZSA9IFwiYWJjL2hlbGxvLXdvcmxkLm1hcmtkb3duXCJcbiAgICAgIGV4cGVjdChoZWxwZXIuZ2V0RmlsZVNsdWcoZml4dHVyZSkpLnRvRXF1YWwoc2x1ZylcbiAgICAgIGZpeHR1cmUgPSBcImFiYy8yMDE0LTAyLTEyLWhlbGxvLXdvcmxkLm1hcmtkb3duXCJcbiAgICAgIGV4cGVjdChoZWxwZXIuZ2V0RmlsZVNsdWcoZml4dHVyZSkpLnRvRXF1YWwoc2x1ZylcblxuICAgIGl0IFwiZ2V0IHRpdGxlIHNsdWdcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5uZXdQb3N0RmlsZU5hbWVcIiwgXCJ7c2x1Z30te2RheX0te21vbnRofS17eWVhcn17ZXh0ZW5zaW9ufVwiKVxuICAgICAgc2x1ZyA9IFwiaGVsbG8td29ybGRcIlxuICAgICAgZml4dHVyZSA9IFwiYWJjL2hlbGxvLXdvcmxkLTAyLTEyLTIwMTQubWFya2Rvd25cIlxuICAgICAgZXhwZWN0KGhlbHBlci5nZXRGaWxlU2x1ZyhmaXh0dXJlKSkudG9FcXVhbChzbHVnKVxuXG4gICAgaXQgXCJnZXQgZW1wdHkgc2x1Z1wiLCAtPlxuICAgICAgZXhwZWN0KGhlbHBlci5nZXRGaWxlU2x1Zyh1bmRlZmluZWQpKS50b0VxdWFsKFwiXCIpXG4gICAgICBleHBlY3QoaGVscGVyLmdldEZpbGVTbHVnKFwiXCIpKS50b0VxdWFsKFwiXCIpXG4iXX0=
