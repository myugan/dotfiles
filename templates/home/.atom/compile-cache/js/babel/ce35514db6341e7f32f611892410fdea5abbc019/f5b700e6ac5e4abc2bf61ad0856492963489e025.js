function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var path = _interopRequireWildcard(_path);

// eslint-disable-next-line no-unused-vars

var _jasmineFix = require('jasmine-fix');

'use babel';

var _require$provideLinter = require('../lib/main.js').provideLinter();

var lint = _require$provideLinter.lint;

var cleanPath = path.join(__dirname, 'fixtures', 'clean.sh');
var badPath = path.join(__dirname, 'fixtures', 'bad.sh');
var sourceFileRelativePath = path.join(__dirname, 'fixtures', 'source_directive', 'file_relative.sh');
var sourceProjectRelativePath = path.join(__dirname, 'fixtures', 'source_directive', 'project_relative.sh');

describe('The ShellCheck provider for Linter', function () {
  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    atom.workspace.destroyActivePaneItem();

    // Info about this beforeEach() implementation:
    // https://github.com/AtomLinter/Meta/issues/15
    var activationPromise = atom.packages.activatePackage('linter-shellcheck');

    yield atom.packages.activatePackage('language-shellscript');
    yield atom.workspace.open(cleanPath);

    atom.packages.triggerDeferredActivationHooks();
    yield activationPromise;
  }));

  (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(cleanPath);
    var messages = yield lint(editor);

    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('handles messages from ShellCheck', _asyncToGenerator(function* () {
    var expectedExcerpt = 'Tips depend on target shell and yours is unknown. Add a shebang. [SC2148]';
    var expectedURL = 'https://github.com/koalaman/shellcheck/wiki/SC2148';
    var editor = yield atom.workspace.open(badPath);
    var messages = yield lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expectedExcerpt);
    expect(messages[0].url).toBe(expectedURL);
    expect(messages[0].location.file).toBe(badPath);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 4]]);
  }));

  describe('implements useProjectCwd and', function () {
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      atom.config.set('linter-shellcheck.userParameters', '-x');
      atom.config.set('linter-shellcheck.enableNotice', true);
    }));

    (0, _jasmineFix.it)('uses file-relative source= directives by default', _asyncToGenerator(function* () {
      atom.config.set('linter-shellcheck.useProjectCwd', false);
      var editor = yield atom.workspace.open(sourceFileRelativePath);
      var messages = yield lint(editor);
      expect(messages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('errors for file-relative source= path with useProjectCwd = true', _asyncToGenerator(function* () {
      atom.config.set('linter-shellcheck.useProjectCwd', true);
      var editor = yield atom.workspace.open(sourceFileRelativePath);
      var messages = yield lint(editor);
      expect(messages.length).toBe(1);
      expect(messages[0].excerpt).toMatch(/openBinaryFile: does not exist/);
    }));

    (0, _jasmineFix.it)('uses project-relative source= directives via setting (based at fixtures/)', _asyncToGenerator(function* () {
      atom.config.set('linter-shellcheck.useProjectCwd', true);
      var editor = yield atom.workspace.open(sourceProjectRelativePath);
      var messages = yield lint(editor);
      expect(messages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('errors for project-relative source= path with useProjectCwd = false (based at fixtures/)', _asyncToGenerator(function* () {
      atom.config.set('linter-shellcheck.useProjectCwd', false);
      var editor = yield atom.workspace.open(sourceProjectRelativePath);
      var messages = yield lint(editor);
      expect(messages.length).toBe(1);
      expect(messages[0].excerpt).toMatch(/openBinaryFile: does not exist/);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zaGVsbGNoZWNrL3NwZWMvbGludGVyLXNoZWxsY2hlY2stc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVzQixNQUFNOztJQUFoQixJQUFJOzs7OzBCQUVxQyxhQUFhOztBQUpsRSxXQUFXLENBQUM7OzZCQU1LLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGFBQWEsRUFBRTs7SUFBbEQsSUFBSSwwQkFBSixJQUFJOztBQUVaLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0QsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN4RyxJQUFNLHlCQUF5QixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDOztBQUU5RyxRQUFRLENBQUMsb0NBQW9DLEVBQUUsWUFBTTtBQUNuRCxnREFBVyxhQUFZO0FBQ3JCLFFBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7OztBQUl2QyxRQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRTdFLFVBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM1RCxVQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVyQyxRQUFJLENBQUMsUUFBUSxDQUFDLDhC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ci1zaGVsbGNoZWNrL3NwZWMvbGludGVyLXNoZWxsY2hlY2stc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQgeyBpdCwgZml0LCB3YWl0LCBiZWZvcmVFYWNoLCBhZnRlckVhY2ggfSBmcm9tICdqYXNtaW5lLWZpeCc7XG5cbmNvbnN0IHsgbGludCB9ID0gcmVxdWlyZSgnLi4vbGliL21haW4uanMnKS5wcm92aWRlTGludGVyKCk7XG5cbmNvbnN0IGNsZWFuUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdjbGVhbi5zaCcpO1xuY29uc3QgYmFkUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdiYWQuc2gnKTtcbmNvbnN0IHNvdXJjZUZpbGVSZWxhdGl2ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnc291cmNlX2RpcmVjdGl2ZScsICdmaWxlX3JlbGF0aXZlLnNoJyk7XG5jb25zdCBzb3VyY2VQcm9qZWN0UmVsYXRpdmVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3NvdXJjZV9kaXJlY3RpdmUnLCAncHJvamVjdF9yZWxhdGl2ZS5zaCcpO1xuXG5kZXNjcmliZSgnVGhlIFNoZWxsQ2hlY2sgcHJvdmlkZXIgZm9yIExpbnRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKCk7XG5cbiAgICAvLyBJbmZvIGFib3V0IHRoaXMgYmVmb3JlRWFjaCgpIGltcGxlbWVudGF0aW9uOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL01ldGEvaXNzdWVzLzE1XG4gICAgY29uc3QgYWN0aXZhdGlvblByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyLXNoZWxsY2hlY2snKTtcblxuICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1zaGVsbHNjcmlwdCcpO1xuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oY2xlYW5QYXRoKTtcblxuICAgIGF0b20ucGFja2FnZXMudHJpZ2dlckRlZmVycmVkQWN0aXZhdGlvbkhvb2tzKCk7XG4gICAgYXdhaXQgYWN0aXZhdGlvblByb21pc2U7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oY2xlYW5QYXRoKTtcbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKTtcblxuICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuXG4gIGl0KCdoYW5kbGVzIG1lc3NhZ2VzIGZyb20gU2hlbGxDaGVjaycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBleHBlY3RlZEV4Y2VycHQgPSAnVGlwcyBkZXBlbmQgb24gdGFyZ2V0IHNoZWxsIGFuZCB5b3VycyBpcyB1bmtub3duLiBBZGQgYSBzaGViYW5nLiBbU0MyMTQ4XSc7XG4gICAgY29uc3QgZXhwZWN0ZWRVUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2tvYWxhbWFuL3NoZWxsY2hlY2svd2lraS9TQzIxNDgnO1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oYmFkUGF0aCk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcik7XG5cbiAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpO1xuICAgIGV4cGVjdChtZXNzYWdlc1swXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKTtcbiAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZShleHBlY3RlZEV4Y2VycHQpO1xuICAgIGV4cGVjdChtZXNzYWdlc1swXS51cmwpLnRvQmUoZXhwZWN0ZWRVUkwpO1xuICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKGJhZFBhdGgpO1xuICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDBdLCBbMCwgNF1dKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ltcGxlbWVudHMgdXNlUHJvamVjdEN3ZCBhbmQnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1zaGVsbGNoZWNrLnVzZXJQYXJhbWV0ZXJzJywgJy14Jyk7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1zaGVsbGNoZWNrLmVuYWJsZU5vdGljZScsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgZmlsZS1yZWxhdGl2ZSBzb3VyY2U9IGRpcmVjdGl2ZXMgYnkgZGVmYXVsdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXNoZWxsY2hlY2sudXNlUHJvamVjdEN3ZCcsIGZhbHNlKTtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oc291cmNlRmlsZVJlbGF0aXZlUGF0aCk7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZXJyb3JzIGZvciBmaWxlLXJlbGF0aXZlIHNvdXJjZT0gcGF0aCB3aXRoIHVzZVByb2plY3RDd2QgPSB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItc2hlbGxjaGVjay51c2VQcm9qZWN0Q3dkJywgdHJ1ZSk7XG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHNvdXJjZUZpbGVSZWxhdGl2ZVBhdGgpO1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcik7XG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvTWF0Y2goL29wZW5CaW5hcnlGaWxlOiBkb2VzIG5vdCBleGlzdC8pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgcHJvamVjdC1yZWxhdGl2ZSBzb3VyY2U9IGRpcmVjdGl2ZXMgdmlhIHNldHRpbmcgKGJhc2VkIGF0IGZpeHR1cmVzLyknLCBhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1zaGVsbGNoZWNrLnVzZVByb2plY3RDd2QnLCB0cnVlKTtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oc291cmNlUHJvamVjdFJlbGF0aXZlUGF0aCk7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZXJyb3JzIGZvciBwcm9qZWN0LXJlbGF0aXZlIHNvdXJjZT0gcGF0aCB3aXRoIHVzZVByb2plY3RDd2QgPSBmYWxzZSAoYmFzZWQgYXQgZml4dHVyZXMvKScsIGFzeW5jICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXNoZWxsY2hlY2sudXNlUHJvamVjdEN3ZCcsIGZhbHNlKTtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oc291cmNlUHJvamVjdFJlbGF0aXZlUGF0aCk7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9NYXRjaCgvb3BlbkJpbmFyeUZpbGU6IGRvZXMgbm90IGV4aXN0Lyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=