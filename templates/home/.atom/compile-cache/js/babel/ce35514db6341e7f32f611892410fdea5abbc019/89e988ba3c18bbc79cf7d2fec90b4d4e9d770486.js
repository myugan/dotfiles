function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _setFontSize = require('./set-font-size');

var _setFontSize2 = _interopRequireDefault(_setFontSize);

'use babel';

atom.config.observe('atom-material-ui.fonts.fontSize', function (size) {
  return (0, _setFontSize2['default'])(size);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2ZvbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUV3QixpQkFBaUI7Ozs7QUFGekMsV0FBVyxDQUFDOztBQUlaLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxFQUFFLFVBQUEsSUFBSTtTQUFJLDhCQUFZLElBQUksQ0FBQztDQUFBLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9mb250cy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgc2V0Rm9udFNpemUgZnJvbSAnLi9zZXQtZm9udC1zaXplJztcblxuYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS1tYXRlcmlhbC11aS5mb250cy5mb250U2l6ZScsIHNpemUgPT4gc2V0Rm9udFNpemUoc2l6ZSkpO1xuIl19