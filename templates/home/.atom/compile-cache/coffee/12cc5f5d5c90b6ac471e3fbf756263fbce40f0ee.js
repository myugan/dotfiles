(function() {
  "use strict";
  var Beautifier, Checker, JSCSFixer, checker, cliConfig,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Checker = null;

  cliConfig = null;

  checker = null;

  module.exports = JSCSFixer = (function(superClass) {
    extend(JSCSFixer, superClass);

    function JSCSFixer() {
      return JSCSFixer.__super__.constructor.apply(this, arguments);
    }

    JSCSFixer.prototype.name = "JSCS Fixer";

    JSCSFixer.prototype.link = "https://github.com/jscs-dev/node-jscs/";

    JSCSFixer.prototype.options = {
      JavaScript: false
    };

    JSCSFixer.prototype.beautify = function(text, language, options) {
      this.verbose("JSCS Fixer language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var config, editor, err, path, result;
          try {
            if (checker == null) {
              cliConfig = require('jscs/lib/cli-config');
              Checker = require('jscs');
              checker = new Checker();
              checker.registerDefaultRules();
            }
            editor = atom.workspace.getActiveTextEditor();
            path = editor != null ? editor.getPath() : void 0;
            config = path != null ? cliConfig.load(void 0, atom.project.relativizePath(path)[0]) : void 0;
            if (config == null) {
              throw new Error("No JSCS config found.");
            }
            checker.configure(config);
            result = checker.fixString(text, path);
            if (result.errors.getErrorCount() > 0) {
              _this.error(result.errors.getErrorList().reduce(function(res, err) {
                return res + "<br> Line " + err.line + ": " + err.message;
              }, "JSCS Fixer error:"));
            }
            return resolve(result.output);
          } catch (error) {
            err = error;
            _this.error("JSCS Fixer error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvanNjcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsa0RBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE9BQUEsR0FBVTs7RUFDVixTQUFBLEdBQVk7O0VBQ1osT0FBQSxHQUFVOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BQ1AsVUFBQSxFQUFZLEtBREw7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtNQUNSLElBQUMsQ0FBQSxPQUFELENBQVMsc0JBQUEsR0FBdUIsUUFBaEM7QUFDQSxhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsY0FBQTtBQUFBO1lBQ0UsSUFBSSxlQUFKO2NBQ0UsU0FBQSxHQUFZLE9BQUEsQ0FBUSxxQkFBUjtjQUNaLE9BQUEsR0FBVSxPQUFBLENBQVEsTUFBUjtjQUNWLE9BQUEsR0FBVSxJQUFJLE9BQUosQ0FBQTtjQUNWLE9BQU8sQ0FBQyxvQkFBUixDQUFBLEVBSkY7O1lBS0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtZQUNULElBQUEsR0FBVSxjQUFILEdBQWdCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBaEIsR0FBc0M7WUFDN0MsTUFBQSxHQUFZLFlBQUgsR0FBYyxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsRUFBMEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLElBQTVCLENBQWtDLENBQUEsQ0FBQSxDQUE1RCxDQUFkLEdBQW1GO1lBQzVGLElBQUksY0FBSjtBQUNFLG9CQUFNLElBQUksS0FBSixDQUFVLHVCQUFWLEVBRFI7O1lBRUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEI7WUFDQSxNQUFBLEdBQVMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEI7WUFDVCxJQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBZCxDQUFBLENBQUEsR0FBZ0MsQ0FBbkM7Y0FDRSxLQUFDLENBQUEsS0FBRCxDQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBZCxDQUFBLENBQTRCLENBQUMsTUFBN0IsQ0FBb0MsU0FBQyxHQUFELEVBQU0sR0FBTjt1QkFDdEMsR0FBRCxHQUFLLFlBQUwsR0FBaUIsR0FBRyxDQUFDLElBQXJCLEdBQTBCLElBQTFCLEdBQThCLEdBQUcsQ0FBQztjQURLLENBQXBDLEVBRUwsbUJBRkssQ0FBUCxFQURGOzttQkFLQSxPQUFBLENBQVEsTUFBTSxDQUFDLE1BQWYsRUFsQkY7V0FBQSxhQUFBO1lBb0JNO1lBQ0osS0FBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBQSxHQUFxQixHQUE1QjttQkFDQSxNQUFBLENBQU8sR0FBUCxFQXRCRjs7UUFEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7SUFGQzs7OztLQVI2QjtBQVB6QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxuQ2hlY2tlciA9IG51bGxcbmNsaUNvbmZpZyA9IG51bGxcbmNoZWNrZXIgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSlNDU0ZpeGVyIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkpTQ1MgRml4ZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9qc2NzLWRldi9ub2RlLWpzY3MvXCJcblxuICBvcHRpb25zOiB7XG4gICAgSmF2YVNjcmlwdDogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHZlcmJvc2UoXCJKU0NTIEZpeGVyIGxhbmd1YWdlICN7bGFuZ3VhZ2V9XCIpXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgdHJ5XG4gICAgICAgIGlmICFjaGVja2VyP1xuICAgICAgICAgIGNsaUNvbmZpZyA9IHJlcXVpcmUgJ2pzY3MvbGliL2NsaS1jb25maWcnXG4gICAgICAgICAgQ2hlY2tlciA9IHJlcXVpcmUgJ2pzY3MnXG4gICAgICAgICAgY2hlY2tlciA9IG5ldyBDaGVja2VyKClcbiAgICAgICAgICBjaGVja2VyLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKClcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHBhdGggPSBpZiBlZGl0b3I/IHRoZW4gZWRpdG9yLmdldFBhdGgoKSBlbHNlIHVuZGVmaW5lZFxuICAgICAgICBjb25maWcgPSBpZiBwYXRoPyB0aGVuIGNsaUNvbmZpZy5sb2FkKHVuZGVmaW5lZCwgYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHBhdGgpWzBdKSBlbHNlIHVuZGVmaW5lZFxuICAgICAgICBpZiAhY29uZmlnP1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIEpTQ1MgY29uZmlnIGZvdW5kLlwiKVxuICAgICAgICBjaGVja2VyLmNvbmZpZ3VyZShjb25maWcpXG4gICAgICAgIHJlc3VsdCA9IGNoZWNrZXIuZml4U3RyaW5nKHRleHQsIHBhdGgpXG4gICAgICAgIGlmIHJlc3VsdC5lcnJvcnMuZ2V0RXJyb3JDb3VudCgpID4gMFxuICAgICAgICAgIEBlcnJvcihyZXN1bHQuZXJyb3JzLmdldEVycm9yTGlzdCgpLnJlZHVjZSgocmVzLCBlcnIpIC0+XG4gICAgICAgICAgICBcIiN7cmVzfTxicj4gTGluZSAje2Vyci5saW5lfTogI3tlcnIubWVzc2FnZX1cIlxuICAgICAgICAgICwgXCJKU0NTIEZpeGVyIGVycm9yOlwiKSlcblxuICAgICAgICByZXNvbHZlIHJlc3VsdC5vdXRwdXRcblxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIEBlcnJvcihcIkpTQ1MgRml4ZXIgZXJyb3I6ICN7ZXJyfVwiKVxuICAgICAgICByZWplY3QoZXJyKVxuXG4gICAgKVxuIl19
