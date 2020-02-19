(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config, utils;

  config = require("../config");

  utils = require("../utils");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var columnWidths, cursor, line, lineMeta, row;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isList("al") && !lineMeta.isIndented()) {
        return e.abortKeyBinding();
      }
      if (lineMeta.isContinuous()) {
        if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
          this.editor.insertText("\n");
          this.editor.insertText(lineMeta.indent);
          this.editor.insertText(lineMeta.indentLineTabText());
          return;
        }
        if (lineMeta.isEmptyBody()) {
          this._insertNewlineWithoutContinuation(cursor);
        } else {
          this._insertNewlineWithContinuation(lineMeta);
        }
        return;
      }
      if (this._isTableRow(cursor, line)) {
        row = utils.parseTableRow(line);
        columnWidths = row.columnWidths.reduce(function(sum, i) {
          return sum + i;
        });
        if (columnWidths === 0) {
          this._insertNewlineWithoutTableColumns();
        } else {
          this._insertNewlineWithTableColumns(row);
        }
        return;
      }
      return e.abortKeyBinding();
    };

    EditLine.prototype._insertNewlineWithContinuation = function(lineMeta) {
      var nextLine;
      nextLine = lineMeta.nextLine;
      if (lineMeta.isList("ol") && !config.get("orderedNewLineNumberContinuation")) {
        nextLine = lineMeta.lineHead(lineMeta.defaultHead);
      }
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, nextLine, parentLineMeta;
      nextLine = "\n";
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      parentLineMeta = this._findListLineBackward(cursor.row, currentIndentation);
      if (parentLineMeta && !parentLineMeta.isList("al")) {
        nextLine = parentLineMeta.nextLine;
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype._findListLineBackward = function(currentRow, currentIndentation) {
      var emptyLineSkipped, indentation, j, line, lineMeta, ref, row;
      if (currentRow < 1 || currentIndentation <= 0) {
        return;
      }
      emptyLineSkipped = 0;
      for (row = j = ref = currentRow - 1; ref <= 0 ? j <= 0 : j >= 0; row = ref <= 0 ? ++j : --j) {
        line = this.editor.lineTextForBufferRow(row);
        if (line.trim() === "") {
          if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
            return;
          }
          emptyLineSkipped += 1;
        } else {
          indentation = this.editor.indentationForBufferRow(row);
          if (indentation >= currentIndentation) {
            continue;
          }
          if (indentation === 0) {
            if (!LineMeta.isList(line)) {
              return;
            }
          } else {
            if (!LineMeta.isList(line)) {
              continue;
            }
          }
          lineMeta = new LineMeta(line);
          indentation = (lineMeta.indent.length + lineMeta.indentLineTabLength()) / this.editor.getTabLength();
          if (currentIndentation > indentation - 1 && currentIndentation < indentation + 1) {
            return lineMeta;
          } else {
            return;
          }
        }
      }
    };

    EditLine.prototype._isTableRow = function(cursor, line) {
      if (!config.get("tableNewLineContinuation")) {
        return false;
      }
      if (cursor.row < 1 || !utils.isTableRow(line)) {
        return false;
      }
      if (utils.isTableSeparator(line)) {
        return true;
      }
      if (utils.isTableRow(this.editor.lineTextForBufferRow(cursor.row - 1))) {
        return true;
      }
      return false;
    };

    EditLine.prototype._insertNewlineWithoutTableColumns = function() {
      this.editor.selectLinesContainingCursors();
      return this.editor.insertText("\n");
    };

    EditLine.prototype._insertNewlineWithTableColumns = function(row) {
      var newLine, options;
      options = {
        numOfColumns: Math.max(1, row.columns.length),
        extraPipes: row.extraPipes,
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      newLine = utils.createTableRow([], options);
      this.editor.moveToEndOfLine();
      this.editor.insertText("\n" + newLine);
      this.editor.moveToBeginningOfLine();
      if (options.extraPipes) {
        return this.editor.moveToNextWordBoundary();
      }
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var bullet, currentIndentation, cursor, line, lineMeta, newcursor, newline, parentLineMeta;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (!lineMeta.isList() || lineMeta.isList("al")) {
        return e.abortKeyBinding();
      }
      currentIndentation = this.editor.indentationForBufferRow(cursor.row) + 1;
      parentLineMeta = this._findListLineBackward(cursor.row, currentIndentation);
      if (!parentLineMeta) {
        return e.abortKeyBinding();
      }
      if (lineMeta.isList("ol")) {
        newline = "" + (parentLineMeta.indentLineTabText()) + (lineMeta.lineHead(lineMeta.defaultHead)) + lineMeta.body;
        newcursor = [cursor.row, cursor.column + newline.length - line.length];
        this._replaceLine(selection, newline, newcursor);
        return;
      }
      if (lineMeta.isList("ul")) {
        bullet = this._ulBullet(this.editor, currentIndentation);
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        newline = "" + (parentLineMeta.indentLineTabText()) + (lineMeta.lineHead(bullet)) + lineMeta.body;
        newcursor = [cursor.row, cursor.column + newline.length - line.length];
        this._replaceLine(selection, newline, newcursor);
        return;
      }
      return e.abortKeyBinding();
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    EditLine.prototype._replaceLine = function(selection, line, cursor) {
      var range;
      range = selection.cursor.getCurrentLineBufferRange();
      selection.setBufferRange(range);
      selection.insertText(line);
      return selection.cursor.setBufferPosition(cursor);
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype._ulBullet = function(editor, indentation) {
      var label;
      label = "";
      if (editor.getTabLength() <= 2) {
        label = Math.floor(indentation);
      } else {
        label = Math.round(indentation);
      }
      return config.get("templateVariables.ulBullet" + label);
    };

    EditLine.prototype.undentListLine = function(e, selection) {
      var bullet, currentIndentation, cursor, line, lineMeta, newcursor, newline, parentLineMeta;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (!lineMeta.isList() || lineMeta.isList("al")) {
        return e.abortKeyBinding();
      }
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      if (currentIndentation <= 0) {
        return e.abortKeyBinding();
      }
      parentLineMeta = this._findListLineBackward(cursor.row, currentIndentation);
      if (!parentLineMeta && lineMeta.isList("ul")) {
        bullet = this._ulBullet(this.editor, currentIndentation - 1);
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        newline = "" + (lineMeta.lineHead(bullet)) + lineMeta.body;
        newline = newline.substring(Math.min(lineMeta.indent.length, this.editor.getTabLength()));
        newcursor = [cursor.row, Math.max(cursor.column + newline.length - line.length, 0)];
        this._replaceLine(selection, newline, newcursor);
        return;
      }
      if (!parentLineMeta) {
        return e.abortKeyBinding();
      }
      if (parentLineMeta.isList("ol")) {
        newline = "" + (parentLineMeta.lineHead(parentLineMeta.defaultHead)) + lineMeta.body;
        newcursor = [cursor.row, Math.max(cursor.column + newline.length - line.length, 0)];
        this._replaceLine(selection, newline, newcursor);
        return;
      }
      if (parentLineMeta.isList("ul")) {
        newline = "" + (parentLineMeta.lineHead(parentLineMeta.head)) + lineMeta.body;
        newcursor = [cursor.row, Math.max(cursor.column + newline.length - line.length, 0)];
        this._replaceLine(selection, newline, newcursor);
        return;
      }
      return e.abortKeyBinding();
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9lZGl0LWxpbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLFFBQUEsR0FBVyxPQUFBLENBQVEsc0JBQVI7O0VBRVgsMkJBQUEsR0FBOEI7O0VBRTlCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxrQkFBQyxNQUFEO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBRkM7O3VCQUliLE9BQUEsR0FBUyxTQUFDLENBQUQ7QUFDUCxVQUFBO01BQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixVQUFoQixFQUE0QixTQUFDLENBQUQ7ZUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBTCxDQUFBO01BQVAsQ0FBNUI7YUFFTCxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNmLEtBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsU0FBQyxTQUFEO21CQUM5QixLQUFFLENBQUEsRUFBQSxDQUFGLENBQU0sQ0FBTixFQUFTLFNBQVQ7VUFEOEIsQ0FBaEM7UUFEZTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7SUFITzs7dUJBT1QsYUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFJLFNBQUo7QUFDYixVQUFBO01BQUEsSUFBOEIsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLENBQTlCO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O01BRUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxxQkFBVixDQUFBO01BQ1QsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsTUFBTSxDQUFDLEdBQXBDO01BRVAsUUFBQSxHQUFXLElBQUksUUFBSixDQUFhLElBQWI7TUFFWCxJQUFHLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLENBQUEsSUFBeUIsQ0FBQyxRQUFRLENBQUMsVUFBVCxDQUFBLENBQTdCO0FBQ0UsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBRFQ7O01BR0EsSUFBRyxRQUFRLENBQUMsWUFBVCxDQUFBLENBQUg7UUFHRSxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLElBQUksQ0FBQyxNQUFyQixJQUErQixDQUFDLE1BQU0sQ0FBQyxHQUFQLENBQVcsMkJBQVgsQ0FBbkM7VUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkI7VUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsUUFBUSxDQUFDLE1BQTVCO1VBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLFFBQVEsQ0FBQyxpQkFBVCxDQUFBLENBQW5CO0FBQ0EsaUJBSkY7O1FBTUEsSUFBRyxRQUFRLENBQUMsV0FBVCxDQUFBLENBQUg7VUFDRSxJQUFDLENBQUEsaUNBQUQsQ0FBbUMsTUFBbkMsRUFERjtTQUFBLE1BQUE7VUFHRSxJQUFDLENBQUEsOEJBQUQsQ0FBZ0MsUUFBaEMsRUFIRjs7QUFJQSxlQWJGOztNQWVBLElBQUcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBQXFCLElBQXJCLENBQUg7UUFDRSxHQUFBLEdBQU0sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEI7UUFDTixZQUFBLEdBQWUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFqQixDQUF3QixTQUFDLEdBQUQsRUFBTSxDQUFOO2lCQUFZLEdBQUEsR0FBTTtRQUFsQixDQUF4QjtRQUNmLElBQUcsWUFBQSxLQUFnQixDQUFuQjtVQUNFLElBQUMsQ0FBQSxpQ0FBRCxDQUFBLEVBREY7U0FBQSxNQUFBO1VBR0UsSUFBQyxDQUFBLDhCQUFELENBQWdDLEdBQWhDLEVBSEY7O0FBSUEsZUFQRjs7QUFTQSxhQUFPLENBQUMsQ0FBQyxlQUFGLENBQUE7SUFuQ007O3VCQXFDZiw4QkFBQSxHQUFnQyxTQUFDLFFBQUQ7QUFDOUIsVUFBQTtNQUFBLFFBQUEsR0FBVyxRQUFRLENBQUM7TUFFcEIsSUFBRyxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixDQUFBLElBQXlCLENBQUMsTUFBTSxDQUFDLEdBQVAsQ0FBVyxrQ0FBWCxDQUE3QjtRQUNFLFFBQUEsR0FBVyxRQUFRLENBQUMsUUFBVCxDQUFrQixRQUFRLENBQUMsV0FBM0IsRUFEYjs7YUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBQSxHQUFLLFFBQXhCO0lBTjhCOzt1QkFRaEMsaUNBQUEsR0FBbUMsU0FBQyxNQUFEO0FBQ2pDLFVBQUE7TUFBQSxRQUFBLEdBQVc7TUFFWCxrQkFBQSxHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLE1BQU0sQ0FBQyxHQUF2QztNQUNyQixjQUFBLEdBQWlCLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixNQUFNLENBQUMsR0FBOUIsRUFBbUMsa0JBQW5DO01BQ2pCLElBQXNDLGNBQUEsSUFBa0IsQ0FBQyxjQUFjLENBQUMsTUFBZixDQUFzQixJQUF0QixDQUF6RDtRQUFBLFFBQUEsR0FBVyxjQUFjLENBQUMsU0FBMUI7O01BRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLFFBQW5CO0lBUmlDOzt1QkFZbkMscUJBQUEsR0FBdUIsU0FBQyxVQUFELEVBQWEsa0JBQWI7QUFDckIsVUFBQTtNQUFBLElBQVUsVUFBQSxHQUFhLENBQWIsSUFBa0Isa0JBQUEsSUFBc0IsQ0FBbEQ7QUFBQSxlQUFBOztNQUVBLGdCQUFBLEdBQW1CO0FBQ25CLFdBQVcsc0ZBQVg7UUFDRSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUE3QjtRQUVQLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFBLEtBQWUsRUFBbEI7VUFDRSxJQUFVLGdCQUFBLEdBQW1CLDJCQUE3QjtBQUFBLG1CQUFBOztVQUNBLGdCQUFBLElBQW9CLEVBRnRCO1NBQUEsTUFBQTtVQUtFLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLEdBQWhDO1VBQ2QsSUFBWSxXQUFBLElBQWUsa0JBQTNCO0FBQUEscUJBQUE7O1VBR0EsSUFBRyxXQUFBLEtBQWUsQ0FBbEI7WUFDRSxJQUFBLENBQWMsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLHFCQUFBO2FBREY7V0FBQSxNQUFBO1lBR0UsSUFBQSxDQUFnQixRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixDQUFoQjtBQUFBLHVCQUFBO2FBSEY7O1VBS0EsUUFBQSxHQUFXLElBQUksUUFBSixDQUFhLElBQWI7VUFFWCxXQUFBLEdBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQWhCLEdBQXlCLFFBQVEsQ0FBQyxtQkFBVCxDQUFBLENBQTFCLENBQUEsR0FBNEQsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQUE7VUFFMUUsSUFBRyxrQkFBQSxHQUFxQixXQUFBLEdBQVksQ0FBakMsSUFBc0Msa0JBQUEsR0FBcUIsV0FBQSxHQUFZLENBQTFFO0FBQ0UsbUJBQU8sU0FEVDtXQUFBLE1BQUE7QUFHRSxtQkFIRjtXQWxCRjs7QUFIRjtJQUpxQjs7dUJBOEJ2QixXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsSUFBVDtNQUNYLElBQWdCLENBQUMsTUFBTSxDQUFDLEdBQVAsQ0FBVywwQkFBWCxDQUFqQjtBQUFBLGVBQU8sTUFBUDs7TUFFQSxJQUFnQixNQUFNLENBQUMsR0FBUCxHQUFhLENBQWIsSUFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBTixDQUFpQixJQUFqQixDQUFuQztBQUFBLGVBQU8sTUFBUDs7TUFFQSxJQUFlLEtBQUssQ0FBQyxnQkFBTixDQUF1QixJQUF2QixDQUFmO0FBQUEsZUFBTyxLQUFQOztNQUVBLElBQWUsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUFNLENBQUMsR0FBUCxHQUFXLENBQXhDLENBQWpCLENBQWY7QUFBQSxlQUFPLEtBQVA7O0FBRUEsYUFBTztJQVRJOzt1QkFXYixpQ0FBQSxHQUFtQyxTQUFBO01BQ2pDLElBQUMsQ0FBQSxNQUFNLENBQUMsNEJBQVIsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUZpQzs7dUJBSW5DLDhCQUFBLEdBQWdDLFNBQUMsR0FBRDtBQUM5QixVQUFBO01BQUEsT0FBQSxHQUNFO1FBQUEsWUFBQSxFQUFjLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBeEIsQ0FBZDtRQUNBLFVBQUEsRUFBWSxHQUFHLENBQUMsVUFEaEI7UUFFQSxXQUFBLEVBQWEsQ0FGYjtRQUdBLFlBQUEsRUFBYyxFQUhkO1FBSUEsU0FBQSxFQUFXLE1BQU0sQ0FBQyxHQUFQLENBQVcsZ0JBQVgsQ0FKWDtRQUtBLFVBQUEsRUFBWSxFQUxaOztNQU9GLE9BQUEsR0FBVSxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixPQUF6QjtNQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUFBO01BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQUEsR0FBSyxPQUF4QjtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBQTtNQUNBLElBQW9DLE9BQU8sQ0FBQyxVQUE1QztlQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxFQUFBOztJQWI4Qjs7dUJBZWhDLGNBQUEsR0FBZ0IsU0FBQyxDQUFELEVBQUksU0FBSjtBQUNkLFVBQUE7TUFBQSxJQUE4QixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsU0FBbkIsQ0FBOUI7QUFBQSxlQUFPLENBQUMsQ0FBQyxlQUFGLENBQUEsRUFBUDs7TUFFQSxNQUFBLEdBQVMsU0FBUyxDQUFDLHFCQUFWLENBQUE7TUFDVCxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUFNLENBQUMsR0FBcEM7TUFFUCxRQUFBLEdBQVcsSUFBSSxRQUFKLENBQWEsSUFBYjtNQUNYLElBQThCLENBQUMsUUFBUSxDQUFDLE1BQVQsQ0FBQSxDQUFELElBQXNCLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLENBQXBEO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O01BRUEsa0JBQUEsR0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxNQUFNLENBQUMsR0FBdkMsQ0FBQSxHQUE4QztNQUNuRSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixNQUFNLENBQUMsR0FBOUIsRUFBbUMsa0JBQW5DO01BQ2pCLElBQUEsQ0FBa0MsY0FBbEM7QUFBQSxlQUFPLENBQUMsQ0FBQyxlQUFGLENBQUEsRUFBUDs7TUFFQSxJQUFHLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLENBQUg7UUFDRSxPQUFBLEdBQVUsRUFBQSxHQUFFLENBQUMsY0FBYyxDQUFDLGlCQUFmLENBQUEsQ0FBRCxDQUFGLEdBQXVDLENBQUMsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsUUFBUSxDQUFDLFdBQTNCLENBQUQsQ0FBdkMsR0FBa0YsUUFBUSxDQUFDO1FBQ3JHLFNBQUEsR0FBWSxDQUFDLE1BQU0sQ0FBQyxHQUFSLEVBQWEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBTyxDQUFDLE1BQXhCLEdBQWlDLElBQUksQ0FBQyxNQUFuRDtRQUNaLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUF5QixPQUF6QixFQUFrQyxTQUFsQztBQUNBLGVBSkY7O01BTUEsSUFBRyxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixDQUFIO1FBQ0UsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLE1BQVosRUFBb0Isa0JBQXBCO1FBQ1QsTUFBQSxHQUFTLE1BQUEsSUFBVSxNQUFNLENBQUMsR0FBUCxDQUFXLDRCQUFYLENBQVYsSUFBc0QsUUFBUSxDQUFDO1FBRXhFLE9BQUEsR0FBVSxFQUFBLEdBQUUsQ0FBQyxjQUFjLENBQUMsaUJBQWYsQ0FBQSxDQUFELENBQUYsR0FBdUMsQ0FBQyxRQUFRLENBQUMsUUFBVCxDQUFrQixNQUFsQixDQUFELENBQXZDLEdBQW9FLFFBQVEsQ0FBQztRQUN2RixTQUFBLEdBQVksQ0FBQyxNQUFNLENBQUMsR0FBUixFQUFhLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE9BQU8sQ0FBQyxNQUF4QixHQUFpQyxJQUFJLENBQUMsTUFBbkQ7UUFDWixJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBeUIsT0FBekIsRUFBa0MsU0FBbEM7QUFDQSxlQVBGOzthQVNBLENBQUMsQ0FBQyxlQUFGLENBQUE7SUE1QmM7O3VCQThCaEIsaUJBQUEsR0FBbUIsU0FBQyxTQUFEO0FBQ2pCLFVBQUE7TUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLHFCQUFWLENBQUE7TUFDUCxJQUFBLEdBQU8sU0FBUyxDQUFDLHFCQUFWLENBQUE7YUFFUCxJQUFJLENBQUMsR0FBTCxLQUFZLElBQUksQ0FBQyxHQUFqQixJQUF3QixJQUFJLENBQUMsTUFBTCxLQUFlLElBQUksQ0FBQztJQUozQjs7dUJBTW5CLFlBQUEsR0FBYyxTQUFDLFNBQUQsRUFBWSxJQUFaLEVBQWtCLE1BQWxCO0FBQ1osVUFBQTtNQUFBLEtBQUEsR0FBUSxTQUFTLENBQUMsTUFBTSxDQUFDLHlCQUFqQixDQUFBO01BQ1IsU0FBUyxDQUFDLGNBQVYsQ0FBeUIsS0FBekI7TUFDQSxTQUFTLENBQUMsVUFBVixDQUFxQixJQUFyQjthQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWpCLENBQW1DLE1BQW5DO0lBSlk7O3VCQU1kLGtCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLEdBQVA7YUFDbEIsR0FBQSxLQUFPLENBQVAsSUFBWSxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsRUFBa0IsR0FBbEIsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBLENBQUEsS0FBaUM7SUFEM0I7O3VCQUtwQixTQUFBLEdBQVcsU0FBQyxNQUFELEVBQVMsV0FBVDtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFFUixJQUFHLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxJQUF5QixDQUE1QjtRQUNFLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLFdBQVgsRUFEVjtPQUFBLE1BQUE7UUFHRSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLEVBSFY7O2FBS0EsTUFBTSxDQUFDLEdBQVAsQ0FBVyw0QkFBQSxHQUE2QixLQUF4QztJQVJTOzt1QkFVWCxjQUFBLEdBQWdCLFNBQUMsQ0FBRCxFQUFJLFNBQUo7QUFDZCxVQUFBO01BQUEsSUFBOEIsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLENBQTlCO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O01BRUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxxQkFBVixDQUFBO01BQ1QsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsTUFBTSxDQUFDLEdBQXBDO01BRVAsUUFBQSxHQUFXLElBQUksUUFBSixDQUFhLElBQWI7TUFDWCxJQUE4QixDQUFDLFFBQVEsQ0FBQyxNQUFULENBQUEsQ0FBRCxJQUFzQixRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixDQUFwRDtBQUFBLGVBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUFQOztNQUVBLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsTUFBTSxDQUFDLEdBQXZDO01BQ3JCLElBQThCLGtCQUFBLElBQXNCLENBQXBEO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O01BRUEsY0FBQSxHQUFpQixJQUFDLENBQUEscUJBQUQsQ0FBdUIsTUFBTSxDQUFDLEdBQTlCLEVBQW1DLGtCQUFuQztNQUNqQixJQUFHLENBQUMsY0FBRCxJQUFtQixRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixDQUF0QjtRQUNFLE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBQW9CLGtCQUFBLEdBQW1CLENBQXZDO1FBQ1QsTUFBQSxHQUFTLE1BQUEsSUFBVSxNQUFNLENBQUMsR0FBUCxDQUFXLDRCQUFYLENBQVYsSUFBc0QsUUFBUSxDQUFDO1FBRXhFLE9BQUEsR0FBVSxFQUFBLEdBQUUsQ0FBQyxRQUFRLENBQUMsUUFBVCxDQUFrQixNQUFsQixDQUFELENBQUYsR0FBK0IsUUFBUSxDQUFDO1FBQ2xELE9BQUEsR0FBVSxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFJLENBQUMsR0FBTCxDQUFTLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBekIsRUFBaUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQUEsQ0FBakMsQ0FBbEI7UUFDVixTQUFBLEdBQVksQ0FBQyxNQUFNLENBQUMsR0FBUixFQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBTyxDQUFDLE1BQXhCLEdBQWlDLElBQUksQ0FBQyxNQUEvQyxFQUF1RCxDQUF2RCxDQUFiO1FBQ1osSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQXlCLE9BQXpCLEVBQWtDLFNBQWxDO0FBQ0EsZUFSRjs7TUFVQSxJQUFBLENBQWtDLGNBQWxDO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O01BRUEsSUFBRyxjQUFjLENBQUMsTUFBZixDQUFzQixJQUF0QixDQUFIO1FBQ0UsT0FBQSxHQUFVLEVBQUEsR0FBRSxDQUFDLGNBQWMsQ0FBQyxRQUFmLENBQXdCLGNBQWMsQ0FBQyxXQUF2QyxDQUFELENBQUYsR0FBeUQsUUFBUSxDQUFDO1FBQzVFLFNBQUEsR0FBWSxDQUFDLE1BQU0sQ0FBQyxHQUFSLEVBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFNLENBQUMsTUFBUCxHQUFnQixPQUFPLENBQUMsTUFBeEIsR0FBaUMsSUFBSSxDQUFDLE1BQS9DLEVBQXVELENBQXZELENBQWI7UUFDWixJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBeUIsT0FBekIsRUFBa0MsU0FBbEM7QUFDQSxlQUpGOztNQU1BLElBQUcsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsSUFBdEIsQ0FBSDtRQUNFLE9BQUEsR0FBVSxFQUFBLEdBQUUsQ0FBQyxjQUFjLENBQUMsUUFBZixDQUF3QixjQUFjLENBQUMsSUFBdkMsQ0FBRCxDQUFGLEdBQWtELFFBQVEsQ0FBQztRQUNyRSxTQUFBLEdBQVksQ0FBQyxNQUFNLENBQUMsR0FBUixFQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBTyxDQUFDLE1BQXhCLEdBQWlDLElBQUksQ0FBQyxNQUEvQyxFQUF1RCxDQUF2RCxDQUFiO1FBQ1osSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQXlCLE9BQXpCLEVBQWtDLFNBQWxDO0FBQ0EsZUFKRjs7YUFNQSxDQUFDLENBQUMsZUFBRixDQUFBO0lBckNjOzs7OztBQW5NbEIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcblxuTGluZU1ldGEgPSByZXF1aXJlIFwiLi4vaGVscGVycy9saW5lLW1ldGFcIlxuXG5NQVhfU0tJUF9FTVBUWV9MSU5FX0FMTE9XRUQgPSA1XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVkaXRMaW5lXG4gICMgYWN0aW9uOiBpbnNlcnQtbmV3LWxpbmUsIGluZGVudC1saXN0LWxpbmVcbiAgY29uc3RydWN0b3I6IChhY3Rpb24pIC0+XG4gICAgQGFjdGlvbiA9IGFjdGlvblxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICBmbiA9IEBhY3Rpb24ucmVwbGFjZSAvLVthLXpdL2lnLCAocykgLT4gc1sxXS50b1VwcGVyQ2FzZSgpXG5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKS5mb3JFYWNoIChzZWxlY3Rpb24pID0+XG4gICAgICAgIEBbZm5dKGUsIHNlbGVjdGlvbilcblxuICBpbnNlcnROZXdMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuXG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICAjIGRvbid0IGNvbnRpbnVlIGFscGhhIE9MIGlmIHRoZSBsaW5lIGlzIHVuaW5kZW50ZWRcbiAgICBpZiBsaW5lTWV0YS5pc0xpc3QoXCJhbFwiKSAmJiAhbGluZU1ldGEuaXNJbmRlbnRlZCgpXG4gICAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gICAgaWYgbGluZU1ldGEuaXNDb250aW51b3VzKClcbiAgICAgICMgd2hlbiBjdXJzb3IgaXMgYXQgbWlkZGxlIG9mIGxpbmUsIGRvIGEgbm9ybWFsIGluc2VydCBsaW5lXG4gICAgICAjIHVubGVzcyBpbmxpbmUgY29udGludWF0aW9uIGlzIGVuYWJsZWRcbiAgICAgIGlmIGN1cnNvci5jb2x1bW4gPCBsaW5lLmxlbmd0aCAmJiAhY29uZmlnLmdldChcImlubGluZU5ld0xpbmVDb250aW51YXRpb25cIilcbiAgICAgICAgQGVkaXRvci5pbnNlcnRUZXh0KFwiXFxuXCIpXG4gICAgICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChsaW5lTWV0YS5pbmRlbnQpXG4gICAgICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChsaW5lTWV0YS5pbmRlbnRMaW5lVGFiVGV4dCgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgbGluZU1ldGEuaXNFbXB0eUJvZHkoKVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRob3V0Q29udGludWF0aW9uKGN1cnNvcilcbiAgICAgIGVsc2VcbiAgICAgICAgQF9pbnNlcnROZXdsaW5lV2l0aENvbnRpbnVhdGlvbihsaW5lTWV0YSlcbiAgICAgIHJldHVyblxuXG4gICAgaWYgQF9pc1RhYmxlUm93KGN1cnNvciwgbGluZSlcbiAgICAgIHJvdyA9IHV0aWxzLnBhcnNlVGFibGVSb3cobGluZSlcbiAgICAgIGNvbHVtbldpZHRocyA9IHJvdy5jb2x1bW5XaWR0aHMucmVkdWNlKChzdW0sIGkpIC0+IHN1bSArIGkpXG4gICAgICBpZiBjb2x1bW5XaWR0aHMgPT0gMFxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRob3V0VGFibGVDb2x1bW5zKClcbiAgICAgIGVsc2VcbiAgICAgICAgQF9pbnNlcnROZXdsaW5lV2l0aFRhYmxlQ29sdW1ucyhyb3cpXG4gICAgICByZXR1cm5cblxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgX2luc2VydE5ld2xpbmVXaXRoQ29udGludWF0aW9uOiAobGluZU1ldGEpIC0+XG4gICAgbmV4dExpbmUgPSBsaW5lTWV0YS5uZXh0TGluZVxuICAgICMgdXNlIGRlZmF1bHQgaGVhZCBhbmQgZG8gbm90IGluY3JlYXNlIG51bWJlcnMgaW4gT0wgd2hlbiBkaXNhYmxlZCBjb250aW51YXRpb25cbiAgICBpZiBsaW5lTWV0YS5pc0xpc3QoXCJvbFwiKSAmJiAhY29uZmlnLmdldChcIm9yZGVyZWROZXdMaW5lTnVtYmVyQ29udGludWF0aW9uXCIpXG4gICAgICBuZXh0TGluZSA9IGxpbmVNZXRhLmxpbmVIZWFkKGxpbmVNZXRhLmRlZmF1bHRIZWFkKVxuXG4gICAgQGVkaXRvci5pbnNlcnRUZXh0KFwiXFxuI3tuZXh0TGluZX1cIilcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhvdXRDb250aW51YXRpb246IChjdXJzb3IpIC0+XG4gICAgbmV4dExpbmUgPSBcIlxcblwiXG5cbiAgICBjdXJyZW50SW5kZW50YXRpb24gPSBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG4gICAgcGFyZW50TGluZU1ldGEgPSBAX2ZpbmRMaXN0TGluZUJhY2t3YXJkKGN1cnNvci5yb3csIGN1cnJlbnRJbmRlbnRhdGlvbilcbiAgICBuZXh0TGluZSA9IHBhcmVudExpbmVNZXRhLm5leHRMaW5lIGlmIHBhcmVudExpbmVNZXRhICYmICFwYXJlbnRMaW5lTWV0YS5pc0xpc3QoXCJhbFwiKVxuXG4gICAgQGVkaXRvci5zZWxlY3RUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgQGVkaXRvci5pbnNlcnRUZXh0KG5leHRMaW5lKVxuXG4gICMgd2hlbiBhIGxpc3QgbGluZSBpcyBpbmRlbnRlZCwgd2UgbmVlZCB0byBsb29rIGJhY2t3YXJkIChnbyB1cCkgbGluZXMgdG8gZmluZFxuICAjIGl0cyBwYXJlbnQgbGlzdCBsaW5lIGlmIHBvc3NpYmxlIGFuZCB1c2UgdGhhdCBsaW5lIGFzIHJlZmVyZW5jZSBmb3IgbmV3IGluZGVudGF0aW9uIGV0Y1xuICBfZmluZExpc3RMaW5lQmFja3dhcmQ6IChjdXJyZW50Um93LCBjdXJyZW50SW5kZW50YXRpb24pIC0+XG4gICAgcmV0dXJuIGlmIGN1cnJlbnRSb3cgPCAxIHx8IGN1cnJlbnRJbmRlbnRhdGlvbiA8PSAwXG5cbiAgICBlbXB0eUxpbmVTa2lwcGVkID0gMFxuICAgIGZvciByb3cgaW4gWyhjdXJyZW50Um93IC0gMSkuLjBdXG4gICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG5cbiAgICAgIGlmIGxpbmUudHJpbSgpID09IFwiXCIgIyBza2lwIGVtcHR5IGxpbmVzIHdoaWNoIGNvdWxkIGJlIGxpc3QgcGFyYWdyYXBoc1xuICAgICAgICByZXR1cm4gaWYgZW1wdHlMaW5lU2tpcHBlZCA+IE1BWF9TS0lQX0VNUFRZX0xJTkVfQUxMT1dFRFxuICAgICAgICBlbXB0eUxpbmVTa2lwcGVkICs9IDFcblxuICAgICAgZWxzZSAjIGZpbmQgcGFyZW50IGxpc3QgbGluZVxuICAgICAgICBpbmRlbnRhdGlvbiA9IEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocm93KVxuICAgICAgICBjb250aW51ZSBpZiBpbmRlbnRhdGlvbiA+PSBjdXJyZW50SW5kZW50YXRpb24gIyBpZ25vcmUgbGFyZ2VyIGluZGVudGF0aW9uXG5cbiAgICAgICAgIyBoYW5kbGUgY2FzZSB3aGVuIHRoZSBsaW5lIGlzIG5vdCBhIGxpc3QgbGluZVxuICAgICAgICBpZiBpbmRlbnRhdGlvbiA9PSAwXG4gICAgICAgICAgcmV0dXJuIHVubGVzcyBMaW5lTWV0YS5pc0xpc3QobGluZSkgIyBlYXJseSBzdG9wIG9uIGEgcGFyYWdyYXBoXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb250aW51ZSB1bmxlc3MgTGluZU1ldGEuaXNMaXN0KGxpbmUpICMgc2tpcCBvbiBhIHBhcmFncmFwaCBpbiBhIGxpc3RcblxuICAgICAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuICAgICAgICAjIGNhbGN1bGF0ZSB0aGUgZXhwZWN0ZWQgaW5kZW50YXRpb25cbiAgICAgICAgaW5kZW50YXRpb24gPSAobGluZU1ldGEuaW5kZW50Lmxlbmd0aCArIGxpbmVNZXRhLmluZGVudExpbmVUYWJMZW5ndGgoKSkgLyBAZWRpdG9yLmdldFRhYkxlbmd0aCgpXG4gICAgICAgICMgcmV0dXJuIGlmZiB0aGUgbGluZSBpcyB0aGUgaW1tZWRpYXRlIHBhcmVudCAod2l0aGluIDEgaW5kZW50YXRpb24pXG4gICAgICAgIGlmIGN1cnJlbnRJbmRlbnRhdGlvbiA+IGluZGVudGF0aW9uLTEgJiYgY3VycmVudEluZGVudGF0aW9uIDwgaW5kZW50YXRpb24rMVxuICAgICAgICAgIHJldHVybiBsaW5lTWV0YVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuXG5cbiAgX2lzVGFibGVSb3c6IChjdXJzb3IsIGxpbmUpIC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmICFjb25maWcuZ2V0KFwidGFibGVOZXdMaW5lQ29udGludWF0aW9uXCIpXG4gICAgIyBmaXJzdCByb3cgb3Igbm90IGEgcm93XG4gICAgcmV0dXJuIGZhbHNlIGlmIGN1cnNvci5yb3cgPCAxIHx8ICF1dGlscy5pc1RhYmxlUm93KGxpbmUpXG4gICAgIyBjYXNlIDAsIGF0IHRhYmxlIHNlcGFyYXRvciwgY29udGludWUgdGFibGUgcm93XG4gICAgcmV0dXJuIHRydWUgaWYgdXRpbHMuaXNUYWJsZVNlcGFyYXRvcihsaW5lKVxuICAgICMgY2FzZSAxLCBhdCB0YWJsZSByb3csIHByZXZpb3VzIGxpbmUgaXMgYSByb3csIGNvbnRpbnVlIHJvd1xuICAgIHJldHVybiB0cnVlIGlmIHV0aWxzLmlzVGFibGVSb3coQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93LTEpKVxuICAgICMgZWxzZSwgYXQgdGFibGUgaGVhZCwgcHJldmlvdXMgbGluZSBpcyBub3QgYSByb3csIGRvIG5vdCBjb250aW51ZSByb3dcbiAgICByZXR1cm4gZmFsc2VcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhvdXRUYWJsZUNvbHVtbnM6IC0+XG4gICAgQGVkaXRvci5zZWxlY3RMaW5lc0NvbnRhaW5pbmdDdXJzb3JzKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQoXCJcXG5cIilcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhUYWJsZUNvbHVtbnM6IChyb3cpIC0+XG4gICAgb3B0aW9ucyA9XG4gICAgICBudW1PZkNvbHVtbnM6IE1hdGgubWF4KDEsIHJvdy5jb2x1bW5zLmxlbmd0aClcbiAgICAgIGV4dHJhUGlwZXM6IHJvdy5leHRyYVBpcGVzXG4gICAgICBjb2x1bW5XaWR0aDogMVxuICAgICAgY29sdW1uV2lkdGhzOiBbXVxuICAgICAgYWxpZ25tZW50OiBjb25maWcuZ2V0KFwidGFibGVBbGlnbm1lbnRcIilcbiAgICAgIGFsaWdubWVudHM6IFtdXG5cbiAgICBuZXdMaW5lID0gdXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpXG4gICAgQGVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChcIlxcbiN7bmV3TGluZX1cIilcbiAgICBAZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgQGVkaXRvci5tb3ZlVG9OZXh0V29yZEJvdW5kYXJ5KCkgaWYgb3B0aW9ucy5leHRyYVBpcGVzXG5cbiAgaW5kZW50TGlzdExpbmU6IChlLCBzZWxlY3Rpb24pIC0+XG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgQF9pc1JhbmdlU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgIGN1cnNvciA9IHNlbGVjdGlvbi5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG4gICAgIyBkb24ndCBjYXJlIGFib3V0IG5vbi1saXN0IG9yIGFscGhhIGxpc3RcbiAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmICFsaW5lTWV0YS5pc0xpc3QoKSB8fCBsaW5lTWV0YS5pc0xpc3QoXCJhbFwiKVxuXG4gICAgY3VycmVudEluZGVudGF0aW9uID0gQGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KSArIDEgIyBhZGQgMSB0byBpZGVudGlmeSB0aGUgcGFyZW50IGxpc3RcbiAgICBwYXJlbnRMaW5lTWV0YSA9IEBfZmluZExpc3RMaW5lQmFja3dhcmQoY3Vyc29yLnJvdywgY3VycmVudEluZGVudGF0aW9uKVxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIHVubGVzcyBwYXJlbnRMaW5lTWV0YVxuXG4gICAgaWYgbGluZU1ldGEuaXNMaXN0KFwib2xcIilcbiAgICAgIG5ld2xpbmUgPSBcIiN7cGFyZW50TGluZU1ldGEuaW5kZW50TGluZVRhYlRleHQoKX0je2xpbmVNZXRhLmxpbmVIZWFkKGxpbmVNZXRhLmRlZmF1bHRIZWFkKX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIG5ld2N1cnNvciA9IFtjdXJzb3Iucm93LCBjdXJzb3IuY29sdW1uICsgbmV3bGluZS5sZW5ndGggLSBsaW5lLmxlbmd0aF1cbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBuZXdsaW5lLCBuZXdjdXJzb3IpXG4gICAgICByZXR1cm5cblxuICAgIGlmIGxpbmVNZXRhLmlzTGlzdChcInVsXCIpXG4gICAgICBidWxsZXQgPSBAX3VsQnVsbGV0KEBlZGl0b3IsIGN1cnJlbnRJbmRlbnRhdGlvbilcbiAgICAgIGJ1bGxldCA9IGJ1bGxldCB8fCBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXRcIikgfHwgbGluZU1ldGEuZGVmYXVsdEhlYWRcblxuICAgICAgbmV3bGluZSA9IFwiI3twYXJlbnRMaW5lTWV0YS5pbmRlbnRMaW5lVGFiVGV4dCgpfSN7bGluZU1ldGEubGluZUhlYWQoYnVsbGV0KX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIG5ld2N1cnNvciA9IFtjdXJzb3Iucm93LCBjdXJzb3IuY29sdW1uICsgbmV3bGluZS5sZW5ndGggLSBsaW5lLmxlbmd0aF1cbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBuZXdsaW5lLCBuZXdjdXJzb3IpXG4gICAgICByZXR1cm5cblxuICAgIGUuYWJvcnRLZXlCaW5kaW5nKCkgIyB1bm1hdGNoZWQgbGluZVxuXG4gIF9pc1JhbmdlU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIGhlYWQgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICB0YWlsID0gc2VsZWN0aW9uLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBoZWFkLnJvdyAhPSB0YWlsLnJvdyB8fCBoZWFkLmNvbHVtbiAhPSB0YWlsLmNvbHVtblxuXG4gIF9yZXBsYWNlTGluZTogKHNlbGVjdGlvbiwgbGluZSwgY3Vyc29yKSAtPlxuICAgIHJhbmdlID0gc2VsZWN0aW9uLmN1cnNvci5nZXRDdXJyZW50TGluZUJ1ZmZlclJhbmdlKClcbiAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgc2VsZWN0aW9uLmluc2VydFRleHQobGluZSlcbiAgICBzZWxlY3Rpb24uY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKGN1cnNvcilcblxuICBfaXNBdExpbmVCZWdpbm5pbmc6IChsaW5lLCBjb2wpIC0+XG4gICAgY29sID09IDAgfHwgbGluZS5zdWJzdHJpbmcoMCwgY29sKS50cmltKCkgPT0gXCJcIlxuXG4gICMgRklYTUUgdGhpcyBpcyBhIGhhY2sgdG8gaGFuZGxlIGRpZmZlcmVudCB0YWIgbGVuZ3RoLiB0byBmaXggd2UgbmVlZCB0byBjaGFuZ2UgdG8gcGFyc2VcbiAgIyB0aGUgY29tcGxldGUgbGlzdCBpdGVtcyB0byBrbm93IHRoZSBjb3JyZWN0IGluZGVudGF0aW9uIGFuZCByZXdyaXRlIGFsbCBsb2dpYyBpbiB0aGlzIGZpbGVcbiAgX3VsQnVsbGV0OiAoZWRpdG9yLCBpbmRlbnRhdGlvbikgLT5cbiAgICBsYWJlbCA9IFwiXCJcbiAgICAjIGJlc3QgZWZmb3J0IHRvIGJlIGNvcnJlY3QgaW4gdGhlIGZpcnN0IDMgbGV2ZWxzXG4gICAgaWYgZWRpdG9yLmdldFRhYkxlbmd0aCgpIDw9IDJcbiAgICAgIGxhYmVsID0gTWF0aC5mbG9vcihpbmRlbnRhdGlvbilcbiAgICBlbHNlXG4gICAgICBsYWJlbCA9IE1hdGgucm91bmQoaW5kZW50YXRpb24pXG5cbiAgICBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXQje2xhYmVsfVwiKVxuXG4gIHVuZGVudExpc3RMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuICAgICMgZG9uJ3QgY2FyZSBhYm91dCBub24tbGlzdCBvciBhbHBoYSBsaXN0XG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSBpZiAhbGluZU1ldGEuaXNMaXN0KCkgfHwgbGluZU1ldGEuaXNMaXN0KFwiYWxcIilcblxuICAgIGN1cnJlbnRJbmRlbnRhdGlvbiA9IEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coY3Vyc29yLnJvdylcbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSBpZiBjdXJyZW50SW5kZW50YXRpb24gPD0gMFxuXG4gICAgcGFyZW50TGluZU1ldGEgPSBAX2ZpbmRMaXN0TGluZUJhY2t3YXJkKGN1cnNvci5yb3csIGN1cnJlbnRJbmRlbnRhdGlvbilcbiAgICBpZiAhcGFyZW50TGluZU1ldGEgJiYgbGluZU1ldGEuaXNMaXN0KFwidWxcIilcbiAgICAgIGJ1bGxldCA9IEBfdWxCdWxsZXQoQGVkaXRvciwgY3VycmVudEluZGVudGF0aW9uLTEpXG4gICAgICBidWxsZXQgPSBidWxsZXQgfHwgY29uZmlnLmdldChcInRlbXBsYXRlVmFyaWFibGVzLnVsQnVsbGV0XCIpIHx8IGxpbmVNZXRhLmRlZmF1bHRIZWFkXG5cbiAgICAgIG5ld2xpbmUgPSBcIiN7bGluZU1ldGEubGluZUhlYWQoYnVsbGV0KX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIG5ld2xpbmUgPSBuZXdsaW5lLnN1YnN0cmluZyhNYXRoLm1pbihsaW5lTWV0YS5pbmRlbnQubGVuZ3RoLCBAZWRpdG9yLmdldFRhYkxlbmd0aCgpKSkgIyByZW1vdmUgb25lIGluZGVudFxuICAgICAgbmV3Y3Vyc29yID0gW2N1cnNvci5yb3csIE1hdGgubWF4KGN1cnNvci5jb2x1bW4gKyBuZXdsaW5lLmxlbmd0aCAtIGxpbmUubGVuZ3RoLCAwKV1cbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBuZXdsaW5lLCBuZXdjdXJzb3IpXG4gICAgICByZXR1cm5cbiAgICAjIHRyZWF0IGFzIG5vcm1hbCB1bmRlbnQgaWYgbm8gcGFyZW50IGZvdW5kXG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgdW5sZXNzIHBhcmVudExpbmVNZXRhXG5cbiAgICBpZiBwYXJlbnRMaW5lTWV0YS5pc0xpc3QoXCJvbFwiKVxuICAgICAgbmV3bGluZSA9IFwiI3twYXJlbnRMaW5lTWV0YS5saW5lSGVhZChwYXJlbnRMaW5lTWV0YS5kZWZhdWx0SGVhZCl9I3tsaW5lTWV0YS5ib2R5fVwiXG4gICAgICBuZXdjdXJzb3IgPSBbY3Vyc29yLnJvdywgTWF0aC5tYXgoY3Vyc29yLmNvbHVtbiArIG5ld2xpbmUubGVuZ3RoIC0gbGluZS5sZW5ndGgsIDApXVxuICAgICAgQF9yZXBsYWNlTGluZShzZWxlY3Rpb24sIG5ld2xpbmUsIG5ld2N1cnNvcilcbiAgICAgIHJldHVyblxuXG4gICAgaWYgcGFyZW50TGluZU1ldGEuaXNMaXN0KFwidWxcIilcbiAgICAgIG5ld2xpbmUgPSBcIiN7cGFyZW50TGluZU1ldGEubGluZUhlYWQocGFyZW50TGluZU1ldGEuaGVhZCl9I3tsaW5lTWV0YS5ib2R5fVwiXG4gICAgICBuZXdjdXJzb3IgPSBbY3Vyc29yLnJvdywgTWF0aC5tYXgoY3Vyc29yLmNvbHVtbiArIG5ld2xpbmUubGVuZ3RoIC0gbGluZS5sZW5ndGgsIDApXVxuICAgICAgQF9yZXBsYWNlTGluZShzZWxlY3Rpb24sIG5ld2xpbmUsIG5ld2N1cnNvcilcbiAgICAgIHJldHVyblxuXG4gICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuIl19
