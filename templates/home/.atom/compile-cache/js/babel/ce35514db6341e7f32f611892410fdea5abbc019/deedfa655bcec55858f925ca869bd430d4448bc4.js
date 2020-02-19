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

'use babel';
var Expandable = (function (_EtchComponent) {
  _inherits(Expandable, _EtchComponent);

  function Expandable() {
    _classCallCheck(this, Expandable);

    _get(Object.getPrototypeOf(Expandable.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Expandable, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var expanded = _props.expanded;
      var title = _props.title;

      return _etch2['default'].dom(
        'div',
        { className: 'go-debug-expandable', dataset: { expanded: expanded } },
        _etch2['default'].dom(
          'div',
          { className: 'go-debug-expandable-header panel-heading', onclick: this.handleExpandChange },
          _etch2['default'].dom('span', { className: 'go-debug-icon icon icon-chevron-' + (expanded ? 'down' : 'right') }),
          title
        ),
        _etch2['default'].dom(
          'div',
          { className: 'go-debug-expandable-body' },
          this.children
        )
      );
    }
  }, {
    key: 'handleExpandChange',
    value: function handleExpandChange() {
      this.props.onChange(this.props.name);
    }
  }]);

  return Expandable;
})(_etchComponent2['default']);

exports['default'] = Expandable;

Expandable.bindFns = ['handleExpandChange'];
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9leHBhbmRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7O0FBSjVDLFdBQVcsQ0FBQTtJQU1VLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FDdEIsa0JBQUc7bUJBQ29CLElBQUksQ0FBQyxLQUFLO1VBQTlCLFFBQVEsVUFBUixRQUFRO1VBQUUsS0FBSyxVQUFMLEtBQUs7O0FBQ3ZCLGFBQU87O1VBQUssU0FBUyxFQUFDLHFCQUFxQixFQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQUFBQztRQUNoRTs7WUFBSyxTQUFTLEVBQUMsMENBQTBDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQUFBQztVQUN6RixnQ0FBTSxTQUFTLEVBQUUsa0NBQWtDLElBQUksUUFBUSxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUEsQUFBQyxBQUFDLEdBQUc7VUFDdEYsS0FBSztTQUNGO1FBQ047O1lBQUssU0FBUyxFQUFDLDBCQUEwQjtVQUN0QyxJQUFJLENBQUMsUUFBUTtTQUNWO09BQ0YsQ0FBQTtLQUNQOzs7V0FFa0IsOEJBQUc7QUFDcEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNyQzs7O1NBaEJrQixVQUFVOzs7cUJBQVYsVUFBVTs7QUFrQi9CLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9leHBhbmRhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgRXRjaENvbXBvbmVudCBmcm9tICcuL2V0Y2gtY29tcG9uZW50J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBhbmRhYmxlIGV4dGVuZHMgRXRjaENvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBleHBhbmRlZCwgdGl0bGUgfSA9IHRoaXMucHJvcHNcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dvLWRlYnVnLWV4cGFuZGFibGUnIGRhdGFzZXQ9e3sgZXhwYW5kZWQgfX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctZXhwYW5kYWJsZS1oZWFkZXIgcGFuZWwtaGVhZGluZycgb25jbGljaz17dGhpcy5oYW5kbGVFeHBhbmRDaGFuZ2V9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnby1kZWJ1Zy1pY29uIGljb24gaWNvbi1jaGV2cm9uLScgKyAoZXhwYW5kZWQgPyAnZG93bicgOiAncmlnaHQnKX0gLz5cbiAgICAgICAge3RpdGxlfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZ28tZGVidWctZXhwYW5kYWJsZS1ib2R5Jz5cbiAgICAgICAge3RoaXMuY2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgfVxuXG4gIGhhbmRsZUV4cGFuZENoYW5nZSAoKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnByb3BzLm5hbWUpXG4gIH1cbn1cbkV4cGFuZGFibGUuYmluZEZucyA9IFsnaGFuZGxlRXhwYW5kQ2hhbmdlJ11cbiJdfQ==