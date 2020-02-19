function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libFontsSetFontSize = require('../../lib/fonts/set-font-size');

var _libFontsSetFontSize2 = _interopRequireDefault(_libFontsSetFontSize);

'use babel';

describe('Font size setter', function () {
    var root = document.documentElement;

    it('should be able to change root element\'s font-size', function () {
        expect(root.style.fontSize).toBe('');
        (0, _libFontsSetFontSize2['default'])(22);
        expect(root.style.fontSize).toBe('22px');
    });

    it('should be able to unset root element\'s font-size', function () {
        (0, _libFontsSetFontSize2['default'])(22);
        expect(root.style.fontSize).toBe('22px');
        (0, _libFontsSetFontSize2['default'])(null);
        expect(root.style.fontSize).toBe('');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9mb250cy9zZXQtZm9udC1zaXplLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7bUNBRXdCLCtCQUErQjs7OztBQUZ2RCxXQUFXLENBQUM7O0FBSVosUUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDL0IsUUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzs7QUFFdEMsTUFBRSxDQUFDLG9EQUFvRCxFQUFFLFlBQU07QUFDM0QsY0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLDhDQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLGNBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM1QyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLG1EQUFtRCxFQUFFLFlBQU07QUFDMUQsOENBQVksRUFBRSxDQUFDLENBQUM7QUFDaEIsY0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLDhDQUFZLElBQUksQ0FBQyxDQUFDO0FBQ2xCLGNBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN4QyxDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL2ZvbnRzL3NldC1mb250LXNpemUtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgc2V0Rm9udFNpemUgZnJvbSAnLi4vLi4vbGliL2ZvbnRzL3NldC1mb250LXNpemUnO1xuXG5kZXNjcmliZSgnRm9udCBzaXplIHNldHRlcicsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGNoYW5nZSByb290IGVsZW1lbnRcXCdzIGZvbnQtc2l6ZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJvb3Quc3R5bGUuZm9udFNpemUpLnRvQmUoJycpO1xuICAgICAgICBzZXRGb250U2l6ZSgyMik7XG4gICAgICAgIGV4cGVjdChyb290LnN0eWxlLmZvbnRTaXplKS50b0JlKCcyMnB4Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gdW5zZXQgcm9vdCBlbGVtZW50XFwncyBmb250LXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHNldEZvbnRTaXplKDIyKTtcbiAgICAgICAgZXhwZWN0KHJvb3Quc3R5bGUuZm9udFNpemUpLnRvQmUoJzIycHgnKTtcbiAgICAgICAgc2V0Rm9udFNpemUobnVsbCk7XG4gICAgICAgIGV4cGVjdChyb290LnN0eWxlLmZvbnRTaXplKS50b0JlKCcnKTtcbiAgICB9KTtcbn0pO1xuIl19