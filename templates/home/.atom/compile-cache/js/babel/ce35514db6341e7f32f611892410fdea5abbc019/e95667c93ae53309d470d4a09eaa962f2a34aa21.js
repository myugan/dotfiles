Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchComponent = require('./../etch-component');

var GodocView = (function (_EtchComponent) {
  _inherits(GodocView, _EtchComponent);

  function GodocView(props) {
    _classCallCheck(this, GodocView);

    _get(Object.getPrototypeOf(GodocView.prototype), 'constructor', this).call(this, props);
    if (props.model) {
      props.model.view = this;
    }
    this.props = props;
  }

  _createClass(GodocView, [{
    key: 'render',
    value: function render() {
      var _props$model = this.props.model;
      var msg = _props$model.msg;
      var doc = _props$model.doc;
      var keymap = _props$model.keymap;

      if (msg) {
        return _etch2['default'].dom(
          'div',
          null,
          _etch2['default'].dom(
            'span',
            { className: 'godoc-panel', tabIndex: '0' },
            msg
          )
        );
      }

      if (!doc || !doc.decl) {
        return _etch2['default'].dom(
          'div',
          null,
          _etch2['default'].dom(
            'span',
            { className: 'godoc-panel', tabIndex: '0' },
            'Place the cursor on a symbol and run the "golang:showdoc" command (bound to ' + keymap + ')...'
          )
        );
      }
      var decl = undefined;
      if (doc.gddo) {
        decl = _etch2['default'].dom(
          'a',
          { href: doc.gddo },
          doc.decl
        );
      } else {
        decl = _etch2['default'].dom(
          'span',
          null,
          doc.decl
        );
      }

      return _etch2['default'].dom(
        'div',
        { tabIndex: '0', className: 'godoc-panel' },
        doc['import'] && doc['import'].length && _etch2['default'].dom(
          'div',
          null,
          _etch2['default'].dom(
            'span',
            null,
            'import "' + doc['import'] + '"'
          ),
          _etch2['default'].dom('br', null),
          _etch2['default'].dom('br', null)
        ),
        decl,
        _etch2['default'].dom('br', null),
        _etch2['default'].dom('br', null),
        _etch2['default'].dom(
          'span',
          null,
          doc.doc
        )
      );
    }
  }]);

  return GodocView;
})(_etchComponent.EtchComponent);

exports.GodocView = GodocView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2RvYy9nb2RvYy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ08scUJBQXFCOztJQUl0QyxTQUFTO1lBQVQsU0FBUzs7QUFHVCxXQUhBLFNBQVMsQ0FHUixLQUE0QixFQUFFOzBCQUgvQixTQUFTOztBQUlsQiwrQkFKUyxTQUFTLDZDQUlaLEtBQUssRUFBQztBQUNaLFFBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNmLFdBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtLQUN4QjtBQUNELFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0dBQ25COztlQVRVLFNBQVM7O1dBV2Qsa0JBQUc7eUJBQ3NCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztVQUFyQyxHQUFHLGdCQUFILEdBQUc7VUFBRSxHQUFHLGdCQUFILEdBQUc7VUFBRSxNQUFNLGdCQUFOLE1BQU07O0FBRXhCLFVBQUksR0FBRyxFQUFFO0FBQ1AsZUFDRTs7O1VBQ0U7O2NBQU0sU0FBUyxFQUFDLGFBQWEsRUFBQyxRQUFRLEVBQUMsR0FBRztZQUN2QyxHQUFHO1dBQ0M7U0FDSCxDQUNQO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDckIsZUFDRTs7O1VBQ0U7O2NBQU0sU0FBUyxFQUFDLGFBQWEsRUFBQyxRQUFRLEVBQUMsR0FBRzs2RkFDd0MsTUFBTTtXQUNqRjtTQUNILENBQ1A7T0FDRjtBQUNELFVBQUksSUFBSSxZQUFBLENBQUE7QUFDUixVQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDWixZQUFJLEdBQUc7O1lBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEFBQUM7VUFBRSxHQUFHLENBQUMsSUFBSTtTQUFLLENBQUE7T0FDekMsTUFBTTtBQUNMLFlBQUksR0FBRzs7O1VBQU8sR0FBRyxDQUFDLElBQUk7U0FBUSxDQUFBO09BQy9COztBQUVELGFBQ0U7O1VBQUssUUFBUSxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsYUFBYTtRQUN0QyxHQUFHLFVBQU8sSUFDVCxHQUFHLFVBQU8sQ0FBQyxNQUFNLElBQ2Y7OztVQUNFOzs7eUJBQWtCLEdBQUcsVUFBTztXQUFXO1VBQ3ZDLGlDQUFNO1VBQ04saUNBQU07U0FDRixBQUNQO1FBQ0YsSUFBSTtRQUNMLGlDQUFNO1FBQ04saUNBQU07UUFDTjs7O1VBQU8sR0FBRyxDQUFDLEdBQUc7U0FBUTtPQUNsQixDQUNQO0tBQ0Y7OztTQXhEVSxTQUFTIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2RvYy9nb2RvYy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBFdGNoQ29tcG9uZW50IH0gZnJvbSAnLi8uLi9ldGNoLWNvbXBvbmVudCdcblxuaW1wb3J0IHR5cGUgeyBHb2RvY1BhbmVsIH0gZnJvbSAnLi9nb2RvYy1wYW5lbCdcblxuZXhwb3J0IGNsYXNzIEdvZG9jVmlldyBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICBwcm9wczogeyBtb2RlbDogR29kb2NQYW5lbCB9XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IHsgbW9kZWw6IEdvZG9jUGFuZWwgfSkge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIGlmIChwcm9wcy5tb2RlbCkge1xuICAgICAgcHJvcHMubW9kZWwudmlldyA9IHRoaXNcbiAgICB9XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBtc2csIGRvYywga2V5bWFwIH0gPSB0aGlzLnByb3BzLm1vZGVsXG5cbiAgICBpZiAobXNnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdvZG9jLXBhbmVsXCIgdGFiSW5kZXg9XCIwXCI+XG4gICAgICAgICAgICB7bXNnfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCFkb2MgfHwgIWRvYy5kZWNsKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdvZG9jLXBhbmVsXCIgdGFiSW5kZXg9XCIwXCI+XG4gICAgICAgICAgICB7YFBsYWNlIHRoZSBjdXJzb3Igb24gYSBzeW1ib2wgYW5kIHJ1biB0aGUgXCJnb2xhbmc6c2hvd2RvY1wiIGNvbW1hbmQgKGJvdW5kIHRvICR7a2V5bWFwfSkuLi5gfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICAgIGxldCBkZWNsXG4gICAgaWYgKGRvYy5nZGRvKSB7XG4gICAgICBkZWNsID0gPGEgaHJlZj17ZG9jLmdkZG99Pntkb2MuZGVjbH08L2E+XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlY2wgPSA8c3Bhbj57ZG9jLmRlY2x9PC9zcGFuPlxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHRhYkluZGV4PVwiMFwiIGNsYXNzTmFtZT1cImdvZG9jLXBhbmVsXCI+XG4gICAgICAgIHtkb2MuaW1wb3J0ICYmXG4gICAgICAgICAgZG9jLmltcG9ydC5sZW5ndGggJiYgKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHNwYW4+e2BpbXBvcnQgXCIke2RvYy5pbXBvcnR9XCJgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAge2RlY2x9XG4gICAgICAgIDxiciAvPlxuICAgICAgICA8YnIgLz5cbiAgICAgICAgPHNwYW4+e2RvYy5kb2N9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=