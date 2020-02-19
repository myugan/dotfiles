Object.defineProperty(exports, "__esModule", {
  value: true
});

// eslint-disable-next-line import/no-unresolved

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AtomIdeProvider = (function () {
  function AtomIdeProvider(createProvider) {
    _classCallCheck(this, AtomIdeProvider);

    this.messages = new Set();

    this.createProvider = createProvider;
  }

  _createClass(AtomIdeProvider, [{
    key: "reportBusyWhile",
    value: _asyncToGenerator(function* (title, f, options) {
      var busyMessage = this.reportBusy(title, options);
      try {
        return yield f();
      } finally {
        busyMessage.dispose();
      }
    })
  }, {
    key: "reportBusy",
    value: function reportBusy(title, options) {
      var _this = this;

      var provider = this.createProvider();

      if (options) {
        // TODO: options not implemented yet
      }

      provider.add(title);

      var busyMessage = {
        setTitle: function setTitle(newTitle) {
          provider.changeTitle(newTitle, title);
          // Cache the current title for consecutive title changes
          title = newTitle;
        },
        dispose: function dispose() {
          provider.dispose();
          _this.messages["delete"](busyMessage);
        }
      };
      this.messages.add(busyMessage);

      return busyMessage;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.messages.forEach(function (msg) {
        msg.dispose();
      });
      this.messages.clear();
    }
  }]);

  return AtomIdeProvider;
})();

exports.AtomIdeProvider = AtomIdeProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9hdG9tLWlkZS1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFNYSxlQUFlO0FBSWYsV0FKQSxlQUFlLENBSWQsY0FBOEIsRUFBRTswQkFKakMsZUFBZTs7U0FFMUIsUUFBUSxHQUFxQixJQUFJLEdBQUcsRUFBRTs7QUFHcEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7R0FDdEM7O2VBTlUsZUFBZTs7NkJBUUYsV0FDdEIsS0FBYSxFQUNiLENBQW1CLEVBQ25CLE9BQTJCLEVBQ2Y7QUFDWixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwRCxVQUFJO0FBQ0YsZUFBTyxNQUFNLENBQUMsRUFBRSxDQUFDO09BQ2xCLFNBQVM7QUFDUixtQkFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3ZCO0tBQ0Y7OztXQUVTLG9CQUFDLEtBQWEsRUFBRSxPQUEyQixFQUFlOzs7QUFDbEUsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV2QyxVQUFJLE9BQU8sRUFBRTs7T0FFWjs7QUFFRCxjQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVwQixVQUFNLFdBQVcsR0FBRztBQUNsQixnQkFBUSxFQUFFLGtCQUFDLFFBQVEsRUFBYTtBQUM5QixrQkFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXRDLGVBQUssR0FBRyxRQUFRLENBQUE7U0FDakI7QUFDRCxlQUFPLEVBQUUsbUJBQU07QUFDYixrQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25CLGdCQUFLLFFBQVEsVUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ25DO09BQ0YsQ0FBQztBQUNGLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUvQixhQUFPLFdBQVcsQ0FBQztLQUNwQjs7O1dBRU0sbUJBQVM7QUFDZCxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUMzQixXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDZixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3ZCOzs7U0FuRFUsZUFBZSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvYXRvbS1pZGUtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCB0eXBlIHsgQnVzeVNpZ25hbE9wdGlvbnMsIEJ1c3lNZXNzYWdlIH0gZnJvbSBcImF0b20taWRlL2J1c3ktc2lnbmFsXCI7XG5pbXBvcnQgdHlwZSBQcm92aWRlciBmcm9tIFwiLi9wcm92aWRlclwiO1xuXG5leHBvcnQgY2xhc3MgQXRvbUlkZVByb3ZpZGVyIHtcbiAgY3JlYXRlUHJvdmlkZXI6ICgpID0+IFByb3ZpZGVyO1xuICBtZXNzYWdlczogU2V0PEJ1c3lNZXNzYWdlPiA9IG5ldyBTZXQoKTtcblxuICBjb25zdHJ1Y3RvcihjcmVhdGVQcm92aWRlcjogKCkgPT4gUHJvdmlkZXIpIHtcbiAgICB0aGlzLmNyZWF0ZVByb3ZpZGVyID0gY3JlYXRlUHJvdmlkZXI7XG4gIH1cblxuICBhc3luYyByZXBvcnRCdXN5V2hpbGU8VD4oXG4gICAgdGl0bGU6IHN0cmluZyxcbiAgICBmOiAoKSA9PiBQcm9taXNlPFQ+LFxuICAgIG9wdGlvbnM/OiBCdXN5U2lnbmFsT3B0aW9uc1xuICApOiBQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBidXN5TWVzc2FnZSA9IHRoaXMucmVwb3J0QnVzeSh0aXRsZSwgb3B0aW9ucyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBmKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGJ1c3lNZXNzYWdlLmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cblxuICByZXBvcnRCdXN5KHRpdGxlOiBzdHJpbmcsIG9wdGlvbnM/OiBCdXN5U2lnbmFsT3B0aW9ucyk6IEJ1c3lNZXNzYWdlIHtcbiAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuY3JlYXRlUHJvdmlkZXIoKTtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAvLyBUT0RPOiBvcHRpb25zIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICB9XG5cbiAgICBwcm92aWRlci5hZGQodGl0bGUpO1xuXG4gICAgY29uc3QgYnVzeU1lc3NhZ2UgPSB7XG4gICAgICBzZXRUaXRsZTogKG5ld1RpdGxlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgcHJvdmlkZXIuY2hhbmdlVGl0bGUobmV3VGl0bGUsIHRpdGxlKTtcbiAgICAgICAgLy8gQ2FjaGUgdGhlIGN1cnJlbnQgdGl0bGUgZm9yIGNvbnNlY3V0aXZlIHRpdGxlIGNoYW5nZXNcbiAgICAgICAgdGl0bGUgPSBuZXdUaXRsZVxuICAgICAgfSxcbiAgICAgIGRpc3Bvc2U6ICgpID0+IHtcbiAgICAgICAgcHJvdmlkZXIuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShidXN5TWVzc2FnZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLm1lc3NhZ2VzLmFkZChidXN5TWVzc2FnZSk7XG5cbiAgICByZXR1cm4gYnVzeU1lc3NhZ2U7XG4gIH1cblxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMubWVzc2FnZXMuZm9yRWFjaChtc2cgPT4ge1xuICAgICAgbXNnLmRpc3Bvc2UoKTtcbiAgICB9KTtcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==