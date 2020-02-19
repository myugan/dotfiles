Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-string-refs */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _etchComponent = require('./../etch-component');

var _emptyTabView = require('./empty-tab-view');

var _etchOcticon = require('etch-octicon');

var _etchOcticon2 = _interopRequireDefault(_etchOcticon);

var GoPlusPanel = (function (_EtchComponent) {
  _inherits(GoPlusPanel, _EtchComponent);

  function GoPlusPanel(props) {
    var _this = this;

    _classCallCheck(this, GoPlusPanel);

    _get(Object.getPrototypeOf(GoPlusPanel.prototype), 'constructor', this).call(this, props);
    this.ro = new _resizeObserverPolyfill2['default'](function (entries) {
      for (var entry of entries) {
        var width = entry.contentRect.width;

        var narrow = width < 600;
        if (_this.isNarrow !== narrow) {
          _this.isNarrow = narrow;
          _this.update();
        }
      }
    });
    this.ro.observe(this.element);
  }

  _createClass(GoPlusPanel, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var panelBodyStyle = {
        padding: '10px'
      };

      var panelClass = 'go-plus-panel';
      if (this.isNarrow) {
        panelClass += ' is-narrow';
      }

      var tabs = [];
      var ActiveView = undefined;
      var activeModel = undefined;
      var packageName = 'unknown';
      var activeRef = this.props.model.activeItem + 'view';
      this.props.model.viewProviders.forEach(function (_ref) {
        var view = _ref.view;
        var model = _ref.model;

        if (_this2.props.model.activeItem === model.key) {
          ActiveView = view;
          activeModel = model;
          if (model && model.isActive) {
            model.isActive(true);
          }
        } else {
          if (model && model.isActive) {
            model.isActive(false);
          }
        }
        if (tabs.find(function (_ref2) {
          var key = _ref2.key;
          return key === model.key;
        })) {
          return;
        }
        tabs.push(Object.assign({
          key: model.key,
          order: 999,
          icon: 'question',
          packageName: 'unknown',
          name: ''
        }, model.tab));
      });
      if (!ActiveView || !activeModel) {
        ActiveView = _emptyTabView.EmptyTabView;
      }

      if (activeModel && activeModel.tab && activeModel.tab.suppressPadding) {
        panelBodyStyle.padding = '0px';
      }

      tabs = tabs.map(function (item) {
        item.className = 'panel-nav-item';
        if (_this2.props.model.activeItem === item.key) {
          item.className = item.className + ' is-selected';
        }
        return item;
      }).sort(function (a, b) {
        return a.order - b.order || a.name.localeCompare(b.name);
      });

      return _etch2['default'].dom(
        'div',
        { ref: 'thepanel', className: panelClass },
        _etch2['default'].dom(
          'div',
          { className: 'panel-heading' },
          _etch2['default'].dom(
            'nav',
            { className: 'panel-group panel-nav' },
            tabs.map(function (item) {
              var tabKey = item.key + '-tab';
              return _etch2['default'].dom(
                'span',
                {
                  key: tabKey,
                  className: item.className,
                  on: { click: function click() {
                      return _this2.handleTabClick(item);
                    } }
                },
                _etch2['default'].dom(_etchOcticon2['default'], { name: item.icon }),
                _etch2['default'].dom(
                  'span',
                  { className: 'panel-nav-label' },
                  item.name
                )
              );
            })
          )
        ),
        _etch2['default'].dom(
          'div',
          {
            ref: 'panelbody',
            className: 'go-plus-panel-body panel-body native-key-bindings',
            tabIndex: '0',
            style: panelBodyStyle
          },
          _etch2['default'].dom(ActiveView, {
            ref: activeRef,
            model: activeModel,
            packageName: packageName
          })
        )
      );
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      var content = this.refs.content;
      if (!content) {
        return;
      }

      var scrollHeight = content.scrollHeight;
      if (scrollHeight && this.scrollHeight !== scrollHeight) {
        this.scrollHeight = scrollHeight;
        this.update();
      }
    }
  }, {
    key: 'handleTabClick',
    value: function handleTabClick(item) {
      if (item && item.key && item.key.length && this.props.model.activeItem !== item.key) {
        this.props.model.activeItem = item.key;
        this.update();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.destroy();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.ro.unobserve(this.element);
      this.ro = null;
      _get(Object.getPrototypeOf(GoPlusPanel.prototype), 'destroy', this).call(this, true);
    }
  }]);

  return GoPlusPanel;
})(_etchComponent.EtchComponent);

exports.GoPlusPanel = GoPlusPanel;
var PANEL_URI = 'atom://go-plus/panel';
exports.PANEL_URI = PANEL_URI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3BhbmVsL2dvLXBsdXMtcGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUtpQixNQUFNOzs7O3NDQUNJLDBCQUEwQjs7Ozs2QkFDdkIscUJBQXFCOzs0QkFDdEIsa0JBQWtCOzsyQkFDM0IsY0FBYzs7OztJQUlyQixXQUFXO1lBQVgsV0FBVzs7QUFNWCxXQU5BLFdBQVcsQ0FNVixLQUE4QixFQUFFOzs7MEJBTmpDLFdBQVc7O0FBT3BCLCtCQVBTLFdBQVcsNkNBT2QsS0FBSyxFQUFDO0FBQ1osUUFBSSxDQUFDLEVBQUUsR0FBRyx3Q0FBbUIsVUFBQSxPQUFPLEVBQUk7QUFDdEMsV0FBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7WUFDbkIsS0FBSyxHQUFLLEtBQUssQ0FBQyxXQUFXLENBQTNCLEtBQUs7O0FBQ2IsWUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQTtBQUMxQixZQUFJLE1BQUssUUFBUSxLQUFLLE1BQU0sRUFBRTtBQUM1QixnQkFBSyxRQUFRLEdBQUcsTUFBTSxDQUFBO0FBQ3RCLGdCQUFLLE1BQU0sRUFBRSxDQUFBO1NBQ2Q7T0FDRjtLQUNGLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUM5Qjs7ZUFuQlUsV0FBVzs7V0FxQmhCLGtCQUFHOzs7QUFDUCxVQUFNLGNBQWMsR0FBRztBQUNyQixlQUFPLEVBQUUsTUFBTTtPQUNoQixDQUFBOztBQUVELFVBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQTtBQUNoQyxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsa0JBQVUsSUFBSSxZQUFZLENBQUE7T0FDM0I7O0FBRUQsVUFBSSxJQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLFVBQUksVUFBVSxZQUFBLENBQUE7QUFDZCxVQUFJ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QyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDZDtLQUNGOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMvQixVQUFJLENBQUMsRUFBRSxHQUFJLElBQUksQUFBTSxDQUFBO0FBQ3JCLGlDQXJKUyxXQUFXLHlDQXFKTixJQUFJLEVBQUM7S0FDcEI7OztTQXRKVSxXQUFXOzs7O0FBeUpqQixJQUFNLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9wYW5lbC9nby1wbHVzLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8qKiBAanN4IGV0Y2guZG9tICovXG4vKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby11bmtub3duLXByb3BlcnR5ICovXG4vKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1zdHJpbmctcmVmcyAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IFJlc2l6ZU9ic2VydmVyIGZyb20gJ3Jlc2l6ZS1vYnNlcnZlci1wb2x5ZmlsbCdcbmltcG9ydCB7IEV0Y2hDb21wb25lbnQgfSBmcm9tICcuLy4uL2V0Y2gtY29tcG9uZW50J1xuaW1wb3J0IHsgRW1wdHlUYWJWaWV3IH0gZnJvbSAnLi9lbXB0eS10YWItdmlldydcbmltcG9ydCBPY3RpY29uIGZyb20gJ2V0Y2gtb2N0aWNvbidcbmltcG9ydCB0eXBlIHsgUGFuZWxNYW5hZ2VyIH0gZnJvbSAnLi9wYW5lbC1tYW5hZ2VyJ1xuaW1wb3J0IHR5cGUgeyBUYWIgfSBmcm9tICcuL3RhYidcblxuZXhwb3J0IGNsYXNzIEdvUGx1c1BhbmVsIGV4dGVuZHMgRXRjaENvbXBvbmVudCB7XG4gIHByb3BzOiB7IG1vZGVsOiBQYW5lbE1hbmFnZXIgfVxuICBybzogUmVzaXplT2JzZXJ2ZXJcbiAgaXNOYXJyb3c6IGJvb2xlYW5cbiAgc2Nyb2xsSGVpZ2h0OiBudW1iZXJcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogeyBtb2RlbDogUGFuZWxNYW5hZ2VyIH0pIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnJvID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGggfSA9IGVudHJ5LmNvbnRlbnRSZWN0XG4gICAgICAgIGNvbnN0IG5hcnJvdyA9IHdpZHRoIDwgNjAwXG4gICAgICAgIGlmICh0aGlzLmlzTmFycm93ICE9PSBuYXJyb3cpIHtcbiAgICAgICAgICB0aGlzLmlzTmFycm93ID0gbmFycm93XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnJvLm9ic2VydmUodGhpcy5lbGVtZW50KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHBhbmVsQm9keVN0eWxlID0ge1xuICAgICAgcGFkZGluZzogJzEwcHgnXG4gICAgfVxuXG4gICAgbGV0IHBhbmVsQ2xhc3MgPSAnZ28tcGx1cy1wYW5lbCdcbiAgICBpZiAodGhpcy5pc05hcnJvdykge1xuICAgICAgcGFuZWxDbGFzcyArPSAnIGlzLW5hcnJvdydcbiAgICB9XG5cbiAgICBsZXQgdGFiczogVGFiW10gPSBbXVxuICAgIGxldCBBY3RpdmVWaWV3XG4gICAgbGV0IGFjdGl2ZU1vZGVsXG4gICAgbGV0IHBhY2thZ2VOYW1lID0gJ3Vua25vd24nXG4gICAgY29uc3QgYWN0aXZlUmVmID0gdGhpcy5wcm9wcy5tb2RlbC5hY3RpdmVJdGVtICsgJ3ZpZXcnXG4gICAgdGhpcy5wcm9wcy5tb2RlbC52aWV3UHJvdmlkZXJzLmZvckVhY2goKHsgdmlldywgbW9kZWwgfSkgPT4ge1xuICAgICAgaWYgKHRoaXMucHJvcHMubW9kZWwuYWN0aXZlSXRlbSA9PT0gbW9kZWwua2V5KSB7XG4gICAgICAgIEFjdGl2ZVZpZXcgPSB2aWV3XG4gICAgICAgIGFjdGl2ZU1vZGVsID0gbW9kZWxcbiAgICAgICAgaWYgKG1vZGVsICYmIG1vZGVsLmlzQWN0aXZlKSB7XG4gICAgICAgICAgbW9kZWwuaXNBY3RpdmUodHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1vZGVsICYmIG1vZGVsLmlzQWN0aXZlKSB7XG4gICAgICAgICAgbW9kZWwuaXNBY3RpdmUoZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0YWJzLmZpbmQoKHsga2V5IH0pID0+IGtleSA9PT0gbW9kZWwua2V5KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRhYnMucHVzaChcbiAgICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAoe1xuICAgICAgICAgICAga2V5OiBtb2RlbC5rZXksXG4gICAgICAgICAgICBvcmRlcjogOTk5LFxuICAgICAgICAgICAgaWNvbjogJ3F1ZXN0aW9uJyxcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lOiAndW5rbm93bicsXG4gICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgIH06IFRhYiksXG4gICAgICAgICAgbW9kZWwudGFiXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9KVxuICAgIGlmICghQWN0aXZlVmlldyB8fCAhYWN0aXZlTW9kZWwpIHtcbiAgICAgIEFjdGl2ZVZpZXcgPSBFbXB0eVRhYlZpZXdcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZlTW9kZWwgJiYgYWN0aXZlTW9kZWwudGFiICYmIGFjdGl2ZU1vZGVsLnRhYi5zdXBwcmVzc1BhZGRpbmcpIHtcbiAgICAgIHBhbmVsQm9keVN0eWxlLnBhZGRpbmcgPSAnMHB4J1xuICAgIH1cblxuICAgIHRhYnMgPSB0YWJzXG4gICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9ICdwYW5lbC1uYXYtaXRlbSdcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubW9kZWwuYWN0aXZlSXRlbSA9PT0gaXRlbS5rZXkpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGl0ZW0uY2xhc3NOYW1lICsgJyBpcy1zZWxlY3RlZCdcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgfSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm9yZGVyIC0gYi5vcmRlciB8fCBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcmVmPVwidGhlcGFuZWxcIiBjbGFzc05hbWU9e3BhbmVsQ2xhc3N9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cInBhbmVsLWdyb3VwIHBhbmVsLW5hdlwiPlxuICAgICAgICAgICAge3RhYnMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICBjb25zdCB0YWJLZXkgPSBpdGVtLmtleSArICctdGFiJ1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICBrZXk9e3RhYktleX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbS5jbGFzc05hbWV9XG4gICAgICAgICAgICAgICAgICBvbj17eyBjbGljazogKCkgPT4gdGhpcy5oYW5kbGVUYWJDbGljayhpdGVtKSB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxPY3RpY29uIG5hbWU9e2l0ZW0uaWNvbn0gLz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBhbmVsLW5hdi1sYWJlbFwiPntpdGVtLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPVwicGFuZWxib2R5XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJnby1wbHVzLXBhbmVsLWJvZHkgcGFuZWwtYm9keSBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgICB0YWJJbmRleD1cIjBcIlxuICAgICAgICAgIHN0eWxlPXtwYW5lbEJvZHlTdHlsZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxBY3RpdmVWaWV3XG4gICAgICAgICAgICByZWY9e2FjdGl2ZVJlZn1cbiAgICAgICAgICAgIG1vZGVsPXthY3RpdmVNb2RlbH1cbiAgICAgICAgICAgIHBhY2thZ2VOYW1lPXtwYWNrYWdlTmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlYWRBZnRlclVwZGF0ZSgpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5yZWZzLmNvbnRlbnRcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0XG4gICAgaWYgKHNjcm9sbEhlaWdodCAmJiB0aGlzLnNjcm9sbEhlaWdodCAhPT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHNjcm9sbEhlaWdodFxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVRhYkNsaWNrKGl0ZW06IFRhYikge1xuICAgIGlmIChcbiAgICAgIGl0ZW0gJiZcbiAgICAgIGl0ZW0ua2V5ICYmXG4gICAgICBpdGVtLmtleS5sZW5ndGggJiZcbiAgICAgIHRoaXMucHJvcHMubW9kZWwuYWN0aXZlSXRlbSAhPT0gaXRlbS5rZXlcbiAgICApIHtcbiAgICAgIHRoaXMucHJvcHMubW9kZWwuYWN0aXZlSXRlbSA9IGl0ZW0ua2V5XG4gICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnJvLnVub2JzZXJ2ZSh0aGlzLmVsZW1lbnQpXG4gICAgdGhpcy5ybyA9IChudWxsOiBhbnkpXG4gICAgc3VwZXIuZGVzdHJveSh0cnVlKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBQQU5FTF9VUkkgPSAnYXRvbTovL2dvLXBsdXMvcGFuZWwnXG4iXX0=