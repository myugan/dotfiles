(function() {
  var listAll;

  listAll = function(editor) {
    var curHeader, headers, repetition;
    repetition = {};
    headers = [];
    curHeader = void 0;
    editor.buffer.scan(/^(\#{1,6}) +(.+?) *$/g, function(match) {
      var descriptors, header, parent, title;
      descriptors = editor.scopeDescriptorForBufferPosition(match.range.start).getScopesArray();
      if (!descriptors.find(function(descriptor) {
        return descriptor.indexOf("heading") >= 0;
      })) {
        return;
      }
      title = match.match[2];
      if (repetition[title] != null) {
        repetition[title] += 1;
      } else {
        repetition[title] = 0;
      }
      header = {
        range: match.range,
        text: match.match[0],
        depth: match.match[1].length,
        title: title,
        repetition: repetition[title],
        children: []
      };
      parent = curHeader;
      while (parent && parent.depth >= header.depth) {
        parent = parent.parent;
      }
      if (parent) {
        header.parent = parent;
        parent.children.push(header);
      } else {
        headers.push(header);
      }
      return curHeader = header;
    });
    return headers;
  };

  module.exports = {
    listAll: listAll
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9oZWxwZXJzL2hlYWRpbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsU0FBQyxNQUFEO0FBQ1IsUUFBQTtJQUFBLFVBQUEsR0FBYTtJQUNiLE9BQUEsR0FBVTtJQUVWLFNBQUEsR0FBWTtJQUNaLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBZCxDQUFtQix1QkFBbkIsRUFBNEMsU0FBQyxLQUFEO0FBQzFDLFVBQUE7TUFBQSxXQUFBLEdBQWMsTUFBTSxDQUFDLGdDQUFQLENBQXdDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBcEQsQ0FBMEQsQ0FBQyxjQUEzRCxDQUFBO01BRWQsSUFBQSxDQUFjLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsVUFBRDtlQUFnQixVQUFVLENBQUMsT0FBWCxDQUFtQixTQUFuQixDQUFBLElBQWlDO01BQWpELENBQWpCLENBQWQ7QUFBQSxlQUFBOztNQUVBLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUE7TUFFcEIsSUFBRyx5QkFBSDtRQUNFLFVBQVcsQ0FBQSxLQUFBLENBQVgsSUFBcUIsRUFEdkI7T0FBQSxNQUFBO1FBR0UsVUFBVyxDQUFBLEtBQUEsQ0FBWCxHQUFvQixFQUh0Qjs7TUFLQSxNQUFBLEdBQVM7UUFDUCxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBRE47UUFFUCxJQUFBLEVBQU0sS0FBSyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBRlg7UUFHUCxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUhmO1FBSVAsS0FBQSxFQUFPLEtBSkE7UUFLUCxVQUFBLEVBQVksVUFBVyxDQUFBLEtBQUEsQ0FMaEI7UUFNUCxRQUFBLEVBQVUsRUFOSDs7TUFVVCxNQUFBLEdBQVM7QUFDYyxhQUFNLE1BQUEsSUFBVSxNQUFNLENBQUMsS0FBUCxJQUFnQixNQUFNLENBQUMsS0FBdkM7UUFBdkIsTUFBQSxHQUFTLE1BQU0sQ0FBQztNQUFPO01BRXZCLElBQUcsTUFBSDtRQUNFLE1BQU0sQ0FBQyxNQUFQLEdBQWdCO1FBQ2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsTUFBckIsRUFGRjtPQUFBLE1BQUE7UUFJRSxPQUFPLENBQUMsSUFBUixDQUFhLE1BQWIsRUFKRjs7YUFNQSxTQUFBLEdBQVk7SUEvQjhCLENBQTVDO0FBaUNBLFdBQU87RUF0Q0M7O0VBd0NWLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxPQUFBLEVBQVMsT0FBVDs7QUF6Q0YiLCJzb3VyY2VzQ29udGVudCI6WyJsaXN0QWxsID0gKGVkaXRvcikgLT5cbiAgcmVwZXRpdGlvbiA9IHt9ICMgbnVtIG9mIHRpbWVzIG9mIHNhbWUgdGl0bGUgaXMgcmVwZWF0ZWRcbiAgaGVhZGVycyA9IFtdXG5cbiAgY3VySGVhZGVyID0gdW5kZWZpbmVkXG4gIGVkaXRvci5idWZmZXIuc2NhbiAvXihcXCN7MSw2fSkgKyguKz8pICokL2csIChtYXRjaCkgLT5cbiAgICBkZXNjcmlwdG9ycyA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihtYXRjaC5yYW5nZS5zdGFydCkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICMgZXhjbHVkZSBoZWFkaW5ncyBpbiBjb21tZW50cy9jb2RlIGJsb2Nrc1xuICAgIHJldHVybiB1bmxlc3MgZGVzY3JpcHRvcnMuZmluZCgoZGVzY3JpcHRvcikgLT4gZGVzY3JpcHRvci5pbmRleE9mKFwiaGVhZGluZ1wiKSA+PSAwKVxuXG4gICAgdGl0bGUgPSBtYXRjaC5tYXRjaFsyXVxuICAgICMgY291bnQgbnVtYmVyIG9mIGR1cGxpY2F0ZXMvcmVwZXRpdGlvbnNcbiAgICBpZiByZXBldGl0aW9uW3RpdGxlXT9cbiAgICAgIHJlcGV0aXRpb25bdGl0bGVdICs9IDFcbiAgICBlbHNlXG4gICAgICByZXBldGl0aW9uW3RpdGxlXSA9IDBcblxuICAgIGhlYWRlciA9IHtcbiAgICAgIHJhbmdlOiBtYXRjaC5yYW5nZSxcbiAgICAgIHRleHQ6IG1hdGNoLm1hdGNoWzBdLFxuICAgICAgZGVwdGg6IG1hdGNoLm1hdGNoWzFdLmxlbmd0aCxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHJlcGV0aXRpb246IHJlcGV0aXRpb25bdGl0bGVdLFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfVxuXG4gICAgIyBmaW5kIHBvc2l0aW9uIGluIGhlYWRlciB0cmVlXG4gICAgcGFyZW50ID0gY3VySGVhZGVyXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCB3aGlsZSBwYXJlbnQgJiYgcGFyZW50LmRlcHRoID49IGhlYWRlci5kZXB0aFxuICAgICMgYXR0YWNoIHRvIHBhcmVudFxuICAgIGlmIHBhcmVudFxuICAgICAgaGVhZGVyLnBhcmVudCA9IHBhcmVudFxuICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2goaGVhZGVyKVxuICAgIGVsc2UgIyB0b3AtbGV2ZWwgaGVhZGVyXG4gICAgICBoZWFkZXJzLnB1c2goaGVhZGVyKVxuXG4gICAgY3VySGVhZGVyID0gaGVhZGVyXG5cbiAgcmV0dXJuIGhlYWRlcnNcblxubW9kdWxlLmV4cG9ydHMgPVxuICBsaXN0QWxsOiBsaXN0QWxsXG4iXX0=
