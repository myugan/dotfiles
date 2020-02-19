Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _storeUtils = require('./store-utils');

var _utils = require('./utils');

'use babel';

var Debugger = (function () {
  function Debugger(store, connection) {
    _classCallCheck(this, Debugger);

    this._connection = connection;
    this._store = store;
    this._stopPromise = null;
  }

  _createClass(Debugger, [{
    key: 'dispose',
    value: function dispose() {
      this.stop();
    }

    /**
     * Starts a new debugging session.
     * @param  {object} config The config used to start the debugger.
     * @param  {string} file   The file to debug
     * @return {Promise}
     */
  }, {
    key: 'start',
    value: function start(config, file) {
      var _this = this;

      if (this.isStarted()) {
        return Promise.resolve();
      }

      if (!config) {
        this._addOutputMessage('Please select a configuration in the debugger panel on the right.\n');
        return Promise.resolve();
      }

      this._store.dispatch({ type: 'SET_STATE', state: 'starting' });

      // clear the output panel
      if (atom.config.get('go-debug.clearOutputOnStart') === true) {
        this._store.dispatch({ type: 'CLEAR_OUTPUT_CONTENT' });
      }

      // start the debugger
      this._addOutputMessage('Starting delve with config "' + config.name + '"\n');

      return this._connection.start({ config: config, file: file }).then(function (session) {
        _this._addOutputMessage('Started delve with config "' + config.name + '"\n');
        _this._store.dispatch({ type: 'SET_STATE', state: 'waiting' });

        _this._session = session;

        return Promise.all((0, _storeUtils.getBreakpoints)(_this._store).map(function (bp) {
          return _this.addBreakpoint(bp.file, bp.line);
        })).then(function () {
          // TODO if !config.stopOnEntry
          return _this.resume();
        });
      })['catch'](function (err) {
        console.warn('go-debug', 'start', err);
        _this._addOutputMessage('Failed to start delve with config "' + config.name + '"\r\n  Error: ' + err + '\n');
        return _this.stop();
      });
    }

    /**
     * Stops a debugging session.
     * @return {Promise}
     */
  }, {
    key: 'stop',
    value: function stop() {
      var _this2 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }
      if (!this._session) {
        return Promise.resolve();
      }
      if (!this._stopPromise) {
        // the debugger is currently running the program
        // so halt it before we can stop it
        var requiresHalt = this.isBusy();
        this._stopPromise = this._session.stop(requiresHalt).then(function () {
          _this2._stopPromise = null;
          _this2._session = null;
          _this2._store.dispatch({ type: 'STOP' });
        });
      }
      return this._stopPromise;
    }

    /**
     * Adds a new breakpoint to the given file and line
     * @param {string} file
     * @param {number} line
     * @return {Promise}
     */
  }, {
    key: 'addBreakpoint',
    value: function addBreakpoint(file, line) {
      var _this3 = this;

      if (!this.isStarted()) {
        this._store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file: file, line: line, state: 'notStarted' } });
        return Promise.resolve();
      }

      var bp = (0, _storeUtils.getBreakpoint)(this._store, file, line);
      if (bp && bp.state === 'busy') {
        // already being added
        return Promise.resolve();
      }

      if (!bp) {
        this._store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file: file, line: line, state: 'busy' } });
      } else {
        this._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: { name: bp.name, state: 'busy' } });
      }
      bp = (0, _storeUtils.getBreakpoint)(this._store, file, line);

      var fileAndLine = (0, _utils.location)(bp);

      return this._addBreakpoint(bp).then(function (_ref) {
        var id = _ref.id;

        _this3._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: { name: bp.name, id: id, state: 'valid' } });
      })['catch'](function (err) {
        _this3._addOutputMessage('Adding breakpoint @ ' + fileAndLine + ' failed!\r\n  Error: ' + err + '\n');
        _this3._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: { name: bp.name, state: 'error', message: err } });
      });
    }
  }, {
    key: '_addBreakpoint',
    value: function _addBreakpoint(bp) {
      return this._session.addBreakpoint({ bp: bp });
    }

    /**
     * Removes a breakpoint
     * @param {string} name
     * @return {Promise}
     */
  }, {
    key: 'removeBreakpoint',
    value: function removeBreakpoint(name) {
      var _this4 = this;

      var bp = (0, _storeUtils.getBreakpointByName)(this._store, name);
      if (!bp) {
        return Promise.resolve();
      }

      var done = function done() {
        _this4._store.dispatch({ type: 'REMOVE_BREAKPOINT', bp: { name: name } });
      };

      if (bp.state === 'error' || !this.isStarted()) {
        return Promise.resolve().then(done);
      }

      var fileAndLine = (0, _utils.location)(bp);

      this._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: { name: name, state: 'busy' } });

      return this._removeBreakpoint(bp).then(done)['catch'](function (err) {
        _this4._addOutputMessage('Removing breakpoint @ ' + fileAndLine + ' failed!\r\n  Error: ' + err + '\n');
        _this4._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: { name: name, state: 'error', message: err } });
      });
    }
  }, {
    key: '_removeBreakpoint',
    value: function _removeBreakpoint(bp) {
      return this._session.removeBreakpoint({ id: bp.id });
    }

    /**
     * Adds or removes a breakpoint for the given file and line.
     * @param {string} file
     * @param {number} line
     * @return {Promise}
     */
  }, {
    key: 'toggleBreakpoint',
    value: function toggleBreakpoint(file, line) {
      var bp = (0, _storeUtils.getBreakpoint)(this._store, file, line);
      if (!bp) {
        return this.addBreakpoint(file, line);
      }
      return this.removeBreakpoint(bp.name);
    }
  }, {
    key: 'editBreakpoint',
    value: function editBreakpoint(name, changes) {
      var _this5 = this;

      var bp = (0, _storeUtils.getBreakpointByName)(this._store, name);
      if (!bp) {
        return Promise.resolve();
      }

      var newBP = Object.assign({}, bp, changes);

      var done = function done(bp) {
        _this5._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: bp });
      };
      if (!this.isStarted()) {
        // apply the changes immediately
        done(newBP);
        return Promise.resolve();
      }

      if (!bp.id) {
        return this.addBreakpoint(bp.file, bp.line);
      }

      this._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: Object.assign({}, newBP, { state: 'busy' }) });
      return this._session.editBreakpoint({ bp: newBP }).then(function () {
        done(Object.assign({}, newBP, { state: 'valid' }));
      })['catch'](function (err) {
        var fileAndLine = (0, _utils.location)(bp);
        _this5._addOutputMessage('Updating breakpoint @ ' + fileAndLine + ' failed!\r\n  Error: ' + err + '\n');
        _this5._store.dispatch({ type: 'EDIT_BREAKPOINT', bp: { name: bp.name, state: 'error', message: err } });
      });
    }

    /**
     * Resumes the current debugger.
     * @return {Promise}
     */
  }, {
    key: 'resume',
    value: function resume() {
      return this.continueExecution('resume');
    }

    /**
     * Halts the current debugger.
     * @return {Promise}
     */
  }, {
    key: 'halt',
    value: function halt() {
      return this.continueExecution('halt');
    }

    /**
     * Step the current debugger to the next line.
     * @return {Promise}
     */
  }, {
    key: 'next',
    value: function next() {
      return this.continueExecution('next');
    }

    /**
     * Step the current debugger into the current function/instruction.
     * @return {Promise}
     */
  }, {
    key: 'stepIn',
    value: function stepIn() {
      return this.continueExecution('stepIn');
    }

    /**
     * Step the current debugger out of the current function/instruction.
     * @return {Promise}
     */
  }, {
    key: 'stepOut',
    value: function stepOut() {
      return this.continueExecution('stepOut');
    }
  }, {
    key: 'continueExecution',
    value: function continueExecution(fn) {
      var _this6 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }

      if (fn !== 'halt' && this.isBusy()) {
        return Promise.resolve();
      }

      // clear the existing stacktrace and goroutines if the next delve
      // request takes too long.
      var id = setTimeout(function () {
        _this6._store.dispatch({ type: 'UPDATE_STACKTRACE', stacktrace: [] });
        _this6._store.dispatch({ type: 'UPDATE_GOROUTINES', goroutines: [] });
      }, 500);

      return this._updateState(function () {
        return _this6._session[fn]()['catch'](function (err) {
          _this6._addOutputMessage('Failed to ' + fn + '!\r\n  Error: ' + err + '\n');
          return null;
        });
      }, 'running').then(function (newState) {
        clearTimeout(id);
        if (!newState) {
          return;
        }
        if (newState.error) {
          _this6._addOutputMessage('Failed to ' + fn + '!\r\n  Error: ' + newState.error + '\n');
        }
        if (newState.exited) {
          return _this6.stop();
        }
        return _this6.getGoroutines() // get the new goroutines
        .then(function () {
          return _this6.selectGoroutine(newState.goroutineID);
        }); // select the current goroutine
      });
    }

    /**
     * Restarts the current debugger.
     * @return {Promise}
     */
  }, {
    key: 'restart',
    value: function restart() {
      var _this7 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }
      return this._session.restart().then(function () {
        _this7._store.dispatch({ type: 'RESTART' });
        // immediately start the execution (like "start" does)
        _this7.resume();
      });
    }

    /**
     * Selects the given stacktrace of the current debugger.
     * @param  {number} index The selected index within the stacktrace
     * @return {Promise}
     */
  }, {
    key: 'selectStacktrace',
    value: function selectStacktrace(index) {
      var _this8 = this;

      return this._selectStacktrace(index).then(function () {
        return _this8._getVariables();
      }).then(function () {
        return _this8._evaluateWatchExpressions();
      });
    }
  }, {
    key: '_selectStacktrace',
    value: function _selectStacktrace(index) {
      var _this9 = this;

      if (this._store.getState().delve.selectedStacktrace === index) {
        // no need to change
        return Promise.resolve();
      }

      return this._updateState(function () {
        return _this9._session.selectStacktrace({ index: index });
      }).then(function () {
        _this9._store.dispatch({ type: 'SET_SELECTED_STACKTRACE', index: index });
      });
    }

    /**
     * Selects the given goroutine of the current debugger.
     * @param  {string|number} id The id of the selected goroutine
     * @return {Promise}
     */
  }, {
    key: 'selectGoroutine',
    value: function selectGoroutine(id) {
      var _this10 = this;

      return this._selectGoroutine(id).then(function () {
        return _this10.getStacktrace(id);
      }).then(function () {
        return _this10.selectStacktrace(0);
      }); // reselect the first stacktrace entry
    }
  }, {
    key: '_selectGoroutine',
    value: function _selectGoroutine(id) {
      var _this11 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }
      if (this._store.getState().delve.selectedGoroutine === id) {
        // no need to change
        return Promise.resolve();
      }

      return this._updateState(function () {
        return _this11._session.selectGoroutine({ id: id });
      }).then(function () {
        _this11._store.dispatch({ type: 'SET_SELECTED_GOROUTINE', id: id });
      });
    }
  }, {
    key: 'getStacktrace',
    value: function getStacktrace(goroutineID) {
      var _this12 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }

      return this._updateState(function () {
        return _this12._session.getStacktrace({ goroutineID: goroutineID });
      }).then(function (stacktrace) {
        _this12._store.dispatch({ type: 'UPDATE_STACKTRACE', stacktrace: stacktrace });
      });
    }
  }, {
    key: 'getGoroutines',
    value: function getGoroutines() {
      var _this13 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }

      return this._updateState(function () {
        return _this13._session.getGoroutines();
      }).then(function (goroutines) {
        _this13._store.dispatch({ type: 'UPDATE_GOROUTINES', goroutines: goroutines });
      });
    }
  }, {
    key: '_getVariables',
    value: function _getVariables() {
      var _this14 = this;

      var _store$getState$delve = this._store.getState().delve;

      var selectedGoroutine = _store$getState$delve.selectedGoroutine;
      var selectedStacktrace = _store$getState$delve.selectedStacktrace;
      var stacktrace = _store$getState$delve.stacktrace;

      var st = stacktrace[selectedStacktrace];
      if (!st || st.variables) {
        return Promise.resolve();
      }

      var scope = {
        goroutineID: selectedGoroutine,
        frame: selectedStacktrace
      };
      return this._updateState(function () {
        return _this14._session.getVariables(scope);
      }).then(function (variables) {
        _this14._store.dispatch({ type: 'UPDATE_VARIABLES', variables: variables, stacktraceIndex: selectedStacktrace });
      });
    }
  }, {
    key: 'evaluate',
    value: function evaluate(expr) {
      var _this15 = this;

      if (!this.isStarted()) {
        return Promise.resolve();
      }

      var _store$getState = this._store.getState();

      var delve = _store$getState.delve;
      var goroutineID = delve.selectedGoroutine;
      var frame = delve.selectedStacktrace;

      return this._updateState(function () {
        return _this15._session.evaluate({ expr: expr, scope: { goroutineID: goroutineID, frame: frame } });
      });
    }
  }, {
    key: 'addWatchExpression',
    value: function addWatchExpression(expr) {
      var existingExpr = this._store.getState().delve.watchExpressions.find(function (o) {
        return o.expr === expr;
      });
      if (existingExpr) {
        return Promise.resolve();
      }

      this._store.dispatch({ type: 'ADD_WATCH_EXPRESSION', expr: expr });

      if (!this.isStarted()) {
        return Promise.resolve();
      }

      return this._evaluateWatchExpression(expr);
    }
  }, {
    key: 'removeWatchExpression',
    value: function removeWatchExpression(expr) {
      this._store.dispatch({ type: 'REMOVE_WATCH_EXPRESSION', expr: expr });
      return Promise.resolve();
    }
  }, {
    key: '_evaluateWatchExpression',
    value: function _evaluateWatchExpression(expr) {
      var _this16 = this;

      return this._updateState(function () {
        return _this16.evaluate(expr);
      }).then(function (variables) {
        _this16._store.dispatch({ type: 'SET_WATCH_EXPRESSION_VARIABLES', expr: expr, variables: variables });
      });
    }
  }, {
    key: '_evaluateWatchExpressions',
    value: function _evaluateWatchExpressions() {
      var _this17 = this;

      var expressions = this._store.getState().delve.watchExpressions;
      return Promise.all(expressions.map(function (_ref2) {
        var expr = _ref2.expr;
        return _this17._evaluateWatchExpression(expr);
      }));
    }
  }, {
    key: '_updateState',
    value: function _updateState(fn) {
      var _this18 = this;

      var before = arguments.length <= 1 || arguments[1] === undefined ? 'busy' : arguments[1];
      var after = arguments.length <= 2 || arguments[2] === undefined ? 'waiting' : arguments[2];

      // only change the state if we are currently waiting.
      // other states mean that something else is happening
      var changeState = this.getState() === 'waiting';
      if (changeState) {
        this._store.dispatch({ type: 'SET_STATE', state: before });
      }
      return fn().then(function (v) {
        if (changeState) {
          _this18._store.dispatch({ type: 'SET_STATE', state: after });
        }
        return v;
      });
    }

    /**
     * Loads the variables for the given path.
     * @param  {string} path     The path of the variable to load
     * @param  {object} variable The variable
     * @return {Promise}
     */
  }, {
    key: 'loadVariable',
    value: function loadVariable(path, variable) {
      var _this19 = this;

      this._store.dispatch({ type: 'SET_STATE', state: 'busy' });
      return this._session.loadVariable({ path: path, variable: variable }).then(function (variables) {
        _this19._store.dispatch({
          type: 'UPDATE_VARIABLES',
          // updating variable at this path ...
          path: path,
          // ... resulted in the following variables
          variables: variables,
          // add it to current selected stacktrace entry
          stacktraceIndex: _this19._store.getState().delve.selectedStacktrace,
          state: 'waiting'
        });
      });
    }

    /**
     * Returns `true` if the given debugger is started, `false` otherwise.
     * @return {boolean}
     */
  }, {
    key: 'isStarted',
    value: function isStarted() {
      var state = this.getState();
      return state !== 'notStarted' && state !== 'starting';
    }
  }, {
    key: 'isBusy',
    value: function isBusy() {
      var state = this.getState();
      return state === 'busy' || state === 'running';
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this._store.getState().delve.state;
    }
  }, {
    key: '_addOutputMessage',
    value: function _addOutputMessage(message) {
      this._store.dispatch({
        type: 'ADD_OUTPUT_CONTENT',
        content: {
          type: 'message',
          message: message
        }
      });
    }
  }]);

  return Debugger;
})();

exports['default'] = Debugger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWJ1Z2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFFbUUsZUFBZTs7cUJBQ3pELFNBQVM7O0FBSGxDLFdBQVcsQ0FBQTs7SUFLVSxRQUFRO0FBQ2YsV0FETyxRQUFRLENBQ2QsS0FBSyxFQUFFLFVBQVUsRUFBRTswQkFEYixRQUFROztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQTtBQUM3QixRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtHQUN6Qjs7ZUFMa0IsUUFBUTs7V0FPbkIsbUJBQUc7QUFDVCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDWjs7Ozs7Ozs7OztXQVFLLGVBQUMsTUFBTSxFQUFFLElBQUksRUFBRTs7O0FBQ25CLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3BCLGVBQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3pCOztBQUVELFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxZQUFJLENBQUMsaUJBQWlCLHVFQUF1RSxDQUFBO0FBQzdGLGVBQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3pCOztBQUVELFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTs7O0FBRzlELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDM0QsWUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxDQUFBO09BQ3ZEOzs7QUFHRCxVQUFJLENBQUMsaUJBQWlCLGtDQUFnQyxNQUFNLENBQUMsSUFBSSxTQUFN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QUksRUFBSixJQUFJLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsU0FBUyxFQUFLO0FBQ3hFLGdCQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbkIsY0FBSSxFQUFFLGtCQUFrQjs7QUFFeEIsY0FBSSxFQUFKLElBQUk7O0FBRUosbUJBQVMsRUFBVCxTQUFTOztBQUVULHlCQUFlLEVBQUUsUUFBSyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQjtBQUNoRSxlQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7Ozs7Ozs7V0FNUyxxQkFBRztBQUNYLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUM3QixhQUFPLEtBQUssS0FBSyxZQUFZLElBQUksS0FBSyxLQUFLLFVBQVUsQ0FBQTtLQUN0RDs7O1dBRU0sa0JBQUc7QUFDUixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDN0IsYUFBTyxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUE7S0FDL0M7OztXQUVRLG9CQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUE7S0FDMUM7OztXQUVpQiwyQkFBQyxPQUFPLEVBQUU7QUFDMUIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbkIsWUFBSSxFQUFFLG9CQUFvQjtBQUMxQixlQUFPLEVBQUU7QUFDUCxjQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFPLEVBQVAsT0FBTztTQUNSO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztTQWpma0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2RlYnVnZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgZ2V0QnJlYWtwb2ludCwgZ2V0QnJlYWtwb2ludHMsIGdldEJyZWFrcG9pbnRCeU5hbWUgfSBmcm9tICcuL3N0b3JlLXV0aWxzJ1xuaW1wb3J0IHsgbG9jYXRpb24gfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z2dlciB7XG4gIGNvbnN0cnVjdG9yIChzdG9yZSwgY29ubmVjdGlvbikge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uXG4gICAgdGhpcy5fc3RvcmUgPSBzdG9yZVxuICAgIHRoaXMuX3N0b3BQcm9taXNlID0gbnVsbFxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgdGhpcy5zdG9wKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgYSBuZXcgZGVidWdnaW5nIHNlc3Npb24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdXNlZCB0byBzdGFydCB0aGUgZGVidWdnZXIuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZmlsZSAgIFRoZSBmaWxlIHRvIGRlYnVnXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBzdGFydCAoY29uZmlnLCBmaWxlKSB7XG4gICAgaWYgKHRoaXMuaXNTdGFydGVkKCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGlmICghY29uZmlnKSB7XG4gICAgICB0aGlzLl9hZGRPdXRwdXRNZXNzYWdlKGBQbGVhc2Ugc2VsZWN0IGEgY29uZmlndXJhdGlvbiBpbiB0aGUgZGVidWdnZXIgcGFuZWwgb24gdGhlIHJpZ2h0LlxcbmApXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdTRVRfU1RBVEUnLCBzdGF0ZTogJ3N0YXJ0aW5nJyB9KVxuXG4gICAgLy8gY2xlYXIgdGhlIG91dHB1dCBwYW5lbFxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dvLWRlYnVnLmNsZWFyT3V0cHV0T25TdGFydCcpID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdDTEVBUl9PVVRQVVRfQ09OVEVOVCcgfSlcbiAgICB9XG5cbiAgICAvLyBzdGFydCB0aGUgZGVidWdnZXJcbiAgICB0aGlzLl9hZGRPdXRwdXRNZXNzYWdlKGBTdGFydGluZyBkZWx2ZSB3aXRoIGNvbmZpZyBcIiR7Y29uZmlnLm5hbWV9XCJcXG5gKVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uc3RhcnQoeyBjb25maWcsIGZpbGUgfSlcbiAgICAgIC50aGVuKChzZXNzaW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX2FkZE91dHB1dE1lc3NhZ2UoYFN0YXJ0ZWQgZGVsdmUgd2l0aCBjb25maWcgXCIke2NvbmZpZy5uYW1lfVwiXFxuYClcbiAgICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX1NUQVRFJywgc3RhdGU6ICd3YWl0aW5nJyB9KVxuXG4gICAgICAgIHRoaXMuX3Nlc3Npb24gPSBzZXNzaW9uXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgIGdldEJyZWFrcG9pbnRzKHRoaXMuX3N0b3JlKS5tYXAoKGJwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmVha3BvaW50KGJwLmZpbGUsIGJwLmxpbmUpXG4gICAgICAgICAgfSlcbiAgICAgICAgKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAvLyBUT0RPIGlmICFjb25maWcuc3RvcE9uRW50cnlcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUud2FybignZ28tZGVidWcnLCAnc3RhcnQnLCBlcnIpXG4gICAgICAgIHRoaXMuX2FkZE91dHB1dE1lc3NhZ2UoYEZhaWxlZCB0byBzdGFydCBkZWx2ZSB3aXRoIGNvbmZpZyBcIiR7Y29uZmlnLm5hbWV9XCJcXHJcXG4gIEVycm9yOiAke2Vycn1cXG5gKVxuICAgICAgICByZXR1cm4gdGhpcy5zdG9wKClcbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU3RvcHMgYSBkZWJ1Z2dpbmcgc2Vzc2lvbi5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHN0b3AgKCkge1xuICAgIGlmICghdGhpcy5pc1N0YXJ0ZWQoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuICAgIGlmICghdGhpcy5fc2Vzc2lvbikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuICAgIGlmICghdGhpcy5fc3RvcFByb21pc2UpIHtcbiAgICAgIC8vIHRoZSBkZWJ1Z2dlciBpcyBjdXJyZW50bHkgcnVubmluZyB0aGUgcHJvZ3JhbVxuICAgICAgLy8gc28gaGFsdCBpdCBiZWZvcmUgd2UgY2FuIHN0b3AgaXRcbiAgICAgIGNvbnN0IHJlcXVpcmVzSGFsdCA9IHRoaXMuaXNCdXN5KClcbiAgICAgIHRoaXMuX3N0b3BQcm9taXNlID0gdGhpcy5fc2Vzc2lvbi5zdG9wKHJlcXVpcmVzSGFsdClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3N0b3BQcm9taXNlID0gbnVsbFxuICAgICAgICAgIHRoaXMuX3Nlc3Npb24gPSBudWxsXG4gICAgICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU1RPUCcgfSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BQcm9taXNlXG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBicmVha3BvaW50IHRvIHRoZSBnaXZlbiBmaWxlIGFuZCBsaW5lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsaW5lXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBhZGRCcmVha3BvaW50IChmaWxlLCBsaW5lKSB7XG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCgpKSB7XG4gICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdBRERfQlJFQUtQT0lOVCcsIGJwOiB7IGZpbGUsIGxpbmUsIHN0YXRlOiAnbm90U3RhcnRlZCcgfSB9KVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgbGV0IGJwID0gZ2V0QnJlYWtwb2ludCh0aGlzLl9zdG9yZSwgZmlsZSwgbGluZSlcbiAgICBpZiAoYnAgJiYgYnAuc3RhdGUgPT09ICdidXN5Jykge1xuICAgICAgLy8gYWxyZWFkeSBiZWluZyBhZGRlZFxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgaWYgKCFicCkge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnQUREX0JSRUFLUE9JTlQnLCBicDogeyBmaWxlLCBsaW5lLCBzdGF0ZTogJ2J1c3knIH0gfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRURJVF9CUkVBS1BPSU5UJywgYnA6IHsgbmFtZTogYnAubmFtZSwgc3RhdGU6ICdidXN5JyB9IH0pXG4gICAgfVxuICAgIGJwID0gZ2V0QnJlYWtwb2ludCh0aGlzLl9zdG9yZSwgZmlsZSwgbGluZSlcblxuICAgIGNvbnN0IGZpbGVBbmRMaW5lID0gbG9jYXRpb24oYnApXG5cbiAgICByZXR1cm4gdGhpcy5fYWRkQnJlYWtwb2ludChicClcbiAgICAgIC50aGVuKCh7IGlkIH0pID0+IHtcbiAgICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRURJVF9CUkVBS1BPSU5UJywgYnA6IHsgbmFtZTogYnAubmFtZSwgaWQsIHN0YXRlOiAndmFsaWQnIH0gfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXRNZXNzYWdlKGBBZGRpbmcgYnJlYWtwb2ludCBAICR7ZmlsZUFuZExpbmV9IGZhaWxlZCFcXHJcXG4gIEVycm9yOiAke2Vycn1cXG5gKVxuICAgICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFRElUX0JSRUFLUE9JTlQnLCBicDogeyBuYW1lOiBicC5uYW1lLCBzdGF0ZTogJ2Vycm9yJywgbWVzc2FnZTogZXJyIH0gfSlcbiAgICAgIH0pXG4gIH1cbiAgX2FkZEJyZWFrcG9pbnQgKGJwKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nlc3Npb24uYWRkQnJlYWtwb2ludCh7IGJwIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGJyZWFrcG9pbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHJlbW92ZUJyZWFrcG9pbnQgKG5hbWUpIHtcbiAgICBjb25zdCBicCA9IGdldEJyZWFrcG9pbnRCeU5hbWUodGhpcy5fc3RvcmUsIG5hbWUpXG4gICAgaWYgKCFicCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1JFTU9WRV9CUkVBS1BPSU5UJywgYnA6IHsgbmFtZSB9IH0pXG4gICAgfVxuXG4gICAgaWYgKGJwLnN0YXRlID09PSAnZXJyb3InIHx8ICF0aGlzLmlzU3RhcnRlZCgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihkb25lKVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGVBbmRMaW5lID0gbG9jYXRpb24oYnApXG5cbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFRElUX0JSRUFLUE9JTlQnLCBicDogeyBuYW1lLCBzdGF0ZTogJ2J1c3knIH0gfSlcblxuICAgIHJldHVybiB0aGlzLl9yZW1vdmVCcmVha3BvaW50KGJwKVxuICAgICAgLnRoZW4oZG9uZSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuX2FkZE91dHB1dE1lc3NhZ2UoYFJlbW92aW5nIGJyZWFrcG9pbnQgQCAke2ZpbGVBbmRMaW5lfSBmYWlsZWQhXFxyXFxuICBFcnJvcjogJHtlcnJ9XFxuYClcbiAgICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRURJVF9CUkVBS1BPSU5UJywgYnA6IHsgbmFtZSwgc3RhdGU6ICdlcnJvcicsIG1lc3NhZ2U6IGVyciB9IH0pXG4gICAgICB9KVxuICB9XG4gIF9yZW1vdmVCcmVha3BvaW50IChicCkge1xuICAgIHJldHVybiB0aGlzLl9zZXNzaW9uLnJlbW92ZUJyZWFrcG9pbnQoeyBpZDogYnAuaWQgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG9yIHJlbW92ZXMgYSBicmVha3BvaW50IGZvciB0aGUgZ2l2ZW4gZmlsZSBhbmQgbGluZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmVcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHRvZ2dsZUJyZWFrcG9pbnQgKGZpbGUsIGxpbmUpIHtcbiAgICBjb25zdCBicCA9IGdldEJyZWFrcG9pbnQodGhpcy5fc3RvcmUsIGZpbGUsIGxpbmUpXG4gICAgaWYgKCFicCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkQnJlYWtwb2ludChmaWxlLCBsaW5lKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZW1vdmVCcmVha3BvaW50KGJwLm5hbWUpXG4gIH1cblxuICBlZGl0QnJlYWtwb2ludCAobmFtZSwgY2hhbmdlcykge1xuICAgIGNvbnN0IGJwID0gZ2V0QnJlYWtwb2ludEJ5TmFtZSh0aGlzLl9zdG9yZSwgbmFtZSlcbiAgICBpZiAoIWJwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICBjb25zdCBuZXdCUCA9IE9iamVjdC5hc3NpZ24oe30sIGJwLCBjaGFuZ2VzKVxuXG4gICAgY29uc3QgZG9uZSA9IChicCkgPT4ge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRURJVF9CUkVBS1BPSU5UJywgYnAgfSlcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCgpKSB7XG4gICAgICAvLyBhcHBseSB0aGUgY2hhbmdlcyBpbW1lZGlhdGVseVxuICAgICAgZG9uZShuZXdCUClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGlmICghYnAuaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZEJyZWFrcG9pbnQoYnAuZmlsZSwgYnAubGluZSlcbiAgICB9XG5cbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFRElUX0JSRUFLUE9JTlQnLCBicDogT2JqZWN0LmFzc2lnbih7fSwgbmV3QlAsIHsgc3RhdGU6ICdidXN5JyB9KSB9KVxuICAgIHJldHVybiB0aGlzLl9zZXNzaW9uLmVkaXRCcmVha3BvaW50KHsgYnA6IG5ld0JQIH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGRvbmUoT2JqZWN0LmFzc2lnbih7fSwgbmV3QlAsIHsgc3RhdGU6ICd2YWxpZCcgfSkpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZUFuZExpbmUgPSBsb2NhdGlvbihicClcbiAgICAgICAgdGhpcy5fYWRkT3V0cHV0TWVzc2FnZShgVXBkYXRpbmcgYnJlYWtwb2ludCBAICR7ZmlsZUFuZExpbmV9IGZhaWxlZCFcXHJcXG4gIEVycm9yOiAke2Vycn1cXG5gKVxuICAgICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFRElUX0JSRUFLUE9JTlQnLCBicDogeyBuYW1lOiBicC5uYW1lLCBzdGF0ZTogJ2Vycm9yJywgbWVzc2FnZTogZXJyIH0gfSlcbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVzdW1lcyB0aGUgY3VycmVudCBkZWJ1Z2dlci5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHJlc3VtZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGludWVFeGVjdXRpb24oJ3Jlc3VtZScpXG4gIH1cblxuICAvKipcbiAgICogSGFsdHMgdGhlIGN1cnJlbnQgZGVidWdnZXIuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBoYWx0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250aW51ZUV4ZWN1dGlvbignaGFsdCcpXG4gIH1cblxuICAvKipcbiAgICogU3RlcCB0aGUgY3VycmVudCBkZWJ1Z2dlciB0byB0aGUgbmV4dCBsaW5lLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgbmV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGludWVFeGVjdXRpb24oJ25leHQnKVxuICB9XG5cbiAgLyoqXG4gICAqIFN0ZXAgdGhlIGN1cnJlbnQgZGVidWdnZXIgaW50byB0aGUgY3VycmVudCBmdW5jdGlvbi9pbnN0cnVjdGlvbi5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHN0ZXBJbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGludWVFeGVjdXRpb24oJ3N0ZXBJbicpXG4gIH1cblxuICAvKipcbiAgICogU3RlcCB0aGUgY3VycmVudCBkZWJ1Z2dlciBvdXQgb2YgdGhlIGN1cnJlbnQgZnVuY3Rpb24vaW5zdHJ1Y3Rpb24uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBzdGVwT3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250aW51ZUV4ZWN1dGlvbignc3RlcE91dCcpXG4gIH1cblxuICBjb250aW51ZUV4ZWN1dGlvbiAoZm4pIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGlmIChmbiAhPT0gJ2hhbHQnICYmIHRoaXMuaXNCdXN5KCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIC8vIGNsZWFyIHRoZSBleGlzdGluZyBzdGFja3RyYWNlIGFuZCBnb3JvdXRpbmVzIGlmIHRoZSBuZXh0IGRlbHZlXG4gICAgLy8gcmVxdWVzdCB0YWtlcyB0b28gbG9uZy5cbiAgICBjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVVBEQVRFX1NUQUNLVFJBQ0UnLCBzdGFja3RyYWNlOiBbXSB9KVxuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVVBEQVRFX0dPUk9VVElORVMnLCBnb3JvdXRpbmVzOiBbXSB9KVxuICAgIH0sIDUwMClcblxuICAgIHJldHVybiB0aGlzLl91cGRhdGVTdGF0ZShcbiAgICAgICgpID0+IHRoaXMuX3Nlc3Npb25bZm5dKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXRNZXNzYWdlKGBGYWlsZWQgdG8gJHtmbn0hXFxyXFxuICBFcnJvcjogJHtlcnJ9XFxuYClcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0pLFxuICAgICAgJ3J1bm5pbmcnXG4gICAgKS50aGVuKChuZXdTdGF0ZSkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKVxuICAgICAgaWYgKCFuZXdTdGF0ZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmIChuZXdTdGF0ZS5lcnJvcikge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXRNZXNzYWdlKGBGYWlsZWQgdG8gJHtmbn0hXFxyXFxuICBFcnJvcjogJHtuZXdTdGF0ZS5lcnJvcn1cXG5gKVxuICAgICAgfVxuICAgICAgaWYgKG5ld1N0YXRlLmV4aXRlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9wKClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldEdvcm91dGluZXMoKSAvLyBnZXQgdGhlIG5ldyBnb3JvdXRpbmVzXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMuc2VsZWN0R29yb3V0aW5lKG5ld1N0YXRlLmdvcm91dGluZUlEKSkgLy8gc2VsZWN0IHRoZSBjdXJyZW50IGdvcm91dGluZVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIGN1cnJlbnQgZGVidWdnZXIuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXN0YXJ0ICgpIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2Vzc2lvbi5yZXN0YXJ0KCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdSRVNUQVJUJyB9KVxuICAgICAgLy8gaW1tZWRpYXRlbHkgc3RhcnQgdGhlIGV4ZWN1dGlvbiAobGlrZSBcInN0YXJ0XCIgZG9lcylcbiAgICAgIHRoaXMucmVzdW1lKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIGdpdmVuIHN0YWNrdHJhY2Ugb2YgdGhlIGN1cnJlbnQgZGVidWdnZXIuXG4gICAqIEBwYXJhbSAge251bWJlcn0gaW5kZXggVGhlIHNlbGVjdGVkIGluZGV4IHdpdGhpbiB0aGUgc3RhY2t0cmFjZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgc2VsZWN0U3RhY2t0cmFjZSAoaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0U3RhY2t0cmFjZShpbmRleClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuX2dldFZhcmlhYmxlcygpKVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fZXZhbHVhdGVXYXRjaEV4cHJlc3Npb25zKCkpXG4gIH1cbiAgX3NlbGVjdFN0YWNrdHJhY2UgKGluZGV4KSB7XG4gICAgaWYgKHRoaXMuX3N0b3JlLmdldFN0YXRlKCkuZGVsdmUuc2VsZWN0ZWRTdGFja3RyYWNlID09PSBpbmRleCkge1xuICAgICAgLy8gbm8gbmVlZCB0byBjaGFuZ2VcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91cGRhdGVTdGF0ZShcbiAgICAgICgpID0+IHRoaXMuX3Nlc3Npb24uc2VsZWN0U3RhY2t0cmFjZSh7IGluZGV4IH0pXG4gICAgKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9TRUxFQ1RFRF9TVEFDS1RSQUNFJywgaW5kZXggfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIGdpdmVuIGdvcm91dGluZSBvZiB0aGUgY3VycmVudCBkZWJ1Z2dlci5cbiAgICogQHBhcmFtICB7c3RyaW5nfG51bWJlcn0gaWQgVGhlIGlkIG9mIHRoZSBzZWxlY3RlZCBnb3JvdXRpbmVcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHNlbGVjdEdvcm91dGluZSAoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0R29yb3V0aW5lKGlkKVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5nZXRTdGFja3RyYWNlKGlkKSlcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuc2VsZWN0U3RhY2t0cmFjZSgwKSkgLy8gcmVzZWxlY3QgdGhlIGZpcnN0IHN0YWNrdHJhY2UgZW50cnlcbiAgfVxuICBfc2VsZWN0R29yb3V0aW5lIChpZCkge1xuICAgIGlmICghdGhpcy5pc1N0YXJ0ZWQoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuICAgIGlmICh0aGlzLl9zdG9yZS5nZXRTdGF0ZSgpLmRlbHZlLnNlbGVjdGVkR29yb3V0aW5lID09PSBpZCkge1xuICAgICAgLy8gbm8gbmVlZCB0byBjaGFuZ2VcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91cGRhdGVTdGF0ZShcbiAgICAgICgpID0+IHRoaXMuX3Nlc3Npb24uc2VsZWN0R29yb3V0aW5lKHsgaWQgfSlcbiAgICApLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX1NFTEVDVEVEX0dPUk9VVElORScsIGlkIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldFN0YWNrdHJhY2UgKGdvcm91dGluZUlEKSB7XG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlU3RhdGUoXG4gICAgICAoKSA9PiB0aGlzLl9zZXNzaW9uLmdldFN0YWNrdHJhY2UoeyBnb3JvdXRpbmVJRCB9KVxuICAgICkudGhlbigoc3RhY2t0cmFjZSkgPT4ge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVVBEQVRFX1NUQUNLVFJBQ0UnLCBzdGFja3RyYWNlIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldEdvcm91dGluZXMgKCkge1xuICAgIGlmICghdGhpcy5pc1N0YXJ0ZWQoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZVN0YXRlKFxuICAgICAgKCkgPT4gdGhpcy5fc2Vzc2lvbi5nZXRHb3JvdXRpbmVzKClcbiAgICApLnRoZW4oKGdvcm91dGluZXMpID0+IHtcbiAgICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VQREFURV9HT1JPVVRJTkVTJywgZ29yb3V0aW5lcyB9KVxuICAgIH0pXG4gIH1cblxuICBfZ2V0VmFyaWFibGVzICgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkR29yb3V0aW5lLCBzZWxlY3RlZFN0YWNrdHJhY2UsIHN0YWNrdHJhY2UgfSA9IHRoaXMuX3N0b3JlLmdldFN0YXRlKCkuZGVsdmVcblxuICAgIGNvbnN0IHN0ID0gc3RhY2t0cmFjZVtzZWxlY3RlZFN0YWNrdHJhY2VdXG4gICAgaWYgKCFzdCB8fCBzdC52YXJpYWJsZXMpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlID0ge1xuICAgICAgZ29yb3V0aW5lSUQ6IHNlbGVjdGVkR29yb3V0aW5lLFxuICAgICAgZnJhbWU6IHNlbGVjdGVkU3RhY2t0cmFjZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlU3RhdGUoXG4gICAgICAoKSA9PiB0aGlzLl9zZXNzaW9uLmdldFZhcmlhYmxlcyhzY29wZSlcbiAgICApLnRoZW4oKHZhcmlhYmxlcykgPT4ge1xuICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVVBEQVRFX1ZBUklBQkxFUycsIHZhcmlhYmxlcywgc3RhY2t0cmFjZUluZGV4OiBzZWxlY3RlZFN0YWNrdHJhY2UgfSlcbiAgICB9KVxuICB9XG5cbiAgZXZhbHVhdGUgKGV4cHIpIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbnN0IHsgZGVsdmUgfSA9IHRoaXMuX3N0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCB7IHNlbGVjdGVkR29yb3V0aW5lOiBnb3JvdXRpbmVJRCwgc2VsZWN0ZWRTdGFja3RyYWNlOiBmcmFtZSB9ID0gZGVsdmVcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlU3RhdGUoXG4gICAgICAoKSA9PiB0aGlzLl9zZXNzaW9uLmV2YWx1YXRlKHsgZXhwciwgc2NvcGU6IHsgZ29yb3V0aW5lSUQsIGZyYW1lIH0gfSlcbiAgICApXG4gIH1cblxuICBhZGRXYXRjaEV4cHJlc3Npb24gKGV4cHIpIHtcbiAgICBjb25zdCBleGlzdGluZ0V4cHIgPSB0aGlzLl9zdG9yZS5nZXRTdGF0ZSgpLmRlbHZlLndhdGNoRXhwcmVzc2lvbnMuZmluZCgobykgPT4gby5leHByID09PSBleHByKVxuICAgIGlmIChleGlzdGluZ0V4cHIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0FERF9XQVRDSF9FWFBSRVNTSU9OJywgZXhwciB9KVxuXG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZXZhbHVhdGVXYXRjaEV4cHJlc3Npb24oZXhwcilcbiAgfVxuICByZW1vdmVXYXRjaEV4cHJlc3Npb24gKGV4cHIpIHtcbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdSRU1PVkVfV0FUQ0hfRVhQUkVTU0lPTicsIGV4cHIgfSlcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgfVxuICBfZXZhbHVhdGVXYXRjaEV4cHJlc3Npb24gKGV4cHIpIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlU3RhdGUoKCkgPT4gdGhpcy5ldmFsdWF0ZShleHByKSlcbiAgICAgIC50aGVuKCh2YXJpYWJsZXMpID0+IHtcbiAgICAgICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX1dBVENIX0VYUFJFU1NJT05fVkFSSUFCTEVTJywgZXhwciwgdmFyaWFibGVzIH0pXG4gICAgICB9KVxuICB9XG4gIF9ldmFsdWF0ZVdhdGNoRXhwcmVzc2lvbnMgKCkge1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5fc3RvcmUuZ2V0U3RhdGUoKS5kZWx2ZS53YXRjaEV4cHJlc3Npb25zXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgZXhwcmVzc2lvbnMubWFwKCh7IGV4cHIgfSkgPT4gdGhpcy5fZXZhbHVhdGVXYXRjaEV4cHJlc3Npb24oZXhwcikpXG4gICAgKVxuICB9XG5cbiAgX3VwZGF0ZVN0YXRlIChmbiwgYmVmb3JlID0gJ2J1c3knLCBhZnRlciA9ICd3YWl0aW5nJykge1xuICAgIC8vIG9ubHkgY2hhbmdlIHRoZSBzdGF0ZSBpZiB3ZSBhcmUgY3VycmVudGx5IHdhaXRpbmcuXG4gICAgLy8gb3RoZXIgc3RhdGVzIG1lYW4gdGhhdCBzb21ldGhpbmcgZWxzZSBpcyBoYXBwZW5pbmdcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoKSA9PT0gJ3dhaXRpbmcnXG4gICAgaWYgKGNoYW5nZVN0YXRlKSB7XG4gICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdTRVRfU1RBVEUnLCBzdGF0ZTogYmVmb3JlIH0pXG4gICAgfVxuICAgIHJldHVybiBmbigpLnRoZW4oKHYpID0+IHtcbiAgICAgIGlmIChjaGFuZ2VTdGF0ZSkge1xuICAgICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdTRVRfU1RBVEUnLCBzdGF0ZTogYWZ0ZXIgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB2XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgdmFyaWFibGVzIGZvciB0aGUgZ2l2ZW4gcGF0aC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBwYXRoICAgICBUaGUgcGF0aCBvZiB0aGUgdmFyaWFibGUgdG8gbG9hZFxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHZhcmlhYmxlIFRoZSB2YXJpYWJsZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgbG9hZFZhcmlhYmxlIChwYXRoLCB2YXJpYWJsZSkge1xuICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9TVEFURScsIHN0YXRlOiAnYnVzeScgfSlcbiAgICByZXR1cm4gdGhpcy5fc2Vzc2lvbi5sb2FkVmFyaWFibGUoeyBwYXRoLCB2YXJpYWJsZSB9KS50aGVuKCh2YXJpYWJsZXMpID0+IHtcbiAgICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogJ1VQREFURV9WQVJJQUJMRVMnLFxuICAgICAgICAvLyB1cGRhdGluZyB2YXJpYWJsZSBhdCB0aGlzIHBhdGggLi4uXG4gICAgICAgIHBhdGgsXG4gICAgICAgIC8vIC4uLiByZXN1bHRlZCBpbiB0aGUgZm9sbG93aW5nIHZhcmlhYmxlc1xuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIC8vIGFkZCBpdCB0byBjdXJyZW50IHNlbGVjdGVkIHN0YWNrdHJhY2UgZW50cnlcbiAgICAgICAgc3RhY2t0cmFjZUluZGV4OiB0aGlzLl9zdG9yZS5nZXRTdGF0ZSgpLmRlbHZlLnNlbGVjdGVkU3RhY2t0cmFjZSxcbiAgICAgICAgc3RhdGU6ICd3YWl0aW5nJ1xuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBnaXZlbiBkZWJ1Z2dlciBpcyBzdGFydGVkLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzU3RhcnRlZCAoKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldFN0YXRlKClcbiAgICByZXR1cm4gc3RhdGUgIT09ICdub3RTdGFydGVkJyAmJiBzdGF0ZSAhPT0gJ3N0YXJ0aW5nJ1xuICB9XG5cbiAgaXNCdXN5ICgpIHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBzdGF0ZSA9PT0gJ2J1c3knIHx8IHN0YXRlID09PSAncnVubmluZydcbiAgfVxuXG4gIGdldFN0YXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmUuZ2V0U3RhdGUoKS5kZWx2ZS5zdGF0ZVxuICB9XG5cbiAgX2FkZE91dHB1dE1lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnQUREX09VVFBVVF9DT05URU5UJyxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgICAgICBtZXNzYWdlXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19