var _atom = require('atom');

// import { isListItem, wrapText } from './functions'

'use babel';

CSON = require('season');
fs = require('fs');
GrammarCompiler = require('./GrammarCompiler');
path = require('path');

module.exports = {
  config: {
    addListItems: {
      title: 'Add new list-items',
      description: 'Automatically add a new list-item after the current (non-empty) one when pressing <kbd>ENTER</kbd>',
      type: 'boolean',
      'default': true
    },

    autoIncrementListItems: {
      title: 'Increment Ordered List Items',
      description: 'Automatically increment a new list-item after the current(non-empty) one when pressing <kbd>ENTER</kbd>',
      type: 'boolean',
      'default': true
    },

    disableLanguageGfm: {
      title: 'Disable language-gfm',
      description: 'Disable the default `language-gfm` package as this package is intended as its replacement',
      type: 'boolean',
      'default': true
    },

    emphasisShortcuts: {
      title: 'Emphasis shortcuts',
      description: 'Enables keybindings `_` for emphasis, `*` for strong emphasis, and `~` for strike-through on selected text; emphasizing an already emphasized selection will de-emphasize it',
      type: 'boolean',
      'default': true
    },

    indentListItems: {
      title: 'Indent list-items',
      description: 'Automatically in- and outdent list-items by pressing `TAB` and `SHIFT+TAB`',
      type: 'boolean',
      'default': true
    },

    linkShortcuts: {
      title: 'Link shortcuts',
      description: 'Enables keybindings `@` for converting the selected text to a link and `!` for converting the selected text to an image',
      type: 'boolean',
      'default': true
    },

    removeEmptyListItems: {
      title: 'Remove empty list-items',
      description: 'Remove the automatically created empty list-items when left empty, leaving an empty line',
      type: 'boolean',
      'default': true
    }
  },

  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.addCommands();

    /*
    Unless you are an advanced user, there is no need to have both this package
    and the one it replaces (language-gfm) enabled.
     If you are an advanced user, you can easily re-enable language-gfm again.
    */
    if (atom.config.get('language-markdown.disableLanguageGfm')) {
      if (!atom.packages.isPackageDisabled('language-gfm')) {
        atom.packages.disablePackage('language-gfm');
      }
    }

    /*
    I forgot why this action is created inline in activate() and not as a
    separate method, but there was a good reason for it.
    */
    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      editor.onDidInsertText(function (event) {
        var grammar = editor.getGrammar();

        if (grammar.name !== 'Markdown') return;
        if (!atom.config.get('language-markdown.addListItems')) return;
        if (event.text !== '\n') return;

        /*
        At this point, it is rather tedious (as far as I know) to get to the
        tokenized version of {previousLine}. That is the reason why {tokens} a
        little further down is tokenized. But at this stage, we do need to know
        if {previousLine} was in fact Markdown, or from a different perspective,
        not a piece of embedded code. The reason for that is that the tokenized
        line below is tokenized without any context, so is Markdown by default.
        Therefore we determine if our current position is part of embedded code
        or not.
        */

        var previousRowNumber = event.range.start.row;
        var previousRowRange = editor.buffer.rangeForRow(previousRowNumber);
        if (_this.isEmbeddedCode(editor, previousRowRange)) return;

        var previousLine = editor.getTextInRange(previousRowRange);

        var _grammar$tokenizeLine = grammar.tokenizeLine(previousLine);

        var tokens = _grammar$tokenizeLine.tokens;

        tokens.reverse();
        var leadingWhitespaces = 0;
        var hasNonEmptyText = false;
        for (var token of tokens) {
          var isPunctuation = false;
          var isListItem = false;
          var typeOfList = undefined;

          var scopes = token.scopes.reverse();
          for (var scope of scopes) {
            var classes = scope.split('.');

            /*
            Check and remember if line has non-empty (other than whitespaces)
            text tokens.
            */
            if (classes.includes('text') && !/^\s*$/.test(token.value)) {
              hasNonEmptyText = true;
            }

            /*
            A list-item is valid when a punctuation class is immediately
            followed by a non-empty list-item class.
            */
            if (classes.includes('punctuation')) {
              isPunctuation = true;
            } else if (isPunctuation && classes.includes('list')) {
              if (!classes.includes('empty') && hasNonEmptyText) {
                isListItem = true;
                typeOfList = 'unordered';
                if (classes.includes('ordered')) {
                  typeOfList = 'ordered';
                }
                if (classes.includes('definition')) {
                  typeOfList = 'definition';
                }
                break;
              } else {
                isListItem = false;
                isPunctuation = false;
                if (atom.config.get('language-markdown.removeEmptyListItems')) {
                  editor.setTextInBufferRange(previousRowRange, '');
                }
              }
            } else {
              isPunctuation = false;
            }
          }

          if (!isListItem) {
            leadingWhitespaces = token.value.match(/^ */)[0].length;
          }

          if (isListItem && typeOfList !== 'definition') {
            var text = token.value;
            if (typeOfList === 'ordered') {
              var _length = text.length;
              var punctuation = text.match(/[^\d]+/);
              var value = parseInt(text);
              if (atom.config.get('language-markdown.autoIncrementListItems')) {
                value = value + 1;
              }
              text = value + punctuation;
              if (text.length < _length) {
                for (var j = 0; j < text.length - _length + 1; j++) {
                  text = '0' + text;
                }
              }
            } else {
              text = text.replace('x', ' ');
            }
            editor.insertText(text + ' '.repeat(leadingWhitespaces));
            break;
          }
        }
      });
    }));
  },

  addCommands: function addCommands() {
    var _this2 = this;

    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:indent-list-item', function (event) {
      return _this2.indentListItem(event);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:outdent-list-item', function (event) {
      return _this2.outdentListItem(event);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:emphasis', function (event) {
      return _this2.emphasizeSelection(event, '_');
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:strong-emphasis', function (event) {
      return _this2.emphasizeSelection(event, '**');
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:strike-through', function (event) {
      return _this2.emphasizeSelection(event, '~~');
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:link', function (event) {
      return _this2.linkSelection(event);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:image', function (event) {
      return _this2.linkSelection(event, true);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:toggle-task', function (event) {
      return _this2.toggleTask(event);
    }));

    if (atom.inDevMode()) {
      this.subscriptions.add(atom.commands.add('atom-workspace', 'markdown:compile-grammar-and-reload', function () {
        return _this2.compileGrammar();
      }));
    }
  },

  indentListItem: function indentListItem(event) {
    var _getEditorAndPosition2 = this._getEditorAndPosition(event);

    var editor = _getEditorAndPosition2.editor;
    var position = _getEditorAndPosition2.position;

    var indentListItems = atom.config.get('language-markdown.indentListItems');
    if (indentListItems && this.isListItem(editor, position)) {
      editor.indentSelectedRows(position.row);
      return;
    }
    event.abortKeyBinding();
  },

  outdentListItem: function outdentListItem(event) {
    var _getEditorAndPosition3 = this._getEditorAndPosition(event);

    var editor = _getEditorAndPosition3.editor;
    var position = _getEditorAndPosition3.position;

    var indentListItems = atom.config.get('language-markdown.indentListItems');
    if (indentListItems && this.isListItem(editor, position)) {
      editor.outdentSelectedRows(position.row);
      return;
    }
    event.abortKeyBinding();
  },

  emphasizeSelection: function emphasizeSelection(event, token) {
    var didSomeWrapping = false;
    if (atom.config.get('language-markdown.emphasisShortcuts')) {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;

      var ranges = this.getSelectedBufferRangesReversed(editor);
      for (var range of ranges) {
        var text = editor.getTextInBufferRange(range);
        /*
        Skip texts that contain a line-break, or are empty.
        Multi-line emphasis is not supported 'anyway'.
         If afterwards not a single selection has been wrapped, cancel the event
        and insert the character as normal.
         If two cursors were found, but only one of them was a selection, and the
        other a normal cursor, then the normal cursor is ignored, and the single
        selection will be wrapped.
        */
        if (text.length !== 0 && text.indexOf('\n') === -1) {
          var wrappedText = this.wrapText(text, token);
          editor.setTextInBufferRange(range, wrappedText);
          didSomeWrapping = true;
        }
      }
    }
    if (!didSomeWrapping) {
      event.abortKeyBinding();
    }
    return;
  },

  // TODO: Doesn't place the cursor at the right position afterwards
  linkSelection: function linkSelection(event) {
    var isImage = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var didSomeWrapping = false;

    if (!atom.config.get('language-markdown.linkShortcuts')) {
      event.abortKeyBinding();
      return;
    }

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    var ranges = this.getSelectedBufferRangesReversed(editor);
    var cursorOffsets = [];
    for (var range of ranges) {
      var text = editor.getTextInBufferRange(range);
      // See {emphasizeSelection}
      if (text.length !== 0 && text.indexOf('\n') === -1) {
        var imageToken = isImage ? '!' : '';
        if (text.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
          var newText = imageToken + '[](' + text + ')';
          editor.setTextInBufferRange(range, newText);
          cursorOffsets.push(text.length + 3);
        } else {
          var newText = imageToken + '[' + text + ']()';
          editor.setTextInBufferRange(range, newText);
          cursorOffsets.push(1);
        }
        didSomeWrapping = true;
      }
    }

    if (didSomeWrapping) {
      /*
      Cursors aren't separate entities, but rather simple {Point}s, ie,
      positions in the buffer. There is no way of updating a cursor. Instead,
      we clear all cursors, and then re-create them from where our current
      selections are.
       After the image/link wrapping above, the cursor are positioned after the
      selections, and the desired relative locations for the new cursors are
      stored in {cursorOffsets}. We only need to loop through the current
      selections, and create a new cursor for every selection.
       A selection without a length is a simple cursor that can be re-created at
      that exact location.
       TODO: maybe one of those fancy generators can be used for our
      cursorOffsets?
      */
      var selections = editor.getSelectedBufferRanges();
      var count = 0;
      var offsetCount = 0;
      for (var selection of selections) {
        var start = selection.start;
        var end = selection.end;

        if (start.row === end.row && start.column === end.column) {
          if (count) {
            editor.addCursorAtBufferPosition(start);
          } else {
            editor.setCursorBufferPosition(start);
          }
        } else {
          var position = {
            row: end.row,
            column: end.column - cursorOffsets[offsetCount]
          };
          if (count) {
            editor.addCursorAtBufferPosition(position);
          } else {
            editor.setCursorBufferPosition(position);
          }
          offsetCount++;
        }
        count++;
      }
    } else {
      event.abortKeyBinding();
    }

    return;
  },

  _getEditorAndPosition: function _getEditorAndPosition(event) {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      var positions = editor.getCursorBufferPositions();
      if (positions) {
        var position = positions[0];
        return { editor: editor, position: position };
      }
    }
    event.abortKeyBinding();
  },

  toggleTask: function toggleTask(event) {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      event.abortKeyBinding();
      return;
    }

    var ranges = editor.getSelectedBufferRanges();
    for (var range of ranges) {
      var start = range.start;
      var end = range.end;

      for (var row = start.row; row <= end.row; row++) {
        var listItem = this.isListItem(editor, [row, 0]);
        if (listItem && listItem.includes('task')) {
          var currentLine = editor.lineTextForBufferRow(row);
          var newLine = undefined;
          if (listItem.includes('completed')) {
            newLine = currentLine.replace(/ \[(x|X)\] /, ' [ ] ');
          } else {
            newLine = currentLine.replace(' [ ] ', ' [x] ');
          }
          var newRange = [[row, 0], [row, newLine.length]];
          editor.setTextInBufferRange(newRange, newLine);
        }
      }
    }
    return;
  },

  isListItem: function isListItem(editor, position) {
    if (editor) {
      if (editor.getGrammar().name === 'Markdown') {
        var scopeDescriptor = editor.scopeDescriptorForBufferPosition(position);
        for (var scope of scopeDescriptor.scopes) {
          if (scope.includes('list')) {
            /*
            Return {scope}, which evaluates as {true} and can be used by other
            functions to determine the type of list-item
            */
            return scope;
          }
        }
      }
    }
    return false;
  },

  wrapText: function wrapText(text, token) {
    var length = token.length;
    if (text.substr(0, length) === token && text.substr(-length) === token) {
      return text.substr(length, text.length - length * 2);
    } else {
      return token + text + token;
    }
  },

  isEmbeddedCode: function isEmbeddedCode(editor, range) {
    var scopeDescriptor = editor.scopeDescriptorForBufferPosition(range.end);
    for (var scope of scopeDescriptor.scopes) {
      if (scope.includes('source')) return true;
    }
    return false;
  },

  /*
  Selection are returned in the reverse order that they were created by the
  user. We need them in the reverse order that they appear in the document,
  because we don't need a previous changes selection changing the buffer
  position of our selections.
  */
  getSelectedBufferRangesReversed: function getSelectedBufferRangesReversed(editor) {
    var ranges = editor.getSelectedBufferRanges();
    ranges.sort(function (a, b) {
      if (a.start.row > b.start.row) return -1;
      if (b.start.row > a.start.row) return 1;
      if (a.start.column > b.start.column) return -1;
      return 1;
    });
    return ranges;
  },

  compileGrammar: function compileGrammar() {
    if (atom.inDevMode()) {
      var compiler = new GrammarCompiler();
      compiler.compile();
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLW1hcmtkb3duL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJvQkFFK0MsTUFBTTs7OztBQUZyRCxXQUFXLENBQUE7O0FBS1gsSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN4QixFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xCLGVBQWUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUM5QyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUV0QixNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsUUFBTSxFQUFFO0FBQ04sZ0JBQVksRUFBRTtBQUNaLFdBQUssRUFBRSxvQkFBb0I7QUFDM0IsaUJBQVcsRUFBRSxvR0FBb0c7QUFDakgsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7O0FBRUQsMEJBQXNCLEVBQUU7QUFDcEIsV0FBSyxFQUFFLDhCQUE4QjtBQUNyQyxpQkFBVyxFQUFFLHlHQUF5RztBQUN0SCxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDaEI7O0FBRUQsc0JBQWtCLEVBQUU7QUFDbEIsV0FBSyxFQUFFLHNCQUFzQjtBQUM3QixpQkFBVyxFQUFFLDJGQUEyRjtBQUN4RyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDs7QUFFRCxxQkFBaUIsRUFBRTtBQUNqQixXQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGlCQUFXLEVBQUUsOEtBQThLO0FBQzNMLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkOztBQUVELG1CQUFlLEVBQUU7QUFDZixXQUFLLEVBQUUsbUJBQW1CO0FBQzFCLGlCQUFXLEVBQUUsNEVBQTRFO0FBQ3pGLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkOztBQUVELGlCQUFhLEVBQUU7QUFDYixX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LEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQTtBQUN0QyxjQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDbkI7R0FDRjtDQUNGLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtbWFya2Rvd24vbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXJlY3RvcnkgfSBmcm9tICdhdG9tJ1xuLy8gaW1wb3J0IHsgaXNMaXN0SXRlbSwgd3JhcFRleHQgfSBmcm9tICcuL2Z1bmN0aW9ucydcblxuQ1NPTiA9IHJlcXVpcmUoJ3NlYXNvbicpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcbkdyYW1tYXJDb21waWxlciA9IHJlcXVpcmUoJy4vR3JhbW1hckNvbXBpbGVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIGFkZExpc3RJdGVtczoge1xuICAgICAgdGl0bGU6ICdBZGQgbmV3IGxpc3QtaXRlbXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IGFkZCBhIG5ldyBsaXN0LWl0ZW0gYWZ0ZXIgdGhlIGN1cnJlbnQgKG5vbi1lbXB0eSkgb25lIHdoZW4gcHJlc3NpbmcgPGtiZD5FTlRFUjwva2JkPicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcblxuICAgIGF1dG9JbmNyZW1lbnRMaXN0SXRlbXM6IHtcbiAgICAgICAgdGl0bGU6ICdJbmNyZW1lbnQgT3JkZXJlZCBMaXN0IEl0ZW1zJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IGluY3JlbWVudCBhIG5ldyBsaXN0LWl0ZW0gYWZ0ZXIgdGhlIGN1cnJlbnQobm9uLWVtcHR5KSBvbmUgd2hlbiBwcmVzc2luZyA8a2JkPkVOVEVSPC9rYmQ+JyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcblxuICAgIGRpc2FibGVMYW5ndWFnZUdmbToge1xuICAgICAgdGl0bGU6ICdEaXNhYmxlIGxhbmd1YWdlLWdmbScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgdGhlIGRlZmF1bHQgYGxhbmd1YWdlLWdmbWAgcGFja2FnZSBhcyB0aGlzIHBhY2thZ2UgaXMgaW50ZW5kZWQgYXMgaXRzIHJlcGxhY2VtZW50JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgZW1waGFzaXNTaG9ydGN1dHM6IHtcbiAgICAgIHRpdGxlOiAnRW1waGFzaXMgc2hvcnRjdXRzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlcyBrZXliaW5kaW5ncyBgX2AgZm9yIGVtcGhhc2lzLCBgKmAgZm9yIHN0cm9uZyBlbXBoYXNpcywgYW5kIGB+YCBmb3Igc3RyaWtlLXRocm91Z2ggb24gc2VsZWN0ZWQgdGV4dDsgZW1waGFzaXppbmcgYW4gYWxyZWFkeSBlbXBoYXNpemVkIHNlbGVjdGlvbiB3aWxsIGRlLWVtcGhhc2l6ZSBpdCcsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcblxuICAgIGluZGVudExpc3RJdGVtczoge1xuICAgICAgdGl0bGU6ICdJbmRlbnQgbGlzdC1pdGVtcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1dG9tYXRpY2FsbHkgaW4tIGFuZCBvdXRkZW50IGxpc3QtaXRlbXMgYnkgcHJlc3NpbmcgYFRBQmAgYW5kIGBTSElGVCtUQUJgJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgbGlua1Nob3J0Y3V0czoge1xuICAgICAgdGl0bGU6ICdMaW5rIHNob3J0Y3V0cycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZXMga2V5YmluZGluZ3MgYEBgIGZvciBjb252ZXJ0aW5nIHRoZSBzZWxlY3RlZCB0ZXh0IHRvIGEgbGluayBhbmQgYCFgIGZvciBjb252ZXJ0aW5nIHRoZSBzZWxlY3RlZCB0ZXh0IHRvIGFuIGltYWdlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgcmVtb3ZlRW1wdHlMaXN0SXRlbXM6IHtcbiAgICAgIHRpdGxlOiAnUmVtb3ZlIGVtcHR5IGxpc3QtaXRlbXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdSZW1vdmUgdGhlIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBlbXB0eSBsaXN0LWl0ZW1zIHdoZW4gbGVmdCBlbXB0eSwgbGVhdmluZyBhbiBlbXB0eSBsaW5lJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9XG4gIH0sXG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICBhY3RpdmF0ZSAoc3RhdGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5hZGRDb21tYW5kcygpXG5cbiAgICAvKlxuICAgIFVubGVzcyB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIsIHRoZXJlIGlzIG5vIG5lZWQgdG8gaGF2ZSBib3RoIHRoaXMgcGFja2FnZVxuICAgIGFuZCB0aGUgb25lIGl0IHJlcGxhY2VzIChsYW5ndWFnZS1nZm0pIGVuYWJsZWQuXG5cbiAgICBJZiB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIsIHlvdSBjYW4gZWFzaWx5IHJlLWVuYWJsZSBsYW5ndWFnZS1nZm0gYWdhaW4uXG4gICAgKi9cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1tYXJrZG93bi5kaXNhYmxlTGFuZ3VhZ2VHZm0nKSkge1xuICAgICAgaWYgKCFhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKCdsYW5ndWFnZS1nZm0nKSkge1xuICAgICAgICBhdG9tLnBhY2thZ2VzLmRpc2FibGVQYWNrYWdlKCdsYW5ndWFnZS1nZm0nKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgSSBmb3Jnb3Qgd2h5IHRoaXMgYWN0aW9uIGlzIGNyZWF0ZWQgaW5saW5lIGluIGFjdGl2YXRlKCkgYW5kIG5vdCBhcyBhXG4gICAgc2VwYXJhdGUgbWV0aG9kLCBidXQgdGhlcmUgd2FzIGEgZ29vZCByZWFzb24gZm9yIGl0LlxuICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIGVkaXRvci5vbkRpZEluc2VydFRleHQoZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKVxuXG4gICAgICAgIGlmIChncmFtbWFyLm5hbWUgIT09ICdNYXJrZG93bicpIHJldHVyblxuICAgICAgICBpZiAoIWF0b20uY29uZmlnLmdldCgnbGFuZ3VhZ2UtbWFya2Rvd24uYWRkTGlzdEl0ZW1zJykpIHJldHVyblxuICAgICAgICBpZiAoZXZlbnQudGV4dCAhPT0gJ1xcbicpIHJldHVyblxuXG4gICAgICAgIC8qXG4gICAgICAgIEF0IHRoaXMgcG9pbnQsIGl0IGlzIHJhdGhlciB0ZWRpb3VzIChhcyBmYXIgYXMgSSBrbm93KSB0byBnZXQgdG8gdGhlXG4gICAgICAgIHRva2VuaXplZCB2ZXJzaW9uIG9mIHtwcmV2aW91c0xpbmV9LiBUaGF0IGlzIHRoZSByZWFzb24gd2h5IHt0b2tlbnN9IGFcbiAgICAgICAgbGl0dGxlIGZ1cnRoZXIgZG93biBpcyB0b2tlbml6ZWQuIEJ1dCBhdCB0aGlzIHN0YWdlLCB3ZSBkbyBuZWVkIHRvIGtub3dcbiAgICAgICAgaWYge3ByZXZpb3VzTGluZX0gd2FzIGluIGZhY3QgTWFya2Rvd24sIG9yIGZyb20gYSBkaWZmZXJlbnQgcGVyc3BlY3RpdmUsXG4gICAgICAgIG5vdCBhIHBpZWNlIG9mIGVtYmVkZGVkIGNvZGUuIFRoZSByZWFzb24gZm9yIHRoYXQgaXMgdGhhdCB0aGUgdG9rZW5pemVkXG4gICAgICAgIGxpbmUgYmVsb3cgaXMgdG9rZW5pemVkIHdpdGhvdXQgYW55IGNvbnRleHQsIHNvIGlzIE1hcmtkb3duIGJ5IGRlZmF1bHQuXG4gICAgICAgIFRoZXJlZm9yZSB3ZSBkZXRlcm1pbmUgaWYgb3VyIGN1cnJlbnQgcG9zaXRpb24gaXMgcGFydCBvZiBlbWJlZGRlZCBjb2RlXG4gICAgICAgIG9yIG5vdC5cbiAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBwcmV2aW91c1Jvd051bWJlciA9IGV2ZW50LnJhbmdlLnN0YXJ0LnJvd1xuICAgICAgICBjb25zdCBwcmV2aW91c1Jvd1JhbmdlID0gZWRpdG9yLmJ1ZmZlci5yYW5nZUZvclJvdyhwcmV2aW91c1Jvd051bWJlcilcbiAgICAgICAgaWYgKHRoaXMuaXNFbWJlZGRlZENvZGUoZWRpdG9yLCBwcmV2aW91c1Jvd1JhbmdlKSkgcmV0dXJuXG5cbiAgICAgICAgY29uc3QgcHJldmlvdXNMaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKHByZXZpb3VzUm93UmFuZ2UpXG4gICAgICAgIGxldCB7IHRva2VucyB9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUocHJldmlvdXNMaW5lKVxuICAgICAgICB0b2tlbnMucmV2ZXJzZSgpXG4gICAgICAgIGxldCBsZWFkaW5nV2hpdGVzcGFjZXMgPSAwXG4gICAgICAgIGxldCBoYXNOb25FbXB0eVRleHQgPSBmYWxzZVxuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vucykge1xuICAgICAgICAgIGxldCBpc1B1bmN0dWF0aW9uID0gZmFsc2VcbiAgICAgICAgICBsZXQgaXNMaXN0SXRlbSA9IGZhbHNlXG4gICAgICAgICAgbGV0IHR5cGVPZkxpc3RcblxuICAgICAgICAgIGNvbnN0IHNjb3BlcyA9IHRva2VuLnNjb3Blcy5yZXZlcnNlKClcbiAgICAgICAgICBmb3IgKGNvbnN0IHNjb3BlIG9mIHNjb3Blcykge1xuICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IHNjb3BlLnNwbGl0KCcuJylcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIENoZWNrIGFuZCByZW1lbWJlciBpZiBsaW5lIGhhcyBub24tZW1wdHkgKG90aGVyIHRoYW4gd2hpdGVzcGFjZXMpXG4gICAgICAgICAgICB0ZXh0IHRva2Vucy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoY2xhc3Nlcy5pbmNsdWRlcygndGV4dCcpICYmICEvXlxccyokLy50ZXN0KHRva2VuLnZhbHVlKSkge1xuICAgICAgICAgICAgICBoYXNOb25FbXB0eVRleHQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBBIGxpc3QtaXRlbSBpcyB2YWxpZCB3aGVuIGEgcHVuY3R1YXRpb24gY2xhc3MgaXMgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGZvbGxvd2VkIGJ5IGEgbm9uLWVtcHR5IGxpc3QtaXRlbSBjbGFzcy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoY2xhc3Nlcy5pbmNsdWRlcygncHVuY3R1YXRpb24nKSkge1xuICAgICAgICAgICAgICBpc1B1bmN0dWF0aW9uID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1B1bmN0dWF0aW9uICYmIGNsYXNzZXMuaW5jbHVkZXMoJ2xpc3QnKSkge1xuICAgICAgICAgICAgICBpZiAoIWNsYXNzZXMuaW5jbHVkZXMoJ2VtcHR5JykgJiYgaGFzTm9uRW1wdHlUZXh0KSB7XG4gICAgICAgICAgICAgICAgaXNMaXN0SXRlbSA9IHRydWVcbiAgICAgICAgICAgICAgICB0eXBlT2ZMaXN0ID0gJ3Vub3JkZXJlZCdcbiAgICAgICAgICAgICAgICBpZiAoY2xhc3Nlcy5pbmNsdWRlcygnb3JkZXJlZCcpKSB7XG4gICAgICAgICAgICAgICAgICB0eXBlT2ZMaXN0ID0gJ29yZGVyZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjbGFzc2VzLmluY2x1ZGVzKCdkZWZpbml0aW9uJykpIHtcbiAgICAgICAgICAgICAgICAgIHR5cGVPZkxpc3QgPSAnZGVmaW5pdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc0xpc3RJdGVtID0gZmFsc2VcbiAgICAgICAgICAgICAgICBpc1B1bmN0dWF0aW9uID0gZmFsc2VcbiAgICAgICAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1tYXJrZG93bi5yZW1vdmVFbXB0eUxpc3RJdGVtcycpKSB7XG4gICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocHJldmlvdXNSb3dSYW5nZSwgJycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpc1B1bmN0dWF0aW9uID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWlzTGlzdEl0ZW0pIHtcbiAgICAgICAgICAgIGxlYWRpbmdXaGl0ZXNwYWNlcyA9IHRva2VuLnZhbHVlLm1hdGNoKC9eICovKVswXS5sZW5ndGhcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNMaXN0SXRlbSAmJiB0eXBlT2ZMaXN0ICE9PSAnZGVmaW5pdGlvbicpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gdG9rZW4udmFsdWVcbiAgICAgICAgICAgIGlmICh0eXBlT2ZMaXN0ID09PSAnb3JkZXJlZCcpIHtcbiAgICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGhcbiAgICAgICAgICAgICAgY29uc3QgcHVuY3R1YXRpb24gPSB0ZXh0Lm1hdGNoKC9bXlxcZF0rLylcbiAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VJbnQodGV4dClcbiAgICAgICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGFuZ3VhZ2UtbWFya2Rvd24uYXV0b0luY3JlbWVudExpc3RJdGVtcycpKSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlICsgMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRleHQgPSB2YWx1ZSArIHB1bmN0dWF0aW9uXG4gICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGV4dC5sZW5ndGggLSBsZW5ndGggKyAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgIHRleHQgPSAnMCcgKyB0ZXh0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCd4JywgJyAnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQodGV4dCArICcgJy5yZXBlYXQobGVhZGluZ1doaXRlc3BhY2VzKSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pKVxuICB9LFxuXG4gIGFkZENvbW1hbmRzICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtkb3duOmluZGVudC1saXN0LWl0ZW0nLCAoZXZlbnQpID0+IHRoaXMuaW5kZW50TGlzdEl0ZW0oZXZlbnQpKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtkb3duOm91dGRlbnQtbGlzdC1pdGVtJywgKGV2ZW50KSA9PiB0aGlzLm91dGRlbnRMaXN0SXRlbShldmVudCkpKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnbWFya2Rvd246ZW1waGFzaXMnLCAoZXZlbnQpID0+IHRoaXMuZW1waGFzaXplU2VsZWN0aW9uKGV2ZW50LCAnXycpKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtkb3duOnN0cm9uZy1lbXBoYXNpcycsIChldmVudCkgPT4gdGhpcy5lbXBoYXNpemVTZWxlY3Rpb24oZXZlbnQsICcqKicpKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtkb3duOnN0cmlrZS10aHJvdWdoJywgKGV2ZW50KSA9PiB0aGlzLmVtcGhhc2l6ZVNlbGVjdGlvbihldmVudCwgJ35+JykpKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnbWFya2Rvd246bGluaycsIChldmVudCkgPT4gdGhpcy5saW5rU2VsZWN0aW9uKGV2ZW50KSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdtYXJrZG93bjppbWFnZScsIChldmVudCkgPT4gdGhpcy5saW5rU2VsZWN0aW9uKGV2ZW50LCB0cnVlKSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdtYXJrZG93bjp0b2dnbGUtdGFzaycsIChldmVudCkgPT4gdGhpcy50b2dnbGVUYXNrKGV2ZW50KSkpXG5cbiAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnbWFya2Rvd246Y29tcGlsZS1ncmFtbWFyLWFuZC1yZWxvYWQnLCAoKSA9PiB0aGlzLmNvbXBpbGVHcmFtbWFyKCkpKVxuICAgIH1cbiAgfSxcblxuICBpbmRlbnRMaXN0SXRlbSAoZXZlbnQpIHtcbiAgICBjb25zdCB7IGVkaXRvciwgcG9zaXRpb24gfSA9IHRoaXMuX2dldEVkaXRvckFuZFBvc2l0aW9uKGV2ZW50KVxuICAgIGNvbnN0IGluZGVudExpc3RJdGVtcyA9IGF0b20uY29uZmlnLmdldCgnbGFuZ3VhZ2UtbWFya2Rvd24uaW5kZW50TGlzdEl0ZW1zJylcbiAgICBpZiAoaW5kZW50TGlzdEl0ZW1zICYmIHRoaXMuaXNMaXN0SXRlbShlZGl0b3IsIHBvc2l0aW9uKSkge1xuICAgICAgZWRpdG9yLmluZGVudFNlbGVjdGVkUm93cyhwb3NpdGlvbi5yb3cpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZXZlbnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgfSxcblxuICBvdXRkZW50TGlzdEl0ZW0gKGV2ZW50KSB7XG4gICAgY29uc3QgeyBlZGl0b3IsIHBvc2l0aW9uIH0gPSB0aGlzLl9nZXRFZGl0b3JBbmRQb3NpdGlvbihldmVudClcbiAgICBjb25zdCBpbmRlbnRMaXN0SXRlbXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLW1hcmtkb3duLmluZGVudExpc3RJdGVtcycpXG4gICAgaWYgKGluZGVudExpc3RJdGVtcyAmJiB0aGlzLmlzTGlzdEl0ZW0oZWRpdG9yLCBwb3NpdGlvbikpIHtcbiAgICAgIGVkaXRvci5vdXRkZW50U2VsZWN0ZWRSb3dzKHBvc2l0aW9uLnJvdylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBldmVudC5hYm9ydEtleUJpbmRpbmcoKVxuICB9LFxuXG4gIGVtcGhhc2l6ZVNlbGVjdGlvbiAoZXZlbnQsIHRva2VuKSB7XG4gICAgbGV0IGRpZFNvbWVXcmFwcGluZyA9IGZhbHNlXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGFuZ3VhZ2UtbWFya2Rvd24uZW1waGFzaXNTaG9ydGN1dHMnKSkge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAoIWVkaXRvcikgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHJhbmdlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXNSZXZlcnNlZChlZGl0b3IpXG4gICAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIHJhbmdlcykge1xuICAgICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICAvKlxuICAgICAgICBTa2lwIHRleHRzIHRoYXQgY29udGFpbiBhIGxpbmUtYnJlYWssIG9yIGFyZSBlbXB0eS5cbiAgICAgICAgTXVsdGktbGluZSBlbXBoYXNpcyBpcyBub3Qgc3VwcG9ydGVkICdhbnl3YXknLlxuXG4gICAgICAgIElmIGFmdGVyd2FyZHMgbm90IGEgc2luZ2xlIHNlbGVjdGlvbiBoYXMgYmVlbiB3cmFwcGVkLCBjYW5jZWwgdGhlIGV2ZW50XG4gICAgICAgIGFuZCBpbnNlcnQgdGhlIGNoYXJhY3RlciBhcyBub3JtYWwuXG5cbiAgICAgICAgSWYgdHdvIGN1cnNvcnMgd2VyZSBmb3VuZCwgYnV0IG9ubHkgb25lIG9mIHRoZW0gd2FzIGEgc2VsZWN0aW9uLCBhbmQgdGhlXG4gICAgICAgIG90aGVyIGEgbm9ybWFsIGN1cnNvciwgdGhlbiB0aGUgbm9ybWFsIGN1cnNvciBpcyBpZ25vcmVkLCBhbmQgdGhlIHNpbmdsZVxuICAgICAgICBzZWxlY3Rpb24gd2lsbCBiZSB3cmFwcGVkLlxuICAgICAgICAqL1xuICAgICAgICBpZiAodGV4dC5sZW5ndGggIT09IDAgJiYgdGV4dC5pbmRleE9mKCdcXG4nKSA9PT0gLTEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkVGV4dCA9IHRoaXMud3JhcFRleHQodGV4dCwgdG9rZW4pXG4gICAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCB3cmFwcGVkVGV4dClcbiAgICAgICAgICBkaWRTb21lV3JhcHBpbmcgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFkaWRTb21lV3JhcHBpbmcpIHtcbiAgICAgIGV2ZW50LmFib3J0S2V5QmluZGluZygpXG4gICAgfVxuICAgIHJldHVyblxuICB9LFxuXG4gIC8vIFRPRE86IERvZXNuJ3QgcGxhY2UgdGhlIGN1cnNvciBhdCB0aGUgcmlnaHQgcG9zaXRpb24gYWZ0ZXJ3YXJkc1xuICBsaW5rU2VsZWN0aW9uIChldmVudCwgaXNJbWFnZSA9IGZhbHNlKSB7XG4gICAgbGV0IGRpZFNvbWVXcmFwcGluZyA9IGZhbHNlXG5cbiAgICBpZiAoIWF0b20uY29uZmlnLmdldCgnbGFuZ3VhZ2UtbWFya2Rvd24ubGlua1Nob3J0Y3V0cycpKSB7XG4gICAgICBldmVudC5hYm9ydEtleUJpbmRpbmcoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHJldHVyblxuXG4gICAgY29uc3QgcmFuZ2VzID0gdGhpcy5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlc1JldmVyc2VkKGVkaXRvcilcbiAgICBjb25zdCBjdXJzb3JPZmZzZXRzID0gW11cbiAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIHJhbmdlcykge1xuICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIC8vIFNlZSB7ZW1waGFzaXplU2VsZWN0aW9ufVxuICAgICAgaWYgKHRleHQubGVuZ3RoICE9PSAwICYmIHRleHQuaW5kZXhPZignXFxuJykgPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGltYWdlVG9rZW4gPSBpc0ltYWdlID8gJyEnIDogJydcbiAgICAgICAgaWYgKHRleHQubWF0Y2goL1stYS16QS1aMC05QDolLl9cXCt+Iz1dezIsMjU2fVxcLlthLXpdezIsNn1cXGIoWy1hLXpBLVowLTlAOiVfXFwrLn4jPyYvLz1dKikvKSkge1xuICAgICAgICAgIGNvbnN0IG5ld1RleHQgPSBgJHtpbWFnZVRva2VufVtdKCR7dGV4dH0pYFxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgbmV3VGV4dClcbiAgICAgICAgICBjdXJzb3JPZmZzZXRzLnB1c2godGV4dC5sZW5ndGggKyAzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG5ld1RleHQgPSBgJHtpbWFnZVRva2VufVske3RleHR9XSgpYFxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgbmV3VGV4dClcbiAgICAgICAgICBjdXJzb3JPZmZzZXRzLnB1c2goMSlcbiAgICAgICAgfVxuICAgICAgICBkaWRTb21lV3JhcHBpbmcgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpZFNvbWVXcmFwcGluZykge1xuICAgICAgLypcbiAgICAgIEN1cnNvcnMgYXJlbid0IHNlcGFyYXRlIGVudGl0aWVzLCBidXQgcmF0aGVyIHNpbXBsZSB7UG9pbnR9cywgaWUsXG4gICAgICBwb3NpdGlvbnMgaW4gdGhlIGJ1ZmZlci4gVGhlcmUgaXMgbm8gd2F5IG9mIHVwZGF0aW5nIGEgY3Vyc29yLiBJbnN0ZWFkLFxuICAgICAgd2UgY2xlYXIgYWxsIGN1cnNvcnMsIGFuZCB0aGVuIHJlLWNyZWF0ZSB0aGVtIGZyb20gd2hlcmUgb3VyIGN1cnJlbnRcbiAgICAgIHNlbGVjdGlvbnMgYXJlLlxuXG4gICAgICBBZnRlciB0aGUgaW1hZ2UvbGluayB3cmFwcGluZyBhYm92ZSwgdGhlIGN1cnNvciBhcmUgcG9zaXRpb25lZCBhZnRlciB0aGVcbiAgICAgIHNlbGVjdGlvbnMsIGFuZCB0aGUgZGVzaXJlZCByZWxhdGl2ZSBsb2NhdGlvbnMgZm9yIHRoZSBuZXcgY3Vyc29ycyBhcmVcbiAgICAgIHN0b3JlZCBpbiB7Y3Vyc29yT2Zmc2V0c30uIFdlIG9ubHkgbmVlZCB0byBsb29wIHRocm91Z2ggdGhlIGN1cnJlbnRcbiAgICAgIHNlbGVjdGlvbnMsIGFuZCBjcmVhdGUgYSBuZXcgY3Vyc29yIGZvciBldmVyeSBzZWxlY3Rpb24uXG5cbiAgICAgIEEgc2VsZWN0aW9uIHdpdGhvdXQgYSBsZW5ndGggaXMgYSBzaW1wbGUgY3Vyc29yIHRoYXQgY2FuIGJlIHJlLWNyZWF0ZWQgYXRcbiAgICAgIHRoYXQgZXhhY3QgbG9jYXRpb24uXG5cbiAgICAgIFRPRE86IG1heWJlIG9uZSBvZiB0aG9zZSBmYW5jeSBnZW5lcmF0b3JzIGNhbiBiZSB1c2VkIGZvciBvdXJcbiAgICAgIGN1cnNvck9mZnNldHM/XG4gICAgICAqL1xuICAgICAgY29uc3Qgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpXG4gICAgICBsZXQgY291bnQgPSAwXG4gICAgICBsZXQgb2Zmc2V0Q291bnQgPSAwXG4gICAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiBzZWxlY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gc2VsZWN0aW9uXG4gICAgICAgIGlmICgoc3RhcnQucm93ID09PSBlbmQucm93KSAmJiAoc3RhcnQuY29sdW1uID09PSBlbmQuY29sdW1uKSkge1xuICAgICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oc3RhcnQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihzdGFydClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICByb3c6IGVuZC5yb3csXG4gICAgICAgICAgICBjb2x1bW46IGVuZC5jb2x1bW4gLSBjdXJzb3JPZmZzZXRzW29mZnNldENvdW50XVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgICAgfVxuICAgICAgICAgIG9mZnNldENvdW50KytcbiAgICAgICAgfVxuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5hYm9ydEtleUJpbmRpbmcoKVxuICAgIH1cblxuICAgIHJldHVyblxuICB9LFxuXG4gIF9nZXRFZGl0b3JBbmRQb3NpdGlvbiAoZXZlbnQpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbnMgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKClcbiAgICAgIGlmIChwb3NpdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvbnNbMF1cbiAgICAgICAgcmV0dXJuIHsgZWRpdG9yLCBwb3NpdGlvbiB9XG4gICAgICB9XG4gICAgfVxuICAgIGV2ZW50LmFib3J0S2V5QmluZGluZygpXG4gIH0sXG5cbiAgdG9nZ2xlVGFzayAoZXZlbnQpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgZXZlbnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHJhbmdlcyA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpXG4gICAgZm9yIChjb25zdCByYW5nZSBvZiByYW5nZXMpIHtcbiAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gcmFuZ2VcbiAgICAgIGZvciAobGV0IHJvdyA9IHN0YXJ0LnJvdzsgcm93IDw9IGVuZC5yb3c7IHJvdysrKSB7XG4gICAgICAgIGNvbnN0IGxpc3RJdGVtID0gdGhpcy5pc0xpc3RJdGVtKGVkaXRvciwgW3JvdywgMF0pXG4gICAgICAgIGlmIChsaXN0SXRlbSAmJiBsaXN0SXRlbS5pbmNsdWRlcygndGFzaycpKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudExpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KVxuICAgICAgICAgIGxldCBuZXdMaW5lXG4gICAgICAgICAgaWYgKGxpc3RJdGVtLmluY2x1ZGVzKCdjb21wbGV0ZWQnKSkge1xuICAgICAgICAgICAgbmV3TGluZSA9IGN1cnJlbnRMaW5lLnJlcGxhY2UoLyBcXFsoeHxYKVxcXSAvLCAnIFsgXSAnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMaW5lID0gY3VycmVudExpbmUucmVwbGFjZSgnIFsgXSAnLCAnIFt4XSAnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuZXdSYW5nZSA9IFtbcm93LCAwXSwgW3JvdywgbmV3TGluZS5sZW5ndGhdXVxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShuZXdSYW5nZSwgbmV3TGluZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm5cbiAgfSxcblxuICBpc0xpc3RJdGVtIChlZGl0b3IsIHBvc2l0aW9uKSB7XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgaWYgKGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSA9PT0gJ01hcmtkb3duJykge1xuICAgICAgICBjb25zdCBzY29wZURlc2NyaXB0b3IgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgIGZvciAoY29uc3Qgc2NvcGUgb2Ygc2NvcGVEZXNjcmlwdG9yLnNjb3Blcykge1xuICAgICAgICAgIGlmIChzY29wZS5pbmNsdWRlcygnbGlzdCcpKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgUmV0dXJuIHtzY29wZX0sIHdoaWNoIGV2YWx1YXRlcyBhcyB7dHJ1ZX0gYW5kIGNhbiBiZSB1c2VkIGJ5IG90aGVyXG4gICAgICAgICAgICBmdW5jdGlvbnMgdG8gZGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGxpc3QtaXRlbVxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgd3JhcFRleHQgKHRleHQsIHRva2VuKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdG9rZW4ubGVuZ3RoXG4gICAgaWYgKCh0ZXh0LnN1YnN0cigwLCBsZW5ndGgpID09PSB0b2tlbikgJiYgKHRleHQuc3Vic3RyKC1sZW5ndGgpID09PSB0b2tlbikpIHtcbiAgICAgIHJldHVybiB0ZXh0LnN1YnN0cihsZW5ndGgsIHRleHQubGVuZ3RoIC0gbGVuZ3RoICogMilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRva2VuICsgdGV4dCArIHRva2VuXG4gICAgfVxuICB9LFxuXG4gIGlzRW1iZWRkZWRDb2RlIChlZGl0b3IsIHJhbmdlKSB7XG4gICAgY29uc3Qgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlLmVuZClcbiAgICBmb3IgKGNvbnN0IHNjb3BlIG9mIHNjb3BlRGVzY3JpcHRvci5zY29wZXMpIHtcbiAgICAgIGlmIChzY29wZS5pbmNsdWRlcygnc291cmNlJykpIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIC8qXG4gIFNlbGVjdGlvbiBhcmUgcmV0dXJuZWQgaW4gdGhlIHJldmVyc2Ugb3JkZXIgdGhhdCB0aGV5IHdlcmUgY3JlYXRlZCBieSB0aGVcbiAgdXNlci4gV2UgbmVlZCB0aGVtIGluIHRoZSByZXZlcnNlIG9yZGVyIHRoYXQgdGhleSBhcHBlYXIgaW4gdGhlIGRvY3VtZW50LFxuICBiZWNhdXNlIHdlIGRvbid0IG5lZWQgYSBwcmV2aW91cyBjaGFuZ2VzIHNlbGVjdGlvbiBjaGFuZ2luZyB0aGUgYnVmZmVyXG4gIHBvc2l0aW9uIG9mIG91ciBzZWxlY3Rpb25zLlxuICAqL1xuICBnZXRTZWxlY3RlZEJ1ZmZlclJhbmdlc1JldmVyc2VkIChlZGl0b3IpIHtcbiAgICBjb25zdCByYW5nZXMgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKVxuICAgIHJhbmdlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLnN0YXJ0LnJvdyA+IGIuc3RhcnQucm93KSByZXR1cm4gLTFcbiAgICAgIGlmIChiLnN0YXJ0LnJvdyA+IGEuc3RhcnQucm93KSByZXR1cm4gMVxuICAgICAgaWYgKGEuc3RhcnQuY29sdW1uID4gYi5zdGFydC5jb2x1bW4pIHJldHVybiAtMVxuICAgICAgcmV0dXJuIDFcbiAgICB9KVxuICAgIHJldHVybiByYW5nZXNcbiAgfSxcblxuICBjb21waWxlR3JhbW1hciAoKSB7XG4gICAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgIGNvbnN0IGNvbXBpbGVyID0gbmV3IEdyYW1tYXJDb21waWxlcigpXG4gICAgICBjb21waWxlci5jb21waWxlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==