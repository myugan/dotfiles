function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libHelperToCamelCase = require('../../lib/helper/to-camel-case');

var _libHelperToCamelCase2 = _interopRequireDefault(_libHelperToCamelCase);

'use babel';

describe('camelCaseHelper', function () {
    it('should convert spaces to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello world')).toEqual('helloWorld');
    });

    it('should convert lisp-case to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello-world')).toEqual('helloWorld');
    });

    it('should convert snake_case to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello_world')).toEqual('helloWorld');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9oZWxwZXIvdG8tY2FtZWwtY2FzZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29DQUV3QixnQ0FBZ0M7Ozs7QUFGeEQsV0FBVyxDQUFDOztBQUlaLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQzlCLE1BQUUsQ0FBQyxvQ0FBb0MsRUFBRSxZQUFNO0FBQzNDLGNBQU0sQ0FBQyx1Q0FBWSxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHVDQUF1QyxFQUFFLFlBQU07QUFDOUMsY0FBTSxDQUFDLHVDQUFZLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsd0NBQXdDLEVBQUUsWUFBTTtBQUMvQyxjQUFNLENBQUMsdUNBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUQsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9oZWxwZXIvdG8tY2FtZWwtY2FzZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB0b0NhbWVsQ2FzZSBmcm9tICcuLi8uLi9saWIvaGVscGVyL3RvLWNhbWVsLWNhc2UnO1xuXG5kZXNjcmliZSgnY2FtZWxDYXNlSGVscGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29udmVydCBzcGFjZXMgdG8gY2FtZWxDYXNlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9DYW1lbENhc2UoJ2hlbGxvIHdvcmxkJykpLnRvRXF1YWwoJ2hlbGxvV29ybGQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY29udmVydCBsaXNwLWNhc2UgdG8gY2FtZWxDYXNlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9DYW1lbENhc2UoJ2hlbGxvLXdvcmxkJykpLnRvRXF1YWwoJ2hlbGxvV29ybGQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY29udmVydCBzbmFrZV9jYXNlIHRvIGNhbWVsQ2FzZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvQ2FtZWxDYXNlKCdoZWxsb193b3JsZCcpKS50b0VxdWFsKCdoZWxsb1dvcmxkJyk7XG4gICAgfSk7XG59KTtcbiJdfQ==