Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fontsSetFontSize = require('./fonts/set-font-size');

var _fontsSetFontSize2 = _interopRequireDefault(_fontsSetFontSize);

var _helperToggleClassName = require('./helper/toggle-class-name');

var _helperToggleClassName2 = _interopRequireDefault(_helperToggleClassName);

require('./colors');

require('./fonts');

require('./tab-bar');

require('./user-interface');

'use babel';

var classNames = {
    // Fonts
    'amu-paint-cursor': atom.config.get('atom-material-ui.colors.paintCursor'),

    // Tabs settings
    'amu-compact-tab-bar': atom.config.get('atom-material-ui.tabs.compactTabs'),
    'amu-no-tab-min-width': atom.config.get('atom-material-ui.tabs.noTabMinWidth'),
    'amu-tinted-tab-bar': atom.config.get('atom-material-ui.tabs.tintedTabBar'),
    'amu-stretched-tabs': atom.config.get('atom-material-ui.tabs.stretchedTabs'),

    // General UI settings
    'amu-use-animations': atom.config.get('atom-material-ui.ui.useAnimations'),
    'amu-panel-contrast': atom.config.get('atom-material-ui.ui.panelContrast'),
    'amu-panel-shadows': atom.config.get('atom-material-ui.ui.panelShadows')
};

exports['default'] = {
    activate: function activate() {
        Object.keys(classNames).forEach(function (className) {
            return (0, _helperToggleClassName2['default'])(className, classNames[className]);
        });

        (0, _fontsSetFontSize2['default'])(atom.config.get('atom-material-ui.fonts.fontSize'));
    },

    deactivate: function deactivate() {
        // Reset all the things!
        Object.keys(classNames).forEach(function (className) {
            return (0, _helperToggleClassName2['default'])(className, false);
        });
        (0, _fontsSetFontSize2['default'])(null);
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2dDQUV3Qix1QkFBdUI7Ozs7cUNBQ25CLDRCQUE0Qjs7OztRQUNqRCxVQUFVOztRQUNWLFNBQVM7O1FBQ1QsV0FBVzs7UUFDWCxrQkFBa0I7O0FBUHpCLFdBQVcsQ0FBQzs7QUFTWixJQUFNLFVBQVUsR0FBRzs7QUFFZixzQkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQzs7O0FBRzFFLHlCQUFxQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDO0FBQzNFLDBCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDO0FBQzlFLHdCQUFvQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDO0FBQzNFLHdCQUFvQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDOzs7QUFHNUUsd0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUM7QUFDMUUsd0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUM7QUFDMUUsdUJBQW1CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUM7Q0FDM0UsQ0FBQzs7cUJBRWE7QUFDWCxZQUFRLEVBQUEsb0JBQUc7QUFDUCxjQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7bUJBQ3JDLHdDQUFnQixTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQUMsQ0FDckQsQ0FBQzs7QUFFRiwyQ0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUM7S0FDbkU7O0FBRUQsY0FBVSxFQUFBLHNCQUFHOztBQUVULGNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUzttQkFBSSx3Q0FBZ0IsU0FBUyxFQUFFLEtBQUssQ0FBQztTQUFBLENBQUMsQ0FBQztBQUNoRiwyQ0FBWSxJQUFJLENBQUMsQ0FBQztLQUNyQjtDQUNKIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHNldEZvbnRTaXplIGZyb20gJy4vZm9udHMvc2V0LWZvbnQtc2l6ZSc7XG5pbXBvcnQgdG9nZ2xlQ2xhc3NOYW1lIGZyb20gJy4vaGVscGVyL3RvZ2dsZS1jbGFzcy1uYW1lJztcbmltcG9ydCAnLi9jb2xvcnMnO1xuaW1wb3J0ICcuL2ZvbnRzJztcbmltcG9ydCAnLi90YWItYmFyJztcbmltcG9ydCAnLi91c2VyLWludGVyZmFjZSc7XG5cbmNvbnN0IGNsYXNzTmFtZXMgPSB7XG4gICAgLy8gRm9udHNcbiAgICAnYW11LXBhaW50LWN1cnNvcic6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMucGFpbnRDdXJzb3InKSxcblxuICAgIC8vIFRhYnMgc2V0dGluZ3NcbiAgICAnYW11LWNvbXBhY3QtdGFiLWJhcic6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS50YWJzLmNvbXBhY3RUYWJzJyksXG4gICAgJ2FtdS1uby10YWItbWluLXdpZHRoJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRhYnMubm9UYWJNaW5XaWR0aCcpLFxuICAgICdhbXUtdGludGVkLXRhYi1iYXInOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy50aW50ZWRUYWJCYXInKSxcbiAgICAnYW11LXN0cmV0Y2hlZC10YWJzJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRhYnMuc3RyZXRjaGVkVGFicycpLFxuXG4gICAgLy8gR2VuZXJhbCBVSSBzZXR0aW5nc1xuICAgICdhbXUtdXNlLWFuaW1hdGlvbnMnOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudWkudXNlQW5pbWF0aW9ucycpLFxuICAgICdhbXUtcGFuZWwtY29udHJhc3QnOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudWkucGFuZWxDb250cmFzdCcpLFxuICAgICdhbXUtcGFuZWwtc2hhZG93cyc6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS51aS5wYW5lbFNoYWRvd3MnKSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBhY3RpdmF0ZSgpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoY2xhc3NOYW1lcykuZm9yRWFjaChjbGFzc05hbWUgPT4gKFxuICAgICAgICAgICAgdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgY2xhc3NOYW1lc1tjbGFzc05hbWVdKSksXG4gICAgICAgICk7XG5cbiAgICAgICAgc2V0Rm9udFNpemUoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmZvbnRzLmZvbnRTaXplJykpO1xuICAgIH0sXG5cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgICAvLyBSZXNldCBhbGwgdGhlIHRoaW5ncyFcbiAgICAgICAgT2JqZWN0LmtleXMoY2xhc3NOYW1lcykuZm9yRWFjaChjbGFzc05hbWUgPT4gdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgZmFsc2UpKTtcbiAgICAgICAgc2V0Rm9udFNpemUobnVsbCk7XG4gICAgfSxcbn07XG4iXX0=