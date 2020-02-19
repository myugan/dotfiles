(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(superClass) {
    extend(PrettyDiff, superClass);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.link = "https://github.com/prettydiff/prettydiff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ],
        ternaryline: "preserve_ternary_lines",
        bracepadding: "space_in_paren"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
      Mustache: true,
      Nunjucks: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      "UX Markup": true,
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true,
      "Golang Template": true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      options.crlf = this.getDefaultLineEnding(true, false, options.end_of_line);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var _, args, lang, prettydiff, result;
          prettydiff = require("prettydiff2");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
            case "Riot.js":
            case "XTemplate":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
            case "UX Markup":
              lang = "xml";
              break;
            case "HTML":
            case "Nunjucks":
            case "Coldfusion":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            case "Golang Template":
              lang = "go";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          result = prettydiff(options);
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHJldHR5ZGlmZi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUNyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBQ04sT0FBQSxHQUFTO01BRVAsQ0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRO1VBQUMsa0JBQUQsRUFBcUIsYUFBckIsRUFBb0MsU0FBQyxnQkFBRCxFQUFtQixXQUFuQjtZQUMxQyxJQUFJLGdCQUFBLEtBQW9CLElBQXhCO3FCQUNFLEtBREY7YUFBQSxNQUFBO3FCQUNZLFlBRFo7O1VBRDBDLENBQXBDO1NBQVI7UUFJQSxNQUFBLEVBQVE7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CO1lBQzFDLElBQUksZ0JBQUEsS0FBb0IsSUFBeEI7cUJBQ0UsRUFERjthQUFBLE1BQUE7cUJBQ1MsWUFEVDs7VUFEMEMsQ0FBcEM7U0FKUjtRQVFBLE9BQUEsRUFBUyxTQUFDLE9BQUQ7aUJBQ1AsT0FBQSxJQUFXO1FBREosQ0FSVDtRQVVBLFFBQUEsRUFBVTtVQUFDLG1CQUFELEVBQXNCLFNBQUMsaUJBQUQ7WUFDOUIsSUFBSSxpQkFBQSxLQUFxQixJQUF6QjtxQkFDRSxNQURGO2FBQUEsTUFBQTtxQkFDYSxPQURiOztVQUQ4QixDQUF0QjtTQVZWO1FBY0EsY0FBQSxFQUFnQix1QkFkaEI7UUFlQSxRQUFBLEVBQVU7VUFBQyxpQkFBRCxFQUFvQixTQUFDLGVBQUQ7WUFDNUIsSUFBSSxlQUFBLEtBQW1CLEtBQXZCO3FCQUNFLFdBREY7YUFBQSxNQUFBO3FCQUNrQixT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QUEsR0FBTztBQURKO0FBZlAsaUJBaUJPLE1BakJQO2NBa0JJLElBQUEsR0FBTztBQURKO0FBakJQLGlCQW1CTyxLQW5CUDtjQW9CSSxJQUFBLEdBQU87QUFESjtBQW5CUCxpQkFxQk8sTUFyQlA7Y0FzQkksSUFBQSxHQUFPO0FBREo7QUFyQlAsaUJBdUJPLEtBdkJQO2NBd0JJLElBQUEsR0FBTztBQURKO0FBdkJQLGlCQXlCTyxNQXpCUDtjQTBCSSxJQUFBLEdBQU87QUFESjtBQXpCUCxpQkEyQk8sTUEzQlA7Y0E0QkksSUFBQSxHQUFPO0FBREo7QUEzQlAsaUJBNkJPLEtBN0JQO2NBOEJJLElBQUEsR0FBTztBQURKO0FBN0JQLGlCQStCTyxpQkEvQlA7Y0FnQ0ksSUFBQSxHQUFPO0FBREo7QUEvQlA7Y0FrQ0ksSUFBQSxHQUFPO0FBbENYO1VBcUNBLElBQUEsR0FDRTtZQUFBLE1BQUEsRUFBUSxJQUFSO1lBQ0EsSUFBQSxFQUFNLElBRE47WUFFQSxJQUFBLEVBQU0sVUFGTjs7VUFLRixDQUFDLENBQUMsS0FBRixDQUFRLE9BQVIsRUFBaUIsSUFBakI7VUFHQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsT0FBdkI7VUFDQSxNQUFBLEdBQVMsVUFBQSxDQUFXLE9BQVg7aUJBR1QsT0FBQSxDQUFRLE1BQVI7UUF4RGtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiO0lBRkM7Ozs7S0FyRThCO0FBSDFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFByZXR0eURpZmYgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUHJldHR5IERpZmZcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9wcmV0dHlkaWZmL3ByZXR0eWRpZmZcIlxuICBvcHRpb25zOiB7XG4gICAgIyBBcHBseSB0aGVzZSBvcHRpb25zIGZpcnN0IC8gZ2xvYmFsbHksIGZvciBhbGwgbGFuZ3VhZ2VzXG4gICAgXzpcbiAgICAgIGluY2hhcjogW1wiaW5kZW50X3dpdGhfdGFic1wiLCBcImluZGVudF9jaGFyXCIsIChpbmRlbnRfd2l0aF90YWJzLCBpbmRlbnRfY2hhcikgLT5cbiAgICAgICAgaWYgKGluZGVudF93aXRoX3RhYnMgaXMgdHJ1ZSkgdGhlbiBcXFxuICAgICAgICAgIFwiXFx0XCIgZWxzZSBpbmRlbnRfY2hhclxuICAgICAgXVxuICAgICAgaW5zaXplOiBbXCJpbmRlbnRfd2l0aF90YWJzXCIsIFwiaW5kZW50X3NpemVcIiwgKGluZGVudF93aXRoX3RhYnMsIGluZGVudF9zaXplKSAtPlxuICAgICAgICBpZiAoaW5kZW50X3dpdGhfdGFicyBpcyB0cnVlKSB0aGVuIFxcXG4gICAgICAgICAgMSBlbHNlIGluZGVudF9zaXplXG4gICAgICBdXG4gICAgICBvYmpzb3J0OiAob2Jqc29ydCkgLT5cbiAgICAgICAgb2Jqc29ydCBvciBmYWxzZVxuICAgICAgcHJlc2VydmU6IFsncHJlc2VydmVfbmV3bGluZXMnLCAocHJlc2VydmVfbmV3bGluZXMpIC0+XG4gICAgICAgIGlmIChwcmVzZXJ2ZV9uZXdsaW5lcyBpcyB0cnVlICkgdGhlbiBcXFxuICAgICAgICAgIFwiYWxsXCIgZWxzZSBcIm5vbmVcIlxuICAgICAgXVxuICAgICAgY3NzaW5zZXJ0bGluZXM6IFwibmV3bGluZV9iZXR3ZWVuX3J1bGVzXCJcbiAgICAgIGNvbW1lbnRzOiBbXCJpbmRlbnRfY29tbWVudHNcIiwgKGluZGVudF9jb21tZW50cykgLT5cbiAgICAgICAgaWYgKGluZGVudF9jb21tZW50cyBpcyBmYWxzZSkgdGhlbiBcXFxuICAgICAgICAgIFwibm9pbmRlbnRcIiBlbHNlIFwiaW5kZW50XCJcbiAgICAgIF1cbiAgICAgIGZvcmNlOiBcImZvcmNlX2luZGVudGF0aW9uXCJcbiAgICAgIHF1b3RlQ29udmVydDogXCJjb252ZXJ0X3F1b3Rlc1wiXG4gICAgICB2ZXJ0aWNhbDogWydhbGlnbl9hc3NpZ25tZW50cycsIChhbGlnbl9hc3NpZ25tZW50cykgLT5cbiAgICAgICAgaWYgKGFsaWduX2Fzc2lnbm1lbnRzIGlzIHRydWUgKSB0aGVuIFxcXG4gICAgICAgICAgXCJhbGxcIiBlbHNlIFwibm9uZVwiXG4gICAgICBdXG4gICAgICB3cmFwOiBcIndyYXBfbGluZV9sZW5ndGhcIlxuICAgICAgc3BhY2U6IFwic3BhY2VfYWZ0ZXJfYW5vbl9mdW5jdGlvblwiXG4gICAgICBub2xlYWR6ZXJvOiBcIm5vX2xlYWRfemVyb1wiXG4gICAgICBlbmRjb21tYTogXCJlbmRfd2l0aF9jb21tYVwiXG4gICAgICBtZXRob2RjaGFpbjogWydicmVha19jaGFpbmVkX21ldGhvZHMnLCAoYnJlYWtfY2hhaW5lZF9tZXRob2RzKSAtPlxuICAgICAgICBpZiAoYnJlYWtfY2hhaW5lZF9tZXRob2RzIGlzIHRydWUgKSB0aGVuIFxcXG4gICAgICAgICAgZmFsc2UgZWxzZSB0cnVlXG4gICAgICBdXG4gICAgICB0ZXJuYXJ5bGluZTogXCJwcmVzZXJ2ZV90ZXJuYXJ5X2xpbmVzXCJcbiAgICAgIGJyYWNlcGFkZGluZzogXCJzcGFjZV9pbl9wYXJlblwiXG4gICAgIyBBcHBseSBsYW5ndWFnZS1zcGVjaWZpYyBvcHRpb25zXG4gICAgQ1NWOiB0cnVlXG4gICAgQ29sZGZ1c2lvbjogdHJ1ZVxuICAgIEVSQjogdHJ1ZVxuICAgIEVKUzogdHJ1ZVxuICAgIEhUTUw6IHRydWVcbiAgICBIYW5kbGViYXJzOiB0cnVlXG4gICAgTXVzdGFjaGU6IHRydWVcbiAgICBOdW5qdWNrczogdHJ1ZVxuICAgIFhNTDogdHJ1ZVxuICAgIFNWRzogdHJ1ZVxuICAgIFNwYWNlYmFyczogdHJ1ZVxuICAgIEpTWDogdHJ1ZVxuICAgIEphdmFTY3JpcHQ6IHRydWVcbiAgICBDU1M6IHRydWVcbiAgICBTQ1NTOiB0cnVlXG4gICAgSlNPTjogdHJ1ZVxuICAgIFRTUzogdHJ1ZVxuICAgIFR3aWc6IHRydWVcbiAgICBMRVNTOiB0cnVlXG4gICAgU3dpZzogdHJ1ZVxuICAgIFwiVVggTWFya3VwXCI6IHRydWVcbiAgICBWaXN1YWxmb3JjZTogdHJ1ZVxuICAgIFwiUmlvdC5qc1wiOiB0cnVlXG4gICAgWFRlbXBsYXRlOiB0cnVlXG4gICAgXCJHb2xhbmcgVGVtcGxhdGVcIjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLmNybGYgPSBAZ2V0RGVmYXVsdExpbmVFbmRpbmcodHJ1ZSxmYWxzZSxvcHRpb25zLmVuZF9vZl9saW5lKVxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHByZXR0eWRpZmYgPSByZXF1aXJlKFwicHJldHR5ZGlmZjJcIilcbiAgICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG4gICAgICAjIFNlbGVjdCBQcmV0dHlkaWZmIGxhbmd1YWdlXG4gICAgICBsYW5nID0gXCJhdXRvXCJcbiAgICAgIHN3aXRjaCBsYW5ndWFnZVxuICAgICAgICB3aGVuIFwiQ1NWXCJcbiAgICAgICAgICBsYW5nID0gXCJjc3ZcIlxuICAgICAgICB3aGVuIFwiRUpTXCIsIFwiVHdpZ1wiXG4gICAgICAgICAgbGFuZyA9IFwiZWpzXCJcbiAgICAgICAgd2hlbiBcIkVSQlwiXG4gICAgICAgICAgbGFuZyA9IFwiaHRtbF9ydWJ5XCJcbiAgICAgICAgd2hlbiBcIkhhbmRsZWJhcnNcIiwgXCJNdXN0YWNoZVwiLCBcIlNwYWNlYmFyc1wiLCBcIlN3aWdcIiwgXCJSaW90LmpzXCIsIFwiWFRlbXBsYXRlXCJcbiAgICAgICAgICBsYW5nID0gXCJoYW5kbGViYXJzXCJcbiAgICAgICAgd2hlbiBcIlNHTUxcIlxuICAgICAgICAgIGxhbmcgPSBcIm1hcmt1cFwiXG4gICAgICAgIHdoZW4gXCJYTUxcIiwgXCJWaXN1YWxmb3JjZVwiLCBcIlNWR1wiLCBcIlVYIE1hcmt1cFwiXG4gICAgICAgICAgbGFuZyA9IFwieG1sXCJcbiAgICAgICAgd2hlbiBcIkhUTUxcIiwgXCJOdW5qdWNrc1wiLCBcIkNvbGRmdXNpb25cIlxuICAgICAgICAgIGxhbmcgPSBcImh0bWxcIlxuICAgICAgICB3aGVuIFwiSmF2YVNjcmlwdFwiXG4gICAgICAgICAgbGFuZyA9IFwiamF2YXNjcmlwdFwiXG4gICAgICAgIHdoZW4gXCJKU09OXCJcbiAgICAgICAgICBsYW5nID0gXCJqc29uXCJcbiAgICAgICAgd2hlbiBcIkpTWFwiXG4gICAgICAgICAgbGFuZyA9IFwianN4XCJcbiAgICAgICAgd2hlbiBcIkpTVExcIlxuICAgICAgICAgIGxhbmcgPSBcImpzcFwiXG4gICAgICAgIHdoZW4gXCJDU1NcIlxuICAgICAgICAgIGxhbmcgPSBcImNzc1wiXG4gICAgICAgIHdoZW4gXCJMRVNTXCJcbiAgICAgICAgICBsYW5nID0gXCJsZXNzXCJcbiAgICAgICAgd2hlbiBcIlNDU1NcIlxuICAgICAgICAgIGxhbmcgPSBcInNjc3NcIlxuICAgICAgICB3aGVuIFwiVFNTXCJcbiAgICAgICAgICBsYW5nID0gXCJ0c3NcIlxuICAgICAgICB3aGVuIFwiR29sYW5nIFRlbXBsYXRlXCJcbiAgICAgICAgICBsYW5nID0gXCJnb1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYW5nID0gXCJhdXRvXCJcblxuICAgICAgIyBQcmV0dHlkaWZmIEFyZ3VtZW50c1xuICAgICAgYXJncyA9XG4gICAgICAgIHNvdXJjZTogdGV4dFxuICAgICAgICBsYW5nOiBsYW5nXG4gICAgICAgIG1vZGU6IFwiYmVhdXRpZnlcIlxuXG4gICAgICAjIE1lcmdlIGFyZ3MgaW50b3Mgb3B0aW9uc1xuICAgICAgXy5tZXJnZShvcHRpb25zLCBhcmdzKVxuXG4gICAgICAjIEJlYXV0aWZ5XG4gICAgICBAdmVyYm9zZSgncHJldHR5ZGlmZicsIG9wdGlvbnMpXG4gICAgICByZXN1bHQgPSBwcmV0dHlkaWZmKG9wdGlvbnMpXG5cbiAgICAgICMgUmV0dXJuIGJlYXV0aWZpZWQgdGV4dFxuICAgICAgcmVzb2x2ZShyZXN1bHQpXG5cbiAgICApXG4iXX0=
