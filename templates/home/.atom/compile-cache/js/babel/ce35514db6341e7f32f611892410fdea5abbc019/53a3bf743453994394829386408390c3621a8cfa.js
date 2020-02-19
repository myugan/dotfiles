Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var ImporterView = (function () {
  function ImporterView(props) {
    var _this = this;

    _classCallCheck(this, ImporterView);

    var items = props.items;
    var _didConfirmSelection = props.didConfirmSelection;

    var font = atom.config.get('editor.fontFamily');
    this.selectListView = new _atomSelectList2['default']({
      items: items,
      didConfirmSelection: function didConfirmSelection(item) {
        _this.hide();
        _didConfirmSelection(item);
      },
      didCancelSelection: function didCancelSelection() {
        return _this.hide();
      },
      elementForItem: function elementForItem(i) {
        var li = document.createElement('li');
        li.style.fontFamily = font;
        li.textContent = i;
        return li;
      }
    });
  }

  _createClass(ImporterView, [{
    key: 'show',
    value: _asyncToGenerator(function* () {
      var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this.previouslyFocusedElement = document.activeElement;
      this.selectListView.reset();
      yield this.selectListView.update({
        items: items,
        query: 'Enter a package to import',
        selectQuery: true
      });
      this.getModalPanel().show();
      this.selectListView.focus();
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.destroy();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.selectListView.destroy();
      this.getModalPanel().destroy();
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.getModalPanel().hide();
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }, {
    key: 'getModalPanel',
    value: function getModalPanel() {
      if (!this.modalPanel) {
        this.modalPanel = atom.workspace.addModalPanel({
          item: this.selectListView
        });
      }
      return this.modalPanel;
    }
  }]);

  return ImporterView;
})();

exports.ImporterView = ImporterView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2ltcG9ydC9pbXBvcnRlci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs4QkFFMkIsa0JBQWtCOzs7O0lBRWhDLFlBQVk7QUFLWixXQUxBLFlBQVksQ0FLWCxLQUFhLEVBQUU7OzswQkFMaEIsWUFBWTs7UUFNYixLQUFLLEdBQTBCLEtBQUssQ0FBcEMsS0FBSztRQUFFLG9CQUFtQixHQUFLLEtBQUssQ0FBN0IsbUJBQW1COztBQUNsQyxRQUFNLElBQVksR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxBQUFNLENBQUE7QUFDaEUsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsV0FBSyxFQUFMLEtBQUs7QUFDTCx5QkFBbUIsRUFBRSw2QkFBQSxJQUFJLEVBQUk7QUFDM0IsY0FBSyxJQUFJLEVBQUUsQ0FBQTtBQUNYLDRCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFBO09BQzFCO0FBQ0Qsd0JBQWtCLEVBQUU7ZUFBTSxNQUFLLElBQUksRUFBRTtPQUFBO0FBQ3JDLG9CQUFjLEVBQUUsd0JBQUEsQ0FBQyxFQUFJO0FBQ25CLFlBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkMsVUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO0FBQzFCLFVBQUUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO0FBQ2xCLGVBQU8sRUFBRSxDQUFBO09BQ1Y7S0FDRixDQUFDLENBQUE7R0FDSDs7ZUF0QlUsWUFBWTs7NkJBd0JiLGFBQTRCO1VBQTNCLEtBQW9CLHlEQUFHLEVBQUU7O0FBQ2xDLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFBO0FBQ3RELFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDM0IsWUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUMvQixhQUFLLEVBQUwsS0FBSztBQUNMLGFBQUssRUFBRSwyQkFBMkI7QUFDbEMsbUJBQVcsRUFBRSxJQUFJO09BQ2xCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUMzQixVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzVCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDN0IsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzlCLFVBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO0FBQ2pDLFlBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQyxZQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFBO09BQ3JDO0tBQ0Y7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQzNCLFVBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO0FBQ2pDLFlBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQyxZQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFBO09BQ3JDO0tBQ0Y7OztXQUVZLHlCQUFHO0FBQ2QsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUM3QyxjQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWM7U0FDMUIsQ0FBQyxDQUFBO09BQ0g7QUFDRCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztTQWhFVSxZQUFZIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2ltcG9ydC9pbXBvcnRlci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnXG5cbmV4cG9ydCBjbGFzcyBJbXBvcnRlclZpZXcge1xuICBtb2RhbFBhbmVsOiA/YXRvbSRQYW5lbFxuICBzZWxlY3RMaXN0VmlldzogU2VsZWN0TGlzdFZpZXdcbiAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50OiA/SFRNTEVsZW1lbnRcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogT2JqZWN0KSB7XG4gICAgY29uc3QgeyBpdGVtcywgZGlkQ29uZmlybVNlbGVjdGlvbiB9ID0gcHJvcHNcbiAgICBjb25zdCBmb250OiBzdHJpbmcgPSAoYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IuZm9udEZhbWlseScpOiBhbnkpXG4gICAgdGhpcy5zZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtcyxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IGl0ZW0gPT4ge1xuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICBkaWRDb25maXJtU2VsZWN0aW9uKGl0ZW0pXG4gICAgICB9LFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB0aGlzLmhpZGUoKSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiBpID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIGxpLnN0eWxlLmZvbnRGYW1pbHkgPSBmb250XG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gaVxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgc2hvdyhpdGVtczogQXJyYXk8c3RyaW5nPiA9IFtdKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5yZXNldCgpXG4gICAgYXdhaXQgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgaXRlbXMsXG4gICAgICBxdWVyeTogJ0VudGVyIGEgcGFja2FnZSB0byBpbXBvcnQnLFxuICAgICAgc2VsZWN0UXVlcnk6IHRydWVcbiAgICB9KVxuICAgIHRoaXMuZ2V0TW9kYWxQYW5lbCgpLnNob3coKVxuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZm9jdXMoKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKVxuICAgIHRoaXMuZ2V0TW9kYWxQYW5lbCgpLmRlc3Ryb3koKVxuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmdldE1vZGFsUGFuZWwoKS5oaWRlKClcbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGdldE1vZGFsUGFuZWwoKSB7XG4gICAgaWYgKCF0aGlzLm1vZGFsUGFuZWwpIHtcbiAgICAgIHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgICBpdGVtOiB0aGlzLnNlbGVjdExpc3RWaWV3XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tb2RhbFBhbmVsXG4gIH1cbn1cbiJdfQ==