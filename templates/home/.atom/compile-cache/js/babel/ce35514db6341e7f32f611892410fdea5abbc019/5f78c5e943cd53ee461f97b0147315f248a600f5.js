Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./etch-component');

var _etchComponent2 = _interopRequireDefault(_etchComponent);

var _etchStoreComponent = require('./etch-store-component');

var _etchStoreComponent2 = _interopRequireDefault(_etchStoreComponent);

var _utils = require('./utils');

'use babel';
var Stacktrace = (function (_EtchComponent) {
  _inherits(Stacktrace, _EtchComponent);

  function Stacktrace() {
    _classCallCheck(this, Stacktrace);

    _get(Object.getPrototypeOf(Stacktrace.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Stacktrace, [{
    key: 'render',
    value: function render() {
      var _this = this;

      var _props = this.props;
      var selectedStacktrace = _props.selectedStacktrace;
      var _props$stacktrace = _props.stacktrace;
      var stacktrace = _props$stacktrace === undefined ? [] : _props$stacktrace;

      var items = stacktrace.map(function (st, index) {
        var className = selectedStacktrace === index ? 'selected' : null;
        return _etch2['default'].dom(
          'div',
          { key: index, className: className, dataset: { index: index }, onclick: _this.handleStacktraceClick },
          _etch2['default'].dom(
            'div',
            null,
            st.func
          ),
          _etch2['default'].dom(
            'div',
            null,
            '@ ',
            (0, _utils.location)(st)
          )
        );
      });
      if (items.length === 0) {
        return _etch2['default'].dom(
          'div',
          { className: 'go-debug-panel-stacktrace-empty' },
          'No stacktrace'
        );
      }
      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-stacktrace' },
        items
      );
    }
  }, {
    key: 'handleStacktraceClick',
    value: function handleStacktraceClick(ev) {
      var index = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.index');
      if (index) {
        this.props.dbg.selectStacktrace(+index);
      }
    }
  }]);

  return Stacktrace;
})(_etchComponent2['default']);

exports.Stacktrace = Stacktrace;

Stacktrace.bindFns = ['handleStacktraceClick'];

var StacktraceContainer = _etchStoreComponent2['default'].create(Stacktrace, function (state) {
  var delve = state.delve;

  return {
    stacktrace: delve.stacktrace,
    selectedStacktrace: delve.selectedStacktrace
  };
});
exports.StacktraceContainer = StacktraceContainer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9zdGFja3RyYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7O2tDQUNiLHdCQUF3Qjs7OztxQkFFUCxTQUFTOztBQVB6RCxXQUFXLENBQUE7SUFTRSxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ2Qsa0JBQUc7OzttQkFDd0MsSUFBSSxDQUFDLEtBQUs7VUFBbEQsa0JBQWtCLFVBQWxCLGtCQUFrQjtxQ0FBRSxVQUFVO1VBQVYsVUFBVSxxQ0FBRyxFQUFFOztBQUMzQyxVQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRSxFQUFFLEtBQUssRUFBSztBQUMxQyxZQUFNLFNBQVMsR0FBRyxrQkFBa0IsS0FBSyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQTtBQUNsRSxlQUFPOztZQUFLLEdBQUcsRUFBRSxLQUFLLEFBQUMsRUFBQyxTQUFTLEVBQUUsU0FBUyxBQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxBQUFDLEVBQUMsT0FBTyxFQUFFLE1BQUsscUJBQXFCLEFBQUM7VUFDcEc7OztZQUFNLEVBQUUsQ0FBQyxJQUFJO1dBQU87VUFDcEI7Ozs7WUFBUSxxQkFBUyxFQUFFLENBQUM7V0FBTztTQUN2QixDQUFBO09BQ1AsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN0QixlQUFPOztZQUFLLFNBQVMsRUFBQyxpQ0FBaUM7O1NBQW9CLENBQUE7T0FDNUU7QUFDRCxhQUFPOztVQUFLLFNBQVMsRUFBQywyQkFBMkI7UUFBRSxLQUFLO09BQU8sQ0FBQTtLQUNoRTs7O1dBRXFCLCtCQUFDLEVBQUUsRUFBRTtBQUN6QixVQUFNLEtBQUssR0FBRyxrQ0FBc0IsRUFBRSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQTtBQUMvRCxVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDeEM7S0FDRjs7O1NBckJVLFVBQVU7Ozs7O0FBdUJ2QixVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTs7QUFFdkMsSUFBTSxtQkFBbUIsR0FBRyxnQ0FBbUIsTUFBTSxDQUMxRCxVQUFVLEVBQ1YsVUFBQyxLQUFLLEVBQUs7TUFDRCxLQUFLLEdBQUssS0FBSyxDQUFmLEtBQUs7O0FBQ2IsU0FBTztBQUNMLGNBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtBQUM1QixzQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCO0dBQzdDLENBQUE7Q0FDRixDQUNGLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL3N0YWNrdHJhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgRXRjaFN0b3JlQ29tcG9uZW50IGZyb20gJy4vZXRjaC1zdG9yZS1jb21wb25lbnQnXG5cbmltcG9ydCB7IGVsZW1lbnRQcm9wSW5IaWVyYXJjeSwgbG9jYXRpb24gfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgU3RhY2t0cmFjZSBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRTdGFja3RyYWNlLCBzdGFja3RyYWNlID0gW10gfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBpdGVtcyA9IHN0YWNrdHJhY2UubWFwKChzdCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHNlbGVjdGVkU3RhY2t0cmFjZSA9PT0gaW5kZXggPyAnc2VsZWN0ZWQnIDogbnVsbFxuICAgICAgcmV0dXJuIDxkaXYga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IGRhdGFzZXQ9e3sgaW5kZXggfX0gb25jbGljaz17dGhpcy5oYW5kbGVTdGFja3RyYWNlQ2xpY2t9PlxuICAgICAgICA8ZGl2PntzdC5mdW5jfTwvZGl2PlxuICAgICAgICA8ZGl2PkAge2xvY2F0aW9uKHN0KX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIH0pXG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnby1kZWJ1Zy1wYW5lbC1zdGFja3RyYWNlLWVtcHR5Jz5ObyBzdGFja3RyYWNlPC9kaXY+XG4gICAgfVxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtc3RhY2t0cmFjZSc+e2l0ZW1zfTwvZGl2PlxuICB9XG5cbiAgaGFuZGxlU3RhY2t0cmFjZUNsaWNrIChldikge1xuICAgIGNvbnN0IGluZGV4ID0gZWxlbWVudFByb3BJbkhpZXJhcmN5KGV2LnRhcmdldCwgJ2RhdGFzZXQuaW5kZXgnKVxuICAgIGlmIChpbmRleCkge1xuICAgICAgdGhpcy5wcm9wcy5kYmcuc2VsZWN0U3RhY2t0cmFjZSgraW5kZXgpXG4gICAgfVxuICB9XG59XG5TdGFja3RyYWNlLmJpbmRGbnMgPSBbJ2hhbmRsZVN0YWNrdHJhY2VDbGljayddXG5cbmV4cG9ydCBjb25zdCBTdGFja3RyYWNlQ29udGFpbmVyID0gRXRjaFN0b3JlQ29tcG9uZW50LmNyZWF0ZShcbiAgU3RhY2t0cmFjZSxcbiAgKHN0YXRlKSA9PiB7XG4gICAgY29uc3QgeyBkZWx2ZSB9ID0gc3RhdGVcbiAgICByZXR1cm4ge1xuICAgICAgc3RhY2t0cmFjZTogZGVsdmUuc3RhY2t0cmFjZSxcbiAgICAgIHNlbGVjdGVkU3RhY2t0cmFjZTogZGVsdmUuc2VsZWN0ZWRTdGFja3RyYWNlXG4gICAgfVxuICB9XG4pXG4iXX0=