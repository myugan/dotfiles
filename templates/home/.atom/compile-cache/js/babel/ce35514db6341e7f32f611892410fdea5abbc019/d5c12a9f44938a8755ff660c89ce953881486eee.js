Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./../etch-component');

var _etchOcticon = require('etch-octicon');

var _etchOcticon2 = _interopRequireDefault(_etchOcticon);

var EmptyTabView = (function (_EtchComponent) {
  _inherits(EmptyTabView, _EtchComponent);

  function EmptyTabView() {
    _classCallCheck(this, EmptyTabView);

    _get(Object.getPrototypeOf(EmptyTabView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(EmptyTabView, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'go-plus-empty-tab' },
        _etch2['default'].dom(
          'span',
          { className: 'text-subtle' },
          _etch2['default'].dom(_etchOcticon2['default'], { name: 'issue-opened', className: 'auto-size' }),
          'The go-plus panel is active when a Go project is loaded.',
          _etch2['default'].dom('br', null),
          'Open a .go file to get started.'
        )
      );
    }
  }]);

  return EmptyTabView;
})(_etchComponent.EtchComponent);

exports.EmptyTabView = EmptyTabView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3BhbmVsL2VtcHR5LXRhYi12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUlpQixNQUFNOzs7OzZCQUNPLHFCQUFxQjs7MkJBQy9CLGNBQWM7Ozs7SUFFckIsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOzs7ZUFBWixZQUFZOztXQUNqQixrQkFBRztBQUNQLGFBQ0U7O1VBQUssU0FBUyxFQUFDLG1CQUFtQjtRQUNoQzs7WUFBTSxTQUFTLEVBQUMsYUFBYTtVQUMzQixrREFBUyxJQUFJLEVBQUMsY0FBYyxFQUFDLFNBQVMsRUFBQyxXQUFXLEdBQUc7VUFDcEQsMERBQTBEO1VBQzNELGlDQUFNO1VBQ0wsaUNBQWlDO1NBQzdCO09BQ0gsQ0FDUDtLQUNGOzs7U0FaVSxZQUFZIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3BhbmVsL2VtcHR5LXRhYi12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8qKiBAanN4IGV0Y2guZG9tICovXG4vKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby11bmtub3duLXByb3BlcnR5ICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBFdGNoQ29tcG9uZW50IH0gZnJvbSAnLi8uLi9ldGNoLWNvbXBvbmVudCdcbmltcG9ydCBPY3RpY29uIGZyb20gJ2V0Y2gtb2N0aWNvbidcblxuZXhwb3J0IGNsYXNzIEVtcHR5VGFiVmlldyBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ28tcGx1cy1lbXB0eS10YWJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zdWJ0bGVcIj5cbiAgICAgICAgICA8T2N0aWNvbiBuYW1lPVwiaXNzdWUtb3BlbmVkXCIgY2xhc3NOYW1lPVwiYXV0by1zaXplXCIgLz5cbiAgICAgICAgICB7J1RoZSBnby1wbHVzIHBhbmVsIGlzIGFjdGl2ZSB3aGVuIGEgR28gcHJvamVjdCBpcyBsb2FkZWQuJ31cbiAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICB7J09wZW4gYSAuZ28gZmlsZSB0byBnZXQgc3RhcnRlZC4nfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==