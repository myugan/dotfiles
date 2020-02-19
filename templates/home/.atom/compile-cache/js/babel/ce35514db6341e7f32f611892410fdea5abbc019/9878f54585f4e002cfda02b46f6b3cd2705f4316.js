Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var SelectListView = undefined;

var ToggleProviders = (function () {
  function ToggleProviders(action, providers) {
    var _this = this;

    _classCallCheck(this, ToggleProviders);

    this.action = action;
    this.emitter = new _atom.Emitter();
    this.providers = providers;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
  }

  _createClass(ToggleProviders, [{
    key: 'getItems',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      if (this.action === 'disable') {
        return this.providers.filter(function (name) {
          return !_this2.disabledProviders.includes(name);
        });
      }
      return this.disabledProviders;
    })
  }, {
    key: 'process',
    value: _asyncToGenerator(function* (name) {
      if (this.action === 'disable') {
        this.disabledProviders.push(name);
        this.emitter.emit('did-disable', name);
      } else {
        var index = this.disabledProviders.indexOf(name);
        if (index !== -1) {
          this.disabledProviders.splice(index, 1);
        }
      }
      atom.config.set('linter.disabledProviders', this.disabledProviders);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      if (!SelectListView) {
        SelectListView = require('atom-select-list');
      }
      var selectListView = new SelectListView({
        items: yield this.getItems(),
        emptyMessage: 'No matches found',
        elementForItem: function elementForItem(item) {
          var li = document.createElement('li');
          li.textContent = item;
          return li;
        },
        didConfirmSelection: function didConfirmSelection(item) {
          _this3.process(item)['catch'](function (e) {
            return console.error('[Linter] Unable to process toggle:', e);
          }).then(function () {
            return _this3.dispose();
          });
        },
        didCancelSelection: function didCancelSelection() {
          _this3.dispose();
        },
        didConfirmEmptySelection: function didConfirmEmptySelection() {
          _this3.dispose();
        }
      });
      var panel = atom.workspace.addModalPanel({ item: selectListView });

      selectListView.focus();
      this.subscriptions.add(new _atom.Disposable(function () {
        panel.destroy();
      }));
    })
  }, {
    key: 'onDidDispose',
    value: function onDidDispose(callback) {
      return this.emitter.on('did-dispose', callback);
    }
  }, {
    key: 'onDidDisable',
    value: function onDidDisable(callback) {
      return this.emitter.on('did-disable', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-dispose');
      this.subscriptions.dispose();
    }
  }]);

  return ToggleProviders;
})();

exports['default'] = ToggleProviders;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdG9nZ2xlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFeUQsTUFBTTs7QUFFL0QsSUFBSSxjQUFjLFlBQUEsQ0FBQTs7SUFHWixlQUFlO0FBT1IsV0FQUCxlQUFlLENBT1AsTUFBb0IsRUFBRSxTQUF3QixFQUFFOzs7MEJBUHhELGVBQWU7O0FBUWpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFLFVBQUEsaUJBQWlCLEVBQUk7QUFDbkUsWUFBSyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQTtLQUMzQyxDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQW5CRyxlQUFlOzs2QkFvQkwsYUFBMkI7OztBQUN2QyxVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzdCLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO2lCQUFJLENBQUMsT0FBSyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1NBQUEsQ0FBQyxDQUFBO09BQzdFO0FBQ0QsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7S0FDOUI7Ozs2QkFDWSxXQUFDLElBQVksRUFBaUI7QUFDekMsVUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUM3QixZQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2pDLFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN2QyxNQUFNO0FBQ0wsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNsRCxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNoQixjQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUN4QztPQUNGO0FBQ0QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7S0FDcEU7Ozs2QkFDUyxhQUFHOzs7QUFDWCxVQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLHNCQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7T0FDN0M7QUFDRCxVQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQztBQUN4QyxhQUFLLEVBQUUsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzVCLG9CQUFZLEVBQUUsa0JBQWtCO0FBQ2hDLHNCQUFjLEVBQUUsd0JBQUEsSUFBSSxFQUFJO0FBQ3RCLGNBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkMsWUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDckIsaUJBQU8sRUFBRSxDQUFBO1NBQ1Y7QUFDRCwyQkFBbUIsRUFBRSw2QkFBQSxJQUFJLEVBQUk7QUFDM0IsaUJBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxTQUNWLENBQUMsVUFBQSxDQUFDO21CQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUNsRSxJQUFJLENBQUM7bUJBQU0sT0FBSyxPQUFPLEVBQUU7V0FBQSxDQUFDLENBQUE7U0FDOUI7QUFDRCwwQkFBa0IsRUFBRSw4QkFBTTtBQUN4QixpQkFBSyxPQUFPLEVBQUUsQ0FBQTtTQUNmO0FBQ0QsZ0NBQXdCLEVBQUUsb0NBQU07QUFDOUIsaUJBQUssT0FBTyxFQUFFLENBQUE7U0FDZjtPQUNGLENBQUMsQ0FBQTtBQUNGLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUE7O0FBRXBFLG9CQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLHFCQUFlLFlBQVc7QUFDeEIsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2hCLENBQUMsQ0FDSCxDQUFBO0tBQ0Y7OztXQUNXLHNCQUFDLFFBQW1CLEVBQWM7QUFDNUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNXLHNCQUFDLFFBQStCLEVBQWM7QUFDeEQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBaEZHLGVBQWU7OztxQkFtRk4sZUFBZSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3RvZ2dsZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmxldCBTZWxlY3RMaXN0Vmlld1xudHlwZSBUb2dnbGVBY3Rpb24gPSAnZW5hYmxlJyB8ICdkaXNhYmxlJ1xuXG5jbGFzcyBUb2dnbGVQcm92aWRlcnMge1xuICBhY3Rpb246IFRvZ2dsZUFjdGlvblxuICBlbWl0dGVyOiBFbWl0dGVyXG4gIHByb3ZpZGVyczogQXJyYXk8c3RyaW5nPlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGRpc2FibGVkUHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+XG5cbiAgY29uc3RydWN0b3IoYWN0aW9uOiBUb2dnbGVBY3Rpb24sIHByb3ZpZGVyczogQXJyYXk8c3RyaW5nPikge1xuICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMucHJvdmlkZXJzID0gcHJvdmlkZXJzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIGRpc2FibGVkUHJvdmlkZXJzID0+IHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZFByb3ZpZGVycyA9IGRpc2FibGVkUHJvdmlkZXJzXG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgYXN5bmMgZ2V0SXRlbXMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgaWYgKHRoaXMuYWN0aW9uID09PSAnZGlzYWJsZScpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5maWx0ZXIobmFtZSA9PiAhdGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmNsdWRlcyhuYW1lKSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWRQcm92aWRlcnNcbiAgfVxuICBhc3luYyBwcm9jZXNzKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ2Rpc2FibGUnKSB7XG4gICAgICB0aGlzLmRpc2FibGVkUHJvdmlkZXJzLnB1c2gobmFtZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGlzYWJsZScsIG5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmRleE9mKG5hbWUpXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgfVxuICAgIH1cbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMpXG4gIH1cbiAgYXN5bmMgc2hvdygpIHtcbiAgICBpZiAoIVNlbGVjdExpc3RWaWV3KSB7XG4gICAgICBTZWxlY3RMaXN0VmlldyA9IHJlcXVpcmUoJ2F0b20tc2VsZWN0LWxpc3QnKVxuICAgIH1cbiAgICBjb25zdCBzZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtczogYXdhaXQgdGhpcy5nZXRJdGVtcygpLFxuICAgICAgZW1wdHlNZXNzYWdlOiAnTm8gbWF0Y2hlcyBmb3VuZCcsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS50ZXh0Q29udGVudCA9IGl0ZW1cbiAgICAgICAgcmV0dXJuIGxpXG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogaXRlbSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2VzcyhpdGVtKVxuICAgICAgICAgIC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXJdIFVuYWJsZSB0byBwcm9jZXNzIHRvZ2dsZTonLCBlKSlcbiAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmRpc3Bvc2UoKSlcbiAgICAgIH0sXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICAgIH0sXG4gICAgICBkaWRDb25maXJtRW1wdHlTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICAgIH0sXG4gICAgfSlcbiAgICBjb25zdCBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiBzZWxlY3RMaXN0VmlldyB9KVxuXG4gICAgc2VsZWN0TGlzdFZpZXcuZm9jdXMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgICAgcGFuZWwuZGVzdHJveSgpXG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgb25EaWREaXNwb3NlKGNhbGxiYWNrOiAoKSA9PiBhbnkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGlzcG9zZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRGlzYWJsZShjYWxsYmFjazogKG5hbWU6IHN0cmluZykgPT4gYW55KTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRpc2FibGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGlzcG9zZScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvZ2dsZVByb3ZpZGVyc1xuIl19