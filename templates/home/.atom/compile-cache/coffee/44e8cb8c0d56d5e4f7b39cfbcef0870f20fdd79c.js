(function() {
  var changeTabBarSize, observeEditorsOnEvents, root, setSize, showTabBarInTreeView, tabsInTreeView, treeViewTitles, unsetSize;

  root = document.documentElement;

  tabsInTreeView = root.querySelector('.list-inline.tab-bar.inset-panel');

  treeViewTitles = document.querySelectorAll('.tree-view span.name');

  module.exports = {
    activate: function(state) {
      var fontSizeValue, tabSizeValue;
      console.log('activate city lights ui ', state);
      tabSizeValue = atom.config.get('city-lights-ui.tabSize');
      fontSizeValue = atom.config.get('city-lights-ui.fontSize');
      setSize(fontSizeValue);
      changeTabBarSize(tabSizeValue);
      atom.config.observe('city-lights-ui.showTabsInTreeView', function(newValue) {
        return showTabBarInTreeView(newValue);
      });
      atom.config.observe('city-lights-ui.fontSize', function(newValue) {
        return setSize(newValue);
      });
      return atom.config.observe('city-lights-ui.tabSize', function(tabSizeValue) {
        return changeTabBarSize(tabSizeValue);
      });
    },
    deactivate: function() {
      return unsetSize();
    }
  };

  showTabBarInTreeView = function(boolean) {
    if (boolean) {
      return tabsInTreeView.style.display = 'flex';
    } else {
      return tabsInTreeView.style.display = 'none';
    }
  };

  setSize = function(currentFontSize) {
    root.style.fontSize = currentFontSize + 'px';
    if (currentFontSize >= 11) {
      return root.style.lineHeight = 2.4;
    } else {
      return root.style.lineHeight = 2.1;
    }
  };

  unsetSize = function() {
    var i, j, len, results, span;
    results = [];
    for (i = j = 0, len = treeViewTitles.length; j < len; i = ++j) {
      span = treeViewTitles[i];
      results.push(span.style.fontSize = '');
    }
    return results;
  };

  changeTabBarSize = function(tabValue) {
    var j, k, l, len, len1, len2, results, results1, results2, tab, tabBars;
    tabBars = document.querySelectorAll('.tab-bar .tab');
    switch (tabValue) {
      case 'small':
        results = [];
        for (j = 0, len = tabBars.length; j < len; j++) {
          tab = tabBars[j];
          tab.classList.add(tabValue);
          tab.classList.remove('medium');
          results.push(tab.classList.remove('large'));
        }
        return results;
        break;
      case 'medium':
        results1 = [];
        for (k = 0, len1 = tabBars.length; k < len1; k++) {
          tab = tabBars[k];
          tab.classList.add(tabValue);
          tab.classList.remove('large');
          results1.push(tab.classList.remove('small'));
        }
        return results1;
        break;
      case 'large':
        results2 = [];
        for (l = 0, len2 = tabBars.length; l < len2; l++) {
          tab = tabBars[l];
          tab.classList.add(tabValue);
          tab.classList.remove('medium');
          results2.push(tab.classList.remove('small'));
        }
        return results2;
    }
  };

  observeEditorsOnEvents = function() {
    var fontSizeValue, tabSizeValue;
    tabSizeValue = atom.config.get('city-lights-ui.tabSize');
    fontSizeValue = atom.config.get('city-lights-ui.fontSize');
    setSize(fontSizeValue);
    return changeTabBarSize(tabSizeValue);
  };

  atom.workspace.observeActivePaneItem(function(editor) {
    return observeEditorsOnEvents();
  });

  atom.workspace.observeTextEditors(function(editor) {
    return observeEditorsOnEvents();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvY2l0eS1saWdodHMtdWkvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDOztFQUNoQixjQUFBLEdBQWlCLElBQUksQ0FBQyxhQUFMLENBQW1CLGtDQUFuQjs7RUFDakIsY0FBQSxHQUFpQixRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsc0JBQTFCOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7TUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDBCQUFaLEVBQXdDLEtBQXhDO01BRUEsWUFBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEI7TUFDZixhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEI7TUFDaEIsT0FBQSxDQUFRLGFBQVI7TUFDQSxnQkFBQSxDQUFpQixZQUFqQjtNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixtQ0FBcEIsRUFBeUQsU0FBQyxRQUFEO2VBQ3ZELG9CQUFBLENBQXFCLFFBQXJCO01BRHVELENBQXpEO01BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHlCQUFwQixFQUErQyxTQUFDLFFBQUQ7ZUFDN0MsT0FBQSxDQUFRLFFBQVI7TUFENkMsQ0FBL0M7YUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isd0JBQXBCLEVBQThDLFNBQUMsWUFBRDtlQUM1QyxnQkFBQSxDQUFpQixZQUFqQjtNQUQ0QyxDQUE5QztJQWRRLENBQVY7SUFpQkEsVUFBQSxFQUFZLFNBQUE7YUFDVixTQUFBLENBQUE7SUFEVSxDQWpCWjs7O0VBcUJGLG9CQUFBLEdBQXVCLFNBQUMsT0FBRDtJQUNyQixJQUFHLE9BQUg7YUFDRSxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQXJCLEdBQStCLE9BRGpDO0tBQUEsTUFBQTthQUdFLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBckIsR0FBK0IsT0FIakM7O0VBRHFCOztFQU92QixPQUFBLEdBQVUsU0FBQyxlQUFEO0lBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCLGVBQUEsR0FBa0I7SUFDeEMsSUFBRyxlQUFBLElBQW1CLEVBQXRCO2FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFYLEdBQXdCLElBRDFCO0tBQUEsTUFBQTthQUdFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBWCxHQUF3QixJQUgxQjs7RUFGUTs7RUFPVixTQUFBLEdBQVksU0FBQTtBQUNWLFFBQUE7QUFBQTtTQUFBLHdEQUFBOzttQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0I7QUFEeEI7O0VBRFU7O0VBSVosZ0JBQUEsR0FBbUIsU0FBQyxRQUFEO0FBQ2pCLFFBQUE7SUFBQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGdCQUFULENBQTBCLGVBQTFCO0FBQ1YsWUFBTyxRQUFQO0FBQUEsV0FDTyxPQURQO0FBRUk7YUFBQSx5Q0FBQTs7VUFDRSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsUUFBbEI7VUFDQSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQWQsQ0FBcUIsUUFBckI7dUJBQ0EsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLE9BQXJCO0FBSEY7O0FBREc7QUFEUCxXQU9PLFFBUFA7QUFRSTthQUFBLDJDQUFBOztVQUNFLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixRQUFsQjtVQUNBLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBZCxDQUFxQixPQUFyQjt3QkFDQSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQWQsQ0FBcUIsT0FBckI7QUFIRjs7QUFERztBQVBQLFdBYU8sT0FiUDtBQWNJO2FBQUEsMkNBQUE7O1VBQ0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLFFBQWxCO1VBQ0EsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLFFBQXJCO3dCQUNBLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBZCxDQUFxQixPQUFyQjtBQUhGOztBQWRKO0VBRmlCOztFQXFCbkIsc0JBQUEsR0FBeUIsU0FBQTtBQUN2QixRQUFBO0lBQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEI7SUFDZixhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEI7SUFDaEIsT0FBQSxDQUFRLGFBQVI7V0FDQSxnQkFBQSxDQUFpQixZQUFqQjtFQUp1Qjs7RUFNekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFxQyxTQUFDLE1BQUQ7V0FDbkMsc0JBQUEsQ0FBQTtFQURtQyxDQUFyQzs7RUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRDtXQUNoQyxzQkFBQSxDQUFBO0VBRGdDLENBQWxDO0FBMUVBIiwic291cmNlc0NvbnRlbnQiOlsicm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxudGFic0luVHJlZVZpZXcgPSByb290LnF1ZXJ5U2VsZWN0b3IgJy5saXN0LWlubGluZS50YWItYmFyLmluc2V0LXBhbmVsJ1xudHJlZVZpZXdUaXRsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHJlZS12aWV3IHNwYW4ubmFtZScpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBjb25zb2xlLmxvZyAnYWN0aXZhdGUgY2l0eSBsaWdodHMgdWkgJywgc3RhdGVcblxuICAgIHRhYlNpemVWYWx1ZSA9IGF0b20uY29uZmlnLmdldCgnY2l0eS1saWdodHMtdWkudGFiU2l6ZScpXG4gICAgZm9udFNpemVWYWx1ZSA9IGF0b20uY29uZmlnLmdldCgnY2l0eS1saWdodHMtdWkuZm9udFNpemUnKVxuICAgIHNldFNpemUoZm9udFNpemVWYWx1ZSlcbiAgICBjaGFuZ2VUYWJCYXJTaXplKHRhYlNpemVWYWx1ZSlcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2NpdHktbGlnaHRzLXVpLnNob3dUYWJzSW5UcmVlVmlldycsIChuZXdWYWx1ZSkgLT5cbiAgICAgIHNob3dUYWJCYXJJblRyZWVWaWV3KG5ld1ZhbHVlKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnY2l0eS1saWdodHMtdWkuZm9udFNpemUnLCAobmV3VmFsdWUpIC0+XG4gICAgICBzZXRTaXplKG5ld1ZhbHVlKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnY2l0eS1saWdodHMtdWkudGFiU2l6ZScsICh0YWJTaXplVmFsdWUpIC0+XG4gICAgICBjaGFuZ2VUYWJCYXJTaXplKHRhYlNpemVWYWx1ZSlcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIHVuc2V0U2l6ZSgpXG5cblxuc2hvd1RhYkJhckluVHJlZVZpZXcgPSAoYm9vbGVhbikgLT5cbiAgaWYgYm9vbGVhblxuICAgIHRhYnNJblRyZWVWaWV3LnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgZWxzZVxuICAgIHRhYnNJblRyZWVWaWV3LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcblxuXG5zZXRTaXplID0gKGN1cnJlbnRGb250U2l6ZSkgLT5cbiAgcm9vdC5zdHlsZS5mb250U2l6ZSA9IGN1cnJlbnRGb250U2l6ZSArICdweCdcbiAgaWYgY3VycmVudEZvbnRTaXplID49IDExXG4gICAgcm9vdC5zdHlsZS5saW5lSGVpZ2h0ID0gMi40XG4gIGVsc2VcbiAgICByb290LnN0eWxlLmxpbmVIZWlnaHQgPSAyLjFcblxudW5zZXRTaXplID0gKCkgLT5cbiAgZm9yIHNwYW4sIGkgaW4gdHJlZVZpZXdUaXRsZXNcbiAgICBzcGFuLnN0eWxlLmZvbnRTaXplID0gJydcblxuY2hhbmdlVGFiQmFyU2l6ZSA9ICh0YWJWYWx1ZSkgLT5cbiAgdGFiQmFycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItYmFyIC50YWInKVxuICBzd2l0Y2ggdGFiVmFsdWVcbiAgICB3aGVuICdzbWFsbCdcbiAgICAgIGZvciB0YWIgaW4gdGFiQmFyc1xuICAgICAgICB0YWIuY2xhc3NMaXN0LmFkZCh0YWJWYWx1ZSlcbiAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bScpXG4gICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdsYXJnZScpXG5cbiAgICB3aGVuICdtZWRpdW0nXG4gICAgICBmb3IgdGFiIGluIHRhYkJhcnNcbiAgICAgICAgdGFiLmNsYXNzTGlzdC5hZGQodGFiVmFsdWUpXG4gICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdsYXJnZScpXG4gICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdzbWFsbCcpXG5cbiAgICB3aGVuICdsYXJnZSdcbiAgICAgIGZvciB0YWIgaW4gdGFiQmFyc1xuICAgICAgICB0YWIuY2xhc3NMaXN0LmFkZCh0YWJWYWx1ZSlcbiAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bScpXG4gICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdzbWFsbCcpXG5cbm9ic2VydmVFZGl0b3JzT25FdmVudHMgPSAtPlxuICB0YWJTaXplVmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQoJ2NpdHktbGlnaHRzLXVpLnRhYlNpemUnKVxuICBmb250U2l6ZVZhbHVlID0gYXRvbS5jb25maWcuZ2V0KCdjaXR5LWxpZ2h0cy11aS5mb250U2l6ZScpXG4gIHNldFNpemUoZm9udFNpemVWYWx1ZSlcbiAgY2hhbmdlVGFiQmFyU2l6ZSh0YWJTaXplVmFsdWUpXG5cbmF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbSAoZWRpdG9yKSAtPlxuICBvYnNlcnZlRWRpdG9yc09uRXZlbnRzKClcblxuYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpIC0+XG4gIG9ic2VydmVFZGl0b3JzT25FdmVudHMoKVxuIl19
