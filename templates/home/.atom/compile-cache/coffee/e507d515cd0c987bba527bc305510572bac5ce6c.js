(function() {
  module.exports = {
    name: "HTML",
    namespace: "html",
    scope: ['text.html'],

    /*
    Supported Grammars
     */
    grammars: ["HTML"],

    /*
    Supported extensions
     */
    extensions: ["html"],
    options: {
      indent_inner_html: {
        type: 'boolean',
        "default": false,
        description: "Indent <head> and <body> sections."
      },
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
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "expand", "end-expand", "none"],
        description: "[collapse|expand|end-expand|none]"
      },
      indent_scripts: {
        type: 'string',
        "default": "normal",
        "enum": ["keep", "separate", "normal"],
        description: "[keep|separate|normal]"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      wrap_attributes: {
        type: 'string',
        "default": "auto",
        "enum": ["auto", "aligned-multiple", "force", "force-aligned", "force-expand-multiline"],
        description: "Wrap attributes to new lines [auto|aligned-multiple|force|force-aligned|force-expand-multiline]"
      },
      wrap_attributes_indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indent wrapped attributes to after N characters"
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
      unformatted: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        description: "(Deprecated for most scenarios - consider inline or content_unformatted) List of tags that should not be reformatted at all.  NOTE: Set this to [] to get improved beautifier behavior."
      },
      inline: {
        type: 'array',
        "default": ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'],
        items: {
          type: 'string'
        },
        description: "List of inline tags. Behaves similar to text content, will not wrap without whitespace."
      },
      content_unformatted: {
        type: 'array',
        "default": ['pre', 'textarea'],
        items: {
          type: 'string'
        },
        description: "List of tags whose contents should not be reformatted. Attributes will be reformatted, inner html will not."
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      extra_liners: {
        type: 'array',
        "default": ['head', 'body', '/html'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to [head,body,/html] that should have an extra newline before them."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2h0bWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJO0lBSWYsS0FBQSxFQUFPLENBQUMsV0FBRCxDQUpROztBQU1mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLENBVEs7O0FBYWY7OztJQUdBLFVBQUEsRUFBWSxDQUNWLE1BRFUsQ0FoQkc7SUFvQmYsT0FBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLG9DQUZiO09BREY7TUFJQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BTEY7TUFTQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSx1QkFGYjtPQVZGO01BYUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsVUFBRCxFQUFhLFFBQWIsRUFBdUIsWUFBdkIsRUFBcUMsTUFBckMsQ0FGTjtRQUdBLFdBQUEsRUFBYSxtQ0FIYjtPQWRGO01Ba0JBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxRQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFB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QSxXQUFBLEVBQWEseUJBRmI7T0F4RUY7TUEyRUEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsT0FBakIsQ0FEVDtRQUVBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7UUFJQSxXQUFBLEVBQWEsNEZBSmI7T0E1RUY7S0FyQmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJIVE1MXCJcbiAgbmFtZXNwYWNlOiBcImh0bWxcIlxuICBzY29wZTogWyd0ZXh0Lmh0bWwnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJIVE1MXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiaHRtbFwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGluZGVudF9pbm5lcl9odG1sOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50IDxoZWFkPiBhbmQgPGJvZHk+IHNlY3Rpb25zLlwiXG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBpbmRlbnRfY2hhcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIGJyYWNlX3N0eWxlOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiY29sbGFwc2VcIlxuICAgICAgZW51bTogW1wiY29sbGFwc2VcIiwgXCJleHBhbmRcIiwgXCJlbmQtZXhwYW5kXCIsIFwibm9uZVwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiW2NvbGxhcHNlfGV4cGFuZHxlbmQtZXhwYW5kfG5vbmVdXCJcbiAgICBpbmRlbnRfc2NyaXB0czpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIm5vcm1hbFwiXG4gICAgICBlbnVtOiBbXCJrZWVwXCIsIFwic2VwYXJhdGVcIiwgXCJub3JtYWxcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIltrZWVwfHNlcGFyYXRlfG5vcm1hbF1cIlxuICAgIHdyYXBfbGluZV9sZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDI1MFxuICAgICAgZGVzY3JpcHRpb246IFwiTWF4aW11bSBjaGFyYWN0ZXJzIHBlciBsaW5lICgwIGRpc2FibGVzKVwiXG4gICAgd3JhcF9hdHRyaWJ1dGVzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiYXV0b1wiXG4gICAgICBlbnVtOiBbXCJhdXRvXCIsIFwiYWxpZ25lZC1tdWx0aXBsZVwiLCBcImZvcmNlXCIsIFwiZm9yY2UtYWxpZ25lZFwiLCBcImZvcmNlLWV4cGFuZC1tdWx0aWxpbmVcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIldyYXAgYXR0cmlidXRlcyB0byBuZXcgbGluZXMgW2F1dG98YWxpZ25lZC1tdWx0aXBsZXxmb3JjZXxmb3JjZS1hbGlnbmVkfGZvcmNlLWV4cGFuZC1tdWx0aWxpbmVdXCJcbiAgICB3cmFwX2F0dHJpYnV0ZXNfaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudCB3cmFwcGVkIGF0dHJpYnV0ZXMgdG8gYWZ0ZXIgTiBjaGFyYWN0ZXJzXCJcbiAgICBwcmVzZXJ2ZV9uZXdsaW5lczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiUHJlc2VydmUgbGluZS1icmVha3NcIlxuICAgIG1heF9wcmVzZXJ2ZV9uZXdsaW5lczpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMTBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk51bWJlciBvZiBsaW5lLWJyZWFrcyB0byBiZSBwcmVzZXJ2ZWQgaW4gb25lIGNodW5rXCJcbiAgICB1bmZvcm1hdHRlZDpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcIihEZXByZWNhdGVkIGZvciBtb3N0IHNjZW5hcmlvcyAtIGNvbnNpZGVyIGlubGluZSBvciBjb250ZW50X3VuZm9ybWF0dGVkKSBMaXN0IG9mIHRhZ3MgdGhhdCBzaG91bGQgbm90IGJlIHJlZm9ybWF0dGVkIGF0IGFsbC4gIE5PVEU6IFNldCB0aGlzIHRvIFtdIHRvIGdldCBpbXByb3ZlZCBiZWF1dGlmaWVyIGJlaGF2aW9yLlwiXG4gICAgaW5saW5lOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW1xuICAgICAgICAgICAgJ2EnLCAnYWJicicsICdhcmVhJywgJ2F1ZGlvJywgJ2InLCAnYmRpJywgJ2JkbycsICdicicsICdidXR0b24nLCAnY2FudmFzJywgJ2NpdGUnLFxuICAgICAgICAgICAgJ2NvZGUnLCAnZGF0YScsICdkYXRhbGlzdCcsICdkZWwnLCAnZGZuJywgJ2VtJywgJ2VtYmVkJywgJ2knLCAnaWZyYW1lJywgJ2ltZycsXG4gICAgICAgICAgICAnaW5wdXQnLCAnaW5zJywgJ2tiZCcsICdrZXlnZW4nLCAnbGFiZWwnLCAnbWFwJywgJ21hcmsnLCAnbWF0aCcsICdtZXRlcicsICdub3NjcmlwdCcsXG4gICAgICAgICAgICAnb2JqZWN0JywgJ291dHB1dCcsICdwcm9ncmVzcycsICdxJywgJ3J1YnknLCAncycsICdzYW1wJywgJ3NlbGVjdCcsICdzbWFsbCcsXG4gICAgICAgICAgICAnc3BhbicsICdzdHJvbmcnLCAnc3ViJywgJ3N1cCcsICdzdmcnLCAndGVtcGxhdGUnLCAndGV4dGFyZWEnLCAndGltZScsICd1JywgJ3ZhcicsXG4gICAgICAgICAgICAndmlkZW8nLCAnd2JyJywgJ3RleHQnLFxuICAgICAgICAgICAgJ2Fjcm9ueW0nLCAnYWRkcmVzcycsICdiaWcnLCAnZHQnLCAnaW5zJywgJ3N0cmlrZScsICd0dCdcbiAgICAgICAgXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCJMaXN0IG9mIGlubGluZSB0YWdzLiBCZWhhdmVzIHNpbWlsYXIgdG8gdGV4dCBjb250ZW50LCB3aWxsIG5vdCB3cmFwIHdpdGhvdXQgd2hpdGVzcGFjZS5cIlxuICAgIGNvbnRlbnRfdW5mb3JtYXR0ZWQ6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbICdwcmUnLCAndGV4dGFyZWEnIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVzY3JpcHRpb246IFwiTGlzdCBvZiB0YWdzIHdob3NlIGNvbnRlbnRzIHNob3VsZCBub3QgYmUgcmVmb3JtYXR0ZWQuIEF0dHJpYnV0ZXMgd2lsbCBiZSByZWZvcm1hdHRlZCwgaW5uZXIgaHRtbCB3aWxsIG5vdC5cIlxuICAgIGVuZF93aXRoX25ld2xpbmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbmQgb3V0cHV0IHdpdGggbmV3bGluZVwiXG4gICAgZXh0cmFfbGluZXJzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWydoZWFkJywgJ2JvZHknLCAnL2h0bWwnXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCJMaXN0IG9mIHRhZ3MgKGRlZmF1bHRzIHRvIFtoZWFkLGJvZHksL2h0bWxdIHRoYXQgc2hvdWxkIGhhdmUgYW4gZXh0cmEgbmV3bGluZSBiZWZvcmUgdGhlbS5cIlxuXG59XG4iXX0=
