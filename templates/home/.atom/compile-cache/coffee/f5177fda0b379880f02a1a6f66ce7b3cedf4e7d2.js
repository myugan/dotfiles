(function() {
  var FoldText, config, heading, utils;

  config = require("../config");

  utils = require("../utils");

  heading = require("../helpers/heading");

  module.exports = FoldText = (function() {
    function FoldText(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    FoldText.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this[fn]();
    };

    FoldText.prototype.foldLinks = function() {
      return utils.scanLinks(this.editor, (function(_this) {
        return function(range) {
          return _this.editor.foldBufferRange(range);
        };
      })(this));
    };

    FoldText.prototype.foldHeadings = function(depth) {
      var headers;
      if (depth == null) {
        depth = 6;
      }
      headers = this._flattenHeaders([], heading.listAll(this.editor), depth);
      return this._foldHeaders(headers);
    };

    FoldText.prototype._flattenHeaders = function(list, headers, depth) {
      var header, j, len;
      for (j = 0, len = headers.length; j < len; j++) {
        header = headers[j];
        if (header.depth > depth) {
          continue;
        }
        list.push(header.range);
        this._flattenHeaders(list, header.children, depth);
      }
      return list;
    };

    FoldText.prototype._foldHeaders = function(headers) {
      var endPos, eof, pos, results;
      eof = this.editor.getEofBufferPosition();
      results = [];
      while (pos = headers.shift()) {
        endPos = headers[0] ? headers[0].start : eof;
        endPos.row -= 1;
        endPos.column = this.editor.lineTextForBufferRow(endPos.row).length;
        if (endPos.column === 0) {
          endPos.row -= 1;
          endPos.column = this.editor.lineTextForBufferRow(endPos.row).length;
        }
        if (pos.end.row !== endPos.row) {
          results.push(this.editor.foldBufferRange([pos.end, endPos]));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    FoldText.prototype.foldH1 = function() {
      return this.foldHeadings(1);
    };

    FoldText.prototype.foldH2 = function() {
      return this.foldHeadings(2);
    };

    FoldText.prototype.foldH3 = function() {
      return this.foldHeadings(3);
    };

    FoldText.prototype.focusCurrentHeading = function() {
      var i, j, pos, results;
      this.foldHeadings();
      pos = this.editor.getCursorBufferPosition();
      results = [];
      for (i = j = 0; j <= 2; i = ++j) {
        if (this.editor.isFoldedAtBufferRow(pos.row - i)) {
          this.editor.unfoldBufferRow(pos.row - i);
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return FoldText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9mb2xkLXRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLGtCQUFDLE1BQUQ7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFGQzs7dUJBSWIsT0FBQSxHQUFTLFNBQUMsQ0FBRDtBQUNQLFVBQUE7TUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLEVBQTRCLFNBQUMsQ0FBRDtlQUFPLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFMLENBQUE7TUFBUCxDQUE1QjthQUNMLElBQUUsQ0FBQSxFQUFBLENBQUYsQ0FBQTtJQUZPOzt1QkFJVCxTQUFBLEdBQVcsU0FBQTthQUNULEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQUMsQ0FBQSxNQUFqQixFQUF5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFBVyxLQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBd0IsS0FBeEI7UUFBWDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekI7SUFEUzs7dUJBR1gsWUFBQSxHQUFjLFNBQUMsS0FBRDtBQUNaLFVBQUE7O1FBRGEsUUFBUTs7TUFDckIsT0FBQSxHQUFVLElBQUMsQ0FBQSxlQUFELENBQWlCLEVBQWpCLEVBQXFCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQUMsQ0FBQSxNQUFqQixDQUFyQixFQUErQyxLQUEvQzthQUNWLElBQUMsQ0FBQSxZQUFELENBQWMsT0FBZDtJQUZZOzt1QkFJZCxlQUFBLEdBQWlCLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsS0FBaEI7QUFDZixVQUFBO0FBQUEsV0FBQSx5Q0FBQTs7UUFDRSxJQUFZLE1BQU0sQ0FBQyxLQUFQLEdBQWUsS0FBM0I7QUFBQSxtQkFBQTs7UUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBQyxLQUFqQjtRQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLEVBQXVCLE1BQU0sQ0FBQyxRQUE5QixFQUF3QyxLQUF4QztBQUpGO0FBS0EsYUFBTztJQU5ROzt1QkFRakIsWUFBQSxHQUFjLFNBQUMsT0FBRDtBQUNaLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBO0FBQ047YUFBTSxHQUFBLEdBQU0sT0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUFaO1FBQ0UsTUFBQSxHQUFZLE9BQVEsQ0FBQSxDQUFBLENBQVgsR0FBbUIsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQTlCLEdBQXlDO1FBRWxELE1BQU0sQ0FBQyxHQUFQLElBQWM7UUFDZCxNQUFNLENBQUMsTUFBUCxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLE1BQU0sQ0FBQyxHQUFwQyxDQUF3QyxDQUFDO1FBRXpELElBQUcsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBcEI7VUFDRSxNQUFNLENBQUMsR0FBUCxJQUFjO1VBQ2QsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUFNLENBQUMsR0FBcEMsQ0FBd0MsQ0FBQyxPQUYzRDs7UUFJQSxJQUFrRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQVIsS0FBZSxNQUFNLENBQUMsR0FBeEU7dUJBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLENBQUMsR0FBRyxDQUFDLEdBQUwsRUFBVSxNQUFWLENBQXhCLEdBQUE7U0FBQSxNQUFBOytCQUFBOztNQVZGLENBQUE7O0lBRlk7O3VCQWNkLE1BQUEsR0FBUSxTQUFBO2FBQUcsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkO0lBQUg7O3VCQUNSLE1BQUEsR0FBUSxTQUFBO2FBQUcsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkO0lBQUg7O3VCQUNSLE1BQUEsR0FBUSxTQUFBO2FBQUcsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkO0lBQUg7O3VCQUVSLG1CQUFBLEdBQXFCLFNBQUE7QUFDbkIsVUFBQTtNQUFBLElBQUMsQ0FBQSxZQUFELENBQUE7TUFFQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBO0FBQ047V0FBUywwQkFBVDtRQUNFLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixHQUFHLENBQUMsR0FBSixHQUFVLENBQXRDLENBQUg7VUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBd0IsR0FBRyxDQUFDLEdBQUosR0FBVSxDQUFsQztBQUNBLGdCQUZGO1NBQUEsTUFBQTsrQkFBQTs7QUFERjs7SUFKbUI7Ozs7O0FBaER2QiIsInNvdXJjZXNDb250ZW50IjpbImNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuaGVhZGluZyA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL2hlYWRpbmdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGb2xkVGV4dFxuICAjIGFjdGlvbjogZm9sZC1saW5rc1xuICBjb25zdHJ1Y3RvcjogKGFjdGlvbikgLT5cbiAgICBAYWN0aW9uID0gYWN0aW9uXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIHRyaWdnZXI6IChlKSAtPlxuICAgIGZuID0gQGFjdGlvbi5yZXBsYWNlIC8tW2Etel0vaWcsIChzKSAtPiBzWzFdLnRvVXBwZXJDYXNlKClcbiAgICBAW2ZuXSgpXG5cbiAgZm9sZExpbmtzOiAtPlxuICAgIHV0aWxzLnNjYW5MaW5rcyBAZWRpdG9yLCAocmFuZ2UpID0+IEBlZGl0b3IuZm9sZEJ1ZmZlclJhbmdlKHJhbmdlKVxuXG4gIGZvbGRIZWFkaW5nczogKGRlcHRoID0gNikgLT5cbiAgICBoZWFkZXJzID0gQF9mbGF0dGVuSGVhZGVycyhbXSwgaGVhZGluZy5saXN0QWxsKEBlZGl0b3IpLCBkZXB0aClcbiAgICBAX2ZvbGRIZWFkZXJzKGhlYWRlcnMpXG5cbiAgX2ZsYXR0ZW5IZWFkZXJzOiAobGlzdCwgaGVhZGVycywgZGVwdGgpIC0+XG4gICAgZm9yIGhlYWRlciBpbiBoZWFkZXJzXG4gICAgICBjb250aW51ZSBpZiBoZWFkZXIuZGVwdGggPiBkZXB0aFxuXG4gICAgICBsaXN0LnB1c2goaGVhZGVyLnJhbmdlKVxuICAgICAgQF9mbGF0dGVuSGVhZGVycyhsaXN0LCBoZWFkZXIuY2hpbGRyZW4sIGRlcHRoKVxuICAgIHJldHVybiBsaXN0XG5cbiAgX2ZvbGRIZWFkZXJzOiAoaGVhZGVycykgLT5cbiAgICBlb2YgPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICB3aGlsZSBwb3MgPSBoZWFkZXJzLnNoaWZ0KClcbiAgICAgIGVuZFBvcyA9IGlmIGhlYWRlcnNbMF0gdGhlbiBoZWFkZXJzWzBdLnN0YXJ0IGVsc2UgZW9mXG4gICAgICAjIG1vdmUgdXAgdG8gZW5kIG9mIHByZXZpb3VzIHJvd1xuICAgICAgZW5kUG9zLnJvdyAtPSAxXG4gICAgICBlbmRQb3MuY29sdW1uID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhlbmRQb3Mucm93KS5sZW5ndGhcbiAgICAgICMgc2xpZ2h0IHZpc3VhbCBvcHRpbWl6YXRpb25zLCBza2lwIGFuIGVtcHR5IGxpbmVcbiAgICAgIGlmIGVuZFBvcy5jb2x1bW4gPT0gMFxuICAgICAgICBlbmRQb3Mucm93IC09IDFcbiAgICAgICAgZW5kUG9zLmNvbHVtbiA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coZW5kUG9zLnJvdykubGVuZ3RoXG4gICAgICAjIHNraXAgZm9sZCBpZiBlbmRQb3MgaXMgYXQgdGhlIHNhbWUgbGluZSBub3dcbiAgICAgIEBlZGl0b3IuZm9sZEJ1ZmZlclJhbmdlKFtwb3MuZW5kLCBlbmRQb3NdKSB1bmxlc3MgcG9zLmVuZC5yb3cgPT0gZW5kUG9zLnJvd1xuXG4gIGZvbGRIMTogLT4gQGZvbGRIZWFkaW5ncygxKVxuICBmb2xkSDI6IC0+IEBmb2xkSGVhZGluZ3MoMilcbiAgZm9sZEgzOiAtPiBAZm9sZEhlYWRpbmdzKDMpXG5cbiAgZm9jdXNDdXJyZW50SGVhZGluZzogLT5cbiAgICBAZm9sZEhlYWRpbmdzKClcblxuICAgIHBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGZvciBpIGluIFswLi4yXSAjIGxvb2sgMiByb3dzIGFib3ZlLCBjb25zaWRlciBvbmUgZW1wdHkgbGluZVxuICAgICAgaWYgQGVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KHBvcy5yb3cgLSBpKVxuICAgICAgICBAZWRpdG9yLnVuZm9sZEJ1ZmZlclJvdyhwb3Mucm93IC0gaSlcbiAgICAgICAgYnJlYWtcbiJdfQ==
