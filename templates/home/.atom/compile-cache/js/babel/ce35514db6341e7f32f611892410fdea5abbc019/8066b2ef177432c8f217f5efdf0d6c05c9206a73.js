function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require("jasmine-fix");

var _libRegistry = require("../lib/registry");

var _libRegistry2 = _interopRequireDefault(_libRegistry);

var _libAtomIdeProvider = require("../lib/atom-ide-provider");

describe("Atom IDE Provider", function () {
  var registry = undefined;
  var atomIdeProvider = undefined;

  beforeEach(function () {
    registry = new _libRegistry2["default"]();
    atomIdeProvider = new _libAtomIdeProvider.AtomIdeProvider(function () {
      return registry.create();
    });
  });
  afterEach(function () {
    atomIdeProvider.dispose();
    registry.dispose();
  });

  function validateTiles(actual, expected) {
    expect(actual.length).toBe(expected.length);

    actual.forEach(function (entry, index) {
      expect(entry.title).toBe(expected[index]);
    });
  }
  function validateOldTiles(oldTitles, titles) {
    var checkDuration = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    expect(oldTitles.length).toBe(titles.length);

    titles.forEach(function (title, index) {
      expect(oldTitles[index].title).toBe(title);
      if (checkDuration) {
        expect(oldTitles[index].duration === "1ms" || oldTitles[index].duration === "0ms").toBe(true);
      }
    });
  }

  describe("reportBusy", function () {
    (0, _jasmineFix.it)("adds titles", function () {
      atomIdeProvider.reportBusy("Hello");
      validateTiles(registry.getTilesActive(), ["Hello"]);
    });
    (0, _jasmineFix.it)("adds removed ones to history", _asyncToGenerator(function* () {
      atomIdeProvider.reportBusy("Boy");
      yield (0, _jasmineFix.wait)(1);
      var msg = atomIdeProvider.reportBusy("Hey");

      validateTiles(registry.getTilesActive(), ["Hey", "Boy"]);
      expect(registry.getTilesOld()).toEqual([]);

      msg.dispose();
      validateTiles(registry.getTilesActive(), ["Boy"]);
      validateOldTiles(registry.getTilesOld(), ["Hey"], false);
    }));
    (0, _jasmineFix.it)("can set a new title", function () {
      var msg = atomIdeProvider.reportBusy("Hi");
      validateTiles(registry.getTilesActive(), ["Hi"]);
      msg.setTitle("Howdy");
      validateTiles(registry.getTilesActive(), ["Howdy"]);
      msg.setTitle("Whatsup");
      validateTiles(registry.getTilesActive(), ["Whatsup"]);
      msg.dispose();
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Whatsup"], false);
    });
  });
  describe("reportBusyWhile", function () {
    function waitWithValue(timeout, v) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          return resolve(v);
        }, timeout);
      });
    }
    (0, _jasmineFix.it)("adds titles", _asyncToGenerator(function* () {
      var prom = atomIdeProvider.reportBusyWhile("Hello", function () {
        return waitWithValue(1, "Bazinga!");
      });
      validateTiles(registry.getTilesActive(), ["Hello"]);
      var v = yield prom;
      expect(v).toBe("Bazinga!");
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Hello"], false);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL3NwZWMvYXRvbS1pZGUtcHJvdmlkZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzBCQUV5QixhQUFhOzsyQkFDakIsaUJBQWlCOzs7O2tDQUNOLDBCQUEwQjs7QUFHMUQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQVc7QUFDdkMsTUFBSSxRQUFRLFlBQUEsQ0FBQztBQUNiLE1BQUksZUFBZSxZQUFBLENBQUM7O0FBRXBCLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFlBQVEsR0FBRyw4QkFBYyxDQUFDO0FBQzFCLG1CQUFlLEdBQUcsd0NBQW9CO2FBQU0sUUFBUSxDQUFDLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQztHQUNoRSxDQUFDLENBQUM7QUFDSCxXQUFTLENBQUMsWUFBVztBQUNuQixtQkFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFCLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNwQixDQUFDLENBQUM7O0FBRUgsV0FBUyxhQUFhLENBQ3BCLE1BQTZCLEVBQzdCLFFBQXVCLEVBQ3ZCO0FBQ0EsVUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU1QyxVQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUMvQixZQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUMzQyxDQUFDLENBQUM7R0FDSjtBQUNELFdBQVMsZ0JBQWdCLENBQ3ZCLFNBQXFELEVBQ3JELE1BQXFCLEVBRXJCO1FBREEsYUFBc0IseURBQUcsSUFBSTs7QUFFN0IsVUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFD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LFVBQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFO2VBQ3BELGFBQWEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDO09BQUEsQ0FDN0IsQ0FBQztBQUNGLG1CQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNwRCxVQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQztBQUNyQixZQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLG1CQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLHNCQUFnQixDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVELEVBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9zcGVjL2F0b20taWRlLXByb3ZpZGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBpdCwgd2FpdCB9IGZyb20gXCJqYXNtaW5lLWZpeFwiO1xuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gXCIuLi9saWIvcmVnaXN0cnlcIjtcbmltcG9ydCB7IEF0b21JZGVQcm92aWRlciB9IGZyb20gXCIuLi9saWIvYXRvbS1pZGUtcHJvdmlkZXJcIjtcbmltcG9ydCB0eXBlIHsgU2lnbmFsSW50ZXJuYWwgfSBmcm9tIFwiLi4vbGliL3R5cGVzXCI7XG5cbmRlc2NyaWJlKFwiQXRvbSBJREUgUHJvdmlkZXJcIiwgZnVuY3Rpb24oKSB7XG4gIGxldCByZWdpc3RyeTtcbiAgbGV0IGF0b21JZGVQcm92aWRlcjtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG4gICAgYXRvbUlkZVByb3ZpZGVyID0gbmV3IEF0b21JZGVQcm92aWRlcigoKSA9PiByZWdpc3RyeS5jcmVhdGUoKSk7XG4gIH0pO1xuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgYXRvbUlkZVByb3ZpZGVyLmRpc3Bvc2UoKTtcbiAgICByZWdpc3RyeS5kaXNwb3NlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlVGlsZXMoXG4gICAgYWN0dWFsOiBBcnJheTxTaWduYWxJbnRlcm5hbD4sXG4gICAgZXhwZWN0ZWQ6IEFycmF5PHN0cmluZz5cbiAgKSB7XG4gICAgZXhwZWN0KGFjdHVhbC5sZW5ndGgpLnRvQmUoZXhwZWN0ZWQubGVuZ3RoKTtcblxuICAgIGFjdHVhbC5mb3JFYWNoKChlbnRyeSwgaW5kZXgpID0+IHtcbiAgICAgIGV4cGVjdChlbnRyeS50aXRsZSkudG9CZShleHBlY3RlZFtpbmRleF0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHZhbGlkYXRlT2xkVGlsZXMoXG4gICAgb2xkVGl0bGVzOiBBcnJheTx7IHRpdGxlOiBzdHJpbmcsIGR1cmF0aW9uOiBzdHJpbmcgfT4sXG4gICAgdGl0bGVzOiBBcnJheTxzdHJpbmc+LFxuICAgIGNoZWNrRHVyYXRpb246IGJvb2xlYW4gPSB0cnVlXG4gICkge1xuICAgIGV4cGVjdChvbGRUaXRsZXMubGVuZ3RoKS50b0JlKHRpdGxlcy5sZW5ndGgpO1xuXG4gICAgdGl0bGVzLmZvckVhY2goZnVuY3Rpb24odGl0bGUsIGluZGV4KSB7XG4gICAgICBleHBlY3Qob2xkVGl0bGVzW2luZGV4XS50aXRsZSkudG9CZSh0aXRsZSk7XG4gICAgICBpZiAoY2hlY2tEdXJhdGlvbikge1xuICAgICAgICBleHBlY3QoXG4gICAgICAgICAgb2xkVGl0bGVzW2luZGV4XS5kdXJhdGlvbiA9PT0gXCIxbXNcIiB8fFxuICAgICAgICAgICAgb2xkVGl0bGVzW2luZGV4XS5kdXJhdGlvbiA9PT0gXCIwbXNcIlxuICAgICAgICApLnRvQmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZXNjcmliZShcInJlcG9ydEJ1c3lcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJhZGRzIHRpdGxlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGF0b21JZGVQcm92aWRlci5yZXBvcnRCdXN5KFwiSGVsbG9cIik7XG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtcIkhlbGxvXCJdKTtcbiAgICB9KTtcbiAgICBpdChcImFkZHMgcmVtb3ZlZCBvbmVzIHRvIGhpc3RvcnlcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tSWRlUHJvdmlkZXIucmVwb3J0QnVzeShcIkJveVwiKTtcbiAgICAgIGF3YWl0IHdhaXQoMSk7XG4gICAgICBjb25zdCBtc2cgPSBhdG9tSWRlUHJvdmlkZXIucmVwb3J0QnVzeShcIkhleVwiKTtcblxuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXCJIZXlcIiwgXCJCb3lcIl0pO1xuICAgICAgZXhwZWN0KHJlZ2lzdHJ5LmdldFRpbGVzT2xkKCkpLnRvRXF1YWwoW10pO1xuXG4gICAgICBtc2cuZGlzcG9zZSgpO1xuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXCJCb3lcIl0pO1xuICAgICAgdmFsaWRhdGVPbGRUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc09sZCgpLCBbXCJIZXlcIl0sIGZhbHNlKTtcbiAgICB9KTtcbiAgICBpdChcImNhbiBzZXQgYSBuZXcgdGl0bGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtc2cgPSBhdG9tSWRlUHJvdmlkZXIucmVwb3J0QnVzeShcIkhpXCIpO1xuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXCJIaVwiXSk7XG4gICAgICBtc2cuc2V0VGl0bGUoXCJIb3dkeVwiKTtcbiAgICAgIHZhbGlkYXRlVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSwgW1wiSG93ZHlcIl0pO1xuICAgICAgbXNnLnNldFRpdGxlKFwiV2hhdHN1cFwiKVxuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXCJXaGF0c3VwXCJdKTtcbiAgICAgIG1zZy5kaXNwb3NlKCk7XG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtdKTtcbiAgICAgIHZhbGlkYXRlT2xkVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNPbGQoKSwgW1wiV2hhdHN1cFwiXSwgZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJyZXBvcnRCdXN5V2hpbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gd2FpdFdpdGhWYWx1ZSh0aW1lb3V0LCB2KSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUodiksIHRpbWVvdXQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGl0KFwiYWRkcyB0aXRsZXNcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwcm9tID0gYXRvbUlkZVByb3ZpZGVyLnJlcG9ydEJ1c3lXaGlsZShcIkhlbGxvXCIsICgpID0+XG4gICAgICAgIHdhaXRXaXRoVmFsdWUoMSwgXCJCYXppbmdhIVwiKVxuICAgICAgKTtcbiAgICAgIHZhbGlkYXRlVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSwgW1wiSGVsbG9cIl0pO1xuICAgICAgY29uc3QgdiA9IGF3YWl0IHByb207XG4gICAgICBleHBlY3QodikudG9CZShcIkJhemluZ2EhXCIpO1xuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXSk7XG4gICAgICB2YWxpZGF0ZU9sZFRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzT2xkKCksIFtcIkhlbGxvXCJdLCBmYWxzZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=