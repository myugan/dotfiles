(function() {
  var Beautifier, Executable, Promise, _, fs, path, readFile, shellEnv, temp, which;

  Promise = require('bluebird');

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp').track();

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  path = require('path');

  shellEnv = require('shell-env');

  Executable = require('./executable');

  module.exports = Beautifier = (function() {

    /*
    Promise
     */
    Beautifier.prototype.Promise = Promise;


    /*
    Name of Beautifier
     */

    Beautifier.prototype.name = 'Beautifier';


    /*
    Supported Options
    
    Enable options for supported languages.
    - <string:language>:<boolean:all_options_enabled>
    - <string:language>:<string:option_key>:<boolean:enabled>
    - <string:language>:<string:option_key>:<string:rename>
    - <string:language>:<string:option_key>:<function:transform>
    - <string:language>:<string:option_key>:<array:mapper>
     */

    Beautifier.prototype.options = {};

    Beautifier.prototype.executables = [];


    /*
    Is the beautifier a command-line interface beautifier?
     */

    Beautifier.prototype.isPreInstalled = function() {
      return this.executables.length === 0;
    };

    Beautifier.prototype._exe = {};

    Beautifier.prototype.loadExecutables = function() {
      var executables;
      this.debug("Load executables");
      if (Object.keys(this._exe).length === this.executables.length) {
        return Promise.resolve(this._exe);
      } else {
        return Promise.resolve(executables = this.executables.map(function(e) {
          return new Executable(e);
        })).then(function(executables) {
          return Promise.all(executables.map(function(exe) {
            return exe.init();
          }));
        }).then((function(_this) {
          return function(es) {
            var exe, missingInstalls;
            _this.debug("Executables loaded", es);
            exe = {};
            missingInstalls = [];
            es.forEach(function(e) {
              exe[e.cmd] = e;
              if (!e.isInstalled && e.required) {
                return missingInstalls.push(e);
              }
            });
            _this._exe = exe;
            _this.debug("exe", exe);
            if (missingInstalls.length === 0) {
              return _this._exe;
            } else {
              _this.debug("Missing required executables: " + (missingInstalls.map(function(e) {
                return e.cmd;
              }).join(' and ')) + ".");
              throw Executable.commandNotFoundError(missingInstalls[0].cmd);
            }
          };
        })(this))["catch"]((function(_this) {
          return function(error) {
            _this.debug("Error loading executables", error);
            return Promise.reject(error);
          };
        })(this));
      }
    };

    Beautifier.prototype.exe = function(cmd) {
      var e;
      console.log('exe', cmd, this._exe);
      e = this._exe[cmd];
      if (e == null) {
        throw Executable.commandNotFoundError(cmd);
      }
      return e;
    };


    /*
    Supported languages by this Beautifier
    
    Extracted from the keys of the `options` field.
     */

    Beautifier.prototype.languages = null;


    /*
    Beautify text
    
    Override this method in subclasses
     */

    Beautifier.prototype.beautify = null;


    /*
    Show deprecation warning to user.
     */

    Beautifier.prototype.deprecate = function(warning) {
      var ref;
      return (ref = atom.notifications) != null ? ref.addWarning(warning) : void 0;
    };

    Beautifier.prototype.deprecateOptionForExecutable = function(exeName, oldOption, newOption) {
      var deprecationMessage;
      deprecationMessage = "The \"" + oldOption + "\" configuration option has been deprecated. Please switch to using the option in section \"Executables\" (near the top) in subsection \"" + exeName + "\" labelled \"" + newOption + "\" in Atom-Beautify package settings.";
      return this.deprecate(deprecationMessage);
    };


    /*
    Create temporary file
     */

    Beautifier.prototype.tempFile = function(name, contents, ext) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      if (ext == null) {
        ext = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open({
            prefix: name,
            suffix: ext
          }, function(err, info) {
            _this.debug('tempFile', name, err, info);
            if (err) {
              return reject(err);
            }
            return fs.write(info.fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(info.fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(info.path);
              });
            });
          });
        };
      })(this));
    };


    /*
    Read file
     */

    Beautifier.prototype.readFile = function(filePath) {
      return Promise.resolve(filePath).then(function(filePath) {
        return readFile(filePath, "utf8");
      });
    };


    /*
    Find file
     */

    Beautifier.prototype.findFile = function(startDir, fileNames) {
      var currentDir, fileName, filePath, i, len;
      if (!arguments.length) {
        throw new Error("Specify file names to find.");
      }
      if (!(fileNames instanceof Array)) {
        fileNames = [fileNames];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length) {
        currentDir = startDir.join(path.sep);
        for (i = 0, len = fileNames.length; i < len; i++) {
          fileName = fileNames[i];
          filePath = path.join(currentDir, fileName);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (error1) {}
        }
        startDir.pop();
      }
      return null;
    };

    Beautifier.prototype.getDefaultLineEnding = function(crlf, lf, optionEol) {
      if (!optionEol || optionEol === 'System Default') {
        optionEol = atom.config.get('line-ending-selector.defaultLineEnding');
      }
      switch (optionEol) {
        case 'LF':
          return lf;
        case 'CRLF':
          return crlf;
        case 'OS Default':
          if (process.platform === 'win32') {
            return crlf;
          } else {
            return lf;
          }
        default:
          return lf;
      }
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Beautifier.prototype.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      return Executable.which(exe, options);
    };


    /*
    Run command-line interface command
     */

    Beautifier.prototype.run = function(executable, args, arg) {
      var cwd, exe, help, ignoreReturnCode, onStdin, ref;
      ref = arg != null ? arg : {}, cwd = ref.cwd, ignoreReturnCode = ref.ignoreReturnCode, help = ref.help, onStdin = ref.onStdin;
      exe = new Executable({
        name: this.name,
        homepage: this.link,
        installation: this.link,
        cmd: executable
      });
      if (help == null) {
        help = {
          program: executable,
          link: this.link,
          pathOption: void 0
        };
      }
      return exe.run(args, {
        cwd: cwd,
        ignoreReturnCode: ignoreReturnCode,
        help: help,
        onStdin: onStdin
      });
    };


    /*
    Logger instance
     */

    Beautifier.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Beautifier.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(__filename);
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " beautifier logger has been initialized.");
    };


    /*
    Constructor to setup beautifer
     */

    function Beautifier() {
      var globalOptions, lang, options, ref;
      this.setupLogger();
      if (this.options._ != null) {
        globalOptions = this.options._;
        delete this.options._;
        if (typeof globalOptions === "object") {
          ref = this.options;
          for (lang in ref) {
            options = ref[lang];
            if (typeof options === "boolean") {
              if (options === true) {
                this.options[lang] = globalOptions;
              }
            } else if (typeof options === "object") {
              this.options[lang] = _.merge(globalOptions, options);
            } else {
              this.warn(("Unsupported options type " + (typeof options) + " for language " + lang + ": ") + options);
            }
          }
        }
      }
      this.verbose("Options for " + this.name + ":", this.options);
      this.languages = _.keys(this.options);
    }

    return Beautifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFDVixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQTs7RUFDUCxRQUFBLEdBQVcsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsRUFBRSxDQUFDLFFBQXJCOztFQUNYLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsUUFBQSxHQUFXLE9BQUEsQ0FBUSxXQUFSOztFQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7QUFFckI7Ozt5QkFHQSxPQUFBLEdBQVM7OztBQUVUOzs7O3lCQUdBLElBQUEsR0FBTTs7O0FBRU47Ozs7Ozs7Ozs7O3lCQVVBLE9BQUEsR0FBUzs7eUJBRVQsV0FBQSxHQUFhOzs7QUFFYjs7Ozt5QkFHQSxjQUFBLEdBQWdCLFNBQUE7YUFDZCxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsS0FBdUI7SUFEVDs7eUJBR2hCLElBQUEsR0FBTTs7eUJBQ04sZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sa0JBQVA7TUFDQSxJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQyxDQUFBLElBQWIsQ0FBa0IsQ0FBQyxNQUFuQixLQUE2QixJQUFDLENBQUEsV0FBVyxDQUFDLE1BQTdDO2VBQ0UsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBQyxDQUFB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T0FBUSxDQUFBLElBQUEsQ0FBVCxHQUFpQixjQURuQjtlQURGO2FBQUEsTUFHSyxJQUFHLE9BQU8sT0FBUCxLQUFrQixRQUFyQjtjQUNILElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCLENBQUMsQ0FBQyxLQUFGLENBQVEsYUFBUixFQUF1QixPQUF2QixFQURkO2FBQUEsTUFBQTtjQUdILElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBQSwyQkFBQSxHQUEyQixDQUFDLE9BQU8sT0FBUixDQUEzQixHQUEyQyxnQkFBM0MsR0FBMkQsSUFBM0QsR0FBZ0UsSUFBaEUsQ0FBQSxHQUFxRSxPQUEzRSxFQUhHOztBQUxQLFdBRkY7U0FKRjs7TUFlQSxJQUFDLENBQUEsT0FBRCxDQUFTLGNBQUEsR0FBZSxJQUFDLENBQUEsSUFBaEIsR0FBcUIsR0FBOUIsRUFBa0MsSUFBQyxDQUFBLE9BQW5DO01BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSO0lBckJGOzs7OztBQTNOZiIsInNvdXJjZXNDb250ZW50IjpbIlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbmZzID0gcmVxdWlyZSgnZnMnKVxudGVtcCA9IHJlcXVpcmUoJ3RlbXAnKS50cmFjaygpXG5yZWFkRmlsZSA9IFByb21pc2UucHJvbWlzaWZ5KGZzLnJlYWRGaWxlKVxud2hpY2ggPSByZXF1aXJlKCd3aGljaCcpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5zaGVsbEVudiA9IHJlcXVpcmUoJ3NoZWxsLWVudicpXG5FeGVjdXRhYmxlID0gcmVxdWlyZSgnLi9leGVjdXRhYmxlJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCZWF1dGlmaWVyXG5cbiAgIyMjXG4gIFByb21pc2VcbiAgIyMjXG4gIFByb21pc2U6IFByb21pc2VcblxuICAjIyNcbiAgTmFtZSBvZiBCZWF1dGlmaWVyXG4gICMjI1xuICBuYW1lOiAnQmVhdXRpZmllcidcblxuICAjIyNcbiAgU3VwcG9ydGVkIE9wdGlvbnNcblxuICBFbmFibGUgb3B0aW9ucyBmb3Igc3VwcG9ydGVkIGxhbmd1YWdlcy5cbiAgLSA8c3RyaW5nOmxhbmd1YWdlPjo8Ym9vbGVhbjphbGxfb3B0aW9uc19lbmFibGVkPlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+OjxzdHJpbmc6b3B0aW9uX2tleT46PGJvb2xlYW46ZW5hYmxlZD5cbiAgLSA8c3RyaW5nOmxhbmd1YWdlPjo8c3RyaW5nOm9wdGlvbl9rZXk+OjxzdHJpbmc6cmVuYW1lPlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+OjxzdHJpbmc6b3B0aW9uX2tleT46PGZ1bmN0aW9uOnRyYW5zZm9ybT5cbiAgLSA8c3RyaW5nOmxhbmd1YWdlPjo8c3RyaW5nOm9wdGlvbl9rZXk+OjxhcnJheTptYXBwZXI+XG4gICMjI1xuICBvcHRpb25zOiB7fVxuXG4gIGV4ZWN1dGFibGVzOiBbXVxuXG4gICMjI1xuICBJcyB0aGUgYmVhdXRpZmllciBhIGNvbW1hbmQtbGluZSBpbnRlcmZhY2UgYmVhdXRpZmllcj9cbiAgIyMjXG4gIGlzUHJlSW5zdGFsbGVkOiAoKSAtPlxuICAgIEBleGVjdXRhYmxlcy5sZW5ndGggaXMgMFxuXG4gIF9leGU6IHt9XG4gIGxvYWRFeGVjdXRhYmxlczogKCkgLT5cbiAgICBAZGVidWcoXCJMb2FkIGV4ZWN1dGFibGVzXCIpXG4gICAgaWYgT2JqZWN0LmtleXMoQF9leGUpLmxlbmd0aCBpcyBAZXhlY3V0YWJsZXMubGVuZ3RoXG4gICAgICBQcm9taXNlLnJlc29sdmUoQF9leGUpXG4gICAgZWxzZVxuICAgICAgUHJvbWlzZS5yZXNvbHZlKGV4ZWN1dGFibGVzID0gQGV4ZWN1dGFibGVzLm1hcCgoZSkgLT4gbmV3IEV4ZWN1dGFibGUoZSkpKVxuICAgICAgICAudGhlbigoZXhlY3V0YWJsZXMpIC0+IFByb21pc2UuYWxsKGV4ZWN1dGFibGVzLm1hcCgoZXhlKSAtPiBleGUuaW5pdCgpKSkpXG4gICAgICAgIC50aGVuKChlcykgPT5cbiAgICAgICAgICBAZGVidWcoXCJFeGVjdXRhYmxlcyBsb2FkZWRcIiwgZXMpXG4gICAgICAgICAgZXhlID0ge31cbiAgICAgICAgICBtaXNzaW5nSW5zdGFsbHMgPSBbXVxuICAgICAgICAgIGVzLmZvckVhY2goKGUpIC0+XG4gICAgICAgICAgICBleGVbZS5jbWRdID0gZVxuICAgICAgICAgICAgaWYgbm90IGUuaXNJbnN0YWxsZWQgYW5kIGUucmVxdWlyZWRcbiAgICAgICAgICAgICAgbWlzc2luZ0luc3RhbGxzLnB1c2goZSlcbiAgICAgICAgICApXG4gICAgICAgICAgQF9leGUgPSBleGVcbiAgICAgICAgICBAZGVidWcoXCJleGVcIiwgZXhlKVxuICAgICAgICAgIGlmIG1pc3NpbmdJbnN0YWxscy5sZW5ndGggaXMgMFxuICAgICAgICAgICAgcmV0dXJuIEBfZXhlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRlYnVnKFwiTWlzc2luZyByZXF1aXJlZCBleGVjdXRhYmxlczogI3ttaXNzaW5nSW5zdGFsbHMubWFwKChlKSAtPiBlLmNtZCkuam9pbignIGFuZCAnKX0uXCIpXG4gICAgICAgICAgICB0aHJvdyBFeGVjdXRhYmxlLmNvbW1hbmROb3RGb3VuZEVycm9yKG1pc3NpbmdJbnN0YWxsc1swXS5jbWQpXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgICBAZGVidWcoXCJFcnJvciBsb2FkaW5nIGV4ZWN1dGFibGVzXCIsIGVycm9yKVxuICAgICAgICAgIFByb21pc2UucmVqZWN0KGVycm9yKVxuICAgICAgICApXG4gIGV4ZTogKGNtZCkgLT5cbiAgICBjb25zb2xlLmxvZygnZXhlJywgY21kLCBAX2V4ZSlcbiAgICBlID0gQF9leGVbY21kXVxuICAgIGlmICFlP1xuICAgICAgdGhyb3cgRXhlY3V0YWJsZS5jb21tYW5kTm90Rm91bmRFcnJvcihjbWQpXG4gICAgZVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgbGFuZ3VhZ2VzIGJ5IHRoaXMgQmVhdXRpZmllclxuXG4gIEV4dHJhY3RlZCBmcm9tIHRoZSBrZXlzIG9mIHRoZSBgb3B0aW9uc2AgZmllbGQuXG4gICMjI1xuICBsYW5ndWFnZXM6IG51bGxcblxuICAjIyNcbiAgQmVhdXRpZnkgdGV4dFxuXG4gIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGluIHN1YmNsYXNzZXNcbiAgIyMjXG4gIGJlYXV0aWZ5OiBudWxsXG5cbiAgIyMjXG4gIFNob3cgZGVwcmVjYXRpb24gd2FybmluZyB0byB1c2VyLlxuICAjIyNcbiAgZGVwcmVjYXRlOiAod2FybmluZykgLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZFdhcm5pbmcod2FybmluZylcblxuICBkZXByZWNhdGVPcHRpb25Gb3JFeGVjdXRhYmxlOiAoZXhlTmFtZSwgb2xkT3B0aW9uLCBuZXdPcHRpb24pIC0+XG4gICAgZGVwcmVjYXRpb25NZXNzYWdlID0gXCJUaGUgXFxcIiN7b2xkT3B0aW9ufVxcXCIgY29uZmlndXJhdGlvbiBvcHRpb24gaGFzIGJlZW4gZGVwcmVjYXRlZC4gUGxlYXNlIHN3aXRjaCB0byB1c2luZyB0aGUgb3B0aW9uIGluIHNlY3Rpb24gXFxcIkV4ZWN1dGFibGVzXFxcIiAobmVhciB0aGUgdG9wKSBpbiBzdWJzZWN0aW9uIFxcXCIje2V4ZU5hbWV9XFxcIiBsYWJlbGxlZCBcXFwiI3tuZXdPcHRpb259XFxcIiBpbiBBdG9tLUJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3MuXCJcbiAgICBAZGVwcmVjYXRlKGRlcHJlY2F0aW9uTWVzc2FnZSlcblxuICAjIyNcbiAgQ3JlYXRlIHRlbXBvcmFyeSBmaWxlXG4gICMjI1xuICB0ZW1wRmlsZTogKG5hbWUgPSBcImF0b20tYmVhdXRpZnktdGVtcFwiLCBjb250ZW50cyA9IFwiXCIsIGV4dCA9IFwiXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAjIGNyZWF0ZSB0ZW1wIGZpbGVcbiAgICAgIHRlbXAub3Blbih7cHJlZml4OiBuYW1lLCBzdWZmaXg6IGV4dH0sIChlcnIsIGluZm8pID0+XG4gICAgICAgIEBkZWJ1ZygndGVtcEZpbGUnLCBuYW1lLCBlcnIsIGluZm8pXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgZnMud3JpdGUoaW5mby5mZCwgY29udGVudHMsIChlcnIpIC0+XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICAgIGZzLmNsb3NlKGluZm8uZmQsIChlcnIpIC0+XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgICAgICByZXNvbHZlKGluZm8ucGF0aClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbiAgIyMjXG4gIFJlYWQgZmlsZVxuICAjIyNcbiAgcmVhZEZpbGU6IChmaWxlUGF0aCkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoZmlsZVBhdGgpXG4gICAgLnRoZW4oKGZpbGVQYXRoKSAtPlxuICAgICAgcmV0dXJuIHJlYWRGaWxlKGZpbGVQYXRoLCBcInV0ZjhcIilcbiAgICApXG5cbiAgIyMjXG4gIEZpbmQgZmlsZVxuICAjIyNcbiAgZmluZEZpbGU6IChzdGFydERpciwgZmlsZU5hbWVzKSAtPlxuICAgIHRocm93IG5ldyBFcnJvciBcIlNwZWNpZnkgZmlsZSBuYW1lcyB0byBmaW5kLlwiIHVubGVzcyBhcmd1bWVudHMubGVuZ3RoXG4gICAgdW5sZXNzIGZpbGVOYW1lcyBpbnN0YW5jZW9mIEFycmF5XG4gICAgICBmaWxlTmFtZXMgPSBbZmlsZU5hbWVzXVxuICAgIHN0YXJ0RGlyID0gc3RhcnREaXIuc3BsaXQocGF0aC5zZXApXG4gICAgd2hpbGUgc3RhcnREaXIubGVuZ3RoXG4gICAgICBjdXJyZW50RGlyID0gc3RhcnREaXIuam9pbihwYXRoLnNlcClcbiAgICAgIGZvciBmaWxlTmFtZSBpbiBmaWxlTmFtZXNcbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oY3VycmVudERpciwgZmlsZU5hbWUpXG4gICAgICAgIHRyeVxuICAgICAgICAgIGZzLmFjY2Vzc1N5bmMoZmlsZVBhdGgsIGZzLlJfT0spXG4gICAgICAgICAgcmV0dXJuIGZpbGVQYXRoXG4gICAgICBzdGFydERpci5wb3AoKVxuICAgIHJldHVybiBudWxsXG5cbiAgIyBSZXRyaWV2ZXMgdGhlIGRlZmF1bHQgbGluZSBlbmRpbmcgYmFzZWQgdXBvbiB0aGUgQXRvbSBjb25maWd1cmF0aW9uXG4gICMgIGBsaW5lLWVuZGluZy1zZWxlY3Rvci5kZWZhdWx0TGluZUVuZGluZ2AuIElmIHRoZSBBdG9tIGNvbmZpZ3VyYXRpb25cbiAgIyAgaW5kaWNhdGVzIFwiT1MgRGVmYXVsdFwiLCB0aGUgYHByb2Nlc3MucGxhdGZvcm1gIGlzIHF1ZXJpZWQsIHJldHVybmluZ1xuICAjICBDUkxGIGZvciBXaW5kb3dzIHN5c3RlbXMgYW5kIExGIGZvciBhbGwgb3RoZXIgc3lzdGVtcy5cbiAgIyBDb2RlIG1vZGlmaWVkIGZyb20gYXRvbS9saW5lLWVuZGluZy1zZWxlY3RvclxuICAjIHJldHVybnM6IFRoZSBjb3JyZWN0IGxpbmUtZW5kaW5nIGNoYXJhY3RlciBzZXF1ZW5jZSBiYXNlZCB1cG9uIHRoZSBBdG9tXG4gICMgIGNvbmZpZ3VyYXRpb24sIG9yIGBudWxsYCBpZiB0aGUgQXRvbSBsaW5lIGVuZGluZyBjb25maWd1cmF0aW9uIHdhcyBub3RcbiAgIyAgcmVjb2duaXplZC5cbiAgIyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2xpbmUtZW5kaW5nLXNlbGVjdG9yL2Jsb2IvbWFzdGVyL2xpYi9tYWluLmpzXG4gIGdldERlZmF1bHRMaW5lRW5kaW5nOiAoY3JsZixsZixvcHRpb25Fb2wpIC0+XG4gICAgaWYgKCFvcHRpb25Fb2wgfHwgb3B0aW9uRW9sID09ICdTeXN0ZW0gRGVmYXVsdCcpXG4gICAgICBvcHRpb25Fb2wgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbmUtZW5kaW5nLXNlbGVjdG9yLmRlZmF1bHRMaW5lRW5kaW5nJylcbiAgICBzd2l0Y2ggb3B0aW9uRW9sXG4gICAgICB3aGVuICdMRidcbiAgICAgICAgcmV0dXJuIGxmXG4gICAgICB3aGVuICdDUkxGJ1xuICAgICAgICByZXR1cm4gY3JsZlxuICAgICAgd2hlbiAnT1MgRGVmYXVsdCdcbiAgICAgICAgcmV0dXJuIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJyB0aGVuIGNybGYgZWxzZSBsZlxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbGZcblxuICAjIyNcbiAgTGlrZSB0aGUgdW5peCB3aGljaCB1dGlsaXR5LlxuXG4gIEZpbmRzIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhIHNwZWNpZmllZCBleGVjdXRhYmxlIGluIHRoZSBQQVRIIGVudmlyb25tZW50IHZhcmlhYmxlLlxuICBEb2VzIG5vdCBjYWNoZSB0aGUgcmVzdWx0cyxcbiAgc28gaGFzaCAtciBpcyBub3QgbmVlZGVkIHdoZW4gdGhlIFBBVEggY2hhbmdlcy5cbiAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS13aGljaFxuICAjIyNcbiAgd2hpY2g6IChleGUsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICAjIEBkZXByZWNhdGUoXCJCZWF1dGlmaWVyLndoaWNoIGZ1bmN0aW9uIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRXhlY3V0YWJsZXMuXCIpXG4gICAgRXhlY3V0YWJsZS53aGljaChleGUsIG9wdGlvbnMpXG5cbiAgIyMjXG4gIFJ1biBjb21tYW5kLWxpbmUgaW50ZXJmYWNlIGNvbW1hbmRcbiAgIyMjXG4gIHJ1bjogKGV4ZWN1dGFibGUsIGFyZ3MsIHtjd2QsIGlnbm9yZVJldHVybkNvZGUsIGhlbHAsIG9uU3RkaW59ID0ge30pIC0+XG4gICAgIyBAZGVwcmVjYXRlKFwiQmVhdXRpZmllci5ydW4gZnVuY3Rpb24gaGFzIGJlZW4gZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBFeGVjdXRhYmxlcy5cIilcbiAgICBleGUgPSBuZXcgRXhlY3V0YWJsZSh7XG4gICAgICBuYW1lOiBAbmFtZVxuICAgICAgaG9tZXBhZ2U6IEBsaW5rXG4gICAgICBpbnN0YWxsYXRpb246IEBsaW5rXG4gICAgICBjbWQ6IGV4ZWN1dGFibGVcbiAgICB9KVxuICAgIGhlbHAgPz0ge1xuICAgICAgcHJvZ3JhbTogZXhlY3V0YWJsZVxuICAgICAgbGluazogQGxpbmtcbiAgICAgIHBhdGhPcHRpb246IHVuZGVmaW5lZFxuICAgIH1cbiAgICBleGUucnVuKGFyZ3MsIHtjd2QsIGlnbm9yZVJldHVybkNvZGUsIGhlbHAsIG9uU3RkaW59KVxuXG4gICMjI1xuICBMb2dnZXIgaW5zdGFuY2VcbiAgIyMjXG4gIGxvZ2dlcjogbnVsbFxuICAjIyNcbiAgSW5pdGlhbGl6ZSBhbmQgY29uZmlndXJlIExvZ2dlclxuICAjIyNcbiAgc2V0dXBMb2dnZXI6IC0+XG4gICAgQGxvZ2dlciA9IHJlcXVpcmUoJy4uL2xvZ2dlcicpKF9fZmlsZW5hbWUpXG4gICAgIyBAdmVyYm9zZShAbG9nZ2VyKVxuICAgICMgTWVyZ2UgbG9nZ2VyIG1ldGhvZHMgaW50byBiZWF1dGlmaWVyIGNsYXNzXG4gICAgZm9yIGtleSwgbWV0aG9kIG9mIEBsb2dnZXJcbiAgICAgICMgQHZlcmJvc2Uoa2V5LCBtZXRob2QpXG4gICAgICBAW2tleV0gPSBtZXRob2RcbiAgICBAdmVyYm9zZShcIiN7QG5hbWV9IGJlYXV0aWZpZXIgbG9nZ2VyIGhhcyBiZWVuIGluaXRpYWxpemVkLlwiKVxuXG4gICMjI1xuICBDb25zdHJ1Y3RvciB0byBzZXR1cCBiZWF1dGlmZXJcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMgU2V0dXAgbG9nZ2VyXG4gICAgQHNldHVwTG9nZ2VyKClcbiAgICAjIEhhbmRsZSBnbG9iYWwgb3B0aW9uc1xuICAgIGlmIEBvcHRpb25zLl8/XG4gICAgICBnbG9iYWxPcHRpb25zID0gQG9wdGlvbnMuX1xuICAgICAgZGVsZXRlIEBvcHRpb25zLl9cbiAgICAgICMgT25seSBtZXJnZSBpZiBnbG9iYWxPcHRpb25zIGlzIGFuIG9iamVjdFxuICAgICAgaWYgdHlwZW9mIGdsb2JhbE9wdGlvbnMgaXMgXCJvYmplY3RcIlxuICAgICAgICAjIEl0ZXJhdGUgb3ZlciBhbGwgc3VwcG9ydGVkIGxhbmd1YWdlc1xuICAgICAgICBmb3IgbGFuZywgb3B0aW9ucyBvZiBAb3B0aW9uc1xuICAgICAgICAgICNcbiAgICAgICAgICBpZiB0eXBlb2Ygb3B0aW9ucyBpcyBcImJvb2xlYW5cIlxuICAgICAgICAgICAgaWYgb3B0aW9ucyBpcyB0cnVlXG4gICAgICAgICAgICAgIEBvcHRpb25zW2xhbmddID0gZ2xvYmFsT3B0aW9uc1xuICAgICAgICAgIGVsc2UgaWYgdHlwZW9mIG9wdGlvbnMgaXMgXCJvYmplY3RcIlxuICAgICAgICAgICAgQG9wdGlvbnNbbGFuZ10gPSBfLm1lcmdlKGdsb2JhbE9wdGlvbnMsIG9wdGlvbnMpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHdhcm4oXCJVbnN1cHBvcnRlZCBvcHRpb25zIHR5cGUgI3t0eXBlb2Ygb3B0aW9uc30gZm9yIGxhbmd1YWdlICN7bGFuZ306IFwiKyBvcHRpb25zKVxuICAgIEB2ZXJib3NlKFwiT3B0aW9ucyBmb3IgI3tAbmFtZX06XCIsIEBvcHRpb25zKVxuICAgICMgU2V0IHN1cHBvcnRlZCBsYW5ndWFnZXNcbiAgICBAbGFuZ3VhZ2VzID0gXy5rZXlzKEBvcHRpb25zKVxuIl19
