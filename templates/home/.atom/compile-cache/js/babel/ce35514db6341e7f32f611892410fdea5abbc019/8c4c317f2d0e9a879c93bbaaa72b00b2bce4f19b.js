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
/* eslint-disable react/no-string-refs */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./../etch-component');

var InformationView = (function (_EtchComponent) {
  _inherits(InformationView, _EtchComponent);

  function InformationView(props) {
    _classCallCheck(this, InformationView);

    if (!props.content) {
      props.content = 'empty';
    }
    _get(Object.getPrototypeOf(InformationView.prototype), 'constructor', this).call(this, props);
    if (props.model) {
      props.model.view = this;
      props.model.updateContent();
    }
  }

  _createClass(InformationView, [{
    key: 'render',
    value: function render() {
      var style = 'white-space: pre-wrap;';
      if (this.props.style) {
        style = style + ' ' + this.props.style;
      }
      return _etch2['default'].dom(
        'span',
        { ref: 'content', style: style, tabIndex: '-1' },
        this.props.content
      );
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.destroy();
    }
  }]);

  return InformationView;
})(_etchComponent.EtchComponent);

exports.InformationView = InformationView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2luZm8vaW5mb3JtYXRpb24tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBS2lCLE1BQU07Ozs7NkJBQ08scUJBQXFCOztJQVV0QyxlQUFlO1lBQWYsZUFBZTs7QUFHZixXQUhBLGVBQWUsQ0FHZCxLQUFZLEVBQUU7MEJBSGYsZUFBZTs7QUFJeEIsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDbEIsV0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7S0FDeEI7QUFDRCwrQkFQUyxlQUFlLDZDQU9sQixLQUFLLEVBQUM7QUFDWixRQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDZixXQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDdkIsV0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUM1QjtHQUNGOztlQVpVLGVBQWU7O1dBY3BCLGtCQUFHO0FBQ1AsVUFBSSxLQUFLLEdBQUcsd0JBQXdCLENBQUE7QUFDcEMsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNwQixhQUFLLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQTtPQUN2QztBQUNELGFBQ0U7O1VBQU0sR0FBRyxFQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEVBQUMsUUFBUSxFQUFDLElBQUk7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO09BQ2QsQ0FDUjtLQUNGOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7U0E1QlUsZUFBZSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9pbmZvL2luZm9ybWF0aW9uLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cbi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXVua25vd24tcHJvcGVydHkgKi9cbi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXN0cmluZy1yZWZzICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBFdGNoQ29tcG9uZW50IH0gZnJvbSAnLi8uLi9ldGNoLWNvbXBvbmVudCdcblxuaW1wb3J0IHR5cGUgeyBJbmZvcm1hdGlvbiB9IGZyb20gJy4vaW5mb3JtYXRpb24nXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG1vZGVsPzogSW5mb3JtYXRpb24sXG4gIHN0eWxlPzogc3RyaW5nLFxuICBjb250ZW50OiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIEluZm9ybWF0aW9uVmlldyBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICBwcm9wczogUHJvcHNcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLmNvbnRlbnQpIHtcbiAgICAgIHByb3BzLmNvbnRlbnQgPSAnZW1wdHknXG4gICAgfVxuICAgIHN1cGVyKHByb3BzKVxuICAgIGlmIChwcm9wcy5tb2RlbCkge1xuICAgICAgcHJvcHMubW9kZWwudmlldyA9IHRoaXNcbiAgICAgIHByb3BzLm1vZGVsLnVwZGF0ZUNvbnRlbnQoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc3R5bGUgPSAnd2hpdGUtc3BhY2U6IHByZS13cmFwOydcbiAgICBpZiAodGhpcy5wcm9wcy5zdHlsZSkge1xuICAgICAgc3R5bGUgPSBzdHlsZSArICcgJyArIHRoaXMucHJvcHMuc3R5bGVcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIHJlZj1cImNvbnRlbnRcIiBzdHlsZT17c3R5bGV9IHRhYkluZGV4PVwiLTFcIj5cbiAgICAgICAge3RoaXMucHJvcHMuY29udGVudH1cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZGVzdHJveSgpXG4gIH1cbn1cbiJdfQ==