(function() {
  module.exports = {
    name: "Coldfusion",
    description: "Coldfusion Markup; cfscript is also handled via the prettydiff javascript parser",
    namespace: "cfml",
    scope: ['text.html'],

    /*
    Supported Grammars
     */
    grammars: ["html"],

    /*
    Supported extensions
     */
    extensions: ["cfm", "cfml", "cfc"],
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
        minimum: 0,
        description: "Indentation character"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2NvbGRmdXNpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sWUFGUztJQUdmLFdBQUEsRUFBYSxrRkFIRTtJQUlmLFNBQUEsRUFBVyxNQUpJO0lBS2YsS0FBQSxFQUFPLENBQUMsV0FBRCxDQUxROztBQU9mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLENBVks7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLEtBRFUsRUFFVixNQUZVLEVBR1YsS0FIVSxDQWpCRztJQXVCZixPQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHVCQUhiO09BTkY7TUFVQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEdBRFQ7UUFFQSxXQUFBLEVBQWEsMENBRmI7T0FYRjtNQWNBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxzQkFGYjtPQWZGO0tBeEJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiQ29sZGZ1c2lvblwiXG4gIGRlc2NyaXB0aW9uOiBcIkNvbGRmdXNpb24gTWFya3VwOyBjZnNjcmlwdCBpcyBhbHNvIGhhbmRsZWQgdmlhIHRoZSBwcmV0dHlkaWZmIGphdmFzY3JpcHQgcGFyc2VyXCJcbiAgbmFtZXNwYWNlOiBcImNmbWxcIlxuICBzY29wZTogWyd0ZXh0Lmh0bWwnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJodG1sXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiY2ZtXCJcbiAgICBcImNmbWxcIlxuICAgIFwiY2ZjXCJcbiAgXVxuXG4gIG9wdGlvbnM6XG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBpbmRlbnRfY2hhcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIHdyYXBfbGluZV9sZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDI1MFxuICAgICAgZGVzY3JpcHRpb246IFwiTWF4aW11bSBjaGFyYWN0ZXJzIHBlciBsaW5lICgwIGRpc2FibGVzKVwiXG4gICAgcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByZXNlcnZlIGxpbmUtYnJlYWtzXCJcblxufVxuIl19
