(function() {
  var CSON, defaults, engines, filetypes, getConfigFile, packagePath, path, prefix,
    slice = [].slice;

  CSON = require("season");

  path = require("path");

  prefix = "markdown-writer";

  packagePath = atom.packages.resolvePackagePath("markdown-writer");

  getConfigFile = function() {
    var parts;
    parts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (packagePath) {
      return path.join.apply(path, [packagePath, "lib"].concat(slice.call(parts)));
    } else {
      return path.join.apply(path, [__dirname].concat(slice.call(parts)));
    }
  };

  defaults = CSON.readFileSync(getConfigFile("config.cson"));

  defaults["siteEngine"] = "general";

  defaults["projectConfigFile"] = "_mdwriter.cson";

  defaults["siteLinkPath"] = path.join(atom.getConfigDirPath(), prefix + "-links.cson");

  defaults["grammars"] = ['source.gfm', 'source.gfm.nvatom', 'source.litcoffee', 'source.asciidoc', 'text.md', 'text.plain', 'text.plain.null-grammar'];

  filetypes = {
    'source.asciidoc': CSON.readFileSync(getConfigFile("filetypes", "asciidoc.cson"))
  };

  engines = {
    html: {
      imageTag: "<a href=\"{site}/{slug}.html\" target=\"_blank\">\n  <img class=\"align{align}\" alt=\"{alt}\" src=\"{src}\" width=\"{width}\" height=\"{height}\" />\n</a>"
    },
    jekyll: {
      textStyles: {
        codeblock: {
          before: "{% highlight %}\n",
          after: "\n{% endhighlight %}",
          regexBefore: "{% highlight(?: .+)? %}\\r?\\n",
          regexAfter: "\\r?\\n{% endhighlight %}"
        }
      }
    },
    octopress: {
      imageTag: "{% img {align} {src} {width} {height} '{alt}' %}"
    },
    hexo: {
      newPostFileName: "{title}{extension}",
      frontMatter: "layout: \"{layout}\"\ntitle: \"{title}\"\ndate: \"{date}\"\n---"
    },
    hugo: {
      siteDraftsDir: "content/posts/",
      sitePostsDir: "content/posts/",
      siteImagesDir: "{directory}/images/",
      relativeImagePath: true,
      renameImageOnCopy: true
    }
  };

  module.exports = {
    projectConfigs: {},
    engineNames: function() {
      return Object.keys(engines);
    },
    keyPath: function(key) {
      return prefix + "." + key;
    },
    get: function(key, options) {
      var allow_blank, config, i, len, ref, val;
      if (options == null) {
        options = {};
      }
      allow_blank = options["allow_blank"] != null ? options["allow_blank"] : true;
      ref = ["Project", "User", "Engine", "Filetype", "Default"];
      for (i = 0, len = ref.length; i < len; i++) {
        config = ref[i];
        val = this["get" + config](key);
        if (allow_blank) {
          if (val != null) {
            return val;
          }
        } else {
          if (val) {
            return val;
          }
        }
      }
    },
    set: function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    },
    restoreDefault: function(key) {
      return atom.config.unset(this.keyPath(key));
    },
    getDefault: function(key) {
      return this._valueForKeyPath(defaults, key);
    },
    getFiletype: function(key) {
      var editor, filetypeConfig;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return void 0;
      }
      filetypeConfig = filetypes[editor.getGrammar().scopeName];
      if (filetypeConfig == null) {
        return void 0;
      }
      return this._valueForKeyPath(filetypeConfig, key);
    },
    getEngine: function(key) {
      var engine, engineConfig;
      engine = this.getProject("siteEngine") || this.getUser("siteEngine") || this.getDefault("siteEngine");
      engineConfig = engines[engine];
      if (engineConfig == null) {
        return void 0;
      }
      return this._valueForKeyPath(engineConfig, key);
    },
    getCurrentDefault: function(key) {
      return this.getEngine(key) || this.getDefault(key);
    },
    getUser: function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
    },
    getProject: function(key) {
      var config, configFile;
      configFile = this.getProjectConfigFile();
      if (!configFile) {
        return;
      }
      config = this._loadProjectConfig(configFile);
      return this._valueForKeyPath(config, key);
    },
    getSampleConfigFile: function() {
      return getConfigFile("config.cson");
    },
    getProjectConfigFile: function() {
      var editor, fileName, projectPath;
      if (atom.project.getPaths().length < 1) {
        return;
      }
      projectPath = void 0;
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        projectPath = atom.project.relativizePath(editor.getPath())[0];
      }
      if (!projectPath) {
        projectPath = atom.project.getPaths()[0];
      }
      fileName = this.getUser("projectConfigFile") || this.getDefault("projectConfigFile");
      return path.join(projectPath, fileName);
    },
    _loadProjectConfig: function(configFile) {
      var error;
      if (this.projectConfigs[configFile]) {
        return this.projectConfigs[configFile];
      }
      try {
        return this.projectConfigs[configFile] = CSON.readFileSync(configFile) || {};
      } catch (error1) {
        error = error1;
        if (atom.inDevMode() && !/ENOENT/.test(error.message)) {
          console.info("Markdown Writer [config.coffee]: " + error);
        }
        return this.projectConfigs[configFile] = {};
      }
    },
    _valueForKeyPath: function(object, keyPath) {
      var i, key, keys, len;
      keys = keyPath.split(".");
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0RUFBQTtJQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBQSxHQUFTOztFQUNULFdBQUEsR0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLGlCQUFqQzs7RUFDZCxhQUFBLEdBQWdCLFNBQUE7QUFDZCxRQUFBO0lBRGU7SUFDZixJQUFHLFdBQUg7YUFBb0IsSUFBSSxDQUFDLElBQUwsYUFBVSxDQUFBLFdBQUEsRUFBYSxLQUFPLFNBQUEsV0FBQSxLQUFBLENBQUEsQ0FBOUIsRUFBcEI7S0FBQSxNQUFBO2FBQ0ssSUFBSSxDQUFDLElBQUwsYUFBVSxDQUFBLFNBQVcsU0FBQSxXQUFBLEtBQUEsQ0FBQSxDQUFyQixFQURMOztFQURjOztFQUtoQixRQUFBLEdBQVcsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsYUFBQSxDQUFjLGFBQWQsQ0FBbEI7O0VBR1gsUUFBUyxDQUFBLFlBQUEsQ0FBVCxHQUF5Qjs7RUFHekIsUUFBUyxDQUFBLG1CQUFBLENBQVQsR0FBZ0M7O0VBR2hDLFFBQVMsQ0FBQSxjQUFBLENBQVQsR0FBMkIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUFWLEVBQXNDLE1BQUQsR0FBUSxhQUE3Qzs7RUFFM0IsUUFBUyxDQUFBLFVBQUEsQ0FBVCxHQUF1QixDQUNyQixZQURxQixFQUVyQixtQkFGcUIsRUFHckIsa0JBSHFCLEVBSXJCLGlCQUpxQixFQUtyQixTQUxxQixFQU1yQixZQU5xQixFQU9yQix5QkFQcUI7O0VBV3ZCLFNBQUEsR0FDRTtJQUFBLGlCQUFBLEVBQW1CLElBQUksQ0FBQyxZ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UUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxFQUF0Qzs7TUFFQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQUQsQ0FBUyxtQkFBVCxDQUFBLElBQWlDLElBQUMsQ0FBQSxVQUFELENBQVksbUJBQVo7YUFDNUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFFBQXZCO0lBWG9CLENBaEV0QjtJQTZFQSxrQkFBQSxFQUFvQixTQUFDLFVBQUQ7QUFDbEIsVUFBQTtNQUFBLElBQXNDLElBQUMsQ0FBQSxjQUFlLENBQUEsVUFBQSxDQUF0RDtBQUFBLGVBQU8sSUFBQyxDQUFBLGNBQWUsQ0FBQSxVQUFBLEVBQXZCOztBQUVBO2VBRUUsSUFBQyxDQUFBLGNBQWUsQ0FBQSxVQUFBLENBQWhCLEdBQThCLElBQUksQ0FBQyxZQUFMLENBQWtCLFVBQWxCLENBQUEsSUFBaUMsR0FGakU7T0FBQSxjQUFBO1FBR007UUFHSixJQUFHLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBQSxJQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFULENBQWMsS0FBSyxDQUFDLE9BQXBCLENBQXhCO1VBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxtQ0FBQSxHQUFvQyxLQUFqRCxFQURGOztlQUdBLElBQUMsQ0FBQSxjQUFlLENBQUEsVUFBQSxDQUFoQixHQUE4QixHQVRoQzs7SUFIa0IsQ0E3RXBCO0lBMkZBLGdCQUFBLEVBQWtCLFNBQUMsTUFBRCxFQUFTLE9BQVQ7QUFDaEIsVUFBQTtNQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQ7QUFDUCxXQUFBLHNDQUFBOztRQUNFLE1BQUEsR0FBUyxNQUFPLENBQUEsR0FBQTtRQUNoQixJQUFjLGNBQWQ7QUFBQSxpQkFBQTs7QUFGRjthQUdBO0lBTGdCLENBM0ZsQjs7QUFwRUYiLCJzb3VyY2VzQ29udGVudCI6WyJDU09OID0gcmVxdWlyZSBcInNlYXNvblwiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuXG5wcmVmaXggPSBcIm1hcmtkb3duLXdyaXRlclwiXG5wYWNrYWdlUGF0aCA9IGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKFwibWFya2Rvd24td3JpdGVyXCIpXG5nZXRDb25maWdGaWxlID0gKHBhcnRzLi4uKSAtPlxuICBpZiBwYWNrYWdlUGF0aCB0aGVuIHBhdGguam9pbihwYWNrYWdlUGF0aCwgXCJsaWJcIiwgcGFydHMuLi4pXG4gIGVsc2UgcGF0aC5qb2luKF9fZGlybmFtZSwgcGFydHMuLi4pXG5cbiMgbG9hZCBzYW1wbGUgY29uZmlnIHRvIGRlZmF1bHRzXG5kZWZhdWx0cyA9IENTT04ucmVhZEZpbGVTeW5jKGdldENvbmZpZ0ZpbGUoXCJjb25maWcuY3NvblwiKSlcblxuIyBzdGF0aWMgZW5naW5lIG9mIHlvdXIgYmxvZywgc2VlIGBAZW5naW5lc2BcbmRlZmF1bHRzW1wic2l0ZUVuZ2luZVwiXSA9IFwiZ2VuZXJhbFwiXG4jIHByb2plY3Qgc3BlY2lmaWMgY29uZmlndXJhdGlvbiBmaWxlIG5hbWVcbiMgaHR0cHM6Ly9naXRodWIuY29tL3podW9jaHVuL21kLXdyaXRlci93aWtpL1NldHRpbmdzLWZvci1pbmRpdmlkdWFsLXByb2plY3RzXG5kZWZhdWx0c1tcInByb2plY3RDb25maWdGaWxlXCJdID0gXCJfbWR3cml0ZXIuY3NvblwiXG4jIHBhdGggdG8gYSBjc29uIGZpbGUgdGhhdCBzdG9yZXMgbGlua3MgYWRkZWQgZm9yIGF1dG9tYXRpYyBsaW5raW5nXG4jIGRlZmF1bHQgdG8gYG1hcmtkb3duLXdyaXRlci1saW5rcy5jc29uYCBmaWxlIHVuZGVyIHVzZXIncyBjb25maWcgZGlyZWN0b3J5XG5kZWZhdWx0c1tcInNpdGVMaW5rUGF0aFwiXSA9IHBhdGguam9pbihhdG9tLmdldENvbmZpZ0RpclBhdGgoKSwgXCIje3ByZWZpeH0tbGlua3MuY3NvblwiKVxuIyBmaWxldHlwZXMgbWFya2Rvd24td3JpdGVyIGNvbW1hbmRzIGFwcGx5XG5kZWZhdWx0c1tcImdyYW1tYXJzXCJdID0gW1xuICAnc291cmNlLmdmbSdcbiAgJ3NvdXJjZS5nZm0ubnZhdG9tJ1xuICAnc291cmNlLmxpdGNvZmZlZSdcbiAgJ3NvdXJjZS5hc2NpaWRvYydcbiAgJ3RleHQubWQnXG4gICd0ZXh0LnBsYWluJ1xuICAndGV4dC5wbGFpbi5udWxsLWdyYW1tYXInXG5dXG5cbiMgZmlsZXR5cGUgZGVmYXVsdHNcbmZpbGV0eXBlcyA9XG4gICdzb3VyY2UuYXNjaWlkb2MnOiBDU09OLnJlYWRGaWxlU3luYyhnZXRDb25maWdGaWxlKFwiZmlsZXR5cGVzXCIsIFwiYXNjaWlkb2MuY3NvblwiKSlcblxuIyBlbmdpbmUgZGVmYXVsdHNcbmVuZ2luZXMgPVxuICBodG1sOlxuICAgIGltYWdlVGFnOiBcIlwiXCJcbiAgICAgIDxhIGhyZWY9XCJ7c2l0ZX0ve3NsdWd9Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgPGltZyBjbGFzcz1cImFsaWdue2FsaWdufVwiIGFsdD1cInthbHR9XCIgc3JjPVwie3NyY31cIiB3aWR0aD1cInt3aWR0aH1cIiBoZWlnaHQ9XCJ7aGVpZ2h0fVwiIC8+XG4gICAgICA8L2E+XG4gICAgICBcIlwiXCJcbiAgamVreWxsOlxuICAgIHRleHRTdHlsZXM6XG4gICAgICBjb2RlYmxvY2s6XG4gICAgICAgIGJlZm9yZTogXCJ7JSBoaWdobGlnaHQgJX1cXG5cIlxuICAgICAgICBhZnRlcjogXCJcXG57JSBlbmRoaWdobGlnaHQgJX1cIlxuICAgICAgICByZWdleEJlZm9yZTogXCJ7JSBoaWdobGlnaHQoPzogLispPyAlfVxcXFxyP1xcXFxuXCJcbiAgICAgICAgcmVnZXhBZnRlcjogXCJcXFxccj9cXFxcbnslIGVuZGhpZ2hsaWdodCAlfVwiXG4gIG9jdG9wcmVzczpcbiAgICBpbWFnZVRhZzogXCJ7JSBpbWcge2FsaWdufSB7c3JjfSB7d2lkdGh9IHtoZWlnaHR9ICd7YWx0fScgJX1cIlxuICBoZXhvOlxuICAgIG5ld1Bvc3RGaWxlTmFtZTogXCJ7dGl0bGV9e2V4dGVuc2lvbn1cIlxuICAgIGZyb250TWF0dGVyOiBcIlwiXCJcbiAgICAgIGxheW91dDogXCJ7bGF5b3V0fVwiXG4gICAgICB0aXRsZTogXCJ7dGl0bGV9XCJcbiAgICAgIGRhdGU6IFwie2RhdGV9XCJcbiAgICAgIC0tLVxuICAgICAgXCJcIlwiXG4gIGh1Z286XG4gICAgc2l0ZURyYWZ0c0RpcjogXCJjb250ZW50L3Bvc3RzL1wiXG4gICAgc2l0ZVBvc3RzRGlyOiBcImNvbnRlbnQvcG9zdHMvXCJcbiAgICBzaXRlSW1hZ2VzRGlyOiBcIntkaXJlY3Rvcnl9L2ltYWdlcy9cIlxuICAgIHJlbGF0aXZlSW1hZ2VQYXRoOiB0cnVlXG4gICAgcmVuYW1lSW1hZ2VPbkNvcHk6IHRydWVcblxubW9kdWxlLmV4cG9ydHMgPVxuICBwcm9qZWN0Q29uZmlnczoge31cblxuICBlbmdpbmVOYW1lczogLT4gT2JqZWN0LmtleXMoZW5naW5lcylcblxuICBrZXlQYXRoOiAoa2V5KSAtPiBcIiN7cHJlZml4fS4je2tleX1cIlxuXG4gIGdldDogKGtleSwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIGFsbG93X2JsYW5rID0gaWYgb3B0aW9uc1tcImFsbG93X2JsYW5rXCJdPyB0aGVuIG9wdGlvbnNbXCJhbGxvd19ibGFua1wiXSBlbHNlIHRydWVcblxuICAgIGZvciBjb25maWcgaW4gW1wiUHJvamVjdFwiLCBcIlVzZXJcIiwgXCJFbmdpbmVcIiwgXCJGaWxldHlwZVwiLCBcIkRlZmF1bHRcIl1cbiAgICAgIHZhbCA9IEBbXCJnZXQje2NvbmZpZ31cIl0oa2V5KVxuXG4gICAgICBpZiBhbGxvd19ibGFuayB0aGVuIHJldHVybiB2YWwgaWYgdmFsP1xuICAgICAgZWxzZSByZXR1cm4gdmFsIGlmIHZhbFxuXG4gIHNldDogKGtleSwgdmFsKSAtPlxuICAgIGF0b20uY29uZmlnLnNldChAa2V5UGF0aChrZXkpLCB2YWwpXG5cbiAgcmVzdG9yZURlZmF1bHQ6IChrZXkpIC0+XG4gICAgYXRvbS5jb25maWcudW5zZXQoQGtleVBhdGgoa2V5KSlcblxuICAjIGdldCBjb25maWcuZGVmYXVsdHNcbiAgZ2V0RGVmYXVsdDogKGtleSkgLT5cbiAgICBAX3ZhbHVlRm9yS2V5UGF0aChkZWZhdWx0cywga2V5KVxuXG4gICMgZ2V0IGNvbmZpZy5maWxldHlwZXNbZmlsZXR5cGVdIGJhc2VkIG9uIGN1cnJlbnQgZmlsZVxuICBnZXRGaWxldHlwZTogKGtleSkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gdW5kZWZpbmVkIHVubGVzcyBlZGl0b3I/XG5cbiAgICBmaWxldHlwZUNvbmZpZyA9IGZpbGV0eXBlc1tlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZV1cbiAgICByZXR1cm4gdW5kZWZpbmVkIHVubGVzcyBmaWxldHlwZUNvbmZpZz9cblxuICAgIEBfdmFsdWVGb3JLZXlQYXRoKGZpbGV0eXBlQ29uZmlnLCBrZXkpXG5cbiAgIyBnZXQgY29uZmlnLmVuZ2luZXMgYmFzZWQgb24gc2l0ZUVuZ2luZSBzZXRcbiAgZ2V0RW5naW5lOiAoa2V5KSAtPlxuICAgIGVuZ2luZSA9IEBnZXRQcm9qZWN0KFwic2l0ZUVuZ2luZVwiKSB8fFxuICAgICAgICAgICAgIEBnZXRVc2VyKFwic2l0ZUVuZ2luZVwiKSB8fFxuICAgICAgICAgICAgIEBnZXREZWZhdWx0KFwic2l0ZUVuZ2luZVwiKVxuXG4gICAgZW5naW5lQ29uZmlnID0gZW5naW5lc1tlbmdpbmVdXG4gICAgcmV0dXJuIHVuZGVmaW5lZCB1bmxlc3MgZW5naW5lQ29uZmlnP1xuXG4gICAgQF92YWx1ZUZvcktleVBhdGgoZW5naW5lQ29uZmlnLCBrZXkpXG5cbiAgIyBnZXQgY29uZmlnIGJhc2VkIG9uIGVuZ2luZSBzZXQgb3IgZ2xvYmFsIGRlZmF1bHRzXG4gIGdldEN1cnJlbnREZWZhdWx0OiAoa2V5KSAtPlxuICAgIEBnZXRFbmdpbmUoa2V5KSB8fCBAZ2V0RGVmYXVsdChrZXkpXG5cbiAgIyBnZXQgY29uZmlnIGZyb20gdXNlcidzIGNvbmZpZyBmaWxlXG4gIGdldFVzZXI6IChrZXkpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KEBrZXlQYXRoKGtleSksIHNvdXJjZXM6IFthdG9tLmNvbmZpZy5nZXRVc2VyQ29uZmlnUGF0aCgpXSlcblxuICAjIGdldCBwcm9qZWN0IHNwZWNpZmljIGNvbmZpZyBmcm9tIHByb2plY3QncyBjb25maWcgZmlsZVxuICBnZXRQcm9qZWN0OiAoa2V5KSAtPlxuICAgIGNvbmZpZ0ZpbGUgPSBAZ2V0UHJvamVjdENvbmZpZ0ZpbGUoKVxuICAgIHJldHVybiB1bmxlc3MgY29uZmlnRmlsZVxuXG4gICAgY29uZmlnID0gQF9sb2FkUHJvamVjdENvbmZpZyhjb25maWdGaWxlKVxuICAgIEBfdmFsdWVGb3JLZXlQYXRoKGNvbmZpZywga2V5KVxuXG4gIGdldFNhbXBsZUNvbmZpZ0ZpbGU6IC0+IGdldENvbmZpZ0ZpbGUoXCJjb25maWcuY3NvblwiKVxuXG4gIGdldFByb2plY3RDb25maWdGaWxlOiAtPlxuICAgIHJldHVybiBpZiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGggPCAxXG5cbiAgICBwcm9qZWN0UGF0aCA9IHVuZGVmaW5lZFxuICAgICMgdHJ5IHJlc29sdmUgYmFzZWQgb24gb3BlbmVkIGZpbGUgZWRpdG9yXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFBhdGgoKSlbMF0gaWYgZWRpdG9yXG4gICAgIyB0cnkgcmVzb2x2ZSBiYXNlZCBvbiB0aGUgZmlyc3QgcHJvamVjdFxuICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0gdW5sZXNzIHByb2plY3RQYXRoXG5cbiAgICBmaWxlTmFtZSA9IEBnZXRVc2VyKFwicHJvamVjdENvbmZpZ0ZpbGVcIikgfHwgQGdldERlZmF1bHQoXCJwcm9qZWN0Q29uZmlnRmlsZVwiKVxuICAgIHBhdGguam9pbihwcm9qZWN0UGF0aCwgZmlsZU5hbWUpXG5cbiAgX2xvYWRQcm9qZWN0Q29uZmlnOiAoY29uZmlnRmlsZSkgLT5cbiAgICByZXR1cm4gQHByb2plY3RDb25maWdzW2NvbmZpZ0ZpbGVdIGlmIEBwcm9qZWN0Q29uZmlnc1tjb25maWdGaWxlXVxuXG4gICAgdHJ5XG4gICAgICAjIHdoZW4gY29uZmlnRmlsZSBpcyBlbXB0eSwgQ1NPTiByZXR1cm4gdW5kZWZpbmVkLCBmYWxsYmFjayB0byB7fVxuICAgICAgQHByb2plY3RDb25maWdzW2NvbmZpZ0ZpbGVdID0gQ1NPTi5yZWFkRmlsZVN5bmMoY29uZmlnRmlsZSkgfHwge31cbiAgICBjYXRjaCBlcnJvclxuICAgICAgIyBsb2cgZXJyb3IgbWVzc2FnZSBpbiBkZXYgbW9kZSBmb3IgZWFzaWVyIHRyb3VibGVzaG90dGluZyxcbiAgICAgICMgYnV0IGlnbm9yaW5nIGZpbGUgbm90IGV4aXN0cyBlcnJvclxuICAgICAgaWYgYXRvbS5pbkRldk1vZGUoKSAmJiAhL0VOT0VOVC8udGVzdChlcnJvci5tZXNzYWdlKVxuICAgICAgICBjb25zb2xlLmluZm8oXCJNYXJrZG93biBXcml0ZXIgW2NvbmZpZy5jb2ZmZWVdOiAje2Vycm9yfVwiKVxuXG4gICAgICBAcHJvamVjdENvbmZpZ3NbY29uZmlnRmlsZV0gPSB7fVxuXG4gIF92YWx1ZUZvcktleVBhdGg6IChvYmplY3QsIGtleVBhdGgpIC0+XG4gICAga2V5cyA9IGtleVBhdGguc3BsaXQoXCIuXCIpXG4gICAgZm9yIGtleSBpbiBrZXlzXG4gICAgICBvYmplY3QgPSBvYmplY3Rba2V5XVxuICAgICAgcmV0dXJuIHVubGVzcyBvYmplY3Q/XG4gICAgb2JqZWN0XG4iXX0=
