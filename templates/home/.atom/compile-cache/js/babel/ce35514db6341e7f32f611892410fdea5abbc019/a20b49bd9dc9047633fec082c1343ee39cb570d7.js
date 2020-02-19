Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _atom = require('atom');

var oldPackages = ['gofmt', 'tester-go', 'builder-go', 'autocomplete-go', 'godoc', 'gorename', 'go-hyperclick', 'navigator-go', 'go-get', 'go-config', 'gometalinter-linter'];

var bundledPackages = new Map([['go-debug', 'It allows you to interactively debug your go program and tests using delve.'], ['go-signature-statusbar', 'It shows function signature information in the status bar.'], ['atom-ide-ui', 'It provides IDE features and displays diagnostic messages.']]);

var goTools = new Map([['goimports', 'golang.org/x/tools/cmd/goimports'], ['gorename', 'golang.org/x/tools/cmd/gorename'], ['goreturns', 'github.com/sqs/goreturns'], ['gocode', 'github.com/mdempsky/gocode'], ['gometalinter', 'github.com/alecthomas/gometalinter'], ['revive', 'github.com/mgechev/revive'], ['golangci-lint', 'github.com/golangci/golangci-lint/cmd/golangci-lint'], ['gogetdoc', 'github.com/zmb3/gogetdoc'], ['goaddimport', 'github.com/zmb3/goaddimport'], ['godef', 'github.com/rogpeppe/godef'], ['guru', 'golang.org/x/tools/cmd/guru'], ['gomodifytags', 'github.com/fatih/gomodifytags'], ['gopkgs', 'github.com/tpng/gopkgs'], ['go-outline', 'github.com/ramya-rao-a/go-outline']]);

var PackageManager = (function () {
  function PackageManager(goconfig, goget) {
    var _this = this;

    _classCallCheck(this, PackageManager);

    this.loaded = false;
    this.goconfig = goconfig;
    this.goget = goget;
    this.subscriptions = new _atom.CompositeDisposable();
    if (atom.config.get('go-plus.disableToolCheck')) {
      this.loaded = true;
      return;
    }
    this.registerTools();

    var _require = require('./tool-checker');

    var ToolChecker = _require.ToolChecker;

    if (!this.toolChecker) {
      this.toolChecker = new ToolChecker(this.goconfig);
    }
    this.toolChecker.checkForTools(Array.from(goTools.keys()));
    this.disableOldPackages();
    this.willUninstall = true;
    this.willInstall = true;
    this.loaded = true;
    setTimeout(function () {
      if (!_this.willUninstall) {
        return;
      }
      _this.uninstallOldPackages();
    }, 10000);
    setTimeout(function () {
      if (!_this.willInstall) {
        return;
      }
      _this.installBundledPackages();
    }, 5000);
  }

  _createClass(PackageManager, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.loaded = false;
      this.willUninstall = false;
      this.willInstall = true;
    }
  }, {
    key: 'disableOldPackages',
    value: function disableOldPackages() {
      for (var pkg of oldPackages) {
        var p = atom.packages.getLoadedPackage(pkg);
        if (!p) {
          continue;
        }
        atom.packages.disablePackage(pkg);
      }
    }
  }, {
    key: 'installBundledPackages',
    value: _asyncToGenerator(function* () {
      var packages = new Map();
      for (var _ref3 of bundledPackages) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var pkg = _ref2[0];
        var detail = _ref2[1];

        var p = atom.packages.getLoadedPackage(pkg);
        if (p) {
          continue;
        }

        var disabled = false;
        var disabledPackages = atom.config.get('go-plus.disabledBundledPackages');
        if (Array.isArray(disabledPackages)) {
          for (var d of disabledPackages) {
            if (typeof d === 'string' && d.trim() === pkg) {
              disabled = true;
              break;
            }
          }
        }

        if (disabled) {
          continue;
        }

        packages.set(pkg, detail);
      }

      if (!packages.size) {
        return;
      }

      var pack = yield atom.packages.activatePackage('settings-view');
      if (!pack) {
        return;
      }
      var mainModule = pack.mainModule;
      var settingsview = mainModule.createSettingsView({
        uri: pack.mainModule.configUri
      });
      var installPkg = function installPkg(pkg) {
        if (atom.packages.isPackageDisabled(pkg)) {
          atom.packages.enablePackage(pkg);
          return;
        }
        console.log('installing package ' + pkg); // eslint-disable-line no-console
        settingsview.packageManager.install({ name: pkg }, function (error) {
          if (!error) {
            console.log('the ' + pkg + ' package has been installed'); // eslint-disable-line no-console
            atom.notifications.addInfo('Installed the ' + pkg + ' package');
          } else {
            var content = '';
            if (error.stdout) {
              content = error.stdout;
            }
            if (error.stderr) {
              content = content + _os2['default'].EOL + error.stderr;
            }
            content = content.trim();
            atom.notifications.addError(content);
          }
        });
      };

      var _loop = function (_ref4) {
        _ref42 = _slicedToArray(_ref4, 2);
        var pkg = _ref42[0];
        var detail = _ref42[1];

        var notification = atom.notifications.addInfo('go-plus', {
          dismissable: true,
          icon: 'cloud-download',
          detail: 'Additional features are available via the ' + pkg + ' package. ' + detail,
          description: 'Would you like to install/activate ' + pkg + ' ?',
          buttons: [{
            text: 'Yes',
            onDidClick: function onDidClick() {
              notification.dismiss();
              installPkg(pkg);
            }
          }, {
            text: 'Not Now',
            onDidClick: function onDidClick() {
              notification.dismiss();
            }
          }, {
            text: 'Never',
            onDidClick: function onDidClick() {
              notification.dismiss();
              var disabledBundledPackages = atom.config.get('go-plus.disabledBundledPackages');
              if (Array.isArray(disabledBundledPackages) && !disabledBundledPackages.includes('pkg')) {
                disabledBundledPackages.push(pkg);
                atom.config.set('go-plus.disabledBundledPackages', disabledBundledPackages);
              }
            }
          }]
        });
      };

      for (var _ref4 of packages) {
        var _ref42;

        _loop(_ref4);
      }
    })
  }, {
    key: 'uninstallOldPackages',
    value: _asyncToGenerator(function* () {
      var _loop2 = function* (pkg) {
        var p = atom.packages.getLoadedPackage(pkg);
        if (!p) {
          return 'continue';
        }
        var pack = yield atom.packages.activatePackage('settings-view');
        if (pack && pack.mainModule) {
          var settingsview = pack.mainModule.createSettingsView({
            uri: pack.mainModule.configUri
          });
          settingsview.packageManager.uninstall({ name: pkg }, function (error) {
            if (!error) {
              atom.notifications.addInfo('Removed the ' + pkg + ' package, which is now provided by go-plus');
            } else {
              console.log(error); // eslint-disable-line no-console
            }
          });
        }
      };

      // remove old packages that have been merged into go-plus
      for (var pkg of oldPackages) {
        var _ret2 = yield* _loop2(pkg);

        if (_ret2 === 'continue') continue;
      }
    })
  }, {
    key: 'registerTools',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      if (!this.goget || !this.subscriptions) {
        return;
      }

      var _loop3 = function (_ref5) {
        _ref52 = _slicedToArray(_ref5, 2);
        var key = _ref52[0];
        var value = _ref52[1];

        var packagePath = value;
        if (key === 'gometalinter') {
          _this2.subscriptions.add(_this2.goget.register(packagePath, _asyncToGenerator(function* (outcome, packs) {
            if (!packs.includes(packagePath)) {
              return;
            }
            var cmd = yield _this2.goconfig.locator.findTool('gometalinter');
            if (!cmd) {
              return;
            }
            var notification = atom.notifications.addInfo('gometalinter', {
              dismissable: true,
              icon: 'cloud-download',
              description: 'Running `gometalinter --install` to install tools.'
            });
            var opt = _this2.goconfig.executor.getOptions('project');
            var r = yield _this2.goconfig.executor.exec(cmd, ['--install'], opt);
            notification.dismiss();
            var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
            var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
            var detail = stdout + _os2['default'].EOL + stderr;

            if (r.exitcode !== 0) {
              atom.notifications.addWarning('gometalinter', {
                dismissable: true,
                icon: 'cloud-download',
                detail: detail.trim()
              });
              return r;
            }
            if (stderr && stderr.trim() !== '') {
              console.log('go-plus: (stderr) ' + stderr); // eslint-disable-line no-console
            }
            atom.notifications.addSuccess('gometalinter', {
              dismissable: true,
              icon: 'cloud-download',
              detail: detail.trim(),
              description: 'The tools were installed.'
            });
            return r;
          })));
        } else if (key === 'gocode') {
          _this2.subscriptions.add(_this2.goget.register(packagePath, _asyncToGenerator(function* (outcome, packs) {
            if (!packs.includes(packagePath)) {
              return;
            }
            var cmd = yield _this2.goconfig.locator.findTool('gocode');
            if (!cmd) {
              return;
            }
            var notification = atom.notifications.addInfo('gocode', {
              dismissable: true,
              icon: 'cloud-download',
              description: 'Running `gocode close` to ensure a new gocode binary is used.'
            });
            var opt = _this2.goconfig.executor.getOptions('project');
            var r = yield _this2.goconfig.executor.exec(cmd, ['close'], opt);
            notification.dismiss();
            var stdout = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
            var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
            var detail = stdout + _os2['default'].EOL + stderr;

            if (r.exitcode !== 0) {
              atom.notifications.addWarning('gocode', {
                dismissable: true,
                icon: 'sync',
                detail: detail.trim()
              });
              return r;
            }
            if (stderr && stderr.trim() !== '') {
              console.log('go-plus: (stderr) ' + stderr); // eslint-disable-line no-console
            }
            atom.notifications.addSuccess('gocode', {
              dismissable: true,
              icon: 'sync',
              detail: detail.trim(),
              description: 'The `gocode` daemon has been closed to ensure you are using the latest `gocode` binary.'
            });
            return r;
          })));
        } else {
          _this2.subscriptions.add(_this2.goget.register(packagePath));
        }
      };

      for (var _ref5 of goTools) {
        var _ref52;

        _loop3(_ref5);
      }
    })
  }]);

  return PackageManager;
})();

exports.PackageManager = PackageManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3BhY2thZ2UtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUNpQixNQUFNOztBQU0xQyxJQUFNLFdBQVcsR0FBRyxDQUNsQixPQUFPLEVBQ1AsV0FBVyxFQUNYLFlBQVksRUFDWixpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFVBQVUsRUFDVixlQUFlLEVBQ2YsY0FBYyxFQUNkLFFBQVEsRUFDUixXQUFXLEVBQ1gscUJBQXFCLENBQ3RCLENBQUE7O0FBRUQsSUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FDOUIsQ0FDRSxVQUFVLEVBQ1YsNkVBQTZFLENBQzlFLEVBQ0QsQ0FDRSx3QkFBd0IsRUFDeEIsNERBQTRELENBQzdELEVBQ0QsQ0FBQyxhQUFhLEVBQUUsNERBQTRELENBQUMsQ0FDOUUsQ0FBQyxDQUFBOztBQUVGLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLENBQ3RCLENBQUMsV0FBVyxFQUFFLGtDQUFrQyxDQUFDLEVBQ2pELENBQUMsVUFBVSxFQUFFLGlDQUFpQyxDQUFDLEVBQy9DLENBQUMsV0FBVyxFQUFFLDBCQUEwQixDQUFDLEVBQ3pDLENBQUMsUUFBUSxFQUFFLDRCQUE0QixDQUFDLEVBQ3hDLENBQUMsY0FBYyxFQUFFLG9DQUFvQyxDQUFDLEVBQ3RELENBQUMsUUFBUSxFQUFFLDJCQUEyQixDQUFDLEVBQ3ZDLENBQUMsZUFBZSxFQUFFLHFEQUFxRCxDQUFDLEVBQ3hFLENBQUMsVUFBVSxFQUFFLDBCQUEwQixDQUFDLEVBQ3hDLENBQUMsYUFBYSxFQUFFLDZCQUE2QixDQUFDLEVBQzlDLENBQUMsT0FBTyxFQUFFLDJCQUEyQixDQUFDLEVBQ3RDLENBQUMsTUFBTSxFQUFFLDZCQUE2QixDQUFDLEVBQ3ZDLENBQUMsY0FBYyxFQUFFLCtCQUErQixDQUFDLEVBQ2pELENBQUMsUUFBUSxF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Q0FBQyxNQUFNLENBQUE7QUFDN0QsZ0JBQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxnQkFBRyxHQUFHLEdBQUcsTUFBTSxDQUFBOztBQUV2QyxnQkFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsRUFBRTtBQUNwQixrQkFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO0FBQ3RDLDJCQUFXLEVBQUUsSUFBSTtBQUNqQixvQkFBSSxFQUFFLE1BQU07QUFDWixzQkFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7ZUFDdEIsQ0FBQyxDQUFBO0FBQ0YscUJBQU8sQ0FBQyxDQUFBO2FBQ1Q7QUFDRCxnQkFBSSxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNsQyxxQkFBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsQ0FBQTthQUMzQztBQUNELGdCQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7QUFDdEMseUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGtCQUFJLEVBQUUsTUFBTTtBQUNaLG9CQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNyQix5QkFBVyxFQUNULHlGQUF5RjthQUM1RixDQUFDLENBQUE7QUFDRixtQkFBTyxDQUFDLENBQUE7V0FDVCxFQUFDLENBQ0gsQ0FBQTtTQUNGLE1BQU07QUFDTCxpQkFBSyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO1NBQ3pEOzs7QUE5Rkgsd0JBQTJCLE9BQU8sRUFBRTs7OztPQStGbkM7S0FDRjs7O1NBdFNHLGNBQWM7OztRQXlTWCxjQUFjLEdBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9wYWNrYWdlLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IHR5cGUgeyBHb0NvbmZpZyB9IGZyb20gJy4vY29uZmlnL3NlcnZpY2UnXG5pbXBvcnQgdHlwZSB7IEdvR2V0IH0gZnJvbSAnLi9nZXQvc2VydmljZSdcbmltcG9ydCB0eXBlIHsgVG9vbENoZWNrZXIgfSBmcm9tICcuL3Rvb2wtY2hlY2tlcidcblxuY29uc3Qgb2xkUGFja2FnZXMgPSBbXG4gICdnb2ZtdCcsXG4gICd0ZXN0ZXItZ28nLFxuICAnYnVpbGRlci1nbycsXG4gICdhdXRvY29tcGxldGUtZ28nLFxuICAnZ29kb2MnLFxuICAnZ29yZW5hbWUnLFxuICAnZ28taHlwZXJjbGljaycsXG4gICduYXZpZ2F0b3ItZ28nLFxuICAnZ28tZ2V0JyxcbiAgJ2dvLWNvbmZpZycsXG4gICdnb21ldGFsaW50ZXItbGludGVyJ1xuXVxuXG5jb25zdCBidW5kbGVkUGFja2FnZXMgPSBuZXcgTWFwKFtcbiAgW1xuICAgICdnby1kZWJ1ZycsXG4gICAgJ0l0IGFsbG93cyB5b3UgdG8gaW50ZXJhY3RpdmVseSBkZWJ1ZyB5b3VyIGdvIHByb2dyYW0gYW5kIHRlc3RzIHVzaW5nIGRlbHZlLidcbiAgXSxcbiAgW1xuICAgICdnby1zaWduYXR1cmUtc3RhdHVzYmFyJyxcbiAgICAnSXQgc2hvd3MgZnVuY3Rpb24gc2lnbmF0dXJlIGluZm9ybWF0aW9uIGluIHRoZSBzdGF0dXMgYmFyLidcbiAgXSxcbiAgWydhdG9tLWlkZS11aScsICdJdCBwcm92aWRlcyBJREUgZmVhdHVyZXMgYW5kIGRpc3BsYXlzIGRpYWdub3N0aWMgbWVzc2FnZXMuJ11cbl0pXG5cbmNvbnN0IGdvVG9vbHMgPSBuZXcgTWFwKFtcbiAgWydnb2ltcG9ydHMnLCAnZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHMnXSxcbiAgWydnb3JlbmFtZScsICdnb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvcmVuYW1lJ10sXG4gIFsnZ29yZXR1cm5zJywgJ2dpdGh1Yi5jb20vc3FzL2dvcmV0dXJucyddLFxuICBbJ2dvY29kZScsICdnaXRodWIuY29tL21kZW1wc2t5L2dvY29kZSddLFxuICBbJ2dvbWV0YWxpbnRlcicsICdnaXRodWIuY29tL2FsZWN0aG9tYXMvZ29tZXRhbGludGVyJ10sXG4gIFsncmV2aXZlJywgJ2dpdGh1Yi5jb20vbWdlY2hldi9yZXZpdmUnXSxcbiAgWydnb2xhbmdjaS1saW50JywgJ2dpdGh1Yi5jb20vZ29sYW5nY2kvZ29sYW5nY2ktbGludC9jbWQvZ29sYW5nY2ktbGludCddLFxuICBbJ2dvZ2V0ZG9jJywgJ2dpdGh1Yi5jb20vem1iMy9nb2dldGRvYyddLFxuICBbJ2dvYWRkaW1wb3J0JywgJ2dpdGh1Yi5jb20vem1iMy9nb2FkZGltcG9ydCddLFxuICBbJ2dvZGVmJywgJ2dpdGh1Yi5jb20vcm9ncGVwcGUvZ29kZWYnXSxcbiAgWydndXJ1JywgJ2dvbGFuZy5vcmcveC90b29scy9jbWQvZ3VydSddLFxuICBbJ2dvbW9kaWZ5dGFncycsICdnaXRodWIuY29tL2ZhdGloL2dvbW9kaWZ5dGFncyddLFxuICBbJ2dvcGtncycsICdnaXRodWIuY29tL3RwbmcvZ29wa2dzJ10sXG4gIFsnZ28tb3V0bGluZScsICdnaXRodWIuY29tL3JhbXlhLXJhby1hL2dvLW91dGxpbmUnXVxuXSlcblxuY2xhc3MgUGFja2FnZU1hbmFnZXIge1xuICBnb2NvbmZpZzogR29Db25maWdcbiAgZ29nZXQ6IEdvR2V0XG4gIHdpbGxJbnN0YWxsOiBib29sZWFuXG4gIHdpbGxVbmluc3RhbGw6IGJvb2xlYW5cbiAgbG9hZGVkOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgdG9vbENoZWNrZXI6IFRvb2xDaGVja2VyXG5cbiAgY29uc3RydWN0b3IoZ29jb25maWc6IEdvQ29uZmlnLCBnb2dldDogR29HZXQpIHtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlXG4gICAgdGhpcy5nb2NvbmZpZyA9IGdvY29uZmlnXG4gICAgdGhpcy5nb2dldCA9IGdvZ2V0XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dvLXBsdXMuZGlzYWJsZVRvb2xDaGVjaycpKSB7XG4gICAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdGVyVG9vbHMoKVxuICAgIGNvbnN0IHsgVG9vbENoZWNrZXIgfSA9IHJlcXVpcmUoJy4vdG9vbC1jaGVja2VyJylcbiAgICBpZiAoIXRoaXMudG9vbENoZWNrZXIpIHtcbiAgICAgIHRoaXMudG9vbENoZWNrZXIgPSBuZXcgVG9vbENoZWNrZXIodGhpcy5nb2NvbmZpZylcbiAgICB9XG4gICAgdGhpcy50b29sQ2hlY2tlci5jaGVja0ZvclRvb2xzKEFycmF5LmZyb20oZ29Ub29scy5rZXlzKCkpKVxuICAgIHRoaXMuZGlzYWJsZU9sZFBhY2thZ2VzKClcbiAgICB0aGlzLndpbGxVbmluc3RhbGwgPSB0cnVlXG4gICAgdGhpcy53aWxsSW5zdGFsbCA9IHRydWVcbiAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy53aWxsVW5pbnN0YWxsKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy51bmluc3RhbGxPbGRQYWNrYWdlcygpXG4gICAgfSwgMTAwMDApXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMud2lsbEluc3RhbGwpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmluc3RhbGxCdW5kbGVkUGFja2FnZXMoKVxuICAgIH0sIDUwMDApXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZVxuICAgIHRoaXMud2lsbFVuaW5zdGFsbCA9IGZhbHNlXG4gICAgdGhpcy53aWxsSW5zdGFsbCA9IHRydWVcbiAgfVxuXG4gIGRpc2FibGVPbGRQYWNrYWdlcygpIHtcbiAgICBmb3IgKGNvbnN0IHBrZyBvZiBvbGRQYWNrYWdlcykge1xuICAgICAgY29uc3QgcCA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwa2cpXG4gICAgICBpZiAoIXApIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGF0b20ucGFja2FnZXMuZGlzYWJsZVBhY2thZ2UocGtnKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluc3RhbGxCdW5kbGVkUGFja2FnZXMoKSB7XG4gICAgbGV0IHBhY2thZ2VzID0gbmV3IE1hcCgpXG4gICAgZm9yIChjb25zdCBbcGtnLCBkZXRhaWxdIG9mIGJ1bmRsZWRQYWNrYWdlcykge1xuICAgICAgY29uc3QgcCA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwa2cpXG4gICAgICBpZiAocCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBsZXQgZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgY29uc3QgZGlzYWJsZWRQYWNrYWdlcyA9IGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ2dvLXBsdXMuZGlzYWJsZWRCdW5kbGVkUGFja2FnZXMnXG4gICAgICApXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkaXNhYmxlZFBhY2thZ2VzKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGQgb2YgZGlzYWJsZWRQYWNrYWdlcykge1xuICAgICAgICAgIGlmICh0eXBlb2YgZCA9PT0gJ3N0cmluZycgJiYgZC50cmltKCkgPT09IHBrZykge1xuICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgcGFja2FnZXMuc2V0KHBrZywgZGV0YWlsKVxuICAgIH1cblxuICAgIGlmICghcGFja2FnZXMuc2l6ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgcGFjayA9IGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdzZXR0aW5ncy12aWV3JylcbiAgICBpZiAoIXBhY2spIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBtYWluTW9kdWxlID0gcGFjay5tYWluTW9kdWxlXG4gICAgY29uc3Qgc2V0dGluZ3N2aWV3ID0gbWFpbk1vZHVsZS5jcmVhdGVTZXR0aW5nc1ZpZXcoe1xuICAgICAgdXJpOiBwYWNrLm1haW5Nb2R1bGUuY29uZmlnVXJpXG4gICAgfSlcbiAgICBjb25zdCBpbnN0YWxsUGtnID0gcGtnID0+IHtcbiAgICAgIGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKHBrZykpIHtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKHBrZylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhgaW5zdGFsbGluZyBwYWNrYWdlICR7cGtnfWApIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgc2V0dGluZ3N2aWV3LnBhY2thZ2VNYW5hZ2VyLmluc3RhbGwoeyBuYW1lOiBwa2cgfSwgZXJyb3IgPT4ge1xuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHRoZSAke3BrZ30gcGFja2FnZSBoYXMgYmVlbiBpbnN0YWxsZWRgKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhgSW5zdGFsbGVkIHRoZSAke3BrZ30gcGFja2FnZWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IGNvbnRlbnQgPSAnJ1xuICAgICAgICAgIGlmIChlcnJvci5zdGRvdXQpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlcnJvci5zdGRvdXRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGVycm9yLnN0ZGVycikge1xuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBvcy5FT0wgKyBlcnJvci5zdGRlcnJcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGVudCA9IGNvbnRlbnQudHJpbSgpXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGZvciAoY29uc3QgW3BrZywgZGV0YWlsXSBvZiBwYWNrYWdlcykge1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ2dvLXBsdXMnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICBpY29uOiAnY2xvdWQtZG93bmxvYWQnLFxuICAgICAgICBkZXRhaWw6XG4gICAgICAgICAgYEFkZGl0aW9uYWwgZmVhdHVyZXMgYXJlIGF2YWlsYWJsZSB2aWEgdGhlICR7cGtnfSBwYWNrYWdlLiBgICsgZGV0YWlsLFxuICAgICAgICBkZXNjcmlwdGlvbjogYFdvdWxkIHlvdSBsaWtlIHRvIGluc3RhbGwvYWN0aXZhdGUgJHtwa2d9ID9gLFxuICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1llcycsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgICAgaW5zdGFsbFBrZyhwa2cpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnTm90IE5vdycsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdOZXZlcicsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgICAgY29uc3QgZGlzYWJsZWRCdW5kbGVkUGFja2FnZXMgPSBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAgICAgICAgICAgJ2dvLXBsdXMuZGlzYWJsZWRCdW5kbGVkUGFja2FnZXMnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoZGlzYWJsZWRCdW5kbGVkUGFja2FnZXMpICYmXG4gICAgICAgICAgICAgICAgIWRpc2FibGVkQnVuZGxlZFBhY2thZ2VzLmluY2x1ZGVzKCdwa2cnKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZEJ1bmRsZWRQYWNrYWdlcy5wdXNoKHBrZylcbiAgICAgICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXG4gICAgICAgICAgICAgICAgICAnZ28tcGx1cy5kaXNhYmxlZEJ1bmRsZWRQYWNrYWdlcycsXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZEJ1bmRsZWRQYWNrYWdlc1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBhc3luYyB1bmluc3RhbGxPbGRQYWNrYWdlcygpIHtcbiAgICAvLyByZW1vdmUgb2xkIHBhY2thZ2VzIHRoYXQgaGF2ZSBiZWVuIG1lcmdlZCBpbnRvIGdvLXBsdXNcbiAgICBmb3IgKGNvbnN0IHBrZyBvZiBvbGRQYWNrYWdlcykge1xuICAgICAgY29uc3QgcCA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwa2cpXG4gICAgICBpZiAoIXApIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhY2sgPSBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnc2V0dGluZ3MtdmlldycpXG4gICAgICBpZiAocGFjayAmJiBwYWNrLm1haW5Nb2R1bGUpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3N2aWV3ID0gcGFjay5tYWluTW9kdWxlLmNyZWF0ZVNldHRpbmdzVmlldyh7XG4gICAgICAgICAgdXJpOiBwYWNrLm1haW5Nb2R1bGUuY29uZmlnVXJpXG4gICAgICAgIH0pXG4gICAgICAgIHNldHRpbmdzdmlldy5wYWNrYWdlTWFuYWdlci51bmluc3RhbGwoeyBuYW1lOiBwa2cgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFxuICAgICAgICAgICAgICBgUmVtb3ZlZCB0aGUgJHtwa2d9IHBhY2thZ2UsIHdoaWNoIGlzIG5vdyBwcm92aWRlZCBieSBnby1wbHVzYFxuICAgICAgICAgICAgKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcikgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyVG9vbHMoKSB7XG4gICAgaWYgKCF0aGlzLmdvZ2V0IHx8ICF0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBnb1Rvb2xzKSB7XG4gICAgICBjb25zdCBwYWNrYWdlUGF0aCA9IHZhbHVlXG4gICAgICBpZiAoa2V5ID09PSAnZ29tZXRhbGludGVyJykge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIHRoaXMuZ29nZXQucmVnaXN0ZXIocGFja2FnZVBhdGgsIGFzeW5jIChvdXRjb21lLCBwYWNrcykgPT4ge1xuICAgICAgICAgICAgaWYgKCFwYWNrcy5pbmNsdWRlcyhwYWNrYWdlUGF0aCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbWQgPSBhd2FpdCB0aGlzLmdvY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvbWV0YWxpbnRlcicpXG4gICAgICAgICAgICBpZiAoIWNtZCkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdnb21ldGFsaW50ZXInLCB7XG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpY29uOiAnY2xvdWQtZG93bmxvYWQnLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1J1bm5pbmcgYGdvbWV0YWxpbnRlciAtLWluc3RhbGxgIHRvIGluc3RhbGwgdG9vbHMuJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9IHRoaXMuZ29jb25maWcuZXhlY3V0b3IuZ2V0T3B0aW9ucygncHJvamVjdCcpXG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgWyctLWluc3RhbGwnXSwgb3B0KVxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICAgICAgY29uc3Qgc3Rkb3V0ID1cbiAgICAgICAgICAgICAgci5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZG91dC50b1N0cmluZygpIDogci5zdGRvdXRcbiAgICAgICAgICAgIGNvbnN0IHN0ZGVyciA9XG4gICAgICAgICAgICAgIHIuc3RkZXJyIGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRlcnIudG9TdHJpbmcoKSA6IHIuc3RkZXJyXG4gICAgICAgICAgICBjb25zdCBkZXRhaWwgPSBzdGRvdXQgKyBvcy5FT0wgKyBzdGRlcnJcblxuICAgICAgICAgICAgaWYgKHIuZXhpdGNvZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ2dvbWV0YWxpbnRlcicsIHtcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpY29uOiAnY2xvdWQtZG93bmxvYWQnLFxuICAgICAgICAgICAgICAgIGRldGFpbDogZGV0YWlsLnRyaW0oKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm4gclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ZGVyciAmJiBzdGRlcnIudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ28tcGx1czogKHN0ZGVycikgJyArIHN0ZGVycikgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnZ29tZXRhbGludGVyJywge1xuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWNvbjogJ2Nsb3VkLWRvd25sb2FkJyxcbiAgICAgICAgICAgICAgZGV0YWlsOiBkZXRhaWwudHJpbSgpLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSB0b29scyB3ZXJlIGluc3RhbGxlZC4nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2dvY29kZScpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICB0aGlzLmdvZ2V0LnJlZ2lzdGVyKHBhY2thZ2VQYXRoLCBhc3luYyAob3V0Y29tZSwgcGFja3MpID0+IHtcbiAgICAgICAgICAgIGlmICghcGFja3MuaW5jbHVkZXMocGFja2FnZVBhdGgpKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY21kID0gYXdhaXQgdGhpcy5nb2NvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnb2NvZGUnKVxuICAgICAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnZ29jb2RlJywge1xuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWNvbjogJ2Nsb3VkLWRvd25sb2FkJyxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgJ1J1bm5pbmcgYGdvY29kZSBjbG9zZWAgdG8gZW5zdXJlIGEgbmV3IGdvY29kZSBiaW5hcnkgaXMgdXNlZC4nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gdGhpcy5nb2NvbmZpZy5leGVjdXRvci5nZXRPcHRpb25zKCdwcm9qZWN0JylcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCB0aGlzLmdvY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCBbJ2Nsb3NlJ10sIG9wdClcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgIGNvbnN0IHN0ZG91dCA9XG4gICAgICAgICAgICAgIHIuc3Rkb3V0IGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRvdXQudG9TdHJpbmcoKSA6IHIuc3Rkb3V0XG4gICAgICAgICAgICBjb25zdCBzdGRlcnIgPVxuICAgICAgICAgICAgICByLnN0ZGVyciBpbnN0YW5jZW9mIEJ1ZmZlciA/IHIuc3RkZXJyLnRvU3RyaW5nKCkgOiByLnN0ZGVyclxuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gc3Rkb3V0ICsgb3MuRU9MICsgc3RkZXJyXG5cbiAgICAgICAgICAgIGlmIChyLmV4aXRjb2RlICE9PSAwKSB7XG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdnb2NvZGUnLCB7XG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaWNvbjogJ3N5bmMnLFxuICAgICAgICAgICAgICAgIGRldGFpbDogZGV0YWlsLnRyaW0oKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm4gclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ZGVyciAmJiBzdGRlcnIudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ28tcGx1czogKHN0ZGVycikgJyArIHN0ZGVycikgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnZ29jb2RlJywge1xuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWNvbjogJ3N5bmMnLFxuICAgICAgICAgICAgICBkZXRhaWw6IGRldGFpbC50cmltKCksXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICdUaGUgYGdvY29kZWAgZGFlbW9uIGhhcyBiZWVuIGNsb3NlZCB0byBlbnN1cmUgeW91IGFyZSB1c2luZyB0aGUgbGF0ZXN0IGBnb2NvZGVgIGJpbmFyeS4nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZ29nZXQucmVnaXN0ZXIocGFja2FnZVBhdGgpKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBQYWNrYWdlTWFuYWdlciB9XG4iXX0=