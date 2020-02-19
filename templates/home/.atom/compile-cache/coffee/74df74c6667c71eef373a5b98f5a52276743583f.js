(function() {
  var config, path;

  path = require("path");

  config = require("../lib/config");

  describe("config", function() {
    describe(".set", function() {
      it("get user modified value", function() {
        atom.config.set("markdown-writer.test", "special");
        return expect(config.get("test")).toEqual("special");
      });
      return it("set key and value", function() {
        config.set("test", "value");
        return expect(atom.config.get("markdown-writer.test")).toEqual("value");
      });
    });
    describe(".get", function() {
      it("get value from default", function() {
        return expect(config.get("fileExtension")).toEqual(".markdown");
      });
      it("get value from engine config", function() {
        config.set("siteEngine", "jekyll");
        return expect(config.get("codeblock.before")).toEqual(config.getEngine("codeblock.before"));
      });
      it("get value from default if engine is invalid", function() {
        config.set("siteEngine", "not-exists");
        return expect(config.get("codeblock.before")).toEqual(config.getDefault("codeblock.before"));
      });
      it("get value from user config", function() {
        config.set("codeblock.before", "changed");
        return expect(config.get("codeblock.before")).toEqual("changed");
      });
      it("get value from user config even if the config is empty string", function() {
        config.set("codeblock.before", "");
        return expect(config.get("codeblock.before")).toEqual("");
      });
      it("get value from default config if the config is empty string but not allow blank", function() {
        config.set("codeblock.before", "");
        return expect(config.get("codeblock.before", {
          allow_blank: false
        })).toEqual(config.getDefault("codeblock.before"));
      });
      return it("get value from default config if user config is undefined", function() {
        config.set("codeblock.before", void 0);
        expect(config.get("codeblock.before")).toEqual(config.getDefault("codeblock.before"));
        config.set("codeblock.before", null);
        return expect(config.get("codeblock.before")).toEqual(config.getDefault("codeblock.before"));
      });
    });
    describe(".getFiletype", function() {
      var originalgetActiveTextEditor;
      originalgetActiveTextEditor = atom.workspace.getActiveTextEditor;
      afterEach(function() {
        return atom.workspace.getActiveTextEditor = originalgetActiveTextEditor;
      });
      it("get value from filestyle config", function() {
        atom.workspace.getActiveTextEditor = function() {
          return {
            getPath: function() {
              return null;
            },
            getGrammar: function() {
              return {
                scopeName: "source.asciidoc"
              };
            }
          };
        };
        expect(config.getFiletype("linkInlineTag")).not.toBeNull();
        return expect(config.getFiletype("siteEngine")).not.toBeDefined();
      });
      return it("get value from invalid filestyle config", function() {
        atom.workspace.getActiveTextEditor = function() {
          return {
            getPath: function() {
              return null;
            },
            getGrammar: function() {
              return {
                scopeName: null
              };
            }
          };
        };
        return expect(config.getEngine("siteEngine")).not.toBeDefined();
      });
    });
    describe(".getEngine", function() {
      it("get value from engine config", function() {
        config.set("siteEngine", "jekyll");
        expect(config.getEngine("codeblock.before")).not.toBeNull();
        return expect(config.getEngine("imageTag")).not.toBeDefined();
      });
      return it("get value from invalid engine config", function() {
        config.set("siteEngine", "not-exists");
        return expect(config.getEngine("imageTag")).not.toBeDefined();
      });
    });
    describe(".getProject", function() {
      var originalGetProjectConfigFile;
      originalGetProjectConfigFile = config.getProjectConfigFile;
      afterEach(function() {
        return config.getProjectConfigFile = originalGetProjectConfigFile;
      });
      it("get value when file found", function() {
        config.getProjectConfigFile = function() {
          return path.resolve(__dirname, "fixtures", "dummy.cson");
        };
        return expect(config.getProject("imageTag")).toEqual("imageTag");
      });
      it("get empty when file is empty", function() {
        config.getProjectConfigFile = function() {
          return path.resolve(__dirname, "fixtures", "empty.cson");
        };
        return expect(config.getProject("imageTag")).not.toBeDefined();
      });
      return it("get empty when file is not found", function() {
        config.getProjectConfigFile = function() {
          return path.resolve(__dirname, "fixtures", "notfound.cson");
        };
        return expect(config.getProject("imageTag")).not.toBeDefined();
      });
    });
    return describe(".getSampleConfigFile", function() {
      return it("get the config file path", function() {
        var configPath;
        configPath = path.join("lib", "config.cson");
        return expect(config.getSampleConfigFile()).toContain(configPath);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29uZmlnLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSOztFQUVULFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUE7SUFDakIsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQTtNQUNmLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsU0FBeEM7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLEdBQVAsQ0FBVyxNQUFYLENBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxTQUFuQztNQUY0QixDQUE5QjthQUlBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO1FBQ3RCLE1BQU0sQ0FBQyxHQUFQLENBQVcsTUFBWCxFQUFtQixPQUFuQjtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQVAsQ0FBK0MsQ0FBQyxPQUFoRCxDQUF3RCxPQUF4RDtNQUZzQixDQUF4QjtJQUxlLENBQWpCO0lBU0EsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQTtNQUNmLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBO2VBQzNCLE1BQUEsQ0FBTyxNQUFNLENBQUMsR0FBUCxDQUFXLGVBQVgsQ0FBUCxDQUFtQyxDQUFDLE9BQXBDLENBQTRDLFdBQTVDO01BRDJCLENBQTdCO01BR0EsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7UUFDakMsTUFBTSxDQUFDLEdBQVAsQ0FBVyxZQUFYLEVBQXlCLFFBQXpCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxHQUFQLENB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Q0FBcUMsQ0FBQyxPQUF0QyxDQUE4QyxVQUE5QztNQUY4QixDQUFoQztNQUlBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1FBQ2pDLE1BQU0sQ0FBQyxvQkFBUCxHQUE4QixTQUFBO2lCQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixVQUF4QixFQUFvQyxZQUFwQztRQUFIO2VBQzlCLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixVQUFsQixDQUFQLENBQXFDLENBQUMsR0FBRyxDQUFDLFdBQTFDLENBQUE7TUFGaUMsQ0FBbkM7YUFJQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtRQUNyQyxNQUFNLENBQUMsb0JBQVAsR0FBOEIsU0FBQTtpQkFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsVUFBeEIsRUFBb0MsZUFBcEM7UUFBSDtlQUM5QixNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsQ0FBUCxDQUFxQyxDQUFDLEdBQUcsQ0FBQyxXQUExQyxDQUFBO01BRnFDLENBQXZDO0lBWnNCLENBQXhCO1dBZ0JBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO2FBQy9CLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBO0FBQzdCLFlBQUE7UUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLEVBQWlCLGFBQWpCO2VBQ2IsTUFBQSxDQUFPLE1BQU0sQ0FBQyxtQkFBUCxDQUFBLENBQVAsQ0FBb0MsQ0FBQyxTQUFyQyxDQUErQyxVQUEvQztNQUY2QixDQUEvQjtJQUQrQixDQUFqQztFQTNGaUIsQ0FBbkI7QUFIQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5jb25maWcgPSByZXF1aXJlIFwiLi4vbGliL2NvbmZpZ1wiXG5cbmRlc2NyaWJlIFwiY29uZmlnXCIsIC0+XG4gIGRlc2NyaWJlIFwiLnNldFwiLCAtPlxuICAgIGl0IFwiZ2V0IHVzZXIgbW9kaWZpZWQgdmFsdWVcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci50ZXN0XCIsIFwic3BlY2lhbFwiKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJ0ZXN0XCIpKS50b0VxdWFsKFwic3BlY2lhbFwiKVxuXG4gICAgaXQgXCJzZXQga2V5IGFuZCB2YWx1ZVwiLCAtPlxuICAgICAgY29uZmlnLnNldChcInRlc3RcIiwgXCJ2YWx1ZVwiKVxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldChcIm1hcmtkb3duLXdyaXRlci50ZXN0XCIpKS50b0VxdWFsKFwidmFsdWVcIilcblxuICBkZXNjcmliZSBcIi5nZXRcIiwgLT5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGRlZmF1bHRcIiwgLT5cbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwiZmlsZUV4dGVuc2lvblwiKSkudG9FcXVhbChcIi5tYXJrZG93blwiKVxuXG4gICAgaXQgXCJnZXQgdmFsdWUgZnJvbSBlbmdpbmUgY29uZmlnXCIsIC0+XG4gICAgICBjb25maWcuc2V0KFwic2l0ZUVuZ2luZVwiLCBcImpla3lsbFwiKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKVxuICAgICAgICAudG9FcXVhbChjb25maWcuZ2V0RW5naW5lKFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcblxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gZGVmYXVsdCBpZiBlbmdpbmUgaXMgaW52YWxpZFwiLCAtPlxuICAgICAgY29uZmlnLnNldChcInNpdGVFbmdpbmVcIiwgXCJub3QtZXhpc3RzXCIpXG4gICAgICBleHBlY3QoY29uZmlnLmdldChcImNvZGVibG9jay5iZWZvcmVcIikpXG4gICAgICAgIC50b0VxdWFsKGNvbmZpZy5nZXREZWZhdWx0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcblxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gdXNlciBjb25maWdcIiwgLT5cbiAgICAgIGNvbmZpZy5zZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIsIFwiY2hhbmdlZFwiKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKS50b0VxdWFsKFwiY2hhbmdlZFwiKVxuXG4gICAgaXQgXCJnZXQgdmFsdWUgZnJvbSB1c2VyIGNvbmZpZyBldmVuIGlmIHRoZSBjb25maWcgaXMgZW1wdHkgc3RyaW5nXCIsIC0+XG4gICAgICBjb25maWcuc2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiLCBcIlwiKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKS50b0VxdWFsKFwiXCIpXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGRlZmF1bHQgY29uZmlnIGlmIHRoZSBjb25maWcgaXMgZW1wdHkgc3RyaW5nIGJ1dCBub3QgYWxsb3cgYmxhbmtcIiwgLT5cbiAgICAgIGNvbmZpZy5zZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIsIFwiXCIpXG4gICAgICBleHBlY3QoY29uZmlnLmdldChcImNvZGVibG9jay5iZWZvcmVcIiwgYWxsb3dfYmxhbms6IGZhbHNlKSlcbiAgICAgICAgLnRvRXF1YWwoY29uZmlnLmdldERlZmF1bHQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKVxuXG4gICAgaXQgXCJnZXQgdmFsdWUgZnJvbSBkZWZhdWx0IGNvbmZpZyBpZiB1c2VyIGNvbmZpZyBpcyB1bmRlZmluZWRcIiwgLT5cbiAgICAgIGNvbmZpZy5zZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIsIHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcbiAgICAgICAgLnRvRXF1YWwoY29uZmlnLmdldERlZmF1bHQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKVxuXG4gICAgICBjb25maWcuc2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiLCBudWxsKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKVxuICAgICAgICAudG9FcXVhbChjb25maWcuZ2V0RGVmYXVsdChcImNvZGVibG9jay5iZWZvcmVcIikpXG5cbiAgZGVzY3JpYmUgXCIuZ2V0RmlsZXR5cGVcIiwgLT5cbiAgICBvcmlnaW5hbGdldEFjdGl2ZVRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yXG4gICAgYWZ0ZXJFYWNoIC0+IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IgPSBvcmlnaW5hbGdldEFjdGl2ZVRleHRFZGl0b3JcblxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gZmlsZXN0eWxlIGNvbmZpZ1wiLCAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvciA9IC0+XG4gICAgICAgIGdldFBhdGg6IC0+IG51bGxcbiAgICAgICAgZ2V0R3JhbW1hcjogLT4geyBzY29wZU5hbWU6IFwic291cmNlLmFzY2lpZG9jXCIgfVxuXG4gICAgICBleHBlY3QoY29uZmlnLmdldEZpbGV0eXBlKFwibGlua0lubGluZVRhZ1wiKSkubm90LnRvQmVOdWxsKClcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0RmlsZXR5cGUoXCJzaXRlRW5naW5lXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgaXQgXCJnZXQgdmFsdWUgZnJvbSBpbnZhbGlkIGZpbGVzdHlsZSBjb25maWdcIiwgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IgPSAtPlxuICAgICAgICBnZXRQYXRoOiAtPiBudWxsXG4gICAgICAgIGdldEdyYW1tYXI6IC0+IHsgc2NvcGVOYW1lOiBudWxsIH1cblxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXRFbmdpbmUoXCJzaXRlRW5naW5lXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlIFwiLmdldEVuZ2luZVwiLCAtPlxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gZW5naW5lIGNvbmZpZ1wiLCAtPlxuICAgICAgY29uZmlnLnNldChcInNpdGVFbmdpbmVcIiwgXCJqZWt5bGxcIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0RW5naW5lKFwiY29kZWJsb2NrLmJlZm9yZVwiKSkubm90LnRvQmVOdWxsKClcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0RW5naW5lKFwiaW1hZ2VUYWdcIikpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGludmFsaWQgZW5naW5lIGNvbmZpZ1wiLCAtPlxuICAgICAgY29uZmlnLnNldChcInNpdGVFbmdpbmVcIiwgXCJub3QtZXhpc3RzXCIpXG4gICAgICBleHBlY3QoY29uZmlnLmdldEVuZ2luZShcImltYWdlVGFnXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlIFwiLmdldFByb2plY3RcIiwgLT5cbiAgICBvcmlnaW5hbEdldFByb2plY3RDb25maWdGaWxlID0gY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlXG4gICAgYWZ0ZXJFYWNoIC0+IGNvbmZpZy5nZXRQcm9qZWN0Q29uZmlnRmlsZSA9IG9yaWdpbmFsR2V0UHJvamVjdENvbmZpZ0ZpbGVcblxuICAgIGl0IFwiZ2V0IHZhbHVlIHdoZW4gZmlsZSBmb3VuZFwiLCAtPlxuICAgICAgY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlID0gLT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmaXh0dXJlc1wiLCBcImR1bW15LmNzb25cIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0UHJvamVjdChcImltYWdlVGFnXCIpKS50b0VxdWFsKFwiaW1hZ2VUYWdcIilcblxuICAgIGl0IFwiZ2V0IGVtcHR5IHdoZW4gZmlsZSBpcyBlbXB0eVwiLCAtPlxuICAgICAgY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlID0gLT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmaXh0dXJlc1wiLCBcImVtcHR5LmNzb25cIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0UHJvamVjdChcImltYWdlVGFnXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgaXQgXCJnZXQgZW1wdHkgd2hlbiBmaWxlIGlzIG5vdCBmb3VuZFwiLCAtPlxuICAgICAgY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlID0gLT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmaXh0dXJlc1wiLCBcIm5vdGZvdW5kLmNzb25cIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0UHJvamVjdChcImltYWdlVGFnXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlIFwiLmdldFNhbXBsZUNvbmZpZ0ZpbGVcIiwgLT5cbiAgICBpdCBcImdldCB0aGUgY29uZmlnIGZpbGUgcGF0aFwiLCAtPlxuICAgICAgY29uZmlnUGF0aCA9IHBhdGguam9pbihcImxpYlwiLCBcImNvbmZpZy5jc29uXCIpXG4gICAgICBleHBlY3QoY29uZmlnLmdldFNhbXBsZUNvbmZpZ0ZpbGUoKSkudG9Db250YWluKGNvbmZpZ1BhdGgpXG4iXX0=
