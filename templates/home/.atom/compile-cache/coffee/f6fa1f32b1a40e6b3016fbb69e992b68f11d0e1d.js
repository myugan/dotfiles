(function() {
  var $, CompositeDisposable, InsertFootnoteView, TextEditorView, View, config, guid, helper, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  guid = require("guid");

  config = require("../config");

  utils = require("../utils");

  helper = require("../helpers/insert-link-helper");

  templateHelper = require("../helpers/template-helper");

  module.exports = InsertFootnoteView = (function(superClass) {
    extend(InsertFootnoteView, superClass);

    function InsertFootnoteView() {
      return InsertFootnoteView.__super__.constructor.apply(this, arguments);
    }

    InsertFootnoteView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Footnote", {
            "class": "icon icon-pin"
          });
          _this.div(function() {
            _this.label("Label", {
              "class": "message"
            });
            return _this.subview("labelEditor", new TextEditorView({
              mini: true
            }));
          });
          return _this.div({
            outlet: "contentBox"
          }, function() {
            _this.label("Content", {
              "class": "message"
            });
            return _this.subview("contentEditor", new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    InsertFootnoteView.prototype.initialize = function() {
      utils.setTabIndex([this.labelEditor, this.contentEditor]);
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    InsertFootnoteView.prototype.onConfirm = function() {
      var footnote;
      footnote = {
        label: this.labelEditor.getText(),
        content: this.contentEditor.getText()
      };
      this.editor.transact((function(_this) {
        return function() {
          if (_this.footnote) {
            return _this.updateFootnote(footnote);
          } else {
            return _this.insertFootnote(footnote);
          }
        };
      })(this));
      return this.detach();
    };

    InsertFootnoteView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this._normalizeSelectionAndSetFootnote();
      this.panel.show();
      this.labelEditor.getModel().selectAll();
      return this.labelEditor.focus();
    };

    InsertFootnoteView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertFootnoteView.__super__.detach.apply(this, arguments);
    };

    InsertFootnoteView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertFootnoteView.prototype._normalizeSelectionAndSetFootnote = function() {
      this.range = utils.getTextBufferRange(this.editor, "link", {
        selectBy: "nope"
      });
      this.selection = this.editor.getTextInRange(this.range) || "";
      if (utils.isFootnote(this.selection)) {
        this.footnote = utils.parseFootnote(this.selection);
        this.contentBox.hide();
        return this.labelEditor.setText(this.footnote["label"]);
      } else {
        return this.labelEditor.setText(guid.raw().slice(0, 8));
      }
    };

    InsertFootnoteView.prototype.updateFootnote = function(footnote) {
      var definitionText, findText, referenceText, replaceText, updateText;
      referenceText = templateHelper.create("footnoteReferenceTag", footnote);
      definitionText = templateHelper.create("footnoteDefinitionTag", footnote).trim();
      if (this.footnote["isDefinition"]) {
        updateText = definitionText;
        findText = templateHelper.create("footnoteReferenceTag", this.footnote).trim();
        replaceText = referenceText;
      } else {
        updateText = referenceText;
        findText = templateHelper.create("footnoteDefinitionTag", this.footnote).trim();
        replaceText = definitionText;
      }
      this.editor.setTextInBufferRange(this.range, updateText);
      return this.editor.buffer.scan(RegExp("" + (utils.escapeRegExp(findText))), function(match) {
        match.replace(replaceText);
        return match.stop();
      });
    };

    InsertFootnoteView.prototype.insertFootnote = function(footnote) {
      var definitionText, referenceText;
      referenceText = templateHelper.create("footnoteReferenceTag", footnote);
      definitionText = templateHelper.create("footnoteDefinitionTag", footnote).trim();
      this.editor.setTextInBufferRange(this.range, this.selection + referenceText);
      if (config.get("footnoteInsertPosition") === "article") {
        return helper.insertAtEndOfArticle(this.editor, definitionText);
      } else {
        return helper.insertAfterCurrentParagraph(this.editor, definitionText);
      }
    };

    return InsertFootnoteView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtZm9vdG5vdGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGtIQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLGVBQUosRUFBVTs7RUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLCtCQUFSOztFQUNULGNBQUEsR0FBaUIsT0FBQSxDQUFRLDRCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3BELEtBQUMsQ0FBQSxLQUFELENBQU8saUJBQVAsRUFBMEI7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7V0FBMUI7VUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7WUFDSCxLQUFDLENBQUEsS0FBRCxDQUFPLE9BQVAsRUFBZ0I7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7YUFBaEI7bUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLElBQUksY0FBSixDQUFtQjtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQW5CLENBQXhCO1VBRkcsQ0FBTDtpQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsTUFBQSxFQUFRLFlBQVI7V0FBTCxFQUEyQixTQUFBO1lBQ3pCLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxFQUFrQjtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDthQUFsQjttQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBMEIsSUFBSSxjQUFKLENBQW1CO2NBQUEsSUFBQSxFQUFNLElBQU47YUFBbkIsQ0FBMUI7VUFGeUIsQ0FBM0I7UUFMb0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXREO0lBRFE7O2lDQVVWLFVBQUEsR0FBWSxTQUFBO01BQ1YsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsQ0FBQyxJQUFDLENBQUEsV0FBRixFQUFlLElBQUMsQ0FBQSxhQUFoQixDQUFsQjtNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxtQkFBSixDQUFBO2FBQ2YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUNmLElBQUMsQ0FBQSxPQURjLEVBQ0w7UUFDUixjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSO1FBRVIsYUFBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGUjtPQURLLENBQWpCO0lBSlU7O2lDQVVaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLFFBQUEsR0FDRTtRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFQO1FBQ0EsT0FBQSxFQUFTLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBRFQ7O01BR0YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNmLElBQUcsS0FBQyxDQUFBLFFBQUo7bUJBQ0UsS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsRUFIRjs7UUFEZTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7YUFNQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBWFM7O2lDQWFYLE9BQUEsR0FBUyxTQUFBOztRQUNQLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1VBQVksT0FBQSxFQUFTLEtBQXJCO1NBQTdCOztNQUNWLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixDQUFBLENBQUUsUUFBUSxDQUFDLGFBQVg7TUFDNUIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVixJQUFDLENBQUEsaUNBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxTQUF4QixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUE7SUFQTzs7aUNBU1QsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsQ0FBQSxDQUFIO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7O2NBQ3lCLENBQUUsS0FBM0IsQ0FBQTtTQUZGOzthQUdBLGdEQUFBLFNBQUE7SUFKTTs7aUNBTVIsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBOztZQUFZLENBQUUsT0FBZCxDQUFBOzthQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFGUDs7aUNBSVYsaUNBQUEsR0FBbUMsU0FBQTtNQUNqQyxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQUssQ0FBQyxrQkFBTixDQUF5QixJQUFDLENBQUEsTUFBMUIsRUFBa0MsTUFBbEMsRUFBMEM7UUFBQSxRQUFBLEVBQVUsTUFBVjtPQUExQztNQUNULElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxLQUF4QixDQUFBLElBQWtDO01BRS9DLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBQyxDQUFBLFNBQWxCLENBQUg7UUFDRSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQUMsQ0FBQSxTQUFyQjtRQUNaLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBO2VBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLElBQUMsQ0FBQSxRQUFTLENBQUEsT0FBQSxDQUEvQixFQUhGO09BQUEsTUFBQTtlQUtFLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixJQUFJLENBQUMsR0FBTCxDQUFBLENBQVcsWUFBaEMsRUFMRjs7SUFKaUM7O2lDQVduQyxjQUFBLEdBQWdCLFNBQUMsUUFBRDtBQUNkLFVBQUE7TUFBQSxhQUFBLEdBQWdCLGNBQWMsQ0FBQyxNQUFmLENBQXNCLHNCQUF0QixFQUE4QyxRQUE5QztNQUNoQixjQUFBLEdBQWlCLGNBQWMsQ0FBQyxNQUFmLENBQXNCLHVCQUF0QixFQUErQyxRQUEvQyxDQUF3RCxDQUFDLElBQXpELENBQUE7TUFFakIsSUFBRyxJQUFDLENBQUEsUUFBUyxDQUFBLGNBQUEsQ0FBYjtRQUNFLFVBQUEsR0FBYTtRQUNiLFFBQUEsR0FBVyxjQUFjLENBQUMsTUFBZixDQUFzQixzQkFBdEIsRUFBOEMsSUFBQyxDQUFBLFFBQS9DLENBQXdELENBQUMsSUFBekQsQ0FBQTtRQUNYLFdBQUEsR0FBYyxjQUhoQjtPQUFBLE1BQUE7UUFLRSxVQUFBLEdBQWE7UUFDYixRQUFBLEdBQVcsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsdUJBQXRCLEVBQStDLElBQUMsQ0FBQSxRQUFoRCxDQUF5RCxDQUFDLElBQTFELENBQUE7UUFDWCxXQUFBLEdBQWMsZUFQaEI7O01BU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsS0FBOUIsRUFBcUMsVUFBckM7YUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFmLENBQW9CLE1BQUEsQ0FBQSxFQUFBLEdBQUssQ0FBQyxLQUFLLENBQUMsWUFBTixDQUFtQixRQUFuQixDQUFELENBQUwsQ0FBcEIsRUFBNkQsU0FBQyxLQUFEO1FBQzNELEtBQUssQ0FBQyxPQUFOLENBQWMsV0FBZDtlQUNBLEtBQUssQ0FBQyxJQUFOLENBQUE7TUFGMkQsQ0FBN0Q7SUFkYzs7aUNBa0JoQixjQUFBLEdBQWdCLFNBQUMsUUFBRDtBQUNkLFVBQUE7TUFBQSxhQUFBLEdBQWdCLGNBQWMsQ0FBQyxNQUFmLENBQXNCLHNCQUF0QixFQUE4QyxRQUE5QztNQUNoQixjQUFBLEdBQWlCLGNBQWMsQ0FBQyxNQUFmLENBQXNCLHVCQUF0QixFQUErQyxRQUEvQyxDQUF3RCxDQUFDLElBQXpELENBQUE7TUFFakIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsS0FBOUIsRUFBcUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxhQUFsRDtNQUVBLElBQUcsTUFBTSxDQUFDLEdBQVAsQ0FBVyx3QkFBWCxDQUFBLEtBQXdDLFNBQTNDO2VBQ0UsTUFBTSxDQUFDLG9CQUFQLENBQTRCLElBQUMsQ0FBQSxNQUE3QixFQUFxQyxjQUFyQyxFQURGO09BQUEsTUFBQTtlQUdFLE1BQU0sQ0FBQywyQkFBUCxDQUFtQyxJQUFDLENBQUEsTUFBcEMsRUFBNEMsY0FBNUMsRUFIRjs7SUFOYzs7OztLQWxGZTtBQVZqQyIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbmd1aWQgPSByZXF1aXJlIFwiZ3VpZFwiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuaGVscGVyID0gcmVxdWlyZSBcIi4uL2hlbHBlcnMvaW5zZXJ0LWxpbmstaGVscGVyXCJcbnRlbXBsYXRlSGVscGVyID0gcmVxdWlyZSBcIi4uL2hlbHBlcnMvdGVtcGxhdGUtaGVscGVyXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSW5zZXJ0Rm9vdG5vdGVWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcIm1hcmtkb3duLXdyaXRlciBtYXJrZG93bi13cml0ZXItZGlhbG9nXCIsID0+XG4gICAgICBAbGFiZWwgXCJJbnNlcnQgRm9vdG5vdGVcIiwgY2xhc3M6IFwiaWNvbiBpY29uLXBpblwiXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBsYWJlbCBcIkxhYmVsXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICBAc3VidmlldyBcImxhYmVsRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBvdXRsZXQ6IFwiY29udGVudEJveFwiLCA9PlxuICAgICAgICBAbGFiZWwgXCJDb250ZW50XCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICBAc3VidmlldyBcImNvbnRlbnRFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICB1dGlscy5zZXRUYWJJbmRleChbQGxhYmVsRWRpdG9yLCBAY29udGVudEVkaXRvcl0pXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgIEBlbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ID0+IEBvbkNvbmZpcm0oKSxcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiAgPT4gQGRldGFjaCgpXG4gICAgICB9KSlcblxuICBvbkNvbmZpcm06IC0+XG4gICAgZm9vdG5vdGUgPVxuICAgICAgbGFiZWw6IEBsYWJlbEVkaXRvci5nZXRUZXh0KClcbiAgICAgIGNvbnRlbnQ6IEBjb250ZW50RWRpdG9yLmdldFRleHQoKVxuXG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgaWYgQGZvb3Rub3RlXG4gICAgICAgIEB1cGRhdGVGb290bm90ZShmb290bm90ZSlcbiAgICAgIGVsc2VcbiAgICAgICAgQGluc2VydEZvb3Rub3RlKGZvb3Rub3RlKVxuXG4gICAgQGRldGFjaCgpXG5cbiAgZGlzcGxheTogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzLCB2aXNpYmxlOiBmYWxzZSlcbiAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAX25vcm1hbGl6ZVNlbGVjdGlvbkFuZFNldEZvb3Rub3RlKClcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGxhYmVsRWRpdG9yLmdldE1vZGVsKCkuc2VsZWN0QWxsKClcbiAgICBAbGFiZWxFZGl0b3IuZm9jdXMoKVxuXG4gIGRldGFjaDogLT5cbiAgICBpZiBAcGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ/LmZvY3VzKClcbiAgICBzdXBlclxuXG4gIGRldGFjaGVkOiAtPlxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQGRpc3Bvc2FibGVzID0gbnVsbFxuXG4gIF9ub3JtYWxpemVTZWxlY3Rpb25BbmRTZXRGb290bm90ZTogLT5cbiAgICBAcmFuZ2UgPSB1dGlscy5nZXRUZXh0QnVmZmVyUmFuZ2UoQGVkaXRvciwgXCJsaW5rXCIsIHNlbGVjdEJ5OiBcIm5vcGVcIilcbiAgICBAc2VsZWN0aW9uID0gQGVkaXRvci5nZXRUZXh0SW5SYW5nZShAcmFuZ2UpIHx8IFwiXCJcblxuICAgIGlmIHV0aWxzLmlzRm9vdG5vdGUoQHNlbGVjdGlvbilcbiAgICAgIEBmb290bm90ZSA9IHV0aWxzLnBhcnNlRm9vdG5vdGUoQHNlbGVjdGlvbilcbiAgICAgIEBjb250ZW50Qm94LmhpZGUoKVxuICAgICAgQGxhYmVsRWRpdG9yLnNldFRleHQoQGZvb3Rub3RlW1wibGFiZWxcIl0pXG4gICAgZWxzZVxuICAgICAgQGxhYmVsRWRpdG9yLnNldFRleHQoZ3VpZC5yYXcoKVswLi43XSlcblxuICB1cGRhdGVGb290bm90ZTogKGZvb3Rub3RlKSAtPlxuICAgIHJlZmVyZW5jZVRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJmb290bm90ZVJlZmVyZW5jZVRhZ1wiLCBmb290bm90ZSlcbiAgICBkZWZpbml0aW9uVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcImZvb3Rub3RlRGVmaW5pdGlvblRhZ1wiLCBmb290bm90ZSkudHJpbSgpXG5cbiAgICBpZiBAZm9vdG5vdGVbXCJpc0RlZmluaXRpb25cIl1cbiAgICAgIHVwZGF0ZVRleHQgPSBkZWZpbml0aW9uVGV4dFxuICAgICAgZmluZFRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJmb290bm90ZVJlZmVyZW5jZVRhZ1wiLCBAZm9vdG5vdGUpLnRyaW0oKVxuICAgICAgcmVwbGFjZVRleHQgPSByZWZlcmVuY2VUZXh0XG4gICAgZWxzZVxuICAgICAgdXBkYXRlVGV4dCA9IHJlZmVyZW5jZVRleHRcbiAgICAgIGZpbmRUZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwiZm9vdG5vdGVEZWZpbml0aW9uVGFnXCIsIEBmb290bm90ZSkudHJpbSgpXG4gICAgICByZXBsYWNlVGV4dCA9IGRlZmluaXRpb25UZXh0XG5cbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKEByYW5nZSwgdXBkYXRlVGV4dClcbiAgICBAZWRpdG9yLmJ1ZmZlci5zY2FuIC8vLyAje3V0aWxzLmVzY2FwZVJlZ0V4cChmaW5kVGV4dCl9IC8vLywgKG1hdGNoKSAtPlxuICAgICAgbWF0Y2gucmVwbGFjZShyZXBsYWNlVGV4dClcbiAgICAgIG1hdGNoLnN0b3AoKVxuXG4gIGluc2VydEZvb3Rub3RlOiAoZm9vdG5vdGUpIC0+XG4gICAgcmVmZXJlbmNlVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcImZvb3Rub3RlUmVmZXJlbmNlVGFnXCIsIGZvb3Rub3RlKVxuICAgIGRlZmluaXRpb25UZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwiZm9vdG5vdGVEZWZpbml0aW9uVGFnXCIsIGZvb3Rub3RlKS50cmltKClcblxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCBAc2VsZWN0aW9uICsgcmVmZXJlbmNlVGV4dClcblxuICAgIGlmIGNvbmZpZy5nZXQoXCJmb290bm90ZUluc2VydFBvc2l0aW9uXCIpID09IFwiYXJ0aWNsZVwiXG4gICAgICBoZWxwZXIuaW5zZXJ0QXRFbmRPZkFydGljbGUoQGVkaXRvciwgZGVmaW5pdGlvblRleHQpXG4gICAgZWxzZVxuICAgICAgaGVscGVyLmluc2VydEFmdGVyQ3VycmVudFBhcmFncmFwaChAZWRpdG9yLCBkZWZpbml0aW9uVGV4dClcbiJdfQ==
