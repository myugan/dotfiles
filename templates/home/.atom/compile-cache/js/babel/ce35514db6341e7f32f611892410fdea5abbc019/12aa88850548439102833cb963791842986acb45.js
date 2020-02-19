Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var Information = (function () {
  function Information(goconfig) {
    _classCallCheck(this, Information);

    this.goconfig = goconfig;
    this.key = 'go';
    this.tab = {
      key: 'go',
      name: 'Go',
      packageName: 'go-plus',
      icon: 'info',
      order: 100
    };
  }

  _createClass(Information, [{
    key: 'dispose',
    value: function dispose() {}
  }, {
    key: 'updateContent',
    value: _asyncToGenerator(function* () {
      if (!this.view || atom.config.get('go-plus.testing')) {
        return;
      }

      var go = yield this.goconfig.locator.findTool('go');
      if (!go) {
        return;
      }
      var opt = this.goconfig.executor.getOptions('project');
      try {
        var results = yield Promise.all([this.goconfig.executor.exec(go, ['version'], opt), this.goconfig.executor.exec(go, ['env'], opt)]);
        var verStdout = results[0].stdout instanceof Buffer ? results[0].stdout.toString() : results[0].stdout;
        var verStderr = results[0].stderr instanceof Buffer ? results[0].stderr.toString() : results[0].stderr;
        var envStdout = results[1].stdout instanceof Buffer ? results[1].stdout.toString() : results[1].stdout;
        var envStderr = results[1].stderr instanceof Buffer ? results[1].stderr.toString() : results[1].stderr;

        var content = '$ go version' + _os2['default'].EOL;
        if (verStderr && verStderr.trim()) {
          content += verStderr.trim();
        }
        if (verStdout && verStdout.trim()) {
          content += verStdout.trim();
        }
        content += _os2['default'].EOL + _os2['default'].EOL + '$ go env' + _os2['default'].EOL;
        if (envStderr && envStderr.trim()) {
          content += envStderr.trim();
        }
        if (envStdout && envStdout.trim()) {
          content += envStdout.trim();
        }
        this.view.update({ content: content });
      } catch (e) {
        if (e.handle) {
          e.handle();
        }
        console.log(e); // eslint-disable-line no-console
        this.running = false;
        return Promise.resolve();
      }
    })
  }]);

  return Information;
})();

exports.Information = Information;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2luZm8vaW5mb3JtYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7SUFNYixXQUFXO0FBT0osV0FQUCxXQUFXLENBT0gsUUFBa0IsRUFBRTswQkFQNUIsV0FBVzs7QUFRYixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQTtBQUNmLFFBQUksQ0FBQyxHQUFHLEdBQUc7QUFDVCxTQUFHLEVBQUUsSUFBSTtBQUNULFVBQUksRUFBRSxJQUFJO0FBQ1YsaUJBQVcsRUFBRSxTQUFTO0FBQ3RCLFVBQUksRUFBRSxNQUFNO0FBQ1osV0FBSyxFQUFFLEdBQUc7S0FDWCxDQUFBO0dBQ0Y7O2VBakJHLFdBQVc7O1dBbUJSLG1CQUFHLEVBQUU7Ozs2QkFFTyxhQUFHO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDcEQsZUFBTTtPQUNQOztBQUVELFVBQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JELFVBQUksQ0FBQyxFQUFFLEVBQUU7QUFDUCxlQUFNO09BQ1A7QUFDRCxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDeEQsVUFBSTtBQUNGLFlBQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FDOUMsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxTQUFTLEdBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLEdBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQzVCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDdkIsWUFBTSxTQUFTLEdBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLEdBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQzVCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDdkIsWUFBTSxTQUFTLEdBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLEdBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQzVCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDdkIsWUFBTSxTQUFTLEdBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLEdBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQzVCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7O0FBRXZCLFlBQUksT0FBTyxHQUFHLGNBQWMsR0FBRyxnQkFBRyxHQUFHLENBQUE7QUFDckMsWUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ2pDLGlCQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQzVCO0FBQ0QsWUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ2pDLGlCQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQzVCO0FBQ0QsZUFBTyxJQUFJLGdCQUFHLEdBQUcsR0FBRyxnQkFBRyxHQUFHLEdBQUcsVUFBVSxHQUFHLGdCQUFHLEdBQUcsQ0FBQTtBQUNoRCxZQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUU7QUFDakMsaUJBQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDNUI7QUFDRCxZQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUU7QUFDakMsaUJBQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDNUI7QUFDRCxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFBO09BQzlCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixZQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDWixXQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDWDtBQUNELGVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDZCxZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixlQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN6QjtLQUNGOzs7U0E1RUcsV0FBVzs7O1FBK0VSLFdBQVcsR0FBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2luZm8vaW5mb3JtYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5cbmltcG9ydCB0eXBlIHsgR29Db25maWcgfSBmcm9tICcuLy4uL2NvbmZpZy9zZXJ2aWNlJ1xuaW1wb3J0IHR5cGUgeyBQYW5lbE1vZGVsLCBUYWIgfSBmcm9tICcuLy4uL3BhbmVsL3RhYidcbmltcG9ydCB0eXBlIHsgSW5mb3JtYXRpb25WaWV3IH0gZnJvbSAnLi9pbmZvcm1hdGlvbi12aWV3J1xuXG5jbGFzcyBJbmZvcm1hdGlvbiBpbXBsZW1lbnRzIFBhbmVsTW9kZWwge1xuICBnb2NvbmZpZzogR29Db25maWdcbiAga2V5OiBzdHJpbmdcbiAgdGFiOiBUYWJcbiAgcnVubmluZzogYm9vbGVhblxuICB2aWV3OiBJbmZvcm1hdGlvblZpZXdcblxuICBjb25zdHJ1Y3Rvcihnb2NvbmZpZzogR29Db25maWcpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdcbiAgICB0aGlzLmtleSA9ICdnbydcbiAgICB0aGlzLnRhYiA9IHtcbiAgICAgIGtleTogJ2dvJyxcbiAgICAgIG5hbWU6ICdHbycsXG4gICAgICBwYWNrYWdlTmFtZTogJ2dvLXBsdXMnLFxuICAgICAgaWNvbjogJ2luZm8nLFxuICAgICAgb3JkZXI6IDEwMFxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7fVxuXG4gIGFzeW5jIHVwZGF0ZUNvbnRlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcgfHwgYXRvbS5jb25maWcuZ2V0KCdnby1wbHVzLnRlc3RpbmcnKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZ28gPSBhd2FpdCB0aGlzLmdvY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvJylcbiAgICBpZiAoIWdvKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgb3B0ID0gdGhpcy5nb2NvbmZpZy5leGVjdXRvci5nZXRPcHRpb25zKCdwcm9qZWN0JylcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGdvLCBbJ3ZlcnNpb24nXSwgb3B0KSxcbiAgICAgICAgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGdvLCBbJ2VudiddLCBvcHQpXG4gICAgICBdKVxuICAgICAgY29uc3QgdmVyU3Rkb3V0ID1cbiAgICAgICAgcmVzdWx0c1swXS5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICA/IHJlc3VsdHNbMF0uc3Rkb3V0LnRvU3RyaW5nKClcbiAgICAgICAgICA6IHJlc3VsdHNbMF0uc3Rkb3V0XG4gICAgICBjb25zdCB2ZXJTdGRlcnIgPVxuICAgICAgICByZXN1bHRzWzBdLnN0ZGVyciBpbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgID8gcmVzdWx0c1swXS5zdGRlcnIudG9TdHJpbmcoKVxuICAgICAgICAgIDogcmVzdWx0c1swXS5zdGRlcnJcbiAgICAgIGNvbnN0IGVudlN0ZG91dCA9XG4gICAgICAgIHJlc3VsdHNbMV0uc3Rkb3V0IGluc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgPyByZXN1bHRzWzFdLnN0ZG91dC50b1N0cmluZygpXG4gICAgICAgICAgOiByZXN1bHRzWzFdLnN0ZG91dFxuICAgICAgY29uc3QgZW52U3RkZXJyID1cbiAgICAgICAgcmVzdWx0c1sxXS5zdGRlcnIgaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICA/IHJlc3VsdHNbMV0uc3RkZXJyLnRvU3RyaW5nKClcbiAgICAgICAgICA6IHJlc3VsdHNbMV0uc3RkZXJyXG5cbiAgICAgIGxldCBjb250ZW50ID0gJyQgZ28gdmVyc2lvbicgKyBvcy5FT0xcbiAgICAgIGlmICh2ZXJTdGRlcnIgJiYgdmVyU3RkZXJyLnRyaW0oKSkge1xuICAgICAgICBjb250ZW50ICs9IHZlclN0ZGVyci50cmltKClcbiAgICAgIH1cbiAgICAgIGlmICh2ZXJTdGRvdXQgJiYgdmVyU3Rkb3V0LnRyaW0oKSkge1xuICAgICAgICBjb250ZW50ICs9IHZlclN0ZG91dC50cmltKClcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gb3MuRU9MICsgb3MuRU9MICsgJyQgZ28gZW52JyArIG9zLkVPTFxuICAgICAgaWYgKGVudlN0ZGVyciAmJiBlbnZTdGRlcnIudHJpbSgpKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gZW52U3RkZXJyLnRyaW0oKVxuICAgICAgfVxuICAgICAgaWYgKGVudlN0ZG91dCAmJiBlbnZTdGRvdXQudHJpbSgpKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gZW52U3Rkb3V0LnRyaW0oKVxuICAgICAgfVxuICAgICAgdGhpcy52aWV3LnVwZGF0ZSh7IGNvbnRlbnQgfSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5oYW5kbGUpIHtcbiAgICAgICAgZS5oYW5kbGUoKVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coZSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IEluZm9ybWF0aW9uIH1cbiJdfQ==