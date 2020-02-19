(function() {
  var LineMeta;

  LineMeta = require("../../lib/helpers/line-meta");

  describe("LineMeta", function() {
    describe(".isList", function() {
      it("is not list", function() {
        return expect(LineMeta.isList("normal line")).toBe(false);
      });
      it("is not list, blockquote", function() {
        return expect(LineMeta.isList("> blockquote")).toBe(false);
      });
      it("is unordered list", function() {
        return expect(LineMeta.isList("- list")).toBe(true);
      });
      it("is unordered task list", function() {
        return expect(LineMeta.isList("- [ ]list")).toBe(true);
      });
      it("is unordered task list", function() {
        return expect(LineMeta.isList("- [ ] list")).toBe(true);
      });
      it("is ordered list", function() {
        return expect(LineMeta.isList("12. list")).toBe(true);
      });
      it("is ordered list (bracket)", function() {
        return expect(LineMeta.isList("1) list")).toBe(true);
      });
      it("is ordered task list", function() {
        return expect(LineMeta.isList("12. [ ]list")).toBe(true);
      });
      it("is ordered task list", function() {
        return expect(LineMeta.isList("12. [ ] list")).toBe(true);
      });
      it("is ordered task list (bracket)", function() {
        return expect(LineMeta.isList("12) [ ] list")).toBe(true);
      });
      it("is alpha ordered list", function() {
        return expect(LineMeta.isList("aa. list")).toBe(true);
      });
      it("is alpha ordered task list", function() {
        return expect(LineMeta.isList("A. [ ]list")).toBe(true);
      });
      return it("is not alpha ordered task list (3 chars)", function() {
        return expect(LineMeta.isList("aaz. [ ]list")).toBe(false);
      });
    });
    describe("normal line", function() {
      return it("is not continuous", function() {
        return expect(new LineMeta("normal line").isContinuous()).toBe(false);
      });
    });
    describe("unordered task list lines", function() {
      var i, len, line, ref;
      ref = ["- [ ]", "- [x]", "- [ ] ", "- [X] "];
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        describe(line, function() {
          var lineMeta;
          lineMeta = new LineMeta(line);
          it("is list", function() {
            return expect(lineMeta.isList()).toBe(true);
          });
          it("is ul list", function() {
            return expect(lineMeta.isList("ul")).toBe(true);
          });
          it("is not ol list", function() {
            return expect(lineMeta.isList("ol")).toBe(false);
          });
          it("is task list", function() {
            return expect(lineMeta.isTaskList()).toBe(true);
          });
          it("is continuous", function() {
            return expect(lineMeta.isContinuous()).toBe(true);
          });
          it("is empty body", function() {
            return expect(lineMeta.isEmptyBody()).toBe(true);
          });
          it("is not indented", function() {
            return expect(lineMeta.isIndented()).toBe(false);
          });
          it("has body", function() {
            return expect(lineMeta.body).toBe("");
          });
          it("has head", function() {
            return expect(lineMeta.head).toBe("-");
          });
          it("had default head", function() {
            return expect(lineMeta.defaultHead).toBe("-");
          });
          it("has indent", function() {
            return expect(lineMeta.indent).toBe("");
          });
          it("has nextLine", function() {
            return expect(lineMeta.nextLine).toBe("- [ ] ");
          });
          it("has indentLineTabLength", function() {
            return expect(lineMeta.indentLineTabLength()).toBe(2);
          });
          return it("create lineHead", function() {
            return expect(lineMeta.lineHead("*")).toBe("* [ ] ");
          });
        });
      }
      return describe("- [X] line", function() {
        var lineMeta;
        lineMeta = new LineMeta("- [X] line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is ul list", function() {
          return expect(lineMeta.isList("ul")).toBe(true);
        });
        it("is not ol list", function() {
          return expect(lineMeta.isList("ol")).toBe(false);
        });
        it("is task list", function() {
          return expect(lineMeta.isTaskList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is not indented", function() {
          return expect(lineMeta.isIndented()).toBe(false);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("-");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("-");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("- [ ] ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(2);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("*")).toBe("* [ ] ");
        });
      });
    });
    describe("unordered list line", function() {
      var i, len, line, ref;
      ref = ["-", "- ", "-   "];
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        describe(line, function() {
          var lineMeta;
          lineMeta = new LineMeta(line);
          it("is list", function() {
            return expect(lineMeta.isList()).toBe(true);
          });
          it("is continuous", function() {
            return expect(lineMeta.isContinuous()).toBe(true);
          });
          it("is empty body", function() {
            return expect(lineMeta.isEmptyBody()).toBe(true);
          });
          it("is not indented", function() {
            return expect(lineMeta.isIndented()).toBe(false);
          });
          it("has body", function() {
            return expect(lineMeta.body).toBe("");
          });
          it("has head", function() {
            return expect(lineMeta.head).toBe("-");
          });
          it("had default head", function() {
            return expect(lineMeta.defaultHead).toBe("-");
          });
          it("has indent", function() {
            return expect(lineMeta.indent).toBe("");
          });
          it("has nextLine", function() {
            return expect(lineMeta.nextLine).toBe("- ");
          });
          it("has indentLineTabLength", function() {
            return expect(lineMeta.indentLineTabLength()).toBe(2);
          });
          return it("create lineHead", function() {
            return expect(lineMeta.lineHead("*")).toBe("* ");
          });
        });
      }
      return describe("  - line", function() {
        var lineMeta;
        lineMeta = new LineMeta("  - line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is indented", function() {
          return expect(lineMeta.isIndented()).toBe(true);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("-");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("-");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("  ");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("  - ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(2);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("*")).toBe("  * ");
        });
      });
    });
    describe("ordered task list line", function() {
      var i, len, line, ref;
      ref = ["1. [ ]", "1. [x]", "1. [ ] ", "1. [X] "];
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        describe(line, function() {
          var lineMeta;
          lineMeta = new LineMeta(line);
          it("is list", function() {
            return expect(lineMeta.isList()).toBe(true);
          });
          it("is ol list", function() {
            return expect(lineMeta.isList("ol")).toBe(true);
          });
          it("is not ul list", function() {
            return expect(lineMeta.isList("ul")).toBe(false);
          });
          it("is task list", function() {
            return expect(lineMeta.isTaskList()).toBe(true);
          });
          it("is continuous", function() {
            return expect(lineMeta.isContinuous()).toBe(true);
          });
          it("is empty body", function() {
            return expect(lineMeta.isEmptyBody()).toBe(true);
          });
          it("is not indented", function() {
            return expect(lineMeta.isIndented()).toBe(false);
          });
          it("has body", function() {
            return expect(lineMeta.body).toBe("");
          });
          it("has head", function() {
            return expect(lineMeta.head).toBe("1");
          });
          it("had default head", function() {
            return expect(lineMeta.defaultHead).toBe("1");
          });
          it("has indent", function() {
            return expect(lineMeta.indent).toBe("");
          });
          it("has nextLine", function() {
            return expect(lineMeta.nextLine).toBe("2. [ ] ");
          });
          it("has indentLineTabLength", function() {
            return expect(lineMeta.indentLineTabLength()).toBe(3);
          });
          return it("create lineHead", function() {
            return expect(lineMeta.lineHead("1")).toBe("1. [ ] ");
          });
        });
      }
      return describe("    99. [X] line", function() {
        var lineMeta;
        lineMeta = new LineMeta("    99. [X] line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is ol list", function() {
          return expect(lineMeta.isList("ol")).toBe(true);
        });
        it("is not ul list", function() {
          return expect(lineMeta.isList("ul")).toBe(false);
        });
        it("is task list", function() {
          return expect(lineMeta.isTaskList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is indented", function() {
          return expect(lineMeta.isIndented()).toBe(true);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("99");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("1");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("    ");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("    100. [ ] ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(4);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("1")).toBe("    1. [ ] ");
        });
      });
    });
    describe("ordered list line", function() {
      var i, len, line, ref;
      ref = ["3.", "3. ", "3.   "];
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        describe(line, function() {
          var lineMeta;
          lineMeta = new LineMeta(line);
          it("is list", function() {
            return expect(lineMeta.isList()).toBe(true);
          });
          it("is continuous", function() {
            return expect(lineMeta.isContinuous()).toBe(true);
          });
          it("is empty body", function() {
            return expect(lineMeta.isEmptyBody()).toBe(true);
          });
          it("is not indented", function() {
            return expect(lineMeta.isIndented()).toBe(false);
          });
          it("has body", function() {
            return expect(lineMeta.body).toBe("");
          });
          it("has head", function() {
            return expect(lineMeta.head).toBe("3");
          });
          it("had default head", function() {
            return expect(lineMeta.defaultHead).toBe("1");
          });
          it("has indent", function() {
            return expect(lineMeta.indent).toBe("");
          });
          it("has nextLine", function() {
            return expect(lineMeta.nextLine).toBe("4. ");
          });
          it("has indentLineTabLength", function() {
            return expect(lineMeta.indentLineTabLength()).toBe(3);
          });
          return it("create lineHead", function() {
            return expect(lineMeta.lineHead("1")).toBe("1. ");
          });
        });
      }
      describe("3. line", function() {
        var lineMeta;
        lineMeta = new LineMeta("3. line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is not indented", function() {
          return expect(lineMeta.isIndented()).toBe(false);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("3");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("1");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("4. ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(3);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("1")).toBe("1. ");
        });
      });
      return describe("3) line", function() {
        var lineMeta;
        lineMeta = new LineMeta("3) line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is not indented", function() {
          return expect(lineMeta.isIndented()).toBe(false);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("3");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("1");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("4) ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(3);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("1")).toBe("1) ");
        });
      });
    });
    describe("ordered alpha list line", function() {
      describe("a. line", function() {
        var lineMeta;
        lineMeta = new LineMeta("a. line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is not indented", function() {
          return expect(lineMeta.isIndented()).toBe(false);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("a");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("a");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("b. ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(3);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("a")).toBe("a. ");
        });
      });
      describe("EA) line", function() {
        var lineMeta;
        lineMeta = new LineMeta("EA) line");
        it("is list", function() {
          return expect(lineMeta.isList()).toBe(true);
        });
        it("is continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(true);
        });
        it("is not empty body", function() {
          return expect(lineMeta.isEmptyBody()).toBe(false);
        });
        it("is not indented", function() {
          return expect(lineMeta.isIndented()).toBe(false);
        });
        it("has body", function() {
          return expect(lineMeta.body).toBe("line");
        });
        it("has head", function() {
          return expect(lineMeta.head).toBe("EA");
        });
        it("had default head", function() {
          return expect(lineMeta.defaultHead).toBe("AA");
        });
        it("has indent", function() {
          return expect(lineMeta.indent).toBe("");
        });
        it("has nextLine", function() {
          return expect(lineMeta.nextLine).toBe("EB) ");
        });
        it("has indentLineTabLength", function() {
          return expect(lineMeta.indentLineTabLength()).toBe(4);
        });
        return it("create lineHead", function() {
          return expect(lineMeta.lineHead("A")).toBe("A) ");
        });
      });
      return describe("aaa. not a list line", function() {
        var lineMeta;
        lineMeta = new LineMeta("aaa. not a list line");
        it("is not list", function() {
          return expect(lineMeta.isList()).toBe(false);
        });
        return it("is not continuous", function() {
          return expect(lineMeta.isContinuous()).toBe(false);
        });
      });
    });
    return describe("blockquote", function() {
      var lineMeta;
      lineMeta = new LineMeta("  > blockquote");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(false);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(false);
      });
      it("is indented", function() {
        return expect(lineMeta.isIndented()).toBe(true);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("blockquote");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe(">");
      });
      it("had default head", function() {
        return expect(lineMeta.defaultHead).toBe(">");
      });
      it("has indent", function() {
        return expect(lineMeta.indent).toBe("  ");
      });
      it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("  > ");
      });
      return it("has indentLineTabLength", function() {
        return expect(lineMeta.indentLineTabLength()).toBe(2);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvaGVscGVycy9saW5lLW1ldGEtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVI7O0VBRVgsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtJQUVuQixRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO01BQ2xCLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUE7ZUFBRyxNQUFBLENBQU8sUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsYUFBaEIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEtBQTVDO01BQUgsQ0FBbEI7TUFDQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtlQUFHLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixjQUFoQixDQUFQLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsS0FBN0M7TUFBSCxDQUE5QjtNQUNBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO2VBQUcsTUFBQSxDQUFPLFFBQVEsQ0FBQyxNQUFULENBQWdCLFFBQWhCLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QztNQUFILENBQXhCO01BQ0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7ZUFBRyxNQUFBLENBQU8sUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsV0FBaEIsQ0FBUCxDQUFvQyxDQUFDLElBQXJDLENBQTBDLElBQTFDO01BQUgsQ0FBN0I7TUFDQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQTtlQUFHLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixZQUFoQixDQUFQLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsSUFBM0M7TUFBSCxDQUE3QjtNQUNBLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBO2VBQUcsTUFB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SUFBdEIsQ0FBMkIsR0FBM0I7TUFBSCxDQUFmO01BQ0EsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUE7ZUFBRyxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQWhCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsR0FBbEM7TUFBSCxDQUF2QjtNQUNBLEVBQUEsQ0FBRyxZQUFILEVBQWlCLFNBQUE7ZUFBRyxNQUFBLENBQU8sUUFBUSxDQUFDLE1BQWhCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsSUFBN0I7TUFBSCxDQUFqQjtNQUNBLEVBQUEsQ0FBRyxjQUFILEVBQW1CLFNBQUE7ZUFBRyxNQUFBLENBQU8sUUFBUSxDQUFDLFFBQWhCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsTUFBL0I7TUFBSCxDQUFuQjthQUNBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBO2VBQUcsTUFBQSxDQUFPLFFBQVEsQ0FBQyxtQkFBVCxDQUFBLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxDQUE1QztNQUFILENBQTlCO0lBWHFCLENBQXZCO0VBMU1tQixDQUFyQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiTGluZU1ldGEgPSByZXF1aXJlIFwiLi4vLi4vbGliL2hlbHBlcnMvbGluZS1tZXRhXCJcblxuZGVzY3JpYmUgXCJMaW5lTWV0YVwiLCAtPlxuICAjIHN0YXRpYyBtZXRob2RzXG4gIGRlc2NyaWJlIFwiLmlzTGlzdFwiLCAtPlxuICAgIGl0IFwiaXMgbm90IGxpc3RcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcIm5vcm1hbCBsaW5lXCIpKS50b0JlKGZhbHNlKVxuICAgIGl0IFwiaXMgbm90IGxpc3QsIGJsb2NrcXVvdGVcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcIj4gYmxvY2txdW90ZVwiKSkudG9CZShmYWxzZSlcbiAgICBpdCBcImlzIHVub3JkZXJlZCBsaXN0XCIsIC0+IGV4cGVjdChMaW5lTWV0YS5pc0xpc3QoXCItIGxpc3RcIikpLnRvQmUodHJ1ZSlcbiAgICBpdCBcImlzIHVub3JkZXJlZCB0YXNrIGxpc3RcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcIi0gWyBdbGlzdFwiKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaXMgdW5vcmRlcmVkIHRhc2sgbGlzdFwiLCAtPiBleHBlY3QoTGluZU1ldGEuaXNMaXN0KFwiLSBbIF0gbGlzdFwiKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaXMgb3JkZXJlZCBsaXN0XCIsIC0+IGV4cGVjdChMaW5lTWV0YS5pc0xpc3QoXCIxMi4gbGlzdFwiKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaXMgb3JkZXJlZCBsaXN0IChicmFja2V0KVwiLCAtPiBleHBlY3QoTGluZU1ldGEuaXNMaXN0KFwiMSkgbGlzdFwiKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaXMgb3JkZXJlZCB0YXNrIGxpc3RcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcIjEyLiBbIF1saXN0XCIpKS50b0JlKHRydWUpXG4gICAgaXQgXCJpcyBvcmRlcmVkIHRhc2sgbGlzdFwiLCAtPiBleHBlY3QoTGluZU1ldGEuaXNMaXN0KFwiMTIuIFsgXSBsaXN0XCIpKS50b0JlKHRydWUpXG4gICAgaXQgXCJpcyBvcmRlcmVkIHRhc2sgbGlzdCAoYnJhY2tldClcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcIjEyKSBbIF0gbGlzdFwiKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaXMgYWxwaGEgb3JkZXJlZCBsaXN0XCIsIC0+IGV4cGVjdChMaW5lTWV0YS5pc0xpc3QoXCJhYS4gbGlzdFwiKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaXMgYWxwaGEgb3JkZXJlZCB0YXNrIGxpc3RcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcIkEuIFsgXWxpc3RcIikpLnRvQmUodHJ1ZSlcbiAgICBpdCBcImlzIG5vdCBhbHBoYSBvcmRlcmVkIHRhc2sgbGlzdCAoMyBjaGFycylcIiwgLT4gZXhwZWN0KExpbmVNZXRhLmlzTGlzdChcImFhei4gWyBdbGlzdFwiKSkudG9CZShmYWxzZSlcblxuICAjIGluc3RhbmNlXG4gIGRlc2NyaWJlIFwibm9ybWFsIGxpbmVcIiwgLT5cbiAgICBpdCBcImlzIG5vdCBjb250aW51b3VzXCIsIC0+XG4gICAgICBleHBlY3QobmV3IExpbmVNZXRhKFwibm9ybWFsIGxpbmVcIikuaXNDb250aW51b3VzKCkpLnRvQmUoZmFsc2UpXG5cbiAgZGVzY3JpYmUgXCJ1bm9yZGVyZWQgdGFzayBsaXN0IGxpbmVzXCIsIC0+XG4gICAgZm9yIGxpbmUgaW4gW1wiLSBbIF1cIiwgXCItIFt4XVwiLCBcIi0gWyBdIFwiLCBcIi0gW1hdIFwiXVxuICAgICAgZGVzY3JpYmUgbGluZSwgLT5cbiAgICAgICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICAgICAgaXQgXCJpcyBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoKSkudG9CZSh0cnVlKVxuICAgICAgICBpdCBcImlzIHVsIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzTGlzdChcInVsXCIpKS50b0JlKHRydWUpXG4gICAgICAgIGl0IFwiaXMgbm90IG9sIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzTGlzdChcIm9sXCIpKS50b0JlKGZhbHNlKVxuICAgICAgICBpdCBcImlzIHRhc2sgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNUYXNrTGlzdCgpKS50b0JlKHRydWUpXG4gICAgICAgIGl0IFwiaXMgY29udGludW91c1wiLCAtPiBleHBlY3QobGluZU1ldGEuaXNDb250aW51b3VzKCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgaXQgXCJpcyBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKHRydWUpXG4gICAgICAgIGl0IFwiaXMgbm90IGluZGVudGVkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0luZGVudGVkKCkpLnRvQmUoZmFsc2UpXG4gICAgICAgIGl0IFwiaGFzIGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmJvZHkpLnRvQmUoXCJcIilcbiAgICAgICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcIi1cIilcbiAgICAgICAgaXQgXCJoYWQgZGVmYXVsdCBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5kZWZhdWx0SGVhZCkudG9CZShcIi1cIilcbiAgICAgICAgaXQgXCJoYXMgaW5kZW50XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnQpLnRvQmUoXCJcIilcbiAgICAgICAgaXQgXCJoYXMgbmV4dExpbmVcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLm5leHRMaW5lKS50b0JlKFwiLSBbIF0gXCIpXG4gICAgICAgIGl0IFwiaGFzIGluZGVudExpbmVUYWJMZW5ndGhcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudExpbmVUYWJMZW5ndGgoKSkudG9CZSgyKVxuICAgICAgICBpdCBcImNyZWF0ZSBsaW5lSGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEubGluZUhlYWQoXCIqXCIpKS50b0JlKFwiKiBbIF0gXCIpXG5cbiAgICBkZXNjcmliZSBcIi0gW1hdIGxpbmVcIiwgLT5cbiAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKFwiLSBbWF0gbGluZVwiKVxuICAgICAgaXQgXCJpcyBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyB1bCBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoXCJ1bFwiKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBub3Qgb2wgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNMaXN0KFwib2xcIikpLnRvQmUoZmFsc2UpXG4gICAgICBpdCBcImlzIHRhc2sgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNUYXNrTGlzdCgpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIGNvbnRpbnVvdXNcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzQ29udGludW91cygpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIG5vdCBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKGZhbHNlKVxuICAgICAgaXQgXCJpcyBub3QgaW5kZW50ZWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzSW5kZW50ZWQoKSkudG9CZShmYWxzZSlcbiAgICAgIGl0IFwiaGFzIGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmJvZHkpLnRvQmUoXCJsaW5lXCIpXG4gICAgICBpdCBcImhhcyBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5oZWFkKS50b0JlKFwiLVwiKVxuICAgICAgaXQgXCJoYWQgZGVmYXVsdCBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5kZWZhdWx0SGVhZCkudG9CZShcIi1cIilcbiAgICAgIGl0IFwiaGFzIGluZGVudFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50KS50b0JlKFwiXCIpXG4gICAgICBpdCBcImhhcyBuZXh0TGluZVwiLCAtPiBleHBlY3QobGluZU1ldGEubmV4dExpbmUpLnRvQmUoXCItIFsgXSBcIilcbiAgICAgIGl0IFwiaGFzIGluZGVudExpbmVUYWJMZW5ndGhcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudExpbmVUYWJMZW5ndGgoKSkudG9CZSgyKVxuICAgICAgaXQgXCJjcmVhdGUgbGluZUhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmxpbmVIZWFkKFwiKlwiKSkudG9CZShcIiogWyBdIFwiKVxuXG4gIGRlc2NyaWJlIFwidW5vcmRlcmVkIGxpc3QgbGluZVwiLCAtPlxuICAgIGZvciBsaW5lIGluIFtcIi1cIiwgXCItIFwiLCBcIi0gICBcIl1cbiAgICAgIGRlc2NyaWJlIGxpbmUsIC0+XG4gICAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKGxpbmUpXG4gICAgICAgIGl0IFwiaXMgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNMaXN0KCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgaXQgXCJpcyBjb250aW51b3VzXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0NvbnRpbnVvdXMoKSkudG9CZSh0cnVlKVxuICAgICAgICBpdCBcImlzIGVtcHR5IGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzRW1wdHlCb2R5KCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgaXQgXCJpcyBub3QgaW5kZW50ZWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzSW5kZW50ZWQoKSkudG9CZShmYWxzZSlcbiAgICAgICAgaXQgXCJoYXMgYm9keVwiLCAtPiBleHBlY3QobGluZU1ldGEuYm9keSkudG9CZShcIlwiKVxuICAgICAgICBpdCBcImhhcyBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5oZWFkKS50b0JlKFwiLVwiKVxuICAgICAgICBpdCBcImhhZCBkZWZhdWx0IGhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmRlZmF1bHRIZWFkKS50b0JlKFwiLVwiKVxuICAgICAgICBpdCBcImhhcyBpbmRlbnRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudCkudG9CZShcIlwiKVxuICAgICAgICBpdCBcImhhcyBuZXh0TGluZVwiLCAtPiBleHBlY3QobGluZU1ldGEubmV4dExpbmUpLnRvQmUoXCItIFwiKVxuICAgICAgICBpdCBcImhhcyBpbmRlbnRMaW5lVGFiTGVuZ3RoXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnRMaW5lVGFiTGVuZ3RoKCkpLnRvQmUoMilcbiAgICAgICAgaXQgXCJjcmVhdGUgbGluZUhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmxpbmVIZWFkKFwiKlwiKSkudG9CZShcIiogXCIpXG5cbiAgICBkZXNjcmliZSBcIiAgLSBsaW5lXCIsIC0+XG4gICAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShcIiAgLSBsaW5lXCIpXG4gICAgICBpdCBcImlzIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzTGlzdCgpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIGNvbnRpbnVvdXNcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzQ29udGludW91cygpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIG5vdCBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKGZhbHNlKVxuICAgICAgaXQgXCJpcyBpbmRlbnRlZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNJbmRlbnRlZCgpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImhhcyBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5ib2R5KS50b0JlKFwibGluZVwiKVxuICAgICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcIi1cIilcbiAgICAgIGl0IFwiaGFkIGRlZmF1bHQgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuZGVmYXVsdEhlYWQpLnRvQmUoXCItXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudCkudG9CZShcIiAgXCIpXG4gICAgICBpdCBcImhhcyBuZXh0TGluZVwiLCAtPiBleHBlY3QobGluZU1ldGEubmV4dExpbmUpLnRvQmUoXCIgIC0gXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRMaW5lVGFiTGVuZ3RoXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnRMaW5lVGFiTGVuZ3RoKCkpLnRvQmUoMilcbiAgICAgIGl0IFwiY3JlYXRlIGxpbmVIZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5saW5lSGVhZChcIipcIikpLnRvQmUoXCIgICogXCIpXG5cbiAgZGVzY3JpYmUgXCJvcmRlcmVkIHRhc2sgbGlzdCBsaW5lXCIsIC0+XG4gICAgZm9yIGxpbmUgaW4gW1wiMS4gWyBdXCIsIFwiMS4gW3hdXCIsIFwiMS4gWyBdIFwiLCBcIjEuIFtYXSBcIl1cbiAgICAgIGRlc2NyaWJlIGxpbmUsIC0+XG4gICAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKGxpbmUpXG4gICAgICAgIGl0IFwiaXMgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNMaXN0KCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgaXQgXCJpcyBvbCBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoXCJvbFwiKSkudG9CZSh0cnVlKVxuICAgICAgICBpdCBcImlzIG5vdCB1bCBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoXCJ1bFwiKSkudG9CZShmYWxzZSlcbiAgICAgICAgaXQgXCJpcyB0YXNrIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzVGFza0xpc3QoKSkudG9CZSh0cnVlKVxuICAgICAgICBpdCBcImlzIGNvbnRpbnVvdXNcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzQ29udGludW91cygpKS50b0JlKHRydWUpXG4gICAgICAgIGl0IFwiaXMgZW1wdHkgYm9keVwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNFbXB0eUJvZHkoKSkudG9CZSh0cnVlKVxuICAgICAgICBpdCBcImlzIG5vdCBpbmRlbnRlZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNJbmRlbnRlZCgpKS50b0JlKGZhbHNlKVxuICAgICAgICBpdCBcImhhcyBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5ib2R5KS50b0JlKFwiXCIpXG4gICAgICAgIGl0IFwiaGFzIGhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmhlYWQpLnRvQmUoXCIxXCIpXG4gICAgICAgIGl0IFwiaGFkIGRlZmF1bHQgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuZGVmYXVsdEhlYWQpLnRvQmUoXCIxXCIpXG4gICAgICAgIGl0IFwiaGFzIGluZGVudFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50KS50b0JlKFwiXCIpXG4gICAgICAgIGl0IFwiaGFzIG5leHRMaW5lXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5uZXh0TGluZSkudG9CZShcIjIuIFsgXSBcIilcbiAgICAgICAgaXQgXCJoYXMgaW5kZW50TGluZVRhYkxlbmd0aFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50TGluZVRhYkxlbmd0aCgpKS50b0JlKDMpXG4gICAgICAgIGl0IFwiY3JlYXRlIGxpbmVIZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5saW5lSGVhZChcIjFcIikpLnRvQmUoXCIxLiBbIF0gXCIpXG5cbiAgICBkZXNjcmliZSBcIiAgICA5OS4gW1hdIGxpbmVcIiwgLT5cbiAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKFwiICAgIDk5LiBbWF0gbGluZVwiKVxuICAgICAgaXQgXCJpcyBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBvbCBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoXCJvbFwiKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBub3QgdWwgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNMaXN0KFwidWxcIikpLnRvQmUoZmFsc2UpXG4gICAgICBpdCBcImlzIHRhc2sgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNUYXNrTGlzdCgpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIGNvbnRpbnVvdXNcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzQ29udGludW91cygpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIG5vdCBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKGZhbHNlKVxuICAgICAgaXQgXCJpcyBpbmRlbnRlZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNJbmRlbnRlZCgpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImhhcyBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5ib2R5KS50b0JlKFwibGluZVwiKVxuICAgICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcIjk5XCIpXG4gICAgICBpdCBcImhhZCBkZWZhdWx0IGhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmRlZmF1bHRIZWFkKS50b0JlKFwiMVwiKVxuICAgICAgaXQgXCJoYXMgaW5kZW50XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnQpLnRvQmUoXCIgICAgXCIpXG4gICAgICBpdCBcImhhcyBuZXh0TGluZVwiLCAtPiBleHBlY3QobGluZU1ldGEubmV4dExpbmUpLnRvQmUoXCIgICAgMTAwLiBbIF0gXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRMaW5lVGFiTGVuZ3RoXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnRMaW5lVGFiTGVuZ3RoKCkpLnRvQmUoNClcbiAgICAgIGl0IFwiY3JlYXRlIGxpbmVIZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5saW5lSGVhZChcIjFcIikpLnRvQmUoXCIgICAgMS4gWyBdIFwiKVxuXG4gIGRlc2NyaWJlIFwib3JkZXJlZCBsaXN0IGxpbmVcIiwgLT5cbiAgICBmb3IgbGluZSBpbiBbXCIzLlwiLCBcIjMuIFwiLCBcIjMuICAgXCJdXG4gICAgICBkZXNjcmliZSBsaW5lLCAtPlxuICAgICAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuICAgICAgICBpdCBcImlzIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzTGlzdCgpKS50b0JlKHRydWUpXG4gICAgICAgIGl0IFwiaXMgY29udGludW91c1wiLCAtPiBleHBlY3QobGluZU1ldGEuaXNDb250aW51b3VzKCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgaXQgXCJpcyBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKHRydWUpXG4gICAgICAgIGl0IFwiaXMgbm90IGluZGVudGVkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0luZGVudGVkKCkpLnRvQmUoZmFsc2UpXG4gICAgICAgIGl0IFwiaGFzIGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmJvZHkpLnRvQmUoXCJcIilcbiAgICAgICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcIjNcIilcbiAgICAgICAgaXQgXCJoYWQgZGVmYXVsdCBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5kZWZhdWx0SGVhZCkudG9CZShcIjFcIilcbiAgICAgICAgaXQgXCJoYXMgaW5kZW50XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnQpLnRvQmUoXCJcIilcbiAgICAgICAgaXQgXCJoYXMgbmV4dExpbmVcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLm5leHRMaW5lKS50b0JlKFwiNC4gXCIpXG4gICAgICAgIGl0IFwiaGFzIGluZGVudExpbmVUYWJMZW5ndGhcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudExpbmVUYWJMZW5ndGgoKSkudG9CZSgzKVxuICAgICAgICBpdCBcImNyZWF0ZSBsaW5lSGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEubGluZUhlYWQoXCIxXCIpKS50b0JlKFwiMS4gXCIpXG5cbiAgICBkZXNjcmliZSBcIjMuIGxpbmVcIiwgLT5cbiAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKFwiMy4gbGluZVwiKVxuICAgICAgaXQgXCJpcyBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBjb250aW51b3VzXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0NvbnRpbnVvdXMoKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBub3QgZW1wdHkgYm9keVwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNFbXB0eUJvZHkoKSkudG9CZShmYWxzZSlcbiAgICAgIGl0IFwiaXMgbm90IGluZGVudGVkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0luZGVudGVkKCkpLnRvQmUoZmFsc2UpXG4gICAgICBpdCBcImhhcyBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5ib2R5KS50b0JlKFwibGluZVwiKVxuICAgICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcIjNcIilcbiAgICAgIGl0IFwiaGFkIGRlZmF1bHQgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuZGVmYXVsdEhlYWQpLnRvQmUoXCIxXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudCkudG9CZShcIlwiKVxuICAgICAgaXQgXCJoYXMgbmV4dExpbmVcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLm5leHRMaW5lKS50b0JlKFwiNC4gXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRMaW5lVGFiTGVuZ3RoXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnRMaW5lVGFiTGVuZ3RoKCkpLnRvQmUoMylcbiAgICAgIGl0IFwiY3JlYXRlIGxpbmVIZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5saW5lSGVhZChcIjFcIikpLnRvQmUoXCIxLiBcIilcblxuICAgIGRlc2NyaWJlIFwiMykgbGluZVwiLCAtPlxuICAgICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEoXCIzKSBsaW5lXCIpXG4gICAgICBpdCBcImlzIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzTGlzdCgpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIGNvbnRpbnVvdXNcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzQ29udGludW91cygpKS50b0JlKHRydWUpXG4gICAgICBpdCBcImlzIG5vdCBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKGZhbHNlKVxuICAgICAgaXQgXCJpcyBub3QgaW5kZW50ZWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzSW5kZW50ZWQoKSkudG9CZShmYWxzZSlcbiAgICAgIGl0IFwiaGFzIGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmJvZHkpLnRvQmUoXCJsaW5lXCIpXG4gICAgICBpdCBcImhhcyBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5oZWFkKS50b0JlKFwiM1wiKVxuICAgICAgaXQgXCJoYWQgZGVmYXVsdCBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5kZWZhdWx0SGVhZCkudG9CZShcIjFcIilcbiAgICAgIGl0IFwiaGFzIGluZGVudFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50KS50b0JlKFwiXCIpXG4gICAgICBpdCBcImhhcyBuZXh0TGluZVwiLCAtPiBleHBlY3QobGluZU1ldGEubmV4dExpbmUpLnRvQmUoXCI0KSBcIilcbiAgICAgIGl0IFwiaGFzIGluZGVudExpbmVUYWJMZW5ndGhcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudExpbmVUYWJMZW5ndGgoKSkudG9CZSgzKVxuICAgICAgaXQgXCJjcmVhdGUgbGluZUhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmxpbmVIZWFkKFwiMVwiKSkudG9CZShcIjEpIFwiKVxuXG4gIGRlc2NyaWJlIFwib3JkZXJlZCBhbHBoYSBsaXN0IGxpbmVcIiwgLT5cbiAgICBkZXNjcmliZSBcImEuIGxpbmVcIiwgLT5cbiAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKFwiYS4gbGluZVwiKVxuICAgICAgaXQgXCJpcyBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBjb250aW51b3VzXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0NvbnRpbnVvdXMoKSkudG9CZSh0cnVlKVxuICAgICAgaXQgXCJpcyBub3QgZW1wdHkgYm9keVwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNFbXB0eUJvZHkoKSkudG9CZShmYWxzZSlcbiAgICAgIGl0IFwiaXMgbm90IGluZGVudGVkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0luZGVudGVkKCkpLnRvQmUoZmFsc2UpXG4gICAgICBpdCBcImhhcyBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5ib2R5KS50b0JlKFwibGluZVwiKVxuICAgICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcImFcIilcbiAgICAgIGl0IFwiaGFkIGRlZmF1bHQgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuZGVmYXVsdEhlYWQpLnRvQmUoXCJhXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudCkudG9CZShcIlwiKVxuICAgICAgaXQgXCJoYXMgbmV4dExpbmVcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLm5leHRMaW5lKS50b0JlKFwiYi4gXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRMaW5lVGFiTGVuZ3RoXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pbmRlbnRMaW5lVGFiTGVuZ3RoKCkpLnRvQmUoMylcbiAgICAgIGl0IFwiY3JlYXRlIGxpbmVIZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5saW5lSGVhZChcImFcIikpLnRvQmUoXCJhLiBcIilcblxuICAgIGRlc2NyaWJlIFwiRUEpIGxpbmVcIiwgLT5cbiAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKFwiRUEpIGxpbmVcIilcbiAgICAgIGl0IFwiaXMgbGlzdFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNMaXN0KCkpLnRvQmUodHJ1ZSlcbiAgICAgIGl0IFwiaXMgY29udGludW91c1wiLCAtPiBleHBlY3QobGluZU1ldGEuaXNDb250aW51b3VzKCkpLnRvQmUodHJ1ZSlcbiAgICAgIGl0IFwiaXMgbm90IGVtcHR5IGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzRW1wdHlCb2R5KCkpLnRvQmUoZmFsc2UpXG4gICAgICBpdCBcImlzIG5vdCBpbmRlbnRlZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaXNJbmRlbnRlZCgpKS50b0JlKGZhbHNlKVxuICAgICAgaXQgXCJoYXMgYm9keVwiLCAtPiBleHBlY3QobGluZU1ldGEuYm9keSkudG9CZShcImxpbmVcIilcbiAgICAgIGl0IFwiaGFzIGhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmhlYWQpLnRvQmUoXCJFQVwiKVxuICAgICAgaXQgXCJoYWQgZGVmYXVsdCBoZWFkXCIsIC0+IGV4cGVjdChsaW5lTWV0YS5kZWZhdWx0SGVhZCkudG9CZShcIkFBXCIpXG4gICAgICBpdCBcImhhcyBpbmRlbnRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmluZGVudCkudG9CZShcIlwiKVxuICAgICAgaXQgXCJoYXMgbmV4dExpbmVcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLm5leHRMaW5lKS50b0JlKFwiRUIpIFwiKVxuICAgICAgaXQgXCJoYXMgaW5kZW50TGluZVRhYkxlbmd0aFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50TGluZVRhYkxlbmd0aCgpKS50b0JlKDQpXG4gICAgICBpdCBcImNyZWF0ZSBsaW5lSGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEubGluZUhlYWQoXCJBXCIpKS50b0JlKFwiQSkgXCIpXG5cbiAgICBkZXNjcmliZSBcImFhYS4gbm90IGEgbGlzdCBsaW5lXCIsIC0+XG4gICAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShcImFhYS4gbm90IGEgbGlzdCBsaW5lXCIpXG4gICAgICBpdCBcImlzIG5vdCBsaXN0XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0xpc3QoKSkudG9CZShmYWxzZSlcbiAgICAgIGl0IFwiaXMgbm90IGNvbnRpbnVvdXNcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzQ29udGludW91cygpKS50b0JlKGZhbHNlKVxuXG4gIGRlc2NyaWJlIFwiYmxvY2txdW90ZVwiLCAtPlxuICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKFwiICA+IGJsb2NrcXVvdGVcIilcbiAgICBpdCBcImlzIGxpc3RcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzTGlzdCgpKS50b0JlKGZhbHNlKVxuICAgIGl0IFwiaXMgY29udGludW91c1wiLCAtPiBleHBlY3QobGluZU1ldGEuaXNDb250aW51b3VzKCkpLnRvQmUodHJ1ZSlcbiAgICBpdCBcImlzIG5vdCBlbXB0eSBib2R5XCIsIC0+IGV4cGVjdChsaW5lTWV0YS5pc0VtcHR5Qm9keSgpKS50b0JlKGZhbHNlKVxuICAgIGl0IFwiaXMgaW5kZW50ZWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmlzSW5kZW50ZWQoKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiaGFzIGJvZHlcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmJvZHkpLnRvQmUoXCJibG9ja3F1b3RlXCIpXG4gICAgaXQgXCJoYXMgaGVhZFwiLCAtPiBleHBlY3QobGluZU1ldGEuaGVhZCkudG9CZShcIj5cIilcbiAgICBpdCBcImhhZCBkZWZhdWx0IGhlYWRcIiwgLT4gZXhwZWN0KGxpbmVNZXRhLmRlZmF1bHRIZWFkKS50b0JlKFwiPlwiKVxuICAgIGl0IFwiaGFzIGluZGVudFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50KS50b0JlKFwiICBcIilcbiAgICBpdCBcImhhcyBuZXh0TGluZVwiLCAtPiBleHBlY3QobGluZU1ldGEubmV4dExpbmUpLnRvQmUoXCIgID4gXCIpXG4gICAgaXQgXCJoYXMgaW5kZW50TGluZVRhYkxlbmd0aFwiLCAtPiBleHBlY3QobGluZU1ldGEuaW5kZW50TGluZVRhYkxlbmd0aCgpKS50b0JlKDIpXG4iXX0=
