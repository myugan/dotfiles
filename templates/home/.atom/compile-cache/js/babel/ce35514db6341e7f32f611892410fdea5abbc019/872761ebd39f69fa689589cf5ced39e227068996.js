Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _sbEventKit = require('sb-event-kit');

var _helpers = require('./helpers');

// NOTE:
// We don't *need* to add the intentions:hide command
// But we're doing it anyway because it helps us keep the code clean
// And can also be used by any other package to fully control this package

// List of core commands we allow during the list, everything else closes it
var CORE_COMMANDS = new Set(['core:move-up', 'core:move-down', 'core:page-up', 'core:page-down', 'core:move-to-top', 'core:move-to-bottom']);

var Commands = (function () {
  function Commands() {
    _classCallCheck(this, Commands);

    this.active = null;
    this.emitter = new _sbEventKit.Emitter();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(Commands, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
        'intentions:show': function intentionsShow(e) {
          if (_this.active && _this.active.type === 'list') {
            return;
          }
          var subscriptions = new _sbEventKit.CompositeDisposable();
          _this.processListShow(subscriptions);

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }

          setImmediate(function () {
            var matched = true;

            subscriptions.add(atom.keymaps.onDidMatchBinding(function (_ref) {
              var binding = _ref.binding;

              matched = matched && CORE_COMMANDS.has(binding.command);
            }));
            subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function () {
              if (matched) {
                return;
              }
              subscriptions.dispose();
              _this.processListHide();
            }));
          });
        },
        'intentions:hide': function intentionsHide() {
          _this.processListHide();
        },
        'intentions:highlight': function intentionsHighlight(e) {
          if (_this.active && _this.active.type === 'highlight') {
            return;
          }
          var subscriptions = new _sbEventKit.CompositeDisposable();
          _this.processHighlightsShow(subscriptions);

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }
          var keyCode = e.originalEvent.keyCode;
          subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function (upE) {
            if (upE.keyCode !== keyCode) {
              return;
            }
            subscriptions.dispose();
            _this.processHighlightsHide();
          }));
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor.intentions-list:not([mini])', {
        'intentions:confirm': (0, _helpers.stoppingEvent)(function () {
          _this.processListConfirm();
        }),
        'core:move-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('up');
        }),
        'core:move-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('down');
        }),
        'core:page-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-up');
        }),
        'core:page-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-down');
        }),
        'core:move-to-top': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-top');
        }),
        'core:move-to-bottom': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-bottom');
        })
      }));
    }
  }, {
    key: 'processListShow',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      var subscription = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.active) {
        switch (this.active.type) {
          case 'list':
            throw new Error('Already active');
          case 'highlight':
            this.processHighlightsHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      if (subscription) {
        subscriptions.add(subscription);
      }

      if (!(yield this.shouldListShow(editor))) {
        return;
      }
      this.active = { type: 'list', subscriptions: subscriptions };
      subscriptions.add(function () {
        if (_this2.active && _this2.active.type === 'list' && _this2.active.subscriptions === subscriptions) {
          _this2.processListHide();
          _this2.active = null;
        }
        editorElement.classList.remove('intentions-list');
      });
      subscriptions.add((0, _disposableEvent2['default'])(document.body, 'mouseup', function () {
        setTimeout(function () {
          subscriptions.dispose();
        }, 10);
      }));
      editorElement.classList.add('intentions-list');
    })
  }, {
    key: 'processListHide',
    value: function processListHide() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('list-hide');
    }
  }, {
    key: 'processListMove',
    value: function processListMove(movement) {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-move', movement);
    }
  }, {
    key: 'processListConfirm',
    value: function processListConfirm() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-confirm');
    }
  }, {
    key: 'processHighlightsShow',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      var subscription = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.active) {
        switch (this.active.type) {
          case 'highlight':
            throw new Error('Already active');
          case 'list':
            this.processListHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      var shouldProcess = yield this.shouldHighlightsShow(editor);
      if (subscription) {
        subscriptions.add(subscription);
      }

      if (!shouldProcess) {
        return;
      }
      this.active = { type: 'highlight', subscriptions: subscriptions };
      subscriptions.add(function () {
        if (_this3.active && _this3.active.type === 'highlight' && _this3.active.subscriptions === subscriptions) {
          _this3.processHighlightsHide();
        }
        editorElement.classList.remove('intentions-highlights');
      });
      editorElement.classList.add('intentions-highlights');
    })
  }, {
    key: 'processHighlightsHide',
    value: function processHighlightsHide() {
      if (!this.active || this.active.type !== 'highlight') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('highlights-hide');
    }
  }, {
    key: 'shouldListShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('list-show', event);
      return event.show;
    })
  }, {
    key: 'shouldHighlightsShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('highlights-show', event);
      return event.show;
    })
  }, {
    key: 'onListShow',
    value: function onListShow(callback) {
      return this.emitter.on('list-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onListHide',
    value: function onListHide(callback) {
      return this.emitter.on('list-hide', callback);
    }
  }, {
    key: 'onListMove',
    value: function onListMove(callback) {
      return this.emitter.on('list-move', callback);
    }
  }, {
    key: 'onListConfirm',
    value: function onListConfirm(callback) {
      return this.emitter.on('list-confirm', callback);
    }
  }, {
    key: 'onHighlightsShow',
    value: function onHighlightsShow(callback) {
      return this.emitter.on('highlights-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onHighlightsHide',
    value: function onHighlightsHide(callback) {
      return this.emitter.on('highlights-hide', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.subscriptions.dispose();
      }
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2NvbW1hbmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzsrQkFFNEIsa0JBQWtCOzs7OzBCQUNXLGNBQWM7O3VCQUd6QyxXQUFXOzs7Ozs7OztBQVN6QyxJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFBOztJQUV6SCxRQUFRO0FBUWhCLFdBUlEsUUFBUSxHQVFiOzBCQVJLLFFBQVE7O0FBU3pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxPQUFPLEdBQUcseUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBZGtCLFFBQVE7O1dBZW5CLG9CQUFHOzs7QUFDVCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRTtBQUN2RSx5QkFBaUIsRUFBRSx3QkFBQyxDQUFDLEVBQUs7QUFDeEIsY0FBSSxNQUFLLE1BQU0sSUFBSSxNQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQzlDLG1CQUFNO1dBQ1A7QUFDRCxjQUFNLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTtBQUMvQyxnQkFBSyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUE7O0FBRW5DLGNBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUMxRCxtQkFBTTtXQUNQOztBQUVELHNCQUFZLENB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QUMsUUFBcUIsRUFBRTtBQUNoQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM5Qzs7O1dBQ1Msb0JBQUMsUUFBMkMsRUFBRTtBQUN0RCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM5Qzs7O1dBQ1ksdUJBQUMsUUFBcUIsRUFBRTtBQUNuQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNqRDs7O1dBQ2UsMEJBQUMsUUFBb0QsRUFBRTtBQUNyRSxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQ3hELGVBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDbEQsZUFBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO1NBQ3RCLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7V0FDZSwwQkFBQyxRQUFxQixFQUFFO0FBQ3RDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDcEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNwQztLQUNGOzs7U0F0T2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2NvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGRpc3Bvc2FibGVFdmVudCBmcm9tICdkaXNwb3NhYmxlLWV2ZW50J1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCB7IHN0b3BwaW5nRXZlbnQgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpc3RNb3ZlbWVudCB9IGZyb20gJy4vdHlwZXMnXG5cbi8vIE5PVEU6XG4vLyBXZSBkb24ndCAqbmVlZCogdG8gYWRkIHRoZSBpbnRlbnRpb25zOmhpZGUgY29tbWFuZFxuLy8gQnV0IHdlJ3JlIGRvaW5nIGl0IGFueXdheSBiZWNhdXNlIGl0IGhlbHBzIHVzIGtlZXAgdGhlIGNvZGUgY2xlYW5cbi8vIEFuZCBjYW4gYWxzbyBiZSB1c2VkIGJ5IGFueSBvdGhlciBwYWNrYWdlIHRvIGZ1bGx5IGNvbnRyb2wgdGhpcyBwYWNrYWdlXG5cbi8vIExpc3Qgb2YgY29yZSBjb21tYW5kcyB3ZSBhbGxvdyBkdXJpbmcgdGhlIGxpc3QsIGV2ZXJ5dGhpbmcgZWxzZSBjbG9zZXMgaXRcbmNvbnN0IENPUkVfQ09NTUFORFMgPSBuZXcgU2V0KFsnY29yZTptb3ZlLXVwJywgJ2NvcmU6bW92ZS1kb3duJywgJ2NvcmU6cGFnZS11cCcsICdjb3JlOnBhZ2UtZG93bicsICdjb3JlOm1vdmUtdG8tdG9wJywgJ2NvcmU6bW92ZS10by1ib3R0b20nXSlcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZHMge1xuICBhY3RpdmU6ID97XG4gICAgdHlwZTogJ2xpc3QnIHwgJ2hpZ2hsaWdodCcsXG4gICAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZSxcbiAgfTtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsIHtcbiAgICAgICdpbnRlbnRpb25zOnNob3cnOiAoZSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUgJiYgdGhpcy5hY3RpdmUudHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdFNob3coc3Vic2NyaXB0aW9ucylcblxuICAgICAgICBpZiAoIWUub3JpZ2luYWxFdmVudCB8fCBlLm9yaWdpbmFsRXZlbnQudHlwZSAhPT0gJ2tleWRvd24nKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgIGxldCBtYXRjaGVkID0gdHJ1ZVxuXG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5rZXltYXBzLm9uRGlkTWF0Y2hCaW5kaW5nKGZ1bmN0aW9uKHsgYmluZGluZyB9KSB7XG4gICAgICAgICAgICBtYXRjaGVkID0gbWF0Y2hlZCAmJiBDT1JFX0NPTU1BTkRTLmhhcyhiaW5kaW5nLmNvbW1hbmQpXG4gICAgICAgICAgfSkpXG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZUV2ZW50KGRvY3VtZW50LmJvZHksICdrZXl1cCcsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgICB9KSlcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICAnaW50ZW50aW9uczpoaWRlJzogKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICB9LFxuICAgICAgJ2ludGVudGlvbnM6aGlnaGxpZ2h0JzogKGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdoaWdobGlnaHQnKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coc3Vic2NyaXB0aW9ucylcblxuICAgICAgICBpZiAoIWUub3JpZ2luYWxFdmVudCB8fCBlLm9yaWdpbmFsRXZlbnQudHlwZSAhPT0gJ2tleWRvd24nKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qga2V5Q29kZSA9IGUub3JpZ2luYWxFdmVudC5rZXlDb2RlXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGRpc3Bvc2FibGVFdmVudChkb2N1bWVudC5ib2R5LCAna2V5dXAnLCAodXBFKSA9PiB7XG4gICAgICAgICAgaWYgKHVwRS5rZXlDb2RlICE9PSBrZXlDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgICAgICB0aGlzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgIH0pKVxuICAgICAgfSxcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yLmludGVudGlvbnMtbGlzdDpub3QoW21pbmldKScsIHtcbiAgICAgICdpbnRlbnRpb25zOmNvbmZpcm0nOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgfSksXG4gICAgICAnY29yZTptb3ZlLXVwJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCd1cCcpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ3BhZ2UtdXAnKVxuICAgICAgfSksXG4gICAgICAnY29yZTpwYWdlLWRvd24nOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ3BhZ2UtZG93bicpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtdG8tdG9wJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdtb3ZlLXRvLXRvcCcpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtdG8tYm90dG9tJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdtb3ZlLXRvLWJvdHRvbScpXG4gICAgICB9KSxcbiAgICB9KSlcbiAgfVxuICBhc3luYyBwcm9jZXNzTGlzdFNob3coc3Vic2NyaXB0aW9uOiA/KENvbXBvc2l0ZURpc3Bvc2FibGUgfCBEaXNwb3NhYmxlKSA9IG51bGwpIHtcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5hY3RpdmUudHlwZSkge1xuICAgICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgICAgY2FzZSAnaGlnaGxpZ2h0JzpcbiAgICAgICAgICB0aGlzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHJldHVyblxuICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGlmICghYXdhaXQgdGhpcy5zaG91bGRMaXN0U2hvdyhlZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSB7IHR5cGU6ICdsaXN0Jywgc3Vic2NyaXB0aW9ucyB9XG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdsaXN0JyAmJiB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zID09PSBzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgICB9XG4gICAgICBlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ludGVudGlvbnMtbGlzdCcpXG4gICAgfSlcbiAgICBzdWJzY3JpcHRpb25zLmFkZChkaXNwb3NhYmxlRXZlbnQoZG9jdW1lbnQuYm9keSwgJ21vdXNldXAnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9LCAxMClcbiAgICB9KSlcbiAgICBlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ludGVudGlvbnMtbGlzdCcpXG4gIH1cbiAgcHJvY2Vzc0xpc3RIaWRlKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUgfHwgdGhpcy5hY3RpdmUudHlwZSAhPT0gJ2xpc3QnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsaXN0LWhpZGUnKVxuICB9XG4gIHByb2Nlc3NMaXN0TW92ZShtb3ZlbWVudDogTGlzdE1vdmVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSB8fCB0aGlzLmFjdGl2ZS50eXBlICE9PSAnbGlzdCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGlzdC1tb3ZlJywgbW92ZW1lbnQpXG4gIH1cbiAgcHJvY2Vzc0xpc3RDb25maXJtKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUgfHwgdGhpcy5hY3RpdmUudHlwZSAhPT0gJ2xpc3QnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xpc3QtY29uZmlybScpXG4gIH1cbiAgYXN5bmMgcHJvY2Vzc0hpZ2hsaWdodHNTaG93KHN1YnNjcmlwdGlvbjogPyhDb21wb3NpdGVEaXNwb3NhYmxlIHwgRGlzcG9zYWJsZSkgPSBudWxsKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuYWN0aXZlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnaGlnaGxpZ2h0JzpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSByZXR1cm5cbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGNvbnN0IHNob3VsZFByb2Nlc3MgPSBhd2FpdCB0aGlzLnNob3VsZEhpZ2hsaWdodHNTaG93KGVkaXRvcilcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb24pXG4gICAgfVxuXG4gICAgaWYgKCFzaG91bGRQcm9jZXNzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSB7IHR5cGU6ICdoaWdobGlnaHQnLCBzdWJzY3JpcHRpb25zIH1cbiAgICBzdWJzY3JpcHRpb25zLmFkZCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgJiYgdGhpcy5hY3RpdmUudHlwZSA9PT0gJ2hpZ2hsaWdodCcgJiYgdGhpcy5hY3RpdmUuc3Vic2NyaXB0aW9ucyA9PT0gc3Vic2NyaXB0aW9ucykge1xuICAgICAgICB0aGlzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICB9XG4gICAgICBlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpXG4gICAgfSlcbiAgICBlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpXG4gIH1cbiAgcHJvY2Vzc0hpZ2hsaWdodHNIaWRlKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUgfHwgdGhpcy5hY3RpdmUudHlwZSAhPT0gJ2hpZ2hsaWdodCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5hY3RpdmUuc3Vic2NyaXB0aW9uc1xuICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2hpZ2hsaWdodHMtaGlkZScpXG4gIH1cbiAgYXN5bmMgc2hvdWxkTGlzdFNob3coZWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZXZlbnQgPSB7IHNob3c6IGZhbHNlLCBlZGl0b3IgfVxuICAgIGF3YWl0IHRoaXMuZW1pdHRlci5lbWl0KCdsaXN0LXNob3cnLCBldmVudClcbiAgICByZXR1cm4gZXZlbnQuc2hvd1xuICB9XG4gIGFzeW5jIHNob3VsZEhpZ2hsaWdodHNTaG93KGVkaXRvcjogVGV4dEVkaXRvcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGV2ZW50ID0geyBzaG93OiBmYWxzZSwgZWRpdG9yIH1cbiAgICBhd2FpdCB0aGlzLmVtaXR0ZXIuZW1pdCgnaGlnaGxpZ2h0cy1zaG93JywgZXZlbnQpXG4gICAgcmV0dXJuIGV2ZW50LnNob3dcbiAgfVxuICBvbkxpc3RTaG93KGNhbGxiYWNrOiAoKGVkaXRvcjogVGV4dEVkaXRvcikgPT4gUHJvbWlzZTxib29sZWFuPikpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdsaXN0LXNob3cnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGV2ZW50LmVkaXRvcikudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgZXZlbnQuc2hvdyA9ICEhcmVzdWx0XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgb25MaXN0SGlkZShjYWxsYmFjazogKCgpID0+IGFueSkpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdsaXN0LWhpZGUnLCBjYWxsYmFjaylcbiAgfVxuICBvbkxpc3RNb3ZlKGNhbGxiYWNrOiAoKG1vdmVtZW50OiBMaXN0TW92ZW1lbnQpID0+IGFueSkpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdsaXN0LW1vdmUnLCBjYWxsYmFjaylcbiAgfVxuICBvbkxpc3RDb25maXJtKGNhbGxiYWNrOiAoKCkgPT4gYW55KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3QtY29uZmlybScsIGNhbGxiYWNrKVxuICB9XG4gIG9uSGlnaGxpZ2h0c1Nob3coY2FsbGJhY2s6ICgoZWRpdG9yOiBUZXh0RWRpdG9yKSA9PiBQcm9taXNlPGJvb2xlYW4+KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2hpZ2hsaWdodHMtc2hvdycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXZlbnQuZWRpdG9yKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBldmVudC5zaG93ID0gISFyZXN1bHRcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICBvbkhpZ2hsaWdodHNIaWRlKGNhbGxiYWNrOiAoKCkgPT4gYW55KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2hpZ2hsaWdodHMtaGlkZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgdGhpcy5hY3RpdmUuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==