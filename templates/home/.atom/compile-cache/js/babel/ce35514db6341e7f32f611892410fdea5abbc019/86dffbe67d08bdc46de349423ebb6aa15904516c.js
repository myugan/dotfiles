function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _specHelpers = require('./../spec-helpers');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';describe('go to definition', function () {
  var navigator = null;
  var gopath = null;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();
    gopath = _fsExtra2['default'].realpathSync(_specHelpers.lifecycle.temp.mkdirSync('gopath-'));
    process.env.GOPATH = gopath;
    yield _specHelpers.lifecycle.activatePackage();
    var mainModule = _specHelpers.lifecycle.mainModule;

    mainModule.provideGoConfig();
    mainModule.provideGoGet();
    navigator = mainModule.loadNavigator();
  }));

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  describe('when invoked on a valid project file', function () {
    var sourceDir = undefined;
    var targetDir = undefined;
    var editor = undefined;

    (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
      sourceDir = _path2['default'].join(__dirname, '..', 'fixtures', 'navigator');
      targetDir = _path2['default'].join(gopath, 'src', 'godeftest');
      _fsExtra2['default'].copySync(sourceDir, targetDir);
      editor = yield atom.workspace.open(_path2['default'].join(targetDir, 'foo.go'));
    }));

    describe('when using the godef navigator mode', function () {
      (0, _asyncSpecHelpers.beforeEach)(function () {
        atom.config.set('go-plus.navigator.mode', 'godef');
      });

      (0, _asyncSpecHelpers.it)('navigates to the correct location', _asyncToGenerator(function* () {
        editor.setCursorBufferPosition([3, 17]);
        yield navigator.gotoDefinitionForWordAtCursor();
        var activeEditor = atom.workspace.getActiveTextEditor();
        expect(activeEditor.getTitle()).toBe('bar.go');

        var pos = activeEditor.getCursorBufferPosition();
        expect(pos.row).toBe(2);
        expect(pos.column).toBe(5);
        expect(navigator.navigationStack.isEmpty()).toBe(false);
      }));
    });

    describe('when using the guru navigator mode', function () {
      (0, _asyncSpecHelpers.beforeEach)(function () {
        atom.config.set('go-plus.navigator.mode', 'guru');
      });

      (0, _asyncSpecHelpers.it)('navigates to the correct location', _asyncToGenerator(function* () {
        editor.setCursorBufferPosition([3, 17]); // at the beginning of -> `Bar()`
        yield navigator.gotoDefinitionForWordAtCursor();
        var activeEditor = atom.workspace.getActiveTextEditor();
        expect(activeEditor.getTitle()).toBe('bar.go');
        var pos = activeEditor.getCursorBufferPosition();
        expect(pos.row).toBe(2);
        expect(pos.column).toBe(5);
        expect(navigator.navigationStack.isEmpty()).toBe(false);
      }));

      (0, _asyncSpecHelpers.it)('navigates to the correct location if at the end of a word', _asyncToGenerator(function* () {
        editor.setCursorBufferPosition([3, 20]); // at the end of `Bar()` <-
        yield navigator.gotoDefinitionForWordAtCursor();

        var activeEditor = atom.workspace.getActiveTextEditor();
        expect(activeEditor.getTitle()).toBe('bar.go');

        var pos = activeEditor.getCursorBufferPosition();
        expect(pos.row).toBe(2);
        expect(pos.column).toBe(5);

        expect(navigator.navigationStack.isEmpty()).toBe(false);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9uYXZpZ2F0b3IvbmF2aWdhdG9yLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUdpQixNQUFNOzs7O3VCQUNSLFVBQVU7Ozs7MkJBQ0MsbUJBQW1COztnQ0FDRyx1QkFBdUI7Ozs7QUFOdkUsV0FBVyxDQUFBLEFBUVgsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakMsTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQTs7QUFFakIsc0RBQVcsYUFBWTtBQUNyQiwyQkFBVSxLQUFLLEVBQUUsQ0FBQTtBQUNqQixVQUFNLEdBQUcscUJBQUcsWUFBWSxDQUFDLHVCQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUM3RCxXQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDM0IsVUFBTSx1QkFBVSxlQUFlLEVBQUUsQ0FBQTtRQUN6QixVQUFVLDBCQUFWLFVBQVU7O0FBQ2xCLGNBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUM1QixjQUFVLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDekIsYUFBUyxHQUFHLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtHQUN2QyxFQUFDLENBQUE7O0FBRUYsV0FBUyxDQUFDLFlBQU07QUFDZCwyQkFBVSxRQUFRLEVBQUUsQ0FBQTtHQUNyQixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHNDQUFzQyxFQUFFLFlBQU07QUFDckQsUUFBSSxTQUFTLFlBQUEsQ0FBQTtBQUNiLFFBQUksU0FBUyxZQUFBLENBQUE7QUFDYixRQUFJLE1BQU0sWUFBQSxDQUFBOztBQUVWLHdEQUFXLGFBQVk7QUFDckIsZUFBUyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FB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LENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRTlDLFlBQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyx1QkFBdUIsRUFBRSxDQUFBO0FBQ2xELGNBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3ZCLGNBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUUxQixjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUN4RCxFQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL25hdmlnYXRvci9uYXZpZ2F0b3Itc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSdcbmltcG9ydCB7IGxpZmVjeWNsZSB9IGZyb20gJy4vLi4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IHsgaXQsIGZpdCwgZmZpdCwgYmVmb3JlRWFjaCwgcnVucyB9IGZyb20gJy4uL2FzeW5jLXNwZWMtaGVscGVycycgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG5kZXNjcmliZSgnZ28gdG8gZGVmaW5pdGlvbicsICgpID0+IHtcbiAgbGV0IG5hdmlnYXRvciA9IG51bGxcbiAgbGV0IGdvcGF0aCA9IG51bGxcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBsaWZlY3ljbGUuc2V0dXAoKVxuICAgIGdvcGF0aCA9IGZzLnJlYWxwYXRoU3luYyhsaWZlY3ljbGUudGVtcC5ta2RpclN5bmMoJ2dvcGF0aC0nKSlcbiAgICBwcm9jZXNzLmVudi5HT1BBVEggPSBnb3BhdGhcbiAgICBhd2FpdCBsaWZlY3ljbGUuYWN0aXZhdGVQYWNrYWdlKClcbiAgICBjb25zdCB7IG1haW5Nb2R1bGUgfSA9IGxpZmVjeWNsZVxuICAgIG1haW5Nb2R1bGUucHJvdmlkZUdvQ29uZmlnKClcbiAgICBtYWluTW9kdWxlLnByb3ZpZGVHb0dldCgpXG4gICAgbmF2aWdhdG9yID0gbWFpbk1vZHVsZS5sb2FkTmF2aWdhdG9yKClcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGxpZmVjeWNsZS50ZWFyZG93bigpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gaW52b2tlZCBvbiBhIHZhbGlkIHByb2plY3QgZmlsZScsICgpID0+IHtcbiAgICBsZXQgc291cmNlRGlyXG4gICAgbGV0IHRhcmdldERpclxuICAgIGxldCBlZGl0b3JcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgc291cmNlRGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2ZpeHR1cmVzJywgJ25hdmlnYXRvcicpXG4gICAgICB0YXJnZXREaXIgPSBwYXRoLmpvaW4oZ29wYXRoLCAnc3JjJywgJ2dvZGVmdGVzdCcpXG4gICAgICBmcy5jb3B5U3luYyhzb3VyY2VEaXIsIHRhcmdldERpcilcbiAgICAgIGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5qb2luKHRhcmdldERpciwgJ2Zvby5nbycpKVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiB1c2luZyB0aGUgZ29kZWYgbmF2aWdhdG9yIG1vZGUnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLm5hdmlnYXRvci5tb2RlJywgJ2dvZGVmJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCduYXZpZ2F0ZXMgdG8gdGhlIGNvcnJlY3QgbG9jYXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMywgMTddKVxuICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuZ290b0RlZmluaXRpb25Gb3JXb3JkQXRDdXJzb3IoKVxuICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZXhwZWN0KGFjdGl2ZUVkaXRvci5nZXRUaXRsZSgpKS50b0JlKCdiYXIuZ28nKVxuXG4gICAgICAgIGNvbnN0IHBvcyA9IGFjdGl2ZUVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgIGV4cGVjdChwb3Mucm93KS50b0JlKDIpXG4gICAgICAgIGV4cGVjdChwb3MuY29sdW1uKS50b0JlKDUpXG4gICAgICAgIGV4cGVjdChuYXZpZ2F0b3IubmF2aWdhdGlvblN0YWNrLmlzRW1wdHkoKSkudG9CZShmYWxzZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHVzaW5nIHRoZSBndXJ1IG5hdmlnYXRvciBtb2RlJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5uYXZpZ2F0b3IubW9kZScsICdndXJ1JylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCduYXZpZ2F0ZXMgdG8gdGhlIGNvcnJlY3QgbG9jYXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMywgMTddKSAvLyBhdCB0aGUgYmVnaW5uaW5nIG9mIC0+IGBCYXIoKWBcbiAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmdvdG9EZWZpbml0aW9uRm9yV29yZEF0Q3Vyc29yKClcbiAgICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGV4cGVjdChhY3RpdmVFZGl0b3IuZ2V0VGl0bGUoKSkudG9CZSgnYmFyLmdvJylcbiAgICAgICAgY29uc3QgcG9zID0gYWN0aXZlRWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgZXhwZWN0KHBvcy5yb3cpLnRvQmUoMilcbiAgICAgICAgZXhwZWN0KHBvcy5jb2x1bW4pLnRvQmUoNSlcbiAgICAgICAgZXhwZWN0KG5hdmlnYXRvci5uYXZpZ2F0aW9uU3RhY2suaXNFbXB0eSgpKS50b0JlKGZhbHNlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ25hdmlnYXRlcyB0byB0aGUgY29ycmVjdCBsb2NhdGlvbiBpZiBhdCB0aGUgZW5kIG9mIGEgd29yZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFszLCAyMF0pIC8vIGF0IHRoZSBlbmQgb2YgYEJhcigpYCA8LVxuICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuZ290b0RlZmluaXRpb25Gb3JXb3JkQXRDdXJzb3IoKVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBleHBlY3QoYWN0aXZlRWRpdG9yLmdldFRpdGxlKCkpLnRvQmUoJ2Jhci5nbycpXG5cbiAgICAgICAgY29uc3QgcG9zID0gYWN0aXZlRWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgZXhwZWN0KHBvcy5yb3cpLnRvQmUoMilcbiAgICAgICAgZXhwZWN0KHBvcy5jb2x1bW4pLnRvQmUoNSlcblxuICAgICAgICBleHBlY3QobmF2aWdhdG9yLm5hdmlnYXRpb25TdGFjay5pc0VtcHR5KCkpLnRvQmUoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19