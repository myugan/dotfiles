Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path2 = require('path');

var _path = _interopRequireWildcard(_path2);

var _atom = require('atom');

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

'use babel';

var providers = [{
  name: 'go-debug-config',
  warnIfMissing: true,
  path: function path() {
    return atom.config.get('go-debug.configurationFile');
  },
  validate: function validate(content) {
    var issues = [];
    if (!Array.isArray(content.configurations)) {
      issues.push('Expected an object like { configurations: [ ... ] } but got ' + JSON.stringify(content) + ' instead!');
    }
    return issues;
  },
  prepare: function prepare(content) {
    return content.configurations;
  }
}, {
  // try to use the vscode settings too
  name: 'vscode',
  warnIfMissing: false,
  path: function path() {
    return _path.join('.vscode', 'launch.json');
  },
  validate: function validate(content) {
    var issues = [];
    if (!Array.isArray(content.configurations)) {
      issues.push('Expected an object like { configurations: [ ... ] } but got ' + JSON.stringify(content) + ' instead!');
    }
    return issues;
  },
  prepare: function prepare(content) {
    return content.configurations;
  }
}];

var DelveConfiguration = (function () {
  function DelveConfiguration(store, watcher) {
    _classCallCheck(this, DelveConfiguration);

    this._store = store;
    this._watcher = watcher;

    this._subscriptions = new _atom.CompositeDisposable();

    // add the default configs
    this._configurations = [{
      file: '',
      configs: [{ name: 'Debug', mode: 'debug' }, { name: 'Test', mode: 'test' }, { name: 'Attach', mode: 'attach' }]
    }];
    this.updateStore(); // set the default configs in the store

    this.start();
  }

  _createClass(DelveConfiguration, [{
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      var i = 1; // skip one for the default configs
      providers.forEach(function (provider) {
        var providerPaths = provider.path();
        if (!providerPaths) {
          return;
        }
        if (!Array.isArray(providerPaths)) {
          providerPaths = [providerPaths];
        }
        providerPaths.forEach(function (p) {
          if (!p) {
            return;
          }

          var index = i++;
          p = (0, _untildify2['default'])(p);
          if (_path.isAbsolute(p)) {
            _this.startWatching(provider, index, new _atom.File(p));
            return;
          }

          atom.project.getDirectories().forEach(function (dir) {
            _this.startWatching(provider, index, dir.getFile(p));
          });
        });
      });
    }
  }, {
    key: 'startWatching',
    value: function startWatching(provider, index, file) {
      var _this2 = this;

      var handleFile = function handleFile(events) {
        _this2.handleFile(provider, index, file, events);
      };

      // Watch for changes on the parent folder.
      // The events then contains changes for all files in there
      // which needs to be filtered out to match this file
      var filePath = file.getPath();
      this._watcher(filePath, handleFile).then(function (watcher) {
        _this2._subscriptions.add(watcher);
        watcher.onDidError(function (err) {
          console.warn('go-debug', 'Watching for changes on the configuration file \'' + filePath + '\' failed.', err);
        });

        _this2.handleFile(provider, index, file, []);
      })['catch'](function (err) {
        if (provider.warnIfMissing) {
          console.log('go-debug', 'Failed to load configuration file \'' + filePath + '\'.', err);
          atom.notifications.addWarning('Please make sure the configuration file \'' + filePath + '\' exists');
        }
      });
    }
  }, {
    key: 'handleFile',
    value: function handleFile(provider, index, file, events) {
      var _this3 = this;

      for (var _event of events) {
        if (_event.action === 'deleted') {
          this._configurations[index] = null;
          this.updateStore();
          return false;
        }
      }
      file.read(true).then(function (rawConfig) {
        var configPath = file.getPath();
        var content = undefined;
        try {
          content = JSON.parse(rawConfig);
        } catch (e) {
          atom.notifications.addWarning('The configuration file \'' + configPath + '\' does not have the correct format!', {
            detail: e.toString()
          });
          return;
        }
        if (!content) {
          return;
        }

        var providerIssues = provider.validate(content);
        if (providerIssues.length) {
          atom.notifications.addWarning('The configuration file \'' + configPath + '\' contains some issues:', {
            detail: providerIssues.join('\r\n')
          });
          return;
        }

        var configs = provider.prepare(content);

        var configIssues = _this3.validate(configs);
        if (configIssues.length) {
          atom.notifications.addWarning('The configuration file \'' + configPath + '\' contains some issues:', {
            detail: configIssues.join('\r\n')
          });
          return;
        }

        _this3._configurations[index] = {
          file: configPath,
          configs: configs
        };

        _this3.updateStore();
      });
    }
  }, {
    key: 'validate',
    value: function validate(configs) {
      var issues = [];
      configs.forEach(function (c, i) {
        if (!c.name) {
          issues.push('The ' + (i + 1) + '. configuration needs a \'name\'!');
        }
        if (!c.mode) {
          issues.push('The ' + (i + 1) + '. configuration needs a \'mode\'!');
        }
      });
      return issues;
    }
  }, {
    key: 'updateStore',
    value: function updateStore() {
      this._store.dispatch({ type: 'SET_CONFIGURATION', configurations: this._configurations.slice() });
    }
  }]);

  return DelveConfiguration;
})();

exports['default'] = DelveConfiguration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS1jb25maWd1cmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztxQkFFc0IsTUFBTTs7SUFBaEIsS0FBSTs7b0JBQzBCLE1BQU07O3lCQUMxQixXQUFXOzs7O0FBSmpDLFdBQVcsQ0FBQTs7QUFNWCxJQUFNLFNBQVMsR0FBRyxDQUNoQjtBQUNFLE1BQUksRUFBRSxpQkFBaUI7QUFDdkIsZUFBYSxFQUFFLElBQUk7QUFDbkIsTUFBSSxFQUFFO1dBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7R0FBQTtBQUN6RCxVQUFRLEVBQUUsa0JBQUMsT0FBTyxFQUFLO0FBQ3JCLFFBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUNqQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDMUMsWUFBTSxDQUFDLElBQUksa0VBQWdFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQVksQ0FBQTtLQUMvRztBQUNELFdBQU8sTUFBTSxDQUFBO0dBQ2Q7QUFDRCxTQUFPLEVBQUUsaUJBQUMsT0FBTztXQUFLLE9BQU8sQ0FBQyxjQUFjO0dBQUE7Q0FDN0MsRUFDRDs7QUFFRSxNQUFJLEVBQUUsUUFBUTtBQUNkLGVBQWEsRUFBRSxLQUFLO0FBQ3BCLE1BQUksRUFBRTtXQUFNLEtBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztHQUFBO0FBQy9DLFVBQVEsRUFBRSxrQkFBQyxPQUFPLEVBQUs7QUFDckIsUUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUMxQyxZQUFNLENBQUMsSUFBSSxrRUFBZ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFP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LENBQUEsdUNBQWtDLENBQUE7U0FDM0Q7QUFDRCxZQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNYLGdCQUFNLENBQUMsSUFBSSxXQUFRLENBQUMsR0FBRyxDQUFDLENBQUEsdUNBQWtDLENBQUE7U0FDM0Q7T0FDRixDQUFDLENBQUE7QUFDRixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7V0FFVyx1QkFBRztBQUNiLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUNsRzs7O1NBbkprQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS1jb25maWd1cmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRmlsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdW50aWxkaWZ5IGZyb20gJ3VudGlsZGlmeSdcblxuY29uc3QgcHJvdmlkZXJzID0gW1xuICB7XG4gICAgbmFtZTogJ2dvLWRlYnVnLWNvbmZpZycsXG4gICAgd2FybklmTWlzc2luZzogdHJ1ZSxcbiAgICBwYXRoOiAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2dvLWRlYnVnLmNvbmZpZ3VyYXRpb25GaWxlJyksXG4gICAgdmFsaWRhdGU6IChjb250ZW50KSA9PiB7XG4gICAgICBjb25zdCBpc3N1ZXMgPSBbXVxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuY29uZmlndXJhdGlvbnMpKSB7XG4gICAgICAgIGlzc3Vlcy5wdXNoKGBFeHBlY3RlZCBhbiBvYmplY3QgbGlrZSB7IGNvbmZpZ3VyYXRpb25zOiBbIC4uLiBdIH0gYnV0IGdvdCAke0pTT04uc3RyaW5naWZ5KGNvbnRlbnQpfSBpbnN0ZWFkIWApXG4gICAgICB9XG4gICAgICByZXR1cm4gaXNzdWVzXG4gICAgfSxcbiAgICBwcmVwYXJlOiAoY29udGVudCkgPT4gY29udGVudC5jb25maWd1cmF0aW9uc1xuICB9LFxuICB7XG4gICAgLy8gdHJ5IHRvIHVzZSB0aGUgdnNjb2RlIHNldHRpbmdzIHRvb1xuICAgIG5hbWU6ICd2c2NvZGUnLFxuICAgIHdhcm5JZk1pc3Npbmc6IGZhbHNlLFxuICAgIHBhdGg6ICgpID0+IHBhdGguam9pbignLnZzY29kZScsICdsYXVuY2guanNvbicpLFxuICAgIHZhbGlkYXRlOiAoY29udGVudCkgPT4ge1xuICAgICAgY29uc3QgaXNzdWVzID0gW11cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb250ZW50LmNvbmZpZ3VyYXRpb25zKSkge1xuICAgICAgICBpc3N1ZXMucHVzaChgRXhwZWN0ZWQgYW4gb2JqZWN0IGxpa2UgeyBjb25maWd1cmF0aW9uczogWyAuLi4gXSB9IGJ1dCBnb3QgJHtKU09OLnN0cmluZ2lmeShjb250ZW50KX0gaW5zdGVhZCFgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlzc3Vlc1xuICAgIH0sXG4gICAgcHJlcGFyZTogKGNvbnRlbnQpID0+IGNvbnRlbnQuY29uZmlndXJhdGlvbnNcbiAgfVxuXVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWx2ZUNvbmZpZ3VyYXRpb24ge1xuICBjb25zdHJ1Y3RvciAoc3RvcmUsIHdhdGNoZXIpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlXG4gICAgdGhpcy5fd2F0Y2hlciA9IHdhdGNoZXJcblxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvLyBhZGQgdGhlIGRlZmF1bHQgY29uZmlnc1xuICAgIHRoaXMuX2NvbmZpZ3VyYXRpb25zID0gW1xuICAgICAge1xuICAgICAgICBmaWxlOiAnJyxcbiAgICAgICAgY29uZmlnczogW1xuICAgICAgICAgIHsgbmFtZTogJ0RlYnVnJywgbW9kZTogJ2RlYnVnJyB9LFxuICAgICAgICAgIHsgbmFtZTogJ1Rlc3QnLCBtb2RlOiAndGVzdCcgfSxcbiAgICAgICAgICB7IG5hbWU6ICdBdHRhY2gnLCBtb2RlOiAnYXR0YWNoJyB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gICAgdGhpcy51cGRhdGVTdG9yZSgpIC8vIHNldCB0aGUgZGVmYXVsdCBjb25maWdzIGluIHRoZSBzdG9yZVxuXG4gICAgdGhpcy5zdGFydCgpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG5cbiAgc3RhcnQgKCkge1xuICAgIGxldCBpID0gMSAvLyBza2lwIG9uZSBmb3IgdGhlIGRlZmF1bHQgY29uZmlnc1xuICAgIHByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgICAgbGV0IHByb3ZpZGVyUGF0aHMgPSBwcm92aWRlci5wYXRoKClcbiAgICAgIGlmICghcHJvdmlkZXJQYXRocykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm92aWRlclBhdGhzKSkge1xuICAgICAgICBwcm92aWRlclBhdGhzID0gW3Byb3ZpZGVyUGF0aHNdXG4gICAgICB9XG4gICAgICBwcm92aWRlclBhdGhzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgaWYgKCFwKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmRleCA9IGkrK1xuICAgICAgICBwID0gdW50aWxkaWZ5KHApXG4gICAgICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0V2F0Y2hpbmcocHJvdmlkZXIsIGluZGV4LCBuZXcgRmlsZShwKSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpLmZvckVhY2goKGRpcikgPT4ge1xuICAgICAgICAgIHRoaXMuc3RhcnRXYXRjaGluZyhwcm92aWRlciwgaW5kZXgsIGRpci5nZXRGaWxlKHApKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc3RhcnRXYXRjaGluZyAocHJvdmlkZXIsIGluZGV4LCBmaWxlKSB7XG4gICAgY29uc3QgaGFuZGxlRmlsZSA9IChldmVudHMpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlRmlsZShwcm92aWRlciwgaW5kZXgsIGZpbGUsIGV2ZW50cylcbiAgICB9XG5cbiAgICAvLyBXYXRjaCBmb3IgY2hhbmdlcyBvbiB0aGUgcGFyZW50IGZvbGRlci5cbiAgICAvLyBUaGUgZXZlbnRzIHRoZW4gY29udGFpbnMgY2hhbmdlcyBmb3IgYWxsIGZpbGVzIGluIHRoZXJlXG4gICAgLy8gd2hpY2ggbmVlZHMgdG8gYmUgZmlsdGVyZWQgb3V0IHRvIG1hdGNoIHRoaXMgZmlsZVxuICAgIGNvbnN0IGZpbGVQYXRoID0gZmlsZS5nZXRQYXRoKClcbiAgICB0aGlzLl93YXRjaGVyKGZpbGVQYXRoLCBoYW5kbGVGaWxlKS50aGVuKCh3YXRjaGVyKSA9PiB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZCh3YXRjaGVyKVxuICAgICAgd2F0Y2hlci5vbkRpZEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS53YXJuKCdnby1kZWJ1ZycsIGBXYXRjaGluZyBmb3IgY2hhbmdlcyBvbiB0aGUgY29uZmlndXJhdGlvbiBmaWxlICcke2ZpbGVQYXRofScgZmFpbGVkLmAsIGVycilcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuaGFuZGxlRmlsZShwcm92aWRlciwgaW5kZXgsIGZpbGUsIFtdKVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGlmIChwcm92aWRlci53YXJuSWZNaXNzaW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnby1kZWJ1ZycsIGBGYWlsZWQgdG8gbG9hZCBjb25maWd1cmF0aW9uIGZpbGUgJyR7ZmlsZVBhdGh9Jy5gLCBlcnIpXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAgIGBQbGVhc2UgbWFrZSBzdXJlIHRoZSBjb25maWd1cmF0aW9uIGZpbGUgJyR7ZmlsZVBhdGh9JyBleGlzdHNgXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZSAocHJvdmlkZXIsIGluZGV4LCBmaWxlLCBldmVudHMpIHtcbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb25zW2luZGV4XSA9IG51bGxcbiAgICAgICAgdGhpcy51cGRhdGVTdG9yZSgpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICBmaWxlLnJlYWQodHJ1ZSkudGhlbigocmF3Q29uZmlnKSA9PiB7XG4gICAgICBjb25zdCBjb25maWdQYXRoID0gZmlsZS5nZXRQYXRoKClcbiAgICAgIGxldCBjb250ZW50XG4gICAgICB0cnkge1xuICAgICAgICBjb250ZW50ID0gSlNPTi5wYXJzZShyYXdDb25maWcpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKGBUaGUgY29uZmlndXJhdGlvbiBmaWxlICcke2NvbmZpZ1BhdGh9JyBkb2VzIG5vdCBoYXZlIHRoZSBjb3JyZWN0IGZvcm1hdCFgLCB7XG4gICAgICAgICAgZGV0YWlsOiBlLnRvU3RyaW5nKClcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3ZpZGVySXNzdWVzID0gcHJvdmlkZXIudmFsaWRhdGUoY29udGVudClcbiAgICAgIGlmIChwcm92aWRlcklzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoYFRoZSBjb25maWd1cmF0aW9uIGZpbGUgJyR7Y29uZmlnUGF0aH0nIGNvbnRhaW5zIHNvbWUgaXNzdWVzOmAsIHtcbiAgICAgICAgICBkZXRhaWw6IHByb3ZpZGVySXNzdWVzLmpvaW4oJ1xcclxcbicpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25maWdzID0gcHJvdmlkZXIucHJlcGFyZShjb250ZW50KVxuXG4gICAgICBjb25zdCBjb25maWdJc3N1ZXMgPSB0aGlzLnZhbGlkYXRlKGNvbmZpZ3MpXG4gICAgICBpZiAoY29uZmlnSXNzdWVzLmxlbmd0aCkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhgVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSAnJHtjb25maWdQYXRofScgY29udGFpbnMgc29tZSBpc3N1ZXM6YCwge1xuICAgICAgICAgIGRldGFpbDogY29uZmlnSXNzdWVzLmpvaW4oJ1xcclxcbicpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb25maWd1cmF0aW9uc1tpbmRleF0gPSB7XG4gICAgICAgIGZpbGU6IGNvbmZpZ1BhdGgsXG4gICAgICAgIGNvbmZpZ3NcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVTdG9yZSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhbGlkYXRlIChjb25maWdzKSB7XG4gICAgY29uc3QgaXNzdWVzID0gW11cbiAgICBjb25maWdzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgIGlmICghYy5uYW1lKSB7XG4gICAgICAgIGlzc3Vlcy5wdXNoKGBUaGUgJHtpICsgMX0uIGNvbmZpZ3VyYXRpb24gbmVlZHMgYSAnbmFtZSchYClcbiAgICAgIH1cbiAgICAgIGlmICghYy5tb2RlKSB7XG4gICAgICAgIGlzc3Vlcy5wdXNoKGBUaGUgJHtpICsgMX0uIGNvbmZpZ3VyYXRpb24gbmVlZHMgYSAnbW9kZSchYClcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBpc3N1ZXNcbiAgfVxuXG4gIHVwZGF0ZVN0b3JlICgpIHtcbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdTRVRfQ09ORklHVVJBVElPTicsIGNvbmZpZ3VyYXRpb25zOiB0aGlzLl9jb25maWd1cmF0aW9ucy5zbGljZSgpIH0pXG4gIH1cbn1cbiJdfQ==