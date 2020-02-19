Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _godocPanel = require('./godoc-panel');

var _utils = require('../utils');

var _guruUtils = require('../guru-utils');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

// godoc.org link (we add this ourselves)

var Godoc = (function () {
  function Godoc(goconfig) {
    var _this = this;

    _classCallCheck(this, Godoc);

    this.priority = 2;
    this.grammarScopes = ['source.go', 'go'];
    this.providerName = 'go-plus';

    this.goconfig = goconfig;
    this.subscriptions = new _atom.CompositeDisposable();
    this.panelModel = new _godocPanel.GodocPanel();
    this.subscriptions.add(this.panelModel);
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'golang:showdoc', function () {
      return _this.commandInvoked();
    }));
    this.methodRegexp = /(?:^func \(\w+ \**)(\w+)/;
  }

  _createClass(Godoc, [{
    key: 'commandInvoked',
    value: _asyncToGenerator(function* () {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return { success: false, result: null };
      }
      this.panelModel.updateMessage('Generating documentation...');
      var doc = yield this.doc(editor, editor.getCursorBufferPosition());
      if (!doc) {
        return { success: false, result: null };
      }

      if (doc.decl.startsWith('package')) {
        // older versions of gogetdoc didn't populate the import property
        // for packages - prompt user to update
        if (!doc['import'] || !doc['import'].length) {
          this.promptForToolsUpdate();
        } else {
          doc.gddo = 'https://godoc.org/' + doc['import'];
        }
      } else {
        var typ = this.declIsMethod(doc.decl);
        if (typ) {
          doc.gddo = 'https://godoc.org/' + doc['import'] + '#' + typ + '.' + doc.name;
        } else {
          doc.gddo = 'https://godoc.org/' + doc['import'] + '#' + doc.name;
        }
      }
      this.panelModel.updateContent(doc);
      return { success: true, doc: doc };
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'doc',
    value: _asyncToGenerator(function* (editor, bufferPosition) {
      var cmd = yield this.goconfig.locator.findTool('gogetdoc');
      if (!cmd) return null;

      var file = editor.getBuffer().getPath();
      if (!file) return null;

      var offset = (0, _utils.utf8OffsetForBufferPosition)(bufferPosition, editor);
      var archive = (0, _guruUtils.buildGuruArchive)();
      var args = ['-pos', file + ':#' + offset, '-linelength', '999', '-json'];

      var options = this.goconfig.executor.getOptions('project', editor);
      if (archive && archive.length) {
        options.input = archive;
        args.push('-modified');
      }
      var r = yield this.goconfig.executor.exec(cmd, args, options);
      if (r.exitcode !== 0) return null;

      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      var doc = JSON.parse(stdout.trim());
      return doc;
    })
  }, {
    key: 'datatip',
    value: _asyncToGenerator(function* (editor, bufferPosition) {
      var doc = yield this.doc(editor, bufferPosition);
      if (!doc) return null;

      var markedStrings = [{
        type: 'markdown',
        value: '### ' + doc.name + '\n\nimport "' + doc['import'] + '"\n\n```go\n' + doc.decl + '\n```\n\n' + doc.doc
      }];
      return {
        range: new _atom.Range(bufferPosition, bufferPosition),
        markedStrings: markedStrings,
        pinnable: true
      };
    })
  }, {
    key: 'declIsMethod',
    value: function declIsMethod(decl) {
      // func (receiver Type) Name(Args...) -> return Type
      // func Name(Args...) -> return undefined
      var matches = this.methodRegexp.exec(decl);
      if (matches && matches.length) {
        return matches[matches.length - 1];
      }
      return undefined;
    }
  }, {
    key: 'promptForToolsUpdate',
    value: function promptForToolsUpdate() {
      if (this.electedNotToUpdate) {
        return;
      }
      this.electedNotToUpdate = true;

      var notification = atom.notifications.addWarning('go-plus', {
        dismissable: true,
        detail: '`gogetdoc` may be out of date',
        description: 'Your `gogetdoc` tool may be out of date.' + _os2['default'].EOL + _os2['default'].EOL + 'Would you like to run `go get -u github.com/zmb3/gogetdoc` to update?',
        buttons: [{
          text: 'Yes',
          onDidClick: function onDidClick() {
            notification.dismiss();
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'golang:update-tools', ['github.com/zmb3/gogetdoc']);
          }
        }, {
          text: 'Not Now',
          onDidClick: function onDidClick() {
            notification.dismiss();
          }
        }]
      });
    }
  }, {
    key: 'getPanel',
    value: function getPanel() {
      return this.panelModel;
    }
  }]);

  return Godoc;
})();

exports.Godoc = Godoc;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2RvYy9nb2RvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07OzBCQUN0QixlQUFlOztxQkFDRSxVQUFVOzt5QkFDckIsZUFBZTs7a0JBQ2pDLElBQUk7Ozs7OztJQTBCYixLQUFLO0FBVUUsV0FWUCxLQUFLLENBVUcsUUFBa0IsRUFBRTs7OzBCQVY1QixLQUFLOztTQUdULFFBQVEsR0FBVyxDQUFDO1NBQ3BCLGFBQWEsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUM7U0FDbkMsWUFBWSxHQUFHLFNBQVM7O0FBTXRCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLFVBQVUsR0FBRyw0QkFBZ0IsQ0FBQTtBQUNsQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDdkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFO2FBQ3RELE1BQUssY0FBYyxFQUFFO0tBQUEsQ0FDdEIsQ0FDRixDQUFBO0FBQ0QsUUFBSSxDQUFDLFlBQVksR0FBRywwQkFBMEIsQ0FBQTtHQUMvQzs7ZUFyQkcsS0FBSzs7NkJBdUJXLGFBQUc7QUFDckIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxlQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUE7T0FDeEM7QUFDRCxVQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0FB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QUUsSUFBSTtBQUNqQixjQUFNLEVBQUUsK0JBQStCO0FBQ3ZDLG1CQUFXLEVBQ1QsMENBQTBDLEdBQzFDLGdCQUFHLEdBQUcsR0FDTixnQkFBRyxHQUFHLEdBQ04sdUVBQXVFO0FBQ3pFLGVBQU8sRUFBRSxDQUNQO0FBQ0UsY0FBSSxFQUFFLEtBQUs7QUFDWCxvQkFBVSxFQUFFLHNCQUFNO0FBQ2hCLHdCQUFZLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsZ0JBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQ2xDLHFCQUFxQixFQUNyQixDQUFDLDBCQUEwQixDQUFDLENBQzdCLENBQUE7V0FDRjtTQUNGLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsU0FBUztBQUNmLG9CQUFVLEVBQUUsc0JBQU07QUFDaEIsd0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtXQUN2QjtTQUNGLENBQ0Y7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBRU8sb0JBQUc7QUFDVCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztTQWxLRyxLQUFLOzs7UUFxS0YsS0FBSyxHQUFMLEtBQUsiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZG9jL2dvZG9jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgR29kb2NQYW5lbCB9IGZyb20gJy4vZ29kb2MtcGFuZWwnXG5pbXBvcnQgeyB1dGY4T2Zmc2V0Rm9yQnVmZmVyUG9zaXRpb24gfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGJ1aWxkR3VydUFyY2hpdmUgfSBmcm9tICcuLi9ndXJ1LXV0aWxzJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuXG5pbXBvcnQgdHlwZSB7IEdvQ29uZmlnIH0gZnJvbSAnLi8uLi9jb25maWcvc2VydmljZSdcblxuZXhwb3J0IHR5cGUgR29nZXRkb2NSZXN1bHQgPSB7XG4gIG5hbWU6IHN0cmluZyxcbiAgaW1wb3J0OiBzdHJpbmcsXG4gIHBrZzogc3RyaW5nLFxuICBkZWNsOiBzdHJpbmcsXG4gIGRvYzogc3RyaW5nLFxuICBwb3M6IHN0cmluZyxcblxuICBnZGRvPzogc3RyaW5nIC8vIGdvZG9jLm9yZyBsaW5rICh3ZSBhZGQgdGhpcyBvdXJzZWx2ZXMpXG59XG5cbnR5cGUgTWFya2VkU3RyaW5nID0ge1xuICB0eXBlOiAnbWFya2Rvd24nLFxuICB2YWx1ZTogc3RyaW5nXG59XG5cbnR5cGUgRGF0YXRpcCA9IHtcbiAgbWFya2VkU3RyaW5nczogQXJyYXk8TWFya2VkU3RyaW5nPixcbiAgcmFuZ2U6IGF0b20kUmFuZ2UsXG4gIHBpbm5hYmxlPzogYm9vbGVhblxufVxuXG5jbGFzcyBHb2RvYyB7XG4gIGdvY29uZmlnOiBHb0NvbmZpZ1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHByaW9yaXR5OiBudW1iZXIgPSAyXG4gIGdyYW1tYXJTY29wZXMgPSBbJ3NvdXJjZS5nbycsICdnbyddXG4gIHByb3ZpZGVyTmFtZSA9ICdnby1wbHVzJ1xuICBwYW5lbE1vZGVsOiBHb2RvY1BhbmVsXG4gIG1ldGhvZFJlZ2V4cDogUmVnRXhwXG4gIGVsZWN0ZWROb3RUb1VwZGF0ZTogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yKGdvY29uZmlnOiBHb0NvbmZpZykge1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnBhbmVsTW9kZWwgPSBuZXcgR29kb2NQYW5lbCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnBhbmVsTW9kZWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2dvbGFuZzpzaG93ZG9jJywgKCkgPT5cbiAgICAgICAgdGhpcy5jb21tYW5kSW52b2tlZCgpXG4gICAgICApXG4gICAgKVxuICAgIHRoaXMubWV0aG9kUmVnZXhwID0gLyg/Ol5mdW5jIFxcKFxcdysgXFwqKikoXFx3KykvXG4gIH1cblxuICBhc3luYyBjb21tYW5kSW52b2tlZCgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIHJlc3VsdDogbnVsbCB9XG4gICAgfVxuICAgIHRoaXMucGFuZWxNb2RlbC51cGRhdGVNZXNzYWdlKCdHZW5lcmF0aW5nIGRvY3VtZW50YXRpb24uLi4nKVxuICAgIGNvbnN0IGRvYyA9IGF3YWl0IHRoaXMuZG9jKGVkaXRvciwgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCByZXN1bHQ6IG51bGwgfVxuICAgIH1cblxuICAgIGlmIChkb2MuZGVjbC5zdGFydHNXaXRoKCdwYWNrYWdlJykpIHtcbiAgICAgIC8vIG9sZGVyIHZlcnNpb25zIG9mIGdvZ2V0ZG9jIGRpZG4ndCBwb3B1bGF0ZSB0aGUgaW1wb3J0IHByb3BlcnR5XG4gICAgICAvLyBmb3IgcGFja2FnZXMgLSBwcm9tcHQgdXNlciB0byB1cGRhdGVcbiAgICAgIGlmICghZG9jLmltcG9ydCB8fCAhZG9jLmltcG9ydC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wcm9tcHRGb3JUb29sc1VwZGF0ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2MuZ2RkbyA9ICdodHRwczovL2dvZG9jLm9yZy8nICsgZG9jLmltcG9ydFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0eXAgPSB0aGlzLmRlY2xJc01ldGhvZChkb2MuZGVjbClcbiAgICAgIGlmICh0eXApIHtcbiAgICAgICAgZG9jLmdkZG8gPVxuICAgICAgICAgICdodHRwczovL2dvZG9jLm9yZy8nICsgZG9jLmltcG9ydCArICcjJyArIHR5cCArICcuJyArIGRvYy5uYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2MuZ2RkbyA9ICdodHRwczovL2dvZG9jLm9yZy8nICsgZG9jLmltcG9ydCArICcjJyArIGRvYy5uYW1lXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWxNb2RlbC51cGRhdGVDb250ZW50KGRvYylcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkb2M6IGRvYyB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIGFzeW5jIGRvYyhcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBidWZmZXJQb3NpdGlvbjogYXRvbSRQb2ludFxuICApOiBQcm9taXNlPD9Hb2dldGRvY1Jlc3VsdD4ge1xuICAgIGNvbnN0IGNtZCA9IGF3YWl0IHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29nZXRkb2MnKVxuICAgIGlmICghY21kKSByZXR1cm4gbnVsbFxuXG4gICAgY29uc3QgZmlsZSA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRQYXRoKClcbiAgICBpZiAoIWZpbGUpIHJldHVybiBudWxsXG5cbiAgICBjb25zdCBvZmZzZXQgPSB1dGY4T2Zmc2V0Rm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24sIGVkaXRvcilcbiAgICBjb25zdCBhcmNoaXZlID0gYnVpbGRHdXJ1QXJjaGl2ZSgpXG4gICAgY29uc3QgYXJncyA9IFsnLXBvcycsIGAke2ZpbGV9OiMke29mZnNldH1gLCAnLWxpbmVsZW5ndGgnLCAnOTk5JywgJy1qc29uJ11cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdvY29uZmlnLmV4ZWN1dG9yLmdldE9wdGlvbnMoJ3Byb2plY3QnLCBlZGl0b3IpXG4gICAgaWYgKGFyY2hpdmUgJiYgYXJjaGl2ZS5sZW5ndGgpIHtcbiAgICAgIG9wdGlvbnMuaW5wdXQgPSBhcmNoaXZlXG4gICAgICBhcmdzLnB1c2goJy1tb2RpZmllZCcpXG4gICAgfVxuICAgIGNvbnN0IHIgPSBhd2FpdCB0aGlzLmdvY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCBhcmdzLCBvcHRpb25zKVxuICAgIGlmIChyLmV4aXRjb2RlICE9PSAwKSByZXR1cm4gbnVsbFxuXG4gICAgY29uc3Qgc3Rkb3V0ID0gci5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZG91dC50b1N0cmluZygpIDogci5zdGRvdXRcbiAgICBjb25zdCBkb2M6IEdvZ2V0ZG9jUmVzdWx0ID0gSlNPTi5wYXJzZShzdGRvdXQudHJpbSgpKVxuICAgIHJldHVybiBkb2NcbiAgfVxuXG4gIGFzeW5jIGRhdGF0aXAoXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgYnVmZmVyUG9zaXRpb246IGF0b20kUG9pbnRcbiAgKTogUHJvbWlzZTw/RGF0YXRpcD4ge1xuICAgIGNvbnN0IGRvYyA9IGF3YWl0IHRoaXMuZG9jKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgaWYgKCFkb2MpIHJldHVybiBudWxsXG5cbiAgICBjb25zdCBtYXJrZWRTdHJpbmdzID0gW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnbWFya2Rvd24nLFxuICAgICAgICB2YWx1ZTogYCMjIyAke2RvYy5uYW1lfVxuXG5pbXBvcnQgXCIke2RvYy5pbXBvcnR9XCJcblxuXFxgXFxgXFxgZ29cbiR7ZG9jLmRlY2x9XG5cXGBcXGBcXGBcblxuJHtkb2MuZG9jfWBcbiAgICAgIH1cbiAgICBdXG4gICAgcmV0dXJuIHtcbiAgICAgIHJhbmdlOiBuZXcgUmFuZ2UoYnVmZmVyUG9zaXRpb24sIGJ1ZmZlclBvc2l0aW9uKSxcbiAgICAgIG1hcmtlZFN0cmluZ3MsXG4gICAgICBwaW5uYWJsZTogdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGRlY2xJc01ldGhvZChkZWNsOiBzdHJpbmcpOiA/c3RyaW5nIHtcbiAgICAvLyBmdW5jIChyZWNlaXZlciBUeXBlKSBOYW1lKEFyZ3MuLi4pIC0+IHJldHVybiBUeXBlXG4gICAgLy8gZnVuYyBOYW1lKEFyZ3MuLi4pIC0+IHJldHVybiB1bmRlZmluZWRcbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5tZXRob2RSZWdleHAuZXhlYyhkZWNsKVxuICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdXG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIHByb21wdEZvclRvb2xzVXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmVsZWN0ZWROb3RUb1VwZGF0ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZWxlY3RlZE5vdFRvVXBkYXRlID0gdHJ1ZVxuXG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ2dvLXBsdXMnLCB7XG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIGRldGFpbDogJ2Bnb2dldGRvY2AgbWF5IGJlIG91dCBvZiBkYXRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnWW91ciBgZ29nZXRkb2NgIHRvb2wgbWF5IGJlIG91dCBvZiBkYXRlLicgK1xuICAgICAgICBvcy5FT0wgK1xuICAgICAgICBvcy5FT0wgK1xuICAgICAgICAnV291bGQgeW91IGxpa2UgdG8gcnVuIGBnbyBnZXQgLXUgZ2l0aHViLmNvbS96bWIzL2dvZ2V0ZG9jYCB0byB1cGRhdGU/JyxcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdZZXMnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goXG4gICAgICAgICAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksXG4gICAgICAgICAgICAgICdnb2xhbmc6dXBkYXRlLXRvb2xzJyxcbiAgICAgICAgICAgICAgWydnaXRodWIuY29tL3ptYjMvZ29nZXRkb2MnXVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdOb3QgTm93JyxcbiAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSlcbiAgfVxuXG4gIGdldFBhbmVsKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVsTW9kZWxcbiAgfVxufVxuXG5leHBvcnQgeyBHb2RvYyB9XG4iXX0=