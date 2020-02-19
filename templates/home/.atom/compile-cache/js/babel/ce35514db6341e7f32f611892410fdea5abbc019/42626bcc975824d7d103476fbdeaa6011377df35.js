Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

    this.emitter = new _atom.Emitter();
    this.linters = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.activeNotifications = new Set();

    this.subscriptions.add(atom.config.observe('linter.lintOnChange', function (lintOnChange) {
      _this.lintOnChange = lintOnChange;
    }));
    this.subscriptions.add(atom.config.observe('core.excludeVcsIgnoredPaths', function (ignoreVCS) {
      _this.ignoreVCS = ignoreVCS;
    }));
    this.subscriptions.add(atom.config.observe('linter.ignoreGlob', function (ignoreGlob) {
      _this.ignoreGlob = ignoreGlob;
    }));
    this.subscriptions.add(atom.config.observe('linter.lintPreviewTabs', function (lintPreviewTabs) {
      _this.lintPreviewTabs = lintPreviewTabs;
    }));
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      if (!Validate.linter(linter)) {
        return;
      }
      linter[_helpers.$activated] = true;
      if (typeof linter[_helpers.$requestLatest] === 'undefined') {
        linter[_helpers.$requestLatest] = 0;
      }
      if (typeof linter[_helpers.$requestLastReceived] === 'undefined') {
        linter[_helpers.$requestLastReceived] = 0;
      }
      linter[_helpers.$version] = 2;
      this.linters.add(linter);
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.linters);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (!this.linters.has(linter)) {
        return;
      }
      linter[_helpers.$activated] = false;
      this.linters['delete'](linter);
    }
  }, {
    key: 'lint',
    value: _asyncToGenerator(function* (_ref) {
      var onChange = _ref.onChange;
      var editor = _ref.editor;
      return yield* (function* () {
        var _this2 = this;

        var filePath = editor.getPath();

        if (onChange && !this.lintOnChange || // Lint-on-change mismatch
        // Ignored by VCS, Glob, or simply not saved anywhere yet
        Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS) || !this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor // Ignore Preview tabs
        ) {
            return false;
          }

        var scopes = Helpers.getEditorCursorScopes(editor);

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (_this2.disabledProviders.includes(linter.name)) {
            return 'continue';
          }
          var number = ++linter[_helpers.$requestLatest];
          var statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
          var statusFilePath = linter.scope === 'file' ? filePath : null;

          _this2.emitter.emit('did-begin-linting', { number: number, linter: linter, filePath: statusFilePath });
          promises.push(new Promise(function (resolve) {
            // $FlowIgnore: Type too complex, duh
            resolve(linter.lint(editor));
          }).then(function (messages) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            if (linter[_helpers.$requestLastReceived] >= number || !linter[_helpers.$activated] || statusBuffer && !statusBuffer.isAlive()) {
              return;
            }
            linter[_helpers.$requestLastReceived] = number;
            if (statusBuffer && !statusBuffer.isAlive()) {
              return;
            }

            if (messages === null) {
              // NOTE: Do NOT update the messages when providers return null
              return;
            }

            var validity = true;
            // NOTE: We are calling it when results are not an array to show a nice notification
            if (atom.inDevMode() || !Array.isArray(messages)) {
              validity = Validate.messages(linter.name, messages);
            }
            if (!validity) {
              return;
            }

            Helpers.normalizeMessages(linter.name, messages);
            _this2.emitter.emit('did-update-messages', { messages: messages, linter: linter, buffer: statusBuffer });
          }, function (error) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });

            console.error('[Linter] Error running ' + linter.name, error);
            var notificationMessage = '[Linter] Error running ' + linter.name;
            if (Array.from(_this2.activeNotifications).some(function (item) {
              return item.getOptions().detail === notificationMessage;
            })) {
              // This message is still showing to the user!
              return;
            }

            var notification = atom.notifications.addError(notificationMessage, {
              detail: 'See Console for more info.',
              dismissable: true,
              buttons: [{
                text: 'Open Console',
                onDidClick: function onDidClick() {
                  atom.openDevTools();
                  notification.dismiss();
                }
              }, {
                text: 'Cancel',
                onDidClick: function onDidClick() {
                  notification.dismiss();
                }
              }]
            });
          }));
        };

        for (var linter of this.linters) {
          var _ret = _loop(linter);

          if (_ret === 'continue') continue;
        }

        yield Promise.all(promises);
        return true;
      }).apply(this, arguments);
    })
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'onDidBeginLinting',
    value: function onDidBeginLinting(callback) {
      return this.emitter.on('did-begin-linting', callback);
    }
  }, {
    key: 'onDidFinishLinting',
    value: function onDidFinishLinting(callback) {
      return this.emitter.on('did-finish-linting', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.activeNotifications.forEach(function (notification) {
        return notification.dismiss();
      });
      this.activeNotifications.clear();
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUc2QyxNQUFNOzt1QkFHMUIsV0FBVzs7SUFBeEIsT0FBTzs7d0JBQ08sWUFBWTs7SUFBMUIsUUFBUTs7SUFJZCxjQUFjO0FBV1AsV0FYUCxjQUFjLEdBV0o7OzswQkFYVixjQUFjOztBQVloQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXBDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxVQUFBLFlBQVksRUFBSTtBQUN6RCxZQUFLLFlBQVksR0FBRyxZQUFZLENBQUE7S0FDakMsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsVUFBQSxTQUFTLEVBQUk7QUFDOUQsWUFBSyxTQUFTLEdBQUcsU0FBUyxDQUFBO0tBQzNCLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQUEsVUFBVSxFQUFJO0FBQ3JELFlBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtLQUM3QixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3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eXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZHVwbGljYXRlcyAqL1xuXG5pbXBvcnQgeyBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciwgRGlzcG9zYWJsZSwgTm90aWZpY2F0aW9uIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgKiBhcyBWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHsgJHZlcnNpb24sICRhY3RpdmF0ZWQsICRyZXF1ZXN0TGF0ZXN0LCAkcmVxdWVzdExhc3RSZWNlaXZlZCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgTGludGVyUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIGxpbnRlcnM6IFNldDxMaW50ZXI+XG4gIGxpbnRPbkNoYW5nZTogYm9vbGVhblxuICBpZ25vcmVWQ1M6IGJvb2xlYW5cbiAgaWdub3JlR2xvYjogc3RyaW5nXG4gIGxpbnRQcmV2aWV3VGFiczogYm9vbGVhblxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGRpc2FibGVkUHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+XG4gIGFjdGl2ZU5vdGlmaWNhdGlvbnM6IFNldDxOb3RpZmljYXRpb24+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubGludGVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmFjdGl2ZU5vdGlmaWNhdGlvbnMgPSBuZXcgU2V0KClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIubGludE9uQ2hhbmdlJywgbGludE9uQ2hhbmdlID0+IHtcbiAgICAgICAgdGhpcy5saW50T25DaGFuZ2UgPSBsaW50T25DaGFuZ2VcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJywgaWdub3JlVkNTID0+IHtcbiAgICAgICAgdGhpcy5pZ25vcmVWQ1MgPSBpZ25vcmVWQ1NcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlnbm9yZUdsb2InLCBpZ25vcmVHbG9iID0+IHtcbiAgICAgICAgdGhpcy5pZ25vcmVHbG9iID0gaWdub3JlR2xvYlxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIubGludFByZXZpZXdUYWJzJywgbGludFByZXZpZXdUYWJzID0+IHtcbiAgICAgICAgdGhpcy5saW50UHJldmlld1RhYnMgPSBsaW50UHJldmlld1RhYnNcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJywgZGlzYWJsZWRQcm92aWRlcnMgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVkUHJvdmlkZXJzID0gZGlzYWJsZWRQcm92aWRlcnNcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBoYXNMaW50ZXIobGludGVyOiBMaW50ZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpXG4gIH1cbiAgYWRkTGludGVyKGxpbnRlcjogTGludGVyKSB7XG4gICAgaWYgKCFWYWxpZGF0ZS5saW50ZXIobGludGVyKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxpbnRlclskYWN0aXZhdGVkXSA9IHRydWVcbiAgICBpZiAodHlwZW9mIGxpbnRlclskcmVxdWVzdExhdGVzdF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsaW50ZXJbJHJlcXVlc3RMYXRlc3RdID0gMFxuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID0gMFxuICAgIH1cbiAgICBsaW50ZXJbJHZlcnNpb25dID0gMlxuICAgIHRoaXMubGludGVycy5hZGQobGludGVyKVxuICB9XG4gIGdldFByb3ZpZGVycygpOiBBcnJheTxMaW50ZXI+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmxpbnRlcnMpXG4gIH1cbiAgZGVsZXRlTGludGVyKGxpbnRlcjogTGludGVyKSB7XG4gICAgaWYgKCF0aGlzLmxpbnRlcnMuaGFzKGxpbnRlcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsaW50ZXJbJGFjdGl2YXRlZF0gPSBmYWxzZVxuICAgIHRoaXMubGludGVycy5kZWxldGUobGludGVyKVxuICB9XG4gIGFzeW5jIGxpbnQoeyBvbkNoYW5nZSwgZWRpdG9yIH06IHsgb25DaGFuZ2U6IGJvb2xlYW4sIGVkaXRvcjogVGV4dEVkaXRvciB9KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICBpZiAoXG4gICAgICAob25DaGFuZ2UgJiYgIXRoaXMubGludE9uQ2hhbmdlKSB8fCAvLyBMaW50LW9uLWNoYW5nZSBtaXNtYXRjaFxuICAgICAgLy8gSWdub3JlZCBieSBWQ1MsIEdsb2IsIG9yIHNpbXBseSBub3Qgc2F2ZWQgYW55d2hlcmUgeWV0XG4gICAgICBIZWxwZXJzLmlzUGF0aElnbm9yZWQoZWRpdG9yLmdldFBhdGgoKSwgdGhpcy5pZ25vcmVHbG9iLCB0aGlzLmlnbm9yZVZDUykgfHxcbiAgICAgICghdGhpcy5saW50UHJldmlld1RhYnMgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldFBlbmRpbmdJdGVtKCkgPT09IGVkaXRvcikgLy8gSWdub3JlIFByZXZpZXcgdGFic1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVzID0gSGVscGVycy5nZXRFZGl0b3JDdXJzb3JTY29wZXMoZWRpdG9yKVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIGZvciAoY29uc3QgbGludGVyIG9mIHRoaXMubGludGVycykge1xuICAgICAgaWYgKCFIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyLCBvbkNoYW5nZSwgc2NvcGVzKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWRQcm92aWRlcnMuaW5jbHVkZXMobGludGVyLm5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBudW1iZXIgPSArK2xpbnRlclskcmVxdWVzdExhdGVzdF1cbiAgICAgIGNvbnN0IHN0YXR1c0J1ZmZlciA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZWRpdG9yLmdldEJ1ZmZlcigpIDogbnVsbFxuICAgICAgY29uc3Qgc3RhdHVzRmlsZVBhdGggPSBsaW50ZXIuc2NvcGUgPT09ICdmaWxlJyA/IGZpbGVQYXRoIDogbnVsbFxuXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWJlZ2luLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgIHByb21pc2VzLnB1c2goXG4gICAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAvLyAkRmxvd0lnbm9yZTogVHlwZSB0b28gY29tcGxleCwgZHVoXG4gICAgICAgICAgcmVzb2x2ZShsaW50ZXIubGludChlZGl0b3IpKVxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgIG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZmluaXNoLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgICAgICAgIGlmIChsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID49IG51bWJlciB8fCAhbGludGVyWyRhY3RpdmF0ZWRdIHx8IChzdGF0dXNCdWZmZXIgJiYgIXN0YXR1c0J1ZmZlci5pc0FsaXZlKCkpKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9IG51bWJlclxuICAgICAgICAgICAgaWYgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIC8vIE5PVEU6IERvIE5PVCB1cGRhdGUgdGhlIG1lc3NhZ2VzIHdoZW4gcHJvdmlkZXJzIHJldHVybiBudWxsXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsaWRpdHkgPSB0cnVlXG4gICAgICAgICAgICAvLyBOT1RFOiBXZSBhcmUgY2FsbGluZyBpdCB3aGVuIHJlc3VsdHMgYXJlIG5vdCBhbiBhcnJheSB0byBzaG93IGEgbmljZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICB2YWxpZGl0eSA9IFZhbGlkYXRlLm1lc3NhZ2VzKGxpbnRlci5uYW1lLCBtZXNzYWdlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdmFsaWRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXMobGludGVyLm5hbWUsIG1lc3NhZ2VzKVxuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlcjogc3RhdHVzQnVmZmVyIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWZpbmlzaC1saW50aW5nJywgeyBudW1iZXIsIGxpbnRlciwgZmlsZVBhdGg6IHN0YXR1c0ZpbGVQYXRoIH0pXG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMaW50ZXJdIEVycm9yIHJ1bm5pbmcgJHtsaW50ZXIubmFtZX1gLCBlcnJvcilcbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbk1lc3NhZ2UgPSBgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWBcbiAgICAgICAgICAgIGlmIChBcnJheS5mcm9tKHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucykuc29tZShpdGVtID0+IGl0ZW0uZ2V0T3B0aW9ucygpLmRldGFpbCA9PT0gbm90aWZpY2F0aW9uTWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBtZXNzYWdlIGlzIHN0aWxsIHNob3dpbmcgdG8gdGhlIHVzZXIhXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3Iobm90aWZpY2F0aW9uTWVzc2FnZSwge1xuICAgICAgICAgICAgICBkZXRhaWw6ICdTZWUgQ29uc29sZSBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGV4dDogJ09wZW4gQ29uc29sZScsXG4gICAgICAgICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF0b20ub3BlbkRldlRvb2xzKClcbiAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdDYW5jZWwnLFxuICAgICAgICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICApXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZEJlZ2luTGludGluZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYmVnaW4tbGludGluZycsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRmluaXNoTGludGluZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZmluaXNoLWxpbnRpbmcnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucy5mb3JFYWNoKG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb24uZGlzbWlzcygpKVxuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucy5jbGVhcigpXG4gICAgdGhpcy5saW50ZXJzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGludGVyUmVnaXN0cnlcbiJdfQ==