Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ansiToHtml = require('ansi-to-html');

var _ansiToHtml2 = _interopRequireDefault(_ansiToHtml);

var _storeUtils = require('./store-utils');

var _atom = require('atom');

'use babel';

var OutputPanelManager = (function () {
  function OutputPanelManager() {
    _classCallCheck(this, OutputPanelManager);

    this.key = 'go-debug';
    this.tab = {
      name: 'Debug',
      packageName: 'go-debug',
      icon: 'bug'
    };
    this.subscriptions = new _atom.CompositeDisposable();

    this.props = {
      content: [{ type: 'text', value: 'Not started ...' }],
      replValue: '',
      replHistory: []
    };

    this.ansi = null;

    this.handleClickClean = this.handleClickClean.bind(this);
    this.handleEnterRepl = this.handleEnterRepl.bind(this);
    this.handleKeyDownRepl = this.handleKeyDownRepl.bind(this);
    this.handleChangeRepl = this.handleChangeRepl.bind(this);
  }

  _createClass(OutputPanelManager, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      this.ansi = null;
    }
  }, {
    key: 'ready',
    value: function ready() {
      return !!this._store && !!this._dbg;
    }
  }, {
    key: 'setStoreAndDbg',
    value: function setStoreAndDbg(store, dbg) {
      this._store = store;
      this._dbg = dbg;

      this.subscriptions.add((0, _storeUtils.subscribe)(store, 'delve.state', this.handleDelveStateChange.bind(this)), (0, _storeUtils.subscribe)(store, 'output.content', this.handleOutputContentChange.bind(this)));
    }
  }, {
    key: 'update',
    value: function update(props) {
      this.props = Object.assign({}, this.props, props);

      if (this.view) {
        this.view.update();
      }

      if (this.requestFocus && this.props.content.length > 0) {
        this.requestFocus();
      }
    }
  }, {
    key: 'handleDelveStateChange',
    value: function handleDelveStateChange(state, oldState) {
      if (state === 'notStarted') {
        this.ansi = null;
      }
    }
  }, {
    key: 'handleOutputContentChange',
    value: function handleOutputContentChange(content, oldContent) {
      var _this = this;

      var index = content.indexOf(this._lastContent);
      if (index > -1 && index === content.length - 1) {
        // nothing has changed
        return;
      }
      this._lastContent = content[content.length - 1];

      if (!this.ansi) {
        this.ansi = new _ansiToHtml2['default']({ stream: true, escapeXML: true });
      }

      var newContent = content.slice(index + 1).map(function (_ref) {
        var type = _ref.type;

        var rest = _objectWithoutProperties(_ref, ['type']);

        if (type === 'message') {
          return { type: type, message: _this.ansi.toHtml(rest.message) };
        }
        return _extends({ type: type }, rest);
      });

      if (index === -1) {
        // the last content does not exist anymore, so replace the whole content
      } else {
          // append the new content
          newContent = this.props.content.concat(newContent);
        }

      this.update({
        content: newContent
      });
    }
  }, {
    key: 'handleClickClean',
    value: function handleClickClean(ev) {
      ev.preventDefault();
      this._store.dispatch({ type: 'CLEAR_OUTPUT_CONTENT' });
    }
  }, {
    key: 'handleEnterRepl',
    value: function handleEnterRepl(value) {
      var _this2 = this;

      if (this._dbg && value) {
        this.update({
          replValue: '',
          replHistory: this.props.replHistory.concat(value),
          historyIndex: this.props.replHistory.length + 1
        });
        this._dbg.evaluate(value).then(function (variables) {
          if (variables) {
            _this2._store.dispatch({
              type: 'ADD_OUTPUT_CONTENT',
              content: {
                type: 'eval',
                variables: variables
              }
            });
          }
        });
      }
    }
  }, {
    key: 'handleKeyDownRepl',
    value: function handleKeyDownRepl(ev) {
      if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') {
        return;
      }

      var historyIndex = this.props.historyIndex;

      if (ev.key === 'ArrowUp' && historyIndex > 0) {
        historyIndex = historyIndex - 1;
      }
      if (ev.key === 'ArrowDown' && historyIndex < this.props.replHistory.length) {
        historyIndex = historyIndex + 1;
      }

      this.update({ historyIndex: historyIndex, replValue: this.props.replHistory[historyIndex] || '' });
    }
  }, {
    key: 'handleChangeRepl',
    value: function handleChangeRepl(replValue) {
      this.update({ replValue: replValue });
    }
  }]);

  return OutputPanelManager;
})();

exports['default'] = OutputPanelManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9vdXRwdXQtcGFuZWwtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzswQkFFaUIsY0FBYzs7OzswQkFDTCxlQUFlOztvQkFDTCxNQUFNOztBQUoxQyxXQUFXLENBQUE7O0lBTVUsa0JBQWtCO0FBQ3pCLFdBRE8sa0JBQWtCLEdBQ3RCOzBCQURJLGtCQUFrQjs7QUFFbkMsUUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUE7QUFDckIsUUFBSSxDQUFDLEdBQUcsR0FBRztBQUNULFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVcsRUFBRSxVQUFVO0FBQ3ZCLFVBQUksRUFBRSxLQUFLO0tBQ1osQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLENBQUM7QUFDckQsZUFBUyxFQUFFLEVBQUU7QUFDYixpQkFBVyxFQUFFLEVBQUU7S0FDaEIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTs7QUFFaEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEQsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN0RCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMxRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN6RDs7ZUF0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QUNQOztVQUVLLFlBQVksR0FBSyxJQUFJLENBQUMsS0FBSyxDQUEzQixZQUFZOztBQUNsQixVQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7QUFDNUMsb0JBQVksR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFBO09BQ2hDO0FBQ0QsVUFBSSxFQUFFLENBQUMsR0FBRyxLQUFLLFdBQVcsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQzFFLG9CQUFZLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQTtPQUNoQzs7QUFFRCxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUNyRjs7O1dBQ2dCLDBCQUFDLFNBQVMsRUFBRTtBQUMzQixVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxDQUFDLENBQUE7S0FDM0I7OztTQXZJa0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1kZWJ1Zy9saWIvb3V0cHV0LXBhbmVsLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgQW5zaSBmcm9tICdhbnNpLXRvLWh0bWwnXG5pbXBvcnQgeyBzdWJzY3JpYmUgfSBmcm9tICcuL3N0b3JlLXV0aWxzJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dHB1dFBhbmVsTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmtleSA9ICdnby1kZWJ1ZydcbiAgICB0aGlzLnRhYiA9IHtcbiAgICAgIG5hbWU6ICdEZWJ1ZycsXG4gICAgICBwYWNrYWdlTmFtZTogJ2dvLWRlYnVnJyxcbiAgICAgIGljb246ICdidWcnXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMucHJvcHMgPSB7XG4gICAgICBjb250ZW50OiBbeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAnTm90IHN0YXJ0ZWQgLi4uJyB9XSxcbiAgICAgIHJlcGxWYWx1ZTogJycsXG4gICAgICByZXBsSGlzdG9yeTogW11cbiAgICB9XG5cbiAgICB0aGlzLmFuc2kgPSBudWxsXG5cbiAgICB0aGlzLmhhbmRsZUNsaWNrQ2xlYW4gPSB0aGlzLmhhbmRsZUNsaWNrQ2xlYW4uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRW50ZXJSZXBsID0gdGhpcy5oYW5kbGVFbnRlclJlcGwuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlS2V5RG93blJlcGwgPSB0aGlzLmhhbmRsZUtleURvd25SZXBsLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUNoYW5nZVJlcGwgPSB0aGlzLmhhbmRsZUNoYW5nZVJlcGwuYmluZCh0aGlzKVxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5hbnNpID0gbnVsbFxuICB9XG5cbiAgcmVhZHkgKCkge1xuICAgIHJldHVybiAhIXRoaXMuX3N0b3JlICYmICEhdGhpcy5fZGJnXG4gIH1cbiAgc2V0U3RvcmVBbmREYmcgKHN0b3JlLCBkYmcpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlXG4gICAgdGhpcy5fZGJnID0gZGJnXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgc3Vic2NyaWJlKHN0b3JlLCAnZGVsdmUuc3RhdGUnLCB0aGlzLmhhbmRsZURlbHZlU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSksXG4gICAgICBzdWJzY3JpYmUoc3RvcmUsICdvdXRwdXQuY29udGVudCcsIHRoaXMuaGFuZGxlT3V0cHV0Q29udGVudENoYW5nZS5iaW5kKHRoaXMpKVxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywgcHJvcHMpXG5cbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXF1ZXN0Rm9jdXMgJiYgdGhpcy5wcm9wcy5jb250ZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVxdWVzdEZvY3VzKClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVEZWx2ZVN0YXRlQ2hhbmdlIChzdGF0ZSwgb2xkU3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09ICdub3RTdGFydGVkJykge1xuICAgICAgdGhpcy5hbnNpID0gbnVsbFxuICAgIH1cbiAgfVxuICBoYW5kbGVPdXRwdXRDb250ZW50Q2hhbmdlIChjb250ZW50LCBvbGRDb250ZW50KSB7XG4gICAgY29uc3QgaW5kZXggPSBjb250ZW50LmluZGV4T2YodGhpcy5fbGFzdENvbnRlbnQpXG4gICAgaWYgKGluZGV4ID4gLTEgJiYgaW5kZXggPT09IChjb250ZW50Lmxlbmd0aCAtIDEpKSB7XG4gICAgICAvLyBub3RoaW5nIGhhcyBjaGFuZ2VkXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5fbGFzdENvbnRlbnQgPSBjb250ZW50W2NvbnRlbnQubGVuZ3RoIC0gMV1cblxuICAgIGlmICghdGhpcy5hbnNpKSB7XG4gICAgICB0aGlzLmFuc2kgPSBuZXcgQW5zaSh7IHN0cmVhbTogdHJ1ZSwgZXNjYXBlWE1MOiB0cnVlIH0pXG4gICAgfVxuXG4gICAgbGV0IG5ld0NvbnRlbnQgPSBjb250ZW50LnNsaWNlKGluZGV4ICsgMSkubWFwKCh7IHR5cGUsIC4uLnJlc3QgfSkgPT4ge1xuICAgICAgaWYgKHR5cGUgPT09ICdtZXNzYWdlJykge1xuICAgICAgICByZXR1cm4geyB0eXBlLCBtZXNzYWdlOiB0aGlzLmFuc2kudG9IdG1sKHJlc3QubWVzc2FnZSkgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHsgdHlwZSwgLi4ucmVzdCB9XG4gICAgfSlcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIC8vIHRoZSBsYXN0IGNvbnRlbnQgZG9lcyBub3QgZXhpc3QgYW55bW9yZSwgc28gcmVwbGFjZSB0aGUgd2hvbGUgY29udGVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhcHBlbmQgdGhlIG5ldyBjb250ZW50XG4gICAgICBuZXdDb250ZW50ID0gdGhpcy5wcm9wcy5jb250ZW50LmNvbmNhdChuZXdDb250ZW50KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlKHtcbiAgICAgIGNvbnRlbnQ6IG5ld0NvbnRlbnRcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQ2xpY2tDbGVhbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnQ0xFQVJfT1VUUFVUX0NPTlRFTlQnIH0pXG4gIH1cblxuICBoYW5kbGVFbnRlclJlcGwgKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX2RiZyAmJiB2YWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGUoe1xuICAgICAgICByZXBsVmFsdWU6ICcnLFxuICAgICAgICByZXBsSGlzdG9yeTogdGhpcy5wcm9wcy5yZXBsSGlzdG9yeS5jb25jYXQodmFsdWUpLFxuICAgICAgICBoaXN0b3J5SW5kZXg6IHRoaXMucHJvcHMucmVwbEhpc3RvcnkubGVuZ3RoICsgMVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RiZy5ldmFsdWF0ZSh2YWx1ZSkudGhlbigodmFyaWFibGVzKSA9PiB7XG4gICAgICAgIGlmICh2YXJpYWJsZXMpIHtcbiAgICAgICAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiAnQUREX09VVFBVVF9DT05URU5UJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2V2YWwnLFxuICAgICAgICAgICAgICB2YXJpYWJsZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBoYW5kbGVLZXlEb3duUmVwbCAoZXYpIHtcbiAgICBpZiAoZXYua2V5ICE9PSAnQXJyb3dVcCcgJiYgZXYua2V5ICE9PSAnQXJyb3dEb3duJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IHsgaGlzdG9yeUluZGV4IH0gPSB0aGlzLnByb3BzXG4gICAgaWYgKGV2LmtleSA9PT0gJ0Fycm93VXAnICYmIGhpc3RvcnlJbmRleCA+IDApIHtcbiAgICAgIGhpc3RvcnlJbmRleCA9IGhpc3RvcnlJbmRleCAtIDFcbiAgICB9XG4gICAgaWYgKGV2LmtleSA9PT0gJ0Fycm93RG93bicgJiYgaGlzdG9yeUluZGV4IDwgdGhpcy5wcm9wcy5yZXBsSGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgIGhpc3RvcnlJbmRleCA9IGhpc3RvcnlJbmRleCArIDFcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSh7IGhpc3RvcnlJbmRleCwgcmVwbFZhbHVlOiB0aGlzLnByb3BzLnJlcGxIaXN0b3J5W2hpc3RvcnlJbmRleF0gfHwgJycgfSlcbiAgfVxuICBoYW5kbGVDaGFuZ2VSZXBsIChyZXBsVmFsdWUpIHtcbiAgICB0aGlzLnVwZGF0ZSh7IHJlcGxWYWx1ZSB9KVxuICB9XG59XG4iXX0=