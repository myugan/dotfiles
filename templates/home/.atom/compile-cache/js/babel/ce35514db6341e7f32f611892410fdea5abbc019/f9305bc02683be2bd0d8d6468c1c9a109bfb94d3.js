function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-env jasmine */

var _libDelveSession = require('../lib/delve-session');

var _libDelveSession2 = _interopRequireDefault(_libDelveSession);

'use babel';

describe('', function () {
  var delveProcess = undefined,
      connection = undefined;
  var session = undefined;

  beforeEach(function () {
    delveProcess = jasmine.createSpyObj('process', ['kill']);
    connection = jasmine.createSpyObj('connection', ['end', 'call']);

    session = new _libDelveSession2['default'](delveProcess, connection, 'test');
  });

  it('stops after timeout if detach takes too long', function () {
    // GIVEN: the request to delve to detach the current running debug session does not finish within a timeout
    var calledDetach = false;
    connection.call.andCallFake(function (method, args, callback) {
      calledDetach = true;
      expect(method).toEqual('RPCServer.Detach');
      // do not call the callback
    });

    // WHEN: I stop the delve session
    var stoppingPromise = session.stop();

    advanceClock(1001); // trigger the timeout

    waitsForPromise(function () {
      return stoppingPromise;
    });

    // THEN: I expect a default timeout to kick in that ends the connection and kills the delve process
    runs(function () {
      expect(connection.end).toHaveBeenCalled();
      expect(delveProcess.kill).toHaveBeenCalled();
      expect(calledDetach).toBeTruthy();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL3NwZWMvZGVsdmUtc2Vzc2lvbi1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7K0JBR3lCLHNCQUFzQjs7OztBQUgvQyxXQUFXLENBQUE7O0FBS1gsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFNO0FBQ2pCLE1BQUksWUFBWSxZQUFBO01BQUUsVUFBVSxZQUFBLENBQUE7QUFDNUIsTUFBSSxPQUFPLFlBQUEsQ0FBQTs7QUFFWCxZQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQ3hELGNBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBOztBQUVoRSxXQUFPLEdBQUcsaUNBQWlCLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7R0FDN0QsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxZQUFNOztBQUV2RCxRQUFJLFlBQVksR0FBRyxLQUFLLENBQUE7QUFDeEIsY0FBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBSztBQUN0RCxrQkFBWSxHQUFHLElBQUksQ0FBQTtBQUNuQixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7O0tBRTNDLENBQUMsQ0FBQTs7O0FBR0YsUUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBOztBQUV0QyxnQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVsQixtQkFBZSxDQUFDO2FBQU0sZUFBZTtLQUFBLENBQUMsQ0FBQTs7O0FBR3RDLFFBQUksQ0FBQyxZQUFNO0FBQ1QsWUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0FBQ3pDLFlBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtBQUM1QyxZQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL3NwZWMvZGVsdmUtc2Vzc2lvbi1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgRGVsdmVTZXNzaW9uIGZyb20gJy4uL2xpYi9kZWx2ZS1zZXNzaW9uJ1xuXG5kZXNjcmliZSgnJywgKCkgPT4ge1xuICBsZXQgZGVsdmVQcm9jZXNzLCBjb25uZWN0aW9uXG4gIGxldCBzZXNzaW9uXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZGVsdmVQcm9jZXNzID0gamFzbWluZS5jcmVhdGVTcHlPYmooJ3Byb2Nlc3MnLCBbJ2tpbGwnXSlcbiAgICBjb25uZWN0aW9uID0gamFzbWluZS5jcmVhdGVTcHlPYmooJ2Nvbm5lY3Rpb24nLCBbJ2VuZCcsICdjYWxsJ10pXG5cbiAgICBzZXNzaW9uID0gbmV3IERlbHZlU2Vzc2lvbihkZWx2ZVByb2Nlc3MsIGNvbm5lY3Rpb24sICd0ZXN0JylcbiAgfSlcblxuICBpdCgnc3RvcHMgYWZ0ZXIgdGltZW91dCBpZiBkZXRhY2ggdGFrZXMgdG9vIGxvbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU46IHRoZSByZXF1ZXN0IHRvIGRlbHZlIHRvIGRldGFjaCB0aGUgY3VycmVudCBydW5uaW5nIGRlYnVnIHNlc3Npb24gZG9lcyBub3QgZmluaXNoIHdpdGhpbiBhIHRpbWVvdXRcbiAgICBsZXQgY2FsbGVkRGV0YWNoID0gZmFsc2VcbiAgICBjb25uZWN0aW9uLmNhbGwuYW5kQ2FsbEZha2UoKG1ldGhvZCwgYXJncywgY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxlZERldGFjaCA9IHRydWVcbiAgICAgIGV4cGVjdChtZXRob2QpLnRvRXF1YWwoJ1JQQ1NlcnZlci5EZXRhY2gnKVxuICAgICAgLy8gZG8gbm90IGNhbGwgdGhlIGNhbGxiYWNrXG4gICAgfSlcblxuICAgIC8vIFdIRU46IEkgc3RvcCB0aGUgZGVsdmUgc2Vzc2lvblxuICAgIGNvbnN0IHN0b3BwaW5nUHJvbWlzZSA9IHNlc3Npb24uc3RvcCgpXG5cbiAgICBhZHZhbmNlQ2xvY2soMTAwMSkgLy8gdHJpZ2dlciB0aGUgdGltZW91dFxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHN0b3BwaW5nUHJvbWlzZSlcblxuICAgIC8vIFRIRU46IEkgZXhwZWN0IGEgZGVmYXVsdCB0aW1lb3V0IHRvIGtpY2sgaW4gdGhhdCBlbmRzIHRoZSBjb25uZWN0aW9uIGFuZCBraWxscyB0aGUgZGVsdmUgcHJvY2Vzc1xuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgZXhwZWN0KGNvbm5lY3Rpb24uZW5kKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChkZWx2ZVByb2Nlc3Mua2lsbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoY2FsbGVkRGV0YWNoKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==