(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(superClass) {
    extend(TypeScriptFormatter, superClass);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.link = "https://github.com/vvakame/typescript-formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: {
        indent_with_tabs: true,
        tab_width: true,
        indent_size: true
      },
      TSX: {
        indent_with_tabs: true,
        tab_width: true,
        indent_size: true
      }
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, fileName, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter").format;
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeSettings();
            if (options.indent_with_tabs) {
              opts.convertTabsToSpaces = false;
            } else {
              opts.tabSize = options.tab_width || options.indent_size;
              opts.indentSize = options.indent_size;
              opts.indentStyle = 'space';
            }
            if (language === "TSX") {
              fileName = 'test.tsx';
            } else {
              fileName = '';
            }
            _this.verbose('typescript', text, opts);
            result = format(fileName, text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (error) {
            e = error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdHlwZXNjcmlwdC1mb3JtYXR0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztrQ0FDckIsSUFBQSxHQUFNOztrQ0FDTixJQUFBLEdBQU07O2tDQUNOLE9BQUEsR0FBUztNQUNQLFVBQUEsRUFDRTtRQUFBLGdCQUFBLEVBQWtCLElBQWxCO1FBQ0EsU0FBQSxFQUFXLElBRFg7UUFFQSxXQUFBLEVBQWEsSUFGYjtPQUZLO01BS1AsR0FBQSxFQUNFO1FBQUEsZ0JBQUEsRUFBa0IsSUFBbEI7UUFDQSxTQUFBLEVBQVcsSUFEWDtRQUVBLFdBQUEsRUFBYSxJQUZiO09BTks7OztrQ0FXVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUVsQixjQUFBO0FBQUE7WUFDRSxNQUFBLEdBQVMsT0FBQSxDQUFRLG9DQUFSLENBQTZDLENBQUM7WUFDdkQsY0FBQSxHQUFpQixPQUFBLENBQVEsZ0NBQVI7WUFHakIsSUFBQSxHQUFPLGNBQWMsQ0FBQywrQkFBZixDQUFBO1lBRVAsSUFBRyxPQUFPLENBQUMsZ0JBQVg7Y0FDRSxJQUFJLENBQUMsbUJBQUwsR0FBMkIsTUFEN0I7YUFBQSxNQUFBO2NBR0UsSUFBSSxDQUFDLE9BQUwsR0FBZSxPQUFPLENBQUMsU0FBUixJQUFxQixPQUFPLENBQUM7Y0FDNUMsSUFBSSxDQUFDLFVBQUwsR0FBa0IsT0FBTyxDQUFDO2NBQzFCLElBQUksQ0FBQyxXQUFMLEdBQW1CLFFBTHJCOztZQU9BLElBQUcsUUFBQSxLQUFZLEtBQWY7Y0FDRSxRQUFBLEdBQVcsV0FEYjthQUFBLE1BQUE7Y0FHRSxRQUFBLEdBQVcsR0FIYjs7WUFLQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0I7WUFDQSxNQUFBLEdBQVMsTUFBQSxDQUFPLFFBQVAsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkI7WUFDVCxLQUFDLENBQUEsT0FBRCxDQUFTLE1BQVQ7bUJBQ0EsT0FBQSxDQUFRLE1BQVIsRUF0QkY7V0FBQSxhQUFBO1lBdUJNO0FBQ0osbUJBQU8sTUFBQSxDQUFPLENBQVAsRUF4QlQ7O1FBRmtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiO0lBREM7Ozs7S0FkdUM7QUFIbkQiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHlwZVNjcmlwdEZvcm1hdHRlciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJUeXBlU2NyaXB0IEZvcm1hdHRlclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3Z2YWthbWUvdHlwZXNjcmlwdC1mb3JtYXR0ZXJcIlxuICBvcHRpb25zOiB7XG4gICAgVHlwZVNjcmlwdDpcbiAgICAgIGluZGVudF93aXRoX3RhYnM6IHRydWVcbiAgICAgIHRhYl93aWR0aDogdHJ1ZVxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICBUU1g6XG4gICAgICBpbmRlbnRfd2l0aF90YWJzOiB0cnVlXG4gICAgICB0YWJfd2lkdGg6IHRydWVcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cblxuICAgICAgdHJ5XG4gICAgICAgIGZvcm1hdCA9IHJlcXVpcmUoXCJ0eXBlc2NyaXB0LWZvcm1hdHRlci9saWIvZm9ybWF0dGVyXCIpLmZvcm1hdFxuICAgICAgICBmb3JtYXR0ZXJVdGlscyA9IHJlcXVpcmUoXCJ0eXBlc2NyaXB0LWZvcm1hdHRlci9saWIvdXRpbHNcIilcbiAgICAgICAgIyBAdmVyYm9zZSgnZm9ybWF0JywgZm9ybWF0LCBmb3JtYXR0ZXJVdGlscylcblxuICAgICAgICBvcHRzID0gZm9ybWF0dGVyVXRpbHMuY3JlYXRlRGVmYXVsdEZvcm1hdENvZGVTZXR0aW5ncygpXG5cbiAgICAgICAgaWYgb3B0aW9ucy5pbmRlbnRfd2l0aF90YWJzXG4gICAgICAgICAgb3B0cy5jb252ZXJ0VGFic1RvU3BhY2VzID0gZmFsc2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9wdHMudGFiU2l6ZSA9IG9wdGlvbnMudGFiX3dpZHRoIG9yIG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgICAgICBvcHRzLmluZGVudFNpemUgPSBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICAgICAgb3B0cy5pbmRlbnRTdHlsZSA9ICdzcGFjZSdcblxuICAgICAgICBpZiBsYW5ndWFnZSBpcyBcIlRTWFwiXG4gICAgICAgICAgZmlsZU5hbWUgPSAndGVzdC50c3gnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmaWxlTmFtZSA9ICcnXG5cbiAgICAgICAgQHZlcmJvc2UoJ3R5cGVzY3JpcHQnLCB0ZXh0LCBvcHRzKVxuICAgICAgICByZXN1bHQgPSBmb3JtYXQoZmlsZU5hbWUsIHRleHQsIG9wdHMpXG4gICAgICAgIEB2ZXJib3NlKHJlc3VsdClcbiAgICAgICAgcmVzb2x2ZSByZXN1bHRcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgcmV0dXJuIHJlamVjdChlKVxuXG4gICAgKVxuIl19
