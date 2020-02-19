var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

CSON = require('season');
fs = require('fs');
path = require('path');

module.exports = (function () {
  function GrammarCompiler() {
    _classCallCheck(this, GrammarCompiler);
  }

  // Loads the basic grammar structure,
  // which includes the grouped parts in the repository,
  // and then loads all grammar subrepositories,
  // and appends them to the main repository,
  // and finally writes {grammar} to {output}

  _createClass(GrammarCompiler, [{
    key: 'compile',
    value: function compile() {
      var input = '../grammars/repositories/markdown.cson';
      var output = '../grammars/language-markdown.json';
      var directories = ['blocks', 'flavors', 'inlines'];
      var inputPath = path.join(__dirname, input);
      var grammar = CSON.readFileSync(inputPath);

      grammar.injections = this.compileInjectionsGrammar();

      for (var i = 0; i < directories.length; i++) {
        var directoryPath = path.join(__dirname, '../grammars/repositories/' + directories[i]);
        var directory = new _atom.Directory(directoryPath);
        var entries = directory.getEntriesSync();
        for (var j = 0; j < entries.length; j++) {
          var entry = entries[j];

          var _CSON$readFileSync = CSON.readFileSync(entry.path);

          var key = _CSON$readFileSync.key;
          var patterns = _CSON$readFileSync.patterns;

          if (key && patterns) {
            grammar.repository[key] = { patterns: patterns };
          }
        }
      }

      grammar.repository['fenced-code-blocks'] = {
        patterns: this.compileFencedCodeGrammar()
      };

      var outputPath = path.join(__dirname, output);
      CSON.writeFileSync(outputPath, grammar, (function () {
        return atom.commands.dispatch('body', 'window:reload');
      })());
    }

    // Reads fixtures from {input},
    // parses {data} to expand shortened syntax,
    // creates and returns patterns from valid items in {data}.
  }, {
    key: 'compileFencedCodeGrammar',
    value: function compileFencedCodeGrammar() {
      var input = '../grammars/fixtures/fenced-code.cson';
      var inputPath = path.join(__dirname, input);
      var data = CSON.readFileSync(inputPath);
      return this.createPatternsFromData(data);
    }

    // Reads fixtures from {input},
    // parses {data} to expand shortened syntax,
    // creates and returns patterns from valid items in {data}.
  }, {
    key: 'compileInjectionsGrammar',
    value: function compileInjectionsGrammar() {
      var directoryPath = path.join(__dirname, '../grammars/injections');
      var directory = new _atom.Directory(directoryPath);
      var entries = directory.getEntriesSync();
      var injections = {};

      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];

        var _CSON$readFileSync2 = CSON.readFileSync(entry.path);

        var key = _CSON$readFileSync2.key;
        var patterns = _CSON$readFileSync2.patterns;

        if (key && patterns) {
          injections[key] = {
            patterns: patterns
          };
        }
      }

      return injections;
    }

    // Transform an {item} into a {pattern} object,
    // and adds it to the {patterns} array.
  }, {
    key: 'createPatternsFromData',
    value: function createPatternsFromData(data) {
      var patterns = [];
      for (var i = 0; i < data.list.length; i++) {
        var item = this.parseItem(data.list[i]);
        if (item) {
          patterns.push({
            begin: '^\\s*([`~]{3,})\\s*(\\{?)((?:\\.?)(?:' + item.pattern + '))(?=(}| |$|{))\\s*(\\{?)([^`\\{\\}]*)(\\}?)$',
            beginCaptures: {
              '1': { name: 'punctuation.md' },
              '2': { name: 'punctuation.md' },
              '3': { name: 'language.constant.md' },
              '5': { name: 'punctuation.md' },
              '6': { patterns: [{ include: '#special-attribute-elements' }] },
              '7': { name: 'punctuation.md' }
            },
            end: '^\\s*(\\1)$',
            endCaptures: {
              '1': { name: 'punctuation.md' }
            },
            name: 'fenced.code.md',
            contentName: item.contentName,
            patterns: [{
              include: item.include
            }]
          });
        }
      }
      return patterns;
    }

    // When provided with a valid {item} ({item.pattern} is required),
    // missing {include} and {contentName} are generated.
  }, {
    key: 'parseItem',
    value: function parseItem(item) {
      if (typeof item === 'object' && item.pattern !== null) {
        if (!item.include && !item.contentName) {
          item.include = 'source.' + item.pattern;
          item.contentName = 'source.embedded.' + item.pattern;
        } else if (!item.include) {
          return false;
        }
        return item;
      }
      return false;
    }
  }]);

  return GrammarCompiler;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLW1hcmtkb3duL2xpYi9HcmFtbWFyQ29tcGlsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFMEIsTUFBTTs7QUFGaEMsV0FBVyxDQUFBOztBQUlYLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDeEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNsQixJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUV0QixNQUFNLENBQUMsT0FBTztBQUNBLFdBRFMsZUFBZSxHQUNyQjswQkFETSxlQUFlO0dBQ25COzs7Ozs7OztlQURJLGVBQWU7O1dBUTVCLG1CQUFHO0FBQ1QsVUFBTSxLQUFLLEdBQUcsd0NBQXdDLENBQUE7QUFDdEQsVUFBTSxNQUFNLEdBQUcsb0NBQW9DLENBQUE7QUFDbkQsVUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3BELFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzdDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRTVDLGFBQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUE7O0FBRXBELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLFlBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDJCQUEyQixHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3hGLFlBQU0sU0FBUyxHQUFHLG9CQUFjLGFBQWEsQ0FBQyxDQUFBO0FBQzlDLFlBQU0sT0FBTyxH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YjtBQUNELGVBQU8sSUFBSSxDQUFBO09BQ1o7QUFDRCxhQUFPLEtBQUssQ0FBQTtLQUNiOzs7U0F0SG9CLGVBQWU7SUF1SHJDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtbWFya2Rvd24vbGliL0dyYW1tYXJDb21waWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IERpcmVjdG9yeSB9IGZyb20gJ2F0b20nXG5cbkNTT04gPSByZXF1aXJlKCdzZWFzb24nKVxuZnMgPSByZXF1aXJlKCdmcycpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR3JhbW1hckNvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IgKCkge31cblxuICAvLyBMb2FkcyB0aGUgYmFzaWMgZ3JhbW1hciBzdHJ1Y3R1cmUsXG4gIC8vIHdoaWNoIGluY2x1ZGVzIHRoZSBncm91cGVkIHBhcnRzIGluIHRoZSByZXBvc2l0b3J5LFxuICAvLyBhbmQgdGhlbiBsb2FkcyBhbGwgZ3JhbW1hciBzdWJyZXBvc2l0b3JpZXMsXG4gIC8vIGFuZCBhcHBlbmRzIHRoZW0gdG8gdGhlIG1haW4gcmVwb3NpdG9yeSxcbiAgLy8gYW5kIGZpbmFsbHkgd3JpdGVzIHtncmFtbWFyfSB0byB7b3V0cHV0fVxuICBjb21waWxlICgpIHtcbiAgICBjb25zdCBpbnB1dCA9ICcuLi9ncmFtbWFycy9yZXBvc2l0b3JpZXMvbWFya2Rvd24uY3NvbidcbiAgICBjb25zdCBvdXRwdXQgPSAnLi4vZ3JhbW1hcnMvbGFuZ3VhZ2UtbWFya2Rvd24uanNvbidcbiAgICBjb25zdCBkaXJlY3RvcmllcyA9IFsnYmxvY2tzJywgJ2ZsYXZvcnMnLCAnaW5saW5lcyddXG4gICAgY29uc3QgaW5wdXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgaW5wdXQpXG4gICAgY29uc3QgZ3JhbW1hciA9IENTT04ucmVhZEZpbGVTeW5jKGlucHV0UGF0aClcblxuICAgIGdyYW1tYXIuaW5qZWN0aW9ucyA9IHRoaXMuY29tcGlsZUluamVjdGlvbnNHcmFtbWFyKClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlyZWN0b3JpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRpcmVjdG9yeVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vZ3JhbW1hcnMvcmVwb3NpdG9yaWVzLycgKyBkaXJlY3Rvcmllc1tpXSlcbiAgICAgIGNvbnN0IGRpcmVjdG9yeSA9IG5ldyBEaXJlY3RvcnkoZGlyZWN0b3J5UGF0aClcbiAgICAgIGNvbnN0IGVudHJpZXMgPSBkaXJlY3RvcnkuZ2V0RW50cmllc1N5bmMoKVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnRyaWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1tqXTtcbiAgICAgICAgY29uc3QgeyBrZXksIHBhdHRlcm5zIH0gPSBDU09OLnJlYWRGaWxlU3luYyhlbnRyeS5wYXRoKVxuICAgICAgICBpZiAoa2V5ICYmIHBhdHRlcm5zKSB7XG4gICAgICAgICAgZ3JhbW1hci5yZXBvc2l0b3J5W2tleV0gPSB7IHBhdHRlcm5zIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdyYW1tYXIucmVwb3NpdG9yeVsnZmVuY2VkLWNvZGUtYmxvY2tzJ10gPSB7XG4gICAgICBwYXR0ZXJuczogdGhpcy5jb21waWxlRmVuY2VkQ29kZUdyYW1tYXIoKVxuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBvdXRwdXQpXG4gICAgQ1NPTi53cml0ZUZpbGVTeW5jKG91dHB1dFBhdGgsIGdyYW1tYXIsIChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCgnYm9keScsICd3aW5kb3c6cmVsb2FkJylcbiAgICB9KSgpKVxuICB9XG5cbiAgLy8gUmVhZHMgZml4dHVyZXMgZnJvbSB7aW5wdXR9LFxuICAvLyBwYXJzZXMge2RhdGF9IHRvIGV4cGFuZCBzaG9ydGVuZWQgc3ludGF4LFxuICAvLyBjcmVhdGVzIGFuZCByZXR1cm5zIHBhdHRlcm5zIGZyb20gdmFsaWQgaXRlbXMgaW4ge2RhdGF9LlxuICBjb21waWxlRmVuY2VkQ29kZUdyYW1tYXIgKCkge1xuICAgIGNvbnN0IGlucHV0ID0gJy4uL2dyYW1tYXJzL2ZpeHR1cmVzL2ZlbmNlZC1jb2RlLmNzb24nXG4gICAgY29uc3QgaW5wdXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgaW5wdXQpXG4gICAgY29uc3QgZGF0YSA9IENTT04ucmVhZEZpbGVTeW5jKGlucHV0UGF0aClcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVQYXR0ZXJuc0Zyb21EYXRhKGRhdGEpXG4gIH1cblxuICAvLyBSZWFkcyBmaXh0dXJlcyBmcm9tIHtpbnB1dH0sXG4gIC8vIHBhcnNlcyB7ZGF0YX0gdG8gZXhwYW5kIHNob3J0ZW5lZCBzeW50YXgsXG4gIC8vIGNyZWF0ZXMgYW5kIHJldHVybnMgcGF0dGVybnMgZnJvbSB2YWxpZCBpdGVtcyBpbiB7ZGF0YX0uXG4gIGNvbXBpbGVJbmplY3Rpb25zR3JhbW1hciAoKSB7XG4gICAgY29uc3QgZGlyZWN0b3J5UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9ncmFtbWFycy9pbmplY3Rpb25zJylcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBuZXcgRGlyZWN0b3J5KGRpcmVjdG9yeVBhdGgpXG4gICAgY29uc3QgZW50cmllcyA9IGRpcmVjdG9yeS5nZXRFbnRyaWVzU3luYygpXG4gICAgY29uc3QgaW5qZWN0aW9ucyA9IHt9XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudHJpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1tqXTtcbiAgICAgIGNvbnN0IHsga2V5LCBwYXR0ZXJucyB9ID0gQ1NPTi5yZWFkRmlsZVN5bmMoZW50cnkucGF0aClcblxuICAgICAgaWYgKGtleSAmJiBwYXR0ZXJucykge1xuICAgICAgICBpbmplY3Rpb25zW2tleV0gPSB7XG4gICAgICAgICAgcGF0dGVybnM6IHBhdHRlcm5zXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5qZWN0aW9uc1xuICB9XG5cbiAgLy8gVHJhbnNmb3JtIGFuIHtpdGVtfSBpbnRvIGEge3BhdHRlcm59IG9iamVjdCxcbiAgLy8gYW5kIGFkZHMgaXQgdG8gdGhlIHtwYXR0ZXJuc30gYXJyYXkuXG4gIGNyZWF0ZVBhdHRlcm5zRnJvbURhdGEgKGRhdGEpIHtcbiAgICBjb25zdCBwYXR0ZXJucyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnBhcnNlSXRlbShkYXRhLmxpc3RbaV0pXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICBwYXR0ZXJucy5wdXNoKHtcbiAgICAgICAgICBiZWdpbjogJ15cXFxccyooW2B+XXszLH0pXFxcXHMqKFxcXFx7PykoKD86XFxcXC4/KSg/OicraXRlbS5wYXR0ZXJuKycpKSg/PSh9fCB8JHx7KSlcXFxccyooXFxcXHs/KShbXmBcXFxce1xcXFx9XSopKFxcXFx9PykkJyxcbiAgICAgICAgICBiZWdpbkNhcHR1cmVzOiB7XG4gICAgICAgICAgICAnMSc6IHsgbmFtZTogJ3B1bmN0dWF0aW9uLm1kJyB9LFxuICAgICAgICAgICAgJzInOiB7IG5hbWU6ICdwdW5jdHVhdGlvbi5tZCcgfSxcbiAgICAgICAgICAgICczJzogeyBuYW1lOiAnbGFuZ3VhZ2UuY29uc3RhbnQubWQnIH0sXG4gICAgICAgICAgICAnNSc6IHsgbmFtZTogJ3B1bmN0dWF0aW9uLm1kJyB9LFxuICAgICAgICAgICAgJzYnOiB7IHBhdHRlcm5zOiBbeyBpbmNsdWRlOiAnI3NwZWNpYWwtYXR0cmlidXRlLWVsZW1lbnRzJyB9XSB9LFxuICAgICAgICAgICAgJzcnOiB7IG5hbWU6ICdwdW5jdHVhdGlvbi5tZCcgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZW5kOiAnXlxcXFxzKihcXFxcMSkkJyxcbiAgICAgICAgICBlbmRDYXB0dXJlczoge1xuICAgICAgICAgICAgJzEnOiB7IG5hbWU6ICdwdW5jdHVhdGlvbi5tZCcgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmFtZTogJ2ZlbmNlZC5jb2RlLm1kJyxcbiAgICAgICAgICBjb250ZW50TmFtZTogaXRlbS5jb250ZW50TmFtZSxcbiAgICAgICAgICBwYXR0ZXJuczogW3tcbiAgICAgICAgICAgIGluY2x1ZGU6IGl0ZW0uaW5jbHVkZVxuICAgICAgICAgIH1dXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXR0ZXJuc1xuICB9XG5cbiAgLy8gV2hlbiBwcm92aWRlZCB3aXRoIGEgdmFsaWQge2l0ZW19ICh7aXRlbS5wYXR0ZXJufSBpcyByZXF1aXJlZCksXG4gIC8vIG1pc3Npbmcge2luY2x1ZGV9IGFuZCB7Y29udGVudE5hbWV9IGFyZSBnZW5lcmF0ZWQuXG4gIHBhcnNlSXRlbSAoaXRlbSkge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbS5wYXR0ZXJuICE9PSBudWxsKSB7XG4gICAgICBpZiAoIWl0ZW0uaW5jbHVkZSAmJiAhaXRlbS5jb250ZW50TmFtZSkge1xuICAgICAgICBpdGVtLmluY2x1ZGUgPSAnc291cmNlLicgKyBpdGVtLnBhdHRlcm5cbiAgICAgICAgaXRlbS5jb250ZW50TmFtZSA9ICdzb3VyY2UuZW1iZWRkZWQuJyArIGl0ZW0ucGF0dGVyblxuICAgICAgfSBlbHNlIGlmICghaXRlbS5pbmNsdWRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==