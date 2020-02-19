(function() {
  module.exports = {
    name: "Bash",
    namespace: "bash",
    scope: ['source.sh', 'source.bash'],

    /*
    Supported Grammars
     */
    grammars: ["Shell Script"],
    defaultBeautifier: "beautysh",

    /*
    Supported extensions
     */
    extensions: ["bash", "sh"],
    options: {
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_with_tabs: {
        type: 'boolean',
        "default": null,
        description: "Indentation uses tabs, overrides `Indent Size` and `Indent Char`"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2Jhc2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJO0lBSWYsS0FBQSxFQUFPLENBQUMsV0FBRCxFQUFjLGFBQWQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsY0FEUSxDQVRLO0lBYWYsaUJBQUEsRUFBbUIsVUFiSjs7QUFlZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsTUFEVSxFQUVWLElBRlUsQ0FsQkc7SUF1QmYsT0FBQSxFQUNFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGtFQUZiO09BTkY7S0F4QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJCYXNoXCJcbiAgbmFtZXNwYWNlOiBcImJhc2hcIlxuICBzY29wZTogWydzb3VyY2Uuc2gnLCAnc291cmNlLmJhc2gnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJTaGVsbCBTY3JpcHRcIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiYmVhdXR5c2hcIlxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiYmFzaFwiXG4gICAgXCJzaFwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X3dpdGhfdGFiczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gdXNlcyB0YWJzLCBvdmVycmlkZXMgYEluZGVudCBTaXplYCBhbmQgYEluZGVudCBDaGFyYFwiXG5cbn1cbiJdfQ==
