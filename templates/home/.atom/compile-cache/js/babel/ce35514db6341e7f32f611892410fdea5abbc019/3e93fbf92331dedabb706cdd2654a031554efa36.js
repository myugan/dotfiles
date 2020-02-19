var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var Element = (function () {
  function Element() {
    var _this = this;

    _classCallCheck(this, Element);

    this.item = document.createElement('div');
    this.itemErrors = Helpers.getElement('stop');
    this.itemWarnings = Helpers.getElement('alert');
    this.itemInfos = Helpers.getElement('info');

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.item.appendChild(this.itemErrors);
    this.item.appendChild(this.itemWarnings);
    this.item.appendChild(this.itemInfos);
    this.item.classList.add('inline-block');
    this.item.classList.add('linter-status-count');

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.tooltips.add(this.itemErrors, { title: 'Linter Errors' }));
    this.subscriptions.add(atom.tooltips.add(this.itemWarnings, { title: 'Linter Warnings' }));
    this.subscriptions.add(atom.tooltips.add(this.itemInfos, { title: 'Linter Infos' }));

    this.itemErrors.onclick = function () {
      return _this.emitter.emit('click', 'error');
    };
    this.itemWarnings.onclick = function () {
      return _this.emitter.emit('click', 'warning');
    };
    this.itemInfos.onclick = function () {
      return _this.emitter.emit('click', 'info');
    };

    this.update(0, 0, 0);
  }

  _createClass(Element, [{
    key: 'setVisibility',
    value: function setVisibility(prefix, visibility) {
      if (visibility) {
        this.item.classList.remove('hide-' + prefix);
      } else {
        this.item.classList.add('hide-' + prefix);
      }
    }
  }, {
    key: 'update',
    value: function update(countErrors, countWarnings, countInfos) {
      this.itemErrors.childNodes[0].textContent = String(countErrors);
      this.itemWarnings.childNodes[0].textContent = String(countWarnings);
      this.itemInfos.childNodes[0].textContent = String(countInfos);

      if (countErrors) {
        this.itemErrors.classList.add('text-error');
      } else {
        this.itemErrors.classList.remove('text-error');
      }

      if (countWarnings) {
        this.itemWarnings.classList.add('text-warning');
      } else {
        this.itemWarnings.classList.remove('text-warning');
      }

      if (countInfos) {
        this.itemInfos.classList.add('text-info');
      } else {
        this.itemInfos.classList.remove('text-info');
      }
    }
  }, {
    key: 'onDidClick',
    value: function onDidClick(callback) {
      return this.emitter.on('click', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Element;
})();

module.exports = Element;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9zdGF0dXMtYmFyL2VsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUU2QyxNQUFNOzt1QkFHMUIsV0FBVzs7SUFBeEIsT0FBTzs7SUFFYixPQUFPO0FBU0EsV0FUUCxPQUFPLEdBU0c7OzswQkFUVixPQUFPOztBQVVULFFBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN6QyxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQy9DLFFBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFM0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN0QyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDeEMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN2QyxRQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FB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QUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzFDOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXRFRyxPQUFPOzs7QUF5RWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5cbmNsYXNzIEVsZW1lbnQge1xuICBpdGVtOiBIVE1MRWxlbWVudFxuICBpdGVtRXJyb3JzOiBIVE1MRWxlbWVudFxuICBpdGVtV2FybmluZ3M6IEhUTUxFbGVtZW50XG4gIGl0ZW1JbmZvczogSFRNTEVsZW1lbnRcblxuICBlbWl0dGVyOiBFbWl0dGVyXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLml0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuaXRlbUVycm9ycyA9IEhlbHBlcnMuZ2V0RWxlbWVudCgnc3RvcCcpXG4gICAgdGhpcy5pdGVtV2FybmluZ3MgPSBIZWxwZXJzLmdldEVsZW1lbnQoJ2FsZXJ0JylcbiAgICB0aGlzLml0ZW1JbmZvcyA9IEhlbHBlcnMuZ2V0RWxlbWVudCgnaW5mbycpXG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5pdGVtLmFwcGVuZENoaWxkKHRoaXMuaXRlbUVycm9ycylcbiAgICB0aGlzLml0ZW0uYXBwZW5kQ2hpbGQodGhpcy5pdGVtV2FybmluZ3MpXG4gICAgdGhpcy5pdGVtLmFwcGVuZENoaWxkKHRoaXMuaXRlbUluZm9zKVxuICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKVxuICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QuYWRkKCdsaW50ZXItc3RhdHVzLWNvdW50JylcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS50b29sdGlwcy5hZGQodGhpcy5pdGVtRXJyb3JzLCB7IHRpdGxlOiAnTGludGVyIEVycm9ycycgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLml0ZW1XYXJuaW5ncywgeyB0aXRsZTogJ0xpbnRlciBXYXJuaW5ncycgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLml0ZW1JbmZvcywgeyB0aXRsZTogJ0xpbnRlciBJbmZvcycgfSkpXG5cbiAgICB0aGlzLml0ZW1FcnJvcnMub25jbGljayA9ICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdjbGljaycsICdlcnJvcicpXG4gICAgdGhpcy5pdGVtV2FybmluZ3Mub25jbGljayA9ICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdjbGljaycsICd3YXJuaW5nJylcbiAgICB0aGlzLml0ZW1JbmZvcy5vbmNsaWNrID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywgJ2luZm8nKVxuXG4gICAgdGhpcy51cGRhdGUoMCwgMCwgMClcbiAgfVxuICBzZXRWaXNpYmlsaXR5KHByZWZpeDogc3RyaW5nLCB2aXNpYmlsaXR5OiBib29sZWFuKSB7XG4gICAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QucmVtb3ZlKGBoaWRlLSR7cHJlZml4fWApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QuYWRkKGBoaWRlLSR7cHJlZml4fWApXG4gICAgfVxuICB9XG4gIHVwZGF0ZShjb3VudEVycm9yczogbnVtYmVyLCBjb3VudFdhcm5pbmdzOiBudW1iZXIsIGNvdW50SW5mb3M6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuaXRlbUVycm9ycy5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50RXJyb3JzKVxuICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNoaWxkTm9kZXNbMF0udGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnRXYXJuaW5ncylcbiAgICB0aGlzLml0ZW1JbmZvcy5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50SW5mb3MpXG5cbiAgICBpZiAoY291bnRFcnJvcnMpIHtcbiAgICAgIHRoaXMuaXRlbUVycm9ycy5jbGFzc0xpc3QuYWRkKCd0ZXh0LWVycm9yJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtRXJyb3JzLmNsYXNzTGlzdC5yZW1vdmUoJ3RleHQtZXJyb3InKVxuICAgIH1cblxuICAgIGlmIChjb3VudFdhcm5pbmdzKSB7XG4gICAgICB0aGlzLml0ZW1XYXJuaW5ncy5jbGFzc0xpc3QuYWRkKCd0ZXh0LXdhcm5pbmcnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1XYXJuaW5ncy5jbGFzc0xpc3QucmVtb3ZlKCd0ZXh0LXdhcm5pbmcnKVxuICAgIH1cblxuICAgIGlmIChjb3VudEluZm9zKSB7XG4gICAgICB0aGlzLml0ZW1JbmZvcy5jbGFzc0xpc3QuYWRkKCd0ZXh0LWluZm8nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1JbmZvcy5jbGFzc0xpc3QucmVtb3ZlKCd0ZXh0LWluZm8nKVxuICAgIH1cbiAgfVxuICBvbkRpZENsaWNrKGNhbGxiYWNrOiAodHlwZTogc3RyaW5nKSA9PiB2b2lkKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignY2xpY2snLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRcbiJdfQ==