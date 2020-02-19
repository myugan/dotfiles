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
/* eslint-disable react/jsx-key */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./../etch-component');

var _utils = require('./../utils');

var defaultMessage = 'To find interface implementations, select a type name and run the `golang:implements` command via the command palette.';

var ImplementsView = (function (_EtchComponent) {
  _inherits(ImplementsView, _EtchComponent);

  function ImplementsView(props) {
    _classCallCheck(this, ImplementsView);

    _get(Object.getPrototypeOf(ImplementsView.prototype), 'constructor', this).call(this, props);
    if (props.model) {
      props.model.view = this;
    }
  }

  _createClass(ImplementsView, [{
    key: 'openFile',
    value: function openFile(gopos) {
      var pos = (0, _utils.parseGoPosition)(gopos);
      if (!pos) {
        return;
      }

      var file = pos.file;
      var _pos$line = pos.line;
      var line = _pos$line === undefined ? 1 : _pos$line;
      var _pos$column = pos.column;
      var column = _pos$column === undefined ? 1 : _pos$column;

      (0, _utils.openFile)(file, _atom.Point.fromObject([line - 1, column - 1]))['catch'](function (err) {
        console.log('could not access ' + file, err); // eslint-disable-line no-console
      });
    }
  }, {
    key: 'update',
    value: function update(props) {
      this.props = props;
      return _etch2['default'].update(this);
    }
  }, {
    key: 'structuredContent',
    value: function structuredContent(obj) {
      // obj.type: the query input
      // obj.to: present for implementations of a queried interface
      // obj.from: present for interfaces implemented by the queried type
      // obj.fromptr: present for interfaces implemented by pointers to the queried type
      return _etch2['default'].dom(
        'div',
        { style: 'width: 100%;' },
        obj.to && obj.to.length ? this.to(obj) : null,
        obj.from && obj.from.length ? this.from(obj) : null,
        obj.fromptr && obj.fromptr.length ? this.fromptr(obj) : null
      );
    }
  }, {
    key: 'to',
    value: function to(obj) {
      return _etch2['default'].dom(
        'details',
        { className: 'go-plus-accordion-item', open: true },
        this.header(obj, 'is implemented by'),
        obj.to ? this.items(obj.to) : undefined
      );
    }
  }, {
    key: 'from',
    value: function from(obj) {
      return _etch2['default'].dom(
        'details',
        { className: 'go-plus-accordion-item', open: true },
        this.header(obj, 'implements'),
        obj.from ? this.items(obj.from) : undefined
      );
    }
  }, {
    key: 'fromptr',
    value: function fromptr(obj) {
      return _etch2['default'].dom(
        'details',
        { className: 'go-plus-accordion-item', open: true },
        this.header(obj, 'implements (by pointer)'),
        obj.fromptr ? this.items(obj.fromptr) : undefined
      );
    }
  }, {
    key: 'header',
    value: function header(obj, subtitle) {
      var _this = this;

      return _etch2['default'].dom(
        'summary',
        { className: 'go-plus-accordion-header' },
        _etch2['default'].dom(
          'span',
          { className: 'text-subtle' },
          obj.type.kind + ' type '
        ),
        _etch2['default'].dom(
          'span',
          { onclick: function () {
              return _this.openFile(obj.type.pos);
            } },
          obj.type.name
        ),
        _etch2['default'].dom(
          'span',
          { className: 'text-subtle' },
          ' ' + subtitle
        )
      );
    }
  }, {
    key: 'items',
    value: function items(arr) {
      var _this2 = this;

      return _etch2['default'].dom(
        'main',
        { className: 'go-plus-accordian-content' },
        _etch2['default'].dom(
          'table',
          { className: 'go-plus-table' },
          arr.map(function (item) {
            return _etch2['default'].dom(
              'tr',
              {
                onclick: _this2.openFile.bind(_this2, item.pos),
                className: 'go-plus-table-row'
              },
              _etch2['default'].dom(
                'td',
                { className: 'go-plus-table-cell go-plus-left-pad' },
                item.name,
                _etch2['default'].dom(
                  'span',
                  { className: 'text-subtle' },
                  ' at ' + item.pos
                )
              )
            );
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (typeof this.props === 'string') {
        return _etch2['default'].dom(
          'div',
          { className: 'padded-content' },
          this.props
        );
      }
      if (!this.props.type) {
        return _etch2['default'].dom(
          'div',
          { className: 'padded-content' },
          defaultMessage
        );
      }
      return this.structuredContent(this.props);
    }
  }]);

  return ImplementsView;
})(_etchComponent.EtchComponent);

exports.ImplementsView = ImplementsView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2ltcGxlbWVudHMvaW1wbGVtZW50cy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFLc0IsTUFBTTs7b0JBQ1gsTUFBTTs7Ozs2QkFDTyxxQkFBcUI7O3FCQUNULFlBQVk7O0FBS3RELElBQU0sY0FBYyxHQUNsQix3SEFBd0gsQ0FBQTs7SUFlcEgsY0FBYztZQUFkLGNBQWM7O0FBR1AsV0FIUCxjQUFjLENBR04sS0FBNkIsRUFBRTswQkFIdkMsY0FBYzs7QUFJaEIsK0JBSkUsY0FBYyw2Q0FJVixLQUFLLEVBQUM7QUFDWixRQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDZixXQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7S0FDeEI7R0FDRjs7ZUFSRyxjQUFjOztXQVVWLGtCQUFDLEtBQWEsRUFBRTtBQUN0QixVQUFNLEdBQVUsR0FBRyw0QkFBZ0IsS0FBSyxDQUFDLENBQUE7QUFDekMsVUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLGVBQU07T0FDUDs7VUFFTyxJQUFJLEdBQTJCLEdBQUcsQ0FBbEMsSUFBSTtzQkFBMkIsR0FBRyxDQUE1QixJQUFJO1VBQUosSUFBSSw2QkFBRyxDQUFDO3dCQUFpQixHQUFHLENBQWxCLE1BQU07VUFBTixNQUFNLCtCQUFHLENBQUM7O0FBQ2xDLDJCQUFTLElBQUksRUFBRSxZQUFNLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBTSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ3BFLGVBQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO09BQzdDLENBQUMsQ0FBQTtLQUNIOzs7V0FFSyxnQkFBQyxLQUFVLEVBQUU7QUFDakIsVUFBSSxDQUFDLEtBQUssR0FBRyxL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Q1AsVUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO0FBQ2xDLGVBQU87O1lBQUssU0FBUyxFQUFDLGdCQUFnQjtVQUFFLElBQUksQ0FBQyxLQUFLO1NBQU8sQ0FBQTtPQUMxRDtBQUNELFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUNwQixlQUFPOztZQUFLLFNBQVMsRUFBQyxnQkFBZ0I7VUFBRSxjQUFjO1NBQU8sQ0FBQTtPQUM5RDtBQUNELGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMxQzs7O1NBNUdHLGNBQWM7OztRQStHWCxjQUFjLEdBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9pbXBsZW1lbnRzL2ltcGxlbWVudHMtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiogQGpzeCBldGNoLmRvbSAqL1xuLyogZXNsaW50LWRpc2FibGUgcmVhY3Qvbm8tdW5rbm93bi1wcm9wZXJ0eSAqL1xuLyogZXNsaW50LWRpc2FibGUgcmVhY3QvanN4LWtleSAqL1xuXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgRXRjaENvbXBvbmVudCB9IGZyb20gJy4vLi4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgeyBwYXJzZUdvUG9zaXRpb24sIG9wZW5GaWxlIH0gZnJvbSAnLi8uLi91dGlscydcblxuaW1wb3J0IHR5cGUgeyBJbXBsZW1lbnRzIH0gZnJvbSAnLi9pbXBsZW1lbnRzJ1xuaW1wb3J0IHR5cGUgeyBHb1BvcyB9IGZyb20gJy4vLi4vdXRpbHMnXG5cbmNvbnN0IGRlZmF1bHRNZXNzYWdlID1cbiAgJ1RvIGZpbmQgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9ucywgc2VsZWN0IGEgdHlwZSBuYW1lIGFuZCBydW4gdGhlIGBnb2xhbmc6aW1wbGVtZW50c2AgY29tbWFuZCB2aWEgdGhlIGNvbW1hbmQgcGFsZXR0ZS4nXG5cbnR5cGUgSW1wbGVtZW50c1R5cGUgPSB7XG4gIG5hbWU6IHN0cmluZyxcbiAgcG9zOiBzdHJpbmcsXG4gIGtpbmQ6IHN0cmluZ1xufVxuXG50eXBlIEd1cnVJbXBsZW1lbnRzUmVzdWx0ID0ge1xuICB0eXBlOiBJbXBsZW1lbnRzVHlwZSxcbiAgdG8/OiBBcnJheTxJbXBsZW1lbnRzVHlwZT4sXG4gIGZyb20/OiBBcnJheTxJbXBsZW1lbnRzVHlwZT4sXG4gIGZyb21wdHI/OiBBcnJheTxJbXBsZW1lbnRzVHlwZT5cbn1cblxuY2xhc3MgSW1wbGVtZW50c1ZpZXcgZXh0ZW5kcyBFdGNoQ29tcG9uZW50IHtcbiAgcHJvcHM6IHN0cmluZyB8IEd1cnVJbXBsZW1lbnRzUmVzdWx0XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IHsgbW9kZWw/OiBJbXBsZW1lbnRzIH0pIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICBpZiAocHJvcHMubW9kZWwpIHtcbiAgICAgIHByb3BzLm1vZGVsLnZpZXcgPSB0aGlzXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpbGUoZ29wb3M6IHN0cmluZykge1xuICAgIGNvbnN0IHBvczogR29Qb3MgPSBwYXJzZUdvUG9zaXRpb24oZ29wb3MpXG4gICAgaWYgKCFwb3MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgZmlsZSwgbGluZSA9IDEsIGNvbHVtbiA9IDEgfSA9IHBvc1xuICAgIG9wZW5GaWxlKGZpbGUsIFBvaW50LmZyb21PYmplY3QoW2xpbmUgLSAxLCBjb2x1bW4gLSAxXSkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnY291bGQgbm90IGFjY2VzcyAnICsgZmlsZSwgZXJyKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKHByb3BzOiBhbnkpIHtcbiAgICB0aGlzLnByb3BzID0gcHJvcHNcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHN0cnVjdHVyZWRDb250ZW50KG9iajogR3VydUltcGxlbWVudHNSZXN1bHQpIHtcbiAgICAvLyBvYmoudHlwZTogdGhlIHF1ZXJ5IGlucHV0XG4gICAgLy8gb2JqLnRvOiBwcmVzZW50IGZvciBpbXBsZW1lbnRhdGlvbnMgb2YgYSBxdWVyaWVkIGludGVyZmFjZVxuICAgIC8vIG9iai5mcm9tOiBwcmVzZW50IGZvciBpbnRlcmZhY2VzIGltcGxlbWVudGVkIGJ5IHRoZSBxdWVyaWVkIHR5cGVcbiAgICAvLyBvYmouZnJvbXB0cjogcHJlc2VudCBmb3IgaW50ZXJmYWNlcyBpbXBsZW1lbnRlZCBieSBwb2ludGVycyB0byB0aGUgcXVlcmllZCB0eXBlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9eyd3aWR0aDogMTAwJTsnfT5cbiAgICAgICAge29iai50byAmJiBvYmoudG8ubGVuZ3RoID8gdGhpcy50byhvYmopIDogbnVsbH1cbiAgICAgICAge29iai5mcm9tICYmIG9iai5mcm9tLmxlbmd0aCA/IHRoaXMuZnJvbShvYmopIDogbnVsbH1cbiAgICAgICAge29iai5mcm9tcHRyICYmIG9iai5mcm9tcHRyLmxlbmd0aCA/IHRoaXMuZnJvbXB0cihvYmopIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHRvKG9iajogR3VydUltcGxlbWVudHNSZXN1bHQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHMgY2xhc3NOYW1lPVwiZ28tcGx1cy1hY2NvcmRpb24taXRlbVwiIG9wZW4+XG4gICAgICAgIHt0aGlzLmhlYWRlcihvYmosICdpcyBpbXBsZW1lbnRlZCBieScpfVxuICAgICAgICB7b2JqLnRvID8gdGhpcy5pdGVtcyhvYmoudG8pIDogdW5kZWZpbmVkfVxuICAgICAgPC9kZXRhaWxzPlxuICAgIClcbiAgfVxuXG4gIGZyb20ob2JqOiBHdXJ1SW1wbGVtZW50c1Jlc3VsdCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlscyBjbGFzc05hbWU9XCJnby1wbHVzLWFjY29yZGlvbi1pdGVtXCIgb3Blbj5cbiAgICAgICAge3RoaXMuaGVhZGVyKG9iaiwgJ2ltcGxlbWVudHMnKX1cbiAgICAgICAge29iai5mcm9tID8gdGhpcy5pdGVtcyhvYmouZnJvbSkgOiB1bmRlZmluZWR9XG4gICAgICA8L2RldGFpbHM+XG4gICAgKVxuICB9XG5cbiAgZnJvbXB0cihvYmo6IEd1cnVJbXBsZW1lbnRzUmVzdWx0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzIGNsYXNzTmFtZT1cImdvLXBsdXMtYWNjb3JkaW9uLWl0ZW1cIiBvcGVuPlxuICAgICAgICB7dGhpcy5oZWFkZXIob2JqLCAnaW1wbGVtZW50cyAoYnkgcG9pbnRlciknKX1cbiAgICAgICAge29iai5mcm9tcHRyID8gdGhpcy5pdGVtcyhvYmouZnJvbXB0cikgOiB1bmRlZmluZWR9XG4gICAgICA8L2RldGFpbHM+XG4gICAgKVxuICB9XG5cbiAgaGVhZGVyKG9iajogR3VydUltcGxlbWVudHNSZXN1bHQsIHN1YnRpdGxlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ28tcGx1cy1hY2NvcmRpb24taGVhZGVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc3VidGxlXCI+e29iai50eXBlLmtpbmQgKyAnIHR5cGUgJ308L3NwYW4+XG4gICAgICAgIDxzcGFuIG9uY2xpY2s9eygpID0+IHRoaXMub3BlbkZpbGUob2JqLnR5cGUucG9zKX0+e29iai50eXBlLm5hbWV9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXN1YnRsZVwiPnsnICcgKyBzdWJ0aXRsZX08L3NwYW4+XG4gICAgICA8L3N1bW1hcnk+XG4gICAgKVxuICB9XG5cbiAgaXRlbXMoYXJyOiBBcnJheTxJbXBsZW1lbnRzVHlwZT4pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ28tcGx1cy1hY2NvcmRpYW4tY29udGVudFwiPlxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwiZ28tcGx1cy10YWJsZVwiPlxuICAgICAgICAgIHthcnIubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyXG4gICAgICAgICAgICAgICAgb25jbGljaz17dGhpcy5vcGVuRmlsZS5iaW5kKHRoaXMsIGl0ZW0ucG9zKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnby1wbHVzLXRhYmxlLXJvd1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiZ28tcGx1cy10YWJsZS1jZWxsIGdvLXBsdXMtbGVmdC1wYWRcIj5cbiAgICAgICAgICAgICAgICAgIHtpdGVtLm5hbWV9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXN1YnRsZVwiPnsnIGF0ICcgKyBpdGVtLnBvc308L3NwYW4+XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC90YWJsZT5cbiAgICAgIDwvbWFpbj5cbiAgICApXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicGFkZGVkLWNvbnRlbnRcIj57dGhpcy5wcm9wc308L2Rpdj5cbiAgICB9XG4gICAgaWYgKCF0aGlzLnByb3BzLnR5cGUpIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInBhZGRlZC1jb250ZW50XCI+e2RlZmF1bHRNZXNzYWdlfTwvZGl2PlxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdHJ1Y3R1cmVkQ29udGVudCh0aGlzLnByb3BzKVxuICB9XG59XG5cbmV4cG9ydCB7IEltcGxlbWVudHNWaWV3IH1cbiJdfQ==