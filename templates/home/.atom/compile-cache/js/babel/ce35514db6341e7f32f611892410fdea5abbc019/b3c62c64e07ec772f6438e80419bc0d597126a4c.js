var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var TooltipDelegate = (function () {
  function TooltipDelegate() {
    var _this = this;

    _classCallCheck(this, TooltipDelegate);

    this.emitter = new _atom.Emitter();
    this.expanded = false;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      var shouldUpdate = typeof _this.showProviderName !== 'undefined';
      _this.showProviderName = showProviderName;
      if (shouldUpdate) {
        _this.emitter.emit('should-update');
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip(event) {
        if (_this.expanded) {
          return;
        }
        _this.expanded = true;
        _this.emitter.emit('should-expand');

        // If bound to a key, collapse when that key is released, just like old times
        if (event.originalEvent && event.originalEvent.isTrusted) {
          // $FlowIgnore: document.body is never null
          document.body.addEventListener('keyup', function eventListener() {
            // $FlowIgnore: document.body is never null
            document.body.removeEventListener('keyup', eventListener);
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter-ui-default:collapse-tooltip');
          });
        }
      },
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {
        _this.expanded = false;
        _this.emitter.emit('should-collapse');
      }
    }));
  }

  _createClass(TooltipDelegate, [{
    key: 'onShouldUpdate',
    value: function onShouldUpdate(callback) {
      return this.emitter.on('should-update', callback);
    }
  }, {
    key: 'onShouldExpand',
    value: function onShouldExpand(callback) {
      return this.emitter.on('should-expand', callback);
    }
  }, {
    key: 'onShouldCollapse',
    value: function onShouldCollapse(callback) {
      return this.emitter.on('should-collapse', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.dispose();
    }
  }]);

  return TooltipDelegate;
})();

module.exports = TooltipDelegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL2RlbGVnYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRTZDLE1BQU07O0lBRzdDLGVBQWU7QUFNUixXQU5QLGVBQWUsR0FNTDs7OzBCQU5WLGVBQWU7O0FBT2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtBQUNyQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFLFVBQUEsZ0JBQWdCLEVBQUk7QUFDNUUsVUFBTSxZQUFZLEdBQUcsT0FBTyxNQUFLLGdCQUFnQixLQUFLLFdBQVcsQ0FBQTtBQUNqRSxZQUFLLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0FBQ3hDLFVBQUksWUFBWSxFQUFFO0FBQ2hCLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtPQUNuQztLQUNGLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ2xDLHdDQUFrQyxFQUFFLHNDQUFBLEtBQUssRUFBSTtBQUMzQyxZQUFJLE1BQUssUUFBUSxFQUFFO0FBQ2pCLGlCQUFNO1NBQ1A7QUFDRCxjQUFLLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBOzs7QUFHbEMsWUFBSSxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFOztBQUV4RCxrQkFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxhQUFhLEdBQUc7O0FBRS9ELG9CQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUN6RCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLG9DQUFvQyxDQUFDLENBQUE7V0FDakcsQ0FBQyxDQUFBO1NBQ0g7T0FDRjtBQUNELDBDQUFvQyxFQUFFLDBDQUFNO0FBQzFDLGNBQUssUUFBUSxHQUFHLEtBQUssQ0FBQTtBQUNyQixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtPQUNyQztLQUNGLENBQUMsQ0FDSCxDQUFBO0dBQ0Y7O2VBOUNHLGVBQWU7O1dBK0NMLHdCQUFDLFFBQW1CLEVBQWM7QUFDOUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDbEQ7OztXQUNhLHdCQUFDLFFBQW1CLEVBQWM7QUFDOUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDbEQ7OztXQUNlLDBCQUFDLFFBQW1CLEVBQWM7QUFDaEQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNwRDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3ZCOzs7U0ExREcsZUFBZTs7O0FBNkRyQixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9kZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuY2xhc3MgVG9vbHRpcERlbGVnYXRlIHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBleHBhbmRlZDogYm9vbGVhblxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHNob3dQcm92aWRlck5hbWU6IGJvb2xlYW5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQcm92aWRlck5hbWUnLCBzaG93UHJvdmlkZXJOYW1lID0+IHtcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gdHlwZW9mIHRoaXMuc2hvd1Byb3ZpZGVyTmFtZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgdGhpcy5zaG93UHJvdmlkZXJOYW1lID0gc2hvd1Byb3ZpZGVyTmFtZVxuICAgICAgICBpZiAoc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC11cGRhdGUnKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmV4cGFuZC10b29sdGlwJzogZXZlbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmV4cGFuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5leHBhbmRlZCA9IHRydWVcbiAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWV4cGFuZCcpXG5cbiAgICAgICAgICAvLyBJZiBib3VuZCB0byBhIGtleSwgY29sbGFwc2Ugd2hlbiB0aGF0IGtleSBpcyByZWxlYXNlZCwganVzdCBsaWtlIG9sZCB0aW1lc1xuICAgICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQuaXNUcnVzdGVkKSB7XG4gICAgICAgICAgICAvLyAkRmxvd0lnbm9yZTogZG9jdW1lbnQuYm9keSBpcyBuZXZlciBudWxsXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gZXZlbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgICAgLy8gJEZsb3dJZ25vcmU6IGRvY3VtZW50LmJvZHkgaXMgbmV2ZXIgbnVsbFxuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnbGludGVyLXVpLWRlZmF1bHQ6Y29sbGFwc2UtdG9vbHRpcCcpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmNvbGxhcHNlLXRvb2x0aXAnOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1jb2xsYXBzZScpXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgb25TaG91bGRVcGRhdGUoY2FsbGJhY2s6ICgpID0+IGFueSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZEV4cGFuZChjYWxsYmFjazogKCkgPT4gYW55KTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLWV4cGFuZCcsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkQ29sbGFwc2UoY2FsbGJhY2s6ICgpID0+IGFueSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1jb2xsYXBzZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcERlbGVnYXRlXG4iXX0=