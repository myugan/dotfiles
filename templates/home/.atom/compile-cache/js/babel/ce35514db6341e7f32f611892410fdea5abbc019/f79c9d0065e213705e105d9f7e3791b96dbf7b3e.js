var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _helpers = require('./helpers');

var TreeView = (function () {
  function TreeView() {
    var _this = this;

    _classCallCheck(this, TreeView);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.decorations = {};
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.decorateOnTreeView', function (decorateOnTreeView) {
      if (typeof _this.decorateOnTreeView === 'undefined') {
        _this.decorateOnTreeView = decorateOnTreeView;
      } else if (decorateOnTreeView === 'None') {
        _this.update([]);
        _this.decorateOnTreeView = decorateOnTreeView;
      } else {
        var messages = _this.messages;
        _this.decorateOnTreeView = decorateOnTreeView;
        _this.update(messages);
      }
    }));

    setTimeout(function () {
      var element = TreeView.getElement();
      if (!element) {
        return;
      }
      // Subscription is only added if the CompositeDisposable hasn't been disposed
      _this.subscriptions.add((0, _disposableEvent2['default'])(element, 'click', (0, _sbDebounce2['default'])(function () {
        _this.update();
      })));
    }, 100);
  }

  _createClass(TreeView, [{
    key: 'update',
    value: function update() {
      var givenMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(givenMessages)) {
        this.messages = givenMessages;
      }
      var messages = this.messages;

      var element = TreeView.getElement();
      var decorateOnTreeView = this.decorateOnTreeView;
      if (!element || decorateOnTreeView === 'None') {
        return;
      }

      this.applyDecorations((0, _helpers.calculateDecorations)(decorateOnTreeView, messages));
    }
  }, {
    key: 'applyDecorations',
    value: function applyDecorations(decorations) {
      var _this2 = this;

      var treeViewElement = TreeView.getElement();
      if (!treeViewElement) {
        return;
      }

      var elementCache = {};
      var appliedDecorations = {};

      Object.keys(this.decorations).forEach(function (filePath) {
        if (!({}).hasOwnProperty.call(_this2.decorations, filePath)) {
          return;
        }
        if (!decorations[filePath]) {
          // Removed
          var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
          if (element) {
            _this2.removeDecoration(element);
          }
        }
      });

      Object.keys(decorations).forEach(function (filePath) {
        if (!({}).hasOwnProperty.call(decorations, filePath)) {
          return;
        }
        var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
        if (element) {
          _this2.handleDecoration(element, !!_this2.decorations[filePath], decorations[filePath]);
          appliedDecorations[filePath] = decorations[filePath];
        }
      });

      this.decorations = appliedDecorations;
    }
  }, {
    key: 'handleDecoration',
    value: function handleDecoration(element, update, highlights) {
      if (update === undefined) update = false;

      var decoration = undefined;
      if (update) {
        decoration = element.querySelector('linter-decoration');
      }
      if (decoration) {
        decoration.className = '';
      } else {
        decoration = document.createElement('linter-decoration');
        element.appendChild(decoration);
      }
      if (highlights.error) {
        decoration.classList.add('linter-error');
      } else if (highlights.warning) {
        decoration.classList.add('linter-warning');
      } else if (highlights.info) {
        decoration.classList.add('linter-info');
      }
    }
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(element) {
      var decoration = element.querySelector('linter-decoration');
      if (decoration) {
        decoration.remove();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }], [{
    key: 'getElement',
    value: function getElement() {
      return document.querySelector('.tree-view');
    }
  }, {
    key: 'getElementByPath',
    value: function getElementByPath(parent, filePath) {
      return parent.querySelector('[data-path=' + CSS.escape(filePath) + ']');
    }
  }]);

  return TreeView;
})();

module.exports = TreeView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90cmVlLXZpZXcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUU2QyxNQUFNOzswQkFDOUIsYUFBYTs7OzsrQkFDTixrQkFBa0I7Ozs7dUJBQ1QsV0FBVzs7SUFHMUMsUUFBUTtBQU9ELFdBUFAsUUFBUSxHQU9FOzs7MEJBUFYsUUFBUTs7QUFRVixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7QUFDckIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFBLGtCQUFrQixFQUFJO0FBQ2hGLFVBQUksT0FBTyxNQUFLLGtCQUFrQixLQUFLLFdBQVcsRUFBRTtBQUNsRCxjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO09BQzdDLE1BQU0sSUFBSSxrQkFBa0IsS0FBSyxNQUFNLEVBQUU7QUFDeEMsY0FBSyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDZixjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO09BQzdDLE1BQU07QUFDTCxZQUFNLFFBQVEsR0FBRyxNQUFLLFFBQVEsQ0FBQTtBQUM5QixjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO0FBQzVDLGNBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ3RCO0tBQ0YsQ0FBQyxDQUNILENBQUE7O0FBRUQsY0FBVSxDQUFDLFlBQU07QUFDZixVQUFNLE9BQU8sR0FBRyxR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TUFBTSxDQUFDLGFBQWEsaUJBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBSSxDQUFBO0tBQ25FOzs7U0FuSUcsUUFBUTs7O0FBc0lkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90cmVlLXZpZXcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdzYi1kZWJvdW5jZSdcbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IGNhbGN1bGF0ZURlY29yYXRpb25zIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlLCBUcmVlVmlld0hpZ2hsaWdodCB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBUcmVlVmlldyB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIGRlY29yYXRpb25zOiBPYmplY3RcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBkZWNvcmF0ZU9uVHJlZVZpZXc6ICdGaWxlcyBhbmQgRGlyZWN0b3JpZXMnIHwgJ0ZpbGVzJyB8ICdOb25lJ1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLmRlY29yYXRpb25zID0ge31cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuZGVjb3JhdGVPblRyZWVWaWV3JywgZGVjb3JhdGVPblRyZWVWaWV3ID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9IGRlY29yYXRlT25UcmVlVmlld1xuICAgICAgICB9IGVsc2UgaWYgKGRlY29yYXRlT25UcmVlVmlldyA9PT0gJ05vbmUnKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoW10pXG4gICAgICAgICAgdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXcgPSBkZWNvcmF0ZU9uVHJlZVZpZXdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlcyA9IHRoaXMubWVzc2FnZXNcbiAgICAgICAgICB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9IGRlY29yYXRlT25UcmVlVmlld1xuICAgICAgICAgIHRoaXMudXBkYXRlKG1lc3NhZ2VzKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBUcmVlVmlldy5nZXRFbGVtZW50KClcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIFN1YnNjcmlwdGlvbiBpcyBvbmx5IGFkZGVkIGlmIHRoZSBDb21wb3NpdGVEaXNwb3NhYmxlIGhhc24ndCBiZWVuIGRpc3Bvc2VkXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBkaXNwb3NhYmxlRXZlbnQoXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAnY2xpY2snLFxuICAgICAgICAgIGRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICB9LCAxMDApXG4gIH1cbiAgdXBkYXRlKGdpdmVuTWVzc2FnZXM6ID9BcnJheTxMaW50ZXJNZXNzYWdlPiA9IG51bGwpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShnaXZlbk1lc3NhZ2VzKSkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IGdpdmVuTWVzc2FnZXNcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzXG5cbiAgICBjb25zdCBlbGVtZW50ID0gVHJlZVZpZXcuZ2V0RWxlbWVudCgpXG4gICAgY29uc3QgZGVjb3JhdGVPblRyZWVWaWV3ID0gdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXdcbiAgICBpZiAoIWVsZW1lbnQgfHwgZGVjb3JhdGVPblRyZWVWaWV3ID09PSAnTm9uZScpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuYXBwbHlEZWNvcmF0aW9ucyhjYWxjdWxhdGVEZWNvcmF0aW9ucyhkZWNvcmF0ZU9uVHJlZVZpZXcsIG1lc3NhZ2VzKSlcbiAgfVxuICBhcHBseURlY29yYXRpb25zKGRlY29yYXRpb25zOiBPYmplY3QpIHtcbiAgICBjb25zdCB0cmVlVmlld0VsZW1lbnQgPSBUcmVlVmlldy5nZXRFbGVtZW50KClcbiAgICBpZiAoIXRyZWVWaWV3RWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudENhY2hlID0ge31cbiAgICBjb25zdCBhcHBsaWVkRGVjb3JhdGlvbnMgPSB7fVxuXG4gICAgT2JqZWN0LmtleXModGhpcy5kZWNvcmF0aW9ucykuZm9yRWFjaChmaWxlUGF0aCA9PiB7XG4gICAgICBpZiAoIXt9Lmhhc093blByb3BlcnR5LmNhbGwodGhpcy5kZWNvcmF0aW9ucywgZmlsZVBhdGgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKCFkZWNvcmF0aW9uc1tmaWxlUGF0aF0pIHtcbiAgICAgICAgLy8gUmVtb3ZlZFxuICAgICAgICBjb25zdCBlbGVtZW50ID1cbiAgICAgICAgICBlbGVtZW50Q2FjaGVbZmlsZVBhdGhdIHx8IChlbGVtZW50Q2FjaGVbZmlsZVBhdGhdID0gVHJlZVZpZXcuZ2V0RWxlbWVudEJ5UGF0aCh0cmVlVmlld0VsZW1lbnQsIGZpbGVQYXRoKSlcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZURlY29yYXRpb24oZWxlbWVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBPYmplY3Qua2V5cyhkZWNvcmF0aW9ucykuZm9yRWFjaChmaWxlUGF0aCA9PiB7XG4gICAgICBpZiAoIXt9Lmhhc093blByb3BlcnR5LmNhbGwoZGVjb3JhdGlvbnMsIGZpbGVQYXRoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGVsZW1lbnQgPVxuICAgICAgICBlbGVtZW50Q2FjaGVbZmlsZVBhdGhdIHx8IChlbGVtZW50Q2FjaGVbZmlsZVBhdGhdID0gVHJlZVZpZXcuZ2V0RWxlbWVudEJ5UGF0aCh0cmVlVmlld0VsZW1lbnQsIGZpbGVQYXRoKSlcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRGVjb3JhdGlvbihlbGVtZW50LCAhIXRoaXMuZGVjb3JhdGlvbnNbZmlsZVBhdGhdLCBkZWNvcmF0aW9uc1tmaWxlUGF0aF0pXG4gICAgICAgIGFwcGxpZWREZWNvcmF0aW9uc1tmaWxlUGF0aF0gPSBkZWNvcmF0aW9uc1tmaWxlUGF0aF1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5kZWNvcmF0aW9ucyA9IGFwcGxpZWREZWNvcmF0aW9uc1xuICB9XG5cbiAgaGFuZGxlRGVjb3JhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCwgdXBkYXRlOiBib29sZWFuID0gZmFsc2UsIGhpZ2hsaWdodHM6IFRyZWVWaWV3SGlnaGxpZ2h0KSB7XG4gICAgbGV0IGRlY29yYXRpb25cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICBkZWNvcmF0aW9uID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaW50ZXItZGVjb3JhdGlvbicpXG4gICAgfVxuICAgIGlmIChkZWNvcmF0aW9uKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTmFtZSA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlY29yYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItZGVjb3JhdGlvbicpXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRlY29yYXRpb24pXG4gICAgfVxuICAgIGlmIChoaWdobGlnaHRzLmVycm9yKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1lcnJvcicpXG4gICAgfSBlbHNlIGlmIChoaWdobGlnaHRzLndhcm5pbmcpIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NMaXN0LmFkZCgnbGludGVyLXdhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAoaGlnaGxpZ2h0cy5pbmZvKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1pbmZvJylcbiAgICB9XG4gIH1cbiAgcmVtb3ZlRGVjb3JhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGRlY29yYXRpb24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpbnRlci1kZWNvcmF0aW9uJylcbiAgICBpZiAoZGVjb3JhdGlvbikge1xuICAgICAgZGVjb3JhdGlvbi5yZW1vdmUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuICBzdGF0aWMgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRyZWUtdmlldycpXG4gIH1cbiAgc3RhdGljIGdldEVsZW1lbnRCeVBhdGgocGFyZW50OiBIVE1MRWxlbWVudCwgZmlsZVBhdGg6IHN0cmluZyk6ID9IVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wYXRoPSR7Q1NTLmVzY2FwZShmaWxlUGF0aCl9XWApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlVmlld1xuIl19