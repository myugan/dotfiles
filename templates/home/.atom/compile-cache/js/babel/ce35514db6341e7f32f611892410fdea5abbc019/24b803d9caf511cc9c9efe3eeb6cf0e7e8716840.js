Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodashDebounce = require('lodash/debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    _classCallCheck(this, MessageRegistry);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.messagesMap = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.debouncedUpdate = (0, _lodashDebounce2['default'])(this.update, 100, { leading: true });

    this.subscriptions.add(this.emitter);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var messages = _ref.messages;
      var linter = _ref.linter;
      var buffer = _ref.buffer;
      return (function () {
        var found = null;
        for (var entry of this.messagesMap) {
          if (entry.buffer === buffer && entry.linter === linter) {
            found = entry;
            break;
          }
        }

        if (found) {
          found.messages = messages;
          found.changed = true;
        } else {
          this.messagesMap.add({ messages: messages, linter: linter, buffer: buffer, oldMessages: [], changed: true, deleted: false });
        }
        this.debouncedUpdate();
      }).apply(this, arguments);
    }
  }, {
    key: 'update',
    value: function update() {
      var result = { added: [], removed: [], messages: [] };

      for (var entry of this.messagesMap) {
        if (entry.deleted) {
          result.removed = result.removed.concat(entry.oldMessages);
          this.messagesMap['delete'](entry);
          continue;
        }
        if (!entry.changed) {
          result.messages = result.messages.concat(entry.oldMessages);
          continue;
        }
        entry.changed = false;
        if (!entry.oldMessages.length) {
          // All messages are new, no need to diff
          // NOTE: No need to add .key here because normalizeMessages already does that
          result.added = result.added.concat(entry.messages);
          result.messages = result.messages.concat(entry.messages);
          entry.oldMessages = entry.messages;
          continue;
        }
        if (!entry.messages.length) {
          // All messages are old, no need to diff
          result.removed = result.removed.concat(entry.oldMessages);
          entry.oldMessages = [];
          continue;
        }

        var newKeys = new Set();
        var oldKeys = new Set();
        var _oldMessages = entry.oldMessages;

        var foundNew = false;
        entry.oldMessages = [];

        for (var i = 0, _length = _oldMessages.length; i < _length; ++i) {
          var message = _oldMessages[i];
          message.key = (0, _helpers.messageKey)(message);
          oldKeys.add(message.key);
        }

        for (var i = 0, _length2 = entry.messages.length; i < _length2; ++i) {
          var message = entry.messages[i];
          if (newKeys.has(message.key)) {
            continue;
          }
          newKeys.add(message.key);
          if (!oldKeys.has(message.key)) {
            foundNew = true;
            result.added.push(message);
            result.messages.push(message);
            entry.oldMessages.push(message);
          }
        }

        if (!foundNew && entry.messages.length === _oldMessages.length) {
          // Messages are unchanged
          result.messages = result.messages.concat(_oldMessages);
          entry.oldMessages = _oldMessages;
          continue;
        }

        for (var i = 0, _length3 = _oldMessages.length; i < _length3; ++i) {
          var message = _oldMessages[i];
          if (newKeys.has(message.key)) {
            entry.oldMessages.push(message);
            result.messages.push(message);
          } else {
            result.removed.push(message);
          }
        }
      }

      if (result.added.length || result.removed.length) {
        this.messages = result.messages;
        this.emitter.emit('did-update-messages', result);
      }
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteByBuffer',
    value: function deleteByBuffer(buffer) {
      for (var entry of this.messagesMap) {
        if (entry.buffer === buffer) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'deleteByLinter',
    value: function deleteByLinter(linter) {
      for (var entry of this.messagesMap) {
        if (entry.linter === linter) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return MessageRegistry;
})();

exports['default'] = MessageRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUU2QyxNQUFNOzs4QkFDOUIsaUJBQWlCOzs7O3VCQUVYLFdBQVc7O0lBWWhDLGVBQWU7QUFPUixXQVBQLGVBQWUsR0FPTDswQkFQVixlQUFlOztBQVFqQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxpQ0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBOztBQUVwRSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBZkcsZUFBZTs7V0FnQmhCLGFBQUMsSUFBOEY7VUFBNUYsUUFBUSxHQUFWLElBQThGLENBQTVGLFFBQVE7VUFBRSxNQUFNLEdBQWxCLElBQThGLENBQWxGLE1BQU07VUFBRSxNQUFNLEdBQTFCLElBQThGLENBQTFFLE1BQU07MEJBQXNFO0FBQ2xHLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNoQixhQUFLLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEMsY0FBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUN0RCxpQkFBSyxHQUFHLEtBQUssQ0FBQTtBQUNiLGtCQUFLO1dBQ047U0FDRjs7QUFFRCxZQUFJLEtBQUssRUFBRTtBQUNULGVBQUssQ0FBQyxRQUFRLEdB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bWVzc2FnZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC9kZWJvdW5jZSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSwgVGV4dEJ1ZmZlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBtZXNzYWdlS2V5IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlc1BhdGNoLCBNZXNzYWdlLCBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG50eXBlIExpbnRlciRNZXNzYWdlJE1hcCA9IHtcbiAgYnVmZmVyOiA/VGV4dEJ1ZmZlcixcbiAgbGludGVyOiBMaW50ZXIsXG4gIGNoYW5nZWQ6IGJvb2xlYW4sXG4gIGRlbGV0ZWQ6IGJvb2xlYW4sXG4gIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlPixcbiAgb2xkTWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+LFxufVxuXG5jbGFzcyBNZXNzYWdlUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlPlxuICBtZXNzYWdlc01hcDogU2V0PExpbnRlciRNZXNzYWdlJE1hcD5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBkZWJvdW5jZWRVcGRhdGU6ICgpID0+IHZvaWRcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5tZXNzYWdlc01hcCA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSA9IGRlYm91bmNlKHRoaXMudXBkYXRlLCAxMDAsIHsgbGVhZGluZzogdHJ1ZSB9KVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgc2V0KHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyIH06IHsgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+LCBsaW50ZXI6IExpbnRlciwgYnVmZmVyOiBUZXh0QnVmZmVyIH0pIHtcbiAgICBsZXQgZm91bmQgPSBudWxsXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICBpZiAoZW50cnkuYnVmZmVyID09PSBidWZmZXIgJiYgZW50cnkubGludGVyID09PSBsaW50ZXIpIHtcbiAgICAgICAgZm91bmQgPSBlbnRyeVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmb3VuZCkge1xuICAgICAgZm91bmQubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgICAgZm91bmQuY2hhbmdlZCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlc01hcC5hZGQoeyBtZXNzYWdlcywgbGludGVyLCBidWZmZXIsIG9sZE1lc3NhZ2VzOiBbXSwgY2hhbmdlZDogdHJ1ZSwgZGVsZXRlZDogZmFsc2UgfSlcbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUoKVxuICB9XG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGFkZGVkOiBbXSwgcmVtb3ZlZDogW10sIG1lc3NhZ2VzOiBbXSB9XG5cbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5kZWxldGVkKSB7XG4gICAgICAgIHJlc3VsdC5yZW1vdmVkID0gcmVzdWx0LnJlbW92ZWQuY29uY2F0KGVudHJ5Lm9sZE1lc3NhZ2VzKVxuICAgICAgICB0aGlzLm1lc3NhZ2VzTWFwLmRlbGV0ZShlbnRyeSlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGlmICghZW50cnkuY2hhbmdlZCkge1xuICAgICAgICByZXN1bHQubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXMuY29uY2F0KGVudHJ5Lm9sZE1lc3NhZ2VzKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZW50cnkuY2hhbmdlZCA9IGZhbHNlXG4gICAgICBpZiAoIWVudHJ5Lm9sZE1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBBbGwgbWVzc2FnZXMgYXJlIG5ldywgbm8gbmVlZCB0byBkaWZmXG4gICAgICAgIC8vIE5PVEU6IE5vIG5lZWQgdG8gYWRkIC5rZXkgaGVyZSBiZWNhdXNlIG5vcm1hbGl6ZU1lc3NhZ2VzIGFscmVhZHkgZG9lcyB0aGF0XG4gICAgICAgIHJlc3VsdC5hZGRlZCA9IHJlc3VsdC5hZGRlZC5jb25jYXQoZW50cnkubWVzc2FnZXMpXG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlcy5jb25jYXQoZW50cnkubWVzc2FnZXMpXG4gICAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzID0gZW50cnkubWVzc2FnZXNcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGlmICghZW50cnkubWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIEFsbCBtZXNzYWdlcyBhcmUgb2xkLCBubyBuZWVkIHRvIGRpZmZcbiAgICAgICAgcmVzdWx0LnJlbW92ZWQgPSByZXN1bHQucmVtb3ZlZC5jb25jYXQoZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzID0gW11cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3S2V5cyA9IG5ldyBTZXQoKVxuICAgICAgY29uc3Qgb2xkS2V5cyA9IG5ldyBTZXQoKVxuICAgICAgY29uc3QgeyBvbGRNZXNzYWdlcyB9ID0gZW50cnlcbiAgICAgIGxldCBmb3VuZE5ldyA9IGZhbHNlXG4gICAgICBlbnRyeS5vbGRNZXNzYWdlcyA9IFtdXG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gb2xkTWVzc2FnZXM7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gb2xkTWVzc2FnZXNbaV1cbiAgICAgICAgbWVzc2FnZS5rZXkgPSBtZXNzYWdlS2V5KG1lc3NhZ2UpXG4gICAgICAgIG9sZEtleXMuYWRkKG1lc3NhZ2Uua2V5KVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IGVudHJ5Lm1lc3NhZ2VzOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGVudHJ5Lm1lc3NhZ2VzW2ldXG4gICAgICAgIGlmIChuZXdLZXlzLmhhcyhtZXNzYWdlLmtleSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIG5ld0tleXMuYWRkKG1lc3NhZ2Uua2V5KVxuICAgICAgICBpZiAoIW9sZEtleXMuaGFzKG1lc3NhZ2Uua2V5KSkge1xuICAgICAgICAgIGZvdW5kTmV3ID0gdHJ1ZVxuICAgICAgICAgIHJlc3VsdC5hZGRlZC5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgICBlbnRyeS5vbGRNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZE5ldyAmJiBlbnRyeS5tZXNzYWdlcy5sZW5ndGggPT09IG9sZE1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBNZXNzYWdlcyBhcmUgdW5jaGFuZ2VkXG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlcy5jb25jYXQob2xkTWVzc2FnZXMpXG4gICAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzID0gb2xkTWVzc2FnZXNcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDAsIHsgbGVuZ3RoIH0gPSBvbGRNZXNzYWdlczsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBvbGRNZXNzYWdlc1tpXVxuICAgICAgICBpZiAobmV3S2V5cy5oYXMobWVzc2FnZS5rZXkpKSB7XG4gICAgICAgICAgZW50cnkub2xkTWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgICAgICAgIHJlc3VsdC5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnJlbW92ZWQucHVzaChtZXNzYWdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5hZGRlZC5sZW5ndGggfHwgcmVzdWx0LnJlbW92ZWQubGVuZ3RoKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHJlc3VsdClcbiAgICB9XG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjazogKGRpZmZlcmVuY2U6IE1lc3NhZ2VzUGF0Y2gpID0+IHZvaWQpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGVsZXRlQnlCdWZmZXIoYnVmZmVyOiBUZXh0QnVmZmVyKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICBpZiAoZW50cnkuYnVmZmVyID09PSBidWZmZXIpIHtcbiAgICAgICAgZW50cnkuZGVsZXRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUoKVxuICB9XG4gIGRlbGV0ZUJ5TGludGVyKGxpbnRlcjogTGludGVyKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICBpZiAoZW50cnkubGludGVyID09PSBsaW50ZXIpIHtcbiAgICAgICAgZW50cnkuZGVsZXRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUoKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VSZWdpc3RyeVxuIl19