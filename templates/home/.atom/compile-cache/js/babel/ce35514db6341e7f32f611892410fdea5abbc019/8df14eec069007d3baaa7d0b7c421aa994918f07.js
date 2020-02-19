Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashUniq = require('lodash/uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _atom = require('atom');

var _uiRegistry = require('./ui-registry');

var _uiRegistry2 = _interopRequireDefault(_uiRegistry);

var _indieRegistry = require('./indie-registry');

var _indieRegistry2 = _interopRequireDefault(_indieRegistry);

var _messageRegistry = require('./message-registry');

var _messageRegistry2 = _interopRequireDefault(_messageRegistry);

var _linterRegistry = require('./linter-registry');

var _linterRegistry2 = _interopRequireDefault(_linterRegistry);

var _editorRegistry = require('./editor-registry');

var _editorRegistry2 = _interopRequireDefault(_editorRegistry);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _toggleView = require('./toggle-view');

var _toggleView2 = _interopRequireDefault(_toggleView);

var Linter = (function () {
  function Linter() {
    var _this = this;

    _classCallCheck(this, Linter);

    this.idleCallbacks = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.commands = new _commands2['default']();
    this.subscriptions.add(this.commands);

    this.commands.onShouldLint(function () {
      _this.registryEditorsInit();
      var editorLinter = _this.registryEditors.get(atom.workspace.getActiveTextEditor());
      if (editorLinter) {
        editorLinter.lint();
      }
    });
    this.commands.onShouldToggleActiveEditor(function () {
      var textEditor = atom.workspace.getActiveTextEditor();
      _this.registryEditorsInit();
      var editor = _this.registryEditors.get(textEditor);
      if (editor) {
        editor.dispose();
      } else if (textEditor) {
        _this.registryEditors.createFromTextEditor(textEditor);
      }
    });
    this.commands.onShouldDebug(_asyncToGenerator(function* () {
      _this.registryUIInit();
      _this.registryIndieInit();
      _this.registryLintersInit();
      _this.commands.showDebug(_this.registryLinters.getProviders(), _this.registryIndie.getProviders(), _this.registryUI.getProviders());
    }));
    this.commands.onShouldToggleLinter(function (action) {
      _this.registryLintersInit();
      var toggleView = new _toggleView2['default'](action, (0, _lodashUniq2['default'])(_this.registryLinters.getProviders().map(function (linter) {
        return linter.name;
      })));
      toggleView.onDidDispose(function () {
        _this.subscriptions.remove(toggleView);
      });
      toggleView.onDidDisable(function (name) {
        var linter = _this.registryLinters.getProviders().find(function (entry) {
          return entry.name === name;
        });
        if (linter) {
          _this.registryMessagesInit();
          _this.registryMessages.deleteByLinter(linter);
        }
      });
      toggleView.show();
      _this.subscriptions.add(toggleView);
    });

    var projectPathChangeCallbackID = window.requestIdleCallback((function projectPathChange() {
      var _this2 = this;

      this.idleCallbacks['delete'](projectPathChangeCallbackID);
      // NOTE: Atom triggers this on boot so wait a while
      this.subscriptions.add(atom.project.onDidChangePaths(function () {
        _this2.commands.lint();
      }));
    }).bind(this));
    this.idleCallbacks.add(projectPathChangeCallbackID);

    var registryEditorsInitCallbackID = window.requestIdleCallback((function registryEditorsIdleInit() {
      this.idleCallbacks['delete'](registryEditorsInitCallbackID);
      // This will be called on the fly if needed, but needs to run on it's
      // own at some point or linting on open or on change will never trigger
      this.registryEditorsInit();
    }).bind(this));
    this.idleCallbacks.add(registryEditorsInitCallbackID);
  }

  _createClass(Linter, [{
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
    }
  }, {
    key: 'registryEditorsInit',
    value: function registryEditorsInit() {
      var _this3 = this;

      if (this.registryEditors) {
        return;
      }
      this.registryEditors = new _editorRegistry2['default']();
      this.subscriptions.add(this.registryEditors);
      this.registryEditors.observe(function (editorLinter) {
        editorLinter.onShouldLint(function (onChange) {
          _this3.registryLintersInit();
          _this3.registryLinters.lint({ onChange: onChange, editor: editorLinter.getEditor() });
        });
        editorLinter.onDidDestroy(function () {
          _this3.registryMessagesInit();

          if (!_this3.registryEditors.hasSibling(editorLinter)) {
            _this3.registryMessages.deleteByBuffer(editorLinter.getEditor().getBuffer());
          }
        });
      });
      this.registryEditors.activate();
    }
  }, {
    key: 'registryLintersInit',
    value: function registryLintersInit() {
      var _this4 = this;

      if (this.registryLinters) {
        return;
      }
      this.registryLinters = new _linterRegistry2['default']();
      this.subscriptions.add(this.registryLinters);
      this.registryLinters.onDidUpdateMessages(function (_ref) {
        var linter = _ref.linter;
        var messages = _ref.messages;
        var buffer = _ref.buffer;

        _this4.registryMessagesInit();
        _this4.registryMessages.set({ linter: linter, messages: messages, buffer: buffer });
      });
      this.registryLinters.onDidBeginLinting(function (_ref2) {
        var linter = _ref2.linter;
        var filePath = _ref2.filePath;

        _this4.registryUIInit();
        _this4.registryUI.didBeginLinting(linter, filePath);
      });
      this.registryLinters.onDidFinishLinting(function (_ref3) {
        var linter = _ref3.linter;
        var filePath = _ref3.filePath;

        _this4.registryUIInit();
        _this4.registryUI.didFinishLinting(linter, filePath);
      });
    }
  }, {
    key: 'registryIndieInit',
    value: function registryIndieInit() {
      var _this5 = this;

      if (this.registryIndie) {
        return;
      }
      this.registryIndie = new _indieRegistry2['default']();
      this.subscriptions.add(this.registryIndie);
      this.registryIndie.observe(function (indieLinter) {
        indieLinter.onDidDestroy(function () {
          _this5.registryMessagesInit();
          _this5.registryMessages.deleteByLinter(indieLinter);
        });
      });
      this.registryIndie.onDidUpdate(function (_ref4) {
        var linter = _ref4.linter;
        var messages = _ref4.messages;

        _this5.registryMessagesInit();
        _this5.registryMessages.set({ linter: linter, messages: messages, buffer: null });
      });
    }
  }, {
    key: 'registryMessagesInit',
    value: function registryMessagesInit() {
      var _this6 = this;

      if (this.registryMessages) {
        return;
      }
      this.registryMessages = new _messageRegistry2['default']();
      this.subscriptions.add(this.registryMessages);
      this.registryMessages.onDidUpdateMessages(function (difference) {
        _this6.registryUIInit();
        _this6.registryUI.render(difference);
      });
    }
  }, {
    key: 'registryUIInit',
    value: function registryUIInit() {
      if (this.registryUI) {
        return;
      }
      this.registryUI = new _uiRegistry2['default']();
      this.subscriptions.add(this.registryUI);
    }

    // API methods for providing/consuming services
    // UI
  }, {
    key: 'addUI',
    value: function addUI(ui) {
      this.registryUIInit();
      this.registryUI.add(ui);
      this.registryMessagesInit();
      var messages = this.registryMessages.messages;

      if (messages.length) {
        ui.render({ added: messages, messages: messages, removed: [] });
      }
    }
  }, {
    key: 'deleteUI',
    value: function deleteUI(ui) {
      this.registryUIInit();
      this.registryUI['delete'](ui);
    }

    // Standard Linter
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      this.registryLintersInit();
      this.registryLinters.addLinter(linter);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      this.registryLintersInit();
      this.registryLinters.deleteLinter(linter);
      this.registryMessagesInit();
      this.registryMessages.deleteByLinter(linter);
    }

    // Indie Linter
  }, {
    key: 'addIndie',
    value: function addIndie(indie) {
      this.registryIndieInit();
      return this.registryIndie.register(indie, 2);
    }
  }]);

  return Linter;
})();

exports['default'] = Linter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7MEJBRXdCLGFBQWE7Ozs7b0JBQ0QsTUFBTTs7MEJBRW5CLGVBQWU7Ozs7NkJBQ1osa0JBQWtCOzs7OytCQUNoQixvQkFBb0I7Ozs7OEJBQ3JCLG1CQUFtQjs7Ozs4QkFDbEIsbUJBQW1COzs7O3dCQUMxQixZQUFZOzs7OzBCQUNWLGVBQWU7Ozs7SUFHaEMsTUFBTTtBQVVDLFdBVlAsTUFBTSxHQVVJOzs7MEJBVlYsTUFBTTs7QUFXUixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDOUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFckMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUMvQixZQUFLLG1CQUFtQixFQUFFLENBQUE7QUFDMUIsVUFBTSxZQUFZLEdBQUcsTUFBSyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0FBQ25GLFVBQUksWUFBWSxFQUFFO0FBQ2hCLG9CQUFZLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDcEI7S0FDRixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLFlBQU07QUFDN0MsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3ZELFlBQUssbUJBQW1CLEVBQUUsQ0FBQTtBQUMxQixVQUFNLE1BQU0sR0FBRyxNQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDbkQs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QUFDeEIsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDN0M7OztTQXBNRyxNQUFNOzs7cUJBdU1HLE1BQU0iLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGFycmF5VW5pcXVlIGZyb20gJ2xvZGFzaC91bmlxJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBVSVJlZ2lzdHJ5IGZyb20gJy4vdWktcmVnaXN0cnknXG5pbXBvcnQgSW5kaWVSZWdpc3RyeSBmcm9tICcuL2luZGllLXJlZ2lzdHJ5J1xuaW1wb3J0IE1lc3NhZ2VSZWdpc3RyeSBmcm9tICcuL21lc3NhZ2UtcmVnaXN0cnknXG5pbXBvcnQgTGludGVyUmVnaXN0cnkgZnJvbSAnLi9saW50ZXItcmVnaXN0cnknXG5pbXBvcnQgRWRpdG9yc1JlZ2lzdHJ5IGZyb20gJy4vZWRpdG9yLXJlZ2lzdHJ5J1xuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMnXG5pbXBvcnQgVG9nZ2xlVmlldyBmcm9tICcuL3RvZ2dsZS12aWV3J1xuaW1wb3J0IHR5cGUgeyBVSSwgTGludGVyIGFzIExpbnRlclByb3ZpZGVyIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgTGludGVyIHtcbiAgY29tbWFuZHM6IENvbW1hbmRzXG4gIHJlZ2lzdHJ5VUk6IFVJUmVnaXN0cnlcbiAgcmVnaXN0cnlJbmRpZTogSW5kaWVSZWdpc3RyeVxuICByZWdpc3RyeUVkaXRvcnM6IEVkaXRvcnNSZWdpc3RyeVxuICByZWdpc3RyeUxpbnRlcnM6IExpbnRlclJlZ2lzdHJ5XG4gIHJlZ2lzdHJ5TWVzc2FnZXM6IE1lc3NhZ2VSZWdpc3RyeVxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGlkbGVDYWxsYmFja3M6IFNldDxudW1iZXI+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5jb21tYW5kcyA9IG5ldyBDb21tYW5kcygpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzKVxuXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZExpbnQoKCkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeUVkaXRvcnNJbml0KClcbiAgICAgIGNvbnN0IGVkaXRvckxpbnRlciA9IHRoaXMucmVnaXN0cnlFZGl0b3JzLmdldChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICBpZiAoZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5saW50KClcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRUb2dnbGVBY3RpdmVFZGl0b3IoKCkgPT4ge1xuICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgdGhpcy5yZWdpc3RyeUVkaXRvcnNJbml0KClcbiAgICAgIGNvbnN0IGVkaXRvciA9IHRoaXMucmVnaXN0cnlFZGl0b3JzLmdldCh0ZXh0RWRpdG9yKVxuICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICBlZGl0b3IuZGlzcG9zZSgpXG4gICAgICB9IGVsc2UgaWYgKHRleHRFZGl0b3IpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMuY3JlYXRlRnJvbVRleHRFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGREZWJ1Zyhhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlJbmRpZUluaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnNJbml0KClcbiAgICAgIHRoaXMuY29tbWFuZHMuc2hvd0RlYnVnKFxuICAgICAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5nZXRQcm92aWRlcnMoKSxcbiAgICAgICAgdGhpcy5yZWdpc3RyeUluZGllLmdldFByb3ZpZGVycygpLFxuICAgICAgICB0aGlzLnJlZ2lzdHJ5VUkuZ2V0UHJvdmlkZXJzKCksXG4gICAgICApXG4gICAgfSlcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkVG9nZ2xlTGludGVyKGFjdGlvbiA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgICAgY29uc3QgdG9nZ2xlVmlldyA9IG5ldyBUb2dnbGVWaWV3KGFjdGlvbiwgYXJyYXlVbmlxdWUodGhpcy5yZWdpc3RyeUxpbnRlcnMuZ2V0UHJvdmlkZXJzKCkubWFwKGxpbnRlciA9PiBsaW50ZXIubmFtZSkpKVxuICAgICAgdG9nZ2xlVmlldy5vbkRpZERpc3Bvc2UoKCkgPT4ge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKHRvZ2dsZVZpZXcpXG4gICAgICB9KVxuICAgICAgdG9nZ2xlVmlldy5vbkRpZERpc2FibGUobmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbnRlciA9IHRoaXMucmVnaXN0cnlMaW50ZXJzLmdldFByb3ZpZGVycygpLmZpbmQoZW50cnkgPT4gZW50cnkubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGxpbnRlcikge1xuICAgICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUxpbnRlcihsaW50ZXIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0b2dnbGVWaWV3LnNob3coKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0b2dnbGVWaWV3KVxuICAgIH0pXG5cbiAgICBjb25zdCBwcm9qZWN0UGF0aENoYW5nZUNhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhcbiAgICAgIGZ1bmN0aW9uIHByb2plY3RQYXRoQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKHByb2plY3RQYXRoQ2hhbmdlQ2FsbGJhY2tJRClcbiAgICAgICAgLy8gTk9URTogQXRvbSB0cmlnZ2VycyB0aGlzIG9uIGJvb3Qgc28gd2FpdCBhIHdoaWxlXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kcy5saW50KClcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgIClcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKHByb2plY3RQYXRoQ2hhbmdlQ2FsbGJhY2tJRClcblxuICAgIGNvbnN0IHJlZ2lzdHJ5RWRpdG9yc0luaXRDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiByZWdpc3RyeUVkaXRvcnNJZGxlSW5pdCgpIHtcbiAgICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShyZWdpc3RyeUVkaXRvcnNJbml0Q2FsbGJhY2tJRClcbiAgICAgICAgLy8gVGhpcyB3aWxsIGJlIGNhbGxlZCBvbiB0aGUgZmx5IGlmIG5lZWRlZCwgYnV0IG5lZWRzIHRvIHJ1biBvbiBpdCdzXG4gICAgICAgIC8vIG93biBhdCBzb21lIHBvaW50IG9yIGxpbnRpbmcgb24gb3BlbiBvciBvbiBjaGFuZ2Ugd2lsbCBuZXZlciB0cmlnZ2VyXG4gICAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQocmVnaXN0cnlFZGl0b3JzSW5pdENhbGxiYWNrSUQpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICByZWdpc3RyeUVkaXRvcnNJbml0KCkge1xuICAgIGlmICh0aGlzLnJlZ2lzdHJ5RWRpdG9ycykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzID0gbmV3IEVkaXRvcnNSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5RWRpdG9ycylcbiAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5vYnNlcnZlKGVkaXRvckxpbnRlciA9PiB7XG4gICAgICBlZGl0b3JMaW50ZXIub25TaG91bGRMaW50KG9uQ2hhbmdlID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMubGludCh7IG9uQ2hhbmdlLCBlZGl0b3I6IGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKSB9KVxuICAgICAgfSlcbiAgICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcblxuICAgICAgICBpZiAoIXRoaXMucmVnaXN0cnlFZGl0b3JzLmhhc1NpYmxpbmcoZWRpdG9yTGludGVyKSkge1xuICAgICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUJ1ZmZlcihlZGl0b3JMaW50ZXIuZ2V0RWRpdG9yKCkuZ2V0QnVmZmVyKCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5hY3RpdmF0ZSgpXG4gIH1cbiAgcmVnaXN0cnlMaW50ZXJzSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeUxpbnRlcnMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycyA9IG5ldyBMaW50ZXJSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5TGludGVycylcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZFVwZGF0ZU1lc3NhZ2VzKCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlciB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5zZXQoeyBsaW50ZXIsIG1lc3NhZ2VzLCBidWZmZXIgfSlcbiAgICB9KVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLm9uRGlkQmVnaW5MaW50aW5nKCh7IGxpbnRlciwgZmlsZVBhdGggfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkuZGlkQmVnaW5MaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZEZpbmlzaExpbnRpbmcoKHsgbGludGVyLCBmaWxlUGF0aCB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlVSS5kaWRGaW5pc2hMaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgfSlcbiAgfVxuICByZWdpc3RyeUluZGllSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeUluZGllKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeUluZGllID0gbmV3IEluZGllUmVnaXN0cnkoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeUluZGllKVxuICAgIHRoaXMucmVnaXN0cnlJbmRpZS5vYnNlcnZlKGluZGllTGludGVyID0+IHtcbiAgICAgIGluZGllTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIoaW5kaWVMaW50ZXIpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUluZGllLm9uRGlkVXBkYXRlKCh7IGxpbnRlciwgbWVzc2FnZXMgfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuc2V0KHsgbGludGVyLCBtZXNzYWdlcywgYnVmZmVyOiBudWxsIH0pXG4gICAgfSlcbiAgfVxuICByZWdpc3RyeU1lc3NhZ2VzSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeU1lc3NhZ2VzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzID0gbmV3IE1lc3NhZ2VSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLm9uRGlkVXBkYXRlTWVzc2FnZXMoZGlmZmVyZW5jZSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlVSS5yZW5kZXIoZGlmZmVyZW5jZSlcbiAgICB9KVxuICB9XG4gIHJlZ2lzdHJ5VUlJbml0KCkge1xuICAgIGlmICh0aGlzLnJlZ2lzdHJ5VUkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5VUkgPSBuZXcgVUlSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5VUkpXG4gIH1cblxuICAvLyBBUEkgbWV0aG9kcyBmb3IgcHJvdmlkaW5nL2NvbnN1bWluZyBzZXJ2aWNlc1xuICAvLyBVSVxuICBhZGRVSSh1aTogVUkpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5VUkuYWRkKHVpKVxuICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgIGNvbnN0IHsgbWVzc2FnZXMgfSA9IHRoaXMucmVnaXN0cnlNZXNzYWdlc1xuICAgIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHVpLnJlbmRlcih7IGFkZGVkOiBtZXNzYWdlcywgbWVzc2FnZXMsIHJlbW92ZWQ6IFtdIH0pXG4gICAgfVxuICB9XG4gIGRlbGV0ZVVJKHVpOiBVSSkge1xuICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgIHRoaXMucmVnaXN0cnlVSS5kZWxldGUodWkpXG4gIH1cbiAgLy8gU3RhbmRhcmQgTGludGVyXG4gIGFkZExpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyKSB7XG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnNJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5hZGRMaW50ZXIobGludGVyKVxuICB9XG4gIGRlbGV0ZUxpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyKSB7XG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnNJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5kZWxldGVMaW50ZXIobGludGVyKVxuICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUxpbnRlcihsaW50ZXIpXG4gIH1cbiAgLy8gSW5kaWUgTGludGVyXG4gIGFkZEluZGllKGluZGllOiBPYmplY3QpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWVJbml0KClcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyeUluZGllLnJlZ2lzdGVyKGluZGllLCAyKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpbnRlclxuIl19