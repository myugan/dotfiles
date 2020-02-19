
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, _, extend;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "bash", "blade", "c-sharp", "c", "clojure", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "glsl", "gn", "go", "gohtml", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "lua", "markdown", 'marko', "mustache", "nginx", "nunjucks", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "r", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "tsx", "twig", "typescript", "ux_markup", "vala", "vue", "vhdl", "visualforce", "xml", "xtemplate", "yaml", "terraform", "verilog"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(arg) {
      var extension, grammar, name, namespace;
      name = arg.name, namespace = arg.namespace, grammar = arg.grammar, extension = arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQTs7RUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osTUFBQSxHQUFTOztFQUdULE1BQU0sQ0FBQyxPQUFQLEdBQXVCO3dCQUlyQixhQUFBLEdBQWUsQ0FDYixNQURhLEVBRWIsU0FGYSxFQUdiLE1BSGEsRUFJYixPQUphLEVBS2IsU0FMYSxFQU1iLEdBTmEsRUFPYixTQVBhLEVBUWIsY0FSYSxFQVNiLFlBVGEsRUFVYixLQVZhLEVBV2IsU0FYYSxFQVliLEtBWmEsRUFhYixLQWJhLEVBY2IsR0FkYSxFQWViLEtBZmEsRUFnQmIsS0FoQmEsRUFpQmIsS0FqQmEsRUFrQmIsUUFsQmEsRUFtQmIsU0FuQmEsRUFvQmIsTUFwQmEsRUFxQmIsSUFyQmEsRUFzQmIsSUF0QmEsRUF1QmIsUUF2QmEsRUF3QmIsU0F4QmEsRUF5QmIsWUF6QmEsRUEwQmIsU0ExQmEsRUEyQmIsTUEzQmEsRUE0QmIsTUE1QmEsRUE2QmIsTUE3QmEsRUE4QmIsWUE5QmEsRUErQmIsTUEvQmEsRUFnQ2IsS0FoQ2EsRUFpQ2IsT0FqQ2EsRUFrQ2IsTUFsQ2EsRUFtQ2IsS0FuQ2EsRUFvQ2IsVUFwQ2EsRUFxQ2IsT0FyQ2EsRUFzQ2IsVUF0Q2EsRUF1Q2IsT0F2Q2EsRUF3Q2IsVUF4Q2EsRUF5Q2IsYUF6Q2EsRUEwQ2IsT0ExQ2EsRUEyQ2IsTUEzQ2EsRUE0Q2IsTUE1Q2EsRUE2Q2IsS0E3Q2EsRUE4Q2IsUUE5Q2EsRUErQ2IsUUEvQ2EsRUFnRGIsR0FoRGEsRUFpRGIsUUFqRGEsRUFrRGIsTUFsRGEsRUFtRGIsTUFuRGEsRUFvRGIsTUFwRGEsRUFxRGIsTUFyRGEsRUFzRGIsV0F0RGEsRUF1RGIsS0F2RGEsRUF3RGIsS0F4RGEsRUF5RGIsTUF6RGEsRUEwRGIsS0ExRGEsRUEyRGIsS0EzRGEsRUE0RGIsTUE1RGEsRUE2RGIsWUE3RGEsRUE4RGIsV0E5RGEsRUErRGIsTUEvRGEsRUFnRWIsS0FoRWEsRUFpRWIsTUFqRWEsRUFrRWIsYUFsRWEsRUFtRWIsS0FuRWEsRUFvRWIsV0FwRWEsRUFxRWIsTUFyRWEsRUFzRWIsV0F0RWEsRUF1RWIsU0F2RWE7OztBQTBFZjs7Ozt3QkFHQSxTQUFBLEdBQVc7OztBQUVYOzs7O3dCQUdBLFVBQUEsR0FBWTs7O0FBRVo7Ozs7SUFHYSxtQkFBQTtNQUNYLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsYUFBUCxFQUFzQixTQUFDLElBQUQ7ZUFDakMsT0FBQSxDQUFRLElBQUEsR0FBSyxJQUFiO01BRGlDLENBQXRCO01BR2IsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxTQUFQLEVBQWtCLFNBQUMsUUFBRDtlQUFjLFFBQVEsQ0FBQztNQUF2QixDQUFsQjtJQUpIOzs7QUFNYjs7Ozt3QkFHQSxZQUFBLEdBQWMsU0FBQyxHQUFEO0FBRVosVUFBQTtNQUZjLGlCQUFNLDJCQUFXLHVCQUFTO2FBRXhDLENBQUMsQ0FBQyxLQUFGLENBQ0UsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxJQUFuQixFQUF5QixJQUF6QjtNQUFkLENBQXJCLENBREYsRUFFRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBUSxDQUFDLFNBQW5CLEVBQThCLFNBQTlCO01BQWQsQ0FBckIsQ0FGRixFQUdFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFEO2VBQWMsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxRQUFRLENBQUMsUUFBcEIsRUFBOEIsT0FBOUI7TUFBZCxDQUFyQixDQUhGLEVBSUUsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxVQUFwQixFQUFnQyxTQUFoQztNQUFkLENBQXJCLENBSkY7SUFGWTs7Ozs7QUE3R2hCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5MYW5ndWFnZSBTdXBwb3J0IGFuZCBkZWZhdWx0IG9wdGlvbnMuXG4jIyNcblwidXNlIHN0cmljdFwiXG4jIExhenkgbG9hZGVkIGRlcGVuZGVuY2llc1xuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5leHRlbmQgPSBudWxsXG5cbiNcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTGFuZ3VhZ2VzXG5cbiAgIyBTdXBwb3J0ZWQgdW5pcXVlIGNvbmZpZ3VyYXRpb24ga2V5c1xuICAjIFVzZWQgZm9yIGRldGVjdGluZyBuZXN0ZWQgY29uZmlndXJhdGlvbnMgaW4gLmpzYmVhdXRpZnlyY1xuICBsYW5ndWFnZU5hbWVzOiBbXG4gICAgXCJhcGV4XCJcbiAgICBcImFyZHVpbm9cIlxuICAgIFwiYmFzaFwiXG4gICAgXCJibGFkZVwiXG4gICAgXCJjLXNoYXJwXCJcbiAgICBcImNcIlxuICAgIFwiY2xvanVyZVwiXG4gICAgXCJjb2ZmZWVzY3JpcHRcIlxuICAgIFwiY29sZGZ1c2lvblwiXG4gICAgXCJjcHBcIlxuICAgIFwiY3J5c3RhbFwiXG4gICAgXCJjc3NcIlxuICAgIFwiY3N2XCJcbiAgICBcImRcIlxuICAgIFwiZWpzXCJcbiAgICBcImVsbVwiXG4gICAgXCJlcmJcIlxuICAgIFwiZXJsYW5nXCJcbiAgICBcImdoZXJraW5cIlxuICAgIFwiZ2xzbFwiXG4gICAgXCJnblwiXG4gICAgXCJnb1wiXG4gICAgXCJnb2h0bWxcIlxuICAgIFwiZm9ydHJhblwiXG4gICAgXCJoYW5kbGViYXJzXCJcbiAgICBcImhhc2tlbGxcIlxuICAgIFwiaHRtbFwiXG4gICAgXCJqYWRlXCJcbiAgICBcImphdmFcIlxuICAgIFwiamF2YXNjcmlwdFwiXG4gICAgXCJqc29uXCJcbiAgICBcImpzeFwiXG4gICAgXCJsYXRleFwiXG4gICAgXCJsZXNzXCJcbiAgICBcImx1YVwiXG4gICAgXCJtYXJrZG93blwiXG4gICAgJ21hcmtvJ1xuICAgIFwibXVzdGFjaGVcIlxuICAgIFwibmdpbnhcIlxuICAgIFwibnVuanVja3NcIlxuICAgIFwib2JqZWN0aXZlLWNcIlxuICAgIFwib2NhbWxcIlxuICAgIFwicGF3blwiXG4gICAgXCJwZXJsXCJcbiAgICBcInBocFwiXG4gICAgXCJwdXBwZXRcIlxuICAgIFwicHl0aG9uXCJcbiAgICBcInJcIlxuICAgIFwicmlvdGpzXCJcbiAgICBcInJ1YnlcIlxuICAgIFwicnVzdFwiXG4gICAgXCJzYXNzXCJcbiAgICBcInNjc3NcIlxuICAgIFwic3BhY2ViYXJzXCJcbiAgICBcInNxbFwiXG4gICAgXCJzdmdcIlxuICAgIFwic3dpZ1wiXG4gICAgXCJ0c3NcIlxuICAgIFwidHN4XCJcbiAgICBcInR3aWdcIlxuICAgIFwidHlwZXNjcmlwdFwiXG4gICAgXCJ1eF9tYXJrdXBcIlxuICAgIFwidmFsYVwiXG4gICAgXCJ2dWVcIlxuICAgIFwidmhkbFwiXG4gICAgXCJ2aXN1YWxmb3JjZVwiXG4gICAgXCJ4bWxcIlxuICAgIFwieHRlbXBsYXRlXCJcbiAgICBcInlhbWxcIlxuICAgIFwidGVycmFmb3JtXCJcbiAgICBcInZlcmlsb2dcIlxuICBdXG5cbiAgIyMjXG4gIExhbmd1YWdlc1xuICAjIyNcbiAgbGFuZ3VhZ2VzOiBudWxsXG5cbiAgIyMjXG4gIE5hbWVzcGFjZXNcbiAgIyMjXG4gIG5hbWVzcGFjZXM6IG51bGxcblxuICAjIyNcbiAgQ29uc3RydWN0b3JcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBsYW5ndWFnZXMgPSBfLm1hcChAbGFuZ3VhZ2VOYW1lcywgKG5hbWUpIC0+XG4gICAgICByZXF1aXJlKFwiLi8je25hbWV9XCIpXG4gICAgKVxuICAgIEBuYW1lc3BhY2VzID0gXy5tYXAoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBsYW5ndWFnZS5uYW1lc3BhY2UpXG5cbiAgIyMjXG4gIEdldCBsYW5ndWFnZSBmb3IgZ3JhbW1hciBhbmQgZXh0ZW5zaW9uXG4gICMjI1xuICBnZXRMYW5ndWFnZXM6ICh7bmFtZSwgbmFtZXNwYWNlLCBncmFtbWFyLCBleHRlbnNpb259KSAtPlxuICAgICMgY29uc29sZS5sb2coJ2dldExhbmd1YWdlcycsIG5hbWUsIG5hbWVzcGFjZSwgZ3JhbW1hciwgZXh0ZW5zaW9uLCBAbGFuZ3VhZ2VzKVxuICAgIF8udW5pb24oXG4gICAgICBfLmZpbHRlcihAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IF8uaXNFcXVhbChsYW5ndWFnZS5uYW1lLCBuYW1lKSlcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pc0VxdWFsKGxhbmd1YWdlLm5hbWVzcGFjZSwgbmFtZXNwYWNlKSlcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pbmNsdWRlcyhsYW5ndWFnZS5ncmFtbWFycywgZ3JhbW1hcikpXG4gICAgICBfLmZpbHRlcihAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IF8uaW5jbHVkZXMobGFuZ3VhZ2UuZXh0ZW5zaW9ucywgZXh0ZW5zaW9uKSlcbiAgICApXG4iXX0=
