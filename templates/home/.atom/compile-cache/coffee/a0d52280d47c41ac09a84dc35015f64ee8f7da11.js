(function() {
  module.exports = {
    name: "Python",
    namespace: "python",
    scope: ['source.python'],

    /*
    Supported Grammars
     */
    grammars: ["Python", "MagicPython"],

    /*
    Supported extensions
     */
    extensions: ["py"],
    options: {
      max_line_length: {
        type: 'integer',
        "default": 79,
        description: "set maximum allowed line length"
      },
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      ignore: {
        type: 'array',
        "default": ["E24"],
        items: {
          type: 'string'
        },
        description: "do not fix these errors/warnings"
      },
      formatter: {
        type: 'string',
        "default": 'autopep8',
        "enum": ['autopep8', 'yapf'],
        description: "formatter used by pybeautifier"
      },
      style_config: {
        type: 'string',
        "default": 'pep8',
        description: "formatting style used by yapf"
      },
      sort_imports: {
        type: 'boolean',
        "default": false,
        description: "sort imports (requires isort installed)"
      },
      multi_line_output: {
        type: 'string',
        "default": 'Hanging Grid Grouped',
        "enum": ['Grid', 'Vertical', 'Hanging Indent', 'Vertical Hanging Indent', 'Hanging Grid', 'Hanging Grid Grouped', 'NOQA'],
        description: "defines how from imports wrap (requires isort installed)"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3B5dGhvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxRQUZTO0lBR2YsU0FBQSxFQUFXLFFBSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxlQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLFFBRFEsRUFFUixhQUZRLENBVEs7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLElBRFUsQ0FqQkc7SUFxQmYsT0FBQSxFQUNFO01BQUEsZUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7UUFFQSxXQUFBLEVBQWEsaUNBRmI7T0FERjtNQUlBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FMRjtNQVNBLE1BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxPQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLEtBQUQsQ0FEVDtRQUVBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7UUFJQSxXQUFBLEVBQWEsa0NBSmI7T0FWRjtNQWVBLFNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxVQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLFVBQUQsRUFBYSxNQUFiLENBRk47UUFHQSxXQUFBLEVBQWEsZ0NBSGI7T0FoQkY7TUFvQkEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BRFQ7UUFFQSxXQUFBLEVBQWEsK0JBRmI7T0FyQkY7TUF3QkEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEseUNBRmI7T0F6QkY7TUE0QkEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxzQkFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FDSixNQURJLEVBRUosVUFGSSxFQUdKLGdCQUhJLEVBSUoseUJBSkksRUFLSixjQUxJLEVBTUosc0JBTkksRUFPSixNQVBJLENBRk47UUFXQSxXQUFBLEVBQWEsMERBWGI7T0E3QkY7S0F0QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJQeXRob25cIlxuICBuYW1lc3BhY2U6IFwicHl0aG9uXCJcbiAgc2NvcGU6IFsnc291cmNlLnB5dGhvbiddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIlB5dGhvblwiLFxuICAgIFwiTWFnaWNQeXRob25cIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJweVwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIG1heF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNzlcbiAgICAgIGRlc2NyaXB0aW9uOiBcInNldCBtYXhpbXVtIGFsbG93ZWQgbGluZSBsZW5ndGhcIlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaWdub3JlOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW1wiRTI0XCJdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcImRvIG5vdCBmaXggdGhlc2UgZXJyb3JzL3dhcm5pbmdzXCJcbiAgICBmb3JtYXR0ZXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ2F1dG9wZXA4J1xuICAgICAgZW51bTogWydhdXRvcGVwOCcsICd5YXBmJ11cbiAgICAgIGRlc2NyaXB0aW9uOiBcImZvcm1hdHRlciB1c2VkIGJ5IHB5YmVhdXRpZmllclwiXG4gICAgc3R5bGVfY29uZmlnOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdwZXA4J1xuICAgICAgZGVzY3JpcHRpb246IFwiZm9ybWF0dGluZyBzdHlsZSB1c2VkIGJ5IHlhcGZcIlxuICAgIHNvcnRfaW1wb3J0czpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcInNvcnQgaW1wb3J0cyAocmVxdWlyZXMgaXNvcnQgaW5zdGFsbGVkKVwiXG4gICAgbXVsdGlfbGluZV9vdXRwdXQ6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0hhbmdpbmcgR3JpZCBHcm91cGVkJ1xuICAgICAgZW51bTogW1xuICAgICAgICAnR3JpZCdcbiAgICAgICAgJ1ZlcnRpY2FsJ1xuICAgICAgICAnSGFuZ2luZyBJbmRlbnQnXG4gICAgICAgICdWZXJ0aWNhbCBIYW5naW5nIEluZGVudCdcbiAgICAgICAgJ0hhbmdpbmcgR3JpZCdcbiAgICAgICAgJ0hhbmdpbmcgR3JpZCBHcm91cGVkJ1xuICAgICAgICAnTk9RQSdcbiAgICAgIF1cbiAgICAgIGRlc2NyaXB0aW9uOiBcImRlZmluZXMgaG93IGZyb20gaW1wb3J0cyB3cmFwIChyZXF1aXJlcyBpc29ydCBpbnN0YWxsZWQpXCJcbn1cbiJdfQ==
