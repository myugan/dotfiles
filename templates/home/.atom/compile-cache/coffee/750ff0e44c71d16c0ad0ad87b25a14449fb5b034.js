
/*
Requires [dfmt](https://github.com/Hackerpilot/dfmt)
 */

(function() {
  "use strict";
  var Beautifier, Dfmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Dfmt = (function(superClass) {
    extend(Dfmt, superClass);

    function Dfmt() {
      return Dfmt.__super__.constructor.apply(this, arguments);
    }

    Dfmt.prototype.name = "dfmt";

    Dfmt.prototype.link = "https://github.com/Hackerpilot/dfmt";

    Dfmt.prototype.executables = [
      {
        name: "Dfmt",
        cmd: "dfmt",
        homepage: "https://github.com/Hackerpilot/dfmt",
        installation: "https://github.com/dlang-community/dfmt#building"
      }
    ];

    Dfmt.prototype.options = {
      D: false
    };

    Dfmt.prototype.beautify = function(text, language, options) {
      return this.exe("dfmt").run([this.tempFile("input", text)]);
    };

    return Dfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZGZtdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsZ0JBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O21CQUNyQixJQUFBLEdBQU07O21CQUNOLElBQUEsR0FBTTs7bUJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sTUFEUjtRQUVFLEdBQUEsRUFBSyxNQUZQO1FBR0UsUUFBQSxFQUFVLHFDQUhaO1FBSUUsWUFBQSxFQUFjLGtEQUpoQjtPQURXOzs7bUJBU2IsT0FBQSxHQUFTO01BQ1AsQ0FBQSxFQUFHLEtBREk7OzttQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxDQUFZLENBQUMsR0FBYixDQUFpQixDQUNmLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURlLENBQWpCO0lBRFE7Ozs7S0FoQndCO0FBTnBDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBbZGZtdF0oaHR0cHM6Ly9naXRodWIuY29tL0hhY2tlcnBpbG90L2RmbXQpXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEZm10IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImRmbXRcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9IYWNrZXJwaWxvdC9kZm10XCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIkRmbXRcIlxuICAgICAgY21kOiBcImRmbXRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL0hhY2tlcnBpbG90L2RmbXRcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kbGFuZy1jb21tdW5pdHkvZGZtdCNidWlsZGluZ1wiXG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIEQ6IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBleGUoXCJkZm10XCIpLnJ1bihbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSlcbiJdfQ==
