(function() {
  var $, CompositeDisposable, NewFileView, TextEditorView, View, config, fs, path, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  module.exports = NewFileView = (function(superClass) {
    extend(NewFileView, superClass);

    function NewFileView() {
      return NewFileView.__super__.constructor.apply(this, arguments);
    }

    NewFileView.fileType = "File";

    NewFileView.pathConfig = "siteFilesDir";

    NewFileView.fileNameConfig = "newFileFileName";

    NewFileView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New " + _this.fileType, {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
            var f, i, len, ref1, results;
            _this.label("Directory", {
              "class": "message"
            });
            _this.subview("pathEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Date", {
              "class": "message"
            });
            _this.subview("dateEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            ref1 = _this.getCustomFields();
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              f = ref1[i];
              _this.label(f["name"], {
                "class": "message"
              });
              results.push(_this.subview(f["editor"], new TextEditorView({
                mini: true
              })));
            }
            return results;
          });
          _this.p({
            "class": "message",
            outlet: "message"
          });
          return _this.p({
            "class": "error",
            outlet: "error"
          });
        };
      })(this));
    };

    NewFileView.getCustomFields = function() {
      var field, ref1, results, value;
      ref1 = config.get("frontMatterCustomFields") || {};
      results = [];
      for (field in ref1) {
        value = ref1[field];
        results.push({
          id: utils.slugize(field),
          editor: (utils.slugize(field)) + "CustomEditor",
          name: utils.capitalize(field),
          value: value
        });
      }
      return results;
    };

    NewFileView.prototype.initialize = function() {
      var editors, f, i, len, ref1;
      editors = [this.titleEditor, this.pathEditor, this.dateEditor];
      ref1 = this.constructor.getCustomFields();
      for (i = 0, len = ref1.length; i < len; i++) {
        f = ref1[i];
        editors.push(this[f["editor"]]);
      }
      utils.setTabIndex(editors);
      this.dateTime = templateHelper.getDateTime();
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.pathEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.dateEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.pathEditor.setText(templateHelper.create(_this.constructor.pathConfig, _this.getDateTime()));
        };
      })(this));
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.createFile();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    NewFileView.prototype.display = function() {
      var f, i, len, ref1;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(templateHelper.getFrontMatterDate(this.dateTime));
      this.pathEditor.setText(templateHelper.create(this.constructor.pathConfig, this.dateTime));
      ref1 = this.constructor.getCustomFields();
      for (i = 0, len = ref1.length; i < len; i++) {
        f = ref1[i];
        if (!!f["value"]) {
          this[f["editor"]].setText(f["value"]);
        }
      }
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewFileView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return NewFileView.__super__.detach.apply(this, arguments);
    };

    NewFileView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    NewFileView.prototype.createFile = function() {
      var error, filePath, frontMatterText;
      try {
        filePath = path.join(this.getFileDir(), this.getFilePath());
        if (fs.existsSync(filePath)) {
          return this.error.text("File " + filePath + " already exists!");
        } else {
          frontMatterText = templateHelper.create("frontMatter", this.getFrontMatter(), this.getDateTime());
          fs.writeFileSync(filePath, frontMatterText);
          atom.workspace.open(filePath);
          return this.detach();
        }
      } catch (error1) {
        error = error1;
        return this.error.text("" + error.message);
      }
    };

    NewFileView.prototype.updatePath = function() {
      return this.message.html("<b>Site Directory:</b> " + (this.getFileDir()) + "<br/>\n<b>Create " + this.constructor.fileType + " At:</b> " + (this.getFilePath()));
    };

    NewFileView.prototype.getLayout = function() {
      return "post";
    };

    NewFileView.prototype.getPublished = function() {
      return this.constructor.fileType === "Post";
    };

    NewFileView.prototype.getTitle = function() {
      return this.titleEditor.getText() || ("New " + this.constructor.fileType);
    };

    NewFileView.prototype.getSlug = function() {
      return utils.slugize(this.getTitle(), config.get('slugSeparator'));
    };

    NewFileView.prototype.getDate = function() {
      return templateHelper.getFrontMatterDate(this.getDateTime());
    };

    NewFileView.prototype.getExtension = function() {
      return config.get("fileExtension");
    };

    NewFileView.prototype.getFileDir = function() {
      var filePath, ref1;
      filePath = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      return utils.getSitePath(config.get("siteLocalDir"), filePath);
    };

    NewFileView.prototype.getFilePath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewFileView.prototype.getFileName = function() {
      return templateHelper.create(this.constructor.fileNameConfig, this.getFrontMatter(), this.getDateTime());
    };

    NewFileView.prototype.getDateTime = function() {
      return templateHelper.parseFrontMatterDate(this.dateEditor.getText()) || this.dateTime;
    };

    NewFileView.prototype.getFrontMatter = function() {
      var base, f, i, len, ref1;
      base = templateHelper.getFrontMatter(this);
      ref1 = this.constructor.getCustomFields();
      for (i = 0, len = ref1.length; i < len; i++) {
        f = ref1[i];
        base[f["id"]] = this[f["editor"]].getText();
      }
      return base;
    };

    return NewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9uZXctZmlsZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdUdBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksZUFBSixFQUFVOztFQUNWLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUwsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFDUixjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLFdBQUMsQ0FBQSxRQUFELEdBQVk7O0lBQ1osV0FBQyxDQUFBLFVBQUQsR0FBYzs7SUFDZCxXQUFDLENBQUEsY0FBRCxHQUFrQjs7SUFFbEIsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8saUJBQVA7T0FBTCxFQUErQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDN0IsS0FBQyxDQUFBLEtBQUQsQ0FBTyxVQUFBLEdBQVcsS0FBQyxDQUFBLFFBQW5CLEVBQStCO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvQkFBUDtXQUEvQjtVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtBQUNILGdCQUFBO1lBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxXQUFQLEVBQW9CO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO2FBQXBCO1lBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVC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VixFQUFpQyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQWpDO0lBQUg7OzBCQUViLFdBQUEsR0FBYSxTQUFBO2FBQUcsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUFuQyxFQUFtRCxJQUFDLENBQUEsY0FBRCxDQUFBLENBQW5ELEVBQXNFLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBdEU7SUFBSDs7MEJBQ2IsV0FBQSxHQUFhLFNBQUE7YUFBRyxjQUFjLENBQUMsb0JBQWYsQ0FBb0MsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBcEMsQ0FBQSxJQUE4RCxJQUFDLENBQUE7SUFBbEU7OzBCQUNiLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxJQUFBLEdBQU8sY0FBYyxDQUFDLGNBQWYsQ0FBOEIsSUFBOUI7QUFFUDtBQUFBLFdBQUEsc0NBQUE7O1FBQUEsSUFBSyxDQUFBLENBQUUsQ0FBQSxJQUFBLENBQUYsQ0FBTCxHQUFnQixJQUFFLENBQUEsQ0FBRSxDQUFBLFFBQUEsQ0FBRixDQUFZLENBQUMsT0FBZixDQUFBO0FBQWhCO2FBQ0E7SUFKYzs7OztLQTVHUTtBQVYxQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5mcyA9IHJlcXVpcmUgXCJmcy1wbHVzXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG50ZW1wbGF0ZUhlbHBlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL3RlbXBsYXRlLWhlbHBlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE5ld0ZpbGVWaWV3IGV4dGVuZHMgVmlld1xuICBAZmlsZVR5cGUgPSBcIkZpbGVcIiAjIG92ZXJyaWRlXG4gIEBwYXRoQ29uZmlnID0gXCJzaXRlRmlsZXNEaXJcIiAjIG92ZXJyaWRlXG4gIEBmaWxlTmFtZUNvbmZpZyA9IFwibmV3RmlsZUZpbGVOYW1lXCIgIyBvdmVycmlkZVxuXG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyXCIsID0+XG4gICAgICBAbGFiZWwgXCJBZGQgTmV3ICN7QGZpbGVUeXBlfVwiLCBjbGFzczogXCJpY29uIGljb24tZmlsZS1hZGRcIlxuICAgICAgQGRpdiA9PlxuICAgICAgICBAbGFiZWwgXCJEaXJlY3RvcnlcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwicGF0aEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGxhYmVsIFwiRGF0ZVwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgQHN1YnZpZXcgXCJkYXRlRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgICBAbGFiZWwgXCJUaXRsZVwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgQHN1YnZpZXcgXCJ0aXRsZUVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgIyByZW5kZXIgY3VzdG9tIGZpZWxkc1xuICAgICAgICBmb3IgZiBpbiBAZ2V0Q3VzdG9tRmllbGRzKClcbiAgICAgICAgICBAbGFiZWwgZltcIm5hbWVcIl0sIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICAgIEBzdWJ2aWV3IGZbXCJlZGl0b3JcIl0sIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuXG4gICAgICBAcCBjbGFzczogXCJtZXNzYWdlXCIsIG91dGxldDogXCJtZXNzYWdlXCJcbiAgICAgIEBwIGNsYXNzOiBcImVycm9yXCIsIG91dGxldDogXCJlcnJvclwiXG5cbiAgIyBjdXN0b20gZmllbGRzXG4gIEBnZXRDdXN0b21GaWVsZHM6IC0+XG4gICAgZm9yIGZpZWxkLCB2YWx1ZSBvZiBjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJDdXN0b21GaWVsZHNcIikgfHwge31cbiAgICAgIGlkOiB1dGlscy5zbHVnaXplKGZpZWxkKVxuICAgICAgZWRpdG9yOiBcIiN7dXRpbHMuc2x1Z2l6ZShmaWVsZCl9Q3VzdG9tRWRpdG9yXCJcbiAgICAgIG5hbWU6IHV0aWxzLmNhcGl0YWxpemUoZmllbGQpXG4gICAgICB2YWx1ZTogdmFsdWVcblxuICBpbml0aWFsaXplOiAtPlxuICAgIGVkaXRvcnMgPSBbQHRpdGxlRWRpdG9yLCBAcGF0aEVkaXRvciwgQGRhdGVFZGl0b3JdXG4gICAgZWRpdG9ycy5wdXNoKEBbZltcImVkaXRvclwiXV0pIGZvciBmIGluIEBjb25zdHJ1Y3Rvci5nZXRDdXN0b21GaWVsZHMoKVxuICAgICMgc2V0IHRhYiBvcmRlcnNcbiAgICB1dGlscy5zZXRUYWJJbmRleChlZGl0b3JzKVxuXG4gICAgIyBzYXZlIGN1cnJlbnQgZGF0ZSB0aW1lIGFzIGJhc2VcbiAgICBAZGF0ZVRpbWUgPSB0ZW1wbGF0ZUhlbHBlci5nZXREYXRlVGltZSgpXG5cbiAgICBAdGl0bGVFZGl0b3IuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSA9PiBAdXBkYXRlUGF0aCgpXG4gICAgQHBhdGhFZGl0b3IuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSA9PiBAdXBkYXRlUGF0aCgpXG4gICAgIyB1cGRhdGUgcGF0aEVkaXRvciB0byByZWZsZWN0IGRhdGUgY2hhbmdlcywgaG93ZXZlciB0aGlzIHdpbGwgb3ZlcndyaXRlIHVzZXIgY2hhbmdlc1xuICAgIEBkYXRlRWRpdG9yLmdldE1vZGVsKCkub25EaWRDaGFuZ2UgPT5cbiAgICAgIEBwYXRoRWRpdG9yLnNldFRleHQodGVtcGxhdGVIZWxwZXIuY3JlYXRlKEBjb25zdHJ1Y3Rvci5wYXRoQ29uZmlnLCBAZ2V0RGF0ZVRpbWUoKSkpXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgIEBlbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ID0+IEBjcmVhdGVGaWxlKClcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIGRpc3BsYXk6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2UpXG4gICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9ICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICBAZGF0ZUVkaXRvci5zZXRUZXh0KHRlbXBsYXRlSGVscGVyLmdldEZyb250TWF0dGVyRGF0ZShAZGF0ZVRpbWUpKVxuICAgIEBwYXRoRWRpdG9yLnNldFRleHQodGVtcGxhdGVIZWxwZXIuY3JlYXRlKEBjb25zdHJ1Y3Rvci5wYXRoQ29uZmlnLCBAZGF0ZVRpbWUpKVxuICAgIEBbZltcImVkaXRvclwiXV0uc2V0VGV4dChmW1widmFsdWVcIl0pIGZvciBmIGluIEBjb25zdHJ1Y3Rvci5nZXRDdXN0b21GaWVsZHMoKSB3aGVuICEhZltcInZhbHVlXCJdXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEB0aXRsZUVkaXRvci5mb2N1cygpXG5cbiAgZGV0YWNoOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uZm9jdXMoKVxuICAgIHN1cGVyXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG5cbiAgY3JlYXRlRmlsZTogLT5cbiAgICB0cnlcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKEBnZXRGaWxlRGlyKCksIEBnZXRGaWxlUGF0aCgpKVxuXG4gICAgICBpZiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKVxuICAgICAgICBAZXJyb3IudGV4dChcIkZpbGUgI3tmaWxlUGF0aH0gYWxyZWFkeSBleGlzdHMhXCIpXG4gICAgICBlbHNlXG4gICAgICAgIGZyb250TWF0dGVyVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcImZyb250TWF0dGVyXCIsIEBnZXRGcm9udE1hdHRlcigpLCBAZ2V0RGF0ZVRpbWUoKSlcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgZnJvbnRNYXR0ZXJUZXh0KVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKVxuICAgICAgICBAZGV0YWNoKClcbiAgICBjYXRjaCBlcnJvclxuICAgICAgQGVycm9yLnRleHQoXCIje2Vycm9yLm1lc3NhZ2V9XCIpXG5cbiAgdXBkYXRlUGF0aDogLT5cbiAgICBAbWVzc2FnZS5odG1sIFwiXCJcIlxuICAgIDxiPlNpdGUgRGlyZWN0b3J5OjwvYj4gI3tAZ2V0RmlsZURpcigpfTxici8+XG4gICAgPGI+Q3JlYXRlICN7QGNvbnN0cnVjdG9yLmZpbGVUeXBlfSBBdDo8L2I+ICN7QGdldEZpbGVQYXRoKCl9XG4gICAgXCJcIlwiXG5cbiAgIyBjb21tb24gaW50ZXJmYWNlIGZvciBGcm9udE1hdHRlclxuICBnZXRMYXlvdXQ6IC0+IFwicG9zdFwiXG4gIGdldFB1Ymxpc2hlZDogLT4gQGNvbnN0cnVjdG9yLmZpbGVUeXBlID09IFwiUG9zdFwiXG4gIGdldFRpdGxlOiAtPiBAdGl0bGVFZGl0b3IuZ2V0VGV4dCgpIHx8IFwiTmV3ICN7QGNvbnN0cnVjdG9yLmZpbGVUeXBlfVwiXG4gIGdldFNsdWc6IC0+IHV0aWxzLnNsdWdpemUoQGdldFRpdGxlKCksIGNvbmZpZy5nZXQoJ3NsdWdTZXBhcmF0b3InKSlcbiAgZ2V0RGF0ZTogLT4gdGVtcGxhdGVIZWxwZXIuZ2V0RnJvbnRNYXR0ZXJEYXRlKEBnZXREYXRlVGltZSgpKVxuICBnZXRFeHRlbnNpb246IC0+IGNvbmZpZy5nZXQoXCJmaWxlRXh0ZW5zaW9uXCIpXG5cbiAgIyBuZXcgZmlsZSBhbmQgZnJvbnQgbWF0dGVyc1xuICBnZXRGaWxlRGlyOiAtPlxuICAgIGZpbGVQYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkgIyBOdWxsYWJsZVxuICAgIHV0aWxzLmdldFNpdGVQYXRoKGNvbmZpZy5nZXQoXCJzaXRlTG9jYWxEaXJcIiksIGZpbGVQYXRoKVxuICBnZXRGaWxlUGF0aDogLT4gcGF0aC5qb2luKEBwYXRoRWRpdG9yLmdldFRleHQoKSwgQGdldEZpbGVOYW1lKCkpXG5cbiAgZ2V0RmlsZU5hbWU6IC0+IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShAY29uc3RydWN0b3IuZmlsZU5hbWVDb25maWcsIEBnZXRGcm9udE1hdHRlcigpLCBAZ2V0RGF0ZVRpbWUoKSlcbiAgZ2V0RGF0ZVRpbWU6IC0+IHRlbXBsYXRlSGVscGVyLnBhcnNlRnJvbnRNYXR0ZXJEYXRlKEBkYXRlRWRpdG9yLmdldFRleHQoKSkgfHwgQGRhdGVUaW1lXG4gIGdldEZyb250TWF0dGVyOiAtPlxuICAgIGJhc2UgPSB0ZW1wbGF0ZUhlbHBlci5nZXRGcm9udE1hdHRlcih0aGlzKVxuICAgICMgYWRkIGN1c3RvbSBmaWVsZHMgdG8gZnJvbnRNYXR0ZXJcbiAgICBiYXNlW2ZbXCJpZFwiXV0gPSBAW2ZbXCJlZGl0b3JcIl1dLmdldFRleHQoKSBmb3IgZiBpbiBAY29uc3RydWN0b3IuZ2V0Q3VzdG9tRmllbGRzKClcbiAgICBiYXNlXG4iXX0=
