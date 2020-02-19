Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ms = require("ms");

var _ms2 = _interopRequireDefault(_ms);

// eslint-disable-next-line import/no-unresolved

var _atom = require("atom");

var _provider = require("./provider");

var _provider2 = _interopRequireDefault(_provider);

var Registry = (function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this.emitter = new _atom.Emitter();
    this.providers = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(this.emitter);

    this.statuses = new Map();
    this.statusHistory = [];
  }

  // Public method

  _createClass(Registry, [{
    key: "create",
    value: function create() {
      var _this = this;

      var provider = new _provider2["default"]();
      provider.onDidAdd(function (_ref) {
        var title = _ref.title;
        var options = _ref.options;

        _this.statusAdd(provider, title, options);
      });
      provider.onDidRemove(function (title) {
        _this.statusRemove(provider, title);
      });
      provider.onDidChangeTitle(function (_ref2) {
        var title = _ref2.title;
        var oldTitle = _ref2.oldTitle;

        _this.statusChangeTitle(provider, title, oldTitle);
      });
      provider.onDidClear(function () {
        _this.statusClear(provider);
      });
      provider.onDidDispose(function () {
        _this.statusClear(provider);
        _this.providers["delete"](provider);
      });
      this.providers.add(provider);
      return provider;
    }
  }, {
    key: "statusAdd",
    value: function statusAdd(provider, title, options) {
      var key = provider.id + "::" + title;
      if (this.statuses.has(key)) {
        // This will help catch bugs in providers
        throw new Error("Status '" + title + "' is already set");
      }

      var entry = {
        key: key,
        title: title,
        provider: provider,
        timeStarted: Date.now(),
        timeStopped: null,
        options: options
      };
      this.statuses.set(entry.key, entry);
      this.emitter.emit("did-update");
    }
  }, {
    key: "statusRemove",
    value: function statusRemove(provider, title) {
      var key = provider.id + "::" + title;
      var value = this.statuses.get(key);
      if (value) {
        this.pushIntoHistory(value);
        this.statuses["delete"](key);
        this.emitter.emit("did-update");
      }
    }
  }, {
    key: "statusChangeTitle",
    value: function statusChangeTitle(provider, title, oldTitle) {
      var oldKey = provider.id + "::" + oldTitle;
      var entry = this.statuses.get(oldKey);
      if (!entry) {
        return;
      }

      this.statuses["delete"](oldKey);

      entry.title = title;
      entry.key = provider.id + "::" + title;

      this.statuses.set(entry.key, entry);
      this.emitter.emit("did-update");
    }
  }, {
    key: "statusClear",
    value: function statusClear(provider) {
      var _this2 = this;

      var triggerUpdate = false;
      this.statuses.forEach(function (value) {
        if (value.provider === provider) {
          triggerUpdate = true;
          _this2.pushIntoHistory(value);
          _this2.statuses["delete"](value.key);
        }
      });
      if (triggerUpdate) {
        this.emitter.emit("did-update");
      }
    }
  }, {
    key: "pushIntoHistory",
    value: function pushIntoHistory(status) {
      status.timeStopped = Date.now();
      var i = this.statusHistory.length;
      while (i--) {
        if (this.statusHistory[i].key === status.key) {
          this.statusHistory.splice(i, 1);
          break;
        }
      }
      this.statusHistory.push(status);
      this.statusHistory = this.statusHistory.slice(-10);
    }
  }, {
    key: "getTilesActive",
    value: function getTilesActive() {
      return Array.from(this.statuses.values()).sort(function (a, b) {
        return b.timeStarted - a.timeStarted;
      });
    }
  }, {
    key: "getTilesOld",
    value: function getTilesOld() {
      var _this3 = this;

      var oldTiles = [];

      this.statusHistory.forEach(function (entry) {
        if (_this3.statuses.has(entry.key)) return;
        oldTiles.push({
          title: entry.title,
          duration: (0, _ms2["default"])((entry.timeStopped || 0) - entry.timeStarted)
        });
      });

      return oldTiles;
    }
  }, {
    key: "onDidUpdate",
    value: function onDidUpdate(callback) {
      return this.emitter.on("did-update", callback);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.subscriptions.dispose();
      for (var provider of this.providers) {
        provider.dispose();
      }
    }
  }]);

  return Registry;
})();

exports["default"] = Registry;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7OztvQkFFMEIsTUFBTTs7d0JBRTlCLFlBQVk7Ozs7SUFHWixRQUFRO0FBUWhCLFdBUlEsUUFBUSxHQVFiOzBCQVJLLFFBQVE7O0FBU3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDM0IsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXJDLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztHQUN6Qjs7OztlQWhCa0IsUUFBUTs7V0FrQnJCLGtCQUFhOzs7QUFDakIsVUFBTSxRQUFRLEdBQUcsMkJBQWMsQ0FBQztBQUNoQyxjQUFRLENBQUMsUUFBUSxDQUFDLFVBQUMsSUFBa0IsRUFBSztZQUFyQixLQUFLLEdBQVAsSUFBa0IsQ0FBaEIsS0FBSztZQUFFLE9BQU8sR0FBaEIsSUFBa0IsQ0FBVCxPQUFPOztBQUNqQyxjQUFLLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzFDLENBQUMsQ0FBQztBQUNILGNBQVEsQ0FBQyxXQUFXLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDNUIsY0FBSyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3BDLENBQUMsQ0FBQztBQUNILGNBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFDLEtBQW1CLEVBQUs7WUFBdEIsS0FBSyxHQUFQLEtBQW1CLENBQWpCLEtBQUs7WUFBRSxRQUFRLEdBQWpCLEtBQW1CLENBQVYsUUFBUTs7QUFDMUMsY0FBSyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQ25ELENBQUMsQ0FBQztBQUNILGNBQVEsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUN4QixjQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUM1QixDQUFDLENBQUM7QUFDSCxjQUFRLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDMUIsY0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0IsY0FBSyxTQUFTLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNqQyxDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1dBQ1EsbUJBQUMsUUFBa0IsRUFBRSxLQUFhLEVBQUUsT0FBd0IsRUFBUTtBQUMzRSxVQUFNLEdBQUcsR0FBTSxRQUFRLENBQUMsRUFBRSxVQUFLLEtBQUssQUFBRSxDQUFDO0FBQ3ZDLFVBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7O0FBRTFCLGNBQU0sSUFBSSxLQUFLLGNBQVksS0FBSyxzQkFBbUIsQ0FBQztPQUNyRDs7QUFFRCxVQUFNLEtBQUssR0FBRztBQUNaLFdBQUcsRUFBSCxHQUFHO0FBQ0gsYUFBSyxFQUFMLEtBQUs7QUFDTCxnQkFBUSxFQUFSLFFBQVE7QUFDUixtQkFBVyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDdkIsbUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGVBQU8sRUFBUCxPQUFPO09BQ1IsQ0FBQztBQUNGLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDakM7OztXQUNXLHNCQUFDLFFBQWtCLEVBQUUsS0FBYSxFQUFRO0FBQ3BELFVBQU0sR0FBRyxHQUFNLFFBQVEsQ0FBQyxFQUFFLFVBQUssS0FBSyxBQUFFLENBQUM7QUFDdkMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUNqQztLQUNGOzs7V0FDZ0IsMkJBQUMsUUFBa0IsRUFBRSxLQUFhLEVBQUUsUUFBZ0IsRUFBUTtBQUMzRSxVQUFNLE1BQU0sR0FBTSxRQUFRLENBQUMsRUFBRSxVQUFLLFFBQVEsQUFBRSxDQUFDO0FBQzdDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxLQUFLLEVBQUU7QUFDVixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLFFBQVEsVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixXQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNwQixXQUFLLENBQUMsR0FBRyxHQUFNLFFBQVEsQ0FBQyxFQUFFLFVBQUssS0FBSyxBQUFFLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDakM7OztXQUNVLHFCQUFDLFFBQWtCLEVBQVE7OztBQUNwQyxVQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDN0IsWUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUMvQix1QkFBYSxHQUFHLElBQUksQ0FBQztBQUNyQixpQkFBSyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsaUJBQUssUUFBUSxVQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2pDO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxhQUFhLEVBQUU7QUFDakIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDakM7S0FDRjs7O1dBQ2MseUJBQUMsTUFBc0IsRUFBUTtBQUM1QyxZQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNsQyxhQUFPLENBQUMsRUFBRSxFQUFFO0FBQ1YsWUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQzVDLGNBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxnQkFBTTtTQUNQO09BQ0Y7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEQ7OztXQUNhLDBCQUEwQjtBQUN0QyxhQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FDNUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztlQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLFdBQVc7T0FBQSxDQUN4QyxDQUFDO0tBQ0g7OztXQUNVLHVCQUErQzs7O0FBQ3hELFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDbEMsWUFBSSxPQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU87QUFDekMsZ0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixlQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsa0JBQVEsRUFBRSxxQkFBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFBLEdBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQztTQUMzRCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsYUFBTyxRQUFRLENBQUM7S0FDakI7OztXQUNVLHFCQUFDLFFBQWtCLEVBQWU7QUFDM0MsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDaEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixXQUFLLElBQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDckMsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNwQjtLQUNGOzs7U0FwSWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBtcyBmcm9tIFwibXNcIjtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCBQcm92aWRlciBmcm9tIFwiLi9wcm92aWRlclwiO1xuaW1wb3J0IHR5cGUgeyBTaWduYWxJbnRlcm5hbCwgU2lnbmFsT3B0aW9ucyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgcHJvdmlkZXJzOiBTZXQ8UHJvdmlkZXI+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIHN0YXR1c2VzOiBNYXA8c3RyaW5nLCBTaWduYWxJbnRlcm5hbD47XG4gIHN0YXR1c0hpc3Rvcnk6IEFycmF5PFNpZ25hbEludGVybmFsPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpO1xuXG4gICAgdGhpcy5zdGF0dXNlcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnN0YXR1c0hpc3RvcnkgPSBbXTtcbiAgfVxuICAvLyBQdWJsaWMgbWV0aG9kXG4gIGNyZWF0ZSgpOiBQcm92aWRlciB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIoKTtcbiAgICBwcm92aWRlci5vbkRpZEFkZCgoeyB0aXRsZSwgb3B0aW9ucyB9KSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c0FkZChwcm92aWRlciwgdGl0bGUsIG9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb3ZpZGVyLm9uRGlkUmVtb3ZlKHRpdGxlID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzUmVtb3ZlKHByb3ZpZGVyLCB0aXRsZSk7XG4gICAgfSk7XG4gICAgcHJvdmlkZXIub25EaWRDaGFuZ2VUaXRsZSgoeyB0aXRsZSwgb2xkVGl0bGUgfSkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNDaGFuZ2VUaXRsZShwcm92aWRlciwgdGl0bGUsIG9sZFRpdGxlKTtcbiAgICB9KTtcbiAgICBwcm92aWRlci5vbkRpZENsZWFyKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzQ2xlYXIocHJvdmlkZXIpO1xuICAgIH0pO1xuICAgIHByb3ZpZGVyLm9uRGlkRGlzcG9zZSgoKSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c0NsZWFyKHByb3ZpZGVyKTtcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcik7XG4gICAgfSk7XG4gICAgdGhpcy5wcm92aWRlcnMuYWRkKHByb3ZpZGVyKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH1cbiAgc3RhdHVzQWRkKHByb3ZpZGVyOiBQcm92aWRlciwgdGl0bGU6IHN0cmluZywgb3B0aW9ucz86ID9TaWduYWxPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc3Qga2V5ID0gYCR7cHJvdmlkZXIuaWR9Ojoke3RpdGxlfWA7XG4gICAgaWYgKHRoaXMuc3RhdHVzZXMuaGFzKGtleSkpIHtcbiAgICAgIC8vIFRoaXMgd2lsbCBoZWxwIGNhdGNoIGJ1Z3MgaW4gcHJvdmlkZXJzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YXR1cyAnJHt0aXRsZX0nIGlzIGFscmVhZHkgc2V0YCk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50cnkgPSB7XG4gICAgICBrZXksXG4gICAgICB0aXRsZSxcbiAgICAgIHByb3ZpZGVyLFxuICAgICAgdGltZVN0YXJ0ZWQ6IERhdGUubm93KCksXG4gICAgICB0aW1lU3RvcHBlZDogbnVsbCxcbiAgICAgIG9wdGlvbnNcbiAgICB9O1xuICAgIHRoaXMuc3RhdHVzZXMuc2V0KGVudHJ5LmtleSwgZW50cnkpO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLXVwZGF0ZVwiKTtcbiAgfVxuICBzdGF0dXNSZW1vdmUocHJvdmlkZXI6IFByb3ZpZGVyLCB0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qga2V5ID0gYCR7cHJvdmlkZXIuaWR9Ojoke3RpdGxlfWA7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnN0YXR1c2VzLmdldChrZXkpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5wdXNoSW50b0hpc3RvcnkodmFsdWUpO1xuICAgICAgdGhpcy5zdGF0dXNlcy5kZWxldGUoa2V5KTtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLXVwZGF0ZVwiKTtcbiAgICB9XG4gIH1cbiAgc3RhdHVzQ2hhbmdlVGl0bGUocHJvdmlkZXI6IFByb3ZpZGVyLCB0aXRsZTogc3RyaW5nLCBvbGRUaXRsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgb2xkS2V5ID0gYCR7cHJvdmlkZXIuaWR9Ojoke29sZFRpdGxlfWA7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLnN0YXR1c2VzLmdldChvbGRLZXkpO1xuICAgIGlmICghZW50cnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXR1c2VzLmRlbGV0ZShvbGRLZXkpO1xuXG4gICAgZW50cnkudGl0bGUgPSB0aXRsZTtcbiAgICBlbnRyeS5rZXkgPSBgJHtwcm92aWRlci5pZH06OiR7dGl0bGV9YDtcblxuICAgIHRoaXMuc3RhdHVzZXMuc2V0KGVudHJ5LmtleSwgZW50cnkpO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLXVwZGF0ZVwiKTtcbiAgfVxuICBzdGF0dXNDbGVhcihwcm92aWRlcjogUHJvdmlkZXIpOiB2b2lkIHtcbiAgICBsZXQgdHJpZ2dlclVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBpZiAodmFsdWUucHJvdmlkZXIgPT09IHByb3ZpZGVyKSB7XG4gICAgICAgIHRyaWdnZXJVcGRhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnB1c2hJbnRvSGlzdG9yeSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc3RhdHVzZXMuZGVsZXRlKHZhbHVlLmtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRyaWdnZXJVcGRhdGUpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLXVwZGF0ZVwiKTtcbiAgICB9XG4gIH1cbiAgcHVzaEludG9IaXN0b3J5KHN0YXR1czogU2lnbmFsSW50ZXJuYWwpOiB2b2lkIHtcbiAgICBzdGF0dXMudGltZVN0b3BwZWQgPSBEYXRlLm5vdygpO1xuICAgIGxldCBpID0gdGhpcy5zdGF0dXNIaXN0b3J5Lmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAodGhpcy5zdGF0dXNIaXN0b3J5W2ldLmtleSA9PT0gc3RhdHVzLmtleSkge1xuICAgICAgICB0aGlzLnN0YXR1c0hpc3Rvcnkuc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zdGF0dXNIaXN0b3J5LnB1c2goc3RhdHVzKTtcbiAgICB0aGlzLnN0YXR1c0hpc3RvcnkgPSB0aGlzLnN0YXR1c0hpc3Rvcnkuc2xpY2UoLTEwKTtcbiAgfVxuICBnZXRUaWxlc0FjdGl2ZSgpOiBBcnJheTxTaWduYWxJbnRlcm5hbD4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdHVzZXMudmFsdWVzKCkpLnNvcnQoXG4gICAgICAoYSwgYikgPT4gYi50aW1lU3RhcnRlZCAtIGEudGltZVN0YXJ0ZWRcbiAgICApO1xuICB9XG4gIGdldFRpbGVzT2xkKCk6IEFycmF5PHsgdGl0bGU6IHN0cmluZywgZHVyYXRpb246IHN0cmluZyB9PiB7XG4gICAgY29uc3Qgb2xkVGlsZXMgPSBbXTtcblxuICAgIHRoaXMuc3RhdHVzSGlzdG9yeS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXR1c2VzLmhhcyhlbnRyeS5rZXkpKSByZXR1cm47XG4gICAgICBvbGRUaWxlcy5wdXNoKHtcbiAgICAgICAgdGl0bGU6IGVudHJ5LnRpdGxlLFxuICAgICAgICBkdXJhdGlvbjogbXMoKGVudHJ5LnRpbWVTdG9wcGVkIHx8IDApIC0gZW50cnkudGltZVN0YXJ0ZWQpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvbGRUaWxlcztcbiAgfVxuICBvbkRpZFVwZGF0ZShjYWxsYmFjazogRnVuY3Rpb24pOiBJRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbihcImRpZC11cGRhdGVcIiwgY2FsbGJhY2spO1xuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBmb3IgKGNvbnN0IHByb3ZpZGVyIG9mIHRoaXMucHJvdmlkZXJzKSB7XG4gICAgICBwcm92aWRlci5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=