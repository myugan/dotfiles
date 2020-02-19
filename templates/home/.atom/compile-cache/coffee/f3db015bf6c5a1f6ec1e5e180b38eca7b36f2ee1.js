(function() {
  var $, CompositeDisposable, InsertTableView, TextEditorView, View, config, ref, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  module.exports = InsertTableView = (function(superClass) {
    extend(InsertTableView, superClass);

    function InsertTableView() {
      return InsertTableView.__super__.constructor.apply(this, arguments);
    }

    InsertTableView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Table", {
            "class": "icon icon-diff-added"
          });
          return _this.div(function() {
            _this.label("Rows", {
              "class": "message"
            });
            _this.subview("rowEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Columns", {
              "class": "message"
            });
            return _this.subview("columnEditor", new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    InsertTableView.prototype.initialize = function() {
      utils.setTabIndex([this.rowEditor, this.columnEditor]);
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

    InsertTableView.prototype.onConfirm = function() {
      var col, row;
      row = parseInt(this.rowEditor.getText(), 10);
      col = parseInt(this.columnEditor.getText(), 10);
      if (this.isValidRange(row, col)) {
        this.insertTable(row, col);
      }
      return this.detach();
    };

    InsertTableView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.rowEditor.setText("3");
      this.columnEditor.setText("3");
      this.panel.show();
      return this.rowEditor.focus();
    };

    InsertTableView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertTableView.__super__.detach.apply(this, arguments);
    };

    InsertTableView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertTableView.prototype.insertTable = function(row, col) {
      var cursor;
      cursor = this.editor.getCursorBufferPosition();
      this.editor.insertText(this.createTable(row, col));
      return this.editor.setCursorBufferPosition(cursor);
    };

    InsertTableView.prototype.createTable = function(row, col) {
      var i, options, ref1, table;
      options = {
        numOfColumns: col,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        alignment: config.get("tableAlignment")
      };
      table = [];
      table.push(utils.createTableRow([], options));
      table.push(utils.createTableSeparator(options));
      for (i = 0, ref1 = row - 2; 0 <= ref1 ? i <= ref1 : i >= ref1; 0 <= ref1 ? i++ : i--) {
        table.push(utils.createTableRow([], options));
      }
      return table.join("\n");
    };

    InsertTableView.prototype.isValidRange = function(row, col) {
      if (isNaN(row) || isNaN(col)) {
        return false;
      }
      if (row < 2 || col < 1) {
        return false;
      }
      return true;
    };

    return InsertTableView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtdGFibGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlGQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLGVBQUosRUFBVTs7RUFFVixNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwRCxLQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsRUFBdUI7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNCQUFQO1dBQXZCO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtZQUNILEtBQUMsQ0FBQSxLQUFELENBQU8sTUFBUCxFQUFlO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO2FBQWY7WUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFdBQVQsRUFBc0IsSUFBSSxjQUFKLENBQW1CO2NBQUEsSUFBQSxFQUFNLElBQU47YUFBbkIsQ0FBdEI7WUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsRUFBa0I7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7YUFBbEI7bUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxjQUFULEVBQXlCLElBQUksY0FBSixDQUFtQjtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQW5CLENBQXpC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QWEsQ0FGYjtRQUdBLFNBQUEsRUFBVyxNQUFNLENBQUMsR0FBUCxDQUFXLGdCQUFYLENBSFg7O01BS0YsS0FBQSxHQUFRO01BR1IsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixPQUF6QixDQUFYO01BRUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsb0JBQU4sQ0FBMkIsT0FBM0IsQ0FBWDtBQUVBLFdBQWtELCtFQUFsRDtRQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsQ0FBWDtBQUFBO2FBRUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO0lBaEJXOzs4QkFtQmIsWUFBQSxHQUFjLFNBQUMsR0FBRCxFQUFNLEdBQU47TUFDWixJQUFnQixLQUFBLENBQU0sR0FBTixDQUFBLElBQWMsS0FBQSxDQUFNLEdBQU4sQ0FBOUI7QUFBQSxlQUFPLE1BQVA7O01BQ0EsSUFBZ0IsR0FBQSxHQUFNLENBQU4sSUFBVyxHQUFBLEdBQU0sQ0FBakM7QUFBQSxlQUFPLE1BQVA7O0FBQ0EsYUFBTztJQUhLOzs7O0tBdkVjO0FBUDlCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSW5zZXJ0VGFibGVWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcIm1hcmtkb3duLXdyaXRlciBtYXJrZG93bi13cml0ZXItZGlhbG9nXCIsID0+XG4gICAgICBAbGFiZWwgXCJJbnNlcnQgVGFibGVcIiwgY2xhc3M6IFwiaWNvbiBpY29uLWRpZmYtYWRkZWRcIlxuICAgICAgQGRpdiA9PlxuICAgICAgICBAbGFiZWwgXCJSb3dzXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICBAc3VidmlldyBcInJvd0VkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGxhYmVsIFwiQ29sdW1uc1wiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgQHN1YnZpZXcgXCJjb2x1bW5FZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICB1dGlscy5zZXRUYWJJbmRleChbQHJvd0VkaXRvciwgQGNvbHVtbkVkaXRvcl0pXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgIEBlbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ID0+IEBvbkNvbmZpcm0oKSxcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiAgPT4gQGRldGFjaCgpXG4gICAgICB9KSlcblxuICBvbkNvbmZpcm06IC0+XG4gICAgcm93ID0gcGFyc2VJbnQoQHJvd0VkaXRvci5nZXRUZXh0KCksIDEwKVxuICAgIGNvbCA9IHBhcnNlSW50KEBjb2x1bW5FZGl0b3IuZ2V0VGV4dCgpLCAxMClcblxuICAgIEBpbnNlcnRUYWJsZShyb3csIGNvbCkgaWYgQGlzVmFsaWRSYW5nZShyb3csIGNvbClcblxuICAgIEBkZXRhY2goKVxuXG4gIGRpc3BsYXk6IC0+XG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG4gICAgQHJvd0VkaXRvci5zZXRUZXh0KFwiM1wiKVxuICAgIEBjb2x1bW5FZGl0b3Iuc2V0VGV4dChcIjNcIilcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHJvd0VkaXRvci5mb2N1cygpXG5cbiAgZGV0YWNoOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uZm9jdXMoKVxuICAgIHN1cGVyXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG5cbiAgaW5zZXJ0VGFibGU6IChyb3csIGNvbCkgLT5cbiAgICBjdXJzb3IgPSBAZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQoQGNyZWF0ZVRhYmxlKHJvdywgY29sKSlcbiAgICBAZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGN1cnNvcilcblxuICBjcmVhdGVUYWJsZTogKHJvdywgY29sKSAtPlxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiBjb2xcbiAgICAgIGV4dHJhUGlwZXM6IGNvbmZpZy5nZXQoXCJ0YWJsZUV4dHJhUGlwZXNcIilcbiAgICAgIGNvbHVtbldpZHRoOiAxXG4gICAgICBhbGlnbm1lbnQ6IGNvbmZpZy5nZXQoXCJ0YWJsZUFsaWdubWVudFwiKVxuXG4gICAgdGFibGUgPSBbXVxuXG4gICAgIyBpbnNlcnQgaGVhZGVyXG4gICAgdGFibGUucHVzaCh1dGlscy5jcmVhdGVUYWJsZVJvdyhbXSwgb3B0aW9ucykpXG4gICAgIyBpbnNlcnQgc2VwYXJhdG9yXG4gICAgdGFibGUucHVzaCh1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihvcHRpb25zKSlcbiAgICAjIGluc2VydCBib2R5IHJvd3NcbiAgICB0YWJsZS5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKSkgZm9yIFswLi5yb3cgLSAyXVxuXG4gICAgdGFibGUuam9pbihcIlxcblwiKVxuXG4gICMgYXQgbGVhc3QgMiByb3cgKyAyIGNvbHVtbnNcbiAgaXNWYWxpZFJhbmdlOiAocm93LCBjb2wpIC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIGlzTmFOKHJvdykgfHwgaXNOYU4oY29sKVxuICAgIHJldHVybiBmYWxzZSBpZiByb3cgPCAyIHx8IGNvbCA8IDFcbiAgICByZXR1cm4gdHJ1ZVxuIl19
