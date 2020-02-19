Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var manifest = undefined;

function formatItem(item) {
  var itemName = undefined;
  if (item && typeof item === 'object' && typeof item.name === 'string') {
    itemName = item.name;
  } else if (typeof item === 'string') {
    itemName = item;
  } else {
    throw new Error('Unknown object passed to formatItem()');
  }
  return '  - ' + itemName;
}
function sortByName(item1, item2) {
  return item1.name.localeCompare(item2.name);
}

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter:enable-linter': function linterEnableLinter() {
        return _this.enableLinter();
      },
      'linter:disable-linter': function linterDisableLinter() {
        return _this.disableLinter();
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter:lint': function linterLint() {
        return _this.lint();
      },
      'linter:debug': function linterDebug() {
        return _this.debug();
      },
      'linter:toggle-active-editor': function linterToggleActiveEditor() {
        return _this.toggleActiveEditor();
      }
    }));
  }

  _createClass(Commands, [{
    key: 'lint',
    value: function lint() {
      this.emitter.emit('should-lint');
    }
  }, {
    key: 'debug',
    value: function debug() {
      this.emitter.emit('should-debug');
    }
  }, {
    key: 'enableLinter',
    value: function enableLinter() {
      this.emitter.emit('should-toggle-linter', 'enable');
    }
  }, {
    key: 'disableLinter',
    value: function disableLinter() {
      this.emitter.emit('should-toggle-linter', 'disable');
    }
  }, {
    key: 'toggleActiveEditor',
    value: function toggleActiveEditor() {
      this.emitter.emit('should-toggle-active-editor');
    }
  }, {
    key: 'showDebug',
    value: function showDebug(standardLinters, indieLinters, uiProviders) {
      if (!manifest) {
        manifest = require('../package.json');
      }

      var textEditor = atom.workspace.getActiveTextEditor();
      var textEditorScopes = Helpers.getEditorCursorScopes(textEditor);
      var sortedLinters = standardLinters.slice().sort(sortByName);
      var sortedIndieLinters = indieLinters.slice().sort(sortByName);
      var sortedUIProviders = uiProviders.slice().sort(sortByName);

      var indieLinterNames = sortedIndieLinters.map(formatItem).join('\n');
      var standardLinterNames = sortedLinters.map(formatItem).join('\n');
      var matchingStandardLinters = sortedLinters.filter(function (linter) {
        return Helpers.shouldTriggerLinter(linter, false, textEditorScopes);
      }).map(formatItem).join('\n');
      var humanizedScopes = textEditorScopes.map(formatItem).join('\n');
      var uiProviderNames = sortedUIProviders.map(formatItem).join('\n');

      var ignoreGlob = atom.config.get('linter.ignoreGlob');
      var ignoreVCSIgnoredPaths = atom.config.get('core.excludeVcsIgnoredPaths');
      var disabledLinters = atom.config.get('linter.disabledProviders').map(formatItem).join('\n');
      var filePathIgnored = Helpers.isPathIgnored(textEditor.getPath(), ignoreGlob, ignoreVCSIgnoredPaths);

      atom.notifications.addInfo('Linter Debug Info', {
        detail: ['Platform: ' + process.platform, 'Atom Version: ' + atom.getVersion(), 'Linter Version: ' + manifest.version, 'Opened file is ignored: ' + (filePathIgnored ? 'Yes' : 'No'), 'Matching Linter Providers: \n' + matchingStandardLinters, 'Disabled Linter Providers: \n' + disabledLinters, 'Standard Linter Providers: \n' + standardLinterNames, 'Indie Linter Providers: \n' + indieLinterNames, 'UI Providers: \n' + uiProviderNames, 'Ignore Glob: ' + ignoreGlob, 'VCS Ignored Paths are excluded: ' + ignoreVCSIgnoredPaths, 'Current File Scopes: \n' + humanizedScopes].join('\n'),
        dismissable: true
      });
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onShouldDebug',
    value: function onShouldDebug(callback) {
      return this.emitter.on('should-debug', callback);
    }
  }, {
    key: 'onShouldToggleActiveEditor',
    value: function onShouldToggleActiveEditor(callback) {
      return this.emitter.on('should-toggle-active-editor', callback);
    }
  }, {
    key: 'onShouldToggleLinter',
    value: function onShouldToggleLinter(callback) {
      return this.emitter.on('should-toggle-linter', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7dUJBRzFCLFdBQVc7O0lBQXhCLE9BQU87O0FBSW5CLElBQUksUUFBUSxZQUFBLENBQUE7O0FBRVosU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ3hCLE1BQUksUUFBUSxZQUFBLENBQUE7QUFDWixNQUFJLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNyRSxZQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtHQUNyQixNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ25DLFlBQVEsR0FBRyxJQUFJLENBQUE7R0FDaEIsTUFBTTtBQUNMLFVBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtHQUN6RDtBQUNELGtCQUFjLFFBQVEsQ0FBRTtDQUN6QjtBQUNELFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEMsU0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7Q0FDNUM7O0lBRW9CLFFBQVE7QUFJaEIsV0FKUSxRQUFRLEdBSWI7OzswQkFKSyxRQUFROztBQUt6QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsQyw0QkFBc0IsRUFBRTtlQUFNLE1BQUssWUFBWSxFQUFFO09BQUE7QUFDakQsNkJBQXVCLEVBQUU7ZUFBTSxNQUFLLGFBQWEsRUFBRTtPQUFBO0tBQ3BELENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFO0FBQ2hELG1CQUFhLEVBQUU7ZUFBTSxNQUFLLElBQUksRUFBRTtPQUFBO0FBQ2hDLG9CQUFjLEVBQUU7ZUFBTSxNQUFLLEtBQUssRUFBRTtPQUFBO0FBQ2xDLG1DQUE2QixFQUFFO2VBQU0sTUFBSyxrQkFBa0IsRUFBRTtPQUFBO0tBQy9ELENBQUMsQ0FDSCxDQUFBO0dBQ0Y7O2VBdEJrQixRQUFROztXQXVCdkIsZ0JBQUc7QUFDTCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUNqQzs7O1dBQ0ksaUJBQUc7QUFDTixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtLQUNsQzs7O1dBQ1csd0JBQUc7QUFDYixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNwRDs7O1dBQ1kseUJBQUc7QUFDZCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUNyRDs7O1dBQ2lCLDhCQUFHO0FBQ25CLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUE7S0FDakQ7OztXQUNRLG1CQUFDLGVBQThCLEVBQUUsWUFBa0MsRUFBRSxXQUFzQixFQUFFO0FBQ3BHLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO09BQ3RDOztBQUVELFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUN2RCxVQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNsRSxVQUFNLGFBQWEsR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzlELFVBQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNoRSxVQUFNLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRTlELFVBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN0RSxVQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BFLFVBQU0sdUJBQXVCLEdBQUcsYUFBYSxDQUMxQyxNQUFNLENBQUMsVUFBQSxNQUFNO2VBQUksT0FBTyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLENBQUM7T0FBQSxDQUFDLENBQzlFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FDZixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDYixVQUFNLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25FLFVBQU0sZUFBZSxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBFLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDdkQsVUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQzVFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQ2hDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUMvQixHQUFHLENBQUMsVUFBVSxDQUFDLENBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2IsVUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUE7O0FBRXRHLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFO0FBQzlDLGNBQU0sRUFBRSxnQkFDTyxPQUFPLENBQUMsUUFBUSxxQkFDWixJQUFJLENBQUMsVUFBVSxFQUFFLHVCQUNmLFFBQVEsQ0FBQyxPQUFPLGdDQUNSLGVBQWUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFBLG9DQUN6Qix1QkFBdUIsb0NBQ3ZCLGVBQWUsb0NBQ2YsbUJBQW1CLGlDQUN0QixnQkFBZ0IsdUJBQzFCLGVBQWUsb0JBQ2xCLFVBQVUsdUNBQ1MscUJBQXFCLDhCQUM5QixlQUFlLENBQzFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNaLG1CQUFXLEVBQUUsSUFBSTtPQUNsQixDQUFDLENBQUE7S0FDSDs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBYztBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBQ1ksdUJBQUMsUUFBa0IsRUFBYztBQUM1QyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNqRDs7O1dBQ3lCLG9DQUFDLFFBQWtCLEVBQWM7QUFDekQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRTs7O1dBQ21CLDhCQUFDLFFBQWtCLEVBQWM7QUFDbkQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6RDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FsR2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIFVJIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIEluZGllRGVsZWdhdGUgZnJvbSAnLi9pbmRpZS1kZWxlZ2F0ZSdcblxubGV0IG1hbmlmZXN0XG5cbmZ1bmN0aW9uIGZvcm1hdEl0ZW0oaXRlbSkge1xuICBsZXQgaXRlbU5hbWVcbiAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBpdGVtLm5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaXRlbU5hbWUgPSBpdGVtLm5hbWVcbiAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICBpdGVtTmFtZSA9IGl0ZW1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gb2JqZWN0IHBhc3NlZCB0byBmb3JtYXRJdGVtKCknKVxuICB9XG4gIHJldHVybiBgICAtICR7aXRlbU5hbWV9YFxufVxuZnVuY3Rpb24gc29ydEJ5TmFtZShpdGVtMSwgaXRlbTIpIHtcbiAgcmV0dXJuIGl0ZW0xLm5hbWUubG9jYWxlQ29tcGFyZShpdGVtMi5uYW1lKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kcyB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnbGludGVyOmVuYWJsZS1saW50ZXInOiAoKSA9PiB0aGlzLmVuYWJsZUxpbnRlcigpLFxuICAgICAgICAnbGludGVyOmRpc2FibGUtbGludGVyJzogKCkgPT4gdGhpcy5kaXNhYmxlTGludGVyKCksXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJywge1xuICAgICAgICAnbGludGVyOmxpbnQnOiAoKSA9PiB0aGlzLmxpbnQoKSxcbiAgICAgICAgJ2xpbnRlcjpkZWJ1Zyc6ICgpID0+IHRoaXMuZGVidWcoKSxcbiAgICAgICAgJ2xpbnRlcjp0b2dnbGUtYWN0aXZlLWVkaXRvcic6ICgpID0+IHRoaXMudG9nZ2xlQWN0aXZlRWRpdG9yKCksXG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgbGludCgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnKVxuICB9XG4gIGRlYnVnKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtZGVidWcnKVxuICB9XG4gIGVuYWJsZUxpbnRlcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXRvZ2dsZS1saW50ZXInLCAnZW5hYmxlJylcbiAgfVxuICBkaXNhYmxlTGludGVyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdG9nZ2xlLWxpbnRlcicsICdkaXNhYmxlJylcbiAgfVxuICB0b2dnbGVBY3RpdmVFZGl0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC10b2dnbGUtYWN0aXZlLWVkaXRvcicpXG4gIH1cbiAgc2hvd0RlYnVnKHN0YW5kYXJkTGludGVyczogQXJyYXk8TGludGVyPiwgaW5kaWVMaW50ZXJzOiBBcnJheTxJbmRpZURlbGVnYXRlPiwgdWlQcm92aWRlcnM6IEFycmF5PFVJPikge1xuICAgIGlmICghbWFuaWZlc3QpIHtcbiAgICAgIG1hbmlmZXN0ID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJylcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgY29uc3QgdGV4dEVkaXRvclNjb3BlcyA9IEhlbHBlcnMuZ2V0RWRpdG9yQ3Vyc29yU2NvcGVzKHRleHRFZGl0b3IpXG4gICAgY29uc3Qgc29ydGVkTGludGVycyA9IHN0YW5kYXJkTGludGVycy5zbGljZSgpLnNvcnQoc29ydEJ5TmFtZSlcbiAgICBjb25zdCBzb3J0ZWRJbmRpZUxpbnRlcnMgPSBpbmRpZUxpbnRlcnMuc2xpY2UoKS5zb3J0KHNvcnRCeU5hbWUpXG4gICAgY29uc3Qgc29ydGVkVUlQcm92aWRlcnMgPSB1aVByb3ZpZGVycy5zbGljZSgpLnNvcnQoc29ydEJ5TmFtZSlcblxuICAgIGNvbnN0IGluZGllTGludGVyTmFtZXMgPSBzb3J0ZWRJbmRpZUxpbnRlcnMubWFwKGZvcm1hdEl0ZW0pLmpvaW4oJ1xcbicpXG4gICAgY29uc3Qgc3RhbmRhcmRMaW50ZXJOYW1lcyA9IHNvcnRlZExpbnRlcnMubWFwKGZvcm1hdEl0ZW0pLmpvaW4oJ1xcbicpXG4gICAgY29uc3QgbWF0Y2hpbmdTdGFuZGFyZExpbnRlcnMgPSBzb3J0ZWRMaW50ZXJzXG4gICAgICAuZmlsdGVyKGxpbnRlciA9PiBIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyLCBmYWxzZSwgdGV4dEVkaXRvclNjb3BlcykpXG4gICAgICAubWFwKGZvcm1hdEl0ZW0pXG4gICAgICAuam9pbignXFxuJylcbiAgICBjb25zdCBodW1hbml6ZWRTY29wZXMgPSB0ZXh0RWRpdG9yU2NvcGVzLm1hcChmb3JtYXRJdGVtKS5qb2luKCdcXG4nKVxuICAgIGNvbnN0IHVpUHJvdmlkZXJOYW1lcyA9IHNvcnRlZFVJUHJvdmlkZXJzLm1hcChmb3JtYXRJdGVtKS5qb2luKCdcXG4nKVxuXG4gICAgY29uc3QgaWdub3JlR2xvYiA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmlnbm9yZUdsb2InKVxuICAgIGNvbnN0IGlnbm9yZVZDU0lnbm9yZWRQYXRocyA9IGF0b20uY29uZmlnLmdldCgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJylcbiAgICBjb25zdCBkaXNhYmxlZExpbnRlcnMgPSBhdG9tLmNvbmZpZ1xuICAgICAgLmdldCgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJylcbiAgICAgIC5tYXAoZm9ybWF0SXRlbSlcbiAgICAgIC5qb2luKCdcXG4nKVxuICAgIGNvbnN0IGZpbGVQYXRoSWdub3JlZCA9IEhlbHBlcnMuaXNQYXRoSWdub3JlZCh0ZXh0RWRpdG9yLmdldFBhdGgoKSwgaWdub3JlR2xvYiwgaWdub3JlVkNTSWdub3JlZFBhdGhzKVxuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0xpbnRlciBEZWJ1ZyBJbmZvJywge1xuICAgICAgZGV0YWlsOiBbXG4gICAgICAgIGBQbGF0Zm9ybTogJHtwcm9jZXNzLnBsYXRmb3JtfWAsXG4gICAgICAgIGBBdG9tIFZlcnNpb246ICR7YXRvbS5nZXRWZXJzaW9uKCl9YCxcbiAgICAgICAgYExpbnRlciBWZXJzaW9uOiAke21hbmlmZXN0LnZlcnNpb259YCxcbiAgICAgICAgYE9wZW5lZCBmaWxlIGlzIGlnbm9yZWQ6ICR7ZmlsZVBhdGhJZ25vcmVkID8gJ1llcycgOiAnTm8nfWAsXG4gICAgICAgIGBNYXRjaGluZyBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke21hdGNoaW5nU3RhbmRhcmRMaW50ZXJzfWAsXG4gICAgICAgIGBEaXNhYmxlZCBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke2Rpc2FibGVkTGludGVyc31gLFxuICAgICAgICBgU3RhbmRhcmQgTGludGVyIFByb3ZpZGVyczogXFxuJHtzdGFuZGFyZExpbnRlck5hbWVzfWAsXG4gICAgICAgIGBJbmRpZSBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke2luZGllTGludGVyTmFtZXN9YCxcbiAgICAgICAgYFVJIFByb3ZpZGVyczogXFxuJHt1aVByb3ZpZGVyTmFtZXN9YCxcbiAgICAgICAgYElnbm9yZSBHbG9iOiAke2lnbm9yZUdsb2J9YCxcbiAgICAgICAgYFZDUyBJZ25vcmVkIFBhdGhzIGFyZSBleGNsdWRlZDogJHtpZ25vcmVWQ1NJZ25vcmVkUGF0aHN9YCxcbiAgICAgICAgYEN1cnJlbnQgRmlsZSBTY29wZXM6IFxcbiR7aHVtYW5pemVkU2NvcGVzfWAsXG4gICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgfSlcbiAgfVxuICBvblNob3VsZExpbnQoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLWxpbnQnLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZERlYnVnKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1kZWJ1ZycsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkVG9nZ2xlQWN0aXZlRWRpdG9yKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC10b2dnbGUtYWN0aXZlLWVkaXRvcicsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkVG9nZ2xlTGludGVyKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC10b2dnbGUtbGludGVyJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==