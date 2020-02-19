(function() {
  var ASS, Directory, fixtures, fs, getFixturesFrom, path;

  ASS = require('lib-ass');

  Directory = require('atom').Directory;

  fs = require('fs');

  path = require('path');

  if (!fixtures) {
    getFixturesFrom = function(directoryPath) {
      var directory, entries, entry, filename, fixture, j, len, results;
      if (directoryPath == null) {
        directoryPath = '';
      }
      results = [];
      directory = new Directory(path.join(__dirname, './fixtures' + directoryPath));
      entries = directory.getEntriesSync();
      for (j = 0, len = entries.length; j < len; j++) {
        entry = entries[j];
        if (entry.isFile()) {
          filename = entry.getBaseName();
          if (filename.substr(-4) === '.ass') {
            fixture = directoryPath + "/" + filename.substr(0, filename.length - 4);
            results.push(fixture);
          }
        } else {
          results = results.concat(getFixturesFrom(directoryPath + "/" + entry.getBaseName()));
        }
      }
      return results;
    };
    fixtures = getFixturesFrom();
  }

  describe("Markdown grammar", function() {
    var absolutePath, ass, error, fileContents, fixture, grammar, j, len, results1, tests;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-markdown');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('text.md');
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeDefined();
      return expect(grammar.scopeName).toBe("text.md");
    });
    results1 = [];
    for (j = 0, len = fixtures.length; j < len; j++) {
      fixture = fixtures[j];
      try {
        absolutePath = path.join(__dirname, "fixtures/" + fixture + ".ass");
        fileContents = fs.readFileSync(absolutePath, 'utf8');
        ass = new ASS(fileContents);
        tests = ass.getTests();
      } catch (error1) {
        error = error1;
        ass = null;
        tests = 0;
      }
      it("should load " + absolutePath, function() {
        return expect(ass).not.toEqual(null);
      });
      it("should define at least one test", function() {
        return expect(tests.length > 0).toEqual(true);
      });
      results1.push(describe(fixture, function() {
        grammar = null;
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-markdown');
          });
          return runs(function() {
            return grammar = atom.grammars.grammarForScopeName('text.md');
          });
        });
        return tests.forEach(function(test) {
          if (!test.isValid) {
            return xit("should pass test: " + fixture + "/" + test.id, function() {});
          } else {
            return it("should pass test: " + fixture + "/" + test.id, function() {
              var a, b, expectation, i, k, l, len1, len2, line, token, tokens;
              i = 0;
              tokens = grammar.tokenizeLines(test.input);
              for (a = k = 0, len1 = tokens.length; k < len1; a = ++k) {
                line = tokens[a];
                for (b = l = 0, len2 = line.length; l < len2; b = ++l) {
                  token = line[b];
                  expectation = test.tokens[i];
                  if (tokens[a][b].value.length) {
                    expect(tokens[a][b]).toEqual({
                      value: expectation.value,
                      scopes: expectation.scopes
                    });
                  }
                  i++;
                }
              }
            });
          }
        });
      }));
    }
    return results1;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtbWFya2Rvd24vc3BlYy9hc3Mtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsU0FBUjs7RUFDTCxZQUFhLE9BQUEsQ0FBUSxNQUFSOztFQUNkLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBaUJQLElBQUEsQ0FBTyxRQUFQO0lBQ0UsZUFBQSxHQUFrQixTQUFDLGFBQUQ7QUFDaEIsVUFBQTs7UUFEaUIsZ0JBQWdCOztNQUNqQyxPQUFBLEdBQVU7TUFDVixTQUFBLEdBQVksSUFBSSxTQUFKLENBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFlBQUEsR0FBZSxhQUFwQyxDQUFkO01BQ1osT0FBQSxHQUFVLFNBQVMsQ0FBQyxjQUFWLENBQUE7QUFDVixXQUFBLHlDQUFBOztRQUNFLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFIO1VBQ0UsUUFBQSxHQUFXLEtBQUssQ0FBQyxXQUFOLENBQUE7VUFDWCxJQUFHLFFBQVEsQ0FBQyxNQUFULENBQWdCLENBQUMsQ0FBakIsQ0FBQSxLQUF1QixNQUExQjtZQUNFLE9BQUEsR0FBVSxhQUFBLEdBQWdCLEdBQWhCLEdBQXNCLFFBQVEsQ0FBQyxNQUFULENBQWdCLENBQWhCLEVBQW1CLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXJDO1lBQ2hDLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUZGO1dBRkY7U0FBQSxNQUFBO1VBTUUsT0FBQSxHQUFVLE9BQU8sQ0FBQyxNQUFSLENBQWUsZUFBQSxDQUFnQixhQUFBLEdBQWdCLEdBQWhCLEdBQXNCLEtBQUssQ0FBQyxXQUFOLENBQUEsQ0FBdEMsQ0FBZixFQU5aOztBQURGO0FBUUEsYUFBTztJQVpTO0lBY2xCLFFBQUEsR0FBVyxlQUFBLENBQUEsRUFmYjs7O0VBaUJBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO0FBQzNCLFFBQUE7SUFBQSxPQUFBLEdBQVU7SUFFVixVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixtQkFBOUI7TUFEYyxDQUFoQjthQUdBLElBQUEsQ0FBSyxTQUFBO2VBQ0gsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsU0FBbEM7TUFEUCxDQUFMO0lBSlMsQ0FBWDtJQVFBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO01BQ3ZCLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxXQUFoQixDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsU0FBL0I7SUFGdUIsQ0FBekI7QUFJQTtTQUFBLDBDQUFBOztBQUdFO1FBQ0UsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixXQUFBLEdBQVksT0FBWixHQUFvQixNQUF6QztRQUNmLFlBQUEsR0FBZSxFQUFFLENBQUMsWUFBSCxDQUFnQixZQUFoQixFQUE4QixNQUE5QjtRQUNmLEdBQUEsR0FBTSxJQUFJLEdBQUosQ0FBUSxZQUFSO1FBQ04sS0FBQSxHQUFRLEdBQUcsQ0FBQyxRQUFKLENBQUEsRUFKVjtPQUFBLGNBQUE7UUFLTTtRQUNKLEdBQUEsR0FBTTtRQUNOLEtBQUEsR0FBUSxFQVBWOztNQVVBLEVBQUEsQ0FBRyxjQUFBLEdBQWUsWUFBbEIsRUFBa0MsU0FBQTtlQUNoQyxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsR0FBRyxDQUFDLE9BQWhCLENBQXdCLElBQXhCO01BRGdDLENBQWxDO01BR0EsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUE7ZUFDcEMsTUFBQSxDQUFPLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBdEIsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxJQUFqQztNQURvQyxDQUF0QztvQkFJQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBO1FBQ2hCLE9BQUEsR0FBVTtRQUVWLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsZUFBQSxDQUFnQixTQUFBO21CQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixtQkFBOUI7VUFEYyxDQUFoQjtpQkFHQSxJQUFBLENBQUssU0FBQTttQkFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxTQUFsQztVQURQLENBQUw7UUFKUyxDQUFYO2VBU0EsS0FBSyxDQUFDLE9BQU4sQ0FBYyxTQUFDLElBQUQ7VUFFWixJQUFBLENBQU8sSUFBSSxDQUFDLE9BQVo7bUJBQ0UsR0FBQSxDQUFJLG9CQUFBLEdBQXFCLE9BQXJCLEdBQTZCLEdBQTdCLEdBQWdDLElBQUksQ0FBQyxFQUF6QyxFQUErQyxTQUFBLEdBQUEsQ0FBL0MsRUFERjtXQUFBLE1BQUE7bUJBS0UsRUFBQSxDQUFHLG9CQUFBLEdBQXFCLE9BQXJCLEdBQTZCLEdBQTdCLEdBQWdDLElBQUksQ0FBQyxFQUF4QyxFQUE4QyxTQUFBO0FBQzVDLGtCQUFBO2NBQUEsQ0FBQSxHQUFJO2NBQ0osTUFBQSxHQUFTLE9BQU8sQ0FBQyxhQUFSLENBQXNCLElBQUksQ0FBQyxLQUEzQjtBQUNULG1CQUFBLGtEQUFBOztBQUNFLHFCQUFBLGdEQUFBOztrQkFDRSxXQUFBLEdBQWMsSUFBSSxDQUFDLE1BQU8sQ0FBQSxDQUFBO2tCQU8xQixJQUFHLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsTUFBdEI7b0JBQ0UsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQWpCLENBQW9CLENBQUMsT0FBckIsQ0FBNkI7c0JBQUEsS0FBQSxFQUFPLFdBQVcsQ0FBQyxLQUFuQjtzQkFBMEIsTUFBQSxFQUFRLFdBQVcsQ0FBQyxNQUE5QztxQkFBN0IsRUFERjs7a0JBRUEsQ0FBQTtBQVZGO0FBREY7WUFINEMsQ0FBOUMsRUFMRjs7UUFGWSxDQUFkO01BWmdCLENBQWxCO0FBcEJGOztFQWYyQixDQUE3QjtBQXJDQSIsInNvdXJjZXNDb250ZW50IjpbIkFTUyA9IHJlcXVpcmUgJ2xpYi1hc3MnXG57RGlyZWN0b3J5fSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbiMgTk9URVxuIyBNYW51YWxseSBzcGVjaWZ5IHtmaXh0dXJlc30gaWYgeW91IG9ubHkgd2FudCB0byBydW4gc3BlY2lmaWMgdGVzdHMuXG4jIEEge2ZpeHR1cmV9IGlzIGEgcmVsYXRpdmUgcGF0aCArIGZpbGVuYW1lICh3aXRob3V0IGV4dGVuc2lvbikuXG4jIGZpeHR1cmVzID0gW1xuIyAgICMgXCJibG9ja3MvZmVuY2VkLWNvZGVcIlxuIyAgICMgXCJmbGF2b3JzL21hdGhcIlxuIyAgICMgXCJpbmxpbmVzL2VudGl0aWVzXCJcbiMgICBcImlzc3Vlc1wiXG4jICAgXCJmbGF2b3JzL3JtYXJrZG93blwiXG4jIF1cblxuIyBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlIHRoZSB7Zml4dHVyZXN9IGFycmF5IGZyb20gdGhlIGZpbGUgc3lzdGVtLlxuIyBJbmNsdWRlIGFsbCAuYXNzIGZpbGVzIGZvdW5kIGluc2lkZSAvc3BlYy9maXh0dXJlcywgYnkgdGhlaXIgcmVsYXRpdmUgcGF0aFxuIyBidXQgZXhjbHVkaW5nIHRoZSBmaWxlIGV4dGVuc2lvbi4gVGhpcyB7Zml4dHVyZX0gaXMgdXNlZCB0byBnZW5lcmF0ZVxuIyBpZGVudGlmaWVycyBmb3IgdGFza3MuXG51bmxlc3MgZml4dHVyZXNcbiAgZ2V0Rml4dHVyZXNGcm9tID0gKGRpcmVjdG9yeVBhdGggPSAnJykgLT5cbiAgICByZXN1bHRzID0gW11cbiAgICBkaXJlY3RvcnkgPSBuZXcgRGlyZWN0b3J5KHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2ZpeHR1cmVzJyArIGRpcmVjdG9yeVBhdGgpKVxuICAgIGVudHJpZXMgPSBkaXJlY3RvcnkuZ2V0RW50cmllc1N5bmMoKVxuICAgIGZvciBlbnRyeSBpbiBlbnRyaWVzXG4gICAgICBpZiBlbnRyeS5pc0ZpbGUoKVxuICAgICAgICBmaWxlbmFtZSA9IGVudHJ5LmdldEJhc2VOYW1lKClcbiAgICAgICAgaWYgZmlsZW5hbWUuc3Vic3RyKC00KSBpcyAnLmFzcydcbiAgICAgICAgICBmaXh0dXJlID0gZGlyZWN0b3J5UGF0aCArIFwiL1wiICsgZmlsZW5hbWUuc3Vic3RyKDAsIGZpbGVuYW1lLmxlbmd0aCAtIDQpXG4gICAgICAgICAgcmVzdWx0cy5wdXNoIGZpeHR1cmVcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0KGdldEZpeHR1cmVzRnJvbShkaXJlY3RvcnlQYXRoICsgXCIvXCIgKyBlbnRyeS5nZXRCYXNlTmFtZSgpKSlcbiAgICByZXR1cm4gcmVzdWx0c1xuXG4gIGZpeHR1cmVzID0gZ2V0Rml4dHVyZXNGcm9tKClcblxuZGVzY3JpYmUgXCJNYXJrZG93biBncmFtbWFyXCIsIC0+XG4gIGdyYW1tYXIgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLW1hcmtkb3duJylcblxuICAgIHJ1bnMgLT5cbiAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3RleHQubWQnKVxuXG4gICMgVGVzdCB0aGUgZ3JhbW1hclxuICBpdCBcInBhcnNlcyB0aGUgZ3JhbW1hclwiLCAtPlxuICAgIGV4cGVjdChncmFtbWFyKS50b0JlRGVmaW5lZCgpXG4gICAgZXhwZWN0KGdyYW1tYXIuc2NvcGVOYW1lKS50b0JlIFwidGV4dC5tZFwiXG5cbiAgZm9yIGZpeHR1cmUgaW4gZml4dHVyZXNcblxuICAgICMgVHJ5IHRvIGxvYWQgdGhlIGZpeHR1cmVcbiAgICB0cnlcbiAgICAgIGFic29sdXRlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiZml4dHVyZXMvI3tmaXh0dXJlfS5hc3NcIilcbiAgICAgIGZpbGVDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhhYnNvbHV0ZVBhdGgsICd1dGY4JylcbiAgICAgIGFzcyA9IG5ldyBBU1MoZmlsZUNvbnRlbnRzKVxuICAgICAgdGVzdHMgPSBhc3MuZ2V0VGVzdHMoKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBhc3MgPSBudWxsXG4gICAgICB0ZXN0cyA9IDBcblxuICAgICMgVGVzdCB0aGUgYmFzaWNzIG9mIHRoZSBmaXh0dXJlXG4gICAgaXQgXCJzaG91bGQgbG9hZCAje2Fic29sdXRlUGF0aH1cIiwgLT5cbiAgICAgIGV4cGVjdChhc3MpLm5vdC50b0VxdWFsKG51bGwpXG5cbiAgICBpdCBcInNob3VsZCBkZWZpbmUgYXQgbGVhc3Qgb25lIHRlc3RcIiwgLT5cbiAgICAgIGV4cGVjdCh0ZXN0cy5sZW5ndGggPiAwKS50b0VxdWFsKHRydWUpXG5cbiAgICAjIEV2ZXJ5dGhpbmcgc2VlbXMgdG8gYmUgb2theSwgbGV0J3MgcnVuIHRoZSB0ZXN0c1xuICAgIGRlc2NyaWJlIGZpeHR1cmUsIC0+XG4gICAgICBncmFtbWFyID0gbnVsbFxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1tYXJrZG93bicpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3RleHQubWQnKVxuXG4gICAgICAjIEN5Y2xlIHRocm91Z2ggdGhlIHRlc3RzIHdlJ3ZlIGNyZWF0ZWQgaW4gQVNTXG4gICAgICAjIGFuZCB3ZSBuZWVkIHRvIGRvIGl0IGluIGEgY2xvc3VyZSBhcHBhcmVudGx5XG4gICAgICB0ZXN0cy5mb3JFYWNoICh0ZXN0KSAtPlxuXG4gICAgICAgIHVubGVzcyB0ZXN0LmlzVmFsaWRcbiAgICAgICAgICB4aXQgXCJzaG91bGQgcGFzcyB0ZXN0OiAje2ZpeHR1cmV9LyN7dGVzdC5pZH1cIiwgLT5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBlbHNlXG5cbiAgICAgICAgICBpdCBcInNob3VsZCBwYXNzIHRlc3Q6ICN7Zml4dHVyZX0vI3t0ZXN0LmlkfVwiLCAtPlxuICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAgIHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyh0ZXN0LmlucHV0KVxuICAgICAgICAgICAgZm9yIGxpbmUsIGEgaW4gdG9rZW5zXG4gICAgICAgICAgICAgIGZvciB0b2tlbiwgYiBpbiBsaW5lXG4gICAgICAgICAgICAgICAgZXhwZWN0YXRpb24gPSB0ZXN0LnRva2Vuc1tpXVxuICAgICAgICAgICAgICAgICMgTk9URVxuICAgICAgICAgICAgICAgICMgQSB0b2tlbi52YWx1ZSB3aXRob3V0IGEgbGVuZ3RoIGhhcyBiZWVuIGNyZWF0ZWQsIGFuZCBpc1xuICAgICAgICAgICAgICAgICMgaWdub3JlZC4gSSBiZWxpZXZlIHRoaXMgaGFwcGVucyB3aGVuIGFuIG9wdGlvbmFsIGNhcHR1cmUgaW5cbiAgICAgICAgICAgICAgICAjIHRoZSBncmFtbWFyIGlzIGVtcHR5LiBBcyBmYXIgYXMgSSBjYW4gdGVsbCwgdGhlc2UgY2FuIGJlXG4gICAgICAgICAgICAgICAgIyBzYWZlbHkgaWdub3JlZCwgYmVjYXVzZSB5b3Ugd291bGQgb21pdCB0aGVzZSAodW5leHBlY3RlZClcbiAgICAgICAgICAgICAgICAjIHRva2VucyB3aGVuIHdyaXRpbmcgbWFudWFsIHRlc3RzLlxuICAgICAgICAgICAgICAgIGlmIHRva2Vuc1thXVtiXS52YWx1ZS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgIGV4cGVjdCh0b2tlbnNbYV1bYl0pLnRvRXF1YWwgdmFsdWU6IGV4cGVjdGF0aW9uLnZhbHVlLCBzY29wZXM6IGV4cGVjdGF0aW9uLnNjb3Blc1xuICAgICAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgcmV0dXJuXG4iXX0=
