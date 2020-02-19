Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _simpleDialog = require('./../simple-dialog');

var _utils = require('../utils');

var Gorename = (function () {
  function Gorename(goconfig) {
    var _this = this;

    _classCallCheck(this, Gorename);

    this.goconfig = goconfig;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'golang:gorename', function () {
      return _this.commandInvoked();
    }));
  }

  _createClass(Gorename, [{
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'commandInvoked',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      if (!editor || !(0, _utils.isValidEditor)(editor)) {
        return;
      }
      try {
        var _ret = yield* (function* () {
          var cmd = yield _this2.goconfig.locator.findTool('gorename');
          if (!cmd) {
            return {
              v: undefined
            };
          }

          var _wordAndOffset = (0, _utils.wordAndOffset)(editor);

          var word = _wordAndOffset.word;
          var offset = _wordAndOffset.offset;

          var cursor = editor.getCursorBufferPosition();

          var dialog = new _simpleDialog.SimpleDialog({
            prompt: 'Rename ' + word + ' to:',
            initialValue: word,
            onConfirm: function onConfirm(newName) {
              _this2.saveAllEditors().then(function () {
                var file = editor.getBuffer().getPath();
                if (!file) {
                  return;
                }
                var cwd = _path2['default'].dirname(file);

                // restore cursor position after gorename completes and the buffer is reloaded
                if (cursor) {
                  (function () {
                    var disp = editor.getBuffer().onDidReload(function () {
                      editor.setCursorBufferPosition(cursor, { autoscroll: false });
                      var element = atom.views.getView(editor);
                      if (element) {
                        element.focus();
                      }
                      disp.dispose();
                    });
                  })();
                }
                _this2.runGorename(file, offset, cwd, newName, cmd);
                return;
              })['catch'](function (e) {
                return console.log(e);
              }); // eslint-disable-line no-console
            },
            onCancel: function onCancel() {
              editor.setCursorBufferPosition(cursor, { autoscroll: false });
              var element = atom.views.getView(editor);
              if (element) {
                element.focus();
              }
            }
          });

          dialog.attach();
        })();

        if (typeof _ret === 'object') return _ret.v;
      } catch (e) {
        if (e.handle) {
          e.handle();
        }
        console.log(e); // eslint-disable-line no-console
      }
    })
  }, {
    key: 'saveAllEditors',
    value: function saveAllEditors() {
      var promises = [];
      for (var editor of atom.workspace.getTextEditors()) {
        if (editor.isModified() && (0, _utils.isValidEditor)(editor)) {
          promises.push(editor.save());
        }
      }
      return Promise.all(promises);
    }
  }, {
    key: 'runGorename',
    value: _asyncToGenerator(function* (file, offset, cwd, newName, cmd) {
      if (!this.goconfig || !this.goconfig.executor) {
        return { success: false, result: null };
      }

      var args = ['-offset', file + ':#' + offset, '-to', newName];
      var options = {
        cwd: cwd,
        env: this.goconfig.environment(),
        timeout: 20000
      };
      var notification = atom.notifications.addInfo('Renaming...', {
        dismissable: true
      });
      var r = yield this.goconfig.executor.exec(cmd, args, options);
      notification.dismiss();
      if (r.exitcode === 124) {
        atom.notifications.addError('Operation timed out', {
          detail: 'gorename ' + args.join(' '),
          dismissable: true
        });
        return { success: false, result: r };
      } else if (r.error) {
        if (r.error.code === 'ENOENT') {
          atom.notifications.addError('Missing Rename Tool', {
            detail: 'The gorename tool is required to perform a rename. Please run go get -u golang.org/x/tools/cmd/gorename to get it.',
            dismissable: true
          });
        } else {
          atom.notifications.addError('Rename Error', {
            detail: r.error.message,
            dismissable: true
          });
        }
        return { success: false, result: r };
      }

      var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      var message = stderr.trim() + '\r\n' + stdout.trim();
      if (r.exitcode !== 0 || stderr && stderr.trim() !== '') {
        atom.notifications.addWarning('Rename Error', {
          detail: message.trim(),
          dismissable: true
        });
        return { success: false, result: r };
      }

      atom.notifications.addSuccess(message.trim());
      return { success: true, result: r };
    })
  }]);

  return Gorename;
})();

exports.Gorename = Gorename;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3JlbmFtZS9nb3JlbmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7b0JBQ2EsTUFBTTs7NEJBQ2Isb0JBQW9COztxQkFDSixVQUFVOztJQUlqRCxRQUFRO0FBSUQsV0FKUCxRQUFRLENBSUEsUUFBa0IsRUFBRTs7OzBCQUo1QixRQUFROztBQUtWLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFO2FBQ3ZELE1BQUssY0FBYyxFQUFFO0tBQUEsQ0FDdEIsQ0FDRixDQUFBO0dBQ0Y7O2VBWkcsUUFBUTs7V0FjTCxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7Ozs2QkFFbUIsYUFBRzs7O0FBQ3JCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsMEJBQWMsTUFBTSxDQUFDLEVBQUU7QUFDckMsZUFBTTtPQUNQO0FBQ0QsVUFBSTs7QUFDRixjQUFNLEdBQUcsR0FBRyxNQUFNLE9BQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDNUQsY0FBSSxDQUFDLEdBQUcsRUFBRTtBQUNSOztjQUFNO1dBQ1A7OytCQUN3QiwwQkFBYyxNQUFNLENBQUM7O2NBQXRDLElBQUksa0JBQUosSUFBSTtjQUFFLE1BQU0sa0JBQU4sTUFBTTs7QUFDcEIsY0FBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUE7O0FB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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgU2ltcGxlRGlhbG9nIH0gZnJvbSAnLi8uLi9zaW1wbGUtZGlhbG9nJ1xuaW1wb3J0IHsgaXNWYWxpZEVkaXRvciwgd29yZEFuZE9mZnNldCB9IGZyb20gJy4uL3V0aWxzJ1xuXG5pbXBvcnQgdHlwZSB7IEdvQ29uZmlnIH0gZnJvbSAnLi8uLi9jb25maWcvc2VydmljZSdcblxuY2xhc3MgR29yZW5hbWUge1xuICBnb2NvbmZpZzogR29Db25maWdcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKGdvY29uZmlnOiBHb0NvbmZpZykge1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnZ29sYW5nOmdvcmVuYW1lJywgKCkgPT5cbiAgICAgICAgdGhpcy5jb21tYW5kSW52b2tlZCgpXG4gICAgICApXG4gICAgKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICBhc3luYyBjb21tYW5kSW52b2tlZCgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvciB8fCAhaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNtZCA9IGF3YWl0IHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29yZW5hbWUnKVxuICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCB7IHdvcmQsIG9mZnNldCB9ID0gd29yZEFuZE9mZnNldChlZGl0b3IpXG4gICAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgICBjb25zdCBkaWFsb2cgPSBuZXcgU2ltcGxlRGlhbG9nKHtcbiAgICAgICAgcHJvbXB0OiBgUmVuYW1lICR7d29yZH0gdG86YCxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiB3b3JkLFxuICAgICAgICBvbkNvbmZpcm06IG5ld05hbWUgPT4ge1xuICAgICAgICAgIHRoaXMuc2F2ZUFsbEVkaXRvcnMoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldFBhdGgoKVxuICAgICAgICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBjd2QgPSBwYXRoLmRpcm5hbWUoZmlsZSlcblxuICAgICAgICAgICAgICAvLyByZXN0b3JlIGN1cnNvciBwb3NpdGlvbiBhZnRlciBnb3JlbmFtZSBjb21wbGV0ZXMgYW5kIHRoZSBidWZmZXIgaXMgcmVsb2FkZWRcbiAgICAgICAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3AgPSBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRSZWxvYWQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGN1cnNvciwgeyBhdXRvc2Nyb2xsOiBmYWxzZSB9KVxuICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmZvY3VzKClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGRpc3AuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnJ1bkdvcmVuYW1lKGZpbGUsIG9mZnNldCwgY3dkLCBuZXdOYW1lLCBjbWQpXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IGNvbnNvbGUubG9nKGUpKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfSxcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oY3Vyc29yLCB7IGF1dG9zY3JvbGw6IGZhbHNlIH0pXG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZGlhbG9nLmF0dGFjaCgpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuaGFuZGxlKSB7XG4gICAgICAgIGUuaGFuZGxlKClcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGUpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH1cbiAgfVxuXG4gIHNhdmVBbGxFZGl0b3JzKCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gW11cbiAgICBmb3IgKGNvbnN0IGVkaXRvciBvZiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpKSB7XG4gICAgICBpZiAoZWRpdG9yLmlzTW9kaWZpZWQoKSAmJiBpc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChlZGl0b3Iuc2F2ZSgpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gIH1cblxuICBhc3luYyBydW5Hb3JlbmFtZShcbiAgICBmaWxlOiBzdHJpbmcsXG4gICAgb2Zmc2V0OiBudW1iZXIsXG4gICAgY3dkOiBzdHJpbmcsXG4gICAgbmV3TmFtZTogc3RyaW5nLFxuICAgIGNtZDogc3RyaW5nXG4gICkge1xuICAgIGlmICghdGhpcy5nb2NvbmZpZyB8fCAhdGhpcy5nb2NvbmZpZy5leGVjdXRvcikge1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIHJlc3VsdDogbnVsbCB9XG4gICAgfVxuXG4gICAgY29uc3QgYXJncyA9IFsnLW9mZnNldCcsIGAke2ZpbGV9OiMke29mZnNldH1gLCAnLXRvJywgbmV3TmFtZV1cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgY3dkOiBjd2QsXG4gICAgICBlbnY6IHRoaXMuZ29jb25maWcuZW52aXJvbm1lbnQoKSxcbiAgICAgIHRpbWVvdXQ6IDIwMDAwXG4gICAgfVxuICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdSZW5hbWluZy4uLicsIHtcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSlcbiAgICBjb25zdCByID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywgb3B0aW9ucylcbiAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgaWYgKHIuZXhpdGNvZGUgPT09IDEyNCkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPcGVyYXRpb24gdGltZWQgb3V0Jywge1xuICAgICAgICBkZXRhaWw6ICdnb3JlbmFtZSAnICsgYXJncy5qb2luKCcgJyksXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIHJlc3VsdDogciB9XG4gICAgfSBlbHNlIGlmIChyLmVycm9yKSB7XG4gICAgICBpZiAoci5lcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ01pc3NpbmcgUmVuYW1lIFRvb2wnLCB7XG4gICAgICAgICAgZGV0YWlsOlxuICAgICAgICAgICAgJ1RoZSBnb3JlbmFtZSB0b29sIGlzIHJlcXVpcmVkIHRvIHBlcmZvcm0gYSByZW5hbWUuIFBsZWFzZSBydW4gZ28gZ2V0IC11IGdvbGFuZy5vcmcveC90b29scy9jbWQvZ29yZW5hbWUgdG8gZ2V0IGl0LicsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVuYW1lIEVycm9yJywge1xuICAgICAgICAgIGRldGFpbDogci5lcnJvci5tZXNzYWdlLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiByIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGRlcnIgPSByLnN0ZGVyciBpbnN0YW5jZW9mIEJ1ZmZlciA/IHIuc3RkZXJyLnRvU3RyaW5nKCkgOiByLnN0ZGVyclxuICAgIGNvbnN0IHN0ZG91dCA9IHIuc3Rkb3V0IGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRvdXQudG9TdHJpbmcoKSA6IHIuc3Rkb3V0XG4gICAgY29uc3QgbWVzc2FnZSA9IHN0ZGVyci50cmltKCkgKyAnXFxyXFxuJyArIHN0ZG91dC50cmltKClcbiAgICBpZiAoci5leGl0Y29kZSAhPT0gMCB8fCAoc3RkZXJyICYmIHN0ZGVyci50cmltKCkgIT09ICcnKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1JlbmFtZSBFcnJvcicsIHtcbiAgICAgICAgZGV0YWlsOiBtZXNzYWdlLnRyaW0oKSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiByIH1cbiAgICB9XG5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhtZXNzYWdlLnRyaW0oKSlcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCByZXN1bHQ6IHIgfVxuICB9XG59XG5cbmV4cG9ydCB7IEdvcmVuYW1lIH1cbiJdfQ==