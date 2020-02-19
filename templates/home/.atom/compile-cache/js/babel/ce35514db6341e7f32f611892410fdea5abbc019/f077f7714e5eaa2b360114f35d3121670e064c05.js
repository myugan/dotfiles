Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line import/no-unresolved

var _atom = require("atom");

var _disposify = require("disposify");

var _disposify2 = _interopRequireDefault(_disposify);

var _element = require("./element");

var _element2 = _interopRequireDefault(_element);

var _registry = require("./registry");

var _registry2 = _interopRequireDefault(_registry);

var _atomIdeProvider = require("./atom-ide-provider");

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.element = new _element2["default"]();
    this.registry = new _registry2["default"]();
    this.atomIdeProvider = new _atomIdeProvider.AtomIdeProvider(function () {
      return _this.registry.create();
    });
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.element);
    this.subscriptions.add(this.registry);

    this.registry.onDidUpdate(function () {
      _this.element.update(_this.registry.getTilesActive(), _this.registry.getTilesOld());
    });
  }

  _createClass(BusySignal, [{
    key: "attach",
    value: function attach(statusBar) {
      this.subscriptions.add((0, _disposify2["default"])(statusBar.addRightTile({
        item: this.element,
        priority: 500
      })));
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

exports["default"] = BusySignal;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7eUJBQ3BCLFdBQVc7Ozs7dUJBQ2IsV0FBVzs7Ozt3QkFDVixZQUFZOzs7OytCQUNELHFCQUFxQjs7SUFFaEMsVUFBVTtBQU1sQixXQU5RLFVBQVUsR0FNZjs7OzBCQU5LLFVBQVU7O0FBTzNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsMEJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7QUFDL0IsUUFBSSxDQUFDLGVBQWUsR0FBRyxxQ0FBb0I7YUFBTSxNQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7QUFDekUsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFdEMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUM5QixZQUFLLE9BQU8sQ0FBQyxNQUFNLENBQ2pCLE1BQUssUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUM5QixNQUFLLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FDNUIsQ0FBQztLQUNILENBQUMsQ0FBQztHQUNKOztlQXJCa0IsVUFBVTs7V0FzQnZCLGdCQUFDLFNBQWlCLEVBQUU7QUFDeEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLDRCQUNFLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFDckIsWUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQ2xCLGdCQUFRLEVBQUUsR0FBRztPQUNkLENBQUMsQ0FDSCxDQUNGLENBQUM7S0FDSDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzlCOzs7U0FsQ2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCBkaXNwb3NpZnkgZnJvbSBcImRpc3Bvc2lmeVwiO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSBcIi4vZWxlbWVudFwiO1xuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gXCIuL3JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBBdG9tSWRlUHJvdmlkZXIgfSBmcm9tIFwiLi9hdG9tLWlkZS1wcm92aWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXN5U2lnbmFsIHtcbiAgZWxlbWVudDogRWxlbWVudDtcbiAgcmVnaXN0cnk6IFJlZ2lzdHJ5O1xuICBhdG9tSWRlUHJvdmlkZXI6IEF0b21JZGVQcm92aWRlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBuZXcgRWxlbWVudCgpO1xuICAgIHRoaXMucmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKTtcbiAgICB0aGlzLmF0b21JZGVQcm92aWRlciA9IG5ldyBBdG9tSWRlUHJvdmlkZXIoKCkgPT4gdGhpcy5yZWdpc3RyeS5jcmVhdGUoKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnkpO1xuXG4gICAgdGhpcy5yZWdpc3RyeS5vbkRpZFVwZGF0ZSgoKSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnQudXBkYXRlKFxuICAgICAgICB0aGlzLnJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksXG4gICAgICAgIHRoaXMucmVnaXN0cnkuZ2V0VGlsZXNPbGQoKVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuICBhdHRhY2goc3RhdHVzQmFyOiBPYmplY3QpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgZGlzcG9zaWZ5KFxuICAgICAgICBzdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgICAgICBpdGVtOiB0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgcHJpb3JpdHk6IDUwMFxuICAgICAgICB9KVxuICAgICAgKVxuICAgICk7XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG59XG4iXX0=