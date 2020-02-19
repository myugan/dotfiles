Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

'use babel';

var DelveConnection = (function () {
  function DelveConnection(spawn, connect, newSession, addOutputMessage, goconfig) {
    _classCallCheck(this, DelveConnection);

    this._spawn = spawn;
    this._connect = connect;
    this._newSession = newSession;
    this._addOutputMessage = addOutputMessage;
    this._goconfig = goconfig;
    this._session = null;
  }

  _createClass(DelveConnection, [{
    key: 'start',
    value: function start(_ref) {
      var _this = this;

      var config = _ref.config;
      var file = _ref.file;

      if (this._session) {
        return Promise.reject(new Error('Already debugging!'));
      }

      return new Promise(function (resolve, reject) {
        var mode = config.mode;

        var _hostAndPort = hostAndPort(config);

        var host = _hostAndPort.host;
        var port = _hostAndPort.port;

        var client = undefined;
        var proc = undefined;
        var canceled = false;

        var connect = function connect() {
          if (client) {
            return;
          }
          client = 'creating ...';

          // add a slight delay so that issues of delve while starting will
          // exit delve and therefore cancel the debug session
          setTimeout(function () {
            if (canceled) {
              return;
            }
            _this._connect(port, host).then(function (conn) {
              _this._session = _this._newSession(proc, conn, mode);
              resolve(_this._session);
            })['catch'](reject);
          }, 250);
        };

        var prepare = function prepare() {
          var variables = getVariables(file);
          updateEnv(config, variables, _this._goconfig);
          var cwd = getCwd(config, variables);

          return getDlvArgs(config, variables).then(function (dlvArgs) {
            return {
              dlvArgs: dlvArgs,
              cwd: cwd,
              env: variables.env
            };
          })['catch'](reject);
        };

        var spawn = function spawn(_ref2) {
          var dlvArgs = _ref2.dlvArgs;
          var cwd = _ref2.cwd;
          var env = _ref2.env;

          return _this._spawn(dlvArgs, { cwd: cwd, env: env });
        };

        var io = function io(dlvProc) {
          proc = dlvProc;

          proc.stderr.on('data', function (chunk) {
            _this._addOutputMessage('Delve output: ' + chunk.toString());
            connect();
          });
          proc.stdout.on('data', function (chunk) {
            _this._addOutputMessage(chunk.toString());
            connect();
          });

          var close = function close() {
            proc.kill();
            _this.dispose();
            canceled = true;
          };

          proc.on('close', function (code) {
            _this._addOutputMessage('delve closed with code ' + (code || 0) + '\n');
            close();
            if (code) {
              reject(new Error('Closed with code ' + code));
            }
          });
          proc.on('error', function (err) {
            _this._addOutputMessage('error: ' + (err || '') + '\n');
            close();
            reject(err);
          });
        };

        if (mode === 'remote') {
          // delve is already running on a remote machine.
          // just connect to it using the host and port.
          connect();
          return;
        }

        prepare().then(spawn).then(io);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._session) {
        this._session.stop();
        this._session = null;
      }
      return Promise.resolve();
    }
  }]);

  return DelveConnection;
})();

exports['default'] = DelveConnection;

var regexVariable = /\${(.*?)}/g;

function replaceVariable(value, variables) {
  return value.replace(regexVariable, function (group, name) {
    if (name.startsWith('env.')) {
      return variables.env[name.replace('env.', '')];
    }
    return variables[name];
  });
}

function getVariables(file) {
  var workspaceFile = file && atom.project.relativizePath(file);
  return {
    // the working directory on startup of atom
    cwd: process.cwd(),
    // the open file (full path)
    file: file,
    // the open file's basename
    fileBasename: file && path.basename(file),
    // the open file's dirname
    fileDirname: file && path.dirname(file),
    // the open file's extension
    fileExtname: file && path.extname(file),
    // the open file relative to the "workspaceRoot" variable
    relativeFile: workspaceFile && workspaceFile[1],
    // the full path of the project root folder
    workspaceRoot: workspaceFile && workspaceFile[0]
  };
}

function updateEnv(config, variables, goconfig) {
  // already assign the already known environment variables here so they can be used by the `config.env` values
  variables.env = goconfig.environment();

  var env = Object.assign({}, variables.env);
  var configEnv = config.env;
  if (configEnv) {
    for (var key in configEnv) {
      if (configEnv.hasOwnProperty(key)) {
        env[key] = replaceVariable(configEnv[key], variables);
      }
    }
  }
  variables.env = env;
}

var SERVER_URL = 'localhost';
var SERVER_PORT = 2345;

function hostAndPort(config) {
  var _config$host = config.host;
  var host = _config$host === undefined ? SERVER_URL : _config$host;
  var _config$port = config.port;
  var port = _config$port === undefined ? SERVER_PORT : _config$port;

  return { host: host, port: port };
}

function getDlvArgs(config, variables) {
  var mode = config.mode;
  var program = config.program;
  var _config$showLog = config.showLog;
  var showLog = _config$showLog === undefined ? false : _config$showLog;
  var buildFlags = config.buildFlags;
  var _config$backend = config.backend;
  var backend = _config$backend === undefined ? 'default' : _config$backend;
  var dlvInit = config.init;
  var args = config.args;

  var _hostAndPort2 = hostAndPort(config);

  var host = _hostAndPort2.host;
  var port = _hostAndPort2.port;

  var dlvArgs = [mode || 'debug'];

  var prom = Promise.resolve();
  if (mode === 'attach') {
    prom = attach().then(function (processID) {
      dlvArgs.push(processID);
    });
  }

  var possibleBackendValues = ['default', 'native', 'lldb', 'rr'];
  if (!possibleBackendValues.includes(backend)) {
    return Promise.reject(new Error('--backend must be one of these values ' + possibleBackendValues.join(', ')));
  }

  return prom.then(function () {
    if (mode === 'exec') {
      // debug a pre compiled executable
      dlvArgs.push(replaceVariable(program, variables));
    }

    dlvArgs.push('--headless=true', '--listen=' + host + ':' + port, '--api-version=2', '--backend=' + backend, '--accept-multiclient');
    if (showLog) {
      // turn additional delve logging on or off
      dlvArgs.push('--log=' + showLog.toString());
    }
    if (buildFlags) {
      // add additional build flags to delve
      dlvArgs.push('--build-flags=' + buildFlags);
    }
    if (dlvInit) {
      // used to execute some commands when delve starts
      dlvArgs.push('--init=' + replaceVariable(dlvInit, variables));
    }
    if (args) {
      dlvArgs.push.apply(dlvArgs, ['--'].concat(_toConsumableArray(args.map(function (v) {
        return replaceVariable(v, variables);
      }))));
    }

    return dlvArgs;
  });
}

function attach() {
  return new Promise(function (resolve, reject) {
    var item = document.createElement('div');
    item.innerHTML = '<p>Process ID:</p>' + '<input type="text" class="go-debug-attach-input native-key-bindings" />' + '<button type="button" class="go-debug-attach-btn btn">OK</button>';

    var panel = atom.workspace.addModalPanel({ item: item });

    var input = item.querySelector('.go-debug-attach-input');
    input.focus();

    item.querySelector('.go-debug-attach-btn').addEventListener('click', function () {
      panel.destroy();
      var value = input.value;

      if (value) {
        resolve(value);
      }
    });
  });
}

function getCwd(config, variables) {
  var cwd = config.cwd;

  if (cwd) {
    return replaceVariable(cwd, variables);
  }
  var file = variables.file;
  try {
    if (file && fs.lstatSync(file).isDirectory()) {
      cwd = file; // assume it is a package...
    }
  } catch (e) {
    // ...
  }
  if (!cwd && file) {
    cwd = path.dirname(file);
  }
  if (!cwd) {
    cwd = atom.project.getPaths()[0];
  }
  return cwd;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS1jb25uZWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7SUFBaEIsSUFBSTs7a0JBQ0ksSUFBSTs7SUFBWixFQUFFOztBQUhkLFdBQVcsQ0FBQTs7SUFLVSxlQUFlO0FBQ3RCLFdBRE8sZUFBZSxDQUNyQixLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUU7MEJBRGxELGVBQWU7O0FBRWhDLFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFBO0FBQzdCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQTtBQUN6QyxRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUN6QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtHQUNyQjs7ZUFSa0IsZUFBZTs7V0FVNUIsZUFBQyxJQUFnQixFQUFFOzs7VUFBaEIsTUFBTSxHQUFSLElBQWdCLENBQWQsTUFBTTtVQUFFLElBQUksR0FBZCxJQUFnQixDQUFOLElBQUk7O0FBQ25CLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO09BQ3ZEOztBQUVELGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO1lBQzlCLElBQUksR0FBSyxNQUFNLENBQWYsSUFBSTs7MkJBQ1csV0FBVyxDQUFDLE1BQU0sQ0FBQzs7WUFBbEMsSUFBSSxnQkFBSixJQUFJO1lBQUUsSUFBSSxnQkFBSixJQUFJOztBQUVsQixZQUFJLE1BQU0sWUFBQSxDQUFBO0FBQ1Ys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QUksSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQzVDLFNBQUcsR0FBRyxJQUFJLENBQUE7S0FDWDtHQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7O0dBRVg7QUFDRCxNQUFJLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRTtBQUNoQixPQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN6QjtBQUNELE1BQUksQ0FBQyxHQUFHLEVBQUU7QUFDUixPQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUNqQztBQUNELFNBQU8sR0FBRyxDQUFBO0NBQ1giLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2RlbHZlLWNvbm5lY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsdmVDb25uZWN0aW9uIHtcbiAgY29uc3RydWN0b3IgKHNwYXduLCBjb25uZWN0LCBuZXdTZXNzaW9uLCBhZGRPdXRwdXRNZXNzYWdlLCBnb2NvbmZpZykge1xuICAgIHRoaXMuX3NwYXduID0gc3Bhd25cbiAgICB0aGlzLl9jb25uZWN0ID0gY29ubmVjdFxuICAgIHRoaXMuX25ld1Nlc3Npb24gPSBuZXdTZXNzaW9uXG4gICAgdGhpcy5fYWRkT3V0cHV0TWVzc2FnZSA9IGFkZE91dHB1dE1lc3NhZ2VcbiAgICB0aGlzLl9nb2NvbmZpZyA9IGdvY29uZmlnXG4gICAgdGhpcy5fc2Vzc2lvbiA9IG51bGxcbiAgfVxuXG4gIHN0YXJ0ICh7IGNvbmZpZywgZmlsZSB9KSB7XG4gICAgaWYgKHRoaXMuX3Nlc3Npb24pIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0FscmVhZHkgZGVidWdnaW5nIScpKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB7IG1vZGUgfSA9IGNvbmZpZ1xuICAgICAgY29uc3QgeyBob3N0LCBwb3J0IH0gPSBob3N0QW5kUG9ydChjb25maWcpXG5cbiAgICAgIGxldCBjbGllbnRcbiAgICAgIGxldCBwcm9jXG4gICAgICBsZXQgY2FuY2VsZWQgPSBmYWxzZVxuXG4gICAgICBjb25zdCBjb25uZWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoY2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50ID0gJ2NyZWF0aW5nIC4uLidcblxuICAgICAgICAvLyBhZGQgYSBzbGlnaHQgZGVsYXkgc28gdGhhdCBpc3N1ZXMgb2YgZGVsdmUgd2hpbGUgc3RhcnRpbmcgd2lsbFxuICAgICAgICAvLyBleGl0IGRlbHZlIGFuZCB0aGVyZWZvcmUgY2FuY2VsIHRoZSBkZWJ1ZyBzZXNzaW9uXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChjYW5jZWxlZCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2Nvbm5lY3QocG9ydCwgaG9zdClcbiAgICAgICAgICAgIC50aGVuKChjb25uKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX3Nlc3Npb24gPSB0aGlzLl9uZXdTZXNzaW9uKHByb2MsIGNvbm4sIG1vZGUpXG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5fc2Vzc2lvbilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2gocmVqZWN0KVxuICAgICAgICB9LCAyNTApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZXBhcmUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IGdldFZhcmlhYmxlcyhmaWxlKVxuICAgICAgICB1cGRhdGVFbnYoY29uZmlnLCB2YXJpYWJsZXMsIHRoaXMuX2dvY29uZmlnKVxuICAgICAgICBjb25zdCBjd2QgPSBnZXRDd2QoY29uZmlnLCB2YXJpYWJsZXMpXG5cbiAgICAgICAgcmV0dXJuIGdldERsdkFyZ3MoY29uZmlnLCB2YXJpYWJsZXMpLnRoZW4oKGRsdkFyZ3MpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGx2QXJncyxcbiAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgIGVudjogdmFyaWFibGVzLmVudlxuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2gocmVqZWN0KVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzcGF3biA9ICh7IGRsdkFyZ3MsIGN3ZCwgZW52IH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwYXduKGRsdkFyZ3MsIHsgY3dkLCBlbnYgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW8gPSAoZGx2UHJvYykgPT4ge1xuICAgICAgICBwcm9jID0gZGx2UHJvY1xuXG4gICAgICAgIHByb2Muc3RkZXJyLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICAgICAgdGhpcy5fYWRkT3V0cHV0TWVzc2FnZSgnRGVsdmUgb3V0cHV0OiAnICsgY2h1bmsudG9TdHJpbmcoKSlcbiAgICAgICAgICBjb25uZWN0KClcbiAgICAgICAgfSlcbiAgICAgICAgcHJvYy5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+IHtcbiAgICAgICAgICB0aGlzLl9hZGRPdXRwdXRNZXNzYWdlKGNodW5rLnRvU3RyaW5nKCkpXG4gICAgICAgICAgY29ubmVjdCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgcHJvYy5raWxsKClcbiAgICAgICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgICAgICAgIGNhbmNlbGVkID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvYy5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2FkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlIGNsb3NlZCB3aXRoIGNvZGUgJyArIChjb2RlIHx8IDApICsgJ1xcbicpXG4gICAgICAgICAgY2xvc2UoKVxuICAgICAgICAgIGlmIChjb2RlKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdDbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHByb2Mub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgIHRoaXMuX2FkZE91dHB1dE1lc3NhZ2UoJ2Vycm9yOiAnICsgKGVyciB8fCAnJykgKyAnXFxuJylcbiAgICAgICAgICBjbG9zZSgpXG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKG1vZGUgPT09ICdyZW1vdGUnKSB7XG4gICAgICAgIC8vIGRlbHZlIGlzIGFscmVhZHkgcnVubmluZyBvbiBhIHJlbW90ZSBtYWNoaW5lLlxuICAgICAgICAvLyBqdXN0IGNvbm5lY3QgdG8gaXQgdXNpbmcgdGhlIGhvc3QgYW5kIHBvcnQuXG4gICAgICAgIGNvbm5lY3QoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgcHJlcGFyZSgpLnRoZW4oc3Bhd24pLnRoZW4oaW8pXG4gICAgfSlcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIGlmICh0aGlzLl9zZXNzaW9uKSB7XG4gICAgICB0aGlzLl9zZXNzaW9uLnN0b3AoKVxuICAgICAgdGhpcy5fc2Vzc2lvbiA9IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gIH1cbn1cblxuY29uc3QgcmVnZXhWYXJpYWJsZSA9IC9cXCR7KC4qPyl9L2dcblxuZnVuY3Rpb24gcmVwbGFjZVZhcmlhYmxlICh2YWx1ZSwgdmFyaWFibGVzKSB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKHJlZ2V4VmFyaWFibGUsIChncm91cCwgbmFtZSkgPT4ge1xuICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ2Vudi4nKSkge1xuICAgICAgcmV0dXJuIHZhcmlhYmxlcy5lbnZbbmFtZS5yZXBsYWNlKCdlbnYuJywgJycpXVxuICAgIH1cbiAgICByZXR1cm4gdmFyaWFibGVzW25hbWVdXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldFZhcmlhYmxlcyAoZmlsZSkge1xuICBjb25zdCB3b3Jrc3BhY2VGaWxlID0gZmlsZSAmJiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZSlcbiAgcmV0dXJuIHtcbiAgICAvLyB0aGUgd29ya2luZyBkaXJlY3Rvcnkgb24gc3RhcnR1cCBvZiBhdG9tXG4gICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICAgIC8vIHRoZSBvcGVuIGZpbGUgKGZ1bGwgcGF0aClcbiAgICBmaWxlLFxuICAgIC8vIHRoZSBvcGVuIGZpbGUncyBiYXNlbmFtZVxuICAgIGZpbGVCYXNlbmFtZTogZmlsZSAmJiBwYXRoLmJhc2VuYW1lKGZpbGUpLFxuICAgIC8vIHRoZSBvcGVuIGZpbGUncyBkaXJuYW1lXG4gICAgZmlsZURpcm5hbWU6IGZpbGUgJiYgcGF0aC5kaXJuYW1lKGZpbGUpLFxuICAgIC8vIHRoZSBvcGVuIGZpbGUncyBleHRlbnNpb25cbiAgICBmaWxlRXh0bmFtZTogZmlsZSAmJiBwYXRoLmV4dG5hbWUoZmlsZSksXG4gICAgLy8gdGhlIG9wZW4gZmlsZSByZWxhdGl2ZSB0byB0aGUgXCJ3b3Jrc3BhY2VSb290XCIgdmFyaWFibGVcbiAgICByZWxhdGl2ZUZpbGU6IHdvcmtzcGFjZUZpbGUgJiYgd29ya3NwYWNlRmlsZVsxXSxcbiAgICAvLyB0aGUgZnVsbCBwYXRoIG9mIHRoZSBwcm9qZWN0IHJvb3QgZm9sZGVyXG4gICAgd29ya3NwYWNlUm9vdDogd29ya3NwYWNlRmlsZSAmJiB3b3Jrc3BhY2VGaWxlWzBdXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlRW52IChjb25maWcsIHZhcmlhYmxlcywgZ29jb25maWcpIHtcbiAgLy8gYWxyZWFkeSBhc3NpZ24gdGhlIGFscmVhZHkga25vd24gZW52aXJvbm1lbnQgdmFyaWFibGVzIGhlcmUgc28gdGhleSBjYW4gYmUgdXNlZCBieSB0aGUgYGNvbmZpZy5lbnZgIHZhbHVlc1xuICB2YXJpYWJsZXMuZW52ID0gZ29jb25maWcuZW52aXJvbm1lbnQoKVxuXG4gIGNvbnN0IGVudiA9IE9iamVjdC5hc3NpZ24oe30sIHZhcmlhYmxlcy5lbnYpXG4gIGNvbnN0IGNvbmZpZ0VudiA9IGNvbmZpZy5lbnZcbiAgaWYgKGNvbmZpZ0Vudikge1xuICAgIGZvciAodmFyIGtleSBpbiBjb25maWdFbnYpIHtcbiAgICAgIGlmIChjb25maWdFbnYuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBlbnZba2V5XSA9IHJlcGxhY2VWYXJpYWJsZShjb25maWdFbnZba2V5XSwgdmFyaWFibGVzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXJpYWJsZXMuZW52ID0gZW52XG59XG5cbmNvbnN0IFNFUlZFUl9VUkwgPSAnbG9jYWxob3N0J1xuY29uc3QgU0VSVkVSX1BPUlQgPSAyMzQ1XG5cbmZ1bmN0aW9uIGhvc3RBbmRQb3J0IChjb25maWcpIHtcbiAgY29uc3QgeyBob3N0ID0gU0VSVkVSX1VSTCwgcG9ydCA9IFNFUlZFUl9QT1JUIH0gPSBjb25maWdcbiAgcmV0dXJuIHsgaG9zdCwgcG9ydCB9XG59XG5cbmZ1bmN0aW9uIGdldERsdkFyZ3MgKGNvbmZpZywgdmFyaWFibGVzKSB7XG4gIGNvbnN0IHsgbW9kZSwgcHJvZ3JhbSwgc2hvd0xvZyA9IGZhbHNlLCBidWlsZEZsYWdzLCBiYWNrZW5kID0gJ2RlZmF1bHQnLCBpbml0OiBkbHZJbml0LCBhcmdzIH0gPSBjb25maWdcbiAgY29uc3QgeyBob3N0LCBwb3J0IH0gPSBob3N0QW5kUG9ydChjb25maWcpXG4gIGNvbnN0IGRsdkFyZ3MgPSBbbW9kZSB8fCAnZGVidWcnXVxuXG4gIGxldCBwcm9tID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgaWYgKG1vZGUgPT09ICdhdHRhY2gnKSB7XG4gICAgcHJvbSA9IGF0dGFjaCgpLnRoZW4oKHByb2Nlc3NJRCkgPT4ge1xuICAgICAgZGx2QXJncy5wdXNoKHByb2Nlc3NJRClcbiAgICB9KVxuICB9XG5cbiAgbGV0IHBvc3NpYmxlQmFja2VuZFZhbHVlcyA9IFsnZGVmYXVsdCcsICduYXRpdmUnLCAnbGxkYicsICdyciddXG4gIGlmICghcG9zc2libGVCYWNrZW5kVmFsdWVzLmluY2x1ZGVzKGJhY2tlbmQpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgLS1iYWNrZW5kIG11c3QgYmUgb25lIG9mIHRoZXNlIHZhbHVlcyAke3Bvc3NpYmxlQmFja2VuZFZhbHVlcy5qb2luKCcsICcpfWApKTtcbiAgfVxuXG4gIHJldHVybiBwcm9tLnRoZW4oKCkgPT4ge1xuICAgIGlmIChtb2RlID09PSAnZXhlYycpIHtcbiAgICAgIC8vIGRlYnVnIGEgcHJlIGNvbXBpbGVkIGV4ZWN1dGFibGVcbiAgICAgIGRsdkFyZ3MucHVzaChyZXBsYWNlVmFyaWFibGUocHJvZ3JhbSwgdmFyaWFibGVzKSlcbiAgICB9XG5cbiAgICBkbHZBcmdzLnB1c2goXG4gICAgICAnLS1oZWFkbGVzcz10cnVlJyxcbiAgICAgIGAtLWxpc3Rlbj0ke2hvc3R9OiR7cG9ydH1gLFxuICAgICAgJy0tYXBpLXZlcnNpb249MicsXG4gICAgICBgLS1iYWNrZW5kPSR7YmFja2VuZH1gLFxuICAgICAgYC0tYWNjZXB0LW11bHRpY2xpZW50YFxuICAgIClcbiAgICBpZiAoc2hvd0xvZykge1xuICAgICAgLy8gdHVybiBhZGRpdGlvbmFsIGRlbHZlIGxvZ2dpbmcgb24gb3Igb2ZmXG4gICAgICBkbHZBcmdzLnB1c2goJy0tbG9nPScgKyBzaG93TG9nLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGlmIChidWlsZEZsYWdzKSB7XG4gICAgICAvLyBhZGQgYWRkaXRpb25hbCBidWlsZCBmbGFncyB0byBkZWx2ZVxuICAgICAgZGx2QXJncy5wdXNoKCctLWJ1aWxkLWZsYWdzPScgKyBidWlsZEZsYWdzKVxuICAgIH1cbiAgICBpZiAoZGx2SW5pdCkge1xuICAgICAgLy8gdXNlZCB0byBleGVjdXRlIHNvbWUgY29tbWFuZHMgd2hlbiBkZWx2ZSBzdGFydHNcbiAgICAgIGRsdkFyZ3MucHVzaCgnLS1pbml0PScgKyByZXBsYWNlVmFyaWFibGUoZGx2SW5pdCwgdmFyaWFibGVzKSlcbiAgICB9XG4gICAgaWYgKGFyZ3MpIHtcbiAgICAgIGRsdkFyZ3MucHVzaCgnLS0nLCAuLi5hcmdzLm1hcCgodikgPT4gcmVwbGFjZVZhcmlhYmxlKHYsIHZhcmlhYmxlcykpKVxuICAgIH1cblxuICAgIHJldHVybiBkbHZBcmdzXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGF0dGFjaCAoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgaXRlbS5pbm5lckhUTUwgPSAnPHA+UHJvY2VzcyBJRDo8L3A+JyArXG4gICAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJnby1kZWJ1Zy1hdHRhY2gtaW5wdXQgbmF0aXZlLWtleS1iaW5kaW5nc1wiIC8+JyArXG4gICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJnby1kZWJ1Zy1hdHRhY2gtYnRuIGJ0blwiPk9LPC9idXR0b24+J1xuXG4gICAgY29uc3QgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbSB9KVxuXG4gICAgY29uc3QgaW5wdXQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5nby1kZWJ1Zy1hdHRhY2gtaW5wdXQnKVxuICAgIGlucHV0LmZvY3VzKClcblxuICAgIGl0ZW0ucXVlcnlTZWxlY3RvcignLmdvLWRlYnVnLWF0dGFjaC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHBhbmVsLmRlc3Ryb3koKVxuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gaW5wdXRcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldEN3ZCAoY29uZmlnLCB2YXJpYWJsZXMpIHtcbiAgbGV0IHsgY3dkIH0gPSBjb25maWdcbiAgaWYgKGN3ZCkge1xuICAgIHJldHVybiByZXBsYWNlVmFyaWFibGUoY3dkLCB2YXJpYWJsZXMpXG4gIH1cbiAgbGV0IGZpbGUgPSB2YXJpYWJsZXMuZmlsZVxuICB0cnkge1xuICAgIGlmIChmaWxlICYmIGZzLmxzdGF0U3luYyhmaWxlKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBjd2QgPSBmaWxlIC8vIGFzc3VtZSBpdCBpcyBhIHBhY2thZ2UuLi5cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyAuLi5cbiAgfVxuICBpZiAoIWN3ZCAmJiBmaWxlKSB7XG4gICAgY3dkID0gcGF0aC5kaXJuYW1lKGZpbGUpXG4gIH1cbiAgaWYgKCFjd2QpIHtcbiAgICBjd2QgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICB9XG4gIHJldHVybiBjd2Rcbn1cbiJdfQ==