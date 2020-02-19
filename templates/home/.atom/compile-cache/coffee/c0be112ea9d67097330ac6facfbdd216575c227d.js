(function() {
  "use strict";
  var Beautifier, Remark,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Remark = (function(superClass) {
    extend(Remark, superClass);

    function Remark() {
      return Remark.__super__.constructor.apply(this, arguments);
    }

    Remark.prototype.name = "Remark";

    Remark.prototype.link = "https://github.com/remarkjs/remark";

    Remark.prototype.options = {
      _: {
        gfm: true,
        yaml: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        breaks: true,
        entities: true,
        setext: true,
        closeAtx: true,
        looseTable: true,
        spacedTable: true,
        fence: true,
        fences: true,
        bullet: true,
        listItemIndent: true,
        incrementListMarker: true,
        rule: true,
        ruleRepetition: true,
        ruleSpaces: true,
        strong: true,
        emphasis: true,
        position: true
      },
      Markdown: true
    };

    Remark.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, err, remark;
        try {
          remark = require('remark');
          cleanMarkdown = remark().process(text, options).toString();
          return resolve(cleanMarkdown);
        } catch (error) {
          err = error;
          this.error("Remark error: " + err);
          return reject(err);
        }
      });
    };

    return Remark;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcmVtYXJrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxrQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7cUJBQ3JCLElBQUEsR0FBTTs7cUJBQ04sSUFBQSxHQUFNOztxQkFDTixPQUFBLEdBQVM7TUFDUCxDQUFBLEVBQUc7UUFDRCxHQUFBLEVBQUssSUFESjtRQUVELElBQUEsRUFBTSxJQUZMO1FBR0QsVUFBQSxFQUFZLElBSFg7UUFJRCxTQUFBLEVBQVcsSUFKVjtRQUtELFFBQUEsRUFBVSxJQUxUO1FBTUQsTUFBQSxFQUFRLElBTlA7UUFPRCxRQUFBLEVBQVUsSUFQVDtRQVFELE1BQUEsRUFBUSxJQVJQO1FBU0QsUUFBQSxFQUFVLElBVFQ7UUFVRCxVQUFBLEVBQVksSUFWWDtRQVdELFdBQUEsRUFBYSxJQVhaO1FBWUQsS0FBQSxFQUFPLElBWk47UUFhRCxNQUFBLEVBQVEsSUFiUDtRQWNELE1BQUEsRUFBUSxJQWRQO1FBZUQsY0FBQSxFQUFnQixJQWZmO1FBZ0JELG1CQUFBLEVBQXFCLElBaEJwQjtRQWlCRCxJQUFBLEVBQU0sSUFqQkw7UUFrQkQsY0FBQSxFQUFnQixJQWxCZjtRQW1CRCxVQUFBLEVBQVksSUFuQlg7UUFvQkQsTUFBQSxFQUFRLElBcEJQO1FBcUJELFFBQUEsRUFBVSxJQXJCVDtRQXNCRCxRQUFBLEVBQVUsSUF0QlQ7T0FESTtNQXlCUCxRQUFBLEVBQVUsSUF6Qkg7OztxQkE0QlQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7QUFBQTtVQUNFLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjtVQUNULGFBQUEsR0FBZ0IsTUFBQSxDQUFBLENBQVEsQ0FBQyxPQUFULENBQWlCLElBQWpCLEVBQXVCLE9BQXZCLENBQStCLENBQUMsUUFBaEMsQ0FBQTtpQkFDaEIsT0FBQSxDQUFRLGFBQVIsRUFIRjtTQUFBLGFBQUE7VUFJTTtVQUNKLElBQUMsQ0FBQSxLQUFELENBQU8sZ0JBQUEsR0FBaUIsR0FBeEI7aUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUFORjs7TUFEa0IsQ0FBYjtJQURDOzs7O0tBL0IwQjtBQUh0QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSZW1hcmsgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUmVtYXJrXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vcmVtYXJranMvcmVtYXJrXCJcbiAgb3B0aW9uczoge1xuICAgIF86IHtcbiAgICAgIGdmbTogdHJ1ZVxuICAgICAgeWFtbDogdHJ1ZVxuICAgICAgY29tbW9ubWFyazogdHJ1ZVxuICAgICAgZm9vdG5vdGVzOiB0cnVlXG4gICAgICBwZWRhbnRpYzogdHJ1ZVxuICAgICAgYnJlYWtzOiB0cnVlXG4gICAgICBlbnRpdGllczogdHJ1ZVxuICAgICAgc2V0ZXh0OiB0cnVlXG4gICAgICBjbG9zZUF0eDogdHJ1ZVxuICAgICAgbG9vc2VUYWJsZTogdHJ1ZVxuICAgICAgc3BhY2VkVGFibGU6IHRydWVcbiAgICAgIGZlbmNlOiB0cnVlXG4gICAgICBmZW5jZXM6IHRydWVcbiAgICAgIGJ1bGxldDogdHJ1ZVxuICAgICAgbGlzdEl0ZW1JbmRlbnQ6IHRydWVcbiAgICAgIGluY3JlbWVudExpc3RNYXJrZXI6IHRydWVcbiAgICAgIHJ1bGU6IHRydWVcbiAgICAgIHJ1bGVSZXBldGl0aW9uOiB0cnVlXG4gICAgICBydWxlU3BhY2VzOiB0cnVlXG4gICAgICBzdHJvbmc6IHRydWVcbiAgICAgIGVtcGhhc2lzOiB0cnVlXG4gICAgICBwb3NpdGlvbjogdHJ1ZVxuICAgIH1cbiAgICBNYXJrZG93bjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICB0cnlcbiAgICAgICAgcmVtYXJrID0gcmVxdWlyZSAncmVtYXJrJ1xuICAgICAgICBjbGVhbk1hcmtkb3duID0gcmVtYXJrKCkucHJvY2Vzcyh0ZXh0LCBvcHRpb25zKS50b1N0cmluZygpXG4gICAgICAgIHJlc29sdmUgY2xlYW5NYXJrZG93blxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIEBlcnJvcihcIlJlbWFyayBlcnJvcjogI3tlcnJ9XCIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgKVxuIl19
