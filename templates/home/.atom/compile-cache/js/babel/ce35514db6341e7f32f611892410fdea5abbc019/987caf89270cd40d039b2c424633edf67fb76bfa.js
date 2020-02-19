Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _viewList = require('./view-list');

var _viewList2 = _interopRequireDefault(_viewList);

var _providersList = require('./providers-list');

var _providersList2 = _interopRequireDefault(_providersList);

var _providersHighlight = require('./providers-highlight');

var _providersHighlight2 = _interopRequireDefault(_providersHighlight);

var Intentions = (function () {
  function Intentions() {
    var _this = this;

    _classCallCheck(this, Intentions);

    this.active = null;
    this.commands = new _commands2['default']();
    this.providersList = new _providersList2['default']();
    this.providersHighlight = new _providersHighlight2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.providersList);
    this.subscriptions.add(this.providersHighlight);

    // eslint-disable-next-line arrow-parens
    this.commands.onListShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersList.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var listView = new _viewList2['default']();
      var subscriptions = new _sbEventKit.CompositeDisposable();

      listView.activate(textEditor, results);
      listView.onDidSelect(function (intention) {
        intention.selected();
        subscriptions.dispose();
      });

      subscriptions.add(listView);
      subscriptions.add(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      });
      subscriptions.add(_this.commands.onListMove(function (movement) {
        listView.move(movement);
      }));
      subscriptions.add(_this.commands.onListConfirm(function () {
        listView.select();
      }));
      subscriptions.add(_this.commands.onListHide(function () {
        subscriptions.dispose();
      }));
      _this.active = subscriptions;
      return true;
    }));
    // eslint-disable-next-line arrow-parens
    this.commands.onHighlightsShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersHighlight.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var painted = _this.providersHighlight.paint(textEditor, results);
      var subscriptions = new _sbEventKit.CompositeDisposable();

      subscriptions.add(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      });
      subscriptions.add(_this.commands.onHighlightsHide(function () {
        subscriptions.dispose();
      }));
      subscriptions.add(painted);
      _this.active = subscriptions;

      return true;
    }));
  }

  _createClass(Intentions, [{
    key: 'activate',
    value: function activate() {
      this.commands.activate();
    }
  }, {
    key: 'consumeListProvider',
    value: function consumeListProvider(provider) {
      this.providersList.addProvider(provider);
    }
  }, {
    key: 'deleteListProvider',
    value: function deleteListProvider(provider) {
      this.providersList.deleteProvider(provider);
    }
  }, {
    key: 'consumeHighlightProvider',
    value: function consumeHighlightProvider(provider) {
      this.providersHighlight.addProvider(provider);
    }
  }, {
    key: 'deleteHighlightProvider',
    value: function deleteHighlightProvider(provider) {
      this.providersHighlight.deleteProvider(provider);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.dispose();
      }
    }
  }]);

  return Intentions;
})();

exports['default'] = Intentions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzBCQUVnRCxjQUFjOzt3QkFFekMsWUFBWTs7Ozt3QkFDWixhQUFhOzs7OzZCQUNSLGtCQUFrQjs7OztrQ0FDYix1QkFBdUI7Ozs7SUFHakMsVUFBVTtBQU1sQixXQU5RLFVBQVUsR0FNZjs7OzBCQU5LLFVBQVU7O0FBTzNCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUM5QixRQUFJLENBQUMsYUFBYSxHQUFHLGdDQUFtQixDQUFBO0FBQ3hDLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxxQ0FBd0IsQ0FBQTtBQUNsRCxRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOzs7QUFHL0MsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLG1CQUFDLFdBQU8sVUFBVSxFQUFLO0FBQzdDLFVBQU0sT0FBTyxHQUFHLE1BQU0sTUFBSyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzVELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ25CLGVBQU8sS0FBSyxDQUFBO09BQ2I7O0FBRUQsVUFBTSxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUMvQixVQUFNLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFL0MsY0FBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFD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QzVCLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdEI7S0FDRjs7O1NBL0ZrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcblxuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMnXG5pbXBvcnQgTGlzdFZpZXcgZnJvbSAnLi92aWV3LWxpc3QnXG5pbXBvcnQgUHJvdmlkZXJzTGlzdCBmcm9tICcuL3Byb3ZpZGVycy1saXN0J1xuaW1wb3J0IFByb3ZpZGVyc0hpZ2hsaWdodCBmcm9tICcuL3Byb3ZpZGVycy1oaWdobGlnaHQnXG5pbXBvcnQgdHlwZSB7IExpc3RQcm92aWRlciwgSGlnaGxpZ2h0UHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlbnRpb25zIHtcbiAgYWN0aXZlOiA/RGlzcG9zYWJsZTtcbiAgY29tbWFuZHM6IENvbW1hbmRzO1xuICBwcm92aWRlcnNMaXN0OiBQcm92aWRlcnNMaXN0O1xuICBwcm92aWRlcnNIaWdobGlnaHQ6IFByb3ZpZGVyc0hpZ2hsaWdodDtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgdGhpcy5jb21tYW5kcyA9IG5ldyBDb21tYW5kcygpXG4gICAgdGhpcy5wcm92aWRlcnNMaXN0ID0gbmV3IFByb3ZpZGVyc0xpc3QoKVxuICAgIHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0ID0gbmV3IFByb3ZpZGVyc0hpZ2hsaWdodCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5wcm92aWRlcnNMaXN0KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5wcm92aWRlcnNIaWdobGlnaHQpXG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgYXJyb3ctcGFyZW5zXG4gICAgdGhpcy5jb21tYW5kcy5vbkxpc3RTaG93KGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5wcm92aWRlcnNMaXN0LnRyaWdnZXIodGV4dEVkaXRvcilcbiAgICAgIGlmICghcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3RWaWV3ID0gbmV3IExpc3RWaWV3KClcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAgIGxpc3RWaWV3LmFjdGl2YXRlKHRleHRFZGl0b3IsIHJlc3VsdHMpXG4gICAgICBsaXN0Vmlldy5vbkRpZFNlbGVjdChmdW5jdGlvbihpbnRlbnRpb24pIHtcbiAgICAgICAgaW50ZW50aW9uLnNlbGVjdGVkKClcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pXG5cbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGxpc3RWaWV3KVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUgPT09IHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMub25MaXN0TW92ZShmdW5jdGlvbihtb3ZlbWVudCkge1xuICAgICAgICBsaXN0Vmlldy5tb3ZlKG1vdmVtZW50KVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzLm9uTGlzdENvbmZpcm0oZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpc3RWaWV3LnNlbGVjdCgpXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgdGhpcy5hY3RpdmUgPSBzdWJzY3JpcHRpb25zXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGFycm93LXBhcmVuc1xuICAgIHRoaXMuY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0LnRyaWdnZXIodGV4dEVkaXRvcilcbiAgICAgIGlmICghcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhaW50ZWQgPSB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodC5wYWludCh0ZXh0RWRpdG9yLCByZXN1bHRzKVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUgPT09IHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQocGFpbnRlZClcbiAgICAgIHRoaXMuYWN0aXZlID0gc3Vic2NyaXB0aW9uc1xuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG4gIH1cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5jb21tYW5kcy5hY3RpdmF0ZSgpXG4gIH1cbiAgY29uc3VtZUxpc3RQcm92aWRlcihwcm92aWRlcjogTGlzdFByb3ZpZGVyKSB7XG4gICAgdGhpcy5wcm92aWRlcnNMaXN0LmFkZFByb3ZpZGVyKHByb3ZpZGVyKVxuICB9XG4gIGRlbGV0ZUxpc3RQcm92aWRlcihwcm92aWRlcjogTGlzdFByb3ZpZGVyKSB7XG4gICAgdGhpcy5wcm92aWRlcnNMaXN0LmRlbGV0ZVByb3ZpZGVyKHByb3ZpZGVyKVxuICB9XG4gIGNvbnN1bWVIaWdobGlnaHRQcm92aWRlcihwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIpIHtcbiAgICB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodC5hZGRQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBkZWxldGVIaWdobGlnaHRQcm92aWRlcihwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIpIHtcbiAgICB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodC5kZWxldGVQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMuYWN0aXZlLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19