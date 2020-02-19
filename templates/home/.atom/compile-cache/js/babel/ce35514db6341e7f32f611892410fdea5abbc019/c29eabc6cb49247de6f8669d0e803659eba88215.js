function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */
/* eslint-env jasmine */

var _specHelpers = require('./spec-helpers');

var _libPanelEmptyTabView = require('./../lib/panel/empty-tab-view');

var _asyncSpecHelpers = require('./async-spec-helpers');

// eslint-disable-line

describe('panel manager', function () {
  var pm = null;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    _specHelpers.lifecycle.setup();

    yield _specHelpers.lifecycle.activatePackage();

    var mainModule = _specHelpers.lifecycle.mainModule;

    pm = mainModule.getPanelManager();
  }));

  afterEach(function () {
    _specHelpers.lifecycle.teardown();
  });

  describe('registerViewProvider', function () {
    var view = undefined;
    var model = undefined;
    var disp = undefined;

    (0, _asyncSpecHelpers.beforeEach)(function () {
      view = new _libPanelEmptyTabView.EmptyTabView();
      model = { key: 'foo', tab: { name: 'dummy' } };
      disp = pm.registerViewProvider(view, model);
    });

    afterEach(function () {
      disp.dispose();
    });

    (0, _asyncSpecHelpers.it)('records the view provider by key', function () {
      var _pm$viewProviders$get = pm.viewProviders.get(model.key);

      var v = _pm$viewProviders$get.view;
      var m = _pm$viewProviders$get.model;

      expect(v).toBe(view);
      expect(m).toBe(model);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9wYW5lbC1tYW5hZ2VyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7MkJBRzBCLGdCQUFnQjs7b0NBQ2IsK0JBQStCOztnQ0FDWixzQkFBc0I7Ozs7QUFFdEUsUUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQzlCLE1BQUksRUFBRSxHQUFHLElBQUksQ0FBQTs7QUFFYixzREFBVyxhQUFZO0FBQ3JCLDJCQUFVLEtBQUssRUFBRSxDQUFBOztBQUVqQixVQUFNLHVCQUFVLGVBQWUsRUFBRSxDQUFBOztRQUV6QixVQUFVLDBCQUFWLFVBQVU7O0FBQ2xCLE1BQUUsR0FBRyxVQUFVLENBQUMsZUFBZSxFQUFFLENBQUE7R0FDbEMsRUFBQyxDQUFBOztBQUVGLFdBQVMsQ0FBQyxZQUFNO0FBQ2QsMkJBQVUsUUFBUSxFQUFFLENBQUE7R0FDckIsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxzQkFBc0IsRUFBRSxZQUFNO0FBQ3JDLFFBQUksSUFBSSxZQUFBLENBQUE7QUFDUixRQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsUUFBSSxJQUFJLFlBQUEsQ0FBQTs7QUFFUixzQ0FBVyxZQUFNO0FBQ2YsVUFBSSxHQUFHLHdDQUFrQixDQUFBO0FBQ3pCLFdBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUE7QUFDOUMsVUFBSSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDNUMsQ0FBQyxDQUFBOztBQUVGLGFBQVMsQ0FBQyxZQUFNO0FBQ2QsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUFBOztBQUVGLDhCQUFHLGtDQUFrQyxFQUFFLFlBQU07a0NBQ2IsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7VUFBL0MsQ0FBQyx5QkFBUCxJQUFJO1VBQVksQ0FBQyx5QkFBUixLQUFLOztBQUN0QixZQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BCLFlBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdEIsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9wYW5lbC1tYW5hZ2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgbGlmZWN5Y2xlIH0gZnJvbSAnLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgeyBFbXB0eVRhYlZpZXcgfSBmcm9tICcuLy4uL2xpYi9wYW5lbC9lbXB0eS10YWItdmlldydcbmltcG9ydCB7IGl0LCBmaXQsIGZmaXQsIGJlZm9yZUVhY2gsIHJ1bnMgfSBmcm9tICcuL2FzeW5jLXNwZWMtaGVscGVycycgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG5kZXNjcmliZSgncGFuZWwgbWFuYWdlcicsICgpID0+IHtcbiAgbGV0IHBtID0gbnVsbFxuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGxpZmVjeWNsZS5zZXR1cCgpXG5cbiAgICBhd2FpdCBsaWZlY3ljbGUuYWN0aXZhdGVQYWNrYWdlKClcblxuICAgIGNvbnN0IHsgbWFpbk1vZHVsZSB9ID0gbGlmZWN5Y2xlXG4gICAgcG0gPSBtYWluTW9kdWxlLmdldFBhbmVsTWFuYWdlcigpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBsaWZlY3ljbGUudGVhcmRvd24oKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdyZWdpc3RlclZpZXdQcm92aWRlcicsICgpID0+IHtcbiAgICBsZXQgdmlld1xuICAgIGxldCBtb2RlbFxuICAgIGxldCBkaXNwXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHZpZXcgPSBuZXcgRW1wdHlUYWJWaWV3KClcbiAgICAgIG1vZGVsID0geyBrZXk6ICdmb28nLCB0YWI6IHsgbmFtZTogJ2R1bW15JyB9IH1cbiAgICAgIGRpc3AgPSBwbS5yZWdpc3RlclZpZXdQcm92aWRlcih2aWV3LCBtb2RlbClcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIGRpc3AuZGlzcG9zZSgpXG4gICAgfSlcblxuICAgIGl0KCdyZWNvcmRzIHRoZSB2aWV3IHByb3ZpZGVyIGJ5IGtleScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdmlldzogdiwgbW9kZWw6IG0gfSA9IHBtLnZpZXdQcm92aWRlcnMuZ2V0KG1vZGVsLmtleSlcbiAgICAgIGV4cGVjdCh2KS50b0JlKHZpZXcpXG4gICAgICBleHBlY3QobSkudG9CZShtb2RlbClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==