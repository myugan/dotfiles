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

var _textInput = require('./text-input');

var _textInput2 = _interopRequireDefault(_textInput);

var _variables = require('./variables');

'use babel';
var WatchExpressions = (function (_EtchComponent) {
  _inherits(WatchExpressions, _EtchComponent);

  function WatchExpressions() {
    _classCallCheck(this, WatchExpressions);

    _get(Object.getPrototypeOf(WatchExpressions.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(WatchExpressions, [{
    key: 'render',
    value: function render() {
      var _this = this;

      var variables = undefined;
      var expressions = this.props.expressions;
      if (expressions) {
        variables = expressions.map(function (_ref) {
          var expr = _ref.expr;
          var variables = _ref.variables;

          return _etch2['default'].dom(
            'div',
            null,
            _etch2['default'].dom(
              'button',
              { className: 'btn go-debug-btn-flat', dataset: { expr: expr }, onClick: _this.handleRemoveClick },
              _etch2['default'].dom('span', { className: 'go-debug-icon icon icon-x' })
            ),
            _etch2['default'].dom(_variables.Variables, { variables: variables })
          );
        });
      } else {
        variables = _etch2['default'].dom(
          'div',
          { className: 'go-debug-panel-watch-expressions-empty' },
          'No watch expressions'
        );
      }

      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-panel-watch-expressions native-key-bindings', tabIndex: -1 },
        _etch2['default'].dom(AddWatchExpressionInput, { onAdd: this.handleAddClick }),
        _etch2['default'].dom(
          'div',
          { className: 'go-debug-panel-watch-expressions-variables' },
          variables
        )
      );
    }
  }, {
    key: 'handleAddClick',
    value: function handleAddClick(expr) {
      this.props.dbg.addWatchExpression(expr);
    }
  }, {
    key: 'handleRemoveClick',
    value: function handleRemoveClick(ev) {
      var expr = ev.currentTarget.dataset.expr;

      this.props.dbg.removeWatchExpression(expr);
    }
  }]);

  return WatchExpressions;
})(_etchComponent2['default']);

exports.WatchExpressions = WatchExpressions;

WatchExpressions.bindFns = ['handleAddClick', 'handleRemoveClick'];

var AddWatchExpressionInput = (function (_EtchComponent2) {
  _inherits(AddWatchExpressionInput, _EtchComponent2);

  function AddWatchExpressionInput() {
    _classCallCheck(this, AddWatchExpressionInput);

    _get(Object.getPrototypeOf(AddWatchExpressionInput.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AddWatchExpressionInput, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-watch-expression-input' },
        _etch2['default'].dom(
          'button',
          { className: 'btn go-debug-btn-flat', onClick: this.handleAddClick },
          _etch2['default'].dom('span', { className: 'go-debug-icon icon icon-plus' })
        ),
        _etch2['default'].dom(_textInput2['default'], { value: this.props.value, placeholder: 'Add expression ...',
          onChange: this.handleInputChange, onDone: this.handleInputDone })
      );
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(value) {
      this.update({ value: value });
    }
  }, {
    key: 'handleInputDone',
    value: function handleInputDone(value) {
      this.done();
    }
  }, {
    key: 'handleAddClick',
    value: function handleAddClick(ev) {
      ev.preventDefault();
      this.done();
    }
  }, {
    key: 'done',
    value: function done() {
      if (this.props.onAdd && this.props.value) {
        this.props.onAdd(this.props.value);
      }
      this.update({ value: '' });
    }
  }]);

  return AddWatchExpressionInput;
})(_etchComponent2['default']);

AddWatchExpressionInput.bindFns = ['handleInputChange', 'handleInputDone', 'handleAddClick'];

var WatchExpressionsContainer = _etchStoreComponent2['default'].create(WatchExpressions, function (state) {
  return {
    expressions: state.delve.watchExpressions
  };
});
exports.WatchExpressionsContainer = WatchExpressionsContainer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi93YXRjaC1leHByZXNzaW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7OzZCQUNHLGtCQUFrQjs7OztrQ0FDYix3QkFBd0I7Ozs7eUJBQ2pDLGNBQWM7Ozs7eUJBQ1YsYUFBYTs7QUFQdkMsV0FBVyxDQUFBO0lBU0UsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7O1dBQ3BCLGtCQUFHOzs7QUFDUixVQUFJLFNBQVMsWUFBQSxDQUFBO0FBQ2IsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUE7QUFDMUMsVUFBSSxXQUFXLEVBQUU7QUFDZixpQkFBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFtQixFQUFLO2NBQXRCLElBQUksR0FBTixJQUFtQixDQUFqQixJQUFJO2NBQUUsU0FBUyxHQUFqQixJQUFtQixDQUFYLFNBQVM7O0FBQzVDLGlCQUFPOzs7WUFDTDs7Z0JBQVEsU0FBUyxFQUFDLHVCQUF1QixFQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQUFBQyxFQUFDLE9BQU8sRUFBRSxNQUFLLGlCQUFpQixBQUFDO2NBQzNGLGdDQUFNLFNBQVMsRUFBQywyQkFBMkIsR0FBRzthQUN2QztZQUNULDhDQUFXLFNBQVMsRUFBRSxTQUFTLEFBQUMsR0FBRztXQUMvQixDQUFBO1NBQ1AsQ0FBQyxDQUFBO09BQ0gsTUFBTTtBQUNMLGlCQUFTLEdBQUc7O1lBQUssU0FBUyxFQUFDLHdDQUF3Qzs7U0FBMkIsQ0FBQTtPQUMvRjs7QUFFRCxhQUFPOztVQUFLLFNBQVMsRUFBQyxzREFBc0QsRUFBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEFBQUM7UUFDeEYsc0JBQUMsdUJBQXVCLElBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLEFBQUMsR0FBRztRQUN2RDs7WUFBSyxTQUFTLEVBQUMsNENBQTRDO1VBQUUsU0FBUztTQUFPO09BQ3pFLENBQUE7S0FDUDs7O1dBRWMsd0JBQUMsSUFBSSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3hDOzs7V0FDaUIsMkJBQUMsRUFBRSxFQUFFO1VBQ2IsSUFBSSxHQUFLLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFqQyxJQUFJOztBQUNaLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzNDOzs7U0E3QlUsZ0JBQWdCOzs7OztBQStCN0IsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTs7SUFFNUQsdUJBQXVCO1lBQXZCLHVCQUF1Qjs7V0FBdkIsdUJBQXVCOzBCQUF2Qix1QkFBdUI7OytCQUF2Qix1QkFBdUI7OztlQUF2Qix1QkFBdUI7O1dBQ3BCLGtCQUFHO0FBQ1IsYUFBTzs7VUFBSyxTQUFTLEVBQUMsaUNBQWlDO1FBQ3JEOztZQUFRLFNBQVMsRUFBQyx1QkFBdUIsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQUFBQztVQUNyRSxnQ0FBTSxTQUFTLEVBQUMsOEJBQThCLEdBQUc7U0FDMUM7UUFDVCxnREFBVyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUMsRUFBQyxXQUFXLEVBQUUsb0JBQW9CLEFBQUM7QUFDcEUsa0JBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEFBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQyxHQUFHO09BQ2hFLENBQUE7S0FDUDs7O1dBRWlCLDJCQUFDLEtBQUssRUFBRTtBQUN4QixVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDLENBQUE7S0FDdkI7OztXQUNlLHlCQUFDLEtBQUssRUFBRTtBQUN0QixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDWjs7O1dBQ2Msd0JBQUMsRUFBRSxFQUFFO0FBQ2xCLFFBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDWjs7O1dBRUksZ0JBQUc7QUFDTixVQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDbkM7QUFDRCxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7S0FDM0I7OztTQTNCRyx1QkFBdUI7OztBQTZCN0IsdUJBQXVCLENBQUMsT0FBTyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFckYsSUFBTSx5QkFBeUIsR0FBRyxnQ0FBbUIsTUFBTSxDQUNoRSxnQkFBZ0IsRUFDaEIsVUFBQyxLQUFLLEVBQUs7QUFDVCxTQUFPO0FBQ0wsZUFBVyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQWdCO0dBQzFDLENBQUE7Q0FDRixDQUNGLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL3dhdGNoLWV4cHJlc3Npb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgRXRjaENvbXBvbmVudCBmcm9tICcuL2V0Y2gtY29tcG9uZW50J1xuaW1wb3J0IEV0Y2hTdG9yZUNvbXBvbmVudCBmcm9tICcuL2V0Y2gtc3RvcmUtY29tcG9uZW50J1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tICcuL3RleHQtaW5wdXQnXG5pbXBvcnQgeyBWYXJpYWJsZXMgfSBmcm9tICcuL3ZhcmlhYmxlcydcblxuZXhwb3J0IGNsYXNzIFdhdGNoRXhwcmVzc2lvbnMgZXh0ZW5kcyBFdGNoQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgdmFyaWFibGVzXG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnByb3BzLmV4cHJlc3Npb25zXG4gICAgaWYgKGV4cHJlc3Npb25zKSB7XG4gICAgICB2YXJpYWJsZXMgPSBleHByZXNzaW9ucy5tYXAoKHsgZXhwciwgdmFyaWFibGVzIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIDxkaXY+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0biBnby1kZWJ1Zy1idG4tZmxhdCcgZGF0YXNldD17eyBleHByIH19IG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlQ2xpY2t9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdnby1kZWJ1Zy1pY29uIGljb24gaWNvbi14JyAvPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxWYXJpYWJsZXMgdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyaWFibGVzID0gPGRpdiBjbGFzc05hbWU9J2dvLWRlYnVnLXBhbmVsLXdhdGNoLWV4cHJlc3Npb25zLWVtcHR5Jz5ObyB3YXRjaCBleHByZXNzaW9uczwvZGl2PlxuICAgIH1cblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtd2F0Y2gtZXhwcmVzc2lvbnMgbmF0aXZlLWtleS1iaW5kaW5ncycgdGFiSW5kZXg9ey0xfT5cbiAgICAgIDxBZGRXYXRjaEV4cHJlc3Npb25JbnB1dCBvbkFkZD17dGhpcy5oYW5kbGVBZGRDbGlja30gLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdnby1kZWJ1Zy1wYW5lbC13YXRjaC1leHByZXNzaW9ucy12YXJpYWJsZXMnPnt2YXJpYWJsZXN9PC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cblxuICBoYW5kbGVBZGRDbGljayAoZXhwcikge1xuICAgIHRoaXMucHJvcHMuZGJnLmFkZFdhdGNoRXhwcmVzc2lvbihleHByKVxuICB9XG4gIGhhbmRsZVJlbW92ZUNsaWNrIChldikge1xuICAgIGNvbnN0IHsgZXhwciB9ID0gZXYuY3VycmVudFRhcmdldC5kYXRhc2V0XG4gICAgdGhpcy5wcm9wcy5kYmcucmVtb3ZlV2F0Y2hFeHByZXNzaW9uKGV4cHIpXG4gIH1cbn1cbldhdGNoRXhwcmVzc2lvbnMuYmluZEZucyA9IFsnaGFuZGxlQWRkQ2xpY2snLCAnaGFuZGxlUmVtb3ZlQ2xpY2snXVxuXG5jbGFzcyBBZGRXYXRjaEV4cHJlc3Npb25JbnB1dCBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctd2F0Y2gtZXhwcmVzc2lvbi1pbnB1dCc+XG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT0nYnRuIGdvLWRlYnVnLWJ0bi1mbGF0JyBvbkNsaWNrPXt0aGlzLmhhbmRsZUFkZENsaWNrfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdnby1kZWJ1Zy1pY29uIGljb24gaWNvbi1wbHVzJyAvPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8VGV4dElucHV0IHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfSBwbGFjZWhvbGRlcj17J0FkZCBleHByZXNzaW9uIC4uLid9XG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfSBvbkRvbmU9e3RoaXMuaGFuZGxlSW5wdXREb25lfSAvPlxuICAgIDwvZGl2PlxuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UgKHZhbHVlKSB7XG4gICAgdGhpcy51cGRhdGUoeyB2YWx1ZSB9KVxuICB9XG4gIGhhbmRsZUlucHV0RG9uZSAodmFsdWUpIHtcbiAgICB0aGlzLmRvbmUoKVxuICB9XG4gIGhhbmRsZUFkZENsaWNrIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmRvbmUoKVxuICB9XG5cbiAgZG9uZSAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25BZGQgJiYgdGhpcy5wcm9wcy52YWx1ZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkFkZCh0aGlzLnByb3BzLnZhbHVlKVxuICAgIH1cbiAgICB0aGlzLnVwZGF0ZSh7IHZhbHVlOiAnJyB9KVxuICB9XG59XG5BZGRXYXRjaEV4cHJlc3Npb25JbnB1dC5iaW5kRm5zID0gWydoYW5kbGVJbnB1dENoYW5nZScsICdoYW5kbGVJbnB1dERvbmUnLCAnaGFuZGxlQWRkQ2xpY2snXVxuXG5leHBvcnQgY29uc3QgV2F0Y2hFeHByZXNzaW9uc0NvbnRhaW5lciA9IEV0Y2hTdG9yZUNvbXBvbmVudC5jcmVhdGUoXG4gIFdhdGNoRXhwcmVzc2lvbnMsXG4gIChzdGF0ZSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBleHByZXNzaW9uczogc3RhdGUuZGVsdmUud2F0Y2hFeHByZXNzaW9uc1xuICAgIH1cbiAgfVxuKVxuIl19