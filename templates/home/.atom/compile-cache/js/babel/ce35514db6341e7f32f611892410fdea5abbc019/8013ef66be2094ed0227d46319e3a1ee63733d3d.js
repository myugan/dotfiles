Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utils = require('./utils');

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

'use babel';

var EditorManager = (function () {
  function EditorManager(store, dbg) {
    _classCallCheck(this, EditorManager);

    this._store = store;
    this._dbg = dbg;

    this._editors = new Map();

    this._subscriptions = new _atom.CompositeDisposable(atom.workspace.observeTextEditors(this.handleTextEditor.bind(this)), atom.workspace.onWillDestroyPaneItem(this.handleWillDestroyPaneItem.bind(this)), {
      dispose: store.subscribe((0, _utils.debounce)(this.handleStoreChange.bind(this), 50))
    });

    this._lastStackID = 0;
    this._lineMarker = null;
  }

  _createClass(EditorManager, [{
    key: 'dispose',
    value: function dispose() {
      this._editors.forEach(function (e) {
        return e.destroy();
      });
      this._editors.clear();

      this.removeLineMarker();

      this._subscriptions.dispose();
      this._subscriptions = null;
    }
  }, {
    key: 'handleStoreChange',
    value: function handleStoreChange() {
      var _this = this;

      this._editors.forEach(function (e, editor) {
        _this.updateEditor(editor);
        e.updateMarkers();
      });

      // open the file of the selected stacktrace and highlight the current line
      this.openAndHighlight();
    }
  }, {
    key: 'removeLineMarker',
    value: function removeLineMarker() {
      if (this._lineMarker) {
        this._lineMarker.destroy();
      }
      this._lineMarker = null;
    }
  }, {
    key: 'openAndHighlight',
    value: function openAndHighlight() {
      var _this2 = this;

      var delve = this._store.getState().delve;
      var stack = delve.stacktrace[delve.selectedStacktrace];
      if (!stack) {
        // not started, finished or just started -> no line marker visible
        this.removeLineMarker();
        this._lastStackID = 0;
        return;
      }

      if (stack.id === this._lastStackID) {
        return;
      }
      this._lastStackID = stack.id;

      // remove any previous line marker
      this.removeLineMarker();

      // open the file
      var line = stack.line;
      (0, _utils.openFile)(stack.file, line).then(function (editor) {
        // create a new marker
        _this2._lineMarker = editor.markBufferPosition({ row: line });
        editor.decorateMarker(_this2._lineMarker, { type: 'line', 'class': 'go-debug-line' });
      });
    }
  }, {
    key: 'handleWillDestroyPaneItem',
    value: function handleWillDestroyPaneItem(_ref) {
      var editor = _ref.item;

      var e = editor && this._editors.get(editor);
      if (e) {
        e.destroy();
        this._editors['delete'](editor);
      }
    }
  }, {
    key: 'handleTextEditor',
    value: function handleTextEditor(editor) {
      var e = this.updateEditor(editor);
      if (e) {
        e.updateMarkers();
      }
    }
  }, {
    key: 'updateEditor',
    value: function updateEditor(editor) {
      if (!(0, _utils.isValidEditor)(editor)) {
        return null;
      }

      var e = this._editors.get(editor);
      if (!e) {
        e = new _editor2['default'](this._store, this._dbg, editor);
        this._editors.set(editor, e);
      }
      return e;
    }
  }]);

  return EditorManager;
})();

exports['default'] = EditorManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9lZGl0b3ItbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVvQyxNQUFNOztxQkFDUSxTQUFTOztzQkFDeEMsVUFBVTs7OztBQUo3QixXQUFXLENBQUE7O0lBTVUsYUFBYTtBQUNwQixXQURPLGFBQWEsQ0FDbkIsS0FBSyxFQUFFLEdBQUcsRUFBRTswQkFETixhQUFhOztBQUU5QixRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixRQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQTs7QUFFZixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXpCLFFBQUksQ0FBQyxjQUFjLEdBQUcsOEJBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNuRSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDL0U7QUFDRSxhQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FDdEIscUJBQVMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FDaEQ7S0FDRixDQUNGLENBQUE7O0FBRUQsUUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7R0FDeEI7O2VBbkJrQixhQUFhOztXQXFCeEIsbUJBQUc7QUFDVCxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7ZUFBSyxDQUFDLENBQUMsT0FBTyxFQUFFO09BQUEsQ0FBQyxDQUFBO0FBQ3pDLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FB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QU0sQ0FBQyxDQUFBO0FBQzlDLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtPQUM3QjtBQUNELGFBQU8sQ0FBQyxDQUFBO0tBQ1Q7OztTQXJHa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2VkaXRvci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBkZWJvdW5jZSwgb3BlbkZpbGUsIGlzVmFsaWRFZGl0b3IgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IEVkaXRvciBmcm9tICcuL2VkaXRvcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yIChzdG9yZSwgZGJnKSB7XG4gICAgdGhpcy5fc3RvcmUgPSBzdG9yZVxuICAgIHRoaXMuX2RiZyA9IGRiZ1xuXG4gICAgdGhpcy5fZWRpdG9ycyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKHRoaXMuaGFuZGxlVGV4dEVkaXRvci5iaW5kKHRoaXMpKSxcbiAgICAgIGF0b20ud29ya3NwYWNlLm9uV2lsbERlc3Ryb3lQYW5lSXRlbSh0aGlzLmhhbmRsZVdpbGxEZXN0cm95UGFuZUl0ZW0uYmluZCh0aGlzKSksXG4gICAgICB7XG4gICAgICAgIGRpc3Bvc2U6IHN0b3JlLnN1YnNjcmliZShcbiAgICAgICAgICBkZWJvdW5jZSh0aGlzLmhhbmRsZVN0b3JlQ2hhbmdlLmJpbmQodGhpcyksIDUwKVxuICAgICAgICApXG4gICAgICB9XG4gICAgKVxuXG4gICAgdGhpcy5fbGFzdFN0YWNrSUQgPSAwXG4gICAgdGhpcy5fbGluZU1hcmtlciA9IG51bGxcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMuX2VkaXRvcnMuZm9yRWFjaCgoZSkgPT4gZS5kZXN0cm95KCkpXG4gICAgdGhpcy5fZWRpdG9ycy5jbGVhcigpXG5cbiAgICB0aGlzLnJlbW92ZUxpbmVNYXJrZXIoKVxuXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbFxuICB9XG5cbiAgaGFuZGxlU3RvcmVDaGFuZ2UgKCkge1xuICAgIHRoaXMuX2VkaXRvcnMuZm9yRWFjaCgoZSwgZWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUVkaXRvcihlZGl0b3IpXG4gICAgICBlLnVwZGF0ZU1hcmtlcnMoKVxuICAgIH0pXG5cbiAgICAvLyBvcGVuIHRoZSBmaWxlIG9mIHRoZSBzZWxlY3RlZCBzdGFja3RyYWNlIGFuZCBoaWdobGlnaHQgdGhlIGN1cnJlbnQgbGluZVxuICAgIHRoaXMub3BlbkFuZEhpZ2hsaWdodCgpXG4gIH1cblxuICByZW1vdmVMaW5lTWFya2VyICgpIHtcbiAgICBpZiAodGhpcy5fbGluZU1hcmtlcikge1xuICAgICAgdGhpcy5fbGluZU1hcmtlci5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy5fbGluZU1hcmtlciA9IG51bGxcbiAgfVxuXG4gIG9wZW5BbmRIaWdobGlnaHQgKCkge1xuICAgIGNvbnN0IGRlbHZlID0gdGhpcy5fc3RvcmUuZ2V0U3RhdGUoKS5kZWx2ZVxuICAgIGNvbnN0IHN0YWNrID0gZGVsdmUuc3RhY2t0cmFjZVtkZWx2ZS5zZWxlY3RlZFN0YWNrdHJhY2VdXG4gICAgaWYgKCFzdGFjaykge1xuICAgICAgLy8gbm90IHN0YXJ0ZWQsIGZpbmlzaGVkIG9yIGp1c3Qgc3RhcnRlZCAtPiBubyBsaW5lIG1hcmtlciB2aXNpYmxlXG4gICAgICB0aGlzLnJlbW92ZUxpbmVNYXJrZXIoKVxuICAgICAgdGhpcy5fbGFzdFN0YWNrSUQgPSAwXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoc3RhY2suaWQgPT09IHRoaXMuX2xhc3RTdGFja0lEKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5fbGFzdFN0YWNrSUQgPSBzdGFjay5pZFxuXG4gICAgLy8gcmVtb3ZlIGFueSBwcmV2aW91cyBsaW5lIG1hcmtlclxuICAgIHRoaXMucmVtb3ZlTGluZU1hcmtlcigpXG5cbiAgICAvLyBvcGVuIHRoZSBmaWxlXG4gICAgY29uc3QgbGluZSA9IHN0YWNrLmxpbmVcbiAgICBvcGVuRmlsZShzdGFjay5maWxlLCBsaW5lKS50aGVuKChlZGl0b3IpID0+IHtcbiAgICAgIC8vIGNyZWF0ZSBhIG5ldyBtYXJrZXJcbiAgICAgIHRoaXMuX2xpbmVNYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclBvc2l0aW9uKHsgcm93OiBsaW5lIH0pXG4gICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIodGhpcy5fbGluZU1hcmtlciwgeyB0eXBlOiAnbGluZScsIGNsYXNzOiAnZ28tZGVidWctbGluZScgfSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlV2lsbERlc3Ryb3lQYW5lSXRlbSAoeyBpdGVtOiBlZGl0b3IgfSkge1xuICAgIGNvbnN0IGUgPSBlZGl0b3IgJiYgdGhpcy5fZWRpdG9ycy5nZXQoZWRpdG9yKVxuICAgIGlmIChlKSB7XG4gICAgICBlLmRlc3Ryb3koKVxuICAgICAgdGhpcy5fZWRpdG9ycy5kZWxldGUoZWRpdG9yKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVRleHRFZGl0b3IgKGVkaXRvcikge1xuICAgIGNvbnN0IGUgPSB0aGlzLnVwZGF0ZUVkaXRvcihlZGl0b3IpXG4gICAgaWYgKGUpIHtcbiAgICAgIGUudXBkYXRlTWFya2VycygpXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRWRpdG9yIChlZGl0b3IpIHtcbiAgICBpZiAoIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBsZXQgZSA9IHRoaXMuX2VkaXRvcnMuZ2V0KGVkaXRvcilcbiAgICBpZiAoIWUpIHtcbiAgICAgIGUgPSBuZXcgRWRpdG9yKHRoaXMuX3N0b3JlLCB0aGlzLl9kYmcsIGVkaXRvcilcbiAgICAgIHRoaXMuX2VkaXRvcnMuc2V0KGVkaXRvciwgZSlcbiAgICB9XG4gICAgcmV0dXJuIGVcbiAgfVxufVxuIl19