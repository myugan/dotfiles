var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var Editors = undefined;
var TreeView = undefined;

var LinterUI = (function () {
  function LinterUI() {
    _classCallCheck(this, LinterUI);

    this.name = 'Linter';
    this.idleCallbacks = new Set();
    this.signal = new _busySignal2['default']();
    this.commands = new _commands2['default']();
    this.messages = [];
    this.statusBar = new _statusBar2['default']();
    this.intentions = new _intentions2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.signal);
    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.statusBar);

    var obsShowPanelCB = window.requestIdleCallback((function observeShowPanel() {
      this.idleCallbacks['delete'](obsShowPanelCB);
      this.panel = new _panel2['default']();
      this.panel.update(this.messages);
    }).bind(this));
    this.idleCallbacks.add(obsShowPanelCB);

    var obsShowDecorationsCB = window.requestIdleCallback((function observeShowDecorations() {
      var _this = this;

      this.idleCallbacks['delete'](obsShowDecorationsCB);
      if (!Editors) {
        Editors = require('./editors');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
        if (showDecorations && !_this.editors) {
          _this.editors = new Editors();
          _this.editors.update({
            added: _this.messages,
            removed: [],
            messages: _this.messages
          });
        } else if (!showDecorations && _this.editors) {
          _this.editors.dispose();
          _this.editors = null;
        }
      }));
    }).bind(this));
    this.idleCallbacks.add(obsShowDecorationsCB);
  }

  _createClass(LinterUI, [{
    key: 'render',
    value: function render(difference) {
      var editors = this.editors;

      this.messages = difference.messages;
      if (editors) {
        if (editors.isFirstRender()) {
          editors.update({
            added: difference.messages,
            removed: [],
            messages: difference.messages
          });
        } else {
          editors.update(difference);
        }
      }
      // Initialize the TreeView subscription if necessary
      if (!this.treeview) {
        if (!TreeView) {
          TreeView = require('./tree-view');
        }
        this.treeview = new TreeView();
        this.subscriptions.add(this.treeview);
      }
      this.treeview.update(difference.messages);

      if (this.panel) {
        this.panel.update(difference.messages);
      }
      this.commands.update(difference.messages);
      this.intentions.update(difference.messages);
      this.statusBar.update(difference.messages);
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      this.signal.didBeginLinting(linter, filePath);
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      this.signal.didFinishLinting(linter, filePath);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
      if (this.panel) {
        this.panel.dispose();
      }
      if (this.editors) {
        this.editors.dispose();
      }
    }
  }]);

  return LinterUI;
})();

module.exports = LinterUI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ3hCLFNBQVM7Ozs7d0JBQ04sWUFBWTs7Ozt5QkFDWCxjQUFjOzs7OzBCQUNiLGVBQWU7Ozs7MEJBQ2YsY0FBYzs7OztBQUdyQyxJQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsSUFBSSxRQUFRLFlBQUEsQ0FBQTs7SUFFTixRQUFRO0FBYUQsV0FiUCxRQUFRLEdBYUU7MEJBYlYsUUFBUTs7QUFjVixRQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUNwQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyw2QkFBZ0IsQ0FBQTtBQUM5QixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLFNBQVMsR0FBRyw0QkFBZSxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLEdBQUcsNkJBQWdCLENBQUE7QUFDbEMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRXRDLFFBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FDL0MsQ0FBQSxTQUFTLGdCQUFnQixHQUFHO0FBQzFCLFVBQUksQ0FBQyxhQUFhLFVBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN6QyxV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Q0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUMzQzs7O1dBQ2MseUJBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUU7QUFDaEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzlDOzs7V0FDZSwwQkFBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBRTtBQUNqRCxVQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMvQzs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7ZUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO09BQUEsQ0FBQyxDQUFBO0FBQy9FLFVBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDMUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3JCO0FBQ0QsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdkI7S0FDRjs7O1NBN0dHLFFBQVE7OztBQWdIZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFBhbmVsIGZyb20gJy4vcGFuZWwnXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnLi9zdGF0dXMtYmFyJ1xuaW1wb3J0IEJ1c3lTaWduYWwgZnJvbSAnLi9idXN5LXNpZ25hbCdcbmltcG9ydCBJbnRlbnRpb25zIGZyb20gJy4vaW50ZW50aW9ucydcbmltcG9ydCB0eXBlIHsgTGludGVyLCBMaW50ZXJNZXNzYWdlLCBNZXNzYWdlc1BhdGNoIH0gZnJvbSAnLi90eXBlcydcblxubGV0IEVkaXRvcnNcbmxldCBUcmVlVmlld1xuXG5jbGFzcyBMaW50ZXJVSSB7XG4gIG5hbWU6IHN0cmluZ1xuICBwYW5lbDogUGFuZWxcbiAgc2lnbmFsOiBCdXN5U2lnbmFsXG4gIGVkaXRvcnM6ID9FZGl0b3JzXG4gIHRyZWV2aWV3OiBUcmVlVmlld1xuICBjb21tYW5kczogQ29tbWFuZHNcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIHN0YXR1c0JhcjogU3RhdHVzQmFyXG4gIGludGVudGlvbnM6IEludGVudGlvbnNcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBpZGxlQ2FsbGJhY2tzOiBTZXQ8bnVtYmVyPlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubmFtZSA9ICdMaW50ZXInXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zaWduYWwgPSBuZXcgQnVzeVNpZ25hbCgpXG4gICAgdGhpcy5jb21tYW5kcyA9IG5ldyBDb21tYW5kcygpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdGF0dXNCYXIgPSBuZXcgU3RhdHVzQmFyKClcbiAgICB0aGlzLmludGVudGlvbnMgPSBuZXcgSW50ZW50aW9ucygpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnNpZ25hbClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnN0YXR1c0JhcilcblxuICAgIGNvbnN0IG9ic1Nob3dQYW5lbENCID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiBvYnNlcnZlU2hvd1BhbmVsKCkge1xuICAgICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKG9ic1Nob3dQYW5lbENCKVxuICAgICAgICB0aGlzLnBhbmVsID0gbmV3IFBhbmVsKClcbiAgICAgICAgdGhpcy5wYW5lbC51cGRhdGUodGhpcy5tZXNzYWdlcylcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICApXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChvYnNTaG93UGFuZWxDQilcblxuICAgIGNvbnN0IG9ic1Nob3dEZWNvcmF0aW9uc0NCID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiBvYnNlcnZlU2hvd0RlY29yYXRpb25zKCkge1xuICAgICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKG9ic1Nob3dEZWNvcmF0aW9uc0NCKVxuICAgICAgICBpZiAoIUVkaXRvcnMpIHtcbiAgICAgICAgICBFZGl0b3JzID0gcmVxdWlyZSgnLi9lZGl0b3JzJylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dEZWNvcmF0aW9ucycsIHNob3dEZWNvcmF0aW9ucyA9PiB7XG4gICAgICAgICAgICBpZiAoc2hvd0RlY29yYXRpb25zICYmICF0aGlzLmVkaXRvcnMpIHtcbiAgICAgICAgICAgICAgdGhpcy5lZGl0b3JzID0gbmV3IEVkaXRvcnMoKVxuICAgICAgICAgICAgICB0aGlzLmVkaXRvcnMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBhZGRlZDogdGhpcy5tZXNzYWdlcyxcbiAgICAgICAgICAgICAgICByZW1vdmVkOiBbXSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogdGhpcy5tZXNzYWdlcyxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNob3dEZWNvcmF0aW9ucyAmJiB0aGlzLmVkaXRvcnMpIHtcbiAgICAgICAgICAgICAgdGhpcy5lZGl0b3JzLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICB0aGlzLmVkaXRvcnMgPSBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICApXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChvYnNTaG93RGVjb3JhdGlvbnNDQilcbiAgfVxuICByZW5kZXIoZGlmZmVyZW5jZTogTWVzc2FnZXNQYXRjaCkge1xuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmVkaXRvcnNcblxuICAgIHRoaXMubWVzc2FnZXMgPSBkaWZmZXJlbmNlLm1lc3NhZ2VzXG4gICAgaWYgKGVkaXRvcnMpIHtcbiAgICAgIGlmIChlZGl0b3JzLmlzRmlyc3RSZW5kZXIoKSkge1xuICAgICAgICBlZGl0b3JzLnVwZGF0ZSh7XG4gICAgICAgICAgYWRkZWQ6IGRpZmZlcmVuY2UubWVzc2FnZXMsXG4gICAgICAgICAgcmVtb3ZlZDogW10sXG4gICAgICAgICAgbWVzc2FnZXM6IGRpZmZlcmVuY2UubWVzc2FnZXMsXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlZGl0b3JzLnVwZGF0ZShkaWZmZXJlbmNlKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIHRoZSBUcmVlVmlldyBzdWJzY3JpcHRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKCF0aGlzLnRyZWV2aWV3KSB7XG4gICAgICBpZiAoIVRyZWVWaWV3KSB7XG4gICAgICAgIFRyZWVWaWV3ID0gcmVxdWlyZSgnLi90cmVlLXZpZXcnKVxuICAgICAgfVxuICAgICAgdGhpcy50cmVldmlldyA9IG5ldyBUcmVlVmlldygpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMudHJlZXZpZXcpXG4gICAgfVxuICAgIHRoaXMudHJlZXZpZXcudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG5cbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgICB9XG4gICAgdGhpcy5jb21tYW5kcy51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgICB0aGlzLmludGVudGlvbnMudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy5zdGF0dXNCYXIudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gIH1cbiAgZGlkQmVnaW5MaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5zaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gIH1cbiAgZGlkRmluaXNoTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuc2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICB9XG4gICAgaWYgKHRoaXMuZWRpdG9ycykge1xuICAgICAgdGhpcy5lZGl0b3JzLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclVJXG4iXX0=