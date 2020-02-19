Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utils = require('./utils');

var _breakpointCondition = require('./breakpoint-condition');

var _storeUtils = require('./store-utils');

'use babel';

function currentFile() {
  var editor = (0, _utils.getEditor)();
  return editor && editor.getPath();
}

function currentLine() {
  var editor = (0, _utils.getEditor)();
  return editor && editor.getCursorBufferPosition().row;
}

var commands = {
  'start': function start(store, dbg) {
    var _store$getState = store.getState();

    var selectedConfig = _store$getState.selectedConfig;
    var configurations = _store$getState.configurations;

    var config = undefined;
    if (selectedConfig) {
      config = configurations.reduce(function (v, c) {
        return c && c.configs.find(function (_ref) {
          var name = _ref.name;
          return name === selectedConfig;
        }) || v;
      }, null);
    }
    dbg.start(config, currentFile());
  },
  'resume': function resume(store, dbg) {
    return dbg.resume();
  },
  'halt': function halt(store, dbg) {
    return dbg.halt();
  },
  'next': function next(store, dbg) {
    return dbg.next();
  },
  'stepIn': function stepIn(store, dbg) {
    return dbg.stepIn();
  },
  'stepOut': function stepOut(store, dbg) {
    return dbg.stepOut();
  },
  'restart': function restart(store, dbg) {
    return dbg.restart();
  },
  'stop': function stop(store, dbg) {
    return dbg.stop();
  },
  'toggle-breakpoint': function toggleBreakpoint(store, dbg) {
    var file = currentFile();
    if (!file) {
      return;
    }
    dbg.toggleBreakpoint(file, currentLine());
  }
};

var Commands = (function () {
  function Commands(store, dbg) {
    var _this = this;

    _classCallCheck(this, Commands);

    this._store = store;
    this._dbg = dbg;

    this._keyboardCommands = {};
    Object.keys(commands).forEach(function (cmd) {
      _this._keyboardCommands['go-debug:' + cmd] = _this.execute.bind(_this, cmd);
    });

    this._subscriptions = new _atom.CompositeDisposable();
    this._subscriptions.add(atom.config.observe('go-debug.limitCommandsToGo', this.observeCommandsLimit.bind(this)), atom.commands.add('atom-workspace', {
      'go-debug:edit-breakpoint-condition': this.handleBreakpointCondition.bind(this)
    }));
  }

  _createClass(Commands, [{
    key: 'execute',
    value: function execute(n) {
      if (this.onExecute) {
        this.onExecute(n);
      }
      commands[n](this._store, this._dbg);
    }
  }, {
    key: 'observeCommandsLimit',
    value: function observeCommandsLimit(limitCommandsToGo) {
      if (this._keyboardSubscription) {
        this._subscriptions.remove(this._keyboardSubscription);
        this._keyboardSubscription.dispose();
      }

      var selector = 'atom-workspace';
      if (limitCommandsToGo === true) {
        selector = 'atom-text-editor[data-grammar~=\'go\']';
      }
      this._keyboardSubscription = atom.commands.add(selector + ', .go-debug-panel, .go-debug-output', this._keyboardCommands);
      this._subscriptions.add(this._keyboardSubscription);
    }
  }, {
    key: 'handleBreakpointCondition',
    value: function handleBreakpointCondition(ev) {
      var _this2 = this;

      var name = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.name');
      if (!name) {
        return;
      }
      var bp = (0, _storeUtils.getBreakpointByName)(this._store, name);
      (0, _breakpointCondition.editBreakpointCondition)(bp).then(function (cond) {
        _this2._dbg.editBreakpoint(name, { cond: cond });
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
      this._subscriptions = null;
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ08sU0FBUzs7bUNBQ2xCLHdCQUF3Qjs7MEJBQzVCLGVBQWU7O0FBTG5ELFdBQVcsQ0FBQTs7QUFPWCxTQUFTLFdBQVcsR0FBSTtBQUN0QixNQUFNLE1BQU0sR0FBRyx1QkFBVyxDQUFBO0FBQzFCLFNBQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtDQUNsQzs7QUFFRCxTQUFTLFdBQVcsR0FBSTtBQUN0QixNQUFNLE1BQU0sR0FBRyx1QkFBVyxDQUFBO0FBQzFCLFNBQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLEdBQUcsQ0FBQTtDQUN0RDs7QUFFRCxJQUFNLFFBQVEsR0FBRztBQUNmLFNBQU8sRUFBRSxlQUFDLEtBQUssRUFBRSxHQUFHLEVBQUs7MEJBQ29CLEtBQUssQ0FBQyxRQUFRLEVBQUU7O1FBQW5ELGNBQWMsbUJBQWQsY0FBYztRQUFFLGNBQWMsbUJBQWQsY0FBYzs7QUFDdEMsUUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLFFBQUksY0FBYyxFQUFFO0FBQ2xCLFlBQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUM1QixVQUFDLENBQUMsRUFBRSxDQUFDO2VBQUssQUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFRO2NBQU4sSUFBSSxHQUFOLElBQVEsQ0FBTixJQUFJO2lCQUFPLElBQUksS0FBSyxjQUFjO1NBQUEsQ0FBQyxJQUFLLENBQUM7T0FBQSxFQUMzRSxJQUFJLENBQ0wsQ0FBQTtLQUNGO0FBQ0QsT0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtHQUNqQztBQUNELFVBQVEsRUFBRSxnQkFBQyxLQUFLLEVBQUUsR0FBRztXQUFL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QyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3hILFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FFeUIsbUNBQUMsRUFBRSxFQUFFOzs7QUFDN0IsVUFBTSxJQUFJLEdBQUcsa0NBQXNCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFDN0QsVUFBSSxDQUFDLElBQUksRUFBRTtBQUNULGVBQU07T0FDUDtBQUNELFVBQU0sRUFBRSxHQUFHLHFDQUFvQixJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pELHdEQUF3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDekMsZUFBSyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQyxDQUFBO09BQ3pDLENBQUMsQ0FBQTtLQUNIOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDN0IsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7S0FDM0I7OztTQXBEa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2NvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBnZXRFZGl0b3IsIGVsZW1lbnRQcm9wSW5IaWVyYXJjeSB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBlZGl0QnJlYWtwb2ludENvbmRpdGlvbiB9IGZyb20gJy4vYnJlYWtwb2ludC1jb25kaXRpb24nXG5pbXBvcnQgeyBnZXRCcmVha3BvaW50QnlOYW1lIH0gZnJvbSAnLi9zdG9yZS11dGlscydcblxuZnVuY3Rpb24gY3VycmVudEZpbGUgKCkge1xuICBjb25zdCBlZGl0b3IgPSBnZXRFZGl0b3IoKVxuICByZXR1cm4gZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKClcbn1cblxuZnVuY3Rpb24gY3VycmVudExpbmUgKCkge1xuICBjb25zdCBlZGl0b3IgPSBnZXRFZGl0b3IoKVxuICByZXR1cm4gZWRpdG9yICYmIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvd1xufVxuXG5jb25zdCBjb21tYW5kcyA9IHtcbiAgJ3N0YXJ0JzogKHN0b3JlLCBkYmcpID0+IHtcbiAgICBjb25zdCB7IHNlbGVjdGVkQ29uZmlnLCBjb25maWd1cmF0aW9ucyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGxldCBjb25maWdcbiAgICBpZiAoc2VsZWN0ZWRDb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ3VyYXRpb25zLnJlZHVjZShcbiAgICAgICAgKHYsIGMpID0+IChjICYmIGMuY29uZmlncy5maW5kKCh7IG5hbWUgfSkgPT4gbmFtZSA9PT0gc2VsZWN0ZWRDb25maWcpKSB8fCB2LFxuICAgICAgICBudWxsXG4gICAgICApXG4gICAgfVxuICAgIGRiZy5zdGFydChjb25maWcsIGN1cnJlbnRGaWxlKCkpXG4gIH0sXG4gICdyZXN1bWUnOiAoc3RvcmUsIGRiZykgPT4gZGJnLnJlc3VtZSgpLFxuICAnaGFsdCc6IChzdG9yZSwgZGJnKSA9PiBkYmcuaGFsdCgpLFxuICAnbmV4dCc6IChzdG9yZSwgZGJnKSA9PiBkYmcubmV4dCgpLFxuICAnc3RlcEluJzogKHN0b3JlLCBkYmcpID0+IGRiZy5zdGVwSW4oKSxcbiAgJ3N0ZXBPdXQnOiAoc3RvcmUsIGRiZykgPT4gZGJnLnN0ZXBPdXQoKSxcbiAgJ3Jlc3RhcnQnOiAoc3RvcmUsIGRiZykgPT4gZGJnLnJlc3RhcnQoKSxcbiAgJ3N0b3AnOiAoc3RvcmUsIGRiZykgPT4gZGJnLnN0b3AoKSxcbiAgJ3RvZ2dsZS1icmVha3BvaW50JzogKHN0b3JlLCBkYmcpID0+IHtcbiAgICBjb25zdCBmaWxlID0gY3VycmVudEZpbGUoKVxuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGRiZy50b2dnbGVCcmVha3BvaW50KGZpbGUsIGN1cnJlbnRMaW5lKCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZHMge1xuICBjb25zdHJ1Y3RvciAoc3RvcmUsIGRiZykge1xuICAgIHRoaXMuX3N0b3JlID0gc3RvcmVcbiAgICB0aGlzLl9kYmcgPSBkYmdcblxuICAgIHRoaXMuX2tleWJvYXJkQ29tbWFuZHMgPSB7fVxuICAgIE9iamVjdC5rZXlzKGNvbW1hbmRzKS5mb3JFYWNoKChjbWQpID0+IHsgdGhpcy5fa2V5Ym9hcmRDb21tYW5kc1snZ28tZGVidWc6JyArIGNtZF0gPSB0aGlzLmV4ZWN1dGUuYmluZCh0aGlzLCBjbWQpIH0pXG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZ28tZGVidWcubGltaXRDb21tYW5kc1RvR28nLCB0aGlzLm9ic2VydmVDb21tYW5kc0xpbWl0LmJpbmQodGhpcykpLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnZ28tZGVidWc6ZWRpdC1icmVha3BvaW50LWNvbmRpdGlvbic6IHRoaXMuaGFuZGxlQnJlYWtwb2ludENvbmRpdGlvbi5iaW5kKHRoaXMpXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGV4ZWN1dGUgKG4pIHtcbiAgICBpZiAodGhpcy5vbkV4ZWN1dGUpIHtcbiAgICAgIHRoaXMub25FeGVjdXRlKG4pXG4gICAgfVxuICAgIGNvbW1hbmRzW25dKHRoaXMuX3N0b3JlLCB0aGlzLl9kYmcpXG4gIH1cblxuICBvYnNlcnZlQ29tbWFuZHNMaW1pdCAobGltaXRDb21tYW5kc1RvR28pIHtcbiAgICBpZiAodGhpcy5fa2V5Ym9hcmRTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucmVtb3ZlKHRoaXMuX2tleWJvYXJkU3Vic2NyaXB0aW9uKVxuICAgICAgdGhpcy5fa2V5Ym9hcmRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdG9yID0gJ2F0b20td29ya3NwYWNlJ1xuICAgIGlmIChsaW1pdENvbW1hbmRzVG9HbyA9PT0gdHJ1ZSkge1xuICAgICAgc2VsZWN0b3IgPSAnYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXJ+PVxcJ2dvXFwnXSdcbiAgICB9XG4gICAgdGhpcy5fa2V5Ym9hcmRTdWJzY3JpcHRpb24gPSBhdG9tLmNvbW1hbmRzLmFkZChzZWxlY3RvciArICcsIC5nby1kZWJ1Zy1wYW5lbCwgLmdvLWRlYnVnLW91dHB1dCcsIHRoaXMuX2tleWJvYXJkQ29tbWFuZHMpXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5fa2V5Ym9hcmRTdWJzY3JpcHRpb24pXG4gIH1cblxuICBoYW5kbGVCcmVha3BvaW50Q29uZGl0aW9uIChldikge1xuICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5uYW1lJylcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBicCA9IGdldEJyZWFrcG9pbnRCeU5hbWUodGhpcy5fc3RvcmUsIG5hbWUpXG4gICAgZWRpdEJyZWFrcG9pbnRDb25kaXRpb24oYnApLnRoZW4oKGNvbmQpID0+IHtcbiAgICAgIHRoaXMuX2RiZy5lZGl0QnJlYWtwb2ludChuYW1lLCB7IGNvbmQgfSlcbiAgICB9KVxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbFxuICB9XG59XG4iXX0=