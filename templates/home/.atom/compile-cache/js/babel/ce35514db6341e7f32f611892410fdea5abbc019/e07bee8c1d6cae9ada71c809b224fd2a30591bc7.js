Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _editorLinter = require('./editor-linter');

var _editorLinter2 = _interopRequireDefault(_editorLinter);

var EditorRegistry = (function () {
  function EditorRegistry() {
    var _this = this;

    _classCallCheck(this, EditorRegistry);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();
    this.editorLinters = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.lintOnOpen', function (lintOnOpen) {
      _this.lintOnOpen = lintOnOpen;
    }));
  }

  _createClass(EditorRegistry, [{
    key: 'activate',
    value: function activate() {
      var _this2 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        _this2.createFromTextEditor(textEditor);
      }));
    }
  }, {
    key: 'get',
    value: function get(textEditor) {
      return this.editorLinters.get(textEditor);
    }
  }, {
    key: 'createFromTextEditor',
    value: function createFromTextEditor(textEditor) {
      var _this3 = this;

      var editorLinter = this.editorLinters.get(textEditor);
      if (editorLinter) {
        return editorLinter;
      }
      editorLinter = new _editorLinter2['default'](textEditor);
      editorLinter.onDidDestroy(function () {
        _this3.editorLinters['delete'](textEditor);
      });
      this.editorLinters.set(textEditor, editorLinter);
      this.emitter.emit('observe', editorLinter);
      if (this.lintOnOpen) {
        editorLinter.lint();
      }
      return editorLinter;
    }
  }, {
    key: 'hasSibling',
    value: function hasSibling(editorLinter) {
      var buffer = editorLinter.getEditor().getBuffer();

      return Array.from(this.editorLinters.keys()).some(function (item) {
        return item.getBuffer() === buffer;
      });
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.editorLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.editorLinters.values()) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return EditorRegistry;
})();

exports['default'] = EditorRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07OzRCQUUxQixpQkFBaUI7Ozs7SUFFcEMsY0FBYztBQU1QLFdBTlAsY0FBYyxHQU1KOzs7MEJBTlYsY0FBYzs7QUFPaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUU5QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQUEsVUFBVSxFQUFJO0FBQ3JELFlBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtLQUM3QixDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQWpCRyxjQUFjOztXQWtCVixvQkFBRzs7O0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQSxVQUFVLEVBQUk7QUFDOUMsZUFBSyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUN0QyxDQUFDLENBQ0gsQ0FBQTtLQUNGOzs7V0FDRSxhQUFDLFVBQXNCLEVBQWlCO0FBQ3pDLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDMUM7OztXQUNtQiw4QkFBQyxVQUFzQixFQUFnQjs7O0FBQ3pELFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3JELFVBQUksWUFBWSxFQUFFO0FBQ2hCLGVBQU8sWUFBWSxDQUFBO09BQ3BCO0FBQ0Qsa0JBQVksR0FBRyw4QkFBaUIsVUFBVSxDQUFDLENBQUE7QUFDM0Msa0JBQVksQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM5QixlQUFLLGFBQWEsVUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ3RDLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNoRCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDMUMsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLG9CQUFZLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDcEI7QUFDRCxhQUFPLFlBQVksQ0FBQTtLQUNwQjs7O1dBQ1Msb0JBQUMsWUFBMEIsRUFBVztBQUM5QyxVQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUE7O0FBRW5ELGFBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxNQUFNO09BQUEsQ0FBQyxDQUFBO0tBQ3ZGOzs7V0FDTSxpQkFBQyxRQUE4QyxFQUFjO0FBQ2xFLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDTSxtQkFBRztBQUNSLFdBQUssSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUMvQyxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDaEI7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0ExREcsY0FBYzs7O3FCQTZETCxjQUFjIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEVkaXRvckxpbnRlciBmcm9tICcuL2VkaXRvci1saW50ZXInXG5cbmNsYXNzIEVkaXRvclJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBsaW50T25PcGVuOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgZWRpdG9yTGludGVyczogTWFwPFRleHRFZGl0b3IsIEVkaXRvckxpbnRlcj5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZWRpdG9yTGludGVycyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25PcGVuJywgbGludE9uT3BlbiA9PiB7XG4gICAgICAgIHRoaXMubGludE9uT3BlbiA9IGxpbnRPbk9wZW5cbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKHRleHRFZGl0b3IgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgZ2V0KHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiA/RWRpdG9yTGludGVyIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JMaW50ZXJzLmdldCh0ZXh0RWRpdG9yKVxuICB9XG4gIGNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiBFZGl0b3JMaW50ZXIge1xuICAgIGxldCBlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvckxpbnRlcnMuZ2V0KHRleHRFZGl0b3IpXG4gICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgcmV0dXJuIGVkaXRvckxpbnRlclxuICAgIH1cbiAgICBlZGl0b3JMaW50ZXIgPSBuZXcgRWRpdG9yTGludGVyKHRleHRFZGl0b3IpXG4gICAgZWRpdG9yTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmVkaXRvckxpbnRlcnMuZGVsZXRlKHRleHRFZGl0b3IpXG4gICAgfSlcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMuc2V0KHRleHRFZGl0b3IsIGVkaXRvckxpbnRlcilcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZScsIGVkaXRvckxpbnRlcilcbiAgICBpZiAodGhpcy5saW50T25PcGVuKSB7XG4gICAgICBlZGl0b3JMaW50ZXIubGludCgpXG4gICAgfVxuICAgIHJldHVybiBlZGl0b3JMaW50ZXJcbiAgfVxuICBoYXNTaWJsaW5nKGVkaXRvckxpbnRlcjogRWRpdG9yTGludGVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yTGludGVyLmdldEVkaXRvcigpLmdldEJ1ZmZlcigpXG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmVkaXRvckxpbnRlcnMua2V5cygpKS5zb21lKGl0ZW0gPT4gaXRlbS5nZXRCdWZmZXIoKSA9PT0gYnVmZmVyKVxuICB9XG4gIG9ic2VydmUoY2FsbGJhY2s6IChlZGl0b3JMaW50ZXI6IEVkaXRvckxpbnRlcikgPT4gdm9pZCk6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZWRpdG9yTGludGVycy5mb3JFYWNoKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5lZGl0b3JMaW50ZXJzLnZhbHVlcygpKSB7XG4gICAgICBlbnRyeS5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRvclJlZ2lzdHJ5XG4iXX0=