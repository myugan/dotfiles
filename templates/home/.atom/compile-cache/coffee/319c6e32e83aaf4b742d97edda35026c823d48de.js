(function() {
  var FormatText, LineMeta, config, utils;

  config = require("../config");

  utils = require("../utils");

  LineMeta = require("../helpers/line-meta");

  module.exports = FormatText = (function() {
    function FormatText(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    FormatText.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          var formattedText, paragraphRange, range, text;
          paragraphRange = _this.editor.getCurrentParagraphBufferRange();
          range = _this.editor.getSelectedBufferRange();
          if (paragraphRange) {
            range = paragraphRange.union(range);
          }
          if (range.start.row === range.end.row) {
            return;
          }
          text = _this.editor.getTextInBufferRange(range);
          if (text.trim() === "") {
            return;
          }
          text = text.split(/\r?\n/);
          formattedText = _this[fn](e, range, text);
          if (formattedText) {
            return _this.editor.setTextInBufferRange(range, formattedText);
          }
        };
      })(this));
    };

    FormatText.prototype.correctOrderListNumbers = function(e, range, lines) {
      return this.formatOrderList(e, range, lines);
    };

    FormatText.prototype.formatOrderList = function(e, range, lines) {
      var correctedLines, idx, indent, indentStack, j, len, line, lineMeta, orderStack;
      correctedLines = [];
      indentStack = [];
      orderStack = [];
      for (idx = j = 0, len = lines.length; j < len; idx = ++j) {
        line = lines[idx];
        lineMeta = new LineMeta(line);
        if (lineMeta.isList("ol")) {
          indent = lineMeta.indent;
          if (indentStack.length === 0 || indent.length > indentStack[0].length) {
            indentStack.unshift(indent);
            orderStack.unshift(lineMeta.defaultHead);
          } else if (indent.length < indentStack[0].length) {
            while (indentStack.length > 0 && indent.length !== indentStack[0].length) {
              indentStack.shift();
              orderStack.shift();
            }
            if (orderStack.length === 0) {
              indentStack.unshift(indent);
              orderStack.unshift(lineMeta.defaultHead);
            } else {
              orderStack.unshift(LineMeta.incStr(orderStack.shift()));
            }
          } else {
            orderStack.unshift(LineMeta.incStr(orderStack.shift()));
          }
          correctedLines[idx] = "" + indentStack[0] + orderStack[0] + ". " + lineMeta.body;
        } else {
          correctedLines[idx] = line;
        }
      }
      return correctedLines.join("\n");
    };

    FormatText.prototype.formatTable = function(e, range, lines) {
      var j, len, options, ref, ref1, row, rows, table;
      if (lines.some(function(line) {
        return line.trim() !== "" && !utils.isTableRow(line);
      })) {
        return;
      }
      ref = this._parseTable(lines), rows = ref.rows, options = ref.options;
      table = [];
      table.push(utils.createTableRow(rows[0], options).trimRight());
      table.push(utils.createTableSeparator(options));
      ref1 = rows.slice(1);
      for (j = 0, len = ref1.length; j < len; j++) {
        row = ref1[j];
        table.push(utils.createTableRow(row, options).trimRight());
      }
      return table.join("\n");
    };

    FormatText.prototype._parseTable = function(lines) {
      var columnWidth, i, j, k, len, len1, line, options, ref, row, rows, separator;
      rows = [];
      options = {
        numOfColumns: 1,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      for (j = 0, len = lines.length; j < len; j++) {
        line = lines[j];
        if (line.trim() === "") {
          continue;
        } else if (utils.isTableSeparator(line)) {
          separator = utils.parseTableSeparator(line);
          options.extraPipes = options.extraPipes || separator.extraPipes;
          options.alignments = separator.alignments;
          options.numOfColumns = Math.max(options.numOfColumns, separator.columns.length);
        } else {
          row = utils.parseTableRow(line);
          rows.push(row.columns);
          options.numOfColumns = Math.max(options.numOfColumns, row.columns.length);
          ref = row.columnWidths;
          for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
            columnWidth = ref[i];
            options.columnWidths[i] = Math.max(options.columnWidths[i] || 0, columnWidth);
          }
        }
      }
      return {
        rows: rows,
        options: options
      };
    };

    return FormatText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9mb3JtYXQtdGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsUUFBQSxHQUFXLE9BQUEsQ0FBUSxzQkFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsb0JBQUMsTUFBRDtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUZDOzt5QkFJYixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBQyxDQUFEO2VBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQUwsQ0FBQTtNQUFQLENBQTVCO2FBRUwsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUVmLGNBQUE7VUFBQSxjQUFBLEdBQWlCLEtBQUMsQ0FBQSxNQUFNLENBQUMsOEJBQVIsQ0FBQTtVQUVqQixLQUFBLEdBQVEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBO1VBQ1IsSUFBdUMsY0FBdkM7WUFBQSxLQUFBLEdBQVEsY0FBYyxDQUFDLEtBQWYsQ0FBcUIsS0FBckIsRUFBUjs7VUFDQSxJQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBWixLQUFtQixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQXZDO0FBQUEsbUJBQUE7O1VBRUEsSUFBQSxHQUFPLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0I7VUFDUCxJQUFVLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBQSxLQUFlLEVBQXpCO0FBQUEsbUJBQUE7O1VBRUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWDtVQUNQLGFBQUEsR0FBZ0IsS0FBRSxDQUFBLEVBQUEsQ0FBRixDQUFNLENBQU4sRUFBUyxLQUFULEVBQWdCLElBQWhCO1VBQ2hCLElBQXNELGFBQXREO21CQUFBLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0IsRUFBb0MsYUFBcEMsRUFBQTs7UUFiZTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7SUFITzs7eUJBa0JULHVCQUFBLEdBQXlCLFNBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxLQUFYO2FBQ3ZCLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQWpCLEVBQW9CLEtBQXBCLEVBQTJCLEtBQTNCO0lBRHVCOzt5QkFHekIsZUFBQSxHQUFpQixTQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsS0FBWDtBQUNmLFVBQUE7TUFBQSxjQUFBLEdBQWlCO01BRWpCLFdBQUEsR0FBYztNQUNkLFVBQUEsR0FBYTtBQUNiLFdBQUEsbURBQUE7O1FBQ0UsUUFBQSxHQUFXLElBQUksUUFBSixDQUFhLElBQWI7UUFFWCxJQUFHLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLENBQUg7VUFDRSxNQUFBLEdBQVMsUUFBUSxDQUFDO1VBRWxCLElBQUcsV0FBVyxDQUFDLE1BQVosS0FBc0IsQ0FBdEIsSUFBMkIsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTdEO1lBQ0UsV0FBVyxDQUFDLE9BQVosQ0FBb0IsTUFBcEI7WUFDQSxVQUFVLENBQUMsT0FBWCxDQUFtQixRQUFRLENBQUMsV0FBNUIsRUFGRjtXQUFBLE1BR0ssSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixXQUFZLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBbEM7QUFFSCxtQkFBTSxXQUFXLENBQUMsTUFBWixHQUFxQixDQUFyQixJQUEwQixNQUFNLENBQUMsTUFBUCxLQUFpQixXQUFZLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBaEU7Y0FDRSxXQUFXLENBQUMsS0FBWixDQUFBO2NBQ0EsVUFBVSxDQUFDLEtBQVgsQ0FBQTtZQUZGO1lBSUEsSUFBRyxVQUFVLENBQUMsTUFBWCxLQUFxQixDQUF4QjtjQUNFLFdBQVcsQ0FBQyxPQUFaLENBQW9CLE1BQXBCO2NBQ0EsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsUUFBUSxDQUFDLFdBQTVCLEVBRkY7YUFBQSxNQUFBO2NBSUUsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsVUFBVSxDQUFDLEtBQVgsQ0FBQSxDQUFoQixDQUFuQixFQUpGO2FBTkc7V0FBQSxNQUFBO1lBWUgsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsVUFBVSxDQUFDLEtBQVgsQ0FBQSxDQUFoQixDQUFuQixFQVpHOztVQWNMLGNBQWUsQ0FBQSxHQUFBLENBQWYsR0FBc0IsRUFBQSxHQUFHLFdBQVksQ0FBQSxDQUFBLENBQWYsR0FBb0IsVUFBVyxDQUFBLENBQUEsQ0FBL0IsR0FBa0MsSUFBbEMsR0FBc0MsUUFBUSxDQUFDLEtBcEJ2RTtTQUFBLE1BQUE7VUFzQkUsY0FBZSxDQUFBLEdBQUEsQ0FBZixHQUFzQixLQXRCeEI7O0FBSEY7YUEyQkEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBcEI7SUFoQ2U7O3lCQWtDakIsV0FBQSxHQUFhLFNBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxLQUFYO0FBQ1gsVUFBQTtNQUFBLElBQVUsS0FBSyxDQUFDLElBQU4sQ0FBVyxTQUFDLElBQUQ7ZUFBVSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQUEsS0FBZSxFQUFmLElBQXFCLENBQUMsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakI7TUFBaEMsQ0FBWCxDQUFWO0FBQUEsZUFBQTs7TUFFQSxNQUFvQixJQUFDLENBQUEsV0FBRCxDQUFhLEtBQWIsQ0FBcEIsRUFBRSxlQUFGLEVBQVE7TUFFUixLQUFBLEdBQVE7TUFFUixLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUssQ0FBQSxDQUFBLENBQTFCLEVBQThCLE9BQTlCLENBQXNDLENBQUMsU0FBdkMsQ0FBQSxDQUFYO01BRUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsb0JBQU4sQ0FBMkIsT0FBM0IsQ0FBWDtBQUVBO0FBQUEsV0FBQSxzQ0FBQTs7UUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxjQUFOLENBQXFCLEdBQXJCLEVBQTBCLE9BQTFCLENBQWtDLENBQUMsU0FBbkMsQ0FBQSxDQUFYO0FBQUE7YUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVg7SUFiVzs7eUJBZWIsV0FBQSxHQUFhLFNBQUMsS0FBRDtBQUNYLFVBQUE7TUFBQSxJQUFBLEdBQU87TUFDUCxPQUFBLEdBQ0U7UUFBQSxZQUFBLEVBQWMsQ0FBZDtRQUNBLFVBQUEsRUFBWSxNQUFNLENBQUMsR0FBUCxDQUFXLGlCQUFYLENBRFo7UUFFQSxXQUFBLEVBQWEsQ0FGYjtRQUdBLFlBQUEsRUFBYyxFQUhkO1FBSUEsU0FBQSxFQUFXLE1BQU0sQ0FBQyxHQUFQLENBQVcsZ0JBQVgsQ0FKWDtRQUtBLFVBQUEsRUFBWSxFQUxaOztBQU9GLFdBQUEsdUNBQUE7O1FBQ0UsSUFBRyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQUEsS0FBZSxFQUFsQjtBQUNFLG1CQURGO1NBQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixJQUF2QixDQUFIO1VBQ0gsU0FBQSxHQUFZLEtBQUssQ0FBQyxtQkFBTixDQUEwQixJQUExQjtVQUNaLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLE9BQU8sQ0FBQyxVQUFSLElBQXNCLFNBQVMsQ0FBQztVQUNyRCxPQUFPLENBQUMsVUFBUixHQUFxQixTQUFTLENBQUM7VUFDL0IsT0FBTyxDQUFDLFlBQVIsR0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFPLENBQUMsWUFBakIsRUFBK0IsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFqRCxFQUpwQjtTQUFBLE1BQUE7VUFNSCxHQUFBLEdBQU0sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEI7VUFDTixJQUFJLENBQUMsSUFBTCxDQUFVLEdBQUcsQ0FBQyxPQUFkO1VBQ0EsT0FBTyxDQUFDLFlBQVIsR0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFPLENBQUMsWUFBakIsRUFBK0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUEzQztBQUN2QjtBQUFBLGVBQUEsK0NBQUE7O1lBQ0UsT0FBTyxDQUFDLFlBQWEsQ0FBQSxDQUFBLENBQXJCLEdBQTBCLElBQUksQ0FBQyxHQUFMLENBQVMsT0FBTyxDQUFDLFlBQWEsQ0FBQSxDQUFBLENBQXJCLElBQTJCLENBQXBDLEVBQXVDLFdBQXZDO0FBRDVCLFdBVEc7O0FBSFA7YUFlQTtRQUFBLElBQUEsRUFBTSxJQUFOO1FBQVksT0FBQSxFQUFTLE9BQXJCOztJQXpCVzs7Ozs7QUFqRmYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcbkxpbmVNZXRhID0gcmVxdWlyZSBcIi4uL2hlbHBlcnMvbGluZS1tZXRhXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRm9ybWF0VGV4dFxuICAjIGFjdGlvbjogY29ycmVjdC1vcmRlci1saXN0LW51bWJlcnMsIGZvcm1hdC10YWJsZVxuICBjb25zdHJ1Y3RvcjogKGFjdGlvbikgLT5cbiAgICBAYWN0aW9uID0gYWN0aW9uXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIHRyaWdnZXI6IChlKSAtPlxuICAgIGZuID0gQGFjdGlvbi5yZXBsYWNlIC8tW2Etel0vaWcsIChzKSAtPiBzWzFdLnRvVXBwZXJDYXNlKClcblxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgICMgY3VycmVudCBwYXJhZ3JhcGggcmFuZ2UgY291bGQgYmUgdW5kZWZpbmVkIGlmIHRoZSBjdXJzb3IgaXMgYXQgYW4gZW1wdHkgbGluZVxuICAgICAgcGFyYWdyYXBoUmFuZ2UgPSBAZWRpdG9yLmdldEN1cnJlbnRQYXJhZ3JhcGhCdWZmZXJSYW5nZSgpXG5cbiAgICAgIHJhbmdlID0gQGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICAgIHJhbmdlID0gcGFyYWdyYXBoUmFuZ2UudW5pb24ocmFuZ2UpIGlmIHBhcmFncmFwaFJhbmdlXG4gICAgICByZXR1cm4gaWYgcmFuZ2Uuc3RhcnQucm93ID09IHJhbmdlLmVuZC5yb3dcblxuICAgICAgdGV4dCA9IEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICByZXR1cm4gaWYgdGV4dC50cmltKCkgPT0gXCJcIlxuXG4gICAgICB0ZXh0ID0gdGV4dC5zcGxpdCgvXFxyP1xcbi8pXG4gICAgICBmb3JtYXR0ZWRUZXh0ID0gQFtmbl0oZSwgcmFuZ2UsIHRleHQpXG4gICAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCBmb3JtYXR0ZWRUZXh0KSBpZiBmb3JtYXR0ZWRUZXh0XG5cbiAgY29ycmVjdE9yZGVyTGlzdE51bWJlcnM6IChlLCByYW5nZSwgbGluZXMpIC0+ICMgREVQUkVDQVRFRFxuICAgIEBmb3JtYXRPcmRlckxpc3QoZSwgcmFuZ2UsIGxpbmVzKVxuICBcbiAgZm9ybWF0T3JkZXJMaXN0OiAoZSwgcmFuZ2UsIGxpbmVzKSAtPlxuICAgIGNvcnJlY3RlZExpbmVzID0gW11cblxuICAgIGluZGVudFN0YWNrID0gW11cbiAgICBvcmRlclN0YWNrID0gW11cbiAgICBmb3IgbGluZSwgaWR4IGluIGxpbmVzXG4gICAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuXG4gICAgICBpZiBsaW5lTWV0YS5pc0xpc3QoXCJvbFwiKVxuICAgICAgICBpbmRlbnQgPSBsaW5lTWV0YS5pbmRlbnRcblxuICAgICAgICBpZiBpbmRlbnRTdGFjay5sZW5ndGggPT0gMCB8fCBpbmRlbnQubGVuZ3RoID4gaW5kZW50U3RhY2tbMF0ubGVuZ3RoICMgZmlyc3Qgb2wvc3ViLW9sIG1hdGNoXG4gICAgICAgICAgaW5kZW50U3RhY2sudW5zaGlmdChpbmRlbnQpXG4gICAgICAgICAgb3JkZXJTdGFjay51bnNoaWZ0KGxpbmVNZXRhLmRlZmF1bHRIZWFkKVxuICAgICAgICBlbHNlIGlmIGluZGVudC5sZW5ndGggPCBpbmRlbnRTdGFja1swXS5sZW5ndGggIyBlbmQgb2YgYSBzdWItb2wgbWF0Y2hcbiAgICAgICAgICAjIHBvcCBvdXQgc3RhY2sgdW50aWwgd2UgYXJlIGJhY2sgdG8gdGhlIHNhbWUgaW5kZW50IHN0YWNrXG4gICAgICAgICAgd2hpbGUgaW5kZW50U3RhY2subGVuZ3RoID4gMCAmJiBpbmRlbnQubGVuZ3RoICE9IGluZGVudFN0YWNrWzBdLmxlbmd0aFxuICAgICAgICAgICAgaW5kZW50U3RhY2suc2hpZnQoKVxuICAgICAgICAgICAgb3JkZXJTdGFjay5zaGlmdCgpXG5cbiAgICAgICAgICBpZiBvcmRlclN0YWNrLmxlbmd0aCA9PSAwICMgaW4gY2FzZSB3ZSBhcmUgYmFjayB0byB0b3AgbGV2ZWwsIElzc3VlICMxODhcbiAgICAgICAgICAgIGluZGVudFN0YWNrLnVuc2hpZnQoaW5kZW50KVxuICAgICAgICAgICAgb3JkZXJTdGFjay51bnNoaWZ0KGxpbmVNZXRhLmRlZmF1bHRIZWFkKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9yZGVyU3RhY2sudW5zaGlmdChMaW5lTWV0YS5pbmNTdHIob3JkZXJTdGFjay5zaGlmdCgpKSlcbiAgICAgICAgZWxzZSAjIHNhbWUgbGV2ZWwgb2wgbWF0Y2hcbiAgICAgICAgICBvcmRlclN0YWNrLnVuc2hpZnQoTGluZU1ldGEuaW5jU3RyKG9yZGVyU3RhY2suc2hpZnQoKSkpXG5cbiAgICAgICAgY29ycmVjdGVkTGluZXNbaWR4XSA9IFwiI3tpbmRlbnRTdGFja1swXX0je29yZGVyU3RhY2tbMF19LiAje2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgY29ycmVjdGVkTGluZXNbaWR4XSA9IGxpbmVcblxuICAgIGNvcnJlY3RlZExpbmVzLmpvaW4oXCJcXG5cIilcblxuICBmb3JtYXRUYWJsZTogKGUsIHJhbmdlLCBsaW5lcykgLT5cbiAgICByZXR1cm4gaWYgbGluZXMuc29tZSAobGluZSkgLT4gbGluZS50cmltKCkgIT0gXCJcIiAmJiAhdXRpbHMuaXNUYWJsZVJvdyhsaW5lKVxuXG4gICAgeyByb3dzLCBvcHRpb25zIH0gPSBAX3BhcnNlVGFibGUobGluZXMpXG5cbiAgICB0YWJsZSA9IFtdXG4gICAgIyB0YWJsZSBoZWFkXG4gICAgdGFibGUucHVzaCh1dGlscy5jcmVhdGVUYWJsZVJvdyhyb3dzWzBdLCBvcHRpb25zKS50cmltUmlnaHQoKSlcbiAgICAjIHRhYmxlIHNlcGFyYXRvclxuICAgIHRhYmxlLnB1c2godXRpbHMuY3JlYXRlVGFibGVTZXBhcmF0b3Iob3B0aW9ucykpXG4gICAgIyB0YWJsZSBib2R5XG4gICAgdGFibGUucHVzaCh1dGlscy5jcmVhdGVUYWJsZVJvdyhyb3csIG9wdGlvbnMpLnRyaW1SaWdodCgpKSBmb3Igcm93IGluIHJvd3NbMS4uXVxuICAgICMgdGFibGUgam9pbiByb3dzXG4gICAgdGFibGUuam9pbihcIlxcblwiKVxuXG4gIF9wYXJzZVRhYmxlOiAobGluZXMpIC0+XG4gICAgcm93cyA9IFtdXG4gICAgb3B0aW9ucyA9XG4gICAgICBudW1PZkNvbHVtbnM6IDFcbiAgICAgIGV4dHJhUGlwZXM6IGNvbmZpZy5nZXQoXCJ0YWJsZUV4dHJhUGlwZXNcIilcbiAgICAgIGNvbHVtbldpZHRoOiAxXG4gICAgICBjb2x1bW5XaWR0aHM6IFtdXG4gICAgICBhbGlnbm1lbnQ6IGNvbmZpZy5nZXQoXCJ0YWJsZUFsaWdubWVudFwiKVxuICAgICAgYWxpZ25tZW50czogW11cblxuICAgIGZvciBsaW5lIGluIGxpbmVzXG4gICAgICBpZiBsaW5lLnRyaW0oKSA9PSBcIlwiXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBlbHNlIGlmIHV0aWxzLmlzVGFibGVTZXBhcmF0b3IobGluZSlcbiAgICAgICAgc2VwYXJhdG9yID0gdXRpbHMucGFyc2VUYWJsZVNlcGFyYXRvcihsaW5lKVxuICAgICAgICBvcHRpb25zLmV4dHJhUGlwZXMgPSBvcHRpb25zLmV4dHJhUGlwZXMgfHwgc2VwYXJhdG9yLmV4dHJhUGlwZXNcbiAgICAgICAgb3B0aW9ucy5hbGlnbm1lbnRzID0gc2VwYXJhdG9yLmFsaWdubWVudHNcbiAgICAgICAgb3B0aW9ucy5udW1PZkNvbHVtbnMgPSBNYXRoLm1heChvcHRpb25zLm51bU9mQ29sdW1ucywgc2VwYXJhdG9yLmNvbHVtbnMubGVuZ3RoKVxuICAgICAgZWxzZVxuICAgICAgICByb3cgPSB1dGlscy5wYXJzZVRhYmxlUm93KGxpbmUpXG4gICAgICAgIHJvd3MucHVzaChyb3cuY29sdW1ucylcbiAgICAgICAgb3B0aW9ucy5udW1PZkNvbHVtbnMgPSBNYXRoLm1heChvcHRpb25zLm51bU9mQ29sdW1ucywgcm93LmNvbHVtbnMubGVuZ3RoKVxuICAgICAgICBmb3IgY29sdW1uV2lkdGgsIGkgaW4gcm93LmNvbHVtbldpZHRoc1xuICAgICAgICAgIG9wdGlvbnMuY29sdW1uV2lkdGhzW2ldID0gTWF0aC5tYXgob3B0aW9ucy5jb2x1bW5XaWR0aHNbaV0gfHwgMCwgY29sdW1uV2lkdGgpXG5cbiAgICByb3dzOiByb3dzLCBvcHRpb25zOiBvcHRpb25zXG4iXX0=
