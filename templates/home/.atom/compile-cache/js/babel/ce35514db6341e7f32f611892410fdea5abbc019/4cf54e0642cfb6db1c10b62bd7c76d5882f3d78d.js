function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _libUtils = require('./../../lib/utils');

var _specHelpers = require('./../spec-helpers');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';describe('gorename', function () {
  var gorename = null;
  var editor = null;
  var gopath = null;
  var source = null;
  var target = null;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();
    gopath = _fsExtra2['default'].realpathSync(_specHelpers.lifecycle.temp.mkdirSync('gopath-'));
    process.env.GOPATH = gopath;
    yield _specHelpers.lifecycle.activatePackage();
    var mainModule = _specHelpers.lifecycle.mainModule;

    mainModule.provideGoConfig();
    mainModule.provideGoGet();
    gorename = mainModule.loadGorename();
  }));

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  describe('when a simple file is open', function () {
    (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
      source = _path2['default'].join(__dirname, '..', 'fixtures', 'gorename');
      target = _path2['default'].join(gopath, 'src', 'basic');
      _fsExtra2['default'].copySync(source, target);
      editor = yield atom.workspace.open(_path2['default'].join(target, 'main.go'));
    }));

    (0, _asyncSpecHelpers.it)('renames a single token', _asyncToGenerator(function* () {
      editor.setCursorBufferPosition([4, 5]);
      var info = (0, _libUtils.wordAndOffset)(editor);
      expect(info.word).toBe('foo');
      expect(info.offset).toBe(33);

      var file = editor.getBuffer().getPath();
      var cwd = _path2['default'].dirname(file);

      var cmd = yield _specHelpers.lifecycle.mainModule.provideGoConfig().locator.findTool('gorename');
      expect(cmd).toBeTruthy();

      var result = yield gorename.runGorename(file, info.offset, cwd, 'bar', cmd);
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
      expect(result.result.stdout.trim()).toBe('Renamed 2 occurrences in 1 file in 1 package.');

      editor.destroy();
      editor = yield atom.workspace.open(_path2['default'].join(target, 'main.go'));

      var expected = _fsExtra2['default'].readFileSync(_path2['default'].join(__dirname, '..', 'fixtures', 'gorename', 'expected'), 'utf8');
      var actual = editor.getText();
      expect(actual).toBe(expected);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9yZW5hbWUvZ29yZW5hbWUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBR2lCLE1BQU07Ozs7dUJBQ1IsVUFBVTs7Ozt3QkFDSyxtQkFBbUI7OzJCQUN2QixtQkFBbUI7O2dDQUNHLHVCQUF1Qjs7OztBQVB2RSxXQUFXLENBQUEsQUFTWCxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQU07QUFDekIsTUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ25CLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDakIsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQTs7QUFFakIsc0RBQVcsYUFBWTtBQUNyQiwyQkFBVSxLQUFLLEVBQUUsQ0FBQTtBQUNqQixVQUFNLEdBQUcscUJBQUcsWUFBWSxDQUFDLHVCQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUM3RCxXQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDM0IsVUFBTSx1QkFBVSxlQUFlLEVBQUUsQ0FBQTtRQUN6QixVQUFVLDBCQUFWLFVBQVU7O0FBQ2xCLGNBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUM1QixjQUFVLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDekIsWUFBUSxHQUFHLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtHQUNyQyxFQUFDLENBQUE7O0FBRUYsV0FBUyxDQUFDLFlBQU07QUFDZCwyQkFBVSxRQUFRLEVBQUUsQ0FBQTtHQUNyQixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLDRCQUE0QixFQUFFLFlBQU07QUFDM0Msd0RBQVcsYUFBWTtBQUNyQixZQUFNLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzNELFlBQU0sR0FBRyxrQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMxQywyQkFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQzNCLFlBQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtLQUNqRSxFQUFDLENBQUE7O0FBRUYsOEJBQUcsd0JBQXdCLG9CQUFFLGFBQVk7QUFDdkMsWUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEMsVUFBTSxJQUFJLEdBQUcsNkJBQWMsTUFBTSxDQUFDLENBQUE7QUFDbEMsWUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDN0IsWUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7O0FBRTVCLFVBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN6QyxVQUFNLEdBQUcsR0FBRyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRTlCLFVBQU0sR0FBRyxHQUFHLE1BQU0sdUJBQVUsVUFBVSxDQUNuQyxlQUFlLEVBQUUsQ0FDakIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUMvQixZQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7O0FBRXhCLFVBQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FDdkMsSUFBSSxFQUNKLElBQUksQ0FBQyxNQUFNLEVBQ1gsR0FBRyxFQUNILEtBQUssRUFDTCxHQUFHLENBQ0osQ0FBQTtBQUNELFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMzQixZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxZQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQ3RDLCtDQUErQyxDQUNoRCxDQUFBOztBQUVELFlBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNoQixZQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7O0FBRWhFLFVBQU0sUUFBUSxHQUFHLHFCQUFHLFlBQVksQ0FDOUIsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFDOUQsTUFBTSxDQUNQLENBQUE7QUFDRCxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDL0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUM5QixFQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL3JlbmFtZS9nb3JlbmFtZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xuaW1wb3J0IHsgd29yZEFuZE9mZnNldCB9IGZyb20gJy4vLi4vLi4vbGliL3V0aWxzJ1xuaW1wb3J0IHsgbGlmZWN5Y2xlIH0gZnJvbSAnLi8uLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgeyBpdCwgZml0LCBmZml0LCBiZWZvcmVFYWNoLCBydW5zIH0gZnJvbSAnLi4vYXN5bmMtc3BlYy1oZWxwZXJzJyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbmRlc2NyaWJlKCdnb3JlbmFtZScsICgpID0+IHtcbiAgbGV0IGdvcmVuYW1lID0gbnVsbFxuICBsZXQgZWRpdG9yID0gbnVsbFxuICBsZXQgZ29wYXRoID0gbnVsbFxuICBsZXQgc291cmNlID0gbnVsbFxuICBsZXQgdGFyZ2V0ID0gbnVsbFxuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGxpZmVjeWNsZS5zZXR1cCgpXG4gICAgZ29wYXRoID0gZnMucmVhbHBhdGhTeW5jKGxpZmVjeWNsZS50ZW1wLm1rZGlyU3luYygnZ29wYXRoLScpKVxuICAgIHByb2Nlc3MuZW52LkdPUEFUSCA9IGdvcGF0aFxuICAgIGF3YWl0IGxpZmVjeWNsZS5hY3RpdmF0ZVBhY2thZ2UoKVxuICAgIGNvbnN0IHsgbWFpbk1vZHVsZSB9ID0gbGlmZWN5Y2xlXG4gICAgbWFpbk1vZHVsZS5wcm92aWRlR29Db25maWcoKVxuICAgIG1haW5Nb2R1bGUucHJvdmlkZUdvR2V0KClcbiAgICBnb3JlbmFtZSA9IG1haW5Nb2R1bGUubG9hZEdvcmVuYW1lKClcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGxpZmVjeWNsZS50ZWFyZG93bigpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYSBzaW1wbGUgZmlsZSBpcyBvcGVuJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgc291cmNlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2ZpeHR1cmVzJywgJ2dvcmVuYW1lJylcbiAgICAgIHRhcmdldCA9IHBhdGguam9pbihnb3BhdGgsICdzcmMnLCAnYmFzaWMnKVxuICAgICAgZnMuY29weVN5bmMoc291cmNlLCB0YXJnZXQpXG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbih0YXJnZXQsICdtYWluLmdvJykpXG4gICAgfSlcblxuICAgIGl0KCdyZW5hbWVzIGEgc2luZ2xlIHRva2VuJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs0LCA1XSlcbiAgICAgIGNvbnN0IGluZm8gPSB3b3JkQW5kT2Zmc2V0KGVkaXRvcilcbiAgICAgIGV4cGVjdChpbmZvLndvcmQpLnRvQmUoJ2ZvbycpXG4gICAgICBleHBlY3QoaW5mby5vZmZzZXQpLnRvQmUoMzMpXG5cbiAgICAgIGNvbnN0IGZpbGUgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UGF0aCgpXG4gICAgICBjb25zdCBjd2QgPSBwYXRoLmRpcm5hbWUoZmlsZSlcblxuICAgICAgY29uc3QgY21kID0gYXdhaXQgbGlmZWN5Y2xlLm1haW5Nb2R1bGVcbiAgICAgICAgLnByb3ZpZGVHb0NvbmZpZygpXG4gICAgICAgIC5sb2NhdG9yLmZpbmRUb29sKCdnb3JlbmFtZScpXG4gICAgICBleHBlY3QoY21kKS50b0JlVHJ1dGh5KClcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ29yZW5hbWUucnVuR29yZW5hbWUoXG4gICAgICAgIGZpbGUsXG4gICAgICAgIGluZm8ub2Zmc2V0LFxuICAgICAgICBjd2QsXG4gICAgICAgICdiYXInLFxuICAgICAgICBjbWRcbiAgICAgIClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QocmVzdWx0LnJlc3VsdC5zdGRvdXQudHJpbSgpKS50b0JlKFxuICAgICAgICAnUmVuYW1lZCAyIG9jY3VycmVuY2VzIGluIDEgZmlsZSBpbiAxIHBhY2thZ2UuJ1xuICAgICAgKVxuXG4gICAgICBlZGl0b3IuZGVzdHJveSgpXG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbih0YXJnZXQsICdtYWluLmdvJykpXG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gZnMucmVhZEZpbGVTeW5jKFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnZml4dHVyZXMnLCAnZ29yZW5hbWUnLCAnZXhwZWN0ZWQnKSxcbiAgICAgICAgJ3V0ZjgnXG4gICAgICApXG4gICAgICBjb25zdCBhY3R1YWwgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBleHBlY3QoYWN0dWFsKS50b0JlKGV4cGVjdGVkKVxuICAgIH0pXG4gIH0pXG59KVxuIl19