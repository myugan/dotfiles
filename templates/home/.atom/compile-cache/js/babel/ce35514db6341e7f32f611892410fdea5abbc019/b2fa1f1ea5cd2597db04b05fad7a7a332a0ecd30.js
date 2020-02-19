Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodashDebounce = require('lodash/debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _helpers = require('./helpers');

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (!atom.workspace.isTextEditor(editor)) {
      throw new Error('EditorLinter expects a valid TextEditor');
    }
    var editorBuffer = editor.getBuffer();
    var debouncedLint = (0, _lodashDebounce2['default'])(function () {
      _this.emitter.emit('should-lint', false);
    }, 50, { leading: true });

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    // This debouncing is for beautifiers, if they change contents of the editor and save
    // Linter should count that group of events as one.
    this.subscriptions.add(this.editor.onDidSave(debouncedLint));
    // This is to relint in case of external changes to the opened file
    this.subscriptions.add(editorBuffer.onDidReload(debouncedLint));
    // NOTE: TextEditor::onDidChange immediately invokes the callback if the text editor was *just* created
    // Using TextBuffer::onDidChange doesn't have the same behavior so using it instead.
    this.subscriptions.add((0, _helpers.subscriptiveObserve)(atom.config, 'linter.lintOnChangeInterval', function (interval) {
      return editorBuffer.onDidChange((0, _lodashDebounce2['default'])(function () {
        _this.emitter.emit('should-lint', true);
      }, interval));
    }));
  }

  _createClass(EditorLinter, [{
    key: 'getEditor',
    value: function getEditor() {
      return this.editor;
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.emitter.dispose();
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLWxpbnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUV5RCxNQUFNOzs4QkFDMUMsaUJBQWlCOzs7O3VCQUVGLFdBQVc7O0lBRTFCLFlBQVk7QUFLcEIsV0FMUSxZQUFZLENBS25CLE1BQWtCLEVBQUU7OzswQkFMYixZQUFZOztBQU03QixRQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDeEMsWUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO0tBQzNEO0FBQ0QsUUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ3ZDLFFBQU0sYUFBYSxHQUFHLGlDQUNwQixZQUFNO0FBQ0osWUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUN4QyxFQUNELEVBQUUsRUFDRixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FDbEIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFBTSxNQUFLLE9BQU8sRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBOzs7QUFHdEUsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTs7QUFFNUQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBOzs7QUFHL0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLGtDQUFvQixJQUFJLENBQUMsTUFBTSxFQUFFLDZCQUE2QixFQUFFLFVBQUEsUUFBUTthQUN0RSxZQUFZLENBQUMsV0FBVyxDQUN0QixpQ0FBUyxZQUFNO0FBQ2IsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN2QyxFQUFFLFFBQVEsQ0FBQyxDQUNiO0tBQUEsQ0FDRixDQUNGLENBQUE7R0FDRjs7ZUF2Q2tCLFlBQVk7O1dBd0N0QixxQkFBZTtBQUN0QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7S0FDbkI7OztXQUNHLGdCQUE0QjtVQUEzQixRQUFpQix5REFBRyxLQUFLOztBQUM1QixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDM0M7OztXQUNXLHNCQUFDLFFBQWtCLEVBQWM7QUFDM0MsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNXLHNCQUFDLFFBQWtCLEVBQWM7QUFDM0MsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3ZCOzs7U0F4RGtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLWxpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC9kZWJvdW5jZSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBzdWJzY3JpcHRpdmVPYnNlcnZlIH0gZnJvbSAnLi9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JMaW50ZXIge1xuICBlZGl0b3I6IFRleHRFZGl0b3JcbiAgZW1pdHRlcjogRW1pdHRlclxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3RydWN0b3IoZWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgaWYgKCFhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFZGl0b3JMaW50ZXIgZXhwZWN0cyBhIHZhbGlkIFRleHRFZGl0b3InKVxuICAgIH1cbiAgICBjb25zdCBlZGl0b3JCdWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBjb25zdCBkZWJvdW5jZWRMaW50ID0gZGVib3VuY2UoXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIGZhbHNlKVxuICAgICAgfSxcbiAgICAgIDUwLFxuICAgICAgeyBsZWFkaW5nOiB0cnVlIH0sXG4gICAgKVxuXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4gdGhpcy5kaXNwb3NlKCkpKVxuICAgIC8vIFRoaXMgZGVib3VuY2luZyBpcyBmb3IgYmVhdXRpZmllcnMsIGlmIHRoZXkgY2hhbmdlIGNvbnRlbnRzIG9mIHRoZSBlZGl0b3IgYW5kIHNhdmVcbiAgICAvLyBMaW50ZXIgc2hvdWxkIGNvdW50IHRoYXQgZ3JvdXAgb2YgZXZlbnRzIGFzIG9uZS5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkU2F2ZShkZWJvdW5jZWRMaW50KSlcbiAgICAvLyBUaGlzIGlzIHRvIHJlbGludCBpbiBjYXNlIG9mIGV4dGVybmFsIGNoYW5nZXMgdG8gdGhlIG9wZW5lZCBmaWxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JCdWZmZXIub25EaWRSZWxvYWQoZGVib3VuY2VkTGludCkpXG4gICAgLy8gTk9URTogVGV4dEVkaXRvcjo6b25EaWRDaGFuZ2UgaW1tZWRpYXRlbHkgaW52b2tlcyB0aGUgY2FsbGJhY2sgaWYgdGhlIHRleHQgZWRpdG9yIHdhcyAqanVzdCogY3JlYXRlZFxuICAgIC8vIFVzaW5nIFRleHRCdWZmZXI6Om9uRGlkQ2hhbmdlIGRvZXNuJ3QgaGF2ZSB0aGUgc2FtZSBiZWhhdmlvciBzbyB1c2luZyBpdCBpbnN0ZWFkLlxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBzdWJzY3JpcHRpdmVPYnNlcnZlKGF0b20uY29uZmlnLCAnbGludGVyLmxpbnRPbkNoYW5nZUludGVydmFsJywgaW50ZXJ2YWwgPT5cbiAgICAgICAgZWRpdG9yQnVmZmVyLm9uRGlkQ2hhbmdlKFxuICAgICAgICAgIGRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIHRydWUpXG4gICAgICAgICAgfSwgaW50ZXJ2YWwpLFxuICAgICAgICApLFxuICAgICAgKSxcbiAgICApXG4gIH1cbiAgZ2V0RWRpdG9yKCk6IFRleHRFZGl0b3Ige1xuICAgIHJldHVybiB0aGlzLmVkaXRvclxuICB9XG4gIGxpbnQob25DaGFuZ2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIG9uQ2hhbmdlKVxuICB9XG4gIG9uU2hvdWxkTGludChjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtbGludCcsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=