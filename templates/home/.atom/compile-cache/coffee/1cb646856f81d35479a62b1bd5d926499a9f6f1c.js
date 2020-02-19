
/*
Requires https://github.com/rust-lang-nursery/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt, path, versionCheckState,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  versionCheckState = false;

  module.exports = Rustfmt = (function(superClass) {
    extend(Rustfmt, superClass);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.link = "https://github.com/rust-lang-nursery/rustfmt";

    Rustfmt.prototype.isPreInstalled = false;

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options, context) {
      var cwd, help, p, program;
      cwd = context.filePath && path.dirname(context.filePath);
      program = options.rustfmt_path || "rustfmt";
      help = {
        link: "https://github.com/rust-lang-nursery/rustfmt",
        program: "rustfmt",
        pathOption: "Rust - Rustfmt Path"
      };
      p = versionCheckState === program ? this.Promise.resolve() : this.run(program, ["--version"], {
        help: help
      }).then(function(stdout) {
        if (/^0\.(?:[0-4]\.[0-9])(?!-nightly)/.test(stdout.trim())) {
          versionCheckState = false;
          throw new Error("rustfmt version 0.5.0 or newer required");
        } else {
          versionCheckState = program;
          return void 0;
        }
      });
      return p.then((function(_this) {
        return function() {
          return _this.run(program, [], {
            cwd: cwd,
            help: help,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          });
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVzdGZtdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsNENBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxpQkFBQSxHQUFvQjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFDTixjQUFBLEdBQWdCOztzQkFFaEIsT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUFNLElBREM7OztzQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFFBQVIsSUFBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsUUFBckI7TUFDM0IsT0FBQSxHQUFVLE9BQU8sQ0FBQyxZQUFSLElBQXdCO01BQ2xDLElBQUEsR0FBTztRQUNMLElBQUEsRUFBTSw4Q0FERDtRQUVMLE9BQUEsRUFBUyxTQUZKO1FBR0wsVUFBQSxFQUFZLHFCQUhQOztNQVNQLENBQUEsR0FBTyxpQkFBQSxLQUFxQixPQUF4QixHQUNGLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLENBREUsR0FHRixJQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFBYyxDQUFDLFdBQUQsQ0FBZCxFQUE2QjtRQUFBLElBQUEsRUFBTSxJQUFOO09BQTdCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1FBQ0osSUFBRyxrQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQXhDLENBQUg7VUFDRSxpQkFBQSxHQUFvQjtBQUNwQixnQkFBTSxJQUFJLEtBQUosQ0FBVSx5Q0FBVixFQUZSO1NBQUEsTUFBQTtVQUlFLGlCQUFBLEdBQW9CO2lCQUNwQixPQUxGOztNQURJLENBRFI7YUFVRixDQUFDLENBQUMsSUFBRixDQUFPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDTCxLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFBYyxFQUFkLEVBQWtCO1lBQ2hCLEdBQUEsRUFBSyxHQURXO1lBRWhCLElBQUEsRUFBTSxJQUZVO1lBR2hCLE9BQUEsRUFBUyxTQUFDLEtBQUQ7cUJBQ1AsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWO1lBRE8sQ0FITztXQUFsQjtRQURLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFQO0lBekJROzs7O0tBVDJCO0FBVnZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vcnVzdC1sYW5nLW51cnNlcnkvcnVzdGZtdFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmVyc2lvbkNoZWNrU3RhdGUgPSBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1c3RmbXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwicnVzdGZtdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3J1c3QtbGFuZy1udXJzZXJ5L3J1c3RmbXRcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgUnVzdDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICBjd2QgPSBjb250ZXh0LmZpbGVQYXRoIGFuZCBwYXRoLmRpcm5hbWUgY29udGV4dC5maWxlUGF0aFxuICAgIHByb2dyYW0gPSBvcHRpb25zLnJ1c3RmbXRfcGF0aCBvciBcInJ1c3RmbXRcIlxuICAgIGhlbHAgPSB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ydXN0LWxhbmctbnVyc2VyeS9ydXN0Zm10XCJcbiAgICAgIHByb2dyYW06IFwicnVzdGZtdFwiXG4gICAgICBwYXRoT3B0aW9uOiBcIlJ1c3QgLSBSdXN0Zm10IFBhdGhcIlxuICAgIH1cblxuICAgICMgMC41LjAgaXMgYSByZWxhdGl2ZWx5IG5ldyB2ZXJzaW9uIGF0IHRoZSBwb2ludCBvZiB3cml0aW5nLFxuICAgICMgYnV0IGlzIGVzc2VudGlhbCBmb3IgdGhpcyB0byB3b3JrIHdpdGggc3RkaW4uXG4gICAgIyA9PiBDaGVjayBmb3IgaXQgc3BlY2lmaWNhbGx5LlxuICAgIHAgPSBpZiB2ZXJzaW9uQ2hlY2tTdGF0ZSA9PSBwcm9ncmFtXG4gICAgICBAUHJvbWlzZS5yZXNvbHZlKClcbiAgICBlbHNlXG4gICAgICBAcnVuKHByb2dyYW0sIFtcIi0tdmVyc2lvblwiXSwgaGVscDogaGVscClcbiAgICAgICAgLnRoZW4oKHN0ZG91dCkgLT5cbiAgICAgICAgICBpZiAvXjBcXC4oPzpbMC00XVxcLlswLTldKSg/IS1uaWdodGx5KS8udGVzdChzdGRvdXQudHJpbSgpKVxuICAgICAgICAgICAgdmVyc2lvbkNoZWNrU3RhdGUgPSBmYWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicnVzdGZtdCB2ZXJzaW9uIDAuNS4wIG9yIG5ld2VyIHJlcXVpcmVkXCIpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmVyc2lvbkNoZWNrU3RhdGUgPSBwcm9ncmFtXG4gICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgKVxuXG4gICAgcC50aGVuKD0+XG4gICAgICBAcnVuKHByb2dyYW0sIFtdLCB7XG4gICAgICAgIGN3ZDogY3dkXG4gICAgICAgIGhlbHA6IGhlbHBcbiAgICAgICAgb25TdGRpbjogKHN0ZGluKSAtPlxuICAgICAgICAgIHN0ZGluLmVuZCB0ZXh0XG4gICAgICB9KVxuICAgIClcbiJdfQ==
