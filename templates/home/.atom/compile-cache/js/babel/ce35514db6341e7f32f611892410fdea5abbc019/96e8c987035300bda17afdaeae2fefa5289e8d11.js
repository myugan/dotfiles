Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MESSAGE_IDLE = "Idle";

function elementWithText(text) {
  var tag = arguments.length <= 1 || arguments[1] === undefined ? "div" : arguments[1];

  var el = document.createElement(tag);
  el.textContent = text;
  return el;
}

var SignalElement = (function (_HTMLElement) {
  _inherits(SignalElement, _HTMLElement);

  function SignalElement() {
    _classCallCheck(this, SignalElement);

    _get(Object.getPrototypeOf(SignalElement.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SignalElement, [{
    key: "createdCallback",
    value: function createdCallback() {
      this.update([], []);
      this.classList.add("inline-block");
    }
  }, {
    key: "update",
    value: function update(titles, history) {
      this.setBusy(!!titles.length);

      var el = document.createElement("div");
      el.style.textAlign = "left";

      if (history.length) {
        el.append.apply(el, [elementWithText("History:", "strong")].concat(_toConsumableArray(history.map(function (item) {
          return elementWithText(item.title + " (" + item.duration + ")");
        }))));
      }
      if (titles.length) {
        el.append.apply(el, [elementWithText("Current:", "strong")].concat(_toConsumableArray(titles.map(function (item) {
          var e = elementWithText(item.title);
          if (item.options) {
            e.onclick = item.options.onDidClick;
          }
          return e;
        }))));
      }

      if (!el.childElementCount) {
        el.textContent = MESSAGE_IDLE;
      }

      this.setTooltip(el);
    }
  }, {
    key: "setBusy",
    value: function setBusy(busy) {
      var _this = this;

      if (busy) {
        this.classList.add("busy");
        this.classList.remove("idle");
        this.activatedLast = Date.now();
        if (this.deactivateTimer) {
          clearTimeout(this.deactivateTimer);
        }
      } else {
        // The logic below makes sure that busy signal is shown for at least 1 second
        var timeNow = Date.now();
        var timeThen = this.activatedLast || 0;
        var timeDifference = timeNow - timeThen;
        if (timeDifference < 1000) {
          this.deactivateTimer = setTimeout(function () {
            return _this.setBusy(false);
          }, timeDifference + 100);
        } else {
          this.classList.add("idle");
          this.classList.remove("busy");
        }
      }
    }
  }, {
    key: "setTooltip",
    value: function setTooltip(item) {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      this.tooltip = atom.tooltips.add(this, { item: item });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
    }
  }]);

  return SignalElement;
})(HTMLElement);

exports.SignalElement = SignalElement;

var element = document.registerElement("busy-signal", {
  prototype: SignalElement.prototype
});

exports["default"] = element;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDOztBQUU1QixTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQWU7TUFBYixHQUFHLHlEQUFHLEtBQUs7O0FBQ3hDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsSUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDdEIsU0FBTyxFQUFFLENBQUM7Q0FDWDs7SUFFWSxhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7O1dBS1QsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDcEM7OztXQUNLLGdCQUNKLE1BQTZCLEVBQzdCLE9BQW1ELEVBQ25EO0FBQ0EsVUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU5QixVQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLFFBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQzs7QUFFNUIsVUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2xCLFVBQUUsQ0FBQyxNQUFNLE1BQUEsQ0FBVCxFQUFFLEdBQ0EsZUFBZSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsNEJBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2lCQUNqQixlQUFlLENBQUksSUFBSSxDQUFDLEtBQUssVUFBSyxJQUFJLENBQUMsUUFBUSxPQUFJO1NBQUEsQ0FDcEQsR0FDRixDQUFDO09BQ0g7QUFDRCxVQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDakIsVUFBRSxDQUFDLE1BQU0sTUFBQSxDQUFULEVBQUUsR0FDQSxlQUFlLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyw0QkFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNwQixjQUFNLENBQUMsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGNBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixhQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1dBQ3JDO0FBQ0QsaUJBQU8sQ0FBQyxDQUFDO1NBQ1YsQ0FBQyxHQUNILENBQUM7T0FDSDs7QUFFRCxVQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFO0FBQ3pCLFVBQUUsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO09BQy9COztBQUVELFVBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDckI7OztXQUNNLGlCQUFDLElBQWEsRUFBRTs7O0FBQ3JCLFVBQUksSUFBSSxFQUFFO0FBQ1IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsWUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEMsWUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3hCLHNCQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3BDO09BQ0YsTUFBTTs7QUFFTCxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0IsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUM7QUFDekMsWUFBTSxjQUFjLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUMxQyxZQUFJLGNBQWMsR0FBRyxJQUFJLEVBQUU7QUFDekIsY0FBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQy9CO21CQUFNLE1BQUssT0FBTyxDQUFDLEtBQUssQ0FBQztXQUFBLEVBQ3pCLGNBQWMsR0FBRyxHQUFHLENBQ3JCLENBQUM7U0FDSCxNQUFNO0FBQ0wsY0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsY0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7T0FDRjtLQUNGOzs7V0FDUyxvQkFBQyxJQUFpQixFQUFFO0FBQzVCLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3hCO0FBQ0QsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNsRDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN4QjtLQUNGOzs7U0EvRVUsYUFBYTtHQUFTLFdBQVc7Ozs7QUFrRjlDLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFO0FBQ3RELFdBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztDQUNuQyxDQUFDLENBQUM7O3FCQUVZLE9BQU8iLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL2VsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgdHlwZSB7IFNpZ25hbEludGVybmFsIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuY29uc3QgTUVTU0FHRV9JRExFID0gXCJJZGxlXCI7XG5cbmZ1bmN0aW9uIGVsZW1lbnRXaXRoVGV4dCh0ZXh0LCB0YWcgPSBcImRpdlwiKSB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBlbC50ZXh0Q29udGVudCA9IHRleHQ7XG4gIHJldHVybiBlbDtcbn1cblxuZXhwb3J0IGNsYXNzIFNpZ25hbEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHRvb2x0aXA6ID9JRGlzcG9zYWJsZTtcbiAgYWN0aXZhdGVkTGFzdDogP251bWJlcjtcbiAgZGVhY3RpdmF0ZVRpbWVyOiA/VGltZW91dElEO1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnVwZGF0ZShbXSwgW10pO1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcImlubGluZS1ibG9ja1wiKTtcbiAgfVxuICB1cGRhdGUoXG4gICAgdGl0bGVzOiBBcnJheTxTaWduYWxJbnRlcm5hbD4sXG4gICAgaGlzdG9yeTogQXJyYXk8eyB0aXRsZTogc3RyaW5nLCBkdXJhdGlvbjogc3RyaW5nIH0+XG4gICkge1xuICAgIHRoaXMuc2V0QnVzeSghIXRpdGxlcy5sZW5ndGgpO1xuXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVsLnN0eWxlLnRleHRBbGlnbiA9IFwibGVmdFwiO1xuXG4gICAgaWYgKGhpc3RvcnkubGVuZ3RoKSB7XG4gICAgICBlbC5hcHBlbmQoXG4gICAgICAgIGVsZW1lbnRXaXRoVGV4dChcIkhpc3Rvcnk6XCIsIFwic3Ryb25nXCIpLFxuICAgICAgICAuLi5oaXN0b3J5Lm1hcChpdGVtID0+XG4gICAgICAgICAgZWxlbWVudFdpdGhUZXh0KGAke2l0ZW0udGl0bGV9ICgke2l0ZW0uZHVyYXRpb259KWApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aXRsZXMubGVuZ3RoKSB7XG4gICAgICBlbC5hcHBlbmQoXG4gICAgICAgIGVsZW1lbnRXaXRoVGV4dChcIkN1cnJlbnQ6XCIsIFwic3Ryb25nXCIpLFxuICAgICAgICAuLi50aXRsZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIGNvbnN0IGUgPSBlbGVtZW50V2l0aFRleHQoaXRlbS50aXRsZSk7XG4gICAgICAgICAgaWYgKGl0ZW0ub3B0aW9ucykge1xuICAgICAgICAgICAgZS5vbmNsaWNrID0gaXRlbS5vcHRpb25zLm9uRGlkQ2xpY2s7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWVsLmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IE1FU1NBR0VfSURMRTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFRvb2x0aXAoZWwpO1xuICB9XG4gIHNldEJ1c3koYnVzeTogYm9vbGVhbikge1xuICAgIGlmIChidXN5KSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJidXN5XCIpO1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwiaWRsZVwiKTtcbiAgICAgIHRoaXMuYWN0aXZhdGVkTGFzdCA9IERhdGUubm93KCk7XG4gICAgICBpZiAodGhpcy5kZWFjdGl2YXRlVGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVhY3RpdmF0ZVRpbWVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIGxvZ2ljIGJlbG93IG1ha2VzIHN1cmUgdGhhdCBidXN5IHNpZ25hbCBpcyBzaG93biBmb3IgYXQgbGVhc3QgMSBzZWNvbmRcbiAgICAgIGNvbnN0IHRpbWVOb3cgPSBEYXRlLm5vdygpO1xuICAgICAgY29uc3QgdGltZVRoZW4gPSB0aGlzLmFjdGl2YXRlZExhc3QgfHwgMDtcbiAgICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID0gdGltZU5vdyAtIHRpbWVUaGVuO1xuICAgICAgaWYgKHRpbWVEaWZmZXJlbmNlIDwgMTAwMCkge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGVUaW1lciA9IHNldFRpbWVvdXQoXG4gICAgICAgICAgKCkgPT4gdGhpcy5zZXRCdXN5KGZhbHNlKSxcbiAgICAgICAgICB0aW1lRGlmZmVyZW5jZSArIDEwMFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKFwiaWRsZVwiKTtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwiYnVzeVwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc2V0VG9vbHRpcChpdGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKCk7XG4gICAgfVxuICAgIHRoaXMudG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkKHRoaXMsIHsgaXRlbSB9KTtcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJidXN5LXNpZ25hbFwiLCB7XG4gIHByb3RvdHlwZTogU2lnbmFsRWxlbWVudC5wcm90b3R5cGVcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBlbGVtZW50O1xuIl19