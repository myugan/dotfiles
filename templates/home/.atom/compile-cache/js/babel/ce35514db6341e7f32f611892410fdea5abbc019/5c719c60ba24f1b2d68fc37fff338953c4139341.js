var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sbReactTable = require('sb-react-table');

var _sbReactTable2 = _interopRequireDefault(_sbReactTable);

var _helpers = require('../helpers');

var PanelComponent = (function (_React$Component) {
  _inherits(PanelComponent, _React$Component);

  _createClass(PanelComponent, null, [{
    key: 'renderRowColumn',
    value: function renderRowColumn(row, column) {
      var range = (0, _helpers.$range)(row);

      switch (column) {
        case 'file':
          return (0, _helpers.getPathOfMessage)(row);
        case 'line':
          return range ? range.start.row + 1 + ':' + (range.start.column + 1) : '';
        case 'excerpt':
          return row.excerpt;
        case 'severity':
          return _helpers.severityNames[row.severity];
        default:
          return row[column];
      }
    }
  }]);

  function PanelComponent(props, context) {
    _classCallCheck(this, PanelComponent);

    _get(Object.getPrototypeOf(PanelComponent.prototype), 'constructor', this).call(this, props, context);

    this.onClick = function (e, row) {
      if (e.target.tagName === 'A') {
        return;
      }
      if (process.platform === 'darwin' ? e.metaKey : e.ctrlKey) {
        if (e.shiftKey) {
          (0, _helpers.openExternally)(row);
        } else {
          (0, _helpers.visitMessage)(row, true);
        }
      } else {
        (0, _helpers.visitMessage)(row);
      }
    };

    this.state = {
      messages: this.props.delegate.filteredMessages
    };
  }

  _createClass(PanelComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onDidChangeMessages(function (messages) {
        _this.setState({ messages: messages });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var delegate = this.props.delegate;

      var columns = [{ key: 'severity', label: 'Severity', sortable: true }, { key: 'linterName', label: 'Provider', sortable: true }, { key: 'excerpt', label: 'Description', onClick: this.onClick }, { key: 'line', label: 'Line', sortable: true, onClick: this.onClick }];
      if (delegate.panelRepresents === 'Entire Project') {
        columns.push({
          key: 'file',
          label: 'File',
          sortable: true,
          onClick: this.onClick
        });
      }

      var customStyle = { overflowY: 'scroll', height: '100%' };

      return _react2['default'].createElement(
        'div',
        { id: 'linter-panel', tabIndex: '-1', style: customStyle },
        _react2['default'].createElement(_sbReactTable2['default'], {
          rows: this.state.messages,
          columns: columns,
          initialSort: [{ column: 'severity', type: 'desc' }, { column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }],
          sort: _helpers.sortMessages,
          rowKey: function (i) {
            return i.key;
          },
          renderHeaderColumn: function (i) {
            return i.label;
          },
          renderBodyColumn: PanelComponent.renderRowColumn,
          style: { width: '100%' },
          className: 'linter'
        })
      );
    }
  }]);

  return PanelComponent;
})(_react2['default'].Component);

module.exports = PanelComponent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7Ozs0QkFDRixnQkFBZ0I7Ozs7dUJBQzZELFlBQVk7O0lBWTFHLGNBQWM7WUFBZCxjQUFjOztlQUFkLGNBQWM7O1dBQ0kseUJBQUMsR0FBa0IsRUFBRSxNQUFjLEVBQW1CO0FBQzFFLFVBQU0sS0FBSyxHQUFHLHFCQUFPLEdBQUcsQ0FBQyxDQUFBOztBQUV6QixjQUFRLE1BQU07QUFDWixhQUFLLE1BQU07QUFDVCxpQkFBTywrQkFBaUIsR0FBRyxDQUFDLENBQUE7QUFBQSxBQUM5QixhQUFLLE1BQU07QUFDVCxpQkFBTyxLQUFLLEdBQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxHQUFLLEVBQUUsQ0FBQTtBQUFBLEFBQ3hFLGFBQUssU0FBUztBQUNaLGlCQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUE7QUFBQSxBQUNwQixhQUFLLFVBQVU7QUFDYixpQkFBTyx1QkFBYyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7QUFBQSxBQUNwQztBQUNFLGlCQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUFBLE9BQ3JCO0tBQ0Y7OztBQUVVLFdBbEJQLGNBQWMsQ0FrQk4sS0FBYSxFQUFFLE9BQWdCLEVBQUU7MEJBbEJ6QyxjQUFjOztBQW1CaEIsK0JBbkJFLGNBQWMsNkNBbUJWLEtBQUssRUFBRSxPQUFPLEVBQUM7O1NBYXZCLE9BQU8sR0FBRyxVQUFDLENBQUMsRUFBYyxHQUFHLEVBQW9CO0FBQy9DLFVBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFFO0FBQzVCLGVBQU07T0FDUDtBQUNELFVBQUksT0FBTyxDQUFDLFFBQVEs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IiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RUYWJsZSBmcm9tICdzYi1yZWFjdC10YWJsZSdcbmltcG9ydCB7ICRyYW5nZSwgc2V2ZXJpdHlOYW1lcywgc29ydE1lc3NhZ2VzLCB2aXNpdE1lc3NhZ2UsIG9wZW5FeHRlcm5hbGx5LCBnZXRQYXRoT2ZNZXNzYWdlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxudHlwZSBQcm9wcyA9IHtcbiAgZGVsZWdhdGU6IERlbGVnYXRlLFxufVxuXG50eXBlIFN0YXRlID0ge1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sXG59XG5cbmNsYXNzIFBhbmVsQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzLCBTdGF0ZT4ge1xuICBzdGF0aWMgcmVuZGVyUm93Q29sdW1uKHJvdzogTGludGVyTWVzc2FnZSwgY29sdW1uOiBzdHJpbmcpOiBzdHJpbmcgfCBPYmplY3Qge1xuICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKHJvdylcblxuICAgIHN3aXRjaCAoY29sdW1uKSB7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIGdldFBhdGhPZk1lc3NhZ2Uocm93KVxuICAgICAgY2FzZSAnbGluZSc6XG4gICAgICAgIHJldHVybiByYW5nZSA/IGAke3JhbmdlLnN0YXJ0LnJvdyArIDF9OiR7cmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gIDogJydcbiAgICAgIGNhc2UgJ2V4Y2VycHQnOlxuICAgICAgICByZXR1cm4gcm93LmV4Y2VycHRcbiAgICAgIGNhc2UgJ3NldmVyaXR5JzpcbiAgICAgICAgcmV0dXJuIHNldmVyaXR5TmFtZXNbcm93LnNldmVyaXR5XVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHJvd1tjb2x1bW5dXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IE9iamVjdCwgY29udGV4dDogP09iamVjdCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZXNzYWdlczogdGhpcy5wcm9wcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLFxuICAgIH1cbiAgfVxuICBzdGF0ZTogU3RhdGVcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uRGlkQ2hhbmdlTWVzc2FnZXMobWVzc2FnZXMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2VzIH0pXG4gICAgfSlcbiAgfVxuXG4gIG9uQ2xpY2sgPSAoZTogTW91c2VFdmVudCwgcm93OiBMaW50ZXJNZXNzYWdlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdBJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/IGUubWV0YUtleSA6IGUuY3RybEtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgb3BlbkV4dGVybmFsbHkocm93KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlzaXRNZXNzYWdlKHJvdywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaXRNZXNzYWdlKHJvdylcbiAgICB9XG4gIH1cblxuICBwcm9wczogUHJvcHNcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGNvbHVtbnMgPSBbXG4gICAgICB7IGtleTogJ3NldmVyaXR5JywgbGFiZWw6ICdTZXZlcml0eScsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGtleTogJ2xpbnRlck5hbWUnLCBsYWJlbDogJ1Byb3ZpZGVyJywgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHsga2V5OiAnZXhjZXJwdCcsIGxhYmVsOiAnRGVzY3JpcHRpb24nLCBvbkNsaWNrOiB0aGlzLm9uQ2xpY2sgfSxcbiAgICAgIHsga2V5OiAnbGluZScsIGxhYmVsOiAnTGluZScsIHNvcnRhYmxlOiB0cnVlLCBvbkNsaWNrOiB0aGlzLm9uQ2xpY2sgfSxcbiAgICBdXG4gICAgaWYgKGRlbGVnYXRlLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0VudGlyZSBQcm9qZWN0Jykge1xuICAgICAgY29sdW1ucy5wdXNoKHtcbiAgICAgICAga2V5OiAnZmlsZScsXG4gICAgICAgIGxhYmVsOiAnRmlsZScsXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2ssXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGN1c3RvbVN0eWxlOiBPYmplY3QgPSB7IG92ZXJmbG93WTogJ3Njcm9sbCcsIGhlaWdodDogJzEwMCUnIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwibGludGVyLXBhbmVsXCIgdGFiSW5kZXg9XCItMVwiIHN0eWxlPXtjdXN0b21TdHlsZX0+XG4gICAgICAgIDxSZWFjdFRhYmxlXG4gICAgICAgICAgcm93cz17dGhpcy5zdGF0ZS5tZXNzYWdlc31cbiAgICAgICAgICBjb2x1bW5zPXtjb2x1bW5zfVxuICAgICAgICAgIGluaXRpYWxTb3J0PXtbXG4gICAgICAgICAgICB7IGNvbHVtbjogJ3NldmVyaXR5JywgdHlwZTogJ2Rlc2MnIH0sXG4gICAgICAgICAgICB7IGNvbHVtbjogJ2ZpbGUnLCB0eXBlOiAnYXNjJyB9LFxuICAgICAgICAgICAgeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2FzYycgfSxcbiAgICAgICAgICBdfVxuICAgICAgICAgIHNvcnQ9e3NvcnRNZXNzYWdlc31cbiAgICAgICAgICByb3dLZXk9e2kgPT4gaS5rZXl9XG4gICAgICAgICAgcmVuZGVySGVhZGVyQ29sdW1uPXtpID0+IGkubGFiZWx9XG4gICAgICAgICAgcmVuZGVyQm9keUNvbHVtbj17UGFuZWxDb21wb25lbnQucmVuZGVyUm93Q29sdW1ufVxuICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScgfX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJsaW50ZXJcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxDb21wb25lbnRcbiJdfQ==