Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var Variables = (function (_EtchComponent) {
  _inherits(Variables, _EtchComponent);

  function Variables(props, children) {
    _classCallCheck(this, Variables);

    if (!props.path) {
      props.path = '';
    }
    if (!props.expanded) {
      props.expanded = {};
    }
    _get(Object.getPrototypeOf(Variables.prototype), 'constructor', this).call(this, props, children);
  }

  _createClass(Variables, [{
    key: 'render',
    value: function render() {
      var variables = this.props.variables || {};
      if (Object.keys(variables).length === 0) {
        return _etch2['default'].dom(
          'div',
          { className: 'go-debug-panel-variables-empty' },
          'No variables'
        );
      }
      return _etch2['default'].dom(
        'div',
        { style: (0, _utils.editorStyle)(), className: 'go-debug-panel-variables native-key-bindings', onclick: this.handleToggleClick, tabIndex: -1 },
        _etch2['default'].dom(Children, { variables: variables, path: this.props.path, expanded: this.props.expanded })
      );
    }
  }, {
    key: 'handleToggleClick',
    value: function handleToggleClick(ev) {
      var path = ev.target.dataset.path;
      if (!path) {
        return;
      }

      // load the variable if not done already
      var v = this.props.variables[path];
      if (v && !v.loaded) {
        this.props.dbg.loadVariable(path, v);
        return;
      }

      var expanded = this.props.expanded;

      this.update({
        expanded: Object.assign({}, expanded, _defineProperty({}, path, !expanded[path]))
      });
    }
  }]);

  return Variables;
})(_etchComponent2['default']);

exports.Variables = Variables;

Variables.bindFns = ['handleToggleClick'];

var VariablesContainer = _etchStoreComponent2['default'].create(Variables, function (state) {
  var delve = state.delve;

  return {
    variables: (delve.stacktrace[delve.selectedStacktrace] || {}).variables
  };
});

exports.VariablesContainer = VariablesContainer;

var Variable = (function (_EtchComponent2) {
  _inherits(Variable, _EtchComponent2);

  function Variable() {
    _classCallCheck(this, Variable);

    _get(Object.getPrototypeOf(Variable.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Variable, [{
    key: 'shouldUpdate',
    value: function shouldUpdate(newProps) {
      // new variables? new path? update!
      var _props = this.props;
      var variables = _props.variables;
      var path = _props.path;
      var expanded = _props.expanded;

      if (newProps.variables !== variables || newProps.path !== path) {
        return true;
      }

      var newExpanded = newProps.expanded;
      var equalsExpanded = function equalsExpanded(p) {
        return newExpanded[p] === expanded[p];
      };

      // only update if the expanded state if this variable or one
      // of it's children has changed
      if (!equalsExpanded(path)) {
        return true;
      }
      var children = Object.keys(newExpanded).filter(function (p) {
        return p.startsWith(path + '.');
      });
      return !children.every(equalsExpanded);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var variables = _props2.variables;
      var path = _props2.path;
      var expanded = _props2.expanded;

      var variable = variables[path];
      var isExpanded = variable.hasChildren && expanded[path];
      var toggleClassName = 'go-debug-icon icon icon-chevron-' + (isExpanded ? 'down' : 'right');
      if (!variable.hasChildren) {
        toggleClassName += ' go-debug-toggle-hidden';
      }

      var name = undefined;
      var value = undefined;
      if (variable.value) {
        name = _etch2['default'].dom(
          'span',
          { className: 'go-debug-panel-variables-name' },
          renderValue(variable.name),
          ': '
        );
        value = _etch2['default'].dom(
          'span',
          { className: 'go-debug-panel-variables-value' },
          renderValue(variable.value)
        );
      } else {
        name = _etch2['default'].dom(
          'span',
          { className: 'go-debug-panel-variables-name' },
          renderValue(variable.name)
        );
      }

      return _etch2['default'].dom(
        'li',
        null,
        _etch2['default'].dom(
          'div',
          null,
          _etch2['default'].dom('span', { className: toggleClassName, dataset: { path: path } }),
          name || null,
          value || null
        ),
        isExpanded ? _etch2['default'].dom(Children, { variables: variables, path: path, expanded: expanded }) : null
      );
    }
  }]);

  return Variable;
})(_etchComponent2['default']);

var Children = (function (_EtchComponent3) {
  _inherits(Children, _EtchComponent3);

  function Children() {
    _classCallCheck(this, Children);

    _get(Object.getPrototypeOf(Children.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Children, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var variables = _props3.variables;
      var path = _props3.path;
      var expanded = _props3.expanded;

      var children = Object.keys(variables || {}).filter(function (p) {
        return variables[p].parentPath === path;
      });
      if (!children.length) {
        return _etch2['default'].dom('div', null);
      }
      var v = variables[path];
      if (v && (v.type === 'slice' || v.type === 'array')) {
        children.sort(function (p1, p2) {
          if (p1.endsWith('more')) {
            return 1;
          }
          if (p2.endsWith('more')) {
            return -1;
          }
          return parseInt(name(p1), 10) - parseInt(name(p2), 10);
        });
      } else {
        children.sort();
      }
      var vars = children.map(function (p, i) {
        return _etch2['default'].dom(Variable, { key: i, path: p, variables: variables, expanded: expanded });
      });
      return _etch2['default'].dom(
        'ol',
        null,
        vars
      );
    }
  }]);

  return Children;
})(_etchComponent2['default']);

function renderValue(value) {
  if (Array.isArray(value)) {
    return value.map(function (v, i) {
      return _etch2['default'].dom(
        'span',
        { key: i },
        renderValue(v)
      );
    });
  }
  if (value && typeof value === 'object' && 'value' in value) {
    var v = renderValue(value.value);
    return value.className ? _etch2['default'].dom(
      'span',
      { className: value.className },
      v
    ) : v;
  }
  return value === undefined || value === null || value === false ? '' : value;
}

function name(path) {
  return path.split('.').slice(-1)[0] || path;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi92YXJpYWJsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7OzZCQUNHLGtCQUFrQjs7OztrQ0FDYix3QkFBd0I7Ozs7cUJBQzNCLFNBQVM7O0FBTnJDLFdBQVcsQ0FBQTtJQVFFLFNBQVM7WUFBVCxTQUFTOztBQUNSLFdBREQsU0FBUyxDQUNQLEtBQUssRUFBRSxRQUFRLEVBQUU7MEJBRG5CLFNBQVM7O0FBRWxCLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ2YsV0FBSyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7S0FDaEI7QUFDRCxRQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNuQixXQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtLQUNwQjtBQUNELCtCQVJTLFNBQVMsNkNBUVosS0FBSyxFQUFFLFFBQVEsRUFBQztHQUN2Qjs7ZUFUVSxTQUFTOztXQVViLGtCQUFHO0FBQ1IsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFBO0FBQzVDLFVBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3ZDLGVBQU87O1lBQUssU0FBUyxFQUFDLGdDQUFnQzs7U0FBbUIsQ0FBQTtPQUMxRTtBQUNELGFBQU87O1VBQUssS0FBSyxFQUFFLHlCQUFhLEFBQUMsRUFBQyxTQUFTLEVBQUMsOENBQThDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQUFBQyxFQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQUFBQztRQUN2SSxzQkFBQyxRQUFRLElBQUMsU0FBUyxFQUFFLFNBQVMsQUFBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQUFBQyxFQUFDLFFBQVEsRUFB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QUN4RSxDQUFBO0FBQ0QsYUFBTzs7O1FBQUssSUFBSTtPQUFNLENBQUE7S0FDdkI7OztTQXpCRyxRQUFROzs7QUE0QmQsU0FBUyxXQUFXLENBQUUsS0FBSyxFQUFFO0FBQzNCLE1BQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN4QixXQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQzthQUFLOztVQUFNLEdBQUcsRUFBRSxDQUFDLEFBQUM7UUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQVE7S0FBQSxDQUFDLENBQUE7R0FDbEU7QUFDRCxNQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLEtBQUssRUFBRTtBQUMxRCxRQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xDLFdBQU8sS0FBSyxDQUFDLFNBQVMsR0FBRzs7UUFBTSxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQUFBQztNQUFFLENBQUM7S0FBUSxHQUFHLENBQUMsQ0FBQTtHQUMxRTtBQUNELFNBQU8sQUFBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLEtBQUssR0FBSSxFQUFFLEdBQUcsS0FBSyxDQUFBO0NBQy9FOztBQUVELFNBQVMsSUFBSSxDQUFFLElBQUksRUFBRTtBQUNuQixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFBO0NBQzVDIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi92YXJpYWJsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgRXRjaFN0b3JlQ29tcG9uZW50IGZyb20gJy4vZXRjaC1zdG9yZS1jb21wb25lbnQnXG5pbXBvcnQgeyBlZGl0b3JTdHlsZSB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZXMgZXh0ZW5kcyBFdGNoQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzLCBjaGlsZHJlbikge1xuICAgIGlmICghcHJvcHMucGF0aCkge1xuICAgICAgcHJvcHMucGF0aCA9ICcnXG4gICAgfVxuICAgIGlmICghcHJvcHMuZXhwYW5kZWQpIHtcbiAgICAgIHByb3BzLmV4cGFuZGVkID0ge31cbiAgICB9XG4gICAgc3VwZXIocHJvcHMsIGNoaWxkcmVuKVxuICB9XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgdmFyaWFibGVzID0gdGhpcy5wcm9wcy52YXJpYWJsZXMgfHwge31cbiAgICBpZiAoT2JqZWN0LmtleXModmFyaWFibGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtdmFyaWFibGVzLWVtcHR5Jz5ObyB2YXJpYWJsZXM8L2Rpdj5cbiAgICB9XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VkaXRvclN0eWxlKCl9IGNsYXNzTmFtZT0nZ28tZGVidWctcGFuZWwtdmFyaWFibGVzIG5hdGl2ZS1rZXktYmluZGluZ3MnIG9uY2xpY2s9e3RoaXMuaGFuZGxlVG9nZ2xlQ2xpY2t9IHRhYkluZGV4PXstMX0+XG4gICAgICA8Q2hpbGRyZW4gdmFyaWFibGVzPXt2YXJpYWJsZXN9IHBhdGg9e3RoaXMucHJvcHMucGF0aH0gZXhwYW5kZWQ9e3RoaXMucHJvcHMuZXhwYW5kZWR9IC8+XG4gICAgPC9kaXY+XG4gIH1cbiAgaGFuZGxlVG9nZ2xlQ2xpY2sgKGV2KSB7XG4gICAgY29uc3QgcGF0aCA9IGV2LnRhcmdldC5kYXRhc2V0LnBhdGhcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGxvYWQgdGhlIHZhcmlhYmxlIGlmIG5vdCBkb25lIGFscmVhZHlcbiAgICBjb25zdCB2ID0gdGhpcy5wcm9wcy52YXJpYWJsZXNbcGF0aF1cbiAgICBpZiAodiAmJiAhdi5sb2FkZWQpIHtcbiAgICAgIHRoaXMucHJvcHMuZGJnLmxvYWRWYXJpYWJsZShwYXRoLCB2KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgeyBleHBhbmRlZCB9ID0gdGhpcy5wcm9wc1xuICAgIHRoaXMudXBkYXRlKHtcbiAgICAgIGV4cGFuZGVkOiBPYmplY3QuYXNzaWduKHt9LCBleHBhbmRlZCwgeyBbcGF0aF06ICFleHBhbmRlZFtwYXRoXSB9KVxuICAgIH0pXG4gIH1cbn1cblZhcmlhYmxlcy5iaW5kRm5zID0gWydoYW5kbGVUb2dnbGVDbGljayddXG5cbmV4cG9ydCBjb25zdCBWYXJpYWJsZXNDb250YWluZXIgPSBFdGNoU3RvcmVDb21wb25lbnQuY3JlYXRlKFxuICBWYXJpYWJsZXMsXG4gIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgZGVsdmUgfSA9IHN0YXRlXG4gICAgcmV0dXJuIHtcbiAgICAgIHZhcmlhYmxlczogKGRlbHZlLnN0YWNrdHJhY2VbZGVsdmUuc2VsZWN0ZWRTdGFja3RyYWNlXSB8fCB7fSkudmFyaWFibGVzXG4gICAgfVxuICB9XG4pXG5cbmNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXRjaENvbXBvbmVudCB7XG4gIHNob3VsZFVwZGF0ZSAobmV3UHJvcHMpIHtcbiAgICAvLyBuZXcgdmFyaWFibGVzPyBuZXcgcGF0aD8gdXBkYXRlIVxuICAgIGNvbnN0IHsgdmFyaWFibGVzLCBwYXRoLCBleHBhbmRlZCB9ID0gdGhpcy5wcm9wc1xuICAgIGlmIChuZXdQcm9wcy52YXJpYWJsZXMgIT09IHZhcmlhYmxlcyB8fCBuZXdQcm9wcy5wYXRoICE9PSBwYXRoKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IG5ld0V4cGFuZGVkID0gbmV3UHJvcHMuZXhwYW5kZWRcbiAgICBjb25zdCBlcXVhbHNFeHBhbmRlZCA9IChwKSA9PiBuZXdFeHBhbmRlZFtwXSA9PT0gZXhwYW5kZWRbcF1cblxuICAgIC8vIG9ubHkgdXBkYXRlIGlmIHRoZSBleHBhbmRlZCBzdGF0ZSBpZiB0aGlzIHZhcmlhYmxlIG9yIG9uZVxuICAgIC8vIG9mIGl0J3MgY2hpbGRyZW4gaGFzIGNoYW5nZWRcbiAgICBpZiAoIWVxdWFsc0V4cGFuZGVkKHBhdGgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IE9iamVjdC5rZXlzKG5ld0V4cGFuZGVkKS5maWx0ZXIoKHApID0+IHAuc3RhcnRzV2l0aChwYXRoICsgJy4nKSlcbiAgICByZXR1cm4gIWNoaWxkcmVuLmV2ZXJ5KGVxdWFsc0V4cGFuZGVkKVxuICB9XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyB2YXJpYWJsZXMsIHBhdGgsIGV4cGFuZGVkIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgdmFyaWFibGUgPSB2YXJpYWJsZXNbcGF0aF1cbiAgICBjb25zdCBpc0V4cGFuZGVkID0gdmFyaWFibGUuaGFzQ2hpbGRyZW4gJiYgZXhwYW5kZWRbcGF0aF1cbiAgICBsZXQgdG9nZ2xlQ2xhc3NOYW1lID0gJ2dvLWRlYnVnLWljb24gaWNvbiBpY29uLWNoZXZyb24tJyArIChpc0V4cGFuZGVkID8gJ2Rvd24nIDogJ3JpZ2h0JylcbiAgICBpZiAoIXZhcmlhYmxlLmhhc0NoaWxkcmVuKSB7XG4gICAgICB0b2dnbGVDbGFzc05hbWUgKz0gJyBnby1kZWJ1Zy10b2dnbGUtaGlkZGVuJ1xuICAgIH1cblxuICAgIGxldCBuYW1lXG4gICAgbGV0IHZhbHVlXG4gICAgaWYgKHZhcmlhYmxlLnZhbHVlKSB7XG4gICAgICBuYW1lID0gPHNwYW4gY2xhc3NOYW1lPSdnby1kZWJ1Zy1wYW5lbC12YXJpYWJsZXMtbmFtZSc+e3JlbmRlclZhbHVlKHZhcmlhYmxlLm5hbWUpfTogPC9zcGFuPlxuICAgICAgdmFsdWUgPSA8c3BhbiBjbGFzc05hbWU9J2dvLWRlYnVnLXBhbmVsLXZhcmlhYmxlcy12YWx1ZSc+e3JlbmRlclZhbHVlKHZhcmlhYmxlLnZhbHVlKX08L3NwYW4+XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSA8c3BhbiBjbGFzc05hbWU9J2dvLWRlYnVnLXBhbmVsLXZhcmlhYmxlcy1uYW1lJz57cmVuZGVyVmFsdWUodmFyaWFibGUubmFtZSl9PC9zcGFuPlxuICAgIH1cblxuICAgIHJldHVybiA8bGk+XG4gICAgICA8ZGl2PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3RvZ2dsZUNsYXNzTmFtZX0gZGF0YXNldD17eyBwYXRoIH19IC8+XG4gICAgICAgIHtuYW1lIHx8IG51bGx9XG4gICAgICAgIHt2YWx1ZSB8fCBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgICB7aXNFeHBhbmRlZCA/IDxDaGlsZHJlbiB2YXJpYWJsZXM9e3ZhcmlhYmxlc30gcGF0aD17cGF0aH0gZXhwYW5kZWQ9e2V4cGFuZGVkfSAvPiA6IG51bGx9XG4gICAgPC9saT5cbiAgfVxufVxuXG5jbGFzcyBDaGlsZHJlbiBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgdmFyaWFibGVzLCBwYXRoLCBleHBhbmRlZCB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGNoaWxkcmVuID0gT2JqZWN0LmtleXModmFyaWFibGVzIHx8IHt9KS5maWx0ZXIoKHApID0+IHZhcmlhYmxlc1twXS5wYXJlbnRQYXRoID09PSBwYXRoKVxuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gPGRpdiAvPlxuICAgIH1cbiAgICBjb25zdCB2ID0gdmFyaWFibGVzW3BhdGhdXG4gICAgaWYgKHYgJiYgKHYudHlwZSA9PT0gJ3NsaWNlJyB8fCB2LnR5cGUgPT09ICdhcnJheScpKSB7XG4gICAgICBjaGlsZHJlbi5zb3J0KChwMSwgcDIpID0+IHtcbiAgICAgICAgaWYgKHAxLmVuZHNXaXRoKCdtb3JlJykpIHtcbiAgICAgICAgICByZXR1cm4gMVxuICAgICAgICB9XG4gICAgICAgIGlmIChwMi5lbmRzV2l0aCgnbW9yZScpKSB7XG4gICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG5hbWUocDEpLCAxMCkgLSBwYXJzZUludChuYW1lKHAyKSwgMTApXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZHJlbi5zb3J0KClcbiAgICB9XG4gICAgY29uc3QgdmFycyA9IGNoaWxkcmVuLm1hcCgocCwgaSkgPT5cbiAgICAgIDxWYXJpYWJsZSBrZXk9e2l9IHBhdGg9e3B9IHZhcmlhYmxlcz17dmFyaWFibGVzfSBleHBhbmRlZD17ZXhwYW5kZWR9IC8+XG4gICAgKVxuICAgIHJldHVybiA8b2w+e3ZhcnN9PC9vbD5cbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJWYWx1ZSAodmFsdWUpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hcCgodiwgaSkgPT4gPHNwYW4ga2V5PXtpfT57cmVuZGVyVmFsdWUodil9PC9zcGFuPilcbiAgfVxuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAndmFsdWUnIGluIHZhbHVlKSB7XG4gICAgY29uc3QgdiA9IHJlbmRlclZhbHVlKHZhbHVlLnZhbHVlKVxuICAgIHJldHVybiB2YWx1ZS5jbGFzc05hbWUgPyA8c3BhbiBjbGFzc05hbWU9e3ZhbHVlLmNsYXNzTmFtZX0+e3Z9PC9zcGFuPiA6IHZcbiAgfVxuICByZXR1cm4gKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IGZhbHNlKSA/ICcnIDogdmFsdWVcbn1cblxuZnVuY3Rpb24gbmFtZSAocGF0aCkge1xuICByZXR1cm4gcGF0aC5zcGxpdCgnLicpLnNsaWNlKC0xKVswXSB8fCBwYXRoXG59XG4iXX0=