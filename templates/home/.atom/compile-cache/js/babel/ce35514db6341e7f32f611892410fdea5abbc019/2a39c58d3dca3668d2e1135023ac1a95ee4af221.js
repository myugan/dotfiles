function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

module.exports = {
  config: {
    executablePath: {
      type: 'string',
      title: 'dockerlint Executable Path',
      'default': _path2['default'].join(__dirname, '..', 'node_modules', 'dockerlint', 'bin', 'dockerlint.js')
    }
  },

  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterDockerDeps = function installLinterDockerDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-docker');
      }
    };
    depsCallbackID = window.requestIdleCallback(installLinterDockerDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-docker.executablePath', function (value) {
      _this.executablePath = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'dockerlint',
      grammarScopes: ['source.dockerfile'],
      scope: 'file', // or 'project'
      lintsOnChange: false, // must be false for scope: 'project'
      lint: function lint(textEditor) {
        var filePath = textEditor.getPath();
        return helpers.execNode(_this2.executablePath, [filePath], { stream: 'stderr', throwOnStderr: false, allowEmptyStderr: true }).then(function (output) {
          var lines = output.split('\n');
          var patterns = [{
            // regex for "ERROR: ENV invalid format ENV_VARIABLE on line 2"
            regex: /(WARN|ERROR): (.*) on line (\d+)/,
            cb: function cb(m) {
              return { lineNumber: m[3], excerpt: m[2], severity: m[1] };
            }
          }, {
            // regex for "ERROR: Multiple CMD instructions found, only line 3 will take effect"
            regex: /(WARN|ERROR): (.*), only line (\d+)/,
            cb: function cb(m) {
              return { lineNumber: m[3], excerpt: m[2], severity: m[1] };
            }
          }, {
            // regex for "ERROR: First instruction must be 'FROM', is: RUN"
            regex: /(WARN|ERROR): (First instruction must be 'FROM', is: .*)/,
            cb: function cb(m) {
              return { lineNumber: 1, excerpt: m[2], severity: m[1] };
            }
          }, {
            // regex for "ERROR: /path/to/Dockerfile does not contain any instructions"
            regex: /(WARN|ERROR): (.* does not contain any instructions)/,
            cb: function cb(m) {
              return { lineNumber: 1, excerpt: m[2], severity: m[1] };
            }
          }];
          var results = lines.map(function (line) {
            var lineMatches = patterns.map(function (x) {
              var match = line.match(x.regex);
              return match ? x.cb(match) : null;
            });
            var result = lineMatches.find(function (x) {
              return x !== null;
            });
            return result;
          });
          var listOfMessages = results.reduce(function (messages, match) {
            if (!match) {
              return messages;
            }
            var linePosition = Number.parseInt(match.lineNumber - 1, 10);

            messages.push({
              severity: match.severity === 'WARN' ? 'warning' : 'error',
              excerpt: match.excerpt,
              location: {
                file: filePath,
                position: helpers.generateRange(textEditor, linePosition)
              }
            });
            return messages;
          }, []);

          return listOfMessages;
        });
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1kb2NrZXIvbGliL2luaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUdvQyxNQUFNOzswQkFDakIsYUFBYTs7SUFBMUIsT0FBTzs7b0JBQ0YsTUFBTTs7OztBQUx2QixXQUFXLENBQUM7O0FBT1osTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLGtCQUFjLEVBQUU7QUFDZCxVQUFJLEVBQUUsUUFBUTtBQUNkLFdBQUssRUFBRSw0QkFBNEI7QUFDbkMsaUJBQVMsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDO0tBQzFGO0dBQ0Y7O0FBRUQsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDL0IsUUFBSSxjQUFjLFlBQUEsQ0FBQztBQUNuQixRQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUF1QixHQUFTO0FBQ3BDLFlBQUssYUFBYSxVQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixlQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDdkQ7S0FDRixDQUFDO0FBQ0Ysa0JBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNyRSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFdkMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDeEMsOEJBQThCLEVBQzlCLFVBQUMsS0FB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QztXQUNmLENBQUMsQ0FBQztBQUNILGNBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFLO0FBQ3pELGdCQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YscUJBQU8sUUFBUSxDQUFDO2FBQ2pCO0FBQ0QsZ0JBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRS9ELG9CQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osc0JBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxLQUFLLE1BQU0sR0FBRyxTQUFTLEdBQUcsT0FBTztBQUN6RCxxQkFBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO0FBQ3RCLHNCQUFRLEVBQUU7QUFDUixvQkFBSSxFQUFFLFFBQVE7QUFDZCx3QkFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztlQUMxRDthQUNGLENBQUMsQ0FBQztBQUNILG1CQUFPLFFBQVEsQ0FBQztXQUNqQixFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVQLGlCQUFPLGNBQWMsQ0FBQztTQUN2QixDQUFDLENBQUM7T0FDTjtLQUNGLENBQUM7R0FDSDtDQUNGLENBQUMiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGludGVyLWRvY2tlci9saWIvaW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICdhdG9tLWxpbnRlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIGV4ZWN1dGFibGVQYXRoOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHRpdGxlOiAnZG9ja2VybGludCBFeGVjdXRhYmxlIFBhdGgnLFxuICAgICAgZGVmYXVsdDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdkb2NrZXJsaW50JywgJ2JpbicsICdkb2NrZXJsaW50LmpzJyksXG4gICAgfSxcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGRlcHNDYWxsYmFja0lEO1xuICAgIGNvbnN0IGluc3RhbGxMaW50ZXJEb2NrZXJEZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRCk7XG4gICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWRvY2tlcicpO1xuICAgICAgfVxuICAgIH07XG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVyRG9ja2VyRGVwcyk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChkZXBzQ2FsbGJhY2tJRCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdsaW50ZXItZG9ja2VyLmV4ZWN1dGFibGVQYXRoJyxcbiAgICAgICh2YWx1ZSkgPT4geyB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7IH0sXG4gICAgKSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5jbGVhcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ2RvY2tlcmxpbnQnLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuZG9ja2VyZmlsZSddLFxuICAgICAgc2NvcGU6ICdmaWxlJywgLy8gb3IgJ3Byb2plY3QnXG4gICAgICBsaW50c09uQ2hhbmdlOiBmYWxzZSwgLy8gbXVzdCBiZSBmYWxzZSBmb3Igc2NvcGU6ICdwcm9qZWN0J1xuICAgICAgbGludDogKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlY05vZGUodGhpcy5leGVjdXRhYmxlUGF0aCwgW2ZpbGVQYXRoXSwgeyBzdHJlYW06ICdzdGRlcnInLCB0aHJvd09uU3RkZXJyOiBmYWxzZSwgYWxsb3dFbXB0eVN0ZGVycjogdHJ1ZSB9KVxuICAgICAgICAgIC50aGVuKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gb3V0cHV0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdHRlcm5zID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gcmVnZXggZm9yIFwiRVJST1I6IEVOViBpbnZhbGlkIGZvcm1hdCBFTlZfVkFSSUFCTEUgb24gbGluZSAyXCJcbiAgICAgICAgICAgICAgICByZWdleDogLyhXQVJOfEVSUk9SKTogKC4qKSBvbiBsaW5lIChcXGQrKS8sXG4gICAgICAgICAgICAgICAgY2I6IG0gPT4gKHsgbGluZU51bWJlcjogbVszXSwgZXhjZXJwdDogbVsyXSwgc2V2ZXJpdHk6IG1bMV0gfSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyByZWdleCBmb3IgXCJFUlJPUjogTXVsdGlwbGUgQ01EIGluc3RydWN0aW9ucyBmb3VuZCwgb25seSBsaW5lIDMgd2lsbCB0YWtlIGVmZmVjdFwiXG4gICAgICAgICAgICAgICAgcmVnZXg6IC8oV0FSTnxFUlJPUik6ICguKiksIG9ubHkgbGluZSAoXFxkKykvLFxuICAgICAgICAgICAgICAgIGNiOiBtID0+ICh7IGxpbmVOdW1iZXI6IG1bM10sIGV4Y2VycHQ6IG1bMl0sIHNldmVyaXR5OiBtWzFdIH0pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gcmVnZXggZm9yIFwiRVJST1I6IEZpcnN0IGluc3RydWN0aW9uIG11c3QgYmUgJ0ZST00nLCBpczogUlVOXCJcbiAgICAgICAgICAgICAgICByZWdleDogLyhXQVJOfEVSUk9SKTogKEZpcnN0IGluc3RydWN0aW9uIG11c3QgYmUgJ0ZST00nLCBpczogLiopLyxcbiAgICAgICAgICAgICAgICBjYjogbSA9PiAoeyBsaW5lTnVtYmVyOiAxLCBleGNlcnB0OiBtWzJdLCBzZXZlcml0eTogbVsxXSB9KSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIHJlZ2V4IGZvciBcIkVSUk9SOiAvcGF0aC90by9Eb2NrZXJmaWxlIGRvZXMgbm90IGNvbnRhaW4gYW55IGluc3RydWN0aW9uc1wiXG4gICAgICAgICAgICAgICAgcmVnZXg6IC8oV0FSTnxFUlJPUik6ICguKiBkb2VzIG5vdCBjb250YWluIGFueSBpbnN0cnVjdGlvbnMpLyxcbiAgICAgICAgICAgICAgICBjYjogbSA9PiAoeyBsaW5lTnVtYmVyOiAxLCBleGNlcnB0OiBtWzJdLCBzZXZlcml0eTogbVsxXSB9KSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gbGluZXMubWFwKChsaW5lKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGxpbmVNYXRjaGVzID0gcGF0dGVybnMubWFwKCh4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKHgucmVnZXgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCA/IHguY2IobWF0Y2gpIDogbnVsbDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGxpbmVNYXRjaGVzLmZpbmQoeCA9PiB4ICE9PSBudWxsKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgbGlzdE9mTWVzc2FnZXMgPSByZXN1bHRzLnJlZHVjZSgobWVzc2FnZXMsIG1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgbGluZVBvc2l0aW9uID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoLmxpbmVOdW1iZXIgLSAxLCAxMCk7XG5cbiAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgc2V2ZXJpdHk6IG1hdGNoLnNldmVyaXR5ID09PSAnV0FSTicgPyAnd2FybmluZycgOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIGV4Y2VycHQ6IG1hdGNoLmV4Y2VycHQsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZSh0ZXh0RWRpdG9yLCBsaW5lUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0T2ZNZXNzYWdlcztcbiAgICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=