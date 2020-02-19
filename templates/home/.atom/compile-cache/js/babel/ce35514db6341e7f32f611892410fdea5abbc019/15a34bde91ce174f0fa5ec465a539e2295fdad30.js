Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utils = require('./utils');

var workspaceCommands = ['golang:get-package', 'golang:update-tools', 'golang:toggle-panel', 'golang:showdoc'];

var editorCommands = ['golang:run-tests', 'golang:hide-coverage', 'golang:gorename'];

var Bootstrap = (function () {
  function Bootstrap(onActivated) {
    _classCallCheck(this, Bootstrap);

    this.onActivated = onActivated;
    this.subscriptions = new _atom.CompositeDisposable();
    this.grammarUsed = false;
    this.commandUsed = false;
    this.environmentLoaded = false;
    this.activated = false;
    this.subscribeToCommands();
    this.subscribeToEvents();
  }

  _createClass(Bootstrap, [{
    key: 'subscribeToCommands',
    value: function subscribeToCommands() {
      var _this = this;

      for (var command of workspaceCommands) {
        this.subscriptions.add(atom.commands.add('atom-workspace', command, function () {
          _this.setCommandUsed();
        }));
      }

      for (var command of editorCommands) {
        this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="go"]', command, function () {
          _this.setCommandUsed();
        }));
      }
    }
  }, {
    key: 'subscribeToEvents',
    value: function subscribeToEvents() {
      var _this2 = this;

      var activationHook = function activationHook(hookName, fn) {
        var hooks = atom.packages.triggeredActivationHooks;
        if (hooks && hooks.has(hookName)) {
          fn();
          return;
        }
        _this2.subscriptions.add(atom.packages.onDidTriggerActivationHook(hookName, fn));
      };

      activationHook('core:loaded-shell-environment', function () {
        _this2.setEnvironmentLoaded();
      });

      activationHook('language-go:grammar-used', function () {
        _this2.setGrammarUsed();
      });

      this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        if ((0, _utils.isValidEditor)(editor)) {
          _this2.setGrammarUsed();
        }
      }));
    }
  }, {
    key: 'setEnvironmentLoaded',
    value: function setEnvironmentLoaded() {
      this.environmentLoaded = true;
      this.check();
    }
  }, {
    key: 'setGrammarUsed',
    value: function setGrammarUsed() {
      this.grammarUsed = true;
      this.check();
    }
  }, {
    key: 'setCommandUsed',
    value: function setCommandUsed() {
      this.commandUsed = true;
      this.check();
    }
  }, {
    key: 'check',
    value: function check() {
      if (this.activated) {
        return;
      }

      if (this.environmentLoaded && (this.grammarUsed || this.commandUsed)) {
        this.activated = true;
        this.subscriptions.dispose();
        if (this.onActivated) {
          this.onActivated();
        }
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.onActivated = null;
      this.grammarUsed = false;
      this.commandUsed = false;
      this.environmentLoaded = false;
      this.activated = false;
    }
  }]);

  return Bootstrap;
})();

exports.Bootstrap = Bootstrap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2Jvb3RzdHJhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ1osU0FBUzs7QUFFdkMsSUFBTSxpQkFBaUIsR0FBRyxDQUN4QixvQkFBb0IsRUFDcEIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixnQkFBZ0IsQ0FDakIsQ0FBQTs7QUFFRCxJQUFNLGNBQWMsR0FBRyxDQUNyQixrQkFBa0IsRUFDbEIsc0JBQXNCLEVBQ3RCLGlCQUFpQixDQUNsQixDQUFBOztJQUVLLFNBQVM7QUFRRixXQVJQLFNBQVMsQ0FRRCxXQUF1QixFQUFFOzBCQVJqQyxTQUFTOztBQVNYLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDeEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDeEIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtBQUM5QixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtBQUN0QixRQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtHQUN6Qjs7ZUFqQkcsU0FBUzs7V0FtQk0sK0JBQUc7OztBQUNwQixXQUFLLElBQU0sT0FBTyxJQUFJLGlCQUFpQixFQUFFO0FBQ3ZDLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsWUFBTTtBQUNqRCxnQkFBSyxjQUFjLEVBQUUsQ0FBQTtTQUN0QixDQUFDLENBQ0gsQ0FBQTtPQUNGOztBQUVELFdBQUssSUFBTSxPQUFPLElBQUksY0FBYyxFQUFFO0FBQ3BDLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDZixzQ0FBc0MsRUFDdEMsT0FBTyxFQUNQLFlBQU07QUFDSixnQkFBSyxjQUFjLEVBQUUsQ0FBQTtTQUN0QixDQUNGLENBQ0YsQ0FBQTtPQUNGO0tBQ0Y7OztXQUVnQiw2QkFBRzs7O0FBQ2xCLFVBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxRQUFRLEVBQUUsRUFBRSxFQUFLO0FBQ3ZDLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUE7QUFDcEQsWUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNoQyxZQUFFLEVBQUUsQ0FBQTtBQUNKLGlCQUFNO1NBQ1A7QUFDRCxlQUFLLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUN2RCxDQUFBO09BQ0YsQ0FBQTs7QUFFRCxvQkFBYyxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDcEQsZUFBSyxvQkFBb0IsRUFBRSxDQUFBO09BQzVCLENBQUMsQ0FBQTs7QUFFRixvQkFBYyxDQUFDLDBCQUEwQixFQUFFLFlBQU07QUFDL0MsZUFBSyxjQUFjLEVBQUUsQ0FBQTtPQUN0QixDQUFDLENBQUE7O0FBRUYsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDMUMsWUFBSSwwQkFBYyxNQUFNLENBQUMsRUFBRTtBQUN6QixpQkFBSyxjQUFjLEVBQUUsQ0FBQTtTQUN0QjtPQUNGLENBQUMsQ0FDSCxDQUFBO0tBQ0Y7OztXQUVtQixnQ0FBRztBQUNyQixVQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBQzdCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNiOzs7V0FFYSwwQkFBRztBQUNmLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNiOzs7V0FFYSwwQkFBRztBQUNmLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNiOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixlQUFNO09BQ1A7O0FBRUQsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFBLEFBQUMsRUFBRTtBQUNwRSxZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFlBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixjQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7U0FDbkI7T0FDRjtLQUNGOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQzdCO0FBQ0QsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDdkIsVUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDeEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDeEIsVUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtBQUM5QixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtLQUN2Qjs7O1NBNUdHLFNBQVM7OztRQStHTixTQUFTLEdBQVQsU0FBUyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9ib290c3RyYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGlzVmFsaWRFZGl0b3IgfSBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCB3b3Jrc3BhY2VDb21tYW5kcyA9IFtcbiAgJ2dvbGFuZzpnZXQtcGFja2FnZScsXG4gICdnb2xhbmc6dXBkYXRlLXRvb2xzJyxcbiAgJ2dvbGFuZzp0b2dnbGUtcGFuZWwnLFxuICAnZ29sYW5nOnNob3dkb2MnXG5dXG5cbmNvbnN0IGVkaXRvckNvbW1hbmRzID0gW1xuICAnZ29sYW5nOnJ1bi10ZXN0cycsXG4gICdnb2xhbmc6aGlkZS1jb3ZlcmFnZScsXG4gICdnb2xhbmc6Z29yZW5hbWUnXG5dXG5cbmNsYXNzIEJvb3RzdHJhcCB7XG4gIG9uQWN0aXZhdGVkOiA/KCkgPT4gdm9pZFxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGdyYW1tYXJVc2VkOiBib29sZWFuXG4gIGNvbW1hbmRVc2VkOiBib29sZWFuXG4gIGVudmlyb25tZW50TG9hZGVkOiBib29sZWFuXG4gIGFjdGl2YXRlZDogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yKG9uQWN0aXZhdGVkOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vbkFjdGl2YXRlZCA9IG9uQWN0aXZhdGVkXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZ3JhbW1hclVzZWQgPSBmYWxzZVxuICAgIHRoaXMuY29tbWFuZFVzZWQgPSBmYWxzZVxuICAgIHRoaXMuZW52aXJvbm1lbnRMb2FkZWQgPSBmYWxzZVxuICAgIHRoaXMuYWN0aXZhdGVkID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmliZVRvQ29tbWFuZHMoKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9FdmVudHMoKVxuICB9XG5cbiAgc3Vic2NyaWJlVG9Db21tYW5kcygpIHtcbiAgICBmb3IgKGNvbnN0IGNvbW1hbmQgb2Ygd29ya3NwYWNlQ29tbWFuZHMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIGNvbW1hbmQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldENvbW1hbmRVc2VkKClcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNvbW1hbmQgb2YgZWRpdG9yQ29tbWFuZHMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAgICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcn49XCJnb1wiXScsXG4gICAgICAgICAgY29tbWFuZCxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldENvbW1hbmRVc2VkKClcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmVUb0V2ZW50cygpIHtcbiAgICBjb25zdCBhY3RpdmF0aW9uSG9vayA9IChob29rTmFtZSwgZm4pID0+IHtcbiAgICAgIGNvbnN0IGhvb2tzID0gYXRvbS5wYWNrYWdlcy50cmlnZ2VyZWRBY3RpdmF0aW9uSG9va3NcbiAgICAgIGlmIChob29rcyAmJiBob29rcy5oYXMoaG9va05hbWUpKSB7XG4gICAgICAgIGZuKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBhdG9tLnBhY2thZ2VzLm9uRGlkVHJpZ2dlckFjdGl2YXRpb25Ib29rKGhvb2tOYW1lLCBmbilcbiAgICAgIClcbiAgICB9XG5cbiAgICBhY3RpdmF0aW9uSG9vaygnY29yZTpsb2FkZWQtc2hlbGwtZW52aXJvbm1lbnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldEVudmlyb25tZW50TG9hZGVkKClcbiAgICB9KVxuXG4gICAgYWN0aXZhdGlvbkhvb2soJ2xhbmd1YWdlLWdvOmdyYW1tYXItdXNlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0R3JhbW1hclVzZWQoKVxuICAgIH0pXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG4gICAgICAgIGlmIChpc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcbiAgICAgICAgICB0aGlzLnNldEdyYW1tYXJVc2VkKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBzZXRFbnZpcm9ubWVudExvYWRlZCgpIHtcbiAgICB0aGlzLmVudmlyb25tZW50TG9hZGVkID0gdHJ1ZVxuICAgIHRoaXMuY2hlY2soKVxuICB9XG5cbiAgc2V0R3JhbW1hclVzZWQoKSB7XG4gICAgdGhpcy5ncmFtbWFyVXNlZCA9IHRydWVcbiAgICB0aGlzLmNoZWNrKClcbiAgfVxuXG4gIHNldENvbW1hbmRVc2VkKCkge1xuICAgIHRoaXMuY29tbWFuZFVzZWQgPSB0cnVlXG4gICAgdGhpcy5jaGVjaygpXG4gIH1cblxuICBjaGVjaygpIHtcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLmVudmlyb25tZW50TG9hZGVkICYmICh0aGlzLmdyYW1tYXJVc2VkIHx8IHRoaXMuY29tbWFuZFVzZWQpKSB7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IHRydWVcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXMub25BY3RpdmF0ZWQoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLm9uQWN0aXZhdGVkID0gbnVsbFxuICAgIHRoaXMuZ3JhbW1hclVzZWQgPSBmYWxzZVxuICAgIHRoaXMuY29tbWFuZFVzZWQgPSBmYWxzZVxuICAgIHRoaXMuZW52aXJvbm1lbnRMb2FkZWQgPSBmYWxzZVxuICAgIHRoaXMuYWN0aXZhdGVkID0gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgeyBCb290c3RyYXAgfVxuIl19