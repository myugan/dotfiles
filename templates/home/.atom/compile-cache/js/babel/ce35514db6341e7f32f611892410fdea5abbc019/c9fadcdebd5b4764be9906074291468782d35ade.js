var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _helpers = require('../helpers');

var TooltipElement = (function () {
  function TooltipElement(messages, position, textEditor) {
    var _this = this;

    _classCallCheck(this, TooltipElement);

    this.emitter = new _atom.Emitter();
    this.element = document.createElement('div');
    this.messages = messages;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.marker = textEditor.markBufferRange([position, position]);
    this.marker.onDidDestroy(function () {
      return _this.emitter.emit('did-destroy');
    });

    var delegate = new _delegate2['default']();
    this.element.id = 'linter-tooltip';
    textEditor.decorateMarker(this.marker, {
      type: 'overlay',
      item: this.element
    });
    this.subscriptions.add(delegate);

    var children = [];
    messages.forEach(function (message) {
      if (message.version === 2) {
        children.push(_react2['default'].createElement(_message2['default'], { key: message.key, delegate: delegate, message: message }));
      }
    });
    _reactDom2['default'].render(_react2['default'].createElement(
      'linter-messages',
      null,
      children
    ), this.element);
  }

  _createClass(TooltipElement, [{
    key: 'isValid',
    value: function isValid(position, messages) {
      var range = (0, _helpers.$range)(this.messages[0]);
      return !!(this.messages.length === 1 && messages.has(this.messages[0]) && range && range.containsPoint(position));
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
    }
  }]);

  return TooltipElement;
})();

module.exports = TooltipElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztxQkFFa0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7O29CQUNhLE1BQU07O3dCQUc5QixZQUFZOzs7O3VCQUNOLFdBQVc7Ozs7dUJBQ2YsWUFBWTs7SUFHN0IsY0FBYztBQU9QLFdBUFAsY0FBYyxDQU9OLFFBQThCLEVBQUUsUUFBZSxFQUFFLFVBQXNCLEVBQUU7OzswQkFQakYsY0FBYzs7QUFRaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDOUQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFBTSxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0tBQUEsQ0FBQyxDQUFBOztBQUVoRSxRQUFNLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQy9CLFFBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLGdCQUFnQixDQUFBO0FBQ2xDLGNBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQyxVQUFJLEVBQUUsU0FBUztBQUNmLFVBQUksRUFBRSxJQUFJLENBQUMsT0FBTztLQUNuQixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFaEMsUUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFlBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDMUIsVUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRTtBQUN6QixnQkFBUSxDQUFDLElBQUksQ0FBQyx5REFBZ0IsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEFBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxBQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFHLENBQUMsQ0FBQTtPQUMxRjtLQUNGLENBQUMsQ0FBQTtBQUNGLDBCQUFTLE1BQU0sQ0FBQzs7O01BQWtCLFFBQVE7S0FBbUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDN0U7O2VBaENHLGNBQWM7O1dBaUNYLGlCQUFDLFFBQWUsRUFBRSxRQUE0QixFQUFXO0FBQzlELFVBQU0sS0FBSyxHQUFHLHFCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QyxhQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUEsQUFBQyxDQUFBO0tBQ2xIOzs7V0FDVyxzQkFBQyxRQUFtQixFQUFjO0FBQzVDLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6Qzs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0EzQ0csY0FBYzs7O0FBOENwQixNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSwgUG9pbnQsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBNZXNzYWdlRWxlbWVudCBmcm9tICcuL21lc3NhZ2UnXG5pbXBvcnQgeyAkcmFuZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFRvb2x0aXBFbGVtZW50IHtcbiAgbWFya2VyOiBPYmplY3RcbiAgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgZW1pdHRlcjogRW1pdHRlclxuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcG9zaXRpb246IFBvaW50LCB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5tYXJrZXIgPSB0ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbcG9zaXRpb24sIHBvc2l0aW9uXSlcbiAgICB0aGlzLm1hcmtlci5vbkRpZERlc3Ryb3koKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JykpXG5cbiAgICBjb25zdCBkZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSgpXG4gICAgdGhpcy5lbGVtZW50LmlkID0gJ2xpbnRlci10b29sdGlwJ1xuICAgIHRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIodGhpcy5tYXJrZXIsIHtcbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZGVsZWdhdGUpXG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG4gICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCg8TWVzc2FnZUVsZW1lbnQga2V5PXttZXNzYWdlLmtleX0gZGVsZWdhdGU9e2RlbGVnYXRlfSBtZXNzYWdlPXttZXNzYWdlfSAvPilcbiAgICAgIH1cbiAgICB9KVxuICAgIFJlYWN0RE9NLnJlbmRlcig8bGludGVyLW1lc3NhZ2VzPntjaGlsZHJlbn08L2xpbnRlci1tZXNzYWdlcz4sIHRoaXMuZWxlbWVudClcbiAgfVxuICBpc1ZhbGlkKHBvc2l0aW9uOiBQb2ludCwgbWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKHRoaXMubWVzc2FnZXNbMF0pXG4gICAgcmV0dXJuICEhKHRoaXMubWVzc2FnZXMubGVuZ3RoID09PSAxICYmIG1lc3NhZ2VzLmhhcyh0aGlzLm1lc3NhZ2VzWzBdKSAmJiByYW5nZSAmJiByYW5nZS5jb250YWluc1BvaW50KHBvc2l0aW9uKSlcbiAgfVxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2s6ICgpID0+IGFueSk6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcEVsZW1lbnRcbiJdfQ==