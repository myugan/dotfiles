var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var Intentions = (function () {
  function Intentions() {
    _classCallCheck(this, Intentions);

    this.messages = [];
    this.grammarScopes = ['*'];
  }

  _createClass(Intentions, [{
    key: 'getIntentions',
    value: function getIntentions(_ref) {
      var textEditor = _ref.textEditor;
      var bufferPosition = _ref.bufferPosition;

      var intentions = [];
      var messages = (0, _helpers.filterMessages)(this.messages, textEditor.getPath());

      var _loop = function (message) {
        var hasFixes = message.solutions && message.solutions.length;
        if (!hasFixes) {
          return 'continue';
        }
        var range = (0, _helpers.$range)(message);
        var inRange = range && range.containsPoint(bufferPosition);
        if (!inRange) {
          return 'continue';
        }

        var solutions = [];
        if (message.version === 2 && message.solutions && message.solutions.length) {
          solutions = message.solutions;
        }
        var linterName = message.linterName || 'Linter';

        intentions = intentions.concat(solutions.map(function (solution) {
          return {
            priority: solution.priority ? solution.priority + 200 : 200,
            icon: 'tools',
            title: solution.title || 'Fix ' + linterName + ' issue',
            selected: function selected() {
              (0, _helpers.applySolution)(textEditor, solution);
            }
          };
        }));
      };

      for (var message of messages) {
        var _ret = _loop(message);

        if (_ret === 'continue') continue;
      }
      return intentions;
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }]);

  return Intentions;
})();

module.exports = Intentions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9pbnRlbnRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7dUJBRXNELFdBQVc7O0lBRzNELFVBQVU7QUFJSCxXQUpQLFVBQVUsR0FJQTswQkFKVixVQUFVOztBQUtaLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtHQUMzQjs7ZUFQRyxVQUFVOztXQVFELHVCQUFDLElBQXNDLEVBQWlCO1VBQXJELFVBQVUsR0FBWixJQUFzQyxDQUFwQyxVQUFVO1VBQUUsY0FBYyxHQUE1QixJQUFzQyxDQUF4QixjQUFjOztBQUN4QyxVQUFJLFVBQVUsR0FBRyxFQUFFLENBQUE7QUFDbkIsVUFBTSxRQUFRLEdBQUcsNkJBQWUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTs7NEJBRXpELE9BQU87QUFDaEIsWUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQTtBQUM5RCxZQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsNEJBQVE7U0FDVDtBQUNELFlBQU0sS0FBSyxHQUFHLHFCQUFPLE9BQU8sQ0FBQyxDQUFBO0FBQzdCLFlBQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzVELFlBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWiw0QkFBUTtTQUNUOztBQUVELFlBQUksU0FBd0IsR0FBRyxFQUFFLENBQUE7QUFDakMsWUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFFLG1CQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQTtTQUM5QjtBQUNELFlBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFBOztBQUVqRCxrQkFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQzVCLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRO2lCQUFLO0FBQ3pCLG9CQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQzNELGdCQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssYUFBVyxVQUFVLFdBQVE7QUFDbEQsb0JBQVEsRUFBQSxvQkFBRztBQUNULDBDQUFjLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTthQUNwQztXQUNGO1NBQUMsQ0FBQyxDQUNKLENBQUE7OztBQTFCSCxXQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTt5QkFBckIsT0FBTzs7aUNBUWQsU0FBUTtPQW1CWDtBQUNELGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7V0FDSyxnQkFBQyxRQUE4QixFQUFFO0FBQ3JDLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0tBQ3pCOzs7U0E1Q0csVUFBVTs7O0FBK0NoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW50ZW50aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7ICRyYW5nZSwgYXBwbHlTb2x1dGlvbiwgZmlsdGVyTWVzc2FnZXMgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBJbnRlbnRpb25zIHtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIGdyYW1tYXJTY29wZXM6IEFycmF5PHN0cmluZz5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLmdyYW1tYXJTY29wZXMgPSBbJyonXVxuICB9XG4gIGdldEludGVudGlvbnMoeyB0ZXh0RWRpdG9yLCBidWZmZXJQb3NpdGlvbiB9OiBPYmplY3QpOiBBcnJheTxPYmplY3Q+IHtcbiAgICBsZXQgaW50ZW50aW9ucyA9IFtdXG4gICAgY29uc3QgbWVzc2FnZXMgPSBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLmdldFBhdGgoKSlcblxuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaGFzRml4ZXMgPSBtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGhcbiAgICAgIGlmICghaGFzRml4ZXMpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG4gICAgICBjb25zdCBpblJhbmdlID0gcmFuZ2UgJiYgcmFuZ2UuY29udGFpbnNQb2ludChidWZmZXJQb3NpdGlvbilcbiAgICAgIGlmICghaW5SYW5nZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBsZXQgc29sdXRpb25zOiBBcnJheTxPYmplY3Q+ID0gW11cbiAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIgJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHNvbHV0aW9ucyA9IG1lc3NhZ2Uuc29sdXRpb25zXG4gICAgICB9XG4gICAgICBjb25zdCBsaW50ZXJOYW1lID0gbWVzc2FnZS5saW50ZXJOYW1lIHx8ICdMaW50ZXInXG5cbiAgICAgIGludGVudGlvbnMgPSBpbnRlbnRpb25zLmNvbmNhdChcbiAgICAgICAgc29sdXRpb25zLm1hcChzb2x1dGlvbiA9PiAoe1xuICAgICAgICAgIHByaW9yaXR5OiBzb2x1dGlvbi5wcmlvcml0eSA/IHNvbHV0aW9uLnByaW9yaXR5ICsgMjAwIDogMjAwLFxuICAgICAgICAgIGljb246ICd0b29scycsXG4gICAgICAgICAgdGl0bGU6IHNvbHV0aW9uLnRpdGxlIHx8IGBGaXggJHtsaW50ZXJOYW1lfSBpc3N1ZWAsXG4gICAgICAgICAgc2VsZWN0ZWQoKSB7XG4gICAgICAgICAgICBhcHBseVNvbHV0aW9uKHRleHRFZGl0b3IsIHNvbHV0aW9uKVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pKSxcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGludGVudGlvbnNcbiAgfVxuICB1cGRhdGUobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+KSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlbnRpb25zXG4iXX0=