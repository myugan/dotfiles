Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line import/no-unresolved

var _atom = require("atom");

var _helpers = require("./helpers");

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.id = (0, _helpers.generateRandom)();
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public

  _createClass(Provider, [{
    key: "add",
    value: function add(title, options) {
      this.emitter.emit("did-add", { title: title, options: options });
    }

    // Public
  }, {
    key: "remove",
    value: function remove(title) {
      this.emitter.emit("did-remove", title);
    }

    // Public
  }, {
    key: "changeTitle",
    value: function changeTitle(title, oldTitle) {
      this.emitter.emit("did-change-title", { title: title, oldTitle: oldTitle });
    }

    // Public
  }, {
    key: "clear",
    value: function clear() {
      this.emitter.emit("did-clear");
    }
  }, {
    key: "onDidAdd",
    value: function onDidAdd(callback) {
      return this.emitter.on("did-add", callback);
    }
  }, {
    key: "onDidRemove",
    value: function onDidRemove(callback) {
      return this.emitter.on("did-remove", callback);
    }
  }, {
    key: "onDidChangeTitle",
    value: function onDidChangeTitle(callback) {
      return this.emitter.on("did-change-title", callback);
    }
  }, {
    key: "onDidClear",
    value: function onDidClear(callback) {
      return this.emitter.on("did-clear", callback);
    }
  }, {
    key: "onDidDispose",
    value: function onDidDispose(callback) {
      return this.emitter.on("did-dispose", callback);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.emitter.emit("did-dispose");
      this.subscriptions.dispose();
    }
  }]);

  return Provider;
})();

exports["default"] = Provider;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUc2QyxNQUFNOzt1QkFDcEIsV0FBVzs7SUFHckIsUUFBUTtBQUtoQixXQUxRLFFBQVEsR0FLYjswQkFMSyxRQUFROztBQU16QixRQUFJLENBQUMsRUFBRSxHQUFHLDhCQUFnQixDQUFDO0FBQzNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDdEM7Ozs7ZUFYa0IsUUFBUTs7V0FjeEIsYUFBQyxLQUFhLEVBQUUsT0FBd0IsRUFBRTtBQUMzQyxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2xEOzs7OztXQUVLLGdCQUFDLEtBQWEsRUFBRTtBQUNwQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEM7Ozs7O1dBRVUscUJBQUMsS0FBYSxFQUFFLFFBQWdCLEVBQUU7QUFDM0MsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQzVEOzs7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDaEM7OztXQUVPLGtCQUNOLFFBQWtFLEVBQ3JEO0FBQ2IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDN0M7OztXQUNVLHFCQUFDLFFBQWdDLEVBQWU7QUFDekQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDaEQ7OztXQUNlLDBCQUNkLFFBQThELEVBQ2pEO0FBQ2IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN0RDs7O1dBQ1Msb0JBQUMsUUFBbUIsRUFBZTtBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMvQzs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBZTtBQUM1QyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNqRDs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzlCOzs7U0FyRGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbSB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB0eXBlIHsgU2lnbmFsT3B0aW9ucyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyIHtcbiAgaWQ6IHN0cmluZztcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkID0gZ2VuZXJhdGVSYW5kb20oKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcik7XG4gIH1cblxuICAvLyBQdWJsaWNcbiAgYWRkKHRpdGxlOiBzdHJpbmcsIG9wdGlvbnM/OiA/U2lnbmFsT3B0aW9ucykge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLWFkZFwiLCB7IHRpdGxlLCBvcHRpb25zIH0pO1xuICB9XG4gIC8vIFB1YmxpY1xuICByZW1vdmUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLXJlbW92ZVwiLCB0aXRsZSk7XG4gIH1cbiAgLy8gUHVibGljXG4gIGNoYW5nZVRpdGxlKHRpdGxlOiBzdHJpbmcsIG9sZFRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChcImRpZC1jaGFuZ2UtdGl0bGVcIiwgeyB0aXRsZSwgb2xkVGl0bGUgfSk7XG4gIH1cbiAgLy8gUHVibGljXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLWNsZWFyXCIpO1xuICB9XG5cbiAgb25EaWRBZGQoXG4gICAgY2FsbGJhY2s6IChhZGQ6IHsgdGl0bGU6IHN0cmluZywgb3B0aW9uczogP1NpZ25hbE9wdGlvbnMgfSkgPT4gYW55XG4gICk6IElEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKFwiZGlkLWFkZFwiLCBjYWxsYmFjayk7XG4gIH1cbiAgb25EaWRSZW1vdmUoY2FsbGJhY2s6ICh0aXRsZTogc3RyaW5nKSA9PiBhbnkpOiBJRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbihcImRpZC1yZW1vdmVcIiwgY2FsbGJhY2spO1xuICB9XG4gIG9uRGlkQ2hhbmdlVGl0bGUoXG4gICAgY2FsbGJhY2s6IChjaGFuZ2U6IHsgdGl0bGU6IHN0cmluZywgb2xkVGl0bGU6IHN0cmluZyB9KSA9PiBhbnlcbiAgKTogSURpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oXCJkaWQtY2hhbmdlLXRpdGxlXCIsIGNhbGxiYWNrKTtcbiAgfVxuICBvbkRpZENsZWFyKGNhbGxiYWNrOiAoKSA9PiBhbnkpOiBJRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbihcImRpZC1jbGVhclwiLCBjYWxsYmFjayk7XG4gIH1cbiAgb25EaWREaXNwb3NlKGNhbGxiYWNrOiBGdW5jdGlvbik6IElEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKFwiZGlkLWRpc3Bvc2VcIiwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChcImRpZC1kaXNwb3NlXCIpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==