Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _atom = require('atom');

var _fs = require('fs');

var FS = _interopRequireWildcard(_fs);

var _path = require('path');

var Path = _interopRequireWildcard(_path);

var _storeUtils = require('./store-utils');

var _utils = require('./utils');

'use babel';

var isStarted = undefined,
    dependenciesInstalled = undefined;
var subscriptions = undefined,
    initialState = undefined,
    path = undefined;
var goconfig = undefined,
    goget = undefined;
var store = undefined,
    outputPanelManager = undefined;

exports['default'] = {
  activate: function activate(state) {
    var _this = this;

    isStarted = false;
    dependenciesInstalled = false;

    subscriptions = new _atom.CompositeDisposable();

    require('atom-package-deps').install('go-debug').then(function () {
      dependenciesInstalled = true;
      _this.start();
      return true;
    })['catch'](function (e) {
      console.warn('go-debug', e);
    });

    initialState = state;
  },
  deactivate: function deactivate() {
    subscriptions.dispose();
    subscriptions = null;
    store = null;
    goget = null;
    goconfig = null;
    path = null;
    isStarted = false;
  },
  serialize: function serialize() {
    return store ? (0, _storeUtils.serialize)(store) : initialState;
  },

  provideGoPlusView: function provideGoPlusView() {
    return {
      view: require('./output-panel'),
      model: this.getOutputPanelManager()
    };
  },
  consumeGoget: function consumeGoget(service) {
    goget = service;
    this.getDlv();
  },
  consumeGoconfig: function consumeGoconfig(service) {
    goconfig = service;
    this.getDlv();
  },
  getDlv: function getDlv() {
    var _this2 = this;

    if (!goget || !goconfig) {
      return;
    }

    var getDelve = require('./delve-get');
    getDelve(goget, goconfig).then(function (p) {
      path = p;
      _this2.start();
    })['catch'](function (e) {
      console.error('go-debug', 'Failed to get "dlv"', e);
      var message = e && e.message || e || 'An unknown error occured';
      _this2.getStore().dispatch({ type: 'ADD_OUTPUT_CONTENT', content: { type: 'message', message: message + '\n' } });
    });
  },
  getOutputPanelManager: function getOutputPanelManager() {
    if (!outputPanelManager) {
      var OutputPanelManager = require('./output-panel-manager');
      outputPanelManager = new OutputPanelManager();
    }
    return outputPanelManager;
  },
  getStore: function getStore() {
    if (!store) {
      var Store = require('./store');
      store = Store(initialState);
    }
    return store;
  },

  start: function start() {
    if (!path || isStarted || !dependenciesInstalled) {
      return;
    }
    isStarted = true;

    // load all dependencies once after everything is ready
    // this reduces the initial load time of this package
    this.getStore();

    var DelveConfiguration = require('./delve-configuration');
    var configuration = new DelveConfiguration(store, function (file, callback) {
      var dir = Path.dirname(file);
      return new Promise(function (resolve, reject) {
        FS.stat(dir, function (err) {
          return err ? reject(err) : resolve();
        });
      }).then(function () {
        return (0, _atom.watchPath)(dir, {}, function (events) {
          var eventsForFile = events.filter(function (event) {
            return event.path === file;
          });
          if (eventsForFile.length) {
            callback(eventsForFile);
          }
        });
      });
    });

    var DelveSession = require('./delve-session');

    var _require = require('child_process');

    var spawn = _require.spawn;

    var rpc = require('json-rpc2');

    var DelveConnection = require('./delve-connection');
    var connection = new DelveConnection(function (args, options) {
      var promise = Promise.resolve();
      if (atom.config.get('go-debug.saveAllFiles')) {
        // save everything before actually starting delve
        try {
          promise = (0, _utils.saveAllEditors)();
        } catch (e) {
          store.dispatch({
            type: 'ADD_OUTPUT_CONTENT',
            content: {
              type: 'message',
              message: 'Failed to save all files. Error: ' + (e.message || e) + '\n'
            }
          });
        }
      }

      return promise.then(function () {
        store.dispatch({
          type: 'ADD_OUTPUT_CONTENT',
          content: { type: 'dlvSpawnOptions', path: path, args: args, cwd: options.cwd, env: options.env }
        });

        return spawn(path, args, options);
      });
    }, function (port, host) {
      return new Promise(function (resolve, reject) {
        rpc.Client.$create(port, host).connectSocket(function (err, conn) {
          if (err) {
            return reject(err);
          }
          return resolve(conn);
        });
      });
    }, function (proc, conn, mode) {
      return new DelveSession(proc, conn, mode);
    }, function (message) {
      store.dispatch({
        type: 'ADD_OUTPUT_CONTENT',
        content: { type: 'message', message: message }
      });
    }, goconfig);

    var Debugger = require('./debugger');
    var dbg = new Debugger(store, connection);

    this.getOutputPanelManager().setStoreAndDbg(store, dbg);

    var EditorManager = require('./editor-manager');
    var editorManager = new EditorManager(store, dbg);

    var Commands = require('./commands');
    var commands = new Commands(store, dbg);

    var _require2 = require('./panel');

    var PanelManager = _require2.PanelManager;

    var panelManager = new PanelManager(store, dbg, commands);

    subscriptions.add(dbg, editorManager, panelManager, commands, connection, configuration);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFK0MsTUFBTTs7a0JBQ2pDLElBQUk7O0lBQVosRUFBRTs7b0JBQ1EsTUFBTTs7SUFBaEIsSUFBSTs7MEJBRVUsZUFBZTs7cUJBQ1YsU0FBUzs7QUFQeEMsV0FBVyxDQUFBOztBQVNYLElBQUksU0FBUyxZQUFBO0lBQUUscUJBQXFCLFlBQUEsQ0FBQTtBQUNwQyxJQUFJLGFBQWEsWUFBQTtJQUFFLFlBQVksWUFBQTtJQUFFLElBQUksWUFBQSxDQUFBO0FBQ3JDLElBQUksUUFBUSxZQUFBO0lBQUUsS0FBSyxZQUFBLENBQUE7QUFDbkIsSUFBSSxLQUFLLFlBQUE7SUFBRSxrQkFBa0IsWUFBQSxDQUFBOztxQkFFZDtBQUNiLFVBQVEsRUFBQyxrQkFBQyxLQUFLLEVBQUU7OztBQUNmLGFBQVMsR0FBRyxLQUFLLENBQUE7QUFDakIseUJBQXFCLEdBQUcsS0FBSyxDQUFBOztBQUU3QixpQkFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUV6QyxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDMUQsMkJBQXFCLEdBQUcsSUFBSSxDQUFBO0FBQzVCLFlBQUssS0FBSyxFQUFFLENBQUE7QUFDWixhQUFPLElBQUksQ0FBQTtLQUNaLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsYUFBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDNUIsQ0FBQyxDQUFBOztBQUVGLGdCQUFZLEdBQUcsS0FBSyxDQUFBO0dBQ3JCO0FBQ0QsWUFBVSxFQUFDLHNCQUFHO0FBQ1osaUJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN2QixpQkFBYSxHQUFHLElBQUksQ0FBQTtBQUNwQixTQUFLLEdBQUcsSUFBSSxDQUFBO0FB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b0I7QUFDMUIsZUFBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFO09BQ3RDLENBQUMsQ0FBQTtLQUNILEVBQ0QsUUFBUSxDQUNULENBQUE7O0FBRUQsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3RDLFFBQU0sR0FBRyxHQUFHLElBQUksUUFBUSxDQUN0QixLQUFLLEVBQ0wsVUFBVSxDQUNYLENBQUE7O0FBRUQsUUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFdkQsUUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFDakQsUUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBOztBQUVuRCxRQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDdEMsUUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBOztvQkFFaEIsT0FBTyxDQUFDLFNBQVMsQ0FBQzs7UUFBbkMsWUFBWSxhQUFaLFlBQVk7O0FBQ3BCLFFBQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUE7O0FBRTNELGlCQUFhLENBQUMsR0FBRyxDQUNmLEdBQUcsRUFDSCxhQUFhLEVBQ2IsWUFBWSxFQUNaLFFBQVEsRUFDUixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUE7R0FDRjtDQUNGIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgd2F0Y2hQYXRoIH0gZnJvbSAnYXRvbSdcbmltcG9ydCAqIGFzIEZTIGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgeyBzZXJpYWxpemUgfSBmcm9tICcuL3N0b3JlLXV0aWxzJ1xuaW1wb3J0IHsgc2F2ZUFsbEVkaXRvcnMgfSBmcm9tICcuL3V0aWxzJ1xuXG5sZXQgaXNTdGFydGVkLCBkZXBlbmRlbmNpZXNJbnN0YWxsZWRcbmxldCBzdWJzY3JpcHRpb25zLCBpbml0aWFsU3RhdGUsIHBhdGhcbmxldCBnb2NvbmZpZywgZ29nZXRcbmxldCBzdG9yZSwgb3V0cHV0UGFuZWxNYW5hZ2VyXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUgKHN0YXRlKSB7XG4gICAgaXNTdGFydGVkID0gZmFsc2VcbiAgICBkZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSBmYWxzZVxuXG4gICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnZ28tZGVidWcnKS50aGVuKCgpID0+IHtcbiAgICAgIGRlcGVuZGVuY2llc0luc3RhbGxlZCA9IHRydWVcbiAgICAgIHRoaXMuc3RhcnQoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgY29uc29sZS53YXJuKCdnby1kZWJ1ZycsIGUpXG4gICAgfSlcblxuICAgIGluaXRpYWxTdGF0ZSA9IHN0YXRlXG4gIH0sXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBzdG9yZSA9IG51bGxcbiAgICBnb2dldCA9IG51bGxcbiAgICBnb2NvbmZpZyA9IG51bGxcbiAgICBwYXRoID0gbnVsbFxuICAgIGlzU3RhcnRlZCA9IGZhbHNlXG4gIH0sXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHN0b3JlID8gc2VyaWFsaXplKHN0b3JlKSA6IGluaXRpYWxTdGF0ZVxuICB9LFxuXG4gIHByb3ZpZGVHb1BsdXNWaWV3ICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmlldzogcmVxdWlyZSgnLi9vdXRwdXQtcGFuZWwnKSxcbiAgICAgIG1vZGVsOiB0aGlzLmdldE91dHB1dFBhbmVsTWFuYWdlcigpXG4gICAgfVxuICB9LFxuICBjb25zdW1lR29nZXQgKHNlcnZpY2UpIHtcbiAgICBnb2dldCA9IHNlcnZpY2VcbiAgICB0aGlzLmdldERsdigpXG4gIH0sXG4gIGNvbnN1bWVHb2NvbmZpZyAoc2VydmljZSkge1xuICAgIGdvY29uZmlnID0gc2VydmljZVxuICAgIHRoaXMuZ2V0RGx2KClcbiAgfSxcbiAgZ2V0RGx2ICgpIHtcbiAgICBpZiAoIWdvZ2V0IHx8ICFnb2NvbmZpZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RGVsdmUgPSByZXF1aXJlKCcuL2RlbHZlLWdldCcpXG4gICAgZ2V0RGVsdmUoZ29nZXQsIGdvY29uZmlnKS50aGVuKChwKSA9PiB7XG4gICAgICBwYXRoID0gcFxuICAgICAgdGhpcy5zdGFydCgpXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2dvLWRlYnVnJywgJ0ZhaWxlZCB0byBnZXQgXCJkbHZcIicsIGUpXG4gICAgICBjb25zdCBtZXNzYWdlID0gKGUgJiYgZS5tZXNzYWdlKSB8fCBlIHx8ICdBbiB1bmtub3duIGVycm9yIG9jY3VyZWQnXG4gICAgICB0aGlzLmdldFN0b3JlKCkuZGlzcGF0Y2goeyB0eXBlOiAnQUREX09VVFBVVF9DT05URU5UJywgY29udGVudDogeyB0eXBlOiAnbWVzc2FnZScsIG1lc3NhZ2U6IG1lc3NhZ2UgKyAnXFxuJyB9IH0pXG4gICAgfSlcbiAgfSxcbiAgZ2V0T3V0cHV0UGFuZWxNYW5hZ2VyICgpIHtcbiAgICBpZiAoIW91dHB1dFBhbmVsTWFuYWdlcikge1xuICAgICAgY29uc3QgT3V0cHV0UGFuZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9vdXRwdXQtcGFuZWwtbWFuYWdlcicpXG4gICAgICBvdXRwdXRQYW5lbE1hbmFnZXIgPSBuZXcgT3V0cHV0UGFuZWxNYW5hZ2VyKClcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dFBhbmVsTWFuYWdlclxuICB9LFxuICBnZXRTdG9yZSAoKSB7XG4gICAgaWYgKCFzdG9yZSkge1xuICAgICAgY29uc3QgU3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlJylcbiAgICAgIHN0b3JlID0gU3RvcmUoaW5pdGlhbFN0YXRlKVxuICAgIH1cbiAgICByZXR1cm4gc3RvcmVcbiAgfSxcblxuICBzdGFydCAoKSB7XG4gICAgaWYgKCFwYXRoIHx8IGlzU3RhcnRlZCB8fCAhZGVwZW5kZW5jaWVzSW5zdGFsbGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaXNTdGFydGVkID0gdHJ1ZVxuXG4gICAgLy8gbG9hZCBhbGwgZGVwZW5kZW5jaWVzIG9uY2UgYWZ0ZXIgZXZlcnl0aGluZyBpcyByZWFkeVxuICAgIC8vIHRoaXMgcmVkdWNlcyB0aGUgaW5pdGlhbCBsb2FkIHRpbWUgb2YgdGhpcyBwYWNrYWdlXG4gICAgdGhpcy5nZXRTdG9yZSgpXG5cbiAgICBjb25zdCBEZWx2ZUNvbmZpZ3VyYXRpb24gPSByZXF1aXJlKCcuL2RlbHZlLWNvbmZpZ3VyYXRpb24nKVxuICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSBuZXcgRGVsdmVDb25maWd1cmF0aW9uKFxuICAgICAgc3RvcmUsXG4gICAgICAoZmlsZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgY29uc3QgZGlyID0gUGF0aC5kaXJuYW1lKGZpbGUpXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgRlMuc3RhdChkaXIsIChlcnIpID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpKVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gd2F0Y2hQYXRoKGRpciwge30sIChldmVudHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50c0ZvckZpbGUgPSBldmVudHMuZmlsdGVyKChldmVudCkgPT4gZXZlbnQucGF0aCA9PT0gZmlsZSlcbiAgICAgICAgICAgIGlmIChldmVudHNGb3JGaWxlLmxlbmd0aCkge1xuICAgICAgICAgICAgICBjYWxsYmFjayhldmVudHNGb3JGaWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgKVxuXG4gICAgY29uc3QgRGVsdmVTZXNzaW9uID0gcmVxdWlyZSgnLi9kZWx2ZS1zZXNzaW9uJylcbiAgICBjb25zdCB7IHNwYXduIH0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJylcbiAgICBjb25zdCBycGMgPSByZXF1aXJlKCdqc29uLXJwYzInKVxuXG4gICAgY29uc3QgRGVsdmVDb25uZWN0aW9uID0gcmVxdWlyZSgnLi9kZWx2ZS1jb25uZWN0aW9uJylcbiAgICBjb25zdCBjb25uZWN0aW9uID0gbmV3IERlbHZlQ29ubmVjdGlvbihcbiAgICAgIChhcmdzLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ28tZGVidWcuc2F2ZUFsbEZpbGVzJykpIHtcbiAgICAgICAgICAvLyBzYXZlIGV2ZXJ5dGhpbmcgYmVmb3JlIGFjdHVhbGx5IHN0YXJ0aW5nIGRlbHZlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2UgPSBzYXZlQWxsRWRpdG9ycygpXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICAgICAgICB0eXBlOiAnQUREX09VVFBVVF9DT05URU5UJyxcbiAgICAgICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIHNhdmUgYWxsIGZpbGVzLiBFcnJvcjogJyArIChlLm1lc3NhZ2UgfHwgZSkgKyAnXFxuJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdBRERfT1VUUFVUX0NPTlRFTlQnLFxuICAgICAgICAgICAgY29udGVudDogeyB0eXBlOiAnZGx2U3Bhd25PcHRpb25zJywgcGF0aCwgYXJncywgY3dkOiBvcHRpb25zLmN3ZCwgZW52OiBvcHRpb25zLmVudiB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHJldHVybiBzcGF3bihwYXRoLCBhcmdzLCBvcHRpb25zKVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIChwb3J0LCBob3N0KSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgcnBjLkNsaWVudC4kY3JlYXRlKHBvcnQsIGhvc3QpLmNvbm5lY3RTb2NrZXQoKGVyciwgY29ubikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGNvbm4pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICAocHJvYywgY29ubiwgbW9kZSkgPT4gbmV3IERlbHZlU2Vzc2lvbihwcm9jLCBjb25uLCBtb2RlKSxcbiAgICAgIChtZXNzYWdlKSA9PiB7XG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiAnQUREX09VVFBVVF9DT05URU5UJyxcbiAgICAgICAgICBjb250ZW50OiB7IHR5cGU6ICdtZXNzYWdlJywgbWVzc2FnZSB9XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZ29jb25maWdcbiAgICApXG5cbiAgICBjb25zdCBEZWJ1Z2dlciA9IHJlcXVpcmUoJy4vZGVidWdnZXInKVxuICAgIGNvbnN0IGRiZyA9IG5ldyBEZWJ1Z2dlcihcbiAgICAgIHN0b3JlLFxuICAgICAgY29ubmVjdGlvblxuICAgIClcblxuICAgIHRoaXMuZ2V0T3V0cHV0UGFuZWxNYW5hZ2VyKCkuc2V0U3RvcmVBbmREYmcoc3RvcmUsIGRiZylcblxuICAgIGNvbnN0IEVkaXRvck1hbmFnZXIgPSByZXF1aXJlKCcuL2VkaXRvci1tYW5hZ2VyJylcbiAgICBjb25zdCBlZGl0b3JNYW5hZ2VyID0gbmV3IEVkaXRvck1hbmFnZXIoc3RvcmUsIGRiZylcblxuICAgIGNvbnN0IENvbW1hbmRzID0gcmVxdWlyZSgnLi9jb21tYW5kcycpXG4gICAgY29uc3QgY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoc3RvcmUsIGRiZylcblxuICAgIGNvbnN0IHsgUGFuZWxNYW5hZ2VyIH0gPSByZXF1aXJlKCcuL3BhbmVsJylcbiAgICBjb25zdCBwYW5lbE1hbmFnZXIgPSBuZXcgUGFuZWxNYW5hZ2VyKHN0b3JlLCBkYmcsIGNvbW1hbmRzKVxuXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBkYmcsXG4gICAgICBlZGl0b3JNYW5hZ2VyLFxuICAgICAgcGFuZWxNYW5hZ2VyLFxuICAgICAgY29tbWFuZHMsXG4gICAgICBjb25uZWN0aW9uLFxuICAgICAgY29uZmlndXJhdGlvblxuICAgIClcbiAgfVxufVxuIl19