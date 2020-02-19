function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libHelperToggleClassName = require('../../lib/helper/toggle-class-name');

var _libHelperToggleClassName2 = _interopRequireDefault(_libHelperToggleClassName);

'use babel';

describe('className toggle helper', function () {
    var root = document.documentElement;

    it('should add a className to the root element', function () {
        expect(root.classList.contains('testClass')).toBe(false);
        (0, _libHelperToggleClassName2['default'])('testClass', true);
        expect(root.classList.contains('testClass')).toBe(true);
    });

    it('should remove a className from the root element', function () {
        expect(root.classList.contains('testClass')).toBe(true);
        (0, _libHelperToggleClassName2['default'])('testClass', false);
        expect(root.classList.contains('testClass')).toBe(false);
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9oZWxwZXIvdG9nZ2xlLWNsYXNzLW5hbWUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzt3Q0FFNEIsb0NBQW9DOzs7O0FBRmhFLFdBQVcsQ0FBQzs7QUFJWixRQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUN0QyxRQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDOztBQUV0QyxNQUFFLENBQUMsNENBQTRDLEVBQUUsWUFBTTtBQUNuRCxjQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekQsbURBQWdCLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxjQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0QsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxpREFBaUQsRUFBRSxZQUFNO0FBQ3hELGNBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RCxtREFBZ0IsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLGNBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL2hlbHBlci90b2dnbGUtY2xhc3MtbmFtZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB0b2dnbGVDbGFzc05hbWUgZnJvbSAnLi4vLi4vbGliL2hlbHBlci90b2dnbGUtY2xhc3MtbmFtZSc7XG5cbmRlc2NyaWJlKCdjbGFzc05hbWUgdG9nZ2xlIGhlbHBlcicsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgYSBjbGFzc05hbWUgdG8gdGhlIHJvb3QgZWxlbWVudCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJvb3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd0ZXN0Q2xhc3MnKSkudG9CZShmYWxzZSk7XG4gICAgICAgIHRvZ2dsZUNsYXNzTmFtZSgndGVzdENsYXNzJywgdHJ1ZSk7XG4gICAgICAgIGV4cGVjdChyb290LmNsYXNzTGlzdC5jb250YWlucygndGVzdENsYXNzJykpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBhIGNsYXNzTmFtZSBmcm9tIHRoZSByb290IGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyb290LmNsYXNzTGlzdC5jb250YWlucygndGVzdENsYXNzJykpLnRvQmUodHJ1ZSk7XG4gICAgICAgIHRvZ2dsZUNsYXNzTmFtZSgndGVzdENsYXNzJywgZmFsc2UpO1xuICAgICAgICBleHBlY3Qocm9vdC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rlc3RDbGFzcycpKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcbn0pO1xuIl19