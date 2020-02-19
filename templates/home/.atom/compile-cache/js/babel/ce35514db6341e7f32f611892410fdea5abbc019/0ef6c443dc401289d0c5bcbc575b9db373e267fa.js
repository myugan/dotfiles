Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utils = require('./../utils');

var _guruUtils = require('./../guru-utils');

var HighlightProvider = (function () {
  function HighlightProvider(goconfig) {
    var _this = this;

    _classCallCheck(this, HighlightProvider);

    this.priority = 2;
    this.grammarScopes = ['source.go', 'go'];

    this.subscriptions = new _atom.CompositeDisposable();
    this.goconfig = goconfig;
    this.running = false;
    this.subscriptions.add(atom.config.observe('go-plus.guru.highlightIdentifiers', function (v) {
      _this.shouldDecorate = v;
    }));
  }

  _createClass(HighlightProvider, [{
    key: 'highlight',
    value: _asyncToGenerator(function* (editor, bufferPosition) {
      if (this.running) return null;
      if (!this.shouldDecorate) return null;

      var pos = (0, _guruUtils.adjustPositionForGuru)(bufferPosition, editor);
      var offset = (0, _utils.utf8OffsetForBufferPosition)(pos, editor);
      var args = (0, _guruUtils.computeArgs)('what', null, editor, offset);
      if (!args) return null;

      var options = {};
      options.timeout = 30000;
      var archive = (0, _guruUtils.buildGuruArchive)(editor);
      if (archive && archive.length) {
        options.input = archive;
        args.unshift('-modified');
      }

      var cmd = yield this.goconfig.locator.findTool('guru');
      if (!cmd) return null;

      this.running = true;
      try {
        var r = yield this.goconfig.executor.exec(cmd, args, options);
        if (r.exitcode !== 0) return null;

        var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
        var result = JSON.parse(stdout);

        var ranges = [];
        var _length = 0;
        for (var enclosing of result.enclosing) {
          if (enclosing.desc === 'identifier') {
            _length = enclosing.end - enclosing.start;
            break;
          }
        }
        for (var id of result.sameids) {
          var parsed = (0, _utils.parseGoPosition)(id);
          if (parsed && typeof parsed.column === 'number' && typeof parsed.line === 'number') {
            var start = [parsed.line - 1, parsed.column - 1];
            ranges.push(new _atom.Range(start, [start[0], start[1] + _length]));
          }
        }
        return ranges;
      } finally {
        this.running = false;
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.running = false;
    }
  }]);

  return HighlightProvider;
})();

exports.HighlightProvider = HighlightProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2hpZ2hsaWdodC9oaWdobGlnaHQtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7cUJBQ1ksWUFBWTs7eUJBS2xFLGlCQUFpQjs7SUFJbEIsaUJBQWlCO0FBUVYsV0FSUCxpQkFBaUIsQ0FRVCxRQUFrQixFQUFFOzs7MEJBUjVCLGlCQUFpQjs7U0FLckIsUUFBUSxHQUFXLENBQUM7U0FDcEIsYUFBYSxHQUFrQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUM7O0FBR2hELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDcEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxFQUFFLFVBQUEsQ0FBQyxFQUFJO0FBQzVELFlBQUssY0FBYyxHQUFHLENBQUMsQ0FBQTtLQUN4QixDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQWpCRyxpQkFBaUI7OzZCQW1CTixXQUNiLE1BQXVCLEVBQ3ZCLGNBQTBCLEVBQ0c7QUFDN0IsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFBO0FBQzdCLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sSUFBSSxDQUFBOztBQUVyQyxVQUFNLEdBQUcsR0FBRyxzQ0FBc0IsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3pELFVBQU0sTUFBTSxHQUFHLHdDQUE0QixHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDdkQsVUFBTSxJQUFJLEdBQUcsNEJBQVksTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDdEQsVUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLElBQUksQ0FBQTs7QUFFdEIsVUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLGFBQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFVBQU0sT0FBTyxHQUFHLGlDQUFpQixNQUFNLENBQUMsQ0FBQTtBQUN4QyxVQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzdCLGVBQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFBO0FBQ3ZCLFlBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7T0FDMUI7O0FBRUQsVUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDeEQsVUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQTs7QUFFckIsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbkIsVUFBSTtBQUNGLFlBQU0sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDL0QsWUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQTs7QUFFakMsWUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO0FBQzFFLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRWpDLFlBQU0sTUFBeUIsR0FBRyxFQUFFLENBQUE7QUFDcEMsWUFBSSxPQUFNLEdBQUcsQ0FBQyxDQUFBO0FBQ2QsYUFBSyxJQUFNLFNBQVMsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3hDLGNBQUksU0FBUyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUU7QUFDbkMsbUJBQU0sR0FBRyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUE7QUFDeEMsa0JBQUs7V0FDTjtTQUNGO0FBQ0QsYUFBSyxJQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQy9CLGNBQU0sTUFBTSxHQUFHLDRCQUFnQixFQUFFLENBQUMsQ0FBQTtBQUNsQyxjQUNFLE1BQU0sSUFDTixPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUNqQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUMvQjtBQUNBLGdCQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDbEQsa0JBQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQVUsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7V0FDN0Q7U0FDRjtBQUNELGVBQU8sTUFBTSxDQUFBO09BQ2QsU0FBUztBQUNSLFlBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO09BQ3JCO0tBQ0Y7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDN0I7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtLQUNyQjs7O1NBaEZHLGlCQUFpQjs7O1FBbUZkLGlCQUFpQixHQUFqQixpQkFBaUIiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvaGlnaGxpZ2h0L2hpZ2hsaWdodC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHV0ZjhPZmZzZXRGb3JCdWZmZXJQb3NpdGlvbiwgcGFyc2VHb1Bvc2l0aW9uIH0gZnJvbSAnLi8uLi91dGlscydcbmltcG9ydCB7XG4gIGJ1aWxkR3VydUFyY2hpdmUsXG4gIGNvbXB1dGVBcmdzLFxuICBhZGp1c3RQb3NpdGlvbkZvckd1cnVcbn0gZnJvbSAnLi8uLi9ndXJ1LXV0aWxzJ1xuXG5pbXBvcnQgdHlwZSB7IEdvQ29uZmlnIH0gZnJvbSAnLi8uLi9jb25maWcvc2VydmljZSdcblxuY2xhc3MgSGlnaGxpZ2h0UHJvdmlkZXIge1xuICBnb2NvbmZpZzogR29Db25maWdcbiAgcnVubmluZzogYm9vbGVhblxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHNob3VsZERlY29yYXRlOiBib29sZWFuXG4gIHByaW9yaXR5OiBudW1iZXIgPSAyXG4gIGdyYW1tYXJTY29wZXM6IEFycmF5PHN0cmluZz4gPSBbJ3NvdXJjZS5nbycsICdnbyddXG5cbiAgY29uc3RydWN0b3IoZ29jb25maWc6IEdvQ29uZmlnKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ1xuICAgIHRoaXMucnVubmluZyA9IGZhbHNlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2dvLXBsdXMuZ3VydS5oaWdobGlnaHRJZGVudGlmaWVycycsIHYgPT4ge1xuICAgICAgICB0aGlzLnNob3VsZERlY29yYXRlID0gdlxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBoaWdobGlnaHQoXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgYnVmZmVyUG9zaXRpb246IGF0b20kUG9pbnRcbiAgKTogUHJvbWlzZTw/QXJyYXk8YXRvbSRSYW5nZT4+IHtcbiAgICBpZiAodGhpcy5ydW5uaW5nKSByZXR1cm4gbnVsbFxuICAgIGlmICghdGhpcy5zaG91bGREZWNvcmF0ZSkgcmV0dXJuIG51bGxcblxuICAgIGNvbnN0IHBvcyA9IGFkanVzdFBvc2l0aW9uRm9yR3VydShidWZmZXJQb3NpdGlvbiwgZWRpdG9yKVxuICAgIGNvbnN0IG9mZnNldCA9IHV0ZjhPZmZzZXRGb3JCdWZmZXJQb3NpdGlvbihwb3MsIGVkaXRvcilcbiAgICBjb25zdCBhcmdzID0gY29tcHV0ZUFyZ3MoJ3doYXQnLCBudWxsLCBlZGl0b3IsIG9mZnNldClcbiAgICBpZiAoIWFyZ3MpIHJldHVybiBudWxsXG5cbiAgICBjb25zdCBvcHRpb25zID0ge31cbiAgICBvcHRpb25zLnRpbWVvdXQgPSAzMDAwMFxuICAgIGNvbnN0IGFyY2hpdmUgPSBidWlsZEd1cnVBcmNoaXZlKGVkaXRvcilcbiAgICBpZiAoYXJjaGl2ZSAmJiBhcmNoaXZlLmxlbmd0aCkge1xuICAgICAgb3B0aW9ucy5pbnB1dCA9IGFyY2hpdmVcbiAgICAgIGFyZ3MudW5zaGlmdCgnLW1vZGlmaWVkJylcbiAgICB9XG5cbiAgICBjb25zdCBjbWQgPSBhd2FpdCB0aGlzLmdvY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2d1cnUnKVxuICAgIGlmICghY21kKSByZXR1cm4gbnVsbFxuXG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywgb3B0aW9ucylcbiAgICAgIGlmIChyLmV4aXRjb2RlICE9PSAwKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCBzdGRvdXQgPSByLnN0ZG91dCBpbnN0YW5jZW9mIEJ1ZmZlciA/IHIuc3Rkb3V0LnRvU3RyaW5nKCkgOiByLnN0ZG91dFxuICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShzdGRvdXQpXG5cbiAgICAgIGNvbnN0IHJhbmdlczogQXJyYXk8YXRvbSRSYW5nZT4gPSBbXVxuICAgICAgbGV0IGxlbmd0aCA9IDBcbiAgICAgIGZvciAoY29uc3QgZW5jbG9zaW5nIG9mIHJlc3VsdC5lbmNsb3NpbmcpIHtcbiAgICAgICAgaWYgKGVuY2xvc2luZy5kZXNjID09PSAnaWRlbnRpZmllcicpIHtcbiAgICAgICAgICBsZW5ndGggPSBlbmNsb3NpbmcuZW5kIC0gZW5jbG9zaW5nLnN0YXJ0XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBpZCBvZiByZXN1bHQuc2FtZWlkcykge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUdvUG9zaXRpb24oaWQpXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXJzZWQgJiZcbiAgICAgICAgICB0eXBlb2YgcGFyc2VkLmNvbHVtbiA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICB0eXBlb2YgcGFyc2VkLmxpbmUgPT09ICdudW1iZXInXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gW3BhcnNlZC5saW5lIC0gMSwgcGFyc2VkLmNvbHVtbiAtIDFdXG4gICAgICAgICAgcmFuZ2VzLnB1c2gobmV3IFJhbmdlKHN0YXJ0LCBbc3RhcnRbMF0sIHN0YXJ0WzFdICsgbGVuZ3RoXSkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByYW5nZXNcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgeyBIaWdobGlnaHRQcm92aWRlciB9XG4iXX0=