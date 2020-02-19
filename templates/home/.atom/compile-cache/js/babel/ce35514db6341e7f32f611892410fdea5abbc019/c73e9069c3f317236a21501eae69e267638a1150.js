Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

var NavigationStack = (function () {
  function NavigationStack() {
    var maxSize = arguments.length <= 0 || arguments[0] === undefined ? 500 : arguments[0];

    _classCallCheck(this, NavigationStack);

    this.maxSize = maxSize >= 1 ? maxSize : 1;
    this.stack = [];
  }

  _createClass(NavigationStack, [{
    key: 'dispose',
    value: function dispose() {
      this.stack = [];
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.stack.length === 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.stack = [];
    }
  }, {
    key: 'pushCurrentLocation',
    value: function pushCurrentLocation() {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      var loc = {
        pos: editor.getCursorBufferPosition(),
        filepath: editor.getURI() || ''
      };

      if (!loc.pos.row || !loc.pos.column) {
        return;
      }

      this.push(loc);
    }

    // Returns a promise that is complete when navigation is done.
  }, {
    key: 'restorePreviousLocation',
    value: function restorePreviousLocation() {
      if (this.isEmpty()) {
        return Promise.resolve();
      }

      if (!this.stack || this.stack.length < 1) {
        return Promise.resolve();
      }

      var lastLocation = this.stack.shift();
      return (0, _utils.openFile)(lastLocation.filepath, lastLocation.pos);
    }
  }, {
    key: 'push',
    value: function push(loc) {
      if (!this.stack || !loc) {
        return;
      }

      if (!this.isEmpty() && this.compareLoc(this.stack[0], loc)) {
        return;
      }
      this.stack.unshift(loc);
      if (this.stack.length > this.maxSize) {
        this.stack.splice(-1, this.stack.length - this.maxSize);
      }
    }
  }, {
    key: 'compareLoc',
    value: function compareLoc(loc1, loc2) {
      if (!loc1 && !loc2) {
        return true;
      }

      if (!loc1 || !loc2) {
        return false;
      }

      var posEqual = function posEqual(pos1, pos2) {
        if (!pos1 && !pos2) {
          return true;
        }
        if (!pos1 || !pos2) {
          return false;
        }
        return pos1.column === pos2.column && pos1.row === pos2.row;
      };

      return loc1.filepath === loc2.filepath && posEqual(loc1.pos, loc2.pos);
    }
  }]);

  return NavigationStack;
})();

exports.NavigationStack = NavigationStack;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL25hdmlnYXRvci9uYXZpZ2F0aW9uLXN0YWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUV5QixVQUFVOztJQUk3QixlQUFlO0FBSVIsV0FKUCxlQUFlLEdBSWdCO1FBQXZCLE9BQWUseURBQUcsR0FBRzs7MEJBSjdCLGVBQWU7O0FBS2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0dBQ2hCOztlQVBHLGVBQWU7O1dBU1osbUJBQUc7QUFDUixVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtLQUNoQjs7O1dBRU0sbUJBQUc7QUFDUixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQTtLQUMvQjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtLQUNoQjs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsZUFBTTtPQUNQO0FBQ0QsVUFBTSxHQUFnQixHQUFHO0FBQ3ZCLFdBQUcsRUFBRSxNQUFNLENBQUMsdUJBQXVCLEVBQUU7QUFDckMsZ0JBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtPQUNoQyxDQUFBOztBQUVELFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ25DLGVBQU07T0FDUDs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ2Y7Ozs7O1dBR3NCLG1DQUFpQjtBQUN0QyxVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUNsQixlQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN6Qjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDeEMsZUFBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDekI7O0FBRUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUN2QyxhQUFPLHFCQUFTLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3pEOzs7V0FFRyxjQUFDLEdBQWdCLEVBQUU7QUFDckIsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDdkIsZUFBTTtPQUNQOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzFELGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZCLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNwQyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDeEQ7S0FDRjs7O1dBRVMsb0JBQUMsSUFBaUIsRUFBRSxJQUFpQixFQUFFO0FBQy9DLFVBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDbEIsZUFBTyxJQUFJLENBQUE7T0FDWjs7QUFFRCxVQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2xCLGVBQU8sS0FBSyxDQUFBO09BQ2I7O0FBRUQsVUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksSUFBSSxFQUFFLElBQUksRUFBSztBQUMvQixZQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2xCLGlCQUFPLElBQUksQ0FBQTtTQUNaO0FBQ0QsWUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNsQixpQkFBTyxLQUFLLENBQUE7U0FDYjtBQUNELGVBQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQTtPQUM1RCxDQUFBOztBQUVELGFBQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUN2RTs7O1NBdEZHLGVBQWU7OztRQXlGWixlQUFlLEdBQWYsZUFBZSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9uYXZpZ2F0b3IvbmF2aWdhdGlvbi1zdGFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IG9wZW5GaWxlIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmltcG9ydCB0eXBlIHsgRGVmTG9jYXRpb24gfSBmcm9tICcuL2RlZmluaXRpb24tdHlwZXMnXG5cbmNsYXNzIE5hdmlnYXRpb25TdGFjayB7XG4gIG1heFNpemU6IG51bWJlclxuICBzdGFjazogQXJyYXk8RGVmTG9jYXRpb24+XG5cbiAgY29uc3RydWN0b3IobWF4U2l6ZTogbnVtYmVyID0gNTAwKSB7XG4gICAgdGhpcy5tYXhTaXplID0gbWF4U2l6ZSA+PSAxID8gbWF4U2l6ZSA6IDFcbiAgICB0aGlzLnN0YWNrID0gW11cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdGFjayA9IFtdXG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMFxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdGFjayA9IFtdXG4gIH1cblxuICBwdXNoQ3VycmVudExvY2F0aW9uKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgbG9jOiBEZWZMb2NhdGlvbiA9IHtcbiAgICAgIHBvczogZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCksXG4gICAgICBmaWxlcGF0aDogZWRpdG9yLmdldFVSSSgpIHx8ICcnXG4gICAgfVxuXG4gICAgaWYgKCFsb2MucG9zLnJvdyB8fCAhbG9jLnBvcy5jb2x1bW4pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucHVzaChsb2MpXG4gIH1cblxuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGNvbXBsZXRlIHdoZW4gbmF2aWdhdGlvbiBpcyBkb25lLlxuICByZXN0b3JlUHJldmlvdXNMb2NhdGlvbigpOiBQcm9taXNlPGFueT4ge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YWNrIHx8IHRoaXMuc3RhY2subGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgY29uc3QgbGFzdExvY2F0aW9uID0gdGhpcy5zdGFjay5zaGlmdCgpXG4gICAgcmV0dXJuIG9wZW5GaWxlKGxhc3RMb2NhdGlvbi5maWxlcGF0aCwgbGFzdExvY2F0aW9uLnBvcylcbiAgfVxuXG4gIHB1c2gobG9jOiBEZWZMb2NhdGlvbikge1xuICAgIGlmICghdGhpcy5zdGFjayB8fCAhbG9jKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpICYmIHRoaXMuY29tcGFyZUxvYyh0aGlzLnN0YWNrWzBdLCBsb2MpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zdGFjay51bnNoaWZ0KGxvYylcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPiB0aGlzLm1heFNpemUpIHtcbiAgICAgIHRoaXMuc3RhY2suc3BsaWNlKC0xLCB0aGlzLnN0YWNrLmxlbmd0aCAtIHRoaXMubWF4U2l6ZSlcbiAgICB9XG4gIH1cblxuICBjb21wYXJlTG9jKGxvYzE6IERlZkxvY2F0aW9uLCBsb2MyOiBEZWZMb2NhdGlvbikge1xuICAgIGlmICghbG9jMSAmJiAhbG9jMikge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAoIWxvYzEgfHwgIWxvYzIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHBvc0VxdWFsID0gKHBvczEsIHBvczIpID0+IHtcbiAgICAgIGlmICghcG9zMSAmJiAhcG9zMikge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKCFwb3MxIHx8ICFwb3MyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBvczEuY29sdW1uID09PSBwb3MyLmNvbHVtbiAmJiBwb3MxLnJvdyA9PT0gcG9zMi5yb3dcbiAgICB9XG5cbiAgICByZXR1cm4gbG9jMS5maWxlcGF0aCA9PT0gbG9jMi5maWxlcGF0aCAmJiBwb3NFcXVhbChsb2MxLnBvcywgbG9jMi5wb3MpXG4gIH1cbn1cblxuZXhwb3J0IHsgTmF2aWdhdGlvblN0YWNrIH1cbiJdfQ==