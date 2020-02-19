function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _libHelpers = require('../lib/helpers');

var Helpers = _interopRequireWildcard(_libHelpers);

describe('Helpers', function () {
  describe('processListItems', function () {
    it('works', function () {
      var suggestions = [{
        priority: 100,
        title: 'title 1',
        'class': 'class1',
        selected: function selected() {},
        icon: 'icon1'
      }, {
        priority: 200,
        title: 'title 2',
        'class': 'class2',
        selected: function selected() {}
      }];
      suggestions = Helpers.processListItems(suggestions);
      expect(suggestions[0].priority).toBe(200);
      expect(suggestions[0][Helpers.$class]).toBe('class2');
      expect(suggestions[1].priority).toBe(100);
      expect(suggestions[1][Helpers.$class]).toBe('class1 icon icon-icon1');
    });
  });
  describe('showError', function () {
    it('works well with error objects', function () {
      var error = new Error('Something');
      Helpers.showError(error);
      var notification = atom.notifications.getNotifications()[0];
      expect(notification).toBeDefined();
      expect(notification.message).toBe('[Intentions] Something');
      expect(notification.options.detail).toBe(error.stack);
    });
    it('works well with strings', function () {
      var title = 'Some Title';
      var detail = 'Some Detail';

      Helpers.showError(title, detail);
      var notification = atom.notifications.getNotifications()[0];
      expect(notification).toBeDefined();
      expect(notification.message).toBe('[Intentions] ' + title);
      expect(notification.options.detail).toBe(detail);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvc3BlYy9oZWxwZXJzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MEJBRXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7QUFFbkIsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFXO0FBQzdCLFVBQVEsQ0FBQyxrQkFBa0IsRUFBRSxZQUFXO0FBQ3RDLE1BQUUsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUNyQixVQUFJLFdBQTBCLEdBQUcsQ0FDL0I7QUFDRSxnQkFBUSxFQUFFLEdBQUc7QUFDYixhQUFLLEVBQUUsU0FBUztBQUNoQixpQkFBTyxRQUFRO0FBQ2YsZ0JBQVEsRUFBQSxvQkFBRyxFQUFFO0FBQ2IsWUFBSSxFQUFFLE9BQU87T0FDZCxFQUNEO0FBQ0UsZ0JBQVEsRUFBRSxHQUFHO0FBQ2IsYUFBSyxFQUFFLFNBQVM7QUFDaEIsaUJBQU8sUUFBUTtBQUNmLGdCQUFRLEVBQUEsb0JBQUcsRUFBRTtPQUNkLENBQ0YsQ0FBQTtBQUNELGlCQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ25ELFlBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pDLFlBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JELFlBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pDLFlBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUE7S0FDdEUsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0FBQ0YsVUFBUSxDQUFDLFdBQVcsRUFBRSxZQUFXO0FBQy9CLE1BQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFXO0FBQzdDLFVBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDeEIsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdELFlBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQyxZQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzNELFlBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdEQsQ0FBQyxDQUFBO0FBQ0YsTUFBRSxDQUFDLHlCQUF5QixFQUFFLFlBQVc7QUFDdkMsVUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFBO0FBQzFCLFVBQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQTs7QUFFNUIsYUFBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDaEMsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdELFlBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQyxZQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLENBQUE7QUFDMUQsWUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ2pELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvaGVscGVycy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuLi9saWIvaGVscGVycydcblxuZGVzY3JpYmUoJ0hlbHBlcnMnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3Byb2Nlc3NMaXN0SXRlbXMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnd29ya3MnLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzdWdnZXN0aW9uczogQXJyYXk8T2JqZWN0PiA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHByaW9yaXR5OiAxMDAsXG4gICAgICAgICAgdGl0bGU6ICd0aXRsZSAxJyxcbiAgICAgICAgICBjbGFzczogJ2NsYXNzMScsXG4gICAgICAgICAgc2VsZWN0ZWQoKSB7fSxcbiAgICAgICAgICBpY29uOiAnaWNvbjEnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJpb3JpdHk6IDIwMCxcbiAgICAgICAgICB0aXRsZTogJ3RpdGxlIDInLFxuICAgICAgICAgIGNsYXNzOiAnY2xhc3MyJyxcbiAgICAgICAgICBzZWxlY3RlZCgpIHt9LFxuICAgICAgICB9LFxuICAgICAgXVxuICAgICAgc3VnZ2VzdGlvbnMgPSBIZWxwZXJzLnByb2Nlc3NMaXN0SXRlbXMoc3VnZ2VzdGlvbnMpXG4gICAgICBleHBlY3Qoc3VnZ2VzdGlvbnNbMF0ucHJpb3JpdHkpLnRvQmUoMjAwKVxuICAgICAgZXhwZWN0KHN1Z2dlc3Rpb25zWzBdW0hlbHBlcnMuJGNsYXNzXSkudG9CZSgnY2xhc3MyJylcbiAgICAgIGV4cGVjdChzdWdnZXN0aW9uc1sxXS5wcmlvcml0eSkudG9CZSgxMDApXG4gICAgICBleHBlY3Qoc3VnZ2VzdGlvbnNbMV1bSGVscGVycy4kY2xhc3NdKS50b0JlKCdjbGFzczEgaWNvbiBpY29uLWljb24xJylcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgnc2hvd0Vycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3dvcmtzIHdlbGwgd2l0aCBlcnJvciBvYmplY3RzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignU29tZXRoaW5nJylcbiAgICAgIEhlbHBlcnMuc2hvd0Vycm9yKGVycm9yKVxuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKVswXVxuICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5tZXNzYWdlKS50b0JlKCdbSW50ZW50aW9uc10gU29tZXRoaW5nJylcbiAgICAgIGV4cGVjdChub3RpZmljYXRpb24ub3B0aW9ucy5kZXRhaWwpLnRvQmUoZXJyb3Iuc3RhY2spXG4gICAgfSlcbiAgICBpdCgnd29ya3Mgd2VsbCB3aXRoIHN0cmluZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gJ1NvbWUgVGl0bGUnXG4gICAgICBjb25zdCBkZXRhaWwgPSAnU29tZSBEZXRhaWwnXG5cbiAgICAgIEhlbHBlcnMuc2hvd0Vycm9yKHRpdGxlLCBkZXRhaWwpXG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpWzBdXG4gICAgICBleHBlY3Qobm90aWZpY2F0aW9uKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3Qobm90aWZpY2F0aW9uLm1lc3NhZ2UpLnRvQmUoJ1tJbnRlbnRpb25zXSAnICsgdGl0bGUpXG4gICAgICBleHBlY3Qobm90aWZpY2F0aW9uLm9wdGlvbnMuZGV0YWlsKS50b0JlKGRldGFpbClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==