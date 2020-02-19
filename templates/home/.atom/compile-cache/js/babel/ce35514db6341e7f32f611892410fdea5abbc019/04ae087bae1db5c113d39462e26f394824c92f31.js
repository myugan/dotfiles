Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _environment = require('./environment');

var _pathhelper = require('./pathhelper');

var pathhelper = _interopRequireWildcard(_pathhelper);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./../utils');

var Locator = (function () {
  function Locator(options) {
    var _this = this;

    _classCallCheck(this, Locator);

    this.subscriptions = new _atom.CompositeDisposable();
    this.executableSuffix = '';
    this.pathKey = 'PATH';
    if (_os2['default'].platform() === 'win32') {
      this.executableSuffix = '.exe';
      this.pathKey = 'Path';
    }
    this.goExecutables = ['go' + this.executableSuffix, 'goapp' + this.executableSuffix];
    if (options && options.executor) {
      this.executor = options.executor;
    } else {
      var _require = require('./executor');

      var _Executor = _require.Executor;

      this.executor = new _Executor(function () {
        return null;
      });
    }

    this.subscriptions.add(this.executor);
    this.goLocators = [{ name: 'goroot-locator', func: function func() {
        return _this.gorootLocator();
      } }, // check $GOROOT/bin
    { name: 'config-locator', func: function func() {
        return _this.configLocator();
      } }, // check Atom configuration
    { name: 'path-locator', func: function func() {
        return _this.pathLocator();
      } }, // check $PATH
    { name: 'default-locator', func: function func() {
        return _this.defaultLocator();
      } } // check common installation locations
    ];

    this.setKnownToolStrategies();
  }

  _createClass(Locator, [{
    key: 'dispose',
    value: function dispose() {
      this.resetRuntimes();
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.goLocators = [];
      this.goExecutables = [];
      this.toolStrategies.clear();
    }

    // Public: Get the go runtime(s).
    // Returns an array of {Object} where each item contains the output from "go
    // env", or false if no runtimes are found.
  }, {
    key: 'runtimes',
    value: _asyncToGenerator(function* () {
      if (this.runtimesCache) {
        return this.runtimesCache;
      }
      var candidates = this.runtimeCandidates();
      if (!candidates || !candidates.length) {
        return [];
      }

      // for each candidate, make sure we can execute 'go version'
      var viableCandidates = [];
      for (var candidate of candidates) {
        var goversion = this.executor.execSync(candidate.path, ['version'], {
          cwd: _path2['default'].dirname(candidate.path)
        });
        var stdout = goversion.stdout instanceof Buffer ? goversion.stdout.toString() : goversion.stdout;
        if (goversion && goversion.exitcode === 0 && stdout.startsWith('go version')) {
          var v = {};
          v.path = candidate.path;
          v.version = stdout.replace(/\r?\n|\r/g, '');
          v.locator = candidate.locator;

          var versionComponents = v.version.split(' ');
          v.name = versionComponents[2];
          v.semver = versionComponents[2];
          if (v.semver && v.semver.startsWith('go')) {
            v.semver = v.semver.substring(2, v.semver.length);
          }
          viableCandidates.push(v);
        }
      }

      // for each candidate, capture the output of 'go env -json'
      var finalCandidates = [];
      for (var viableCandidate of viableCandidates) {
        var goenv = this.executor.execSync(viableCandidate.path, ['env', '-json'], { cwd: _path2['default'].dirname(viableCandidate.path) });
        var stdout = goenv.stdout instanceof Buffer ? goenv.stdout.toString() : goenv.stdout;
        if (goenv && goenv.exitcode === 0 && stdout.trim() !== '') {
          var vars = JSON.parse(stdout);
          finalCandidates.push(_extends({}, viableCandidate, vars));
        }
      }
      this.runtimesCache = finalCandidates;
      return finalCandidates;
    })

    // Deprecated: Use runtime() instead.
  }, {
    key: 'runtimeForProject',
    value: function runtimeForProject() {
      return this.runtime();
    }

    // Public: Get the go runtime.
    // Returns an {Object} which contains the output from "go env", or false if
    // no runtime is found.
  }, {
    key: 'runtime',
    value: _asyncToGenerator(function* () {
      var runtimes = yield this.runtimes();
      if (!runtimes || runtimes.length === 0) {
        return false;
      }
      return runtimes[0];
    })

    // Public: Get the gopath.
    // Returns the GOPATH if it exists, or false if it is not defined.
  }, {
    key: 'gopath',
    value: function gopath() {
      return (0, _environment.getgopath)();
    }

    // Public: Find the specified tool.
    // Returns the path to the tool if found, or false if it cannot be found.
  }, {
    key: 'findTool',
    value: _asyncToGenerator(function* (name) {
      if (!name || name.constructor !== String || name.trim() === '') {
        return false;
      }

      if (!this.toolStrategies) {
        return false;
      }

      var strategy = this.toolStrategies.get(name) || 'DEFAULT';
      switch (strategy) {
        case 'GOPATHBIN':
          return this.findToolInDelimitedEnvironmentVariable(name, 'GOPATH');
        case 'PATH':
          return this.findToolInDelimitedEnvironmentVariable(name, this.pathKey);
      }
      // for other strategies we need more info about the Go environment
      var runtime = yield this.runtime();
      if (!runtime) {
        return false;
      }

      if (name === 'go') {
        return runtime.path;
      }

      switch (strategy) {
        case 'GOROOTBIN':
          return name === 'go' && runtime.path.endsWith('goapp' + runtime.GOEXE) ? _path2['default'].join(runtime.GOROOT, 'bin', 'goapp' + runtime.GOEXE) : _path2['default'].join(runtime.GOROOT, 'bin', name + runtime.GOEXE);
        case 'GOTOOLDIR':
          return _path2['default'].join(runtime.GOTOOLDIR, name + runtime.GOEXE);
        default:
          return this.findToolWithDefaultStrategy(name);
      }
    })
  }, {
    key: 'resetRuntimes',
    value: function resetRuntimes() {
      this.runtimesCache = [];
    }
  }, {
    key: 'statishSync',
    value: function statishSync(pathValue) {
      var stat = false;
      if (pathValue && pathValue.trim() !== '') {
        try {
          stat = _fs2['default'].statSync(pathValue);
        } catch (e) {} // eslint-disable-line no-empty
      }
      return stat;
    }
  }, {
    key: 'exists',
    value: _asyncToGenerator(function* (p) {
      var s = yield (0, _utils.stat)(p);
      return !!s;
    })
  }, {
    key: 'runtimeCandidates',
    value: function runtimeCandidates() {
      var candidates = [];

      var _loop = function (_locator) {
        var paths = _locator.func();
        if (Array.isArray(paths) && paths.length > 0) {
          var found = paths.map(function (p) {
            return { locator: _locator.name, path: p };
          });
          // take the union of candidates and found, removing any duplicates
          candidates = [].concat(_toConsumableArray(new Set([].concat(_toConsumableArray(candidates), _toConsumableArray(found)))));
        }
      };

      for (var _locator of this.goLocators) {
        _loop(_locator);
      }
      return candidates;
    }

    // Internal: Find a go installation using your Atom config. Deliberately
    // undocumented, as this method is discouraged.
  }, {
    key: 'configLocator',
    value: function configLocator() {
      var goinstallation = atom.config.get('go-plus.config.goinstallation');
      var stat = this.statishSync(goinstallation);
      if (stat) {
        var d = goinstallation;
        if (stat.isFile()) {
          d = _path2['default'].dirname(goinstallation);
        }
        return this.findExecutablesInPath(d, this.goExecutables);
      }

      return [];
    }

    // gorootLocator attempts to locate a go tool in $GOROOT/bin
  }, {
    key: 'gorootLocator',
    value: function gorootLocator() {
      var g = this.environment().GOROOT;
      if (!g || g.trim() === '') {
        return [];
      }
      return this.findExecutablesInPath(_path2['default'].join(g, 'bin'), this.goExecutables);
    }

    // pathLocator attemps to find a go binary in the directories listed in $PATH
  }, {
    key: 'pathLocator',
    value: function pathLocator() {
      return this.findExecutablesInPath(this.environment()[this.pathKey], this.goExecutables);
    }
  }, {
    key: 'defaultLocator',
    value: function defaultLocator() {
      var installPaths = [];
      if (_os2['default'].platform() === 'win32') {
        /*
        c:\go\bin = Binary Distribution
        c:\tools\go\bin = Chocolatey
        */
        installPaths.push(_path2['default'].join('c:', 'go', 'bin'));
        installPaths.push(_path2['default'].join('c:', 'tools', 'go', 'bin'));
      } else {
        /*
        /usr/local/go/bin = Binary Distribution
        /usr/local/bin = Homebrew
        */
        installPaths.push(_path2['default'].join('/', 'usr', 'local', 'go', 'bin'));
        installPaths.push(_path2['default'].join('/', 'usr', 'local', 'bin'));
      }
      return this.findExecutablesInPath(installPaths.join(_path2['default'].delimiter), this.goExecutables);
    }
  }, {
    key: 'findExecutablesInPath',
    value: function findExecutablesInPath(pathValue, executables) {
      var candidates = [];
      if (!pathValue || pathValue.constructor !== String || pathValue.trim() === '') {
        return candidates;
      }

      if (!executables || executables.constructor !== Array || executables.length < 1) {
        return candidates;
      }

      var elements = pathhelper.expand(this.environment(), pathValue).split(_path2['default'].delimiter);
      for (var element of elements) {
        for (var executable of executables) {
          var candidate = _path2['default'].join(element, executable);
          var _stat = this.statishSync(candidate);
          if (_stat && _stat.isFile() && _stat.size > 0) {
            candidates.push(candidate);
          }
        }
      }
      return candidates;
    }

    // Internal: Get a copy of the environment, with the GOPATH correctly set.
    // Returns an {Object} where the key is the environment variable name and the value is the environment variable value.
  }, {
    key: 'environment',
    value: function environment() {
      return (0, _environment.getenvironment)();
    }
  }, {
    key: 'rawEnvironment',
    value: function rawEnvironment() {
      return Object.assign({}, process.env);
    }

    // Internal: Set the strategy for finding known or built-in tools.
    // Returns a map where the key is the tool name and the value is the strategy.
  }, {
    key: 'setKnownToolStrategies',
    value: function setKnownToolStrategies() {
      this.toolStrategies = new Map();

      // Built-In Tools
      this.toolStrategies.set('go', 'GOROOTBIN');
      this.toolStrategies.set('gofmt', 'GOROOTBIN');
      this.toolStrategies.set('godoc', 'GOROOTBIN');

      this.toolStrategies.set('addr2line', 'GOTOOLDIR');
      this.toolStrategies.set('api', 'GOTOOLDIR');
      this.toolStrategies.set('asm', 'GOTOOLDIR');
      this.toolStrategies.set('buildid', 'GOTOOLDIR');
      this.toolStrategies.set('cgo', 'GOTOOLDIR');
      this.toolStrategies.set('compile', 'GOTOOLDIR');
      this.toolStrategies.set('cover', 'GOTOOLDIR');
      this.toolStrategies.set('dist', 'GOTOOLDIR');
      this.toolStrategies.set('doc', 'GOTOOLDIR');
      this.toolStrategies.set('fix', 'GOTOOLDIR');
      this.toolStrategies.set('link', 'GOTOOLDIR');
      this.toolStrategies.set('nm', 'GOTOOLDIR');
      this.toolStrategies.set('objdump', 'GOTOOLDIR');
      this.toolStrategies.set('pack', 'GOTOOLDIR');
      this.toolStrategies.set('pprof', 'GOTOOLDIR');
      this.toolStrategies.set('test2json', 'GOTOOLDIR');
      this.toolStrategies.set('trace', 'GOTOOLDIR');
      this.toolStrategies.set('vet', 'GOTOOLDIR');

      // External Tools
      this.toolStrategies.set('git', 'PATH');

      // Other Tools Are Assumed To Be In PATH or GOBIN or GOPATH/bin
    }

    // Internal: Handle the specified error, if needed.
  }, {
    key: 'handleError',
    value: function handleError(err) {
      if (err.handle) {
        err.handle();
      }
    }

    // Internal: Try to find a tool with the default strategy (GOPATH/bin, then PATH).
    // Returns the path to the tool, or false if it cannot be found.
  }, {
    key: 'findToolWithDefaultStrategy',
    value: function findToolWithDefaultStrategy(name) {
      // Default Strategy Is: Look For The Tool In GOPATH, Then Look In PATH
      return this.findToolInDelimitedEnvironmentVariable(name, 'GOPATH') || this.findToolInDelimitedEnvironmentVariable(name, this.pathKey);
    }

    // Internal: Try to find a tool in a delimited environment variable (e.g. PATH).
    // Returns the path to the tool, or false if it cannot be found.
  }, {
    key: 'findToolInDelimitedEnvironmentVariable',
    value: function findToolInDelimitedEnvironmentVariable(toolName, key) {
      if (!toolName || toolName.constructor !== String || toolName.trim() === '') {
        return false;
      }

      var p = this.environment()[key];
      if (!p) {
        return false;
      }

      var elements = p.split(_path2['default'].delimiter);
      for (var element of elements) {
        var item = '';
        if (key === 'GOPATH') {
          item = _path2['default'].join(element, 'bin', toolName + this.executableSuffix);
        } else {
          item = _path2['default'].join(element, toolName + this.executableSuffix);
        }

        if (_fs2['default'].existsSync(item)) {
          var _stat2 = _fs2['default'].statSync(item);
          if (_stat2 && _stat2.isFile() && _stat2.size > 0) {
            return item;
          }
        }
      }

      return false;
    }
  }]);

  return Locator;
})();

exports.Locator = Locator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2NvbmZpZy9sb2NhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7MkJBQ0EsZUFBZTs7MEJBQzdCLGNBQWM7O0lBQTlCLFVBQVU7O2tCQUNQLElBQUk7Ozs7a0JBQ0osSUFBSTs7OztvQkFDRixNQUFNOzs7O3FCQUNGLFlBQVk7O0lBeUIzQixPQUFPO0FBVUEsV0FWUCxPQUFPLENBVUMsT0FBaUMsRUFBRTs7OzBCQVYzQyxPQUFPOztBQVdULFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQTtBQUNyQixRQUFJLGdCQUFHLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtBQUM3QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO0tBQ3RCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUM1QixPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUNoQyxDQUFBO0FBQ0QsUUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUMvQixVQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7S0FDakMsTUFBTTtxQkFDZ0IsT0FBTyxDQUFDLFlBQVksQ0FBQzs7VUFBbEMsU0FBUSxZQUFSLFFBQVE7O0FBQ2hCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFRLENBQUM7ZUFBTSxJQUFJO09BQUEsQ0FBQyxDQUFBO0tBQ3pDOztBQUVELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FB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YyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7O0FBRTdDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM3QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMzQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzFDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzdDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBOzs7QUFHM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBOzs7S0FHdkM7Ozs7O1dBR1UscUJBQUMsR0FBUSxFQUFFO0FBQ3BCLFVBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUNkLFdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUNiO0tBQ0Y7Ozs7OztXQUkwQixxQ0FBQyxJQUFZLEVBQWM7O0FBRXBELGFBQ0UsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFDM0QsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQ2hFO0tBQ0Y7Ozs7OztXQUlxQyxnREFDcEMsUUFBZ0IsRUFDaEIsR0FBVyxFQUNDO0FBQ1osVUFDRSxDQUFDLFFBQVEsSUFDVCxRQUFRLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFDL0IsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFDdEI7QUFDQSxlQUFPLEtBQUssQ0FBQTtPQUNiOztBQUVELFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNqQyxVQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ04sZUFBTyxLQUFLLENBQUE7T0FDYjs7QUFFRCxVQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxDQUFBO0FBQ3hDLFdBQUssSUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQzlCLFlBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUNiLFlBQUksR0FBRyxLQUFLLFFBQVEsRUFBRTtBQUNwQixjQUFJLEdBQUcsa0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1NBQ25FLE1BQU07QUFDTCxjQUFJLEdBQUcsa0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7U0FDNUQ7O0FBRUQsWUFBSSxnQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsY0FBTSxNQUFJLEdBQUcsZ0JBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzlCLGNBQUksTUFBSSxJQUFJLE1BQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxNQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtBQUMxQyxtQkFBTyxJQUFJLENBQUE7V0FDWjtTQUNGO09BQ0Y7O0FBRUQsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1NBalpHLE9BQU87OztRQW9aSixPQUFPLEdBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9jb25maWcvbG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZ2V0ZW52aXJvbm1lbnQsIGdldGdvcGF0aCB9IGZyb20gJy4vZW52aXJvbm1lbnQnXG5pbXBvcnQgKiBhcyBwYXRoaGVscGVyIGZyb20gJy4vcGF0aGhlbHBlcidcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBzdGF0IH0gZnJvbSAnLi8uLi91dGlscydcblxuaW1wb3J0IHR5cGUgeyBFeGVjdXRvciB9IGZyb20gJy4vZXhlY3V0b3InXG5cbmV4cG9ydCB0eXBlIFJ1bnRpbWUgPSB7XG4gIHBhdGg6IHN0cmluZyxcbiAgdmVyc2lvbjogc3RyaW5nLFxuICBsb2NhdG9yOiBzdHJpbmcsXG4gIG5hbWU/OiBzdHJpbmcsXG4gIHNlbXZlcj86IHN0cmluZyxcblxuICBHT1JPT1Q6IHN0cmluZyxcbiAgR09FWEU6IHN0cmluZyxcbiAgR09UT09MRElSOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgRmluZFJlc3VsdCA9IHN0cmluZyB8IGZhbHNlXG5cbnR5cGUgU3RyYXRlZ3kgPSAnUEFUSCcgfCAnREVGQVVMVCcgfCAnR09ST09UQklOJyB8ICdHT1RPT0xESVInIHwgJ0dPUEFUSEJJTidcblxudHlwZSBHb0xvY2F0b3IgPSB7XG4gIG5hbWU6IHN0cmluZyxcbiAgZnVuYzogKCkgPT4gQXJyYXk8c3RyaW5nPlxufVxuXG5jbGFzcyBMb2NhdG9yIHtcbiAgcnVudGltZXNDYWNoZTogQXJyYXk8UnVudGltZT5cbiAgZXhlY3V0b3I6IEV4ZWN1dG9yXG4gIGdvRXhlY3V0YWJsZXM6IEFycmF5PHN0cmluZz5cbiAgZXhlY3V0YWJsZVN1ZmZpeDogc3RyaW5nXG4gIHBhdGhLZXk6IHN0cmluZ1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGdvTG9jYXRvcnM6IEFycmF5PEdvTG9jYXRvcj5cbiAgdG9vbFN0cmF0ZWdpZXM6IE1hcDxzdHJpbmcsIFN0cmF0ZWd5PlxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiB7IGV4ZWN1dG9yPzogRXhlY3V0b3IgfSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmV4ZWN1dGFibGVTdWZmaXggPSAnJ1xuICAgIHRoaXMucGF0aEtleSA9ICdQQVRIJ1xuICAgIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInKSB7XG4gICAgICB0aGlzLmV4ZWN1dGFibGVTdWZmaXggPSAnLmV4ZSdcbiAgICAgIHRoaXMucGF0aEtleSA9ICdQYXRoJ1xuICAgIH1cbiAgICB0aGlzLmdvRXhlY3V0YWJsZXMgPSBbXG4gICAgICAnZ28nICsgdGhpcy5leGVjdXRhYmxlU3VmZml4LFxuICAgICAgJ2dvYXBwJyArIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeFxuICAgIF1cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmV4ZWN1dG9yKSB7XG4gICAgICB0aGlzLmV4ZWN1dG9yID0gb3B0aW9ucy5leGVjdXRvclxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7IEV4ZWN1dG9yIH0gPSByZXF1aXJlKCcuL2V4ZWN1dG9yJylcbiAgICAgIHRoaXMuZXhlY3V0b3IgPSBuZXcgRXhlY3V0b3IoKCkgPT4gbnVsbClcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZXhlY3V0b3IpXG4gICAgdGhpcy5nb0xvY2F0b3JzID0gW1xuICAgICAgeyBuYW1lOiAnZ29yb290LWxvY2F0b3InLCBmdW5jOiAoKSA9PiB0aGlzLmdvcm9vdExvY2F0b3IoKSB9LCAvLyBjaGVjayAkR09ST09UL2JpblxuICAgICAgeyBuYW1lOiAnY29uZmlnLWxvY2F0b3InLCBmdW5jOiAoKSA9PiB0aGlzLmNvbmZpZ0xvY2F0b3IoKSB9LCAvLyBjaGVjayBBdG9tIGNvbmZpZ3VyYXRpb25cbiAgICAgIHsgbmFtZTogJ3BhdGgtbG9jYXRvcicsIGZ1bmM6ICgpID0+IHRoaXMucGF0aExvY2F0b3IoKSB9LCAvLyBjaGVjayAkUEFUSFxuICAgICAgeyBuYW1lOiAnZGVmYXVsdC1sb2NhdG9yJywgZnVuYzogKCkgPT4gdGhpcy5kZWZhdWx0TG9jYXRvcigpIH0gLy8gY2hlY2sgY29tbW9uIGluc3RhbGxhdGlvbiBsb2NhdGlvbnNcbiAgICBdXG5cbiAgICB0aGlzLnNldEtub3duVG9vbFN0cmF0ZWdpZXMoKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnJlc2V0UnVudGltZXMoKVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5nb0xvY2F0b3JzID0gW11cbiAgICB0aGlzLmdvRXhlY3V0YWJsZXMgPSBbXVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuY2xlYXIoKVxuICB9XG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIGdvIHJ1bnRpbWUocykuXG4gIC8vIFJldHVybnMgYW4gYXJyYXkgb2Yge09iamVjdH0gd2hlcmUgZWFjaCBpdGVtIGNvbnRhaW5zIHRoZSBvdXRwdXQgZnJvbSBcImdvXG4gIC8vIGVudlwiLCBvciBmYWxzZSBpZiBubyBydW50aW1lcyBhcmUgZm91bmQuXG4gIGFzeW5jIHJ1bnRpbWVzKCk6IFByb21pc2U8QXJyYXk8UnVudGltZT4+IHtcbiAgICBpZiAodGhpcy5ydW50aW1lc0NhY2hlKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW50aW1lc0NhY2hlXG4gICAgfVxuICAgIGNvbnN0IGNhbmRpZGF0ZXM6IEFycmF5PHtcbiAgICAgIGxvY2F0b3I6IHN0cmluZyxcbiAgICAgIHBhdGg6IHN0cmluZ1xuICAgIH0+ID0gdGhpcy5ydW50aW1lQ2FuZGlkYXRlcygpXG4gICAgaWYgKCFjYW5kaWRhdGVzIHx8ICFjYW5kaWRhdGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgLy8gZm9yIGVhY2ggY2FuZGlkYXRlLCBtYWtlIHN1cmUgd2UgY2FuIGV4ZWN1dGUgJ2dvIHZlcnNpb24nXG4gICAgY29uc3QgdmlhYmxlQ2FuZGlkYXRlczogQXJyYXk8eyBsb2NhdG9yOiBzdHJpbmcsIHBhdGg6IHN0cmluZyB9PiA9IFtdXG4gICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlcykge1xuICAgICAgY29uc3QgZ292ZXJzaW9uID0gdGhpcy5leGVjdXRvci5leGVjU3luYyhjYW5kaWRhdGUucGF0aCwgWyd2ZXJzaW9uJ10sIHtcbiAgICAgICAgY3dkOiBwYXRoLmRpcm5hbWUoY2FuZGlkYXRlLnBhdGgpXG4gICAgICB9KVxuICAgICAgY29uc3Qgc3Rkb3V0ID1cbiAgICAgICAgZ292ZXJzaW9uLnN0ZG91dCBpbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgID8gZ292ZXJzaW9uLnN0ZG91dC50b1N0cmluZygpXG4gICAgICAgICAgOiBnb3ZlcnNpb24uc3Rkb3V0XG4gICAgICBpZiAoXG4gICAgICAgIGdvdmVyc2lvbiAmJlxuICAgICAgICBnb3ZlcnNpb24uZXhpdGNvZGUgPT09IDAgJiZcbiAgICAgICAgc3Rkb3V0LnN0YXJ0c1dpdGgoJ2dvIHZlcnNpb24nKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHYgPSB7fVxuICAgICAgICB2LnBhdGggPSBjYW5kaWRhdGUucGF0aFxuICAgICAgICB2LnZlcnNpb24gPSBzdGRvdXQucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgJycpXG4gICAgICAgIHYubG9jYXRvciA9IGNhbmRpZGF0ZS5sb2NhdG9yXG5cbiAgICAgICAgY29uc3QgdmVyc2lvbkNvbXBvbmVudHMgPSB2LnZlcnNpb24uc3BsaXQoJyAnKVxuICAgICAgICB2Lm5hbWUgPSB2ZXJzaW9uQ29tcG9uZW50c1syXVxuICAgICAgICB2LnNlbXZlciA9IHZlcnNpb25Db21wb25lbnRzWzJdXG4gICAgICAgIGlmICh2LnNlbXZlciAmJiB2LnNlbXZlci5zdGFydHNXaXRoKCdnbycpKSB7XG4gICAgICAgICAgdi5zZW12ZXIgPSB2LnNlbXZlci5zdWJzdHJpbmcoMiwgdi5zZW12ZXIubGVuZ3RoKVxuICAgICAgICB9XG4gICAgICAgIHZpYWJsZUNhbmRpZGF0ZXMucHVzaCh2KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZvciBlYWNoIGNhbmRpZGF0ZSwgY2FwdHVyZSB0aGUgb3V0cHV0IG9mICdnbyBlbnYgLWpzb24nXG4gICAgY29uc3QgZmluYWxDYW5kaWRhdGVzID0gW11cbiAgICBmb3IgKGNvbnN0IHZpYWJsZUNhbmRpZGF0ZSBvZiB2aWFibGVDYW5kaWRhdGVzKSB7XG4gICAgICBjb25zdCBnb2VudiA9IHRoaXMuZXhlY3V0b3IuZXhlY1N5bmMoXG4gICAgICAgIHZpYWJsZUNhbmRpZGF0ZS5wYXRoLFxuICAgICAgICBbJ2VudicsICctanNvbiddLFxuICAgICAgICB7IGN3ZDogcGF0aC5kaXJuYW1lKHZpYWJsZUNhbmRpZGF0ZS5wYXRoKSB9XG4gICAgICApXG4gICAgICBjb25zdCBzdGRvdXQgPVxuICAgICAgICBnb2Vudi5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXIgPyBnb2Vudi5zdGRvdXQudG9TdHJpbmcoKSA6IGdvZW52LnN0ZG91dFxuICAgICAgaWYgKGdvZW52ICYmIGdvZW52LmV4aXRjb2RlID09PSAwICYmIHN0ZG91dC50cmltKCkgIT09ICcnKSB7XG4gICAgICAgIGNvbnN0IHZhcnMgPSBKU09OLnBhcnNlKHN0ZG91dClcbiAgICAgICAgZmluYWxDYW5kaWRhdGVzLnB1c2goeyAuLi52aWFibGVDYW5kaWRhdGUsIC4uLnZhcnMgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5ydW50aW1lc0NhY2hlID0gZmluYWxDYW5kaWRhdGVzXG4gICAgcmV0dXJuIGZpbmFsQ2FuZGlkYXRlc1xuICB9XG5cbiAgLy8gRGVwcmVjYXRlZDogVXNlIHJ1bnRpbWUoKSBpbnN0ZWFkLlxuICBydW50aW1lRm9yUHJvamVjdCgpIHtcbiAgICByZXR1cm4gdGhpcy5ydW50aW1lKClcbiAgfVxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBnbyBydW50aW1lLlxuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGNvbnRhaW5zIHRoZSBvdXRwdXQgZnJvbSBcImdvIGVudlwiLCBvciBmYWxzZSBpZlxuICAvLyBubyBydW50aW1lIGlzIGZvdW5kLlxuICBhc3luYyBydW50aW1lKCk6IFByb21pc2U8ZmFsc2UgfCBSdW50aW1lPiB7XG4gICAgY29uc3QgcnVudGltZXMgPSBhd2FpdCB0aGlzLnJ1bnRpbWVzKClcbiAgICBpZiAoIXJ1bnRpbWVzIHx8IHJ1bnRpbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBydW50aW1lc1swXVxuICB9XG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIGdvcGF0aC5cbiAgLy8gUmV0dXJucyB0aGUgR09QQVRIIGlmIGl0IGV4aXN0cywgb3IgZmFsc2UgaWYgaXQgaXMgbm90IGRlZmluZWQuXG4gIGdvcGF0aCgpIHtcbiAgICByZXR1cm4gZ2V0Z29wYXRoKClcbiAgfVxuXG4gIC8vIFB1YmxpYzogRmluZCB0aGUgc3BlY2lmaWVkIHRvb2wuXG4gIC8vIFJldHVybnMgdGhlIHBhdGggdG8gdGhlIHRvb2wgaWYgZm91bmQsIG9yIGZhbHNlIGlmIGl0IGNhbm5vdCBiZSBmb3VuZC5cbiAgYXN5bmMgZmluZFRvb2wobmFtZTogc3RyaW5nKTogUHJvbWlzZTxGaW5kUmVzdWx0PiB7XG4gICAgaWYgKCFuYW1lIHx8IG5hbWUuY29uc3RydWN0b3IgIT09IFN0cmluZyB8fCBuYW1lLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmICghdGhpcy50b29sU3RyYXRlZ2llcykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3Qgc3RyYXRlZ3k6IFN0cmF0ZWd5ID0gdGhpcy50b29sU3RyYXRlZ2llcy5nZXQobmFtZSkgfHwgJ0RFRkFVTFQnXG4gICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgY2FzZSAnR09QQVRIQklOJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUobmFtZSwgJ0dPUEFUSCcpXG4gICAgICBjYXNlICdQQVRIJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUobmFtZSwgdGhpcy5wYXRoS2V5KVxuICAgIH1cbiAgICAvLyBmb3Igb3RoZXIgc3RyYXRlZ2llcyB3ZSBuZWVkIG1vcmUgaW5mbyBhYm91dCB0aGUgR28gZW52aXJvbm1lbnRcbiAgICBjb25zdCBydW50aW1lID0gYXdhaXQgdGhpcy5ydW50aW1lKClcbiAgICBpZiAoIXJ1bnRpbWUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAnZ28nKSB7XG4gICAgICByZXR1cm4gcnVudGltZS5wYXRoXG4gICAgfVxuXG4gICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgY2FzZSAnR09ST09UQklOJzpcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09ICdnbycgJiYgcnVudGltZS5wYXRoLmVuZHNXaXRoKCdnb2FwcCcgKyBydW50aW1lLkdPRVhFKVxuICAgICAgICAgID8gcGF0aC5qb2luKHJ1bnRpbWUuR09ST09ULCAnYmluJywgJ2dvYXBwJyArIHJ1bnRpbWUuR09FWEUpXG4gICAgICAgICAgOiBwYXRoLmpvaW4ocnVudGltZS5HT1JPT1QsICdiaW4nLCBuYW1lICsgcnVudGltZS5HT0VYRSlcbiAgICAgIGNhc2UgJ0dPVE9PTERJUic6XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4ocnVudGltZS5HT1RPT0xESVIsIG5hbWUgKyBydW50aW1lLkdPRVhFKVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFRvb2xXaXRoRGVmYXVsdFN0cmF0ZWd5KG5hbWUpXG4gICAgfVxuICB9XG5cbiAgcmVzZXRSdW50aW1lcygpIHtcbiAgICB0aGlzLnJ1bnRpbWVzQ2FjaGUgPSBbXVxuICB9XG5cbiAgc3RhdGlzaFN5bmMocGF0aFZhbHVlOiBzdHJpbmcpIHtcbiAgICBsZXQgc3RhdCA9IGZhbHNlXG4gICAgaWYgKHBhdGhWYWx1ZSAmJiBwYXRoVmFsdWUudHJpbSgpICE9PSAnJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKHBhdGhWYWx1ZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZW1wdHlcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRcbiAgfVxuXG4gIGFzeW5jIGV4aXN0cyhwOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBzID0gYXdhaXQgc3RhdChwKVxuICAgIHJldHVybiAhIXNcbiAgfVxuXG4gIHJ1bnRpbWVDYW5kaWRhdGVzKCk6IEFycmF5PHsgbG9jYXRvcjogc3RyaW5nLCBwYXRoOiBzdHJpbmcgfT4ge1xuICAgIGxldCBjYW5kaWRhdGVzOiBBcnJheTx7IGxvY2F0b3I6IHN0cmluZywgcGF0aDogc3RyaW5nIH0+ID0gW11cbiAgICBmb3IgKGNvbnN0IGxvY2F0b3Igb2YgdGhpcy5nb0xvY2F0b3JzKSB7XG4gICAgICBjb25zdCBwYXRocyA9IGxvY2F0b3IuZnVuYygpXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXRocykgJiYgcGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBmb3VuZCA9IHBhdGhzLm1hcChwID0+ICh7IGxvY2F0b3I6IGxvY2F0b3IubmFtZSwgcGF0aDogcCB9KSlcbiAgICAgICAgLy8gdGFrZSB0aGUgdW5pb24gb2YgY2FuZGlkYXRlcyBhbmQgZm91bmQsIHJlbW92aW5nIGFueSBkdXBsaWNhdGVzXG4gICAgICAgIGNhbmRpZGF0ZXMgPSBbLi4ubmV3IFNldChbLi4uY2FuZGlkYXRlcywgLi4uZm91bmRdKV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhbmRpZGF0ZXNcbiAgfVxuXG4gIC8vIEludGVybmFsOiBGaW5kIGEgZ28gaW5zdGFsbGF0aW9uIHVzaW5nIHlvdXIgQXRvbSBjb25maWcuIERlbGliZXJhdGVseVxuICAvLyB1bmRvY3VtZW50ZWQsIGFzIHRoaXMgbWV0aG9kIGlzIGRpc2NvdXJhZ2VkLlxuICBjb25maWdMb2NhdG9yKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IGdvaW5zdGFsbGF0aW9uID0gKGF0b20uY29uZmlnLmdldChcbiAgICAgICdnby1wbHVzLmNvbmZpZy5nb2luc3RhbGxhdGlvbidcbiAgICApOiBhbnkpXG4gICAgY29uc3Qgc3RhdCA9IHRoaXMuc3RhdGlzaFN5bmMoZ29pbnN0YWxsYXRpb24pXG4gICAgaWYgKHN0YXQpIHtcbiAgICAgIGxldCBkID0gZ29pbnN0YWxsYXRpb25cbiAgICAgIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgICAgIGQgPSBwYXRoLmRpcm5hbWUoZ29pbnN0YWxsYXRpb24pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5maW5kRXhlY3V0YWJsZXNJblBhdGgoZCwgdGhpcy5nb0V4ZWN1dGFibGVzKVxuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9XG5cbiAgLy8gZ29yb290TG9jYXRvciBhdHRlbXB0cyB0byBsb2NhdGUgYSBnbyB0b29sIGluICRHT1JPT1QvYmluXG4gIGdvcm9vdExvY2F0b3IoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgZyA9IHRoaXMuZW52aXJvbm1lbnQoKS5HT1JPT1RcbiAgICBpZiAoIWcgfHwgZy50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmluZEV4ZWN1dGFibGVzSW5QYXRoKHBhdGguam9pbihnLCAnYmluJyksIHRoaXMuZ29FeGVjdXRhYmxlcylcbiAgfVxuXG4gIC8vIHBhdGhMb2NhdG9yIGF0dGVtcHMgdG8gZmluZCBhIGdvIGJpbmFyeSBpbiB0aGUgZGlyZWN0b3JpZXMgbGlzdGVkIGluICRQQVRIXG4gIHBhdGhMb2NhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmZpbmRFeGVjdXRhYmxlc0luUGF0aChcbiAgICAgIHRoaXMuZW52aXJvbm1lbnQoKVt0aGlzLnBhdGhLZXldLFxuICAgICAgdGhpcy5nb0V4ZWN1dGFibGVzXG4gICAgKVxuICB9XG5cbiAgZGVmYXVsdExvY2F0b3IoKSB7XG4gICAgY29uc3QgaW5zdGFsbFBhdGhzOiBBcnJheTxzdHJpbmc+ID0gW11cbiAgICBpZiAob3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJykge1xuICAgICAgLypcbiAgICAgIGM6XFxnb1xcYmluID0gQmluYXJ5IERpc3RyaWJ1dGlvblxuICAgICAgYzpcXHRvb2xzXFxnb1xcYmluID0gQ2hvY29sYXRleVxuICAgICAgKi9cbiAgICAgIGluc3RhbGxQYXRocy5wdXNoKHBhdGguam9pbignYzonLCAnZ28nLCAnYmluJykpXG4gICAgICBpbnN0YWxsUGF0aHMucHVzaChwYXRoLmpvaW4oJ2M6JywgJ3Rvb2xzJywgJ2dvJywgJ2JpbicpKVxuICAgIH0gZWxzZSB7XG4gICAgICAvKlxuICAgICAgL3Vzci9sb2NhbC9nby9iaW4gPSBCaW5hcnkgRGlzdHJpYnV0aW9uXG4gICAgICAvdXNyL2xvY2FsL2JpbiA9IEhvbWVicmV3XG4gICAgICAqL1xuICAgICAgaW5zdGFsbFBhdGhzLnB1c2gocGF0aC5qb2luKCcvJywgJ3VzcicsICdsb2NhbCcsICdnbycsICdiaW4nKSlcbiAgICAgIGluc3RhbGxQYXRocy5wdXNoKHBhdGguam9pbignLycsICd1c3InLCAnbG9jYWwnLCAnYmluJykpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmRFeGVjdXRhYmxlc0luUGF0aChcbiAgICAgIGluc3RhbGxQYXRocy5qb2luKHBhdGguZGVsaW1pdGVyKSxcbiAgICAgIHRoaXMuZ29FeGVjdXRhYmxlc1xuICAgIClcbiAgfVxuXG4gIGZpbmRFeGVjdXRhYmxlc0luUGF0aChcbiAgICBwYXRoVmFsdWU6ID9zdHJpbmcsXG4gICAgZXhlY3V0YWJsZXM6IEFycmF5PHN0cmluZz5cbiAgKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IFtdXG4gICAgaWYgKFxuICAgICAgIXBhdGhWYWx1ZSB8fFxuICAgICAgcGF0aFZhbHVlLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHxcbiAgICAgIHBhdGhWYWx1ZS50cmltKCkgPT09ICcnXG4gICAgKSB7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlc1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFleGVjdXRhYmxlcyB8fFxuICAgICAgZXhlY3V0YWJsZXMuY29uc3RydWN0b3IgIT09IEFycmF5IHx8XG4gICAgICBleGVjdXRhYmxlcy5sZW5ndGggPCAxXG4gICAgKSB7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlc1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnRzID0gcGF0aGhlbHBlclxuICAgICAgLmV4cGFuZCh0aGlzLmVudmlyb25tZW50KCksIHBhdGhWYWx1ZSlcbiAgICAgIC5zcGxpdChwYXRoLmRlbGltaXRlcilcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGZvciAoY29uc3QgZXhlY3V0YWJsZSBvZiBleGVjdXRhYmxlcykge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBwYXRoLmpvaW4oZWxlbWVudCwgZXhlY3V0YWJsZSlcbiAgICAgICAgY29uc3Qgc3RhdCA9IHRoaXMuc3RhdGlzaFN5bmMoY2FuZGlkYXRlKVxuICAgICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRmlsZSgpICYmIHN0YXQuc2l6ZSA+IDApIHtcbiAgICAgICAgICBjYW5kaWRhdGVzLnB1c2goY2FuZGlkYXRlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGVzXG4gIH1cblxuICAvLyBJbnRlcm5hbDogR2V0IGEgY29weSBvZiB0aGUgZW52aXJvbm1lbnQsIHdpdGggdGhlIEdPUEFUSCBjb3JyZWN0bHkgc2V0LlxuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoZXJlIHRoZSBrZXkgaXMgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlIG5hbWUgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUuXG4gIGVudmlyb25tZW50KCkge1xuICAgIHJldHVybiBnZXRlbnZpcm9ubWVudCgpXG4gIH1cblxuICByYXdFbnZpcm9ubWVudCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpXG4gIH1cblxuICAvLyBJbnRlcm5hbDogU2V0IHRoZSBzdHJhdGVneSBmb3IgZmluZGluZyBrbm93biBvciBidWlsdC1pbiB0b29scy5cbiAgLy8gUmV0dXJucyBhIG1hcCB3aGVyZSB0aGUga2V5IGlzIHRoZSB0b29sIG5hbWUgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgc3RyYXRlZ3kuXG4gIHNldEtub3duVG9vbFN0cmF0ZWdpZXMoKSB7XG4gICAgdGhpcy50b29sU3RyYXRlZ2llcyA9IG5ldyBNYXAoKVxuXG4gICAgLy8gQnVpbHQtSW4gVG9vbHNcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZ28nLCAnR09ST09UQklOJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZ29mbXQnLCAnR09ST09UQklOJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZ29kb2MnLCAnR09ST09UQklOJylcblxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdhZGRyMmxpbmUnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnYXBpJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2FzbScsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdidWlsZGlkJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2NnbycsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdjb21waWxlJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2NvdmVyJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2Rpc3QnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZG9jJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2ZpeCcsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdsaW5rJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ25tJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ29iamR1bXAnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgncGFjaycsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdwcHJvZicsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCd0ZXN0Mmpzb24nLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgndHJhY2UnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgndmV0JywgJ0dPVE9PTERJUicpXG5cbiAgICAvLyBFeHRlcm5hbCBUb29sc1xuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdnaXQnLCAnUEFUSCcpXG5cbiAgICAvLyBPdGhlciBUb29scyBBcmUgQXNzdW1lZCBUbyBCZSBJbiBQQVRIIG9yIEdPQklOIG9yIEdPUEFUSC9iaW5cbiAgfVxuXG4gIC8vIEludGVybmFsOiBIYW5kbGUgdGhlIHNwZWNpZmllZCBlcnJvciwgaWYgbmVlZGVkLlxuICBoYW5kbGVFcnJvcihlcnI6IGFueSkge1xuICAgIGlmIChlcnIuaGFuZGxlKSB7XG4gICAgICBlcnIuaGFuZGxlKClcbiAgICB9XG4gIH1cblxuICAvLyBJbnRlcm5hbDogVHJ5IHRvIGZpbmQgYSB0b29sIHdpdGggdGhlIGRlZmF1bHQgc3RyYXRlZ3kgKEdPUEFUSC9iaW4sIHRoZW4gUEFUSCkuXG4gIC8vIFJldHVybnMgdGhlIHBhdGggdG8gdGhlIHRvb2wsIG9yIGZhbHNlIGlmIGl0IGNhbm5vdCBiZSBmb3VuZC5cbiAgZmluZFRvb2xXaXRoRGVmYXVsdFN0cmF0ZWd5KG5hbWU6IHN0cmluZyk6IEZpbmRSZXN1bHQge1xuICAgIC8vIERlZmF1bHQgU3RyYXRlZ3kgSXM6IExvb2sgRm9yIFRoZSBUb29sIEluIEdPUEFUSCwgVGhlbiBMb29rIEluIFBBVEhcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5maW5kVG9vbEluRGVsaW1pdGVkRW52aXJvbm1lbnRWYXJpYWJsZShuYW1lLCAnR09QQVRIJykgfHxcbiAgICAgIHRoaXMuZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUobmFtZSwgdGhpcy5wYXRoS2V5KVxuICAgIClcbiAgfVxuXG4gIC8vIEludGVybmFsOiBUcnkgdG8gZmluZCBhIHRvb2wgaW4gYSBkZWxpbWl0ZWQgZW52aXJvbm1lbnQgdmFyaWFibGUgKGUuZy4gUEFUSCkuXG4gIC8vIFJldHVybnMgdGhlIHBhdGggdG8gdGhlIHRvb2wsIG9yIGZhbHNlIGlmIGl0IGNhbm5vdCBiZSBmb3VuZC5cbiAgZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUoXG4gICAgdG9vbE5hbWU6IHN0cmluZyxcbiAgICBrZXk6IHN0cmluZ1xuICApOiBGaW5kUmVzdWx0IHtcbiAgICBpZiAoXG4gICAgICAhdG9vbE5hbWUgfHxcbiAgICAgIHRvb2xOYW1lLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHxcbiAgICAgIHRvb2xOYW1lLnRyaW0oKSA9PT0gJydcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHAgPSB0aGlzLmVudmlyb25tZW50KClba2V5XVxuICAgIGlmICghcCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudHMgPSBwLnNwbGl0KHBhdGguZGVsaW1pdGVyKVxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgbGV0IGl0ZW0gPSAnJ1xuICAgICAgaWYgKGtleSA9PT0gJ0dPUEFUSCcpIHtcbiAgICAgICAgaXRlbSA9IHBhdGguam9pbihlbGVtZW50LCAnYmluJywgdG9vbE5hbWUgKyB0aGlzLmV4ZWN1dGFibGVTdWZmaXgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtID0gcGF0aC5qb2luKGVsZW1lbnQsIHRvb2xOYW1lICsgdGhpcy5leGVjdXRhYmxlU3VmZml4KVxuICAgICAgfVxuXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhpdGVtKSkge1xuICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoaXRlbSlcbiAgICAgICAgaWYgKHN0YXQgJiYgc3RhdC5pc0ZpbGUoKSAmJiBzdGF0LnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCB7IExvY2F0b3IgfVxuIl19