var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var minimumVersion = '1.12.7';

var Main = (function () {
  function Main() {
    _classCallCheck(this, Main);

    this.bootstrap = null;
    this.bootstrapped = null;
    this.builder = null;
    this.busySignal = null;
    this.configservice = null;
    this.console = null;
    this.formatter = null;
    this.getservice = null;
    this.navigator = null;
    this.godoc = null;
    this.gomodifytags = null;
    this.gorename = null;
    this.information = null;
    this['implements'] = null;
    this.importer = null;
    this.linter = null;
    this.golinter = null;
    this.buildLinter = null;
    this.loaded = null;
    this.orchestrator = null;
    this.outputManager = null;
    this.panelManager = null;
    this.tester = null;
    this.references = null;
    this.highlight = null;
    this.outlineProvider = null;
    this.autocompleteProvider = null;
    this.definitionProvider = null;
    this.packagemanager = null;
  }

  _createClass(Main, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();

      this.validateAtomVersion();
      this.bootstrapped = false;
      this.loaded = false;

      var _require = require('./orchestrator');

      var Orchestrator = _require.Orchestrator;

      this.orchestrator = new Orchestrator();
      this.subscriptions.add(this.orchestrator);

      var _require2 = require('./bootstrap');

      var Bootstrap = _require2.Bootstrap;

      this.bootstrap = new Bootstrap(function () {
        _this.bootstrapped = true;
        _this.load();
        _this.loaded = true;
        _this.checkFormatOnSave();
      });
      this.subscriptions.add(this.bootstrap);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.dispose();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.bootstrapped = false;
      this.loaded = false;
      if (this.subscriptions) {
        this.subscriptions.dispose();
        this.subscriptions = null;
      }
      if (this.console) {
        this.console.dispose();
        this.console = null;
      }
      this.bootstrap = null;
      this.builder = null;
      this.configservice = null;
      this.formatter = null;
      this.getservice = null;
      this.navigator = null;
      this.godoc = null;
      this.gomodifytags = null;
      this.gorename = null;
      this.information = null;
      this['implements'] = null;
      this.importer = null;
      this.golinter = null;
      this.orchestrator = null;
      this.outputManager = null;
      this.panelManager = null;
      this.tester = null;
      this.references = null;
      this.highlight = null;

      this.autocompleteProvider = null;
      this.definitionProvider = null;
    }
  }, {
    key: 'load',
    value: function load() {
      var _this2 = this;

      this.getPanelManager();
      this.loadOutput();
      this.loadInformation();
      this.loadBuilder();
      this.loadTester();
      this.loadLinter();
      this.loadDoc();
      this.loadImplements();
      this.loadGorename();
      this.loadGoModifyTags();
      this.loadImporter();
      this.loadNavigator();
      if (!atom.config.get('go-plus.testing')) {
        this.loadPackageManager();
      }
      this.getPanelManager().requestUpdate();

      var subscriptions = this.subscriptions;
      var orchestrator = this.orchestrator;

      if (!subscriptions || !orchestrator) {
        return;
      }

      subscriptions.add(orchestrator.register('builder', function (editor, path) {
        if (_this2.builder) _this2.builder.build(editor, path);
      }));
      subscriptions.add(orchestrator.register('tester', function (editor, path) {
        void path;
        if (_this2.tester) _this2.tester.handleSaveEvent(editor);
      }));
      subscriptions.add(orchestrator.register('linter', function (editor, path) {
        void path;
        if (_this2.golinter) _this2.golinter.lint(editor);
      }));

      this.loaded = true;
    }
  }, {
    key: 'loadInformation',
    value: function loadInformation() {
      if (this.information) {
        return this.information;
      }

      var _require3 = require('./info/information-view');

      var InformationView = _require3.InformationView;

      var _require4 = require('./info/information');

      var Information = _require4.Information;

      var information = new Information(this.provideGoConfig());
      this.information = information;
      var view = this.consumeViewProvider({
        view: InformationView,
        model: information
      });
      if (this.subscriptions) {
        this.subscriptions.add(information, view);
      }

      return this.information;
    }
  }, {
    key: 'loadImporter',
    value: function loadImporter() {
      if (this.importer) {
        return this.importer;
      }

      var _require5 = require('./import/importer');

      var Importer = _require5.Importer;

      this.importer = new Importer(this.provideGoConfig());
      return this.importer;
    }
  }, {
    key: 'loadDoc',
    value: function loadDoc() {
      if (this.godoc) {
        return this.godoc;
      }

      var _require6 = require('./doc/godoc');

      var Godoc = _require6.Godoc;

      var godoc = new Godoc(this.provideGoConfig());
      this.godoc = godoc;

      var _require7 = require('./doc/godoc-view');

      var GodocView = _require7.GodocView;

      var view = this.consumeViewProvider({
        view: GodocView,
        model: godoc.getPanel()
      });

      if (this.subscriptions) {
        this.subscriptions.add(godoc, view);
      }
      return godoc;
    }
  }, {
    key: 'loadImplements',
    value: function loadImplements() {
      if (this['implements']) {
        return this['implements'];
      }

      var _require8 = require('./implements/implements');

      var Implements = _require8.Implements;

      var impls = new Implements(this.provideGoConfig());
      this['implements'] = impls;

      var _require9 = require('./implements/implements-view');

      var ImplementsView = _require9.ImplementsView;

      var view = this.consumeViewProvider({
        view: ImplementsView,
        model: impls
      });
      if (this.subscriptions) {
        this.subscriptions.add(impls, view);
      }
      return impls;
    }
  }, {
    key: 'provideOutlines',
    value: function provideOutlines() {
      if (this.outlineProvider) {
        return this.outlineProvider;
      }

      var _require10 = require('./outline/outline-provider');

      var OutlineProvider = _require10.OutlineProvider;

      this.outlineProvider = new OutlineProvider(this.provideGoConfig());
      return this.outlineProvider;
    }
  }, {
    key: 'provideCodeHighlight',
    value: function provideCodeHighlight() {
      if (this.highlight) {
        return this.highlight;
      }

      var _require11 = require('./highlight/highlight-provider');

      var HighlightProvider = _require11.HighlightProvider;

      this.highlight = new HighlightProvider(this.provideGoConfig());

      if (this.subscriptions) {
        this.subscriptions.add(this.highlight);
      }

      return this.highlight;
    }
  }, {
    key: 'loadOutput',
    value: function loadOutput() {
      if (this.outputManager) {
        return this.outputManager;
      }

      var _require12 = require('./output-manager');

      var OutputManager = _require12.OutputManager;

      var outputManager = new OutputManager();
      this.outputManager = outputManager;

      var _require13 = require('./output-panel');

      var OutputPanel = _require13.OutputPanel;

      var view = this.consumeViewProvider({
        view: OutputPanel,
        model: this.outputManager
      });

      if (this.subscriptions) {
        this.subscriptions.add(view);
      }

      return outputManager;
    }
  }, {
    key: 'provideCodeFormatter',
    value: function provideCodeFormatter() {
      if (this.formatter) {
        return this.formatter;
      }

      var _require14 = require('./format/formatter');

      var Formatter = _require14.Formatter;

      this.formatter = new Formatter(this.provideGoConfig());
      if (this.subscriptions) {
        this.subscriptions.add(this.formatter);
      }
      return this.formatter;
    }
  }, {
    key: 'loadTester',
    value: function loadTester() {
      var _this3 = this;

      if (this.tester) {
        return this.tester;
      }

      var _require15 = require('./test/tester');

      var Tester = _require15.Tester;

      this.tester = new Tester(this.provideGoConfig(), this.loadOutput(), function () {
        return _this3.busySignal;
      });
      if (this.subscriptions) {
        this.subscriptions.add(this.tester);
      }

      return this.tester;
    }
  }, {
    key: 'loadGorename',
    value: function loadGorename() {
      if (this.gorename) {
        return this.gorename;
      }

      var _require16 = require('./rename/gorename');

      var Gorename = _require16.Gorename;

      this.gorename = new Gorename(this.provideGoConfig());
      if (this.subscriptions) {
        this.subscriptions.add(this.gorename);
      }

      return this.gorename;
    }
  }, {
    key: 'loadGoModifyTags',
    value: function loadGoModifyTags() {
      if (this.gomodifytags) {
        return this.gomodifytags;
      }

      var _require17 = require('./tags/gomodifytags');

      var GoModifyTags = _require17.GoModifyTags;

      this.gomodifytags = new GoModifyTags(this.provideGoConfig());
      if (this.subscriptions) {
        this.subscriptions.add(this.gomodifytags);
      }
      return this.gomodifytags;
    }
  }, {
    key: 'loadBuilder',
    value: function loadBuilder() {
      var _this4 = this;

      if (this.builder) {
        return this.builder;
      }

      var _require18 = require('./build/builder');

      var Builder = _require18.Builder;

      this.builder = new Builder(this.provideGoConfig(), function () {
        return _this4.buildLinter;
      }, this.loadOutput(), function () {
        return _this4.busySignal;
      });

      if (this.subscriptions) {
        this.subscriptions.add(this.builder);
      }

      return this.builder;
    }
  }, {
    key: 'loadLinter',
    value: function loadLinter() {
      var _this5 = this;

      if (this.golinter) {
        return this.golinter;
      }

      var _require19 = require('./lint/linter');

      var Linter = _require19.Linter;

      this.golinter = new Linter(this.provideGoConfig(), function () {
        return _this5.linter;
      }, function () {
        return _this5.busySignal;
      });

      if (this.subscriptions) {
        this.subscriptions.add(this.golinter);
      }

      return this.golinter;
    }
  }, {
    key: 'loadNavigator',
    value: function loadNavigator() {
      if (this.navigator) {
        return this.navigator;
      }

      var _require20 = require('./navigator/navigator');

      var Navigator = _require20.Navigator;

      this.navigator = new Navigator(this.provideGoConfig());

      if (this.subscriptions) {
        this.subscriptions.add(this.navigator);
      }

      return this.navigator;
    }
  }, {
    key: 'getPanelManager',
    value: function getPanelManager() {
      if (this.panelManager) {
        return this.panelManager;
      }

      var _require21 = require('./panel/panel-manager');

      var PanelManager = _require21.PanelManager;

      this.panelManager = new PanelManager();

      if (this.subscriptions) {
        this.subscriptions.add(this.panelManager);
      }

      return this.panelManager;
    }
  }, {
    key: 'loadPackageManager',
    value: function loadPackageManager() {
      if (this.packagemanager) {
        return this.packagemanager;
      }

      var _require22 = require('./package-manager');

      var PackageManager = _require22.PackageManager;

      this.packagemanager = new PackageManager(this.provideGoConfig(), this.provideGoGet());

      if (this.subscriptions) {
        this.subscriptions.add(this.packagemanager);
      }

      return this.packagemanager;
    }
  }, {
    key: 'consumeBusySignal',
    value: function consumeBusySignal(service) {
      this.busySignal = service;
    }
  }, {
    key: 'consumeConsole',
    value: function consumeConsole(createConsole) {
      var _this6 = this;

      this.console = createConsole({ id: 'go-plus', name: 'go-plus' });
      return new _atom.Disposable(function () {
        if (_this6.console) {
          _this6.console.dispose();
          _this6.console = null;
        }
      });
    }
  }, {
    key: 'consumeViewProvider',
    value: function consumeViewProvider(provider) {
      if (!provider) {
        // for simplified type handling just assume
        // that this never happens for our own code
        return null;
      }

      return this.getPanelManager().registerViewProvider(provider.view, provider.model);
    }
  }, {
    key: 'consumeLinter',
    value: function consumeLinter(registry) {
      this.buildLinter = registry({ name: 'go build' });
      this.linter = registry({ name: 'go linter' });
      if (this.subscriptions) {
        this.subscriptions.add(this.buildLinter, this.linter);
      }
    }
  }, {
    key: 'consumeDatatipService',
    value: function consumeDatatipService(service) {
      service.addProvider(this.loadDoc());
    }
  }, {
    key: 'provideGoConfig',
    value: function provideGoConfig() {
      var _this7 = this;

      if (this.configservice) {
        return this.configservice.provide();
      }

      var _require23 = require('./config/service');

      var ConfigService = _require23.ConfigService;

      this.configservice = new ConfigService(function () {
        return _this7.console;
      });
      if (this.subscriptions) {
        this.subscriptions.add(this.configservice);
      }
      return this.configservice.provide();
    }
  }, {
    key: 'provideGoGet',
    value: function provideGoGet() {
      var _this8 = this;

      if (this.getservice) {
        return this.getservice.provide();
      }

      var _require24 = require('./get/service');

      var GetService = _require24.GetService;

      this.getservice = new GetService(this.provideGoConfig(), function () {
        return _this8.loadOutput();
      }, function () {
        return _this8.busySignal;
      });
      return this.getservice.provide();
    }
  }, {
    key: 'provideAutocomplete',
    value: function provideAutocomplete() {
      if (this.autocompleteProvider) {
        return this.autocompleteProvider;
      }

      var _require25 = require('./autocomplete/gocodeprovider');

      var GocodeProvider = _require25.GocodeProvider;

      this.autocompleteProvider = new GocodeProvider(this.provideGoConfig());

      if (this.subscriptions) {
        this.subscriptions.add(this.autocompleteProvider);
      }

      return this.autocompleteProvider;
    }
  }, {
    key: 'provideReferences',
    value: function provideReferences() {
      if (this.references) {
        return this.references;
      }

      var _require26 = require('./references/references-provider');

      var ReferencesProvider = _require26.ReferencesProvider;

      this.references = new ReferencesProvider(this.provideGoConfig());
      return this.references;
    }
  }, {
    key: 'provideDefinitions',
    value: function provideDefinitions() {
      var _this9 = this;

      if (this.definitionProvider) {
        return this.definitionProvider;
      }

      var _require27 = require('./navigator/definition-provider');

      var DefinitionProvider = _require27.DefinitionProvider;

      this.definitionProvider = new DefinitionProvider(function () {
        return _this9.loadNavigator();
      });

      if (this.subscriptions) {
        this.subscriptions.add(this.definitionProvider);
      }

      return this.definitionProvider;
    }
  }, {
    key: 'checkFormatOnSave',
    value: function checkFormatOnSave() {
      var skip = atom.config.get('go-plus.skipCodeFormatCheck');
      if (skip) return;

      var formatOnSave = atom.config.get('atom-ide-ui.atom-ide-code-format.formatOnSave');
      if (formatOnSave) return;

      var n = atom.notifications.addInfo('go-plus', {
        buttons: [{
          text: 'Yes',
          onDidClick: function onDidClick() {
            atom.config.set('atom-ide-ui.atom-ide-code-format.formatOnSave', true);
            n.dismiss();
          }
        }, { text: 'No', onDidClick: function onDidClick() {
            return n.dismiss();
          } }, {
          text: 'Never (don\'t ask me again)',
          onDidClick: function onDidClick() {
            atom.config.set('go-plus.skipCodeFormatCheck', true);
            n.dismiss();
          }
        }],
        dismissable: true,
        description: "In order for go-plus to format code on save, `atom-ide-ui`'s " + 'format on save option must be enabled.  Would you like to enable it now?'
      });
    }
  }, {
    key: 'validateAtomVersion',
    value: function validateAtomVersion() {
      var _this10 = this;

      var semver = require('semver');
      if (semver.lt(atom.appVersion, minimumVersion)) {
        (function () {
          var os = require('os');
          var notification = atom.notifications.addError('go-plus', {
            dismissable: true,
            icon: 'flame',
            detail: 'you are running an old version of Atom',
            description: '`go-plus` requires at least `v' + minimumVersion + '` but you are running v`' + atom.appVersion + '`.' + os.EOL + os.EOL + 'Please update Atom to the latest version.'
          });
          if (_this10.subscriptions) {
            _this10.subscriptions.add({
              dispose: function dispose() {
                notification.dismiss();
              }
            });
          }
        })();
      }
    }
  }]);

  return Main;
})();

module.exports = new Main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFZ0QsTUFBTTs7QUFJdEQsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFBOztJQUV6QixJQUFJO1dBQUosSUFBSTswQkFBSixJQUFJOztTQUNSLFNBQVMsR0FBRyxJQUFJO1NBQ2hCLFlBQVksR0FBRyxJQUFJO1NBQ25CLE9BQU8sR0FBRyxJQUFJO1NBQ2QsVUFBVSxHQUFHLElBQUk7U0FDakIsYUFBYSxHQUFHLElBQUk7U0FDcEIsT0FBTyxHQUFHLElBQUk7U0FDZCxTQUFTLEdBQUcsSUFBSTtTQUNoQixVQUFVLEdBQUcsSUFBSTtTQUNqQixTQUFTLEdBQUcsSUFBSTtTQUNoQixLQUFLLEdBQUcsSUFBSTtTQUNaLFlBQVksR0FBRyxJQUFJO1NBQ25CLFFBQVEsR0FBRyxJQUFJO1NBQ2YsV0FBVyxHQUFHLElBQUk7eUJBQ0wsSUFBSTtTQUNqQixRQUFRLEdBQUcsSUFBSTtTQUNmLE1BQU0sR0FBUSxJQUFJO1NBQ2xCLFFBQVEsR0FBRyxJQUFJO1NBQ2YsV0FBVyxHQUFRLElBQUk7U0FDdkIsTUFBTSxHQUFHLElBQUk7U0FDYixZQUFZLEdBQUcsSUFBSTtTQUNuQixhQUFhLEdBQUcsSUFBSTtTQUNwQixZQUFZLEdBQUcsSUFBSTtTQUVuQixNQUFNLEdBQUcsSUFBSTtTQUNiLFVBQVUsR0FBRyxJQUFJO1NBQ2pCLFNBQVMsR0FBRyxJQUFJO1NBQ2hCLGVBQWUsR0FBRyxJQUFJO1NBQ3RCLG9CQUFvQixHQUFHLElBQUk7U0FDM0Isa0JBQWtCLEdBQUcsSUFBSTtTQUN6QixjQUFjLEdBQUcsSUFBSTs7O2VBOUJqQixJQUFJOztXQWdDQSxvQkFBRzs7O0FBQ1QsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDMUIsVUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUE7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7O3FCQUVNLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs7VUFBMUMsWUFBWSxZQUFaLFlBQVk7O0FBQ3BCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7O3NCQUVuQixPQUFPLENBQUMsYUFBYSxDQUFDOztVQUFwQyxTQUFTLGFBQVQsU0FBUzs7QUFDakIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFNO0FBQ25DLGNBQUssWUFBWSxHQUFHLElBQUksQ0FBQTtBQUN4QixjQUFLLElBQUksRUFBRSxDQUFBO0FBQ1gsY0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLGNBQUssaUJBQWlCLEVBQUUsQ0FBQTtPQUN6QixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7S0FDdkM7OztXQUVTLHNCQUFHO0FBQ1gsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2Y7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUE7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsWUFBSSxDQUFDLGFBQWEsR0FBSSxJQUFJLEFBQU0sQ0FBQTtPQUNqQztBQUNELFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO09BQ3BCO0FBQ0QsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbkIsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDdEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7QUFDeEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDdkIsVUFBSSxjQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBOztBQUVyQixVQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUE7S0FDL0I7OztXQUVHLGdCQUFHOzs7QUFDTCxVQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEIsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNqQixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDZCxVQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDckIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0FBQ3ZCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDcEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDdkMsWUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7T0FDMUI7QUFDRCxVQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7O1VBRTlCLGFBQWEsR0FBbUIsSUFBSSxDQUFwQyxhQUFhO1VBQUUsWUFBWSxHQUFLLElBQUksQ0FBckIsWUFBWTs7QUFDbkMsVUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNuQyxlQUFNO09BQ1A7O0FBRUQsbUJBQWEsQ0FBQyxHQUFHLENBQ2YsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBQyxNQUFNLEVBQWMsSUFBSSxFQUFhO0FBQ3JFLFlBQUksT0FBSyxPQUFPLEVBQUUsT0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNuRCxDQUFDLENBQ0gsQ0FBQTtBQUNELG1CQUFhLENBQUMsR0FBRyxDQUNmLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQUMsTUFBTSxFQUFjLElBQUksRUFBYTtBQUNwRSxhQUFLLElBQUksQ0FBQTtBQUNULFlBQUksT0FBSyxNQUFNLEVBQUUsT0FBSyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQ3JELENBQUMsQ0FDSCxDQUFBO0FBQ0QsbUJBQWEsQ0FBQyxHQUFHLENBQ2YsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBQyxNQUFNLEVBQWMsSUFBSSxFQUFhO0FBQ3BFLGFBQUssSUFBSSxDQUFBO0FBQ1QsWUFBSSxPQUFLLFFBQVEsRUFBRSxPQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDOUMsQ0FBQyxDQUNILENBQUE7O0FBRUQsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7S0FDbkI7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixlQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7T0FDeEI7O3NCQUUyQixPQUFPLENBQUMseUJBQXlCLENBQUM7O1VBQXRELGVBQWUsYUFBZixlQUFlOztzQkFDQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7O1VBQTdDLFdBQVcsYUFBWCxXQUFXOztBQUNuQixVQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQTtBQUMzRCxVQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDcEMsWUFBSSxFQUFFLGVBQWU7QUFDckIsYUFBSyxFQUFFLFdBQVc7T0FDbkIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUMxQzs7QUFFRCxhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDeEI7OztXQUVXLHdCQUFHO0FBQ2IsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtPQUNyQjs7c0JBQ29CLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs7VUFBekMsUUFBUSxhQUFSLFFBQVE7O0FBQ2hCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDcEQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtPQUNsQjs7c0JBRWlCLE9BQU8sQ0FBQyxhQUFhLENBQUM7O1VBQWhDLEtBQUssYUFBTCxLQUFLOztBQUNiLFVBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBOztzQkFFSSxPQUFPLENBQUMsa0JBQWtCLENBQUM7O1VBQXpDLFNBQVMsYUFBVCxTQUFTOztBQUNqQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDcEMsWUFBSSxFQUFFLFNBQVM7QUFDZixhQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRTtPQUN4QixDQUFDLENBQUE7O0FBRUYsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNwQztBQUNELGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztXQUVhLDBCQUFHO0FBQ2YsVUFBSSxJQUFJLGNBQVcsRUFBRTtBQUNuQixlQUFPLElBQUksY0FBVyxDQUFBO09BQ3ZCOztzQkFDc0IsT0FBTyxDQUFDLHlCQUF5QixDQUFDOztVQUFqRCxVQUFVLGFBQVYsVUFBVTs7QUFDbEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDcEQsVUFBSSxjQUFXLEdBQUcsS0FBSyxDQUFBOztzQkFDSSxPQUFPLENBQUMsOEJBQThCLENBQUM7O1VBQTFELGNBQWMsYUFBZCxjQUFjOztBQUN0QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDcEMsWUFBSSxFQUFFLGNBQWM7QUFDcEIsYUFBSyxFQUFFLEtBQUs7T0FDYixDQUFDLENBQUE7QUFDRixVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3BDO0FBQ0QsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1dBRWMsMkJBQUc7QUFDaEIsVUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3hCLGVBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQTtPQUM1Qjs7dUJBQzJCLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQzs7VUFBekQsZUFBZSxjQUFmLGVBQWU7O0FBQ3ZCLFVBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDbEUsYUFBTyxJQUFJLENBQUMsZUFBZSxDQUFBO0tBQzVCOzs7V0FFbUIsZ0NBQUc7QUFDckIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtPQUN0Qjs7dUJBRTZCLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQzs7VUFBL0QsaUJBQWlCLGNBQWpCLGlCQUFpQjs7QUFDekIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBOztBQUU5RCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BQ3ZDOztBQUVELGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtLQUN0Qjs7O1dBRVMsc0JBQUc7QUFDWCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFBO09BQzFCOzt1QkFDeUIsT0FBTyxDQUFDLGtCQUFrQixDQUFDOztVQUE3QyxhQUFhLGNBQWIsYUFBYTs7QUFDckIsVUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQTtBQUN6QyxVQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQTs7dUJBRVYsT0FBTyxDQUFDLGdCQUFnQixDQUFDOztVQUF6QyxXQUFXLGNBQVgsV0FBVzs7QUFDbkIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO0FBQ3BDLFlBQUksRUFBRSxXQUFXO0FBQ2pCLGFBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtPQUMxQixDQUFDLENBQUE7O0FBRUYsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQzdCOztBQUVELGFBQU8sYUFBYSxDQUFBO0tBQ3JCOzs7V0FFbUIsZ0NBQUc7QUFDckIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtPQUN0Qjs7dUJBQ3FCLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQzs7VUFBM0MsU0FBUyxjQUFULFNBQVM7O0FBQ2pCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDdEQsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtPQUN2QztBQUNELGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtLQUN0Qjs7O1dBRVMsc0JBQUc7OztBQUNYLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtPQUNuQjs7dUJBRWtCLE9BQU8sQ0FBQyxlQUFlLENBQUM7O1VBQW5DLE1BQU0sY0FBTixNQUFNOztBQUNkLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQ3RCLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUNqQjtlQUFNLE9BQUssVUFBVTtPQUFBLENBQ3RCLENBQUE7QUFDRCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQ3BDOztBQUVELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUNuQjs7O1dBRVcsd0JBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO09BQ3JCOzt1QkFDb0IsT0FBTyxDQUFDLG1CQUFtQixDQUFDOztVQUF6QyxRQUFRLGNBQVIsUUFBUTs7QUFDaEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQTtBQUNwRCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ3RDOztBQUVELGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtLQUNyQjs7O1dBRWUsNEJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLGVBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQTtPQUN6Qjs7dUJBQ3dCLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQzs7VUFBL0MsWUFBWSxjQUFaLFlBQVk7O0FBQ3BCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDNUQsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUMxQztBQUNELGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQTtLQUN6Qjs7O1dBRVUsdUJBQUc7OztBQUNaLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7T0FDcEI7O3VCQUNtQixPQUFPLENBQUMsaUJBQWlCLENBQUM7O1VBQXRDLE9BQU8sY0FBUCxPQUFPOztBQUNmLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQ3hCLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFDdEI7ZUFBTSxPQUFLLFdBQVc7T0FBQSxFQUN0QixJQUFJLENBQUMsVUFBVSxFQUFFLEVBQ2pCO2VBQU0sT0FBSyxVQUFVO09BQUEsQ0FDdEIsQ0FBQTs7QUFFRCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO09BQ3JDOztBQUVELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjs7O1dBRVMsc0JBQUc7OztBQUNYLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixlQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7T0FDckI7O3VCQUNrQixPQUFPLENBQUMsZUFBZSxDQUFDOztVQUFuQyxNQUFNLGNBQU4sTUFBTTs7QUFDZCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksTUFBTSxDQUN4QixJQUFJLENBQUMsZUFBZSxFQUFFLEVBQ3RCO2VBQU8sT0FBSyxNQUFNO09BQU0sRUFDeEI7ZUFBTSxPQUFLLFVBQVU7T0FBQSxDQUN0QixDQUFBOztBQUVELFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDdEM7O0FBRUQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCOzs7V0FFWSx5QkFBRztBQUNkLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7T0FDdEI7O3VCQUNxQixPQUFPLENBQUMsdUJBQXVCLENBQUM7O1VBQTlDLFNBQVMsY0FBVCxTQUFTOztBQUNqQixVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBOztBQUV0RCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BQ3ZDOztBQUVELGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtLQUN0Qjs7O1dBRWMsMkJBQUc7QUFDaEIsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLGVBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQTtPQUN6Qjs7dUJBQ3dCLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzs7VUFBakQsWUFBWSxjQUFaLFlBQVk7O0FBQ3BCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTs7QUFFdEMsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUMxQzs7QUFFRCxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUE7S0FDekI7OztXQUVpQiw4QkFBRztBQUNuQixVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsZUFBTyxJQUFJLENBQUMsY0FBYyxDQUFBO09BQzNCOzt1QkFFMEIsT0FBTyxDQUFDLG1CQUFtQixDQUFDOztVQUEvQyxjQUFjLGNBQWQsY0FBYzs7QUFDdEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDdEMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQ3BCLENBQUE7O0FBRUQsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtPQUM1Qzs7QUFFRCxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7S0FDM0I7OztXQUVnQiwyQkFBQyxPQUFZLEVBQUU7QUFDOUIsVUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUE7S0FDMUI7OztXQUVhLHdCQUFDLGFBQXVCLEVBQUU7OztBQUN0QyxVQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7QUFDaEUsYUFBTyxxQkFBZSxZQUFNO0FBQzFCLFlBQUksT0FBSyxPQUFPLEVBQUU7QUFDaEIsaUJBQUssT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RCLGlCQUFLLE9BQU8sR0FBRyxJQUFJLENBQUE7U0FDcEI7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBRWtCLDZCQUFDLFFBR25CLEVBQUU7QUFDRCxVQUFJLENBQUMsUUFBUSxFQUFFOzs7QUFHYixlQUFRLElBQUksQ0FBTTtPQUNuQjs7QUFFRCxhQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxvQkFBb0IsQ0FDaEQsUUFBUSxDQUFDLElBQUksRUFDYixRQUFRLENBQUMsS0FBSyxDQUNmLENBQUE7S0FDRjs7O1dBRVksdUJBQUMsUUFBYSxFQUFFO0FBQzNCLFVBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDakQsVUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtBQUM3QyxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDdEQ7S0FDRjs7O1dBRW9CLCtCQUFDLE9BQVksRUFBRTtBQUNsQyxhQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0tBQ3BDOzs7V0FFYywyQkFBRzs7O0FBQ2hCLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDcEM7O3VCQUN5QixPQUFPLENBQUMsa0JBQWtCLENBQUM7O1VBQTdDLGFBQWEsY0FBYixhQUFhOztBQUNyQixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDO2VBQU0sT0FBSyxPQUFPO09BQUEsQ0FBQyxDQUFBO0FBQzFELFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7T0FDM0M7QUFDRCxhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDcEM7OztXQUVXLHdCQUFHOzs7QUFDYixVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsZUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2pDOzt1QkFDc0IsT0FBTyxDQUFDLGVBQWUsQ0FBQzs7VUFBdkMsVUFBVSxjQUFWLFVBQVU7O0FBQ2xCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQzlCLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFDdEI7ZUFBTSxPQUFLLFVBQVUsRUFBRTtPQUFBLEVBQ3ZCO2VBQU0sT0FBSyxVQUFVO09BQUEsQ0FDdEIsQ0FBQTtBQUNELGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNqQzs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO0FBQzdCLGVBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFBO09BQ2pDOzt1QkFDMEIsT0FBTyxDQUFDLCtCQUErQixDQUFDOztVQUEzRCxjQUFjLGNBQWQsY0FBYzs7QUFDdEIsVUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBOztBQUV0RSxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7T0FDbEQ7O0FBRUQsYUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUE7S0FDakM7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsZUFBTyxJQUFJLENBQUMsVUFBVSxDQUFBO09BQ3ZCOzt1QkFFOEIsT0FBTyxDQUFDLGtDQUFrQyxDQUFDOztVQUFsRSxrQkFBa0IsY0FBbEIsa0JBQWtCOztBQUMxQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDaEUsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFBO0tBQ3ZCOzs7V0FFaUIsOEJBQUc7OztBQUNuQixVQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUMzQixlQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQTtPQUMvQjs7dUJBQzhCLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQzs7VUFBakUsa0JBQWtCLGNBQWxCLGtCQUFrQjs7QUFDMUIsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUM7ZUFBTSxPQUFLLGFBQWEsRUFBRTtPQUFBLENBQUMsQ0FBQTs7QUFFNUUsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO09BQ2hEOztBQUVELGFBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFBO0tBQy9COzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtBQUMzRCxVQUFJLElBQUksRUFBRSxPQUFNOztBQUVoQixVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FDbEMsK0NBQStDLENBQ2hELENBQUE7QUFDRCxVQUFJLFlBQVksRUFBRSxPQUFNOztBQUV4QixVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7QUFDOUMsZUFBTyxFQUFFLENBQ1A7QUFDRSxjQUFJLEVBQUUsS0FBSztBQUNYLG9CQUFVLEVBQUUsc0JBQU07QUFDaEIsZ0JBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUNiLCtDQUErQyxFQUMvQyxJQUFJLENBQ0wsQ0FBQTtBQUNELGFBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtXQUNaO1NBQ0YsRUFDRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO21CQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUU7V0FBQSxFQUFFLEVBQzdDO0FBQ0UsY0FBSSwrQkFBOEI7QUFDbEMsb0JBQVUsRUFBRSxzQkFBTTtBQUNoQixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDcEQsYUFBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1dBQ1o7U0FDRixDQUNGO0FBQ0QsbUJBQVcsRUFBRSxJQUFJO0FBQ2pCLG1CQUFXLEVBQ1QsK0RBQStELEdBQy9ELDBFQUEwRTtPQUM3RSxDQUFDLENBQUE7S0FDSDs7O1dBRWtCLCtCQUFHOzs7QUFDcEIsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxFQUFFOztBQUM5QyxjQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEIsY0FBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQzFELHVCQUFXLEVBQUUsSUFBSTtBQUNqQixnQkFBSSxFQUFFLE9BQU87QUFDYixrQkFBTSxFQUFFLHdDQUF3QztBQUNoRCx1QkFBVyxFQUNULGdDQUFnQyxHQUNoQyxjQUFjLEdBQ2QsMEJBQTBCLEdBQzFCLElBQUksQ0FBQyxVQUFVLEdBQ2YsSUFBSSxHQUNKLEVBQUUsQ0FBQyxHQUFHLEdBQ04sRUFBRSxDQUFDLEdBQUcsR0FDTiwyQ0FBMkM7V0FDOUMsQ0FBQyxDQUFBO0FBQ0YsY0FBSSxRQUFLLGFBQWEsRUFBRTtBQUN0QixvQkFBSyxhQUFhLENBQUMsR0FBRyxDQUFDO0FBQ3JCLHFCQUFPLEVBQUUsbUJBQU07QUFDYiw0QkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFBO2VBQ3ZCO2FBQ0YsQ0FBQyxDQUFBO1dBQ0g7O09BQ0Y7S0FDRjs7O1NBM2lCRyxJQUFJOzs7QUE4aUJWLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFBhbmVsTW9kZWwgfSBmcm9tICcuL3BhbmVsL3RhYidcbmltcG9ydCB0eXBlIHsgUmVuZGVyYWJsZSB9IGZyb20gJy4vZXRjaC1jb21wb25lbnQnXG5cbmNvbnN0IG1pbmltdW1WZXJzaW9uID0gJzEuMTIuNydcblxuY2xhc3MgTWFpbiB7XG4gIGJvb3RzdHJhcCA9IG51bGxcbiAgYm9vdHN0cmFwcGVkID0gbnVsbFxuICBidWlsZGVyID0gbnVsbFxuICBidXN5U2lnbmFsID0gbnVsbFxuICBjb25maWdzZXJ2aWNlID0gbnVsbFxuICBjb25zb2xlID0gbnVsbFxuICBmb3JtYXR0ZXIgPSBudWxsXG4gIGdldHNlcnZpY2UgPSBudWxsXG4gIG5hdmlnYXRvciA9IG51bGxcbiAgZ29kb2MgPSBudWxsXG4gIGdvbW9kaWZ5dGFncyA9IG51bGxcbiAgZ29yZW5hbWUgPSBudWxsXG4gIGluZm9ybWF0aW9uID0gbnVsbFxuICBpbXBsZW1lbnRzID0gbnVsbFxuICBpbXBvcnRlciA9IG51bGxcbiAgbGludGVyOiBhbnkgPSBudWxsXG4gIGdvbGludGVyID0gbnVsbFxuICBidWlsZExpbnRlcjogYW55ID0gbnVsbFxuICBsb2FkZWQgPSBudWxsXG4gIG9yY2hlc3RyYXRvciA9IG51bGxcbiAgb3V0cHV0TWFuYWdlciA9IG51bGxcbiAgcGFuZWxNYW5hZ2VyID0gbnVsbFxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHRlc3RlciA9IG51bGxcbiAgcmVmZXJlbmNlcyA9IG51bGxcbiAgaGlnaGxpZ2h0ID0gbnVsbFxuICBvdXRsaW5lUHJvdmlkZXIgPSBudWxsXG4gIGF1dG9jb21wbGV0ZVByb3ZpZGVyID0gbnVsbFxuICBkZWZpbml0aW9uUHJvdmlkZXIgPSBudWxsXG4gIHBhY2thZ2VtYW5hZ2VyID0gbnVsbFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMudmFsaWRhdGVBdG9tVmVyc2lvbigpXG4gICAgdGhpcy5ib290c3RyYXBwZWQgPSBmYWxzZVxuICAgIHRoaXMubG9hZGVkID0gZmFsc2VcblxuICAgIGNvbnN0IHsgT3JjaGVzdHJhdG9yIH0gPSByZXF1aXJlKCcuL29yY2hlc3RyYXRvcicpXG4gICAgdGhpcy5vcmNoZXN0cmF0b3IgPSBuZXcgT3JjaGVzdHJhdG9yKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMub3JjaGVzdHJhdG9yKVxuXG4gICAgY29uc3QgeyBCb290c3RyYXAgfSA9IHJlcXVpcmUoJy4vYm9vdHN0cmFwJylcbiAgICB0aGlzLmJvb3RzdHJhcCA9IG5ldyBCb290c3RyYXAoKCkgPT4ge1xuICAgICAgdGhpcy5ib290c3RyYXBwZWQgPSB0cnVlXG4gICAgICB0aGlzLmxvYWQoKVxuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlXG4gICAgICB0aGlzLmNoZWNrRm9ybWF0T25TYXZlKClcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib290c3RyYXApXG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuZGlzcG9zZSgpXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuYm9vdHN0cmFwcGVkID0gZmFsc2VcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gKG51bGw6IGFueSlcbiAgICB9XG4gICAgaWYgKHRoaXMuY29uc29sZSkge1xuICAgICAgdGhpcy5jb25zb2xlLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5jb25zb2xlID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLmJvb3RzdHJhcCA9IG51bGxcbiAgICB0aGlzLmJ1aWxkZXIgPSBudWxsXG4gICAgdGhpcy5jb25maWdzZXJ2aWNlID0gbnVsbFxuICAgIHRoaXMuZm9ybWF0dGVyID0gbnVsbFxuICAgIHRoaXMuZ2V0c2VydmljZSA9IG51bGxcbiAgICB0aGlzLm5hdmlnYXRvciA9IG51bGxcbiAgICB0aGlzLmdvZG9jID0gbnVsbFxuICAgIHRoaXMuZ29tb2RpZnl0YWdzID0gbnVsbFxuICAgIHRoaXMuZ29yZW5hbWUgPSBudWxsXG4gICAgdGhpcy5pbmZvcm1hdGlvbiA9IG51bGxcbiAgICB0aGlzLmltcGxlbWVudHMgPSBudWxsXG4gICAgdGhpcy5pbXBvcnRlciA9IG51bGxcbiAgICB0aGlzLmdvbGludGVyID0gbnVsbFxuICAgIHRoaXMub3JjaGVzdHJhdG9yID0gbnVsbFxuICAgIHRoaXMub3V0cHV0TWFuYWdlciA9IG51bGxcbiAgICB0aGlzLnBhbmVsTWFuYWdlciA9IG51bGxcbiAgICB0aGlzLnRlc3RlciA9IG51bGxcbiAgICB0aGlzLnJlZmVyZW5jZXMgPSBudWxsXG4gICAgdGhpcy5oaWdobGlnaHQgPSBudWxsXG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZVByb3ZpZGVyID0gbnVsbFxuICAgIHRoaXMuZGVmaW5pdGlvblByb3ZpZGVyID0gbnVsbFxuICB9XG5cbiAgbG9hZCgpIHtcbiAgICB0aGlzLmdldFBhbmVsTWFuYWdlcigpXG4gICAgdGhpcy5sb2FkT3V0cHV0KClcbiAgICB0aGlzLmxvYWRJbmZvcm1hdGlvbigpXG4gICAgdGhpcy5sb2FkQnVpbGRlcigpXG4gICAgdGhpcy5sb2FkVGVzdGVyKClcbiAgICB0aGlzLmxvYWRMaW50ZXIoKVxuICAgIHRoaXMubG9hZERvYygpXG4gICAgdGhpcy5sb2FkSW1wbGVtZW50cygpXG4gICAgdGhpcy5sb2FkR29yZW5hbWUoKVxuICAgIHRoaXMubG9hZEdvTW9kaWZ5VGFncygpXG4gICAgdGhpcy5sb2FkSW1wb3J0ZXIoKVxuICAgIHRoaXMubG9hZE5hdmlnYXRvcigpXG4gICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoJ2dvLXBsdXMudGVzdGluZycpKSB7XG4gICAgICB0aGlzLmxvYWRQYWNrYWdlTWFuYWdlcigpXG4gICAgfVxuICAgIHRoaXMuZ2V0UGFuZWxNYW5hZ2VyKCkucmVxdWVzdFVwZGF0ZSgpXG5cbiAgICBjb25zdCB7IHN1YnNjcmlwdGlvbnMsIG9yY2hlc3RyYXRvciB9ID0gdGhpc1xuICAgIGlmICghc3Vic2NyaXB0aW9ucyB8fCAhb3JjaGVzdHJhdG9yKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG9yY2hlc3RyYXRvci5yZWdpc3RlcignYnVpbGRlcicsIChlZGl0b3I6IFRleHRFZGl0b3IsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5idWlsZGVyKSB0aGlzLmJ1aWxkZXIuYnVpbGQoZWRpdG9yLCBwYXRoKVxuICAgICAgfSlcbiAgICApXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBvcmNoZXN0cmF0b3IucmVnaXN0ZXIoJ3Rlc3RlcicsIChlZGl0b3I6IFRleHRFZGl0b3IsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICB2b2lkIHBhdGhcbiAgICAgICAgaWYgKHRoaXMudGVzdGVyKSB0aGlzLnRlc3Rlci5oYW5kbGVTYXZlRXZlbnQoZWRpdG9yKVxuICAgICAgfSlcbiAgICApXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBvcmNoZXN0cmF0b3IucmVnaXN0ZXIoJ2xpbnRlcicsIChlZGl0b3I6IFRleHRFZGl0b3IsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICB2b2lkIHBhdGhcbiAgICAgICAgaWYgKHRoaXMuZ29saW50ZXIpIHRoaXMuZ29saW50ZXIubGludChlZGl0b3IpXG4gICAgICB9KVxuICAgIClcblxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZVxuICB9XG5cbiAgbG9hZEluZm9ybWF0aW9uKCkge1xuICAgIGlmICh0aGlzLmluZm9ybWF0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmZvcm1hdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHsgSW5mb3JtYXRpb25WaWV3IH0gPSByZXF1aXJlKCcuL2luZm8vaW5mb3JtYXRpb24tdmlldycpXG4gICAgY29uc3QgeyBJbmZvcm1hdGlvbiB9ID0gcmVxdWlyZSgnLi9pbmZvL2luZm9ybWF0aW9uJylcbiAgICBjb25zdCBpbmZvcm1hdGlvbiA9IG5ldyBJbmZvcm1hdGlvbih0aGlzLnByb3ZpZGVHb0NvbmZpZygpKVxuICAgIHRoaXMuaW5mb3JtYXRpb24gPSBpbmZvcm1hdGlvblxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmNvbnN1bWVWaWV3UHJvdmlkZXIoe1xuICAgICAgdmlldzogSW5mb3JtYXRpb25WaWV3LFxuICAgICAgbW9kZWw6IGluZm9ybWF0aW9uXG4gICAgfSlcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGluZm9ybWF0aW9uLCB2aWV3KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluZm9ybWF0aW9uXG4gIH1cblxuICBsb2FkSW1wb3J0ZXIoKSB7XG4gICAgaWYgKHRoaXMuaW1wb3J0ZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmltcG9ydGVyXG4gICAgfVxuICAgIGNvbnN0IHsgSW1wb3J0ZXIgfSA9IHJlcXVpcmUoJy4vaW1wb3J0L2ltcG9ydGVyJylcbiAgICB0aGlzLmltcG9ydGVyID0gbmV3IEltcG9ydGVyKHRoaXMucHJvdmlkZUdvQ29uZmlnKCkpXG4gICAgcmV0dXJuIHRoaXMuaW1wb3J0ZXJcbiAgfVxuXG4gIGxvYWREb2MoKSB7XG4gICAgaWYgKHRoaXMuZ29kb2MpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvZG9jXG4gICAgfVxuXG4gICAgY29uc3QgeyBHb2RvYyB9ID0gcmVxdWlyZSgnLi9kb2MvZ29kb2MnKVxuICAgIGNvbnN0IGdvZG9jID0gbmV3IEdvZG9jKHRoaXMucHJvdmlkZUdvQ29uZmlnKCkpXG4gICAgdGhpcy5nb2RvYyA9IGdvZG9jXG5cbiAgICBjb25zdCB7IEdvZG9jVmlldyB9ID0gcmVxdWlyZSgnLi9kb2MvZ29kb2MtdmlldycpXG4gICAgY29uc3QgdmlldyA9IHRoaXMuY29uc3VtZVZpZXdQcm92aWRlcih7XG4gICAgICB2aWV3OiBHb2RvY1ZpZXcsXG4gICAgICBtb2RlbDogZ29kb2MuZ2V0UGFuZWwoKVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGdvZG9jLCB2aWV3KVxuICAgIH1cbiAgICByZXR1cm4gZ29kb2NcbiAgfVxuXG4gIGxvYWRJbXBsZW1lbnRzKCkge1xuICAgIGlmICh0aGlzLmltcGxlbWVudHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmltcGxlbWVudHNcbiAgICB9XG4gICAgY29uc3QgeyBJbXBsZW1lbnRzIH0gPSByZXF1aXJlKCcuL2ltcGxlbWVudHMvaW1wbGVtZW50cycpXG4gICAgY29uc3QgaW1wbHMgPSBuZXcgSW1wbGVtZW50cyh0aGlzLnByb3ZpZGVHb0NvbmZpZygpKVxuICAgIHRoaXMuaW1wbGVtZW50cyA9IGltcGxzXG4gICAgY29uc3QgeyBJbXBsZW1lbnRzVmlldyB9ID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRzL2ltcGxlbWVudHMtdmlldycpXG4gICAgY29uc3QgdmlldyA9IHRoaXMuY29uc3VtZVZpZXdQcm92aWRlcih7XG4gICAgICB2aWV3OiBJbXBsZW1lbnRzVmlldyxcbiAgICAgIG1vZGVsOiBpbXBsc1xuICAgIH0pXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChpbXBscywgdmlldylcbiAgICB9XG4gICAgcmV0dXJuIGltcGxzXG4gIH1cblxuICBwcm92aWRlT3V0bGluZXMoKSB7XG4gICAgaWYgKHRoaXMub3V0bGluZVByb3ZpZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5vdXRsaW5lUHJvdmlkZXJcbiAgICB9XG4gICAgY29uc3QgeyBPdXRsaW5lUHJvdmlkZXIgfSA9IHJlcXVpcmUoJy4vb3V0bGluZS9vdXRsaW5lLXByb3ZpZGVyJylcbiAgICB0aGlzLm91dGxpbmVQcm92aWRlciA9IG5ldyBPdXRsaW5lUHJvdmlkZXIodGhpcy5wcm92aWRlR29Db25maWcoKSlcbiAgICByZXR1cm4gdGhpcy5vdXRsaW5lUHJvdmlkZXJcbiAgfVxuXG4gIHByb3ZpZGVDb2RlSGlnaGxpZ2h0KCkge1xuICAgIGlmICh0aGlzLmhpZ2hsaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0XG4gICAgfVxuXG4gICAgY29uc3QgeyBIaWdobGlnaHRQcm92aWRlciB9ID0gcmVxdWlyZSgnLi9oaWdobGlnaHQvaGlnaGxpZ2h0LXByb3ZpZGVyJylcbiAgICB0aGlzLmhpZ2hsaWdodCA9IG5ldyBIaWdobGlnaHRQcm92aWRlcih0aGlzLnByb3ZpZGVHb0NvbmZpZygpKVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmhpZ2hsaWdodClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRcbiAgfVxuXG4gIGxvYWRPdXRwdXQoKSB7XG4gICAgaWYgKHRoaXMub3V0cHV0TWFuYWdlcikge1xuICAgICAgcmV0dXJuIHRoaXMub3V0cHV0TWFuYWdlclxuICAgIH1cbiAgICBjb25zdCB7IE91dHB1dE1hbmFnZXIgfSA9IHJlcXVpcmUoJy4vb3V0cHV0LW1hbmFnZXInKVxuICAgIGNvbnN0IG91dHB1dE1hbmFnZXIgPSBuZXcgT3V0cHV0TWFuYWdlcigpXG4gICAgdGhpcy5vdXRwdXRNYW5hZ2VyID0gb3V0cHV0TWFuYWdlclxuXG4gICAgY29uc3QgeyBPdXRwdXRQYW5lbCB9ID0gcmVxdWlyZSgnLi9vdXRwdXQtcGFuZWwnKVxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmNvbnN1bWVWaWV3UHJvdmlkZXIoe1xuICAgICAgdmlldzogT3V0cHV0UGFuZWwsXG4gICAgICBtb2RlbDogdGhpcy5vdXRwdXRNYW5hZ2VyXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodmlldylcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0TWFuYWdlclxuICB9XG5cbiAgcHJvdmlkZUNvZGVGb3JtYXR0ZXIoKSB7XG4gICAgaWYgKHRoaXMuZm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXR0ZXJcbiAgICB9XG4gICAgY29uc3QgeyBGb3JtYXR0ZXIgfSA9IHJlcXVpcmUoJy4vZm9ybWF0L2Zvcm1hdHRlcicpXG4gICAgdGhpcy5mb3JtYXR0ZXIgPSBuZXcgRm9ybWF0dGVyKHRoaXMucHJvdmlkZUdvQ29uZmlnKCkpXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmZvcm1hdHRlcilcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0dGVyXG4gIH1cblxuICBsb2FkVGVzdGVyKCkge1xuICAgIGlmICh0aGlzLnRlc3Rlcikge1xuICAgICAgcmV0dXJuIHRoaXMudGVzdGVyXG4gICAgfVxuXG4gICAgY29uc3QgeyBUZXN0ZXIgfSA9IHJlcXVpcmUoJy4vdGVzdC90ZXN0ZXInKVxuICAgIHRoaXMudGVzdGVyID0gbmV3IFRlc3RlcihcbiAgICAgIHRoaXMucHJvdmlkZUdvQ29uZmlnKCksXG4gICAgICB0aGlzLmxvYWRPdXRwdXQoKSxcbiAgICAgICgpID0+IHRoaXMuYnVzeVNpZ25hbFxuICAgIClcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMudGVzdGVyKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRlc3RlclxuICB9XG5cbiAgbG9hZEdvcmVuYW1lKCkge1xuICAgIGlmICh0aGlzLmdvcmVuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5nb3JlbmFtZVxuICAgIH1cbiAgICBjb25zdCB7IEdvcmVuYW1lIH0gPSByZXF1aXJlKCcuL3JlbmFtZS9nb3JlbmFtZScpXG4gICAgdGhpcy5nb3JlbmFtZSA9IG5ldyBHb3JlbmFtZSh0aGlzLnByb3ZpZGVHb0NvbmZpZygpKVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5nb3JlbmFtZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nb3JlbmFtZVxuICB9XG5cbiAgbG9hZEdvTW9kaWZ5VGFncygpIHtcbiAgICBpZiAodGhpcy5nb21vZGlmeXRhZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvbW9kaWZ5dGFnc1xuICAgIH1cbiAgICBjb25zdCB7IEdvTW9kaWZ5VGFncyB9ID0gcmVxdWlyZSgnLi90YWdzL2dvbW9kaWZ5dGFncycpXG4gICAgdGhpcy5nb21vZGlmeXRhZ3MgPSBuZXcgR29Nb2RpZnlUYWdzKHRoaXMucHJvdmlkZUdvQ29uZmlnKCkpXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmdvbW9kaWZ5dGFncylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ29tb2RpZnl0YWdzXG4gIH1cblxuICBsb2FkQnVpbGRlcigpIHtcbiAgICBpZiAodGhpcy5idWlsZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZGVyXG4gICAgfVxuICAgIGNvbnN0IHsgQnVpbGRlciB9ID0gcmVxdWlyZSgnLi9idWlsZC9idWlsZGVyJylcbiAgICB0aGlzLmJ1aWxkZXIgPSBuZXcgQnVpbGRlcihcbiAgICAgIHRoaXMucHJvdmlkZUdvQ29uZmlnKCksXG4gICAgICAoKSA9PiB0aGlzLmJ1aWxkTGludGVyLFxuICAgICAgdGhpcy5sb2FkT3V0cHV0KCksXG4gICAgICAoKSA9PiB0aGlzLmJ1c3lTaWduYWxcbiAgICApXG5cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYnVpbGRlcilcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5idWlsZGVyXG4gIH1cblxuICBsb2FkTGludGVyKCkge1xuICAgIGlmICh0aGlzLmdvbGludGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2xpbnRlclxuICAgIH1cbiAgICBjb25zdCB7IExpbnRlciB9ID0gcmVxdWlyZSgnLi9saW50L2xpbnRlcicpXG4gICAgdGhpcy5nb2xpbnRlciA9IG5ldyBMaW50ZXIoXG4gICAgICB0aGlzLnByb3ZpZGVHb0NvbmZpZygpLFxuICAgICAgKCkgPT4gKHRoaXMubGludGVyOiBhbnkpLFxuICAgICAgKCkgPT4gdGhpcy5idXN5U2lnbmFsXG4gICAgKVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmdvbGludGVyKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdvbGludGVyXG4gIH1cblxuICBsb2FkTmF2aWdhdG9yKCkge1xuICAgIGlmICh0aGlzLm5hdmlnYXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdG9yXG4gICAgfVxuICAgIGNvbnN0IHsgTmF2aWdhdG9yIH0gPSByZXF1aXJlKCcuL25hdmlnYXRvci9uYXZpZ2F0b3InKVxuICAgIHRoaXMubmF2aWdhdG9yID0gbmV3IE5hdmlnYXRvcih0aGlzLnByb3ZpZGVHb0NvbmZpZygpKVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm5hdmlnYXRvcilcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0b3JcbiAgfVxuXG4gIGdldFBhbmVsTWFuYWdlcigpIHtcbiAgICBpZiAodGhpcy5wYW5lbE1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhbmVsTWFuYWdlclxuICAgIH1cbiAgICBjb25zdCB7IFBhbmVsTWFuYWdlciB9ID0gcmVxdWlyZSgnLi9wYW5lbC9wYW5lbC1tYW5hZ2VyJylcbiAgICB0aGlzLnBhbmVsTWFuYWdlciA9IG5ldyBQYW5lbE1hbmFnZXIoKVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnBhbmVsTWFuYWdlcilcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYW5lbE1hbmFnZXJcbiAgfVxuXG4gIGxvYWRQYWNrYWdlTWFuYWdlcigpIHtcbiAgICBpZiAodGhpcy5wYWNrYWdlbWFuYWdlcikge1xuICAgICAgcmV0dXJuIHRoaXMucGFja2FnZW1hbmFnZXJcbiAgICB9XG5cbiAgICBjb25zdCB7IFBhY2thZ2VNYW5hZ2VyIH0gPSByZXF1aXJlKCcuL3BhY2thZ2UtbWFuYWdlcicpXG4gICAgdGhpcy5wYWNrYWdlbWFuYWdlciA9IG5ldyBQYWNrYWdlTWFuYWdlcihcbiAgICAgIHRoaXMucHJvdmlkZUdvQ29uZmlnKCksXG4gICAgICB0aGlzLnByb3ZpZGVHb0dldCgpXG4gICAgKVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnBhY2thZ2VtYW5hZ2VyKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhY2thZ2VtYW5hZ2VyXG4gIH1cblxuICBjb25zdW1lQnVzeVNpZ25hbChzZXJ2aWNlOiBhbnkpIHtcbiAgICB0aGlzLmJ1c3lTaWduYWwgPSBzZXJ2aWNlXG4gIH1cblxuICBjb25zdW1lQ29uc29sZShjcmVhdGVDb25zb2xlOiBGdW5jdGlvbikge1xuICAgIHRoaXMuY29uc29sZSA9IGNyZWF0ZUNvbnNvbGUoeyBpZDogJ2dvLXBsdXMnLCBuYW1lOiAnZ28tcGx1cycgfSlcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29uc29sZSkge1xuICAgICAgICB0aGlzLmNvbnNvbGUuZGlzcG9zZSgpXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG51bGxcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29uc3VtZVZpZXdQcm92aWRlcihwcm92aWRlcjoge1xuICAgIHZpZXc6IENsYXNzPFJlbmRlcmFibGU+LFxuICAgIG1vZGVsOiBQYW5lbE1vZGVsXG4gIH0pIHtcbiAgICBpZiAoIXByb3ZpZGVyKSB7XG4gICAgICAvLyBmb3Igc2ltcGxpZmllZCB0eXBlIGhhbmRsaW5nIGp1c3QgYXNzdW1lXG4gICAgICAvLyB0aGF0IHRoaXMgbmV2ZXIgaGFwcGVucyBmb3Igb3VyIG93biBjb2RlXG4gICAgICByZXR1cm4gKG51bGw6IGFueSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbE1hbmFnZXIoKS5yZWdpc3RlclZpZXdQcm92aWRlcihcbiAgICAgIHByb3ZpZGVyLnZpZXcsXG4gICAgICBwcm92aWRlci5tb2RlbFxuICAgIClcbiAgfVxuXG4gIGNvbnN1bWVMaW50ZXIocmVnaXN0cnk6IGFueSkge1xuICAgIHRoaXMuYnVpbGRMaW50ZXIgPSByZWdpc3RyeSh7IG5hbWU6ICdnbyBidWlsZCcgfSlcbiAgICB0aGlzLmxpbnRlciA9IHJlZ2lzdHJ5KHsgbmFtZTogJ2dvIGxpbnRlcicgfSlcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYnVpbGRMaW50ZXIsIHRoaXMubGludGVyKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN1bWVEYXRhdGlwU2VydmljZShzZXJ2aWNlOiBhbnkpIHtcbiAgICBzZXJ2aWNlLmFkZFByb3ZpZGVyKHRoaXMubG9hZERvYygpKVxuICB9XG5cbiAgcHJvdmlkZUdvQ29uZmlnKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZ3NlcnZpY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3NlcnZpY2UucHJvdmlkZSgpXG4gICAgfVxuICAgIGNvbnN0IHsgQ29uZmlnU2VydmljZSB9ID0gcmVxdWlyZSgnLi9jb25maWcvc2VydmljZScpXG4gICAgdGhpcy5jb25maWdzZXJ2aWNlID0gbmV3IENvbmZpZ1NlcnZpY2UoKCkgPT4gdGhpcy5jb25zb2xlKVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb25maWdzZXJ2aWNlKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWdzZXJ2aWNlLnByb3ZpZGUoKVxuICB9XG5cbiAgcHJvdmlkZUdvR2V0KCkge1xuICAgIGlmICh0aGlzLmdldHNlcnZpY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldHNlcnZpY2UucHJvdmlkZSgpXG4gICAgfVxuICAgIGNvbnN0IHsgR2V0U2VydmljZSB9ID0gcmVxdWlyZSgnLi9nZXQvc2VydmljZScpXG4gICAgdGhpcy5nZXRzZXJ2aWNlID0gbmV3IEdldFNlcnZpY2UoXG4gICAgICB0aGlzLnByb3ZpZGVHb0NvbmZpZygpLFxuICAgICAgKCkgPT4gdGhpcy5sb2FkT3V0cHV0KCksXG4gICAgICAoKSA9PiB0aGlzLmJ1c3lTaWduYWxcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuZ2V0c2VydmljZS5wcm92aWRlKClcbiAgfVxuXG4gIHByb3ZpZGVBdXRvY29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlUHJvdmlkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZVByb3ZpZGVyXG4gICAgfVxuICAgIGNvbnN0IHsgR29jb2RlUHJvdmlkZXIgfSA9IHJlcXVpcmUoJy4vYXV0b2NvbXBsZXRlL2dvY29kZXByb3ZpZGVyJylcbiAgICB0aGlzLmF1dG9jb21wbGV0ZVByb3ZpZGVyID0gbmV3IEdvY29kZVByb3ZpZGVyKHRoaXMucHJvdmlkZUdvQ29uZmlnKCkpXG5cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYXV0b2NvbXBsZXRlUHJvdmlkZXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlUHJvdmlkZXJcbiAgfVxuXG4gIHByb3ZpZGVSZWZlcmVuY2VzKCkge1xuICAgIGlmICh0aGlzLnJlZmVyZW5jZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZmVyZW5jZXNcbiAgICB9XG5cbiAgICBjb25zdCB7IFJlZmVyZW5jZXNQcm92aWRlciB9ID0gcmVxdWlyZSgnLi9yZWZlcmVuY2VzL3JlZmVyZW5jZXMtcHJvdmlkZXInKVxuICAgIHRoaXMucmVmZXJlbmNlcyA9IG5ldyBSZWZlcmVuY2VzUHJvdmlkZXIodGhpcy5wcm92aWRlR29Db25maWcoKSlcbiAgICByZXR1cm4gdGhpcy5yZWZlcmVuY2VzXG4gIH1cblxuICBwcm92aWRlRGVmaW5pdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuZGVmaW5pdGlvblByb3ZpZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9uUHJvdmlkZXJcbiAgICB9XG4gICAgY29uc3QgeyBEZWZpbml0aW9uUHJvdmlkZXIgfSA9IHJlcXVpcmUoJy4vbmF2aWdhdG9yL2RlZmluaXRpb24tcHJvdmlkZXInKVxuICAgIHRoaXMuZGVmaW5pdGlvblByb3ZpZGVyID0gbmV3IERlZmluaXRpb25Qcm92aWRlcigoKSA9PiB0aGlzLmxvYWROYXZpZ2F0b3IoKSlcblxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWZpbml0aW9uUHJvdmlkZXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvblByb3ZpZGVyXG4gIH1cblxuICBjaGVja0Zvcm1hdE9uU2F2ZSgpIHtcbiAgICBjb25zdCBza2lwID0gYXRvbS5jb25maWcuZ2V0KCdnby1wbHVzLnNraXBDb2RlRm9ybWF0Q2hlY2snKVxuICAgIGlmIChza2lwKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1hdE9uU2F2ZSA9IGF0b20uY29uZmlnLmdldChcbiAgICAgICdhdG9tLWlkZS11aS5hdG9tLWlkZS1jb2RlLWZvcm1hdC5mb3JtYXRPblNhdmUnXG4gICAgKVxuICAgIGlmIChmb3JtYXRPblNhdmUpIHJldHVyblxuXG4gICAgY29uc3QgbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdnby1wbHVzJywge1xuICAgICAgYnV0dG9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1llcycsXG4gICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KFxuICAgICAgICAgICAgICAnYXRvbS1pZGUtdWkuYXRvbS1pZGUtY29kZS1mb3JtYXQuZm9ybWF0T25TYXZlJyxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgbi5kaXNtaXNzKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHsgdGV4dDogJ05vJywgb25EaWRDbGljazogKCkgPT4gbi5kaXNtaXNzKCkgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IGBOZXZlciAoZG9uJ3QgYXNrIG1lIGFnYWluKWAsXG4gICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLnNraXBDb2RlRm9ybWF0Q2hlY2snLCB0cnVlKVxuICAgICAgICAgICAgbi5kaXNtaXNzKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIkluIG9yZGVyIGZvciBnby1wbHVzIHRvIGZvcm1hdCBjb2RlIG9uIHNhdmUsIGBhdG9tLWlkZS11aWAncyBcIiArXG4gICAgICAgICdmb3JtYXQgb24gc2F2ZSBvcHRpb24gbXVzdCBiZSBlbmFibGVkLiAgV291bGQgeW91IGxpa2UgdG8gZW5hYmxlIGl0IG5vdz8nXG4gICAgfSlcbiAgfVxuXG4gIHZhbGlkYXRlQXRvbVZlcnNpb24oKSB7XG4gICAgY29uc3Qgc2VtdmVyID0gcmVxdWlyZSgnc2VtdmVyJylcbiAgICBpZiAoc2VtdmVyLmx0KGF0b20uYXBwVmVyc2lvbiwgbWluaW11bVZlcnNpb24pKSB7XG4gICAgICBjb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignZ28tcGx1cycsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGljb246ICdmbGFtZScsXG4gICAgICAgIGRldGFpbDogJ3lvdSBhcmUgcnVubmluZyBhbiBvbGQgdmVyc2lvbiBvZiBBdG9tJyxcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgJ2Bnby1wbHVzYCByZXF1aXJlcyBhdCBsZWFzdCBgdicgK1xuICAgICAgICAgIG1pbmltdW1WZXJzaW9uICtcbiAgICAgICAgICAnYCBidXQgeW91IGFyZSBydW5uaW5nIHZgJyArXG4gICAgICAgICAgYXRvbS5hcHBWZXJzaW9uICtcbiAgICAgICAgICAnYC4nICtcbiAgICAgICAgICBvcy5FT0wgK1xuICAgICAgICAgIG9zLkVPTCArXG4gICAgICAgICAgJ1BsZWFzZSB1cGRhdGUgQXRvbSB0byB0aGUgbGF0ZXN0IHZlcnNpb24uJ1xuICAgICAgfSlcbiAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh7XG4gICAgICAgICAgZGlzcG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWFpbigpXG4iXX0=