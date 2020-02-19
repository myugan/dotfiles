
/*
Requires https://github.com/ocaml-ppx/ocamlformat
 */

(function() {
  "use strict";
  var Beautifier, OCamlFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = OCamlFormat = (function(superClass) {
    extend(OCamlFormat, superClass);

    function OCamlFormat() {
      return OCamlFormat.__super__.constructor.apply(this, arguments);
    }

    OCamlFormat.prototype.name = "ocamlformat";

    OCamlFormat.prototype.link = "https://github.com/ocaml-ppx/ocamlformat";

    OCamlFormat.prototype.executables = [
      {
        name: "ocamlformat",
        cmd: "ocamlformat",
        homepage: "https://github.com/ocaml-ppx/ocamlformat",
        installation: "https://github.com/ocaml-ppx/ocamlformat#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/(\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/(\d+\.\d+)/)[1] + ".0";
            }
          }
        }
      }
    ];

    OCamlFormat.prototype.options = {
      OCaml: true
    };

    OCamlFormat.prototype.beautify = function(text, language, options) {
      return this.run("ocamlformat", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/ocaml-ppx/ocamlformat"
        }
      });
    };

    return OCamlFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvb2NhbWxmb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLHVCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFDckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLGFBRFI7UUFFRSxHQUFBLEVBQUssYUFGUDtRQUdFLFFBQUEsRUFBVSwwQ0FIWjtRQUlFLFlBQUEsRUFBYyx1REFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO0FBQ0w7cUJBQ0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyxpQkFBWCxDQUE4QixDQUFBLENBQUEsRUFEaEM7YUFBQSxhQUFBO3FCQUdFLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWCxDQUF5QixDQUFBLENBQUEsQ0FBekIsR0FBOEIsS0FIaEM7O1VBREssQ0FEQTtTQUxYO09BRFc7OzswQkFnQmIsT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLElBREE7OzswQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssYUFBTCxFQUFvQixDQUNsQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEa0IsQ0FBcEIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSwwQ0FERjtTQURMO09BRkw7SUFEUTs7OztLQXZCK0I7QUFQM0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9vY2FtbC1wcHgvb2NhbWxmb3JtYXRcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgT0NhbWxGb3JtYXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwib2NhbWxmb3JtYXRcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9vY2FtbC1wcHgvb2NhbWxmb3JtYXRcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib2NhbWxmb3JtYXRcIlxuICAgICAgY21kOiBcIm9jYW1sZm9ybWF0XCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9vY2FtbC1wcHgvb2NhbWxmb3JtYXRcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9vY2FtbC1wcHgvb2NhbWxmb3JtYXQjaW5zdGFsbGF0aW9uXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPlxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgdGV4dC5tYXRjaCgvKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgICAgIGNhdGNoXG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC8oXFxkK1xcLlxcZCspLylbMV0gKyBcIi4wXCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgT0NhbWw6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcIm9jYW1sZm9ybWF0XCIsIFtcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdLCB7XG4gICAgICAgIGhlbHA6IHtcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9vY2FtbC1wcHgvb2NhbWxmb3JtYXRcIlxuICAgICAgICB9XG4gICAgICB9KVxuIl19
