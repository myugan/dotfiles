function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/* eslint-env jasmine */

var _libConfigEnvironment = require('./../../lib/config/environment');

var _libConfigPathhelper = require('./../../lib/config/pathhelper');

var pathhelper = _interopRequireWildcard(_libConfigPathhelper);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _specHelpers = require('./../spec-helpers');

var _atomTemp = require('@atom/temp');

var _atomTemp2 = _interopRequireDefault(_atomTemp);

'use babel';

describe('executor', function () {
  var _ref = [];
  var envDir = _ref[0];
  var configDir = _ref[1];

  beforeEach(function () {
    _specHelpers.lifecycle.setup();
    envDir = _atomTemp2['default'].path('gopathenv');
    configDir = _atomTemp2['default'].path('gopathconfig');
  });

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  describe('there is a gopath in the environment', function () {
    beforeEach(function () {
      process.env.GOPATH = envDir;
      atom.config.set('go-plus.config.gopath', configDir);
    });

    it("uses the environment's gopath", function () {
      expect((0, _libConfigEnvironment.getgopath)()).toBeTruthy();
      expect((0, _libConfigEnvironment.getgopath)()).toBe(envDir);
    });
  });

  describe('there is no gopath in the environment or config', function () {
    beforeEach(function () {
      delete process.env.GOPATH;
      atom.config.set('go-plus.config.gopath', '');
    });

    it('uses the default gopath', function () {
      expect((0, _libConfigEnvironment.getgopath)()).toBeTruthy();
      expect((0, _libConfigEnvironment.getgopath)()).toBe(_path2['default'].join(pathhelper.home(), 'go'));
    });
  });

  describe('there is a gopath in config and not in the environment', function () {
    beforeEach(function () {
      delete process.env.GOPATH;
      atom.config.set('go-plus.config.gopath', configDir);
    });

    it("uses the config's gopath", function () {
      expect((0, _libConfigEnvironment.getgopath)()).toBeTruthy();
      expect((0, _libConfigEnvironment.getgopath)()).toBe(configDir);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9jb25maWcvZW52aXJvbm1lbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0NBRzBCLGdDQUFnQzs7bUNBQzlCLCtCQUErQjs7SUFBL0MsVUFBVTs7b0JBQ0wsTUFBTTs7OzsyQkFDRyxtQkFBbUI7O3dCQUM1QixZQUFZOzs7O0FBUDdCLFdBQVcsQ0FBQTs7QUFTWCxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQU07YUFDQyxFQUFFO01BQXZCLE1BQU07TUFBRSxTQUFTOztBQUN0QixZQUFVLENBQUMsWUFBTTtBQUNmLDJCQUFVLEtBQUssRUFBRSxDQUFBO0FBQ2pCLFVBQU0sR0FBRyxzQkFBSyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDL0IsYUFBUyxHQUFHLHNCQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtHQUN0QyxDQUFDLENBQUE7O0FBRUYsV0FBUyxDQUFDLFlBQU07QUFDZCwyQkFBVSxRQUFRLEVBQUUsQ0FBQTtHQUNyQixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHNDQUFzQyxFQUFFLFlBQU07QUFDckQsY0FBVSxDQUFDLFlBQU07QUFDZixhQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDM0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDcEQsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFNO0FBQ3hDLFlBQU0sQ0FBQyxzQ0FBVyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDaEMsWUFBTSxDQUFDLHNDQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDakMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxpREFBaUQsRUFBRSxZQUFNO0FBQ2hFLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQTtBQUN6QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUM3QyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLHlCQUF5QixFQUFFLFlBQU07QUFDbEMsWUFBTSxDQUFDLHNDQUFXLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNoQyxZQUFNLENBQUMsc0NBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBSyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7S0FDN0QsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyx3REFBd0QsRUFBRSxZQUFNO0FBQ3ZFLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQTtBQUN6QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUNwRCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDBCQUEwQixFQUFFLFlBQU07QUFDbkMsWUFBTSxDQUFDLHNDQUFXLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNoQyxZQUFNLENBQUMsc0NBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUNwQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2NvbmZpZy9lbnZpcm9ubWVudC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgeyBnZXRnb3BhdGggfSBmcm9tICcuLy4uLy4uL2xpYi9jb25maWcvZW52aXJvbm1lbnQnXG5pbXBvcnQgKiBhcyBwYXRoaGVscGVyIGZyb20gJy4vLi4vLi4vbGliL2NvbmZpZy9wYXRoaGVscGVyJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGxpZmVjeWNsZSB9IGZyb20gJy4vLi4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IHRlbXAgZnJvbSAnQGF0b20vdGVtcCdcblxuZGVzY3JpYmUoJ2V4ZWN1dG9yJywgKCkgPT4ge1xuICBsZXQgW2VudkRpciwgY29uZmlnRGlyXSA9IFtdXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGxpZmVjeWNsZS5zZXR1cCgpXG4gICAgZW52RGlyID0gdGVtcC5wYXRoKCdnb3BhdGhlbnYnKVxuICAgIGNvbmZpZ0RpciA9IHRlbXAucGF0aCgnZ29wYXRoY29uZmlnJylcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGxpZmVjeWNsZS50ZWFyZG93bigpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3RoZXJlIGlzIGEgZ29wYXRoIGluIHRoZSBlbnZpcm9ubWVudCcsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHByb2Nlc3MuZW52LkdPUEFUSCA9IGVudkRpclxuICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLmNvbmZpZy5nb3BhdGgnLCBjb25maWdEaXIpXG4gICAgfSlcblxuICAgIGl0KFwidXNlcyB0aGUgZW52aXJvbm1lbnQncyBnb3BhdGhcIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldGdvcGF0aCgpKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChnZXRnb3BhdGgoKSkudG9CZShlbnZEaXIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndGhlcmUgaXMgbm8gZ29wYXRoIGluIHRoZSBlbnZpcm9ubWVudCBvciBjb25maWcnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBkZWxldGUgcHJvY2Vzcy5lbnYuR09QQVRIXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMuY29uZmlnLmdvcGF0aCcsICcnKVxuICAgIH0pXG5cbiAgICBpdCgndXNlcyB0aGUgZGVmYXVsdCBnb3BhdGgnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0Z29wYXRoKCkpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KGdldGdvcGF0aCgpKS50b0JlKHBhdGguam9pbihwYXRoaGVscGVyLmhvbWUoKSwgJ2dvJykpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndGhlcmUgaXMgYSBnb3BhdGggaW4gY29uZmlnIGFuZCBub3QgaW4gdGhlIGVudmlyb25tZW50JywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZGVsZXRlIHByb2Nlc3MuZW52LkdPUEFUSFxuICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLmNvbmZpZy5nb3BhdGgnLCBjb25maWdEaXIpXG4gICAgfSlcblxuICAgIGl0KFwidXNlcyB0aGUgY29uZmlnJ3MgZ29wYXRoXCIsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRnb3BhdGgoKSkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QoZ2V0Z29wYXRoKCkpLnRvQmUoY29uZmlnRGlyKVxuICAgIH0pXG4gIH0pXG59KVxuIl19