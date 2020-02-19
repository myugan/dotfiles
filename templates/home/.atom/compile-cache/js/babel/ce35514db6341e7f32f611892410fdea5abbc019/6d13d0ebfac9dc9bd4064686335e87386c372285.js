Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _atom = require('atom');

var _guruUtils = require('./../guru-utils');

var _utils = require('./../utils');

// defaults to 'Symbol References'

var ReferencesProvider = (function () {
  function ReferencesProvider(goconfig) {
    _classCallCheck(this, ReferencesProvider);

    this.goconfig = goconfig;
  }

  _createClass(ReferencesProvider, [{
    key: 'isEditorSupported',
    value: function isEditorSupported(editor) {
      return Promise.resolve((0, _utils.isValidEditor)(editor));
    }
  }, {
    key: 'getWordAtPosition',
    value: function getWordAtPosition(editor, pos) {
      var cursor = editor.getLastCursor();
      var wordRegexp = cursor.wordRegExp();
      // $FlowFixMe
      var ranges = editor.getBuffer().findAllInRangeSync(wordRegexp, new _atom.Range(new _atom.Point(pos.row, 0), new _atom.Point(pos.row, Infinity)));
      var range = ranges.find(function (range) {
        return range.end.column >= pos.column && range.start.column <= pos.column;
      }) || new _atom.Range(pos, pos);

      return editor.getTextInBufferRange(range);
    }
  }, {
    key: 'findReferences',
    value: _asyncToGenerator(function* (editor, position) {
      var cmd = yield this.goconfig.locator.findTool('guru');
      if (!cmd) {
        return {
          type: 'error',
          message: 'Cannot find references. The `guru` tool could not be located.'
        };
      }

      var offset = (0, _utils.utf8OffsetForBufferPosition)(position, editor);
      var args = (0, _guruUtils.computeArgs)('referrers', null, editor, offset) || [];
      var options = {};
      options.timeout = 30000;
      var archive = (0, _guruUtils.buildGuruArchive)(editor);
      if (archive && archive.length) {
        options.input = archive;
        args.unshift('-modified');
      }

      var r = yield this.goconfig.executor.exec(cmd, args, options);
      var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      if (r.error || r.exitcode !== 0) {
        var _message = undefined;
        if (r.exitcode === 124) {
          _message = 'operation timed out after ' + options.timeout + 'ms';
        } else {
          _message = stderr.trim() + _os2['default'].EOL + stdout.trim();
          if (r.error && r.error.message) {
            _message = r.error.message + _os2['default'].EOL + _message;
          }
        }
        return { type: 'error', message: _message };
      }

      var stream = this.parseStream(stdout);
      var refs = this.parse(stream);
      return {
        type: 'data',
        baseUri: atom.project.getDirectories()[0].getPath(),
        references: refs,
        referencedSymbolName: this.getWordAtPosition(editor, position) || stream[0].desc
      };
    })
  }, {
    key: 'parseStream',
    value: function parseStream(jsonStream) {
      if (!jsonStream || !jsonStream.length) {
        return [];
      }
      // A JSON stream is invalid json; characterized by a concatenation of
      // multiple JSON objects
      var r = new RegExp('^}$', 'igm');
      var result = [];
      var objects = jsonStream.split(r);
      for (var obj of objects) {
        if (obj.trim() !== '') {
          result.push(JSON.parse(obj + '}'));
        }
      }
      return result;
    }
  }, {
    key: 'parse',
    value: function parse(obj) {
      if (!obj || !obj.length) {
        return [];
      }

      var refs = [];
      for (var pkg of obj.slice(1)) {
        if (!pkg || !pkg.refs || !pkg.refs.length) {
          continue;
        }

        for (var ref of pkg.refs) {
          var parsed = (0, _utils.parseGoPosition)(ref.pos);
          if (parsed && typeof parsed.column === 'number' && typeof parsed.line === 'number') {
            var point = [parsed.line, parsed.column];
            refs.push({
              uri: parsed.file,
              range: new _atom.Range(point, point),
              name: ref.text
            });
          }
        }
      }

      return refs;
    }
  }]);

  return ReferencesProvider;
})();

exports.ReferencesProvider = ReferencesProvider;
// name of calling method/function/symbol
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3JlZmVyZW5jZXMvcmVmZXJlbmNlcy1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDVSxNQUFNOzt5QkFDVyxpQkFBaUI7O3FCQUt4RCxZQUFZOzs7O0lBeUJiLGtCQUFrQjtBQUdYLFdBSFAsa0JBQWtCLENBR1YsUUFBa0IsRUFBRTswQkFINUIsa0JBQWtCOztBQUlwQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtHQUN6Qjs7ZUFMRyxrQkFBa0I7O1dBT0wsMkJBQUMsTUFBa0IsRUFBb0I7QUFDdEQsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLDBCQUFjLE1BQU0sQ0FBQyxDQUFDLENBQUE7S0FDOUM7OztXQUVnQiwyQkFBQyxNQUFrQixFQUFFLEdBQWUsRUFBRTtBQUNyRCxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDckMsVUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFBOztBQUV0QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQ2xCLFNBQVMsRUFBRSxDQUNYLGtCQUFrQixDQUNqQixVQUFVLEVBQ1YsZ0JBQVUsZ0JBQVUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBVSxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQy9ELENBQUE7QUFDSCxVQUFNLEtBQUssR0FDVCxNQUFNLENBQUMsSUFBSSxDQUNULFVBQUEsS0FBSztlQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU07T0FBQSxDQUNyRSxJQUFJLGdCQUFVLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFMUIsYUFBTyxN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QUFDQSxnQkFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMxQyxnQkFBSSxDQUFDLElBQUksQ0FBQztBQUNSLGlCQUFHLEVBQUUsTUFBTSxDQUFDLElBQUk7QUFDaEIsbUJBQUssRUFBRSxnQkFBVSxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQzlCLGtCQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7YUFDZixDQUFDLENBQUE7V0FDSDtTQUNGO09BQ0Y7O0FBRUQsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBN0hHLGtCQUFrQjs7O1FBZ0lmLGtCQUFrQixHQUFsQixrQkFBa0IiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvcmVmZXJlbmNlcy9yZWZlcmVuY2VzLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHsgUG9pbnQsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGJ1aWxkR3VydUFyY2hpdmUsIGNvbXB1dGVBcmdzIH0gZnJvbSAnLi8uLi9ndXJ1LXV0aWxzJ1xuaW1wb3J0IHtcbiAgcGFyc2VHb1Bvc2l0aW9uLFxuICBpc1ZhbGlkRWRpdG9yLFxuICB1dGY4T2Zmc2V0Rm9yQnVmZmVyUG9zaXRpb25cbn0gZnJvbSAnLi8uLi91dGlscydcblxuaW1wb3J0IHR5cGUgeyBHb0NvbmZpZyB9IGZyb20gJy4vLi4vY29uZmlnL3NlcnZpY2UnXG5cbnR5cGUgUmVmZXJlbmNlID0ge1xuICB1cmk6IHN0cmluZyxcbiAgbmFtZTogP3N0cmluZywgLy8gbmFtZSBvZiBjYWxsaW5nIG1ldGhvZC9mdW5jdGlvbi9zeW1ib2xcbiAgcmFuZ2U6IGF0b20kUmFuZ2Vcbn1cblxudHlwZSBGaW5kUmVmZXJlbmNlc0RhdGEgPSB7XG4gIHR5cGU6ICdkYXRhJyxcbiAgYmFzZVVyaTogc3RyaW5nLFxuICByZWZlcmVuY2VkU3ltYm9sTmFtZTogc3RyaW5nLFxuICByZWZlcmVuY2VzOiBBcnJheTxSZWZlcmVuY2U+LFxuICB0aXRsZT86IHN0cmluZyAvLyBkZWZhdWx0cyB0byAnU3ltYm9sIFJlZmVyZW5jZXMnXG59XG5cbnR5cGUgRmluZFJlZmVyZW5jZXNFcnJvciA9IHtcbiAgdHlwZTogJ2Vycm9yJyxcbiAgbWVzc2FnZTogc3RyaW5nXG59XG5cbnR5cGUgRmluZFJlZmVyZW5jZXNSZXR1cm4gPSBGaW5kUmVmZXJlbmNlc0RhdGEgfCBGaW5kUmVmZXJlbmNlc0Vycm9yXG5cbmNsYXNzIFJlZmVyZW5jZXNQcm92aWRlciB7XG4gIGdvY29uZmlnOiBHb0NvbmZpZ1xuXG4gIGNvbnN0cnVjdG9yKGdvY29uZmlnOiBHb0NvbmZpZykge1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ1xuICB9XG5cbiAgaXNFZGl0b3JTdXBwb3J0ZWQoZWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpc1ZhbGlkRWRpdG9yKGVkaXRvcikpXG4gIH1cblxuICBnZXRXb3JkQXRQb3NpdGlvbihlZGl0b3I6IFRleHRFZGl0b3IsIHBvczogYXRvbSRQb2ludCkge1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKClcbiAgICBjb25zdCB3b3JkUmVnZXhwID0gY3Vyc29yLndvcmRSZWdFeHAoKVxuICAgIC8vICRGbG93Rml4TWVcbiAgICBjb25zdCByYW5nZXMgPSBlZGl0b3JcbiAgICAgIC5nZXRCdWZmZXIoKVxuICAgICAgLmZpbmRBbGxJblJhbmdlU3luYyhcbiAgICAgICAgd29yZFJlZ2V4cCxcbiAgICAgICAgbmV3IFJhbmdlKG5ldyBQb2ludChwb3Mucm93LCAwKSwgbmV3IFBvaW50KHBvcy5yb3csIEluZmluaXR5KSlcbiAgICAgIClcbiAgICBjb25zdCByYW5nZSA9XG4gICAgICByYW5nZXMuZmluZChcbiAgICAgICAgcmFuZ2UgPT5cbiAgICAgICAgICByYW5nZS5lbmQuY29sdW1uID49IHBvcy5jb2x1bW4gJiYgcmFuZ2Uuc3RhcnQuY29sdW1uIDw9IHBvcy5jb2x1bW5cbiAgICAgICkgfHwgbmV3IFJhbmdlKHBvcywgcG9zKVxuXG4gICAgcmV0dXJuIGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgfVxuXG4gIGFzeW5jIGZpbmRSZWZlcmVuY2VzKFxuICAgIGVkaXRvcjogVGV4dEVkaXRvcixcbiAgICBwb3NpdGlvbjogYXRvbSRQb2ludFxuICApOiBQcm9taXNlPD9GaW5kUmVmZXJlbmNlc1JldHVybj4ge1xuICAgIGNvbnN0IGNtZCA9IGF3YWl0IHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCgnZ3VydScpXG4gICAgaWYgKCFjbWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdDYW5ub3QgZmluZCByZWZlcmVuY2VzLiBUaGUgYGd1cnVgIHRvb2wgY291bGQgbm90IGJlIGxvY2F0ZWQuJ1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9mZnNldCA9IHV0ZjhPZmZzZXRGb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbiwgZWRpdG9yKVxuICAgIGNvbnN0IGFyZ3MgPSBjb21wdXRlQXJncygncmVmZXJyZXJzJywgbnVsbCwgZWRpdG9yLCBvZmZzZXQpIHx8IFtdXG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9XG4gICAgb3B0aW9ucy50aW1lb3V0ID0gMzAwMDBcbiAgICBjb25zdCBhcmNoaXZlID0gYnVpbGRHdXJ1QXJjaGl2ZShlZGl0b3IpXG4gICAgaWYgKGFyY2hpdmUgJiYgYXJjaGl2ZS5sZW5ndGgpIHtcbiAgICAgIG9wdGlvbnMuaW5wdXQgPSBhcmNoaXZlXG4gICAgICBhcmdzLnVuc2hpZnQoJy1tb2RpZmllZCcpXG4gICAgfVxuXG4gICAgY29uc3QgciA9IGF3YWl0IHRoaXMuZ29jb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIG9wdGlvbnMpXG4gICAgY29uc3Qgc3RkZXJyID0gci5zdGRlcnIgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZGVyci50b1N0cmluZygpIDogci5zdGRlcnJcbiAgICBjb25zdCBzdGRvdXQgPSByLnN0ZG91dCBpbnN0YW5jZW9mIEJ1ZmZlciA/IHIuc3Rkb3V0LnRvU3RyaW5nKCkgOiByLnN0ZG91dFxuICAgIGlmIChyLmVycm9yIHx8IHIuZXhpdGNvZGUgIT09IDApIHtcbiAgICAgIGxldCBtZXNzYWdlXG4gICAgICBpZiAoci5leGl0Y29kZSA9PT0gMTI0KSB7XG4gICAgICAgIG1lc3NhZ2UgPSBgb3BlcmF0aW9uIHRpbWVkIG91dCBhZnRlciAke29wdGlvbnMudGltZW91dH1tc2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3NhZ2UgPSBzdGRlcnIudHJpbSgpICsgb3MuRU9MICsgc3Rkb3V0LnRyaW0oKVxuICAgICAgICBpZiAoci5lcnJvciAmJiByLmVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgICBtZXNzYWdlID0gci5lcnJvci5tZXNzYWdlICsgb3MuRU9MICsgbWVzc2FnZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLnBhcnNlU3RyZWFtKHN0ZG91dClcbiAgICBjb25zdCByZWZzID0gdGhpcy5wYXJzZShzdHJlYW0pXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdkYXRhJyxcbiAgICAgIGJhc2VVcmk6IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLmdldFBhdGgoKSxcbiAgICAgIHJlZmVyZW5jZXM6IHJlZnMsXG4gICAgICByZWZlcmVuY2VkU3ltYm9sTmFtZTpcbiAgICAgICAgdGhpcy5nZXRXb3JkQXRQb3NpdGlvbihlZGl0b3IsIHBvc2l0aW9uKSB8fCBzdHJlYW1bMF0uZGVzY1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlU3RyZWFtKGpzb25TdHJlYW06IHN0cmluZyk6IEFycmF5PE9iamVjdD4ge1xuICAgIGlmICghanNvblN0cmVhbSB8fCAhanNvblN0cmVhbS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICAvLyBBIEpTT04gc3RyZWFtIGlzIGludmFsaWQganNvbjsgY2hhcmFjdGVyaXplZCBieSBhIGNvbmNhdGVuYXRpb24gb2ZcbiAgICAvLyBtdWx0aXBsZSBKU09OIG9iamVjdHNcbiAgICBjb25zdCByID0gbmV3IFJlZ0V4cCgnXn0kJywgJ2lnbScpXG4gICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICBjb25zdCBvYmplY3RzID0ganNvblN0cmVhbS5zcGxpdChyKVxuICAgIGZvciAoY29uc3Qgb2JqIG9mIG9iamVjdHMpIHtcbiAgICAgIGlmIChvYmoudHJpbSgpICE9PSAnJykge1xuICAgICAgICByZXN1bHQucHVzaChKU09OLnBhcnNlKG9iaiArICd9JykpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHBhcnNlKG9iajogQXJyYXk8T2JqZWN0Pik6IEFycmF5PFJlZmVyZW5jZT4ge1xuICAgIGlmICghb2JqIHx8ICFvYmoubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCByZWZzOiBBcnJheTxSZWZlcmVuY2U+ID0gW11cbiAgICBmb3IgKGNvbnN0IHBrZyBvZiBvYmouc2xpY2UoMSkpIHtcbiAgICAgIGlmICghcGtnIHx8ICFwa2cucmVmcyB8fCAhcGtnLnJlZnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgcmVmIG9mIHBrZy5yZWZzKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlR29Qb3NpdGlvbihyZWYucG9zKVxuICAgICAgICBpZiAoXG4gICAgICAgICAgcGFyc2VkICYmXG4gICAgICAgICAgdHlwZW9mIHBhcnNlZC5jb2x1bW4gPT09ICdudW1iZXInICYmXG4gICAgICAgICAgdHlwZW9mIHBhcnNlZC5saW5lID09PSAnbnVtYmVyJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBwb2ludCA9IFtwYXJzZWQubGluZSwgcGFyc2VkLmNvbHVtbl1cbiAgICAgICAgICByZWZzLnB1c2goe1xuICAgICAgICAgICAgdXJpOiBwYXJzZWQuZmlsZSxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgUmFuZ2UocG9pbnQsIHBvaW50KSxcbiAgICAgICAgICAgIG5hbWU6IHJlZi50ZXh0XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZWZzXG4gIH1cbn1cblxuZXhwb3J0IHsgUmVmZXJlbmNlc1Byb3ZpZGVyIH1cbiJdfQ==