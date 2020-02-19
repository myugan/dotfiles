(function() {
  module.exports = {
    name: "Markdown",
    namespace: "markdown",

    /*
    Supported Grammars
     */
    grammars: ["GitHub Markdown"],

    /*
    Supported extensions
     */
    extensions: ["markdown", "md"],
    defaultBeautifier: "Remark",
    options: {
      gfm: {
        type: 'boolean',
        "default": true,
        description: 'GitHub Flavoured Markdown'
      },
      yaml: {
        type: 'boolean',
        "default": true,
        description: 'Enables raw YAML front matter to be detected (thus ignoring markdown-like syntax).'
      },
      commonmark: {
        type: 'boolean',
        "default": false,
        description: 'Allows and disallows several constructs.'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL21hcmtkb3duLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLFVBRlM7SUFHZixTQUFBLEVBQVcsVUFISTs7QUFLZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsaUJBRFEsQ0FSSzs7QUFZZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsVUFEVSxFQUVWLElBRlUsQ0FmRztJQW9CZixpQkFBQSxFQUFtQixRQXBCSjtJQXNCZixPQUFBLEVBQ0U7TUFBQSxHQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSwyQkFGYjtPQURGO01BSUEsSUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsb0ZBRmI7T0FMRjtNQVFBLFVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDBDQUZiO09BVEY7S0F2QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJNYXJrZG93blwiXG4gIG5hbWVzcGFjZTogXCJtYXJrZG93blwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkdpdEh1YiBNYXJrZG93blwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcIm1hcmtkb3duXCJcbiAgICBcIm1kXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIlJlbWFya1wiXG5cbiAgb3B0aW9uczpcbiAgICBnZm06XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnR2l0SHViIEZsYXZvdXJlZCBNYXJrZG93bidcbiAgICB5YW1sOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZXMgcmF3IFlBTUwgZnJvbnQgbWF0dGVyIHRvIGJlIGRldGVjdGVkICh0aHVzIGlnbm9yaW5nIG1hcmtkb3duLWxpa2Ugc3ludGF4KS4nXG4gICAgY29tbW9ubWFyazpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIGFuZCBkaXNhbGxvd3Mgc2V2ZXJhbCBjb25zdHJ1Y3RzLidcbn1cbiJdfQ==
