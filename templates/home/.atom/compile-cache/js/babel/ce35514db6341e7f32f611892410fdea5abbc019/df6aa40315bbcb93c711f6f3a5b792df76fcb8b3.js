Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var _validate = require('./validate');

var ProvidersList = (function () {
  function ProvidersList() {
    _classCallCheck(this, ProvidersList);

    this.number = 0;
    this.providers = new Set();
  }

  _createClass(ProvidersList, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      if (!this.hasProvider(provider)) {
        (0, _validate.provider)(provider);
        this.providers.add(provider);
      }
    }
  }, {
    key: 'hasProvider',
    value: function hasProvider(provider) {
      return this.providers.has(provider);
    }
  }, {
    key: 'deleteProvider',
    value: function deleteProvider(provider) {
      if (this.hasProvider(provider)) {
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'trigger',
    value: _asyncToGenerator(function* (textEditor) {
      var editorPath = textEditor.getPath();
      var bufferPosition = textEditor.getCursorBufferPosition();

      if (!editorPath) {
        return [];
      }

      var scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray();
      scopes.push('*');

      var promises = [];
      this.providers.forEach(function (provider) {
        if (scopes.some(function (scope) {
          return provider.grammarScopes.indexOf(scope) !== -1;
        })) {
          promises.push(new Promise(function (resolve) {
            resolve(provider.getIntentions({ textEditor: textEditor, bufferPosition: bufferPosition }));
          }).then(function (results) {
            if (atom.inDevMode()) {
              (0, _validate.suggestionsList)(results);
            }
            return results;
          }));
        }
      });

      var number = ++this.number;
      var results = (yield Promise.all(promises)).reduce(function (items, item) {
        if (Array.isArray(item)) {
          return items.concat(item);
        }
        return items;
      }, []);

      if (number !== this.number || !results.length) {
        // If has been executed one more time, ignore these results
        // Or we don't have any results
        return [];
      }

      return (0, _helpers.processListItems)(results);
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
    }
  }]);

  return ProvidersList;
})();

exports['default'] = ProvidersList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL3Byb3ZpZGVycy1saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7dUJBR2lDLFdBQVc7O3dCQUN5QyxZQUFZOztJQUc1RSxhQUFhO0FBSXJCLFdBSlEsYUFBYSxHQUlsQjswQkFKSyxhQUFhOztBQUs5QixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtBQUNmLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtHQUMzQjs7ZUFQa0IsYUFBYTs7V0FRckIscUJBQUMsUUFBc0IsRUFBRTtBQUNsQyxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvQixnQ0FBaUIsUUFBUSxDQUFDLENBQUE7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDN0I7S0FDRjs7O1dBQ1UscUJBQUMsUUFBc0IsRUFBVztBQUMzQyxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3BDOzs7V0FDYSx3QkFBQyxRQUFzQixFQUFFO0FBQ3JDLFVBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5QixZQUFJLENBQUMsU0FBUyxVQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7S0FDRjs7OzZCQUNZLFdBQUMsVUFBc0IsRUFBNEI7QUFDOUQsVUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3ZDLFVBQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxDQUFBOztBQUUzRCxVQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsZUFBTyxFQUFFLENBQUE7T0FDVjs7QUFFRCxVQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsZ0NBQWdDLENBQUMsY0FBYyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDM0YsWUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFaEIsVUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3hDLFlBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUs7aUJBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUEsQ0FBQyxFQUFFO0FBQ3RFLGtCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFO0FBQzFDLG1CQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsY0FBYyxFQUFkLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQTtXQUNoRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsT0FBTyxFQUFFO0FBQ3hCLGdCQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQiw2Q0FBb0IsT0FBTyxDQUFDLENBQUE7YUFDN0I7QUFDRCxtQkFBTyxPQUFPLENBQUE7V0FDZixDQUFDLENBQUMsQ0FBQTtTQUNKO09BQ0YsQ0FBQyxDQUFBOztBQUVGLFVBQU0sTUFBTSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUM1QixVQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDekUsWUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGlCQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDMUI7QUFDRCxlQUFPLEtBQUssQ0FBQTtPQUNiLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRU4sVUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7OztBQUc3QyxlQUFPLEVBQUUsQ0FBQTtPQUNWOztBQUVELGFBQU8sK0JBQWlCLE9BQU8sQ0FBQyxDQUFBO0tBQ2pDOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDdkI7OztTQWpFa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvcHJvdmlkZXJzLWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgcHJvY2Vzc0xpc3RJdGVtcyB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IHByb3ZpZGVyIGFzIHZhbGlkYXRlUHJvdmlkZXIsIHN1Z2dlc3Rpb25zTGlzdCBhcyB2YWxpZGF0ZVN1Z2dlc3Rpb25zIH0gZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCB0eXBlIHsgTGlzdFByb3ZpZGVyLCBMaXN0SXRlbSB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyc0xpc3Qge1xuICBudW1iZXI6IG51bWJlcjtcbiAgcHJvdmlkZXJzOiBTZXQ8TGlzdFByb3ZpZGVyPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm51bWJlciA9IDBcbiAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBTZXQoKVxuICB9XG4gIGFkZFByb3ZpZGVyKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIpIHtcbiAgICBpZiAoIXRoaXMuaGFzUHJvdmlkZXIocHJvdmlkZXIpKSB7XG4gICAgICB2YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyKVxuICAgICAgdGhpcy5wcm92aWRlcnMuYWRkKHByb3ZpZGVyKVxuICAgIH1cbiAgfVxuICBoYXNQcm92aWRlcihwcm92aWRlcjogTGlzdFByb3ZpZGVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmhhcyhwcm92aWRlcilcbiAgfVxuICBkZWxldGVQcm92aWRlcihwcm92aWRlcjogTGlzdFByb3ZpZGVyKSB7XG4gICAgaWYgKHRoaXMuaGFzUHJvdmlkZXIocHJvdmlkZXIpKSB7XG4gICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUocHJvdmlkZXIpXG4gICAgfVxuICB9XG4gIGFzeW5jIHRyaWdnZXIodGV4dEVkaXRvcjogVGV4dEVkaXRvcik6IFByb21pc2U8QXJyYXk8TGlzdEl0ZW0+PiB7XG4gICAgY29uc3QgZWRpdG9yUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgYnVmZmVyUG9zaXRpb24gPSB0ZXh0RWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgIGlmICghZWRpdG9yUGF0aCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVzID0gdGV4dEVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbikuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHNjb3Blcy5wdXNoKCcqJylcblxuICAgIGNvbnN0IHByb21pc2VzID0gW11cbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBpZiAoc2NvcGVzLnNvbWUoc2NvcGUgPT4gcHJvdmlkZXIuZ3JhbW1hclNjb3Blcy5pbmRleE9mKHNjb3BlKSAhPT0gLTEpKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIHJlc29sdmUocHJvdmlkZXIuZ2V0SW50ZW50aW9ucyh7IHRleHRFZGl0b3IsIGJ1ZmZlclBvc2l0aW9uIH0pKVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVTdWdnZXN0aW9ucyhyZXN1bHRzKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgbnVtYmVyID0gKyt0aGlzLm51bWJlclxuICAgIGNvbnN0IHJlc3VsdHMgPSAoYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpKS5yZWR1Y2UoZnVuY3Rpb24oaXRlbXMsIGl0ZW0pIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtcy5jb25jYXQoaXRlbSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtc1xuICAgIH0sIFtdKVxuXG4gICAgaWYgKG51bWJlciAhPT0gdGhpcy5udW1iZXIgfHwgIXJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAvLyBJZiBoYXMgYmVlbiBleGVjdXRlZCBvbmUgbW9yZSB0aW1lLCBpZ25vcmUgdGhlc2UgcmVzdWx0c1xuICAgICAgLy8gT3Igd2UgZG9uJ3QgaGF2ZSBhbnkgcmVzdWx0c1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NMaXN0SXRlbXMocmVzdWx0cylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmNsZWFyKClcbiAgfVxufVxuIl19