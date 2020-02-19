function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _specHelpers = require('./../spec-helpers');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';describe('go-plus', function () {
  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();
    yield _specHelpers.lifecycle.activatePackage();
  }));

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  describe('when the go-plus package is activated', function () {
    (0, _asyncSpecHelpers.it)('activates successfully', function () {
      var mainModule = _specHelpers.lifecycle.mainModule;

      expect(mainModule).toBeDefined();
      expect(mainModule).toBeTruthy();
      expect(mainModule.activate).toBeDefined();
      expect(mainModule.deactivate).toBeDefined();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9tYWluL21haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzJCQUcwQixtQkFBbUI7O2dDQUNHLHVCQUF1Qjs7OztBQUp2RSxXQUFXLENBQUEsQUFNWCxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07QUFDeEIsc0RBQVcsYUFBWTtBQUNyQiwyQkFBVSxLQUFLLEVBQUUsQ0FBQTtBQUNqQixVQUFNLHVCQUFVLGVBQWUsRUFBRSxDQUFBO0dBQ2xDLEVBQUMsQ0FBQTs7QUFFRixXQUFTLENBQUMsWUFBTTtBQUNkLDJCQUFVLFFBQVEsRUFBRSxDQUFBO0dBQ3JCLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsdUNBQXVDLEVBQUUsWUFBTTtBQUN0RCw4QkFBRyx3QkFBd0IsRUFBRSxZQUFNO1VBQ3pCLFVBQVUsMEJBQVYsVUFBVTs7QUFDbEIsWUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2hDLFlBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMvQixZQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ3pDLFlBQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7S0FDNUMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9tYWluL21haW4tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgbGlmZWN5Y2xlIH0gZnJvbSAnLi8uLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgeyBpdCwgZml0LCBmZml0LCBiZWZvcmVFYWNoLCBydW5zIH0gZnJvbSAnLi4vYXN5bmMtc3BlYy1oZWxwZXJzJyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbmRlc2NyaWJlKCdnby1wbHVzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBsaWZlY3ljbGUuc2V0dXAoKVxuICAgIGF3YWl0IGxpZmVjeWNsZS5hY3RpdmF0ZVBhY2thZ2UoKVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgbGlmZWN5Y2xlLnRlYXJkb3duKClcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgZ28tcGx1cyBwYWNrYWdlIGlzIGFjdGl2YXRlZCcsICgpID0+IHtcbiAgICBpdCgnYWN0aXZhdGVzIHN1Y2Nlc3NmdWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgbWFpbk1vZHVsZSB9ID0gbGlmZWN5Y2xlXG4gICAgICBleHBlY3QobWFpbk1vZHVsZSkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUuYWN0aXZhdGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmRlYWN0aXZhdGUpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==