Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-env jasmine */

var _atomTemp = require('@atom/temp');

var _atomTemp2 = _interopRequireDefault(_atomTemp);

var Lifecycle = (function () {
  function Lifecycle() {
    _classCallCheck(this, Lifecycle);

    this.env = Object.assign({}, process.env);
    this.temp = _atomTemp2['default'];
    this.temp.track();
    this.mainModule = null;
  }

  _createClass(Lifecycle, [{
    key: 'dispose',
    value: function dispose() {
      this.temp = null;
      this.mainModule = null;
    }
  }, {
    key: 'setup',
    value: function setup() {
      this.env = Object.assign({}, process.env);
      atom.config.set('go-plus.disableToolCheck', true);
      atom.config.set('go-plus.testing', true);
      atom.config.set('go-plus.guru.highlightIdentifiers', false);
    }
  }, {
    key: 'activatePackage',
    value: function activatePackage() {
      var _this = this;

      atom.packages.triggerDeferredActivationHooks();
      atom.packages.triggerActivationHook('language-go:grammar-used');
      atom.packages.triggerActivationHook('core:loaded-shell-environment');

      return Promise.all([atom.packages.activatePackage('language-go')['catch'](function (e) {
        // eslint-disable-next-line no-console
        jasmine.getEnv().currentSpec.fail(e);
        throw e;
      }), atom.packages.activatePackage('go-plus').then(function (pkg) {
        _this.mainModule = pkg.mainModule;
        return pkg;
      }, function (e) {
        jasmine.getEnv().currentSpec.fail(e);
        throw e;
      })])['catch'](function (e) {
        jasmine.getEnv().currentSpec.fail(e);
        throw e;
      });
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.env) {
        process.env = this.env;
      }
      if (this.mainModule) this.mainModule.dispose();
      this.mainModule = null;
      atom.config.set('go-plus.testing', false);
    }
  }]);

  return Lifecycle;
})();

var lifecycle = new Lifecycle();

exports.lifecycle = lifecycle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9zcGVjLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3dCQUlpQixZQUFZOzs7O0lBRXZCLFNBQVM7QUFLRixXQUxQLFNBQVMsR0FLQzswQkFMVixTQUFTOztBQU1YLFFBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxJQUFJLHdCQUFPLENBQUE7QUFDaEIsUUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtHQUN2Qjs7ZUFWRyxTQUFTOztXQVlOLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7S0FDdkI7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDekMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDakQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDeEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDNUQ7OztXQUVjLDJCQUFHOzs7QUFDaEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRSxDQUFBO0FBQzlDLFVBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUMvRCxVQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLCtCQUErQixDQUFDLENBQUE7O0FBRXBFLGFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsU0FBTSxDQUFDLFVBQUEsQ0FBQyxFQUFJOztBQUV0RCxlQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwQyxjQUFNLENBQUMsQ0FBQTtPQUNSLENBQUMsRUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQzNDLFVBQUEsR0FBRyxFQUFJO0FBQ0wsY0FBSyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQTtBQUNoQyxlQUFPLEdBQUcsQ0FBQTtPQUNYLEVBQ0QsVUFBQSxDQUFDLEVBQUk7QUFDSCxlQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwQyxjQUFNLENBQUMsQ0FBQTtPQUNSLENBQ0YsQ0FDRixDQUFDLFNBQU0sQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUNaLGVBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLGNBQU0sQ0FBQyxDQUFBO09BQ1IsQ0FBQyxDQUFBO0tBQ0g7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1osZUFBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO09BQ3ZCO0FBQ0QsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDOUMsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDdEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDMUM7OztTQTFERyxTQUFTOzs7QUE2RGYsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQTs7UUFFeEIsU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL3NwZWMtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgdGVtcCBmcm9tICdAYXRvbS90ZW1wJ1xuXG5jbGFzcyBMaWZlY3ljbGUge1xuICBlbnY6IE9iamVjdFxuICB0ZW1wOiB0ZW1wXG4gIG1haW5Nb2R1bGU6IGFueVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW52ID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpXG4gICAgdGhpcy50ZW1wID0gdGVtcFxuICAgIHRoaXMudGVtcC50cmFjaygpXG4gICAgdGhpcy5tYWluTW9kdWxlID0gbnVsbFxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnRlbXAgPSBudWxsXG4gICAgdGhpcy5tYWluTW9kdWxlID0gbnVsbFxuICB9XG5cbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5lbnYgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9jZXNzLmVudilcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMuZGlzYWJsZVRvb2xDaGVjaycsIHRydWUpXG4gICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLnRlc3RpbmcnLCB0cnVlKVxuICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5ndXJ1LmhpZ2hsaWdodElkZW50aWZpZXJzJywgZmFsc2UpXG4gIH1cblxuICBhY3RpdmF0ZVBhY2thZ2UoKSB7XG4gICAgYXRvbS5wYWNrYWdlcy50cmlnZ2VyRGVmZXJyZWRBY3RpdmF0aW9uSG9va3MoKVxuICAgIGF0b20ucGFja2FnZXMudHJpZ2dlckFjdGl2YXRpb25Ib29rKCdsYW5ndWFnZS1nbzpncmFtbWFyLXVzZWQnKVxuICAgIGF0b20ucGFja2FnZXMudHJpZ2dlckFjdGl2YXRpb25Ib29rKCdjb3JlOmxvYWRlZC1zaGVsbC1lbnZpcm9ubWVudCcpXG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWdvJykuY2F0Y2goZSA9PiB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGphc21pbmUuZ2V0RW52KCkuY3VycmVudFNwZWMuZmFpbChlKVxuICAgICAgICB0aHJvdyBlXG4gICAgICB9KSxcbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdnby1wbHVzJykudGhlbihcbiAgICAgICAgcGtnID0+IHtcbiAgICAgICAgICB0aGlzLm1haW5Nb2R1bGUgPSBwa2cubWFpbk1vZHVsZVxuICAgICAgICAgIHJldHVybiBwa2dcbiAgICAgICAgfSxcbiAgICAgICAgZSA9PiB7XG4gICAgICAgICAgamFzbWluZS5nZXRFbnYoKS5jdXJyZW50U3BlYy5mYWlsKGUpXG4gICAgICAgICAgdGhyb3cgZVxuICAgICAgICB9XG4gICAgICApXG4gICAgXSkuY2F0Y2goZSA9PiB7XG4gICAgICBqYXNtaW5lLmdldEVudigpLmN1cnJlbnRTcGVjLmZhaWwoZSlcbiAgICAgIHRocm93IGVcbiAgICB9KVxuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgaWYgKHRoaXMuZW52KSB7XG4gICAgICBwcm9jZXNzLmVudiA9IHRoaXMuZW52XG4gICAgfVxuICAgIGlmICh0aGlzLm1haW5Nb2R1bGUpIHRoaXMubWFpbk1vZHVsZS5kaXNwb3NlKClcbiAgICB0aGlzLm1haW5Nb2R1bGUgPSBudWxsXG4gICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLnRlc3RpbmcnLCBmYWxzZSlcbiAgfVxufVxuXG5jb25zdCBsaWZlY3ljbGUgPSBuZXcgTGlmZWN5Y2xlKClcblxuZXhwb3J0IHsgbGlmZWN5Y2xlIH1cbiJdfQ==