function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libConfigService = require('../../lib/config/service');

var _libFormatFormatter = require('../../lib/format/formatter');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';var nl = '\n';
var formattedText = 'package main' + nl + nl + 'func main() {' + nl + '}' + nl;

describe('formatter', function () {
  var formatter = null;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    yield atom.packages.activatePackage('language-go');
    atom.config.set('editor.defaultLineEnding', 'LF');
    atom.config.set('go-plus.test.runTestsOnSave', false);
    formatter = new _libFormatFormatter.Formatter(new _libConfigService.ConfigService().provide());
  }));

  afterEach(function () {
    formatter.dispose();
  });

  describe('when a simple file is opened', function () {
    var editor = undefined;

    (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
      var filePath = _path2['default'].join(__dirname, '..', 'fixtures', 'format', 'gofmt.go');
      editor = yield atom.workspace.open(filePath);
    }));

    describe('for each tool', function () {
      var _loop = function (tool) {
        (0, _asyncSpecHelpers.it)('formats on save using ' + tool, function () {
          (0, _asyncSpecHelpers.runs)(function () {
            atom.config.set('go-plus.format.tool', tool);
          });
          waitsFor(function () {
            return formatter.tool === tool;
          });
          (0, _asyncSpecHelpers.runs)(_asyncToGenerator(function* () {
            var result = yield formatter.formatEntireFile(editor, null);
            expect(result).toBeTruthy();
            expect(result.formatted).toEqual(formattedText);
          }));
        });
      };

      for (var tool of ['gofmt', 'goimports', 'goreturns']) {
        _loop(tool);
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9mb3JtYXQvZm9ybWF0dGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUdpQixNQUFNOzs7O2dDQUNPLDBCQUEwQjs7a0NBQzlCLDRCQUE0Qjs7Z0NBQ04sdUJBQXVCOzs7O0FBTnZFLFdBQVcsQ0FBQSxBQVFYLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQTtBQUNmLElBQU0sYUFBYSxHQUFHLGNBQWMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQWUsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQTs7QUFFaEYsUUFBUSxDQUFDLFdBQVcsRUFBRSxZQUFNO0FBQzFCLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQTs7QUFFcEIsc0RBQVcsYUFBWTtBQUNyQixVQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2xELFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pELFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3JELGFBQVMsR0FBRyxrQ0FBYyxxQ0FBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0dBQ3pELEVBQUMsQ0FBQTs7QUFFRixXQUFTLENBQUMsWUFBTTtBQUNkLGFBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUNwQixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDN0MsUUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVix3REFBVyxhQUFZO0FBQ3JCLFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FDeEIsU0FBUyxFQUNULElBQUksRUFDSixVQUFVLEVBQ1YsUUFBUSxFQUNSLFVBQVUsQ0FDWCxDQUFBO0FBQ0QsWUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDN0MsRUFBQyxDQUFBOztBQUVGLFlBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTs0QkFDbkIsSUFBSTtBQUNiLGtDQUFHLHdCQUF3QixHQUFHLElBQUksRUFBRSxZQUFNO0FBQ3hDLHNDQUFLLFlBQU07QUFDVCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUE7V0FDN0MsQ0FBQyxDQUFBO0FBQ0Ysa0JBQVEsQ0FBQyxZQUFNO0FBQ2IsbUJBQU8sU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUE7V0FDL0IsQ0FBQyxDQUFBO0FBQ0Ysd0RBQUssYUFBWTtBQUNmLGdCQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDN0Qsa0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMzQixrQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7V0FDaEQsRUFBQyxDQUFBO1NBQ0gsQ0FBQyxDQUFBOzs7QUFiSixXQUFLLElBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRTtjQUE3QyxJQUFJO09BY2Q7S0FDRixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2Zvcm1hdC9mb3JtYXR0ZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9saWIvY29uZmlnL3NlcnZpY2UnXG5pbXBvcnQgeyBGb3JtYXR0ZXIgfSBmcm9tICcuLi8uLi9saWIvZm9ybWF0L2Zvcm1hdHRlcidcbmltcG9ydCB7IGl0LCBmaXQsIGZmaXQsIGJlZm9yZUVhY2gsIHJ1bnMgfSBmcm9tICcuLi9hc3luYy1zcGVjLWhlbHBlcnMnIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuY29uc3QgbmwgPSAnXFxuJ1xuY29uc3QgZm9ybWF0dGVkVGV4dCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSB7JyArIG5sICsgJ30nICsgbmxcblxuZGVzY3JpYmUoJ2Zvcm1hdHRlcicsICgpID0+IHtcbiAgbGV0IGZvcm1hdHRlciA9IG51bGxcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtZ28nKVxuICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLmRlZmF1bHRMaW5lRW5kaW5nJywgJ0xGJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMudGVzdC5ydW5UZXN0c09uU2F2ZScsIGZhbHNlKVxuICAgIGZvcm1hdHRlciA9IG5ldyBGb3JtYXR0ZXIobmV3IENvbmZpZ1NlcnZpY2UoKS5wcm92aWRlKCkpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBmb3JtYXR0ZXIuZGlzcG9zZSgpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYSBzaW1wbGUgZmlsZSBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclxuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihcbiAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAnLi4nLFxuICAgICAgICAnZml4dHVyZXMnLFxuICAgICAgICAnZm9ybWF0JyxcbiAgICAgICAgJ2dvZm10LmdvJ1xuICAgICAgKVxuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2ZvciBlYWNoIHRvb2wnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHRvb2wgb2YgWydnb2ZtdCcsICdnb2ltcG9ydHMnLCAnZ29yZXR1cm5zJ10pIHtcbiAgICAgICAgaXQoJ2Zvcm1hdHMgb24gc2F2ZSB1c2luZyAnICsgdG9vbCwgKCkgPT4ge1xuICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLmZvcm1hdC50b29sJywgdG9vbClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXIudG9vbCA9PT0gdG9vbFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcnVucyhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmb3JtYXR0ZXIuZm9ybWF0RW50aXJlRmlsZShlZGl0b3IsIG51bGwpXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQuZm9ybWF0dGVkKS50b0VxdWFsKGZvcm1hdHRlZFRleHQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufSlcbiJdfQ==