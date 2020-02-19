Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _guruUtils = require('../guru-utils');

var _utils = require('../utils');

var _navigationStack = require('./navigation-stack');

var Navigator = (function () {
  function Navigator(goconfig) {
    var _this = this;

    _classCallCheck(this, Navigator);

    this.goconfig = goconfig;
    this.godefCommand = 'golang:godef';
    this.returnCommand = 'golang:godef-return';
    this.navigationStack = new _navigationStack.NavigationStack();
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:godef', function () {
      if (!_this.disposed) {
        _this.gotoDefinitionForWordAtCursor();
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:godef-return', function () {
      if (_this.navigationStack && !_this.disposed) {
        _this.navigationStack.restorePreviousLocation();
      }
    }));
    this.disposed = false;
  }

  _createClass(Navigator, [{
    key: 'dispose',
    value: function dispose() {
      this.disposed = true;
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
    }
  }, {
    key: 'gotoDefinitionForWordAtCursor',
    value: _asyncToGenerator(function* () {
      var editor = (0, _utils.getEditor)();
      if (!editor) {
        return false;
      }

      if (editor.hasMultipleCursors()) {
        atom.notifications.addWarning('go-plus', {
          dismissable: true,
          icon: 'location',
          detail: 'go to definition only works with a single cursor'
        });
        return false;
      }

      return this.gotoDefinitionForBufferPosition(editor.getCursorBufferPosition(), editor);
    })
  }, {
    key: 'definitionForBufferPosition',
    value: _asyncToGenerator(function* (pos, editor) {
      var tool = atom.config.get('go-plus.navigator.mode');
      var r = tool === 'guru' ? (yield this.executeGuru(pos, editor)) : (yield this.executeGodef(pos, editor));
      if (!r || r.exitcode !== 0) {
        return null;
      }
      var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
      return tool === 'guru' ? this.parseGuruLocation(stdout) : this.parseGodefLocation(stdout);
    })
  }, {
    key: 'gotoDefinitionForBufferPosition',
    value: _asyncToGenerator(function* (pos, editor) {
      if (!editor || !pos) {
        return false;
      }

      var def = yield this.definitionForBufferPosition(pos, editor);
      if (!def || !def.pos) return false;

      return this.visitLocation(def);
    })
  }, {
    key: 'executeGuru',
    value: _asyncToGenerator(function* (pos, editor) {
      if (!editor || !pos) {
        return false;
      }
      var cmd = yield this.goconfig.locator.findTool('guru');
      if (!cmd) {
        return false;
      }
      var filepath = editor.getPath();
      if (!filepath) {
        return false;
      }
      var archive = (0, _guruUtils.buildGuruArchive)();

      var options = this.goconfig.executor.getOptions('file', editor);
      if (archive && archive !== '') {
        options.input = archive;
      }

      pos = (0, _guruUtils.adjustPositionForGuru)(pos, editor);
      var offset = (0, _utils.utf8OffsetForBufferPosition)(pos, editor);
      var args = ['-json', 'definition', filepath + ':#' + offset];
      if (archive && archive !== '') {
        args.unshift('-modified');
      }
      return this.goconfig.executor.exec(cmd, args, options);
    })
  }, {
    key: 'executeGodef',
    value: _asyncToGenerator(function* (pos, editor) {
      var cmd = yield this.goconfig.locator.findTool('godef');
      if (!cmd) {
        return false;
      }
      var filepath = editor.getPath();
      if (!filepath) {
        return false;
      }
      var offset = (0, _utils.utf8OffsetForBufferPosition)(pos, editor);
      var args = ['-f', filepath, '-o', offset.toString(), '-i'];
      var options = this.goconfig.executor.getOptions('file', editor);
      options.input = editor.getText();
      return this.goconfig.executor.exec(cmd, args, options);
    })
  }, {
    key: 'parseGuruLocation',
    value: function parseGuruLocation(stdout) {
      var output = undefined;
      try {
        output = JSON.parse(stdout);
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
      }

      if (!output || !output.objpos) {
        return null;
      }

      var parsed = (0, _utils.parseGoPosition)(output.objpos.trim());
      if (!parsed) {
        return null;
      }
      var result = {};
      result.filepath = parsed.file;
      result.raw = stdout;

      if (parsed.line !== false && parsed.column !== false) {
        result.pos = new _atom.Point(parseInt(parsed.line) - 1, parseInt(parsed.column) - 1);
      }
      return result;
    }
  }, {
    key: 'parseGodefLocation',
    value: function parseGodefLocation(godefStdout) {
      var pos = (0, _utils.parseGoPosition)(godefStdout);

      var result = {};
      result.filepath = pos.file;
      result.raw = godefStdout;

      if (pos.hasOwnProperty('line') && pos.hasOwnProperty('column')) {
        // atom's cursors are 0-based; godef uses diff-like 1-based
        var correct = function correct(str) {
          return parseInt(str, 10) - 1;
        };
        result.pos = new _atom.Point(correct(pos.line), correct(pos.column));
      }
      return result;
    }
  }, {
    key: 'visitLocation',
    value: _asyncToGenerator(function* (loc) {
      if (!loc || !loc.filepath) {
        var opts = {};
        opts.dismissable = true;
        opts.icon = 'location';
        opts.detail = 'definition tool returned malformed output';

        if (loc) {
          opts.description = JSON.stringify(loc.raw);
        }
        atom.notifications.addWarning('go-plus', opts);
        return false;
      }
      try {
        var l = loc;
        var stats = yield (0, _utils.stat)(loc.filepath);
        this.navigationStack.pushCurrentLocation();
        if (stats.isDirectory()) {
          return this.visitDirectory(l);
        } else {
          return this.visitFile(l);
        }
      } catch (e) {
        atom.notifications.addWarning('go-plus', {
          dismissable: true,
          icon: 'location',
          detail: 'definition tool returned invalid file path',
          description: loc.filepath
        });
        return false;
      }
    })
  }, {
    key: 'visitFile',
    value: _asyncToGenerator(function* (loc) {
      return (0, _utils.openFile)(loc.filepath, loc.pos);
    })
  }, {
    key: 'visitDirectory',
    value: _asyncToGenerator(function* (loc) {
      try {
        var file = yield this.findFirstGoFile(loc.filepath);
        loc.filepath = file;
        return this.visitFile(loc);
      } catch (err) {
        if (err.handle) {
          err.handle();
        }
        atom.notifications.addWarning('go-plus', {
          dismissable: true,
          icon: 'location',
          detail: 'godef return invalid directory',
          description: loc.filepath
        });
      }
    })
  }, {
    key: 'findFirstGoFile',
    value: function findFirstGoFile(dir) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _fs2['default'].readdir(dir, function (err, files) {
          if (err) {
            reject(err);
          }

          var filepath = _this2.firstGoFilePath(dir, files.sort());
          if (filepath) {
            resolve(filepath);
          } else {
            reject(new Error(dir + 'has no non-test .go file'));
          }
        });
      });
    }
  }, {
    key: 'firstGoFilePath',
    value: function firstGoFilePath(dir, files) {
      for (var file of files) {
        if (file.endsWith('.go') && file.indexOf('_test') === -1) {
          return _path2['default'].join(dir, file);
        }
      }
      return null;
    }
  }]);

  return Navigator;
})();

exports.Navigator = Navigator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL25hdmlnYXRvci9uYXZpZ2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDb0IsTUFBTTs7eUJBQ08sZUFBZTs7cUJBT2hFLFVBQVU7OytCQUNlLG9CQUFvQjs7SUFNOUMsU0FBUztBQVFGLFdBUlAsU0FBUyxDQVFELFFBQWtCLEVBQUU7OzswQkFSNUIsU0FBUzs7QUFTWCxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixRQUFJLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQTtBQUNsQyxRQUFJLENBQUMsYUFBYSxHQUFHLHFCQUFxQixDQUFBO0FBQzFDLFFBQUksQ0FBQyxlQUFlLEdBQUcsc0NBQXFCLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLFlBQU07QUFDeEQsVUFBSSxDQUFDLE1BQUssUUFBUSxFQUFFO0FBQ2xCLGNBQUssNkJBQTZCLEVBQUUsQ0FBQTtPQUNyQztLQUNGLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFLFlBQU07QUFDL0QsVUFBSSxNQUFLLGVBQWUsSUFBSSxDQUFDLE1BQUssUUFBUSxFQUFFO0FBQzFDLGNBQUssZUFBZSxDQUFDLHVCQUF1QixFQUFFLENBQUE7T0FDL0M7S0FDRixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0dBQ3RCOztlQTdCRyxTQUFTOztXQStCTixtQkFBRztBQUNS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by1wbHVzL2xpYi9uYXZpZ2F0b3IvbmF2aWdhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIFBvaW50IH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGFkanVzdFBvc2l0aW9uRm9yR3VydSwgYnVpbGRHdXJ1QXJjaGl2ZSB9IGZyb20gJy4uL2d1cnUtdXRpbHMnXG5pbXBvcnQge1xuICBnZXRFZGl0b3IsXG4gIG9wZW5GaWxlLFxuICBwYXJzZUdvUG9zaXRpb24sXG4gIHN0YXQsXG4gIHV0ZjhPZmZzZXRGb3JCdWZmZXJQb3NpdGlvblxufSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IE5hdmlnYXRpb25TdGFjayB9IGZyb20gJy4vbmF2aWdhdGlvbi1zdGFjaydcblxuaW1wb3J0IHR5cGUgeyBHb0NvbmZpZyB9IGZyb20gJy4vLi4vY29uZmlnL3NlcnZpY2UnXG5pbXBvcnQgdHlwZSB7IEV4ZWNSZXN1bHQgfSBmcm9tICcuLy4uL2NvbmZpZy9leGVjdXRvcidcbmltcG9ydCB0eXBlIHsgRGVmTG9jYXRpb24gfSBmcm9tICcuL2RlZmluaXRpb24tdHlwZXMnXG5cbmNsYXNzIE5hdmlnYXRvciB7XG4gIGdvY29uZmlnOiBHb0NvbmZpZ1xuICBnb2RlZkNvbW1hbmQ6IHN0cmluZ1xuICByZXR1cm5Db21tYW5kOiBzdHJpbmdcbiAgbmF2aWdhdGlvblN0YWNrOiBOYXZpZ2F0aW9uU3RhY2tcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBkaXNwb3NlZDogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yKGdvY29uZmlnOiBHb0NvbmZpZykge1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ1xuICAgIHRoaXMuZ29kZWZDb21tYW5kID0gJ2dvbGFuZzpnb2RlZidcbiAgICB0aGlzLnJldHVybkNvbW1hbmQgPSAnZ29sYW5nOmdvZGVmLXJldHVybidcbiAgICB0aGlzLm5hdmlnYXRpb25TdGFjayA9IG5ldyBOYXZpZ2F0aW9uU3RhY2soKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2dvbGFuZzpnb2RlZicsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc3Bvc2VkKSB7XG4gICAgICAgICAgdGhpcy5nb3RvRGVmaW5pdGlvbkZvcldvcmRBdEN1cnNvcigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnZ29sYW5nOmdvZGVmLXJldHVybicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubmF2aWdhdGlvblN0YWNrICYmICF0aGlzLmRpc3Bvc2VkKSB7XG4gICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uU3RhY2sucmVzdG9yZVByZXZpb3VzTG9jYXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgICB0aGlzLmRpc3Bvc2VkID0gZmFsc2VcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5kaXNwb3NlZCA9IHRydWVcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ290b0RlZmluaXRpb25Gb3JXb3JkQXRDdXJzb3IoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBlZGl0b3IgPSBnZXRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmhhc011bHRpcGxlQ3Vyc29ycygpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnZ28tcGx1cycsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGljb246ICdsb2NhdGlvbicsXG4gICAgICAgIGRldGFpbDogJ2dvIHRvIGRlZmluaXRpb24gb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGN1cnNvcidcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nb3RvRGVmaW5pdGlvbkZvckJ1ZmZlclBvc2l0aW9uKFxuICAgICAgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCksXG4gICAgICBlZGl0b3JcbiAgICApXG4gIH1cblxuICBhc3luYyBkZWZpbml0aW9uRm9yQnVmZmVyUG9zaXRpb24oXG4gICAgcG9zOiBhdG9tJFBvaW50LFxuICAgIGVkaXRvcjogVGV4dEVkaXRvclxuICApOiBQcm9taXNlPD9EZWZMb2NhdGlvbj4ge1xuICAgIGNvbnN0IHRvb2wgPSBhdG9tLmNvbmZpZy5nZXQoJ2dvLXBsdXMubmF2aWdhdG9yLm1vZGUnKVxuICAgIGNvbnN0IHIgPVxuICAgICAgdG9vbCA9PT0gJ2d1cnUnXG4gICAgICAgID8gYXdhaXQgdGhpcy5leGVjdXRlR3VydShwb3MsIGVkaXRvcilcbiAgICAgICAgOiBhd2FpdCB0aGlzLmV4ZWN1dGVHb2RlZihwb3MsIGVkaXRvcilcbiAgICBpZiAoIXIgfHwgci5leGl0Y29kZSAhPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgY29uc3Qgc3Rkb3V0ID0gci5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZG91dC50b1N0cmluZygpIDogci5zdGRvdXRcbiAgICByZXR1cm4gdG9vbCA9PT0gJ2d1cnUnXG4gICAgICA/IHRoaXMucGFyc2VHdXJ1TG9jYXRpb24oc3Rkb3V0KVxuICAgICAgOiB0aGlzLnBhcnNlR29kZWZMb2NhdGlvbihzdGRvdXQpXG4gIH1cblxuICBhc3luYyBnb3RvRGVmaW5pdGlvbkZvckJ1ZmZlclBvc2l0aW9uKFxuICAgIHBvczogYXRvbSRQb2ludCxcbiAgICBlZGl0b3I6IFRleHRFZGl0b3JcbiAgKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAoIWVkaXRvciB8fCAhcG9zKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBkZWYgPSBhd2FpdCB0aGlzLmRlZmluaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihwb3MsIGVkaXRvcilcbiAgICBpZiAoIWRlZiB8fCAhZGVmLnBvcykgcmV0dXJuIGZhbHNlXG5cbiAgICByZXR1cm4gdGhpcy52aXNpdExvY2F0aW9uKGRlZilcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVHdXJ1KFxuICAgIHBvczogYXRvbSRQb2ludCxcbiAgICBlZGl0b3I6IFRleHRFZGl0b3JcbiAgKTogUHJvbWlzZTxFeGVjUmVzdWx0IHwgZmFsc2U+IHtcbiAgICBpZiAoIWVkaXRvciB8fCAhcG9zKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgY21kID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdndXJ1JylcbiAgICBpZiAoIWNtZCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGZpbGVwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmICghZmlsZXBhdGgpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBhcmNoaXZlID0gYnVpbGRHdXJ1QXJjaGl2ZSgpXG5cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nb2NvbmZpZy5leGVjdXRvci5nZXRPcHRpb25zKCdmaWxlJywgZWRpdG9yKVxuICAgIGlmIChhcmNoaXZlICYmIGFyY2hpdmUgIT09ICcnKSB7XG4gICAgICBvcHRpb25zLmlucHV0ID0gYXJjaGl2ZVxuICAgIH1cblxuICAgIHBvcyA9IGFkanVzdFBvc2l0aW9uRm9yR3VydShwb3MsIGVkaXRvcilcbiAgICBjb25zdCBvZmZzZXQgPSB1dGY4T2Zmc2V0Rm9yQnVmZmVyUG9zaXRpb24ocG9zLCBlZGl0b3IpXG4gICAgY29uc3QgYXJncyA9IFsnLWpzb24nLCAnZGVmaW5pdGlvbicsIGZpbGVwYXRoICsgJzojJyArIG9mZnNldF1cbiAgICBpZiAoYXJjaGl2ZSAmJiBhcmNoaXZlICE9PSAnJykge1xuICAgICAgYXJncy51bnNoaWZ0KCctbW9kaWZpZWQnKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywgb3B0aW9ucylcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVHb2RlZihcbiAgICBwb3M6IGF0b20kUG9pbnRMaWtlLFxuICAgIGVkaXRvcjogVGV4dEVkaXRvclxuICApOiBQcm9taXNlPEV4ZWNSZXN1bHQgfCBmYWxzZT4ge1xuICAgIGNvbnN0IGNtZCA9IGF3YWl0IHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29kZWYnKVxuICAgIGlmICghY21kKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgZmlsZXBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgKCFmaWxlcGF0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHV0ZjhPZmZzZXRGb3JCdWZmZXJQb3NpdGlvbihwb3MsIGVkaXRvcilcbiAgICBjb25zdCBhcmdzID0gWyctZicsIGZpbGVwYXRoLCAnLW8nLCBvZmZzZXQudG9TdHJpbmcoKSwgJy1pJ11cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nb2NvbmZpZy5leGVjdXRvci5nZXRPcHRpb25zKCdmaWxlJywgZWRpdG9yKVxuICAgIG9wdGlvbnMuaW5wdXQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgcmV0dXJuIHRoaXMuZ29jb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIG9wdGlvbnMpXG4gIH1cblxuICBwYXJzZUd1cnVMb2NhdGlvbihzdGRvdXQ6IHN0cmluZyk6IERlZkxvY2F0aW9uIHwgbnVsbCB7XG4gICAgbGV0IG91dHB1dFxuICAgIHRyeSB7XG4gICAgICBvdXRwdXQgPSBKU09OLnBhcnNlKHN0ZG91dClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG5cbiAgICBpZiAoIW91dHB1dCB8fCAhb3V0cHV0Lm9ianBvcykge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUdvUG9zaXRpb24ob3V0cHV0Lm9ianBvcy50cmltKCkpXG4gICAgaWYgKCFwYXJzZWQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHt9XG4gICAgcmVzdWx0LmZpbGVwYXRoID0gcGFyc2VkLmZpbGVcbiAgICByZXN1bHQucmF3ID0gc3Rkb3V0XG5cbiAgICBpZiAocGFyc2VkLmxpbmUgIT09IGZhbHNlICYmIHBhcnNlZC5jb2x1bW4gIT09IGZhbHNlKSB7XG4gICAgICByZXN1bHQucG9zID0gbmV3IFBvaW50KFxuICAgICAgICBwYXJzZUludChwYXJzZWQubGluZSkgLSAxLFxuICAgICAgICBwYXJzZUludChwYXJzZWQuY29sdW1uKSAtIDFcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgcGFyc2VHb2RlZkxvY2F0aW9uKGdvZGVmU3Rkb3V0OiBzdHJpbmcpOiBEZWZMb2NhdGlvbiB8IG51bGwge1xuICAgIGNvbnN0IHBvcyA9IHBhcnNlR29Qb3NpdGlvbihnb2RlZlN0ZG91dClcblxuICAgIGNvbnN0IHJlc3VsdCA9IHt9XG4gICAgcmVzdWx0LmZpbGVwYXRoID0gcG9zLmZpbGVcbiAgICByZXN1bHQucmF3ID0gZ29kZWZTdGRvdXRcblxuICAgIGlmIChwb3MuaGFzT3duUHJvcGVydHkoJ2xpbmUnKSAmJiBwb3MuaGFzT3duUHJvcGVydHkoJ2NvbHVtbicpKSB7XG4gICAgICAvLyBhdG9tJ3MgY3Vyc29ycyBhcmUgMC1iYXNlZDsgZ29kZWYgdXNlcyBkaWZmLWxpa2UgMS1iYXNlZFxuICAgICAgY29uc3QgY29ycmVjdCA9IHN0ciA9PiBwYXJzZUludChzdHIsIDEwKSAtIDFcbiAgICAgIHJlc3VsdC5wb3MgPSBuZXcgUG9pbnQoY29ycmVjdChwb3MubGluZSksIGNvcnJlY3QocG9zLmNvbHVtbikpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGFzeW5jIHZpc2l0TG9jYXRpb24obG9jOiBEZWZMb2NhdGlvbiB8IG51bGwpIHtcbiAgICBpZiAoIWxvYyB8fCAhbG9jLmZpbGVwYXRoKSB7XG4gICAgICBjb25zdCBvcHRzID0ge31cbiAgICAgIG9wdHMuZGlzbWlzc2FibGUgPSB0cnVlXG4gICAgICBvcHRzLmljb24gPSAnbG9jYXRpb24nXG4gICAgICBvcHRzLmRldGFpbCA9ICdkZWZpbml0aW9uIHRvb2wgcmV0dXJuZWQgbWFsZm9ybWVkIG91dHB1dCdcblxuICAgICAgaWYgKGxvYykge1xuICAgICAgICBvcHRzLmRlc2NyaXB0aW9uID0gSlNPTi5zdHJpbmdpZnkobG9jLnJhdylcbiAgICAgIH1cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdnby1wbHVzJywgb3B0cylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgbDogRGVmTG9jYXRpb24gPSBsb2NcbiAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdChsb2MuZmlsZXBhdGgpXG4gICAgICB0aGlzLm5hdmlnYXRpb25TdGFjay5wdXNoQ3VycmVudExvY2F0aW9uKClcbiAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RGlyZWN0b3J5KGwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZpbGUobClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnZ28tcGx1cycsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGljb246ICdsb2NhdGlvbicsXG4gICAgICAgIGRldGFpbDogJ2RlZmluaXRpb24gdG9vbCByZXR1cm5lZCBpbnZhbGlkIGZpbGUgcGF0aCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBsb2MuZmlsZXBhdGhcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBhc3luYyB2aXNpdEZpbGUobG9jOiBEZWZMb2NhdGlvbik6IFByb21pc2U8VGV4dEVkaXRvcj4ge1xuICAgIHJldHVybiBvcGVuRmlsZShsb2MuZmlsZXBhdGgsIGxvYy5wb3MpXG4gIH1cblxuICBhc3luYyB2aXNpdERpcmVjdG9yeShsb2M6IERlZkxvY2F0aW9uKTogUHJvbWlzZTw/VGV4dEVkaXRvcj4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBmaWxlID0gYXdhaXQgdGhpcy5maW5kRmlyc3RHb0ZpbGUobG9jLmZpbGVwYXRoKVxuICAgICAgbG9jLmZpbGVwYXRoID0gZmlsZVxuICAgICAgcmV0dXJuIHRoaXMudmlzaXRGaWxlKGxvYylcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIuaGFuZGxlKSB7XG4gICAgICAgIGVyci5oYW5kbGUoKVxuICAgICAgfVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ2dvLXBsdXMnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICBpY29uOiAnbG9jYXRpb24nLFxuICAgICAgICBkZXRhaWw6ICdnb2RlZiByZXR1cm4gaW52YWxpZCBkaXJlY3RvcnknLFxuICAgICAgICBkZXNjcmlwdGlvbjogbG9jLmZpbGVwYXRoXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZpbmRGaXJzdEdvRmlsZShkaXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGZzLnJlYWRkaXIoZGlyLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVwYXRoID0gdGhpcy5maXJzdEdvRmlsZVBhdGgoZGlyLCBmaWxlcy5zb3J0KCkpXG4gICAgICAgIGlmIChmaWxlcGF0aCkge1xuICAgICAgICAgIHJlc29sdmUoZmlsZXBhdGgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihkaXIgKyAnaGFzIG5vIG5vbi10ZXN0IC5nbyBmaWxlJykpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGZpcnN0R29GaWxlUGF0aChkaXI6IHN0cmluZywgZmlsZXM6IEFycmF5PHN0cmluZz4pOiBzdHJpbmcgfCBudWxsIHtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIGlmIChmaWxlLmVuZHNXaXRoKCcuZ28nKSAmJiBmaWxlLmluZGV4T2YoJ190ZXN0JykgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oZGlyLCBmaWxlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmV4cG9ydCB7IE5hdmlnYXRvciB9XG4iXX0=