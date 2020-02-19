var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.executing = new Set();
    this.providerTitles = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.useBusySignal', function (useBusySignal) {
      _this.useBusySignal = useBusySignal;
    }));
  }

  _createClass(BusySignal, [{
    key: 'attach',
    value: function attach(registry) {
      this.provider = registry.create();
      this.update();
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      var provider = this.provider;
      if (!provider) return;
      if (!this.useBusySignal) return;
      var fileMap = new Map();
      var currentTitles = new Set();

      for (var _ref2 of this.executing) {
        var _filePath = _ref2.filePath;
        var _linter = _ref2.linter;

        var names = fileMap.get(_filePath);
        if (!names) {
          fileMap.set(_filePath, names = []);
        }
        names.push(_linter.name);
      }

      var _loop = function (_ref3) {
        _ref32 = _slicedToArray(_ref3, 2);
        var filePath = _ref32[0];
        var names = _ref32[1];

        var path = filePath ? ' on ' + atom.project.relativizePath(filePath)[1] : '';
        names.forEach(function (name) {
          var title = '' + name + path;
          currentTitles.add(title);
          if (!_this2.providerTitles.has(title)) {
            // Add the title since it hasn't been seen before
            _this2.providerTitles.add(title);
            provider.add(title);
          }
        });
      };

      for (var _ref3 of fileMap) {
        var _ref32;

        _loop(_ref3);
      }

      // Remove any titles no longer active
      this.providerTitles.forEach(function (title) {
        if (!currentTitles.has(title)) {
          provider.remove(title);
          _this2.providerTitles['delete'](title);
        }
      });

      fileMap.clear();
    }
  }, {
    key: 'getExecuting',
    value: function getExecuting(linter, filePath) {
      for (var entry of this.executing) {
        if (entry.linter === linter && entry.filePath === filePath) {
          return entry;
        }
      }
      return null;
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      if (this.getExecuting(linter, filePath)) {
        return;
      }
      this.executing.add({ linter: linter, filePath: filePath });
      this.update();
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      var entry = this.getExecuting(linter, filePath);
      if (entry) {
        this.executing['delete'](entry);
        this.update();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.provider) {
        this.provider.clear();
      }
      this.providerTitles.clear();
      this.executing.clear();
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

module.exports = BusySignal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9idXN5LXNpZ25hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O0lBR3BDLFVBQVU7QUFVSCxXQVZQLFVBQVUsR0FVQTs7OzBCQVZWLFVBQVU7O0FBV1osUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzFCLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMvQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUNBQWlDLEVBQUUsVUFBQSxhQUFhLEVBQUk7QUFDdEUsWUFBSyxhQUFhLEdBQUcsYUFBYSxDQUFBO0tBQ25DLENBQUMsQ0FDSCxDQUFBO0dBQ0Y7O2VBcEJHLFVBQVU7O1dBcUJSLGdCQUFDLFFBQWdCLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDakMsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ2Q7OztXQUNLLGtCQUFHOzs7QUFDUCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTTtBQUNyQixVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFNO0FBQy9CLFVBQU0sT0FBb0MsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3RELFVBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRS9CLHdCQUFtQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQXRDLFNBQVEsU0FBUixRQUFRO1lBQUUsT0FBTSxTQUFOLE1BQU07O0FBQzNCLFlBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxH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b21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9idXN5LXNpZ25hbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBCdXN5U2lnbmFsIHtcbiAgcHJvdmlkZXI6ID9PYmplY3RcbiAgZXhlY3V0aW5nOiBTZXQ8e1xuICAgIGxpbnRlcjogTGludGVyLFxuICAgIGZpbGVQYXRoOiA/c3RyaW5nLFxuICB9PlxuICBwcm92aWRlclRpdGxlczogU2V0PHN0cmluZz5cbiAgdXNlQnVzeVNpZ25hbDogYm9vbGVhblxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5leGVjdXRpbmcgPSBuZXcgU2V0KClcbiAgICB0aGlzLnByb3ZpZGVyVGl0bGVzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnVzZUJ1c3lTaWduYWwnLCB1c2VCdXN5U2lnbmFsID0+IHtcbiAgICAgICAgdGhpcy51c2VCdXN5U2lnbmFsID0gdXNlQnVzeVNpZ25hbFxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIGF0dGFjaChyZWdpc3RyeTogT2JqZWN0KSB7XG4gICAgdGhpcy5wcm92aWRlciA9IHJlZ2lzdHJ5LmNyZWF0ZSgpXG4gICAgdGhpcy51cGRhdGUoKVxuICB9XG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBwcm92aWRlciA9IHRoaXMucHJvdmlkZXJcbiAgICBpZiAoIXByb3ZpZGVyKSByZXR1cm5cbiAgICBpZiAoIXRoaXMudXNlQnVzeVNpZ25hbCkgcmV0dXJuXG4gICAgY29uc3QgZmlsZU1hcDogTWFwPD9zdHJpbmcsIEFycmF5PHN0cmluZz4+ID0gbmV3IE1hcCgpXG4gICAgY29uc3QgY3VycmVudFRpdGxlcyA9IG5ldyBTZXQoKVxuXG4gICAgZm9yIChjb25zdCB7IGZpbGVQYXRoLCBsaW50ZXIgfSBvZiB0aGlzLmV4ZWN1dGluZykge1xuICAgICAgbGV0IG5hbWVzID0gZmlsZU1hcC5nZXQoZmlsZVBhdGgpXG4gICAgICBpZiAoIW5hbWVzKSB7XG4gICAgICAgIGZpbGVNYXAuc2V0KGZpbGVQYXRoLCAobmFtZXMgPSBbXSkpXG4gICAgICB9XG4gICAgICBuYW1lcy5wdXNoKGxpbnRlci5uYW1lKVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2ZpbGVQYXRoLCBuYW1lc10gb2YgZmlsZU1hcCkge1xuICAgICAgY29uc3QgcGF0aCA9IGZpbGVQYXRoID8gYCBvbiAke2F0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMV19YCA6ICcnXG4gICAgICBuYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGAke25hbWV9JHtwYXRofWBcbiAgICAgICAgY3VycmVudFRpdGxlcy5hZGQodGl0bGUpXG4gICAgICAgIGlmICghdGhpcy5wcm92aWRlclRpdGxlcy5oYXModGl0bGUpKSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSB0aXRsZSBzaW5jZSBpdCBoYXNuJ3QgYmVlbiBzZWVuIGJlZm9yZVxuICAgICAgICAgIHRoaXMucHJvdmlkZXJUaXRsZXMuYWRkKHRpdGxlKVxuICAgICAgICAgIHByb3ZpZGVyLmFkZCh0aXRsZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IHRpdGxlcyBubyBsb25nZXIgYWN0aXZlXG4gICAgdGhpcy5wcm92aWRlclRpdGxlcy5mb3JFYWNoKHRpdGxlID0+IHtcbiAgICAgIGlmICghY3VycmVudFRpdGxlcy5oYXModGl0bGUpKSB7XG4gICAgICAgIHByb3ZpZGVyLnJlbW92ZSh0aXRsZSlcbiAgICAgICAgdGhpcy5wcm92aWRlclRpdGxlcy5kZWxldGUodGl0bGUpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGZpbGVNYXAuY2xlYXIoKVxuICB9XG4gIGdldEV4ZWN1dGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcpOiA/T2JqZWN0IHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZXhlY3V0aW5nKSB7XG4gICAgICBpZiAoZW50cnkubGludGVyID09PSBsaW50ZXIgJiYgZW50cnkuZmlsZVBhdGggPT09IGZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGRpZEJlZ2luTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcpIHtcbiAgICBpZiAodGhpcy5nZXRFeGVjdXRpbmcobGludGVyLCBmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmV4ZWN1dGluZy5hZGQoeyBsaW50ZXIsIGZpbGVQYXRoIH0pXG4gICAgdGhpcy51cGRhdGUoKVxuICB9XG4gIGRpZEZpbmlzaExpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nKSB7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLmdldEV4ZWN1dGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgdGhpcy5leGVjdXRpbmcuZGVsZXRlKGVudHJ5KVxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLnByb3ZpZGVyKSB7XG4gICAgICB0aGlzLnByb3ZpZGVyLmNsZWFyKClcbiAgICB9XG4gICAgdGhpcy5wcm92aWRlclRpdGxlcy5jbGVhcigpXG4gICAgdGhpcy5leGVjdXRpbmcuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1c3lTaWduYWxcbiJdfQ==