Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _elementsHighlight = require('./elements/highlight');

var ProvidersHighlight = (function () {
  function ProvidersHighlight() {
    _classCallCheck(this, ProvidersHighlight);

    this.number = 0;
    this.providers = new Set();
  }

  _createClass(ProvidersHighlight, [{
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

      var visibleRange = _atom.Range.fromObject([textEditor.bufferPositionForScreenPosition([textEditor.getFirstVisibleScreenRow(), 0]), textEditor.bufferPositionForScreenPosition([textEditor.getLastVisibleScreenRow(), 0])]);
      // Setting this to infinity on purpose, cause the buffer position just marks visible column
      // according to element width
      visibleRange.end.column = Infinity;

      var promises = [];
      this.providers.forEach(function (provider) {
        if (scopes.some(function (scope) {
          return provider.grammarScopes.indexOf(scope) !== -1;
        })) {
          promises.push(new Promise(function (resolve) {
            resolve(provider.getIntentions({ textEditor: textEditor, visibleRange: visibleRange }));
          }).then(function (results) {
            if (atom.inDevMode()) {
              (0, _validate.suggestionsShow)(results);
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
        // Or we just don't have any results
        return [];
      }

      return results;
    })
  }, {
    key: 'paint',
    value: function paint(textEditor, intentions) {
      var markers = [];

      var _loop = function (intention) {
        var matchedText = textEditor.getTextInBufferRange(intention.range);
        var marker = textEditor.markBufferRange(intention.range);
        var element = (0, _elementsHighlight.create)(intention, matchedText.length);
        intention.created({ textEditor: textEditor, element: element, marker: marker, matchedText: matchedText });
        textEditor.decorateMarker(marker, {
          type: 'overlay',
          position: 'tail',
          item: element
        });
        marker.onDidChange(function (_ref) {
          var start = _ref.newHeadBufferPosition;
          var end = _ref.oldTailBufferPosition;

          element.textContent = _elementsHighlight.PADDING_CHARACTER.repeat(textEditor.getTextInBufferRange([start, end]).length);
        });
        markers.push(marker);
      };

      for (var intention of intentions) {
        _loop(intention);
      }
      return function () {
        markers.forEach(function (marker) {
          try {
            marker.destroy();
          } catch (_) {/* No Op */}
        });
      };
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
    }
  }]);

  return ProvidersHighlight;
})();

exports['default'] = ProvidersHighlight;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL3Byb3ZpZGVycy1oaWdobGlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7d0JBRXlELFlBQVk7O2lDQUN0QyxzQkFBc0I7O0lBRzVELGtCQUFrQjtBQUkxQixXQUpRLGtCQUFrQixHQUl2QjswQkFKSyxrQkFBa0I7O0FBS25DLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0FBQ2YsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0dBQzNCOztlQVBrQixrQkFBa0I7O1dBUTFCLHFCQUFDLFFBQTJCLEVBQUU7QUFDdkMsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDL0IsZ0NBQWlCLFFBQVEsQ0FBQyxDQUFBO0FBQzFCLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCO0tBQ0Y7OztXQUNVLHFCQUFDLFFBQTJCLEVBQVc7QUFDaEQsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNwQzs7O1dBQ2Esd0JBQUMsUUFBMkIsRUFBRTtBQUMxQyxVQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsWUFBSSxDQUFDLFNBQVMsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7Ozs2QkFDWSxXQUFDLFVBQXNCLEVBQWlDO0FBQ25FLFVBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN2QyxVQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTs7QUFFM0QsVUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNmLGVBQU8sRUFBRSxDQUFBO09BQ1Y7O0FBRUQsVUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGdD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LFdBQVcsQ0FBQyxVQUFTLElBQTRELEVBQUU7Y0FBckMsS0FBSyxHQUE5QixJQUE0RCxDQUExRCxxQkFBcUI7Y0FBZ0MsR0FBRyxHQUExRCxJQUE0RCxDQUE1QixxQkFBcUI7O0FBQy9FLGlCQUFPLENBQUMsV0FBVyxHQUFHLHFDQUFrQixNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDckcsQ0FBQyxDQUFBO0FBQ0YsZUFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTs7O0FBYnRCLFdBQUssSUFBTSxTQUFTLElBQUssVUFBVSxFQUF5QjtjQUFqRCxTQUFTO09BY25CO0FBQ0QsYUFBTyxZQUFXO0FBQ2hCLGVBQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDL0IsY0FBSTtBQUNGLGtCQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7V0FDakIsQ0FBQyxPQUFPLENBQUMsRUFBRSxhQUFlO1NBQzVCLENBQUMsQ0FBQTtPQUNILENBQUE7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ3ZCOzs7U0FsR2tCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvcHJvdmlkZXJzLWhpZ2hsaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBwcm92aWRlciBhcyB2YWxpZGF0ZVByb3ZpZGVyLCBzdWdnZXN0aW9uc1Nob3cgYXMgdmFsaWRhdGVTdWdnZXN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyBjcmVhdGUgYXMgY3JlYXRlRWxlbWVudCwgUEFERElOR19DSEFSQUNURVIgfSBmcm9tICcuL2VsZW1lbnRzL2hpZ2hsaWdodCdcbmltcG9ydCB0eXBlIHsgSGlnaGxpZ2h0UHJvdmlkZXIsIEhpZ2hsaWdodEl0ZW0gfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm92aWRlcnNIaWdobGlnaHQge1xuICBudW1iZXI6IG51bWJlcjtcbiAgcHJvdmlkZXJzOiBTZXQ8SGlnaGxpZ2h0UHJvdmlkZXI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubnVtYmVyID0gMFxuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpXG4gIH1cbiAgYWRkUHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgaWYgKCF0aGlzLmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkge1xuICAgICAgdmFsaWRhdGVQcm92aWRlcihwcm92aWRlcilcbiAgICAgIHRoaXMucHJvdmlkZXJzLmFkZChwcm92aWRlcilcbiAgICB9XG4gIH1cbiAgaGFzUHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmhhcyhwcm92aWRlcilcbiAgfVxuICBkZWxldGVQcm92aWRlcihwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIpIHtcbiAgICBpZiAodGhpcy5oYXNQcm92aWRlcihwcm92aWRlcikpIHtcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcilcbiAgICB9XG4gIH1cbiAgYXN5bmMgdHJpZ2dlcih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxBcnJheTxIaWdobGlnaHRJdGVtPj4ge1xuICAgIGNvbnN0IGVkaXRvclBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgIGNvbnN0IGJ1ZmZlclBvc2l0aW9uID0gdGV4dEVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBpZiAoIWVkaXRvclBhdGgpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlcyA9IHRleHRFZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24pLmdldFNjb3Blc0FycmF5KClcbiAgICBzY29wZXMucHVzaCgnKicpXG5cbiAgICBjb25zdCB2aXNpYmxlUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtcbiAgICAgIHRleHRFZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbdGV4dEVkaXRvci5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKSwgMF0pLFxuICAgICAgdGV4dEVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKFt0ZXh0RWRpdG9yLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCksIDBdKSxcbiAgICBdKVxuICAgIC8vIFNldHRpbmcgdGhpcyB0byBpbmZpbml0eSBvbiBwdXJwb3NlLCBjYXVzZSB0aGUgYnVmZmVyIHBvc2l0aW9uIGp1c3QgbWFya3MgdmlzaWJsZSBjb2x1bW5cbiAgICAvLyBhY2NvcmRpbmcgdG8gZWxlbWVudCB3aWR0aFxuICAgIHZpc2libGVSYW5nZS5lbmQuY29sdW1uID0gSW5maW5pdHlcblxuICAgIGNvbnN0IHByb21pc2VzID0gW11cbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBpZiAoc2NvcGVzLnNvbWUoc2NvcGUgPT4gcHJvdmlkZXIuZ3JhbW1hclNjb3Blcy5pbmRleE9mKHNjb3BlKSAhPT0gLTEpKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIHJlc29sdmUocHJvdmlkZXIuZ2V0SW50ZW50aW9ucyh7IHRleHRFZGl0b3IsIHZpc2libGVSYW5nZSB9KSlcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlU3VnZ2VzdGlvbnMocmVzdWx0cylcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IG51bWJlciA9ICsrdGhpcy5udW1iZXJcbiAgICBjb25zdCByZXN1bHRzID0gKGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKSkucmVkdWNlKGZ1bmN0aW9uKGl0ZW1zLCBpdGVtKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbXMuY29uY2F0KGl0ZW0pXG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlbXNcbiAgICB9LCBbXSlcblxuICAgIGlmIChudW1iZXIgIT09IHRoaXMubnVtYmVyIHx8ICFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgLy8gSWYgaGFzIGJlZW4gZXhlY3V0ZWQgb25lIG1vcmUgdGltZSwgaWdub3JlIHRoZXNlIHJlc3VsdHNcbiAgICAgIC8vIE9yIHdlIGp1c3QgZG9uJ3QgaGF2ZSBhbnkgcmVzdWx0c1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuICBwYWludCh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCBpbnRlbnRpb25zOiBBcnJheTxIaWdobGlnaHRJdGVtPik6ICgoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgbWFya2VycyA9IFtdXG4gICAgZm9yIChjb25zdCBpbnRlbnRpb24gb2YgKGludGVudGlvbnM6IEFycmF5PEhpZ2hsaWdodEl0ZW0+KSkge1xuICAgICAgY29uc3QgbWF0Y2hlZFRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKGludGVudGlvbi5yYW5nZSlcbiAgICAgIGNvbnN0IG1hcmtlciA9IHRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKGludGVudGlvbi5yYW5nZSlcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGludGVudGlvbiwgbWF0Y2hlZFRleHQubGVuZ3RoKVxuICAgICAgaW50ZW50aW9uLmNyZWF0ZWQoeyB0ZXh0RWRpdG9yLCBlbGVtZW50LCBtYXJrZXIsIG1hdGNoZWRUZXh0IH0pXG4gICAgICB0ZXh0RWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgIHBvc2l0aW9uOiAndGFpbCcsXG4gICAgICAgIGl0ZW06IGVsZW1lbnQsXG4gICAgICB9KVxuICAgICAgbWFya2VyLm9uRGlkQ2hhbmdlKGZ1bmN0aW9uKHsgbmV3SGVhZEJ1ZmZlclBvc2l0aW9uOiBzdGFydCwgb2xkVGFpbEJ1ZmZlclBvc2l0aW9uOiBlbmQgfSkge1xuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gUEFERElOR19DSEFSQUNURVIucmVwZWF0KHRleHRFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3N0YXJ0LCBlbmRdKS5sZW5ndGgpXG4gICAgICB9KVxuICAgICAgbWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbWFya2Vycy5mb3JFYWNoKGZ1bmN0aW9uKG1hcmtlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgICAgfSBjYXRjaCAoXykgeyAvKiBObyBPcCAqLyB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmNsZWFyKClcbiAgfVxufVxuIl19