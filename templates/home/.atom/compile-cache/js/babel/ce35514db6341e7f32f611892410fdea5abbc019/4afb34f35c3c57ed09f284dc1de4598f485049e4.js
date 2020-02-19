Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = buildColorSettings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tinycolor2 = require('tinycolor2');

var _tinycolor22 = _interopRequireDefault(_tinycolor2);

'use babel';

function buildColorSettings() {
    var baseColor = arguments.length <= 0 || arguments[0] === undefined ? '#009688' : arguments[0];
    var accentColor = arguments.length <= 1 || arguments[1] === undefined ? '#FFFFFF' : arguments[1];

    var newAccent = typeof accentColor === 'object' ? accentColor.toHexString() : accentColor;

    var newBase = typeof baseColor === 'object' ? baseColor.toHexString() : baseColor;

    var luminance = (0, _tinycolor22['default'])(newBase).getLuminance();
    var accentTextColor = '#666';

    if (luminance <= 0.3 && luminance > 0.22) {
        accentTextColor = 'rgba(255,255,255,0.9)';
    } else if (luminance <= 0.22) {
        accentTextColor = 'rgba(255,255,255,0.8)';
    } else if (luminance > 0.3) {
        accentTextColor = 'rgba(0,0,0,0.6)';
    }

    return '\n        @accent-color: ' + newAccent + ';\n        @accent-text-color: ' + accentTextColor + ';\n        @base-color: ' + newBase + ';\n    ';
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2NvbG9ycy9idWlsZC1jb2xvci1zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBSXdCLGtCQUFrQjs7OzswQkFGcEIsWUFBWTs7OztBQUZsQyxXQUFXLENBQUM7O0FBSUcsU0FBUyxrQkFBa0IsR0FBaUQ7UUFBaEQsU0FBUyx5REFBRyxTQUFTO1FBQUUsV0FBVyx5REFBRyxTQUFTOztBQUNyRixRQUFNLFNBQVMsR0FBRyxBQUFDLE9BQU8sV0FBVyxLQUFLLFFBQVEsR0FDOUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxHQUN6QixXQUFXLENBQUM7O0FBRWhCLFFBQU0sT0FBTyxHQUFHLEFBQUMsT0FBTyxTQUFTLEtBQUssUUFBUSxHQUMxQyxTQUFTLENBQUMsV0FBVyxFQUFFLEdBQ3ZCLFNBQVMsQ0FBQzs7QUFFZCxRQUFNLFNBQVMsR0FBRyw2QkFBVSxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwRCxRQUFJLGVBQWUsR0FBRyxNQUFNLENBQUM7O0FBRTdCLFFBQUksU0FBUyxJQUFJLEdBQUcsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFO0FBQ3RDLHVCQUFlLEdBQUcsdUJBQXVCLENBQUM7S0FDN0MsTUFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDMUIsdUJBQWUsR0FBRyx1QkFBdUIsQ0FBQztLQUM3QyxNQUFNLElBQUksU0FBUyxHQUFHLEdBQUcsRUFBRTtBQUN4Qix1QkFBZSxHQUFHLGlCQUFpQixDQUFDO0tBQ3ZDOztBQUVELHlDQUNxQixTQUFTLHVDQUNKLGVBQWUsZ0NBQ3RCLE9BQU8sYUFDeEI7Q0FDTCIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9jb2xvcnMvYnVpbGQtY29sb3Itc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHRpbnljb2xvciBmcm9tICd0aW55Y29sb3IyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRDb2xvclNldHRpbmdzKGJhc2VDb2xvciA9ICcjMDA5Njg4JywgYWNjZW50Q29sb3IgPSAnI0ZGRkZGRicpIHtcbiAgICBjb25zdCBuZXdBY2NlbnQgPSAodHlwZW9mIGFjY2VudENvbG9yID09PSAnb2JqZWN0JykgP1xuICAgICAgICBhY2NlbnRDb2xvci50b0hleFN0cmluZygpIDpcbiAgICAgICAgYWNjZW50Q29sb3I7XG5cbiAgICBjb25zdCBuZXdCYXNlID0gKHR5cGVvZiBiYXNlQ29sb3IgPT09ICdvYmplY3QnKSA/XG4gICAgICAgIGJhc2VDb2xvci50b0hleFN0cmluZygpIDpcbiAgICAgICAgYmFzZUNvbG9yO1xuXG4gICAgY29uc3QgbHVtaW5hbmNlID0gdGlueWNvbG9yKG5ld0Jhc2UpLmdldEx1bWluYW5jZSgpO1xuICAgIGxldCBhY2NlbnRUZXh0Q29sb3IgPSAnIzY2Nic7XG5cbiAgICBpZiAobHVtaW5hbmNlIDw9IDAuMyAmJiBsdW1pbmFuY2UgPiAwLjIyKSB7XG4gICAgICAgIGFjY2VudFRleHRDb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuOSknO1xuICAgIH0gZWxzZSBpZiAobHVtaW5hbmNlIDw9IDAuMjIpIHtcbiAgICAgICAgYWNjZW50VGV4dENvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMC44KSc7XG4gICAgfSBlbHNlIGlmIChsdW1pbmFuY2UgPiAwLjMpIHtcbiAgICAgICAgYWNjZW50VGV4dENvbG9yID0gJ3JnYmEoMCwwLDAsMC42KSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBcbiAgICAgICAgQGFjY2VudC1jb2xvcjogJHtuZXdBY2NlbnR9O1xuICAgICAgICBAYWNjZW50LXRleHQtY29sb3I6ICR7YWNjZW50VGV4dENvbG9yfTtcbiAgICAgICAgQGJhc2UtY29sb3I6ICR7bmV3QmFzZX07XG4gICAgYDtcbn1cbiJdfQ==