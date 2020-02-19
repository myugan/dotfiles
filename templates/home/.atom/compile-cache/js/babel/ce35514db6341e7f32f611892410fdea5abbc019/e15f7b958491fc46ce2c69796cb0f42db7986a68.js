function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libBuildBuilder = require('../../lib/build/builder');

var _libConfigService = require('../../lib/config/service');

var _specHelpers = require('./../spec-helpers');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';describe('builder', function () {
  var builder = null;
  var linter = undefined;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();

    // mock the Linter V1 Indie API
    linter = {
      deleteMessages: function deleteMessages() {},
      setMessages: function setMessages() {},
      dispose: function dispose() {}
    };
    var goconfig = new _libConfigService.ConfigService().provide();
    builder = new _libBuildBuilder.Builder(goconfig, linter, null);
  }));

  describe('test executable', function () {
    (0, _asyncSpecHelpers.it)('provides a standard set of flags for compilation', function () {
      ;['', '   '].forEach(function (setting) {
        var args = builder.testCompileArgs('output', setting);
        expect(args[0]).toEqual('test');
        expect(args).toContain('-c');
        expect(args).toContain('-o');
        expect(args).toContain('.');
        expect(args.includes('output')).toEqual(true);
      });
    });

    (0, _asyncSpecHelpers.it)('includes additional args', function () {
      var args = builder.testCompileArgs('output', '-foo -bar 5');
      expect(args[0]).toEqual('test');
      expect(args).toContain('-c');
      expect(args).toContain('-o');
      expect(args.includes('output')).toEqual(true);
      expect(args).toContain('.');
      expect(args).toContain('-foo');
      expect(args).toContain('-bar');
      expect(args).toContain('5');
    });

    (0, _asyncSpecHelpers.it)('puts additional args before the package path', function () {
      var args = builder.testCompileArgs('output', '-foo');
      var dot = args.indexOf('.');
      var foo = args.indexOf('-foo');
      expect(dot).not.toEqual(-1);
      expect(foo).not.toEqual(-1);
      expect(foo).toBeLessThan(dot);
    });

    (0, _asyncSpecHelpers.it)('does not duplicate args', function () {
      var args = builder.testCompileArgs('output', '-c');
      expect(args.filter(function (x) {
        return x === '-c';
      }).length).toEqual(1);
    });

    (0, _asyncSpecHelpers.it)('does not allow overriding the output file', function () {
      var args = builder.testCompileArgs('output', '-o /root/dont_write_here');
      var i = args.indexOf('-o');
      expect(i).not.toEqual(-1);
      expect(args[i + 1]).not.toEqual('/root/dont_write_here');
    });
  });

  describe('build command', function () {
    (0, _asyncSpecHelpers.it)('runs go build for code outside gopath', function () {
      ;[{
        gopath: 'C:\\Users\\jsmith\\go',
        cwd: 'C:\\projects\\go\\test',
        sep: '\\'
      }, {
        gopath: '/home/jsmith/go',
        cwd: '/home/jsmith/go',
        sep: '/'
      }, {
        gopath: '/home/jsmith/go',
        cwd: '/home/jsmith/code/',
        sep: '/'
      }, {
        gopath: '/Users/jsmith/go',
        cwd: '/Users/jsmith/documents',
        sep: '/'
      }].forEach(function (_ref) {
        var gopath = _ref.gopath;
        var cwd = _ref.cwd;
        var sep = _ref.sep;

        expect(builder.buildCommand(gopath, cwd, sep)).toBe('build', cwd);
      });
    });

    (0, _asyncSpecHelpers.it)('runs go install for code in gopath', function () {
      ;[{
        gopath: 'C:\\Users\\jsmith\\go',
        cwd: 'C:\\Users\\jsmith\\go\\src\\github.com\\foo',
        sep: '\\'
      }, {
        gopath: '/home/jsmith/go',
        cwd: '/home/jsmith/go/src/bar',
        sep: '/'
      }, {
        gopath: '/Users/jsmith/go',
        cwd: '/Users/jsmith/go/src/github.com/foo/bar',
        sep: '/'
      }, {
        gopath: '/Users/jsmith/go/',
        cwd: '/Users/jsmith/go/src/github.com/foo/bar',
        sep: '/'
      }].forEach(function (_ref2) {
        var gopath = _ref2.gopath;
        var cwd = _ref2.cwd;
        var sep = _ref2.sep;

        expect(builder.buildCommand(gopath, cwd, sep)).toBe('install', cwd);
      });
    });
  });

  describe('getMessages', function () {
    (0, _asyncSpecHelpers.it)('ignores duplicate errors', function () {
      // GIVEN the same results from both 'go install' and 'go test'
      var outputs = [{
        output: '# github.com/anonymous/sample-project\n.\\the-file.go:12: syntax error: unexpected semicolon or newline, expecting comma or }',
        linterName: 'build'
      }, {
        output: '# github.com/anonymous/sample-project\n.\\the-file.go:12: syntax error: unexpected semicolon or newline, expecting comma or }',
        linterName: 'test'
      }];

      // WHEN I get the messages for these outputs
      var messages = builder.getMessages(outputs, _path2['default'].join('src', 'github.com', 'anonymous', 'sample-project'));

      // THEN I expect only one message to be returned because they are the same
      expect(messages.length).toEqual(1);

      var message = messages[0];
      expect(message.name).toEqual('build');
      expect(message.excerpt.indexOf('syntax error: unexpected semicolon or newline, expecting comma or }') === 0).toBeTruthy();
      expect(message.location.file.indexOf('the-file.go') > 0).toBeTruthy(); // file is in the path
      expect(message.location.file.indexOf('sample-project') > 0).toBeTruthy(); // cwd is in the path
      expect(message.location.position.start.row).toEqual(11);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9idWlsZC9idWlsZGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUdpQixNQUFNOzs7OytCQUNDLHlCQUF5Qjs7Z0NBQ25CLDBCQUEwQjs7MkJBQzlCLG1CQUFtQjs7Z0NBQ0csdUJBQXVCOzs7O0FBUHZFLFdBQVcsQ0FBQSxBQVNYLFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBTTtBQUN4QixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbEIsTUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVixzREFBVyxhQUFZO0FBQ3JCLDJCQUFVLEtBQUssRUFBRSxDQUFBOzs7QUFHakIsVUFBTSxHQUFHO0FBQ1Asb0JBQWMsRUFBRSwwQkFBTSxFQUFFO0FBQ3hCLGlCQUFXLEVBQUUsdUJBQU0sRUFBRTtBQUNyQixhQUFPLEVBQUUsbUJBQU0sRUFBRTtLQUNsQixDQUFBO0FBQ0QsUUFBTSxRQUFRLEdBQUcscUNBQW1CLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDOUMsV0FBTyxHQUFHLDZCQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7R0FDOUMsRUFBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ2hDLDhCQUFHLGtEQUFrRCxFQUFFLFlBQU07QUFDM0QsT0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDOUIsWUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdkQsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMvQixjQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVCLGNB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QUFBO0FBQ3JDLFlBQU0sQ0FDSixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDckIscUVBQXFFLENBQ3RFLEtBQUssQ0FBQyxDQUNSLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDZCxZQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ3JFLFlBQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUN4RSxZQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUN4RCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2J1aWxkL2J1aWxkZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IEJ1aWxkZXIgfSBmcm9tICcuLi8uLi9saWIvYnVpbGQvYnVpbGRlcidcbmltcG9ydCB7IENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9saWIvY29uZmlnL3NlcnZpY2UnXG5pbXBvcnQgeyBsaWZlY3ljbGUgfSBmcm9tICcuLy4uL3NwZWMtaGVscGVycydcbmltcG9ydCB7IGl0LCBmaXQsIGZmaXQsIGJlZm9yZUVhY2gsIHJ1bnMgfSBmcm9tICcuLi9hc3luYy1zcGVjLWhlbHBlcnMnIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuZGVzY3JpYmUoJ2J1aWxkZXInLCAoKSA9PiB7XG4gIGxldCBidWlsZGVyID0gbnVsbFxuICBsZXQgbGludGVyXG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgbGlmZWN5Y2xlLnNldHVwKClcblxuICAgIC8vIG1vY2sgdGhlIExpbnRlciBWMSBJbmRpZSBBUElcbiAgICBsaW50ZXIgPSB7XG4gICAgICBkZWxldGVNZXNzYWdlczogKCkgPT4ge30sXG4gICAgICBzZXRNZXNzYWdlczogKCkgPT4ge30sXG4gICAgICBkaXNwb3NlOiAoKSA9PiB7fVxuICAgIH1cbiAgICBjb25zdCBnb2NvbmZpZyA9IG5ldyBDb25maWdTZXJ2aWNlKCkucHJvdmlkZSgpXG4gICAgYnVpbGRlciA9IG5ldyBCdWlsZGVyKGdvY29uZmlnLCBsaW50ZXIsIG51bGwpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3Rlc3QgZXhlY3V0YWJsZScsICgpID0+IHtcbiAgICBpdCgncHJvdmlkZXMgYSBzdGFuZGFyZCBzZXQgb2YgZmxhZ3MgZm9yIGNvbXBpbGF0aW9uJywgKCkgPT4ge1xuICAgICAgO1snJywgJyAgICddLmZvckVhY2goc2V0dGluZyA9PiB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLnRlc3RDb21waWxlQXJncygnb3V0cHV0Jywgc2V0dGluZylcbiAgICAgICAgZXhwZWN0KGFyZ3NbMF0pLnRvRXF1YWwoJ3Rlc3QnKVxuICAgICAgICBleHBlY3QoYXJncykudG9Db250YWluKCctYycpXG4gICAgICAgIGV4cGVjdChhcmdzKS50b0NvbnRhaW4oJy1vJylcbiAgICAgICAgZXhwZWN0KGFyZ3MpLnRvQ29udGFpbignLicpXG4gICAgICAgIGV4cGVjdChhcmdzLmluY2x1ZGVzKCdvdXRwdXQnKSkudG9FcXVhbCh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2luY2x1ZGVzIGFkZGl0aW9uYWwgYXJncycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLnRlc3RDb21waWxlQXJncygnb3V0cHV0JywgJy1mb28gLWJhciA1JylcbiAgICAgIGV4cGVjdChhcmdzWzBdKS50b0VxdWFsKCd0ZXN0JylcbiAgICAgIGV4cGVjdChhcmdzKS50b0NvbnRhaW4oJy1jJylcbiAgICAgIGV4cGVjdChhcmdzKS50b0NvbnRhaW4oJy1vJylcbiAgICAgIGV4cGVjdChhcmdzLmluY2x1ZGVzKCdvdXRwdXQnKSkudG9FcXVhbCh0cnVlKVxuICAgICAgZXhwZWN0KGFyZ3MpLnRvQ29udGFpbignLicpXG4gICAgICBleHBlY3QoYXJncykudG9Db250YWluKCctZm9vJylcbiAgICAgIGV4cGVjdChhcmdzKS50b0NvbnRhaW4oJy1iYXInKVxuICAgICAgZXhwZWN0KGFyZ3MpLnRvQ29udGFpbignNScpXG4gICAgfSlcblxuICAgIGl0KCdwdXRzIGFkZGl0aW9uYWwgYXJncyBiZWZvcmUgdGhlIHBhY2thZ2UgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLnRlc3RDb21waWxlQXJncygnb3V0cHV0JywgJy1mb28nKVxuICAgICAgY29uc3QgZG90ID0gYXJncy5pbmRleE9mKCcuJylcbiAgICAgIGNvbnN0IGZvbyA9IGFyZ3MuaW5kZXhPZignLWZvbycpXG4gICAgICBleHBlY3QoZG90KS5ub3QudG9FcXVhbCgtMSlcbiAgICAgIGV4cGVjdChmb28pLm5vdC50b0VxdWFsKC0xKVxuICAgICAgZXhwZWN0KGZvbykudG9CZUxlc3NUaGFuKGRvdClcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IGR1cGxpY2F0ZSBhcmdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXJncyA9IGJ1aWxkZXIudGVzdENvbXBpbGVBcmdzKCdvdXRwdXQnLCAnLWMnKVxuICAgICAgZXhwZWN0KGFyZ3MuZmlsdGVyKHggPT4geCA9PT0gJy1jJykubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgfSlcblxuICAgIGl0KCdkb2VzIG5vdCBhbGxvdyBvdmVycmlkaW5nIHRoZSBvdXRwdXQgZmlsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLnRlc3RDb21waWxlQXJncygnb3V0cHV0JywgJy1vIC9yb290L2RvbnRfd3JpdGVfaGVyZScpXG4gICAgICBjb25zdCBpID0gYXJncy5pbmRleE9mKCctbycpXG4gICAgICBleHBlY3QoaSkubm90LnRvRXF1YWwoLTEpXG4gICAgICBleHBlY3QoYXJnc1tpICsgMV0pLm5vdC50b0VxdWFsKCcvcm9vdC9kb250X3dyaXRlX2hlcmUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2J1aWxkIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgaXQoJ3J1bnMgZ28gYnVpbGQgZm9yIGNvZGUgb3V0c2lkZSBnb3BhdGgnLCAoKSA9PiB7XG4gICAgICA7W1xuICAgICAgICB7XG4gICAgICAgICAgZ29wYXRoOiAnQzpcXFxcVXNlcnNcXFxcanNtaXRoXFxcXGdvJyxcbiAgICAgICAgICBjd2Q6ICdDOlxcXFxwcm9qZWN0c1xcXFxnb1xcXFx0ZXN0JyxcbiAgICAgICAgICBzZXA6ICdcXFxcJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ29wYXRoOiAnL2hvbWUvanNtaXRoL2dvJyxcbiAgICAgICAgICBjd2Q6ICcvaG9tZS9qc21pdGgvZ28nLFxuICAgICAgICAgIHNlcDogJy8nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBnb3BhdGg6ICcvaG9tZS9qc21pdGgvZ28nLFxuICAgICAgICAgIGN3ZDogJy9ob21lL2pzbWl0aC9jb2RlLycsXG4gICAgICAgICAgc2VwOiAnLydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGdvcGF0aDogJy9Vc2Vycy9qc21pdGgvZ28nLFxuICAgICAgICAgIGN3ZDogJy9Vc2Vycy9qc21pdGgvZG9jdW1lbnRzJyxcbiAgICAgICAgICBzZXA6ICcvJ1xuICAgICAgICB9XG4gICAgICBdLmZvckVhY2goKHsgZ29wYXRoLCBjd2QsIHNlcCB9KSA9PiB7XG4gICAgICAgIGV4cGVjdChidWlsZGVyLmJ1aWxkQ29tbWFuZChnb3BhdGgsIGN3ZCwgc2VwKSkudG9CZSgnYnVpbGQnLCBjd2QpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgncnVucyBnbyBpbnN0YWxsIGZvciBjb2RlIGluIGdvcGF0aCcsICgpID0+IHtcbiAgICAgIDtbXG4gICAgICAgIHtcbiAgICAgICAgICBnb3BhdGg6ICdDOlxcXFxVc2Vyc1xcXFxqc21pdGhcXFxcZ28nLFxuICAgICAgICAgIGN3ZDogJ0M6XFxcXFVzZXJzXFxcXGpzbWl0aFxcXFxnb1xcXFxzcmNcXFxcZ2l0aHViLmNvbVxcXFxmb28nLFxuICAgICAgICAgIHNlcDogJ1xcXFwnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBnb3BhdGg6ICcvaG9tZS9qc21pdGgvZ28nLFxuICAgICAgICAgIGN3ZDogJy9ob21lL2pzbWl0aC9nby9zcmMvYmFyJyxcbiAgICAgICAgICBzZXA6ICcvJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ29wYXRoOiAnL1VzZXJzL2pzbWl0aC9nbycsXG4gICAgICAgICAgY3dkOiAnL1VzZXJzL2pzbWl0aC9nby9zcmMvZ2l0aHViLmNvbS9mb28vYmFyJyxcbiAgICAgICAgICBzZXA6ICcvJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ29wYXRoOiAnL1VzZXJzL2pzbWl0aC9nby8nLFxuICAgICAgICAgIGN3ZDogJy9Vc2Vycy9qc21pdGgvZ28vc3JjL2dpdGh1Yi5jb20vZm9vL2JhcicsXG4gICAgICAgICAgc2VwOiAnLydcbiAgICAgICAgfVxuICAgICAgXS5mb3JFYWNoKCh7IGdvcGF0aCwgY3dkLCBzZXAgfSkgPT4ge1xuICAgICAgICBleHBlY3QoYnVpbGRlci5idWlsZENvbW1hbmQoZ29wYXRoLCBjd2QsIHNlcCkpLnRvQmUoJ2luc3RhbGwnLCBjd2QpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldE1lc3NhZ2VzJywgKCkgPT4ge1xuICAgIGl0KCdpZ25vcmVzIGR1cGxpY2F0ZSBlcnJvcnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTiB0aGUgc2FtZSByZXN1bHRzIGZyb20gYm90aCAnZ28gaW5zdGFsbCcgYW5kICdnbyB0ZXN0J1xuICAgICAgbGV0IG91dHB1dHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBvdXRwdXQ6XG4gICAgICAgICAgICAnIyBnaXRodWIuY29tL2Fub255bW91cy9zYW1wbGUtcHJvamVjdFxcbi5cXFxcdGhlLWZpbGUuZ286MTI6IHN5bnRheCBlcnJvcjogdW5leHBlY3RlZCBzZW1pY29sb24gb3IgbmV3bGluZSwgZXhwZWN0aW5nIGNvbW1hIG9yIH0nLFxuICAgICAgICAgIGxpbnRlck5hbWU6ICdidWlsZCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG91dHB1dDpcbiAgICAgICAgICAgICcjIGdpdGh1Yi5jb20vYW5vbnltb3VzL3NhbXBsZS1wcm9qZWN0XFxuLlxcXFx0aGUtZmlsZS5nbzoxMjogc3ludGF4IGVycm9yOiB1bmV4cGVjdGVkIHNlbWljb2xvbiBvciBuZXdsaW5lLCBleHBlY3RpbmcgY29tbWEgb3IgfScsXG4gICAgICAgICAgbGludGVyTmFtZTogJ3Rlc3QnXG4gICAgICAgIH1cbiAgICAgIF1cblxuICAgICAgLy8gV0hFTiBJIGdldCB0aGUgbWVzc2FnZXMgZm9yIHRoZXNlIG91dHB1dHNcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYnVpbGRlci5nZXRNZXNzYWdlcyhcbiAgICAgICAgb3V0cHV0cyxcbiAgICAgICAgcGF0aC5qb2luKCdzcmMnLCAnZ2l0aHViLmNvbScsICdhbm9ueW1vdXMnLCAnc2FtcGxlLXByb2plY3QnKVxuICAgICAgKVxuXG4gICAgICAvLyBUSEVOIEkgZXhwZWN0IG9ubHkgb25lIG1lc3NhZ2UgdG8gYmUgcmV0dXJuZWQgYmVjYXVzZSB0aGV5IGFyZSB0aGUgc2FtZVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgICBjb25zdCBtZXNzYWdlID0gbWVzc2FnZXNbMF1cbiAgICAgIGV4cGVjdChtZXNzYWdlLm5hbWUpLnRvRXF1YWwoJ2J1aWxkJylcbiAgICAgIGV4cGVjdChcbiAgICAgICAgbWVzc2FnZS5leGNlcnB0LmluZGV4T2YoXG4gICAgICAgICAgJ3N5bnRheCBlcnJvcjogdW5leHBlY3RlZCBzZW1pY29sb24gb3IgbmV3bGluZSwgZXhwZWN0aW5nIGNvbW1hIG9yIH0nXG4gICAgICAgICkgPT09IDBcbiAgICAgICkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QobWVzc2FnZS5sb2NhdGlvbi5maWxlLmluZGV4T2YoJ3RoZS1maWxlLmdvJykgPiAwKS50b0JlVHJ1dGh5KCkgLy8gZmlsZSBpcyBpbiB0aGUgcGF0aFxuICAgICAgZXhwZWN0KG1lc3NhZ2UubG9jYXRpb24uZmlsZS5pbmRleE9mKCdzYW1wbGUtcHJvamVjdCcpID4gMCkudG9CZVRydXRoeSgpIC8vIGN3ZCBpcyBpbiB0aGUgcGF0aFxuICAgICAgZXhwZWN0KG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uc3RhcnQucm93KS50b0VxdWFsKDExKVxuICAgIH0pXG4gIH0pXG59KVxuIl19