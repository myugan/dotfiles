
/*
Requires [gn](https://chromium.googlesource.com/chromium/src/tools/gn)
 */

(function() {
  "use strict";
  var Beautifier, GN, path, semver,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  semver = require('semver');

  module.exports = GN = (function(superClass) {
    extend(GN, superClass);

    function GN() {
      return GN.__super__.constructor.apply(this, arguments);
    }

    GN.prototype.name = "GN";

    GN.prototype.link = "https://chromium.googlesource.com/chromium/src/tools/gn";

    GN.prototype.executables = [
      {
        name: "gn",
        cmd: "gn",
        homepage: "https://chromium.googlesource.com/chromium/src/tools/gn",
        installation: "https://www.chromium.org/developers/how-tos/get-the-code",
        version: {
          parse: function(text) {
            return semver.clean("0.0." + text);
          }
        }
      }
    ];

    GN.prototype.options = {
      GN: false
    };

    GN.prototype.beautify = function(text, language, options, context) {
      var cwd;
      cwd = context.filePath && path.dirname(context.filePath);
      return this.exe("gn").run(["format", "--stdin"], {
        cwd: cwd,
        onStdin: function(stdin) {
          return stdin.end(text);
        }
      });
    };

    return GN;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZ24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBLDRCQUFBO0lBQUE7OztFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O2lCQUNyQixJQUFBLEdBQU07O2lCQUNOLElBQUEsR0FBTTs7aUJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sSUFEUjtRQUVFLEdBQUEsRUFBSyxJQUZQO1FBR0UsUUFBQSxFQUFVLHlEQUhaO1FBSUUsWUFBQSxFQUFjLDBEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFBLEdBQVMsSUFBdEI7VUFBVixDQURBO1NBTFg7T0FEVzs7O2lCQVliLE9BQUEsR0FBUztNQUNQLEVBQUEsRUFBSSxLQURHOzs7aUJBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUI7QUFDUixVQUFBO01BQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxRQUFSLElBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLFFBQXJCO2FBQzNCLElBQUMsQ0FBQSxHQUFELENBQUssSUFBTCxDQUFVLENBQUMsR0FBWCxDQUFlLENBQUMsUUFBRCxFQUFXLFNBQVgsQ0FBZixFQUFzQztRQUNwQyxHQUFBLEVBQUssR0FEK0I7UUFFcEMsT0FBQSxFQUFTLFNBQUMsS0FBRDtpQkFDUCxLQUFLLENBQUMsR0FBTixDQUFVLElBQVY7UUFETyxDQUYyQjtPQUF0QztJQUZROzs7O0tBbkJzQjtBQVJsQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgW2duXShodHRwczovL2Nocm9taXVtLmdvb2dsZXNvdXJjZS5jb20vY2hyb21pdW0vc3JjL3Rvb2xzL2duKVxuIyMjXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5zZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdOIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkdOXCJcbiAgbGluazogXCJodHRwczovL2Nocm9taXVtLmdvb2dsZXNvdXJjZS5jb20vY2hyb21pdW0vc3JjL3Rvb2xzL2duXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcImduXCJcbiAgICAgIGNtZDogXCJnblwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2Nocm9taXVtLmdvb2dsZXNvdXJjZS5jb20vY2hyb21pdW0vc3JjL3Rvb2xzL2duXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy5jaHJvbWl1bS5vcmcvZGV2ZWxvcGVycy9ob3ctdG9zL2dldC10aGUtY29kZVwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gc2VtdmVyLmNsZWFuKFwiMC4wLlwiICsgdGV4dClcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgR046IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIGN3ZCA9IGNvbnRleHQuZmlsZVBhdGggYW5kIHBhdGguZGlybmFtZSBjb250ZXh0LmZpbGVQYXRoXG4gICAgQGV4ZShcImduXCIpLnJ1bihbXCJmb3JtYXRcIiwgXCItLXN0ZGluXCJdLCB7XG4gICAgICBjd2Q6IGN3ZFxuICAgICAgb25TdGRpbjogKHN0ZGluKSAtPlxuICAgICAgICBzdGRpbi5lbmQgdGV4dFxuICAgIH0pXG4iXX0=
