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

'use babel';describe('Highlight Provider', function () {
  var highlight = undefined;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();
    yield _specHelpers.lifecycle.activatePackage();

    var mainModule = _specHelpers.lifecycle.mainModule;

    mainModule.provideGoConfig();
    highlight = mainModule.provideCodeHighlight();
  }));

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  (0, _asyncSpecHelpers.it)('monitors the config', function () {
    atom.config.set('go-plus.guru.highlightIdentifiers', false);
    expect(highlight.shouldDecorate).toBe(false);
    atom.config.set('go-plus.guru.highlightIdentifiers', true);
    expect(highlight.shouldDecorate).toBe(true);
    atom.config.set('go-plus.guru.highlightIdentifiers', false);
    expect(highlight.shouldDecorate).toBe(false);
  });

  describe('when run on a valid go file', function () {
    var editor = undefined;
    var gopath = null;
    var source = null;
    var target = null;

    (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
      gopath = _fsExtra2['default'].realpathSync(_specHelpers.lifecycle.temp.mkdirSync('gopath-'));
      process.env.GOPATH = gopath;

      source = _path2['default'].join(__dirname, '..', 'fixtures');
      target = _path2['default'].join(gopath, 'src', 'what');
      _fsExtra2['default'].copySync(source, target);

      atom.config.set('go-plus.guru.highlightIdentifiers', true);

      editor = yield atom.workspace.open(_path2['default'].join(target || '.', 'doc.go'));
    }));

    (0, _asyncSpecHelpers.it)('returns the appropriate ranges', _asyncToGenerator(function* () {
      editor.setCursorBufferPosition([22, 2]);

      var ranges = yield highlight.highlight(editor, editor.getCursorBufferPosition());
      expect(ranges.length).toEqual(3);
      expect(ranges[0].start.row).toEqual(22);
      expect(ranges[0].start.column).toEqual(1);
      expect(ranges[1].start.row).toEqual(23);
      expect(ranges[1].start.column).toEqual(38);
      expect(ranges[2].start.row).toEqual(24);
      expect(ranges[2].start.column).toEqual(1);

      ranges.forEach(function (r) {
        expect(editor.getTextInBufferRange(r)).toEqual('f');
      });
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9oaWdobGlnaHQvaGlnaGxpZ2h0LXByb3ZpZGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3VCQUdlLFVBQVU7Ozs7b0JBQ1IsTUFBTTs7OzsyQkFDRyxtQkFBbUI7O2dDQUNHLHVCQUF1Qjs7OztBQU52RSxXQUFXLENBQUEsQUFRWCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsWUFBTTtBQUNuQyxNQUFJLFNBQVMsWUFBQSxDQUFBOztBQUViLHNEQUFXLGFBQVk7QUFDckIsMkJBQVUsS0FBSyxFQUFFLENBQUE7QUFDakIsVUFBTSx1QkFBVSxlQUFlLEVBQUUsQ0FBQTs7UUFFekIsVUFBVSwwQkFBVixVQUFVOztBQUNsQixjQUFVLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDNUIsYUFBUyxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0dBQzlDLEVBQUMsQ0FBQTs7QUFFRixXQUFTLENBQUMsWUFBTTtBQUNkLDJCQUFVLFFBQVEsRUFBRSxDQUFBO0dBQ3JCLENBQUMsQ0FBQTs7QUFFRiw0QkFBRyxxQkFBcUIsRUFBRSxZQUFNO0FBQzlCLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNELFVBQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFELFVBQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzNDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNELFVBQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQzdDLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsNkJBQTZCLEVBQUUsWUFBTTtBQUM1QyxRQUFJLE1BQU0sWUFBQSxDQUFBO0FBQ1YsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7O0FBRWpCLHdEQUFXLGFBQVk7QUFDckIsWUFBTSxHQUFHLHFCQUFHLFlBQVksQ0FBQyx1QkFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDN0QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBOztBQUUzQixZQUFNLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDL0MsWUFBTSxHQUFHLGtCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3pDLDJCQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRTNCLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUUxRCxZQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBSyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0tBQ3ZFLEVBQUMsQ0FBQTs7QUFFRiw4QkFBRyxnQ0FBZ0Msb0JBQUUsYUFBWTtBQUMvQyxZQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdkMsVUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsU0FBUyxDQUN0QyxNQUFNLEVBQ04sTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQ2pDLENBQUE7QUFDRCxZQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDdkMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pDLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDMUMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFekMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUNsQixjQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO09BQ3BELENBQUMsQ0FBQTtLQUNILEVBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvaGlnaGxpZ2h0L2hpZ2hsaWdodC1wcm92aWRlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgbGlmZWN5Y2xlIH0gZnJvbSAnLi8uLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgeyBpdCwgZml0LCBmZml0LCBiZWZvcmVFYWNoLCBydW5zIH0gZnJvbSAnLi4vYXN5bmMtc3BlYy1oZWxwZXJzJyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbmRlc2NyaWJlKCdIaWdobGlnaHQgUHJvdmlkZXInLCAoKSA9PiB7XG4gIGxldCBoaWdobGlnaHRcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBsaWZlY3ljbGUuc2V0dXAoKVxuICAgIGF3YWl0IGxpZmVjeWNsZS5hY3RpdmF0ZVBhY2thZ2UoKVxuXG4gICAgY29uc3QgeyBtYWluTW9kdWxlIH0gPSBsaWZlY3ljbGVcbiAgICBtYWluTW9kdWxlLnByb3ZpZGVHb0NvbmZpZygpXG4gICAgaGlnaGxpZ2h0ID0gbWFpbk1vZHVsZS5wcm92aWRlQ29kZUhpZ2hsaWdodCgpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBsaWZlY3ljbGUudGVhcmRvd24oKVxuICB9KVxuXG4gIGl0KCdtb25pdG9ycyB0aGUgY29uZmlnJywgKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5ndXJ1LmhpZ2hsaWdodElkZW50aWZpZXJzJywgZmFsc2UpXG4gICAgZXhwZWN0KGhpZ2hsaWdodC5zaG91bGREZWNvcmF0ZSkudG9CZShmYWxzZSlcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMuZ3VydS5oaWdobGlnaHRJZGVudGlmaWVycycsIHRydWUpXG4gICAgZXhwZWN0KGhpZ2hsaWdodC5zaG91bGREZWNvcmF0ZSkudG9CZSh0cnVlKVxuICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5ndXJ1LmhpZ2hsaWdodElkZW50aWZpZXJzJywgZmFsc2UpXG4gICAgZXhwZWN0KGhpZ2hsaWdodC5zaG91bGREZWNvcmF0ZSkudG9CZShmYWxzZSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBydW4gb24gYSB2YWxpZCBnbyBmaWxlJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3JcbiAgICBsZXQgZ29wYXRoID0gbnVsbFxuICAgIGxldCBzb3VyY2UgPSBudWxsXG4gICAgbGV0IHRhcmdldCA9IG51bGxcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgZ29wYXRoID0gZnMucmVhbHBhdGhTeW5jKGxpZmVjeWNsZS50ZW1wLm1rZGlyU3luYygnZ29wYXRoLScpKVxuICAgICAgcHJvY2Vzcy5lbnYuR09QQVRIID0gZ29wYXRoXG5cbiAgICAgIHNvdXJjZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdmaXh0dXJlcycpXG4gICAgICB0YXJnZXQgPSBwYXRoLmpvaW4oZ29wYXRoLCAnc3JjJywgJ3doYXQnKVxuICAgICAgZnMuY29weVN5bmMoc291cmNlLCB0YXJnZXQpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5ndXJ1LmhpZ2hsaWdodElkZW50aWZpZXJzJywgdHJ1ZSlcblxuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLmpvaW4odGFyZ2V0IHx8ICcuJywgJ2RvYy5nbycpKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgcmFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyMiwgMl0pXG5cbiAgICAgIGNvbnN0IHJhbmdlcyA9IGF3YWl0IGhpZ2hsaWdodC5oaWdobGlnaHQoXG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIClcbiAgICAgIGV4cGVjdChyYW5nZXMubGVuZ3RoKS50b0VxdWFsKDMpXG4gICAgICBleHBlY3QocmFuZ2VzWzBdLnN0YXJ0LnJvdykudG9FcXVhbCgyMilcbiAgICAgIGV4cGVjdChyYW5nZXNbMF0uc3RhcnQuY29sdW1uKS50b0VxdWFsKDEpXG4gICAgICBleHBlY3QocmFuZ2VzWzFdLnN0YXJ0LnJvdykudG9FcXVhbCgyMylcbiAgICAgIGV4cGVjdChyYW5nZXNbMV0uc3RhcnQuY29sdW1uKS50b0VxdWFsKDM4KVxuICAgICAgZXhwZWN0KHJhbmdlc1syXS5zdGFydC5yb3cpLnRvRXF1YWwoMjQpXG4gICAgICBleHBlY3QocmFuZ2VzWzJdLnN0YXJ0LmNvbHVtbikudG9FcXVhbCgxKVxuXG4gICAgICByYW5nZXMuZm9yRWFjaChyID0+IHtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyKSkudG9FcXVhbCgnZicpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19