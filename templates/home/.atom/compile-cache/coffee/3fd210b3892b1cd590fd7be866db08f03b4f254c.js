(function() {
  module.exports = {
    name: "Jade",
    namespace: "jade",
    fallback: ['html'],
    scope: ['text.jade'],

    /*
    Supported Grammars
     */
    grammars: ["Jade", "Pug"],

    /*
    Supported extensions
     */
    extensions: ["jade", "pug"],
    options: [
      {
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
        omit_div: {
          type: 'boolean',
          "default": false,
          description: "Whether to omit/remove the 'div' tags."
        }
      }
    ],
    defaultBeautifier: "Pug Beautify"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2phZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJO0lBSWYsUUFBQSxFQUFVLENBQUMsTUFBRCxDQUpLO0lBS2YsS0FBQSxFQUFPLENBQUMsV0FBRCxDQUxROztBQU9mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLEVBQ0EsS0FEQSxDQVZLOztBQWNmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixNQURVLEVBQ0YsS0FERSxDQWpCRztJQXFCZixPQUFBLEVBQVM7TUFDUDtRQUFBLFdBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxTQUFOO1VBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1VBRUEsT0FBQSxFQUFTLENBRlQ7VUFHQSxXQUFBLEVBQWEseUJBSGI7U0FERjtRQUtBLFdBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1VBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1VBRUEsV0FBQSxFQUFhLHVCQUZiO1NBTkY7UUFTQSxRQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sU0FBTjtVQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtVQUVBLFdBQUEsRUFBYSx3Q0FGYjtTQVZGO09BRE87S0FyQk07SUFxQ2YsaUJBQUEsRUFBbUIsY0FyQ0o7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJKYWRlXCJcbiAgbmFtZXNwYWNlOiBcImphZGVcIlxuICBmYWxsYmFjazogWydodG1sJ11cbiAgc2NvcGU6IFsndGV4dC5qYWRlJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiSmFkZVwiLCBcIlB1Z1wiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImphZGVcIiwgXCJwdWdcIlxuICBdXG5cbiAgb3B0aW9uczogW1xuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBvbWl0X2RpdjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgdG8gb21pdC9yZW1vdmUgdGhlICdkaXYnIHRhZ3MuXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIlB1ZyBCZWF1dGlmeVwiXG5cbn1cbiJdfQ==
