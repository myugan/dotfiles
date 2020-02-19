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
var Goroutines = (function (_EtchComponent) {
  _inherits(Goroutines, _EtchComponent);

  function Goroutines() {
    _classCallCheck(this, Goroutines);

    _get(Object.getPrototypeOf(Goroutines.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Goroutines, [{
    key: 'render',
    value: function render() {
      var _this = this;

      var _props = this.props;
      var selectedGoroutine = _props.selectedGoroutine;
      var _props$goroutines = _props.goroutines;
      var goroutines = _props$goroutines === undefined ? [] : _props$goroutines;

      var items = goroutines.map(function (t) {
        var className = selectedGoroutine === t.id ? 'selected' : null;
        return _etch2['default'].dom(
          'div',
          { key: t.id, className: className, dataset: { id: t.id }, onclick: _this.handleGoroutineClick },
          _etch2['default'].dom(
            'div',
            null,
            t.func
          ),
          _etch2['default'].dom(
            'div',
            null,
            '@ ',
            (0, _utils.location)(t)
          )
        );
      });
      if (items.length === 0) {
        return _etch2['default'].dom(
          'div',
          { className: 'go-debug-panel-goroutines-empty' },
          'No goroutines'
        );
      }
      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-goroutines' },
        items
      );
    }
  }, {
    key: 'handleGoroutineClick',
    value: function handleGoroutineClick(ev) {
      var id = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.id');
      if (id) {
        this.props.dbg.selectGoroutine(+id);
      }
    }
  }]);

  return Goroutines;
})(_etchComponent2['default']);

exports.Goroutines = Goroutines;

Goroutines.bindFns = ['handleGoroutineClick'];

var GoroutinesContainer = _etchStoreComponent2['default'].create(Goroutines, function (state) {
  var delve = state.delve;

  return {
    goroutines: delve.goroutines,
    selectedGoroutine: delve.selectedGoroutine
  };
});
exports.GoroutinesContainer = GoroutinesContainer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9nb3JvdXRpbmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7O2tDQUNiLHdCQUF3Qjs7OztxQkFFUCxTQUFTOztBQVB6RCxXQUFXLENBQUE7SUFTRSxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ2Qsa0JBQUc7OzttQkFDdUMsSUFBSSxDQUFDLEtBQUs7VUFBakQsaUJBQWlCLFVBQWpCLGlCQUFpQjtxQ0FBRSxVQUFVO1VBQVYsVUFBVSxxQ0FBRyxFQUFFOztBQUMxQyxVQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2xDLFlBQU0sU0FBUyxHQUFHLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQTtBQUNoRSxlQUFPOztZQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxBQUFDLEVBQUMsU0FBUyxFQUFFLFNBQVMsQUFBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEFBQUMsRUFBQyxPQUFPLEVBQUUsTUFBSyxvQkFBb0IsQUFBQztVQUNyRzs7O1lBQU0sQ0FBQyxDQUFDLElBQUk7V0FBTztVQUNuQjs7OztZQUFRLHFCQUFTLENBQUMsQ0FBQztXQUFPO1NBQ3RCLENBQUE7T0FDUCxDQUFDLENBQUE7QUFDRixVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3RCLGVBQU87O1lBQUssU0FBUyxFQUFDLGlDQUFpQzs7U0FBb0IsQ0FBQTtPQUM1RTtBQUNELGFBQU87O1VBQUssU0FBUyxFQUFDLDJCQUEyQjtRQUFFLEtBQUs7T0FBTyxDQUFBO0tBQ2hFOzs7V0FFb0IsOEJBQUMsRUFBRSxFQUFFO0FBQ3hCLFVBQU0sRUFBRSxHQUFHLGtDQUFzQixFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQ3pELFVBQUksRUFBRSxFQUFFO0FBQ04sWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDcEM7S0FDRjs7O1NBckJVLFVBQVU7Ozs7O0FBdUJ2QixVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTs7QUFFdEMsSUFBTSxtQkFBbUIsR0FBRyxnQ0FBbUIsTUFBTSxDQUMxRCxVQUFVLEVBQ1YsVUFBQyxLQUFLLEVBQUs7TUFDRCxLQUFLLEdBQUssS0FBSyxDQUFmLEtBQUs7O0FBQ2IsU0FBTztBQUNMLGNBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtBQUM1QixxQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO0dBQzNDLENBQUE7Q0FDRixDQUNGLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2dvcm91dGluZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgRXRjaFN0b3JlQ29tcG9uZW50IGZyb20gJy4vZXRjaC1zdG9yZS1jb21wb25lbnQnXG5cbmltcG9ydCB7IGVsZW1lbnRQcm9wSW5IaWVyYXJjeSwgbG9jYXRpb24gfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgR29yb3V0aW5lcyBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRHb3JvdXRpbmUsIGdvcm91dGluZXMgPSBbXSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGl0ZW1zID0gZ29yb3V0aW5lcy5tYXAoKHQpID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHNlbGVjdGVkR29yb3V0aW5lID09PSB0LmlkID8gJ3NlbGVjdGVkJyA6IG51bGxcbiAgICAgIHJldHVybiA8ZGl2IGtleT17dC5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IGRhdGFzZXQ9e3sgaWQ6IHQuaWQgfX0gb25jbGljaz17dGhpcy5oYW5kbGVHb3JvdXRpbmVDbGlja30+XG4gICAgICAgIDxkaXY+e3QuZnVuY308L2Rpdj5cbiAgICAgICAgPGRpdj5AIHtsb2NhdGlvbih0KX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIH0pXG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnby1kZWJ1Zy1wYW5lbC1nb3JvdXRpbmVzLWVtcHR5Jz5ObyBnb3JvdXRpbmVzPC9kaXY+XG4gICAgfVxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtZ29yb3V0aW5lcyc+e2l0ZW1zfTwvZGl2PlxuICB9XG5cbiAgaGFuZGxlR29yb3V0aW5lQ2xpY2sgKGV2KSB7XG4gICAgY29uc3QgaWQgPSBlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5pZCcpXG4gICAgaWYgKGlkKSB7XG4gICAgICB0aGlzLnByb3BzLmRiZy5zZWxlY3RHb3JvdXRpbmUoK2lkKVxuICAgIH1cbiAgfVxufVxuR29yb3V0aW5lcy5iaW5kRm5zID0gWydoYW5kbGVHb3JvdXRpbmVDbGljayddXG5cbmV4cG9ydCBjb25zdCBHb3JvdXRpbmVzQ29udGFpbmVyID0gRXRjaFN0b3JlQ29tcG9uZW50LmNyZWF0ZShcbiAgR29yb3V0aW5lcyxcbiAgKHN0YXRlKSA9PiB7XG4gICAgY29uc3QgeyBkZWx2ZSB9ID0gc3RhdGVcbiAgICByZXR1cm4ge1xuICAgICAgZ29yb3V0aW5lczogZGVsdmUuZ29yb3V0aW5lcyxcbiAgICAgIHNlbGVjdGVkR29yb3V0aW5lOiBkZWx2ZS5zZWxlY3RlZEdvcm91dGluZVxuICAgIH1cbiAgfVxuKVxuIl19