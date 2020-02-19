Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

// Internal variables
var instance = undefined;

exports['default'] = {
  activate: function activate() {
    this.subscriptions = new _atom.CompositeDisposable();

    instance = new _main2['default']();
    this.subscriptions.add(instance);

    this.subscriptions.add(atom.packages.onDidActivateInitialPackages(function () {
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter', true);
      }
    }));
  },
  consumeLinter: function consumeLinter(linter) {
    var linters = [].concat(linter);
    for (var entry of linters) {
      instance.addLinter(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of linters) {
        instance.deleteLinter(entry);
      }
    });
  },
  consumeUI: function consumeUI(ui) {
    var uis = [].concat(ui);
    for (var entry of uis) {
      instance.addUI(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of uis) {
        instance.deleteUI(entry);
      }
    });
  },
  provideIndie: function provideIndie() {
    return function (indie) {
      return instance.addIndie(indie);
    };
  },
  deactivate: function deactivate() {
    this.subscriptions.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVnRCxNQUFNOztvQkFFbkMsUUFBUTs7Ozs7QUFJM0IsSUFBSSxRQUFRLFlBQUEsQ0FBQTs7cUJBRUc7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxZQUFRLEdBQUcsdUJBQVksQ0FBQTtBQUN2QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFaEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsWUFBVztBQUNwRCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RCLGVBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDckQ7S0FDRixDQUFDLENBQ0gsQ0FBQTtHQUNGO0FBQ0QsZUFBYSxFQUFBLHVCQUFDLE1BQXNCLEVBQWM7QUFDaEQsUUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQyxTQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUMzQixjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzFCO0FBQ0QsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLFdBQUssSUFBTSxLQUFLLElBQUksT0FBTyxFQUFFO0FBQzNCLGdCQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzdCO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7QUFDRCxXQUFTLEVBQUEsbUJBQUMsRUFBTSxFQUFjO0FBQzVCLFFBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDekIsU0FBSyxJQUFNLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDdkIsY0FBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUN0QjtBQUNELFdBQU8scUJBQWUsWUFBTTtBQUMxQixXQUFLLElBQU0sS0FBSyxJQUFJLEdBQUcsRUFBRTtBQUN2QixnQkFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUN6QjtLQUNGLENBQUMsQ0FBQTtHQUNIO0FBQ0QsY0FBWSxFQUFBLHdCQUFXO0FBQ3JCLFdBQU8sVUFBQSxLQUFLO2FBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7S0FBQSxDQUFBO0dBQ3pDO0FBQ0QsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUM3QjtDQUNGIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IExpbnRlciBmcm9tICcuL21haW4nXG5pbXBvcnQgdHlwZSB7IFVJLCBMaW50ZXIgYXMgTGludGVyUHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBJbnRlcm5hbCB2YXJpYWJsZXNcbmxldCBpbnN0YW5jZVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGluc3RhbmNlID0gbmV3IExpbnRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChpbnN0YW5jZSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVJbml0aWFsUGFja2FnZXMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlcicsIHRydWUpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgfSxcbiAgY29uc3VtZUxpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyKTogRGlzcG9zYWJsZSB7XG4gICAgY29uc3QgbGludGVycyA9IFtdLmNvbmNhdChsaW50ZXIpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBsaW50ZXJzKSB7XG4gICAgICBpbnN0YW5jZS5hZGRMaW50ZXIoZW50cnkpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlTGludGVyKGVudHJ5KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGNvbnN1bWVVSSh1aTogVUkpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCB1aXMgPSBbXS5jb25jYXQodWkpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB1aXMpIHtcbiAgICAgIGluc3RhbmNlLmFkZFVJKGVudHJ5KVxuICAgIH1cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB1aXMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlVUkoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgcHJvdmlkZUluZGllKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIGluZGllID0+IGluc3RhbmNlLmFkZEluZGllKGluZGllKVxuICB9LFxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcbn1cbiJdfQ==