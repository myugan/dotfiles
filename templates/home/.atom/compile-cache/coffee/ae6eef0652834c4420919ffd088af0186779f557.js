
/*
Requires https://github.com/erniebrodeur/ruby-beautify
 */

(function() {
  "use strict";
  var Beautifier, RubyBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = RubyBeautify = (function(superClass) {
    extend(RubyBeautify, superClass);

    function RubyBeautify() {
      return RubyBeautify.__super__.constructor.apply(this, arguments);
    }

    RubyBeautify.prototype.name = "Ruby Beautify";

    RubyBeautify.prototype.link = "https://github.com/erniebrodeur/ruby-beautify";

    RubyBeautify.prototype.isPreInstalled = false;

    RubyBeautify.prototype.options = {
      Ruby: {
        indent_size: true,
        indent_char: true
      }
    };

    RubyBeautify.prototype.beautify = function(text, language, options) {
      return this.run("rbeautify", [options.indent_char === '\t' ? "--tabs" : "--spaces", "--indent_count", options.indent_size, this.tempFile("input", text)], {
        help: {
          link: "https://github.com/erniebrodeur/ruby-beautify"
        }
      });
    };

    return RubyBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVieS1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsd0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzJCQUNyQixJQUFBLEdBQU07OzJCQUNOLElBQUEsR0FBTTs7MkJBQ04sY0FBQSxHQUFnQjs7MkJBRWhCLE9BQUEsR0FBUztNQUNQLElBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO1FBQ0EsV0FBQSxFQUFhLElBRGI7T0FGSzs7OzJCQU1ULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBQWtCLENBQ2IsT0FBTyxDQUFDLFdBQVIsS0FBdUIsSUFBMUIsR0FBb0MsUUFBcEMsR0FBa0QsVUFEbEMsRUFFaEIsZ0JBRmdCLEVBRUUsT0FBTyxDQUFDLFdBRlYsRUFHaEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBSGdCLENBQWxCLEVBSUs7UUFBQSxJQUFBLEVBQU07VUFDUCxJQUFBLEVBQU0sK0NBREM7U0FBTjtPQUpMO0lBRFE7Ozs7S0FYZ0M7QUFQNUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9lcm5pZWJyb2RldXIvcnVieS1iZWF1dGlmeVxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSdWJ5QmVhdXRpZnkgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUnVieSBCZWF1dGlmeVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2VybmllYnJvZGV1ci9ydWJ5LWJlYXV0aWZ5XCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIFJ1Ynk6XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgaW5kZW50X2NoYXI6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcInJiZWF1dGlmeVwiLCBbXG4gICAgICBpZiBvcHRpb25zLmluZGVudF9jaGFyIGlzICdcXHQnIHRoZW4gXCItLXRhYnNcIiBlbHNlIFwiLS1zcGFjZXNcIlxuICAgICAgXCItLWluZGVudF9jb3VudFwiLCBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9lcm5pZWJyb2RldXIvcnVieS1iZWF1dGlmeVwiXG4gICAgICB9KVxuIl19
