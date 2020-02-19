Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

function writeConfigFile(content) {
    var reload = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    return new Promise(function (resolve, reject) {
        if (!content) return reject({ success: false, error: 'No content given' });

        _fs2['default'].writeFile(__dirname + '/../../styles/user-settings.less', content, 'utf8', function (error) {
            if (error) return reject({ success: false, error: 'Failed to write settings file' });

            if (reload) {
                (function () {
                    var amuPackage = atom.packages.getLoadedPackage('atom-material-ui');

                    if (amuPackage) {
                        amuPackage.deactivate();
                        setImmediate(function () {
                            return amuPackage.activate();
                        });
                    }
                })();
            }

            return resolve({ success: true, error: null });
        });

        return resolve({ success: true, error: null });
    });
}

exports['default'] = writeConfigFile;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2hlbHBlci93cml0ZS1jb25maWctZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBRWUsSUFBSTs7OztBQUZuQixXQUFXLENBQUM7O0FBSVosU0FBUyxlQUFlLENBQUMsT0FBTyxFQUFrQjtRQUFoQixNQUFNLHlEQUFHLEtBQUs7O0FBQzVDLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3BDLFlBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7O0FBRTNFLHdCQUFHLFNBQVMsQ0FBSSxTQUFTLHVDQUFvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3JGLGdCQUFJLEtBQUssRUFBRSxPQUFPLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQzs7QUFFckYsZ0JBQUksTUFBTSxFQUFFOztBQUNSLHdCQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRXRFLHdCQUFJLFVBQVUsRUFBRTtBQUNaLGtDQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDeEIsb0NBQVksQ0FBQzttQ0FBTSxVQUFVLENBQUMsUUFBUSxFQUFFO3lCQUFBLENBQUMsQ0FBQztxQkFDN0M7O2FBQ0o7O0FBRUQsbUJBQU8sT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNsRCxDQUFDLENBQUM7O0FBRUgsZUFBTyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ2xELENBQUMsQ0FBQztDQUNOOztxQkFFYyxlQUFlIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2hlbHBlci93cml0ZS1jb25maWctZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5mdW5jdGlvbiB3cml0ZUNvbmZpZ0ZpbGUoY29udGVudCwgcmVsb2FkID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoIWNvbnRlbnQpIHJldHVybiByZWplY3QoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBjb250ZW50IGdpdmVuJyB9KTtcblxuICAgICAgICBmcy53cml0ZUZpbGUoYCR7X19kaXJuYW1lfS8uLi8uLi9zdHlsZXMvdXNlci1zZXR0aW5ncy5sZXNzYCwgY29udGVudCwgJ3V0ZjgnLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikgcmV0dXJuIHJlamVjdCh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ZhaWxlZCB0byB3cml0ZSBzZXR0aW5ncyBmaWxlJyB9KTtcblxuICAgICAgICAgICAgaWYgKHJlbG9hZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFtdVBhY2thZ2UgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2F0b20tbWF0ZXJpYWwtdWknKTtcblxuICAgICAgICAgICAgICAgIGlmIChhbXVQYWNrYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFtdVBhY2thZ2UuZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4gYW11UGFja2FnZS5hY3RpdmF0ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHsgc3VjY2VzczogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXNvbHZlKHsgc3VjY2VzczogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHdyaXRlQ29uZmlnRmlsZTtcbiJdfQ==