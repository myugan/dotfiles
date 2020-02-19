Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-string-refs */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

// eslint-disable-line no-unused-vars

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _etchComponent = require('./etch-component');

var _ansi = require('./ansi');

var _utils = require('./utils');

var locationRegex = /([\w-/.\\:]*.go:\d+(:\d+)?)/g;

var OutputPanel = (function (_EtchComponent) {
  _inherits(OutputPanel, _EtchComponent);

  function OutputPanel() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, OutputPanel);

    _get(Object.getPrototypeOf(OutputPanel.prototype), 'constructor', this).call(this, props);
    if (this.props.model) {
      this.props.model.view = this;
    }
  }

  _createClass(OutputPanel, [{
    key: 'makeLink',
    value: function makeLink(text) {
      var _this = this;

      var elements = [];
      var lastIndex = 0;
      var match = undefined;

      do {
        match = locationRegex.exec(text);
        if (match && match.hasOwnProperty('index')) {
          (function () {
            // take raw text up to this match
            elements.push(_etch2['default'].dom(
              'span',
              null,
              text.slice(lastIndex, match.index)
            ));

            var linkText = match[0];
            // convert the match to a link
            elements.push(_etch2['default'].dom(
              'a',
              {
                onclick: function () {
                  return _this.linkClicked(linkText, _this.props.model.props.dir);
                }
              },
              linkText
            ));
            lastIndex = match.index + match[0].length;
          })();
        }
      } while (match);

      // raw text from last match to the end
      if (lastIndex < text.length) {
        elements.push(_etch2['default'].dom(
          'span',
          null,
          text.slice(lastIndex)
        ));
      }

      return elements;
    }
  }, {
    key: 'render',
    value: function render() {
      var style = '';
      var output = '';
      if (this.props.model && this.props.model.props && this.props.model.props.output) {
        output = this.props.model.props.output;
      }

      return _etch2['default'].dom(
        'div',
        {
          ref: 'content',
          className: 'go-plus-output-panel',
          scrollTop: this.scrollHeight,
          style: style
        },
        _etch2['default'].dom(_ansi.AnsiStyle, { text: output, mapText: this.makeLink.bind(this) })
      );
    }
  }, {
    key: 'linkClicked',
    value: function linkClicked(text, dir) {
      var _parseGoPosition = (0, _utils.parseGoPosition)(text);

      var file = _parseGoPosition.file;
      var _parseGoPosition$line = _parseGoPosition.line;
      var line = _parseGoPosition$line === undefined ? 1 : _parseGoPosition$line;
      var _parseGoPosition$column = _parseGoPosition.column;
      var column = _parseGoPosition$column === undefined ? 0 : _parseGoPosition$column;

      var filepath = undefined;
      if (_path2['default'].isAbsolute(file)) {
        filepath = file;
      } else {
        var base = dir || (0, _utils.projectPath)();
        if (!base) {
          return;
        }
        filepath = _path2['default'].join(base, file);
      }

      var col = column && column > 0 ? column - 1 : 0;
      (0, _utils.openFile)(filepath, _atom.Point.fromObject([line - 1, col]))['catch'](function (err) {
        console.log('could not access ' + file, err); // eslint-disable-line no-console
      });
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
        content.scrollTop = this.scrollHeight;
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
      _get(Object.getPrototypeOf(OutputPanel.prototype), 'destroy', this).call(this);
      this.props = {};
    }
  }]);

  return OutputPanel;
})(_etchComponent.EtchComponent);

exports.OutputPanel = OutputPanel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL291dHB1dC1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBS3NCLE1BQU07O29CQUNYLE1BQU07Ozs7OztvQkFDTixNQUFNOzs7OzZCQUNPLGtCQUFrQjs7b0JBQ3RCLFFBQVE7O3FCQUNxQixTQUFTOztBQUVoRSxJQUFNLGFBQWEsR0FBRyw4QkFBOEIsQ0FBQTs7SUFFdkMsV0FBVztZQUFYLFdBQVc7O0FBR1gsV0FIQSxXQUFXLEdBR1U7UUFBcEIsS0FBYSx5REFBRyxFQUFFOzswQkFIbkIsV0FBVzs7QUFJcEIsK0JBSlMsV0FBVyw2Q0FJZCxLQUFLLEVBQUM7QUFDWixRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7S0FDN0I7R0FDRjs7ZUFSVSxXQUFXOztXQVVkLGtCQUFDLElBQVksRUFBRTs7O0FBQ3JCLFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsVUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFHO0FBQ0QsYUFBSyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDaEMsWUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTs7O0FBRTFDLG9CQUFRLENBQUMsSUFBSSxDQUFDOzs7Y0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQVEsQ0FBQyxDQUFBOztBQUVoRSxnQkFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV6QixvQkFBUSxDQUFDLElBQUksQ0FDWDs7O0FBQ0UsdUJBQU8sRUFBRTt5QkFDUCxN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QUFDLFlBQVksQ0FBQTtBQUNyQyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDZDtLQUNGOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7V0FFTSxtQkFBRztBQUNSLGlDQTFHUyxXQUFXLHlDQTBHTDtBQUNmLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0tBQ2hCOzs7U0E1R1UsV0FBVyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9vdXRwdXQtcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cbi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXVua25vd24tcHJvcGVydHkgKi9cbi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXN0cmluZy1yZWZzICovXG5cbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnYXRvbSdcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBFdGNoQ29tcG9uZW50IH0gZnJvbSAnLi9ldGNoLWNvbXBvbmVudCdcbmltcG9ydCB7IEFuc2lTdHlsZSB9IGZyb20gJy4vYW5zaSdcbmltcG9ydCB7IG9wZW5GaWxlLCBwYXJzZUdvUG9zaXRpb24sIHByb2plY3RQYXRoIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgbG9jYXRpb25SZWdleCA9IC8oW1xcdy0vLlxcXFw6XSouZ286XFxkKyg6XFxkKyk/KS9nXG5cbmV4cG9ydCBjbGFzcyBPdXRwdXRQYW5lbCBleHRlbmRzIEV0Y2hDb21wb25lbnQge1xuICBzY3JvbGxIZWlnaHQ6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBPYmplY3QgPSB7fSkge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIGlmICh0aGlzLnByb3BzLm1vZGVsKSB7XG4gICAgICB0aGlzLnByb3BzLm1vZGVsLnZpZXcgPSB0aGlzXG4gICAgfVxuICB9XG5cbiAgbWFrZUxpbmsodGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBbXVxuICAgIGxldCBsYXN0SW5kZXggPSAwXG4gICAgbGV0IG1hdGNoXG5cbiAgICBkbyB7XG4gICAgICBtYXRjaCA9IGxvY2F0aW9uUmVnZXguZXhlYyh0ZXh0KVxuICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmhhc093blByb3BlcnR5KCdpbmRleCcpKSB7XG4gICAgICAgIC8vIHRha2UgcmF3IHRleHQgdXAgdG8gdGhpcyBtYXRjaFxuICAgICAgICBlbGVtZW50cy5wdXNoKDxzcGFuPnt0ZXh0LnNsaWNlKGxhc3RJbmRleCwgbWF0Y2guaW5kZXgpfTwvc3Bhbj4pXG5cbiAgICAgICAgY29uc3QgbGlua1RleHQgPSBtYXRjaFswXVxuICAgICAgICAvLyBjb252ZXJ0IHRoZSBtYXRjaCB0byBhIGxpbmtcbiAgICAgICAgZWxlbWVudHMucHVzaChcbiAgICAgICAgICA8YVxuICAgICAgICAgICAgb25jbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5saW5rQ2xpY2tlZChsaW5rVGV4dCwgdGhpcy5wcm9wcy5tb2RlbC5wcm9wcy5kaXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2xpbmtUZXh0fVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKVxuICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aFxuICAgICAgfVxuICAgIH0gd2hpbGUgKG1hdGNoKVxuXG4gICAgLy8gcmF3IHRleHQgZnJvbSBsYXN0IG1hdGNoIHRvIHRoZSBlbmRcbiAgICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgIGVsZW1lbnRzLnB1c2goPHNwYW4+e3RleHQuc2xpY2UobGFzdEluZGV4KX08L3NwYW4+KVxuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50c1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBzdHlsZSA9ICcnXG4gICAgbGV0IG91dHB1dCA9ICcnXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5tb2RlbCAmJlxuICAgICAgdGhpcy5wcm9wcy5tb2RlbC5wcm9wcyAmJlxuICAgICAgdGhpcy5wcm9wcy5tb2RlbC5wcm9wcy5vdXRwdXRcbiAgICApIHtcbiAgICAgIG91dHB1dCA9IHRoaXMucHJvcHMubW9kZWwucHJvcHMub3V0cHV0XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPVwiY29udGVudFwiXG4gICAgICAgIGNsYXNzTmFtZT1cImdvLXBsdXMtb3V0cHV0LXBhbmVsXCJcbiAgICAgICAgc2Nyb2xsVG9wPXt0aGlzLnNjcm9sbEhlaWdodH1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgPlxuICAgICAgICA8QW5zaVN0eWxlIHRleHQ9e291dHB1dH0gbWFwVGV4dD17dGhpcy5tYWtlTGluay5iaW5kKHRoaXMpfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgbGlua0NsaWNrZWQodGV4dDogc3RyaW5nLCBkaXI6IHN0cmluZykge1xuICAgIGNvbnN0IHsgZmlsZSwgbGluZSA9IDEsIGNvbHVtbiA9IDAgfSA9IHBhcnNlR29Qb3NpdGlvbih0ZXh0KVxuXG4gICAgbGV0IGZpbGVwYXRoXG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShmaWxlKSkge1xuICAgICAgZmlsZXBhdGggPSBmaWxlXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJhc2UgPSBkaXIgfHwgcHJvamVjdFBhdGgoKVxuICAgICAgaWYgKCFiYXNlKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYmFzZSwgZmlsZSlcbiAgICB9XG5cbiAgICBjb25zdCBjb2wgPSBjb2x1bW4gJiYgY29sdW1uID4gMCA/IGNvbHVtbiAtIDEgOiAwXG4gICAgb3BlbkZpbGUoZmlsZXBhdGgsIFBvaW50LmZyb21PYmplY3QoW2xpbmUgLSAxLCBjb2xdKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdjb3VsZCBub3QgYWNjZXNzICcgKyBmaWxlLCBlcnIpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH0pXG4gIH1cblxuICByZWFkQWZ0ZXJVcGRhdGUoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMucmVmcy5jb250ZW50XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSBjb250ZW50LnNjcm9sbEhlaWdodFxuICAgIGlmIChzY3JvbGxIZWlnaHQgJiYgdGhpcy5zY3JvbGxIZWlnaHQgIT09IHNjcm9sbEhlaWdodCkge1xuICAgICAgdGhpcy5zY3JvbGxIZWlnaHQgPSBzY3JvbGxIZWlnaHRcbiAgICAgIGNvbnRlbnQuc2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxIZWlnaHRcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZGVzdHJveSgpXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHN1cGVyLmRlc3Ryb3koKVxuICAgIHRoaXMucHJvcHMgPSB7fVxuICB9XG59XG4iXX0=