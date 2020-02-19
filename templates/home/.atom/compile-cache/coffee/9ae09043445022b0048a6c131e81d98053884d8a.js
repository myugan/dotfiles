
/*
Requires https://github.com/andialbrecht/sqlparse
 */

(function() {
  "use strict";
  var Beautifier, Sqlformat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Sqlformat = (function(superClass) {
    extend(Sqlformat, superClass);

    function Sqlformat() {
      return Sqlformat.__super__.constructor.apply(this, arguments);
    }

    Sqlformat.prototype.name = "sqlformat";

    Sqlformat.prototype.link = "https://github.com/andialbrecht/sqlparse";

    Sqlformat.prototype.isPreInstalled = false;

    Sqlformat.prototype.options = {
      SQL: true
    };

    Sqlformat.prototype.beautify = function(text, language, options) {
      return this.run("sqlformat", [this.tempFile("input", text), options.reindent === true ? "--reindent" : void 0, options.indent_size != null ? "--indent_width=" + options.indent_size : void 0, ((options.keywords != null) && options.keywords !== 'unchanged') ? "--keywords=" + options.keywords : void 0, ((options.identifiers != null) && options.identifiers !== 'unchanged') ? "--identifiers=" + options.identifiers : void 0], {
        help: {
          link: "https://github.com/andialbrecht/sqlparse"
        }
      });
    };

    return Sqlformat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvc3FsZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxxQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFDTixjQUFBLEdBQWdCOzt3QkFFaEIsT0FBQSxHQUFTO01BQ1AsR0FBQSxFQUFLLElBREU7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxFQUFrQixDQUNoQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEZ0IsRUFFQSxPQUFPLENBQUMsUUFBUixLQUFvQixJQUFwQyxHQUFBLFlBQUEsR0FBQSxNQUZnQixFQUcyQiwyQkFBM0MsR0FBQSxpQkFBQSxHQUFrQixPQUFPLENBQUMsV0FBMUIsR0FBQSxNQUhnQixFQUlvQixDQUFDLDBCQUFBLElBQXFCLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLFdBQTFDLENBQXBDLEdBQUEsYUFBQSxHQUFjLE9BQU8sQ0FBQyxRQUF0QixHQUFBLE1BSmdCLEVBSzBCLENBQUMsNkJBQUEsSUFBd0IsT0FBTyxDQUFDLFdBQVIsS0FBdUIsV0FBaEQsQ0FBMUMsR0FBQSxnQkFBQSxHQUFpQixPQUFPLENBQUMsV0FBekIsR0FBQSxNQUxnQixDQUFsQixFQU1LO1FBQUEsSUFBQSxFQUFNO1VBQ1AsSUFBQSxFQUFNLDBDQURDO1NBQU47T0FOTDtJQURROzs7O0tBVDZCO0FBUHpDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vYW5kaWFsYnJlY2h0L3NxbHBhcnNlXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNxbGZvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJzcWxmb3JtYXRcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbmRpYWxicmVjaHQvc3FscGFyc2VcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgU1FMOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJzcWxmb3JtYXRcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIFwiLS1yZWluZGVudFwiIGlmIG9wdGlvbnMucmVpbmRlbnQgaXMgdHJ1ZVxuICAgICAgXCItLWluZGVudF93aWR0aD0je29wdGlvbnMuaW5kZW50X3NpemV9XCIgaWYgb3B0aW9ucy5pbmRlbnRfc2l6ZT9cbiAgICAgIFwiLS1rZXl3b3Jkcz0je29wdGlvbnMua2V5d29yZHN9XCIgaWYgKG9wdGlvbnMua2V5d29yZHM/ICYmIG9wdGlvbnMua2V5d29yZHMgIT0gJ3VuY2hhbmdlZCcpXG4gICAgICBcIi0taWRlbnRpZmllcnM9I3tvcHRpb25zLmlkZW50aWZpZXJzfVwiIGlmIChvcHRpb25zLmlkZW50aWZpZXJzPyAmJiBvcHRpb25zLmlkZW50aWZpZXJzICE9ICd1bmNoYW5nZWQnKVxuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbmRpYWxicmVjaHQvc3FscGFyc2VcIlxuICAgICAgfSlcbiJdfQ==
