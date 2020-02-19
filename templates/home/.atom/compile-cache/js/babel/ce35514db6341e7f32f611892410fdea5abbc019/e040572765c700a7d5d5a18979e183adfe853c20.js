Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _delveVariables = require('./delve-variables');

var DelveVariables = _interopRequireWildcard(_delveVariables);

'use babel';

var RPC_ENDPOINT = 'RPCServer.';
var breakpointProps = ['id', 'name', 'file', 'line', 'cond'];

// note: mimic the "full" flag in the "Stacktrace" call
var defaultVariableCfg = {
  followPointers: true,
  maxVariableRecurse: 1,
  maxStringLen: 64,
  maxArrayValues: 64,
  maxStructFields: -1
};

var VariableShadowed = 2;

var DelveSession = (function () {
  function DelveSession(process, connection, mode) {
    _classCallCheck(this, DelveSession);

    this._process = process;
    this._connection = connection;
    this._mode = mode;
  }

  _createClass(DelveSession, [{
    key: 'stop',
    value: function stop(requiresHalt) {
      var _this = this;

      if (!this._connection) {
        return Promise.resolve();
      }
      if (this._stopPromise) {
        return this._stopPromise;
      }

      var id = undefined;
      var kill = function kill() {
        clearTimeout(id);
        if (_this._connection) {
          _this._connection.end();
        }
        _this._connection = null;
        if (_this._process) {
          _this._process.kill();
        }
        _this._process = null;
        _this._stopPromise = null;
      };

      var prom = undefined;
      if (this._mode === 'attach') {
        prom = this._call('Detach', { kill: false });
      } else {
        prom = Promise.resolve();
        if (requiresHalt) {
          prom = this.halt();
        }
        prom.then(function () {
          return _this._call('Detach', { kill: true });
        });
      }

      var timeoutProm = new Promise(function (resolve, reject) {
        id = setTimeout(function () {
          resolve();
        }, 5000);
      });

      this._stopPromise = Promise.race([prom, timeoutProm]).then(kill)['catch'](kill);
      return this._stopPromise;
    }
  }, {
    key: 'addBreakpoint',
    value: function addBreakpoint(_ref) {
      var bp = _ref.bp;

      // only keep those props that delve knows
      var breakpoint = breakpointProps.reduce(function (o, prop) {
        o[prop] = bp[prop];
        if (prop === 'line') {
          o.line++; // note: delve = 1 indexed line numbers / atom = 0 indexed line numbers
        }
        return o;
      }, {});

      return this._call('CreateBreakpoint', { breakpoint: breakpoint }).then(function (_ref2) {
        var Breakpoint = _ref2.Breakpoint;

        return { id: Breakpoint.id };
      });
    }
  }, {
    key: 'removeBreakpoint',
    value: function removeBreakpoint(_ref3) {
      var id = _ref3.id;

      return this._call('ClearBreakpoint', { id: id });
    }
  }, {
    key: 'editBreakpoint',
    value: function editBreakpoint(_ref4) {
      var bp = _ref4.bp;

      return this._call('AmendBreakpoint', { breakpoint: bp });
    }
  }, {
    key: 'resume',
    value: function resume() {
      return this._command('continue');
    }
  }, {
    key: 'next',
    value: function next() {
      return this._command('next');
    }
  }, {
    key: 'stepIn',
    value: function stepIn() {
      return this._command('step');
    }
  }, {
    key: 'stepOut',
    value: function stepOut() {
      return this._command('stepOut');
    }
  }, {
    key: 'halt',
    value: function halt(stopping) {
      return this._command('halt');
    }

    // _command executes the given command (like continue, step, next, ...)
  }, {
    key: '_command',
    value: function _command(name) {
      var _this2 = this;

      return this._call('Command', { name: name }).then(function (_ref5) {
        var State = _ref5.State;

        // stopping a running program which is not halted at the moment
        // (so waiting for further debug commands like 'continue' or 'step')
        // ends up here too, so simply return that it already has stopped
        return _this2._stateToDebuggerState(State);
      })['catch'](function (err) {
        return _this2.getState().then(function (state) {
          state.error = err;
          return state;
        });
      });
    }
  }, {
    key: 'getState',
    value: function getState() {
      var _this3 = this;

      return this._call('State', {}).then(function (_ref6) {
        var State = _ref6.State;

        return _this3._stateToDebuggerState(State);
      });
    }
  }, {
    key: '_stateToDebuggerState',
    value: function _stateToDebuggerState(state, error) {
      var exited = this._stopPromise ? true : !!state.exited;
      var goroutineID = -1;
      if (!exited) {
        goroutineID = state.currentGoroutine && state.currentGoroutine.id || -1;
        if (goroutineID === -1) {
          goroutineID = state.currentThread && state.currentThread.goroutineID || -1;
        }
      }
      return {
        exited: exited,
        goroutineID: goroutineID
      };
    }

    // restart the delve session
  }, {
    key: 'restart',
    value: function restart() {
      return this._call('Restart');
    }
  }, {
    key: 'selectStacktrace',
    value: function selectStacktrace(_ref7) {
      var index = _ref7.index;

      void index; // nothing special to do here ...
      return Promise.resolve();
    }
  }, {
    key: 'getStacktrace',
    value: function getStacktrace(_ref8) {
      var goroutineID = _ref8.goroutineID;

      if (goroutineID === -1) {
        return Promise.resolve([]);
      }

      var args = {
        id: goroutineID,
        depth: 20
      };
      return this._call('Stacktrace', args).then(this._prepareStacktrace.bind(this));
    }
  }, {
    key: '_prepareStacktrace',
    value: function _prepareStacktrace(_ref9) {
      var stacktrace = _ref9.Locations;

      return stacktrace.map(function (stack) {
        return {
          id: stack.pc,
          file: stack.file,
          line: stack.line - 1, // delve = 1 indexed line / atom = 0 indexed line
          func: stack['function'].name.split('/').pop()
        };
      });
    }
  }, {
    key: 'selectGoroutine',
    value: function selectGoroutine(_ref10) {
      var id = _ref10.id;

      return this._call('Command', { name: 'switchGoroutine', goroutineID: id });
    }
  }, {
    key: 'getGoroutines',
    value: function getGoroutines() {
      return this._call('ListGoroutines').then(this._prepareGoroutines.bind(this));
    }
  }, {
    key: '_prepareGoroutines',
    value: function _prepareGoroutines(_ref11) {
      var goroutines = _ref11.Goroutines;

      return goroutines.map(function (_ref12) {
        var id = _ref12.id;
        var userCurrentLoc = _ref12.userCurrentLoc;
        var goStatementLoc = _ref12.goStatementLoc;

        var loc = userCurrentLoc.file ? userCurrentLoc : goStatementLoc;
        return {
          id: id,
          file: loc.file,
          line: loc.line - 1, // dlv = 1 indexed line / atom = 0 indexed line
          func: loc['function'].name.split('/').pop()
        };
      });
    }
  }, {
    key: 'getVariables',
    value: function getVariables(scope) {
      var cfg = arguments.length <= 1 || arguments[1] === undefined ? defaultVariableCfg : arguments[1];

      return Promise.all([this._getLocalVariables(scope, cfg), this._getFunctionArguments(scope, cfg)]).then(function (_ref13) {
        var _ref132 = _slicedToArray(_ref13, 2);

        var locals = _ref132[0];
        var args = _ref132[1];

        // note: workaround for github.com/derekparker/delve/issues/951
        // check the args if they contain variables that also exist in
        // the local variables. if so mark them as shadowed (flag & 2)
        args.forEach(function (arg) {
          if (locals.find(function (local) {
            return local.name === arg.name;
          })) {
            arg.flag |= 2;
          }
        });
        var vars = locals.concat(args)
        // variable is shadowed by another one, skip it
        .filter(function (v) {
          return (v.flag & VariableShadowed) === 0;
        });
        return DelveVariables.create(vars);
      });
    }
  }, {
    key: '_getLocalVariables',
    value: function _getLocalVariables(scope, cfg) {
      return this._call('ListLocalVars', { scope: scope, cfg: cfg }).then(function (o) {
        return o.Variables;
      });
    }
  }, {
    key: '_getFunctionArguments',
    value: function _getFunctionArguments(scope, cfg) {
      return this._call('ListFunctionArgs', { scope: scope, cfg: cfg }).then(function (o) {
        return o.Args;
      });
    }
  }, {
    key: 'evaluate',
    value: function evaluate(_ref14) {
      var expr = _ref14.expr;
      var scope = _ref14.scope;

      return this._call('Eval', { expr: expr, scope: scope }).then(function (result) {
        return DelveVariables.create([result.Variable]);
      })['catch'](function (err) {
        return DelveVariables.createError(err, expr);
      });
    }

    // call is the base method for all calls to delve
  }, {
    key: '_call',
    value: function _call(method) {
      var _this4 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        var endpoint = RPC_ENDPOINT + method;
        _this4._connection.call(endpoint, args, function (err, result) {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    }
  }]);

  return DelveSession;
})();

exports['default'] = DelveSession;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS1zZXNzaW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs4QkFFZ0MsbUJBQW1COztJQUF2QyxjQUFjOztBQUYxQixXQUFXLENBQUE7O0FBSVgsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFBO0FBQ2pDLElBQU0sZUFBZSxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBOzs7QUFHOUQsSUFBTSxrQkFBa0IsR0FBRztBQUN6QixnQkFBYyxFQUFFLElBQUk7QUFDcEIsb0JBQWtCLEVBQUUsQ0FBQztBQUNyQixjQUFZLEVBQUUsRUFBRTtBQUNoQixnQkFBYyxFQUFFLEVBQUU7QUFDbEIsaUJBQWUsRUFBRSxDQUFDLENBQUM7Q0FDcEIsQ0FBQTs7QUFFRCxJQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQTs7SUFFTCxZQUFZO0FBQ25CLFdBRE8sWUFBWSxDQUNsQixPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTswQkFEckIsWUFBWTs7QUFFN0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUE7QUFDdkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUE7QUFDN0IsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7R0FDbEI7O2VBTGtCLFlBQVk7O1dBTzFCLGNBQUMsWUFBWSxFQUFFOzs7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsZUFBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDekI7QUFDRCxVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsZUFBTyxJQUFJLENBQUMsWUFBWSxDQUFBO09BQ3pCOztBQUVELFVBQUksRUFBRSxZQUFBLENBQUE7QUFDTixVQUFNLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNqQixvQkFB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SyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFLO0FBQ3JELGNBQUksR0FBRyxFQUFFO0FBQ1Asa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNYLG1CQUFNO1dBQ1A7QUFDRCxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ2hCLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7U0FwT2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS1zZXNzaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgRGVsdmVWYXJpYWJsZXMgZnJvbSAnLi9kZWx2ZS12YXJpYWJsZXMnXG5cbmNvbnN0IFJQQ19FTkRQT0lOVCA9ICdSUENTZXJ2ZXIuJ1xuY29uc3QgYnJlYWtwb2ludFByb3BzID0gWydpZCcsICduYW1lJywgJ2ZpbGUnLCAnbGluZScsICdjb25kJ11cblxuLy8gbm90ZTogbWltaWMgdGhlIFwiZnVsbFwiIGZsYWcgaW4gdGhlIFwiU3RhY2t0cmFjZVwiIGNhbGxcbmNvbnN0IGRlZmF1bHRWYXJpYWJsZUNmZyA9IHtcbiAgZm9sbG93UG9pbnRlcnM6IHRydWUsXG4gIG1heFZhcmlhYmxlUmVjdXJzZTogMSxcbiAgbWF4U3RyaW5nTGVuOiA2NCxcbiAgbWF4QXJyYXlWYWx1ZXM6IDY0LFxuICBtYXhTdHJ1Y3RGaWVsZHM6IC0xXG59XG5cbmNvbnN0IFZhcmlhYmxlU2hhZG93ZWQgPSAyXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlbHZlU2Vzc2lvbiB7XG4gIGNvbnN0cnVjdG9yIChwcm9jZXNzLCBjb25uZWN0aW9uLCBtb2RlKSB7XG4gICAgdGhpcy5fcHJvY2VzcyA9IHByb2Nlc3NcbiAgICB0aGlzLl9jb25uZWN0aW9uID0gY29ubmVjdGlvblxuICAgIHRoaXMuX21vZGUgPSBtb2RlXG4gIH1cblxuICBzdG9wIChyZXF1aXJlc0hhbHQpIHtcbiAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb24pIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cbiAgICBpZiAodGhpcy5fc3RvcFByb21pc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdG9wUHJvbWlzZVxuICAgIH1cblxuICAgIGxldCBpZFxuICAgIGNvbnN0IGtpbGwgPSAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpXG4gICAgICBpZiAodGhpcy5fY29ubmVjdGlvbikge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLmVuZCgpXG4gICAgICB9XG4gICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbFxuICAgICAgaWYgKHRoaXMuX3Byb2Nlc3MpIHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzcy5raWxsKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Byb2Nlc3MgPSBudWxsXG4gICAgICB0aGlzLl9zdG9wUHJvbWlzZSA9IG51bGxcbiAgICB9XG5cbiAgICBsZXQgcHJvbVxuICAgIGlmICh0aGlzLl9tb2RlID09PSAnYXR0YWNoJykge1xuICAgICAgcHJvbSA9IHRoaXMuX2NhbGwoJ0RldGFjaCcsIHsga2lsbDogZmFsc2UgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbSA9IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICBpZiAocmVxdWlyZXNIYWx0KSB7XG4gICAgICAgIHByb20gPSB0aGlzLmhhbHQoKVxuICAgICAgfVxuICAgICAgcHJvbS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGwoJ0RldGFjaCcsIHsga2lsbDogdHJ1ZSB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB0aW1lb3V0UHJvbSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSwgNTAwMClcbiAgICB9KVxuXG4gICAgdGhpcy5fc3RvcFByb21pc2UgPSBQcm9taXNlLnJhY2UoW1xuICAgICAgcHJvbSxcbiAgICAgIHRpbWVvdXRQcm9tXG4gICAgXSkudGhlbihraWxsKS5jYXRjaChraWxsKVxuICAgIHJldHVybiB0aGlzLl9zdG9wUHJvbWlzZVxuICB9XG5cbiAgYWRkQnJlYWtwb2ludCAoeyBicCB9KSB7XG4gICAgLy8gb25seSBrZWVwIHRob3NlIHByb3BzIHRoYXQgZGVsdmUga25vd3NcbiAgICBjb25zdCBicmVha3BvaW50ID0gYnJlYWtwb2ludFByb3BzLnJlZHVjZSgobywgcHJvcCkgPT4ge1xuICAgICAgb1twcm9wXSA9IGJwW3Byb3BdXG4gICAgICBpZiAocHJvcCA9PT0gJ2xpbmUnKSB7XG4gICAgICAgIG8ubGluZSsrIC8vIG5vdGU6IGRlbHZlID0gMSBpbmRleGVkIGxpbmUgbnVtYmVycyAvIGF0b20gPSAwIGluZGV4ZWQgbGluZSBudW1iZXJzXG4gICAgICB9XG4gICAgICByZXR1cm4gb1xuICAgIH0sIHt9KVxuXG4gICAgcmV0dXJuIHRoaXMuX2NhbGwoJ0NyZWF0ZUJyZWFrcG9pbnQnLCB7IGJyZWFrcG9pbnQgfSkudGhlbigoeyBCcmVha3BvaW50IH0pID0+IHtcbiAgICAgIHJldHVybiB7IGlkOiBCcmVha3BvaW50LmlkIH1cbiAgICB9KVxuICB9XG5cbiAgcmVtb3ZlQnJlYWtwb2ludCAoeyBpZCB9KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGwoJ0NsZWFyQnJlYWtwb2ludCcsIHsgaWQgfSlcbiAgfVxuXG4gIGVkaXRCcmVha3BvaW50ICh7IGJwIH0pIHtcbiAgICByZXR1cm4gdGhpcy5fY2FsbCgnQW1lbmRCcmVha3BvaW50JywgeyBicmVha3BvaW50OiBicCB9KVxuICB9XG5cbiAgcmVzdW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbWFuZCgnY29udGludWUnKVxuICB9XG4gIG5leHQgKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tYW5kKCduZXh0JylcbiAgfVxuICBzdGVwSW4gKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tYW5kKCdzdGVwJylcbiAgfVxuICBzdGVwT3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbWFuZCgnc3RlcE91dCcpXG4gIH1cbiAgaGFsdCAoc3RvcHBpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbWFuZCgnaGFsdCcpXG4gIH1cblxuICAgLy8gX2NvbW1hbmQgZXhlY3V0ZXMgdGhlIGdpdmVuIGNvbW1hbmQgKGxpa2UgY29udGludWUsIHN0ZXAsIG5leHQsIC4uLilcbiAgX2NvbW1hbmQgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FsbCgnQ29tbWFuZCcsIHsgbmFtZSB9KS50aGVuKCh7IFN0YXRlIH0pID0+IHtcbiAgICAgIC8vIHN0b3BwaW5nIGEgcnVubmluZyBwcm9ncmFtIHdoaWNoIGlzIG5vdCBoYWx0ZWQgYXQgdGhlIG1vbWVudFxuICAgICAgLy8gKHNvIHdhaXRpbmcgZm9yIGZ1cnRoZXIgZGVidWcgY29tbWFuZHMgbGlrZSAnY29udGludWUnIG9yICdzdGVwJylcbiAgICAgIC8vIGVuZHMgdXAgaGVyZSB0b28sIHNvIHNpbXBseSByZXR1cm4gdGhhdCBpdCBhbHJlYWR5IGhhcyBzdG9wcGVkXG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGVUb0RlYnVnZ2VyU3RhdGUoU3RhdGUpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKS50aGVuKHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuZXJyb3IgPSBlcnJcbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9jYWxsKCdTdGF0ZScsIHt9KS50aGVuKCh7IFN0YXRlIH0pID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGF0ZVRvRGVidWdnZXJTdGF0ZShTdGF0ZSlcbiAgICB9KVxuICB9XG4gIF9zdGF0ZVRvRGVidWdnZXJTdGF0ZSAoc3RhdGUsIGVycm9yKSB7XG4gICAgY29uc3QgZXhpdGVkID0gdGhpcy5fc3RvcFByb21pc2UgPyB0cnVlIDogISFzdGF0ZS5leGl0ZWRcbiAgICBsZXQgZ29yb3V0aW5lSUQgPSAtMVxuICAgIGlmICghZXhpdGVkKSB7XG4gICAgICBnb3JvdXRpbmVJRCA9IChzdGF0ZS5jdXJyZW50R29yb3V0aW5lICYmIHN0YXRlLmN1cnJlbnRHb3JvdXRpbmUuaWQpIHx8IC0xXG4gICAgICBpZiAoZ29yb3V0aW5lSUQgPT09IC0xKSB7XG4gICAgICAgIGdvcm91dGluZUlEID0gKHN0YXRlLmN1cnJlbnRUaHJlYWQgJiYgc3RhdGUuY3VycmVudFRocmVhZC5nb3JvdXRpbmVJRCkgfHwgLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4aXRlZCxcbiAgICAgIGdvcm91dGluZUlEXG4gICAgfVxuICB9XG5cbiAgIC8vIHJlc3RhcnQgdGhlIGRlbHZlIHNlc3Npb25cbiAgcmVzdGFydCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGwoJ1Jlc3RhcnQnKVxuICB9XG5cbiAgc2VsZWN0U3RhY2t0cmFjZSAoeyBpbmRleCB9KSB7XG4gICAgdm9pZCBpbmRleCAvLyBub3RoaW5nIHNwZWNpYWwgdG8gZG8gaGVyZSAuLi5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgfVxuICBnZXRTdGFja3RyYWNlICh7IGdvcm91dGluZUlEIH0pIHtcbiAgICBpZiAoZ29yb3V0aW5lSUQgPT09IC0xKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICAgIH1cblxuICAgIGNvbnN0IGFyZ3MgPSB7XG4gICAgICBpZDogZ29yb3V0aW5lSUQsXG4gICAgICBkZXB0aDogMjBcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NhbGwoJ1N0YWNrdHJhY2UnLCBhcmdzKVxuICAgICAgLnRoZW4odGhpcy5fcHJlcGFyZVN0YWNrdHJhY2UuYmluZCh0aGlzKSlcbiAgfVxuICBfcHJlcGFyZVN0YWNrdHJhY2UgKHsgTG9jYXRpb25zOiBzdGFja3RyYWNlIH0pIHtcbiAgICByZXR1cm4gc3RhY2t0cmFjZS5tYXAoKHN0YWNrKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogc3RhY2sucGMsXG4gICAgICAgIGZpbGU6IHN0YWNrLmZpbGUsXG4gICAgICAgIGxpbmU6IHN0YWNrLmxpbmUgLSAxLCAvLyBkZWx2ZSA9IDEgaW5kZXhlZCBsaW5lIC8gYXRvbSA9IDAgaW5kZXhlZCBsaW5lXG4gICAgICAgIGZ1bmM6IHN0YWNrLmZ1bmN0aW9uLm5hbWUuc3BsaXQoJy8nKS5wb3AoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3RHb3JvdXRpbmUgKHsgaWQgfSkge1xuICAgIHJldHVybiB0aGlzLl9jYWxsKCdDb21tYW5kJywgeyBuYW1lOiAnc3dpdGNoR29yb3V0aW5lJywgZ29yb3V0aW5lSUQ6IGlkIH0pXG4gIH1cbiAgZ2V0R29yb3V0aW5lcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGwoJ0xpc3RHb3JvdXRpbmVzJylcbiAgICAgIC50aGVuKHRoaXMuX3ByZXBhcmVHb3JvdXRpbmVzLmJpbmQodGhpcykpXG4gIH1cbiAgX3ByZXBhcmVHb3JvdXRpbmVzICh7IEdvcm91dGluZXM6IGdvcm91dGluZXMgfSkge1xuICAgIHJldHVybiBnb3JvdXRpbmVzLm1hcCgoeyBpZCwgdXNlckN1cnJlbnRMb2MsIGdvU3RhdGVtZW50TG9jIH0pID0+IHtcbiAgICAgIGNvbnN0IGxvYyA9IHVzZXJDdXJyZW50TG9jLmZpbGUgPyB1c2VyQ3VycmVudExvYyA6IGdvU3RhdGVtZW50TG9jXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZCxcbiAgICAgICAgZmlsZTogbG9jLmZpbGUsXG4gICAgICAgIGxpbmU6IGxvYy5saW5lIC0gMSwgLy8gZGx2ID0gMSBpbmRleGVkIGxpbmUgLyBhdG9tID0gMCBpbmRleGVkIGxpbmVcbiAgICAgICAgZnVuYzogbG9jLmZ1bmN0aW9uLm5hbWUuc3BsaXQoJy8nKS5wb3AoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXRWYXJpYWJsZXMgKHNjb3BlLCBjZmcgPSBkZWZhdWx0VmFyaWFibGVDZmcpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5fZ2V0TG9jYWxWYXJpYWJsZXMoc2NvcGUsIGNmZyksXG4gICAgICB0aGlzLl9nZXRGdW5jdGlvbkFyZ3VtZW50cyhzY29wZSwgY2ZnKVxuICAgIF0pLnRoZW4oKFtsb2NhbHMsIGFyZ3NdKSA9PiB7XG4gICAgICAvLyBub3RlOiB3b3JrYXJvdW5kIGZvciBnaXRodWIuY29tL2RlcmVrcGFya2VyL2RlbHZlL2lzc3Vlcy85NTFcbiAgICAgIC8vIGNoZWNrIHRoZSBhcmdzIGlmIHRoZXkgY29udGFpbiB2YXJpYWJsZXMgdGhhdCBhbHNvIGV4aXN0IGluXG4gICAgICAvLyB0aGUgbG9jYWwgdmFyaWFibGVzLiBpZiBzbyBtYXJrIHRoZW0gYXMgc2hhZG93ZWQgKGZsYWcgJiAyKVxuICAgICAgYXJncy5mb3JFYWNoKChhcmcpID0+IHtcbiAgICAgICAgaWYgKGxvY2Fscy5maW5kKChsb2NhbCkgPT4gbG9jYWwubmFtZSA9PT0gYXJnLm5hbWUpKSB7XG4gICAgICAgICAgYXJnLmZsYWcgfD0gMlxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY29uc3QgdmFycyA9IGxvY2Fscy5jb25jYXQoYXJncylcbiAgICAgICAgLy8gdmFyaWFibGUgaXMgc2hhZG93ZWQgYnkgYW5vdGhlciBvbmUsIHNraXAgaXRcbiAgICAgICAgLmZpbHRlcigodikgPT4gKCh2LmZsYWcgJiBWYXJpYWJsZVNoYWRvd2VkKSA9PT0gMClcbiAgICAgIClcbiAgICAgIHJldHVybiBEZWx2ZVZhcmlhYmxlcy5jcmVhdGUodmFycylcbiAgICB9KVxuICB9XG4gIF9nZXRMb2NhbFZhcmlhYmxlcyAoc2NvcGUsIGNmZykge1xuICAgIHJldHVybiB0aGlzLl9jYWxsKCdMaXN0TG9jYWxWYXJzJywgeyBzY29wZSwgY2ZnIH0pLnRoZW4oKG8pID0+IG8uVmFyaWFibGVzKVxuICB9XG4gIF9nZXRGdW5jdGlvbkFyZ3VtZW50cyAoc2NvcGUsIGNmZykge1xuICAgIHJldHVybiB0aGlzLl9jYWxsKCdMaXN0RnVuY3Rpb25BcmdzJywgeyBzY29wZSwgY2ZnIH0pLnRoZW4oKG8pID0+IG8uQXJncylcbiAgfVxuXG4gIGV2YWx1YXRlICh7IGV4cHIsIHNjb3BlIH0pIHtcbiAgICByZXR1cm4gdGhpcy5fY2FsbCgnRXZhbCcsIHsgZXhwciwgc2NvcGUgfSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIERlbHZlVmFyaWFibGVzLmNyZWF0ZShbcmVzdWx0LlZhcmlhYmxlXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICByZXR1cm4gRGVsdmVWYXJpYWJsZXMuY3JlYXRlRXJyb3IoZXJyLCBleHByKVxuICAgICAgfSlcbiAgfVxuXG4gIC8vIGNhbGwgaXMgdGhlIGJhc2UgbWV0aG9kIGZvciBhbGwgY2FsbHMgdG8gZGVsdmVcbiAgX2NhbGwgKG1ldGhvZCwgLi4uYXJncykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBlbmRwb2ludCA9IFJQQ19FTkRQT0lOVCArIG1ldGhvZFxuICAgICAgdGhpcy5fY29ubmVjdGlvbi5jYWxsKGVuZHBvaW50LCBhcmdzLCAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==