var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var React = undefined;
var ReactDOM = undefined;
var Component = undefined;

// eslint-disable-next-line no-use-before-define
function getPaneContainer(item) {
  var paneContainer = atom.workspace.paneContainerForItem(item);
  // NOTE: This is an internal API access
  // It's necessary because there's no Public API for it yet
  if (paneContainer && typeof paneContainer.state === 'object' && typeof paneContainer.state.size === 'number' && typeof paneContainer.render === 'function') {
    return paneContainer;
  }
  return null;
}

var PanelDock = (function () {
  function PanelDock(delegate) {
    var _this = this;

    _classCallCheck(this, PanelDock);

    this.element = document.createElement('div');
    this.subscriptions = new _atom.CompositeDisposable();

    this.lastSetPaneHeight = null;
    this.subscriptions.add(atom.config.observe('linter-ui-default.panelHeight', function (panelHeight) {
      var changed = typeof _this.panelHeight === 'number';
      _this.panelHeight = panelHeight;
      if (changed) {
        _this.doPanelResize(true);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.alwaysTakeMinimumSpace', function (alwaysTakeMinimumSpace) {
      _this.alwaysTakeMinimumSpace = alwaysTakeMinimumSpace;
    }));
    this.doPanelResize();

    if (!React) {
      React = require('react');
    }
    if (!ReactDOM) {
      ReactDOM = require('react-dom');
    }
    if (!Component) {
      Component = require('./component');
    }

    ReactDOM.render(React.createElement(Component, { delegate: delegate }), this.element);
  }

  // NOTE: Chose a name that won't conflict with Dock APIs

  _createClass(PanelDock, [{
    key: 'doPanelResize',
    value: function doPanelResize() {
      var forConfigHeight = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var paneContainer = getPaneContainer(this);
      var minimumHeight = null;
      var paneContainerView = atom.views.getView(paneContainer);
      if (paneContainerView && this.alwaysTakeMinimumSpace) {
        // NOTE: Super horrible hack but the only possible way I could find :((
        var dockNamesElement = paneContainerView.querySelector('.list-inline.tab-bar.inset-panel');
        var dockNamesRects = dockNamesElement ? dockNamesElement.getClientRects()[0] : null;
        var tableElement = this.element.querySelector('table');
        var panelRects = tableElement ? tableElement.getClientRects()[0] : null;
        if (dockNamesRects && panelRects) {
          minimumHeight = dockNamesRects.height + panelRects.height + 1;
        }
      }

      if (paneContainer) {
        var updateConfigHeight = null;
        var heightSet = minimumHeight !== null && !forConfigHeight ? Math.min(minimumHeight, this.panelHeight) : this.panelHeight;

        // Person resized the panel, save new resized value to config
        if (this.lastSetPaneHeight !== null && paneContainer.state.size !== this.lastSetPaneHeight && !forConfigHeight) {
          updateConfigHeight = paneContainer.state.size;
        }

        this.lastSetPaneHeight = heightSet;
        paneContainer.state.size = heightSet;
        paneContainer.render(paneContainer.state);

        if (updateConfigHeight !== null) {
          atom.config.set('linter-ui-default.panelHeight', updateConfigHeight);
        }
      }
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return _helpers.WORKSPACE_URI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Linter';
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return _helpers.DOCK_DEFAULT_LOCATION;
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return _helpers.DOCK_ALLOWED_LOCATIONS;
    }
  }, {
    key: 'getPreferredHeight',
    value: function getPreferredHeight() {
      return atom.config.get('linter-ui-default.panelHeight');
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      var paneContainer = getPaneContainer(this);
      if (paneContainer && !this.alwaysTakeMinimumSpace && paneContainer.state.size !== this.panelHeight) {
        atom.config.set('linter-ui-default.panelHeight', paneContainer.state.size);
        paneContainer.paneForItem(this).destroyItem(this, true);
      }
    }
  }]);

  return PanelDock;
})();

module.exports = PanelDock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9kb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRW9DLE1BQU07O3VCQUNtQyxZQUFZOztBQUV6RixJQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsSUFBSSxRQUFRLFlBQUEsQ0FBQTtBQUNaLElBQUksU0FBUyxZQUFBLENBQUE7OztBQUdiLFNBQVMsZ0JBQWdCLENBQUMsSUFBZSxFQUFFO0FBQ3pDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7OztBQUcvRCxNQUNFLGFBQWEsSUFDYixPQUFPLGFBQWEsQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUN2QyxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFDNUMsT0FBTyxhQUFhLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFDMUM7QUFDQSxXQUFPLGFBQWEsQ0FBQTtHQUNyQjtBQUNELFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0lBRUssU0FBUztBQU9GLFdBUFAsU0FBUyxDQU9ELFFBQWdCLEVBQUU7OzswQkFQMUIsU0FBUzs7QUFRWCxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQTtBQUM3QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsVUFBQSxXQUFXLEVBQUk7QUFDbEUsVUFBTSxPQUFPLEdBQUcsT0FBTyxNQUFLLFdBQVcsS0FBSyxRQUFRLENBQUE7QUFDcEQsWUFBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFVBQUksT0FBTyxFQUFFO0FBQ1gsY0FBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDekI7S0FDRixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsRUFBRSxVQUFBLHNCQUFzQixFQUFJO0FBQ3hGLFlBQUssc0JBQXNCLEdBQUcsc0JBQXNCLENBQUE7S0FDckQsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7O0FBRXBCLFFBQUksQ0FBQyxLQUFLLEVBQUU7QUFDVixXQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ3pCO0FBQ0QsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGNBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7S0FDaEM7QUFDRCxRQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2QsZUFBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUNuQzs7QUFFRCxZQUFRLENBQUMsTUFBTSxDQUFDLG9CQUFDLFNBQVMsSUFBQyxRQUFRLEVBQUUsUUFBUSxBQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDakU7Ozs7ZUF2Q0csU0FBUzs7V0F5Q0EseUJBQW1DO1VBQWxDLGVBQXdCLHlEQUFHLEtBQUs7O0FBQzVDLFVBQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVDLFVBQUksYUFBNEIsR0FBRyxJQUFJLENBQUE7QUFDdkMsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUMzRCxVQUFJLGlCQUFpQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTs7QUFFcEQsWUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtBQUM1RixZQUFNLGNBQWMsR0FBRyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUE7QUFDckYsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDeEQsWUFBTSxVQUFVLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUE7QUFDekUsWUFBSSxjQUFjLElBQUksVUFBVSxFQUFFO0FBQ2hDLHVCQUFhLEdBQUcsY0FBYyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtTQUM5RDtPQUNGOztBQUVELFVBQUksYUFBYSxFQUFFO0FBQ2pCLFlBQUksa0JBQWlDLEdBQUcsSUFBSSxDQUFBO0FBQzVDLFlBQU0sU0FBUyxHQUNiLGFBQWEsS0FBSyxJQUFJLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7OztBQUczRyxZQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxJQUFJLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGlCQUFpQixJQUFJLENBQUMsZUFBZSxFQUFFO0FBQzlHLDRCQUFrQixHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO1NBQzlDOztBQUVELFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUE7QUFDbEMscUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQTtBQUNwQyxxQkFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRXpDLFlBQUksa0JBQWtCLEtBQUssSUFBSSxFQUFFO0FBQy9CLGNBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLGtCQUFrQixDQUFDLENBQUE7U0FDckU7T0FDRjtLQUNGOzs7V0FDSyxrQkFBRztBQUNQLG9DQUFvQjtLQUNyQjs7O1dBQ08sb0JBQUc7QUFDVCxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2lCLDhCQUFHO0FBQ25CLDRDQUE0QjtLQUM3Qjs7O1dBQ2tCLCtCQUFHO0FBQ3BCLDZDQUE2QjtLQUM5Qjs7O1dBQ2lCLDhCQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtLQUN4RDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVDLFVBQUksYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDbEcsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMxRSxxQkFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3hEO0tBQ0Y7OztTQWpHRyxTQUFTOzs7QUFvR2YsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2RvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFdPUktTUEFDRV9VUkksIERPQ0tfQUxMT1dFRF9MT0NBVElPTlMsIERPQ0tfREVGQVVMVF9MT0NBVElPTiB9IGZyb20gJy4uL2hlbHBlcnMnXG5cbmxldCBSZWFjdFxubGV0IFJlYWN0RE9NXG5sZXQgQ29tcG9uZW50XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuZnVuY3Rpb24gZ2V0UGFuZUNvbnRhaW5lcihpdGVtOiBQYW5lbERvY2spIHtcbiAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKGl0ZW0pXG4gIC8vIE5PVEU6IFRoaXMgaXMgYW4gaW50ZXJuYWwgQVBJIGFjY2Vzc1xuICAvLyBJdCdzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZXJlJ3Mgbm8gUHVibGljIEFQSSBmb3IgaXQgeWV0XG4gIGlmIChcbiAgICBwYW5lQ29udGFpbmVyICYmXG4gICAgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUgPT09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9PT0gJ251bWJlcicgJiZcbiAgICB0eXBlb2YgcGFuZUNvbnRhaW5lci5yZW5kZXIgPT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgcmV0dXJuIHBhbmVDb250YWluZXJcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5jbGFzcyBQYW5lbERvY2sge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHBhbmVsSGVpZ2h0OiBudW1iZXJcbiAgYWx3YXlzVGFrZU1pbmltdW1TcGFjZTogYm9vbGVhblxuICBsYXN0U2V0UGFuZUhlaWdodDogbnVtYmVyIHwgbnVsbFxuXG4gIGNvbnN0cnVjdG9yKGRlbGVnYXRlOiBPYmplY3QpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMubGFzdFNldFBhbmVIZWlnaHQgPSBudWxsXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JywgcGFuZWxIZWlnaHQgPT4ge1xuICAgICAgICBjb25zdCBjaGFuZ2VkID0gdHlwZW9mIHRoaXMucGFuZWxIZWlnaHQgPT09ICdudW1iZXInXG4gICAgICAgIHRoaXMucGFuZWxIZWlnaHQgPSBwYW5lbEhlaWdodFxuICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMuZG9QYW5lbFJlc2l6ZSh0cnVlKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UnLCBhbHdheXNUYWtlTWluaW11bVNwYWNlID0+IHtcbiAgICAgICAgdGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlID0gYWx3YXlzVGFrZU1pbmltdW1TcGFjZVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuZG9QYW5lbFJlc2l6ZSgpXG5cbiAgICBpZiAoIVJlYWN0KSB7XG4gICAgICBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbiAgICB9XG4gICAgaWYgKCFSZWFjdERPTSkge1xuICAgICAgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKVxuICAgIH1cbiAgICBpZiAoIUNvbXBvbmVudCkge1xuICAgICAgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxuICAgIH1cblxuICAgIFJlYWN0RE9NLnJlbmRlcig8Q29tcG9uZW50IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gLz4sIHRoaXMuZWxlbWVudClcbiAgfVxuICAvLyBOT1RFOiBDaG9zZSBhIG5hbWUgdGhhdCB3b24ndCBjb25mbGljdCB3aXRoIERvY2sgQVBJc1xuICBkb1BhbmVsUmVzaXplKGZvckNvbmZpZ0hlaWdodDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGdldFBhbmVDb250YWluZXIodGhpcylcbiAgICBsZXQgbWluaW11bUhlaWdodDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgICBjb25zdCBwYW5lQ29udGFpbmVyVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhwYW5lQ29udGFpbmVyKVxuICAgIGlmIChwYW5lQ29udGFpbmVyVmlldyAmJiB0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UpIHtcbiAgICAgIC8vIE5PVEU6IFN1cGVyIGhvcnJpYmxlIGhhY2sgYnV0IHRoZSBvbmx5IHBvc3NpYmxlIHdheSBJIGNvdWxkIGZpbmQgOigoXG4gICAgICBjb25zdCBkb2NrTmFtZXNFbGVtZW50ID0gcGFuZUNvbnRhaW5lclZpZXcucXVlcnlTZWxlY3RvcignLmxpc3QtaW5saW5lLnRhYi1iYXIuaW5zZXQtcGFuZWwnKVxuICAgICAgY29uc3QgZG9ja05hbWVzUmVjdHMgPSBkb2NrTmFtZXNFbGVtZW50ID8gZG9ja05hbWVzRWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdIDogbnVsbFxuICAgICAgY29uc3QgdGFibGVFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RhYmxlJylcbiAgICAgIGNvbnN0IHBhbmVsUmVjdHMgPSB0YWJsZUVsZW1lbnQgPyB0YWJsZUVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSA6IG51bGxcbiAgICAgIGlmIChkb2NrTmFtZXNSZWN0cyAmJiBwYW5lbFJlY3RzKSB7XG4gICAgICAgIG1pbmltdW1IZWlnaHQgPSBkb2NrTmFtZXNSZWN0cy5oZWlnaHQgKyBwYW5lbFJlY3RzLmhlaWdodCArIDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGFuZUNvbnRhaW5lcikge1xuICAgICAgbGV0IHVwZGF0ZUNvbmZpZ0hlaWdodDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgICAgIGNvbnN0IGhlaWdodFNldCA9XG4gICAgICAgIG1pbmltdW1IZWlnaHQgIT09IG51bGwgJiYgIWZvckNvbmZpZ0hlaWdodCA/IE1hdGgubWluKG1pbmltdW1IZWlnaHQsIHRoaXMucGFuZWxIZWlnaHQpIDogdGhpcy5wYW5lbEhlaWdodFxuXG4gICAgICAvLyBQZXJzb24gcmVzaXplZCB0aGUgcGFuZWwsIHNhdmUgbmV3IHJlc2l6ZWQgdmFsdWUgdG8gY29uZmlnXG4gICAgICBpZiAodGhpcy5sYXN0U2V0UGFuZUhlaWdodCAhPT0gbnVsbCAmJiBwYW5lQ29udGFpbmVyLnN0YXRlLnNpemUgIT09IHRoaXMubGFzdFNldFBhbmVIZWlnaHQgJiYgIWZvckNvbmZpZ0hlaWdodCkge1xuICAgICAgICB1cGRhdGVDb25maWdIZWlnaHQgPSBwYW5lQ29udGFpbmVyLnN0YXRlLnNpemVcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0U2V0UGFuZUhlaWdodCA9IGhlaWdodFNldFxuICAgICAgcGFuZUNvbnRhaW5lci5zdGF0ZS5zaXplID0gaGVpZ2h0U2V0XG4gICAgICBwYW5lQ29udGFpbmVyLnJlbmRlcihwYW5lQ29udGFpbmVyLnN0YXRlKVxuXG4gICAgICBpZiAodXBkYXRlQ29uZmlnSGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxIZWlnaHQnLCB1cGRhdGVDb25maWdIZWlnaHQpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gV09SS1NQQUNFX1VSSVxuICB9XG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnTGludGVyJ1xuICB9XG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gRE9DS19ERUZBVUxUX0xPQ0FUSU9OXG4gIH1cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucygpIHtcbiAgICByZXR1cm4gRE9DS19BTExPV0VEX0xPQ0FUSU9OU1xuICB9XG4gIGdldFByZWZlcnJlZEhlaWdodCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGdldFBhbmVDb250YWluZXIodGhpcylcbiAgICBpZiAocGFuZUNvbnRhaW5lciAmJiAhdGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlICYmIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSAhPT0gdGhpcy5wYW5lbEhlaWdodCkge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcsIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSlcbiAgICAgIHBhbmVDb250YWluZXIucGFuZUZvckl0ZW0odGhpcykuZGVzdHJveUl0ZW0odGhpcywgdHJ1ZSlcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbERvY2tcbiJdfQ==