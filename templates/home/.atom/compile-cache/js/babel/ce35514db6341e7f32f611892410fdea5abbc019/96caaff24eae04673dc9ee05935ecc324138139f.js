var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var PanelDelegate = (function () {
  function PanelDelegate() {
    var _this = this;

    _classCallCheck(this, PanelDelegate);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.filteredMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.panelRepresents', function (panelRepresents) {
      var notInitial = typeof _this.panelRepresents !== 'undefined';
      _this.panelRepresents = panelRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    var changeSubscription = undefined;
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
        changeSubscription = null;
      }
      var textEditor = (0, _helpers.getActiveTextEditor)();
      if (textEditor) {
        (function () {
          if (_this.panelRepresents !== 'Entire Project') {
            _this.update();
          }
          var oldRow = -1;
          changeSubscription = textEditor.onDidChangeCursorPosition(function (_ref) {
            var newBufferPosition = _ref.newBufferPosition;

            if (oldRow !== newBufferPosition.row && _this.panelRepresents === 'Current Line') {
              oldRow = newBufferPosition.row;
              _this.update();
            }
          });
        })();
      }

      if (_this.panelRepresents !== 'Entire Project' || textEditor) {
        _this.update();
      }
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
      }
    }));
  }

  _createClass(PanelDelegate, [{
    key: 'getFilteredMessages',
    value: function getFilteredMessages() {
      var filteredMessages = [];
      if (this.panelRepresents === 'Entire Project') {
        filteredMessages = this.messages;
      } else if (this.panelRepresents === 'Current File') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        filteredMessages = (0, _helpers.filterMessages)(this.messages, activeEditor.getPath());
      } else if (this.panelRepresents === 'Current Line') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        var activeLine = activeEditor.getCursors()[0].getBufferRow();
        filteredMessages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, activeEditor.getPath(), _atom.Range.fromObject([[activeLine, 0], [activeLine, Infinity]]));
      }
      return filteredMessages;
    }
  }, {
    key: 'update',
    value: function update() {
      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(messages)) {
        this.messages = messages;
      }
      this.filteredMessages = this.getFilteredMessages();
      this.emitter.emit('observe-messages', this.filteredMessages);
    }
  }, {
    key: 'onDidChangeMessages',
    value: function onDidChangeMessages(callback) {
      return this.emitter.on('observe-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return PanelDelegate;
})();

module.exports = PanelDelegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9kZWxlZ2F0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVnRSxNQUFNOzt1QkFDWSxZQUFZOztJQUd4RixhQUFhO0FBT04sV0FQUCxhQUFhLEdBT0g7OzswQkFQVixhQUFhOztBQVFmLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO0FBQzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsRUFBRSxVQUFBLGVBQWUsRUFBSTtBQUMxRSxVQUFNLFVBQVUsR0FBRyxPQUFPLE1BQUssZUFBZSxLQUFLLFdBQVcsQ0FBQTtBQUM5RCxZQUFLLGVBQWUsR0FBRyxlQUFlLENBQUE7QUFDdEMsVUFBSSxVQUFVLEVBQUU7QUFDZCxjQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2Q7S0FDRixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksa0JBQWtCLFlBQUEsQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxZQUFNO0FBQ3JELFVBQUksa0JBQWtCLEVBQUU7QUFDdEIsMEJBQWtCLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsMEJBQWtCLEdBQUcsSUFBSSxDQUFBO09BQzFCO0FBQ0QsVUFBTSxVQUFVLEdBQUcsbUNBQXFCLENBQUE7QUFDeEMsVUFBSSxVQUFVLEVBQUU7O0FBQ2QsY0FBSSxNQUFLLGVBQWUsS0FBSyxnQkFBZ0IsRUFBRTtBQUM3QyxrQkFBSyxNQUFN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YW5lbC9kZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIEVtaXR0ZXIsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGdldEFjdGl2ZVRleHRFZGl0b3IsIGZpbHRlck1lc3NhZ2VzLCBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBQYW5lbERlbGVnYXRlIHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgZmlsdGVyZWRNZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBwYW5lbFJlcHJlc2VudHM6ICdFbnRpcmUgUHJvamVjdCcgfCAnQ3VycmVudCBGaWxlJyB8ICdDdXJyZW50IExpbmUnXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZmlsdGVyZWRNZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsUmVwcmVzZW50cycsIHBhbmVsUmVwcmVzZW50cyA9PiB7XG4gICAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5wYW5lbFJlcHJlc2VudHMgIT09ICd1bmRlZmluZWQnXG4gICAgICAgIHRoaXMucGFuZWxSZXByZXNlbnRzID0gcGFuZWxSZXByZXNlbnRzXG4gICAgICAgIGlmIChub3RJbml0aWFsKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgbGV0IGNoYW5nZVN1YnNjcmlwdGlvblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0oKCkgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICAgIGNoYW5nZVN1YnNjcmlwdGlvbiA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZXh0RWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGlmICh0ZXh0RWRpdG9yKSB7XG4gICAgICAgICAgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzICE9PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBvbGRSb3cgPSAtMVxuICAgICAgICAgIGNoYW5nZVN1YnNjcmlwdGlvbiA9IHRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoeyBuZXdCdWZmZXJQb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgICAgICBpZiAob2xkUm93ICE9PSBuZXdCdWZmZXJQb3NpdGlvbi5yb3cgJiYgdGhpcy5wYW5lbFJlcHJlc2VudHMgPT09ICdDdXJyZW50IExpbmUnKSB7XG4gICAgICAgICAgICAgIG9sZFJvdyA9IG5ld0J1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBhbmVsUmVwcmVzZW50cyAhPT0gJ0VudGlyZSBQcm9qZWN0JyB8fCB0ZXh0RWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgZ2V0RmlsdGVyZWRNZXNzYWdlcygpOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gICAgbGV0IGZpbHRlcmVkTWVzc2FnZXMgPSBbXVxuICAgIGlmICh0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0VudGlyZSBQcm9qZWN0Jykge1xuICAgICAgZmlsdGVyZWRNZXNzYWdlcyA9IHRoaXMubWVzc2FnZXNcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnQ3VycmVudCBGaWxlJykge1xuICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAoIWFjdGl2ZUVkaXRvcikgcmV0dXJuIFtdXG4gICAgICBmaWx0ZXJlZE1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXModGhpcy5tZXNzYWdlcywgYWN0aXZlRWRpdG9yLmdldFBhdGgoKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnQ3VycmVudCBMaW5lJykge1xuICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAoIWFjdGl2ZUVkaXRvcikgcmV0dXJuIFtdXG4gICAgICBjb25zdCBhY3RpdmVMaW5lID0gYWN0aXZlRWRpdG9yLmdldEN1cnNvcnMoKVswXS5nZXRCdWZmZXJSb3coKVxuICAgICAgZmlsdGVyZWRNZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQoXG4gICAgICAgIHRoaXMubWVzc2FnZXMsXG4gICAgICAgIGFjdGl2ZUVkaXRvci5nZXRQYXRoKCksXG4gICAgICAgIFJhbmdlLmZyb21PYmplY3QoW1thY3RpdmVMaW5lLCAwXSwgW2FjdGl2ZUxpbmUsIEluZmluaXR5XV0pLFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyZWRNZXNzYWdlc1xuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogP0FycmF5PExpbnRlck1lc3NhZ2U+ID0gbnVsbCk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgfVxuICAgIHRoaXMuZmlsdGVyZWRNZXNzYWdlcyA9IHRoaXMuZ2V0RmlsdGVyZWRNZXNzYWdlcygpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUtbWVzc2FnZXMnLCB0aGlzLmZpbHRlcmVkTWVzc2FnZXMpXG4gIH1cbiAgb25EaWRDaGFuZ2VNZXNzYWdlcyhjYWxsYmFjazogKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPikgPT4gYW55KTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxEZWxlZ2F0ZVxuIl19