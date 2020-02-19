Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utils = require('./utils');

'use babel';
var EtchComponent = (function () {
  function EtchComponent(props, children) {
    var _this = this;

    _classCallCheck(this, EtchComponent);

    this.props = props;
    this.children = children;

    var bindFns = this.constructor.bindFns;

    if (bindFns) {
      bindFns.forEach(function (fn) {
        _this[fn] = _this[fn].bind(_this);
      });
    }

    this.init();
  }

  _createClass(EtchComponent, [{
    key: 'init',
    value: function init() {
      _etch2['default'].initialize(this);
    }
  }, {
    key: 'shouldUpdate',
    value: function shouldUpdate(newProps) {
      return !(0, _utils.shallowEqual)(this.props, newProps);
    }
  }, {
    key: 'update',
    value: function update(props, children) {
      if (!this.shouldUpdate(props)) {
        return Promise.resolve();
      }
      this.props = Object.assign({}, this.props, props);
      this.children = children;
      return _etch2['default'].update(this);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var removeNode = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      _etch2['default'].destroy(this, removeNode);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      throw new Error('Etch components must implement a `render` method');
    }
  }]);

  return EtchComponent;
})();

exports['default'] = EtchComponent;

_etch2['default'].setScheduler(atom.views);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9ldGNoLWNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7cUJBQ00sU0FBUzs7QUFKdEMsV0FBVyxDQUFBO0lBTVUsYUFBYTtBQUNwQixXQURPLGFBQWEsQ0FDbkIsS0FBSyxFQUFFLFFBQVEsRUFBRTs7OzBCQURYLGFBQWE7O0FBRTlCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBOztRQUVoQixPQUFPLEdBQUssSUFBSSxDQUFDLFdBQVcsQ0FBNUIsT0FBTzs7QUFDZixRQUFJLE9BQU8sRUFBRTtBQUNYLGFBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLEVBQUs7QUFBRSxjQUFLLEVBQUUsQ0FBQyxHQUFHLE1BQUssRUFBRSxDQUFDLENBQUMsSUFBSSxPQUFNLENBQUE7T0FBRSxDQUFDLENBQUE7S0FDNUQ7O0FBRUQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ1o7O2VBWGtCLGFBQWE7O1dBYTNCLGdCQUFHO0FBQ04sd0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3RCOzs7V0FFWSxzQkFBQyxRQUFRLEVBQUU7QUFDdEIsYUFBTyxDQUFDLHlCQUFhLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDM0M7OztXQUVNLGdCQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDdkIsVUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDN0IsZUFBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDekI7QUFDRCxVQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDakQsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVPLG1CQUFxQjtVQUFwQixVQUFVLHlEQUFHLEtBQUs7O0FBQ3pCLHdCQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUE7S0FDL0I7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2Y7OztXQUVNLGtCQUFHO0FBQ1IsWUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO0tBQ3BFOzs7U0F4Q2tCLGFBQWE7OztxQkFBYixhQUFhOztBQTJDbEMsa0JBQUssWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1kZWJ1Zy9saWIvZXRjaC1jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IHNoYWxsb3dFcXVhbCB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV0Y2hDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuXG5cbiAgICBjb25zdCB7IGJpbmRGbnMgfSA9IHRoaXMuY29uc3RydWN0b3JcbiAgICBpZiAoYmluZEZucykge1xuICAgICAgYmluZEZucy5mb3JFYWNoKChmbikgPT4geyB0aGlzW2ZuXSA9IHRoaXNbZm5dLmJpbmQodGhpcykgfSlcbiAgICB9XG5cbiAgICB0aGlzLmluaXQoKVxuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBzaG91bGRVcGRhdGUgKG5ld1Byb3BzKSB7XG4gICAgcmV0dXJuICFzaGFsbG93RXF1YWwodGhpcy5wcm9wcywgbmV3UHJvcHMpXG4gIH1cblxuICB1cGRhdGUgKHByb3BzLCBjaGlsZHJlbikge1xuICAgIGlmICghdGhpcy5zaG91bGRVcGRhdGUocHJvcHMpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gICAgdGhpcy5wcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHByb3BzKVxuICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlblxuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgZGVzdHJveSAocmVtb3ZlTm9kZSA9IGZhbHNlKSB7XG4gICAgZXRjaC5kZXN0cm95KHRoaXMsIHJlbW92ZU5vZGUpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V0Y2ggY29tcG9uZW50cyBtdXN0IGltcGxlbWVudCBhIGByZW5kZXJgIG1ldGhvZCcpXG4gIH1cbn1cblxuZXRjaC5zZXRTY2hlZHVsZXIoYXRvbS52aWV3cylcbiJdfQ==