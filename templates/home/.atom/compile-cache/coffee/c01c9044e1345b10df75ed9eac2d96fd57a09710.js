(function() {
  "use strict";
  var BashBeautify, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = BashBeautify = (function(superClass) {
    extend(BashBeautify, superClass);

    function BashBeautify() {
      return BashBeautify.__super__.constructor.apply(this, arguments);
    }

    BashBeautify.prototype.name = "beautysh";

    BashBeautify.prototype.link = "https://github.com/bemeurer/beautysh";

    BashBeautify.prototype.executables = [
      {
        name: "beautysh",
        cmd: "beautysh",
        homepage: "https://github.com/bemeurer/beautysh",
        installation: "https://github.com/bemeurer/beautysh#installation",
        version: {
          args: ['--help'],
          parse: function(text) {
            return text.indexOf("usage: beautysh") !== -1 && "0.0.0";
          }
        },
        docker: {
          image: "unibeautify/beautysh"
        }
      }
    ];

    BashBeautify.prototype.options = {
      Bash: {
        indent_size: true,
        indent_with_tabs: true
      }
    };

    BashBeautify.prototype.beautify = function(text, language, options) {
      var beautysh, file, tabs;
      beautysh = this.exe("beautysh");
      file = this.tempFile("input", text);
      tabs = options.indent_with_tabs;
      if (tabs === true) {
        return beautysh.run(['-t', '-f', file]).then((function(_this) {
          return function() {
            return _this.readFile(file);
          };
        })(this));
      } else {
        return beautysh.run(['-i', options.indent_size, '-f', file]).then((function(_this) {
          return function() {
            return _this.readFile(file);
          };
        })(this));
      }
    };

    return BashBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmVhdXR5c2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzsyQkFDckIsSUFBQSxHQUFNOzsyQkFDTixJQUFBLEdBQU07OzJCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFVBRFI7UUFFRSxHQUFBLEVBQUssVUFGUDtRQUdFLFFBQUEsRUFBVSxzQ0FIWjtRQUlFLFlBQUEsRUFBYyxtREFKaEI7UUFLRSxPQUFBLEVBQVM7VUFFUCxJQUFBLEVBQU0sQ0FBQyxRQUFELENBRkM7VUFHUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsaUJBQWIsQ0FBQSxLQUFxQyxDQUFDLENBQXRDLElBQTRDO1VBQXRELENBSEE7U0FMWDtRQVVFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyxzQkFERDtTQVZWO09BRFc7OzsyQkFpQmIsT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxnQkFBQSxFQUFrQixJQURsQjtPQUZLOzs7MkJBTVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTDtNQUNYLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkI7TUFDUCxJQUFBLEdBQU8sT0FBTyxDQUFDO01BQ2YsSUFBRyxJQUFBLEtBQVEsSUFBWDtlQUNFLFFBQVEsQ0FBQyxHQUFULENBQWEsQ0FBRSxJQUFGLEVBQVEsSUFBUixFQUFjLElBQWQsQ0FBYixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsRUFERjtPQUFBLE1BQUE7ZUFJRSxRQUFRLENBQUMsR0FBVCxDQUFhLENBQUUsSUFBRixFQUFRLE9BQU8sQ0FBQyxXQUFoQixFQUE2QixJQUE3QixFQUFtQyxJQUFuQyxDQUFiLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQUpGOztJQUpROzs7O0tBMUJnQztBQUg1QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCYXNoQmVhdXRpZnkgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiYmVhdXR5c2hcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9iZW1ldXJlci9iZWF1dHlzaFwiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJiZWF1dHlzaFwiXG4gICAgICBjbWQ6IFwiYmVhdXR5c2hcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JlbWV1cmVyL2JlYXV0eXNoXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20vYmVtZXVyZXIvYmVhdXR5c2gjaW5zdGFsbGF0aW9uXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgIyBEb2VzIG5vdCBkaXNwbGF5IHZlcnNpb25cbiAgICAgICAgYXJnczogWyctLWhlbHAnXSxcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0LmluZGV4T2YoXCJ1c2FnZTogYmVhdXR5c2hcIikgaXNudCAtMSBhbmQgXCIwLjAuMFwiXG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwidW5pYmVhdXRpZnkvYmVhdXR5c2hcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBCYXNoOlxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICAgIGluZGVudF93aXRoX3RhYnM6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgYmVhdXR5c2ggPSBAZXhlKFwiYmVhdXR5c2hcIilcbiAgICBmaWxlID0gQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICB0YWJzID0gb3B0aW9ucy5pbmRlbnRfd2l0aF90YWJzXG4gICAgaWYgdGFicyBpcyB0cnVlXG4gICAgICBiZWF1dHlzaC5ydW4oWyAnLXQnLCAnLWYnLCBmaWxlIF0pXG4gICAgICAgIC50aGVuKD0+IEByZWFkRmlsZSBmaWxlKVxuICAgIGVsc2VcbiAgICAgIGJlYXV0eXNoLnJ1bihbICctaScsIG9wdGlvbnMuaW5kZW50X3NpemUsICctZicsIGZpbGUgXSlcbiAgICAgICAgLnRoZW4oPT4gQHJlYWRGaWxlIGZpbGUpXG4iXX0=
