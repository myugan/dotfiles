
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, _, cfg, expandHomeDir, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(superClass) {
    extend(Uncrustify, superClass);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.link = "https://github.com/uncrustify/uncrustify";

    Uncrustify.prototype.executables = [
      {
        name: "Uncrustify",
        cmd: "uncrustify",
        homepage: "http://uncrustify.sourceforge.net/",
        installation: "https://github.com/uncrustify/uncrustify",
        version: {
          parse: function(text) {
            var error, v;
            try {
              v = text.match(/uncrustify (\d+\.\d+)/)[1];
            } catch (error1) {
              error = error1;
              this.error(error);
              if (v == null) {
                v = text.match(/Uncrustify-(\d+\.\d+)/)[1];
              }
            }
            if (v) {
              return v + ".0";
            }
          }
        },
        docker: {
          image: "unibeautify/uncrustify"
        }
      }
    ];

    Uncrustify.prototype.options = {
      Apex: true,
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options, context) {
      var fileExtension, uncrustify;
      fileExtension = context.fileExtension;
      uncrustify = this.exe("uncrustify");
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor, expandedConfigPath, projectPath;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            projectPath = atom.workspace.project.getPaths()[0];
            expandedConfigPath = expandHomeDir(configPath);
            configPath = path.resolve(projectPath, expandedConfigPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          lang = "C";
          switch (language) {
            case "Apex":
              lang = "Apex";
              break;
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return uncrustify.run(["-c", configPath, "-f", _this.tempFile("input", text, fileExtension && ("." + fileExtension)), "-o", outputFile = _this.tempFile("output", text, fileExtension && ("." + fileExtension)), "-l", lang]).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdW5jcnVzdGlmeS9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsbURBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFDTixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0VBQ2hCLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt5QkFDckIsSUFBQSxHQUFNOzt5QkFDTixJQUFBLEdBQU07O3lCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFlBRFI7UUFFRSxHQUFBLEVBQUssWUFGUDtRQUdFLFFBQUEsRUFBVSxvQ0FIWjtRQUlFLFlBQUEsRUFBYywwQ0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO0FBQ0wsZ0JBQUE7QUFBQTtjQUNFLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLHVCQUFYLENBQW9DLENBQUEsQ0FBQSxFQUQxQzthQUFBLGNBQUE7Y0FFTTtjQUNKLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBUDtjQUNBLElBQWtELFNBQWxEO2dCQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLHVCQUFYLENBQW9DLENBQUEsQ0FBQSxFQUF4QztlQUpGOztZQUtBLElBQUcsQ0FBSDtBQUNFLHFCQUFPLENBQUEsR0FBSSxLQURiOztVQU5LLENBREE7U0FMWDtRQWVFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyx3QkFERDtTQWZWO09BRFc7Ozt5QkFzQmIsT0FBQSxHQUFT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QSxDQUFBLENBQUEsSUFBQSxDQXJCQztJQUxDOzs7O0tBdEM4QjtBQVYxQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cDovL3VuY3J1c3RpZnkuc291cmNlZm9yZ2UubmV0L1xuIyMjXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4uL2JlYXV0aWZpZXInKVxuY2ZnID0gcmVxdWlyZShcIi4vY2ZnXCIpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcbmV4cGFuZEhvbWVEaXIgPSByZXF1aXJlKCdleHBhbmQtaG9tZS1kaXInKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVW5jcnVzdGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJVbmNydXN0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vdW5jcnVzdGlmeS91bmNydXN0aWZ5XCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlVuY3J1c3RpZnlcIlxuICAgICAgY21kOiBcInVuY3J1c3RpZnlcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cDovL3VuY3J1c3RpZnkuc291cmNlZm9yZ2UubmV0L1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL3VuY3J1c3RpZnkvdW5jcnVzdGlmeVwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHYgPSB0ZXh0Lm1hdGNoKC91bmNydXN0aWZ5IChcXGQrXFwuXFxkKykvKVsxXVxuICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICBAZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICB2ID0gdGV4dC5tYXRjaCgvVW5jcnVzdGlmeS0oXFxkK1xcLlxcZCspLylbMV0gaWYgbm90IHY/XG4gICAgICAgICAgaWYgdlxuICAgICAgICAgICAgcmV0dXJuIHYgKyBcIi4wXCJcbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS91bmNydXN0aWZ5XCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgQXBleDogdHJ1ZVxuICAgIEM6IHRydWVcbiAgICBcIkMrK1wiOiB0cnVlXG4gICAgXCJDI1wiOiB0cnVlXG4gICAgXCJPYmplY3RpdmUtQ1wiOiB0cnVlXG4gICAgRDogdHJ1ZVxuICAgIFBhd246IHRydWVcbiAgICBWYWxhOiB0cnVlXG4gICAgSmF2YTogdHJ1ZVxuICAgIEFyZHVpbm86IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgZmlsZUV4dGVuc2lvbiA9IGNvbnRleHQuZmlsZUV4dGVuc2lvblxuXG4gICAgdW5jcnVzdGlmeSA9IEBleGUoXCJ1bmNydXN0aWZ5XCIpXG4gICAgIyBjb25zb2xlLmxvZygndW5jcnVzdGlmeS5iZWF1dGlmeScsIGxhbmd1YWdlLCBvcHRpb25zKVxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGNvbmZpZ1BhdGggPSBvcHRpb25zLmNvbmZpZ1BhdGhcbiAgICAgIHVubGVzcyBjb25maWdQYXRoXG4gICAgICAgICMgTm8gY3VzdG9tIGNvbmZpZyBwYXRoXG4gICAgICAgIGNmZyBvcHRpb25zLCAoZXJyb3IsIGNQYXRoKSAtPlxuICAgICAgICAgIHRocm93IGVycm9yIGlmIGVycm9yXG4gICAgICAgICAgcmVzb2x2ZSBjUGF0aFxuICAgICAgZWxzZVxuICAgICAgICAjIEhhcyBjdXN0b20gY29uZmlnIHBhdGhcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGlmIGVkaXRvcj9cbiAgICAgICAgICBiYXNlUGF0aCA9IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgICAgIHByb2plY3RQYXRoID0gYXRvbS53b3Jrc3BhY2UucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhiYXNlUGF0aCk7XG4gICAgICAgICAgIyBFeHBhbmQgSG9tZSBEaXJlY3RvcnkgaW4gQ29uZmlnIFBhdGhcbiAgICAgICAgICBleHBhbmRlZENvbmZpZ1BhdGggPSBleHBhbmRIb21lRGlyKGNvbmZpZ1BhdGgpXG4gICAgICAgICAgY29uZmlnUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgZXhwYW5kZWRDb25maWdQYXRoKVxuICAgICAgICAgIHJlc29sdmUgY29uZmlnUGF0aFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIk5vIFVuY3J1c3RpZnkgQ29uZmlnIFBhdGggc2V0ISBQbGVhc2UgY29uZmlndXJlIFVuY3J1c3RpZnkgd2l0aCBBdG9tIEJlYXV0aWZ5LlwiKSlcbiAgICApXG4gICAgLnRoZW4oKGNvbmZpZ1BhdGgpID0+XG4gICAgICAjIFNlbGVjdCBVbmNydXN0aWZ5IGxhbmd1YWdlXG4gICAgICBsYW5nID0gXCJDXCIgIyBEZWZhdWx0IGlzIENcbiAgICAgIHN3aXRjaCBsYW5ndWFnZVxuICAgICAgICB3aGVuIFwiQXBleFwiXG4gICAgICAgICAgbGFuZyA9IFwiQXBleFwiXG4gICAgICAgIHdoZW4gXCJDXCJcbiAgICAgICAgICBsYW5nID0gXCJDXCJcbiAgICAgICAgd2hlbiBcIkMrK1wiXG4gICAgICAgICAgbGFuZyA9IFwiQ1BQXCJcbiAgICAgICAgd2hlbiBcIkMjXCJcbiAgICAgICAgICBsYW5nID0gXCJDU1wiXG4gICAgICAgIHdoZW4gXCJPYmplY3RpdmUtQ1wiLCBcIk9iamVjdGl2ZS1DKytcIlxuICAgICAgICAgIGxhbmcgPSBcIk9DK1wiXG4gICAgICAgIHdoZW4gXCJEXCJcbiAgICAgICAgICBsYW5nID0gXCJEXCJcbiAgICAgICAgd2hlbiBcIlBhd25cIlxuICAgICAgICAgIGxhbmcgPSBcIlBBV05cIlxuICAgICAgICB3aGVuIFwiVmFsYVwiXG4gICAgICAgICAgbGFuZyA9IFwiVkFMQVwiXG4gICAgICAgIHdoZW4gXCJKYXZhXCJcbiAgICAgICAgICBsYW5nID0gXCJKQVZBXCJcbiAgICAgICAgd2hlbiBcIkFyZHVpbm9cIlxuICAgICAgICAgIGxhbmcgPSBcIkNQUFwiXG5cbiAgICAgIHVuY3J1c3RpZnkucnVuKFtcbiAgICAgICAgXCItY1wiXG4gICAgICAgIGNvbmZpZ1BhdGhcbiAgICAgICAgXCItZlwiXG4gICAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQsIGZpbGVFeHRlbnNpb24gYW5kIFwiLiN7ZmlsZUV4dGVuc2lvbn1cIilcbiAgICAgICAgXCItb1wiXG4gICAgICAgIG91dHB1dEZpbGUgPSBAdGVtcEZpbGUoXCJvdXRwdXRcIiwgdGV4dCwgZmlsZUV4dGVuc2lvbiBhbmQgXCIuI3tmaWxlRXh0ZW5zaW9ufVwiKVxuICAgICAgICBcIi1sXCJcbiAgICAgICAgbGFuZ1xuICAgICAgICBdKVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZShvdXRwdXRGaWxlKVxuICAgICAgICApXG4gICAgKVxuIl19
