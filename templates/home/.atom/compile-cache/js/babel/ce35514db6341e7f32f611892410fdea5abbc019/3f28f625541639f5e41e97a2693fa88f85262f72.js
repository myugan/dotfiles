function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _sbEventKit = require('sb-event-kit');

var _jasmineFix = require('jasmine-fix');

var _libCommands = require('../lib/commands');

var _libCommands2 = _interopRequireDefault(_libCommands);

var _helpers = require('./helpers');

describe('Commands', function () {
  var commands = undefined;
  var editorView = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    commands = new _libCommands2['default']();
    commands.activate();
    yield atom.workspace.open(__filename);
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor());
  }));
  afterEach(function () {
    atom.workspace.destroyActivePane();
    commands.dispose();
  });
  function dispatchEventOnBody(event) {
    // $FlowIgnore: Document.body is never null in our case
    document.body.dispatchEvent(event);
  }

  describe('Highlights', function () {
    (0, _jasmineFix.it)('does nothing if not activated and we try to deactivate', function () {
      commands.processHighlightsHide();
    });
    (0, _jasmineFix.it)('does not activate unless provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when the provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('throws if already highlighted', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processHighlightsHide();
      commands.processHighlightsHide();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list if available', _asyncToGenerator(function* () {
      var disposed = false;
      var active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      active.subscriptions.add(function () {
        disposed = true;
      });
      commands.active = active;
      expect(disposed).toBe(false);
      yield commands.processHighlightsShow();
      expect(disposed).toBe(true);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      commands.onHighlightsShow(function () {
        return Promise.resolve(true);
      });
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
      yield commands.processHighlightsShow();
      expect(editorView.classList.contains('intentions-highlights')).toBe(true);
      commands.processHighlightsHide();
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just activates if theres no keyboard event attached', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.commands.dispatch(editorView, 'intentions:highlight');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes the keyboard listener when we dispose it with the class function', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        spyOn(commands, 'processHighlightsHide').andCallThrough();
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        expect(commands.processHighlightsHide.calls.length).toBe(1);
      }));
      (0, _jasmineFix.it)('just activates if keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does not deactivate if keyup is not same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup', 1));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does deactivate if keyup is the same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
  describe('Lists', function () {
    (0, _jasmineFix.it)('does nothing if deactivated and we try to activate it', function () {
      commands.processListHide();
    });
    (0, _jasmineFix.it)('does not pass on move events if not activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('up');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on move events if activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(3);
    });
    (0, _jasmineFix.it)('ignores confirm if not activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on confirm if activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(2);
    });
    (0, _jasmineFix.it)('does not activate if listeners dont say that', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when listeners allow', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('ignores if list is already active', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processListHide();
      commands.processListHide();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes if highlights are active', _asyncToGenerator(function* () {
      var disposed = false;
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      commands.active = { type: 'highlight', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.active.subscriptions.add(function () {
        disposed = true;
      });
      expect(disposed).toBe(false);
      yield commands.processListShow();
      commands.processListHide();
      expect(disposed).toBe(true);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      yield commands.processListShow();
      expect(editorView.classList.contains('intentions-list')).toBe(true);
      commands.processListHide();
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list on mouseup', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      yield commands.processListShow();
      dispatchEventOnBody(new MouseEvent('mouseup'));
      yield (0, _jasmineFix.wait)(10);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just enables when no keyboard event', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.commands.dispatch(editorView, 'intentions:show');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('just enables when keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes the keyboard listener when we dispose it with the class function', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        spyOn(commands, 'processListHide').andCallThrough();
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        expect(commands.processListHide.calls.length).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes itself on any commands other than known', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-up' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-down' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-confirm' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);

        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvc3BlYy9jb21tYW5kcy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7MEJBRW9DLGNBQWM7OzBCQUNiLGFBQWE7OzJCQUM3QixpQkFBaUI7Ozs7dUJBQ0wsV0FBVzs7QUFFNUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFXO0FBQzlCLE1BQUksUUFBUSxZQUFBLENBQUE7QUFDWixNQUFJLFVBQVUsWUFBQSxDQUFBOztBQUVkLGdEQUFXLGFBQWlCO0FBQzFCLFlBQVEsR0FBRyw4QkFBYyxDQUFBO0FBQ3pCLFlBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUNuQixVQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3JDLGNBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtHQUN0RSxFQUFDLENBQUE7QUFDRixXQUFTLENBQUMsWUFBVztBQUNuQixRQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUE7QUFDbEMsWUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ25CLENBQUMsQ0FBQTtBQUNGLFdBQVMsbUJBQW1CLENBQUMsS0FBSyxFQUFFOztBQUVsQyxZQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUNuQzs7QUFFRCxVQUFRLENBQUMsWUFBWSxFQUFFLFlBQVc7QUFDaEMsd0JBQUcsd0RBQXdELEVBQUUsWUFBVztBQUN0RSxjQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtLQUNqQyxDQUFDLENBQUE7QUFDRix3QkFBRywrQ0FBK0Msb0JBQUUsYUFBaUI7QUFDbkUsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixjQUFRLENB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dGlvbnMvc3BlYy9jb21tYW5kcy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCB7IGl0LCBiZWZvcmVFYWNoLCB3YWl0IH0gZnJvbSAnamFzbWluZS1maXgnXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi4vbGliL2NvbW1hbmRzJ1xuaW1wb3J0IHsgZ2V0S2V5Ym9hcmRFdmVudCB9IGZyb20gJy4vaGVscGVycydcblxuZGVzY3JpYmUoJ0NvbW1hbmRzJywgZnVuY3Rpb24oKSB7XG4gIGxldCBjb21tYW5kc1xuICBsZXQgZWRpdG9yVmlld1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIGNvbW1hbmRzLmFjdGl2YXRlKClcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZmlsZW5hbWUpXG4gICAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgY29tbWFuZHMuZGlzcG9zZSgpXG4gIH0pXG4gIGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnRPbkJvZHkoZXZlbnQpIHtcbiAgICAvLyAkRmxvd0lnbm9yZTogRG9jdW1lbnQuYm9keSBpcyBuZXZlciBudWxsIGluIG91ciBjYXNlXG4gICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9XG5cbiAgZGVzY3JpYmUoJ0hpZ2hsaWdodHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnZG9lcyBub3RoaW5nIGlmIG5vdCBhY3RpdmF0ZWQgYW5kIHdlIHRyeSB0byBkZWFjdGl2YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGFjdGl2YXRlIHVubGVzcyBwcm92aWRlciB0ZWxscyBpdCB0bycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG5cbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdhY3RpdmF0ZXMgd2hlbiB0aGUgcHJvdmlkZXIgdGVsbHMgaXQgdG8nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG5cbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCd0aHJvd3MgaWYgYWxyZWFkeSBoaWdobGlnaHRlZCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9CZSgnQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9CZSgnQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgfVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnZGlzcG9zZXMgbGlzdCBpZiBhdmFpbGFibGUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBkaXNwb3NlZCA9IGZhbHNlXG4gICAgICBjb25zdCBhY3RpdmUgPSB7IHR5cGU6ICdsaXN0Jywgc3Vic2NyaXB0aW9uczogbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKSB9XG4gICAgICBhY3RpdmUuc3Vic2NyaXB0aW9ucy5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGRpc3Bvc2VkID0gdHJ1ZVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLmFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZSh0cnVlKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgYW5kIHJlbW92ZXMgY2xhc3NlcyBhcHByb3ByaWF0ZWx5JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KGVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnRlbnRpb25zLWhpZ2hsaWdodHMnKSkudG9CZShmYWxzZSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpKS50b0JlKHRydWUpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgZXhwZWN0KGVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnRlbnRpb25zLWhpZ2hsaWdodHMnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuICAgIGRlc2NyaWJlKCdjb21tYW5kIGxpc3RlbmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnanVzdCBhY3RpdmF0ZXMgaWYgdGhlcmVzIG5vIGtleWJvYXJkIGV2ZW50IGF0dGFjaGVkJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgwKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yVmlldywgJ2ludGVudGlvbnM6aGlnaGxpZ2h0JylcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdpZ25vcmVzIG1vcmUgdGhhbiBvbmUgYWN0aXZhdGlvbiByZXF1ZXN0cycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2Rpc3Bvc2VzIHRoZSBrZXlib2FyZCBsaXN0ZW5lciB3aGVuIHdlIGRpc3Bvc2UgaXQgd2l0aCB0aGUgY2xhc3MgZnVuY3Rpb24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBzcHlPbihjb21tYW5kcywgJ3Byb2Nlc3NIaWdobGlnaHRzSGlkZScpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgwKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlkb3duJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgICBleHBlY3QoY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdqdXN0IGFjdGl2YXRlcyBpZiBrZXlib2FyZCBldmVudCBpcyBub3Qga2V5ZG93bicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdkb2VzIG5vdCBkZWFjdGl2YXRlIGlmIGtleXVwIGlzIG5vdCBzYW1lIGtleWNvZGUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnLCAxKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdkb2VzIGRlYWN0aXZhdGUgaWYga2V5dXAgaXMgdGhlIHNhbWUga2V5Y29kZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5ZG93bicpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdMaXN0cycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgZGVhY3RpdmF0ZWQgYW5kIHdlIHRyeSB0byBhY3RpdmF0ZSBpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBwYXNzIG9uIG1vdmUgZXZlbnRzIGlmIG5vdCBhY3RpdmF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NvbW1hbmRzOmxpc3QtbW92ZScpXG4gICAgICBjb21tYW5kcy5vbkxpc3RNb3ZlKGNhbGxiYWNrKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCd1cCcpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGV4cGVjdChjYWxsYmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gICAgaXQoJ3Bhc3NlcyBvbiBtb3ZlIGV2ZW50cyBpZiBhY3RpdmF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NvbW1hbmRzOmxpc3QtbW92ZScpXG4gICAgICBjb21tYW5kcy5vbkxpc3RNb3ZlKGNhbGxiYWNrKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxscy5sZW5ndGgpLnRvQmUoMylcbiAgICB9KVxuICAgIGl0KCdpZ25vcmVzIGNvbmZpcm0gaWYgbm90IGFjdGl2YXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY29tbWFuZHM6bGlzdC1jb25maXJtJylcbiAgICAgIGNvbW1hbmRzLm9uTGlzdENvbmZpcm0oY2FsbGJhY2spXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgICBpdCgncGFzc2VzIG9uIGNvbmZpcm0gaWYgYWN0aXZhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjb21tYW5kczpsaXN0LWNvbmZpcm0nKVxuICAgICAgY29tbWFuZHMub25MaXN0Q29uZmlybShjYWxsYmFjaylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBleHBlY3QoY2FsbGJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxzLmxlbmd0aCkudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGFjdGl2YXRlIGlmIGxpc3RlbmVycyBkb250IHNheSB0aGF0JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdhY3RpdmF0ZXMgd2hlbiBsaXN0ZW5lcnMgYWxsb3cnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnaWdub3JlcyBpZiBsaXN0IGlzIGFscmVhZHkgYWN0aXZlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnZGlzcG9zZXMgaWYgaGlnaGxpZ2h0cyBhcmUgYWN0aXZlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgZGlzcG9zZWQgPSBmYWxzZVxuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIGNvbW1hbmRzLmFjdGl2ZSA9IHsgdHlwZTogJ2hpZ2hsaWdodCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgY29tbWFuZHMuYWN0aXZlLnN1YnNjcmlwdGlvbnMuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICBkaXNwb3NlZCA9IHRydWVcbiAgICAgIH0pXG4gICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUoZmFsc2UpXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgyKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgYW5kIHJlbW92ZXMgY2xhc3NlcyBhcHByb3ByaWF0ZWx5JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1saXN0JykpLnRvQmUoZmFsc2UpXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgZXhwZWN0KGVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnRlbnRpb25zLWxpc3QnKSkudG9CZSh0cnVlKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1saXN0JykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnZGlzcG9zZXMgbGlzdCBvbiBtb3VzZXVwJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkobmV3IE1vdXNlRXZlbnQoJ21vdXNldXAnKSlcbiAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDIpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDIpXG4gICAgfSlcbiAgICBkZXNjcmliZSgnY29tbWFuZCBsaXN0ZW5lcicsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ2p1c3QgZW5hYmxlcyB3aGVuIG5vIGtleWJvYXJkIGV2ZW50JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnaW50ZW50aW9uczpzaG93JylcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdqdXN0IGVuYWJsZXMgd2hlbiBrZXlib2FyZCBldmVudCBpcyBub3Qga2V5ZG93bicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdkaXNwb3NlcyB0aGUga2V5Ym9hcmQgbGlzdGVuZXIgd2hlbiB3ZSBkaXNwb3NlIGl0IHdpdGggdGhlIGNsYXNzIGZ1bmN0aW9uJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgc3B5T24oY29tbWFuZHMsICdwcm9jZXNzTGlzdEhpZGUnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgICBleHBlY3QoY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdpZ25vcmVzIG1vcmUgdGhhbiBvbmUgYWN0aXZhdGlvbiByZXF1ZXN0cycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2Rpc3Bvc2VzIGl0c2VsZiBvbiBhbnkgY29tbWFuZHMgb3RoZXIgdGhhbiBrbm93bicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5ZG93bicpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcblxuICAgICAgICBhdG9tLmtleW1hcHMuZW1pdHRlci5lbWl0KCdkaWQtbWF0Y2gtYmluZGluZycsIHsgYmluZGluZzogeyBjb21tYW5kOiAnY29yZTptb3ZlLXVwJyB9IH0pXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG5cbiAgICAgICAgYXRvbS5rZXltYXBzLmVtaXR0ZXIuZW1pdCgnZGlkLW1hdGNoLWJpbmRpbmcnLCB7IGJpbmRpbmc6IHsgY29tbWFuZDogJ2NvcmU6bW92ZS1kb3duJyB9IH0pXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG5cbiAgICAgICAgYXRvbS5rZXltYXBzLmVtaXR0ZXIuZW1pdCgnZGlkLW1hdGNoLWJpbmRpbmcnLCB7IGJpbmRpbmc6IHsgY29tbWFuZDogJ2NvcmU6bW92ZS1jb25maXJtJyB9IH0pXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG5cbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19