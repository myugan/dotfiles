(function() {
  var $, CompositeDisposable, FrontMatter, ManageFrontMatterView, TextEditorView, View, config, ref, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = ManageFrontMatterView = (function(superClass) {
    extend(ManageFrontMatterView, superClass);

    function ManageFrontMatterView() {
      return ManageFrontMatterView.__super__.constructor.apply(this, arguments);
    }

    ManageFrontMatterView.labelName = "Manage Field";

    ManageFrontMatterView.fieldName = "fieldName";

    ManageFrontMatterView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label(_this.labelName, {
            "class": "icon icon-book"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("fieldEditor", new TextEditorView({
            mini: true
          }));
          return _this.ul({
            "class": "candidates",
            outlet: "candidates"
          }, function() {
            return _this.li("Loading...");
          });
        };
      })(this));
    };

    ManageFrontMatterView.prototype.initialize = function() {
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendFieldItem(e);
        };
      })(this));
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.saveFrontMatter();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    ManageFrontMatterView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.fetchSiteFieldCandidates();
      this.frontMatter = new FrontMatter(this.editor);
      if (this.frontMatter.parseError) {
        return this.detach();
      }
      this.setEditorFieldItems(this.frontMatter.getArray(this.constructor.fieldName));
      this.panel.show();
      return this.fieldEditor.focus();
    };

    ManageFrontMatterView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return ManageFrontMatterView.__super__.detach.apply(this, arguments);
    };

    ManageFrontMatterView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    ManageFrontMatterView.prototype.saveFrontMatter = function() {
      this.frontMatter.set(this.constructor.fieldName, this.getEditorFieldItems());
      this.frontMatter.save();
      return this.detach();
    };

    ManageFrontMatterView.prototype.setEditorFieldItems = function(fieldItems) {
      return this.fieldEditor.setText(fieldItems.join(","));
    };

    ManageFrontMatterView.prototype.getEditorFieldItems = function() {
      return this.fieldEditor.getText().split(/\s*,\s*/).filter(function(c) {
        return !!c.trim();
      });
    };

    ManageFrontMatterView.prototype.fetchSiteFieldCandidates = function() {};

    ManageFrontMatterView.prototype.displaySiteFieldItems = function(siteFieldItems) {
      var fieldItems, tagElems;
      fieldItems = this.frontMatter.getArray(this.constructor.fieldName) || [];
      tagElems = siteFieldItems.map(function(tag) {
        if (fieldItems.indexOf(tag) < 0) {
          return "<li>" + tag + "</li>";
        } else {
          return "<li class='selected'>" + tag + "</li>";
        }
      });
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManageFrontMatterView.prototype.appendFieldItem = function(e) {
      var fieldItem, fieldItems, idx;
      fieldItem = e.target.textContent;
      fieldItems = this.getEditorFieldItems();
      idx = fieldItems.indexOf(fieldItem);
      if (idx < 0) {
        fieldItems.push(fieldItem);
        e.target.classList.add("selected");
      } else {
        fieldItems.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorFieldItems(fieldItems);
      return this.fieldEditor.focus();
    };

    return ManageFrontMatterView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9tYW5hZ2UtZnJvbnQtbWF0dGVyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvR0FBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxlQUFKLEVBQVU7O0VBRVYsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFDUixXQUFBLEdBQWMsT0FBQSxDQUFRLHlCQUFSOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixxQkFBQyxDQUFBLFNBQUQsR0FBWTs7SUFDWixxQkFBQyxDQUFBLFNBQUQsR0FBWTs7SUFFWixxQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sMkNBQVA7T0FBTCxFQUF5RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDdkQsS0FBQyxDQUFBLEtBQUQsQ0FBTyxLQUFDLENBQUEsU0FBUixFQUFtQjtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7V0FBbkI7VUFDQSxLQUFDLENBQUEsQ0FBRCxDQUFHO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1lBQWdCLE1BQUEsRUFBUSxPQUF4QjtXQUFIO1VBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLElBQUksY0FBSixDQUFtQjtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQW5CLENBQXhCO2lCQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7WUFBcUIsTUFBQSxFQUFR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bkIsQ0FBMEIsVUFBMUIsRUFMRjs7TUFNQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsVUFBckI7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQTtJQVhlOzs7O0tBbkVpQjtBQVJwQyIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5Gcm9udE1hdHRlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL2Zyb250LW1hdHRlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1hbmFnZUZyb250TWF0dGVyVmlldyBleHRlbmRzIFZpZXdcbiAgQGxhYmVsTmFtZTogXCJNYW5hZ2UgRmllbGRcIiAjIG92ZXJyaWRlXG4gIEBmaWVsZE5hbWU6IFwiZmllbGROYW1lXCIgIyBvdmVycmlkZVxuXG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyIG1hcmtkb3duLXdyaXRlci1zZWxlY3Rpb25cIiwgPT5cbiAgICAgIEBsYWJlbCBAbGFiZWxOYW1lLCBjbGFzczogXCJpY29uIGljb24tYm9va1wiXG4gICAgICBAcCBjbGFzczogXCJlcnJvclwiLCBvdXRsZXQ6IFwiZXJyb3JcIlxuICAgICAgQHN1YnZpZXcgXCJmaWVsZEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgIEB1bCBjbGFzczogXCJjYW5kaWRhdGVzXCIsIG91dGxldDogXCJjYW5kaWRhdGVzXCIsID0+XG4gICAgICAgIEBsaSBcIkxvYWRpbmcuLi5cIlxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGNhbmRpZGF0ZXMub24gXCJjbGlja1wiLCBcImxpXCIsIChlKSA9PiBAYXBwZW5kRmllbGRJdGVtKGUpXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgIEBlbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ID0+IEBzYXZlRnJvbnRNYXR0ZXIoKVxuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIGRpc3BsYXk6IC0+XG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG5cbiAgICBAZmV0Y2hTaXRlRmllbGRDYW5kaWRhdGVzKClcbiAgICBAZnJvbnRNYXR0ZXIgPSBuZXcgRnJvbnRNYXR0ZXIoQGVkaXRvcilcbiAgICByZXR1cm4gQGRldGFjaCgpIGlmIEBmcm9udE1hdHRlci5wYXJzZUVycm9yXG4gICAgQHNldEVkaXRvckZpZWxkSXRlbXMoQGZyb250TWF0dGVyLmdldEFycmF5KEBjb25zdHJ1Y3Rvci5maWVsZE5hbWUpKVxuXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBmaWVsZEVkaXRvci5mb2N1cygpXG5cbiAgZGV0YWNoOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uZm9jdXMoKVxuICAgIHN1cGVyXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG5cbiAgc2F2ZUZyb250TWF0dGVyOiAtPlxuICAgIEBmcm9udE1hdHRlci5zZXQoQGNvbnN0cnVjdG9yLmZpZWxkTmFtZSwgQGdldEVkaXRvckZpZWxkSXRlbXMoKSlcbiAgICBAZnJvbnRNYXR0ZXIuc2F2ZSgpXG4gICAgQGRldGFjaCgpXG5cbiAgc2V0RWRpdG9yRmllbGRJdGVtczogKGZpZWxkSXRlbXMpIC0+XG4gICAgQGZpZWxkRWRpdG9yLnNldFRleHQoZmllbGRJdGVtcy5qb2luKFwiLFwiKSlcblxuICBnZXRFZGl0b3JGaWVsZEl0ZW1zOiAtPlxuICAgIEBmaWVsZEVkaXRvci5nZXRUZXh0KCkuc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcigoYykgLT4gISFjLnRyaW0oKSlcblxuICBmZXRjaFNpdGVGaWVsZENhbmRpZGF0ZXM6IC0+ICMgb3ZlcnJpZGVcblxuICBkaXNwbGF5U2l0ZUZpZWxkSXRlbXM6IChzaXRlRmllbGRJdGVtcykgLT5cbiAgICBmaWVsZEl0ZW1zID0gQGZyb250TWF0dGVyLmdldEFycmF5KEBjb25zdHJ1Y3Rvci5maWVsZE5hbWUpIHx8IFtdXG4gICAgdGFnRWxlbXMgPSBzaXRlRmllbGRJdGVtcy5tYXAgKHRhZykgLT5cbiAgICAgIGlmIGZpZWxkSXRlbXMuaW5kZXhPZih0YWcpIDwgMFxuICAgICAgICBcIjxsaT4je3RhZ308L2xpPlwiXG4gICAgICBlbHNlXG4gICAgICAgIFwiPGxpIGNsYXNzPSdzZWxlY3RlZCc+I3t0YWd9PC9saT5cIlxuICAgIEBjYW5kaWRhdGVzLmVtcHR5KCkuYXBwZW5kKHRhZ0VsZW1zLmpvaW4oXCJcIikpXG5cbiAgYXBwZW5kRmllbGRJdGVtOiAoZSkgLT5cbiAgICBmaWVsZEl0ZW0gPSBlLnRhcmdldC50ZXh0Q29udGVudFxuICAgIGZpZWxkSXRlbXMgPSBAZ2V0RWRpdG9yRmllbGRJdGVtcygpXG4gICAgaWR4ID0gZmllbGRJdGVtcy5pbmRleE9mKGZpZWxkSXRlbSlcbiAgICBpZiBpZHggPCAwXG4gICAgICBmaWVsZEl0ZW1zLnB1c2goZmllbGRJdGVtKVxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpXG4gICAgZWxzZVxuICAgICAgZmllbGRJdGVtcy5zcGxpY2UoaWR4LCAxKVxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpXG4gICAgQHNldEVkaXRvckZpZWxkSXRlbXMoZmllbGRJdGVtcylcbiAgICBAZmllbGRFZGl0b3IuZm9jdXMoKVxuIl19
