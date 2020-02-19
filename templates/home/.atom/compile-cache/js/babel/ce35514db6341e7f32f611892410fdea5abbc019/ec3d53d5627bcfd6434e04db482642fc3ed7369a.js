Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var Formatter = (function () {
  function Formatter(goconfig) {
    var _this = this;

    _classCallCheck(this, Formatter);

    this.priority = 2;
    this.grammarScopes = ['source.go', 'go'];

    this.goconfig = goconfig;
    this.subscriptions = new _atom.CompositeDisposable();
    this.updatingFormatterCache = false;
    atom.project.onDidChangePaths(function () {
      return _this.updateFormatterCache();
    });
    this.observeConfig();
    this.updateFormatterCache();
  }

  _createClass(Formatter, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      if (this.formatterCache) {
        this.formatterCache.clear();
      }
    }
  }, {
    key: 'formatEntireFile',
    value: _asyncToGenerator(function* (editor, range // eslint-disable-line no-unused-vars
    ) {
      var tool = this.tool;
      var cmd = this.cachedToolPath(tool);
      if (!cmd) {
        yield this.updateFormatterCache();
        cmd = this.cachedToolPath(tool);
      }
      if (!cmd) {
        console.log('skipping format, could not find tool', tool); // eslint-disable-line no-console
        return null;
      }
      var options = this.goconfig.executor.getOptions('project', editor);
      options.input = editor.getText();
      var args = [];
      if (tool === 'goimports') {
        var p = editor.getPath();
        if (p) {
          args.push('--srcdir');
          args.push(_path2['default'].dirname(p));
        }
      }
      var r = yield this.goconfig.executor.exec(cmd, args, options);
      if (r.exitcode !== 0) return null;
      var out = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      return { formatted: out };
    })
  }, {
    key: 'observeConfig',
    value: function observeConfig() {
      var _this2 = this;

      this.subscriptions.add(atom.config.observe('go-plus.format.tool', function (formatTool) {
        _this2.tool = formatTool;
        _this2.updateFormatterCache();
      }));
    }
  }, {
    key: 'resetFormatterCache',
    value: function resetFormatterCache() {
      this.formatterCache.clear();
    }
  }, {
    key: 'updateFormatterCache',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      if (this.updatingFormatterCache) {
        return Promise.resolve(false);
      }
      this.updatingFormatterCache = true;

      if (!this.goconfig) {
        this.updatingFormatterCache = false;
        return Promise.resolve(false);
      }

      var cache = new Map();
      var paths = atom.project.getPaths();
      var promises = [];
      for (var p of paths) {
        if (p && p.includes('://')) {
          continue;
        }

        var _loop = function (tool) {
          var key = tool + ':' + p;
          if (!p) {
            key = tool;
          }

          promises.push(_this3.goconfig.locator.findTool(tool).then(function (cmd) {
            if (cmd) {
              cache.set(key, cmd);
              return cmd;
            }
            return false;
          }));
        };

        for (var tool of ['gofmt', 'goimports', 'goreturns']) {
          _loop(tool);
        }
      }

      try {
        yield Promise.all(promises);
        this.formatterCache = cache;
        this.updatingFormatterCache = false;
        return this.formatterCache;
      } catch (e) {
        if (e.handle) {
          e.handle();
        }
        console.log(e); // eslint-disable-line no-console
        this.updatingFormatterCache = false;
      }
    })
  }, {
    key: 'cachedToolPath',
    value: function cachedToolPath(toolName) {
      if (!this.formatterCache || !toolName) {
        return false;
      }

      var p = (0, _utils.projectPath)();
      if (p) {
        var key = toolName + ':' + p;
        var cmd = this.formatterCache.get(key);
        if (cmd) {
          return cmd;
        }
      }

      return this.formatterCache.get(toolName) || false;
    }
  }]);

  return Formatter;
})();

exports.Formatter = Formatter;
// 'gofmt' 'goimports', 'goreturns'
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2Zvcm1hdC9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVvQyxNQUFNOztvQkFDekIsTUFBTTs7OztxQkFDSyxVQUFVOztJQUloQyxTQUFTO0FBU0YsV0FUUCxTQUFTLENBU0QsUUFBa0IsRUFBRTs7OzBCQVQ1QixTQUFTOztTQU1iLFFBQVEsR0FBVyxDQUFDO1NBQ3BCLGFBQWEsR0FBa0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDOztBQUdoRCxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUE7QUFDbkMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzthQUFNLE1BQUssb0JBQW9CLEVBQUU7S0FBQSxDQUFDLENBQUE7QUFDaEUsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0dBQzVCOztlQWhCRyxTQUFTOztXQWtCTixtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQzdCO0FBQ0QsVUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7T0FDNUI7S0FDRjs7OzZCQUVxQixXQUNwQixNQUF1QixFQUN2QixLQUFpQjtNQUloQjtBQUNELFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDdEIsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQyxVQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsY0FBTSxJQUFJLENB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RUFBRTtBQUNQLGlCQUFPLEdBQUcsQ0FBQTtTQUNYO09BQ0Y7O0FBRUQsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUE7S0FDbEQ7OztTQTFJRyxTQUFTOzs7UUE0SU4sU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZm9ybWF0L2Zvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHByb2plY3RQYXRoIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmltcG9ydCB0eXBlIHsgR29Db25maWcgfSBmcm9tICcuLy4uL2NvbmZpZy9zZXJ2aWNlJ1xuXG5jbGFzcyBGb3JtYXR0ZXIge1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGdvY29uZmlnOiBHb0NvbmZpZ1xuICB0b29sOiBzdHJpbmcgLy8gJ2dvZm10JyAnZ29pbXBvcnRzJywgJ2dvcmV0dXJucydcbiAgZm9ybWF0dGVyQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz5cbiAgdXBkYXRpbmdGb3JtYXR0ZXJDYWNoZTogYm9vbGVhblxuICBwcmlvcml0eTogbnVtYmVyID0gMlxuICBncmFtbWFyU2NvcGVzOiBBcnJheTxzdHJpbmc+ID0gWydzb3VyY2UuZ28nLCAnZ28nXVxuXG4gIGNvbnN0cnVjdG9yKGdvY29uZmlnOiBHb0NvbmZpZykge1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnVwZGF0aW5nRm9ybWF0dGVyQ2FjaGUgPSBmYWxzZVxuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHRoaXMudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKSlcbiAgICB0aGlzLm9ic2VydmVDb25maWcoKVxuICAgIHRoaXMudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIGlmICh0aGlzLmZvcm1hdHRlckNhY2hlKSB7XG4gICAgICB0aGlzLmZvcm1hdHRlckNhY2hlLmNsZWFyKClcbiAgICB9XG4gIH1cblxuICBhc3luYyBmb3JtYXRFbnRpcmVGaWxlKFxuICAgIGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLFxuICAgIHJhbmdlOiBhdG9tJFJhbmdlIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgKTogUHJvbWlzZTw/e1xuICAgIG5ld0N1cnNvcj86IG51bWJlcixcbiAgICBmb3JtYXR0ZWQ6IHN0cmluZ1xuICB9PiB7XG4gICAgY29uc3QgdG9vbCA9IHRoaXMudG9vbFxuICAgIGxldCBjbWQgPSB0aGlzLmNhY2hlZFRvb2xQYXRoKHRvb2wpXG4gICAgaWYgKCFjbWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKVxuICAgICAgY21kID0gdGhpcy5jYWNoZWRUb29sUGF0aCh0b29sKVxuICAgIH1cbiAgICBpZiAoIWNtZCkge1xuICAgICAgY29uc29sZS5sb2coJ3NraXBwaW5nIGZvcm1hdCwgY291bGQgbm90IGZpbmQgdG9vbCcsIHRvb2wpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ29jb25maWcuZXhlY3V0b3IuZ2V0T3B0aW9ucygncHJvamVjdCcsIGVkaXRvcilcbiAgICBvcHRpb25zLmlucHV0ID0gZWRpdG9yLmdldFRleHQoKVxuICAgIGNvbnN0IGFyZ3MgPSBbXVxuICAgIGlmICh0b29sID09PSAnZ29pbXBvcnRzJykge1xuICAgICAgY29uc3QgcCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIGlmIChwKSB7XG4gICAgICAgIGFyZ3MucHVzaCgnLS1zcmNkaXInKVxuICAgICAgICBhcmdzLnB1c2gocGF0aC5kaXJuYW1lKHApKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywgb3B0aW9ucylcbiAgICBpZiAoci5leGl0Y29kZSAhPT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCBvdXQgPSByLnN0ZG91dCBpbnN0YW5jZW9mIEJ1ZmZlciA/IHIuc3Rkb3V0LnRvU3RyaW5nKCkgOiByLnN0ZG91dFxuICAgIHJldHVybiB7IGZvcm1hdHRlZDogb3V0IH1cbiAgfVxuXG4gIG9ic2VydmVDb25maWcoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2dvLXBsdXMuZm9ybWF0LnRvb2wnLCBmb3JtYXRUb29sID0+IHtcbiAgICAgICAgdGhpcy50b29sID0gZm9ybWF0VG9vbFxuICAgICAgICB0aGlzLnVwZGF0ZUZvcm1hdHRlckNhY2hlKClcbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgcmVzZXRGb3JtYXR0ZXJDYWNoZSgpIHtcbiAgICB0aGlzLmZvcm1hdHRlckNhY2hlLmNsZWFyKClcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUZvcm1hdHRlckNhY2hlKCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG4gICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gdHJ1ZVxuXG4gICAgaWYgKCF0aGlzLmdvY29uZmlnKSB7XG4gICAgICB0aGlzLnVwZGF0aW5nRm9ybWF0dGVyQ2FjaGUgPSBmYWxzZVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICBjb25zdCBjYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKVxuICAgIGNvbnN0IHBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgZm9yIChjb25zdCBwIG9mIHBhdGhzKSB7XG4gICAgICBpZiAocCAmJiBwLmluY2x1ZGVzKCc6Ly8nKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCB0b29sIG9mIFsnZ29mbXQnLCAnZ29pbXBvcnRzJywgJ2dvcmV0dXJucyddKSB7XG4gICAgICAgIGxldCBrZXkgPSB0b29sICsgJzonICsgcFxuICAgICAgICBpZiAoIXApIHtcbiAgICAgICAgICBrZXkgPSB0b29sXG4gICAgICAgIH1cblxuICAgICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICAgIHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCh0b29sKS50aGVuKGNtZCA9PiB7XG4gICAgICAgICAgICBpZiAoY21kKSB7XG4gICAgICAgICAgICAgIGNhY2hlLnNldChrZXksIGNtZClcbiAgICAgICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgIHRoaXMuZm9ybWF0dGVyQ2FjaGUgPSBjYWNoZVxuICAgICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gZmFsc2VcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdHRlckNhY2hlXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuaGFuZGxlKSB7XG4gICAgICAgIGUuaGFuZGxlKClcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGUpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBjYWNoZWRUb29sUGF0aCh0b29sTmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1hdHRlckNhY2hlIHx8ICF0b29sTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgcCA9IHByb2plY3RQYXRoKClcbiAgICBpZiAocCkge1xuICAgICAgY29uc3Qga2V5ID0gdG9vbE5hbWUgKyAnOicgKyBwXG4gICAgICBjb25zdCBjbWQgPSB0aGlzLmZvcm1hdHRlckNhY2hlLmdldChrZXkpXG4gICAgICBpZiAoY21kKSB7XG4gICAgICAgIHJldHVybiBjbWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3JtYXR0ZXJDYWNoZS5nZXQodG9vbE5hbWUpIHx8IGZhbHNlXG4gIH1cbn1cbmV4cG9ydCB7IEZvcm1hdHRlciB9XG4iXX0=