(function() {
  var LoadingView, TextEditorView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, TextEditorView = ref.TextEditorView;

  module.exports = LoadingView = (function(superClass) {
    extend(LoadingView, superClass);

    function LoadingView() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      return LoadingView.__super__.constructor.apply(this, arguments);
    }

    LoadingView.content = function() {
      return this.div({
        "class": 'atom-beautify message-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'hide'
                    }, 'Hide');
                  });
                  return _this.span({
                    "class": 'text-primary',
                    outlet: 'title'
                  }, 'Atom Beautify');
                });
                return _this.div({
                  "class": "panel-body padded select-list text-center",
                  outlet: 'body'
                }, function() {
                  return _this.div(function() {
                    _this.span({
                      "class": 'text-center loading loading-spinner-large inline-block'
                    });
                    return _this.div({
                      "class": ''
                    }, 'Beautification in progress.');
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    LoadingView.prototype.hide = function(event, element) {
      return this.detach();
    };

    LoadingView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspace.addTopPanel({
          item: this
        });
      }
    };

    return LoadingView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvdmlld3MvbG9hZGluZy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQTs7OztFQUFBLE1BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLGVBQUQsRUFBTzs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7Ozs7SUFDSixXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUNFO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyw2QkFBUDtPQURGLEVBQ3dDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDcEMsS0FBQyxDQUFBLEdBQUQsQ0FDRTtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sa0JBQVA7V0FERixFQUM2QixTQUFBO21CQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx5QkFBUDthQUFMLEVBQXVDLFNBQUE7cUJBQ3JDLEtBQUMsQ0FBQSxHQUFELENBQUs7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxhQUFQO2VBQUwsRUFBMkIsU0FBQTtnQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsU0FBQTtrQkFDM0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztvQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO21CQUFMLEVBQXNDLFNBQUE7MkJBQ3BDLEtBQUMsQ0FBQSxNQUFELENBQ0U7c0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxLQUFQO3NCQUNBLEtBQUEsRUFBTyxNQURQO3FCQURGLEVBR0UsTUFIRjtrQkFEb0MsQ0FBdEM7eUJBS0EsS0FBQyxDQUFBLElBQUQsQ0FDRTtvQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7b0JBQ0EsTUFBQSxFQUFRLE9BRFI7bUJBREYsRUFHRSxlQUhGO2dCQU4yQixDQUE3Qjt1QkFVQSxLQUFDLENBQUEsR0FBRCxDQUNFO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sMkNBQVA7a0JBQ0EsTUFBQSxFQUFRLE1BRFI7aUJBREYsRUFHRSxTQUFBO3lCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtvQkFDSCxLQUFDLENBQUEsSUFBRCxDQUNFO3NCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0RBQVA7cUJBREY7MkJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FDRTtzQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLEVBQVA7cUJBREYsRUFFRSw2QkFGRjtrQkFIRyxDQUFMO2dCQURGLENBSEY7Y0FYeUIsQ0FBM0I7WUFEcUMsQ0FBdkM7VUFEeUIsQ0FEN0I7UUFEb0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHhDO0lBRFE7OzBCQTRCVixJQUFBLEdBQU0sU0FBQyxLQUFELEVBQVEsT0FBUjthQUNKLElBQUMsQ0FBQSxNQUFELENBQUE7SUFESTs7MEJBR04sSUFBQSxHQUFNLFNBQUE7TUFDSixJQUFHLENBQUksSUFBQyxDQUFDLFNBQUYsQ0FBQSxDQUFQO2VBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBM0IsRUFERjs7SUFESTs7OztLQWhDa0I7QUFIMUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7VmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExvYWRpbmdWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2XG4gICAgICBjbGFzczogJ2F0b20tYmVhdXRpZnkgbWVzc2FnZS1wYW5lbCcsID0+XG4gICAgICAgIEBkaXZcbiAgICAgICAgICBjbGFzczogJ292ZXJsYXkgZnJvbS10b3AnLCA9PlxuICAgICAgICAgICAgQGRpdiBjbGFzczogXCJ0b29sLXBhbmVsIHBhbmVsLWJvdHRvbVwiLCA9PlxuICAgICAgICAgICAgICBAZGl2IGNsYXNzOiBcImluc2V0LXBhbmVsXCIsID0+XG4gICAgICAgICAgICAgICAgQGRpdiBjbGFzczogXCJwYW5lbC1oZWFkaW5nXCIsID0+XG4gICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLXRvb2xiYXIgcHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgICAgICAgICAgIEBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2J0bidcbiAgICAgICAgICAgICAgICAgICAgICBjbGljazogJ2hpZGUnXG4gICAgICAgICAgICAgICAgICAgICAgJ0hpZGUnXG4gICAgICAgICAgICAgICAgICBAc3BhblxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3RleHQtcHJpbWFyeSdcbiAgICAgICAgICAgICAgICAgICAgb3V0bGV0OiAndGl0bGUnXG4gICAgICAgICAgICAgICAgICAgICdBdG9tIEJlYXV0aWZ5J1xuICAgICAgICAgICAgICAgIEBkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzOiBcInBhbmVsLWJvZHkgcGFkZGVkIHNlbGVjdC1saXN0IHRleHQtY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgIG91dGxldDogJ2JvZHknXG4gICAgICAgICAgICAgICAgICA9PlxuICAgICAgICAgICAgICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgICAgICAgICAgICAgQHNwYW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXIgbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItbGFyZ2UgaW5saW5lLWJsb2NrJ1xuICAgICAgICAgICAgICAgICAgICAgIEBkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0JlYXV0aWZpY2F0aW9uIGluIHByb2dyZXNzLidcblxuICBoaWRlOiAoZXZlbnQsIGVsZW1lbnQpID0+XG4gICAgQGRldGFjaCgpXG5cbiAgc2hvdzogPT5cbiAgICBpZiBub3QgQC5oYXNQYXJlbnQoKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuYWRkVG9wUGFuZWwoaXRlbTogQClcbiJdfQ==
