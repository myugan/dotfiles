Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var UIRegistry = (function () {
  function UIRegistry() {
    _classCallCheck(this, UIRegistry);

    this.providers = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(UIRegistry, [{
    key: 'add',
    value: function add(ui) {
      if (!this.providers.has(ui) && (0, _validate.ui)(ui)) {
        this.subscriptions.add(ui);
        this.providers.add(ui);
      }
    }
  }, {
    key: 'delete',
    value: function _delete(provider) {
      if (this.providers.has(provider)) {
        provider.dispose();
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.providers);
    }
  }, {
    key: 'render',
    value: function render(messages) {
      this.providers.forEach(function (provider) {
        provider.render(messages);
      });
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter) {
      var filePath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.providers.forEach(function (provider) {
        provider.didBeginLinting(linter, filePath);
      });
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter) {
      var filePath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.providers.forEach(function (provider) {
        provider.didFinishLinting(linter, filePath);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
      this.subscriptions.dispose();
    }
  }]);

  return UIRegistry;
})();

exports['default'] = UIRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWktcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUNULFlBQVk7O0lBR3ZDLFVBQVU7QUFJSCxXQUpQLFVBQVUsR0FJQTswQkFKVixVQUFVOztBQUtaLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0dBQy9DOztlQVBHLFVBQVU7O1dBUVgsYUFBQyxFQUFNLEVBQUU7QUFDVixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksa0JBQVcsRUFBRSxDQUFDLEVBQUU7QUFDN0MsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDdkI7S0FDRjs7O1dBQ0ssaUJBQUMsUUFBWSxFQUFFO0FBQ25CLFVBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDaEMsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixZQUFJLENBQUMsU0FBUyxVQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7S0FDRjs7O1dBQ1csd0JBQWM7QUFDeEIsYUFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUNsQzs7O1dBQ0ssZ0JBQUMsUUFBdUIsRUFBRTtBQUM5QixVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUN4QyxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMxQixDQUFDLENBQUE7S0FDSDs7O1dBQ2MseUJBQUMsTUFBYyxFQUE0QjtVQUExQixRQUFpQix5REFBRyxJQUFJOztBQUN0RCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUN4QyxnQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDM0MsQ0FBQyxDQUFBO0tBQ0g7OztXQUNlLDBCQUFDLE1BQWMsRUFBNEI7VUFBMUIsUUFBaUIseURBQUcsSUFBSTs7QUFDdkQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRLEVBQUU7QUFDeEMsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDNUMsQ0FBQyxDQUFBO0tBQ0g7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0F6Q0csVUFBVTs7O3FCQTRDRCxVQUFVIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWktcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHVpIGFzIHZhbGlkYXRlVUkgfSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIFVJLCBNZXNzYWdlc1BhdGNoIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgVUlSZWdpc3RyeSB7XG4gIHByb3ZpZGVyczogU2V0PFVJPlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIH1cbiAgYWRkKHVpOiBVSSkge1xuICAgIGlmICghdGhpcy5wcm92aWRlcnMuaGFzKHVpKSAmJiB2YWxpZGF0ZVVJKHVpKSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh1aSlcbiAgICAgIHRoaXMucHJvdmlkZXJzLmFkZCh1aSlcbiAgICB9XG4gIH1cbiAgZGVsZXRlKHByb3ZpZGVyOiBVSSkge1xuICAgIGlmICh0aGlzLnByb3ZpZGVycy5oYXMocHJvdmlkZXIpKSB7XG4gICAgICBwcm92aWRlci5kaXNwb3NlKClcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcilcbiAgICB9XG4gIH1cbiAgZ2V0UHJvdmlkZXJzKCk6IEFycmF5PFVJPiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm92aWRlcnMpXG4gIH1cbiAgcmVuZGVyKG1lc3NhZ2VzOiBNZXNzYWdlc1BhdGNoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgcHJvdmlkZXIucmVuZGVyKG1lc3NhZ2VzKVxuICAgIH0pXG4gIH1cbiAgZGlkQmVnaW5MaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogP3N0cmluZyA9IG51bGwpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBwcm92aWRlci5kaWRCZWdpbkxpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgICB9KVxuICB9XG4gIGRpZEZpbmlzaExpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nID0gbnVsbCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIHByb3ZpZGVyLmRpZEZpbmlzaExpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgICB9KVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVSVJlZ2lzdHJ5XG4iXX0=