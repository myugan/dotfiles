Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GodocPanel = (function () {
  function GodocPanel() {
    _classCallCheck(this, GodocPanel);

    this.key = 'reference';
    this.tab = {
      key: 'reference',
      name: 'Reference',
      packageName: 'go-plus',
      icon: 'book',
      order: 300
    };

    this.keymap = 'alt-d';
    var bindings = atom.keymaps.findKeyBindings({ command: 'golang:showdoc' });
    if (bindings && bindings.length) {
      this.keymap = bindings[0].keystrokes;
    }
  }

  _createClass(GodocPanel, [{
    key: 'dispose',
    value: function dispose() {
      this.requestFocus = null;
      this.view = null;
    }
  }, {
    key: 'updateMessage',
    value: function updateMessage(msg) {
      this.msg = msg;
      if (this.requestFocus) {
        this.requestFocus();
      }
      if (this.view) {
        this.view.update();
      }
    }
  }, {
    key: 'updateContent',
    value: function updateContent(doc) {
      this.msg = null;
      this.doc = doc;
      if (!doc) {
        return;
      }
      if (this.requestFocus) {
        this.requestFocus();
      }
      if (this.view) {
        this.view.update();
      }
    }
  }]);

  return GodocPanel;
})();

exports.GodocPanel = GodocPanel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2RvYy9nb2RvYy1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQU1hLFVBQVU7QUFTVixXQVRBLFVBQVUsR0FTUDswQkFUSCxVQUFVOztBQVVuQixRQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQTtBQUN0QixRQUFJLENBQUMsR0FBRyxHQUFHO0FBQ1QsU0FBRyxFQUFFLFdBQVc7QUFDaEIsVUFBSSxFQUFFLFdBQVc7QUFDakIsaUJBQVcsRUFBRSxTQUFTO0FBQ3RCLFVBQUksRUFBRSxNQUFNO0FBQ1osV0FBSyxFQUFFLEdBQUc7S0FDWCxDQUFBOztBQUVELFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFBO0FBQ3JCLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtBQUM1RSxRQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQy9CLFVBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtLQUNyQztHQUNGOztlQXhCVSxVQUFVOztXQTBCZCxtQkFBRztBQUNSLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0tBQ2pCOzs7V0FFWSx1QkFBQyxHQUFXLEVBQUU7QUFDekIsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7QUFDZCxVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO09BQ3BCO0FBQ0QsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUNuQjtLQUNGOzs7V0FFWSx1QkFBQyxHQUFvQixFQUFFO0FBQ2xDLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFBO0FBQ2YsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7QUFDZCxVQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsZUFBTTtPQUNQO0FBQ0QsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUNwQjtBQUNELFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDbkI7S0FDRjs7O1NBckRVLFVBQVUiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZG9jL2dvZG9jLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBUYWIsIFBhbmVsTW9kZWwgfSBmcm9tICcuLy4uL3BhbmVsL3RhYidcbmltcG9ydCB0eXBlIHsgR29nZXRkb2NSZXN1bHQgfSBmcm9tICcuL2dvZG9jJ1xuaW1wb3J0IHR5cGUgeyBHb2RvY1ZpZXcgfSBmcm9tICcuL2dvZG9jLXZpZXcnXG5cbmV4cG9ydCBjbGFzcyBHb2RvY1BhbmVsIGltcGxlbWVudHMgUGFuZWxNb2RlbCB7XG4gIGtleTogc3RyaW5nXG4gIHRhYjogVGFiXG4gIGtleW1hcDogc3RyaW5nXG4gIG1zZzogP3N0cmluZ1xuICByZXF1ZXN0Rm9jdXM6ID8oKSA9PiBQcm9taXNlPHZvaWQ+XG4gIHZpZXc6ID9Hb2RvY1ZpZXdcbiAgZG9jOiA/R29nZXRkb2NSZXN1bHRcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleSA9ICdyZWZlcmVuY2UnXG4gICAgdGhpcy50YWIgPSB7XG4gICAgICBrZXk6ICdyZWZlcmVuY2UnLFxuICAgICAgbmFtZTogJ1JlZmVyZW5jZScsXG4gICAgICBwYWNrYWdlTmFtZTogJ2dvLXBsdXMnLFxuICAgICAgaWNvbjogJ2Jvb2snLFxuICAgICAgb3JkZXI6IDMwMFxuICAgIH1cblxuICAgIHRoaXMua2V5bWFwID0gJ2FsdC1kJ1xuICAgIGNvbnN0IGJpbmRpbmdzID0gYXRvbS5rZXltYXBzLmZpbmRLZXlCaW5kaW5ncyh7IGNvbW1hbmQ6ICdnb2xhbmc6c2hvd2RvYycgfSlcbiAgICBpZiAoYmluZGluZ3MgJiYgYmluZGluZ3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLmtleW1hcCA9IGJpbmRpbmdzWzBdLmtleXN0cm9rZXNcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucmVxdWVzdEZvY3VzID0gbnVsbFxuICAgIHRoaXMudmlldyA9IG51bGxcbiAgfVxuXG4gIHVwZGF0ZU1lc3NhZ2UobXNnOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1zZyA9IG1zZ1xuICAgIGlmICh0aGlzLnJlcXVlc3RGb2N1cykge1xuICAgICAgdGhpcy5yZXF1ZXN0Rm9jdXMoKVxuICAgIH1cbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlKClcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDb250ZW50KGRvYzogP0dvZ2V0ZG9jUmVzdWx0KSB7XG4gICAgdGhpcy5tc2cgPSBudWxsXG4gICAgdGhpcy5kb2MgPSBkb2NcbiAgICBpZiAoIWRvYykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnJlcXVlc3RGb2N1cykge1xuICAgICAgdGhpcy5yZXF1ZXN0Rm9jdXMoKVxuICAgIH1cbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==