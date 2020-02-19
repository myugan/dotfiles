(function() {
  module.exports = {
    name: "SQL",
    namespace: "sql",
    scope: ['source.sql'],

    /*
    Supported Grammars
     */
    grammars: ["SQL (Rails)", "SQL"],

    /*
    Supported extensions
     */
    extensions: ["sql"],
    options: {
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      reindent: {
        type: 'boolean',
        "default": true,
        description: "Change indentations of the statements. Uncheck this option to preserve indentation"
      },
      keywords: {
        type: 'string',
        "default": "upper",
        description: "Change case of keywords",
        "enum": ["unchanged", "lower", "upper", "capitalize"]
      },
      identifiers: {
        type: 'string',
        "default": "unchanged",
        description: "Change case of identifiers",
        "enum": ["unchanged", "lower", "upper", "capitalize"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3NxbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxLQUZTO0lBR2YsU0FBQSxFQUFXLEtBSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxZQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLGFBRFEsRUFFUixLQUZRLENBVEs7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLEtBRFUsQ0FqQkc7SUFxQmYsT0FBQSxFQUVFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsUUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsb0ZBRmI7T0FORjtNQVNBLFFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQURUO1FBRUEsV0FBQSxFQUFhLHlCQUZiO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLFdBQUQsRUFBYSxPQUFiLEVBQXFCLE9BQXJCLEVBQTZCLFlBQTdCLENBSE47T0FWRjtNQWNBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxXQURUO1FBRUEsV0FBQSxFQUFhLDRCQUZiO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLFdBQUQsRUFBYSxPQUFiLEVBQXFCLE9BQXJCLEVBQTZCLFlBQTdCLENBSE47T0FmRjtLQXZCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIlNRTFwiXG4gIG5hbWVzcGFjZTogXCJzcWxcIlxuICBzY29wZTogWydzb3VyY2Uuc3FsJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiU1FMIChSYWlscylcIlxuICAgIFwiU1FMXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwic3FsXCJcbiAgXVxuXG4gIG9wdGlvbnM6XG4gICAgIyBTUUxcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIHJlaW5kZW50OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJDaGFuZ2UgaW5kZW50YXRpb25zIG9mIHRoZSBzdGF0ZW1lbnRzLiBVbmNoZWNrIHRoaXMgb3B0aW9uIHRvIHByZXNlcnZlIGluZGVudGF0aW9uXCJcbiAgICBrZXl3b3JkczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcInVwcGVyXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkNoYW5nZSBjYXNlIG9mIGtleXdvcmRzXCJcbiAgICAgIGVudW06IFtcInVuY2hhbmdlZFwiLFwibG93ZXJcIixcInVwcGVyXCIsXCJjYXBpdGFsaXplXCJdXG4gICAgaWRlbnRpZmllcnM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJ1bmNoYW5nZWRcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlIGNhc2Ugb2YgaWRlbnRpZmllcnNcIlxuICAgICAgZW51bTogW1widW5jaGFuZ2VkXCIsXCJsb3dlclwiLFwidXBwZXJcIixcImNhcGl0YWxpemVcIl1cblxufVxuIl19
