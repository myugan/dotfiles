(function() {
  "use strict";
  var Beautifier, MarkoBeautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = MarkoBeautifier = (function(superClass) {
    extend(MarkoBeautifier, superClass);

    function MarkoBeautifier() {
      return MarkoBeautifier.__super__.constructor.apply(this, arguments);
    }

    MarkoBeautifier.prototype.name = 'Marko Beautifier';

    MarkoBeautifier.prototype.link = "https://github.com/marko-js/marko-prettyprint";

    MarkoBeautifier.prototype.options = {
      Marko: true
    };

    MarkoBeautifier.prototype.beautify = function(text, language, options, context) {
      return new this.Promise(function(resolve, reject) {
        var error, i, indent, indent_char, indent_size, j, markoPrettyprint, prettyprintOptions, ref;
        markoPrettyprint = require('marko-prettyprint');
        indent_char = options.indent_char || ' ';
        indent_size = options.indent_size || 4;
        indent = '';
        for (i = j = 0, ref = indent_size - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          indent += indent_char;
        }
        prettyprintOptions = {
          syntax: options.syntax,
          filename: (context != null) && (context.filePath != null) ? context.filePath : require.resolve('marko-prettyprint'),
          indent: indent
        };
        try {
          return resolve(markoPrettyprint(text, prettyprintOptions));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return MarkoBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbWFya28tYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsMkJBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzhCQUVyQixJQUFBLEdBQU07OzhCQUNOLElBQUEsR0FBTTs7OEJBRU4sT0FBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7Ozs4QkFFRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUVSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxtQkFBUjtRQUVuQixXQUFBLEdBQWMsT0FBTyxDQUFDLFdBQVIsSUFBdUI7UUFDckMsV0FBQSxHQUFjLE9BQU8sQ0FBQyxXQUFSLElBQXVCO1FBRXJDLE1BQUEsR0FBUztBQUVULGFBQVMsMEZBQVQ7VUFDRSxNQUFBLElBQVU7QUFEWjtRQUdBLGtCQUFBLEdBQ0U7VUFBQSxNQUFBLEVBQVMsT0FBTyxDQUFDLE1BQWpCO1VBQ0EsUUFBQSxFQUFhLGlCQUFBLElBQWEsMEJBQWhCLEdBQXVDLE9BQU8sQ0FBQyxRQUEvQyxHQUE2RCxPQUFPLENBQUMsT0FBUixDQUFnQixtQkFBaEIsQ0FEdkU7VUFFQSxNQUFBLEVBQVEsTUFGUjs7QUFJRjtpQkFDRSxPQUFBLENBQVEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsa0JBQXZCLENBQVIsRUFERjtTQUFBLGNBQUE7VUFFTTtpQkFFSixNQUFBLENBQU8sS0FBUCxFQUpGOztNQWhCa0IsQ0FBYjtJQUZDOzs7O0tBUm1DO0FBSC9DIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE1hcmtvQmVhdXRpZmllciBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiAnTWFya28gQmVhdXRpZmllcidcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vbWFya28tanMvbWFya28tcHJldHR5cHJpbnRcIlxuXG4gIG9wdGlvbnM6XG4gICAgTWFya286IHRydWVcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgbWFya29QcmV0dHlwcmludCA9IHJlcXVpcmUoJ21hcmtvLXByZXR0eXByaW50JylcblxuICAgICAgaW5kZW50X2NoYXIgPSBvcHRpb25zLmluZGVudF9jaGFyIHx8ICcgJ1xuICAgICAgaW5kZW50X3NpemUgPSBvcHRpb25zLmluZGVudF9zaXplIHx8IDRcblxuICAgICAgaW5kZW50ID0gJydcblxuICAgICAgZm9yIGkgaW4gWzAuLmluZGVudF9zaXplIC0gMV1cbiAgICAgICAgaW5kZW50ICs9IGluZGVudF9jaGFyXG5cbiAgICAgIHByZXR0eXByaW50T3B0aW9ucyA9XG4gICAgICAgIHN5bnRheCA6IG9wdGlvbnMuc3ludGF4XG4gICAgICAgIGZpbGVuYW1lOiBpZiBjb250ZXh0PyBhbmQgY29udGV4dC5maWxlUGF0aD8gdGhlbiBjb250ZXh0LmZpbGVQYXRoIGVsc2UgcmVxdWlyZS5yZXNvbHZlKCdtYXJrby1wcmV0dHlwcmludCcpXG4gICAgICAgIGluZGVudDogaW5kZW50XG5cbiAgICAgIHRyeVxuICAgICAgICByZXNvbHZlKG1hcmtvUHJldHR5cHJpbnQodGV4dCwgcHJldHR5cHJpbnRPcHRpb25zKSlcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICMgRXJyb3Igb2NjdXJyZWRcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgIClcbiJdfQ==
