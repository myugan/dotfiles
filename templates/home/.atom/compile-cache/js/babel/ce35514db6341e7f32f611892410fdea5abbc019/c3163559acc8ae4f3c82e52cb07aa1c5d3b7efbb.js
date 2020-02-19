Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _storeUtils = require('./store-utils');

var _utils = require('./utils');

'use babel';

var Editor = (function () {
  function Editor(store, dbg, editor) {
    _classCallCheck(this, Editor);

    this._store = store;
    this._dbg = dbg;
    this._editor = editor;

    this._markers = {}; // contains the breakpoint markers by their breakpoint name

    this._gutter = this._editor.addGutter({ name: 'debug', priority: -100 });
    var gutterView = atom.views.getView(this._gutter);
    gutterView.addEventListener('click', this.handleGutterClick.bind(this));
  }

  _createClass(Editor, [{
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      // remove all breakpoint decorations (marker)
      Object.keys(this._markers).forEach(function (name) {
        _this._markers[name].decoration.getMarker().destroy();
      });
      this._markers = null;

      this.destroyGutter();
    }
  }, {
    key: 'destroyGutter',
    value: function destroyGutter() {
      if (!this._gutter) {
        return;
      }

      try {
        this._gutter.destroy();
      } catch (e) {
        console.warn('go-debug', e);
      }

      this._gutter = null;
    }
  }, {
    key: 'createMarkerDecoration',
    value: function createMarkerDecoration(bp) {
      var el = document.createElement('div');
      el.className = 'go-debug-breakpoint go-debug-breakpoint-state-' + bp.state;
      el.dataset.name = bp.name;
      el.dataset.file = bp.file;
      el.dataset.line = bp.line;
      el.title = bp.message || '';
      return {
        'class': 'go-debug-gutter-breakpoint',
        item: el
      };
    }
  }, {
    key: 'updateMarkers',
    value: function updateMarkers() {
      var _this2 = this;

      var file = this._editor.getPath();
      var bps = (0, _storeUtils.getBreakpoints)(this._store, file);

      // update and add markers
      bps.forEach(function (bp) {
        return _this2.updateMarker(bp);
      });

      // remove remaining
      Object.keys(this._markers).forEach(function (name) {
        var index = (0, _storeUtils.indexOfBreakpointByName)(bps, name);
        if (index === -1) {
          _this2.removeMarker(name);
        }
      });
    }
  }, {
    key: 'updateMarker',
    value: function updateMarker(bp) {
      var decoration = this.createMarkerDecoration(bp);
      var marker = this._markers[bp.name];

      // create a new decoration
      if (!marker) {
        var m = this._editor.markBufferPosition({ row: bp.line });
        m.onDidChange((0, _utils.debounce)(this.handleMarkerDidChange.bind(this, bp.name), 50));
        this._markers[bp.name] = {
          bp: bp,
          decoration: this._gutter.decorateMarker(m, decoration)
        };
        return;
      }

      // update an existing decoration if the breakpoint has changed
      if (marker.bp === bp) {
        return;
      }
      marker.bp = bp;
      marker.decoration.setProperties(Object.assign({}, marker.decoration.getProperties(), decoration));
    }
  }, {
    key: 'removeMarker',
    value: function removeMarker(name) {
      var marker = this._markers[name];
      if (marker) {
        marker.decoration.getMarker().destroy();
        delete this._markers[name];
      }
    }
  }, {
    key: 'handleGutterClick',
    value: function handleGutterClick(ev) {
      var editorView = atom.views.getView(this._editor);

      var _editorView$component$screenPositionForMouseEvent = editorView.component.screenPositionForMouseEvent(ev);

      var line = _editorView$component$screenPositionForMouseEvent.row;

      line = this._editor.bufferRowForScreenRow(line);

      this._dbg.toggleBreakpoint(this._editor.getPath(), line);
    }
  }, {
    key: 'handleMarkerDidChange',
    value: function handleMarkerDidChange(name, event) {
      if (!event.isValid) {
        // marker is not valid anymore - text at marker got
        // replaced or was removed -> remove the breakpoint
        this._dbg.removeBreakpoint(name);
        return;
      }

      this._dbg.editBreakpoint(name, { line: event.newHeadBufferPosition.row });
    }
  }]);

  return Editor;
})();

exports['default'] = Editor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBRXdELGVBQWU7O3FCQUM5QyxTQUFTOztBQUhsQyxXQUFXLENBQUE7O0lBS1UsTUFBTTtBQUNiLFdBRE8sTUFBTSxDQUNaLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFOzBCQURkLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFFBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFBO0FBQ2YsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7O0FBRXJCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBOztBQUVsQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBQ3hFLFFBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNuRCxjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtHQUN4RTs7ZUFYa0IsTUFBTTs7V0FZakIsbUJBQUc7Ozs7QUFFVCxZQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0MsY0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3JELENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBOztBQUVwQixVQUFJLENB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MUU7OztTQWxIa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2VkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IGluZGV4T2ZCcmVha3BvaW50QnlOYW1lLCBnZXRCcmVha3BvaW50cyB9IGZyb20gJy4vc3RvcmUtdXRpbHMnXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yIChzdG9yZSwgZGJnLCBlZGl0b3IpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlXG4gICAgdGhpcy5fZGJnID0gZGJnXG4gICAgdGhpcy5fZWRpdG9yID0gZWRpdG9yXG5cbiAgICB0aGlzLl9tYXJrZXJzID0ge30gLy8gY29udGFpbnMgdGhlIGJyZWFrcG9pbnQgbWFya2VycyBieSB0aGVpciBicmVha3BvaW50IG5hbWVcblxuICAgIHRoaXMuX2d1dHRlciA9IHRoaXMuX2VkaXRvci5hZGRHdXR0ZXIoeyBuYW1lOiAnZGVidWcnLCBwcmlvcml0eTogLTEwMCB9KVxuICAgIGNvbnN0IGd1dHRlclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5fZ3V0dGVyKVxuICAgIGd1dHRlclZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUd1dHRlckNsaWNrLmJpbmQodGhpcykpXG4gIH1cbiAgZGVzdHJveSAoKSB7XG4gICAgLy8gcmVtb3ZlIGFsbCBicmVha3BvaW50IGRlY29yYXRpb25zIChtYXJrZXIpXG4gICAgT2JqZWN0LmtleXModGhpcy5fbWFya2VycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgdGhpcy5fbWFya2Vyc1tuYW1lXS5kZWNvcmF0aW9uLmdldE1hcmtlcigpLmRlc3Ryb3koKVxuICAgIH0pXG4gICAgdGhpcy5fbWFya2VycyA9IG51bGxcblxuICAgIHRoaXMuZGVzdHJveUd1dHRlcigpXG4gIH1cbiAgZGVzdHJveUd1dHRlciAoKSB7XG4gICAgaWYgKCF0aGlzLl9ndXR0ZXIpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9ndXR0ZXIuZGVzdHJveSgpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCdnby1kZWJ1ZycsIGUpXG4gICAgfVxuXG4gICAgdGhpcy5fZ3V0dGVyID0gbnVsbFxuICB9XG5cbiAgY3JlYXRlTWFya2VyRGVjb3JhdGlvbiAoYnApIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZWwuY2xhc3NOYW1lID0gJ2dvLWRlYnVnLWJyZWFrcG9pbnQgZ28tZGVidWctYnJlYWtwb2ludC1zdGF0ZS0nICsgYnAuc3RhdGVcbiAgICBlbC5kYXRhc2V0Lm5hbWUgPSBicC5uYW1lXG4gICAgZWwuZGF0YXNldC5maWxlID0gYnAuZmlsZVxuICAgIGVsLmRhdGFzZXQubGluZSA9IGJwLmxpbmVcbiAgICBlbC50aXRsZSA9IGJwLm1lc3NhZ2UgfHwgJydcbiAgICByZXR1cm4ge1xuICAgICAgY2xhc3M6ICdnby1kZWJ1Zy1ndXR0ZXItYnJlYWtwb2ludCcsXG4gICAgICBpdGVtOiBlbFxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMgKCkge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLl9lZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgYnBzID0gZ2V0QnJlYWtwb2ludHModGhpcy5fc3RvcmUsIGZpbGUpXG5cbiAgICAvLyB1cGRhdGUgYW5kIGFkZCBtYXJrZXJzXG4gICAgYnBzLmZvckVhY2goKGJwKSA9PiB0aGlzLnVwZGF0ZU1hcmtlcihicCkpXG5cbiAgICAvLyByZW1vdmUgcmVtYWluaW5nXG4gICAgT2JqZWN0LmtleXModGhpcy5fbWFya2VycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBpbmRleE9mQnJlYWtwb2ludEJ5TmFtZShicHMsIG5hbWUpXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTWFya2VyKG5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICB1cGRhdGVNYXJrZXIgKGJwKSB7XG4gICAgY29uc3QgZGVjb3JhdGlvbiA9IHRoaXMuY3JlYXRlTWFya2VyRGVjb3JhdGlvbihicClcbiAgICBsZXQgbWFya2VyID0gdGhpcy5fbWFya2Vyc1ticC5uYW1lXVxuXG4gICAgLy8gY3JlYXRlIGEgbmV3IGRlY29yYXRpb25cbiAgICBpZiAoIW1hcmtlcikge1xuICAgICAgbGV0IG0gPSB0aGlzLl9lZGl0b3IubWFya0J1ZmZlclBvc2l0aW9uKHsgcm93OiBicC5saW5lIH0pXG4gICAgICBtLm9uRGlkQ2hhbmdlKGRlYm91bmNlKHRoaXMuaGFuZGxlTWFya2VyRGlkQ2hhbmdlLmJpbmQodGhpcywgYnAubmFtZSksIDUwKSlcbiAgICAgIHRoaXMuX21hcmtlcnNbYnAubmFtZV0gPSB7XG4gICAgICAgIGJwLFxuICAgICAgICBkZWNvcmF0aW9uOiB0aGlzLl9ndXR0ZXIuZGVjb3JhdGVNYXJrZXIobSwgZGVjb3JhdGlvbilcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBhbiBleGlzdGluZyBkZWNvcmF0aW9uIGlmIHRoZSBicmVha3BvaW50IGhhcyBjaGFuZ2VkXG4gICAgaWYgKG1hcmtlci5icCA9PT0gYnApIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBtYXJrZXIuYnAgPSBicFxuICAgIG1hcmtlci5kZWNvcmF0aW9uLnNldFByb3BlcnRpZXMoT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgbWFya2VyLmRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpLFxuICAgICAgZGVjb3JhdGlvblxuICAgICkpXG4gIH1cblxuICByZW1vdmVNYXJrZXIgKG5hbWUpIHtcbiAgICBjb25zdCBtYXJrZXIgPSB0aGlzLl9tYXJrZXJzW25hbWVdXG4gICAgaWYgKG1hcmtlcikge1xuICAgICAgbWFya2VyLmRlY29yYXRpb24uZ2V0TWFya2VyKCkuZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5fbWFya2Vyc1tuYW1lXVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUd1dHRlckNsaWNrIChldikge1xuICAgIGNvbnN0IGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5fZWRpdG9yKVxuICAgIGxldCB7IHJvdzogbGluZSB9ID0gZWRpdG9yVmlldy5jb21wb25lbnQuc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGV2KVxuICAgIGxpbmUgPSB0aGlzLl9lZGl0b3IuYnVmZmVyUm93Rm9yU2NyZWVuUm93KGxpbmUpXG5cbiAgICB0aGlzLl9kYmcudG9nZ2xlQnJlYWtwb2ludCh0aGlzLl9lZGl0b3IuZ2V0UGF0aCgpLCBsaW5lKVxuICB9XG4gIGhhbmRsZU1hcmtlckRpZENoYW5nZSAobmFtZSwgZXZlbnQpIHtcbiAgICBpZiAoIWV2ZW50LmlzVmFsaWQpIHtcbiAgICAgIC8vIG1hcmtlciBpcyBub3QgdmFsaWQgYW55bW9yZSAtIHRleHQgYXQgbWFya2VyIGdvdFxuICAgICAgLy8gcmVwbGFjZWQgb3Igd2FzIHJlbW92ZWQgLT4gcmVtb3ZlIHRoZSBicmVha3BvaW50XG4gICAgICB0aGlzLl9kYmcucmVtb3ZlQnJlYWtwb2ludChuYW1lKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fZGJnLmVkaXRCcmVha3BvaW50KG5hbWUsIHsgbGluZTogZXZlbnQubmV3SGVhZEJ1ZmZlclBvc2l0aW9uLnJvdyB9KVxuICB9XG59XG4iXX0=