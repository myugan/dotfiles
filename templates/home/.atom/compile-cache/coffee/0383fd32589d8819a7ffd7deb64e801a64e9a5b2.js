
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Beautifier, ErlTidy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ErlTidy = (function(superClass) {
    extend(ErlTidy, superClass);

    function ErlTidy() {
      return ErlTidy.__super__.constructor.apply(this, arguments);
    }

    ErlTidy.prototype.name = "erl_tidy";

    ErlTidy.prototype.link = "http://erlang.org/doc/man/erl_tidy.html";

    ErlTidy.prototype.isPreInstalled = false;

    ErlTidy.prototype.options = {
      Erlang: true
    };

    ErlTidy.prototype.beautify = function(text, language, options) {
      var tempFile;
      tempFile = void 0;
      return this.tempFile("input", text).then((function(_this) {
        return function(path) {
          tempFile = path;
          return _this.run("erl", [["-eval", 'erl_tidy:file("' + tempFile + '")'], ["-noshell", "-s", "init", "stop"]], {
            help: {
              link: "http://erlang.org/doc/man/erl_tidy.html"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return ErlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZXJsX3RpZHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG1CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztzQkFFckIsSUFBQSxHQUFNOztzQkFDTixJQUFBLEdBQU07O3NCQUNOLGNBQUEsR0FBZ0I7O3NCQUVoQixPQUFBLEdBQVM7TUFDUCxNQUFBLEVBQVEsSUFERDs7O3NCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLFFBQUEsR0FBVzthQUNYLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUF3QixDQUFDLElBQXpCLENBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQzVCLFFBQUEsR0FBVztpQkFDWCxLQUFDLENBQUEsR0FBRCxDQUFLLEtBQUwsRUFBWSxDQUNWLENBQUMsT0FBRCxFQUFVLGlCQUFBLEdBQW9CLFFBQXBCLEdBQStCLElBQXpDLENBRFUsRUFFVixDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLE1BQW5CLEVBQTJCLE1BQTNCLENBRlUsQ0FBWixFQUlFO1lBQUUsSUFBQSxFQUFNO2NBQUUsSUFBQSxFQUFNLHlDQUFSO2FBQVI7V0FKRjtRQUY0QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0FRQyxDQUFDLElBUkYsQ0FRTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0wsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUlA7SUFGUTs7OztLQVYyQjtBQVB2QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFcmxUaWR5IGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6IFwiZXJsX3RpZHlcIlxuICBsaW5rOiBcImh0dHA6Ly9lcmxhbmcub3JnL2RvYy9tYW4vZXJsX3RpZHkuaHRtbFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBFcmxhbmc6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgdGVtcEZpbGUgPSB1bmRlZmluZWRcbiAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KS50aGVuKChwYXRoKSA9PlxuICAgICAgdGVtcEZpbGUgPSBwYXRoXG4gICAgICBAcnVuKFwiZXJsXCIsIFtcbiAgICAgICAgW1wiLWV2YWxcIiwgJ2VybF90aWR5OmZpbGUoXCInICsgdGVtcEZpbGUgKyAnXCIpJ11cbiAgICAgICAgW1wiLW5vc2hlbGxcIiwgXCItc1wiLCBcImluaXRcIiwgXCJzdG9wXCJdXG4gICAgICAgIF0sXG4gICAgICAgIHsgaGVscDogeyBsaW5rOiBcImh0dHA6Ly9lcmxhbmcub3JnL2RvYy9tYW4vZXJsX3RpZHkuaHRtbFwiIH0gfVxuICAgICAgICApXG4gICAgKS50aGVuKD0+XG4gICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgKVxuIl19
