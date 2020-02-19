Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var OutputManager = (function () {
  function OutputManager() {
    _classCallCheck(this, OutputManager);

    this.key = 'output';
    this.tab = {
      key: 'output',
      name: 'Output',
      packageName: 'go-plus',
      icon: 'check',
      order: 200
    };
    this.output = '';
  }

  _createClass(OutputManager, [{
    key: 'update',
    value: function update(props) {
      var oldProps = this.props;
      this.props = Object.assign({}, oldProps, props);

      var _props$exitcode = this.props.exitcode;
      var exitcode = _props$exitcode === undefined ? 0 : _props$exitcode;

      if (exitcode !== 0 && this.requestFocus) {
        if (atom.config.get('go-plus.panel.focusOnFailure') && this.requestFocus) {
          this.requestFocus();
        }
      }

      if (this.view) {
        this.view.update();
      }
    }
  }]);

  return OutputManager;
})();

exports.OutputManager = OutputManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL291dHB1dC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBS00sYUFBYTtBQVFOLFdBUlAsYUFBYSxHQVFIOzBCQVJWLGFBQWE7O0FBU2YsUUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUE7QUFDbkIsUUFBSSxDQUFDLEdBQUcsR0FBRztBQUNULFNBQUcsRUFBRSxRQUFRO0FBQ2IsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBVyxFQUFFLFNBQVM7QUFDdEIsVUFBSSxFQUFFLE9BQU87QUFDYixXQUFLLEVBQUUsR0FBRztLQUNYLENBQUE7QUFDRCxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtHQUNqQjs7ZUFsQkcsYUFBYTs7V0FvQlgsZ0JBQUMsS0FBYSxFQUFFO0FBQ3BCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7QUFDM0IsVUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7OzRCQUV0QixJQUFJLENBQUMsS0FBSyxDQUEzQixRQUFRO1VBQVIsUUFBUSxtQ0FBRyxDQUFDOztBQUNwQixVQUFJLFFBQVEsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUN2QyxZQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLElBQy9DLElBQUksQ0FBQyxZQUFZLEVBQ2pCO0FBQ0EsY0FBSSxDQUFDLFlBQVksRUFBRSxDQUFBO1NBQ3BCO09BQ0Y7O0FBRUQsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUNuQjtLQUNGOzs7U0FyQ0csYUFBYTs7O1FBd0NWLGFBQWEsR0FBYixhQUFhIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL291dHB1dC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBQYW5lbE1vZGVsLCBUYWIgfSBmcm9tICcuL3BhbmVsL3RhYidcbmltcG9ydCB0eXBlIHsgT3V0cHV0UGFuZWwgfSBmcm9tICcuL291dHB1dC1wYW5lbCdcblxuY2xhc3MgT3V0cHV0TWFuYWdlciBpbXBsZW1lbnRzIFBhbmVsTW9kZWwge1xuICBrZXk6IHN0cmluZ1xuICB0YWI6IFRhYlxuICBvdXRwdXQ6IHN0cmluZ1xuICBwcm9wczogT2JqZWN0XG4gIHZpZXc6IE91dHB1dFBhbmVsXG4gIHJlcXVlc3RGb2N1czogPygpID0+IFByb21pc2U8dm9pZD5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleSA9ICdvdXRwdXQnXG4gICAgdGhpcy50YWIgPSB7XG4gICAgICBrZXk6ICdvdXRwdXQnLFxuICAgICAgbmFtZTogJ091dHB1dCcsXG4gICAgICBwYWNrYWdlTmFtZTogJ2dvLXBsdXMnLFxuICAgICAgaWNvbjogJ2NoZWNrJyxcbiAgICAgIG9yZGVyOiAyMDBcbiAgICB9XG4gICAgdGhpcy5vdXRwdXQgPSAnJ1xuICB9XG5cbiAgdXBkYXRlKHByb3BzOiBPYmplY3QpIHtcbiAgICBjb25zdCBvbGRQcm9wcyA9IHRoaXMucHJvcHNcbiAgICB0aGlzLnByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkUHJvcHMsIHByb3BzKVxuXG4gICAgY29uc3QgeyBleGl0Y29kZSA9IDAgfSA9IHRoaXMucHJvcHNcbiAgICBpZiAoZXhpdGNvZGUgIT09IDAgJiYgdGhpcy5yZXF1ZXN0Rm9jdXMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdnby1wbHVzLnBhbmVsLmZvY3VzT25GYWlsdXJlJykgJiZcbiAgICAgICAgdGhpcy5yZXF1ZXN0Rm9jdXNcbiAgICAgICkge1xuICAgICAgICB0aGlzLnJlcXVlc3RGb2N1cygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZSgpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IE91dHB1dE1hbmFnZXIgfVxuIl19