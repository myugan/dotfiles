var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _helpers = require('../helpers');

var StatusBar = (function () {
  function StatusBar() {
    var _this = this;

    _classCallCheck(this, StatusBar);

    this.element = new _element2['default']();
    this.messages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.element);
    this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarRepresents', function (statusBarRepresents) {
      var notInitial = typeof _this.statusBarRepresents !== 'undefined';
      _this.statusBarRepresents = statusBarRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarClickBehavior', function (statusBarClickBehavior) {
      var notInitial = typeof _this.statusBarClickBehavior !== 'undefined';
      _this.statusBarClickBehavior = statusBarClickBehavior;
      if (notInitial) {
        _this.update();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showStatusBar', function (showStatusBar) {
      _this.element.setVisibility('config', showStatusBar);
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function (paneItem) {
      var isTextEditor = atom.workspace.isTextEditor(paneItem);
      _this.element.setVisibility('pane', isTextEditor);
      if (isTextEditor && _this.statusBarRepresents === 'Current File') {
        _this.update();
      }
    }));

    this.element.onDidClick(function (type) {
      var workspaceView = atom.views.getView(atom.workspace);
      if (_this.statusBarClickBehavior === 'Toggle Panel') {
        atom.commands.dispatch(workspaceView, 'linter-ui-default:toggle-panel');
      } else if (_this.statusBarClickBehavior === 'Toggle Status Bar Scope') {
        atom.config.set('linter-ui-default.statusBarRepresents', _this.statusBarRepresents === 'Entire Project' ? 'Current File' : 'Entire Project');
      } else {
        var postfix = _this.statusBarRepresents === 'Current File' ? '-in-current-file' : '';
        atom.commands.dispatch(workspaceView, 'linter-ui-default:next-' + type + postfix);
      }
    });
  }

  _createClass(StatusBar, [{
    key: 'update',
    value: function update() {
      var _this2 = this;

      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (messages) {
        this.messages = messages;
      } else {
        messages = this.messages;
      }

      var count = { error: 0, warning: 0, info: 0 };
      var currentTextEditor = (0, _helpers.getActiveTextEditor)();
      var currentPath = currentTextEditor && currentTextEditor.getPath() || NaN;
      // NOTE: ^ Setting default to NaN so it won't match empty file paths in messages

      messages.forEach(function (message) {
        if (_this2.statusBarRepresents === 'Entire Project' || (0, _helpers.$file)(message) === currentPath) {
          if (message.severity === 'error') {
            count.error++;
          } else if (message.severity === 'warning') {
            count.warning++;
          } else {
            count.info++;
          }
        }
      });
      this.element.update(count.error, count.warning, count.info);
    }
  }, {
    key: 'attach',
    value: function attach(statusBarRegistry) {
      var _this3 = this;

      var statusBar = null;

      this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarPosition', function (statusBarPosition) {
        if (statusBar) {
          statusBar.destroy();
        }
        statusBar = statusBarRegistry['add' + statusBarPosition + 'Tile']({
          item: _this3.element.item,
          priority: statusBarPosition === 'Left' ? 0 : 1000
        });
      }));
      this.subscriptions.add(new _atom.Disposable(function () {
        if (statusBar) {
          statusBar.destroy();
        }
      }));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return StatusBar;
})();

module.exports = StatusBar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9zdGF0dXMtYmFyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFZ0QsTUFBTTs7dUJBQ2xDLFdBQVc7Ozs7dUJBQ1ksWUFBWTs7SUFHakQsU0FBUztBQU9GLFdBUFAsU0FBUyxHQU9DOzs7MEJBUFYsU0FBUzs7QUFRWCxRQUFJLENBQUMsT0FBTyxHQUFHLDBCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsRUFBRSxVQUFBLG1CQUFtQixFQUFJO0FBQ2xGLFVBQU0sVUFBVSxHQUFHLE9BQU8sTUFBSyxtQkFBbUIsS0FBSyxXQUFXLENBQUE7QUFDbEUsWUFBSyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQTtBQUM5QyxVQUFJLFVBQVUsRUFBRTtBQUNkLGNBQUssTUFBTSxFQUFFLENBQUE7T0FDZDtLQUNGLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDBDQUEwQyxFQUFFLFVBQUEsc0JBQXNCLEVBQUk7QUFDeEYsVUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFLLHNCQUFzQixLQUFLLFdBQVcsQ0FBQTtBQUNyRSxZQUFLLHNCQUFzQixHQUFHLHNCQUFzQixDQUFBO0FBQ3BELFVBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSyxNQUFNLEVBQUUsQ0FBQTtPQUNkO0tBQ0YsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJ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RUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDNUQ7OztXQUNLLGdCQUFDLGlCQUF5QixFQUFFOzs7QUFDaEMsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFBOztBQUVwQixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUNBQXFDLEVBQUUsVUFBQSxpQkFBaUIsRUFBSTtBQUM5RSxZQUFJLFNBQVMsRUFBRTtBQUNiLG1CQUFTLENBQUMsT0FBTyxFQUFFLENBQUE7U0FDcEI7QUFDRCxpQkFBUyxHQUFHLGlCQUFpQixTQUFPLGlCQUFpQixVQUFPLENBQUM7QUFDM0QsY0FBSSxFQUFFLE9BQUssT0FBTyxDQUFDLElBQUk7QUFDdkIsa0JBQVEsRUFBRSxpQkFBaUIsS0FBSyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUk7U0FDbEQsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUNILENBQUE7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIscUJBQWUsWUFBVztBQUN4QixZQUFJLFNBQVMsRUFBRTtBQUNiLG1CQUFTLENBQUMsT0FBTyxFQUFFLENBQUE7U0FDcEI7T0FDRixDQUFDLENBQ0gsQ0FBQTtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQTlHRyxTQUFTOzs7QUFpSGYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudCdcbmltcG9ydCB7ICRmaWxlLCBnZXRBY3RpdmVUZXh0RWRpdG9yIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBTdGF0dXNCYXIge1xuICBlbGVtZW50OiBFbGVtZW50XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHN0YXR1c0JhclJlcHJlc2VudHM6ICdFbnRpcmUgUHJvamVjdCcgfCAnQ3VycmVudCBGaWxlJ1xuICBzdGF0dXNCYXJDbGlja0JlaGF2aW9yOiAnVG9nZ2xlIFBhbmVsJyB8ICdKdW1wIHRvIG5leHQgaXNzdWUnIHwgJ1RvZ2dsZSBTdGF0dXMgQmFyIFNjb3BlJ1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZWxlbWVudCA9IG5ldyBFbGVtZW50KClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWxlbWVudClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc3RhdHVzQmFyUmVwcmVzZW50cycsIHN0YXR1c0JhclJlcHJlc2VudHMgPT4ge1xuICAgICAgICBjb25zdCBub3RJbml0aWFsID0gdHlwZW9mIHRoaXMuc3RhdHVzQmFyUmVwcmVzZW50cyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJSZXByZXNlbnRzID0gc3RhdHVzQmFyUmVwcmVzZW50c1xuICAgICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zdGF0dXNCYXJDbGlja0JlaGF2aW9yJywgc3RhdHVzQmFyQ2xpY2tCZWhhdmlvciA9PiB7XG4gICAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5zdGF0dXNCYXJDbGlja0JlaGF2aW9yICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICB0aGlzLnN0YXR1c0JhckNsaWNrQmVoYXZpb3IgPSBzdGF0dXNCYXJDbGlja0JlaGF2aW9yXG4gICAgICAgIGlmIChub3RJbml0aWFsKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dTdGF0dXNCYXInLCBzaG93U3RhdHVzQmFyID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldFZpc2liaWxpdHkoJ2NvbmZpZycsIHNob3dTdGF0dXNCYXIpXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9ic2VydmVBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGlzVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihwYW5lSXRlbSlcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldFZpc2liaWxpdHkoJ3BhbmUnLCBpc1RleHRFZGl0b3IpXG4gICAgICAgIGlmIChpc1RleHRFZGl0b3IgJiYgdGhpcy5zdGF0dXNCYXJSZXByZXNlbnRzID09PSAnQ3VycmVudCBGaWxlJykge1xuICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuXG4gICAgdGhpcy5lbGVtZW50Lm9uRGlkQ2xpY2sodHlwZSA9PiB7XG4gICAgICBjb25zdCB3b3Jrc3BhY2VWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgICAgaWYgKHRoaXMuc3RhdHVzQmFyQ2xpY2tCZWhhdmlvciA9PT0gJ1RvZ2dsZSBQYW5lbCcpIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VWaWV3LCAnbGludGVyLXVpLWRlZmF1bHQ6dG9nZ2xlLXBhbmVsJylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXNCYXJDbGlja0JlaGF2aW9yID09PSAnVG9nZ2xlIFN0YXR1cyBCYXIgU2NvcGUnKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcbiAgICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQuc3RhdHVzQmFyUmVwcmVzZW50cycsXG4gICAgICAgICAgdGhpcy5zdGF0dXNCYXJSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnID8gJ0N1cnJlbnQgRmlsZScgOiAnRW50aXJlIFByb2plY3QnLFxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwb3N0Zml4ID0gdGhpcy5zdGF0dXNCYXJSZXByZXNlbnRzID09PSAnQ3VycmVudCBGaWxlJyA/ICctaW4tY3VycmVudC1maWxlJyA6ICcnXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlVmlldywgYGxpbnRlci11aS1kZWZhdWx0Om5leHQtJHt0eXBlfSR7cG9zdGZpeH1gKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiA/QXJyYXk8TGludGVyTWVzc2FnZT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzXG4gICAgfVxuXG4gICAgY29uc3QgY291bnQgPSB7IGVycm9yOiAwLCB3YXJuaW5nOiAwLCBpbmZvOiAwIH1cbiAgICBjb25zdCBjdXJyZW50VGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gKGN1cnJlbnRUZXh0RWRpdG9yICYmIGN1cnJlbnRUZXh0RWRpdG9yLmdldFBhdGgoKSkgfHwgTmFOXG4gICAgLy8gTk9URTogXiBTZXR0aW5nIGRlZmF1bHQgdG8gTmFOIHNvIGl0IHdvbid0IG1hdGNoIGVtcHR5IGZpbGUgcGF0aHMgaW4gbWVzc2FnZXNcblxuICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0dXNCYXJSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnIHx8ICRmaWxlKG1lc3NhZ2UpID09PSBjdXJyZW50UGF0aCkge1xuICAgICAgICBpZiAobWVzc2FnZS5zZXZlcml0eSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGNvdW50LmVycm9yKytcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLnNldmVyaXR5ID09PSAnd2FybmluZycpIHtcbiAgICAgICAgICBjb3VudC53YXJuaW5nKytcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3VudC5pbmZvKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5lbGVtZW50LnVwZGF0ZShjb3VudC5lcnJvciwgY291bnQud2FybmluZywgY291bnQuaW5mbylcbiAgfVxuICBhdHRhY2goc3RhdHVzQmFyUmVnaXN0cnk6IE9iamVjdCkge1xuICAgIGxldCBzdGF0dXNCYXIgPSBudWxsXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc3RhdHVzQmFyUG9zaXRpb24nLCBzdGF0dXNCYXJQb3NpdGlvbiA9PiB7XG4gICAgICAgIGlmIChzdGF0dXNCYXIpIHtcbiAgICAgICAgICBzdGF0dXNCYXIuZGVzdHJveSgpXG4gICAgICAgIH1cbiAgICAgICAgc3RhdHVzQmFyID0gc3RhdHVzQmFyUmVnaXN0cnlbYGFkZCR7c3RhdHVzQmFyUG9zaXRpb259VGlsZWBdKHtcbiAgICAgICAgICBpdGVtOiB0aGlzLmVsZW1lbnQuaXRlbSxcbiAgICAgICAgICBwcmlvcml0eTogc3RhdHVzQmFyUG9zaXRpb24gPT09ICdMZWZ0JyA/IDAgOiAxMDAwLFxuICAgICAgICB9KVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHN0YXR1c0Jhcikge1xuICAgICAgICAgIHN0YXR1c0Jhci5kZXN0cm95KClcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHVzQmFyXG4iXX0=