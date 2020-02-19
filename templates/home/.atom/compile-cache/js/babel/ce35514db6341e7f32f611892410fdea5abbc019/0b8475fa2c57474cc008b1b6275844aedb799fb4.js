Object.defineProperty(exports, '__esModule', {
  value: true
});

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

var _atom = require('atom');

/* eslint-enable import/no-extraneous-dependencies, import/extensions */

// Some internal variables
'use babel';var baseUrl = 'https://github.com/koalaman/shellcheck/wiki';
var errorCodeRegex = /SC\d{4}/;
var regex = /.+?:(\d+):(\d+):\s(\w+?):\s(.+)/g;

var createURL = function createURL(text) {
  var match = errorCodeRegex.exec(text);
  if (match) {
    return baseUrl + '/' + match[0];
  }
  return undefined;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-shellcheck');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-shellcheck.shellcheckExecutablePath', function (value) {
      _this.executablePath = value;
    }), atom.config.observe('linter-shellcheck.enableNotice', function (value) {
      _this.enableNotice = value;
    }), atom.config.observe('linter-shellcheck.userParameters', function (value) {
      _this.userParameters = value.trim().split(' ').filter(Boolean);
    }), atom.config.observe('linter-shellcheck.useProjectCwd', function (value) {
      _this.useProjectCwd = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var helpers = require('atom-linter');
    var path = require('path');

    return {
      name: 'ShellCheck',
      grammarScopes: ['source.shell'],
      scope: 'file',
      lintsOnChange: true,
      lint: function lint(textEditor) {
        if (!atom.workspace.isTextEditor(textEditor)) {
          return null;
        }

        var filePath = textEditor.getPath();
        if (!filePath) {
          // TextEditor has no path associated with it (yet)
          return null;
        }

        var fileExt = path.extname(filePath);
        if (fileExt === '.zsh' || fileExt === '.zsh-theme') {
          // shellcheck does not support zsh
          return [];
        }

        var text = textEditor.getText();
        var projectPath = atom.project.relativizePath(filePath)[0];
        var cwd = _this2.useProjectCwd && projectPath ? projectPath : path.dirname(filePath);
        var showAll = _this2.enableNotice;
        // The first -f parameter overrides any others
        var parameters = [].concat(['-f', 'gcc'], _this2.userParameters, ['-']);
        var options = { stdin: text, cwd: cwd, ignoreExitCode: true };

        return helpers.exec(_this2.executablePath, parameters, options).then(function (output) {
          if (textEditor.getText() !== text) {
            // The text has changed since the lint was triggered, tell Linter not to update
            return null;
          }
          var messages = [];
          var match = regex.exec(output);
          while (match !== null) {
            var type = match[3] !== 'note' ? match[3] : 'info';
            if (showAll || type === 'warning' || type === 'error') {
              var line = Number.parseInt(match[1], 10) - 1;
              var col = Number.parseInt(match[2], 10) - 1;
              messages.push({
                severity: type,
                location: {
                  file: filePath,
                  position: helpers.generateRange(textEditor, line, col)
                },
                excerpt: match[4],
                url: createURL(match[4])
              });
            }
            match = regex.exec(output);
          }
          return messages;
        });
      }
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zaGVsbGNoZWNrL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFHb0MsTUFBTTs7Ozs7QUFIMUMsV0FBVyxDQUFDLEFBT1osSUFBTSxPQUFPLEdBQUcsNkNBQTZDLENBQUM7QUFDOUQsSUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLElBQU0sS0FBSyxHQUFHLGtDQUFrQyxDQUFDOztBQUVqRCxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxJQUFJLEVBQUs7QUFDMUIsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxNQUFJLEtBQUssRUFBRTtBQUNULFdBQVUsT0FBTyxTQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRztHQUNqQztBQUNELFNBQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUM7O3FCQUVhO0FBQ2IsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFMUQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNENBQTRDLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0UsWUFBSyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQzdCLENBQUMsRUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMvRCxZQUFLLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDM0IsQ0FBQyxFQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2pFLFlBQUssY0FBYyxHQUFHLEtB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QyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLGtCQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUMsc0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWix3QkFBUSxFQUFFLElBQUk7QUFDZCx3QkFBUSxFQUFFO0FBQ1Isc0JBQUksRUFBRSxRQUFRO0FBQ2QsMEJBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO2lCQUN2RDtBQUNELHVCQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNqQixtQkFBRyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7ZUFDekIsQ0FBQyxDQUFDO2FBQ0o7QUFDRCxpQkFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDNUI7QUFDRCxpQkFBTyxRQUFRLENBQUM7U0FDakIsQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2hlbGxjaGVjay9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zICovXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG4vKiBlc2xpbnQtZW5hYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnMgKi9cblxuLy8gU29tZSBpbnRlcm5hbCB2YXJpYWJsZXNcbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2tvYWxhbWFuL3NoZWxsY2hlY2svd2lraSc7XG5jb25zdCBlcnJvckNvZGVSZWdleCA9IC9TQ1xcZHs0fS87XG5jb25zdCByZWdleCA9IC8uKz86KFxcZCspOihcXGQrKTpcXHMoXFx3Kz8pOlxccyguKykvZztcblxuY29uc3QgY3JlYXRlVVJMID0gKHRleHQpID0+IHtcbiAgY29uc3QgbWF0Y2ggPSBlcnJvckNvZGVSZWdleC5leGVjKHRleHQpO1xuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gYCR7YmFzZVVybH0vJHttYXRjaFswXX1gO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXNoZWxsY2hlY2snKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1zaGVsbGNoZWNrLnNoZWxsY2hlY2tFeGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1zaGVsbGNoZWNrLmVuYWJsZU5vdGljZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmVuYWJsZU5vdGljZSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItc2hlbGxjaGVjay51c2VyUGFyYW1ldGVycycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnVzZXJQYXJhbWV0ZXJzID0gdmFsdWUudHJpbSgpLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItc2hlbGxjaGVjay51c2VQcm9qZWN0Q3dkJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMudXNlUHJvamVjdEN3ZCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdTaGVsbENoZWNrJyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLnNoZWxsJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6ICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGlmICghYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHRleHRFZGl0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICAgICAgLy8gVGV4dEVkaXRvciBoYXMgbm8gcGF0aCBhc3NvY2lhdGVkIHdpdGggaXQgKHlldClcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVFeHQgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBpZiAoZmlsZUV4dCA9PT0gJy56c2gnIHx8IGZpbGVFeHQgPT09ICcuenNoLXRoZW1lJykge1xuICAgICAgICAgIC8vIHNoZWxsY2hlY2sgZG9lcyBub3Qgc3VwcG9ydCB6c2hcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXTtcbiAgICAgICAgY29uc3QgY3dkID0gdGhpcy51c2VQcm9qZWN0Q3dkICYmIHByb2plY3RQYXRoID8gcHJvamVjdFBhdGggOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBzaG93QWxsID0gdGhpcy5lbmFibGVOb3RpY2U7XG4gICAgICAgIC8vIFRoZSBmaXJzdCAtZiBwYXJhbWV0ZXIgb3ZlcnJpZGVzIGFueSBvdGhlcnNcbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IFtdLmNvbmNhdChbJy1mJywgJ2djYyddLCB0aGlzLnVzZXJQYXJhbWV0ZXJzLCBbJy0nXSk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZGluOiB0ZXh0LCBjd2QsIGlnbm9yZUV4aXRDb2RlOiB0cnVlIH07XG5cbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyh0aGlzLmV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCBvcHRpb25zKS50aGVuKChvdXRwdXQpID0+IHtcbiAgICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IHRleHQpIHtcbiAgICAgICAgICAgIC8vIFRoZSB0ZXh0IGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGVcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBtYXRjaFszXSAhPT0gJ25vdGUnID8gbWF0Y2hbM10gOiAnaW5mbyc7XG4gICAgICAgICAgICBpZiAoc2hvd0FsbCB8fCB0eXBlID09PSAnd2FybmluZycgfHwgdHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICBjb25zdCBsaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxO1xuICAgICAgICAgICAgICBjb25zdCBjb2wgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDE7XG4gICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiB0eXBlLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSwgY29sKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4Y2VycHQ6IG1hdGNoWzRdLFxuICAgICAgICAgICAgICAgIHVybDogY3JlYXRlVVJMKG1hdGNoWzRdKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=