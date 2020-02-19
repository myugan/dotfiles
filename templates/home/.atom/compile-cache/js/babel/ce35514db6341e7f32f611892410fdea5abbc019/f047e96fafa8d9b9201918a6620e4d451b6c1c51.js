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

var _utils = require('./utils');

'use babel';
var TextInput = (function (_EtchComponent) {
  _inherits(TextInput, _EtchComponent);

  function TextInput(props, children) {
    _classCallCheck(this, TextInput);

    if (!props.value && props.value !== 0) {
      props.value = '';
    }
    _get(Object.getPrototypeOf(TextInput.prototype), 'constructor', this).call(this, props, children);

    if (props.autoFocus) {
      this.refs.input.focus();
    }
  }

  _createClass(TextInput, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { style: (0, _utils.editorStyle)(), className: 'go-debug-text-input native-key-bindings' },
        _etch2['default'].dom('input', { ref: 'input', type: 'text', value: this.props.value || '', placeholder: this.props.placeholder || '',
          on: { keydown: this.handleKeyDown, input: this.handleInput } })
      );
    }
  }, {
    key: 'handleInput',
    value: function handleInput(ev) {
      if (this.props.onChange) {
        this.props.onChange(ev.target.value);
      }
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(ev) {
      if (ev.key === 'Enter' && this.props.onDone) {
        ev.preventDefault();
        this.props.onDone(ev.target.value);
        return;
      }
      if (ev.key === 'Escape' && this.props.onCancel) {
        ev.preventDefault();
        this.props.onCancel();
        return;
      }
      if (this.props.onKeyDown) {
        this.props.onKeyDown(ev);
      }
    }
  }]);

  return TextInput;
})(_etchComponent2['default']);

exports['default'] = TextInput;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi90ZXh0LWlucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7O3FCQUNoQixTQUFTOztBQUxyQyxXQUFXLENBQUE7SUFPVSxTQUFTO1lBQVQsU0FBUzs7QUFDaEIsV0FETyxTQUFTLENBQ2YsS0FBSyxFQUFFLFFBQVEsRUFBRTswQkFEWCxTQUFTOztBQUUxQixRQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNyQyxXQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtLQUNqQjtBQUNELCtCQUxpQixTQUFTLDZDQUtwQixLQUFLLEVBQUUsUUFBUSxFQUFDOztBQUV0QixRQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDeEI7R0FDRjs7ZUFWa0IsU0FBUzs7V0FZckIsa0JBQUc7QUFDUixhQUFPOztVQUFLLEtBQUssRUFBRSx5QkFBYSxBQUFDLEVBQUMsU0FBUyxFQUFDLHlDQUF5QztRQUNuRixpQ0FBTyxHQUFHLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUUsQUFBQyxFQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLEFBQUM7QUFDdEcsWUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQUFBQyxHQUFHO09BQzlELENBQUE7S0FDUDs7O1dBRVcscUJBQUMsRUFBRSxFQUFFO0FBQ2YsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN2QixZQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQ3JDO0tBQ0Y7OztXQUVhLHVCQUFDLEVBQUUsRUFBRTtBQUNqQixVQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzNDLFVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNuQixZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xDLGVBQU07T0FDUDtBQUNELFVBQUksRUFBRSxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDOUMsVUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ25CLFlBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDckIsZUFBTTtPQUNQO0FBQ0QsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUN4QixZQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUN6QjtLQUNGOzs7U0F2Q2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi90ZXh0LWlucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgRXRjaENvbXBvbmVudCBmcm9tICcuL2V0Y2gtY29tcG9uZW50J1xuaW1wb3J0IHsgZWRpdG9yU3R5bGUgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0SW5wdXQgZXh0ZW5kcyBFdGNoQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzLCBjaGlsZHJlbikge1xuICAgIGlmICghcHJvcHMudmFsdWUgJiYgcHJvcHMudmFsdWUgIT09IDApIHtcbiAgICAgIHByb3BzLnZhbHVlID0gJydcbiAgICB9XG4gICAgc3VwZXIocHJvcHMsIGNoaWxkcmVuKVxuXG4gICAgaWYgKHByb3BzLmF1dG9Gb2N1cykge1xuICAgICAgdGhpcy5yZWZzLmlucHV0LmZvY3VzKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlZGl0b3JTdHlsZSgpfSBjbGFzc05hbWU9J2dvLWRlYnVnLXRleHQtaW5wdXQgbmF0aXZlLWtleS1iaW5kaW5ncyc+XG4gICAgICA8aW5wdXQgcmVmPSdpbnB1dCcgdHlwZT0ndGV4dCcgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9IHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyIHx8ICcnfVxuICAgICAgICBvbj17eyBrZXlkb3duOiB0aGlzLmhhbmRsZUtleURvd24sIGlucHV0OiB0aGlzLmhhbmRsZUlucHV0IH19IC8+XG4gICAgPC9kaXY+XG4gIH1cblxuICBoYW5kbGVJbnB1dCAoZXYpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldi50YXJnZXQudmFsdWUpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAoZXYpIHtcbiAgICBpZiAoZXYua2V5ID09PSAnRW50ZXInICYmIHRoaXMucHJvcHMub25Eb25lKSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnByb3BzLm9uRG9uZShldi50YXJnZXQudmFsdWUpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGV2LmtleSA9PT0gJ0VzY2FwZScgJiYgdGhpcy5wcm9wcy5vbkNhbmNlbCkge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5wcm9wcy5vbkNhbmNlbCgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMub25LZXlEb3duKSB7XG4gICAgICB0aGlzLnByb3BzLm9uS2V5RG93bihldilcbiAgICB9XG4gIH1cbn1cbiJdfQ==