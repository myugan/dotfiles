var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _atom = require('atom');

var _helpers = require('./helpers');

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.messages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:next': function linterUiDefaultNext() {
        return _this.move(true, true);
      },
      'linter-ui-default:previous': function linterUiDefaultPrevious() {
        return _this.move(false, true);
      },
      'linter-ui-default:next-error': function linterUiDefaultNextError() {
        return _this.move(true, true, 'error');
      },
      'linter-ui-default:previous-error': function linterUiDefaultPreviousError() {
        return _this.move(false, true, 'error');
      },
      'linter-ui-default:next-warning': function linterUiDefaultNextWarning() {
        return _this.move(true, true, 'warning');
      },
      'linter-ui-default:previous-warning': function linterUiDefaultPreviousWarning() {
        return _this.move(false, true, 'warning');
      },
      'linter-ui-default:next-info': function linterUiDefaultNextInfo() {
        return _this.move(true, true, 'info');
      },
      'linter-ui-default:previous-info': function linterUiDefaultPreviousInfo() {
        return _this.move(false, true, 'info');
      },

      'linter-ui-default:next-in-current-file': function linterUiDefaultNextInCurrentFile() {
        return _this.move(true, false);
      },
      'linter-ui-default:previous-in-current-file': function linterUiDefaultPreviousInCurrentFile() {
        return _this.move(false, false);
      },
      'linter-ui-default:next-error-in-current-file': function linterUiDefaultNextErrorInCurrentFile() {
        return _this.move(true, false, 'error');
      },
      'linter-ui-default:previous-error-in-current-file': function linterUiDefaultPreviousErrorInCurrentFile() {
        return _this.move(false, false, 'error');
      },
      'linter-ui-default:next-warning-in-current-file': function linterUiDefaultNextWarningInCurrentFile() {
        return _this.move(true, false, 'warning');
      },
      'linter-ui-default:previous-warning-in-current-file': function linterUiDefaultPreviousWarningInCurrentFile() {
        return _this.move(false, false, 'warning');
      },
      'linter-ui-default:next-info-in-current-file': function linterUiDefaultNextInfoInCurrentFile() {
        return _this.move(true, false, 'info');
      },
      'linter-ui-default:previous-info-in-current-file': function linterUiDefaultPreviousInfoInCurrentFile() {
        return _this.move(false, false, 'info');
      },

      'linter-ui-default:toggle-panel': function linterUiDefaultTogglePanel() {
        return _this.togglePanel();
      },

      // NOTE: Add no-ops here so they are recognized by commands registry
      // Real commands are registered when tooltip is shown inside tooltip's delegate
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip() {},
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {}
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter-ui-default:apply-all-solutions': function linterUiDefaultApplyAllSolutions() {
        return _this.applyAllSolutions();
      }
    }));
    this.subscriptions.add(atom.commands.add('#linter-panel', {
      'core:copy': function coreCopy() {
        var selection = document.getSelection();
        if (selection) {
          atom.clipboard.write(selection.toString());
        }
      }
    }));
  }

  _createClass(Commands, [{
    key: 'togglePanel',
    value: function togglePanel() {
      atom.config.set('linter-ui-default.showPanel', !atom.config.get('linter-ui-default.showPanel'));
    }

    // NOTE: Apply solutions from bottom to top, so they don't invalidate each other
  }, {
    key: 'applyAllSolutions',
    value: function applyAllSolutions() {
      var textEditor = (0, _helpers.getActiveTextEditor)();
      (0, _assert2['default'])(textEditor, 'textEditor was null on a command supposed to run on text-editors only');
      var messages = (0, _helpers.sortMessages)([{ column: 'line', type: 'desc' }], (0, _helpers.filterMessages)(this.messages, textEditor.getPath()));
      messages.forEach(function (message) {
        if (message.version === 2 && message.solutions && message.solutions.length) {
          (0, _helpers.applySolution)(textEditor, (0, _helpers.sortSolutions)(message.solutions)[0]);
        }
      });
    }
  }, {
    key: 'move',
    value: function move(forward, globally) {
      var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var currentEditor = (0, _helpers.getActiveTextEditor)();
      var currentFile = currentEditor && currentEditor.getPath() || NaN;
      // NOTE: ^ Setting default to NaN so it won't match empty file paths in messages
      var messages = (0, _helpers.sortMessages)([{ column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }], (0, _helpers.filterMessages)(this.messages, globally ? null : currentFile, severity));
      var expectedValue = forward ? -1 : 1;

      if (!currentEditor) {
        var message = forward ? messages[0] : messages[messages.length - 1];
        if (message) {
          (0, _helpers.visitMessage)(message);
        }
        return;
      }
      var currentPosition = currentEditor.getCursorBufferPosition();

      // NOTE: Iterate bottom to top to find the previous message
      // Because if we search top to bottom when sorted, first item will always
      // be the smallest
      if (!forward) {
        messages.reverse();
      }

      var found = undefined;
      var currentFileEncountered = false;
      for (var i = 0, _length = messages.length; i < _length; i++) {
        var message = messages[i];
        var messageFile = (0, _helpers.$file)(message);
        var messageRange = (0, _helpers.$range)(message);

        if (!currentFileEncountered && messageFile === currentFile) {
          currentFileEncountered = true;
        }
        if (messageFile && messageRange) {
          if (currentFileEncountered && messageFile !== currentFile) {
            found = message;
            break;
          } else if (messageFile === currentFile && currentPosition.compare(messageRange.start) === expectedValue) {
            found = message;
            break;
          }
        }
      }

      if (!found && messages.length) {
        // Reset back to first or last depending on direction
        found = messages[0];
      }

      if (found) {
        (0, _helpers.visitMessage)(found);
      }
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

module.exports = Commands;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7c0JBRXNCLFFBQVE7Ozs7b0JBQ00sTUFBTTs7dUJBV25DLFdBQVc7O0lBR1osUUFBUTtBQUlELFdBSlAsUUFBUSxHQUlFOzs7MEJBSlYsUUFBUTs7QUFLVixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEMsOEJBQXdCLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO09BQUE7QUFDckQsa0NBQTRCLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO09BQUE7QUFDMUQsb0NBQThCLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQztPQUFBO0FBQ3BFLHdDQUFrQyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7T0FBQTtBQUN6RSxzQ0FBZ0MsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDO09BQUE7QUFDeEUsMENBQW9DLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztPQUFBO0FBQzdFLG1DQUE2QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7T0FBQTtBQUNsRSx1Q0FBaUMsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO09BQUE7O0FBRXZFLDhDQUF3QyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztPQUFBO0FBQ3RFLGtEQUE0QyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztPQUFBO0FBQzNFLG9EQUE4QyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUM7T0FBQTtBQUNyRix3REFBa0QsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDO09BQUE7QUFDMUYsc0RBQWdELEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQztPQUFBO0FBQ3pGLDBEQUFvRCxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUM7T0FBQTtBQUM5RixtREFBNkMsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO09BQUE7QUFDbkYsdURBQWlELEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztPQUFBOztBQUV4RixzQ0FBZ0MsRUFBRTtlQUFNLE1BQUssV0FBVyxFQUFFO09BQUE7Ozs7QUFJMUQsd0NBQWtDLEVBQUUsd0NBQVcsRUFBRTtBQUNqRCwwQ0FBb0MsRUFBRSwwQ0FBVyxFQUFFO0tBQ3BELENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFO0FBQ2hELDZDQUF1QyxFQUFFO2VBQU0sTUFBSyxpQkFBaUIsRUFBRTtPQUFBO0tBQ3hFLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRTtBQUNqQyxpQkFBVyxFQUFFLG9CQUFNO0FBQ2pCLFlBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUN6QyxZQUFJLFNBQVMsRUFBRTtBQUNiLGNBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1NBQzNDO09BQ0Y7S0FDRixDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQW5ERyxRQUFROztXQW9ERCx1QkFBUztBQUNsQixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQTtLQUNoRzs7Ozs7V0FFZ0IsNkJBQVM7QUFDeEIsVUFBTSxVQUFVLEdBQUcsbUNBQXFCLENBQUE7QUFDeEMsK0JBQVUsVUFBVSxFQUFFLHVFQUF1RSxDQUFDLENBQUE7QUFDOUYsVUFBTSxRQUFRLEdBQUcsMkJBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsNkJBQWUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3RILGNBQVEsQ0FBQyxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUU7QUFDakMsWUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFFLHNDQUFjLFVBQVUsRUFBRSw0QkFBYyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUMvRDtPQUNGLENBQUMsQ0FBQTtLQUNIOzs7V0FDRyxjQUFDLE9BQWdCLEVBQUUsUUFBaUIsRUFBa0M7VUFBaEMsUUFBaUIseURBQUcsSUFBSTs7QUFDaEUsVUFBTSxhQUFhLEdBQUcsbUNBQXFCLENBQUE7QUFDM0MsVUFBTSxXQUFnQixHQUFHLEFBQUMsYUFBYSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSyxHQUFHLENBQUE7O0FBRTFFLFVBQU0sUUFBUSxHQUFHLDJCQUNmLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQ2xFLDZCQUFlLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLElBQUksR0FBRyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQ3ZFLENBQUE7QUFDRCxVQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUV0QyxVQUFJLENBQUMsYUFBYSxFQUFFO0FBQ2xCLFlBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDckUsWUFBSSxPQUFPLEVBQUU7QUFDWCxxQ0FBYSxPQUFPLENBQUMsQ0FBQTtTQUN0QjtBQUNELGVBQU07T0FDUDtBQUNELFVBQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFBOzs7OztBQUsvRCxVQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNuQjs7QUFFRCxVQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsVUFBSSxzQkFBc0IsR0FBRyxLQUFLLENBQUE7QUFDbEMsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE9BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6RCxZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0IsWUFBTSxXQUFXLEdBQUcsb0JBQU0sT0FBTyxDQUFDLENBQUE7QUFDbEMsWUFBTSxZQUFZLEdBQUcscUJBQU8sT0FBTyxDQUFDLENBQUE7O0FBRXBDLFlBQUksQ0FBQyxzQkFBc0IsSUFBSSxXQUFXLEtBQUssV0FBVyxFQUFFO0FBQzFELGdDQUFzQixHQUFHLElBQUksQ0FBQTtTQUM5QjtBQUNELFlBQUksV0FBVyxJQUFJLFlBQVksRUFBRTtBQUMvQixjQUFJLHNCQUFzQixJQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7QUFDekQsaUJBQUssR0FBRyxPQUFPLENBQUE7QUFDZixrQkFBSztXQUNOLE1BQU0sSUFBSSxXQUFXLEtBQUssV0FBVyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLGFBQWEsRUFBRTtBQUN2RyxpQkFBSyxHQUFHLE9BQU8sQ0FBQTtBQUNmLGtCQUFLO1dBQ047U0FDRjtPQUNGOztBQUVELFVBQUksQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTs7QUFFN0IsYUFBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNwQjs7QUFFRCxVQUFJLEtBQUssRUFBRTtBQUNULG1DQUFhLEtBQUssQ0FBQyxDQUFBO09BQ3BCO0tBQ0Y7OztXQUNLLGdCQUFDLFFBQThCLEVBQUU7QUFDckMsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7S0FDekI7OztXQUNNLG1CQUFTO0FBQ2QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBL0hHLFFBQVE7OztBQWtJZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQge1xuICAkZmlsZSxcbiAgJHJhbmdlLFxuICBnZXRBY3RpdmVUZXh0RWRpdG9yLFxuICB2aXNpdE1lc3NhZ2UsXG4gIHNvcnRNZXNzYWdlcyxcbiAgc29ydFNvbHV0aW9ucyxcbiAgZmlsdGVyTWVzc2FnZXMsXG4gIGFwcGx5U29sdXRpb24sXG59IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIENvbW1hbmRzIHtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dCc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCB0cnVlKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCB0cnVlKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtZXJyb3InOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpwcmV2aW91cy1lcnJvcic6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgdHJ1ZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LXdhcm5pbmcnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ3dhcm5pbmcnKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLXdhcm5pbmcnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIHRydWUsICd3YXJuaW5nJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LWluZm8nOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ2luZm8nKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluZm8nOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIHRydWUsICdpbmZvJyksXG5cbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIGZhbHNlKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgZmFsc2UpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1lcnJvci1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UsICdlcnJvcicpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtZXJyb3ItaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCBmYWxzZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LXdhcm5pbmctaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIGZhbHNlLCAnd2FybmluZycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtd2FybmluZy1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIGZhbHNlLCAnd2FybmluZycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1pbmZvLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCBmYWxzZSwgJ2luZm8nKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluZm8taW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCBmYWxzZSwgJ2luZm8nKSxcblxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6dG9nZ2xlLXBhbmVsJzogKCkgPT4gdGhpcy50b2dnbGVQYW5lbCgpLFxuXG4gICAgICAgIC8vIE5PVEU6IEFkZCBuby1vcHMgaGVyZSBzbyB0aGV5IGFyZSByZWNvZ25pemVkIGJ5IGNvbW1hbmRzIHJlZ2lzdHJ5XG4gICAgICAgIC8vIFJlYWwgY29tbWFuZHMgYXJlIHJlZ2lzdGVyZWQgd2hlbiB0b29sdGlwIGlzIHNob3duIGluc2lkZSB0b29sdGlwJ3MgZGVsZWdhdGVcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmV4cGFuZC10b29sdGlwJzogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmNvbGxhcHNlLXRvb2x0aXAnOiBmdW5jdGlvbigpIHt9LFxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsIHtcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmFwcGx5LWFsbC1zb2x1dGlvbnMnOiAoKSA9PiB0aGlzLmFwcGx5QWxsU29sdXRpb25zKCksXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCcjbGludGVyLXBhbmVsJywge1xuICAgICAgICAnY29yZTpjb3B5JzogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGRvY3VtZW50LmdldFNlbGVjdGlvbigpXG4gICAgICAgICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoc2VsZWN0aW9uLnRvU3RyaW5nKCkpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIHRvZ2dsZVBhbmVsKCk6IHZvaWQge1xuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgIWF0b20uY29uZmlnLmdldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJykpXG4gIH1cbiAgLy8gTk9URTogQXBwbHkgc29sdXRpb25zIGZyb20gYm90dG9tIHRvIHRvcCwgc28gdGhleSBkb24ndCBpbnZhbGlkYXRlIGVhY2ggb3RoZXJcbiAgYXBwbHlBbGxTb2x1dGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGludmFyaWFudCh0ZXh0RWRpdG9yLCAndGV4dEVkaXRvciB3YXMgbnVsbCBvbiBhIGNvbW1hbmQgc3VwcG9zZWQgdG8gcnVuIG9uIHRleHQtZWRpdG9ycyBvbmx5JylcbiAgICBjb25zdCBtZXNzYWdlcyA9IHNvcnRNZXNzYWdlcyhbeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2Rlc2MnIH1dLCBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLmdldFBhdGgoKSkpXG4gICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAyICYmIG1lc3NhZ2Uuc29sdXRpb25zICYmIG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aCkge1xuICAgICAgICBhcHBseVNvbHV0aW9uKHRleHRFZGl0b3IsIHNvcnRTb2x1dGlvbnMobWVzc2FnZS5zb2x1dGlvbnMpWzBdKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgbW92ZShmb3J3YXJkOiBib29sZWFuLCBnbG9iYWxseTogYm9vbGVhbiwgc2V2ZXJpdHk6ID9zdHJpbmcgPSBudWxsKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbnN0IGN1cnJlbnRGaWxlOiBhbnkgPSAoY3VycmVudEVkaXRvciAmJiBjdXJyZW50RWRpdG9yLmdldFBhdGgoKSkgfHwgTmFOXG4gICAgLy8gTk9URTogXiBTZXR0aW5nIGRlZmF1bHQgdG8gTmFOIHNvIGl0IHdvbid0IG1hdGNoIGVtcHR5IGZpbGUgcGF0aHMgaW4gbWVzc2FnZXNcbiAgICBjb25zdCBtZXNzYWdlcyA9IHNvcnRNZXNzYWdlcyhcbiAgICAgIFt7IGNvbHVtbjogJ2ZpbGUnLCB0eXBlOiAnYXNjJyB9LCB7IGNvbHVtbjogJ2xpbmUnLCB0eXBlOiAnYXNjJyB9XSxcbiAgICAgIGZpbHRlck1lc3NhZ2VzKHRoaXMubWVzc2FnZXMsIGdsb2JhbGx5ID8gbnVsbCA6IGN1cnJlbnRGaWxlLCBzZXZlcml0eSksXG4gICAgKVxuICAgIGNvbnN0IGV4cGVjdGVkVmFsdWUgPSBmb3J3YXJkID8gLTEgOiAxXG5cbiAgICBpZiAoIWN1cnJlbnRFZGl0b3IpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3J3YXJkID8gbWVzc2FnZXNbMF0gOiBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXVxuICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgdmlzaXRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gY3VycmVudEVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG5cbiAgICAvLyBOT1RFOiBJdGVyYXRlIGJvdHRvbSB0byB0b3AgdG8gZmluZCB0aGUgcHJldmlvdXMgbWVzc2FnZVxuICAgIC8vIEJlY2F1c2UgaWYgd2Ugc2VhcmNoIHRvcCB0byBib3R0b20gd2hlbiBzb3J0ZWQsIGZpcnN0IGl0ZW0gd2lsbCBhbHdheXNcbiAgICAvLyBiZSB0aGUgc21hbGxlc3RcbiAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgIG1lc3NhZ2VzLnJldmVyc2UoKVxuICAgIH1cblxuICAgIGxldCBmb3VuZFxuICAgIGxldCBjdXJyZW50RmlsZUVuY291bnRlcmVkID0gZmFsc2VcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlc1tpXVxuICAgICAgY29uc3QgbWVzc2FnZUZpbGUgPSAkZmlsZShtZXNzYWdlKVxuICAgICAgY29uc3QgbWVzc2FnZVJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG5cbiAgICAgIGlmICghY3VycmVudEZpbGVFbmNvdW50ZXJlZCAmJiBtZXNzYWdlRmlsZSA9PT0gY3VycmVudEZpbGUpIHtcbiAgICAgICAgY3VycmVudEZpbGVFbmNvdW50ZXJlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlRmlsZSAmJiBtZXNzYWdlUmFuZ2UpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRGaWxlRW5jb3VudGVyZWQgJiYgbWVzc2FnZUZpbGUgIT09IGN1cnJlbnRGaWxlKSB7XG4gICAgICAgICAgZm91bmQgPSBtZXNzYWdlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlRmlsZSA9PT0gY3VycmVudEZpbGUgJiYgY3VycmVudFBvc2l0aW9uLmNvbXBhcmUobWVzc2FnZVJhbmdlLnN0YXJ0KSA9PT0gZXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgICAgIGZvdW5kID0gbWVzc2FnZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gUmVzZXQgYmFjayB0byBmaXJzdCBvciBsYXN0IGRlcGVuZGluZyBvbiBkaXJlY3Rpb25cbiAgICAgIGZvdW5kID0gbWVzc2FnZXNbMF1cbiAgICB9XG5cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHZpc2l0TWVzc2FnZShmb3VuZClcbiAgICB9XG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPikge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICB9XG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWFuZHNcbiJdfQ==