Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./etch-component');

var _etchComponent2 = _interopRequireDefault(_etchComponent);

var _etchStoreComponent = require('./etch-store-component');

var _etchStoreComponent2 = _interopRequireDefault(_etchStoreComponent);

var _storeUtils = require('./store-utils');

var _utils = require('./utils');

'use babel';
var Breakpoints = (function (_EtchComponent) {
  _inherits(Breakpoints, _EtchComponent);

  function Breakpoints() {
    _classCallCheck(this, Breakpoints);

    _get(Object.getPrototypeOf(Breakpoints.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Breakpoints, [{
    key: 'render',
    value: function render() {
      var _this = this;

      var _props$breakpoints = this.props.breakpoints;
      var breakpoints = _props$breakpoints === undefined ? [] : _props$breakpoints;

      var items = breakpoints.map(function (bp) {
        var name = bp.name;
        var file = bp.file;
        var line = bp.line;
        var state = bp.state;
        var message = bp.message;

        return _etch2['default'].dom(
          'div',
          { key: name, dataset: { name: name, file: file, line: line }, title: message || '', onclick: _this.handleBreakpointClick },
          _etch2['default'].dom(
            'button',
            { className: 'btn go-debug-btn-flat', onClick: _this.handleRemoveBreakpointClick },
            _etch2['default'].dom('span', { className: 'go-debug-icon icon icon-x' })
          ),
          _etch2['default'].dom('span', { className: 'go-debug-breakpoint go-debug-breakpoint-state-' + state }),
          (0, _utils.location)(bp)
        );
      });
      if (items.length === 0) {
        return _etch2['default'].dom(
          'div',
          { className: 'go-debug-panel-breakpoints-empty' },
          'No breakpoints'
        );
      }
      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-breakpoints' },
        items
      );
    }
  }, {
    key: 'handleBreakpointClick',
    value: function handleBreakpointClick(ev) {
      var _this2 = this;

      var file = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.file');
      if (file) {
        (function () {
          var line = +(0, _utils.elementPropInHierarcy)(ev.target, 'dataset.line');
          // check if the file even exists
          _this2.fileExists(file).then(function (exists) {
            if (exists) {
              (0, _utils.openFile)(file, line);
            } else {
              _this2.removeBreakpoints(file);
            }
          });
        })();
      }
    }
  }, {
    key: 'handleRemoveBreakpointClick',
    value: function handleRemoveBreakpointClick(ev) {
      var name = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.name');
      if (name) {
        this.props.dbg.removeBreakpoint(name);
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  }, {
    key: 'fileExists',
    value: function fileExists(file) {
      return new Promise(function (resolve) {
        fs.stat(file, function (err) {
          return resolve(!err);
        });
      });
    }
  }, {
    key: 'removeBreakpoints',
    value: function removeBreakpoints(file) {
      var _this3 = this;

      var noti = atom.notifications.addWarning('The file ' + file + ' does not exist anymore.', {
        dismissable: true,
        detail: 'Remove all breakpoints for this file?',
        buttons: [{
          text: 'Yes',
          onDidClick: function onDidClick() {
            noti.dismiss();
            (0, _storeUtils.getBreakpoints)(_this3.props.store, file).forEach(function (bp) {
              return _this3.props.dbg.removeBreakpoint(bp.name);
            });
          }
        }, {
          text: 'No',
          onDidClick: function onDidClick() {
            return noti.dismiss();
          }
        }]
      });
    }
  }]);

  return Breakpoints;
})(_etchComponent2['default']);

exports.Breakpoints = Breakpoints;

Breakpoints.bindFns = ['handleBreakpointClick', 'handleRemoveBreakpointClick'];

var BreakpointsContainer = _etchStoreComponent2['default'].create(Breakpoints, function (state) {
  var delve = state.delve;

  return {
    breakpoints: delve.breakpoints
  };
});
exports.BreakpointsContainer = BreakpointsContainer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9icmVha3BvaW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBR29CLElBQUk7O0lBQVosRUFBRTs7b0JBQ0csTUFBTTs7Ozs2QkFDRyxrQkFBa0I7Ozs7a0NBQ2Isd0JBQXdCOzs7OzBCQUV4QixlQUFlOztxQkFDWSxTQUFTOztBQVRuRSxXQUFXLENBQUE7SUFXRSxXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7OztlQUFYLFdBQVc7O1dBQ2Ysa0JBQUc7OzsrQkFDcUIsSUFBSSxDQUFDLEtBQUssQ0FBL0IsV0FBVztVQUFYLFdBQVcsc0NBQUcsRUFBRTs7QUFDeEIsVUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQUUsRUFBSztZQUM1QixJQUFJLEdBQWlDLEVBQUUsQ0FBdkMsSUFBSTtZQUFFLElBQUksR0FBMkIsRUFBRSxDQUFqQyxJQUFJO1lBQUUsSUFBSSxHQUFxQixFQUFFLENBQTNCLElBQUk7WUFBRSxLQUFLLEdBQWMsRUFBRSxDQUFyQixLQUFLO1lBQUUsT0FBTyxHQUFLLEVBQUUsQ0FBZCxPQUFPOztBQUN4QyxlQUFPOztZQUFLLEdBQUcsRUFBRSxJQUFJLEFBQUMsRUFBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxBQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sSUFBSSxFQUFFLEFBQUMsRUFBQyxPQUFPLEVBQUUsTUFBSyxxQkFBcUIsQUFBQztVQUM5Rzs7Y0FBUSxTQUFTLEVBQUMsdUJBQXVCLEVBQUMsT0FBTyxFQUFFLE1BQUssMkJBQTJCLEFBQUM7WUFDbEYsZ0NBQU0sU0FBUyxFQUFDLDJCQUEyQixHQUFHO1dBQ3ZDO1VBQ1QsZ0NBQU0sU0FBUyxFQUFFLGdEQUFn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bGliL2JyZWFrcG9pbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgRXRjaFN0b3JlQ29tcG9uZW50IGZyb20gJy4vZXRjaC1zdG9yZS1jb21wb25lbnQnXG5cbmltcG9ydCB7IGdldEJyZWFrcG9pbnRzIH0gZnJvbSAnLi9zdG9yZS11dGlscydcbmltcG9ydCB7IGxvY2F0aW9uLCBlbGVtZW50UHJvcEluSGllcmFyY3ksIG9wZW5GaWxlIH0gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRzIGV4dGVuZHMgRXRjaENvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBicmVha3BvaW50cyA9IFtdIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgaXRlbXMgPSBicmVha3BvaW50cy5tYXAoKGJwKSA9PiB7XG4gICAgICBjb25zdCB7IG5hbWUsIGZpbGUsIGxpbmUsIHN0YXRlLCBtZXNzYWdlIH0gPSBicFxuICAgICAgcmV0dXJuIDxkaXYga2V5PXtuYW1lfSBkYXRhc2V0PXt7IG5hbWUsIGZpbGUsIGxpbmUgfX0gdGl0bGU9e21lc3NhZ2UgfHwgJyd9IG9uY2xpY2s9e3RoaXMuaGFuZGxlQnJlYWtwb2ludENsaWNrfT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0biBnby1kZWJ1Zy1idG4tZmxhdCcgb25DbGljaz17dGhpcy5oYW5kbGVSZW1vdmVCcmVha3BvaW50Q2xpY2t9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nZ28tZGVidWctaWNvbiBpY29uIGljb24teCcgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17J2dvLWRlYnVnLWJyZWFrcG9pbnQgZ28tZGVidWctYnJlYWtwb2ludC1zdGF0ZS0nICsgc3RhdGV9IC8+XG4gICAgICAgIHtsb2NhdGlvbihicCl9XG4gICAgICA8L2Rpdj5cbiAgICB9KVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtYnJlYWtwb2ludHMtZW1wdHknPk5vIGJyZWFrcG9pbnRzPC9kaXY+XG4gICAgfVxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtYnJlYWtwb2ludHMnPlxuICAgICAge2l0ZW1zfVxuICAgIDwvZGl2PlxuICB9XG5cbiAgaGFuZGxlQnJlYWtwb2ludENsaWNrIChldikge1xuICAgIGNvbnN0IGZpbGUgPSBlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5maWxlJylcbiAgICBpZiAoZmlsZSkge1xuICAgICAgY29uc3QgbGluZSA9ICtlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5saW5lJylcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBmaWxlIGV2ZW4gZXhpc3RzXG4gICAgICB0aGlzLmZpbGVFeGlzdHMoZmlsZSlcbiAgICAgICAgLnRoZW4oKGV4aXN0cykgPT4ge1xuICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgIG9wZW5GaWxlKGZpbGUsIGxpbmUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQnJlYWtwb2ludHMoZmlsZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICB9XG4gIGhhbmRsZVJlbW92ZUJyZWFrcG9pbnRDbGljayAoZXYpIHtcbiAgICBjb25zdCBuYW1lID0gZWxlbWVudFByb3BJbkhpZXJhcmN5KGV2LnRhcmdldCwgJ2RhdGFzZXQubmFtZScpXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHRoaXMucHJvcHMuZGJnLnJlbW92ZUJyZWFrcG9pbnQobmFtZSlcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfVxuICB9XG5cbiAgZmlsZUV4aXN0cyAoZmlsZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgZnMuc3RhdChmaWxlLCAoZXJyKSA9PiByZXNvbHZlKCFlcnIpKVxuICAgIH0pXG4gIH1cblxuICByZW1vdmVCcmVha3BvaW50cyAoZmlsZSkge1xuICAgIGNvbnN0IG5vdGkgPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgIGBUaGUgZmlsZSAke2ZpbGV9IGRvZXMgbm90IGV4aXN0IGFueW1vcmUuYCxcbiAgICAgIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDogJ1JlbW92ZSBhbGwgYnJlYWtwb2ludHMgZm9yIHRoaXMgZmlsZT8nLFxuICAgICAgICBidXR0b25zOiBbe1xuICAgICAgICAgIHRleHQ6ICdZZXMnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIG5vdGkuZGlzbWlzcygpXG4gICAgICAgICAgICBnZXRCcmVha3BvaW50cyh0aGlzLnByb3BzLnN0b3JlLCBmaWxlKS5mb3JFYWNoKChicCkgPT4gdGhpcy5wcm9wcy5kYmcucmVtb3ZlQnJlYWtwb2ludChicC5uYW1lKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0ZXh0OiAnTm8nLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IG5vdGkuZGlzbWlzcygpXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgKVxuICB9XG59XG5CcmVha3BvaW50cy5iaW5kRm5zID0gWydoYW5kbGVCcmVha3BvaW50Q2xpY2snLCAnaGFuZGxlUmVtb3ZlQnJlYWtwb2ludENsaWNrJ11cblxuZXhwb3J0IGNvbnN0IEJyZWFrcG9pbnRzQ29udGFpbmVyID0gRXRjaFN0b3JlQ29tcG9uZW50LmNyZWF0ZShcbiAgQnJlYWtwb2ludHMsXG4gIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgZGVsdmUgfSA9IHN0YXRlXG4gICAgcmV0dXJuIHtcbiAgICAgIGJyZWFrcG9pbnRzOiBkZWx2ZS5icmVha3BvaW50c1xuICAgIH1cbiAgfVxuKVxuIl19