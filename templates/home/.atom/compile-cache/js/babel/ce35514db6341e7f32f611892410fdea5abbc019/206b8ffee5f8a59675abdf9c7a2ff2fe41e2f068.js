Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _atom = require('atom');

var _utils = require('./../utils');

var _guruUtils = require('./../guru-utils');

var Implements = (function () {
  function Implements(goconfig) {
    var _this = this;

    _classCallCheck(this, Implements);

    this.goconfig = goconfig;

    this.key = 'implements';
    this.tab = {
      key: 'implements',
      name: 'Implements',
      packageName: 'go-plus',
      icon: 'tasklist',
      order: 450,
      suppressPadding: true
    };

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'golang:implements': function golangImplements() {
        _this.handleCommand();
      }
    }));
  }

  _createClass(Implements, [{
    key: 'handleCommand',
    value: function handleCommand() {
      if (!this.goconfig || !this.goconfig.locator || !this.goconfig.executor) {
        return;
      }
      var editor = (0, _utils.getEditor)();
      if (!editor) {
        return;
      }
      var args = (0, _guruUtils.computeArgs)('implements', null, editor);
      if (args && args.length) {
        return this.runGuru(args);
      }
    }
  }, {
    key: 'runGuru',
    value: _asyncToGenerator(function* (args) {
      var _this2 = this;

      var options = {};
      options.timeout = 20000;
      var archive = (0, _guruUtils.buildGuruArchive)();
      if (archive && archive.length) {
        options.input = archive;
        args.unshift('-modified');
      }
      if (this.requestFocus) {
        yield this.requestFocus();
      }
      if (this.view) {
        this.view.update('running guru ' + args.join(' '));
      }
      var cmd = yield this.goconfig.locator.findTool('guru');
      if (!cmd) {
        return false;
      }
      var r = yield this.goconfig.executor.exec(cmd, args, options);
      if (!r) {
        return false;
      }

      var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
      if (r.error || r.exitcode !== 0 || stderr && stderr.trim() !== '') {
        if (this.view) {
          if (r.exitcode === 124) {
            this.view.update('guru failed: operation timed out after ' + options.timeout + ' ms');
          } else {
            this.view.update('guru failed' + _os2['default'].EOL + _os2['default'].EOL + stderr.trim());
          }
        }
        return false;
      }
      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      var obj = JSON.parse(stdout);
      if (obj && this.requestFocus) {
        this.requestFocus().then(function () {
          if (_this2.view) {
            _this2.view.update(obj);
          }
          return;
        })['catch'](function (e) {
          return console.log(e);
        }); // eslint-disable-line no-console
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
    }
  }]);

  return Implements;
})();

exports.Implements = Implements;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2ltcGxlbWVudHMvaW1wbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDaUIsTUFBTTs7cUJBQ2hCLFlBQVk7O3lCQUNRLGlCQUFpQjs7SUFNekQsVUFBVTtBQVFILFdBUlAsVUFBVSxDQVFGLFFBQWtCLEVBQUU7OzswQkFSNUIsVUFBVTs7QUFTWixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTs7QUFFeEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUE7QUFDdkIsUUFBSSxDQUFDLEdBQUcsR0FBRztBQUNULFNBQUcsRUFBRSxZQUFZO0FBQ2pCLFVBQUksRUFBRSxZQUFZO0FBQ2xCLGlCQUFXLEVBQUUsU0FBUztBQUN0QixVQUFJLEVBQUUsVUFBVTtBQUNoQixXQUFLLEVBQUUsR0FBRztBQUNWLHFCQUFlLEVBQUUsSUFBSTtLQUN0QixDQUFBOztBQUVELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ2xDLHlCQUFtQixFQUFFLDRCQUFNO0FBQ3pCLGNBQUssYUFBYSxFQUFFLENBQUE7T0FDckI7S0FDRixDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQTdCRyxVQUFVOztXQStCRCx5QkFBRztBQUNkLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUN2RSxlQUFNO09BQ1A7QUFDRCxVQUFNLE1BQU0sR0FBRyx1QkFBVyxDQUFBO0FBQzFCLFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxlQUFNO09BQ1A7QUFDRCxVQUFNLElB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QUM5QjtLQUNGOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQzdCO0tBQ0Y7OztTQXJHRyxVQUFVOzs7UUF3R1AsVUFBVSxHQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvaW1wbGVtZW50cy9pbXBsZW1lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBnZXRFZGl0b3IgfSBmcm9tICcuLy4uL3V0aWxzJ1xuaW1wb3J0IHsgYnVpbGRHdXJ1QXJjaGl2ZSwgY29tcHV0ZUFyZ3MgfSBmcm9tICcuLy4uL2d1cnUtdXRpbHMnXG5cbmltcG9ydCB0eXBlIHsgSW1wbGVtZW50c1ZpZXcgfSBmcm9tICcuL2ltcGxlbWVudHMtdmlldydcbmltcG9ydCB0eXBlIHsgR29Db25maWcgfSBmcm9tICcuLy4uL2NvbmZpZy9zZXJ2aWNlJ1xuaW1wb3J0IHR5cGUgeyBQYW5lbE1vZGVsLCBUYWIgfSBmcm9tICcuLy4uL3BhbmVsL3RhYidcblxuY2xhc3MgSW1wbGVtZW50cyBpbXBsZW1lbnRzIFBhbmVsTW9kZWwge1xuICBrZXk6IHN0cmluZ1xuICB0YWI6IFRhYlxuICBnb2NvbmZpZzogR29Db25maWdcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICByZXF1ZXN0Rm9jdXM6ID8oKSA9PiBQcm9taXNlPHZvaWQ+XG4gIHZpZXc6IEltcGxlbWVudHNWaWV3XG5cbiAgY29uc3RydWN0b3IoZ29jb25maWc6IEdvQ29uZmlnKSB7XG4gICAgdGhpcy5nb2NvbmZpZyA9IGdvY29uZmlnXG5cbiAgICB0aGlzLmtleSA9ICdpbXBsZW1lbnRzJ1xuICAgIHRoaXMudGFiID0ge1xuICAgICAga2V5OiAnaW1wbGVtZW50cycsXG4gICAgICBuYW1lOiAnSW1wbGVtZW50cycsXG4gICAgICBwYWNrYWdlTmFtZTogJ2dvLXBsdXMnLFxuICAgICAgaWNvbjogJ3Rhc2tsaXN0JyxcbiAgICAgIG9yZGVyOiA0NTAsXG4gICAgICBzdXBwcmVzc1BhZGRpbmc6IHRydWVcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICAgJ2dvbGFuZzppbXBsZW1lbnRzJzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlQ29tbWFuZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgaGFuZGxlQ29tbWFuZCgpIHtcbiAgICBpZiAoIXRoaXMuZ29jb25maWcgfHwgIXRoaXMuZ29jb25maWcubG9jYXRvciB8fCAhdGhpcy5nb2NvbmZpZy5leGVjdXRvcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGVkaXRvciA9IGdldEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBhcmdzID0gY29tcHV0ZUFyZ3MoJ2ltcGxlbWVudHMnLCBudWxsLCBlZGl0b3IpXG4gICAgaWYgKGFyZ3MgJiYgYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkd1cnUoYXJncylcbiAgICB9XG4gIH1cblxuICBhc3luYyBydW5HdXJ1KGFyZ3M6IEFycmF5PHN0cmluZz4pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge31cbiAgICBvcHRpb25zLnRpbWVvdXQgPSAyMDAwMFxuICAgIGNvbnN0IGFyY2hpdmUgPSBidWlsZEd1cnVBcmNoaXZlKClcbiAgICBpZiAoYXJjaGl2ZSAmJiBhcmNoaXZlLmxlbmd0aCkge1xuICAgICAgb3B0aW9ucy5pbnB1dCA9IGFyY2hpdmVcbiAgICAgIGFyZ3MudW5zaGlmdCgnLW1vZGlmaWVkJylcbiAgICB9XG4gICAgaWYgKHRoaXMucmVxdWVzdEZvY3VzKSB7XG4gICAgICBhd2FpdCB0aGlzLnJlcXVlc3RGb2N1cygpXG4gICAgfVxuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldy51cGRhdGUoJ3J1bm5pbmcgZ3VydSAnICsgYXJncy5qb2luKCcgJykpXG4gICAgfVxuICAgIGNvbnN0IGNtZCA9IGF3YWl0IHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCgnZ3VydScpXG4gICAgaWYgKCFjbWQpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCByID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywgb3B0aW9ucylcbiAgICBpZiAoIXIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHN0ZGVycjogc3RyaW5nID1cbiAgICAgIHIuc3RkZXJyIGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRlcnIudG9TdHJpbmcoKSA6IHIuc3RkZXJyXG4gICAgaWYgKHIuZXJyb3IgfHwgci5leGl0Y29kZSAhPT0gMCB8fCAoc3RkZXJyICYmIHN0ZGVyci50cmltKCkgIT09ICcnKSkge1xuICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICBpZiAoci5leGl0Y29kZSA9PT0gMTI0KSB7XG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZShcbiAgICAgICAgICAgIGBndXJ1IGZhaWxlZDogb3BlcmF0aW9uIHRpbWVkIG91dCBhZnRlciAke29wdGlvbnMudGltZW91dH0gbXNgXG4gICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudmlldy51cGRhdGUoJ2d1cnUgZmFpbGVkJyArIG9zLkVPTCArIG9zLkVPTCArIHN0ZGVyci50cmltKCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBzdGRvdXQ6IHN0cmluZyA9XG4gICAgICByLnN0ZG91dCBpbnN0YW5jZW9mIEJ1ZmZlciA/IHIuc3Rkb3V0LnRvU3RyaW5nKCkgOiByLnN0ZG91dFxuICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2Uoc3Rkb3V0KVxuICAgIGlmIChvYmogJiYgdGhpcy5yZXF1ZXN0Rm9jdXMpIHtcbiAgICAgIHRoaXMucmVxdWVzdEZvY3VzKClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy51cGRhdGUob2JqKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBJbXBsZW1lbnRzIH1cbiJdfQ==