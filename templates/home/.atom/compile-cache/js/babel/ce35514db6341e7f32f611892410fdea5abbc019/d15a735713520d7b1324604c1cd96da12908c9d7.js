Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

// Must be non-empty.

var DefinitionProvider = (function () {
  function DefinitionProvider(navigatorFunc) {
    _classCallCheck(this, DefinitionProvider);

    this.priority = 10;
    this.grammarScopes = ['source.go', 'go'];
    this.navigator = navigatorFunc;
    this.maybeIdentifier = /^[$0-9\w]+$/;

    this.disableForSelector = [
    // original textmate selectors
    '.storage.type', '.string.quoted', '.keyword', '.support.function.builtin', '.constant.numeric.integer', '.constant.language', '.variable.other.assignment', '.variable.other.declaration', '.comment.line', 'entity.name.import.go',

    // tree-sitter selectors
    'comment.block', 'comment.line', 'string.quoted.double', 'constant.character.escape', 'constant.other.rune', 'constant.numeric.float', 'constant.language.nil', 'constant.language.false', 'constant.language.true', 'keyword.operator', 'keyword.import'];
    this.disposed = false;
  }

  _createClass(DefinitionProvider, [{
    key: 'dispose',
    value: function dispose() {
      this.disposed = true;
      this.navigator = null;
      this.disableForSelector = [];
    }
  }, {
    key: 'getDefinition',
    value: _asyncToGenerator(function* (editor, position) {
      if (!(0, _utils.isValidEditor)(editor)) {
        return null;
      }

      var scopes = editor.scopeDescriptorForBufferPosition(position).getScopesArray();
      var disabled = this.disableForSelector.some(function (s) {
        return scopes.includes(s);
      });
      if (disabled) {
        console.log('skipping Go definition - current scopes:', scopes); // eslint-disable-line no-console
        return null;
      }

      var nav = this.navigator ? this.navigator() : null;
      if (!nav) return null;

      var loc = yield nav.definitionForBufferPosition(position, editor);
      if (!loc) return null;

      var def = {
        path: loc.filepath,
        position: loc.pos,
        language: 'Go'
      };
      return { definitions: [def], queryRange: null };
    })
  }]);

  return DefinitionProvider;
})();

exports.DefinitionProvider = DefinitionProvider;
// Path of the file in which the definition is located.
// First character of the definition's identifier.
// the range of the entire definition.
// display a more human-readable title inside Hyperclick
// used to display a relativized version of path
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL25hdmlnYXRvci9kZWZpbml0aW9uLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRzhCLFVBQVU7Ozs7SUFnQmxDLGtCQUFrQjtBQVFYLFdBUlAsa0JBQWtCLENBUVYsYUFBOEIsRUFBRTswQkFSeEMsa0JBQWtCOztBQVNwQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFBOztBQUVwQyxRQUFJLENBQUMsa0JBQWtCLEdBQUc7O0FBRXhCLG1CQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLFVBQVUsRUFDViwyQkFBMkIsRUFDM0IsMkJBQTJCLEVBQzNCLG9CQUFvQixFQUNwQiw0QkFBNEIsRUFDNUIsNkJBQTZCLEVBQzdCLGVBQWUsRUFDZix1QkFBdUI7OztBQUd2QixtQkFBZSxFQUNmLGNBQWMsRUFDZCxzQkFBc0IsRUFDdEIsMkJBQTJCLEVBQzNCLHFCQUFxQixFQUNyQix3QkFBd0IsRUFDeEIsdUJBQXVCLEVBQ3ZCLHlCQUF5QixFQUN6Qix3QkFBd0IsRUFDeEIsa0JBQWtCLEVBQ2xCLGdCQUFnQixDQUNqQixDQUFBO0FBQ0QsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7R0FDdEI7O2VBekNHLGtCQUFrQjs7V0EyQ2YsbUJBQUc7QUFDUixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixVQUFJLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFBO0tBQzdCOzs7NkJBRWtCLFdBQ2pCLE1BQXVCLEVBQ3ZCLFFBQW9CLEVBQ2E7QUFDakMsVUFBSSxDQUFDLDBCQUFjLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLGVBQU8sSUFBSSxDQUFBO09BQ1o7O0FBRUQsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUNsQixnQ0FBZ0MsQ0FBQyxRQUFRLENBQUMsQ0FDMUMsY0FBYyxFQUFFLENBQUE7QUFDbkIsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7ZUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUN0RSxVQUFJLFFBQVEsRUFBRTtBQUNaLGVBQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDL0QsZUFBTyxJQUFJLENBQUE7T0FDWjs7QUFFRCxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUE7QUFDcEQsVUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQTs7QUFFckIsVUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsMkJBQTJCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ25FLFVBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUE7O0FBRXJCLFVBQU0sR0FBRyxHQUFHO0FBQ1YsWUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRO0FBQ2xCLGdCQUFRLEVBQUUsR0FBRyxDQUFDLEdBQUc7QUFDakIsZ0JBQVEsRUFBRSxJQUFJO09BQ2YsQ0FBQTtBQUNELGFBQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUE7S0FDaEQ7OztTQTlFRyxrQkFBa0I7OztRQWlGZixrQkFBa0IsR0FBbEIsa0JBQWtCIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL25hdmlnYXRvci9kZWZpbml0aW9uLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBOYXZpZ2F0b3IgfSBmcm9tICcuL25hdmlnYXRvcidcbmltcG9ydCB7IGlzVmFsaWRFZGl0b3IgfSBmcm9tICcuLi91dGlscydcblxudHlwZSBEZWZpbml0aW9uID0ge1xuICBwYXRoOiBzdHJpbmcsIC8vIFBhdGggb2YgdGhlIGZpbGUgaW4gd2hpY2ggdGhlIGRlZmluaXRpb24gaXMgbG9jYXRlZC5cbiAgcG9zaXRpb246IGF0b20kUG9pbnQsIC8vIEZpcnN0IGNoYXJhY3RlciBvZiB0aGUgZGVmaW5pdGlvbidzIGlkZW50aWZpZXIuXG4gIHJhbmdlPzogYXRvbSRSYW5nZSwgLy8gdGhlIHJhbmdlIG9mIHRoZSBlbnRpcmUgZGVmaW5pdGlvbi5cbiAgbmFtZT86IHN0cmluZywgLy8gZGlzcGxheSBhIG1vcmUgaHVtYW4tcmVhZGFibGUgdGl0bGUgaW5zaWRlIEh5cGVyY2xpY2tcbiAgcHJvamVjdFJvb3Q/OiBzdHJpbmcsIC8vIHVzZWQgdG8gZGlzcGxheSBhIHJlbGF0aXZpemVkIHZlcnNpb24gb2YgcGF0aFxuICBsYW5ndWFnZTogc3RyaW5nXG59XG5cbnR5cGUgRGVmaW5pdGlvblF1ZXJ5UmVzdWx0ID0ge1xuICBxdWVyeVJhbmdlOiA/QXJyYXk8YXRvbSRSYW5nZT4sXG4gIGRlZmluaXRpb25zOiBBcnJheTxEZWZpbml0aW9uPiAvLyBNdXN0IGJlIG5vbi1lbXB0eS5cbn1cblxuY2xhc3MgRGVmaW5pdGlvblByb3ZpZGVyIHtcbiAgcHJpb3JpdHk6IG51bWJlclxuICBncmFtbWFyU2NvcGVzOiBBcnJheTxzdHJpbmc+XG4gIG5hdmlnYXRvcjogbnVsbCB8ICgoKSA9PiBOYXZpZ2F0b3IpXG4gIG1heWJlSWRlbnRpZmllcjogUmVnRXhwXG4gIGRpc2FibGVGb3JTZWxlY3RvcjogQXJyYXk8c3RyaW5nPlxuICBkaXNwb3NlZDogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yKG5hdmlnYXRvckZ1bmM6ICgpID0+IE5hdmlnYXRvcikge1xuICAgIHRoaXMucHJpb3JpdHkgPSAxMFxuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmdvJywgJ2dvJ11cbiAgICB0aGlzLm5hdmlnYXRvciA9IG5hdmlnYXRvckZ1bmNcbiAgICB0aGlzLm1heWJlSWRlbnRpZmllciA9IC9eWyQwLTlcXHddKyQvXG5cbiAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9IFtcbiAgICAgIC8vIG9yaWdpbmFsIHRleHRtYXRlIHNlbGVjdG9yc1xuICAgICAgJy5zdG9yYWdlLnR5cGUnLFxuICAgICAgJy5zdHJpbmcucXVvdGVkJyxcbiAgICAgICcua2V5d29yZCcsXG4gICAgICAnLnN1cHBvcnQuZnVuY3Rpb24uYnVpbHRpbicsXG4gICAgICAnLmNvbnN0YW50Lm51bWVyaWMuaW50ZWdlcicsXG4gICAgICAnLmNvbnN0YW50Lmxhbmd1YWdlJyxcbiAgICAgICcudmFyaWFibGUub3RoZXIuYXNzaWdubWVudCcsXG4gICAgICAnLnZhcmlhYmxlLm90aGVyLmRlY2xhcmF0aW9uJyxcbiAgICAgICcuY29tbWVudC5saW5lJyxcbiAgICAgICdlbnRpdHkubmFtZS5pbXBvcnQuZ28nLFxuXG4gICAgICAvLyB0cmVlLXNpdHRlciBzZWxlY3RvcnNcbiAgICAgICdjb21tZW50LmJsb2NrJyxcbiAgICAgICdjb21tZW50LmxpbmUnLFxuICAgICAgJ3N0cmluZy5xdW90ZWQuZG91YmxlJyxcbiAgICAgICdjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlJyxcbiAgICAgICdjb25zdGFudC5vdGhlci5ydW5lJyxcbiAgICAgICdjb25zdGFudC5udW1lcmljLmZsb2F0JyxcbiAgICAgICdjb25zdGFudC5sYW5ndWFnZS5uaWwnLFxuICAgICAgJ2NvbnN0YW50Lmxhbmd1YWdlLmZhbHNlJyxcbiAgICAgICdjb25zdGFudC5sYW5ndWFnZS50cnVlJyxcbiAgICAgICdrZXl3b3JkLm9wZXJhdG9yJyxcbiAgICAgICdrZXl3b3JkLmltcG9ydCdcbiAgICBdXG4gICAgdGhpcy5kaXNwb3NlZCA9IGZhbHNlXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlXG4gICAgdGhpcy5uYXZpZ2F0b3IgPSBudWxsXG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSBbXVxuICB9XG5cbiAgYXN5bmMgZ2V0RGVmaW5pdGlvbihcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBwb3NpdGlvbjogYXRvbSRQb2ludFxuICApOiBQcm9taXNlPD9EZWZpbml0aW9uUXVlcnlSZXN1bHQ+IHtcbiAgICBpZiAoIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSBlZGl0b3JcbiAgICAgIC5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcbiAgICAgIC5nZXRTY29wZXNBcnJheSgpXG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVGb3JTZWxlY3Rvci5zb21lKHMgPT4gc2NvcGVzLmluY2x1ZGVzKHMpKVxuICAgIGlmIChkaXNhYmxlZCkge1xuICAgICAgY29uc29sZS5sb2coJ3NraXBwaW5nIEdvIGRlZmluaXRpb24gLSBjdXJyZW50IHNjb3BlczonLCBzY29wZXMpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBuYXYgPSB0aGlzLm5hdmlnYXRvciA/IHRoaXMubmF2aWdhdG9yKCkgOiBudWxsXG4gICAgaWYgKCFuYXYpIHJldHVybiBudWxsXG5cbiAgICBjb25zdCBsb2MgPSBhd2FpdCBuYXYuZGVmaW5pdGlvbkZvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uLCBlZGl0b3IpXG4gICAgaWYgKCFsb2MpIHJldHVybiBudWxsXG5cbiAgICBjb25zdCBkZWYgPSB7XG4gICAgICBwYXRoOiBsb2MuZmlsZXBhdGgsXG4gICAgICBwb3NpdGlvbjogbG9jLnBvcyxcbiAgICAgIGxhbmd1YWdlOiAnR28nXG4gICAgfVxuICAgIHJldHVybiB7IGRlZmluaXRpb25zOiBbZGVmXSwgcXVlcnlSYW5nZTogbnVsbCB9XG4gIH1cbn1cblxuZXhwb3J0IHsgRGVmaW5pdGlvblByb3ZpZGVyIH1cbiJdfQ==