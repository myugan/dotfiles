(function() {
  module.exports = {
    general: {
      title: 'General',
      type: 'object',
      collapsed: true,
      order: -2,
      description: 'General options for Atom Beautify',
      properties: {
        _analyticsUserId: {
          title: 'Analytics User Id',
          type: 'string',
          "default": "",
          description: "Unique identifier for this user for tracking usage analytics"
        },
        loggerLevel: {
          title: "Logger Level",
          type: 'string',
          "default": 'warn',
          description: 'Set the level for the logger',
          "enum": ['verbose', 'debug', 'info', 'warn', 'error']
        },
        beautifyEntireFileOnSave: {
          title: "Beautify Entire File On Save",
          type: 'boolean',
          "default": true,
          description: "When beautifying on save, use the entire file, even if there is selected text in the editor. Important: The `beautify on save` option for the specific language must be enabled for this to be applicable. This option is not `beautify on save`."
        },
        muteUnsupportedLanguageErrors: {
          title: "Mute Unsupported Language Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show \"Unsupported Language\" errors when they occur"
        },
        muteAllErrors: {
          title: "Mute All Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show any/all errors when they occur"
        },
        showLoadingView: {
          title: "Show Loading View",
          type: 'boolean',
          "default": true,
          description: "Show loading view when beautifying"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2YsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFNBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLFNBQUEsRUFBVyxJQUZYO01BR0EsS0FBQSxFQUFPLENBQUMsQ0FIUjtNQUlBLFdBQUEsRUFBYSxtQ0FKYjtNQUtBLFVBQUEsRUFDRTtRQUFBLGdCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sbUJBQVA7VUFDQSxJQUFBLEVBQU8sUUFEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsRUFGVjtVQUdBLFdBQUEsRUFBYyw4REFIZDtTQURGO1FBS0EsV0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGNBQVA7VUFDQSxJQUFBLEVBQU8sUUFEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsTUFGVjtVQUdBLFdBQUEsRUFBYyw4QkFIZDtVQUlBLENBQUEsSUFBQSxDQUFBLEVBQU8sQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxPQUFyQyxDQUpQO1NBTkY7UUFXQSx3QkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLDhCQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLElBRlY7VUFHQSxXQUFBLEVBQWMsbVBBSGQ7U0FaRjtRQWdCQSw2QkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGtDQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLEtBRlY7VUFHQSxXQUFBLEVBQWMsNkRBSGQ7U0FqQkY7UUFxQkEsYUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGlCQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLEtBRlY7VUFHQSxXQUFBLEVBQWMsNENBSGQ7U0F0QkY7UUEwQkEsZUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLG1CQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLElBRlY7VUFHQSxXQUFBLEVBQWMsb0NBSGQ7U0EzQkY7T0FORjtLQUZhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICBnZW5lcmFsOlxuICAgIHRpdGxlOiAnR2VuZXJhbCdcbiAgICB0eXBlOiAnb2JqZWN0J1xuICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgIG9yZGVyOiAtMlxuICAgIGRlc2NyaXB0aW9uOiAnR2VuZXJhbCBvcHRpb25zIGZvciBBdG9tIEJlYXV0aWZ5J1xuICAgIHByb3BlcnRpZXM6XG4gICAgICBfYW5hbHl0aWNzVXNlcklkIDpcbiAgICAgICAgdGl0bGU6ICdBbmFseXRpY3MgVXNlciBJZCdcbiAgICAgICAgdHlwZSA6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQgOiBcIlwiXG4gICAgICAgIGRlc2NyaXB0aW9uIDogXCJVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyB1c2VyIGZvciB0cmFja2luZyB1c2FnZSBhbmFseXRpY3NcIlxuICAgICAgbG9nZ2VyTGV2ZWwgOlxuICAgICAgICB0aXRsZTogXCJMb2dnZXIgTGV2ZWxcIlxuICAgICAgICB0eXBlIDogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdCA6ICd3YXJuJ1xuICAgICAgICBkZXNjcmlwdGlvbiA6ICdTZXQgdGhlIGxldmVsIGZvciB0aGUgbG9nZ2VyJ1xuICAgICAgICBlbnVtIDogWyd2ZXJib3NlJywgJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddXG4gICAgICBiZWF1dGlmeUVudGlyZUZpbGVPblNhdmUgOlxuICAgICAgICB0aXRsZTogXCJCZWF1dGlmeSBFbnRpcmUgRmlsZSBPbiBTYXZlXCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiV2hlbiBiZWF1dGlmeWluZyBvbiBzYXZlLCB1c2UgdGhlIGVudGlyZSBmaWxlLCBldmVuIGlmIHRoZXJlIGlzIHNlbGVjdGVkIHRleHQgaW4gdGhlIGVkaXRvci4gSW1wb3J0YW50OiBUaGUgYGJlYXV0aWZ5IG9uIHNhdmVgIG9wdGlvbiBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIG11c3QgYmUgZW5hYmxlZCBmb3IgdGhpcyB0byBiZSBhcHBsaWNhYmxlLiBUaGlzIG9wdGlvbiBpcyBub3QgYGJlYXV0aWZ5IG9uIHNhdmVgLlwiXG4gICAgICBtdXRlVW5zdXBwb3J0ZWRMYW5ndWFnZUVycm9ycyA6XG4gICAgICAgIHRpdGxlOiBcIk11dGUgVW5zdXBwb3J0ZWQgTGFuZ3VhZ2UgRXJyb3JzXCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIkRvIG5vdCBzaG93IFxcXCJVbnN1cHBvcnRlZCBMYW5ndWFnZVxcXCIgZXJyb3JzIHdoZW4gdGhleSBvY2N1clwiXG4gICAgICBtdXRlQWxsRXJyb3JzIDpcbiAgICAgICAgdGl0bGU6IFwiTXV0ZSBBbGwgRXJyb3JzXCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIkRvIG5vdCBzaG93IGFueS9hbGwgZXJyb3JzIHdoZW4gdGhleSBvY2N1clwiXG4gICAgICBzaG93TG9hZGluZ1ZpZXcgOlxuICAgICAgICB0aXRsZTogXCJTaG93IExvYWRpbmcgVmlld1wiXG4gICAgICAgIHR5cGUgOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdCA6IHRydWVcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIlNob3cgbG9hZGluZyB2aWV3IHdoZW4gYmVhdXRpZnlpbmdcIlxuICAgIH1cbiJdfQ==
