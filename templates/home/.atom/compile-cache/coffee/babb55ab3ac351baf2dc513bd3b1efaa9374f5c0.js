(function() {
  atom.packages.activatePackage('tree-view').then(function(tree) {
    var IS_ANCHORED_CLASSNAME, projectRoots, treeView, updateTreeViewHeaderPosition;
    IS_ANCHORED_CLASSNAME = 'is--anchored';
    treeView = tree.mainModule.treeView;
    projectRoots = treeView.roots;
    updateTreeViewHeaderPosition = function() {
      var i, len, position, project, projectClassList, projectHeaderHeight, projectHeight, projectOffsetY, ref, results, yScrollPosition;
      if (treeView.scroller) {
        position = (ref = treeView.scroller[0]) != null ? ref : treeView.scroller;
      } else {
        position = 0;
      }
      yScrollPosition = position.scrollTop;
      results = [];
      for (i = 0, len = projectRoots.length; i < len; i++) {
        project = projectRoots[i];
        projectHeaderHeight = project.header.offsetHeight;
        projectClassList = project.classList;
        projectOffsetY = project.offsetTop;
        projectHeight = project.offsetHeight;
        if (yScrollPosition > projectOffsetY) {
          if (yScrollPosition > projectOffsetY + projectHeight - projectHeaderHeight) {
            project.header.style.top = 'auto';
            results.push(projectClassList.add(IS_ANCHORED_CLASSNAME));
          } else {
            project.header.style.top = (yScrollPosition - projectOffsetY) + 'px';
            results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
          }
        } else {
          project.header.style.top = '0';
          results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
        }
      }
      return results;
    };
    atom.project.onDidChangePaths(function() {
      projectRoots = treeView.roots;
      return updateTreeViewHeaderPosition();
    });
    atom.config.onDidChange('seti-ui', function() {
      return setTimeout(function() {
        return updateTreeViewHeaderPosition();
      });
    });
    if (typeof treeView.scroller.on === 'function') {
      treeView.scroller.on('scroll', updateTreeViewHeaderPosition);
    } else {
      treeView.scroller.addEventListener('scroll', function() {
        return updateTreeViewHeaderPosition();
      });
    }
    return setTimeout(function() {
      return updateTreeViewHeaderPosition();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvc2V0aS11aS9saWIvaGVhZGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxTQUFDLElBQUQ7QUFDOUMsUUFBQTtJQUFBLHFCQUFBLEdBQXdCO0lBRXhCLFFBQUEsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLFlBQUEsR0FBZSxRQUFRLENBQUM7SUFFeEIsNEJBQUEsR0FBK0IsU0FBQTtBQUU3QixVQUFBO01BQUEsSUFBRyxRQUFRLENBQUMsUUFBWjtRQUNFLFFBQUEsZ0RBQWtDLFFBQVEsQ0FBQyxTQUQ3QztPQUFBLE1BQUE7UUFHRSxRQUFBLEdBQVcsRUFIYjs7TUFLQSxlQUFBLEdBQW1CLFFBQVMsQ0FBQztBQUU3QjtXQUFBLDhDQUFBOztRQUNFLG1CQUFBLEdBQXNCLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDckMsZ0JBQUEsR0FBbUIsT0FBTyxDQUFDO1FBQzNCLGNBQUEsR0FBaUIsT0FBTyxDQUFDO1FBQ3pCLGFBQUEsR0FBZ0IsT0FBTyxDQUFDO1FBRXhCLElBQUcsZUFBQSxHQUFrQixjQUFyQjtVQUNFLElBQUcsZUFBQSxHQUFrQixjQUFBLEdBQWlCLGFBQWpCLEdBQWlDLG1CQUF0RDtZQUNFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQXJCLEdBQTJCO3lCQUMzQixnQkFBZ0IsQ0FBQyxHQUFqQixDQUFxQixxQkFBckIsR0FGRjtXQUFBLE1BQUE7WUFJRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQixDQUFDLGVBQUEsR0FBa0IsY0FBbkIsQ0FBQSxHQUFxQzt5QkFDaEUsZ0JBQWdCLENBQUMsTUFBakIsQ0FBd0IscUJBQXhCLEdBTEY7V0FERjtTQUFBLE1BQUE7VUFRRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQjt1QkFDM0IsZ0JBQWdCLENBQUMsTUFBakIsQ0FBd0IscUJBQXhCLEdBVEY7O0FBTkY7O0lBVDZCO0lBMEIvQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLFNBQUE7TUFDNUIsWUFBQSxHQUFlLFFBQVEsQ0FBQzthQUN4Qiw0QkFBQSxDQUFBO0lBRjRCLENBQTlCO0lBSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLFNBQXhCLEVBQW1DLFNBQUE7YUFHakMsVUFBQSxDQUFXLFNBQUE7ZUFBRyw0QkFBQSxDQUFBO01BQUgsQ0FBWDtJQUhpQyxDQUFuQztJQUlBLElBQUcsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXpCLEtBQStCLFVBQWxDO01BQ0UsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFsQixDQUFxQixRQUFyQixFQUErQiw0QkFBL0IsRUFERjtLQUFBLE1BQUE7TUFHRSxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFsQixDQUFtQyxRQUFuQyxFQUE2QyxTQUFBO2VBQzNDLDRCQUFBLENBQUE7TUFEMkMsQ0FBN0MsRUFIRjs7V0FNQSxVQUFBLENBQVcsU0FBQTthQUNULDRCQUFBLENBQUE7SUFEUyxDQUFYO0VBOUM4QyxDQUFoRDtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3RyZWUtdmlldycpLnRoZW4gKHRyZWUpIC0+XG4gIElTX0FOQ0hPUkVEX0NMQVNTTkFNRSA9ICdpcy0tYW5jaG9yZWQnXG5cbiAgdHJlZVZpZXcgPSB0cmVlLm1haW5Nb2R1bGUudHJlZVZpZXdcbiAgcHJvamVjdFJvb3RzID0gdHJlZVZpZXcucm9vdHNcblxuICB1cGRhdGVUcmVlVmlld0hlYWRlclBvc2l0aW9uID0gLT5cblxuICAgIGlmIHRyZWVWaWV3LnNjcm9sbGVyXG4gICAgICBwb3NpdGlvbiA9IHRyZWVWaWV3LnNjcm9sbGVyWzBdID8gdHJlZVZpZXcuc2Nyb2xsZXJcbiAgICBlbHNlXG4gICAgICBwb3NpdGlvbiA9IDBcblxuICAgIHlTY3JvbGxQb3NpdGlvbiA9IChwb3NpdGlvbikuc2Nyb2xsVG9wXG5cbiAgICBmb3IgcHJvamVjdCBpbiBwcm9qZWN0Um9vdHNcbiAgICAgIHByb2plY3RIZWFkZXJIZWlnaHQgPSBwcm9qZWN0LmhlYWRlci5vZmZzZXRIZWlnaHRcbiAgICAgIHByb2plY3RDbGFzc0xpc3QgPSBwcm9qZWN0LmNsYXNzTGlzdFxuICAgICAgcHJvamVjdE9mZnNldFkgPSBwcm9qZWN0Lm9mZnNldFRvcFxuICAgICAgcHJvamVjdEhlaWdodCA9IHByb2plY3Qub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIHlTY3JvbGxQb3NpdGlvbiA+IHByb2plY3RPZmZzZXRZXG4gICAgICAgIGlmIHlTY3JvbGxQb3NpdGlvbiA+IHByb2plY3RPZmZzZXRZICsgcHJvamVjdEhlaWdodCAtIHByb2plY3RIZWFkZXJIZWlnaHRcbiAgICAgICAgICBwcm9qZWN0LmhlYWRlci5zdHlsZS50b3AgPSAnYXV0bydcbiAgICAgICAgICBwcm9qZWN0Q2xhc3NMaXN0LmFkZCBJU19BTkNIT1JFRF9DTEFTU05BTUVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHByb2plY3QuaGVhZGVyLnN0eWxlLnRvcCA9ICh5U2Nyb2xsUG9zaXRpb24gLSBwcm9qZWN0T2Zmc2V0WSkgKyAncHgnXG4gICAgICAgICAgcHJvamVjdENsYXNzTGlzdC5yZW1vdmUgSVNfQU5DSE9SRURfQ0xBU1NOQU1FXG4gICAgICBlbHNlXG4gICAgICAgIHByb2plY3QuaGVhZGVyLnN0eWxlLnRvcCA9ICcwJ1xuICAgICAgICBwcm9qZWN0Q2xhc3NMaXN0LnJlbW92ZSBJU19BTkNIT1JFRF9DTEFTU05BTUVcblxuICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyAtPlxuICAgIHByb2plY3RSb290cyA9IHRyZWVWaWV3LnJvb3RzXG4gICAgdXBkYXRlVHJlZVZpZXdIZWFkZXJQb3NpdGlvbigpXG5cbiAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3NldGktdWknLCAtPlxuICAgICMgVE9ETyBzb21ldGhpbmcgb3RoZXIgdGhhbiBzZXRUaW1lb3V0PyBpdCdzIGEgaGFjayB0byB0cmlnZ2VyIHRoZSB1cGRhdGVcbiAgICAjIGFmdGVyIHRoZSBDU1MgY2hhbmdlcyBoYXZlIG9jY3VycmVkLiBhIGdhbWJsZSwgcHJvYmFibHkgaW5hY2N1cmF0ZVxuICAgIHNldFRpbWVvdXQgLT4gdXBkYXRlVHJlZVZpZXdIZWFkZXJQb3NpdGlvbigpXG4gIGlmIHR5cGVvZiB0cmVlVmlldy5zY3JvbGxlci5vbiBpcyAnZnVuY3Rpb24nXG4gICAgdHJlZVZpZXcuc2Nyb2xsZXIub24gJ3Njcm9sbCcsIHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb25cbiAgZWxzZVxuICAgIHRyZWVWaWV3LnNjcm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIgJ3Njcm9sbCcsIC0+XG4gICAgICB1cGRhdGVUcmVlVmlld0hlYWRlclBvc2l0aW9uKClcblxuICBzZXRUaW1lb3V0IC0+ICMgVE9ETyBzb21ldGhpbmcgb3RoZXIgdGhhbiBzZXRUaW1lb3V0P1xuICAgIHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb24oKVxuIl19
