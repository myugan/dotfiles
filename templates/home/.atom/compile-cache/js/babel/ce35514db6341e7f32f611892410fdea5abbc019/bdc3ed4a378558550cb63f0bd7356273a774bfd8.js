Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _goPlusPanel = require('./go-plus-panel');

var PanelManager = (function () {
  function PanelManager() {
    _classCallCheck(this, PanelManager);

    this.activeItem = 'go';

    this.item = {
      getURI: function getURI() {
        return _goPlusPanel.PANEL_URI;
      },
      getTitle: function getTitle() {
        return 'go-plus';
      },
      getIconName: function getIconName() {
        return 'diff-added';
      },
      getDefaultLocation: function getDefaultLocation() {
        return 'bottom';
      },
      getAllowedLocations: function getAllowedLocations() {
        return ['right', 'left', 'bottom'];
      }
    };

    this.subscriptions = new _atom.CompositeDisposable();
    this.viewProviders = new Map();

    this.subscribeToCommands();
  }

  _createClass(PanelManager, [{
    key: 'createPanel',
    value: function createPanel(visible) {
      var _this = this;

      if (this.goPlusPanel) {
        this.goPlusPanel.destroy();
      }
      this.goPlusPanel = new _goPlusPanel.GoPlusPanel({ model: this });
      this.item.element = this.goPlusPanel.element;
      //$FlowFixMe
      return atom.workspace.open(this.item, {
        activatePane: visible
      }).then(function () {
        return _this.requestUpdate();
      });
    }
  }, {
    key: 'requestUpdate',
    value: function requestUpdate() {
      if (this.goPlusPanel) {
        return this.goPlusPanel.update();
      } else {
        return this.createPanel(atom.config.get('go-plus.panel.displayMode') === 'open');
      }
    }
  }, {
    key: 'subscribeToCommands',
    value: function subscribeToCommands() {
      var _this2 = this;

      if (!this.subscriptions) {
        return;
      }
      this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:toggle-panel', function () {
        _this2.togglePanel();
      }));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }

      var pane = atom.workspace.paneForURI(_goPlusPanel.PANEL_URI);
      if (pane) {
        pane.destroyItem(this.item);
      }

      if (this.goPlusPanel) {
        this.goPlusPanel.destroy();
      }
      this.goPlusPanel = null;
      this.viewProviders.clear();
    }
  }, {
    key: 'registerViewProvider',
    value: function registerViewProvider(view, model) {
      var _this3 = this;

      if (!view || !model || !model.key) {
        return new _atom.Disposable();
      }
      var key = model.key;
      model.requestFocus = function () {
        _this3.activeItem = key;
        return _this3.togglePanel(true);
      };
      this.viewProviders.set(key, { view: view, model: model });
      if (this.goPlusPanel) {
        this.goPlusPanel.update();
      }

      return new _atom.Disposable(function () {
        if (_this3.viewProviders && _this3.viewProviders.has(key)) {
          _this3.viewProviders['delete'](key);
        }
      });
    }
  }, {
    key: 'togglePanel',
    value: function togglePanel(visible) {
      //$FlowFixMe
      var container = atom.workspace.paneContainerForURI(_goPlusPanel.PANEL_URI);
      if (!container) {
        return this.createPanel(true);
      }

      var pane = atom.workspace.paneForURI(_goPlusPanel.PANEL_URI);
      if (visible === undefined) {
        var currentlyVisible = container.isVisible() && pane && pane.getActiveItem() === this.item;
        visible = !currentlyVisible;
      }

      if (!visible) {
        container.hide();
        for (var _ref2 of this.viewProviders.values()) {
          var _model = _ref2.model;

          if (_model.isActive) {
            _model.isActive(false);
          }
        }
        return Promise.resolve();
      }
      container.show();
      //$FlowFixMe
      pane.activateItemForURI(_goPlusPanel.PANEL_URI);

      if (this.goPlusPanel) {
        return this.goPlusPanel.update();
      } else {
        return Promise.resolve();
      }
    }
  }]);

  return PanelManager;
})();

exports.PanelManager = PanelManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3BhbmVsL3BhbmVsLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWdELE1BQU07OzJCQUNmLGlCQUFpQjs7SUFNbEQsWUFBWTtBQWVMLFdBZlAsWUFBWSxHQWVGOzBCQWZWLFlBQVk7O0FBZ0JkLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBOztBQUV0QixRQUFJLENBQUMsSUFBSSxHQUFHO0FBQ1YsWUFBTSxFQUFFOztPQUFlO0FBQ3ZCLGNBQVEsRUFBRTtlQUFNLFNBQVM7T0FBQTtBQUN6QixpQkFBVyxFQUFFO2VBQU0sWUFBWTtPQUFBO0FBQy9CLHdCQUFrQixFQUFFO2VBQU0sUUFBUTtPQUFBO0FBQ2xDLHlCQUFtQixFQUFFO2VBQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQztPQUFBO0tBQ3ZELENBQUE7O0FBRUQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRTlCLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0dBQzNCOztlQTlCRyxZQUFZOztXQWdDTCxxQkFBQyxPQUFnQixFQUFpQjs7O0FBQzNDLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQzNCO0FBQ0QsVUFBSSxDQUFDLFdBQVcsR0FBRyw2QkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUNuRCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQTs7QUFFNUMsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNmLG9CQUFZLEVBQUUsT0FB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QUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JFLGVBQU8sR0FBRyxDQUFDLGdCQUFnQixDQUFBO09BQzVCOztBQUVELFVBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixpQkFBUyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2hCLDBCQUF3QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFO2NBQXhDLE1BQUssU0FBTCxLQUFLOztBQUNoQixjQUFJLE1BQUssQ0FBQyxRQUFRLEVBQUU7QUFDbEIsa0JBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7V0FDdEI7U0FDRjtBQUNELGVBQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3pCO0FBQ0QsZUFBUyxDQUFDLElBQUksRUFBRSxDQUFBOztBQUVoQixVQUFJLENBQUMsa0JBQWtCLHdCQUFXLENBQUE7O0FBRWxDLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixlQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDakMsTUFBTTtBQUNMLGVBQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3pCO0tBQ0Y7OztTQXpJRyxZQUFZOzs7UUE0SVQsWUFBWSxHQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvcGFuZWwvcGFuZWwtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgR29QbHVzUGFuZWwsIFBBTkVMX1VSSSB9IGZyb20gJy4vZ28tcGx1cy1wYW5lbCdcblxuaW1wb3J0IHR5cGUgeyBQYW5lbE1vZGVsIH0gZnJvbSAnLi90YWInXG5pbXBvcnQgdHlwZSB7IEdvQ29uZmlnIH0gZnJvbSAnLi8uLi9jb25maWcvc2VydmljZSdcbmltcG9ydCB0eXBlIHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2V0Y2gtY29tcG9uZW50J1xuXG5jbGFzcyBQYW5lbE1hbmFnZXIge1xuICBhY3RpdmVJdGVtOiBzdHJpbmdcbiAgaXRlbToge1xuICAgIGVsZW1lbnQ/OiBhbnksXG4gICAgZ2V0VVJJOiAoKSA9PiBzdHJpbmcsXG4gICAgZ2V0VGl0bGU6ICgpID0+IHN0cmluZyxcbiAgICBnZXRJY29uTmFtZTogKCkgPT4gc3RyaW5nLFxuICAgIGdldERlZmF1bHRMb2NhdGlvbjogKCkgPT4gc3RyaW5nLFxuICAgIGdldEFsbG93ZWRMb2NhdGlvbnM6ICgpID0+IHN0cmluZ1tdXG4gIH1cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICB2aWV3UHJvdmlkZXJzOiBNYXA8c3RyaW5nLCB7IHZpZXc6IENsYXNzPFJlbmRlcmFibGU+LCBtb2RlbDogUGFuZWxNb2RlbCB9PlxuICBnb1BsdXNQYW5lbDogP0dvUGx1c1BhbmVsXG4gIGdvY29uZmlnOiBHb0NvbmZpZ1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlSXRlbSA9ICdnbydcblxuICAgIHRoaXMuaXRlbSA9IHtcbiAgICAgIGdldFVSSTogKCkgPT4gUEFORUxfVVJJLFxuICAgICAgZ2V0VGl0bGU6ICgpID0+ICdnby1wbHVzJyxcbiAgICAgIGdldEljb25OYW1lOiAoKSA9PiAnZGlmZi1hZGRlZCcsXG4gICAgICBnZXREZWZhdWx0TG9jYXRpb246ICgpID0+ICdib3R0b20nLFxuICAgICAgZ2V0QWxsb3dlZExvY2F0aW9uczogKCkgPT4gWydyaWdodCcsICdsZWZ0JywgJ2JvdHRvbSddXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMudmlld1Byb3ZpZGVycyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb0NvbW1hbmRzKClcbiAgfVxuXG4gIGNyZWF0ZVBhbmVsKHZpc2libGU6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5nb1BsdXNQYW5lbCkge1xuICAgICAgdGhpcy5nb1BsdXNQYW5lbC5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy5nb1BsdXNQYW5lbCA9IG5ldyBHb1BsdXNQYW5lbCh7IG1vZGVsOiB0aGlzIH0pXG4gICAgdGhpcy5pdGVtLmVsZW1lbnQgPSB0aGlzLmdvUGx1c1BhbmVsLmVsZW1lbnRcbiAgICAvLyRGbG93Rml4TWVcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2VcbiAgICAgIC5vcGVuKHRoaXMuaXRlbSwge1xuICAgICAgICBhY3RpdmF0ZVBhbmU6IHZpc2libGVcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiB0aGlzLnJlcXVlc3RVcGRhdGUoKSlcbiAgfVxuXG4gIHJlcXVlc3RVcGRhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuZ29QbHVzUGFuZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvUGx1c1BhbmVsLnVwZGF0ZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVBhbmVsKFxuICAgICAgICBhdG9tLmNvbmZpZy5nZXQoJ2dvLXBsdXMucGFuZWwuZGlzcGxheU1vZGUnKSA9PT0gJ29wZW4nXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlVG9Db21tYW5kcygpIHtcbiAgICBpZiAoIXRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnZ29sYW5nOnRvZ2dsZS1wYW5lbCcsICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVQYW5lbCgpXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKFBBTkVMX1VSSSlcbiAgICBpZiAocGFuZSkge1xuICAgICAgcGFuZS5kZXN0cm95SXRlbSh0aGlzLml0ZW0pXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ29QbHVzUGFuZWwpIHtcbiAgICAgIHRoaXMuZ29QbHVzUGFuZWwuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMuZ29QbHVzUGFuZWwgPSBudWxsXG4gICAgdGhpcy52aWV3UHJvdmlkZXJzLmNsZWFyKClcbiAgfVxuXG4gIHJlZ2lzdGVyVmlld1Byb3ZpZGVyKHZpZXc6IENsYXNzPFJlbmRlcmFibGU+LCBtb2RlbDogUGFuZWxNb2RlbCk6IERpc3Bvc2FibGUge1xuICAgIGlmICghdmlldyB8fCAhbW9kZWwgfHwgIW1vZGVsLmtleSkge1xuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKClcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gbW9kZWwua2V5XG4gICAgbW9kZWwucmVxdWVzdEZvY3VzID0gKCkgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVJdGVtID0ga2V5XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGVQYW5lbCh0cnVlKVxuICAgIH1cbiAgICB0aGlzLnZpZXdQcm92aWRlcnMuc2V0KGtleSwgeyB2aWV3LCBtb2RlbCB9KVxuICAgIGlmICh0aGlzLmdvUGx1c1BhbmVsKSB7XG4gICAgICB0aGlzLmdvUGx1c1BhbmVsLnVwZGF0ZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnZpZXdQcm92aWRlcnMgJiYgdGhpcy52aWV3UHJvdmlkZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgIHRoaXMudmlld1Byb3ZpZGVycy5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0b2dnbGVQYW5lbCh2aXNpYmxlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vJEZsb3dGaXhNZVxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JVUkkoUEFORUxfVVJJKVxuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVQYW5lbCh0cnVlKVxuICAgIH1cblxuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKFBBTkVMX1VSSSlcbiAgICBpZiAodmlzaWJsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBjdXJyZW50bHlWaXNpYmxlID1cbiAgICAgICAgY29udGFpbmVyLmlzVmlzaWJsZSgpICYmIHBhbmUgJiYgcGFuZS5nZXRBY3RpdmVJdGVtKCkgPT09IHRoaXMuaXRlbVxuICAgICAgdmlzaWJsZSA9ICFjdXJyZW50bHlWaXNpYmxlXG4gICAgfVxuXG4gICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICBjb250YWluZXIuaGlkZSgpXG4gICAgICBmb3IgKGNvbnN0IHsgbW9kZWwgfSBvZiB0aGlzLnZpZXdQcm92aWRlcnMudmFsdWVzKCkpIHtcbiAgICAgICAgaWYgKG1vZGVsLmlzQWN0aXZlKSB7XG4gICAgICAgICAgbW9kZWwuaXNBY3RpdmUoZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cbiAgICBjb250YWluZXIuc2hvdygpXG4gICAgLy8kRmxvd0ZpeE1lXG4gICAgcGFuZS5hY3RpdmF0ZUl0ZW1Gb3JVUkkoUEFORUxfVVJJKVxuXG4gICAgaWYgKHRoaXMuZ29QbHVzUGFuZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvUGx1c1BhbmVsLnVwZGF0ZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBQYW5lbE1hbmFnZXIgfVxuIl19