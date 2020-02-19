
/*
Requires clang-format (https://clang.llvm.org)
 */

(function() {
  "use strict";
  var Beautifier, ClangFormat, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require('fs');

  module.exports = ClangFormat = (function(superClass) {
    extend(ClangFormat, superClass);

    function ClangFormat() {
      return ClangFormat.__super__.constructor.apply(this, arguments);
    }

    ClangFormat.prototype.name = "clang-format";

    ClangFormat.prototype.link = "https://clang.llvm.org/docs/ClangFormat.html";

    ClangFormat.prototype.executables = [
      {
        name: "ClangFormat",
        cmd: "clang-format",
        homepage: "https://clang.llvm.org/docs/ClangFormat.html",
        installation: "https://clang.llvm.org/docs/ClangFormat.html",
        version: {
          parse: function(text) {
            return text.match(/version (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/clang-format"
        }
      }
    ];

    ClangFormat.prototype.options = {
      "C++": false,
      "C": false,
      "Objective-C": false,
      "GLSL": true
    };


    /*
      Dump contents to a given file
     */

    ClangFormat.prototype.dumpToFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-dump";
      }
      if (contents == null) {
        contents = "";
      }
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          return fs.open(name, "w", function(err, fd) {
            _this.debug('dumpToFile', name, err, fd);
            if (err) {
              return reject(err);
            }
            return fs.write(fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(name);
              });
            });
          });
        };
      })(this));
    };

    ClangFormat.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var currDir, currFile, dumpFile, editor, fullPath, ref;
        editor = typeof atom !== "undefined" && atom !== null ? (ref = atom.workspace) != null ? ref.getActiveTextEditor() : void 0 : void 0;
        if (editor != null) {
          fullPath = editor.getPath();
          currDir = path.dirname(fullPath);
          currFile = path.basename(fullPath);
          dumpFile = path.join(currDir, ".atom-beautify." + currFile);
          return resolve(dumpFile);
        } else {
          return reject(new Error("No active editor found!"));
        }
      }).then((function(_this) {
        return function(dumpFile) {
          return _this.exe("clang-format").run([_this.dumpToFile(dumpFile, text), ["--style=file"]])["finally"](function() {
            return fs.unlink(dumpFile);
          });
        };
      })(this));
    };

    return ClangFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY2xhbmctZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxpQ0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFFckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLGFBRFI7UUFFRSxHQUFBLEVBQUssY0FGUDtRQUdFLFFBQUEsRUFBVSw4Q0FIWjtRQUlFLFlBQUEsRUFBYyw4Q0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcseUJBQVgsQ0FBc0MsQ0FBQSxDQUFBO1VBQWhELENBREE7U0FMWDtRQVFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTywwQkFERDtTQVJWO09BRFc7OzswQkFlYixPQUFBLEdBQVM7TUFDUCxLQUFBLEVBQU8sS0FEQTtNQUVQLEdBQUEsRUFBSyxLQUZFO01BR1AsYUFBQSxFQUFlLEtBSFI7TUFJUCxNQUFBLEVBQVEsSUFKRDs7OztBQU9UOzs7OzBCQUdBLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBOEIsUUFBOUI7O1FBQUMsT0FBTzs7O1FBQXNCLFdBQVc7O0FBQ25ELGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtpQkFDbEIsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsR0FBZCxFQUFtQixTQUFDLEdBQUQsRUFBTSxFQUFOO1lBQ2pCLEtBQUMsQ0FBQSxLQUFELENBQU8sWUFBUCxFQUFxQixJQUFyQixFQUEyQixHQUEzQixFQUFnQyxFQUFoQztZQUNBLElBQXNCLEdBQXRCO0FBQUEscUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7bUJBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFULEVBQWEsUUFBYixFQUF1QixTQUFDLEdBQUQ7Y0FDckIsSUFBc0IsR0FBdEI7QUFBQSx1QkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztxQkFDQSxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsRUFBYSxTQUFDLEdBQUQ7Z0JBQ1gsSUFBc0IsR0FBdEI7QUFBQSx5QkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOzt1QkFDQSxPQUFBLENBQVEsSUFBUjtjQUZXLENBQWI7WUFGcUIsQ0FBdkI7VUFIaUIsQ0FBbkI7UUFEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7SUFERzs7MEJBZVosUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFhUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxNQUFBLHNGQUF3QixDQUFFLG1CQUFqQixDQUFBO1FBQ1QsSUFBRyxjQUFIO1VBQ0UsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7VUFDWCxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiO1VBQ1YsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZDtVQUNYLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsaUJBQUEsR0FBa0IsUUFBckM7aUJBQ1gsT0FBQSxDQUFRLFFBQVIsRUFMRjtTQUFBLE1BQUE7aUJBT0UsTUFBQSxDQUFPLElBQUksS0FBSixDQUFVLHlCQUFWLENBQVAsRUFQRjs7TUFGa0IsQ0FBYixDQVdQLENBQUMsSUFYTSxDQVdELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO0FBRUosaUJBQU8sS0FBQyxDQUFBLEdBQUQsQ0FBSyxjQUFMLENBQW9CLENBQUMsR0FBckIsQ0FBeUIsQ0FDOUIsS0FBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLEVBQXNCLElBQXRCLENBRDhCLEVBRTlCLENBQUMsY0FBRCxDQUY4QixDQUF6QixDQUdILEVBQUMsT0FBRCxFQUhHLENBR08sU0FBQTttQkFDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVY7VUFEVSxDQUhQO1FBRkg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWEM7SUFiQzs7OztLQTVDK0I7QUFUM0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGNsYW5nLWZvcm1hdCAoaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZylcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDbGFuZ0Zvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcImNsYW5nLWZvcm1hdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZy9kb2NzL0NsYW5nRm9ybWF0Lmh0bWxcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiQ2xhbmdGb3JtYXRcIlxuICAgICAgY21kOiBcImNsYW5nLWZvcm1hdFwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2NsYW5nLmxsdm0ub3JnL2RvY3MvQ2xhbmdGb3JtYXQuaHRtbFwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZy9kb2NzL0NsYW5nRm9ybWF0Lmh0bWxcIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL3ZlcnNpb24gKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L2NsYW5nLWZvcm1hdFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIFwiQysrXCI6IGZhbHNlXG4gICAgXCJDXCI6IGZhbHNlXG4gICAgXCJPYmplY3RpdmUtQ1wiOiBmYWxzZVxuICAgIFwiR0xTTFwiOiB0cnVlXG4gIH1cblxuICAjIyNcbiAgICBEdW1wIGNvbnRlbnRzIHRvIGEgZ2l2ZW4gZmlsZVxuICAjIyNcbiAgZHVtcFRvRmlsZTogKG5hbWUgPSBcImF0b20tYmVhdXRpZnktZHVtcFwiLCBjb250ZW50cyA9IFwiXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgZnMub3BlbihuYW1lLCBcIndcIiwgKGVyciwgZmQpID0+XG4gICAgICAgIEBkZWJ1ZygnZHVtcFRvRmlsZScsIG5hbWUsIGVyciwgZmQpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgZnMud3JpdGUoZmQsIGNvbnRlbnRzLCAoZXJyKSAtPlxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgICBmcy5jbG9zZShmZCwgKGVycikgLT5cbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgICAgIHJlc29sdmUobmFtZSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICAjIE5PVEU6IE9uZSBtYXkgd29uZGVyIHdoeSB0aGlzIGNvZGUgZ29lcyBhIGxvbmcgd2F5IHRvIGNvbnN0cnVjdCBhIGZpbGVcbiAgICAjIHBhdGggYW5kIGR1bXAgY29udGVudCB1c2luZyBhIGN1c3RvbSBgZHVtcFRvRmlsZWAuIFdvdWxkbid0IGl0IGJlIGVhc2llclxuICAgICMgdG8gdXNlIGBAdGVtcEZpbGVgIGluc3RlYWQ/IFRoZSByZWFzb24gaGVyZSBpcyB0byB3b3JrIGFyb3VuZCB0aGVcbiAgICAjIGNsYW5nLWZvcm1hdCBjb25maWcgZmlsZSBsb2NhdGluZyBtZWNoYW5pc20uIEFzIGluZGljYXRlZCBpbiB0aGUgbWFudWFsLFxuICAgICMgY2xhbmctZm9ybWF0ICh3aXRoIGAtLXN0eWxlIGZpbGVgKSB0cmllcyB0byBsb2NhdGUgYSBgLmNsYW5nLWZvcm1hdGBcbiAgICAjIGNvbmZpZyBmaWxlIGluIGRpcmVjdG9yeSBhbmQgcGFyZW50IGRpcmVjdG9yaWVzIG9mIHRoZSBpbnB1dCBmaWxlLFxuICAgICMgYW5kIHJldHJlYXQgdG8gZGVmYXVsdCBzdHlsZSBpZiBub3QgZm91bmQuIFByb2plY3RzIG9mdGVuIG1ha2VzIHVzZSBvZlxuICAgICMgdGhpcyBydWxlIHRvIGRlZmluZSB0aGVpciBvd24gc3R5bGUgaW4gaXRzIHRvcCBkaXJlY3RvcnkuIFVzZXJzIG9mdGVuXG4gICAgIyBwdXQgYSBgLmNsYW5nLWZvcm1hdGAgaW4gdGhlaXIgJEhPTUUgdG8gZGVmaW5lIGhpcy9oZXIgc3R5bGUuIFRvIGhvbm9yXG4gICAgIyB0aGlzIHJ1bGUsIHdlIEhBVkUgVE8gZ2VuZXJhdGUgdGhlIHRlbXAgZmlsZSBpbiBUSEUgU0FNRSBkaXJlY3RvcnkgYXNcbiAgICAjIHRoZSBlZGl0aW5nIGZpbGUuIEhvd2V2ZXIsIHRoaXMgbWVjaGFuaXNtIGlzIG5vdCBkaXJlY3RseSBzdXBwb3J0ZWQgYnlcbiAgICAjIGF0b20tYmVhdXRpZnkgYXQgdGhlIG1vbWVudC4gU28gd2UgaW50cm9kdWNlIGxvdHMgb2YgY29kZSBoZXJlLlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGVkaXRvciA9IGF0b20/LndvcmtzcGFjZT8uZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiBlZGl0b3I/XG4gICAgICAgIGZ1bGxQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBjdXJyRGlyID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKVxuICAgICAgICBjdXJyRmlsZSA9IHBhdGguYmFzZW5hbWUoZnVsbFBhdGgpXG4gICAgICAgIGR1bXBGaWxlID0gcGF0aC5qb2luKGN1cnJEaXIsIFwiLmF0b20tYmVhdXRpZnkuI3tjdXJyRmlsZX1cIilcbiAgICAgICAgcmVzb2x2ZSBkdW1wRmlsZVxuICAgICAgZWxzZVxuICAgICAgICByZWplY3QobmV3IEVycm9yKFwiTm8gYWN0aXZlIGVkaXRvciBmb3VuZCFcIikpXG4gICAgKVxuICAgIC50aGVuKChkdW1wRmlsZSkgPT5cbiAgICAgICMgY29uc29sZS5sb2coXCJjbGFuZy1mb3JtYXRcIiwgZHVtcEZpbGUpXG4gICAgICByZXR1cm4gQGV4ZShcImNsYW5nLWZvcm1hdFwiKS5ydW4oW1xuICAgICAgICBAZHVtcFRvRmlsZShkdW1wRmlsZSwgdGV4dClcbiAgICAgICAgW1wiLS1zdHlsZT1maWxlXCJdXG4gICAgICAgIF0pLmZpbmFsbHkoIC0+XG4gICAgICAgICAgZnMudW5saW5rKGR1bXBGaWxlKVxuICAgICAgICApXG4gICAgKVxuIl19
