(function() {
  module.exports = {
    name: "CSS",
    namespace: "css",
    scope: ['source.css'],

    /*
    Supported Grammars
     */
    grammars: ["CSS"],

    /*
    Supported extensions
     */
    extensions: ["css"],
    defaultBeautifier: "JS Beautify",
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
      selector_separator_newline: {
        type: 'boolean',
        "default": false,
        description: "Add a newline between multiple selectors"
      },
      newline_between_rules: {
        type: 'boolean',
        "default": true,
        description: "Add a newline between CSS rules"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": false,
        description: "Retain empty lines. " + "Consecutive empty lines will be converted to a single empty line."
      },
      wrap_line_length: {
        type: 'integer',
        "default": 0,
        description: "Maximum amount of characters per line (0 = disable)"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      indent_comments: {
        type: 'boolean',
        "default": true,
        description: "Determines whether comments should be indented."
      },
      force_indentation: {
        type: 'boolean',
        "default": false,
        description: "if indentation should be forcefully applied to markup even if it disruptively adds unintended whitespace to the documents rendered output"
      },
      convert_quotes: {
        type: 'string',
        "default": "none",
        description: "Convert the quote characters delimiting strings from either double or single quotes to the other.",
        "enum": ["none", "double", "single"]
      },
      align_assignments: {
        type: 'boolean',
        "default": false,
        description: "If lists of assignments or properties should be vertically aligned for faster and easier reading."
      },
      no_lead_zero: {
        type: 'boolean',
        "default": false,
        description: "If in CSS values leading 0s immediately preceding a decimal should be removed or prevented."
      },
      configPath: {
        title: "comb custom config file",
        type: 'string',
        "default": "",
        description: "Path to custom CSScomb config file, used in absence of a `.csscomb.json` or `.csscomb.cson` at the root of your project."
      },
      predefinedConfig: {
        title: "comb predefined config",
        type: 'string',
        "default": "csscomb",
        description: "Used if neither a project or custom config file exists.",
        "enum": ["csscomb", "yandex", "zen"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2Nzcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxLQUZTO0lBR2YsU0FBQSxFQUFXLEtBSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxZQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLEtBRFEsQ0FUSzs7QUFhZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxDQWhCRztJQW9CZixpQkFBQSxFQUFtQixhQXBCSjtJQXNCZixPQUFBLEVBRUU7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHVCQUhiO09BTkY7TUFVQSwwQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsMENBRmI7T0FYRjtNQWNBLHFCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQWZGO01Ba0JBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxzQkFBQSxHQUNYLG1FQUhGO09BbkJGO01Bd0JBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtRQUVBLFdBQUEsRUFBYSxxREFGYjtPQXpCRjtNQTRCQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEseUJBRmI7T0E3QkY7TUFnQ0EsZUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsaURBRmI7T0FqQ0Y7TUFvQ0EsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDJJQUZiO09BckNGO01BMENBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsV0FBQSxFQUFhLG1HQUZiO1FBSUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFFBQW5CLENBSk47T0EzQ0Y7TUFnREEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLG1HQUZiO09BakRGO01BcURBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDZGQUZiO09BdERGO01BMERBLFVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyx5QkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO1FBR0EsV0FBQSxFQUFhLDBIQUhiO09BM0RGO01BZ0VBLGdCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sd0JBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsU0FGVDtRQUdBLFdBQUEsRUFBYSx5REFIYjtRQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixLQUF0QixDQUpOO09BakVGO0tBeEJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiQ1NTXCJcbiAgbmFtZXNwYWNlOiBcImNzc1wiXG4gIHNjb3BlOiBbJ3NvdXJjZS5jc3MnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJDU1NcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJjc3NcIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiSlMgQmVhdXRpZnlcIlxuXG4gIG9wdGlvbnM6XG4gICAgIyBDU1NcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgc2VsZWN0b3Jfc2VwYXJhdG9yX25ld2xpbmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgYSBuZXdsaW5lIGJldHdlZW4gbXVsdGlwbGUgc2VsZWN0b3JzXCJcbiAgICBuZXdsaW5lX2JldHdlZW5fcnVsZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFkZCBhIG5ld2xpbmUgYmV0d2VlbiBDU1MgcnVsZXNcIlxuICAgIHByZXNlcnZlX25ld2xpbmVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiUmV0YWluIGVtcHR5IGxpbmVzLiBcIitcbiAgICAgICAgXCJDb25zZWN1dGl2ZSBlbXB0eSBsaW5lcyB3aWxsIGJlIGNvbnZlcnRlZCB0byBcXFxuICAgICAgICAgICAgICAgIGEgc2luZ2xlIGVtcHR5IGxpbmUuXCJcbiAgICB3cmFwX2xpbmVfbGVuZ3RoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJNYXhpbXVtIGFtb3VudCBvZiBjaGFyYWN0ZXJzIHBlciBsaW5lICgwID0gZGlzYWJsZSlcIlxuICAgIGVuZF93aXRoX25ld2xpbmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbmQgb3V0cHV0IHdpdGggbmV3bGluZVwiXG4gICAgaW5kZW50X2NvbW1lbnRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJEZXRlcm1pbmVzIHdoZXRoZXIgY29tbWVudHMgc2hvdWxkIGJlIGluZGVudGVkLlwiXG4gICAgZm9yY2VfaW5kZW50YXRpb246XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJpZiBpbmRlbnRhdGlvbiBzaG91bGQgYmUgZm9yY2VmdWxseSBhcHBsaWVkIHRvIFxcXG4gICAgICAgICAgICAgICAgbWFya3VwIGV2ZW4gaWYgaXQgZGlzcnVwdGl2ZWx5IGFkZHMgdW5pbnRlbmRlZCB3aGl0ZXNwYWNlIFxcXG4gICAgICAgICAgICAgICAgdG8gdGhlIGRvY3VtZW50cyByZW5kZXJlZCBvdXRwdXRcIlxuICAgIGNvbnZlcnRfcXVvdGVzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwibm9uZVwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJDb252ZXJ0IHRoZSBxdW90ZSBjaGFyYWN0ZXJzIGRlbGltaXRpbmcgc3RyaW5ncyBcXFxuICAgICAgICAgICAgICAgIGZyb20gZWl0aGVyIGRvdWJsZSBvciBzaW5nbGUgcXVvdGVzIHRvIHRoZSBvdGhlci5cIlxuICAgICAgZW51bTogW1wibm9uZVwiLCBcImRvdWJsZVwiLCBcInNpbmdsZVwiXVxuICAgIGFsaWduX2Fzc2lnbm1lbnRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSWYgbGlzdHMgb2YgYXNzaWdubWVudHMgb3IgcHJvcGVydGllcyBzaG91bGQgYmUgXFxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbGx5IGFsaWduZWQgZm9yIGZhc3RlciBhbmQgZWFzaWVyIHJlYWRpbmcuXCJcbiAgICBub19sZWFkX3plcm86XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJJZiBpbiBDU1MgdmFsdWVzIGxlYWRpbmcgMHMgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIFxcXG4gICAgICAgICAgICAgICAgYSBkZWNpbWFsIHNob3VsZCBiZSByZW1vdmVkIG9yIHByZXZlbnRlZC5cIlxuICAgIGNvbmZpZ1BhdGg6XG4gICAgICB0aXRsZTogXCJjb21iIGN1c3RvbSBjb25maWcgZmlsZVwiXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBjdXN0b20gQ1NTY29tYiBjb25maWcgZmlsZSwgdXNlZCBpbiBhYnNlbmNlIG9mIGEgXFxcbiAgICAgICAgICAgICAgICBgLmNzc2NvbWIuanNvbmAgb3IgYC5jc3Njb21iLmNzb25gIGF0IHRoZSByb290IG9mIHlvdXIgcHJvamVjdC5cIlxuICAgIHByZWRlZmluZWRDb25maWc6XG4gICAgICB0aXRsZTogXCJjb21iIHByZWRlZmluZWQgY29uZmlnXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImNzc2NvbWJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiVXNlZCBpZiBuZWl0aGVyIGEgcHJvamVjdCBvciBjdXN0b20gY29uZmlnIGZpbGUgZXhpc3RzLlwiXG4gICAgICBlbnVtOiBbXCJjc3Njb21iXCIsIFwieWFuZGV4XCIsIFwiemVuXCJdXG59XG4iXX0=
