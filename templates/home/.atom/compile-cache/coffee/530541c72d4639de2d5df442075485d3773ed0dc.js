(function() {
  "use strict";
  var Beautifier, TidyMarkdown,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = TidyMarkdown = (function(superClass) {
    extend(TidyMarkdown, superClass);

    function TidyMarkdown() {
      return TidyMarkdown.__super__.constructor.apply(this, arguments);
    }

    TidyMarkdown.prototype.name = "Tidy Markdown";

    TidyMarkdown.prototype.link = "https://github.com/slang800/tidy-markdown";

    TidyMarkdown.prototype.options = {
      Markdown: false
    };

    TidyMarkdown.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, tidyMarkdown;
        tidyMarkdown = require('tidy-markdown');
        cleanMarkdown = tidyMarkdown(text);
        return resolve(cleanMarkdown);
      });
    };

    return TidyMarkdown;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdGlkeS1tYXJrZG93bi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzJCQUNyQixJQUFBLEdBQU07OzJCQUNOLElBQUEsR0FBTTs7MkJBQ04sT0FBQSxHQUFTO01BQ1AsUUFBQSxFQUFVLEtBREg7OzsyQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUjtRQUNmLGFBQUEsR0FBZ0IsWUFBQSxDQUFhLElBQWI7ZUFDaEIsT0FBQSxDQUFRLGFBQVI7TUFIa0IsQ0FBYjtJQURDOzs7O0tBUGdDO0FBSDVDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRpZHlNYXJrZG93biBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJUaWR5IE1hcmtkb3duXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vc2xhbmc4MDAvdGlkeS1tYXJrZG93blwiXG4gIG9wdGlvbnM6IHtcbiAgICBNYXJrZG93bjogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdGlkeU1hcmtkb3duID0gcmVxdWlyZSAndGlkeS1tYXJrZG93bidcbiAgICAgIGNsZWFuTWFya2Rvd24gPSB0aWR5TWFya2Rvd24odGV4dClcbiAgICAgIHJlc29sdmUoY2xlYW5NYXJrZG93bilcbiAgICApXG4iXX0=
