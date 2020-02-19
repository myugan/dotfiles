Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.editBreakpointCondition = editBreakpointCondition;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./etch-component');

var _etchComponent2 = _interopRequireDefault(_etchComponent);

var _textInput = require('./text-input');

var _textInput2 = _interopRequireDefault(_textInput);

var _utils = require('./utils');

'use babel';
var BreakpointCondition = (function (_EtchComponent) {
  _inherits(BreakpointCondition, _EtchComponent);

  function BreakpointCondition(props, children) {
    _classCallCheck(this, BreakpointCondition);

    _get(Object.getPrototypeOf(BreakpointCondition.prototype), 'constructor', this).call(this, props, children);
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  _createClass(BreakpointCondition, [{
    key: 'destroy',
    value: function destroy() {
      document.removeEventListener('click', this.handleDocumentClick, false);
      _get(Object.getPrototypeOf(BreakpointCondition.prototype), 'destroy', this).call(this);
    }
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-breakpoint-condition' },
        _etch2['default'].dom(
          'b',
          { className: 'block' },
          'Breakpoint condition on ',
          this.props.location
        ),
        _etch2['default'].dom(_textInput2['default'], { autoFocus: true, value: this.props.condition, onChange: this.handleChange,
          onDone: this.handleDone, onCancel: this.handleCancel })
      );
    }
  }, {
    key: 'handleChange',
    value: function handleChange(condition) {
      this.update({ condition: condition });
    }
  }, {
    key: 'handleDone',
    value: function handleDone(condition) {
      this.props.onDone(condition);
    }
  }, {
    key: 'handleCancel',
    value: function handleCancel() {
      this.props.onCancel();
    }
  }, {
    key: 'handleDocumentClick',
    value: function handleDocumentClick(ev) {
      if (!this.element.contains(ev.target)) {
        this.props.onDone(this.props.condition);
      }
    }
  }]);

  return BreakpointCondition;
})(_etchComponent2['default']);

exports.BreakpointCondition = BreakpointCondition;

BreakpointCondition.bindFns = ['handleChange', 'handleDone', 'handleCancel', 'handleDocumentClick'];

function editBreakpointCondition(bp) {
  return new Promise(function (resolve) {
    var component = new BreakpointCondition({
      condition: bp.cond || '',
      location: (0, _utils.location)(bp),
      onCancel: function onCancel() {
        component.destroy();
        modal.destroy();
      },
      onDone: function onDone(condition) {
        component.destroy();
        modal.destroy();
        resolve(condition);
      }
    });
    var modal = atom.workspace.addModalPanel({ item: component.element });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9icmVha3BvaW50LWNvbmRpdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7O3lCQUN0QixjQUFjOzs7O3FCQUNYLFNBQVM7O0FBTmxDLFdBQVcsQ0FBQTtJQVFFLG1CQUFtQjtZQUFuQixtQkFBbUI7O0FBQ2xCLFdBREQsbUJBQW1CLENBQ2pCLEtBQUssRUFBRSxRQUFRLEVBQUU7MEJBRG5CLG1CQUFtQjs7QUFFNUIsK0JBRlMsbUJBQW1CLDZDQUV0QixLQUFLLEVBQUUsUUFBUSxFQUFDO0FBQ3RCLFlBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFBO0dBQ3BFOztlQUpVLG1CQUFtQjs7V0FLdEIsbUJBQUc7QUFDVCxjQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN0RSxpQ0FQUyxtQkFBbUIseUNBT2I7S0FDaEI7OztXQUVNLGtCQUFHO0FBQ1IsYUFBTzs7VUFBSyxTQUFTLEVBQUMsK0JBQStCO1FBQ25EOztZQUFHLFNBQVMsRUFBQyxPQUFPOztVQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7U0FBSztRQUN0RSxnREFBVyxTQUFTLE1BQUEsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztBQUM1RSxnQkFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQyxHQUFHO09BQ3RELENBQUE7S0FDUDs7O1dBRVksc0JBQUMsU0FBUyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLENBQUMsQ0FBQTtLQUMzQjs7O1dBQ1Usb0JBQUMsU0FBUyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzdCOzs7V0FDWSx3QkFBRztBQUNkLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7S0FDdEI7OztXQUVtQiw2QkFBQyxFQUFFLEVBQUU7QUFDdkIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNyQyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BQ3hDO0tBQ0Y7OztTQWhDVSxtQkFBbUI7Ozs7O0FBa0NoQyxtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxjQUFjLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFBOztBQUU1RixTQUFTLHVCQUF1QixDQUFFLEVBQUUsRUFBRTtBQUMzQyxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzlCLFFBQU0sU0FBUyxHQUFHLElBQUksbUJBQW1CLENBQUM7QUFDeEMsZUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN4QixjQUFRLEVBQUUscUJBQVMsRUFBRSxDQUFDO0FBQ3RCLGNBQVEsRUFBRSxvQkFBTTtBQUNkLGlCQUFTLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbkIsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2hCO0FBQ0QsWUFBTSxFQUFFLGdCQUFDLFNBQVMsRUFBSztBQUNyQixpQkFBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ25CLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNmLGVBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtPQUNuQjtLQUNGLENBQUMsQ0FBQTtBQUNGLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0dBQ3hFLENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9icmVha3BvaW50LWNvbmRpdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IEV0Y2hDb21wb25lbnQgZnJvbSAnLi9ldGNoLWNvbXBvbmVudCdcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnLi90ZXh0LWlucHV0J1xuaW1wb3J0IHsgbG9jYXRpb24gfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludENvbmRpdGlvbiBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgc3VwZXIocHJvcHMsIGNoaWxkcmVuKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVEb2N1bWVudENsaWNrLCBmYWxzZSlcbiAgfVxuICBkZXN0cm95ICgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljaywgZmFsc2UpXG4gICAgc3VwZXIuZGVzdHJveSgpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctYnJlYWtwb2ludC1jb25kaXRpb24nPlxuICAgICAgPGIgY2xhc3NOYW1lPSdibG9jayc+QnJlYWtwb2ludCBjb25kaXRpb24gb24ge3RoaXMucHJvcHMubG9jYXRpb259PC9iPlxuICAgICAgPFRleHRJbnB1dCBhdXRvRm9jdXMgdmFsdWU9e3RoaXMucHJvcHMuY29uZGl0aW9ufSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIG9uRG9uZT17dGhpcy5oYW5kbGVEb25lfSBvbkNhbmNlbD17dGhpcy5oYW5kbGVDYW5jZWx9IC8+XG4gICAgPC9kaXY+XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UgKGNvbmRpdGlvbikge1xuICAgIHRoaXMudXBkYXRlKHsgY29uZGl0aW9uIH0pXG4gIH1cbiAgaGFuZGxlRG9uZSAoY29uZGl0aW9uKSB7XG4gICAgdGhpcy5wcm9wcy5vbkRvbmUoY29uZGl0aW9uKVxuICB9XG4gIGhhbmRsZUNhbmNlbCAoKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNhbmNlbCgpXG4gIH1cblxuICBoYW5kbGVEb2N1bWVudENsaWNrIChldikge1xuICAgIGlmICghdGhpcy5lbGVtZW50LmNvbnRhaW5zKGV2LnRhcmdldCkpIHtcbiAgICAgIHRoaXMucHJvcHMub25Eb25lKHRoaXMucHJvcHMuY29uZGl0aW9uKVxuICAgIH1cbiAgfVxufVxuQnJlYWtwb2ludENvbmRpdGlvbi5iaW5kRm5zID0gWydoYW5kbGVDaGFuZ2UnLCAnaGFuZGxlRG9uZScsICdoYW5kbGVDYW5jZWwnLCAnaGFuZGxlRG9jdW1lbnRDbGljayddXG5cbmV4cG9ydCBmdW5jdGlvbiBlZGl0QnJlYWtwb2ludENvbmRpdGlvbiAoYnApIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IEJyZWFrcG9pbnRDb25kaXRpb24oe1xuICAgICAgY29uZGl0aW9uOiBicC5jb25kIHx8ICcnLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uKGJwKSxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudC5kZXN0cm95KClcbiAgICAgICAgbW9kYWwuZGVzdHJveSgpXG4gICAgICB9LFxuICAgICAgb25Eb25lOiAoY29uZGl0aW9uKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudC5kZXN0cm95KClcbiAgICAgICAgbW9kYWwuZGVzdHJveSgpXG4gICAgICAgIHJlc29sdmUoY29uZGl0aW9uKVxuICAgICAgfVxuICAgIH0pXG4gICAgY29uc3QgbW9kYWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogY29tcG9uZW50LmVsZW1lbnQgfSlcbiAgfSlcbn1cbiJdfQ==