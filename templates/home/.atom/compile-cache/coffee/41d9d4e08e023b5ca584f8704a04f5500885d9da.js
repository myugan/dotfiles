(function() {
  module.exports = {
    name: "Marko",
    namespace: "marko",
    fallback: ['html'],
    scope: ['text.marko'],

    /*
    Supported Grammars
     */
    grammars: ["Marko"],

    /*
    Supported extensions
     */
    extensions: ["marko"],
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
      syntax: {
        type: 'string',
        "default": "html",
        "enum": ["html", "concise"],
        description: "[html|concise]"
      }
    },
    defaultBeautifier: "Marko Beautifier"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL21hcmtvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLE9BRlM7SUFHZixTQUFBLEVBQVcsT0FISTtJQUlmLFFBQUEsRUFBVSxDQUFDLE1BQUQsQ0FKSztJQUtmLEtBQUEsRUFBTyxDQUFDLFlBQUQsQ0FMUTs7QUFPZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsT0FEUSxDQVZLOztBQWNmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixPQURVLENBakJHO0lBcUJmLE9BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtNQUtBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHVCQUZiO09BTkY7TUFTQSxNQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUZOO1FBR0EsV0FBQSxFQUFhLGdCQUhiO09BVkY7S0F0QmE7SUFxQ2YsaUJBQUEsRUFBbUIsa0JBckNKOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiTWFya29cIlxuICBuYW1lc3BhY2U6IFwibWFya29cIlxuICBmYWxsYmFjazogWydodG1sJ11cbiAgc2NvcGU6IFsndGV4dC5tYXJrbyddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIk1hcmtvXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwibWFya29cIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgc3ludGF4OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiaHRtbFwiXG4gICAgICBlbnVtOiBbXCJodG1sXCIsIFwiY29uY2lzZVwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiW2h0bWx8Y29uY2lzZV1cIlxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIk1hcmtvIEJlYXV0aWZpZXJcIlxuXG59XG4iXX0=
