Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

exports['default'] = {
  activate: function activate() {
    this.intentions = new _main2['default']();
    this.intentions.activate();
  },
  deactivate: function deactivate() {
    this.intentions.dispose();
  },
  consumeListIntentions: function consumeListIntentions(provider) {
    var _this = this;

    var providers = [].concat(provider);
    providers.forEach(function (entry) {
      _this.intentions.consumeListProvider(entry);
    });
    return new _atom.Disposable(function () {
      providers.forEach(function (entry) {
        _this.intentions.deleteListProvider(entry);
      });
    });
  },
  consumeHighlightIntentions: function consumeHighlightIntentions(provider) {
    var _this2 = this;

    var providers = [].concat(provider);
    providers.forEach(function (entry) {
      _this2.intentions.consumeHighlightProvider(entry);
    });
    return new _atom.Disposable(function () {
      providers.forEach(function (entry) {
        _this2.intentions.deleteHighlightProvider(entry);
      });
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFMkIsTUFBTTs7b0JBQ1YsUUFBUTs7OztxQkFHaEI7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsVUFBVSxHQUFHLHVCQUFnQixDQUFBO0FBQ2xDLFFBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUE7R0FDM0I7QUFDRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQzFCO0FBQ0QsdUJBQXFCLEVBQUEsK0JBQUMsUUFBNEMsRUFBRTs7O0FBQ2xFLFFBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsYUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUMzQixZQUFLLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMzQyxDQUFDLENBQUE7QUFDRixXQUFPLHFCQUFlLFlBQU07QUFDMUIsZUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUMzQixjQUFLLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUMxQyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSDtBQUNELDRCQUEwQixFQUFBLG9DQUFDLFFBQXNELEVBQUU7OztBQUNqRixRQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLGFBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0IsYUFBSyxVQUFVLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDaEQsQ0FBQyxDQUFBO0FBQ0YsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0IsZUFBSyxVQUFVLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDL0MsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEludGVudGlvbnMgZnJvbSAnLi9tYWluJ1xuaW1wb3J0IHR5cGUgeyBMaXN0UHJvdmlkZXIsIEhpZ2hsaWdodFByb3ZpZGVyIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmludGVudGlvbnMgPSBuZXcgSW50ZW50aW9ucygpXG4gICAgdGhpcy5pbnRlbnRpb25zLmFjdGl2YXRlKClcbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmludGVudGlvbnMuZGlzcG9zZSgpXG4gIH0sXG4gIGNvbnN1bWVMaXN0SW50ZW50aW9ucyhwcm92aWRlcjogTGlzdFByb3ZpZGVyIHwgQXJyYXk8TGlzdFByb3ZpZGVyPikge1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFtdLmNvbmNhdChwcm92aWRlcilcbiAgICBwcm92aWRlcnMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIHRoaXMuaW50ZW50aW9ucy5jb25zdW1lTGlzdFByb3ZpZGVyKGVudHJ5KVxuICAgIH0pXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHByb3ZpZGVycy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICB0aGlzLmludGVudGlvbnMuZGVsZXRlTGlzdFByb3ZpZGVyKGVudHJ5KVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICBjb25zdW1lSGlnaGxpZ2h0SW50ZW50aW9ucyhwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIgfCBBcnJheTxIaWdobGlnaHRQcm92aWRlcj4pIHtcbiAgICBjb25zdCBwcm92aWRlcnMgPSBbXS5jb25jYXQocHJvdmlkZXIpXG4gICAgcHJvdmlkZXJzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICB0aGlzLmludGVudGlvbnMuY29uc3VtZUhpZ2hsaWdodFByb3ZpZGVyKGVudHJ5KVxuICAgIH0pXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHByb3ZpZGVycy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICB0aGlzLmludGVudGlvbnMuZGVsZXRlSGlnaGxpZ2h0UHJvdmlkZXIoZW50cnkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG59XG4iXX0=