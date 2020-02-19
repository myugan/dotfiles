var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _dock = require('./dock');

var _dock2 = _interopRequireDefault(_dock);

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.messages = [];
    this.deactivating = false;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPane(function (_ref) {
      var destroyedPane = _ref.pane;

      var isPaneItemDestroyed = destroyedPane.getItems().includes(_this.panel);
      if (isPaneItemDestroyed && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref2) {
      var paneItem = _ref2.item;

      if (paneItem instanceof _dock2['default'] && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      _this.showPanelStateMessages = !!_this.delegate.filteredMessages.length;
      _this.refresh();
    }));
    this.activationTimer = window.requestIdleCallback(function () {
      var firstTime = true;
      var dock = atom.workspace.getBottomDock();
      _this.subscriptions.add(dock.onDidChangeActivePaneItem(function (paneItem) {
        if (!_this.panel || _this.getPanelLocation() !== 'bottom') {
          return;
        }
        if (firstTime) {
          firstTime = false;
          return;
        }
        var isFocusIn = paneItem === _this.panel;
        var externallyToggled = isFocusIn !== _this.showPanelConfig;
        if (externallyToggled) {
          atom.config.set('linter-ui-default.showPanel', !_this.showPanelConfig);
        }
      }));
      _this.subscriptions.add(dock.onDidChangeVisible(function (visible) {
        if (!_this.panel || _this.getPanelLocation() !== 'bottom') {
          return;
        }
        if (!visible) {
          // ^ When it's time to tell config to hide
          if (_this.showPanelConfig && _this.hidePanelWhenEmpty && !_this.showPanelStateMessages) {
            // Ignore because we just don't have any messages to show, everything else is fine
            return;
          }
        }
        var externallyToggled = visible !== _this.showPanelConfig;
        if (externallyToggled) {
          atom.config.set('linter-ui-default.showPanel', !_this.showPanelConfig);
        }
      }));

      _this.activate();
    });
  }

  _createClass(Panel, [{
    key: 'getPanelLocation',
    value: function getPanelLocation() {
      if (!this.panel) {
        return null;
      }
      var paneContainer = atom.workspace.paneContainerForItem(this.panel);
      return paneContainer && paneContainer.location || null;
    }
  }, {
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        return;
      }
      this.panel = new _dock2['default'](this.delegate);
      yield atom.workspace.open(this.panel, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      });
      this.update();
      this.refresh();
    })
  }, {
    key: 'update',
    value: function update() {
      var newMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (newMessages) {
        this.messages = newMessages;
      }
      this.delegate.update(this.messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      var panel = this.panel;
      if (panel === null) {
        if (this.showPanelConfig) {
          yield this.activate();
        }
        return;
      }
      var paneContainer = atom.workspace.paneContainerForItem(panel);
      if (!paneContainer || paneContainer.location !== 'bottom') {
        return;
      }
      var isActivePanel = paneContainer.getActivePaneItem() === panel;
      var visibilityAllowed1 = this.showPanelConfig;
      var visibilityAllowed2 = this.hidePanelWhenEmpty ? this.showPanelStateMessages : true;
      if (visibilityAllowed1 && visibilityAllowed2) {
        if (!isActivePanel) {
          paneContainer.paneForItem(panel).activateItem(panel);
        }
        paneContainer.show();
        panel.doPanelResize();
      } else if (isActivePanel) {
        paneContainer.hide();
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivating = true;
      if (this.panel) {
        this.panel.dispose();
      }
      this.subscriptions.dispose();
      window.cancelIdleCallback(this.activationTimer);
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7d0JBQ3JCLFlBQVk7Ozs7b0JBQ1gsUUFBUTs7OztJQUd4QixLQUFLO0FBV0UsV0FYUCxLQUFLLEdBV0s7OzswQkFYVixLQUFLOztBQVlQLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUE7QUFDekIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFBOztBQUVuQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxFQUFFLFVBQUEsa0JBQWtCLEVBQUk7QUFDaEYsWUFBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUM1QyxZQUFLLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFDLElBQXVCLEVBQUs7VUFBcEIsYUFBYSxHQUFyQixJQUF1QixDQUFyQixJQUFJOztBQUNyQyxVQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFR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QUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFlBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7S0FDaEQ7OztTQTdKRyxLQUFLOzs7QUFnS1gsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBQYW5lbERvY2sgZnJvbSAnLi9kb2NrJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsIHtcbiAgcGFuZWw6IFBhbmVsRG9jayB8IG51bGxcbiAgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgZGVsZWdhdGU6IERlbGVnYXRlXG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBkZWFjdGl2YXRpbmc6IGJvb2xlYW5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBzaG93UGFuZWxDb25maWc6IGJvb2xlYW5cbiAgaGlkZVBhbmVsV2hlbkVtcHR5OiBib29sZWFuXG4gIHNob3dQYW5lbFN0YXRlTWVzc2FnZXM6IGJvb2xlYW5cbiAgYWN0aXZhdGlvblRpbWVyOiBudW1iZXJcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gZmFsc2VcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWxlZ2F0ZSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuaGlkZVBhbmVsV2hlbkVtcHR5JywgaGlkZVBhbmVsV2hlbkVtcHR5ID0+IHtcbiAgICAgICAgdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgPSBoaWRlUGFuZWxXaGVuRW1wdHlcbiAgICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZSgoeyBwYW5lOiBkZXN0cm95ZWRQYW5lIH0pID0+IHtcbiAgICAgICAgY29uc3QgaXNQYW5lSXRlbURlc3Ryb3llZCA9IGRlc3Ryb3llZFBhbmUuZ2V0SXRlbXMoKS5pbmNsdWRlcyh0aGlzLnBhbmVsKVxuICAgICAgICBpZiAoaXNQYW5lSXRlbURlc3Ryb3llZCAmJiAhdGhpcy5kZWFjdGl2YXRpbmcpIHtcbiAgICAgICAgICB0aGlzLnBhbmVsID0gbnVsbFxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0oKHsgaXRlbTogcGFuZUl0ZW0gfSkgPT4ge1xuICAgICAgICBpZiAocGFuZUl0ZW0gaW5zdGFuY2VvZiBQYW5lbERvY2sgJiYgIXRoaXMuZGVhY3RpdmF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIGZhbHNlKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIHNob3dQYW5lbCA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1BhbmVsQ29uZmlnID0gc2hvd1BhbmVsXG4gICAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9ICEhdGhpcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aFxuICAgICAgICB0aGlzLnJlZnJlc2goKVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuYWN0aXZhdGlvblRpbWVyID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgbGV0IGZpcnN0VGltZSA9IHRydWU7XG4gICAgICBjb25zdCBkb2NrID0gYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBkb2NrLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5wYW5lbCB8fCB0aGlzLmdldFBhbmVsTG9jYXRpb24oKSAhPT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBpc0ZvY3VzSW4gPSBwYW5lSXRlbSA9PT0gdGhpcy5wYW5lbFxuICAgICAgICAgIGNvbnN0IGV4dGVybmFsbHlUb2dnbGVkID0gaXNGb2N1c0luICE9PSB0aGlzLnNob3dQYW5lbENvbmZpZ1xuICAgICAgICAgIGlmIChleHRlcm5hbGx5VG9nZ2xlZCkge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCAhdGhpcy5zaG93UGFuZWxDb25maWcpXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGRvY2sub25EaWRDaGFuZ2VWaXNpYmxlKHZpc2libGUgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5wYW5lbCB8fCB0aGlzLmdldFBhbmVsTG9jYXRpb24oKSAhPT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXZpc2libGUpIHtcbiAgICAgICAgICAgIC8vIF4gV2hlbiBpdCdzIHRpbWUgdG8gdGVsbCBjb25maWcgdG8gaGlkZVxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1BhbmVsQ29uZmlnICYmIHRoaXMuaGlkZVBhbmVsV2hlbkVtcHR5ICYmICF0aGlzLnNob3dQYW5lbFN0YXRlTWVzc2FnZXMpIHtcbiAgICAgICAgICAgICAgLy8gSWdub3JlIGJlY2F1c2Ugd2UganVzdCBkb24ndCBoYXZlIGFueSBtZXNzYWdlcyB0byBzaG93LCBldmVyeXRoaW5nIGVsc2UgaXMgZmluZVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZXh0ZXJuYWxseVRvZ2dsZWQgPSB2aXNpYmxlICE9PSB0aGlzLnNob3dQYW5lbENvbmZpZ1xuICAgICAgICAgIGlmIChleHRlcm5hbGx5VG9nZ2xlZCkge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCAhdGhpcy5zaG93UGFuZWxDb25maWcpXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgdGhpcy5hY3RpdmF0ZSgpXG4gICAgfSlcbiAgfVxuICBnZXRQYW5lbExvY2F0aW9uKCkge1xuICAgIGlmICghdGhpcy5wYW5lbCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMucGFuZWwpXG4gICAgcmV0dXJuIChwYW5lQ29udGFpbmVyICYmIHBhbmVDb250YWluZXIubG9jYXRpb24pIHx8IG51bGxcbiAgfVxuICBhc3luYyBhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBuZXcgUGFuZWxEb2NrKHRoaXMuZGVsZWdhdGUpXG4gICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0aGlzLnBhbmVsLCB7XG4gICAgICBhY3RpdmF0ZVBhbmU6IGZhbHNlLFxuICAgICAgYWN0aXZhdGVJdGVtOiBmYWxzZSxcbiAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgIH0pXG4gICAgdGhpcy51cGRhdGUoKVxuICAgIHRoaXMucmVmcmVzaCgpXG4gIH1cbiAgdXBkYXRlKG5ld01lc3NhZ2VzOiA/QXJyYXk8TGludGVyTWVzc2FnZT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKG5ld01lc3NhZ2VzKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gbmV3TWVzc2FnZXNcbiAgICB9XG4gICAgdGhpcy5kZWxlZ2F0ZS51cGRhdGUodGhpcy5tZXNzYWdlcylcbiAgICB0aGlzLnNob3dQYW5lbFN0YXRlTWVzc2FnZXMgPSAhIXRoaXMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcy5sZW5ndGhcbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG4gIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLnBhbmVsXG4gICAgaWYgKHBhbmVsID09PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5zaG93UGFuZWxDb25maWcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZSgpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHBhbmVsKVxuICAgIGlmICghcGFuZUNvbnRhaW5lciB8fCBwYW5lQ29udGFpbmVyLmxvY2F0aW9uICE9PSAnYm90dG9tJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGlzQWN0aXZlUGFuZWwgPSBwYW5lQ29udGFpbmVyLmdldEFjdGl2ZVBhbmVJdGVtKCkgPT09IHBhbmVsXG4gICAgY29uc3QgdmlzaWJpbGl0eUFsbG93ZWQxID0gdGhpcy5zaG93UGFuZWxDb25maWdcbiAgICBjb25zdCB2aXNpYmlsaXR5QWxsb3dlZDIgPSB0aGlzLmhpZGVQYW5lbFdoZW5FbXB0eSA/IHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA6IHRydWVcbiAgICBpZiAodmlzaWJpbGl0eUFsbG93ZWQxICYmIHZpc2liaWxpdHlBbGxvd2VkMikge1xuICAgICAgaWYgKCFpc0FjdGl2ZVBhbmVsKSB7XG4gICAgICAgIHBhbmVDb250YWluZXIucGFuZUZvckl0ZW0ocGFuZWwpLmFjdGl2YXRlSXRlbShwYW5lbClcbiAgICAgIH1cbiAgICAgIHBhbmVDb250YWluZXIuc2hvdygpXG4gICAgICBwYW5lbC5kb1BhbmVsUmVzaXplKClcbiAgICB9IGVsc2UgaWYgKGlzQWN0aXZlUGFuZWwpIHtcbiAgICAgIHBhbmVDb250YWluZXIuaGlkZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5kZWFjdGl2YXRpbmcgPSB0cnVlXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKHRoaXMuYWN0aXZhdGlvblRpbWVyKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxcbiJdfQ==