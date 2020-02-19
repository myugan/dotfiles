(function() {
  "use strict";
  var Beautifier, Prettier, path, prettier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  prettier = require("prettier");

  path = require("path");

  module.exports = Prettier = (function(superClass) {
    extend(Prettier, superClass);

    function Prettier() {
      return Prettier.__super__.constructor.apply(this, arguments);
    }

    Prettier.prototype.name = "Prettier";

    Prettier.prototype.link = "https://github.com/prettier/prettier";

    Prettier.prototype.options = {
      _: {
        tabWidth: "indent_size",
        useTabs: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            return (indent_with_tabs === true) || (indent_char === "\t");
          }
        ]
      },
      JavaScript: {
        bracketSpacing: "object_curly_spacing"
      },
      TypeScript: false,
      CSS: false,
      LESS: false,
      SCSS: false,
      Vue: false,
      JSON: false,
      Markdown: false
    };

    Prettier.prototype.beautify = function(text, language, options, context) {
      return new this.Promise(function(resolve, reject) {
        var _, err, filePath, parser, prettierLanguage;
        _ = require('lodash');
        prettierLanguage = _.find(prettier.getSupportInfo().languages, {
          'name': language
        });
        if (prettierLanguage) {
          parser = prettierLanguage.parsers[0];
          options.parser = parser;
        } else {
          reject(new Error("Unknown language for Prettier"));
        }
        filePath = context.filePath && path.dirname(context.filePath);
        try {
          return prettier.resolveConfig(filePath).then(function(configOptions) {
            var result;
            result = prettier.format(text, configOptions || options);
            prettier.clearConfigCache();
            return resolve(result);
          });
        } catch (error) {
          err = error;
          return reject(err);
        }
      });
    };

    return Prettier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHJldHRpZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLG9DQUFBO0lBQUE7OztFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBQ1gsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3VCQUNyQixJQUFBLEdBQU07O3VCQUNOLElBQUEsR0FBTTs7dUJBQ04sT0FBQSxHQUFTO01BQ1AsQ0FBQSxFQUNFO1FBQUEsUUFBQSxFQUFVLGFBQVY7UUFDQSxPQUFBLEVBQVM7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CO0FBQzNDLG1CQUFPLENBQUMsZ0JBQUEsS0FBb0IsSUFBckIsQ0FBQSxJQUE4QixDQUFDLFdBQUEsS0FBZSxJQUFoQjtVQURNLENBQXBDO1NBRFQ7T0FGSztNQU1QLFVBQUEsRUFDRTtRQUFBLGNBQUEsRUFBZ0Isc0JBQWhCO09BUEs7TUFRUCxVQUFBLEVBQVksS0FSTDtNQVNQLEdBQUEsRUFBSyxLQVRFO01BVVAsSUFBQSxFQUFNLEtBVkM7TUFXUCxJQUFBLEVBQU0sS0FYQztNQVlQLEdBQUEsRUFBSyxLQVpFO01BYVAsSUFBQSxFQUFNLEtBYkM7TUFjUCxRQUFBLEVBQVUsS0FkSDs7O3VCQWlCVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjtRQUVKLGdCQUFBLEdBQW1CLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBQSxDQUF5QixDQUFDLFNBQWpDLEVBQTRDO1VBQUEsTUFBQSxFQUFRLFFBQVI7U0FBNUM7UUFDbkIsSUFBRyxnQkFBSDtVQUNFLE1BQUEsR0FBUyxnQkFBZ0IsQ0FBQyxPQUFRLENBQUEsQ0FBQTtVQUNsQyxPQUFPLENBQUMsTUFBUixHQUFpQixPQUZuQjtTQUFBLE1BQUE7VUFJRSxNQUFBLENBQU8sSUFBSSxLQUFKLENBQVUsK0JBQVYsQ0FBUCxFQUpGOztRQU1BLFFBQUEsR0FBVyxPQUFPLENBQUMsUUFBUixJQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLE9BQU8sQ0FBQyxRQUFyQjtBQUVoQztpQkFDRSxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLFNBQUMsYUFBRDtBQUNwQyxnQkFBQTtZQUFBLE1BQUEsR0FBUyxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixFQUFzQixhQUFBLElBQWlCLE9BQXZDO1lBQ1QsUUFBUSxDQUFDLGdCQUFULENBQUE7bUJBQ0EsT0FBQSxDQUFRLE1BQVI7VUFIb0MsQ0FBdEMsRUFERjtTQUFBLGFBQUE7VUFNTTtpQkFDSixNQUFBLENBQU8sR0FBUCxFQVBGOztNQVprQixDQUFiO0lBREM7Ozs7S0FwQjRCO0FBTnhDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcblxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wcmV0dGllciA9IHJlcXVpcmUoXCJwcmV0dGllclwiKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJldHRpZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUHJldHRpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9wcmV0dGllci9wcmV0dGllclwiXG4gIG9wdGlvbnM6IHtcbiAgICBfOlxuICAgICAgdGFiV2lkdGg6IFwiaW5kZW50X3NpemVcIlxuICAgICAgdXNlVGFiczogW1wiaW5kZW50X3dpdGhfdGFic1wiLCBcImluZGVudF9jaGFyXCIsIChpbmRlbnRfd2l0aF90YWJzLCBpbmRlbnRfY2hhcikgLT5cbiAgICAgICAgcmV0dXJuIChpbmRlbnRfd2l0aF90YWJzIGlzIHRydWUpIG9yIChpbmRlbnRfY2hhciBpcyBcIlxcdFwiKVxuICAgICAgXVxuICAgIEphdmFTY3JpcHQ6XG4gICAgICBicmFja2V0U3BhY2luZzogXCJvYmplY3RfY3VybHlfc3BhY2luZ1wiXG4gICAgVHlwZVNjcmlwdDogZmFsc2VcbiAgICBDU1M6IGZhbHNlXG4gICAgTEVTUzogZmFsc2VcbiAgICBTQ1NTOiBmYWxzZVxuICAgIFZ1ZTogZmFsc2VcbiAgICBKU09OOiBmYWxzZVxuICAgIE1hcmtkb3duOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcblxuICAgICAgcHJldHRpZXJMYW5ndWFnZSA9IF8uZmluZChwcmV0dGllci5nZXRTdXBwb3J0SW5mbygpLmxhbmd1YWdlcywgJ25hbWUnOiBsYW5ndWFnZSlcbiAgICAgIGlmIHByZXR0aWVyTGFuZ3VhZ2VcbiAgICAgICAgcGFyc2VyID0gcHJldHRpZXJMYW5ndWFnZS5wYXJzZXJzWzBdXG4gICAgICAgIG9wdGlvbnMucGFyc2VyID0gcGFyc2VyXG4gICAgICBlbHNlXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJVbmtub3duIGxhbmd1YWdlIGZvciBQcmV0dGllclwiKSlcblxuICAgICAgZmlsZVBhdGggPSBjb250ZXh0LmZpbGVQYXRoIGFuZCBwYXRoLmRpcm5hbWUgY29udGV4dC5maWxlUGF0aFxuXG4gICAgICB0cnlcbiAgICAgICAgcHJldHRpZXIucmVzb2x2ZUNvbmZpZyhmaWxlUGF0aCkudGhlbigoY29uZmlnT3B0aW9ucykgLT5cbiAgICAgICAgICByZXN1bHQgPSBwcmV0dGllci5mb3JtYXQodGV4dCwgY29uZmlnT3B0aW9ucyBvciBvcHRpb25zKVxuICAgICAgICAgIHByZXR0aWVyLmNsZWFyQ29uZmlnQ2FjaGUoKVxuICAgICAgICAgIHJlc29sdmUgcmVzdWx0XG4gICAgICAgIClcbiAgICAgIGNhdGNoIGVyclxuICAgICAgICByZWplY3QoZXJyKVxuICAgICkiXX0=
