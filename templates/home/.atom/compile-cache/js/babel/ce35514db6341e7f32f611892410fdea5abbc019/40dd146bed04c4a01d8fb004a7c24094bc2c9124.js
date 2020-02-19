Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utils = require('../utils');

var _guruUtils = require('../guru-utils');

var _tagsDialog = require('./tags-dialog');

var GoModifyTags = (function () {
  function GoModifyTags(goconfig) {
    var _this = this;

    _classCallCheck(this, GoModifyTags);

    this.goconfig = goconfig;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:add-tags', function () {
      return _this.commandInvoked('Add');
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:remove-tags', function () {
      return _this.commandInvoked('Remove');
    }));
  }

  _createClass(GoModifyTags, [{
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'commandInvoked',
    value: _asyncToGenerator(function* (mode) {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      if (!editor || !(0, _utils.isValidEditor)(editor)) {
        return;
      }

      if (editor.hasMultipleCursors()) {
        atom.notifications.addWarning('go-plus', {
          dismissable: true,
          icon: 'tag',
          detail: 'Modifying tags only works with a single cursor'
        });
        return;
      }
      var cmd = yield this.goconfig.locator.findTool('gomodifytags');
      if (cmd) {
        (function () {
          var dialog = new _tagsDialog.TagsDialog({
            mode: mode
          });
          var c = cmd;
          dialog.onAccept = function (options) {
            return _this2.modifyTags(editor, options, mode, c);
          };
          dialog.attach();
        })();
      }
    })
  }, {
    key: 'buildArgs',
    value: function buildArgs(editor, options, mode) {
      var tags = options.tags;
      var transform = options.transform;
      var sortTags = options.sortTags;

      // if there is a selection, use the -line flag,
      // otherwise just use the cursor offset (and apply modifications to entire struct)
      var args = ['-file', editor.getPath() || ''];
      var selection = editor.getSelectedBufferRange();
      if (selection && !selection.start.isEqual(selection.end)) {
        args.push('-line');
        if (selection.isSingleLine()) {
          args.push('' + (selection.start.row + 1));
        } else {
          args.push(selection.start.row + 1 + ',' + (selection.end.row + 1));
        }
      } else {
        args.push('-offset');
        args.push((0, _utils.wordAndOffset)(editor).offset.toString());
      }

      if (editor.isModified()) {
        args.push('-modified');
      }

      if (transform) {
        args.push('-transform');
        args.push(transform);
      }
      if (sortTags) {
        args.push('-sort');
      }

      if (mode === 'Add') {
        var tagNames = [];
        var opts = [];
        for (var t of tags) {
          tagNames.push(t.tag);
          if (t.option && t.option.length) {
            opts.push(t.tag + '=' + t.option);
          }
        }
        if (opts.length > 0) {
          args.push('-add-options');
          args.push(opts.join(','));
        }
        if (tagNames.length === 0) {
          tagNames.push('json');
        }
        args.push('-add-tags', tagNames.join(','));
      } else if (mode === 'Remove') {
        var tagNames = [];
        var opts = [];
        if (!tags || !tags.length) {
          args.push('-clear-tags');
        } else {
          for (var t of tags) {
            if (t.option && t.option.length) {
              opts.push(t.tag + '=' + t.option);
            } else {
              tagNames.push(t.tag);
            }
          }
          if (tagNames.length > 0) {
            args.push('-remove-tags');
            args.push(tagNames.join(','));
          }
          if (opts.length > 0) {
            args.push('-remove-options');
            args.push(opts.join(','));
          }
        }
      }
      return args;
    }
  }, {
    key: 'modifyTags',
    value: _asyncToGenerator(function* (editor, options, mode, cmd) {
      var executorOptions = this.goconfig.executor.getOptions('file', editor);

      if (editor.isModified()) {
        executorOptions.input = (0, _guruUtils.buildGuruArchive)(editor);
      }

      var args = this.buildArgs(editor, options, mode);
      var r = yield this.goconfig.executor.exec(cmd, args, executorOptions);
      if (r.error) {
        if (r.error.code === 'ENOENT') {
          atom.notifications.addError('Missing Tool', {
            detail: 'Missing the `gomodifytags` tool.',
            dismissable: true
          });
        } else {
          atom.notifications.addError('Error', {
            detail: r.error.message,
            dismissable: true
          });
        }
        return { success: false, result: r };
      } else if (r.exitcode !== 0) {
        var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
        atom.notifications.addError('Error', {
          detail: stderr.trim(),
          dismissable: true
        });
        return { success: false, result: r };
      }
      editor.getBuffer().setTextViaDiff(r.stdout.toString());
      return { success: true, result: r };
    })
  }]);

  return GoModifyTags;
})();

exports.GoModifyTags = GoModifyTags;
// | 'lispcase',
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3RhZ3MvZ29tb2RpZnl0YWdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRW9DLE1BQU07O3FCQUNHLFVBQVU7O3lCQUN0QixlQUFlOzswQkFDckIsZUFBZTs7SUFpQnBDLFlBQVk7QUFJTCxXQUpQLFlBQVksQ0FJSixRQUFrQixFQUFFOzs7MEJBSjVCLFlBQVk7O0FBS2QsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUU7YUFDckQsTUFBSyxjQUFjLENBQUMsS0FBSyxDQUFDO0tBQUEsQ0FDM0IsQ0FDRixDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFO2FBQ3hELE1BQUssY0FBYyxDQUFDLFFBQVEsQ0FBQztLQUFBLENBQzlCLENBQ0YsQ0FBQTtHQUNGOztlQWpCRyxZQUFZOztXQW1CVCxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7Ozs2QkFFbUIsV0FBQyxJQUFVLEVBQUU7OztBQUMvQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsVUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLDBCQUFjLE1BQU0sQ0FBQyxFQUFFO0FBQ3JDLGVBQU07T0FDUDs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO0FBQy9CLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtB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QkFBVyxFQUFFLElBQUk7V0FDbEIsQ0FBQyxDQUFBO1NBQ0g7QUFDRCxlQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUE7T0FDckMsTUFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxFQUFFO0FBQzNCLFlBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUMxRSxZQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDbkMsZ0JBQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3JCLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUE7QUFDRixlQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUE7T0FDckM7QUFDRCxZQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUN0RCxhQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUE7S0FDcEM7OztTQW5LRyxZQUFZOzs7UUFzS1QsWUFBWSxHQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvdGFncy9nb21vZGlmeXRhZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGlzVmFsaWRFZGl0b3IsIHdvcmRBbmRPZmZzZXQgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGJ1aWxkR3VydUFyY2hpdmUgfSBmcm9tICcuLi9ndXJ1LXV0aWxzJ1xuaW1wb3J0IHsgVGFnc0RpYWxvZyB9IGZyb20gJy4vdGFncy1kaWFsb2cnXG5cbmltcG9ydCB0eXBlIHsgR29Db25maWcgfSBmcm9tICcuLy4uL2NvbmZpZy9zZXJ2aWNlJ1xuXG50eXBlIE1vZGUgPSAnQWRkJyB8ICdSZW1vdmUnXG5cbmV4cG9ydCB0eXBlIFRhZyA9IHtcbiAgdGFnOiBzdHJpbmcsXG4gIG9wdGlvbj86IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBHb01vZGlmeVRhZ3NPcHRpb25zID0ge1xuICB0YWdzOiBBcnJheTxUYWc+LFxuICB0cmFuc2Zvcm06ICdzbmFrZWNhc2UnIHwgJ2NhbWVsY2FzZScsIC8vIHwgJ2xpc3BjYXNlJyxcbiAgc29ydFRhZ3M6IGJvb2xlYW5cbn1cblxuY2xhc3MgR29Nb2RpZnlUYWdzIHtcbiAgZ29jb25maWc6IEdvQ29uZmlnXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdHJ1Y3Rvcihnb2NvbmZpZzogR29Db25maWcpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdnb2xhbmc6YWRkLXRhZ3MnLCAoKSA9PlxuICAgICAgICB0aGlzLmNvbW1hbmRJbnZva2VkKCdBZGQnKVxuICAgICAgKVxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2dvbGFuZzpyZW1vdmUtdGFncycsICgpID0+XG4gICAgICAgIHRoaXMuY29tbWFuZEludm9rZWQoJ1JlbW92ZScpXG4gICAgICApXG4gICAgKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICBhc3luYyBjb21tYW5kSW52b2tlZChtb2RlOiBNb2RlKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IgfHwgIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5oYXNNdWx0aXBsZUN1cnNvcnMoKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ2dvLXBsdXMnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICBpY29uOiAndGFnJyxcbiAgICAgICAgZGV0YWlsOiAnTW9kaWZ5aW5nIHRhZ3Mgb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGN1cnNvcidcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgY21kID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnb21vZGlmeXRhZ3MnKVxuICAgIGlmIChjbWQpIHtcbiAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBUYWdzRGlhbG9nKHtcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfSlcbiAgICAgIGNvbnN0IGM6IHN0cmluZyA9IGNtZFxuICAgICAgZGlhbG9nLm9uQWNjZXB0ID0gb3B0aW9ucyA9PiB0aGlzLm1vZGlmeVRhZ3MoZWRpdG9yLCBvcHRpb25zLCBtb2RlLCBjKVxuICAgICAgZGlhbG9nLmF0dGFjaCgpXG4gICAgfVxuICB9XG5cbiAgYnVpbGRBcmdzKFxuICAgIGVkaXRvcjogVGV4dEVkaXRvcixcbiAgICBvcHRpb25zOiBHb01vZGlmeVRhZ3NPcHRpb25zLFxuICAgIG1vZGU6IE1vZGVcbiAgKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgeyB0YWdzLCB0cmFuc2Zvcm0sIHNvcnRUYWdzIH0gPSBvcHRpb25zXG5cbiAgICAvLyBpZiB0aGVyZSBpcyBhIHNlbGVjdGlvbiwgdXNlIHRoZSAtbGluZSBmbGFnLFxuICAgIC8vIG90aGVyd2lzZSBqdXN0IHVzZSB0aGUgY3Vyc29yIG9mZnNldCAoYW5kIGFwcGx5IG1vZGlmaWNhdGlvbnMgdG8gZW50aXJlIHN0cnVjdClcbiAgICBjb25zdCBhcmdzID0gWyctZmlsZScsIGVkaXRvci5nZXRQYXRoKCkgfHwgJyddXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgIGlmIChzZWxlY3Rpb24gJiYgIXNlbGVjdGlvbi5zdGFydC5pc0VxdWFsKHNlbGVjdGlvbi5lbmQpKSB7XG4gICAgICBhcmdzLnB1c2goJy1saW5lJylcbiAgICAgIGlmIChzZWxlY3Rpb24uaXNTaW5nbGVMaW5lKCkpIHtcbiAgICAgICAgYXJncy5wdXNoKGAke3NlbGVjdGlvbi5zdGFydC5yb3cgKyAxfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzLnB1c2goYCR7c2VsZWN0aW9uLnN0YXJ0LnJvdyArIDF9LCR7c2VsZWN0aW9uLmVuZC5yb3cgKyAxfWApXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MucHVzaCgnLW9mZnNldCcpXG4gICAgICBhcmdzLnB1c2god29yZEFuZE9mZnNldChlZGl0b3IpLm9mZnNldC50b1N0cmluZygpKVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBhcmdzLnB1c2goJy1tb2RpZmllZCcpXG4gICAgfVxuXG4gICAgaWYgKHRyYW5zZm9ybSkge1xuICAgICAgYXJncy5wdXNoKCctdHJhbnNmb3JtJylcbiAgICAgIGFyZ3MucHVzaCh0cmFuc2Zvcm0pXG4gICAgfVxuICAgIGlmIChzb3J0VGFncykge1xuICAgICAgYXJncy5wdXNoKCctc29ydCcpXG4gICAgfVxuXG4gICAgaWYgKG1vZGUgPT09ICdBZGQnKSB7XG4gICAgICBjb25zdCB0YWdOYW1lcyA9IFtdXG4gICAgICBjb25zdCBvcHRzID0gW11cbiAgICAgIGZvciAoY29uc3QgdCBvZiB0YWdzKSB7XG4gICAgICAgIHRhZ05hbWVzLnB1c2godC50YWcpXG4gICAgICAgIGlmICh0Lm9wdGlvbiAmJiB0Lm9wdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICBvcHRzLnB1c2goYCR7dC50YWd9PSR7dC5vcHRpb259YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcmdzLnB1c2goJy1hZGQtb3B0aW9ucycpXG4gICAgICAgIGFyZ3MucHVzaChvcHRzLmpvaW4oJywnKSlcbiAgICAgIH1cbiAgICAgIGlmICh0YWdOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGFnTmFtZXMucHVzaCgnanNvbicpXG4gICAgICB9XG4gICAgICBhcmdzLnB1c2goJy1hZGQtdGFncycsIHRhZ05hbWVzLmpvaW4oJywnKSlcbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdSZW1vdmUnKSB7XG4gICAgICBjb25zdCB0YWdOYW1lcyA9IFtdXG4gICAgICBjb25zdCBvcHRzID0gW11cbiAgICAgIGlmICghdGFncyB8fCAhdGFncy5sZW5ndGgpIHtcbiAgICAgICAgYXJncy5wdXNoKCctY2xlYXItdGFncycpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdGFncykge1xuICAgICAgICAgIGlmICh0Lm9wdGlvbiAmJiB0Lm9wdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIG9wdHMucHVzaChgJHt0LnRhZ309JHt0Lm9wdGlvbn1gKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWdOYW1lcy5wdXNoKHQudGFnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGFyZ3MucHVzaCgnLXJlbW92ZS10YWdzJylcbiAgICAgICAgICBhcmdzLnB1c2godGFnTmFtZXMuam9pbignLCcpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhcmdzLnB1c2goJy1yZW1vdmUtb3B0aW9ucycpXG4gICAgICAgICAgYXJncy5wdXNoKG9wdHMuam9pbignLCcpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcmdzXG4gIH1cblxuICBhc3luYyBtb2RpZnlUYWdzKFxuICAgIGVkaXRvcjogVGV4dEVkaXRvcixcbiAgICBvcHRpb25zOiBHb01vZGlmeVRhZ3NPcHRpb25zLFxuICAgIG1vZGU6IE1vZGUsXG4gICAgY21kOiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgZXhlY3V0b3JPcHRpb25zID0gdGhpcy5nb2NvbmZpZy5leGVjdXRvci5nZXRPcHRpb25zKCdmaWxlJywgZWRpdG9yKVxuXG4gICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIGV4ZWN1dG9yT3B0aW9ucy5pbnB1dCA9IGJ1aWxkR3VydUFyY2hpdmUoZWRpdG9yKVxuICAgIH1cblxuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmJ1aWxkQXJncyhlZGl0b3IsIG9wdGlvbnMsIG1vZGUpXG4gICAgY29uc3QgciA9IGF3YWl0IHRoaXMuZ29jb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIGV4ZWN1dG9yT3B0aW9ucylcbiAgICBpZiAoci5lcnJvcikge1xuICAgICAgaWYgKHIuZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdNaXNzaW5nIFRvb2wnLCB7XG4gICAgICAgICAgZGV0YWlsOiAnTWlzc2luZyB0aGUgYGdvbW9kaWZ5dGFnc2AgdG9vbC4nLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yJywge1xuICAgICAgICAgIGRldGFpbDogci5lcnJvci5tZXNzYWdlLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiByIH1cbiAgICB9IGVsc2UgaWYgKHIuZXhpdGNvZGUgIT09IDApIHtcbiAgICAgIGNvbnN0IHN0ZGVyciA9IHIuc3RkZXJyIGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRlcnIudG9TdHJpbmcoKSA6IHIuc3RkZXJyXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yJywge1xuICAgICAgICBkZXRhaWw6IHN0ZGVyci50cmltKCksXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIHJlc3VsdDogciB9XG4gICAgfVxuICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0VmlhRGlmZihyLnN0ZG91dC50b1N0cmluZygpKVxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHJlc3VsdDogciB9XG4gIH1cbn1cblxuZXhwb3J0IHsgR29Nb2RpZnlUYWdzIH1cbiJdfQ==