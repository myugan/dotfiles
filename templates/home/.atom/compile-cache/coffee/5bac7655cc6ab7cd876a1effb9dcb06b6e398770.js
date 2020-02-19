
/*
 */

(function() {
  var Beautifier, Lua, format, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  format = require('./beautifier');

  module.exports = Lua = (function(superClass) {
    extend(Lua, superClass);

    function Lua() {
      return Lua.__super__.constructor.apply(this, arguments);
    }

    Lua.prototype.name = "Lua beautifier";

    Lua.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/lua-beautifier/beautifier.coffee";

    Lua.prototype.options = {
      Lua: {
        indent_size: true,
        indent_char: true,
        end_of_line: true
      }
    };

    Lua.prototype.beautify = function(text, language, options) {
      var indent, indentChar, indentSize;
      options.eol = this.getDefaultLineEnding('\r\n', '\n', options.end_of_line);
      indentChar = options.indent_char || " ";
      indentSize = options.indent_size;
      indent = indentChar.repeat(indentSize);
      return new this.Promise(function(resolve, reject) {
        var error;
        try {
          return resolve(format(text, indent, this.warn, options));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return Lua;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbHVhLWJlYXV0aWZpZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0FBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7OztFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUDs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O2tCQUNyQixJQUFBLEdBQU07O2tCQUNOLElBQUEsR0FBTTs7a0JBRU4sT0FBQSxHQUFTO01BQ1AsR0FBQSxFQUFLO1FBQ0gsV0FBQSxFQUFhLElBRFY7UUFFSCxXQUFBLEVBQWEsSUFGVjtRQUdILFdBQUEsRUFBYSxJQUhWO09BREU7OztrQkFRVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxPQUFPLENBQUMsR0FBUixHQUFjLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixNQUF0QixFQUE2QixJQUE3QixFQUFtQyxPQUFPLENBQUMsV0FBM0M7TUFDZCxVQUFBLEdBQWEsT0FBTyxDQUFDLFdBQVIsSUFBdUI7TUFDcEMsVUFBQSxHQUFhLE9BQU8sQ0FBQztNQUNyQixNQUFBLEdBQVMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsVUFBbEI7YUFDVCxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNYLFlBQUE7QUFBQTtpQkFDRSxPQUFBLENBQVEsTUFBQSxDQUFPLElBQVAsRUFBYSxNQUFiLEVBQXFCLElBQUMsQ0FBQSxJQUF0QixFQUE0QixPQUE1QixDQUFSLEVBREY7U0FBQSxjQUFBO1VBRU07aUJBQ0osTUFBQSxDQUFPLEtBQVAsRUFIRjs7TUFEVyxDQUFiO0lBTFE7Ozs7S0FadUI7QUFSbkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiMjI1xucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5mb3JtYXQgPSByZXF1aXJlICcuL2JlYXV0aWZpZXInXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTHVhIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkx1YSBiZWF1dGlmaWVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkvYmxvYi9tYXN0ZXIvc3JjL2JlYXV0aWZpZXJzL2x1YS1iZWF1dGlmaWVyL2JlYXV0aWZpZXIuY29mZmVlXCJcblxuICBvcHRpb25zOiB7XG4gICAgTHVhOiB7XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgaW5kZW50X2NoYXI6IHRydWVcbiAgICAgIGVuZF9vZl9saW5lOiB0cnVlXG4gICAgfVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLmVvbCA9IEBnZXREZWZhdWx0TGluZUVuZGluZygnXFxyXFxuJywnXFxuJywgb3B0aW9ucy5lbmRfb2ZfbGluZSlcbiAgICBpbmRlbnRDaGFyID0gb3B0aW9ucy5pbmRlbnRfY2hhciBvciBcIiBcIlxuICAgIGluZGVudFNpemUgPSBvcHRpb25zLmluZGVudF9zaXplXG4gICAgaW5kZW50ID0gaW5kZW50Q2hhci5yZXBlYXQoaW5kZW50U2l6ZSlcbiAgICBuZXcgQFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHRyeVxuICAgICAgICByZXNvbHZlKGZvcm1hdCh0ZXh0LCBpbmRlbnQsIEB3YXJuLCBvcHRpb25zKSlcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJlamVjdCBlcnJvclxuIl19
