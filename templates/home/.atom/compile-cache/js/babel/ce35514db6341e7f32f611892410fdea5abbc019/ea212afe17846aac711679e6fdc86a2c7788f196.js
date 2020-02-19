var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _url = require('url');

var url = _interopRequireWildcard(_url);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _helpers = require('../helpers');

var _fixButton = require('./fix-button');

var _fixButton2 = _interopRequireDefault(_fixButton);

function findHref(el) {
  while (el && !el.classList.contains('linter-line')) {
    if (el instanceof HTMLAnchorElement) {
      return el.href;
    }
    el = el.parentElement;
  }
  return null;
}

var MessageElement = (function (_React$Component) {
  _inherits(MessageElement, _React$Component);

  function MessageElement() {
    _classCallCheck(this, MessageElement);

    _get(Object.getPrototypeOf(MessageElement.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      description: '',
      descriptionShow: false
    };

    this.openFile = function (ev) {
      if (!(ev.target instanceof HTMLElement)) {
        return;
      }
      var href = findHref(ev.target);
      if (!href) {
        return;
      }
      // parse the link. e.g. atom://linter?file=<path>&row=<number>&column=<number>

      var _url$parse = url.parse(href, true);

      var protocol = _url$parse.protocol;
      var hostname = _url$parse.hostname;
      var query = _url$parse.query;

      var file = query && query.file;
      if (protocol !== 'atom:' || hostname !== 'linter' || !file) {
        return;
      }
      var row = query && query.row ? parseInt(query.row, 10) : 0;
      var column = query && query.column ? parseInt(query.column, 10) : 0;
      (0, _helpers.openFile)(file, { row: row, column: column });
    };

    this.descriptionLoading = false;
  }

  _createClass(MessageElement, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onShouldUpdate(function () {
        _this.setState({});
      });
      this.props.delegate.onShouldExpand(function () {
        if (!_this.state.descriptionShow) {
          _this.toggleDescription();
        }
      });
      this.props.delegate.onShouldCollapse(function () {
        if (_this.state.descriptionShow) {
          _this.toggleDescription();
        }
      });
    }
  }, {
    key: 'onFixClick',
    value: function onFixClick() {
      var message = this.props.message;
      var textEditor = (0, _helpers.getActiveTextEditor)();
      if (message.version === 2 && message.solutions && message.solutions.length) {
        (0, _helpers.applySolution)(textEditor, (0, _helpers.sortSolutions)(message.solutions)[0]);
      }
    }
  }, {
    key: 'canBeFixed',
    value: function canBeFixed(message) {
      if (message.version === 2 && message.solutions && message.solutions.length) {
        return true;
      }
      return false;
    }
  }, {
    key: 'toggleDescription',
    value: function toggleDescription() {
      var _this2 = this;

      var result = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var newStatus = !this.state.descriptionShow;
      var description = this.state.description || this.props.message.description;

      if (!newStatus && !result) {
        this.setState({ descriptionShow: false });
        return;
      }
      if (typeof description === 'string' || result) {
        var descriptionToUse = (0, _marked2['default'])(result || description);
        this.setState({ descriptionShow: true, description: descriptionToUse });
      } else if (typeof description === 'function') {
        this.setState({ descriptionShow: true });
        if (this.descriptionLoading) {
          return;
        }
        this.descriptionLoading = true;
        new Promise(function (resolve) {
          resolve(description());
        }).then(function (response) {
          if (typeof response !== 'string') {
            throw new Error('Expected result to be string, got: ' + typeof response);
          }
          _this2.toggleDescription(response);
        })['catch'](function (error) {
          console.log('[Linter] Error getting descriptions', error);
          _this2.descriptionLoading = false;
          if (_this2.state.descriptionShow) {
            _this2.toggleDescription();
          }
        });
      } else {
        console.error('[Linter] Invalid description detected, expected string or function but got:', typeof description);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var message = _props.message;
      var delegate = _props.delegate;

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity, onClick: this.openFile },
        message.description && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return _this3.toggleDescription();
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-' + (this.state.descriptionShow ? 'chevron-down' : 'chevron-right') })
        ),
        _react2['default'].createElement(
          'linter-excerpt',
          null,
          this.canBeFixed(message) && _react2['default'].createElement(_fixButton2['default'], { onClick: function () {
              return _this3.onFixClick();
            } }),
          delegate.showProviderName ? message.linterName + ': ' : '',
          message.excerpt
        ),
        ' ',
        message.reference && message.reference.file && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.visitMessage)(message, true);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-alignment-aligned-to' })
        ),
        message.url && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.openExternally)(message);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-link' })
        ),
        this.state.descriptionShow && _react2['default'].createElement('div', {
          dangerouslySetInnerHTML: {
            __html: this.state.description || 'Loading...'
          },
          className: 'linter-line'
        })
      );
    }
  }]);

  return MessageElement;
})(_react2['default'].Component);

module.exports = MessageElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL21lc3NhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O21CQUVxQixLQUFLOztJQUFkLEdBQUc7O3FCQUNHLE9BQU87Ozs7c0JBQ04sUUFBUTs7Ozt1QkFFK0UsWUFBWTs7eUJBR2hHLGNBQWM7Ozs7QUFFcEMsU0FBUyxRQUFRLENBQUMsRUFBWSxFQUFXO0FBQ3ZDLFNBQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDbEQsUUFBSSxFQUFFLFlBQVksaUJBQWlCLEVBQUU7QUFDbkMsYUFBTyxFQUFFLENBQUMsSUFBSSxDQUFBO0tBQ2Y7QUFDRCxNQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQTtHQUN0QjtBQUNELFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0lBWUssY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNsQixLQUFLLEdBQVU7QUFDYixpQkFBVyxFQUFFLEVBQUU7QUFDZixxQkFBZSxFQUFFLEtBQUs7S0FDdkI7O1NBMEJELFFBQVEsR0FBRyxVQUFDLEVBQUUsRUFBWTtBQUN4QixVQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQ3ZDLGVBQU07T0FDUDtBQUNELFVBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLElBQUksRUFBRTtBQUNULGVBQU07T0FDUDs7O3VCQUVxQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7O1VBQW5ELFFBQVEsY0FBUixRQUFRO1VBQUUsUUFBUSxjQUFSLFFBQVE7VUFBRSxLQUFLLGNBQUwsS0FBSzs7QUFDakMsVUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUE7QUFDaEMsVUFBSSxRQUFRLEtBQUssT0FBTyxJQUFJLFFBQVEsS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDMUQsZUFBTTtPQUNQO0FBQ0QsVUFBTSxHQUFHLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzVELFVBQU0sTUFBTSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNyRSw2QkFBUyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFBO0tBQ2hDOztTQWdERCxrQkFBa0IsR0FBWSxLQUFLOzs7ZUEvRi9CLGNBQWM7O1dBTUQsNkJBQUc7OztBQUNsQixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBTTtBQUN2QyxjQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUNsQixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBTTtBQUN2QyxZQUFJLENBQUMsTUFBSyxLQUFLLENBQUMsZUFBZSxFQUFFO0FBQy9CLGdCQUFLLGlCQUFpQixFQUFFLENBQUE7U0FDekI7T0FDRixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFNO0FBQ3pDLFlBQUksTUFBSyxLQUFLLENBQUMsZUFBZSxFQUFFO0FBQzlCLGdCQUFLLGlCQUFpQixFQUFFLENBQUE7U0FDekI7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBRVMsc0JBQVM7QUFDakIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7QUFDbEMsVUFBTSxVQUFVLEdBQUcsbUNBQXFCLENBQUE7QUFDeEMsVUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFFLG9DQUFjLFVBQVUsRUFBRSw0QkFBYyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMvRDtLQUNGOzs7V0FxQlMsb0JBQUMsT0FBc0IsRUFBVztBQUMxQyxVQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDMUUsZUFBTyxJQUFJLENBQUE7T0FDWjtBQUNELGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztXQUVnQiw2QkFBeUI7OztVQUF4QixNQUFlLHlEQUFHLElBQUk7O0FBQ3RDLFVBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUE7QUFDN0MsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBOztBQUU1RSxVQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUN6QyxlQUFNO09BQ1A7QUFDRCxVQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsSUFBSSxNQUFNLEVBQUU7QUFDN0MsWUFBTSxnQkFBZ0IsR0FBRyx5QkFBTyxNQUFNLElBQUksV0FBVyxDQUFDLENBQUE7QUFDdEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtPQUN4RSxNQUFNLElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQzVDLFlBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN4QyxZQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUMzQixpQkFBTTtTQUNQO0FBQ0QsWUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQTtBQUM5QixZQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUM1QixpQkFBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7U0FDdkIsQ0FBQyxDQUNDLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNoQixjQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUNoQyxrQkFBTSxJQUFJLEtBQUsseUNBQXVDLE9BQU8sUUFBUSxDQUFHLENBQUE7V0FDekU7QUFDRCxpQkFBSyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNqQyxDQUFDLFNBQ0ksQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNkLGlCQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3pELGlCQUFLLGtCQUFrQixHQUFHLEtBQUssQ0FBQTtBQUMvQixjQUFJLE9BQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUM5QixtQkFBSyxpQkFBaUIsRUFBRSxDQUFBO1dBQ3pCO1NBQ0YsQ0FBQyxDQUFBO09BQ0wsTUFBTTtBQUNMLGVBQU8sQ0FBQyxLQUFLLENBQUMsNkVBQTZFLEVBQUUsT0FBTyxXQUFXLENBQUMsQ0FBQTtPQUNqSDtLQUNGOzs7V0FLSyxrQkFBRzs7O21CQUN1QixJQUFJLENBQUMsS0FBSztVQUFoQyxPQUFPLFVBQVAsT0FBTztVQUFFLFFBQVEsVUFBUixRQUFROztBQUV6QixhQUNFOztVQUFnQixTQUFPLE9BQU8sQ0FBQyxRQUFRLEFBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQztRQUM3RCxPQUFPLENBQUMsV0FBVyxJQUNsQjs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSxPQUFLLGlCQUFpQixFQUFFO2FBQUEsQUFBQztVQUNsRCwyQ0FBTSxTQUFTLDhCQUEyQixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxjQUFjLEdBQUcsZUFBZSxDQUFBLEFBQUcsR0FBRztTQUMzRyxBQUNMO1FBQ0Q7OztVQUNHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksMkRBQVcsT0FBTyxFQUFFO3FCQUFNLE9BQUssVUFBVSxFQUFFO2FBQUEsQUFBQyxHQUFHO1VBQzNFLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBTSxPQUFPLENBQUMsVUFBVSxVQUFPLEVBQUU7VUFDMUQsT0FBTyxDQUFDLE9BQU87U0FDRDtRQUFDLEdBQUc7UUFDcEIsT0FBTyxDQUFDLFNBQVMsSUFDaEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQ3BCOztZQUFHLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFFO3FCQUFNLDJCQUFhLE9BQU8sRUFBRSxJQUFJLENBQUM7YUFBQSxBQUFDO1VBQ3JELDJDQUFNLFNBQVMsRUFBQyw0Q0FBNEMsR0FBRztTQUM3RCxBQUNMO1FBQ0YsT0FBTyxDQUFDLEdBQUcsSUFDVjs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSw2QkFBZSxPQUFPLENBQUM7YUFBQSxBQUFDO1VBQ2pELDJDQUFNLFNBQVMsRUFBQyw0QkFBNEIsR0FBRztTQUM3QyxBQUNMO1FBQ0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQ3pCO0FBQ0UsaUNBQXVCLEVBQUU7QUFDdkIsa0JBQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxZQUFZO1dBQy9DLEFBQUM7QUFDRixtQkFBUyxFQUFDLGFBQWE7VUFDdkIsQUFDSDtPQUNjLENBQ2xCO0tBQ0Y7OztTQXJJRyxjQUFjO0dBQVMsbUJBQU0sU0FBUzs7QUF3STVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL21lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXG5cbmltcG9ydCB7IHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHksIG9wZW5GaWxlLCBhcHBseVNvbHV0aW9uLCBnZXRBY3RpdmVUZXh0RWRpdG9yLCBzb3J0U29sdXRpb25zIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIFRvb2x0aXBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlLCBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgRml4QnV0dG9uIGZyb20gJy4vZml4LWJ1dHRvbidcblxuZnVuY3Rpb24gZmluZEhyZWYoZWw6ID9FbGVtZW50KTogP3N0cmluZyB7XG4gIHdoaWxlIChlbCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW50ZXItbGluZScpKSB7XG4gICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbC5ocmVmXG4gICAgfVxuICAgIGVsID0gZWwucGFyZW50RWxlbWVudFxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbnR5cGUgUHJvcHMgPSB7XG4gIG1lc3NhZ2U6IE1lc3NhZ2UsXG4gIGRlbGVnYXRlOiBUb29sdGlwRGVsZWdhdGUsXG59XG5cbnR5cGUgU3RhdGUgPSB7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nLFxuICBkZXNjcmlwdGlvblNob3c/OiBib29sZWFuLFxufVxuXG5jbGFzcyBNZXNzYWdlRWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wcywgU3RhdGU+IHtcbiAgc3RhdGU6IFN0YXRlID0ge1xuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBkZXNjcmlwdGlvblNob3c6IGZhbHNlLFxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZFVwZGF0ZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZEV4cGFuZCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZENvbGxhcHNlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvdykge1xuICAgICAgICB0aGlzLnRvZ2dsZURlc2NyaXB0aW9uKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25GaXhDbGljaygpOiB2b2lkIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5wcm9wcy5tZXNzYWdlXG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIgJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICBhcHBseVNvbHV0aW9uKHRleHRFZGl0b3IsIHNvcnRTb2x1dGlvbnMobWVzc2FnZS5zb2x1dGlvbnMpWzBdKVxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWxlID0gKGV2OiBFdmVudCkgPT4ge1xuICAgIGlmICghKGV2LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGhyZWYgPSBmaW5kSHJlZihldi50YXJnZXQpXG4gICAgaWYgKCFocmVmKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gcGFyc2UgdGhlIGxpbmsuIGUuZy4gYXRvbTovL2xpbnRlcj9maWxlPTxwYXRoPiZyb3c9PG51bWJlcj4mY29sdW1uPTxudW1iZXI+XG4gICAgY29uc3QgeyBwcm90b2NvbCwgaG9zdG5hbWUsIHF1ZXJ5IH0gPSB1cmwucGFyc2UoaHJlZiwgdHJ1ZSlcbiAgICBjb25zdCBmaWxlID0gcXVlcnkgJiYgcXVlcnkuZmlsZVxuICAgIGlmIChwcm90b2NvbCAhPT0gJ2F0b206JyB8fCBob3N0bmFtZSAhPT0gJ2xpbnRlcicgfHwgIWZpbGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCByb3cgPSBxdWVyeSAmJiBxdWVyeS5yb3cgPyBwYXJzZUludChxdWVyeS5yb3csIDEwKSA6IDBcbiAgICBjb25zdCBjb2x1bW4gPSBxdWVyeSAmJiBxdWVyeS5jb2x1bW4gPyBwYXJzZUludChxdWVyeS5jb2x1bW4sIDEwKSA6IDBcbiAgICBvcGVuRmlsZShmaWxlLCB7IHJvdywgY29sdW1uIH0pXG4gIH1cblxuICBjYW5CZUZpeGVkKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UpOiBib29sZWFuIHtcbiAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAyICYmIG1lc3NhZ2Uuc29sdXRpb25zICYmIG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB0b2dnbGVEZXNjcmlwdGlvbihyZXN1bHQ6ID9zdHJpbmcgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhdHVzID0gIXRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLnN0YXRlLmRlc2NyaXB0aW9uIHx8IHRoaXMucHJvcHMubWVzc2FnZS5kZXNjcmlwdGlvblxuXG4gICAgaWYgKCFuZXdTdGF0dXMgJiYgIXJlc3VsdCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRlc2NyaXB0aW9uU2hvdzogZmFsc2UgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodHlwZW9mIGRlc2NyaXB0aW9uID09PSAnc3RyaW5nJyB8fCByZXN1bHQpIHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uVG9Vc2UgPSBtYXJrZWQocmVzdWx0IHx8IGRlc2NyaXB0aW9uKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRlc2NyaXB0aW9uU2hvdzogdHJ1ZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uVG9Vc2UgfSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXNjcmlwdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRlc2NyaXB0aW9uU2hvdzogdHJ1ZSB9KVxuICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25Mb2FkaW5nKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5kZXNjcmlwdGlvbkxvYWRpbmcgPSB0cnVlXG4gICAgICBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHJlc29sdmUoZGVzY3JpcHRpb24oKSlcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCByZXN1bHQgdG8gYmUgc3RyaW5nLCBnb3Q6ICR7dHlwZW9mIHJlc3BvbnNlfWApXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24ocmVzcG9uc2UpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tMaW50ZXJdIEVycm9yIGdldHRpbmcgZGVzY3JpcHRpb25zJywgZXJyb3IpXG4gICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkxvYWRpbmcgPSBmYWxzZVxuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvdykge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbigpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGludGVyXSBJbnZhbGlkIGRlc2NyaXB0aW9uIGRldGVjdGVkLCBleHBlY3RlZCBzdHJpbmcgb3IgZnVuY3Rpb24gYnV0IGdvdDonLCB0eXBlb2YgZGVzY3JpcHRpb24pXG4gICAgfVxuICB9XG5cbiAgcHJvcHM6IFByb3BzXG4gIGRlc2NyaXB0aW9uTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZSwgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcblxuICAgIHJldHVybiAoXG4gICAgICA8bGludGVyLW1lc3NhZ2UgY2xhc3M9e21lc3NhZ2Uuc2V2ZXJpdHl9IG9uQ2xpY2s9e3RoaXMub3BlbkZpbGV9PlxuICAgICAgICB7bWVzc2FnZS5kZXNjcmlwdGlvbiAmJiAoXG4gICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnRvZ2dsZURlc2NyaXB0aW9uKCl9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBsaW50ZXItaWNvbiBpY29uLSR7dGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cgPyAnY2hldnJvbi1kb3duJyA6ICdjaGV2cm9uLXJpZ2h0J31gfSAvPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKX1cbiAgICAgICAgPGxpbnRlci1leGNlcnB0PlxuICAgICAgICAgIHt0aGlzLmNhbkJlRml4ZWQobWVzc2FnZSkgJiYgPEZpeEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLm9uRml4Q2xpY2soKX0gLz59XG4gICAgICAgICAge2RlbGVnYXRlLnNob3dQcm92aWRlck5hbWUgPyBgJHttZXNzYWdlLmxpbnRlck5hbWV9OiBgIDogJyd9XG4gICAgICAgICAge21lc3NhZ2UuZXhjZXJwdH1cbiAgICAgICAgPC9saW50ZXItZXhjZXJwdD57JyAnfVxuICAgICAgICB7bWVzc2FnZS5yZWZlcmVuY2UgJiZcbiAgICAgICAgICBtZXNzYWdlLnJlZmVyZW5jZS5maWxlICYmIChcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gdmlzaXRNZXNzYWdlKG1lc3NhZ2UsIHRydWUpfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBsaW50ZXItaWNvbiBpY29uLWFsaWdubWVudC1hbGlnbmVkLXRvXCIgLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICApfVxuICAgICAgICB7bWVzc2FnZS51cmwgJiYgKFxuICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gb3BlbkV4dGVybmFsbHkobWVzc2FnZSl9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBsaW50ZXItaWNvbiBpY29uLWxpbmtcIiAvPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKX1cbiAgICAgICAge3RoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93ICYmIChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICAgICAgICBfX2h0bWw6IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24gfHwgJ0xvYWRpbmcuLi4nLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImxpbnRlci1saW5lXCJcbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9saW50ZXItbWVzc2FnZT5cbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlRWxlbWVudFxuIl19