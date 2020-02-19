Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _textInput = require('./text-input');

var _textInput2 = _interopRequireDefault(_textInput);

var _variables = require('./variables');

'use babel';

var contentTypes = {
  'message': function message(_ref) {
    var _message = _ref.message;
    return _etch2['default'].dom('span', { innerHTML: _message });
  },
  'eval': function _eval(_ref2) {
    var variables = _ref2.variables;
    return _etch2['default'].dom(_variables.Variables, { variables: variables });
  },
  'dlvSpawnOptions': function dlvSpawnOptions(input) {
    return _etch2['default'].dom(DlvSpawnOptions, input);
  }
};

var OutputPanel = (function (_EtchComponent) {
  _inherits(OutputPanel, _EtchComponent);

  function OutputPanel() {
    _classCallCheck(this, OutputPanel);

    _get(Object.getPrototypeOf(OutputPanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(OutputPanel, [{
    key: 'init',
    value: function init() {
      if (this.props.model) {
        this.props.model.view = this;
      }
      _get(Object.getPrototypeOf(OutputPanel.prototype), 'init', this).call(this);
    }
  }, {
    key: 'shouldUpdate',
    value: function shouldUpdate() {
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var model = this.props.model;

      if (!model || !model.ready()) {
        return _etch2['default'].dom(
          'div',
          null,
          'The debugger is not ready ...'
        );
      }

      var elements = model.props.content.map(function (o) {
        var fn = contentTypes[o.type];
        return fn ? fn(o) : null;
      }).filter(Boolean);

      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-output', tabIndex: -1 },
        _etch2['default'].dom(
          'div',
          { className: 'go-debug-output-sidebar' },
          _etch2['default'].dom('button', { type: 'button', className: 'btn go-debug-btn-flat icon icon-trashcan',
            onclick: model.handleClickClean, title: 'Clean' })
        ),
        _etch2['default'].dom(
          'div',
          { className: 'go-debug-output-content' },
          _etch2['default'].dom(
            'div',
            { ref: 'content', className: 'output', scrollTop: this.scrollHeight },
            elements
          ),
          _etch2['default'].dom(_textInput2['default'], { value: model.props.replValue, placeholder: '>', onChange: model.handleChangeRepl,
            onDone: model.handleEnterRepl, onKeyDown: model.handleKeyDownRepl })
        )
      );
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      var content = this.refs.content;
      if (!content) {
        return;
      }

      var scrollHeight = content.scrollHeight;
      if (scrollHeight && this.scrollHeight !== scrollHeight) {
        this.scrollHeight = scrollHeight;
        content.scrollTop = this.scrollHeight;
        this.update();
      }
    }
  }]);

  return OutputPanel;
})(_etchComponent2['default']);

exports['default'] = OutputPanel;

var DlvSpawnOptions = (function (_EtchComponent2) {
  _inherits(DlvSpawnOptions, _EtchComponent2);

  function DlvSpawnOptions(props, children) {
    _classCallCheck(this, DlvSpawnOptions);

    _get(Object.getPrototypeOf(DlvSpawnOptions.prototype), 'constructor', this).call(this, _extends({ expanded: false }, props), children);
  }

  _createClass(DlvSpawnOptions, [{
    key: 'handleExpandChange',
    value: function handleExpandChange() {
      this.update({ expanded: !this.props.expanded });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var path = _props.path;
      var args = _props.args;
      var cwd = _props.cwd;
      var expanded = _props.expanded;

      return _etch2['default'].dom(
        'div',
        null,
        'Running delve with:',
        _etch2['default'].dom('br', null),
        _etch2['default'].dom(
          'div',
          { className: 'dlvspawnoptions-indent' },
          'Dlv path: ',
          path
        ),
        _etch2['default'].dom(
          'div',
          { className: 'dlvspawnoptions-indent' },
          'Arguments: ',
          args.join(' ')
        ),
        _etch2['default'].dom(
          'div',
          { className: 'dlvspawnoptions-indent' },
          'CWD: ',
          cwd
        ),
        _etch2['default'].dom(
          'div',
          null,
          _etch2['default'].dom('span', { className: 'go-debug-icon icon icon-chevron-' + (expanded ? 'down' : 'right'),
            onclick: this.handleExpandChange }),
          ' Environment: ',
          expanded ? null : '(...)',
          expanded ? this.renderEnv() : null
        )
      );
    }
  }, {
    key: 'renderEnv',
    value: function renderEnv() {
      var env = this.props.env;

      var items = Object.keys(env).sort().map(function (key) {
        return _etch2['default'].dom(
          'div',
          null,
          key,
          '=',
          env[key]
        );
      });
      return _etch2['default'].dom(
        'div',
        { className: 'dlvspawnoptions-indent' },
        items
      );
    }
  }]);

  return DlvSpawnOptions;
})(_etchComponent2['default']);

DlvSpawnOptions.bindFns = ['handleExpandChange'];
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9vdXRwdXQtcGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7OzZCQUNHLGtCQUFrQjs7Ozt5QkFDdEIsY0FBYzs7Ozt5QkFDVixhQUFhOztBQU52QyxXQUFXLENBQUE7O0FBUVgsSUFBTSxZQUFZLEdBQUc7QUFDbkIsV0FBUyxFQUFFLGlCQUFDLElBQVc7UUFBVCxRQUFPLEdBQVQsSUFBVyxDQUFULE9BQU87V0FBTyxnQ0FBTSxTQUFTLEVBQUUsUUFBTyxBQUFDLEdBQUc7R0FBQTtBQUN4RCxRQUFNLEVBQUUsZUFBQyxLQUFhO1FBQVgsU0FBUyxHQUFYLEtBQWEsQ0FBWCxTQUFTO1dBQU8sOENBQVcsU0FBUyxFQUFFLFNBQVMsQUFBQyxHQUFHO0dBQUE7QUFDOUQsbUJBQWlCLEVBQUUseUJBQUMsS0FBSyxFQUFLO0FBQzVCLFdBQU8sc0JBQUMsZUFBZSxFQUFLLEtBQUssQ0FBSSxDQUFBO0dBQ3RDO0NBQ0YsQ0FBQTs7SUFFb0IsV0FBVztZQUFYLFdBQVc7O1dBQVgsV0FBVzswQkFBWCxXQUFXOzsrQkFBWCxXQUFXOzs7ZUFBWCxXQUFXOztXQUN6QixnQkFBRztBQUNOLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDcEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtPQUM3QjtBQUNELGlDQUxpQixXQUFXLHNDQUtoQjtLQUNiOzs7V0FFWSx3QkFBRztBQUNkLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUVNLGtCQUFHO1VBQ0EsS0FBSyxHQUFLLElBQUksQ0FBQyxLQUFLLENBQXBCLEtBQUs7O0FBQ2IsVUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUM1QixlQUFPOzs7O1NBQXdDLENBQUE7T0FDaEQ7O0FBRUQsVUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQzlDLFlBQU0sRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDL0IsZUFBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQTtPQUN6QixDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUVsQixhQUFPOztVQUFLLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEFBQUM7UUFDbkQ7O1lBQUssU0FBUyxFQUFDLHlCQUF5QjtVQUN0QyxrQ0FBUSxJQUFJLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQywwQ0FBMEM7QUFDeEUsbUJBQU8sRUFBRSxLQUFLLENBQUMsZ0JBQWdCLEFBQUMsRUFBQyxLQUFLLEVBQUMsT0FBTyxHQUFHO1NBQy9DO1FBQ047O1lBQUssU0FBUyxFQUFDLHlCQUF5QjtVQUN0Qzs7Y0FBSyxHQUFHLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7WUFDaEUsUUFBUTtXQUNMO1VBQ04sZ0RBQVcsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixBQUFDO0FBQ3hGLGtCQUFNLEVBQUUsS0FBSyxDQUFDLGVBQWUsQUFBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsaUJBQWlCLEFBQUMsR0FBRztTQUNuRTtPQUNGLENBQUE7S0FDUDs7O1dBRWUsMkJBQUc7QUFDakIsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7QUFDL0IsVUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLGVBQU07T0FDUDs7QUFFRCxVQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFBO0FBQ3ZDLFVBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssWUFBWSxFQUFFO0FBQ3RELFlBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO0FBQ2hDLGVBQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQTtBQUNyQyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDZDtLQUNGOzs7U0FsRGtCLFdBQVc7OztxQkFBWCxXQUFXOztJQXFEMUIsZUFBZTtZQUFmLGVBQWU7O0FBQ1AsV0FEUixlQUFlLENBQ04sS0FBSyxFQUFFLFFBQVEsRUFBRTswQkFEMUIsZUFBZTs7QUFFakIsK0JBRkUsZUFBZSx3REFFVCxRQUFRLEVBQUUsS0FBSyxJQUFLLEtBQUssR0FBSSxRQUFRLEVBQUM7R0FDL0M7O2VBSEcsZUFBZTs7V0FJQSw4QkFBRztBQUNwQixVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxrQkFBRzttQkFDOEIsSUFBSSxDQUFDLEtBQUs7VUFBeEMsSUFBSSxVQUFKLElBQUk7VUFBRSxJQUFJLFVBQUosSUFBSTtVQUFFLEdBQUcsVUFBSCxHQUFHO1VBQUUsUUFBUSxVQUFSLFFBQVE7O0FBQ2pDLGFBQU87Ozs7UUFDYyxpQ0FBTTtRQUN6Qjs7WUFBSyxTQUFTLEVBQUMsd0JBQXdCOztVQUFZLElBQUk7U0FBTztRQUM5RDs7WUFBSyxTQUFTLEVBQUMsd0JBQXdCOztVQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQU87UUFDekU7O1lBQUssU0FBUyxFQUFDLHdCQUF3Qjs7VUFBTyxHQUFHO1NBQU87UUFDeEQ7OztVQUNFLGdDQUFNLFNBQVMsRUFBRSxrQ0FBa0MsSUFBSSxRQUFRLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQSxBQUFDLEFBQUM7QUFDbEYsbUJBQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLEFBQUMsR0FBRzs7VUFBb0IsUUFBUSxHQUFHLElBQUksR0FBRyxPQUFPO1VBQ2xGLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSTtTQUMvQjtPQUNGLENBQUE7S0FDUDs7O1dBQ1MscUJBQUc7VUFDSCxHQUFHLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBbEIsR0FBRzs7QUFDWCxVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUc7ZUFBSzs7O1VBQU0sR0FBRzs7VUFBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1NBQU87T0FBQSxDQUFDLENBQUE7QUFDL0UsYUFBTzs7VUFBSyxTQUFTLEVBQUMsd0JBQXdCO1FBQUUsS0FBSztPQUFPLENBQUE7S0FDN0Q7OztTQXpCRyxlQUFlOzs7QUEyQnJCLGVBQWUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9vdXRwdXQtcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJy4vdGV4dC1pbnB1dCdcbmltcG9ydCB7IFZhcmlhYmxlcyB9IGZyb20gJy4vdmFyaWFibGVzJ1xuXG5jb25zdCBjb250ZW50VHlwZXMgPSB7XG4gICdtZXNzYWdlJzogKHsgbWVzc2FnZSB9KSA9PiA8c3BhbiBpbm5lckhUTUw9e21lc3NhZ2V9IC8+LFxuICAnZXZhbCc6ICh7IHZhcmlhYmxlcyB9KSA9PiA8VmFyaWFibGVzIHZhcmlhYmxlcz17dmFyaWFibGVzfSAvPixcbiAgJ2RsdlNwYXduT3B0aW9ucyc6IChpbnB1dCkgPT4ge1xuICAgIHJldHVybiA8RGx2U3Bhd25PcHRpb25zIHsuLi5pbnB1dH0gLz5cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXRQYW5lbCBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICBpbml0ICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlbCkge1xuICAgICAgdGhpcy5wcm9wcy5tb2RlbC52aWV3ID0gdGhpc1xuICAgIH1cbiAgICBzdXBlci5pbml0KClcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBtb2RlbCB9ID0gdGhpcy5wcm9wc1xuICAgIGlmICghbW9kZWwgfHwgIW1vZGVsLnJlYWR5KCkpIHtcbiAgICAgIHJldHVybiA8ZGl2PlRoZSBkZWJ1Z2dlciBpcyBub3QgcmVhZHkgLi4uPC9kaXY+XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudHMgPSBtb2RlbC5wcm9wcy5jb250ZW50Lm1hcCgobykgPT4ge1xuICAgICAgY29uc3QgZm4gPSBjb250ZW50VHlwZXNbby50eXBlXVxuICAgICAgcmV0dXJuIGZuID8gZm4obykgOiBudWxsXG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pXG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dvLWRlYnVnLW91dHB1dCcgdGFiSW5kZXg9ey0xfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdnby1kZWJ1Zy1vdXRwdXQtc2lkZWJhcic+XG4gICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2J0biBnby1kZWJ1Zy1idG4tZmxhdCBpY29uIGljb24tdHJhc2hjYW4nXG4gICAgICAgICAgb25jbGljaz17bW9kZWwuaGFuZGxlQ2xpY2tDbGVhbn0gdGl0bGU9J0NsZWFuJyAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctb3V0cHV0LWNvbnRlbnQnPlxuICAgICAgICA8ZGl2IHJlZj0nY29udGVudCcgY2xhc3NOYW1lPSdvdXRwdXQnIHNjcm9sbFRvcD17dGhpcy5zY3JvbGxIZWlnaHR9PlxuICAgICAgICAgIHtlbGVtZW50c31cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxUZXh0SW5wdXQgdmFsdWU9e21vZGVsLnByb3BzLnJlcGxWYWx1ZX0gcGxhY2Vob2xkZXI9Jz4nIG9uQ2hhbmdlPXttb2RlbC5oYW5kbGVDaGFuZ2VSZXBsfVxuICAgICAgICAgIG9uRG9uZT17bW9kZWwuaGFuZGxlRW50ZXJSZXBsfSBvbktleURvd249e21vZGVsLmhhbmRsZUtleURvd25SZXBsfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cblxuICByZWFkQWZ0ZXJVcGRhdGUgKCkge1xuICAgIGxldCBjb250ZW50ID0gdGhpcy5yZWZzLmNvbnRlbnRcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBzY3JvbGxIZWlnaHQgPSBjb250ZW50LnNjcm9sbEhlaWdodFxuICAgIGlmIChzY3JvbGxIZWlnaHQgJiYgdGhpcy5zY3JvbGxIZWlnaHQgIT09IHNjcm9sbEhlaWdodCkge1xuICAgICAgdGhpcy5zY3JvbGxIZWlnaHQgPSBzY3JvbGxIZWlnaHRcbiAgICAgIGNvbnRlbnQuc2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxIZWlnaHRcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRGx2U3Bhd25PcHRpb25zIGV4dGVuZHMgRXRjaENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcywgY2hpbGRyZW4pIHtcbiAgICBzdXBlcih7IGV4cGFuZGVkOiBmYWxzZSwgLi4ucHJvcHMgfSwgY2hpbGRyZW4pXG4gIH1cbiAgaGFuZGxlRXhwYW5kQ2hhbmdlICgpIHtcbiAgICB0aGlzLnVwZGF0ZSh7IGV4cGFuZGVkOiAhdGhpcy5wcm9wcy5leHBhbmRlZCB9KVxuICB9XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBwYXRoLCBhcmdzLCBjd2QsIGV4cGFuZGVkIH0gPSB0aGlzLnByb3BzXG4gICAgcmV0dXJuIDxkaXY+XG4gICAgICBSdW5uaW5nIGRlbHZlIHdpdGg6PGJyIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZGx2c3Bhd25vcHRpb25zLWluZGVudCc+RGx2IHBhdGg6IHtwYXRofTwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9J2RsdnNwYXdub3B0aW9ucy1pbmRlbnQnPkFyZ3VtZW50czoge2FyZ3Muam9pbignICcpfTwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9J2RsdnNwYXdub3B0aW9ucy1pbmRlbnQnPkNXRDoge2N3ZH08L2Rpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17J2dvLWRlYnVnLWljb24gaWNvbiBpY29uLWNoZXZyb24tJyArIChleHBhbmRlZCA/ICdkb3duJyA6ICdyaWdodCcpfVxuICAgICAgICAgIG9uY2xpY2s9e3RoaXMuaGFuZGxlRXhwYW5kQ2hhbmdlfSAvPiZuYnNwO0Vudmlyb25tZW50OiB7ZXhwYW5kZWQgPyBudWxsIDogJyguLi4pJ31cbiAgICAgICAge2V4cGFuZGVkID8gdGhpcy5yZW5kZXJFbnYoKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgfVxuICByZW5kZXJFbnYgKCkge1xuICAgIGNvbnN0IHsgZW52IH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgaXRlbXMgPSBPYmplY3Qua2V5cyhlbnYpLnNvcnQoKS5tYXAoKGtleSkgPT4gPGRpdj57a2V5fT17ZW52W2tleV19PC9kaXY+KVxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZGx2c3Bhd25vcHRpb25zLWluZGVudCc+e2l0ZW1zfTwvZGl2PlxuICB9XG59XG5EbHZTcGF3bk9wdGlvbnMuYmluZEZucyA9IFsnaGFuZGxlRXhwYW5kQ2hhbmdlJ11cbiJdfQ==