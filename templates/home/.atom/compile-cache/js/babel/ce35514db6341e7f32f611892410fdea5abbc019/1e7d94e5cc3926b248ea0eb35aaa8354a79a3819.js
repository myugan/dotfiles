Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _yargsParserLibTokenizeArgString = require('yargs-parser/lib/tokenize-arg-string');

var _yargsParserLibTokenizeArgString2 = _interopRequireDefault(_yargsParserLibTokenizeArgString);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTemp = require('@atom/temp');

var _atomTemp2 = _interopRequireDefault(_atomTemp);

var _atom = require('atom');

var _utils = require('./../utils');

var _configEnvironment = require('../config/environment');

var Builder = (function () {
  function Builder(goconfig, linter, output, busySignal) {
    _classCallCheck(this, Builder);

    this.goconfig = goconfig;
    this.linter = linter;
    this.output = output;
    this.subscriptions = new _atom.CompositeDisposable();
    this.busySignal = busySignal;

    _atomTemp2['default'].track();
  }

  _createClass(Builder, [{
    key: 'dispose',
    value: function dispose() {
      this.disposed = true;
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      try {
        _atomTemp2['default'].cleanupSync();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('builder cleanup:', err);
      }
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages() {
      var linter = this.linter();
      if (linter) {
        linter.clearMessages();
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(messages) {
      var linter = this.linter();
      if (linter && messages && messages.length) {
        linter.setAllMessages(messages);
      }
    }
  }, {
    key: 'build',
    value: _asyncToGenerator(function* (editor, path) {
      if (!atom.config.get('go-plus.config.compileOnSave')) {
        return;
      }
      if (!(0, _utils.isValidEditor)(editor)) {
        throw new Error('invalid editor');
      }
      this.deleteMessages();
      var options = this.goconfig.executor.getOptions('file', editor);
      var cmd = yield this.goconfig.locator.findTool('go');
      if (!cmd) {
        throw new Error('cannot find go tool');
      }
      var buildPromise = this.lintInstall(cmd, options);
      var testPromise = this.hasTests(path) ? this.lintTest(cmd, options) : Promise.resolve({ output: '', linterName: 'test', exitcode: 0 });

      var all = Promise.all([buildPromise, testPromise]);
      var bs = this.busySignal();
      var p = bs ? bs.reportBusyWhile('Building Go', function () {
        return all;
      }) : all;
      var results = yield p;
      if (!results || results.length === 0) {
        return;
      }
      this.setMessages(this.getMessages(results, options.cwd || ''));

      // check for any non-zero exit codes and error if found
      for (var result of results) {
        if (result.exitcode !== 0) {
          if (this.output) {
            if (result.exitcode === 124) {
              var timeoutMsg = result.linterName + ' timed out';
              if (options.timeout) {
                timeoutMsg += ' after ' + options.timeout + ' ms';
              }
              this.output.update({
                exitcode: result.exitcode,
                output: timeoutMsg,
                dir: options.cwd
              });
            } else {
              this.output.update({
                exitcode: result.exitcode,
                output: result.output,
                dir: options.cwd
              });
            }
          }
          throw new Error(result.output);
        }
      }
      // indicate that we're done, which is especially important when test on save is disabled
      // (we don't want to give the appearance that we're compiling indefinitely)
      if (this.output) {
        this.output.update({
          output: this.output.props.output + '\n\nDone'
        });
      }
    })
  }, {
    key: 'getMessages',
    value: function getMessages(results, cwd) {
      var _this = this;

      var messages = [];
      for (var _ref2 of results) {
        var _output = _ref2.output;
        var _linterName = _ref2.linterName;

        var newMessages = this.mapMessages(_output, cwd, _linterName);

        var _loop = function (newMessage) {
          if (!messages.some(function (message) {
            return _this.messageEquals(newMessage, message);
          })) {
            messages.push(newMessage);
          }
        };

        for (var newMessage of newMessages) {
          _loop(newMessage);
        }
      }

      // add the "(<name>)" postfix to each message
      for (var message of messages) {
        if (message.name) {
          message.excerpt += ' (' + message.name + ')';
        }
      }
      return messages;
    }
  }, {
    key: 'messageEquals',
    value: function messageEquals(m1, m2) {
      return m1.location.file === m2.location.file && m1.excerpt === m2.excerpt && m1.location.position.isEqual(m2.location.position);
    }
  }, {
    key: 'buildCommand',
    value: function buildCommand(gopath, cwd) {
      var sep = arguments.length <= 2 || arguments[2] === undefined ? _path2['default'].sep : arguments[2];

      if (gopath.endsWith(sep)) {
        gopath = gopath.slice(0, -1);
      }
      var srcDir = gopath + sep + 'src';
      return srcDir.split(sep).every(function (t, i) {
        return cwd.split(sep)[i] === t;
      }) ? 'install' // CWD is within gopath, `go install` to keep gocode up to date
      : 'build'; // CWD is outside gopath, `go build` will suffice
    }
  }, {
    key: 'lintInstall',
    value: _asyncToGenerator(function* (cmd, options) {
      options.timeout = atom.config.get('go-plus.config.buildTimeout') || 10000;
      var command = this.buildCommand((0, _configEnvironment.getgopath)(), options.cwd || '');
      var buildArgs = [command];
      var outFile = undefined;
      if (command === 'build') {
        outFile = this.outFile();
        buildArgs.push('-o');
        buildArgs.push(outFile);
      }
      var additionalArgs = atom.config.get('go-plus.config.additionalBuildArgs');
      if (additionalArgs && additionalArgs.length) {
        var parsed = (0, _yargsParserLibTokenizeArgString2['default'])(additionalArgs);
        buildArgs.push.apply(buildArgs, _toConsumableArray(parsed));
      }

      // Include the -i flag with go install.
      // See: https://github.com/mdempsky/gocode/issues/79
      if (command === 'install' && !buildArgs.includes('-i')) {
        buildArgs.push('-i');
      }

      buildArgs.push('.');
      this.output.update({
        output: 'Running go ' + buildArgs.join(' '),
        exitcode: 0
      });

      var r = yield this.goconfig.executor.exec(cmd, buildArgs, options);
      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      if (stdout && stdout.trim() !== '') {
        console.log('go ' + command + ': (stdout) ' + stdout); // eslint-disable-line no-console
      }
      var stderr = (r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr).trim();

      // cleanup any temp files
      if (outFile && outFile !== '/dev/null' && r.exitcode === 0) {
        _fsExtra2['default'].remove(outFile);
      }

      var exitcode = r.exitcode;
      if (stderr.indexOf('no non-test Go files in') >= 0) {
        // pkgs may only contain go test files (e.g. integration tests)
        // ignore this error because the test builder reports the errors then.
        stderr = '';
        exitcode = 0;
      }
      return { output: stderr, linterName: 'build', exitcode: exitcode };
    })
  }, {
    key: 'outFile',
    value: function outFile() {
      if (process.platform === 'win32') {
        return _atomTemp2['default'].path({ prefix: 'go-plus-test' });
      }
      return '/dev/null';
    }
  }, {
    key: 'testCompileArgs',
    value: function testCompileArgs(outFile) {
      var additionalArgs = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var result = ['test'];
      // use additional build args even when we compile the tests
      if (additionalArgs && additionalArgs.length) {
        var parsed = (0, _yargsParserLibTokenizeArgString2['default'])(additionalArgs);
        for (var i = 0; i < parsed.length; i++) {
          if (parsed[i] === '-o') {
            // we'll take care of this one, skip over the -o flag
            i++;
            continue;
          } else if (parsed[i] === '-c') {
            continue;
          } else {
            result.push(parsed[i]);
          }
        }
      }
      result.push('-c', '-o', outFile, '.');
      return result;
    }
  }, {
    key: 'lintTest',
    value: _asyncToGenerator(function* (cmd, options) {
      var outFile = this.outFile();
      var additionalArgs = atom.config.get('go-plus.config.additionalTestArgs');
      var testArgs = this.testCompileArgs(outFile, additionalArgs);

      this.output.update({
        output: 'Compiling tests:' + _os2['default'].EOL + '$ go ' + testArgs.join(' '),
        exitcode: 0
      });
      var r = yield this.goconfig.executor.exec(cmd, testArgs, options);
      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
      if (stdout && stdout.trim() !== '') {
        console.log('go test: (stdout) ' + stdout); // eslint-disable-line no-console
      }
      if (outFile && outFile !== '/dev/null' && r.exitcode === 0) {
        _fsExtra2['default'].remove(outFile);
      }
      return { output: stderr.trim(), linterName: 'test', exitcode: r.exitcode };
    })
  }, {
    key: 'mapMessages',
    value: function mapMessages(data, cwd, linterName) {
      var pattern = /^((#)\s(.*)?)|((.*?):(\d*?):((\d*?):)?\s((.*)?((\n\t.*)+)?))/gim;
      var messages = [];
      var match = undefined;
      for (match = pattern.exec(data); match !== null; match = pattern.exec(data)) {
        var message = this.extractMessage(match, cwd, linterName);
        if (message) {
          messages.push(message);
        }
      }
      return messages;
    }
  }, {
    key: 'extractMessage',
    value: function extractMessage(line, cwd, linterName) {
      if (!line) {
        return;
      }
      if (line[2] && line[2] === '#') {
        // Found A Package Indicator, Skip For Now
        return;
      }
      var filePath = '';
      if (line[5] && line[5] !== '') {
        if (_path2['default'].isAbsolute(line[5])) {
          filePath = line[5];
        } else {
          filePath = _path2['default'].join(cwd, line[5]);
        }
      }
      var row = parseInt(line[6]);
      var column = parseInt(line[8]);
      var text = line[9];
      var range = undefined;
      if (column && column >= 0) {
        range = new _atom.Range([row - 1, column - 1], [row - 1, 1000]);
      } else {
        range = new _atom.Range([row - 1, 0], [row - 1, 1000]);
      }
      return {
        name: linterName,
        severity: 'error',
        location: { file: filePath, position: range },
        excerpt: text
      };
    }
  }, {
    key: 'hasTests',
    value: function hasTests(p) {
      if (p.endsWith('_test.go')) {
        return true;
      }
      var files = _fsExtra2['default'].readdirSync(_path2['default'].dirname(p));
      return files.some(function (f) {
        return f.endsWith('_test.go');
      });
    }
  }]);

  return Builder;
})();

exports.Builder = Builder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2J1aWxkL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7K0NBRXNCLHNDQUFzQzs7Ozt1QkFDN0MsVUFBVTs7OztrQkFDVixJQUFJOzs7O29CQUNGLE1BQU07Ozs7d0JBQ04sWUFBWTs7OztvQkFDYyxNQUFNOztxQkFDbkIsWUFBWTs7aUNBQ2hCLHVCQUF1Qjs7SUFPM0MsT0FBTztBQVFBLFdBUlAsT0FBTyxDQVNULFFBQWtCLEVBQ2xCLE1BQTRCLEVBQzVCLE1BQXFCLEVBQ3JCLFVBQW9DLEVBQ3BDOzBCQWJFLE9BQU87O0FBY1QsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTs7QUFFNUIsMEJBQUssS0FBSyxFQUFFLENBQUE7R0FDYjs7ZUFyQkcsT0FBTzs7V0F1QkosbUJBQUc7QUFDUixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUM3QjtBQUNELFVBQUk7QUFDRiw4QkFBSyxXQUFXLEVBQUUsQ0FBQTtPQUNuQixDQUFDLE9BQU8sR0FBRyxFQUFFOztBQUVaLGVBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUE7T0FDckM7S0FDRjs7O1dBRWEsMEJBQUc7QUFDZixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDNUIsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFNLENBQUMsYUFB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TSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO09BQzFELE1BQU07QUFDTCxhQUFLLEdBQUcsZ0JBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO09BQ2pEO0FBQ0QsYUFBTztBQUNMLFlBQUksRUFBRSxVQUFVO0FBQ2hCLGdCQUFRLEVBQUUsT0FBTztBQUNqQixnQkFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQzdDLGVBQU8sRUFBRSxJQUFJO09BQ2QsQ0FBQTtLQUNGOzs7V0FFTyxrQkFBQyxDQUFTLEVBQVc7QUFDM0IsVUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzFCLGVBQU8sSUFBSSxDQUFBO09BQ1o7QUFDRCxVQUFNLEtBQUssR0FBRyxxQkFBRyxXQUFXLENBQUMsa0JBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0MsYUFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQy9DOzs7U0FuVUcsT0FBTzs7O1FBc1VKLE9BQU8sR0FBUCxPQUFPIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2J1aWxkL2J1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgYXJncGFyc2VyIGZyb20gJ3lhcmdzLXBhcnNlci9saWIvdG9rZW5pemUtYXJnLXN0cmluZydcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSdcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgdGVtcCBmcm9tICdAYXRvbS90ZW1wJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgaXNWYWxpZEVkaXRvciB9IGZyb20gJy4vLi4vdXRpbHMnXG5pbXBvcnQgeyBnZXRnb3BhdGggfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnQnXG5cbmltcG9ydCB0eXBlIHsgR29Db25maWcgfSBmcm9tICcuLy4uL2NvbmZpZy9zZXJ2aWNlJ1xuaW1wb3J0IHR5cGUgeyBFeGVjdXRvck9wdGlvbnMgfSBmcm9tICcuLy4uL2NvbmZpZy9leGVjdXRvcidcbmltcG9ydCB0eXBlIHsgTGludGVyRGVsZWdhdGUsIExpbnRlclYyTWVzc2FnZSB9IGZyb20gJy4vLi4vbGludC9saW50ZXInXG5pbXBvcnQgdHlwZSB7IE91dHB1dE1hbmFnZXIgfSBmcm9tICcuLy4uL291dHB1dC1tYW5hZ2VyJ1xuXG5jbGFzcyBCdWlsZGVyIHtcbiAgZ29jb25maWc6IEdvQ29uZmlnXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgZGlzcG9zZWQ6IGJvb2xlYW5cbiAgbGludGVyOiAoKSA9PiBMaW50ZXJEZWxlZ2F0ZVxuICBvdXRwdXQ6IE91dHB1dE1hbmFnZXJcbiAgYnVzeVNpZ25hbDogKCkgPT4gP0J1c3lTaWduYWxTZXJ2aWNlXG5cbiAgY29uc3RydWN0b3IoXG4gICAgZ29jb25maWc6IEdvQ29uZmlnLFxuICAgIGxpbnRlcjogKCkgPT4gTGludGVyRGVsZWdhdGUsXG4gICAgb3V0cHV0OiBPdXRwdXRNYW5hZ2VyLFxuICAgIGJ1c3lTaWduYWw6ICgpID0+ID9CdXN5U2lnbmFsU2VydmljZVxuICApIHtcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdcbiAgICB0aGlzLmxpbnRlciA9IGxpbnRlclxuICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuYnVzeVNpZ25hbCA9IGJ1c3lTaWduYWxcblxuICAgIHRlbXAudHJhY2soKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRpc3Bvc2VkID0gdHJ1ZVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRlbXAuY2xlYW51cFN5bmMoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKCdidWlsZGVyIGNsZWFudXA6JywgZXJyKVxuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZU1lc3NhZ2VzKCkge1xuICAgIGNvbnN0IGxpbnRlciA9IHRoaXMubGludGVyKClcbiAgICBpZiAobGludGVyKSB7XG4gICAgICBsaW50ZXIuY2xlYXJNZXNzYWdlcygpXG4gICAgfVxuICB9XG5cbiAgc2V0TWVzc2FnZXMobWVzc2FnZXM6IEFycmF5PE9iamVjdD4pIHtcbiAgICBjb25zdCBsaW50ZXIgPSB0aGlzLmxpbnRlcigpXG4gICAgaWYgKGxpbnRlciAmJiBtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGxpbnRlci5zZXRBbGxNZXNzYWdlcyhtZXNzYWdlcylcbiAgICB9XG4gIH1cblxuICBhc3luYyBidWlsZChlZGl0b3I6IFRleHRFZGl0b3IsIHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghYXRvbS5jb25maWcuZ2V0KCdnby1wbHVzLmNvbmZpZy5jb21waWxlT25TYXZlJykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGVkaXRvcicpXG4gICAgfVxuICAgIHRoaXMuZGVsZXRlTWVzc2FnZXMoKVxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdvY29uZmlnLmV4ZWN1dG9yLmdldE9wdGlvbnMoJ2ZpbGUnLCBlZGl0b3IpXG4gICAgY29uc3QgY21kID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnbycpXG4gICAgaWYgKCFjbWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGZpbmQgZ28gdG9vbCcpXG4gICAgfVxuICAgIGNvbnN0IGJ1aWxkUHJvbWlzZSA9IHRoaXMubGludEluc3RhbGwoY21kLCBvcHRpb25zKVxuICAgIGNvbnN0IHRlc3RQcm9taXNlID0gdGhpcy5oYXNUZXN0cyhwYXRoKVxuICAgICAgPyB0aGlzLmxpbnRUZXN0KGNtZCwgb3B0aW9ucylcbiAgICAgIDogUHJvbWlzZS5yZXNvbHZlKHsgb3V0cHV0OiAnJywgbGludGVyTmFtZTogJ3Rlc3QnLCBleGl0Y29kZTogMCB9KVxuXG4gICAgY29uc3QgYWxsID0gUHJvbWlzZS5hbGwoW2J1aWxkUHJvbWlzZSwgdGVzdFByb21pc2VdKVxuICAgIGNvbnN0IGJzID0gdGhpcy5idXN5U2lnbmFsKClcbiAgICBjb25zdCBwID0gYnMgPyBicy5yZXBvcnRCdXN5V2hpbGUoJ0J1aWxkaW5nIEdvJywgKCkgPT4gYWxsKSA6IGFsbFxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBwXG4gICAgaWYgKCFyZXN1bHRzIHx8IHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zZXRNZXNzYWdlcyh0aGlzLmdldE1lc3NhZ2VzKHJlc3VsdHMsIG9wdGlvbnMuY3dkIHx8ICcnKSlcblxuICAgIC8vIGNoZWNrIGZvciBhbnkgbm9uLXplcm8gZXhpdCBjb2RlcyBhbmQgZXJyb3IgaWYgZm91bmRcbiAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XG4gICAgICBpZiAocmVzdWx0LmV4aXRjb2RlICE9PSAwKSB7XG4gICAgICAgIGlmICh0aGlzLm91dHB1dCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuZXhpdGNvZGUgPT09IDEyNCkge1xuICAgICAgICAgICAgbGV0IHRpbWVvdXRNc2cgPSBgJHtyZXN1bHQubGludGVyTmFtZX0gdGltZWQgb3V0YFxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGltZW91dCkge1xuICAgICAgICAgICAgICB0aW1lb3V0TXNnICs9IGAgYWZ0ZXIgJHtvcHRpb25zLnRpbWVvdXR9IG1zYFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vdXRwdXQudXBkYXRlKHtcbiAgICAgICAgICAgICAgZXhpdGNvZGU6IHJlc3VsdC5leGl0Y29kZSxcbiAgICAgICAgICAgICAgb3V0cHV0OiB0aW1lb3V0TXNnLFxuICAgICAgICAgICAgICBkaXI6IG9wdGlvbnMuY3dkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm91dHB1dC51cGRhdGUoe1xuICAgICAgICAgICAgICBleGl0Y29kZTogcmVzdWx0LmV4aXRjb2RlLFxuICAgICAgICAgICAgICBvdXRwdXQ6IHJlc3VsdC5vdXRwdXQsXG4gICAgICAgICAgICAgIGRpcjogb3B0aW9ucy5jd2RcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQub3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBpbmRpY2F0ZSB0aGF0IHdlJ3JlIGRvbmUsIHdoaWNoIGlzIGVzcGVjaWFsbHkgaW1wb3J0YW50IHdoZW4gdGVzdCBvbiBzYXZlIGlzIGRpc2FibGVkXG4gICAgLy8gKHdlIGRvbid0IHdhbnQgdG8gZ2l2ZSB0aGUgYXBwZWFyYW5jZSB0aGF0IHdlJ3JlIGNvbXBpbGluZyBpbmRlZmluaXRlbHkpXG4gICAgaWYgKHRoaXMub3V0cHV0KSB7XG4gICAgICB0aGlzLm91dHB1dC51cGRhdGUoe1xuICAgICAgICBvdXRwdXQ6IHRoaXMub3V0cHV0LnByb3BzLm91dHB1dCArICdcXG5cXG5Eb25lJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRNZXNzYWdlcyhcbiAgICByZXN1bHRzOiBBcnJheTx7IG91dHB1dDogc3RyaW5nLCBsaW50ZXJOYW1lOiBzdHJpbmcgfT4sXG4gICAgY3dkOiBzdHJpbmdcbiAgKTogQXJyYXk8TGludGVyVjJNZXNzYWdlPiB7XG4gICAgbGV0IG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJWMk1lc3NhZ2U+ID0gW11cbiAgICBmb3IgKGNvbnN0IHsgb3V0cHV0LCBsaW50ZXJOYW1lIH0gb2YgcmVzdWx0cykge1xuICAgICAgY29uc3QgbmV3TWVzc2FnZXMgPSB0aGlzLm1hcE1lc3NhZ2VzKG91dHB1dCwgY3dkLCBsaW50ZXJOYW1lKVxuICAgICAgZm9yIChjb25zdCBuZXdNZXNzYWdlIG9mIG5ld01lc3NhZ2VzKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhbWVzc2FnZXMuc29tZShtZXNzYWdlID0+IHRoaXMubWVzc2FnZUVxdWFscyhuZXdNZXNzYWdlLCBtZXNzYWdlKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWVzc2FnZXMucHVzaChuZXdNZXNzYWdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBcIig8bmFtZT4pXCIgcG9zdGZpeCB0byBlYWNoIG1lc3NhZ2VcbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgbWVzc2FnZS5leGNlcnB0ICs9ICcgKCcgKyBtZXNzYWdlLm5hbWUgKyAnKSdcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2VzXG4gIH1cblxuICBtZXNzYWdlRXF1YWxzKG0xOiBMaW50ZXJWMk1lc3NhZ2UsIG0yOiBMaW50ZXJWMk1lc3NhZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbTEubG9jYXRpb24uZmlsZSA9PT0gbTIubG9jYXRpb24uZmlsZSAmJlxuICAgICAgbTEuZXhjZXJwdCA9PT0gbTIuZXhjZXJwdCAmJlxuICAgICAgbTEubG9jYXRpb24ucG9zaXRpb24uaXNFcXVhbChtMi5sb2NhdGlvbi5wb3NpdGlvbilcbiAgICApXG4gIH1cblxuICBidWlsZENvbW1hbmQoZ29wYXRoOiBzdHJpbmcsIGN3ZDogc3RyaW5nLCBzZXA6IHN0cmluZyA9IHBhdGguc2VwKTogc3RyaW5nIHtcbiAgICBpZiAoZ29wYXRoLmVuZHNXaXRoKHNlcCkpIHtcbiAgICAgIGdvcGF0aCA9IGdvcGF0aC5zbGljZSgwLCAtMSlcbiAgICB9XG4gICAgY29uc3Qgc3JjRGlyID0gZ29wYXRoICsgc2VwICsgJ3NyYydcbiAgICByZXR1cm4gc3JjRGlyLnNwbGl0KHNlcCkuZXZlcnkoKHQsIGkpID0+IGN3ZC5zcGxpdChzZXApW2ldID09PSB0KVxuICAgICAgPyAnaW5zdGFsbCcgLy8gQ1dEIGlzIHdpdGhpbiBnb3BhdGgsIGBnbyBpbnN0YWxsYCB0byBrZWVwIGdvY29kZSB1cCB0byBkYXRlXG4gICAgICA6ICdidWlsZCcgLy8gQ1dEIGlzIG91dHNpZGUgZ29wYXRoLCBgZ28gYnVpbGRgIHdpbGwgc3VmZmljZVxuICB9XG5cbiAgYXN5bmMgbGludEluc3RhbGwoY21kOiBzdHJpbmcsIG9wdGlvbnM6IEV4ZWN1dG9yT3B0aW9ucykge1xuICAgIG9wdGlvbnMudGltZW91dCA9XG4gICAgICAoYXRvbS5jb25maWcuZ2V0KCdnby1wbHVzLmNvbmZpZy5idWlsZFRpbWVvdXQnKTogYW55KSB8fCAxMDAwMFxuICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmJ1aWxkQ29tbWFuZChnZXRnb3BhdGgoKSwgb3B0aW9ucy5jd2QgfHwgJycpXG4gICAgY29uc3QgYnVpbGRBcmdzID0gW2NvbW1hbmRdXG4gICAgbGV0IG91dEZpbGVcbiAgICBpZiAoY29tbWFuZCA9PT0gJ2J1aWxkJykge1xuICAgICAgb3V0RmlsZSA9IHRoaXMub3V0RmlsZSgpXG4gICAgICBidWlsZEFyZ3MucHVzaCgnLW8nKVxuICAgICAgYnVpbGRBcmdzLnB1c2gob3V0RmlsZSlcbiAgICB9XG4gICAgY29uc3QgYWRkaXRpb25hbEFyZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2dvLXBsdXMuY29uZmlnLmFkZGl0aW9uYWxCdWlsZEFyZ3MnKVxuICAgIGlmIChhZGRpdGlvbmFsQXJncyAmJiBhZGRpdGlvbmFsQXJncy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IGFyZ3BhcnNlcihhZGRpdGlvbmFsQXJncylcbiAgICAgIGJ1aWxkQXJncy5wdXNoKC4uLnBhcnNlZClcbiAgICB9XG5cbiAgICAvLyBJbmNsdWRlIHRoZSAtaSBmbGFnIHdpdGggZ28gaW5zdGFsbC5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tZGVtcHNreS9nb2NvZGUvaXNzdWVzLzc5XG4gICAgaWYgKGNvbW1hbmQgPT09ICdpbnN0YWxsJyAmJiAhYnVpbGRBcmdzLmluY2x1ZGVzKCctaScpKSB7XG4gICAgICBidWlsZEFyZ3MucHVzaCgnLWknKVxuICAgIH1cblxuICAgIGJ1aWxkQXJncy5wdXNoKCcuJylcbiAgICB0aGlzLm91dHB1dC51cGRhdGUoe1xuICAgICAgb3V0cHV0OiAnUnVubmluZyBnbyAnICsgYnVpbGRBcmdzLmpvaW4oJyAnKSxcbiAgICAgIGV4aXRjb2RlOiAwXG4gICAgfSlcblxuICAgIGNvbnN0IHIgPSBhd2FpdCB0aGlzLmdvY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCBidWlsZEFyZ3MsIG9wdGlvbnMpXG4gICAgY29uc3Qgc3Rkb3V0ID0gci5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZG91dC50b1N0cmluZygpIDogci5zdGRvdXRcbiAgICBpZiAoc3Rkb3V0ICYmIHN0ZG91dC50cmltKCkgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLmxvZygnZ28gJyArIGNvbW1hbmQgKyAnOiAoc3Rkb3V0KSAnICsgc3Rkb3V0KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gICAgbGV0IHN0ZGVyciA9IChyLnN0ZGVyciBpbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgPyByLnN0ZGVyci50b1N0cmluZygpXG4gICAgICA6IHIuc3RkZXJyXG4gICAgKS50cmltKClcblxuICAgIC8vIGNsZWFudXAgYW55IHRlbXAgZmlsZXNcbiAgICBpZiAob3V0RmlsZSAmJiBvdXRGaWxlICE9PSAnL2Rldi9udWxsJyAmJiByLmV4aXRjb2RlID09PSAwKSB7XG4gICAgICBmcy5yZW1vdmUob3V0RmlsZSlcbiAgICB9XG5cbiAgICBsZXQgZXhpdGNvZGUgPSByLmV4aXRjb2RlXG4gICAgaWYgKHN0ZGVyci5pbmRleE9mKCdubyBub24tdGVzdCBHbyBmaWxlcyBpbicpID49IDApIHtcbiAgICAgIC8vIHBrZ3MgbWF5IG9ubHkgY29udGFpbiBnbyB0ZXN0IGZpbGVzIChlLmcuIGludGVncmF0aW9uIHRlc3RzKVxuICAgICAgLy8gaWdub3JlIHRoaXMgZXJyb3IgYmVjYXVzZSB0aGUgdGVzdCBidWlsZGVyIHJlcG9ydHMgdGhlIGVycm9ycyB0aGVuLlxuICAgICAgc3RkZXJyID0gJydcbiAgICAgIGV4aXRjb2RlID0gMFxuICAgIH1cbiAgICByZXR1cm4geyBvdXRwdXQ6IHN0ZGVyciwgbGludGVyTmFtZTogJ2J1aWxkJywgZXhpdGNvZGUgfVxuICB9XG5cbiAgb3V0RmlsZSgpOiBzdHJpbmcge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICByZXR1cm4gdGVtcC5wYXRoKHsgcHJlZml4OiAnZ28tcGx1cy10ZXN0JyB9KVxuICAgIH1cbiAgICByZXR1cm4gJy9kZXYvbnVsbCdcbiAgfVxuXG4gIHRlc3RDb21waWxlQXJncyhvdXRGaWxlOiBzdHJpbmcsIGFkZGl0aW9uYWxBcmdzOiBzdHJpbmcgPSAnJyk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IFsndGVzdCddXG4gICAgLy8gdXNlIGFkZGl0aW9uYWwgYnVpbGQgYXJncyBldmVuIHdoZW4gd2UgY29tcGlsZSB0aGUgdGVzdHNcbiAgICBpZiAoYWRkaXRpb25hbEFyZ3MgJiYgYWRkaXRpb25hbEFyZ3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBhcmdwYXJzZXIoYWRkaXRpb25hbEFyZ3MpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnNlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocGFyc2VkW2ldID09PSAnLW8nKSB7XG4gICAgICAgICAgLy8gd2UnbGwgdGFrZSBjYXJlIG9mIHRoaXMgb25lLCBza2lwIG92ZXIgdGhlIC1vIGZsYWdcbiAgICAgICAgICBpKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKHBhcnNlZFtpXSA9PT0gJy1jJykge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VkW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKCctYycsICctbycsIG91dEZpbGUsICcuJylcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBhc3luYyBsaW50VGVzdChjbWQ6IHN0cmluZywgb3B0aW9uczogRXhlY3V0b3JPcHRpb25zKSB7XG4gICAgY29uc3Qgb3V0RmlsZSA9IHRoaXMub3V0RmlsZSgpXG4gICAgY29uc3QgYWRkaXRpb25hbEFyZ3MgPSAoYXRvbS5jb25maWcuZ2V0KFxuICAgICAgJ2dvLXBsdXMuY29uZmlnLmFkZGl0aW9uYWxUZXN0QXJncydcbiAgICApOiBhbnkpXG4gICAgY29uc3QgdGVzdEFyZ3MgPSB0aGlzLnRlc3RDb21waWxlQXJncyhvdXRGaWxlLCBhZGRpdGlvbmFsQXJncylcblxuICAgIHRoaXMub3V0cHV0LnVwZGF0ZSh7XG4gICAgICBvdXRwdXQ6ICdDb21waWxpbmcgdGVzdHM6JyArIG9zLkVPTCArICckIGdvICcgKyB0ZXN0QXJncy5qb2luKCcgJyksXG4gICAgICBleGl0Y29kZTogMFxuICAgIH0pXG4gICAgY29uc3QgciA9IGF3YWl0IHRoaXMuZ29jb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIHRlc3RBcmdzLCBvcHRpb25zKVxuICAgIGNvbnN0IHN0ZG91dCA9IHIuc3Rkb3V0IGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRvdXQudG9TdHJpbmcoKSA6IHIuc3Rkb3V0XG4gICAgY29uc3Qgc3RkZXJyID0gci5zdGRlcnIgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZGVyci50b1N0cmluZygpIDogci5zdGRlcnJcbiAgICBpZiAoc3Rkb3V0ICYmIHN0ZG91dC50cmltKCkgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLmxvZygnZ28gdGVzdDogKHN0ZG91dCkgJyArIHN0ZG91dCkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfVxuICAgIGlmIChvdXRGaWxlICYmIG91dEZpbGUgIT09ICcvZGV2L251bGwnICYmIHIuZXhpdGNvZGUgPT09IDApIHtcbiAgICAgIGZzLnJlbW92ZShvdXRGaWxlKVxuICAgIH1cbiAgICByZXR1cm4geyBvdXRwdXQ6IHN0ZGVyci50cmltKCksIGxpbnRlck5hbWU6ICd0ZXN0JywgZXhpdGNvZGU6IHIuZXhpdGNvZGUgfVxuICB9XG5cbiAgbWFwTWVzc2FnZXMoXG4gICAgZGF0YTogc3RyaW5nLFxuICAgIGN3ZDogc3RyaW5nLFxuICAgIGxpbnRlck5hbWU6IHN0cmluZ1xuICApOiBBcnJheTxMaW50ZXJWMk1lc3NhZ2U+IHtcbiAgICBjb25zdCBwYXR0ZXJuID0gL14oKCMpXFxzKC4qKT8pfCgoLio/KTooXFxkKj8pOigoXFxkKj8pOik/XFxzKCguKik/KChcXG5cXHQuKikrKT8pKS9naW1cbiAgICBjb25zdCBtZXNzYWdlcyA9IFtdXG4gICAgbGV0IG1hdGNoXG4gICAgZm9yIChcbiAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKGRhdGEpO1xuICAgICAgbWF0Y2ggIT09IG51bGw7XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyhkYXRhKVxuICAgICkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuZXh0cmFjdE1lc3NhZ2UobWF0Y2gsIGN3ZCwgbGludGVyTmFtZSlcbiAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2VzXG4gIH1cblxuICBleHRyYWN0TWVzc2FnZShcbiAgICBsaW5lOiBBcnJheTxzdHJpbmc+LFxuICAgIGN3ZDogc3RyaW5nLFxuICAgIGxpbnRlck5hbWU6IHN0cmluZ1xuICApOiA/TGludGVyVjJNZXNzYWdlIHtcbiAgICBpZiAoIWxpbmUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAobGluZVsyXSAmJiBsaW5lWzJdID09PSAnIycpIHtcbiAgICAgIC8vIEZvdW5kIEEgUGFja2FnZSBJbmRpY2F0b3IsIFNraXAgRm9yIE5vd1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBmaWxlUGF0aCA9ICcnXG4gICAgaWYgKGxpbmVbNV0gJiYgbGluZVs1XSAhPT0gJycpIHtcbiAgICAgIGlmIChwYXRoLmlzQWJzb2x1dGUobGluZVs1XSkpIHtcbiAgICAgICAgZmlsZVBhdGggPSBsaW5lWzVdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihjd2QsIGxpbmVbNV0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJvdyA9IHBhcnNlSW50KGxpbmVbNl0pXG4gICAgY29uc3QgY29sdW1uID0gcGFyc2VJbnQobGluZVs4XSlcbiAgICBjb25zdCB0ZXh0ID0gbGluZVs5XVxuICAgIGxldCByYW5nZVxuICAgIGlmIChjb2x1bW4gJiYgY29sdW1uID49IDApIHtcbiAgICAgIHJhbmdlID0gbmV3IFJhbmdlKFtyb3cgLSAxLCBjb2x1bW4gLSAxXSwgW3JvdyAtIDEsIDEwMDBdKVxuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZSA9IG5ldyBSYW5nZShbcm93IC0gMSwgMF0sIFtyb3cgLSAxLCAxMDAwXSlcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGxpbnRlck5hbWUsXG4gICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IGZpbGVQYXRoLCBwb3NpdGlvbjogcmFuZ2UgfSxcbiAgICAgIGV4Y2VycHQ6IHRleHRcbiAgICB9XG4gIH1cblxuICBoYXNUZXN0cyhwOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAocC5lbmRzV2l0aCgnX3Rlc3QuZ28nKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhwYXRoLmRpcm5hbWUocCkpXG4gICAgcmV0dXJuIGZpbGVzLnNvbWUoZiA9PiBmLmVuZHNXaXRoKCdfdGVzdC5nbycpKVxuICB9XG59XG5cbmV4cG9ydCB7IEJ1aWxkZXIgfVxuIl19