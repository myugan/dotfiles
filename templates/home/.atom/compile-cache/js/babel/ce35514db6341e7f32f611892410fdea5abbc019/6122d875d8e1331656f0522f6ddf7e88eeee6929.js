function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _specHelpers = require('./../spec-helpers');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';describe('go-get', function () {
  var manager = null;
  var gopath = undefined;
  var platform = undefined;
  var arch = undefined;
  var executableSuffix = '';
  var pathkey = 'PATH';
  var go = undefined;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();
    gopath = _fsExtra2['default'].realpathSync(_specHelpers.lifecycle.temp.mkdirSync('gopath-'));
    var goroot = _fsExtra2['default'].realpathSync(_specHelpers.lifecycle.temp.mkdirSync('goroot-'));
    var gorootbin = _path2['default'].join(goroot, 'bin');
    _fsExtra2['default'].mkdirSync(gorootbin);
    platform = process.platform;
    if (process.arch === 'arm') {
      arch = 'arm';
    } else if (process.arch === 'ia32') {
      // Ugh, Atom is 32-bit on Windows... for now.
      if (platform === 'win32') {
        arch = 'amd64';
      } else {
        arch = '386';
      }
    } else {
      arch = 'amd64';
    }

    if (process.platform === 'win32') {
      platform = 'windows';
      executableSuffix = '.exe';
      pathkey = 'Path';
    }
    var fakeexecutable = 'go_' + platform + '_' + arch + executableSuffix;
    var configPath = _path2['default'].join(__dirname, '..', 'config');
    var fakego = _path2['default'].join(configPath, 'tools', 'go', fakeexecutable);
    go = _path2['default'].join(gorootbin, 'go' + executableSuffix);
    _fsExtra2['default'].copySync(fakego, go);
    process.env[pathkey] = gorootbin;
    process.env['GOPATH'] = gopath;
    process.env['GOROOT'] = goroot;

    yield _specHelpers.lifecycle.activatePackage();
    var mainModule = _specHelpers.lifecycle.mainModule;

    mainModule.provideGoGet();
    manager = mainModule.getservice.getmanager;
  }));

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  describe('manager', function () {
    var gocodebinary = undefined;
    var goimportsbinary = undefined;
    (0, _asyncSpecHelpers.beforeEach)(function () {
      _fsExtra2['default'].mkdirSync(_path2['default'].join(gopath, 'bin'));
      gocodebinary = _path2['default'].join(gopath, 'bin', 'gocode' + executableSuffix);
      _fsExtra2['default'].writeFileSync(gocodebinary, '', { encoding: 'utf8', mode: 511 });
      goimportsbinary = _path2['default'].join(gopath, 'bin', 'goimports' + executableSuffix);
      _fsExtra2['default'].writeFileSync(goimportsbinary, '', { encoding: 'utf8', mode: 511 });
    });

    (0, _asyncSpecHelpers.it)('updates packages', _asyncToGenerator(function* () {
      var stat = _fsExtra2['default'].statSync(gocodebinary);
      expect(stat.size).toBe(0);

      manager.register('github.com/mdempsky/gocode');
      manager.register('golang.org/x/tools/cmd/goimports');
      var outcome = yield manager.updateTools();
      expect(outcome.success).toEqual(true, 'outcome is ', outcome);
      expect(outcome.results.length).toBe(2);

      stat = _fsExtra2['default'].statSync(gocodebinary);
      expect(stat.size).toBeGreaterThan(0);
      stat = _fsExtra2['default'].statSync(goimportsbinary);
      expect(stat.size).toBeGreaterThan(0);
    }));

    (0, _asyncSpecHelpers.it)('calls the callback after updating packages, if provided', _asyncToGenerator(function* () {
      var callbackOutcome = undefined;
      var callbackCalled = undefined;
      var stat = _fsExtra2['default'].statSync(gocodebinary);
      expect(stat.size).toBe(0);
      manager.register('golang.org/x/tools/cmd/goimports', function (o) {
        callbackCalled = true;
        callbackOutcome = o;
      });
      var outcome = yield manager.updateTools();
      expect(callbackCalled).toBe(true);
      expect(outcome).toBeTruthy();
      expect(outcome.success).toBe(true);
      expect(outcome.results).toBeTruthy();
      expect(outcome.results.length).toBe(1);
      expect(outcome.results[0].pack).toBe('golang.org/x/tools/cmd/goimports');
      expect(callbackOutcome).toBe(outcome);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9nZXQvZ2V0LW1hbmFnZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7dUJBR2UsVUFBVTs7OztvQkFDUixNQUFNOzs7OzJCQUNHLG1CQUFtQjs7Z0NBQ0csdUJBQXVCOzs7O0FBTnZFLFdBQVcsQ0FBQSxBQVFYLFFBQVEsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN2QixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbEIsTUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLE1BQUksUUFBUSxZQUFBLENBQUE7QUFDWixNQUFJLElBQUksWUFBQSxDQUFBO0FBQ1IsTUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUE7QUFDekIsTUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLE1BQUksRUFBRSxZQUFBLENBQUE7O0FBRU4sc0RBQVcsYUFBWTtBQUNyQiwyQkFBVSxLQUFLLEVBQUUsQ0FBQTtBQUNqQixVQUFNLEdBQUcscUJBQUcsWUFBWSxDQUFDLHVCQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUM3RCxRQUFNLE1BQU0sR0FBRyxxQkFBRyxZQUFZLENBQUMsdUJBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ25FLFFBQU0sU0FBUyxHQUFHLGtCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDMUMseUJBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZCLFlBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFBO0FBQzNCLFFBQUksT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7QUFDMUIsVUFBSSxHQUFHLEtBQUssQ0FBQTtLQUNiLE1BQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTs7QUFFbEMsVUFBSSxRQUFRLEtBQUssT0FBTyxF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QUksQ0FBQyxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDcEMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RDLFlBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3hFLFlBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDdEMsRUFBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9nZXQvZ2V0LW1hbmFnZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGxpZmVjeWNsZSB9IGZyb20gJy4vLi4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IHsgaXQsIGZpdCwgZmZpdCwgYmVmb3JlRWFjaCwgcnVucyB9IGZyb20gJy4uL2FzeW5jLXNwZWMtaGVscGVycycgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG5kZXNjcmliZSgnZ28tZ2V0JywgKCkgPT4ge1xuICBsZXQgbWFuYWdlciA9IG51bGxcbiAgbGV0IGdvcGF0aFxuICBsZXQgcGxhdGZvcm1cbiAgbGV0IGFyY2hcbiAgbGV0IGV4ZWN1dGFibGVTdWZmaXggPSAnJ1xuICBsZXQgcGF0aGtleSA9ICdQQVRIJ1xuICBsZXQgZ29cblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBsaWZlY3ljbGUuc2V0dXAoKVxuICAgIGdvcGF0aCA9IGZzLnJlYWxwYXRoU3luYyhsaWZlY3ljbGUudGVtcC5ta2RpclN5bmMoJ2dvcGF0aC0nKSlcbiAgICBjb25zdCBnb3Jvb3QgPSBmcy5yZWFscGF0aFN5bmMobGlmZWN5Y2xlLnRlbXAubWtkaXJTeW5jKCdnb3Jvb3QtJykpXG4gICAgY29uc3QgZ29yb290YmluID0gcGF0aC5qb2luKGdvcm9vdCwgJ2JpbicpXG4gICAgZnMubWtkaXJTeW5jKGdvcm9vdGJpbilcbiAgICBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm1cbiAgICBpZiAocHJvY2Vzcy5hcmNoID09PSAnYXJtJykge1xuICAgICAgYXJjaCA9ICdhcm0nXG4gICAgfSBlbHNlIGlmIChwcm9jZXNzLmFyY2ggPT09ICdpYTMyJykge1xuICAgICAgLy8gVWdoLCBBdG9tIGlzIDMyLWJpdCBvbiBXaW5kb3dzLi4uIGZvciBub3cuXG4gICAgICBpZiAocGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgICAgYXJjaCA9ICdhbWQ2NCdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyY2ggPSAnMzg2J1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhcmNoID0gJ2FtZDY0J1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBwbGF0Zm9ybSA9ICd3aW5kb3dzJ1xuICAgICAgZXhlY3V0YWJsZVN1ZmZpeCA9ICcuZXhlJ1xuICAgICAgcGF0aGtleSA9ICdQYXRoJ1xuICAgIH1cbiAgICBjb25zdCBmYWtlZXhlY3V0YWJsZSA9ICdnb18nICsgcGxhdGZvcm0gKyAnXycgKyBhcmNoICsgZXhlY3V0YWJsZVN1ZmZpeFxuICAgIGNvbnN0IGNvbmZpZ1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnY29uZmlnJylcbiAgICBjb25zdCBmYWtlZ28gPSBwYXRoLmpvaW4oY29uZmlnUGF0aCwgJ3Rvb2xzJywgJ2dvJywgZmFrZWV4ZWN1dGFibGUpXG4gICAgZ28gPSBwYXRoLmpvaW4oZ29yb290YmluLCAnZ28nICsgZXhlY3V0YWJsZVN1ZmZpeClcbiAgICBmcy5jb3B5U3luYyhmYWtlZ28sIGdvKVxuICAgIHByb2Nlc3MuZW52W3BhdGhrZXldID0gZ29yb290YmluXG4gICAgcHJvY2Vzcy5lbnZbJ0dPUEFUSCddID0gZ29wYXRoXG4gICAgcHJvY2Vzcy5lbnZbJ0dPUk9PVCddID0gZ29yb290XG5cbiAgICBhd2FpdCBsaWZlY3ljbGUuYWN0aXZhdGVQYWNrYWdlKClcbiAgICBjb25zdCB7IG1haW5Nb2R1bGUgfSA9IGxpZmVjeWNsZVxuICAgIG1haW5Nb2R1bGUucHJvdmlkZUdvR2V0KClcbiAgICBtYW5hZ2VyID0gbWFpbk1vZHVsZS5nZXRzZXJ2aWNlLmdldG1hbmFnZXJcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGxpZmVjeWNsZS50ZWFyZG93bigpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ21hbmFnZXInLCAoKSA9PiB7XG4gICAgbGV0IGdvY29kZWJpbmFyeVxuICAgIGxldCBnb2ltcG9ydHNiaW5hcnlcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGZzLm1rZGlyU3luYyhwYXRoLmpvaW4oZ29wYXRoLCAnYmluJykpXG4gICAgICBnb2NvZGViaW5hcnkgPSBwYXRoLmpvaW4oZ29wYXRoLCAnYmluJywgJ2dvY29kZScgKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhnb2NvZGViaW5hcnksICcnLCB7IGVuY29kaW5nOiAndXRmOCcsIG1vZGU6IDUxMSB9KVxuICAgICAgZ29pbXBvcnRzYmluYXJ5ID0gcGF0aC5qb2luKGdvcGF0aCwgJ2JpbicsICdnb2ltcG9ydHMnICsgZXhlY3V0YWJsZVN1ZmZpeClcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZ29pbXBvcnRzYmluYXJ5LCAnJywgeyBlbmNvZGluZzogJ3V0ZjgnLCBtb2RlOiA1MTEgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3VwZGF0ZXMgcGFja2FnZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKGdvY29kZWJpbmFyeSlcbiAgICAgIGV4cGVjdChzdGF0LnNpemUpLnRvQmUoMClcblxuICAgICAgbWFuYWdlci5yZWdpc3RlcignZ2l0aHViLmNvbS9tZGVtcHNreS9nb2NvZGUnKVxuICAgICAgbWFuYWdlci5yZWdpc3RlcignZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHMnKVxuICAgICAgY29uc3Qgb3V0Y29tZSA9IGF3YWl0IG1hbmFnZXIudXBkYXRlVG9vbHMoKVxuICAgICAgZXhwZWN0KG91dGNvbWUuc3VjY2VzcykudG9FcXVhbCh0cnVlLCAnb3V0Y29tZSBpcyAnLCBvdXRjb21lKVxuICAgICAgZXhwZWN0KG91dGNvbWUucmVzdWx0cy5sZW5ndGgpLnRvQmUoMilcblxuICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKGdvY29kZWJpbmFyeSlcbiAgICAgIGV4cGVjdChzdGF0LnNpemUpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKGdvaW1wb3J0c2JpbmFyeSlcbiAgICAgIGV4cGVjdChzdGF0LnNpemUpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnY2FsbHMgdGhlIGNhbGxiYWNrIGFmdGVyIHVwZGF0aW5nIHBhY2thZ2VzLCBpZiBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBjYWxsYmFja091dGNvbWVcbiAgICAgIGxldCBjYWxsYmFja0NhbGxlZFxuICAgICAgbGV0IHN0YXQgPSBmcy5zdGF0U3luYyhnb2NvZGViaW5hcnkpXG4gICAgICBleHBlY3Qoc3RhdC5zaXplKS50b0JlKDApXG4gICAgICBtYW5hZ2VyLnJlZ2lzdGVyKCdnb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvaW1wb3J0cycsIG8gPT4ge1xuICAgICAgICBjYWxsYmFja0NhbGxlZCA9IHRydWVcbiAgICAgICAgY2FsbGJhY2tPdXRjb21lID0gb1xuICAgICAgfSlcbiAgICAgIGxldCBvdXRjb21lID0gYXdhaXQgbWFuYWdlci51cGRhdGVUb29scygpXG4gICAgICBleHBlY3QoY2FsbGJhY2tDYWxsZWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChvdXRjb21lKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChvdXRjb21lLnN1Y2Nlc3MpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChvdXRjb21lLnJlc3VsdHMpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KG91dGNvbWUucmVzdWx0cy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChvdXRjb21lLnJlc3VsdHNbMF0ucGFjaykudG9CZSgnZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHMnKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrT3V0Y29tZSkudG9CZShvdXRjb21lKVxuICAgIH0pXG4gIH0pXG59KVxuIl19