(function() {
  module.exports = {
    name: "JavaScript",
    namespace: "js",
    scope: ['source.js'],

    /*
    Supported Grammars
     */
    grammars: ["JavaScript"],

    /*
    Supported extensions
     */
    extensions: ["js"],
    defaultBeautifier: "JS Beautify",

    /*
     */
    options: {
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": null,
        description: "Indentation character"
      },
      indent_level: {
        type: 'integer',
        "default": 0,
        description: "Initial indentation level"
      },
      indent_with_tabs: {
        type: 'boolean',
        "default": null,
        description: "Indentation uses tabs, overrides `Indent Size` and `Indent Char`"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      },
      max_preserve_newlines: {
        type: 'integer',
        "default": 10,
        description: "Number of line-breaks to be preserved in one chunk"
      },
      space_in_paren: {
        type: 'boolean',
        "default": false,
        description: "Add padding spaces within paren, ie. f( a, b )"
      },
      jslint_happy: {
        type: 'boolean',
        "default": false,
        description: "Enable jslint-stricter mode"
      },
      space_after_anon_function: {
        type: 'boolean',
        "default": false,
        description: "Add a space before an anonymous function's parens, ie. function ()"
      },
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "collapse-preserve-inline", "expand", "end-expand", "none"],
        description: "[collapse|collapse-preserve-inline|expand|end-expand|none]"
      },
      break_chained_methods: {
        type: 'boolean',
        "default": false,
        description: "Break chained method calls across subsequent lines"
      },
      keep_array_indentation: {
        type: 'boolean',
        "default": false,
        description: "Preserve array indentation"
      },
      keep_function_indentation: {
        type: 'boolean',
        "default": false,
        description: ""
      },
      space_before_conditional: {
        type: 'boolean',
        "default": true,
        description: ""
      },
      eval_code: {
        type: 'boolean',
        "default": false,
        description: ""
      },
      unescape_strings: {
        type: 'boolean',
        "default": false,
        description: "Decode printable characters encoded in xNN notation"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 0,
        description: "Wrap lines at next opportunity after N characters"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      end_with_comma: {
        type: 'boolean',
        "default": false,
        description: "If a terminating comma should be inserted into arrays, object literals, and destructured objects."
      },
      end_of_line: {
        type: 'string',
        "default": "System Default",
        "enum": ["CRLF", "LF", "System Default"],
        description: "Override EOL from line-ending-selector"
      },
      object_curly_spacing: {
        type: 'boolean',
        "default": false,
        description: "Insert spaces between brackets in object literals"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2phdmFzY3JpcHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sWUFGUztJQUdmLFNBQUEsRUFBVyxJQUhJO0lBSWYsS0FBQSxFQUFPLENBQUMsV0FBRCxDQUpROztBQU1mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixZQURRLENBVEs7O0FBYWY7OztJQUdBLFVBQUEsRUFBWSxDQUNWLElBRFUsQ0FoQkc7SUFvQmYsaUJBQUEsRUFBbUIsYUFwQko7O0FBc0JmOztJQUVBLE9BQUEsRUFFRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtNQUtBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHVCQUZiO09BTkY7TUFTQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtRQUVBLFdBQUEsRUFBYSwyQkFGYjtPQVZGO01BYUEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGtFQUZiO09BZEY7TUFpQkEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHNCQUZiO09BbEJGO01BcUJBLHFCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSxvREFGYjtPQXRCRjtNQXlCQSxjQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxnREFGYjtPQTFCRjtNQTZCQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSw2QkFGYjtPQTlCRjtNQWlDQSx5QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsb0VBRmI7T0FsQ0Y7TUFxQ0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsVUFBRCxFQUFhLDBCQUFiLEVBQXlDLFFBQXpDLEVBQW1ELFlBQW5ELEVBQWlFLE1BQWpFLENBRk47UUFHQSxXQUFBLEVBQWEsNERBSGI7T0F0Q0Y7TUEwQ0EscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLG9EQUZiO09BM0NGO01BOENBLHNCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSw0QkFGYjtPQS9DRjtNQWtEQSx5QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsRUFGYjtPQW5ERjtNQXNEQSx3QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsRUFGYjtPQXZERjtNQTBEQSxTQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxFQUZiO09BM0RGO01BOERBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxxREFGYjtPQS9ERjtNQWtFQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRFQ7UUFFQSxXQUFBLEVBQWEsbURBRmI7T0FuRUY7TUFzRUEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHlCQUZiO09BdkVGO01BMEVBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLG1HQUZiO09BM0VGO01BK0VBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxnQkFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVEsSUFBUixFQUFhLGdCQUFiLENBRk47UUFHQSxXQUFBLEVBQWEsd0NBSGI7T0FoRkY7TUFvRkEsb0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLG1EQUZiO09BckZGO0tBMUJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiSmF2YVNjcmlwdFwiXG4gIG5hbWVzcGFjZTogXCJqc1wiXG4gIHNjb3BlOiBbJ3NvdXJjZS5qcyddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkphdmFTY3JpcHRcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJqc1wiXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJKUyBCZWF1dGlmeVwiXG5cbiAgIyMjXG4gICMjI1xuICBvcHRpb25zOlxuICAgICMgSmF2YVNjcmlwdFxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBpbmRlbnRfbGV2ZWw6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluaXRpYWwgaW5kZW50YXRpb24gbGV2ZWxcIlxuICAgIGluZGVudF93aXRoX3RhYnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHVzZXMgdGFicywgb3ZlcnJpZGVzIGBJbmRlbnQgU2l6ZWAgYW5kIGBJbmRlbnQgQ2hhcmBcIlxuICAgIHByZXNlcnZlX25ld2xpbmVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmVzZXJ2ZSBsaW5lLWJyZWFrc1wiXG4gICAgbWF4X3ByZXNlcnZlX25ld2xpbmVzOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAxMFxuICAgICAgZGVzY3JpcHRpb246IFwiTnVtYmVyIG9mIGxpbmUtYnJlYWtzIHRvIGJlIHByZXNlcnZlZCBpbiBvbmUgY2h1bmtcIlxuICAgIHNwYWNlX2luX3BhcmVuOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkIHBhZGRpbmcgc3BhY2VzIHdpdGhpbiBwYXJlbiwgaWUuIGYoIGEsIGIgKVwiXG4gICAganNsaW50X2hhcHB5OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiRW5hYmxlIGpzbGludC1zdHJpY3RlciBtb2RlXCJcbiAgICBzcGFjZV9hZnRlcl9hbm9uX2Z1bmN0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkIGEgc3BhY2UgYmVmb3JlIGFuIGFub255bW91cyBmdW5jdGlvbidzIHBhcmVucywgaWUuIGZ1bmN0aW9uICgpXCJcbiAgICBicmFjZV9zdHlsZTpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImNvbGxhcHNlXCJcbiAgICAgIGVudW06IFtcImNvbGxhcHNlXCIsIFwiY29sbGFwc2UtcHJlc2VydmUtaW5saW5lXCIsIFwiZXhwYW5kXCIsIFwiZW5kLWV4cGFuZFwiLCBcIm5vbmVcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIltjb2xsYXBzZXxjb2xsYXBzZS1wcmVzZXJ2ZS1pbmxpbmV8ZXhwYW5kfGVuZC1leHBhbmR8bm9uZV1cIlxuICAgIGJyZWFrX2NoYWluZWRfbWV0aG9kczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkJyZWFrIGNoYWluZWQgbWV0aG9kIGNhbGxzIGFjcm9zcyBzdWJzZXF1ZW50IGxpbmVzXCJcbiAgICBrZWVwX2FycmF5X2luZGVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiUHJlc2VydmUgYXJyYXkgaW5kZW50YXRpb25cIlxuICAgIGtlZXBfZnVuY3Rpb25faW5kZW50YXRpb246XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIlxuICAgIHNwYWNlX2JlZm9yZV9jb25kaXRpb25hbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiXCJcbiAgICBldmFsX2NvZGU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIlxuICAgIHVuZXNjYXBlX3N0cmluZ3M6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJEZWNvZGUgcHJpbnRhYmxlIGNoYXJhY3RlcnMgZW5jb2RlZCBpbiB4Tk4gbm90YXRpb25cIlxuICAgIHdyYXBfbGluZV9sZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIldyYXAgbGluZXMgYXQgbmV4dCBvcHBvcnR1bml0eSBhZnRlciBOIGNoYXJhY3RlcnNcIlxuICAgIGVuZF93aXRoX25ld2xpbmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbmQgb3V0cHV0IHdpdGggbmV3bGluZVwiXG4gICAgZW5kX3dpdGhfY29tbWE6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJJZiBhIHRlcm1pbmF0aW5nIGNvbW1hIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIFxcXG4gICAgICAgICAgICAgICAgICBhcnJheXMsIG9iamVjdCBsaXRlcmFscywgYW5kIGRlc3RydWN0dXJlZCBvYmplY3RzLlwiXG4gICAgZW5kX29mX2xpbmU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJTeXN0ZW0gRGVmYXVsdFwiXG4gICAgICBlbnVtOiBbXCJDUkxGXCIsXCJMRlwiLFwiU3lzdGVtIERlZmF1bHRcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIk92ZXJyaWRlIEVPTCBmcm9tIGxpbmUtZW5kaW5nLXNlbGVjdG9yXCJcbiAgICBvYmplY3RfY3VybHlfc3BhY2luZzpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluc2VydCBzcGFjZXMgYmV0d2VlbiBicmFja2V0cyBpbiBvYmplY3QgbGl0ZXJhbHNcIlxuXG59XG4iXX0=
