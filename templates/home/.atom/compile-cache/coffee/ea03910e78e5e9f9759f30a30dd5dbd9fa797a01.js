(function() {
  var Executable, HybridExecutable, Promise, _, fs, os, parentConfigKey, path, semver, spawn, which,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Promise = require('bluebird');

  _ = require('lodash');

  which = require('which');

  spawn = require('child_process').spawn;

  path = require('path');

  semver = require('semver');

  os = require('os');

  fs = require('fs');

  parentConfigKey = "atom-beautify.executables";

  Executable = (function() {
    var isInstalled, version;

    Executable.prototype.name = null;

    Executable.prototype.cmd = null;

    Executable.prototype.key = null;

    Executable.prototype.homepage = null;

    Executable.prototype.installation = null;

    Executable.prototype.versionArgs = ['--version'];

    Executable.prototype.versionParse = function(text) {
      return semver.clean(text);
    };

    Executable.prototype.versionRunOptions = {};

    Executable.prototype.versionsSupported = '>= 0.0.0';

    Executable.prototype.required = true;

    function Executable(options) {
      var versionOptions;
      if (options.cmd == null) {
        throw new Error("The command (i.e. cmd property) is required for an Executable.");
      }
      this.name = options.name;
      this.cmd = options.cmd;
      this.key = this.cmd;
      this.homepage = options.homepage;
      this.installation = options.installation;
      this.required = !options.optional;
      if (options.version != null) {
        versionOptions = options.version;
        if (versionOptions.args) {
          this.versionArgs = versionOptions.args;
        }
        if (versionOptions.parse) {
          this.versionParse = versionOptions.parse;
        }
        if (versionOptions.runOptions) {
          this.versionRunOptions = versionOptions.runOptions;
        }
        if (versionOptions.supported) {
          this.versionsSupported = versionOptions.supported;
        }
      }
      this.setupLogger();
    }

    Executable.prototype.init = function() {
      return Promise.all([this.loadVersion()]).then((function(_this) {
        return function() {
          return _this.verbose("Done init of " + _this.name);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };


    /*
    Logger instance
     */

    Executable.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Executable.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(this.name + " Executable");
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " executable logger has been initialized.");
    };

    isInstalled = null;

    version = null;

    Executable.prototype.loadVersion = function(force) {
      if (force == null) {
        force = false;
      }
      this.verbose("loadVersion", this.version, force);
      if (force || (this.version == null)) {
        this.verbose("Loading version without cache");
        return this.runVersion().then((function(_this) {
          return function(text) {
            return _this.saveVersion(text);
          };
        })(this));
      } else {
        this.verbose("Loading cached version");
        return Promise.resolve(this.version);
      }
    };

    Executable.prototype.runVersion = function() {
      return this.run(this.versionArgs, this.versionRunOptions).then((function(_this) {
        return function(version) {
          _this.info("Version text: " + version);
          return version;
        };
      })(this));
    };

    Executable.prototype.saveVersion = function(text) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.versionParse(text);
        };
      })(this)).then(function(version) {
        var valid;
        valid = Boolean(semver.valid(version));
        if (!valid) {
          throw new Error("Version is not valid: " + version);
        }
        return version;
      }).then((function(_this) {
        return function(version) {
          _this.isInstalled = true;
          return _this.version = version;
        };
      })(this)).then((function(_this) {
        return function(version) {
          _this.info(_this.cmd + " version: " + version);
          return version;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          var help;
          _this.isInstalled = false;
          _this.error(error);
          help = {
            program: _this.cmd,
            link: _this.installation || _this.homepage,
            pathOption: "Executable - " + (_this.name || _this.cmd) + " - Path"
          };
          return Promise.reject(_this.commandNotFoundError(_this.name || _this.cmd, help));
        };
      })(this));
    };

    Executable.prototype.isSupported = function() {
      return this.isVersion(this.versionsSupported);
    };

    Executable.prototype.isVersion = function(range) {
      return this.versionSatisfies(this.version, range);
    };

    Executable.prototype.versionSatisfies = function(version, range) {
      return semver.satisfies(version, range);
    };

    Executable.prototype.getConfig = function() {
      return (typeof atom !== "undefined" && atom !== null ? atom.config.get(parentConfigKey + "." + this.key) : void 0) || {};
    };


    /*
    Run command-line interface command
     */

    Executable.prototype.run = function(args, options) {
      var cmd, cwd, exeName, help, ignoreReturnCode, onStdin, returnStderr, returnStdoutOrStderr;
      if (options == null) {
        options = {};
      }
      this.debug("Run: ", this.cmd, args, options);
      cmd = options.cmd, cwd = options.cwd, ignoreReturnCode = options.ignoreReturnCode, help = options.help, onStdin = options.onStdin, returnStderr = options.returnStderr, returnStdoutOrStderr = options.returnStdoutOrStderr;
      exeName = cmd || this.cmd;
      if (cwd == null) {
        cwd = os.tmpdir();
      }
      if (help == null) {
        help = {
          program: this.cmd,
          link: this.installation || this.homepage,
          pathOption: "Executable - " + (this.name || this.cmd) + " - Path"
        };
      }
      return Promise.all([this.shellEnv(), this.resolveArgs(args)]).then((function(_this) {
        return function(arg1) {
          var args, env, exePath;
          env = arg1[0], args = arg1[1];
          _this.debug('exeName, args:', exeName, args);
          exePath = _this.path(exeName);
          return Promise.all([exeName, args, env, exePath]);
        };
      })(this)).then((function(_this) {
        return function(arg1) {
          var args, env, exe, exeName, exePath, spawnOptions;
          exeName = arg1[0], args = arg1[1], env = arg1[2], exePath = arg1[3];
          _this.debug('exePath:', exePath);
          _this.debug('env:', env);
          _this.debug('PATH:', env.PATH);
          _this.debug('args', args);
          args = _this.relativizePaths(args);
          _this.debug('relativized args', args);
          exe = exePath != null ? exePath : exeName;
          spawnOptions = {
            cwd: cwd,
            env: env
          };
          _this.debug('spawnOptions', spawnOptions);
          return _this.spawn(exe, args, spawnOptions, onStdin).then(function(arg2) {
            var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
            returnCode = arg2.returnCode, stdout = arg2.stdout, stderr = arg2.stderr;
            _this.verbose('spawn result, returnCode', returnCode);
            _this.verbose('spawn result, stdout', stdout);
            _this.verbose('spawn result, stderr', stderr);
            if (!ignoreReturnCode && returnCode !== 0) {
              windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
              _this.verbose(stderr, windowsProgramNotFoundMsg);
              if (_this.isWindows() && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                throw _this.commandNotFoundError(exeName, help);
              } else {
                throw new Error(stderr || stdout);
              }
            } else {
              if (returnStdoutOrStderr) {
                return stdout || stderr;
              } else if (returnStderr) {
                return stderr;
              } else {
                return stdout;
              }
            }
          })["catch"](function(err) {
            _this.debug('error', err);
            if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
              throw _this.commandNotFoundError(exeName, help);
            } else {
              throw err;
            }
          });
        };
      })(this));
    };

    Executable.prototype.path = function(cmd) {
      var config, exeName;
      if (cmd == null) {
        cmd = this.cmd;
      }
      config = this.getConfig();
      if (config && config.path) {
        return Promise.resolve(config.path);
      } else {
        exeName = cmd;
        return this.which(exeName);
      }
    };

    Executable.prototype.resolveArgs = function(args) {
      args = _.flatten(args);
      return Promise.all(args);
    };

    Executable.prototype.relativizePaths = function(args) {
      var newArgs, tmpDir;
      tmpDir = os.tmpdir();
      newArgs = args.map(function(arg) {
        var isTmpFile;
        isTmpFile = typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && path.dirname(arg).startsWith(tmpDir);
        if (isTmpFile) {
          return path.relative(tmpDir, arg);
        }
        return arg;
      });
      return newArgs;
    };


    /*
    Spawn
     */

    Executable.prototype.spawn = function(exe, args, options, onStdin) {
      args = _.without(args, void 0);
      args = _.without(args, null);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('close', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
          if (onStdin) {
            return onStdin(cmd.stdin);
          }
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Executable.prototype.commandNotFoundError = function(exe, help) {
      if (exe == null) {
        exe = this.name || this.cmd;
      }
      return this.constructor.commandNotFoundError(exe, help);
    };

    Executable.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          docsLink = "https://github.com/Glavin001/atom-beautify#beautifiers";
          helpStr = "See " + exe + " installation instructions at " + docsLink + (help.link ? ' or go to ' + help.link : '') + "\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          helpStr += "Your program is properly installed if running '" + (this.isWindows() ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows() ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable.\n";
          if (help.additional) {
            helpStr += help.additional;
          }
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };

    Executable._envCache = null;

    Executable.prototype.shellEnv = function() {
      var env;
      env = this.constructor.shellEnv();
      this.debug("env", env);
      return env;
    };

    Executable.shellEnv = function() {
      return Promise.resolve(process.env);
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Executable.prototype.which = function(exe, options) {
      return this.constructor.which(exe, options);
    };

    Executable._whichCache = {};

    Executable.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      if (this._whichCache[exe]) {
        return Promise.resolve(this._whichCache[exe]);
      }
      return this.shellEnv().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var i, ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows()) {
              if (!options.path) {
                for (i in env) {
                  if (i.toLowerCase() === "path") {
                    options.path = env[i];
                    break;
                  }
                }
              }
              if (options.pathExt == null) {
                options.pathExt = ((ref = process.env.PATHEXT) != null ? ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                return resolve(exe);
              }
              _this._whichCache[exe] = path;
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    If platform is Windows
     */

    Executable.prototype.isWindows = function() {
      return this.constructor.isWindows();
    };

    Executable.isWindows = function() {
      return new RegExp('^win').test(process.platform);
    };

    return Executable;

  })();

  HybridExecutable = (function(superClass) {
    extend(HybridExecutable, superClass);

    HybridExecutable.prototype.dockerOptions = {
      image: void 0,
      workingDir: "/workdir"
    };

    function HybridExecutable(options) {
      HybridExecutable.__super__.constructor.call(this, options);
      this.verbose("HybridExecutable Options", options);
      if (options.docker != null) {
        this.dockerOptions = Object.assign({}, this.dockerOptions, options.docker);
        this.docker = this.constructor.dockerExecutable();
      }
    }

    HybridExecutable.docker = void 0;

    HybridExecutable.dockerExecutable = function() {
      if (this.docker == null) {
        this.docker = new Executable({
          name: "Docker",
          cmd: "docker",
          homepage: "https://www.docker.com/",
          installation: "https://www.docker.com/get-docker",
          version: {
            parse: function(text) {
              return text.match(/version [0]*([1-9]\d*).[0]*([0-9]\d*).[0]*([0-9]\d*)/).slice(1).join('.');
            }
          }
        });
      }
      return this.docker;
    };

    HybridExecutable.prototype.installedWithDocker = false;

    HybridExecutable.prototype.init = function() {
      return HybridExecutable.__super__.init.call(this).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (_this.docker == null) {
            return Promise.reject(error);
          }
          return Promise.resolve(error);
        };
      })(this)).then((function(_this) {
        return function(errorOrThis) {
          var shouldTryWithDocker;
          shouldTryWithDocker = !_this.isInstalled && (_this.docker != null);
          _this.verbose("Executable shouldTryWithDocker", shouldTryWithDocker, _this.isInstalled, _this.docker != null);
          if (shouldTryWithDocker) {
            return _this.initDocker()["catch"](function() {
              return Promise.reject(errorOrThis);
            });
          }
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };

    HybridExecutable.prototype.initDocker = function() {
      return this.docker.init().then((function(_this) {
        return function() {
          return _this.runImage(_this.versionArgs, _this.versionRunOptions);
        };
      })(this)).then((function(_this) {
        return function(text) {
          return _this.saveVersion(text);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.installedWithDocker = true;
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(dockerError) {
          _this.debug(dockerError);
          return Promise.reject(dockerError);
        };
      })(this));
    };

    HybridExecutable.prototype.run = function(args, options) {
      if (options == null) {
        options = {};
      }
      this.verbose("Running HybridExecutable");
      this.verbose("installedWithDocker", this.installedWithDocker);
      this.verbose("docker", this.docker);
      this.verbose("docker.isInstalled", this.docker && this.docker.isInstalled);
      if (this.installedWithDocker && this.docker && this.docker.isInstalled) {
        return this.runImage(args, options);
      }
      return HybridExecutable.__super__.run.call(this, args, options);
    };

    HybridExecutable.prototype.runImage = function(args, options) {
      this.debug("Run Docker executable: ", args, options);
      return this.resolveArgs(args).then((function(_this) {
        return function(args) {
          var cwd, image, newArgs, pwd, rootPath, tmpDir, workingDir;
          cwd = options.cwd;
          tmpDir = os.tmpdir();
          pwd = fs.realpathSync(cwd || tmpDir);
          image = _this.dockerOptions.image;
          workingDir = _this.dockerOptions.workingDir;
          rootPath = '/mountedRoot';
          newArgs = args.map(function(arg) {
            if (typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && !path.dirname(arg).startsWith(tmpDir)) {
              return path.join(rootPath, arg);
            } else {
              return arg;
            }
          });
          return _this.docker.run(["run", "--rm", "--volume", pwd + ":" + workingDir, "--volume", (path.resolve('/')) + ":" + rootPath, "--workdir", workingDir, image, newArgs], Object.assign({}, options, {
            cmd: void 0
          }));
        };
      })(this));
    };

    return HybridExecutable;

  })(Executable);

  module.exports = HybridExecutable;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZXhlY3V0YWJsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUE7OztFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFDVixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDOztFQUNqQyxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUNULEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBRUwsZUFBQSxHQUFrQjs7RUFHWjtBQUVKLFFBQUE7O3lCQUFBLElBQUEsR0FBTTs7eUJBQ04sR0FBQSxHQUFLOzt5QkFDTCxHQUFBLEdBQUs7O3lCQUNMLFFBQUEsR0FBVTs7eUJBQ1YsWUFBQSxHQUFjOzt5QkFDZCxXQUFBLEdBQWEsQ0FBQyxXQUFEOzt5QkFDYixZQUFBLEdBQWMsU0FBQyxJQUFEO2FBQVUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxJQUFiO0lBQVY7O3lCQUNkLGlCQUFBLEdBQW1COzt5QkFDbkIsaUJBQUEsR0FBbUI7O3lCQUNuQixRQUFBLEdBQVU7O0lBRUcsb0JBQUMsT0FBRDtBQUVYLFVBQUE7TUFBQSxJQUFJLG1CQUFKO0FBQ0UsY0FBTSxJQUFJLEtBQUosQ0FBVSxnRUFBVixFQURSOztNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBTyxDQUFDO01BQ2hCLElBQUMsQ0FBQSxHQUFELEdBQU8sT0FBTyxDQUFDO01BQ2YsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUE7TUFDUixJQUFDLENB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UTs7OztLQXpFbUI7O0VBdUcvQixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQS9jakIiLCJzb3VyY2VzQ29udGVudCI6WyJQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG53aGljaCA9IHJlcXVpcmUoJ3doaWNoJylcbnNwYXduID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5zZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKVxub3MgPSByZXF1aXJlKCdvcycpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcblxucGFyZW50Q29uZmlnS2V5ID0gXCJhdG9tLWJlYXV0aWZ5LmV4ZWN1dGFibGVzXCJcblxuXG5jbGFzcyBFeGVjdXRhYmxlXG5cbiAgbmFtZTogbnVsbFxuICBjbWQ6IG51bGxcbiAga2V5OiBudWxsXG4gIGhvbWVwYWdlOiBudWxsXG4gIGluc3RhbGxhdGlvbjogbnVsbFxuICB2ZXJzaW9uQXJnczogWyctLXZlcnNpb24nXVxuICB2ZXJzaW9uUGFyc2U6ICh0ZXh0KSAtPiBzZW12ZXIuY2xlYW4odGV4dClcbiAgdmVyc2lvblJ1bk9wdGlvbnM6IHt9XG4gIHZlcnNpb25zU3VwcG9ydGVkOiAnPj0gMC4wLjAnXG4gIHJlcXVpcmVkOiB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgICMgVmFsaWRhdGlvblxuICAgIGlmICFvcHRpb25zLmNtZD9cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBjb21tYW5kIChpLmUuIGNtZCBwcm9wZXJ0eSkgaXMgcmVxdWlyZWQgZm9yIGFuIEV4ZWN1dGFibGUuXCIpXG4gICAgQG5hbWUgPSBvcHRpb25zLm5hbWVcbiAgICBAY21kID0gb3B0aW9ucy5jbWRcbiAgICBAa2V5ID0gQGNtZFxuICAgIEBob21lcGFnZSA9IG9wdGlvbnMuaG9tZXBhZ2VcbiAgICBAaW5zdGFsbGF0aW9uID0gb3B0aW9ucy5pbnN0YWxsYXRpb25cbiAgICBAcmVxdWlyZWQgPSBub3Qgb3B0aW9ucy5vcHRpb25hbFxuICAgIGlmIG9wdGlvbnMudmVyc2lvbj9cbiAgICAgIHZlcnNpb25PcHRpb25zID0gb3B0aW9ucy52ZXJzaW9uXG4gICAgICBAdmVyc2lvbkFyZ3MgPSB2ZXJzaW9uT3B0aW9ucy5hcmdzIGlmIHZlcnNpb25PcHRpb25zLmFyZ3NcbiAgICAgIEB2ZXJzaW9uUGFyc2UgPSB2ZXJzaW9uT3B0aW9ucy5wYXJzZSBpZiB2ZXJzaW9uT3B0aW9ucy5wYXJzZVxuICAgICAgQHZlcnNpb25SdW5PcHRpb25zID0gdmVyc2lvbk9wdGlvbnMucnVuT3B0aW9ucyBpZiB2ZXJzaW9uT3B0aW9ucy5ydW5PcHRpb25zXG4gICAgICBAdmVyc2lvbnNTdXBwb3J0ZWQgPSB2ZXJzaW9uT3B0aW9ucy5zdXBwb3J0ZWQgaWYgdmVyc2lvbk9wdGlvbnMuc3VwcG9ydGVkXG4gICAgQHNldHVwTG9nZ2VyKClcblxuICBpbml0OiAoKSAtPlxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIEBsb2FkVmVyc2lvbigpXG4gICAgXSlcbiAgICAgIC50aGVuKCgpID0+IEB2ZXJib3NlKFwiRG9uZSBpbml0IG9mICN7QG5hbWV9XCIpKVxuICAgICAgLnRoZW4oKCkgPT4gQClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIGlmIG5vdCBALnJlcXVpcmVkXG4gICAgICAgICAgQHZlcmJvc2UoXCJOb3QgcmVxdWlyZWRcIilcbiAgICAgICAgICBAXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgICAgIClcblxuICAjIyNcbiAgTG9nZ2VyIGluc3RhbmNlXG4gICMjI1xuICBsb2dnZXI6IG51bGxcbiAgIyMjXG4gIEluaXRpYWxpemUgYW5kIGNvbmZpZ3VyZSBMb2dnZXJcbiAgIyMjXG4gIHNldHVwTG9nZ2VyOiAtPlxuICAgIEBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKShcIiN7QG5hbWV9IEV4ZWN1dGFibGVcIilcbiAgICBmb3Iga2V5LCBtZXRob2Qgb2YgQGxvZ2dlclxuICAgICAgQFtrZXldID0gbWV0aG9kXG4gICAgQHZlcmJvc2UoXCIje0BuYW1lfSBleGVjdXRhYmxlIGxvZ2dlciBoYXMgYmVlbiBpbml0aWFsaXplZC5cIilcblxuICBpc0luc3RhbGxlZCA9IG51bGxcbiAgdmVyc2lvbiA9IG51bGxcbiAgbG9hZFZlcnNpb246IChmb3JjZSA9IGZhbHNlKSAtPlxuICAgIEB2ZXJib3NlKFwibG9hZFZlcnNpb25cIiwgQHZlcnNpb24sIGZvcmNlKVxuICAgIGlmIGZvcmNlIG9yICFAdmVyc2lvbj9cbiAgICAgIEB2ZXJib3NlKFwiTG9hZGluZyB2ZXJzaW9uIHdpdGhvdXQgY2FjaGVcIilcbiAgICAgIEBydW5WZXJzaW9uKClcbiAgICAgICAgLnRoZW4oKHRleHQpID0+IEBzYXZlVmVyc2lvbih0ZXh0KSlcbiAgICBlbHNlXG4gICAgICBAdmVyYm9zZShcIkxvYWRpbmcgY2FjaGVkIHZlcnNpb25cIilcbiAgICAgIFByb21pc2UucmVzb2x2ZShAdmVyc2lvbilcblxuICBydW5WZXJzaW9uOiAoKSAtPlxuICAgIEBydW4oQHZlcnNpb25BcmdzLCBAdmVyc2lvblJ1bk9wdGlvbnMpXG4gICAgICAudGhlbigodmVyc2lvbikgPT5cbiAgICAgICAgQGluZm8oXCJWZXJzaW9uIHRleHQ6IFwiICsgdmVyc2lvbilcbiAgICAgICAgdmVyc2lvblxuICAgICAgKVxuXG4gIHNhdmVWZXJzaW9uOiAodGV4dCkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oID0+IEB2ZXJzaW9uUGFyc2UodGV4dCkpXG4gICAgICAudGhlbigodmVyc2lvbikgLT5cbiAgICAgICAgdmFsaWQgPSBCb29sZWFuKHNlbXZlci52YWxpZCh2ZXJzaW9uKSlcbiAgICAgICAgaWYgbm90IHZhbGlkXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVmVyc2lvbiBpcyBub3QgdmFsaWQ6IFwiK3ZlcnNpb24pXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSA9PlxuICAgICAgICBAaXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgICAgIEB2ZXJzaW9uID0gdmVyc2lvblxuICAgICAgKVxuICAgICAgLnRoZW4oKHZlcnNpb24pID0+XG4gICAgICAgIEBpbmZvKFwiI3tAY21kfSB2ZXJzaW9uOiAje3ZlcnNpb259XCIpXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIEBpc0luc3RhbGxlZCA9IGZhbHNlXG4gICAgICAgIEBlcnJvcihlcnJvcilcbiAgICAgICAgaGVscCA9IHtcbiAgICAgICAgICBwcm9ncmFtOiBAY21kXG4gICAgICAgICAgbGluazogQGluc3RhbGxhdGlvbiBvciBAaG9tZXBhZ2VcbiAgICAgICAgICBwYXRoT3B0aW9uOiBcIkV4ZWN1dGFibGUgLSAje0BuYW1lIG9yIEBjbWR9IC0gUGF0aFwiXG4gICAgICAgIH1cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoQGNvbW1hbmROb3RGb3VuZEVycm9yKEBuYW1lIG9yIEBjbWQsIGhlbHApKVxuICAgICAgKVxuXG4gIGlzU3VwcG9ydGVkOiAoKSAtPlxuICAgIEBpc1ZlcnNpb24oQHZlcnNpb25zU3VwcG9ydGVkKVxuXG4gIGlzVmVyc2lvbjogKHJhbmdlKSAtPlxuICAgIEB2ZXJzaW9uU2F0aXNmaWVzKEB2ZXJzaW9uLCByYW5nZSlcblxuICB2ZXJzaW9uU2F0aXNmaWVzOiAodmVyc2lvbiwgcmFuZ2UpIC0+XG4gICAgc2VtdmVyLnNhdGlzZmllcyh2ZXJzaW9uLCByYW5nZSlcblxuICBnZXRDb25maWc6ICgpIC0+XG4gICAgYXRvbT8uY29uZmlnLmdldChcIiN7cGFyZW50Q29uZmlnS2V5fS4je0BrZXl9XCIpIG9yIHt9XG5cbiAgIyMjXG4gIFJ1biBjb21tYW5kLWxpbmUgaW50ZXJmYWNlIGNvbW1hbmRcbiAgIyMjXG4gIHJ1bjogKGFyZ3MsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZGVidWcoXCJSdW46IFwiLCBAY21kLCBhcmdzLCBvcHRpb25zKVxuICAgIHsgY21kLCBjd2QsIGlnbm9yZVJldHVybkNvZGUsIGhlbHAsIG9uU3RkaW4sIHJldHVyblN0ZGVyciwgcmV0dXJuU3Rkb3V0T3JTdGRlcnIgfSA9IG9wdGlvbnNcbiAgICBleGVOYW1lID0gY21kIG9yIEBjbWRcbiAgICBjd2QgPz0gb3MudG1wZGlyKClcbiAgICBoZWxwID89IHtcbiAgICAgIHByb2dyYW06IEBjbWRcbiAgICAgIGxpbms6IEBpbnN0YWxsYXRpb24gb3IgQGhvbWVwYWdlXG4gICAgICBwYXRoT3B0aW9uOiBcIkV4ZWN1dGFibGUgLSAje0BuYW1lIG9yIEBjbWR9IC0gUGF0aFwiXG4gICAgfVxuXG4gICAgIyBSZXNvbHZlIGV4ZWN1dGFibGUgYW5kIGFsbCBhcmdzXG4gICAgUHJvbWlzZS5hbGwoW0BzaGVsbEVudigpLCB0aGlzLnJlc29sdmVBcmdzKGFyZ3MpXSlcbiAgICAgIC50aGVuKChbZW52LCBhcmdzXSkgPT5cbiAgICAgICAgQGRlYnVnKCdleGVOYW1lLCBhcmdzOicsIGV4ZU5hbWUsIGFyZ3MpXG4gICAgICAgICMgR2V0IFBBVEggYW5kIG90aGVyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgICAgICBleGVQYXRoID0gQHBhdGgoZXhlTmFtZSlcbiAgICAgICAgUHJvbWlzZS5hbGwoW2V4ZU5hbWUsIGFyZ3MsIGVudiwgZXhlUGF0aF0pXG4gICAgICApXG4gICAgICAudGhlbigoW2V4ZU5hbWUsIGFyZ3MsIGVudiwgZXhlUGF0aF0pID0+XG4gICAgICAgIEBkZWJ1ZygnZXhlUGF0aDonLCBleGVQYXRoKVxuICAgICAgICBAZGVidWcoJ2VudjonLCBlbnYpXG4gICAgICAgIEBkZWJ1ZygnUEFUSDonLCBlbnYuUEFUSClcbiAgICAgICAgQGRlYnVnKCdhcmdzJywgYXJncylcbiAgICAgICAgYXJncyA9IHRoaXMucmVsYXRpdml6ZVBhdGhzKGFyZ3MpXG4gICAgICAgIEBkZWJ1ZygncmVsYXRpdml6ZWQgYXJncycsIGFyZ3MpXG5cbiAgICAgICAgZXhlID0gZXhlUGF0aCA/IGV4ZU5hbWVcbiAgICAgICAgc3Bhd25PcHRpb25zID0ge1xuICAgICAgICAgIGN3ZDogY3dkXG4gICAgICAgICAgZW52OiBlbnZcbiAgICAgICAgfVxuICAgICAgICBAZGVidWcoJ3NwYXduT3B0aW9ucycsIHNwYXduT3B0aW9ucylcblxuICAgICAgICBAc3Bhd24oZXhlLCBhcmdzLCBzcGF3bk9wdGlvbnMsIG9uU3RkaW4pXG4gICAgICAgICAgLnRoZW4oKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pID0+XG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCByZXR1cm5Db2RlJywgcmV0dXJuQ29kZSlcbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHN0ZG91dCcsIHN0ZG91dClcbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHN0ZGVycicsIHN0ZGVycilcblxuICAgICAgICAgICAgIyBJZiByZXR1cm4gY29kZSBpcyBub3QgMCB0aGVuIGVycm9yIG9jY3VyZWRcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVSZXR1cm5Db2RlIGFuZCByZXR1cm5Db2RlIGlzbnQgMFxuICAgICAgICAgICAgICAjIG9wZXJhYmxlIHByb2dyYW0gb3IgYmF0Y2ggZmlsZVxuICAgICAgICAgICAgICB3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnID0gXCJpcyBub3QgcmVjb2duaXplZCBhcyBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCBjb21tYW5kXCJcblxuICAgICAgICAgICAgICBAdmVyYm9zZShzdGRlcnIsIHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpXG5cbiAgICAgICAgICAgICAgaWYgQGlzV2luZG93cygpIGFuZCByZXR1cm5Db2RlIGlzIDEgYW5kIHN0ZGVyci5pbmRleE9mKHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpIGlzbnQgLTFcbiAgICAgICAgICAgICAgICB0aHJvdyBAY29tbWFuZE5vdEZvdW5kRXJyb3IoZXhlTmFtZSwgaGVscClcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdGRlcnIgb3Igc3Rkb3V0KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBpZiByZXR1cm5TdGRvdXRPclN0ZGVyclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQgb3Igc3RkZXJyXG4gICAgICAgICAgICAgIGVsc2UgaWYgcmV0dXJuU3RkZXJyXG4gICAgICAgICAgICAgICAgc3RkZXJyXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdGRvdXRcbiAgICAgICAgICApXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+XG4gICAgICAgICAgICBAZGVidWcoJ2Vycm9yJywgZXJyKVxuXG4gICAgICAgICAgICAjIENoZWNrIGlmIGVycm9yIGlzIEVOT0VOVCAoY29tbWFuZCBjb3VsZCBub3QgYmUgZm91bmQpXG4gICAgICAgICAgICBpZiBlcnIuY29kZSBpcyAnRU5PRU5UJyBvciBlcnIuZXJybm8gaXMgJ0VOT0VOVCdcbiAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICMgY29udGludWUgYXMgbm9ybWFsIGVycm9yXG4gICAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgIClcbiAgICAgIClcblxuICBwYXRoOiAoY21kID0gQGNtZCkgLT5cbiAgICBjb25maWcgPSBAZ2V0Q29uZmlnKClcbiAgICBpZiBjb25maWcgYW5kIGNvbmZpZy5wYXRoXG4gICAgICBQcm9taXNlLnJlc29sdmUoY29uZmlnLnBhdGgpXG4gICAgZWxzZVxuICAgICAgZXhlTmFtZSA9IGNtZFxuICAgICAgQHdoaWNoKGV4ZU5hbWUpXG5cbiAgcmVzb2x2ZUFyZ3M6IChhcmdzKSAtPlxuICAgIGFyZ3MgPSBfLmZsYXR0ZW4oYXJncylcbiAgICBQcm9taXNlLmFsbChhcmdzKVxuXG4gIHJlbGF0aXZpemVQYXRoczogKGFyZ3MpIC0+XG4gICAgdG1wRGlyID0gb3MudG1wZGlyKClcbiAgICBuZXdBcmdzID0gYXJncy5tYXAoKGFyZykgLT5cbiAgICAgIGlzVG1wRmlsZSA9ICh0eXBlb2YgYXJnIGlzICdzdHJpbmcnIGFuZCBub3QgYXJnLmluY2x1ZGVzKCc6JykgYW5kIFxcXG4gICAgICAgIHBhdGguaXNBYnNvbHV0ZShhcmcpIGFuZCBwYXRoLmRpcm5hbWUoYXJnKS5zdGFydHNXaXRoKHRtcERpcikpXG4gICAgICBpZiBpc1RtcEZpbGVcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodG1wRGlyLCBhcmcpXG4gICAgICByZXR1cm4gYXJnXG4gICAgKVxuICAgIG5ld0FyZ3NcblxuICAjIyNcbiAgU3Bhd25cbiAgIyMjXG4gIHNwYXduOiAoZXhlLCBhcmdzLCBvcHRpb25zLCBvblN0ZGluKSAtPlxuICAgICMgUmVtb3ZlIHVuZGVmaW5lZC9udWxsIHZhbHVlc1xuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgdW5kZWZpbmVkKVxuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgbnVsbClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQGRlYnVnKCdzcGF3bicsIGV4ZSwgYXJncylcblxuICAgICAgY21kID0gc3Bhd24oZXhlLCBhcmdzLCBvcHRpb25zKVxuICAgICAgc3Rkb3V0ID0gXCJcIlxuICAgICAgc3RkZXJyID0gXCJcIlxuXG4gICAgICBjbWQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZG91dCArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZGVyciArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQub24oJ2Nsb3NlJywgKHJldHVybkNvZGUpID0+XG4gICAgICAgIEBkZWJ1Zygnc3Bhd24gZG9uZScsIHJldHVybkNvZGUsIHN0ZGVyciwgc3Rkb3V0KVxuICAgICAgICByZXNvbHZlKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pXG4gICAgICApXG4gICAgICBjbWQub24oJ2Vycm9yJywgKGVycikgPT5cbiAgICAgICAgQGRlYnVnKCdlcnJvcicsIGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIClcblxuICAgICAgb25TdGRpbiBjbWQuc3RkaW4gaWYgb25TdGRpblxuICAgIClcblxuXG4gICMjI1xuICBBZGQgaGVscCB0byBlcnJvci5kZXNjcmlwdGlvblxuXG4gIE5vdGU6IGVycm9yLmRlc2NyaXB0aW9uIGlzIG5vdCBvZmZpY2lhbGx5IHVzZWQgaW4gSmF2YVNjcmlwdCxcbiAgaG93ZXZlciBpdCBpcyB1c2VkIGludGVybmFsbHkgZm9yIEF0b20gQmVhdXRpZnkgd2hlbiBkaXNwbGF5aW5nIGVycm9ycy5cbiAgIyMjXG4gIGNvbW1hbmROb3RGb3VuZEVycm9yOiAoZXhlLCBoZWxwKSAtPlxuICAgIGV4ZSA/PSBAbmFtZSBvciBAY21kXG4gICAgQGNvbnN0cnVjdG9yLmNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZSwgaGVscClcblxuICBAY29tbWFuZE5vdEZvdW5kRXJyb3I6IChleGUsIGhlbHApIC0+XG4gICAgIyBDcmVhdGUgbmV3IGltcHJvdmVkIGVycm9yXG4gICAgIyBub3RpZnkgdXNlciB0aGF0IGl0IG1heSBub3QgYmVcbiAgICAjIGluc3RhbGxlZCBvciBpbiBwYXRoXG4gICAgbWVzc2FnZSA9IFwiQ291bGQgbm90IGZpbmQgJyN7ZXhlfScuIFxcXG4gICAgICAgICAgICBUaGUgcHJvZ3JhbSBtYXkgbm90IGJlIGluc3RhbGxlZC5cIlxuICAgIGVyID0gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgZXIuY29kZSA9ICdDb21tYW5kTm90Rm91bmQnXG4gICAgZXIuZXJybm8gPSBlci5jb2RlXG4gICAgZXIuc3lzY2FsbCA9ICdiZWF1dGlmaWVyOjpydW4nXG4gICAgZXIuZmlsZSA9IGV4ZVxuICAgIGlmIGhlbHA/XG4gICAgICBpZiB0eXBlb2YgaGVscCBpcyBcIm9iamVjdFwiXG4gICAgICAgICMgQmFzaWMgbm90aWNlXG4gICAgICAgIGRvY3NMaW5rID0gXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkjYmVhdXRpZmllcnNcIlxuICAgICAgICBoZWxwU3RyID0gXCJTZWUgI3tleGV9IGluc3RhbGxhdGlvbiBpbnN0cnVjdGlvbnMgYXQgI3tkb2NzTGlua30je2lmIGhlbHAubGluayB0aGVuICgnIG9yIGdvIHRvICcraGVscC5saW5rKSBlbHNlICcnfVxcblwiXG4gICAgICAgICMgIyBIZWxwIHRvIGNvbmZpZ3VyZSBBdG9tIEJlYXV0aWZ5IGZvciBwcm9ncmFtJ3MgcGF0aFxuICAgICAgICBoZWxwU3RyICs9IFwiWW91IGNhbiBjb25maWd1cmUgQXRvbSBCZWF1dGlmeSBcXFxuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoIFxcXG4gICAgICAgICAgICAgICAgICAgIHRvICcje2hlbHAucHJvZ3JhbSBvciBleGV9JyBieSBzZXR0aW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICcje2hlbHAucGF0aE9wdGlvbn0nIGluIFxcXG4gICAgICAgICAgICAgICAgICAgIHRoZSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3MuXFxuXCIgaWYgaGVscC5wYXRoT3B0aW9uXG4gICAgICAgIGhlbHBTdHIgKz0gXCJZb3VyIHByb2dyYW0gaXMgcHJvcGVybHkgaW5zdGFsbGVkIGlmIHJ1bm5pbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnI3tpZiBAaXNXaW5kb3dzKCkgdGhlbiAnd2hlcmUuZXhlJyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJ3doaWNoJ30gI3tleGV9JyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHlvdXIgI3tpZiBAaXNXaW5kb3dzKCkgdGhlbiAnQ01EIHByb21wdCcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICdUZXJtaW5hbCd9IFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJucyBhbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBleGVjdXRhYmxlLlxcblwiXG4gICAgICAgICMgIyBPcHRpb25hbCwgYWRkaXRpb25hbCBoZWxwXG4gICAgICAgIGhlbHBTdHIgKz0gaGVscC5hZGRpdGlvbmFsIGlmIGhlbHAuYWRkaXRpb25hbFxuICAgICAgICBlci5kZXNjcmlwdGlvbiA9IGhlbHBTdHJcbiAgICAgIGVsc2UgI2lmIHR5cGVvZiBoZWxwIGlzIFwic3RyaW5nXCJcbiAgICAgICAgZXIuZGVzY3JpcHRpb24gPSBoZWxwXG4gICAgcmV0dXJuIGVyXG5cblxuICBAX2VudkNhY2hlID0gbnVsbFxuICBzaGVsbEVudjogKCkgLT5cbiAgICBlbnYgPSBAY29uc3RydWN0b3Iuc2hlbGxFbnYoKVxuICAgIEBkZWJ1ZyhcImVudlwiLCBlbnYpXG4gICAgcmV0dXJuIGVudlxuICBAc2hlbGxFbnY6ICgpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKHByb2Nlc3MuZW52KVxuXG4gICMjI1xuICBMaWtlIHRoZSB1bml4IHdoaWNoIHV0aWxpdHkuXG5cbiAgRmluZHMgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGEgc3BlY2lmaWVkIGV4ZWN1dGFibGUgaW4gdGhlIFBBVEggZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gIERvZXMgbm90IGNhY2hlIHRoZSByZXN1bHRzLFxuICBzbyBoYXNoIC1yIGlzIG5vdCBuZWVkZWQgd2hlbiB0aGUgUEFUSCBjaGFuZ2VzLlxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLXdoaWNoXG4gICMjI1xuICB3aGljaDogKGV4ZSwgb3B0aW9ucykgLT5cbiAgICBALmNvbnN0cnVjdG9yLndoaWNoKGV4ZSwgb3B0aW9ucylcbiAgQF93aGljaENhY2hlID0ge31cbiAgQHdoaWNoOiAoZXhlLCBvcHRpb25zID0ge30pIC0+XG4gICAgaWYgQF93aGljaENhY2hlW2V4ZV1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoQF93aGljaENhY2hlW2V4ZV0pXG4gICAgIyBHZXQgUEFUSCBhbmQgb3RoZXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgQHNoZWxsRW52KClcbiAgICAgIC50aGVuKChlbnYpID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgb3B0aW9ucy5wYXRoID89IGVudi5QQVRIXG4gICAgICAgICAgaWYgQGlzV2luZG93cygpXG4gICAgICAgICAgICAjIEVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZSBpbiB3aW5kb3dzXG4gICAgICAgICAgICAjIENoZWNrIGVudiBmb3IgYSBjYXNlLWluc2Vuc2l0aXZlICdwYXRoJyB2YXJpYWJsZVxuICAgICAgICAgICAgaWYgIW9wdGlvbnMucGF0aFxuICAgICAgICAgICAgICBmb3IgaSBvZiBlbnZcbiAgICAgICAgICAgICAgICBpZiBpLnRvTG93ZXJDYXNlKCkgaXMgXCJwYXRoXCJcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGF0aCA9IGVudltpXVxuICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgIyBUcmljayBub2RlLXdoaWNoIGludG8gaW5jbHVkaW5nIGZpbGVzXG4gICAgICAgICAgICAjIHdpdGggbm8gZXh0ZW5zaW9uIGFzIGV4ZWN1dGFibGVzLlxuICAgICAgICAgICAgIyBQdXQgZW1wdHkgZXh0ZW5zaW9uIGxhc3QgdG8gYWxsb3cgZm9yIG90aGVyIHJlYWwgZXh0ZW5zaW9ucyBmaXJzdFxuICAgICAgICAgICAgb3B0aW9ucy5wYXRoRXh0ID89IFwiI3twcm9jZXNzLmVudi5QQVRIRVhUID8gJy5FWEUnfTtcIlxuICAgICAgICAgIHdoaWNoKGV4ZSwgb3B0aW9ucywgKGVyciwgcGF0aCkgPT5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4ZSkgaWYgZXJyXG4gICAgICAgICAgICBAX3doaWNoQ2FjaGVbZXhlXSA9IHBhdGhcbiAgICAgICAgICAgIHJlc29sdmUocGF0aClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAjIyNcbiAgSWYgcGxhdGZvcm0gaXMgV2luZG93c1xuICAjIyNcbiAgaXNXaW5kb3dzOiAoKSAtPiBAY29uc3RydWN0b3IuaXNXaW5kb3dzKClcbiAgQGlzV2luZG93czogKCkgLT4gbmV3IFJlZ0V4cCgnXndpbicpLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSlcblxuY2xhc3MgSHlicmlkRXhlY3V0YWJsZSBleHRlbmRzIEV4ZWN1dGFibGVcblxuICBkb2NrZXJPcHRpb25zOiB7XG4gICAgaW1hZ2U6IHVuZGVmaW5lZFxuICAgIHdvcmtpbmdEaXI6IFwiL3dvcmtkaXJcIlxuICB9XG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgQHZlcmJvc2UoXCJIeWJyaWRFeGVjdXRhYmxlIE9wdGlvbnNcIiwgb3B0aW9ucylcbiAgICBpZiBvcHRpb25zLmRvY2tlcj9cbiAgICAgIEBkb2NrZXJPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgQGRvY2tlck9wdGlvbnMsIG9wdGlvbnMuZG9ja2VyKVxuICAgICAgQGRvY2tlciA9IEBjb25zdHJ1Y3Rvci5kb2NrZXJFeGVjdXRhYmxlKClcblxuICBAZG9ja2VyOiB1bmRlZmluZWRcbiAgQGRvY2tlckV4ZWN1dGFibGU6ICgpIC0+XG4gICAgaWYgbm90IEBkb2NrZXI/XG4gICAgICBAZG9ja2VyID0gbmV3IEV4ZWN1dGFibGUoe1xuICAgICAgICBuYW1lOiBcIkRvY2tlclwiXG4gICAgICAgIGNtZDogXCJkb2NrZXJcIlxuICAgICAgICBob21lcGFnZTogXCJodHRwczovL3d3dy5kb2NrZXIuY29tL1wiXG4gICAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy5kb2NrZXIuY29tL2dldC1kb2NrZXJcIlxuICAgICAgICB2ZXJzaW9uOiB7XG4gICAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC92ZXJzaW9uIFswXSooWzEtOV1cXGQqKS5bMF0qKFswLTldXFxkKikuWzBdKihbMC05XVxcZCopLykuc2xpY2UoMSkuam9pbignLicpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIEBkb2NrZXJcblxuICBpbnN0YWxsZWRXaXRoRG9ja2VyOiBmYWxzZVxuICBpbml0OiAoKSAtPlxuICAgIHN1cGVyKClcbiAgICAgIC50aGVuKCgpID0+XG4gICAgICAgIHJldHVybiBAXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpIGlmIG5vdCBAZG9ja2VyP1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVycm9yKVxuICAgICAgKVxuICAgICAgLnRoZW4oKGVycm9yT3JUaGlzKSA9PlxuICAgICAgICBzaG91bGRUcnlXaXRoRG9ja2VyID0gbm90IEBpc0luc3RhbGxlZCBhbmQgQGRvY2tlcj9cbiAgICAgICAgQHZlcmJvc2UoXCJFeGVjdXRhYmxlIHNob3VsZFRyeVdpdGhEb2NrZXJcIiwgc2hvdWxkVHJ5V2l0aERvY2tlciwgQGlzSW5zdGFsbGVkLCBAZG9ja2VyPylcbiAgICAgICAgaWYgc2hvdWxkVHJ5V2l0aERvY2tlclxuICAgICAgICAgIHJldHVybiBAaW5pdERvY2tlcigpLmNhdGNoKCgpIC0+IFByb21pc2UucmVqZWN0KGVycm9yT3JUaGlzKSlcbiAgICAgICAgcmV0dXJuIEBcbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIGlmIG5vdCBALnJlcXVpcmVkXG4gICAgICAgICAgQHZlcmJvc2UoXCJOb3QgcmVxdWlyZWRcIilcbiAgICAgICAgICBAXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgICAgIClcblxuICBpbml0RG9ja2VyOiAoKSAtPlxuICAgIEBkb2NrZXIuaW5pdCgpXG4gICAgICAudGhlbig9PiBAcnVuSW1hZ2UoQHZlcnNpb25BcmdzLCBAdmVyc2lvblJ1bk9wdGlvbnMpKVxuICAgICAgLnRoZW4oKHRleHQpID0+IEBzYXZlVmVyc2lvbih0ZXh0KSlcbiAgICAgIC50aGVuKCgpID0+IEBpbnN0YWxsZWRXaXRoRG9ja2VyID0gdHJ1ZSlcbiAgICAgIC50aGVuKD0+IEApXG4gICAgICAuY2F0Y2goKGRvY2tlckVycm9yKSA9PlxuICAgICAgICBAZGVidWcoZG9ja2VyRXJyb3IpXG4gICAgICAgIFByb21pc2UucmVqZWN0KGRvY2tlckVycm9yKVxuICAgICAgKVxuXG4gIHJ1bjogKGFyZ3MsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAdmVyYm9zZShcIlJ1bm5pbmcgSHlicmlkRXhlY3V0YWJsZVwiKVxuICAgIEB2ZXJib3NlKFwiaW5zdGFsbGVkV2l0aERvY2tlclwiLCBAaW5zdGFsbGVkV2l0aERvY2tlcilcbiAgICBAdmVyYm9zZShcImRvY2tlclwiLCBAZG9ja2VyKVxuICAgIEB2ZXJib3NlKFwiZG9ja2VyLmlzSW5zdGFsbGVkXCIsIEBkb2NrZXIgYW5kIEBkb2NrZXIuaXNJbnN0YWxsZWQpXG4gICAgaWYgQGluc3RhbGxlZFdpdGhEb2NrZXIgYW5kIEBkb2NrZXIgYW5kIEBkb2NrZXIuaXNJbnN0YWxsZWRcbiAgICAgIHJldHVybiBAcnVuSW1hZ2UoYXJncywgb3B0aW9ucylcbiAgICBzdXBlcihhcmdzLCBvcHRpb25zKVxuXG4gIHJ1bkltYWdlOiAoYXJncywgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoXCJSdW4gRG9ja2VyIGV4ZWN1dGFibGU6IFwiLCBhcmdzLCBvcHRpb25zKVxuICAgIHRoaXMucmVzb2x2ZUFyZ3MoYXJncylcbiAgICAgIC50aGVuKChhcmdzKSA9PlxuICAgICAgICB7IGN3ZCB9ID0gb3B0aW9uc1xuICAgICAgICB0bXBEaXIgPSBvcy50bXBkaXIoKVxuICAgICAgICBwd2QgPSBmcy5yZWFscGF0aFN5bmMoY3dkIG9yIHRtcERpcilcbiAgICAgICAgaW1hZ2UgPSBAZG9ja2VyT3B0aW9ucy5pbWFnZVxuICAgICAgICB3b3JraW5nRGlyID0gQGRvY2tlck9wdGlvbnMud29ya2luZ0RpclxuXG4gICAgICAgIHJvb3RQYXRoID0gJy9tb3VudGVkUm9vdCdcbiAgICAgICAgbmV3QXJncyA9IGFyZ3MubWFwKChhcmcpIC0+XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmcgaXMgJ3N0cmluZycgYW5kIG5vdCBhcmcuaW5jbHVkZXMoJzonKSBcXFxuICAgICAgICAgICAgYW5kIHBhdGguaXNBYnNvbHV0ZShhcmcpIGFuZCBub3QgcGF0aC5kaXJuYW1lKGFyZykuc3RhcnRzV2l0aCh0bXBEaXIpKSBcXFxuICAgICAgICAgICAgdGhlbiBwYXRoLmpvaW4ocm9vdFBhdGgsIGFyZykgZWxzZSBhcmdcbiAgICAgICAgKVxuXG4gICAgICAgIEBkb2NrZXIucnVuKFtcbiAgICAgICAgICAgIFwicnVuXCIsXG4gICAgICAgICAgICBcIi0tcm1cIixcbiAgICAgICAgICAgIFwiLS12b2x1bWVcIiwgXCIje3B3ZH06I3t3b3JraW5nRGlyfVwiLFxuICAgICAgICAgICAgXCItLXZvbHVtZVwiLCBcIiN7cGF0aC5yZXNvbHZlKCcvJyl9OiN7cm9vdFBhdGh9XCIsXG4gICAgICAgICAgICBcIi0td29ya2RpclwiLCB3b3JraW5nRGlyLFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBuZXdBcmdzXG4gICAgICAgICAgXSxcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IGNtZDogdW5kZWZpbmVkIH0pXG4gICAgICAgIClcbiAgICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBIeWJyaWRFeGVjdXRhYmxlXG4iXX0=
