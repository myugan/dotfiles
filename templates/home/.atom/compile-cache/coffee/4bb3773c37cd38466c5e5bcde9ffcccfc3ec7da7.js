(function() {
  var CompositeDisposable, basicConfig, config;

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  module.exports = {
    config: basicConfig,
    modules: {},
    disposables: null,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.disposables) != null) {
        ref.dispose();
      }
      this.disposables = null;
      return this.modules = {};
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps", "create-project-configs"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "footnote", "image-file", "image-clipboard", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "math", "mathblock", "bold", "italic", "strikethrough", "keystroke", "deletion", "addition", "substitution", "comment", "highlight"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line", "undent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command,
            skipList: ["autocomplete-active"]
          });
        };
      })(this));
      ["insert-toc", "update-toc"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-toc", {
            args: command
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-order-list", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["fold-links", "fold-headings", "fold-h1", "fold-h2", "fold-h3", "focus-current-heading"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/fold-text", {
            args: command
          });
        };
      })(this));
      ["open-link-in-browser", "open-link-in-file"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/open-link", {
            args: command
          });
        };
      })(this));
      ["publish-draft", "insert-image"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.display(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    registerCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.trigger(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, grammars;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      grammars = config.get("grammars") || [];
      return grammars.indexOf(editor.getGrammar().scopeName) >= 0;
    },
    inSkipList: function(list) {
      var editorElement;
      if (list == null) {
        return false;
      }
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      if (!((editorElement != null) && (editorElement.classList != null))) {
        return false;
      }
      return list.every(function(className) {
        return editorElement.classList.contains(className);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9tYXJrZG93bi13cml0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFDVCxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsV0FBUjtJQUVBLE9BQUEsRUFBUyxFQUZUO0lBR0EsV0FBQSxFQUFhLElBSGI7SUFLQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxtQkFBSixDQUFBO01BRWYsSUFBQyxDQUFBLHlCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQTtJQUpRLENBTFY7SUFXQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQVksQ0FBRSxPQUFkLENBQUE7O01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTthQUNmLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFIRCxDQVhaO0lBZ0JBLHlCQUFBLEVBQTJCLFNBQUE7QUFDekIsVUFBQTtNQUFBLGlCQUFBLEdBQW9CO01BRXBCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFDeEIsaUJBQWtCLENBQUEsc0JBQUEsR0FBdUIsSUFBdkIsQ0FBbEIsR0FDRSxLQUFDLENBQUEsWUFBRCxDQUFjLGNBQUEsR0FBZSxJQUFmLEdBQW9CLE9BQWxDLEVBQTBDO1lBQUEsY0FBQSxFQUFnQixJQUFoQjtXQUExQztRQUZzQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7TUFJQSxDQUFDLGtCQUFELEVBQXFCLHdCQUFyQixFQUErQyx3QkFBL0MsQ0FBd0UsQ0FBQyxPQUF6RSxDQUFpRixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtpQkFDL0UsaUJBQWtCLENBQUEsa0JBQUEsR0FBbUIsT0FBbkIsQ0FBbEIsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFpQixhQUFBLEdBQWMsT0FBL0IsRUFBMEM7WUFBQSxjQUFBLEVBQWdCLElBQWhCO1dBQTFDO1FBRjZFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRjthQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxDQUFqQjtJQVh5QixDQWhCM0I7SUE2QkEsc0JBQUEsRUFBd0IsU0FBQTtBQUN0QixVQUFBO01BQUEsY0FBQSxHQUFpQjtNQUVqQixDQUFDLE1BQUQsRUFBUyxZQUFULENBQXNCLENBQUMsT0FBdkIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQzdCLGNBQWUsQ0FBQSw4QkFBQSxHQUErQixJQUEvQixDQUFmLEdBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBYyxzQkFBQSxHQUF1QixJQUF2QixHQUE0QixPQUExQztRQUYyQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0I7TUFJQSxDQUFDLE1BQUQsRUFBUyxVQUFULEVBQXFCLFlBQXJCLEVBQW1DLGlCQUFuQyxFQUFzRCxPQUF0RCxDQUE4RCxDQUFDLE9BQS9ELENBQXVFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUNyRSxjQUFlLENBQUEseUJBQUEsR0FBMEIsS0FBMUIsQ0FBZixHQUNFLEtBQUMsQ0FBQSxZQUFELENBQWMsaUJBQUEsR0FBa0IsS0FBbEIsR0FBd0IsT0FBdEM7UUFGbUU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZFO01BSUEsQ0FBQyxNQUFELEVBQVMsV0FBVCxFQUFzQixNQUF0QixFQUE4QixXQUE5QixFQUNDLE1BREQsRUFDUyxRQURULEVBQ21CLGVBRG5CLEVBQ29DLFdBRHBDLEVBRUMsVUFGRCxFQUVhLFVBRmIsRUFFeUIsY0FGekIsRUFFeUMsU0FGekMsRUFFb0QsV0FGcEQsQ0FHQyxDQUFDLE9BSEYsQ0FHVSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFDUixjQUFlLENBQUEseUJBQUEsR0FBMEIsS0FBMUIsR0FBZ0MsT0FBaEMsQ0FBZixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLHVCQUFqQixFQUEwQztZQUFBLElBQUEsRUFBTSxLQUFOO1dBQTFDO1FBRk07TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSFY7TUFPQSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUNDLE1BREQsRUFDUyxVQURULEVBQ3FCLFlBRHJCLENBQ2tDLENBQUMsT0FEbkMsQ0FDMkMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQ3pDLGNBQWUsQ0FBQSx5QkFBQSxHQUEwQixLQUExQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsdUJBQWpCLEVBQTBDO1lBQUEsSUFBQSxFQUFNLEtBQU47V0FBMUM7UUFGdUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDNDO01BS0EsQ0FBQyxrQkFBRCxFQUFxQixjQUFyQixFQUFxQyxpQkFBckMsRUFBd0Qsc0JBQXhELENBQStFLENBQUMsT0FBaEYsQ0FBd0YsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQ3RGLGNBQWUsQ0FBQSwwQkFBQSxHQUEyQixPQUEzQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsb0JBQWpCLEVBQXVDO1lBQUEsSUFBQSxFQUFNLE9BQU47V0FBdkM7UUFGb0Y7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhGO01BSUEsQ0FBQyxpQkFBRCxFQUFvQixrQkFBcEIsRUFBd0Msa0JBQXhDLENBQTJELENBQUMsT0FBNUQsQ0FBb0UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQ2xFLGNBQWUsQ0FBQSxrQkFBQSxHQUFtQixPQUFuQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsc0JBQWpCLEVBQ0U7WUFBQSxJQUFBLEVBQU0sT0FBTjtZQUFlLFFBQUEsRUFBVSxDQUFDLHFCQUFELENBQXpCO1dBREY7UUFGZ0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFO01BS0EsQ0FBQyxZQUFELEVBQWUsWUFBZixDQUE0QixDQUFDLE9BQTdCLENBQXFDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO2lCQUNuQyxjQUFlLENBQUEsa0JBQUEsR0FBbUIsT0FBbkIsQ0FBZixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLHFCQUFqQixFQUF3QztZQUFBLElBQUEsRUFBTSxPQUFOO1dBQXhDO1FBRmlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQztNQUlBLENBQUMsNEJBQUQsRUFBK0IsbUJBQS9CLEVBQW9ELGNBQXBELENBQW1FLENBQUMsT0FBcEUsQ0FBNEUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQzFFLGNBQWUsQ0FBQSxrQkFBQSxHQUFtQixPQUFuQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsd0JBQWpCLEVBQTJDO1lBQUEsSUFBQSxFQUFNLE9BQU47V0FBM0M7UUFGd0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVFO01BSUEsQ0FBQyxZQUFELEVBQWUsZUFBZixFQUFnQyxTQUFoQyxFQUEyQyxTQUEzQyxFQUFzRCxTQUF0RCxFQUFpRSx1QkFBakUsQ0FBeUYsQ0FBQyxPQUExRixDQUFrRyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtpQkFDaEcsY0FBZSxDQUFBLGtCQUFBLEdBQW1CLE9BQW5CLENBQWYsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFpQixzQkFBakIsRUFBeUM7WUFBQSxJQUFBLEVBQU0sT0FBTjtXQUF6QztRQUY4RjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEc7TUFJQSxDQUFDLHNCQUFELEVBQXlCLG1CQUF6QixDQUE2QyxDQUFDLE9BQTlDLENBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO2lCQUNwRCxjQUFlLENBQUEsa0JBQUEsR0FBbUIsT0FBbkIsQ0FBZixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLHNCQUFqQixFQUF5QztZQUFBLElBQUEsRUFBTSxPQUFOO1dBQXpDO1FBRmtEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RDtNQUlBLENBQUMsZUFBRCxFQUFrQixjQUFsQixDQUFpQyxDQUFDLE9BQWxDLENBQTBDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO2lCQUN4QyxjQUFlLENBQUEsa0JBQUEsR0FBbUIsT0FBbkIsQ0FBZixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLGFBQUEsR0FBYyxPQUEvQjtRQUZzQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUM7YUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxjQUF0QyxDQUFqQjtJQXBEc0IsQ0E3QnhCO0lBbUZBLFlBQUEsRUFBYyxTQUFDLElBQUQsRUFBTyxPQUFQOztRQUFPLFVBQVU7O2FBQzdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ0UsY0FBQTtVQUFBLElBQUcsQ0FBQyxPQUFPLENBQUMsY0FBUixJQUEwQixLQUFDLENBQUEsVUFBRCxDQUFBLENBQTNCLENBQUEsSUFBNkMsQ0FBQyxLQUFDLENBQUEsVUFBRCxDQUFZLE9BQU8sQ0FBQyxRQUFwQixDQUFqRDs7a0JBQ1csQ0FBQSxJQUFBLElBQVMsT0FBQSxDQUFRLElBQVI7O1lBQ2xCLGNBQUEsR0FBaUIsSUFBSSxLQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBYixDQUFtQixPQUFPLENBQUMsSUFBM0I7WUFDakIsSUFBaUMsaUNBQWpDO3FCQUFBLGNBQWMsQ0FBQyxPQUFmLENBQXVCLENBQXZCLEVBQUE7YUFIRjtXQUFBLE1BQUE7bUJBS0UsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUxGOztRQURGO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtJQURZLENBbkZkO0lBNEZBLGVBQUEsRUFBaUIsU0FBQyxJQUFELEVBQU8sT0FBUDs7UUFBTyxVQUFVOzthQUNoQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUNFLGNBQUE7VUFBQSxJQUFHLENBQUMsT0FBTyxDQUFDLGNBQVIsSUFBMEIsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUEzQixDQUFBLElBQTZDLENBQUMsS0FBQyxDQUFBLFVBQUQsQ0FBWSxPQUFPLENBQUMsUUFBcEIsQ0FBakQ7O2tCQUNXLENBQUEsSUFBQSxJQUFTLE9BQUEsQ0FBUSxJQUFSOztZQUNsQixjQUFBLEdBQWlCLElBQUksS0FBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQWIsQ0FBbUIsT0FBTyxDQUFDLElBQTNCO1lBQ2pCLElBQWlDLGlDQUFqQztxQkFBQSxjQUFjLENBQUMsT0FBZixDQUF1QixDQUF2QixFQUFBO2FBSEY7V0FBQSxNQUFBO21CQUtFLENBQUMsQ0FBQyxlQUFGLENBQUEsRUFMRjs7UUFERjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7SUFEZSxDQTVGakI7SUFxR0EsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULElBQW9CLGNBQXBCO0FBQUEsZUFBTyxNQUFQOztNQUVBLFFBQUEsR0FBVyxNQUFNLENBQUMsR0FBUCxDQUFXLFVBQVgsQ0FBQSxJQUEwQjtBQUNyQyxhQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFyQyxDQUFBLElBQW1EO0lBTGhELENBckdaO0lBNEdBLFVBQUEsRUFBWSxTQUFDLElBQUQ7QUFDVixVQUFBO01BQUEsSUFBb0IsWUFBcEI7QUFBQSxlQUFPLE1BQVA7O01BQ0EsYUFBQSxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW5CO01BQ2hCLElBQUEsQ0FBQSxDQUFvQix1QkFBQSxJQUFrQixpQ0FBdEMsQ0FBQTtBQUFBLGVBQU8sTUFBUDs7QUFDQSxhQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBQyxTQUFEO2VBQWUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxTQUFqQztNQUFmLENBQVg7SUFKRyxDQTVHWjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4vY29uZmlnXCJcbmJhc2ljQ29uZmlnID0gcmVxdWlyZSBcIi4vY29uZmlnLWJhc2ljXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6IGJhc2ljQ29uZmlnXG5cbiAgbW9kdWxlczoge30gIyBUbyBjYWNoZSByZXF1aXJlZCBtb2R1bGVzXG4gIGRpc3Bvc2FibGVzOiBudWxsICMgQ29tcG9zaXRlIGRpc3Bvc2FibGVcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBAcmVnaXN0ZXJXb3Jrc3BhY2VDb21tYW5kcygpXG4gICAgQHJlZ2lzdGVyRWRpdG9yQ29tbWFuZHMoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG4gICAgQG1vZHVsZXMgPSB7fVxuXG4gIHJlZ2lzdGVyV29ya3NwYWNlQ29tbWFuZHM6IC0+XG4gICAgd29ya3NwYWNlQ29tbWFuZHMgPSB7fVxuXG4gICAgW1wiZHJhZnRcIiwgXCJwb3N0XCJdLmZvckVhY2ggKGZpbGUpID0+XG4gICAgICB3b3Jrc3BhY2VDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjpuZXctI3tmaWxlfVwiXSA9XG4gICAgICAgIEByZWdpc3RlclZpZXcoXCIuL3ZpZXdzL25ldy0je2ZpbGV9LXZpZXdcIiwgb3B0T3V0R3JhbW1hcnM6IHRydWUpXG5cbiAgICBbXCJvcGVuLWNoZWF0LXNoZWV0XCIsIFwiY3JlYXRlLWRlZmF1bHQta2V5bWFwc1wiLCBcImNyZWF0ZS1wcm9qZWN0LWNvbmZpZ3NcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIHdvcmtzcGFjZUNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy8je2NvbW1hbmR9XCIsIG9wdE91dEdyYW1tYXJzOiB0cnVlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcImF0b20td29ya3NwYWNlXCIsIHdvcmtzcGFjZUNvbW1hbmRzKSlcblxuICByZWdpc3RlckVkaXRvckNvbW1hbmRzOiAtPlxuICAgIGVkaXRvckNvbW1hbmRzID0ge31cblxuICAgIFtcInRhZ3NcIiwgXCJjYXRlZ29yaWVzXCJdLmZvckVhY2ggKGF0dHIpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjptYW5hZ2UtcG9zdC0je2F0dHJ9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyVmlldyhcIi4vdmlld3MvbWFuYWdlLXBvc3QtI3thdHRyfS12aWV3XCIpXG5cbiAgICBbXCJsaW5rXCIsIFwiZm9vdG5vdGVcIiwgXCJpbWFnZS1maWxlXCIsIFwiaW1hZ2UtY2xpcGJvYXJkXCIsIFwidGFibGVcIl0uZm9yRWFjaCAobWVkaWEpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjppbnNlcnQtI3ttZWRpYX1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJWaWV3KFwiLi92aWV3cy9pbnNlcnQtI3ttZWRpYX0tdmlld1wiKVxuXG4gICAgW1wiY29kZVwiLCBcImNvZGVibG9ja1wiLCBcIm1hdGhcIiwgXCJtYXRoYmxvY2tcIixcbiAgICAgXCJib2xkXCIsIFwiaXRhbGljXCIsIFwic3RyaWtldGhyb3VnaFwiLCBcImtleXN0cm9rZVwiLFxuICAgICBcImRlbGV0aW9uXCIsIFwiYWRkaXRpb25cIiwgXCJzdWJzdGl0dXRpb25cIiwgXCJjb21tZW50XCIsIFwiaGlnaGxpZ2h0XCJcbiAgICBdLmZvckVhY2ggKHN0eWxlKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6dG9nZ2xlLSN7c3R5bGV9LXRleHRcIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9zdHlsZS10ZXh0XCIsIGFyZ3M6IHN0eWxlKVxuXG4gICAgW1wiaDFcIiwgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcInVsXCIsIFwib2xcIixcbiAgICAgXCJ0YXNrXCIsIFwidGFza2RvbmVcIiwgXCJibG9ja3F1b3RlXCJdLmZvckVhY2ggKHN0eWxlKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6dG9nZ2xlLSN7c3R5bGV9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvc3R5bGUtbGluZVwiLCBhcmdzOiBzdHlsZSlcblxuICAgIFtcInByZXZpb3VzLWhlYWRpbmdcIiwgXCJuZXh0LWhlYWRpbmdcIiwgXCJuZXh0LXRhYmxlLWNlbGxcIiwgXCJyZWZlcmVuY2UtZGVmaW5pdGlvblwiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6anVtcC10by0je2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvanVtcC10b1wiLCBhcmdzOiBjb21tYW5kKVxuXG4gICAgW1wiaW5zZXJ0LW5ldy1saW5lXCIsIFwiaW5kZW50LWxpc3QtbGluZVwiLCBcInVuZGVudC1saXN0LWxpbmVcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9lZGl0LWxpbmVcIixcbiAgICAgICAgICBhcmdzOiBjb21tYW5kLCBza2lwTGlzdDogW1wiYXV0b2NvbXBsZXRlLWFjdGl2ZVwiXSlcblxuICAgIFtcImluc2VydC10b2NcIiwgXCJ1cGRhdGUtdG9jXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvZWRpdC10b2NcIiwgYXJnczogY29tbWFuZClcblxuICAgIFtcImNvcnJlY3Qtb3JkZXItbGlzdC1udW1iZXJzXCIsIFwiZm9ybWF0LW9yZGVyLWxpc3RcIiwgXCJmb3JtYXQtdGFibGVcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9mb3JtYXQtdGV4dFwiLCBhcmdzOiBjb21tYW5kKVxuXG4gICAgW1wiZm9sZC1saW5rc1wiLCBcImZvbGQtaGVhZGluZ3NcIiwgXCJmb2xkLWgxXCIsIFwiZm9sZC1oMlwiLCBcImZvbGQtaDNcIiwgXCJmb2N1cy1jdXJyZW50LWhlYWRpbmdcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9mb2xkLXRleHRcIiwgYXJnczogY29tbWFuZClcblxuICAgIFtcIm9wZW4tbGluay1pbi1icm93c2VyXCIsIFwib3Blbi1saW5rLWluLWZpbGVcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9vcGVuLWxpbmtcIiwgYXJnczogY29tbWFuZClcblxuICAgIFtcInB1Ymxpc2gtZHJhZnRcIiwgXCJpbnNlcnQtaW1hZ2VcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy8je2NvbW1hbmR9XCIpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS10ZXh0LWVkaXRvclwiLCBlZGl0b3JDb21tYW5kcykpXG5cbiAgcmVnaXN0ZXJWaWV3OiAocGF0aCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIChlKSA9PlxuICAgICAgaWYgKG9wdGlvbnMub3B0T3V0R3JhbW1hcnMgfHwgQGlzTWFya2Rvd24oKSkgJiYgIUBpblNraXBMaXN0KG9wdGlvbnMuc2tpcExpc3QpXG4gICAgICAgIEBtb2R1bGVzW3BhdGhdID89IHJlcXVpcmUocGF0aClcbiAgICAgICAgbW9kdWxlSW5zdGFuY2UgPSBuZXcgQG1vZHVsZXNbcGF0aF0ob3B0aW9ucy5hcmdzKVxuICAgICAgICBtb2R1bGVJbnN0YW5jZS5kaXNwbGF5KGUpIHVubGVzcyBjb25maWcuZ2V0KFwiX3NraXBBY3Rpb25cIik/XG4gICAgICBlbHNlXG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICByZWdpc3RlckNvbW1hbmQ6IChwYXRoLCBvcHRpb25zID0ge30pIC0+XG4gICAgKGUpID0+XG4gICAgICBpZiAob3B0aW9ucy5vcHRPdXRHcmFtbWFycyB8fCBAaXNNYXJrZG93bigpKSAmJiAhQGluU2tpcExpc3Qob3B0aW9ucy5za2lwTGlzdClcbiAgICAgICAgQG1vZHVsZXNbcGF0aF0gPz0gcmVxdWlyZShwYXRoKVxuICAgICAgICBtb2R1bGVJbnN0YW5jZSA9IG5ldyBAbW9kdWxlc1twYXRoXShvcHRpb25zLmFyZ3MpXG4gICAgICAgIG1vZHVsZUluc3RhbmNlLnRyaWdnZXIoZSkgdW5sZXNzIGNvbmZpZy5nZXQoXCJfc2tpcEFjdGlvblwiKT9cbiAgICAgIGVsc2VcbiAgICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIGlzTWFya2Rvd246IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBlZGl0b3I/XG5cbiAgICBncmFtbWFycyA9IGNvbmZpZy5nZXQoXCJncmFtbWFyc1wiKSB8fCBbXVxuICAgIHJldHVybiBncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSA+PSAwXG5cbiAgaW5Ta2lwTGlzdDogKGxpc3QpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsaXN0P1xuICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZWRpdG9yRWxlbWVudD8gJiYgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3Q/XG4gICAgcmV0dXJuIGxpc3QuZXZlcnkgKGNsYXNzTmFtZSkgLT4gZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKVxuIl19
