(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, _, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, openSettings, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml;

  pkg = require('../package');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getScrollTop = function(editor) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.getScrollTop() : void 0;
  };

  setScrollTop = function(editor, value) {
    var ref, view;
    view = atom.views.getView(editor);
    return view != null ? (ref = view.component) != null ? ref.setScrollTop(value) : void 0 : void 0;
  };

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, j, len, posArray;
    cursors = editor.getCursors();
    posArray = [];
    for (j = 0, len = cursors.length; j < len; j++) {
      cursor = cursors[j];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, j, len;
    for (i = j = 0, len = posArray.length; j < len; i = ++j) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (atom.config.get("atom-beautify.general.showLoadingView")) {
      if (LoadingView == null) {
        LoadingView = require("./views/loading-view");
      }
      if (loadingView == null) {
        loadingView = new LoadingView();
      }
      return loadingView.show();
    }
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, ref, stack;
    if (!atom.config.get("atom-beautify.general.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (ref = atom.notifications) != null ? ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(arg) {
    var editor, language, onSave;
    editor = arg.editor, onSave = arg.onSave, language = arg.language;
    return new Promise(function(resolve, reject) {
      var allOptions, beautifyCompleted, e, editedFilePath, forceEntireFile, grammarName, isSelection, oldText, text;
      plugin.checkUnsupportedOptions();
      if (path == null) {
        path = require("path");
      }
      forceEntireFile = onSave && atom.config.get("atom-beautify.general.beautifyEntireFileOnSave");
      beautifyCompleted = function(text) {
        var error, origScrollTop, posArray, selectedBufferRange;
        if (text == null) {
          return resolve(text);
        } else if (text instanceof Error) {
          showError(text);
          return resolve(text);
        } else if (typeof text === "string") {
          if (oldText !== text) {
            posArray = getCursors(editor);
            origScrollTop = getScrollTop(editor);
            if (!forceEntireFile && isSelection) {
              selectedBufferRange = editor.getSelectedBufferRange();
              editor.setTextInBufferRange(selectedBufferRange, text);
            } else {
              editor.getBuffer().setTextViaDiff(text);
            }
            setCursors(editor, posArray);
            setTimeout((function() {
              setScrollTop(editor, origScrollTop);
              return resolve(text);
            }), 0);
          } else {
            return setTimeout(function() {
              return resolve(text);
            }, 0);
          }
        } else {
          error = new Error("Unsupported beautification result '" + text + "'.");
          showError(error);
          return resolve(text);
        }
      };
      editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
      }
      isSelection = !!editor.getSelectedText();
      editedFilePath = editor.getPath();
      allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
      text = void 0;
      if (!forceEntireFile && isSelection) {
        text = editor.getSelectedText();
      } else {
        text = editor.getText();
      }
      oldText = text;
      grammarName = editor.getGrammar().name;
      try {
        beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
          onSave: onSave,
          language: language
        }).then(beautifyCompleted)["catch"](beautifyCompleted);
      } catch (error1) {
        e = error1;
        showError(e);
      }
    });
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    logger.verbose('beautifyFilePath', filePath);
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      logger.verbose('Cleanup beautifyFilePath', err, result);
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    logger.verbose('readFile', filePath);
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      logger.verbose('readFile completed', err, filePath);
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      logger.verbose('beautifyFilePath allOptions', allOptions);
      completionFun = function(output) {
        logger.verbose('beautifyFilePath completionFun', output);
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output.trim() === '') {
            logger.verbose('beautifyFilePath, output was empty string!');
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        logger.verbose('beautify', input, allOptions, grammarName, filePath);
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (error1) {
        e = error1;
        return cb(e);
      }
    });
  };

  beautifyFile = function(arg) {
    var filePath, target;
    target = arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(arg) {
    var $el, dirPath, target;
    target = arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, detail, editor, error, filePath, grammarName, headers, language, linkifyTitle, open, ref, ref1, selectedBeautifier, stack, text, tocEl;
    try {
      open = require("open");
      if (fs == null) {
        fs = require("fs");
      }
      plugin.checkUnsupportedOptions();
      editor = atom.workspace.getActiveTextEditor();
      linkifyTitle = function(title) {
        var p, sep;
        title = title.toLowerCase();
        p = title.split(/[\s,+#;,\/?:@&=+$]+/);
        sep = "-";
        return p.join(sep);
      };
      if (editor == null) {
        return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
      }
      if (!confirm('Are you ready to debug Atom Beautify?')) {
        return;
      }
      debugInfo = "";
      headers = [];
      tocEl = "<TABLEOFCONTENTS/>";
      addInfo = function(key, val) {
        if (key != null) {
          return debugInfo += "**" + key + "**: " + val + "\n\n";
        } else {
          return debugInfo += val + "\n\n";
        }
      };
      addHeader = function(level, title) {
        debugInfo += (Array(level + 1).join('#')) + " " + title + "\n\n";
        return headers.push({
          level: level,
          title: title
        });
      };
      addHeader(1, "Atom Beautify - Debugging information");
      debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
      addInfo('Platform', process.platform);
      addHeader(2, "Versions");
      addInfo('Atom Version', atom.appVersion);
      addInfo('Atom Beautify Version', pkg.version);
      addHeader(2, "Original file to be beautified");
      filePath = editor.getPath();
      addInfo('Original File Path', "`" + filePath + "`");
      grammarName = editor.getGrammar().name;
      addInfo('Original File Grammar', grammarName);
      language = beautifier.getLanguage(grammarName, filePath);
      addInfo('Original File Language', language != null ? language.name : void 0);
      addInfo('Language namespace', language != null ? language.namespace : void 0);
      beautifiers = beautifier.getBeautifiers(language.name);
      addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
      selectedBeautifier = beautifier.getBeautifierForLanguage(language);
      addInfo('Selected Beautifier', selectedBeautifier.name);
      text = editor.getText() || "";
      codeBlockSyntax = ((ref = language != null ? language.name : void 0) != null ? ref : grammarName).toLowerCase().split(' ')[0];
      addHeader(3, 'Original File Contents');
      addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
      addHeader(3, 'Package Settings');
      addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
      addHeader(2, "Beautification options");
      allOptions = beautifier.getOptionsForPath(filePath, editor);
      return Promise.all(allOptions).then(function(allOptions) {
        var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
        editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
        projectOptions = allOptions.slice(4);
        preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
        if (selectedBeautifier) {
          finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
        }
        addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
        addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
        addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
        addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
        addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
        addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
        if (selectedBeautifier) {
          addHeader(3, 'Final Options');
          addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
        }
        logs = "";
        logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
        subscription = logger.onLogging(function(msg) {
          var sep;
          sep = path.sep;
          return logs += msg.replace(logFilePathRegex, function(a, b) {
            var i, p, s;
            s = b.split(sep);
            i = s.indexOf('atom-beautify');
            p = s.slice(i + 2).join(sep);
            return ': [' + p + ']';
          });
        });
        cb = function(result) {
          var JsDiff, bullet, diff, header, indent, indentNum, j, len, toc;
          subscription.dispose();
          addHeader(2, "Results");
          addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
          JsDiff = require('diff');
          if (typeof result === "string") {
            diff = JsDiff.createPatch(filePath || "", text || "", result || "", "original", "beautified");
            addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
          }
          addHeader(3, "Logs");
          addInfo(null, "```\n" + logs + "\n```");
          toc = "## Table Of Contents\n";
          for (j = 0, len = headers.length; j < len; j++) {
            header = headers[j];

            /*
            - Heading 1
              - Heading 1.1
             */
            indent = "  ";
            bullet = "-";
            indentNum = header.level - 2;
            if (indentNum >= 0) {
              toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
            }
          }
          debugInfo = debugInfo.replace(tocEl, toc);
          return atom.workspace.open().then(function(editor) {
            editor.setText(debugInfo);
            return confirm("Please login to GitHub and create a Gist named \"debug.md\" (Markdown file) with your debugging information.\nThen add a link to your Gist in your GitHub Issue.\nThank you!\n\nGist: https://gist.github.com/\nGitHub Issues: https://github.com/Glavin001/atom-beautify/issues");
          })["catch"](function(error) {
            return confirm("An error occurred when creating the Gist: " + error.message);
          });
        };
        try {
          return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
        } catch (error1) {
          e = error1;
          return cb(e);
        }
      })["catch"](function(error) {
        var detail, ref1, stack;
        stack = error.stack;
        detail = error.description || error.message;
        return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
          stack: stack,
          detail: detail,
          dismissable: true
        }) : void 0 : void 0;
      });
    } catch (error1) {
      error = error1;
      stack = error.stack;
      detail = error.description || error.message;
      return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0 : void 0;
    }
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var beautifyOnSaveHandler, disposable;
      beautifyOnSaveHandler = function(arg) {
        var beautifyOnSave, fileExtension, filePath, grammar, key, language, languages;
        filePath = arg.path;
        if (path == null) {
          path = require('path');
        }
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        if (editor.getPath() === void 0) {
          editor.getBuffer().setPath(filePath);
        }
        grammar = editor.getGrammar().name;
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify." + language.namespace + ".beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          logger.verbose('Beautifying file', filePath);
          return beautify({
            editor: editor,
            onSave: true
          }).then(function() {
            return logger.verbose('Done beautifying file', filePath);
          })["catch"](function(error) {
            return showError(error);
          });
        }
      };
      disposable = editor.getBuffer().onWillSave(function(arg) {
        var filePath;
        filePath = arg.path;
        return beautifyOnSaveHandler({
          path: filePath
        });
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  openSettings = function() {
    return atom.workspace.open('atom://config/packages/atom-beautify');
  };

  getUnsupportedOptions = function() {
    var schema, settings, unsupportedOptions;
    settings = atom.config.get('atom-beautify');
    schema = atom.config.getSchema('atom-beautify');
    unsupportedOptions = _.filter(_.keys(settings), function(key) {
      return schema.properties[key] === void 0;
    });
    return unsupportedOptions;
  };

  plugin.checkUnsupportedOptions = function() {
    var unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    if (unsupportedOptions.length !== 0) {
      return atom.notifications.addWarning("Please run Atom command 'Atom-Beautify: Migrate Settings'.", {
        detail: "You can open the Atom command palette with `cmd-shift-p` (OSX) or `ctrl-shift-p` (Linux/Windows) in Atom. You have unsupported options: " + (unsupportedOptions.join(', ')),
        dismissable: true
      });
    }
  };

  plugin.migrateSettings = function() {
    var namespaces, rename, rex, unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    namespaces = beautifier.languages.namespaces;
    if (unsupportedOptions.length === 0) {
      return atom.notifications.addSuccess("No options to migrate.");
    } else {
      rex = new RegExp("(" + (namespaces.join('|')) + ")_(.*)");
      rename = _.toPairs(_.zipObject(unsupportedOptions, _.map(unsupportedOptions, function(key) {
        var m;
        m = key.match(rex);
        if (m === null) {
          return "general." + key;
        } else {
          return m[1] + "." + m[2];
        }
      })));
      _.each(rename, function(arg) {
        var key, newKey, val;
        key = arg[0], newKey = arg[1];
        val = atom.config.get("atom-beautify." + key);
        atom.config.set("atom-beautify." + newKey, val);
        return atom.config.set("atom-beautify." + key, void 0);
      });
      return atom.notifications.addSuccess("Successfully migrated options: " + (unsupportedOptions.join(', ')));
    }
  };

  plugin.addLanguageCommands = function() {
    var j, language, languages, len, results;
    languages = beautifier.languages.languages;
    logger.verbose("languages", languages);
    results = [];
    for (j = 0, len = languages.length; j < len; j++) {
      language = languages[j];
      results.push(((function(_this) {
        return function(language) {
          return _this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-language-" + (language.name.toLowerCase()), function() {
            logger.verbose("Beautifying language", language);
            return beautify({
              language: language
            });
          }));
        };
      })(this))(language));
    }
    return results;
  };

  plugin.config = _.merge(require('./config'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:open-settings", openSettings));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
    return this.addLanguageCommands();
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBOztFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUjs7RUFHTixNQUFBLEdBQVMsTUFBTSxDQUFDOztFQUNmLHNCQUF1QixPQUFBLENBQVEsV0FBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7RUFDZCxVQUFBLEdBQWEsSUFBSSxXQUFKLENBQUE7O0VBQ2Isc0JBQUEsR0FBeUIsVUFBVSxDQUFDOztFQUNwQyxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBQSxDQUFvQixVQUFwQjs7RUFDVCxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBR1YsRUFBQSxHQUFLOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVE7O0VBQ1IsSUFBQSxHQUFPOztFQUNQLEtBQUEsR0FBUTs7RUFDUixHQUFBLEdBQU07O0VBQ04sV0FBQSxHQUFjOztFQUNkLFdBQUEsR0FBYzs7RUFDZCxDQUFBLEdBQUk7O0VBTUosWUFBQSxHQUFlLFNBQUMsTUFBRDtBQUNiLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5COzBCQUNQLElBQUksQ0FBRSxZQUFOLENBQUE7RUFGYTs7RUFHZixZQUFBLEdBQWUsU0FBQyxNQUFELEVBQVMsS0FBVDtBQUNiLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5COzhEQUNRLENBQUUsWUFBakIsQ0FBOEIsS0FBOUI7RUFGYTs7RUFJZixVQUFBLEdBQWEsU0FBQyxNQUFEO0FBQ1gsUUFBQTtJQUFBLE9BQUEs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QUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsNkJBQXBDLEVBQW1FLFlBQW5FLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQix3QkFBbEIsRUFBNEMsNkJBQTVDLEVBQTJFLFlBQTNFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw2QkFBbEIsRUFBaUQsa0NBQWpELEVBQXFGLGlCQUFyRixDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGdDQUFwQyxFQUFzRSxNQUFNLENBQUMsZUFBN0UsQ0FBbkI7V0FDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtFQVRnQjs7RUFXbEIsTUFBTSxDQUFDLFVBQVAsR0FBb0IsU0FBQTtXQUNsQixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtFQURrQjtBQTdtQnBCIiwic291cmNlc0NvbnRlbnQiOlsiIyBnbG9iYWwgYXRvbVxuXCJ1c2Ugc3RyaWN0XCJcbnBrZyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UnKVxuXG4jIERlcGVuZGVuY2llc1xucGx1Z2luID0gbW9kdWxlLmV4cG9ydHNcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbl8gPSByZXF1aXJlKFwibG9kYXNoXCIpXG5CZWF1dGlmaWVycyA9IHJlcXVpcmUoXCIuL2JlYXV0aWZpZXJzXCIpXG5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbmRlZmF1bHRMYW5ndWFnZU9wdGlvbnMgPSBiZWF1dGlmaWVyLm9wdGlvbnNcbmxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJykoX19maWxlbmFtZSlcblByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5cbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5mcyA9IG51bGxcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuc3RyaXAgPSBudWxsXG55YW1sID0gbnVsbFxuYXN5bmMgPSBudWxsXG5kaXIgPSBudWxsICMgTm9kZS1EaXJcbkxvYWRpbmdWaWV3ID0gbnVsbFxubG9hZGluZ1ZpZXcgPSBudWxsXG4kID0gbnVsbFxuXG4jIGZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhkYXRhLCB0eXBlcykge1xuIyBub3B0LmNsZWFuKGRhdGEsIHR5cGVzKTtcbiMgcmV0dXJuIGRhdGE7XG4jIH1cbmdldFNjcm9sbFRvcCA9IChlZGl0b3IpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5nZXRTY3JvbGxUb3AoKVxuc2V0U2Nyb2xsVG9wID0gKGVkaXRvciwgdmFsdWUpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5jb21wb25lbnQ/LnNldFNjcm9sbFRvcCB2YWx1ZVxuXG5nZXRDdXJzb3JzID0gKGVkaXRvcikgLT5cbiAgY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JzKClcbiAgcG9zQXJyYXkgPSBbXVxuICBmb3IgY3Vyc29yIGluIGN1cnNvcnNcbiAgICBidWZmZXJQb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcG9zQXJyYXkucHVzaCBbXG4gICAgICBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgIF1cbiAgcG9zQXJyYXlcbnNldEN1cnNvcnMgPSAoZWRpdG9yLCBwb3NBcnJheSkgLT5cblxuICAjIGNvbnNvbGUubG9nIFwic2V0Q3Vyc29yczpcbiAgZm9yIGJ1ZmZlclBvc2l0aW9uLCBpIGluIHBvc0FycmF5XG4gICAgaWYgaSBpcyAwXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gYnVmZmVyUG9zaXRpb25cbiAgICAgIGNvbnRpbnVlXG4gICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gYnVmZmVyUG9zaXRpb25cbiAgcmV0dXJuXG5cbiMgU2hvdyBiZWF1dGlmaWNhdGlvbiBwcm9ncmVzcy9sb2FkaW5nIHZpZXdcbmJlYXV0aWZpZXIub24oJ2JlYXV0aWZ5OjpzdGFydCcsIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuZ2VuZXJhbC5zaG93TG9hZGluZ1ZpZXdcIilcbiAgICBMb2FkaW5nVmlldyA/PSByZXF1aXJlIFwiLi92aWV3cy9sb2FkaW5nLXZpZXdcIlxuICAgIGxvYWRpbmdWaWV3ID89IG5ldyBMb2FkaW5nVmlldygpXG4gICAgbG9hZGluZ1ZpZXcuc2hvdygpXG4pXG5iZWF1dGlmaWVyLm9uKCdiZWF1dGlmeTo6ZW5kJywgLT5cbiAgbG9hZGluZ1ZpZXc/LmhpZGUoKVxuKVxuIyBTaG93IGVycm9yXG5zaG93RXJyb3IgPSAoZXJyb3IpIC0+XG4gIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LmdlbmVyYWwubXV0ZUFsbEVycm9yc1wiKVxuICAgICMgY29uc29sZS5sb2coZSlcbiAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgIGF0b20ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoZXJyb3IubWVzc2FnZSwge1xuICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlfSlcblxuYmVhdXRpZnkgPSAoeyBlZGl0b3IsIG9uU2F2ZSwgbGFuZ3VhZ2UgfSkgLT5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG5cbiAgICBwbHVnaW4uY2hlY2tVbnN1cHBvcnRlZE9wdGlvbnMoKVxuXG4gICAgIyBDb250aW51ZSBiZWF1dGlmeWluZ1xuICAgIHBhdGggPz0gcmVxdWlyZShcInBhdGhcIilcbiAgICBmb3JjZUVudGlyZUZpbGUgPSBvblNhdmUgYW5kIGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuZ2VuZXJhbC5iZWF1dGlmeUVudGlyZUZpbGVPblNhdmVcIilcblxuICAgICMgR2V0IHRoZSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICAgICMgQWxsIG9mIHRoZSBvcHRpb25zXG4gICAgIyBMaXN0ZWQgaW4gb3JkZXIgZnJvbSBkZWZhdWx0IChiYXNlKSB0byB0aGUgb25lIHdpdGggdGhlIGhpZ2hlc3QgcHJpb3JpdHlcbiAgICAjIExlZnQgPSBEZWZhdWx0LCBSaWdodCA9IFdpbGwgb3ZlcnJpZGUgdGhlIGxlZnQuXG4gICAgIyBBdG9tIEVkaXRvclxuICAgICNcbiAgICAjIFVzZXIncyBIb21lIHBhdGhcbiAgICAjIFByb2plY3QgcGF0aFxuICAgICMgQXN5bmNocm9ub3VzbHkgYW5kIGNhbGxiYWNrLXN0eWxlXG4gICAgYmVhdXRpZnlDb21wbGV0ZWQgPSAodGV4dCkgLT5cblxuICAgICAgaWYgbm90IHRleHQ/XG4gICAgICAgICMgRG8gbm90aGluZywgaXMgdW5kZWZpbmVkXG4gICAgICAgICMgY29uc29sZS5sb2cgJ2JlYXV0aWZ5Q29tcGxldGVkJ1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSh0ZXh0KVxuICAgICAgZWxzZSBpZiB0ZXh0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgc2hvd0Vycm9yKHRleHQpXG4gICAgICAgIHJldHVybiByZXNvbHZlKHRleHQpXG4gICAgICBlbHNlIGlmIHR5cGVvZiB0ZXh0IGlzIFwic3RyaW5nXCJcbiAgICAgICAgaWYgb2xkVGV4dCBpc250IHRleHRcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJSZXBsYWNpbmcgY3VycmVudCBlZGl0b3IncyB0ZXh0IHdpdGggbmV3IHRleHRcIlxuICAgICAgICAgIHBvc0FycmF5ID0gZ2V0Q3Vyc29ycyhlZGl0b3IpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwicG9zQXJyYXk6XG4gICAgICAgICAgb3JpZ1Njcm9sbFRvcCA9IGdldFNjcm9sbFRvcChlZGl0b3IpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwib3JpZ1Njcm9sbFRvcDpcbiAgICAgICAgICBpZiBub3QgZm9yY2VFbnRpcmVGaWxlIGFuZCBpc1NlbGVjdGlvblxuICAgICAgICAgICAgc2VsZWN0ZWRCdWZmZXJSYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNlbGVjdGVkQnVmZmVyUmFuZ2U6XG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2Ugc2VsZWN0ZWRCdWZmZXJSYW5nZSwgdGV4dFxuICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldFRleHRcIlxuICAgICAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHRWaWFEaWZmKHRleHQpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2V0Q3Vyc29yc1wiXG4gICAgICAgICAgc2V0Q3Vyc29ycyBlZGl0b3IsIHBvc0FycmF5XG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiRG9uZSBzZXRDdXJzb3JzXCJcbiAgICAgICAgICAjIExldCB0aGUgc2Nyb2xsVG9wIHNldHRpbmcgcnVuIGFmdGVyIGFsbCB0aGUgc2F2ZSByZWxhdGVkIHN0dWZmIGlzIHJ1bixcbiAgICAgICAgICAjIG90aGVyd2lzZSBzZXRTY3JvbGxUb3AgaXMgbm90IHdvcmtpbmcsIHByb2JhYmx5IGJlY2F1c2UgdGhlIGN1cnNvclxuICAgICAgICAgICMgYWRkaXRpb24gaGFwcGVucyBhc3luY2hyb25vdXNseVxuICAgICAgICAgIHNldFRpbWVvdXQgKCAtPlxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldFNjcm9sbFRvcFwiXG4gICAgICAgICAgICBzZXRTY3JvbGxUb3AgZWRpdG9yLCBvcmlnU2Nyb2xsVG9wXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0ZXh0KVxuICAgICAgICAgICksIDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpIC0+XG4gICAgICAgICAgICByZXNvbHZlKHRleHQpXG4gICAgICAgICAgLCAwKVxuICAgICAgZWxzZVxuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGJlYXV0aWZpY2F0aW9uIHJlc3VsdCAnI3t0ZXh0fScuXCIpXG4gICAgICAgIHNob3dFcnJvcihlcnJvcilcbiAgICAgICAgcmV0dXJuIHJlc29sdmUodGV4dClcblxuICAgICAgIyBlbHNlXG4gICAgICAjIGNvbnNvbGUubG9nIFwiQWxyZWFkeSBCZWF1dGlmdWwhXCJcbiAgICAgIHJldHVyblxuXG4gICAgIyBjb25zb2xlLmxvZyAnQmVhdXRpZnkgdGltZSEnXG4gICAgI1xuICAgICMgR2V0IGN1cnJlbnQgZWRpdG9yXG4gICAgZWRpdG9yID0gZWRpdG9yID8gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cblxuICAgICMgQ2hlY2sgaWYgdGhlcmUgaXMgYW4gYWN0aXZlIGVkaXRvclxuICAgIGlmIG5vdCBlZGl0b3I/XG4gICAgICByZXR1cm4gc2hvd0Vycm9yKCBuZXcgRXJyb3IoXCJBY3RpdmUgRWRpdG9yIG5vdCBmb3VuZC4gXCJcbiAgICAgICAgXCJQbGVhc2Ugc2VsZWN0IGEgVGV4dCBFZGl0b3IgZmlyc3QgdG8gYmVhdXRpZnkuXCIpKVxuICAgIGlzU2VsZWN0aW9uID0gISFlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcblxuXG4gICAgIyBHZXQgZWRpdG9yIHBhdGggYW5kIGNvbmZpZ3VyYXRpb25zIGZvciBwYXRoc1xuICAgIGVkaXRlZEZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuXG5cbiAgICAjIEdldCBhbGwgb3B0aW9uc1xuICAgIGFsbE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoKGVkaXRlZEZpbGVQYXRoLCBlZGl0b3IpXG5cblxuICAgICMgR2V0IGN1cnJlbnQgZWRpdG9yJ3MgdGV4dFxuICAgIHRleHQgPSB1bmRlZmluZWRcbiAgICBpZiBub3QgZm9yY2VFbnRpcmVGaWxlIGFuZCBpc1NlbGVjdGlvblxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgb2xkVGV4dCA9IHRleHRcblxuXG4gICAgIyBHZXQgR3JhbW1hclxuICAgIGdyYW1tYXJOYW1lID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG5cblxuICAgICMgRmluYWxseSwgYmVhdXRpZnkhXG4gICAgdHJ5XG4gICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KHRleHQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBlZGl0ZWRGaWxlUGF0aCwgb25TYXZlOiBvblNhdmUsIGxhbmd1YWdlOiBsYW5ndWFnZSlcbiAgICAgIC50aGVuKGJlYXV0aWZ5Q29tcGxldGVkKVxuICAgICAgLmNhdGNoKGJlYXV0aWZ5Q29tcGxldGVkKVxuICAgIGNhdGNoIGVcbiAgICAgIHNob3dFcnJvcihlKVxuICAgIHJldHVyblxuICApXG5cbmJlYXV0aWZ5RmlsZVBhdGggPSAoZmlsZVBhdGgsIGNhbGxiYWNrKSAtPlxuICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCcsIGZpbGVQYXRoKVxuXG4gICMgU2hvdyBpbiBwcm9ncmVzcyBpbmRpY2F0ZSBvbiBmaWxlJ3MgdHJlZS12aWV3IGVudHJ5XG4gICQgPz0gcmVxdWlyZShcImF0b20tc3BhY2UtcGVuLXZpZXdzXCIpLiRcbiAgJGVsID0gJChcIi5pY29uLWZpbGUtdGV4dFtkYXRhLXBhdGg9XFxcIiN7ZmlsZVBhdGh9XFxcIl1cIilcbiAgJGVsLmFkZENsYXNzKCdiZWF1dGlmeWluZycpXG5cbiAgIyBDbGVhbnVwIGFuZCByZXR1cm4gY2FsbGJhY2sgZnVuY3Rpb25cbiAgY2IgPSAoZXJyLCByZXN1bHQpIC0+XG4gICAgbG9nZ2VyLnZlcmJvc2UoJ0NsZWFudXAgYmVhdXRpZnlGaWxlUGF0aCcsIGVyciwgcmVzdWx0KVxuICAgICRlbCA9ICQoXCIuaWNvbi1maWxlLXRleHRbZGF0YS1wYXRoPVxcXCIje2ZpbGVQYXRofVxcXCJdXCIpXG4gICAgJGVsLnJlbW92ZUNsYXNzKCdiZWF1dGlmeWluZycpXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgcmVzdWx0KVxuXG4gICMgR2V0IGNvbnRlbnRzIG9mIGZpbGVcbiAgZnMgPz0gcmVxdWlyZSBcImZzXCJcbiAgbG9nZ2VyLnZlcmJvc2UoJ3JlYWRGaWxlJywgZmlsZVBhdGgpXG4gIGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAoZXJyLCBkYXRhKSAtPlxuICAgIGxvZ2dlci52ZXJib3NlKCdyZWFkRmlsZSBjb21wbGV0ZWQnLCBlcnIsIGZpbGVQYXRoKVxuICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgIGlucHV0ID0gZGF0YT8udG9TdHJpbmcoKVxuICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLnNlbGVjdEdyYW1tYXIoZmlsZVBhdGgsIGlucHV0KVxuICAgIGdyYW1tYXJOYW1lID0gZ3JhbW1hci5uYW1lXG5cbiAgICAjIEdldCB0aGUgb3B0aW9uc1xuICAgIGFsbE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoKGZpbGVQYXRoKVxuICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoIGFsbE9wdGlvbnMnLCBhbGxPcHRpb25zKVxuXG4gICAgIyBCZWF1dGlmeSBGaWxlXG4gICAgY29tcGxldGlvbkZ1biA9IChvdXRwdXQpIC0+XG4gICAgICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCBjb21wbGV0aW9uRnVuJywgb3V0cHV0KVxuICAgICAgaWYgb3V0cHV0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgcmV0dXJuIGNiKG91dHB1dCwgbnVsbCApICMgb3V0cHV0ID09IEVycm9yXG4gICAgICBlbHNlIGlmIHR5cGVvZiBvdXRwdXQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAjIGRvIG5vdCBhbGxvdyBlbXB0eSBzdHJpbmdcbiAgICAgICAgaWYgb3V0cHV0LnRyaW0oKSBpcyAnJ1xuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoLCBvdXRwdXQgd2FzIGVtcHR5IHN0cmluZyEnKVxuICAgICAgICAgIHJldHVybiBjYihudWxsLCBvdXRwdXQpXG4gICAgICAgICMgc2F2ZSB0byBmaWxlXG4gICAgICAgIGZzLndyaXRlRmlsZShmaWxlUGF0aCwgb3V0cHV0LCAoZXJyKSAtPlxuICAgICAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgICAgIHJldHVybiBjYiggbnVsbCAsIG91dHB1dClcbiAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gY2IoIG5ldyBFcnJvcihcIlVua25vd24gYmVhdXRpZmljYXRpb24gcmVzdWx0ICN7b3V0cHV0fS5cIiksIG91dHB1dClcbiAgICB0cnlcbiAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeScsIGlucHV0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KGlucHV0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICAudGhlbihjb21wbGV0aW9uRnVuKVxuICAgICAgLmNhdGNoKGNvbXBsZXRpb25GdW4pXG4gICAgY2F0Y2ggZVxuICAgICAgcmV0dXJuIGNiKGUpXG4gICAgKVxuXG5iZWF1dGlmeUZpbGUgPSAoe3RhcmdldH0pIC0+XG4gIGZpbGVQYXRoID0gdGFyZ2V0LmRhdGFzZXQucGF0aFxuICByZXR1cm4gdW5sZXNzIGZpbGVQYXRoXG4gIGJlYXV0aWZ5RmlsZVBhdGgoZmlsZVBhdGgsIChlcnIsIHJlc3VsdCkgLT5cbiAgICByZXR1cm4gc2hvd0Vycm9yKGVycikgaWYgZXJyXG4gICAgIyBjb25zb2xlLmxvZyhcIkJlYXV0aWZ5IEZpbGVcbiAgKVxuICByZXR1cm5cblxuYmVhdXRpZnlEaXJlY3RvcnkgPSAoe3RhcmdldH0pIC0+XG4gIGRpclBhdGggPSB0YXJnZXQuZGF0YXNldC5wYXRoXG4gIHJldHVybiB1bmxlc3MgZGlyUGF0aFxuXG4gIHJldHVybiBpZiBhdG9tPy5jb25maXJtKFxuICAgIG1lc3NhZ2U6IFwiVGhpcyB3aWxsIGJlYXV0aWZ5IGFsbCBvZiB0aGUgZmlsZXMgZm91bmQgXFxcbiAgICAgICAgcmVjdXJzaXZlbHkgaW4gdGhpcyBkaXJlY3RvcnksICcje2RpclBhdGh9Jy4gXFxcbiAgICAgICAgRG8geW91IHdhbnQgdG8gY29udGludWU/XCIsXG4gICAgYnV0dG9uczogWydZZXMsIGNvbnRpbnVlIScsJ05vLCBjYW5jZWwhJ10pIGlzbnQgMFxuXG4gICMgU2hvdyBpbiBwcm9ncmVzcyBpbmRpY2F0ZSBvbiBkaXJlY3RvcnkncyB0cmVlLXZpZXcgZW50cnlcbiAgJCA/PSByZXF1aXJlKFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIikuJFxuICAkZWwgPSAkKFwiLmljb24tZmlsZS1kaXJlY3RvcnlbZGF0YS1wYXRoPVxcXCIje2RpclBhdGh9XFxcIl1cIilcbiAgJGVsLmFkZENsYXNzKCdiZWF1dGlmeWluZycpXG5cbiAgIyBQcm9jZXNzIERpcmVjdG9yeVxuICBkaXIgPz0gcmVxdWlyZSBcIm5vZGUtZGlyXCJcbiAgYXN5bmMgPz0gcmVxdWlyZSBcImFzeW5jXCJcbiAgZGlyLmZpbGVzKGRpclBhdGgsIChlcnIsIGZpbGVzKSAtPlxuICAgIHJldHVybiBzaG93RXJyb3IoZXJyKSBpZiBlcnJcblxuICAgIGFzeW5jLmVhY2goZmlsZXMsIChmaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gICAgICAjIElnbm9yZSBlcnJvcnNcbiAgICAgIGJlYXV0aWZ5RmlsZVBhdGgoZmlsZVBhdGgsIC0+IGNhbGxiYWNrKCkpXG4gICAgLCAoZXJyKSAtPlxuICAgICAgJGVsID0gJChcIi5pY29uLWZpbGUtZGlyZWN0b3J5W2RhdGEtcGF0aD1cXFwiI3tkaXJQYXRofVxcXCJdXCIpXG4gICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcbiAgICAgICMgY29uc29sZS5sb2coJ0NvbXBsZXRlZCBiZWF1dGlmeWluZyBkaXJlY3RvcnkhJywgZGlyUGF0aClcbiAgICApXG4gIClcbiAgcmV0dXJuXG5cbmRlYnVnID0gKCkgLT5cbiAgdHJ5XG4gICAgb3BlbiA9IHJlcXVpcmUoXCJvcGVuXCIpXG4gICAgZnMgPz0gcmVxdWlyZSBcImZzXCJcblxuICAgIHBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucygpXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgbGlua2lmeVRpdGxlID0gKHRpdGxlKSAtPlxuICAgICAgdGl0bGUgPSB0aXRsZS50b0xvd2VyQ2FzZSgpXG4gICAgICBwID0gdGl0bGUuc3BsaXQoL1tcXHMsKyM7LFxcLz86QCY9KyRdKy8pICMgc3BsaXQgaW50byBwYXJ0c1xuICAgICAgc2VwID0gXCItXCJcbiAgICAgIHAuam9pbihzZXApXG5cbiAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlZGl0b3JcbiAgICBpZiBub3QgZWRpdG9yP1xuICAgICAgcmV0dXJuIGNvbmZpcm0oXCJBY3RpdmUgRWRpdG9yIG5vdCBmb3VuZC5cXG5cIiArXG4gICAgICBcIlBsZWFzZSBzZWxlY3QgYSBUZXh0IEVkaXRvciBmaXJzdCB0byBiZWF1dGlmeS5cIilcbiAgICByZXR1cm4gdW5sZXNzIGNvbmZpcm0oJ0FyZSB5b3UgcmVhZHkgdG8gZGVidWcgQXRvbSBCZWF1dGlmeT8nKVxuICAgIGRlYnVnSW5mbyA9IFwiXCJcbiAgICBoZWFkZXJzID0gW11cbiAgICB0b2NFbCA9IFwiPFRBQkxFT0ZDT05URU5UUy8+XCJcbiAgICBhZGRJbmZvID0gKGtleSwgdmFsKSAtPlxuICAgICAgaWYga2V5P1xuICAgICAgICBkZWJ1Z0luZm8gKz0gXCIqKiN7a2V5fSoqOiAje3ZhbH1cXG5cXG5cIlxuICAgICAgZWxzZVxuICAgICAgICBkZWJ1Z0luZm8gKz0gXCIje3ZhbH1cXG5cXG5cIlxuICAgIGFkZEhlYWRlciA9IChsZXZlbCwgdGl0bGUpIC0+XG4gICAgICBkZWJ1Z0luZm8gKz0gXCIje0FycmF5KGxldmVsKzEpLmpvaW4oJyMnKX0gI3t0aXRsZX1cXG5cXG5cIlxuICAgICAgaGVhZGVycy5wdXNoKHtcbiAgICAgICAgbGV2ZWwsIHRpdGxlXG4gICAgICAgIH0pXG4gICAgYWRkSGVhZGVyKDEsIFwiQXRvbSBCZWF1dGlmeSAtIERlYnVnZ2luZyBpbmZvcm1hdGlvblwiKVxuICAgIGRlYnVnSW5mbyArPSBcIlRoZSBmb2xsb3dpbmcgZGVidWdnaW5nIGluZm9ybWF0aW9uIHdhcyBcIiArXG4gICAgXCJnZW5lcmF0ZWQgYnkgYEF0b20gQmVhdXRpZnlgIG9uIGAje25ldyBEYXRlKCl9YC5cIiArXG4gICAgXCJcXG5cXG4tLS1cXG5cXG5cIiArXG4gICAgdG9jRWwgK1xuICAgIFwiXFxuXFxuLS0tXFxuXFxuXCJcblxuICAgICMgUGxhdGZvcm1cbiAgICBhZGRJbmZvKCdQbGF0Zm9ybScsIHByb2Nlc3MucGxhdGZvcm0pXG4gICAgYWRkSGVhZGVyKDIsIFwiVmVyc2lvbnNcIilcblxuXG4gICAgIyBBdG9tIFZlcnNpb25cbiAgICBhZGRJbmZvKCdBdG9tIFZlcnNpb24nLCBhdG9tLmFwcFZlcnNpb24pXG5cblxuICAgICMgQXRvbSBCZWF1dGlmeSBWZXJzaW9uXG4gICAgYWRkSW5mbygnQXRvbSBCZWF1dGlmeSBWZXJzaW9uJywgcGtnLnZlcnNpb24pXG4gICAgYWRkSGVhZGVyKDIsIFwiT3JpZ2luYWwgZmlsZSB0byBiZSBiZWF1dGlmaWVkXCIpXG5cblxuICAgICMgT3JpZ2luYWwgZmlsZVxuICAgICNcbiAgICAjIEdldCBlZGl0b3IgcGF0aCBhbmQgY29uZmlndXJhdGlvbnMgZm9yIHBhdGhzXG4gICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICAjIFBhdGhcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIFBhdGgnLCBcImAje2ZpbGVQYXRofWBcIilcblxuICAgICMgR2V0IEdyYW1tYXJcbiAgICBncmFtbWFyTmFtZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuXG4gICAgIyBHcmFtbWFyXG4gICAgYWRkSW5mbygnT3JpZ2luYWwgRmlsZSBHcmFtbWFyJywgZ3JhbW1hck5hbWUpXG5cbiAgICAjIExhbmd1YWdlXG4gICAgbGFuZ3VhZ2UgPSBiZWF1dGlmaWVyLmdldExhbmd1YWdlKGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIExhbmd1YWdlJywgbGFuZ3VhZ2U/Lm5hbWUpXG4gICAgYWRkSW5mbygnTGFuZ3VhZ2UgbmFtZXNwYWNlJywgbGFuZ3VhZ2U/Lm5hbWVzcGFjZSlcblxuICAgICMgQmVhdXRpZmllclxuICAgIGJlYXV0aWZpZXJzID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVycyhsYW5ndWFnZS5uYW1lKVxuICAgIGFkZEluZm8oJ1N1cHBvcnRlZCBCZWF1dGlmaWVycycsIF8ubWFwKGJlYXV0aWZpZXJzLCAnbmFtZScpLmpvaW4oJywgJykpXG4gICAgc2VsZWN0ZWRCZWF1dGlmaWVyID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVyRm9yTGFuZ3VhZ2UobGFuZ3VhZ2UpXG4gICAgYWRkSW5mbygnU2VsZWN0ZWQgQmVhdXRpZmllcicsIHNlbGVjdGVkQmVhdXRpZmllci5uYW1lKVxuXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3IncyB0ZXh0XG4gICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCkgb3IgXCJcIlxuXG4gICAgIyBDb250ZW50c1xuICAgIGNvZGVCbG9ja1N5bnRheCA9IChsYW5ndWFnZT8ubmFtZSA/IGdyYW1tYXJOYW1lKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJylbMF1cbiAgICBhZGRIZWFkZXIoMywgJ09yaWdpbmFsIEZpbGUgQ29udGVudHMnKVxuICAgIGFkZEluZm8obnVsbCwgXCJcXG5gYGAje2NvZGVCbG9ja1N5bnRheH1cXG4je3RleHR9XFxuYGBgXCIpXG5cbiAgICBhZGRIZWFkZXIoMywgJ1BhY2thZ2UgU2V0dGluZ3MnKVxuICAgIGFkZEluZm8obnVsbCxcbiAgICAgIFwiVGhlIHJhdyBwYWNrYWdlIHNldHRpbmdzIG9wdGlvbnNcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuXG4gICAgIyBCZWF1dGlmaWNhdGlvbiBPcHRpb25zXG4gICAgYWRkSGVhZGVyKDIsIFwiQmVhdXRpZmljYXRpb24gb3B0aW9uc1wiKVxuICAgICMgR2V0IGFsbCBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZmlsZVBhdGgsIGVkaXRvcilcbiAgICAjIFJlc29sdmUgb3B0aW9ucyB3aXRoIHByb21pc2VzXG4gICAgUHJvbWlzZS5hbGwoYWxsT3B0aW9ucylcbiAgICAudGhlbigoYWxsT3B0aW9ucykgLT5cbiAgICAgICMgRXh0cmFjdCBvcHRpb25zXG4gICAgICBbXG4gICAgICAgICAgZWRpdG9yT3B0aW9uc1xuICAgICAgICAgIGNvbmZpZ09wdGlvbnNcbiAgICAgICAgICBob21lT3B0aW9uc1xuICAgICAgICAgIGVkaXRvckNvbmZpZ09wdGlvbnNcbiAgICAgIF0gPSBhbGxPcHRpb25zXG4gICAgICBwcm9qZWN0T3B0aW9ucyA9IGFsbE9wdGlvbnNbNC4uXVxuXG4gICAgICBwcmVUcmFuc2Zvcm1lZE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JMYW5ndWFnZShhbGxPcHRpb25zLCBsYW5ndWFnZSlcblxuICAgICAgaWYgc2VsZWN0ZWRCZWF1dGlmaWVyXG4gICAgICAgIGZpbmFsT3B0aW9ucyA9IGJlYXV0aWZpZXIudHJhbnNmb3JtT3B0aW9ucyhzZWxlY3RlZEJlYXV0aWZpZXIsIGxhbmd1YWdlLm5hbWUsIHByZVRyYW5zZm9ybWVkT3B0aW9ucylcblxuICAgICAgIyBTaG93IG9wdGlvbnNcbiAgICAgICMgYWRkSW5mbygnQWxsIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgICMgXCJBbGwgb3B0aW9ucyBleHRyYWN0ZWQgZm9yIGZpbGVcXG5cIiArXG4gICAgICAjIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoYWxsT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0VkaXRvciBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBBdG9tIEVkaXRvciBzZXR0aW5nc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoZWRpdG9yT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0NvbmZpZyBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3NcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGNvbmZpZ09wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdIb21lIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIGAje3BhdGgucmVzb2x2ZShiZWF1dGlmaWVyLmdldFVzZXJIb21lKCksICcuanNiZWF1dGlmeXJjJyl9YFxcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoaG9tZU9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdFZGl0b3JDb25maWcgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gW0VkaXRvckNvbmZpZ10oaHR0cDovL2VkaXRvcmNvbmZpZy5vcmcvKSBmaWxlXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShlZGl0b3JDb25maWdPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnUHJvamVjdCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBgLmpzYmVhdXRpZnlyY2AgZmlsZXMgc3RhcnRpbmcgZnJvbSBkaXJlY3RvcnkgYCN7cGF0aC5kaXJuYW1lKGZpbGVQYXRoKX1gIGFuZCBnb2luZyB1cCB0byByb290XFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShwcm9qZWN0T3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ1ByZS1UcmFuc2Zvcm1lZCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIkNvbWJpbmVkIG9wdGlvbnMgYmVmb3JlIHRyYW5zZm9ybWluZyB0aGVtIGdpdmVuIGEgYmVhdXRpZmllcidzIHNwZWNpZmljYXRpb25zXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShwcmVUcmFuc2Zvcm1lZE9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBpZiBzZWxlY3RlZEJlYXV0aWZpZXJcbiAgICAgICAgYWRkSGVhZGVyKDMsICdGaW5hbCBPcHRpb25zJylcbiAgICAgICAgYWRkSW5mbyhudWxsLFxuICAgICAgICAgIFwiRmluYWwgY29tYmluZWQgYW5kIHRyYW5zZm9ybWVkIG9wdGlvbnMgdGhhdCBhcmUgdXNlZFxcblwiICtcbiAgICAgICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGZpbmFsT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcblxuICAgICAgI1xuICAgICAgbG9ncyA9IFwiXCJcbiAgICAgIGxvZ0ZpbGVQYXRoUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcOiBcXFxcWyguKilcXFxcXScpXG4gICAgICBzdWJzY3JpcHRpb24gPSBsb2dnZXIub25Mb2dnaW5nKChtc2cpIC0+XG4gICAgICAgICMgY29uc29sZS5sb2coJ2xvZ2dpbmcnLCBtc2cpXG4gICAgICAgIHNlcCA9IHBhdGguc2VwXG4gICAgICAgIGxvZ3MgKz0gbXNnLnJlcGxhY2UobG9nRmlsZVBhdGhSZWdleCwgKGEsYikgLT5cbiAgICAgICAgICBzID0gYi5zcGxpdChzZXApXG4gICAgICAgICAgaSA9IHMuaW5kZXhPZignYXRvbS1iZWF1dGlmeScpXG4gICAgICAgICAgcCA9IHMuc2xpY2UoaSsyKS5qb2luKHNlcClcbiAgICAgICAgICAjIGNvbnNvbGUubG9nKCdsb2dnaW5nJywgYXJndW1lbnRzLCBzLCBpLCBwKVxuICAgICAgICAgIHJldHVybiAnOiBbJytwKyddJ1xuICAgICAgICApXG4gICAgICApXG4gICAgICBjYiA9IChyZXN1bHQpIC0+XG4gICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgYWRkSGVhZGVyKDIsIFwiUmVzdWx0c1wiKVxuXG4gICAgICAgICMgTG9nc1xuICAgICAgICBhZGRJbmZvKCdCZWF1dGlmaWVkIEZpbGUgQ29udGVudHMnLCBcIlxcbmBgYCN7Y29kZUJsb2NrU3ludGF4fVxcbiN7cmVzdWx0fVxcbmBgYFwiKVxuICAgICAgICAjIERpZmZcbiAgICAgICAgSnNEaWZmID0gcmVxdWlyZSgnZGlmZicpXG4gICAgICAgIGlmIHR5cGVvZiByZXN1bHQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAgIGRpZmYgPSBKc0RpZmYuY3JlYXRlUGF0Y2goZmlsZVBhdGggb3IgXCJcIiwgdGV4dCBvciBcIlwiLCBcXFxuICAgICAgICAgICAgcmVzdWx0IG9yIFwiXCIsIFwib3JpZ2luYWxcIiwgXCJiZWF1dGlmaWVkXCIpXG4gICAgICAgICAgYWRkSW5mbygnT3JpZ2luYWwgdnMuIEJlYXV0aWZpZWQgRGlmZicsIFwiXFxuYGBgI3tjb2RlQmxvY2tTeW50YXh9XFxuI3tkaWZmfVxcbmBgYFwiKVxuXG4gICAgICAgIGFkZEhlYWRlcigzLCBcIkxvZ3NcIilcbiAgICAgICAgYWRkSW5mbyhudWxsLCBcImBgYFxcbiN7bG9nc31cXG5gYGBcIilcblxuICAgICAgICAjIEJ1aWxkIFRhYmxlIG9mIENvbnRlbnRzXG4gICAgICAgIHRvYyA9IFwiIyMgVGFibGUgT2YgQ29udGVudHNcXG5cIlxuICAgICAgICBmb3IgaGVhZGVyIGluIGhlYWRlcnNcbiAgICAgICAgICAjIyNcbiAgICAgICAgICAtIEhlYWRpbmcgMVxuICAgICAgICAgICAgLSBIZWFkaW5nIDEuMVxuICAgICAgICAgICMjI1xuICAgICAgICAgIGluZGVudCA9IFwiICBcIiAjIDIgc3BhY2VzXG4gICAgICAgICAgYnVsbGV0ID0gXCItXCJcbiAgICAgICAgICBpbmRlbnROdW0gPSBoZWFkZXIubGV2ZWwgLSAyXG4gICAgICAgICAgaWYgaW5kZW50TnVtID49IDBcbiAgICAgICAgICAgIHRvYyArPSAoXCIje0FycmF5KGluZGVudE51bSsxKS5qb2luKGluZGVudCl9I3tidWxsZXR9IFsje2hlYWRlci50aXRsZX1dKFxcIyN7bGlua2lmeVRpdGxlKGhlYWRlci50aXRsZSl9KVxcblwiKVxuICAgICAgICAjIFJlcGxhY2UgVEFCTEVPRkNPTlRFTlRTXG4gICAgICAgIGRlYnVnSW5mbyA9IGRlYnVnSW5mby5yZXBsYWNlKHRvY0VsLCB0b2MpXG5cbiAgICAgICAgIyBTYXZlIHRvIG5ldyBUZXh0RWRpdG9yXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgICAgIC50aGVuKChlZGl0b3IpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChkZWJ1Z0luZm8pXG4gICAgICAgICAgICBjb25maXJtKFwiXCJcIlBsZWFzZSBsb2dpbiB0byBHaXRIdWIgYW5kIGNyZWF0ZSBhIEdpc3QgbmFtZWQgXFxcImRlYnVnLm1kXFxcIiAoTWFya2Rvd24gZmlsZSkgd2l0aCB5b3VyIGRlYnVnZ2luZyBpbmZvcm1hdGlvbi5cbiAgICAgICAgICAgIFRoZW4gYWRkIGEgbGluayB0byB5b3VyIEdpc3QgaW4geW91ciBHaXRIdWIgSXNzdWUuXG4gICAgICAgICAgICBUaGFuayB5b3UhXG5cbiAgICAgICAgICAgIEdpc3Q6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1xuICAgICAgICAgICAgR2l0SHViIElzc3VlczogaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2lzc3Vlc1xuICAgICAgICAgICAgXCJcIlwiKVxuICAgICAgICAgIClcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSAtPlxuICAgICAgICAgICAgY29uZmlybShcIkFuIGVycm9yIG9jY3VycmVkIHdoZW4gY3JlYXRpbmcgdGhlIEdpc3Q6IFwiK2Vycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgKVxuICAgICAgdHJ5XG4gICAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgICAgICAudGhlbihjYilcbiAgICAgICAgLmNhdGNoKGNiKVxuICAgICAgY2F0Y2ggZVxuICAgICAgICByZXR1cm4gY2IoZSlcbiAgICApXG4gICAgLmNhdGNoKChlcnJvcikgLT5cbiAgICAgIHN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICAgIGF0b20/Lm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlXG4gICAgICB9KVxuICAgIClcbiAgY2F0Y2ggZXJyb3JcbiAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgIGF0b20/Lm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgIH0pXG5cbmhhbmRsZVNhdmVFdmVudCA9IC0+XG4gIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgIGJlYXV0aWZ5T25TYXZlSGFuZGxlciA9ICh7cGF0aDogZmlsZVBhdGh9KSAtPlxuICAgICAgcGF0aCA/PSByZXF1aXJlKCdwYXRoJylcbiAgICAgICMgR2V0IGZpbGUgZXh0ZW5zaW9uXG4gICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKVxuICAgICAgIyBSZW1vdmUgcHJlZml4IFwiLlwiIChwZXJpb2QpIGluIGZpbGVFeHRlbnNpb25cbiAgICAgIGZpbGVFeHRlbnNpb24gPSBmaWxlRXh0ZW5zaW9uLnN1YnN0cigxKVxuICAgICAgIyBTZXQgcGF0aCBvZiBidWZmZXIgZm9yIHVuc2F2ZWQgZmlsZXNcbiAgICAgIGlmIGVkaXRvci5nZXRQYXRoKCkgaXMgdW5kZWZpbmVkXG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRQYXRoKGZpbGVQYXRoKVxuICAgICAgIyBHZXQgR3JhbW1hciBmcm9tIHRoZSBlZGl0b3JcbiAgICAgIGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcbiAgICAgICMgR2V0IGxhbmd1YWdlXG4gICAgICBsYW5ndWFnZXMgPSBiZWF1dGlmaWVyLmxhbmd1YWdlcy5nZXRMYW5ndWFnZXMoe2dyYW1tYXIsIGV4dGVuc2lvbjogZmlsZUV4dGVuc2lvbn0pXG4gICAgICBpZiBsYW5ndWFnZXMubGVuZ3RoIDwgMVxuICAgICAgICByZXR1cm5cbiAgICAgICMgVE9ETzogc2VsZWN0IGFwcHJvcHJpYXRlIGxhbmd1YWdlXG4gICAgICBsYW5ndWFnZSA9IGxhbmd1YWdlc1swXVxuICAgICAgIyBHZXQgbGFuZ3VhZ2UgY29uZmlnXG4gICAgICBrZXkgPSBcImF0b20tYmVhdXRpZnkuI3tsYW5ndWFnZS5uYW1lc3BhY2V9LmJlYXV0aWZ5X29uX3NhdmVcIlxuICAgICAgYmVhdXRpZnlPblNhdmUgPSBhdG9tLmNvbmZpZy5nZXQoa2V5KVxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ3NhdmUgZWRpdG9yIHBvc2l0aW9ucycsIGtleSwgYmVhdXRpZnlPblNhdmUpXG4gICAgICBpZiBiZWF1dGlmeU9uU2F2ZVxuICAgICAgICBsb2dnZXIudmVyYm9zZSgnQmVhdXRpZnlpbmcgZmlsZScsIGZpbGVQYXRoKVxuICAgICAgICBiZWF1dGlmeSh7ZWRpdG9yLCBvblNhdmU6IHRydWV9KVxuICAgICAgICAudGhlbigoKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdEb25lIGJlYXV0aWZ5aW5nIGZpbGUnLCBmaWxlUGF0aClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goKGVycm9yKSAtPlxuICAgICAgICAgIHJldHVybiBzaG93RXJyb3IoZXJyb3IpXG4gICAgICAgIClcbiAgICBkaXNwb3NhYmxlID0gZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKHtwYXRoOiBmaWxlUGF0aH0pIC0+XG4gICAgICBiZWF1dGlmeU9uU2F2ZUhhbmRsZXIoe3BhdGg6IGZpbGVQYXRofSlcbiAgICApXG4gICAgcGx1Z2luLnN1YnNjcmlwdGlvbnMuYWRkIGRpc3Bvc2FibGVcblxub3BlblNldHRpbmdzID0gLT5cbiAgYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovL2NvbmZpZy9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5JylcblxuZ2V0VW5zdXBwb3J0ZWRPcHRpb25zID0gLT5cbiAgc2V0dGluZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tYmVhdXRpZnknKVxuICBzY2hlbWEgPSBhdG9tLmNvbmZpZy5nZXRTY2hlbWEoJ2F0b20tYmVhdXRpZnknKVxuICB1bnN1cHBvcnRlZE9wdGlvbnMgPSBfLmZpbHRlcihfLmtleXMoc2V0dGluZ3MpLCAoa2V5KSAtPlxuICAgICMgcmV0dXJuIGF0b20uY29uZmlnLmdldFNjaGVtYShcImF0b20tYmVhdXRpZnkuJHtrZXl9XCIpLnR5cGVcbiAgICAjIHJldHVybiB0eXBlb2Ygc2V0dGluZ3Nba2V5XVxuICAgIHNjaGVtYS5wcm9wZXJ0aWVzW2tleV0gaXMgdW5kZWZpbmVkXG4gIClcbiAgcmV0dXJuIHVuc3VwcG9ydGVkT3B0aW9uc1xuXG5wbHVnaW4uY2hlY2tVbnN1cHBvcnRlZE9wdGlvbnMgPSAtPlxuICB1bnN1cHBvcnRlZE9wdGlvbnMgPSBnZXRVbnN1cHBvcnRlZE9wdGlvbnMoKVxuICBpZiB1bnN1cHBvcnRlZE9wdGlvbnMubGVuZ3RoIGlzbnQgMFxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwiUGxlYXNlIHJ1biBBdG9tIGNvbW1hbmQgJ0F0b20tQmVhdXRpZnk6IE1pZ3JhdGUgU2V0dGluZ3MnLlwiLCB7XG4gICAgICBkZXRhaWwgOiBcIllvdSBjYW4gb3BlbiB0aGUgQXRvbSBjb21tYW5kIHBhbGV0dGUgd2l0aCBgY21kLXNoaWZ0LXBgIChPU1gpIG9yIGBjdHJsLXNoaWZ0LXBgIChMaW51eC9XaW5kb3dzKSBpbiBBdG9tLiBZb3UgaGF2ZSB1bnN1cHBvcnRlZCBvcHRpb25zOiAje3Vuc3VwcG9ydGVkT3B0aW9ucy5qb2luKCcsICcpfVwiLFxuICAgICAgZGlzbWlzc2FibGUgOiB0cnVlXG4gICAgfSlcblxucGx1Z2luLm1pZ3JhdGVTZXR0aW5ncyA9IC0+XG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IGdldFVuc3VwcG9ydGVkT3B0aW9ucygpXG4gIG5hbWVzcGFjZXMgPSBiZWF1dGlmaWVyLmxhbmd1YWdlcy5uYW1lc3BhY2VzXG4gICMgY29uc29sZS5sb2coJ21pZ3JhdGUtc2V0dGluZ3MnLCBzY2hlbWEsIG5hbWVzcGFjZXMsIHVuc3VwcG9ydGVkT3B0aW9ucylcbiAgaWYgdW5zdXBwb3J0ZWRPcHRpb25zLmxlbmd0aCBpcyAwXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJObyBvcHRpb25zIHRvIG1pZ3JhdGUuXCIpXG4gIGVsc2VcbiAgICByZXggPSBuZXcgUmVnRXhwKFwiKCN7bmFtZXNwYWNlcy5qb2luKCd8Jyl9KV8oLiopXCIpXG4gICAgcmVuYW1lID0gXy50b1BhaXJzKF8uemlwT2JqZWN0KHVuc3VwcG9ydGVkT3B0aW9ucywgXy5tYXAodW5zdXBwb3J0ZWRPcHRpb25zLCAoa2V5KSAtPlxuICAgICAgbSA9IGtleS5tYXRjaChyZXgpXG4gICAgICBpZiBtIGlzIG51bGxcbiAgICAgICAgIyBEaWQgbm90IG1hdGNoXG4gICAgICAgICMgUHV0IGludG8gZ2VuZXJhbFxuICAgICAgICByZXR1cm4gXCJnZW5lcmFsLiN7a2V5fVwiXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBcIiN7bVsxXX0uI3ttWzJdfVwiXG4gICAgKSkpXG4gICAgIyBjb25zb2xlLmxvZygncmVuYW1lJywgcmVuYW1lKVxuICAgICMgbG9nZ2VyLnZlcmJvc2UoJ3JlbmFtZScsIHJlbmFtZSlcblxuICAgICMgTW92ZSBhbGwgb3B0aW9uIHZhbHVlcyB0byByZW5hbWVkIGtleVxuICAgIF8uZWFjaChyZW5hbWUsIChba2V5LCBuZXdLZXldKSAtPlxuICAgICAgIyBDb3B5IHRvIG5ldyBrZXlcbiAgICAgIHZhbCA9IGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuI3trZXl9XCIpXG4gICAgICAjIGNvbnNvbGUubG9nKCdyZW5hbWUnLCBrZXksIG5ld0tleSwgdmFsKVxuICAgICAgYXRvbS5jb25maWcuc2V0KFwiYXRvbS1iZWF1dGlmeS4je25ld0tleX1cIiwgdmFsKVxuICAgICAgIyBEZWxldGUgb2xkIGtleVxuICAgICAgYXRvbS5jb25maWcuc2V0KFwiYXRvbS1iZWF1dGlmeS4je2tleX1cIiwgdW5kZWZpbmVkKVxuICAgIClcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIlN1Y2Nlc3NmdWxseSBtaWdyYXRlZCBvcHRpb25zOiAje3Vuc3VwcG9ydGVkT3B0aW9ucy5qb2luKCcsICcpfVwiKVxuXG5wbHVnaW4uYWRkTGFuZ3VhZ2VDb21tYW5kcyA9IC0+XG4gIGxhbmd1YWdlcyA9IGJlYXV0aWZpZXIubGFuZ3VhZ2VzLmxhbmd1YWdlc1xuICBsb2dnZXIudmVyYm9zZShcImxhbmd1YWdlc1wiLCBsYW5ndWFnZXMpXG4gIGZvciBsYW5ndWFnZSBpbiBsYW5ndWFnZXNcbiAgICAoKGxhbmd1YWdlKSA9PlxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWxhbmd1YWdlLSN7bGFuZ3VhZ2UubmFtZS50b0xvd2VyQ2FzZSgpfVwiLCAoKSAtPlxuICAgICAgICBsb2dnZXIudmVyYm9zZShcIkJlYXV0aWZ5aW5nIGxhbmd1YWdlXCIsIGxhbmd1YWdlKVxuICAgICAgICBiZWF1dGlmeSh7IGxhbmd1YWdlIH0pXG4gICAgICApXG4gICAgKShsYW5ndWFnZSlcblxucGx1Z2luLmNvbmZpZyA9IF8ubWVyZ2UocmVxdWlyZSgnLi9jb25maWcnKSwgZGVmYXVsdExhbmd1YWdlT3B0aW9ucylcbnBsdWdpbi5hY3RpdmF0ZSA9IC0+XG4gIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGhhbmRsZVNhdmVFdmVudCgpXG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1lZGl0b3JcIiwgYmVhdXRpZnlcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5OmhlbHAtZGVidWctZWRpdG9yXCIsIGRlYnVnXG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiYXRvbS1iZWF1dGlmeTpvcGVuLXNldHRpbmdzXCIsIG9wZW5TZXR0aW5nc1xuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCIudHJlZS12aWV3IC5maWxlIC5uYW1lXCIsIFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1maWxlXCIsIGJlYXV0aWZ5RmlsZVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCIudHJlZS12aWV3IC5kaXJlY3RvcnkgLm5hbWVcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWRpcmVjdG9yeVwiLCBiZWF1dGlmeURpcmVjdG9yeVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6bWlncmF0ZS1zZXR0aW5nc1wiLCBwbHVnaW4ubWlncmF0ZVNldHRpbmdzXG4gIEBhZGRMYW5ndWFnZUNvbW1hbmRzKClcblxucGx1Z2luLmRlYWN0aXZhdGUgPSAtPlxuICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCkiXX0=
