(function() {
  "use strict";
  var Beautifier, JSBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(superClass) {
    extend(JSBeautify, superClass);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "JS Beautify";

    JSBeautify.prototype.link = "https://github.com/beautify-web/js-beautify";

    JSBeautify.prototype.options = {
      Blade: true,
      HTML: true,
      XML: true,
      Handlebars: true,
      Mustache: true,
      JavaScript: true,
      EJS: true,
      JSX: true,
      JSON: true,
      CSS: {
        indent_size: true,
        indent_char: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        preserve_newlines: true,
        wrap_line_length: true,
        end_with_newline: true
      }
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      this.verbose("JS Beautify language " + language);
      this.info("JS Beautify Options: " + (JSON.stringify(options, null, 4)));
      options.eol = this.getDefaultLineEnding('\r\n', '\n', options.end_of_line);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var beautifyCSS, beautifyHTML, beautifyJS, err;
          try {
            switch (language) {
              case "JSON":
              case "JavaScript":
              case "JSX":
                beautifyJS = require("js-beautify");
                text = beautifyJS(text, options);
                return resolve(text);
              case "Handlebars":
              case "Mustache":
                options.indent_handlebars = true;
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                return resolve(text);
              case "EJS":
              case "HTML (Liquid)":
              case "HTML":
              case "XML":
              case "Web Form/Control (C#)":
              case "Web Handler (C#)":
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              case "CSS":
                beautifyCSS = require("js-beautify").css;
                text = beautifyCSS(text, options);
                return resolve(text);
              case "Blade":
                beautifyHTML = require("js-beautify").html;
                text = text.replace(/\@(?!yield)([^\n\s]*)/ig, "<blade $1 />");
                text = beautifyHTML(text, options);
                text = text.replace(/<blade ([^\n\s]*)\s*\/>/ig, "@$1");
                text = text.replace(/\(\ \'/ig, "('");
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              default:
                return reject(new Error("Unknown language for JS Beautify: " + language));
            }
          } catch (error) {
            err = error;
            _this.error("JS Beautify error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvanMtYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt5QkFDckIsSUFBQSxHQUFNOzt5QkFDTixJQUFBLEdBQU07O3lCQUVOLE9BQUEsR0FBUztNQUNQLEtBQUEsRUFBTyxJQURBO01BRVAsSUFBQSxFQUFNLElBRkM7TUFHUCxHQUFBLEVBQUssSUFIRTtNQUlQLFVBQUEsRUFBWSxJQUpMO01BS1AsUUFBQSxFQUFVLElBTEg7TUFNUCxVQUFBLEVBQVksSUFOTDtNQU9QLEdBQUEsRUFBSyxJQVBFO01BUVAsR0FBQSxFQUFLLElBUkU7TUFTUCxJQUFBLEVBQU0sSUFUQztNQVVQLEdBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO1FBQ0EsV0FBQSxFQUFhLElBRGI7UUFFQSwwQkFBQSxFQUE0QixJQUY1QjtRQUdBLHFCQUFBLEVBQXVCLElBSHZCO1FBSUEsaUJBQUEsRUFBbUIsSUFKbkI7UUFLQSxnQkFBQSxFQUFrQixJQUxsQjtRQU1BLGdCQUFBLEVBQWtCLElBTmxCO09BWEs7Ozt5QkFvQlQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7TUFDUixJQUFDLENBQUEsT0FBRCxDQUFTLHVCQUFBLEdBQXdCLFFBQWpDO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSx1QkFBQSxHQUF1QixDQUFDLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFELENBQTdCO01BQ0EsT0FBTyxDQUFDLEdBQVIsR0FBYyxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsRUFBNkIsSUFBN0IsRUFBa0MsT0FBTyxDQUFDLFdBQTFDO0FBQ2QsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLGNBQUE7QUFBQTtBQUNFLG9CQUFPLFFBQVA7QUFBQSxtQkFDTyxNQURQO0FBQUEsbUJBQ2UsWUFEZjtBQUFBLG1CQUM2QixLQUQ3QjtnQkFFSSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7Z0JBQ2IsSUFBQSxHQUFPLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLE9BQWpCO3VCQUNQLE9BQUEsQ0FBUSxJQUFSO0FBSkosbUJBS08sWUFMUDtBQUFBLG1CQUtxQixVQUxyQjtnQkFPSSxPQUFPLENBQUMsaUJBQVIsR0FBNEI7Z0JBRTVCLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUN0QyxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFYSixtQkFZTyxLQVpQO0FBQUEsbUJBWWMsZUFaZDtBQUFBLG1CQVkrQixNQVovQjtBQUFBLG1CQVl1QyxLQVp2QztBQUFBLG1CQVk4Qyx1QkFaOUM7QUFBQSxtQkFZdUUsa0JBWnZFO2dCQWFJLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUN0QyxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkI7Z0JBQ1AsS0FBQyxDQUFBLEtBQUQsQ0FBTyxtQkFBQSxHQUFvQixJQUEzQjt1QkFDQSxPQUFBLENBQVEsSUFBUjtBQWhCSixtQkFpQk8sS0FqQlA7Z0JBa0JJLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUNyQyxJQUFBLEdBQU8sV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFwQkosbUJBcUJPLE9BckJQO2dCQXNCSSxZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQztnQkFFdEMsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEseUJBQWIsRUFBd0MsY0FBeEM7Z0JBQ1AsSUFBQSxHQUFPLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CO2dCQUVQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLDJCQUFiLEVBQTBDLEtBQTFDO2dCQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFBeUIsSUFBekI7Z0JBQ1AsS0FBQyxDQUFBLEtBQUQsQ0FBTyxtQkFBQSxHQUFvQixJQUEzQjt1QkFDQSxPQUFBLENBQVEsSUFBUjtBQTlCSjt1QkFnQ0ksTUFBQSxDQUFPLElBQUksS0FBSixDQUFVLG9DQUFBLEdBQXFDLFFBQS9DLENBQVA7QUFoQ0osYUFERjtXQUFBLGFBQUE7WUFrQ007WUFDSixLQUFDLENBQUEsS0FBRCxDQUFPLHFCQUFBLEdBQXNCLEdBQTdCO21CQUNBLE1BQUEsQ0FBTyxHQUFQLEVBcENGOztRQURrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtJQUpDOzs7O0tBeEI4QjtBQUgxQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBKU0JlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkpTIEJlYXV0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmVhdXRpZnktd2ViL2pzLWJlYXV0aWZ5XCJcblxuICBvcHRpb25zOiB7XG4gICAgQmxhZGU6IHRydWVcbiAgICBIVE1MOiB0cnVlXG4gICAgWE1MOiB0cnVlXG4gICAgSGFuZGxlYmFyczogdHJ1ZVxuICAgIE11c3RhY2hlOiB0cnVlXG4gICAgSmF2YVNjcmlwdDogdHJ1ZVxuICAgIEVKUzogdHJ1ZVxuICAgIEpTWDogdHJ1ZVxuICAgIEpTT046IHRydWVcbiAgICBDU1M6XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgaW5kZW50X2NoYXI6IHRydWVcbiAgICAgIHNlbGVjdG9yX3NlcGFyYXRvcl9uZXdsaW5lOiB0cnVlXG4gICAgICBuZXdsaW5lX2JldHdlZW5fcnVsZXM6IHRydWVcbiAgICAgIHByZXNlcnZlX25ld2xpbmVzOiB0cnVlXG4gICAgICB3cmFwX2xpbmVfbGVuZ3RoOiB0cnVlXG4gICAgICBlbmRfd2l0aF9uZXdsaW5lOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEB2ZXJib3NlKFwiSlMgQmVhdXRpZnkgbGFuZ3VhZ2UgI3tsYW5ndWFnZX1cIilcbiAgICBAaW5mbyhcIkpTIEJlYXV0aWZ5IE9wdGlvbnM6ICN7SlNPTi5zdHJpbmdpZnkob3B0aW9ucywgbnVsbCwgNCl9XCIpXG4gICAgb3B0aW9ucy5lb2wgPSBAZ2V0RGVmYXVsdExpbmVFbmRpbmcoJ1xcclxcbicsJ1xcbicsb3B0aW9ucy5lbmRfb2ZfbGluZSlcbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICB0cnlcbiAgICAgICAgc3dpdGNoIGxhbmd1YWdlXG4gICAgICAgICAgd2hlbiBcIkpTT05cIiwgXCJKYXZhU2NyaXB0XCIsIFwiSlNYXCJcbiAgICAgICAgICAgIGJlYXV0aWZ5SlMgPSByZXF1aXJlKFwianMtYmVhdXRpZnlcIilcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUpTKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICByZXNvbHZlIHRleHRcbiAgICAgICAgICB3aGVuIFwiSGFuZGxlYmFyc1wiLCBcIk11c3RhY2hlXCJcbiAgICAgICAgICAgICMganNoaW50IGlnbm9yZTogc3RhcnRcbiAgICAgICAgICAgIG9wdGlvbnMuaW5kZW50X2hhbmRsZWJhcnMgPSB0cnVlICMgRm9yY2UganNiZWF1dGlmeSB0byBpbmRlbnRfaGFuZGxlYmFyc1xuICAgICAgICAgICAgIyBqc2hpbnQgaWdub3JlOiBlbmRcbiAgICAgICAgICAgIGJlYXV0aWZ5SFRNTCA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5odG1sXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlIVE1MKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICByZXNvbHZlIHRleHRcbiAgICAgICAgICB3aGVuIFwiRUpTXCIsIFwiSFRNTCAoTGlxdWlkKVwiLCBcIkhUTUxcIiwgXCJYTUxcIiwgXCJXZWIgRm9ybS9Db250cm9sIChDIylcIiwgXCJXZWIgSGFuZGxlciAoQyMpXCJcbiAgICAgICAgICAgIGJlYXV0aWZ5SFRNTCA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5odG1sXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlIVE1MKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICBAZGVidWcoXCJCZWF1dGlmaWVkIEhUTUw6ICN7dGV4dH1cIilcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJDU1NcIlxuICAgICAgICAgICAgYmVhdXRpZnlDU1MgPSByZXF1aXJlKFwianMtYmVhdXRpZnlcIikuY3NzXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlDU1ModGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJCbGFkZVwiXG4gICAgICAgICAgICBiZWF1dGlmeUhUTUwgPSByZXF1aXJlKFwianMtYmVhdXRpZnlcIikuaHRtbFxuICAgICAgICAgICAgIyBwcmUgc2NyaXB0IChXb3JrYXJvdW5kKVxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxAKD8heWllbGQpKFteXFxuXFxzXSopL2lnLCBcIjxibGFkZSAkMSAvPlwiKVxuICAgICAgICAgICAgdGV4dCA9IGJlYXV0aWZ5SFRNTCh0ZXh0LCBvcHRpb25zKVxuICAgICAgICAgICAgIyBwb3N0IHNjcmlwdCAoV29ya2Fyb3VuZClcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLzxibGFkZSAoW15cXG5cXHNdKilcXHMqXFwvPi9pZywgXCJAJDFcIilcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcKFxcIFxcJy9pZywgXCIoJ1wiKVxuICAgICAgICAgICAgQGRlYnVnKFwiQmVhdXRpZmllZCBIVE1MOiAje3RleHR9XCIpXG4gICAgICAgICAgICByZXNvbHZlIHRleHRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiVW5rbm93biBsYW5ndWFnZSBmb3IgSlMgQmVhdXRpZnk6IFwiK2xhbmd1YWdlKSlcbiAgICAgIGNhdGNoIGVyclxuICAgICAgICBAZXJyb3IoXCJKUyBCZWF1dGlmeSBlcnJvcjogI3tlcnJ9XCIpXG4gICAgICAgIHJlamVjdChlcnIpXG5cbiAgICApXG4iXX0=
