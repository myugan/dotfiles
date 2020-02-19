(function() {
  var EditToc, anchor, config, heading;

  anchor = require("anchor-markdown-header");

  config = require("../config");

  heading = require("../helpers/heading");

  module.exports = EditToc = (function() {
    function EditToc(command) {
      this.command = command;
      this.editor = atom.workspace.getActiveTextEditor();
      this.cursor = this.editor.getCursorBufferPosition();
    }

    EditToc.prototype.trigger = function(e) {
      var fn;
      fn = this.command.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this[fn](e);
    };

    EditToc.prototype.insertToc = function(e) {
      var headers, toc;
      toc = this._findToc();
      headers = heading.listAll(this.editor);
      return this._writeToc(toc, headers);
    };

    EditToc.prototype.updateToc = function(e) {
      var headers, toc;
      toc = this._findToc();
      if (!toc.found) {
        return;
      }
      headers = heading.listAll(this.editor);
      return this._writeToc(toc, headers);
    };

    EditToc.prototype._findToc = function() {
      var toc;
      toc = {
        found: false,
        opts: Object.assign({}, config.get("toc"))
      };
      this.editor.buffer.scan(/^<!-- +TOC +(.+? +)-->$/, function(match) {
        var i, k, len, opt, ref, ref1, results, v;
        toc.head = {
          pos: match.range.start,
          text: match.match[0]
        };
        ref = match.match[1].split(" ");
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          opt = ref[i];
          ref1 = opt.split(":"), k = ref1[0], v = ref1[1];
          if (k === "depthFrom" || k === "depthTo") {
            results.push(toc.opts[k] = parseInt(v) || opts[k]);
          } else if (k === "insertAnchor") {
            results.push(toc.opts[k] = v === "true");
          } else if (k === "anchorMode") {
            results.push(toc.opts[k] = v || opts[k]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
      if (!toc.head) {
        return toc;
      }
      this.editor.buffer.scan(/^<!-- +\/TOC +-->$/, function(match) {
        return toc.tail = {
          pos: match.range.end,
          text: match.match[0]
        };
      });
      if (!toc.tail) {
        return toc;
      }
      if (toc.head.pos.row < toc.tail.pos.row) {
        toc.found = true;
      }
      return toc;
    };

    EditToc.prototype._writeToc = function(toc, headers) {
      var lines, text;
      lines = [];
      this._writeTocHead(lines, toc);
      this._writeHeaders(lines, toc.opts, "", headers);
      this._writeTocTail(lines, toc);
      text = lines.join("\n");
      if (toc.found) {
        return this.editor.setTextInBufferRange([toc.head.pos, toc.tail.pos], text);
      } else {
        return this.editor.insertText(text);
      }
    };

    EditToc.prototype._writeTocHead = function(lines, toc) {
      if (toc.found) {
        lines.push(toc.head.text);
      } else {
        lines.push("<!-- TOC -->");
      }
      return lines.push("");
    };

    EditToc.prototype._writeTocTail = function(lines, toc) {
      lines.push("");
      if (toc.found) {
        return lines.push(toc.tail.text);
      } else {
        return lines.push("<!-- /TOC -->");
      }
    };

    EditToc.prototype._writeHeaders = function(lines, opts, indent, headers) {
      var header, i, len, nextIndent, results;
      results = [];
      for (i = 0, len = headers.length; i < len; i++) {
        header = headers[i];
        if (header.depth > opts.depthTo) {
          continue;
        }
        nextIndent = indent;
        if (header.depth >= opts.depthFrom) {
          nextIndent += this.editor.getTabText();
          if (opts.insertAnchor) {
            lines.push(indent + "- " + (anchor(header.title, opts.anchorMode, header.repetition)));
          } else {
            lines.push(indent + "- " + header.title);
          }
        }
        results.push(this._writeHeaders(lines, opts, nextIndent, header.children));
      }
      return results;
    };

    return EditToc;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9lZGl0LXRvYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsd0JBQVI7O0VBRVQsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLGlCQUFDLE9BQUQ7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQTtJQUhDOztzQkFLYixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBaUIsVUFBakIsRUFBNkIsU0FBQyxDQUFEO2VBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQUwsQ0FBQTtNQUFQLENBQTdCO2FBQ0wsSUFBRSxDQUFBLEVBQUEsQ0FBRixDQUFNLENBQU47SUFGTzs7c0JBSVQsU0FBQSxHQUFXLFNBQUMsQ0FBRDtBQUNULFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLFFBQUQsQ0FBQTtNQUNOLE9BQUEsR0FBVSxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFDLENBQUEsTUFBakI7YUFDVixJQUFDLENBQUEsU0FBRCxDQUFXLEdBQVgsRUFBZ0IsT0FBaEI7SUFIUzs7c0JBS1gsU0FBQSxHQUFXLFNBQUMsQ0FBRDtBQUNULFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLFFBQUQsQ0FBQTtNQUNOLElBQUEsQ0FBYyxHQUFH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QUFDLENBQUEsYUFBRCxDQUFlLEtBQWYsRUFBc0IsSUFBdEIsRUFBNEIsVUFBNUIsRUFBd0MsTUFBTSxDQUFDLFFBQS9DO0FBWkY7O0lBRGE7Ozs7O0FBckZqQiIsInNvdXJjZXNDb250ZW50IjpbImFuY2hvciA9IHJlcXVpcmUgXCJhbmNob3ItbWFya2Rvd24taGVhZGVyXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG5oZWFkaW5nID0gcmVxdWlyZSBcIi4uL2hlbHBlcnMvaGVhZGluZ1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVkaXRUb2NcbiAgY29uc3RydWN0b3I6IChjb21tYW5kKSAtPlxuICAgIEBjb21tYW5kID0gY29tbWFuZFxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAY3Vyc29yID0gQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG5cbiAgdHJpZ2dlcjogKGUpIC0+XG4gICAgZm4gPSBAY29tbWFuZC5yZXBsYWNlKC8tW2Etel0vaWcsIChzKSAtPiBzWzFdLnRvVXBwZXJDYXNlKCkpXG4gICAgQFtmbl0oZSlcblxuICBpbnNlcnRUb2M6IChlKSAtPlxuICAgIHRvYyA9IEBfZmluZFRvYygpXG4gICAgaGVhZGVycyA9IGhlYWRpbmcubGlzdEFsbChAZWRpdG9yKVxuICAgIEBfd3JpdGVUb2ModG9jLCBoZWFkZXJzKVxuXG4gIHVwZGF0ZVRvYzogKGUpIC0+XG4gICAgdG9jID0gQF9maW5kVG9jKClcbiAgICByZXR1cm4gdW5sZXNzIHRvYy5mb3VuZFxuXG4gICAgaGVhZGVycyA9IGhlYWRpbmcubGlzdEFsbChAZWRpdG9yKVxuICAgIEBfd3JpdGVUb2ModG9jLCBoZWFkZXJzKVxuXG4gICMgPCEtLSBUT0MgLS0+IFtsaXN0XSA8IS0tIC9UT0MgLS0+XG4gIF9maW5kVG9jOiAtPlxuICAgIHRvYyA9IHsgZm91bmQ6IGZhbHNlLCBvcHRzOiBPYmplY3QuYXNzaWduKHt9LCBjb25maWcuZ2V0KFwidG9jXCIpKSB9XG5cbiAgICAjIGZpbmQgZmlyc3QgVE9DIGhlYWQgdGFnXG4gICAgQGVkaXRvci5idWZmZXIuc2NhbiAvXjwhLS0gK1RPQyArKC4rPyArKS0tPiQvLCAobWF0Y2gpIC0+XG4gICAgICB0b2MuaGVhZCA9IHsgcG9zOiBtYXRjaC5yYW5nZS5zdGFydCwgdGV4dDogbWF0Y2gubWF0Y2hbMF0gfVxuICAgICAgIyBwYXJzZSBUT0Mgb3B0aW9uczogZGVwdGhGcm9tLCBkZXB0aFRvLCBpbnNlcnRBbmNob3IsIGFuY2hvck1vZGVcbiAgICAgIGZvciBvcHQgaW4gbWF0Y2gubWF0Y2hbMV0uc3BsaXQoXCIgXCIpXG4gICAgICAgIFtrLCB2XSA9IG9wdC5zcGxpdChcIjpcIilcblxuICAgICAgICBpZiBrIGluIFtcImRlcHRoRnJvbVwiLCBcImRlcHRoVG9cIl1cbiAgICAgICAgICB0b2Mub3B0c1trXSA9IChwYXJzZUludCh2KSB8fCBvcHRzW2tdKVxuICAgICAgICBlbHNlIGlmIGsgaW4gW1wiaW5zZXJ0QW5jaG9yXCJdXG4gICAgICAgICAgdG9jLm9wdHNba10gPSAodiA9PSBcInRydWVcIilcbiAgICAgICAgZWxzZSBpZiBrIGluIFtcImFuY2hvck1vZGVcIl1cbiAgICAgICAgICB0b2Mub3B0c1trXSA9ICh2IHx8IG9wdHNba10pXG5cbiAgICByZXR1cm4gdG9jIHVubGVzcyB0b2MuaGVhZCAjIG5vIFRPQyBmb3VuZFxuXG4gICAgIyBmaW5kIGZpcnN0IFRPQyB0YWlsIHRhZ1xuICAgIEBlZGl0b3IuYnVmZmVyLnNjYW4gL148IS0tICtcXC9UT0MgKy0tPiQvLCAobWF0Y2gpIC0+XG4gICAgICB0b2MudGFpbCA9IHsgcG9zOiBtYXRjaC5yYW5nZS5lbmQsIHRleHQ6IG1hdGNoLm1hdGNoWzBdIH1cblxuICAgIHJldHVybiB0b2MgdW5sZXNzIHRvYy50YWlsICMgVE9DIGlzIG5vdCBjb21wbGV0ZVxuXG4gICAgdG9jLmZvdW5kID0gdHJ1ZSBpZiB0b2MuaGVhZC5wb3Mucm93IDwgdG9jLnRhaWwucG9zLnJvdyAjIGNoZWNrIHJhbmdlXG4gICAgcmV0dXJuIHRvY1xuXG4gIF93cml0ZVRvYzogKHRvYywgaGVhZGVycykgLT5cbiAgICBsaW5lcyA9IFtdXG4gICAgQF93cml0ZVRvY0hlYWQobGluZXMsIHRvYylcbiAgICBAX3dyaXRlSGVhZGVycyhsaW5lcywgdG9jLm9wdHMsIFwiXCIsIGhlYWRlcnMpXG4gICAgQF93cml0ZVRvY1RhaWwobGluZXMsIHRvYylcbiAgICB0ZXh0ID0gbGluZXMuam9pbihcIlxcblwiKVxuXG4gICAgaWYgdG9jLmZvdW5kICMgcmVwbGFjZVxuICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbdG9jLmhlYWQucG9zLCB0b2MudGFpbC5wb3NdLCB0ZXh0KVxuICAgIGVsc2VcbiAgICAgIEBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0KVxuXG4gIF93cml0ZVRvY0hlYWQ6IChsaW5lcywgdG9jKSAtPlxuICAgIGlmIHRvYy5mb3VuZFxuICAgICAgbGluZXMucHVzaCh0b2MuaGVhZC50ZXh0KVxuICAgIGVsc2VcbiAgICAgIGxpbmVzLnB1c2goXCI8IS0tIFRPQyAtLT5cIilcblxuICAgIGxpbmVzLnB1c2goXCJcIikgIyBlbXB0eSBzZXBhcmF0b3JcblxuICBfd3JpdGVUb2NUYWlsOiAobGluZXMsIHRvYykgLT5cbiAgICBsaW5lcy5wdXNoKFwiXCIpICMgZW1wdHkgc2VwYXJhdG9yXG5cbiAgICBpZiB0b2MuZm91bmRcbiAgICAgIGxpbmVzLnB1c2godG9jLnRhaWwudGV4dClcbiAgICBlbHNlXG4gICAgICBsaW5lcy5wdXNoKFwiPCEtLSAvVE9DIC0tPlwiKVxuXG4gIF93cml0ZUhlYWRlcnM6IChsaW5lcywgb3B0cywgaW5kZW50LCBoZWFkZXJzKSAtPlxuICAgIGZvciBoZWFkZXIgaW4gaGVhZGVyc1xuICAgICAgY29udGludWUgaWYgaGVhZGVyLmRlcHRoID4gb3B0cy5kZXB0aFRvICMgZWFybHkgc3RvcFxuXG4gICAgICBuZXh0SW5kZW50ID0gaW5kZW50XG4gICAgICBpZiBoZWFkZXIuZGVwdGggPj0gb3B0cy5kZXB0aEZyb21cbiAgICAgICAgbmV4dEluZGVudCArPSBAZWRpdG9yLmdldFRhYlRleHQoKVxuXG4gICAgICAgIGlmIG9wdHMuaW5zZXJ0QW5jaG9yXG4gICAgICAgICAgbGluZXMucHVzaChcIiN7aW5kZW50fS0gI3thbmNob3IoaGVhZGVyLnRpdGxlLCBvcHRzLmFuY2hvck1vZGUsIGhlYWRlci5yZXBldGl0aW9uKX1cIilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxpbmVzLnB1c2goXCIje2luZGVudH0tICN7aGVhZGVyLnRpdGxlfVwiKVxuXG4gICAgICBAX3dyaXRlSGVhZGVycyhsaW5lcywgb3B0cywgbmV4dEluZGVudCwgaGVhZGVyLmNoaWxkcmVuKVxuIl19
