(function() {
  module.exports = {
    name: "Ruby",
    namespace: "ruby",
    scope: ['source.ruby'],

    /*
    Supported Grammars
     */
    grammars: ["Ruby", "Ruby on Rails"],

    /*
    Supported extensions
     */
    extensions: ["rb"],
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
        description: "Indentation character",
        "enum": [" ", "\t"]
      },
      rubocop_path: {
        title: "Rubocop Path",
        type: 'string',
        "default": "",
        description: "Path to the `rubocop` CLI executable"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3J1YnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJO0lBSWYsS0FBQSxFQUFPLENBQUMsYUFBRCxDQUpROztBQU1mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLEVBRVIsZUFGUSxDQVRLOztBQWNmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixJQURVLENBakJHO0lBcUJmLE9BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtNQUtBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHVCQUZiO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLEdBQUQsRUFBTSxJQUFOLENBSE47T0FORjtNQVVBLFlBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxjQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxXQUFBLEVBQWEsc0NBSGI7T0FYRjtLQXRCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIlJ1YnlcIlxuICBuYW1lc3BhY2U6IFwicnVieVwiXG4gIHNjb3BlOiBbJ3NvdXJjZS5ydWJ5J11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiUnVieVwiXG4gICAgXCJSdWJ5IG9uIFJhaWxzXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwicmJcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgICBlbnVtOiBbXCIgXCIsIFwiXFx0XCJdXG4gICAgcnVib2NvcF9wYXRoOlxuICAgICAgdGl0bGU6IFwiUnVib2NvcCBQYXRoXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIHRoZSBgcnVib2NvcGAgQ0xJIGV4ZWN1dGFibGVcIlxuXG59XG4iXX0=
