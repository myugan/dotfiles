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

var _atom = require('atom');

var _etchComponent = require('./etch-component');

var _etchComponent2 = _interopRequireDefault(_etchComponent);

var _utils = require('./utils');

'use babel';
var EtchStoreComponent = (function (_EtchComponent) {
  _inherits(EtchStoreComponent, _EtchComponent);

  function EtchStoreComponent(props, children) {
    _classCallCheck(this, EtchStoreComponent);

    // all props except the "Component" will be passed through to the component
    props.passThrough = Object.keys(props).filter(function (key) {
      return key !== 'Component';
    });

    _get(Object.getPrototypeOf(EtchStoreComponent.prototype), 'constructor', this).call(this, props, children);
  }

  _createClass(EtchStoreComponent, [{
    key: 'init',
    value: function init() {
      this._subscriptions = new _atom.CompositeDisposable({ dispose: this.props.store.subscribe(this.handleStoreChange.bind(this)) });

      this.updateComponentProps();

      _get(Object.getPrototypeOf(EtchStoreComponent.prototype), 'init', this).call(this);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
      this._subscriptions = null;

      _get(Object.getPrototypeOf(EtchStoreComponent.prototype), 'dispose', this).call(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var props = {};
      this.props.passThrough.forEach(function (key) {
        props[key] = _this.props[key];
      });
      Object.assign(props, this.props.storeProps);
      return _etch2['default'].dom(this.Component, props);
    }
  }, {
    key: 'handleStoreChange',
    value: function handleStoreChange() {
      this.updateComponentProps();
    }
  }, {
    key: 'updateComponentProps',
    value: function updateComponentProps() {
      var storeProps = this.storeToProps(this.props.store.getState());
      if (this.props.storeProps && (0, _utils.shallowEqual)(this.props.storeProps, storeProps)) {
        return;
      }
      this.update({ storeProps: storeProps });
    }
  }], [{
    key: 'create',
    value: function create(Component, storeToProps) {
      return (function (_EtchStoreComponent) {
        _inherits(Container, _EtchStoreComponent);

        function Container() {
          _classCallCheck(this, Container);

          _get(Object.getPrototypeOf(Container.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Container, [{
          key: 'init',
          value: function init() {
            this.Component = Component;
            this.storeToProps = storeToProps;
            _get(Object.getPrototypeOf(Container.prototype), 'init', this).call(this);
          }
        }]);

        return Container;
      })(EtchStoreComponent);
    }
  }]);

  return EtchStoreComponent;
})(_etchComponent2['default']);

exports['default'] = EtchStoreComponent;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9ldGNoLXN0b3JlLWNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNhLE1BQU07OzZCQUVoQixrQkFBa0I7Ozs7cUJBQ2YsU0FBUzs7QUFQdEMsV0FBVyxDQUFBO0lBU1Usa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDekIsV0FETyxrQkFBa0IsQ0FDeEIsS0FBSyxFQUFFLFFBQVEsRUFBRTswQkFEWCxrQkFBa0I7OztBQUduQyxTQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRzthQUFLLEdBQUcsS0FBSyxXQUFXO0tBQUEsQ0FBQyxDQUFBOztBQUUzRSwrQkFMaUIsa0JBQWtCLDZDQUs3QixLQUFLLEVBQUUsUUFBUSxFQUFDO0dBQ3ZCOztlQU5rQixrQkFBa0I7O1dBUWhDLGdCQUFHO0FBQ04sVUFBSSxDQUFDLGNBQWMsR0FBRyw4QkFDcEIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUMzRSxDQUFBOztBQUVELFVBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBOztBQUUzQixpQ0FmaUIsa0JBQWtCLHNDQWV2QjtLQUNiOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDN0IsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7O0FBRTFCLGlDQXRCaUIsa0JBQWtCLHlDQXNCcEI7S0FDaEI7OztXQUVNLGtCQUFHOzs7QUFDUixVQUFNLEtBQUssR0FBRyxFQUFFLENBQUE7QUFDaEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQUUsYUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO09BQUUsQ0FBQyxDQUFBO0FBQ3pFLFlBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDM0MsYUFBTyxzQkFBQyxLQUFLLFNBQVMsRUFBSyxLQUFLLENBQUksQ0FBQTtLQUNyQzs7O1dBRWlCLDZCQUFHO0FBQ25CLFVBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0tBQzVCOzs7V0FFb0IsZ0NBQUc7QUFDdEIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0FBQ2pFLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUkseUJBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUU7QUFDNUUsZUFBTTtPQUNQO0FBQ0QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO0tBQ3hDOzs7V0FFYSxnQkFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFO0FBQ3RDO2tCQUFhLFNBQVM7O2lCQUFULFNBQVM7Z0NBQVQsU0FBUzs7cUNBQVQsU0FBUzs7O3FCQUFULFNBQVM7O2lCQUNmLGdCQUFHO0FBQ04sZ0JBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzFCLGdCQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTtBQUNoQyx1Q0FKUyxTQUFTLHNDQUlOO1dBQ2I7OztlQUxVLFNBQVM7U0FBUyxrQkFBa0IsRUFNaEQ7S0FDRjs7O1NBcERrQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9ldGNoLXN0b3JlLWNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBFdGNoQ29tcG9uZW50IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5pbXBvcnQgeyBzaGFsbG93RXF1YWwgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdGNoU3RvcmVDb21wb25lbnQgZXh0ZW5kcyBFdGNoQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzLCBjaGlsZHJlbikge1xuICAgIC8vIGFsbCBwcm9wcyBleGNlcHQgdGhlIFwiQ29tcG9uZW50XCIgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0byB0aGUgY29tcG9uZW50XG4gICAgcHJvcHMucGFzc1Rocm91Z2ggPSBPYmplY3Qua2V5cyhwcm9wcykuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gJ0NvbXBvbmVudCcpXG5cbiAgICBzdXBlcihwcm9wcywgY2hpbGRyZW4pXG4gIH1cblxuICBpbml0ICgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB7IGRpc3Bvc2U6IHRoaXMucHJvcHMuc3RvcmUuc3Vic2NyaWJlKHRoaXMuaGFuZGxlU3RvcmVDaGFuZ2UuYmluZCh0aGlzKSkgfVxuICAgIClcblxuICAgIHRoaXMudXBkYXRlQ29tcG9uZW50UHJvcHMoKVxuXG4gICAgc3VwZXIuaW5pdCgpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgICBzdXBlci5kaXNwb3NlKClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgcHJvcHMgPSB7fVxuICAgIHRoaXMucHJvcHMucGFzc1Rocm91Z2guZm9yRWFjaCgoa2V5KSA9PiB7IHByb3BzW2tleV0gPSB0aGlzLnByb3BzW2tleV0gfSlcbiAgICBPYmplY3QuYXNzaWduKHByb3BzLCB0aGlzLnByb3BzLnN0b3JlUHJvcHMpXG4gICAgcmV0dXJuIDx0aGlzLkNvbXBvbmVudCB7Li4ucHJvcHN9IC8+XG4gIH1cblxuICBoYW5kbGVTdG9yZUNoYW5nZSAoKSB7XG4gICAgdGhpcy51cGRhdGVDb21wb25lbnRQcm9wcygpXG4gIH1cblxuICB1cGRhdGVDb21wb25lbnRQcm9wcyAoKSB7XG4gICAgY29uc3Qgc3RvcmVQcm9wcyA9IHRoaXMuc3RvcmVUb1Byb3BzKHRoaXMucHJvcHMuc3RvcmUuZ2V0U3RhdGUoKSlcbiAgICBpZiAodGhpcy5wcm9wcy5zdG9yZVByb3BzICYmIHNoYWxsb3dFcXVhbCh0aGlzLnByb3BzLnN0b3JlUHJvcHMsIHN0b3JlUHJvcHMpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy51cGRhdGUoeyBzdG9yZVByb3BzOiBzdG9yZVByb3BzIH0pXG4gIH1cblxuICBzdGF0aWMgY3JlYXRlIChDb21wb25lbnQsIHN0b3JlVG9Qcm9wcykge1xuICAgIHJldHVybiBjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBFdGNoU3RvcmVDb21wb25lbnQge1xuICAgICAgaW5pdCAoKSB7XG4gICAgICAgIHRoaXMuQ29tcG9uZW50ID0gQ29tcG9uZW50XG4gICAgICAgIHRoaXMuc3RvcmVUb1Byb3BzID0gc3RvcmVUb1Byb3BzXG4gICAgICAgIHN1cGVyLmluaXQoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19