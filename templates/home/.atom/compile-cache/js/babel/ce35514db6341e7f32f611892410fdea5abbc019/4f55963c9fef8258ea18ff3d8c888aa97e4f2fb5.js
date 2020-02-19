Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./etch-component');

var _etchComponent2 = _interopRequireDefault(_etchComponent);

var _etchStoreComponent = require('./etch-store-component');

var _etchStoreComponent2 = _interopRequireDefault(_etchStoreComponent);

var _expandable = require('./expandable');

var _expandable2 = _interopRequireDefault(_expandable);

var _breakpoints = require('./breakpoints');

var _stacktrace = require('./stacktrace');

var _goroutines = require('./goroutines');

var _variables = require('./variables');

var _watchExpressions = require('./watch-expressions');

var _utils = require('./utils');

'use babel';
var Panel = (function (_EtchComponent) {
  _inherits(Panel, _EtchComponent);

  function Panel(props, children) {
    _classCallCheck(this, Panel);

    props.expanded = {
      stacktrace: true,
      goroutines: true,
      variables: true,
      watchExpressions: true,
      breakpoints: true
    };

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, props, children);
  }

  _createClass(Panel, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel' },
        this.renderConfigsOrCommands(),
        this.renderContent()
      );
    }
  }, {
    key: 'renderConfigsOrCommands',
    value: function renderConfigsOrCommands() {
      if (this.props.dbg.isStarted()) {
        return this.renderCommands();
      }
      return this.renderConfigs();
    }
  }, {
    key: 'renderConfigs',
    value: function renderConfigs() {
      var _props = this.props;
      var selectedConfig = _props.selectedConfig;
      var configurations = _props.configurations;

      var file = undefined;
      var configsByNames = {};

      configurations.forEach(function (c) {
        if (!c) {
          return;
        }
        c.configs.forEach(function (_ref) {
          var name = _ref.name;

          configsByNames[name] = true;
          if (name === selectedConfig) {
            file = c.file;
          }
        });
      });

      var options = [_etch2['default'].dom(
        'option',
        { key: 'no config', value: '', selected: selectedConfig === '' },
        'Select a config'
      )].concat(Object.keys(configsByNames).sort().map(function (name) {
        return _etch2['default'].dom(
          'option',
          { value: name, selected: selectedConfig === name },
          name
        );
      }));

      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-configs' },
        _etch2['default'].dom(
          'button',
          { type: 'button', className: 'btn go-debug-btn-flat', title: 'Start this configuration',
            onclick: this.handleStartConfig, disabled: selectedConfig === '' },
          _etch2['default'].dom('span', { className: 'icon-playback-play' })
        ),
        _etch2['default'].dom(
          'select',
          { onchange: this.handleSelectConfig },
          options
        ),
        _etch2['default'].dom(
          'button',
          { type: 'button', className: 'btn go-debug-btn-flat', title: 'Change configuration',
            onclick: this.handleEditConfig, disabled: !file, dataset: { file: file } },
          _etch2['default'].dom('span', { className: 'icon-gear' })
        )
      );
    }
  }, {
    key: 'renderCommands',
    value: function renderCommands() {
      var state = this.props.state;

      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-commands' },
        state === 'running' ? this.renderCommand('halt', 'playback-pause', 'Halt') : this.renderCommand('resume', 'playback-play', 'Resume'),
        this.renderCommand('next', 'arrow-right', 'Next'),
        this.renderCommand('stepIn', 'arrow-down', 'Step in'),
        this.renderCommand('stepOut', 'arrow-up', 'Step out'),
        this.renderCommand('stop', 'primitive-square', 'Stop'),
        this.renderCommand('restart', 'sync', 'Restart')
      );
    }
  }, {
    key: 'renderCommand',
    value: function renderCommand(cmd, icon, title) {
      return _etch2['default'].dom(
        'button',
        { key: cmd, type: 'button', className: 'btn go-debug-btn-flat',
          title: title, dataset: { cmd: cmd }, onclick: this.handleCommandClick },
        _etch2['default'].dom('span', { className: 'icon-' + icon })
      );
    }
  }, {
    key: 'renderContent',
    value: function renderContent() {
      var _props2 = this.props;
      var expanded = _props2.expanded;
      var store = _props2.store;
      var dbg = _props2.dbg;

      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-content' },
        _etch2['default'].dom(
          _expandable2['default'],
          { expanded: expanded.stacktrace, name: 'stacktrace', title: 'Stacktrace', onChange: this.handleExpandChange },
          _etch2['default'].dom(_stacktrace.StacktraceContainer, { store: store, dbg: dbg })
        ),
        _etch2['default'].dom(
          _expandable2['default'],
          { expanded: expanded.goroutines, name: 'goroutines', title: 'Goroutines', onChange: this.handleExpandChange },
          _etch2['default'].dom(_goroutines.GoroutinesContainer, { store: store, dbg: dbg })
        ),
        _etch2['default'].dom(
          _expandable2['default'],
          { expanded: expanded.variables, name: 'variables', title: 'Variables', onChange: this.handleExpandChange },
          _etch2['default'].dom(_variables.VariablesContainer, { store: store, dbg: dbg })
        ),
        _etch2['default'].dom(
          _expandable2['default'],
          { expanded: expanded.watchExpressions, name: 'watchExpressions', title: 'Watch expressions', onChange: this.handleExpandChange },
          _etch2['default'].dom(_watchExpressions.WatchExpressionsContainer, { store: store, dbg: dbg })
        ),
        _etch2['default'].dom(
          _expandable2['default'],
          { expanded: expanded.breakpoints, name: 'breakpoints', title: 'Breakpoints', onChange: this.handleExpandChange },
          _etch2['default'].dom(_breakpoints.BreakpointsContainer, { store: store, dbg: dbg })
        )
      );
    }
  }, {
    key: 'handleExpandChange',
    value: function handleExpandChange(name) {
      var expanded = Object.assign({}, this.props.expanded);
      expanded[name] = !expanded[name];
      this.update({ expanded: expanded });
    }
  }, {
    key: 'handleSelectConfig',
    value: function handleSelectConfig(ev) {
      this.props.store.dispatch({ type: 'SET_SELECTED_CONFIG', configName: ev.target.value });
    }
  }, {
    key: 'handleEditConfig',
    value: function handleEditConfig(ev) {
      var file = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.file');
      atom.workspace.open(file, { searchAllPanes: true });
    }
  }, {
    key: 'handleStartConfig',
    value: function handleStartConfig() {
      var _props3 = this.props;
      var selectedConfig = _props3.selectedConfig;
      var configurations = _props3.configurations;

      var config = configurations.reduce(function (v, c) {
        return c && c.configs.find(function (_ref2) {
          var name = _ref2.name;
          return name === selectedConfig;
        }) || v;
      }, null);
      var editor = (0, _utils.getEditor)();
      var file = editor && editor.getPath();
      this.props.dbg.start(config, file);
    }
  }, {
    key: 'handleCommandClick',
    value: function handleCommandClick(ev) {
      var command = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.cmd');
      atom.commands.dispatch(ev.target, 'go-debug:' + command);
    }
  }]);

  return Panel;
})(_etchComponent2['default']);

exports.Panel = Panel;

Panel.bindFns = ['handleExpandChange', 'handleCommandClick', 'handleSelectConfig', 'handleStartConfig', 'handleEditConfig'];

var PanelContainer = _etchStoreComponent2['default'].create(Panel, function (state) {
  return {
    configurations: state.configurations,
    selectedConfig: state.selectedConfig,
    state: state.delve.state
  };
});

exports.PanelContainer = PanelContainer;

var PanelManager = (function () {
  function PanelManager(store, dbg, commands) {
    var _this = this;

    _classCallCheck(this, PanelManager);

    this._store = store;
    this._dbg = dbg;
    this._commands = commands;

    // show the panel whenever the user starts a new session via the keyboard shortcut
    commands.onExecute = function (key) {
      if (key === 'start') {
        _this.togglePanel(true);
      }
    };

    this._subscriptions = new _atom.CompositeDisposable(atom.commands.add('atom-workspace', {
      'go-debug:toggle-panel': function goDebugTogglePanel() {
        return _this.togglePanel();
      }
    }));

    this.createPanel(atom.config.get('go-debug.panelInitialVisible') || false);
  }

  _createClass(PanelManager, [{
    key: 'dispose',
    value: function dispose() {
      var pane = atom.workspace.paneForItem(this._atomPanel);
      if (pane) {
        pane.destroyItem(this._atomPanel, true);
      }

      this._subscriptions.dispose();
      this._subscriptions = null;

      this._component = null;
      this._atomPanel = null;
    }
  }, {
    key: 'createPanel',
    value: function createPanel(visible) {
      if (!this._component) {
        this._component = new PanelContainer({ store: this._store, dbg: this._dbg });
        this._subscriptions.add(this._component);
      }
      this._atomPanel = {
        element: this._component.element,
        getURI: function getURI() {
          return 'atom://go-debug/panel';
        },
        getTitle: function getTitle() {
          return 'Debugger';
        },
        getDefaultLocation: function getDefaultLocation() {
          return 'right';
        },
        getAllowedLocations: function getAllowedLocations() {
          return ['right', 'left'];
        }
      };
      return atom.workspace.open(this._atomPanel, {
        activatePane: visible
      });
    }
  }, {
    key: 'togglePanel',
    value: function togglePanel(visible) {
      var paneContainer = atom.workspace.paneContainerForItem(this._atomPanel);
      if (!paneContainer) {
        this.createPanel(true);
        return;
      }
      if (visible === undefined) {
        visible = !paneContainer.isVisible();
      }
      if (visible) {
        paneContainer.show();
      } else {
        paneContainer.hide();
      }
    }
  }]);

  return PanelManager;
})();

exports.PanelManager = PanelManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOztvQkFFekIsTUFBTTs7Ozs2QkFDRyxrQkFBa0I7Ozs7a0NBQ2Isd0JBQXdCOzs7OzBCQUVoQyxjQUFjOzs7OzJCQUNBLGVBQWU7OzBCQUNoQixjQUFjOzswQkFDZCxjQUFjOzt5QkFDZixhQUFhOztnQ0FDTixxQkFBcUI7O3FCQUVkLFNBQVM7O0FBaEIxRCxXQUFXLENBQUE7SUFrQkUsS0FBSztZQUFMLEtBQUs7O0FBQ0osV0FERCxLQUFLLENBQ0gsS0FBSyxFQUFFLFFBQVEsRUFBRTswQkFEbkIsS0FBSzs7QUFFZCxTQUFLLENBQUMsUUFBUSxHQUFHO0FBQ2YsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGdCQUFVLEVBQUUsSUFBSTtBQUNoQixlQUFTLEVBQUUsSUFBSTtBQUNmLHNCQUFnQixFQUFFLElBQUk7QUFDdEIsaUJBQVcsRUFBRSxJQUFJO0tBQ2xCLENBQUE7O0FBRUQsK0JBVlMsS0FBSyw2Q0FVUixLQUFLLEVBQUUsUUFBUSxFQUFDO0dBQ3ZCOztlQVhVLEtBQUs7O1dBYVQsa0JBQUc7QUFDUixhQUFPOztVQUFLLFNBQVMsRUFBQyxnQkFBZ0I7UUFDbkMsSUFBSSxDQUFDLHVCQUF1QixFQUFFO1FBQzlCLElBQUksQ0FBQyxhQUFhLEVBQUU7T0FDakIsQ0FBQTtLQUNQOzs7V0FDdUIsbUNBQUc7QUFDekIsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUM5QixlQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtPQUM3QjtBQUNELGFBQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQzVCOzs7V0FDYSx5QkFBRzttQkFDNEIsSUFBSSxDQUFDLEtBQUs7VUFBN0MsY0FBYyxVQUFkLGNBQWM7VUFBRSxjQUFjLFVBQWQs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TyxHQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFBO09BQ3JDO0FBQ0QsVUFBSSxPQUFPLEVBQUU7QUFDWCxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ3JCLE1BQU07QUFDTCxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ3JCO0tBQ0Y7OztTQWxFVSxZQUFZIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgRXRjaFN0b3JlQ29tcG9uZW50IGZyb20gJy4vZXRjaC1zdG9yZS1jb21wb25lbnQnXG5cbmltcG9ydCBFeHBhbmRhYmxlIGZyb20gJy4vZXhwYW5kYWJsZSdcbmltcG9ydCB7IEJyZWFrcG9pbnRzQ29udGFpbmVyIH0gZnJvbSAnLi9icmVha3BvaW50cydcbmltcG9ydCB7IFN0YWNrdHJhY2VDb250YWluZXIgfSBmcm9tICcuL3N0YWNrdHJhY2UnXG5pbXBvcnQgeyBHb3JvdXRpbmVzQ29udGFpbmVyIH0gZnJvbSAnLi9nb3JvdXRpbmVzJ1xuaW1wb3J0IHsgVmFyaWFibGVzQ29udGFpbmVyIH0gZnJvbSAnLi92YXJpYWJsZXMnXG5pbXBvcnQgeyBXYXRjaEV4cHJlc3Npb25zQ29udGFpbmVyIH0gZnJvbSAnLi93YXRjaC1leHByZXNzaW9ucydcblxuaW1wb3J0IHsgZ2V0RWRpdG9yLCBlbGVtZW50UHJvcEluSGllcmFyY3kgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgUGFuZWwgZXh0ZW5kcyBFdGNoQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzLCBjaGlsZHJlbikge1xuICAgIHByb3BzLmV4cGFuZGVkID0ge1xuICAgICAgc3RhY2t0cmFjZTogdHJ1ZSxcbiAgICAgIGdvcm91dGluZXM6IHRydWUsXG4gICAgICB2YXJpYWJsZXM6IHRydWUsXG4gICAgICB3YXRjaEV4cHJlc3Npb25zOiB0cnVlLFxuICAgICAgYnJlYWtwb2ludHM6IHRydWVcbiAgICB9XG5cbiAgICBzdXBlcihwcm9wcywgY2hpbGRyZW4pXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwnPlxuICAgICAge3RoaXMucmVuZGVyQ29uZmlnc09yQ29tbWFuZHMoKX1cbiAgICAgIHt0aGlzLnJlbmRlckNvbnRlbnQoKX1cbiAgICA8L2Rpdj5cbiAgfVxuICByZW5kZXJDb25maWdzT3JDb21tYW5kcyAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZGJnLmlzU3RhcnRlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21tYW5kcygpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlbmRlckNvbmZpZ3MoKVxuICB9XG4gIHJlbmRlckNvbmZpZ3MgKCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRDb25maWcsIGNvbmZpZ3VyYXRpb25zIH0gPSB0aGlzLnByb3BzXG5cbiAgICBsZXQgZmlsZVxuICAgIGNvbnN0IGNvbmZpZ3NCeU5hbWVzID0ge31cblxuICAgIGNvbmZpZ3VyYXRpb25zLmZvckVhY2goKGMpID0+IHtcbiAgICAgIGlmICghYykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGMuY29uZmlncy5mb3JFYWNoKCh7IG5hbWUgfSkgPT4ge1xuICAgICAgICBjb25maWdzQnlOYW1lc1tuYW1lXSA9IHRydWVcbiAgICAgICAgaWYgKG5hbWUgPT09IHNlbGVjdGVkQ29uZmlnKSB7XG4gICAgICAgICAgZmlsZSA9IGMuZmlsZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBjb25zdCBvcHRpb25zID0gWzxvcHRpb24ga2V5PSdubyBjb25maWcnIHZhbHVlPScnIHNlbGVjdGVkPXtzZWxlY3RlZENvbmZpZyA9PT0gJyd9PlNlbGVjdCBhIGNvbmZpZzwvb3B0aW9uPl0uY29uY2F0KFxuICAgICAgT2JqZWN0LmtleXMoY29uZmlnc0J5TmFtZXMpLnNvcnQoKS5tYXAoXG4gICAgICAgIChuYW1lKSA9PiA8b3B0aW9uIHZhbHVlPXtuYW1lfSBzZWxlY3RlZD17c2VsZWN0ZWRDb25maWcgPT09IG5hbWV9PntuYW1lfTwvb3B0aW9uPlxuICAgICAgKVxuICAgIClcblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtY29uZmlncyc+XG4gICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdidG4gZ28tZGVidWctYnRuLWZsYXQnIHRpdGxlPSdTdGFydCB0aGlzIGNvbmZpZ3VyYXRpb24nXG4gICAgICAgIG9uY2xpY2s9e3RoaXMuaGFuZGxlU3RhcnRDb25maWd9IGRpc2FibGVkPXtzZWxlY3RlZENvbmZpZyA9PT0gJyd9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2ljb24tcGxheWJhY2stcGxheScgLz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPHNlbGVjdCBvbmNoYW5nZT17dGhpcy5oYW5kbGVTZWxlY3RDb25maWd9PntvcHRpb25zfTwvc2VsZWN0PlxuICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGdvLWRlYnVnLWJ0bi1mbGF0JyB0aXRsZT0nQ2hhbmdlIGNvbmZpZ3VyYXRpb24nXG4gICAgICAgIG9uY2xpY2s9e3RoaXMuaGFuZGxlRWRpdENvbmZpZ30gZGlzYWJsZWQ9eyFmaWxlfSBkYXRhc2V0PXt7IGZpbGUgfX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naWNvbi1nZWFyJyAvPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIH1cbiAgcmVuZGVyQ29tbWFuZHMgKCkge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IHRoaXMucHJvcHNcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dvLWRlYnVnLXBhbmVsLWNvbW1hbmRzJz5cbiAgICAgIHtzdGF0ZSA9PT0gJ3J1bm5pbmcnXG4gICAgICAgID8gdGhpcy5yZW5kZXJDb21tYW5kKCdoYWx0JywgJ3BsYXliYWNrLXBhdXNlJywgJ0hhbHQnKVxuICAgICAgICA6IHRoaXMucmVuZGVyQ29tbWFuZCgncmVzdW1lJywgJ3BsYXliYWNrLXBsYXknLCAnUmVzdW1lJyl9XG4gICAgICB7dGhpcy5yZW5kZXJDb21tYW5kKCduZXh0JywgJ2Fycm93LXJpZ2h0JywgJ05leHQnKX1cbiAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmQoJ3N0ZXBJbicsICdhcnJvdy1kb3duJywgJ1N0ZXAgaW4nKX1cbiAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmQoJ3N0ZXBPdXQnLCAnYXJyb3ctdXAnLCAnU3RlcCBvdXQnKX1cbiAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmQoJ3N0b3AnLCAncHJpbWl0aXZlLXNxdWFyZScsICdTdG9wJyl9XG4gICAgICB7dGhpcy5yZW5kZXJDb21tYW5kKCdyZXN0YXJ0JywgJ3N5bmMnLCAnUmVzdGFydCcpfVxuICAgIDwvZGl2PlxuICB9XG4gIHJlbmRlckNvbW1hbmQgKGNtZCwgaWNvbiwgdGl0bGUpIHtcbiAgICByZXR1cm4gPGJ1dHRvbiBrZXk9e2NtZH0gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2J0biBnby1kZWJ1Zy1idG4tZmxhdCdcbiAgICAgIHRpdGxlPXt0aXRsZX0gZGF0YXNldD17eyBjbWQgfX0gb25jbGljaz17dGhpcy5oYW5kbGVDb21tYW5kQ2xpY2t9PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXsnaWNvbi0nICsgaWNvbn0gLz5cbiAgICA8L2J1dHRvbj5cbiAgfVxuXG4gIHJlbmRlckNvbnRlbnQgKCkge1xuICAgIGNvbnN0IHsgZXhwYW5kZWQsIHN0b3JlLCBkYmcgfSA9IHRoaXMucHJvcHNcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dvLWRlYnVnLXBhbmVsLWNvbnRlbnQnPlxuICAgICAgPEV4cGFuZGFibGUgZXhwYW5kZWQ9e2V4cGFuZGVkLnN0YWNrdHJhY2V9IG5hbWU9J3N0YWNrdHJhY2UnIHRpdGxlPSdTdGFja3RyYWNlJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBhbmRDaGFuZ2V9PlxuICAgICAgICA8U3RhY2t0cmFjZUNvbnRhaW5lciBzdG9yZT17c3RvcmV9IGRiZz17ZGJnfSAvPlxuICAgICAgPC9FeHBhbmRhYmxlPlxuICAgICAgPEV4cGFuZGFibGUgZXhwYW5kZWQ9e2V4cGFuZGVkLmdvcm91dGluZXN9IG5hbWU9J2dvcm91dGluZXMnIHRpdGxlPSdHb3JvdXRpbmVzJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBhbmRDaGFuZ2V9PlxuICAgICAgICA8R29yb3V0aW5lc0NvbnRhaW5lciBzdG9yZT17c3RvcmV9IGRiZz17ZGJnfSAvPlxuICAgICAgPC9FeHBhbmRhYmxlPlxuICAgICAgPEV4cGFuZGFibGUgZXhwYW5kZWQ9e2V4cGFuZGVkLnZhcmlhYmxlc30gbmFtZT0ndmFyaWFibGVzJyB0aXRsZT0nVmFyaWFibGVzJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBhbmRDaGFuZ2V9PlxuICAgICAgICA8VmFyaWFibGVzQ29udGFpbmVyIHN0b3JlPXtzdG9yZX0gZGJnPXtkYmd9IC8+XG4gICAgICA8L0V4cGFuZGFibGU+XG4gICAgICA8RXhwYW5kYWJsZSBleHBhbmRlZD17ZXhwYW5kZWQud2F0Y2hFeHByZXNzaW9uc30gbmFtZT0nd2F0Y2hFeHByZXNzaW9ucycgdGl0bGU9J1dhdGNoIGV4cHJlc3Npb25zJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBhbmRDaGFuZ2V9PlxuICAgICAgICA8V2F0Y2hFeHByZXNzaW9uc0NvbnRhaW5lciBzdG9yZT17c3RvcmV9IGRiZz17ZGJnfSAvPlxuICAgICAgPC9FeHBhbmRhYmxlPlxuICAgICAgPEV4cGFuZGFibGUgZXhwYW5kZWQ9e2V4cGFuZGVkLmJyZWFrcG9pbnRzfSBuYW1lPSdicmVha3BvaW50cycgdGl0bGU9J0JyZWFrcG9pbnRzJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBhbmRDaGFuZ2V9PlxuICAgICAgICA8QnJlYWtwb2ludHNDb250YWluZXIgc3RvcmU9e3N0b3JlfSBkYmc9e2RiZ30gLz5cbiAgICAgIDwvRXhwYW5kYWJsZT5cbiAgICA8L2Rpdj5cbiAgfVxuXG4gIGhhbmRsZUV4cGFuZENoYW5nZSAobmFtZSkge1xuICAgIGNvbnN0IGV4cGFuZGVkID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5leHBhbmRlZClcbiAgICBleHBhbmRlZFtuYW1lXSA9ICFleHBhbmRlZFtuYW1lXVxuICAgIHRoaXMudXBkYXRlKHsgZXhwYW5kZWQgfSlcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdENvbmZpZyAoZXYpIHtcbiAgICB0aGlzLnByb3BzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9TRUxFQ1RFRF9DT05GSUcnLCBjb25maWdOYW1lOiBldi50YXJnZXQudmFsdWUgfSlcbiAgfVxuXG4gIGhhbmRsZUVkaXRDb25maWcgKGV2KSB7XG4gICAgY29uc3QgZmlsZSA9IGVsZW1lbnRQcm9wSW5IaWVyYXJjeShldi50YXJnZXQsICdkYXRhc2V0LmZpbGUnKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZSwgeyBzZWFyY2hBbGxQYW5lczogdHJ1ZSB9KVxuICB9XG5cbiAgaGFuZGxlU3RhcnRDb25maWcgKCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRDb25maWcsIGNvbmZpZ3VyYXRpb25zIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgY29uZmlnID0gY29uZmlndXJhdGlvbnMucmVkdWNlKFxuICAgICAgKHYsIGMpID0+IChjICYmIGMuY29uZmlncy5maW5kKCh7IG5hbWUgfSkgPT4gbmFtZSA9PT0gc2VsZWN0ZWRDb25maWcpKSB8fCB2LFxuICAgICAgbnVsbFxuICAgIClcbiAgICBjb25zdCBlZGl0b3IgPSBnZXRFZGl0b3IoKVxuICAgIGNvbnN0IGZpbGUgPSBlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKVxuICAgIHRoaXMucHJvcHMuZGJnLnN0YXJ0KGNvbmZpZywgZmlsZSlcbiAgfVxuXG4gIGhhbmRsZUNvbW1hbmRDbGljayAoZXYpIHtcbiAgICBjb25zdCBjb21tYW5kID0gZWxlbWVudFByb3BJbkhpZXJhcmN5KGV2LnRhcmdldCwgJ2RhdGFzZXQuY21kJylcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGV2LnRhcmdldCwgJ2dvLWRlYnVnOicgKyBjb21tYW5kKVxuICB9XG59XG5QYW5lbC5iaW5kRm5zID0gW1xuICAnaGFuZGxlRXhwYW5kQ2hhbmdlJywgJ2hhbmRsZUNvbW1hbmRDbGljaycsXG4gICdoYW5kbGVTZWxlY3RDb25maWcnLCAnaGFuZGxlU3RhcnRDb25maWcnLCAnaGFuZGxlRWRpdENvbmZpZydcbl1cblxuZXhwb3J0IGNvbnN0IFBhbmVsQ29udGFpbmVyID0gRXRjaFN0b3JlQ29tcG9uZW50LmNyZWF0ZShcbiAgUGFuZWwsXG4gIChzdGF0ZSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uczogc3RhdGUuY29uZmlndXJhdGlvbnMsXG4gICAgICBzZWxlY3RlZENvbmZpZzogc3RhdGUuc2VsZWN0ZWRDb25maWcsXG4gICAgICBzdGF0ZTogc3RhdGUuZGVsdmUuc3RhdGVcbiAgICB9XG4gIH1cbilcblxuZXhwb3J0IGNsYXNzIFBhbmVsTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yIChzdG9yZSwgZGJnLCBjb21tYW5kcykge1xuICAgIHRoaXMuX3N0b3JlID0gc3RvcmVcbiAgICB0aGlzLl9kYmcgPSBkYmdcbiAgICB0aGlzLl9jb21tYW5kcyA9IGNvbW1hbmRzXG5cbiAgICAvLyBzaG93IHRoZSBwYW5lbCB3aGVuZXZlciB0aGUgdXNlciBzdGFydHMgYSBuZXcgc2Vzc2lvbiB2aWEgdGhlIGtleWJvYXJkIHNob3J0Y3V0XG4gICAgY29tbWFuZHMub25FeGVjdXRlID0gKGtleSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICB0aGlzLnRvZ2dsZVBhbmVsKHRydWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnZ28tZGVidWc6dG9nZ2xlLXBhbmVsJzogKCkgPT4gdGhpcy50b2dnbGVQYW5lbCgpXG4gICAgICB9KVxuICAgIClcblxuICAgIHRoaXMuY3JlYXRlUGFuZWwoYXRvbS5jb25maWcuZ2V0KCdnby1kZWJ1Zy5wYW5lbEluaXRpYWxWaXNpYmxlJykgfHwgZmFsc2UpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcy5fYXRvbVBhbmVsKVxuICAgIGlmIChwYW5lKSB7XG4gICAgICBwYW5lLmRlc3Ryb3lJdGVtKHRoaXMuX2F0b21QYW5lbCwgdHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgICB0aGlzLl9jb21wb25lbnQgPSBudWxsXG4gICAgdGhpcy5fYXRvbVBhbmVsID0gbnVsbFxuICB9XG5cbiAgY3JlYXRlUGFuZWwgKHZpc2libGUpIHtcbiAgICBpZiAoIXRoaXMuX2NvbXBvbmVudCkge1xuICAgICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IFBhbmVsQ29udGFpbmVyKHsgc3RvcmU6IHRoaXMuX3N0b3JlLCBkYmc6IHRoaXMuX2RiZyB9KVxuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5fY29tcG9uZW50KVxuICAgIH1cbiAgICB0aGlzLl9hdG9tUGFuZWwgPSB7XG4gICAgICBlbGVtZW50OiB0aGlzLl9jb21wb25lbnQuZWxlbWVudCxcbiAgICAgIGdldFVSSTogKCkgPT4gJ2F0b206Ly9nby1kZWJ1Zy9wYW5lbCcsXG4gICAgICBnZXRUaXRsZTogKCkgPT4gJ0RlYnVnZ2VyJyxcbiAgICAgIGdldERlZmF1bHRMb2NhdGlvbjogKCkgPT4gJ3JpZ2h0JyxcbiAgICAgIGdldEFsbG93ZWRMb2NhdGlvbnM6ICgpID0+IFsncmlnaHQnLCAnbGVmdCddXG4gICAgfVxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKHRoaXMuX2F0b21QYW5lbCwge1xuICAgICAgYWN0aXZhdGVQYW5lOiB2aXNpYmxlXG4gICAgfSlcbiAgfVxuXG4gIHRvZ2dsZVBhbmVsICh2aXNpYmxlKSB7XG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMuX2F0b21QYW5lbClcbiAgICBpZiAoIXBhbmVDb250YWluZXIpIHtcbiAgICAgIHRoaXMuY3JlYXRlUGFuZWwodHJ1ZSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodmlzaWJsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aXNpYmxlID0gIXBhbmVDb250YWluZXIuaXNWaXNpYmxlKClcbiAgICB9XG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIHBhbmVDb250YWluZXIuc2hvdygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVDb250YWluZXIuaGlkZSgpXG4gICAgfVxuICB9XG59XG4iXX0=