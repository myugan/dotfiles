Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _elementsList = require('./elements/list');

var _elementsList2 = _interopRequireDefault(_elementsList);

var ListView = (function () {
  function ListView() {
    _classCallCheck(this, ListView);

    this.emitter = new _sbEventKit.Emitter();
    this.element = new _elementsList2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(this.element);
  }

  _createClass(ListView, [{
    key: 'activate',
    value: function activate(editor, suggestions) {
      var _this = this;

      this.element.render(suggestions, function (selected) {
        _this.emitter.emit('did-select', selected);
        _this.dispose();
      });
      this.element.move('move-to-top');

      var bufferPosition = editor.getCursorBufferPosition();
      var marker = editor.markBufferRange([bufferPosition, bufferPosition], { invalidate: 'never' });
      editor.decorateMarker(marker, {
        type: 'overlay',
        item: this.element
      });
      this.subscriptions.add(function () {
        marker.destroy();
      });
    }
  }, {
    key: 'move',
    value: function move(movement) {
      this.element.move(movement);
    }
  }, {
    key: 'select',
    value: function select() {
      this.element.select();
    }
  }, {
    key: 'onDidSelect',
    value: function onDidSelect(callback) {
      return this.emitter.on('did-select', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return ListView;
})();

exports['default'] = ListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL3ZpZXctbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzBCQUU2QyxjQUFjOzs0QkFJbkMsaUJBQWlCOzs7O0lBR3BCLFFBQVE7QUFLaEIsV0FMUSxRQUFRLEdBS2I7MEJBTEssUUFBUTs7QUFNekIsUUFBSSxDQUFDLE9BQU8sR0FBRyx5QkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsK0JBQWlCLENBQUE7QUFDaEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFaa0IsUUFBUTs7V0FhbkIsa0JBQUMsTUFBa0IsRUFBRSxXQUE0QixFQUFFOzs7QUFDekQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQUMsUUFBUSxFQUFLO0FBQzdDLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDekMsY0FBSyxPQUFPLEVBQUUsQ0FBQTtPQUNmLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBOztBQUVoQyxVQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtBQUN2RCxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDaEcsWUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsWUFBSSxFQUFFLFNBQVM7QUFDZixZQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87T0FDbkIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNoQyxjQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDakIsQ0FBQyxDQUFBO0tBQ0g7OztXQUNHLGNBQUMsUUFBc0IsRUFBRTtBQUMzQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUM1Qjs7O1dBQ0ssa0JBQUc7QUFDUCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ3RCOzs7V0FDVSxxQkFBQyxRQUFrQixFQUFjO0FBQzFDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQy9DOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXpDa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvdmlldy1saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBMaXN0RWxlbWVudCBmcm9tICcuL2VsZW1lbnRzL2xpc3QnXG5pbXBvcnQgdHlwZSB7IExpc3RJdGVtLCBMaXN0TW92ZW1lbnQgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0VmlldyB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIGVsZW1lbnQ6IExpc3RFbGVtZW50O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmVsZW1lbnQgPSBuZXcgTGlzdEVsZW1lbnQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbGVtZW50KVxuICB9XG4gIGFjdGl2YXRlKGVkaXRvcjogVGV4dEVkaXRvciwgc3VnZ2VzdGlvbnM6IEFycmF5PExpc3RJdGVtPikge1xuICAgIHRoaXMuZWxlbWVudC5yZW5kZXIoc3VnZ2VzdGlvbnMsIChzZWxlY3RlZCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1zZWxlY3QnLCBzZWxlY3RlZClcbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgfSlcbiAgICB0aGlzLmVsZW1lbnQubW92ZSgnbW92ZS10by10b3AnKVxuXG4gICAgY29uc3QgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGNvbnN0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW2J1ZmZlclBvc2l0aW9uLCBidWZmZXJQb3NpdGlvbl0sIHsgaW52YWxpZGF0ZTogJ25ldmVyJyB9KVxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgfSlcbiAgfVxuICBtb3ZlKG1vdmVtZW50OiBMaXN0TW92ZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnQubW92ZShtb3ZlbWVudClcbiAgfVxuICBzZWxlY3QoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNlbGVjdCgpXG4gIH1cbiAgb25EaWRTZWxlY3QoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXNlbGVjdCcsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=