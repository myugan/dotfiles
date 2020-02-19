function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/* eslint-env jasmine */

var _libAutocompleteGocodeproviderHelper = require('../../lib/autocomplete/gocodeprovider-helper');

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

describe('gocodeprovider-helper', function () {
  describe('getPackage', function () {
    function normalize(v) {
      return (process.platform === 'win32' ? 'C:' : '') + path.normalize(v);
    }
    it('returns a non-vendored package if `useVendor` is false', function () {
      var pkg = (0, _libAutocompleteGocodeproviderHelper.getPackage)(normalize('/Users/me/go/src/github.com/foo/server/main.go'), normalize('/Users/me/go'), ['github.com/foo/server/vendor/github.com/bar/lib', 'github.com/foo/lib'], false // <-- vendor is not active
      );
      expect(pkg).toBe('github.com/foo/lib');
    });

    it('returns a vendored package if `useVendor` is true', function () {
      var pkg = (0, _libAutocompleteGocodeproviderHelper.getPackage)(normalize('/Users/me/go/src/github.com/foo/server/main.go'), normalize('/Users/me/go'), ['github.com/foo/server/vendor/github.com/bar/lib', 'github.com/foo/lib'], true // <-- vendor is active
      );
      expect(pkg).toBe('github.com/bar/lib');
    });

    it('gets vendored package if inside sub package', function () {
      var pkg = (0, _libAutocompleteGocodeproviderHelper.getPackage)(normalize('/Users/me/go/src/github.com/foo/server/sub/sub.go'), // <-- inside sub package
      normalize('/Users/me/go'), ['github.com/foo/server/vendor/github.com/bar/lib', 'github.com/foo/lib'], true);
      expect(pkg).toBe('github.com/bar/lib');
    });

    it('ignores nested vendored packages', function () {
      var pkg = (0, _libAutocompleteGocodeproviderHelper.getPackage)(normalize('/Users/me/go/src/github.com/foo/server/main.go'), normalize('/Users/me/go'), ['github.com/foo/server/vendor/github.com/bar/lib/vendor/github.com/baz/other'], true);
      expect(pkg).toBeFalsy();
    });

    it('returns non-vendored package if vendor does not match', function () {
      var pkg = (0, _libAutocompleteGocodeproviderHelper.getPackage)(normalize('/Users/me/go/src/github.com/foo/server/main.go'), normalize('/Users/me/go'), [
      // ignores this package because it is inside the "bar" package not "foo"
      'github.com/bar/server/vendor/github.com/baz/lib',
      // returns this because no vendored package matches
      'github.com/qux/lib'], true);
      expect(pkg).toBe('github.com/qux/lib');
    });

    it('returns another vendored package inside a vendored package', function () {
      var pkg = (0, _libAutocompleteGocodeproviderHelper.getPackage)(
      // a file inside a vendored package ...
      normalize('/Users/me/go/src/github.com/foo/server/vendor/github.com/bar/lib/lib.go'), normalize('/Users/me/go'), [
      // ... is allowed to use another vendored package
      'github.com/foo/server/vendor/github.com/baz/other'], true);
      expect(pkg).toBe('github.com/baz/other');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9hdXRvY29tcGxldGUvZ29jb2RlcHJvdmlkZXItaGVscGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzttREFHMkIsOENBQThDOztvQkFDbkQsTUFBTTs7SUFBaEIsSUFBSTs7QUFKaEIsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxZQUFNO0FBQ3RDLFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTtBQUMzQixhQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDcEIsYUFBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3RFO0FBQ0QsTUFBRSxDQUFDLHdEQUF3RCxFQUFFLFlBQU07QUFDakUsVUFBTSxHQUFHLEdBQUcscURBQ1YsU0FBUyxDQUFDLGdEQUFnRCxDQUFDLEVBQzNELFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFDekIsQ0FDRSxpREFBaUQsRUFDakQsb0JBQW9CLENBQ3JCLEVBQ0QsS0FBSztPQUNOLENBQUE7QUFDRCxZQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7S0FDdkMsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxtREFBbUQsRUFBRSxZQUFNO0FBQzVELFVBQU0sR0FBRyxHQUFHLHFEQUNWLFNBQVMsQ0FBQyxnREFBZ0QsQ0FBQyxFQUMzRCxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQ3pCLENBQ0UsaURBQWlELEVBQ2pELG9CQUFvQixDQUNyQixFQUNELElBQUk7T0FDTCxDQUFBO0FBQ0QsWUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0tBQ3ZDLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUN0RCxVQUFNLEdBQUcsR0FBRyxxREFDVixTQUFTLENBQUMsbURBQW1ELENBQUM7QUFDOUQsZUFBUyxDQUFDLGNBQWMsQ0FBQyxFQUN6QixDQUNFLGlEQUFpRCxFQUNqRCxvQkFBb0IsQ0FDckIsRUFDRCxJQUFJLENBQ0wsQ0FBQTtBQUNELFlBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtLQUN2QyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLGtDQUFrQyxFQUFFLFlBQU07QUFDM0MsVUFBTSxHQUFHLEdBQUcscURBQ1YsU0FBUyxDQUFDLGdEQUFnRCxDQUFDLEVBQzNELFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFDekIsQ0FDRSw2RUFBNkUsQ0FDOUUsRUFDRCxJQUFJLENBQ0wsQ0FBQTtBQUNELFlBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUN4QixDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLHVEQUF1RCxFQUFFLFlBQU07QUFDaEUsVUFBTSxHQUFHLEdBQUcscURBQ1YsU0FBUyxDQUFDLGdEQUFnRCxDQUFDLEVBQzNELFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFDekI7O0FBRUUsdURBQWlEOztBQUVqRCwwQkFBb0IsQ0FDckIsRUFDRCxJQUFJLENBQ0wsQ0FBQTtBQUNELFlBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtLQUN2QyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDREQUE0RCxFQUFFLFlBQU07QUFDckUsVUFBTSxHQUFHLEdBQUc7O0FBRVYsZUFBUyxDQUNQLHlFQUF5RSxDQUMxRSxFQUNELFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFDekI7O0FBRUUseURBQW1ELENBQ3BELEVBQ0QsSUFBSSxDQUNMLENBQUE7QUFDRCxZQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7S0FDekMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9hdXRvY29tcGxldGUvZ29jb2RlcHJvdmlkZXItaGVscGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCB7IGdldFBhY2thZ2UgfSBmcm9tICcuLi8uLi9saWIvYXV0b2NvbXBsZXRlL2dvY29kZXByb3ZpZGVyLWhlbHBlcidcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcblxuZGVzY3JpYmUoJ2dvY29kZXByb3ZpZGVyLWhlbHBlcicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2dldFBhY2thZ2UnLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKHYpIHtcbiAgICAgIHJldHVybiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICdDOicgOiAnJykgKyBwYXRoLm5vcm1hbGl6ZSh2KVxuICAgIH1cbiAgICBpdCgncmV0dXJucyBhIG5vbi12ZW5kb3JlZCBwYWNrYWdlIGlmIGB1c2VWZW5kb3JgIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGtnID0gZ2V0UGFja2FnZShcbiAgICAgICAgbm9ybWFsaXplKCcvVXNlcnMvbWUvZ28vc3JjL2dpdGh1Yi5jb20vZm9vL3NlcnZlci9tYWluLmdvJyksXG4gICAgICAgIG5vcm1hbGl6ZSgnL1VzZXJzL21lL2dvJyksXG4gICAgICAgIFtcbiAgICAgICAgICAnZ2l0aHViLmNvbS9mb28vc2VydmVyL3ZlbmRvci9naXRodWIuY29tL2Jhci9saWInLFxuICAgICAgICAgICdnaXRodWIuY29tL2Zvby9saWInXG4gICAgICAgIF0sXG4gICAgICAgIGZhbHNlIC8vIDwtLSB2ZW5kb3IgaXMgbm90IGFjdGl2ZVxuICAgICAgKVxuICAgICAgZXhwZWN0KHBrZykudG9CZSgnZ2l0aHViLmNvbS9mb28vbGliJylcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgYSB2ZW5kb3JlZCBwYWNrYWdlIGlmIGB1c2VWZW5kb3JgIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwa2cgPSBnZXRQYWNrYWdlKFxuICAgICAgICBub3JtYWxpemUoJy9Vc2Vycy9tZS9nby9zcmMvZ2l0aHViLmNvbS9mb28vc2VydmVyL21haW4uZ28nKSxcbiAgICAgICAgbm9ybWFsaXplKCcvVXNlcnMvbWUvZ28nKSxcbiAgICAgICAgW1xuICAgICAgICAgICdnaXRodWIuY29tL2Zvby9zZXJ2ZXIvdmVuZG9yL2dpdGh1Yi5jb20vYmFyL2xpYicsXG4gICAgICAgICAgJ2dpdGh1Yi5jb20vZm9vL2xpYidcbiAgICAgICAgXSxcbiAgICAgICAgdHJ1ZSAvLyA8LS0gdmVuZG9yIGlzIGFjdGl2ZVxuICAgICAgKVxuICAgICAgZXhwZWN0KHBrZykudG9CZSgnZ2l0aHViLmNvbS9iYXIvbGliJylcbiAgICB9KVxuXG4gICAgaXQoJ2dldHMgdmVuZG9yZWQgcGFja2FnZSBpZiBpbnNpZGUgc3ViIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwa2cgPSBnZXRQYWNrYWdlKFxuICAgICAgICBub3JtYWxpemUoJy9Vc2Vycy9tZS9nby9zcmMvZ2l0aHViLmNvbS9mb28vc2VydmVyL3N1Yi9zdWIuZ28nKSwgLy8gPC0tIGluc2lkZSBzdWIgcGFja2FnZVxuICAgICAgICBub3JtYWxpemUoJy9Vc2Vycy9tZS9nbycpLFxuICAgICAgICBbXG4gICAgICAgICAgJ2dpdGh1Yi5jb20vZm9vL3NlcnZlci92ZW5kb3IvZ2l0aHViLmNvbS9iYXIvbGliJyxcbiAgICAgICAgICAnZ2l0aHViLmNvbS9mb28vbGliJ1xuICAgICAgICBdLFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgICBleHBlY3QocGtnKS50b0JlKCdnaXRodWIuY29tL2Jhci9saWInKVxuICAgIH0pXG5cbiAgICBpdCgnaWdub3JlcyBuZXN0ZWQgdmVuZG9yZWQgcGFja2FnZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwa2cgPSBnZXRQYWNrYWdlKFxuICAgICAgICBub3JtYWxpemUoJy9Vc2Vycy9tZS9nby9zcmMvZ2l0aHViLmNvbS9mb28vc2VydmVyL21haW4uZ28nKSxcbiAgICAgICAgbm9ybWFsaXplKCcvVXNlcnMvbWUvZ28nKSxcbiAgICAgICAgW1xuICAgICAgICAgICdnaXRodWIuY29tL2Zvby9zZXJ2ZXIvdmVuZG9yL2dpdGh1Yi5jb20vYmFyL2xpYi92ZW5kb3IvZ2l0aHViLmNvbS9iYXovb3RoZXInXG4gICAgICAgIF0sXG4gICAgICAgIHRydWVcbiAgICAgIClcbiAgICAgIGV4cGVjdChwa2cpLnRvQmVGYWxzeSgpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIG5vbi12ZW5kb3JlZCBwYWNrYWdlIGlmIHZlbmRvciBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBrZyA9IGdldFBhY2thZ2UoXG4gICAgICAgIG5vcm1hbGl6ZSgnL1VzZXJzL21lL2dvL3NyYy9naXRodWIuY29tL2Zvby9zZXJ2ZXIvbWFpbi5nbycpLFxuICAgICAgICBub3JtYWxpemUoJy9Vc2Vycy9tZS9nbycpLFxuICAgICAgICBbXG4gICAgICAgICAgLy8gaWdub3JlcyB0aGlzIHBhY2thZ2UgYmVjYXVzZSBpdCBpcyBpbnNpZGUgdGhlIFwiYmFyXCIgcGFja2FnZSBub3QgXCJmb29cIlxuICAgICAgICAgICdnaXRodWIuY29tL2Jhci9zZXJ2ZXIvdmVuZG9yL2dpdGh1Yi5jb20vYmF6L2xpYicsXG4gICAgICAgICAgLy8gcmV0dXJucyB0aGlzIGJlY2F1c2Ugbm8gdmVuZG9yZWQgcGFja2FnZSBtYXRjaGVzXG4gICAgICAgICAgJ2dpdGh1Yi5jb20vcXV4L2xpYidcbiAgICAgICAgXSxcbiAgICAgICAgdHJ1ZVxuICAgICAgKVxuICAgICAgZXhwZWN0KHBrZykudG9CZSgnZ2l0aHViLmNvbS9xdXgvbGliJylcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgYW5vdGhlciB2ZW5kb3JlZCBwYWNrYWdlIGluc2lkZSBhIHZlbmRvcmVkIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwa2cgPSBnZXRQYWNrYWdlKFxuICAgICAgICAvLyBhIGZpbGUgaW5zaWRlIGEgdmVuZG9yZWQgcGFja2FnZSAuLi5cbiAgICAgICAgbm9ybWFsaXplKFxuICAgICAgICAgICcvVXNlcnMvbWUvZ28vc3JjL2dpdGh1Yi5jb20vZm9vL3NlcnZlci92ZW5kb3IvZ2l0aHViLmNvbS9iYXIvbGliL2xpYi5nbydcbiAgICAgICAgKSxcbiAgICAgICAgbm9ybWFsaXplKCcvVXNlcnMvbWUvZ28nKSxcbiAgICAgICAgW1xuICAgICAgICAgIC8vIC4uLiBpcyBhbGxvd2VkIHRvIHVzZSBhbm90aGVyIHZlbmRvcmVkIHBhY2thZ2VcbiAgICAgICAgICAnZ2l0aHViLmNvbS9mb28vc2VydmVyL3ZlbmRvci9naXRodWIuY29tL2Jhei9vdGhlcidcbiAgICAgICAgXSxcbiAgICAgICAgdHJ1ZVxuICAgICAgKVxuICAgICAgZXhwZWN0KHBrZykudG9CZSgnZ2l0aHViLmNvbS9iYXovb3RoZXInKVxuICAgIH0pXG4gIH0pXG59KVxuIl19