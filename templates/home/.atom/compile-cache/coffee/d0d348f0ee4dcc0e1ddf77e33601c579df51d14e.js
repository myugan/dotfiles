(function() {
  var FRONT_MATTER_REGEX, FrontMatter, yaml;

  yaml = require("js-yaml");

  FRONT_MATTER_REGEX = /^(?:---\s*$)?([^:]+:[\s\S]*?)^---\s*$/m;

  module.exports = FrontMatter = (function() {
    function FrontMatter(editor, options) {
      if (options == null) {
        options = {};
      }
      this.editor = editor;
      this.options = options;
      this.content = {};
      this.leadingFence = true;
      this.isEmpty = true;
      this.parseError = null;
      this._findFrontMatter((function(_this) {
        return function(match) {
          var error;
          try {
            _this.content = yaml.safeLoad(match.match[1].trim()) || {};
            if (typeof _this.content !== "object") {
              _this.content = {};
              _this.leadingFence = true;
              return _this.isEmpty = true;
            } else {
              _this.leadingFence = match.matchText.startsWith("---");
              return _this.isEmpty = false;
            }
          } catch (error1) {
            error = error1;
            _this.parseError = error;
            _this.content = {};
            if (options["silent"] !== true) {
              return atom.confirm({
                message: "[Markdown Writer] Error!",
                detailedMessage: "Invalid Front Matter:\n" + error.message,
                buttons: ['OK']
              });
            }
          }
        };
      })(this));
    }

    FrontMatter.prototype._findFrontMatter = function(onMatch) {
      return this.editor.buffer.scan(FRONT_MATTER_REGEX, onMatch);
    };

    FrontMatter.prototype.normalizeField = function(field) {
      if (Object.prototype.toString.call(this.content[field]) === "[object Array]") {
        return this.content[field];
      } else if (typeof this.content[field] === "string") {
        return this.content[field] = [this.content[field]];
      } else {
        return this.content[field] = [];
      }
    };

    FrontMatter.prototype.has = function(field) {
      return field && (this.content[field] != null);
    };

    FrontMatter.prototype.get = function(field) {
      return this.content[field];
    };

    FrontMatter.prototype.getArray = function(field) {
      this.normalizeField(field);
      return this.content[field];
    };

    FrontMatter.prototype.set = function(field, content) {
      return this.content[field] = content;
    };

    FrontMatter.prototype.setIfExists = function(field, content) {
      if (this.has(field)) {
        return this.content[field] = content;
      }
    };

    FrontMatter.prototype.getContent = function() {
      return JSON.parse(JSON.stringify(this.content));
    };

    FrontMatter.prototype.getContentText = function() {
      var text;
      text = yaml.safeDump(this.content);
      if (this.leadingFence) {
        return ["---", text + "---", ""].join("\n");
      } else {
        return [text + "---", ""].join("\n");
      }
    };

    FrontMatter.prototype.save = function() {
      return this._findFrontMatter((function(_this) {
        return function(match) {
          return match.replace(_this.getContentText());
        };
      })(this));
    };

    return FrontMatter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9oZWxwZXJzL2Zyb250LW1hdHRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7RUFFUCxrQkFBQSxHQUFxQjs7RUFTckIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUdTLHFCQUFDLE1BQUQsRUFBUyxPQUFUOztRQUFTLFVBQVU7O01BQzlCLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsVUFBRCxHQUFjO01BR2QsSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO0FBQ2hCLGNBQUE7QUFBQTtZQUNFLEtBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQWYsQ0FBQSxDQUFkLENBQUEsSUFBd0M7WUFFbkQsSUFBRyxPQUFPLEtBQUMsQ0FBQSxPQUFSLEtBQW1CLFFBQXRCO2NBQ0UsS0FBQyxDQUFBLE9BQUQsR0FBVztjQUNYLEtBQUMsQ0FBQSxZQUFELEdBQWdCO3FCQUNoQixLQUFDLENBQUEsT0FBRCxHQUFXLEtBSGI7YUFBQSxNQUFBO2NBS0UsS0FBQyxDQUFBLFlBQUQsR0FBZ0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFoQixDQUEyQixLQUEzQjtxQkFDaEIsS0FBQyxDQUFBLE9BQUQsR0FBVyxNQU5iO2FBSEY7V0FBQSxjQUFBO1lBVU07WUFDSixLQUFDLENBQUEsVUFBRCxHQUFjO1lBQ2QsS0FBQyxDQUFBLE9BQUQsR0FBVztZQUNYLElBQU8sT0FBUSxDQUFBLFFBQUEsQ0FBUixLQUFxQixJQUE1QjtxQkFDRSxJQUFJLENBQUMsT0FBTCxDQUNFO2dCQUFBLE9BQUEsRUFBUywwQkFBVDtnQkFDQSxlQUFBLEVBQWlCLHlCQUFBLEdBQTBCLEtBQUssQ0FBQyxPQURqRDtnQkFFQSxPQUFBLEVBQVMsQ0FBQyxJQUFELENBRlQ7ZUFERixFQURGO2FBYkY7O1FBRGdCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQjtJQVRXOzswQkE2QmIsZ0JBQUEsR0FBa0IsU0FBQyxPQUFEO2FBQ2hCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQWYsQ0FBb0Isa0JBQXBCLEVBQXdDLE9BQXhDO0lBRGdCOzswQkFJbEIsY0FBQSxHQUFnQixTQUFDLEtBQUQ7TUFDZCxJQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQTFCLENBQStCLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUF4QyxDQUFBLEtBQW1ELGdCQUF0RDtlQUNFLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxFQURYO09BQUEsTUFFSyxJQUFHLE9BQU8sSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQWhCLEtBQTBCLFFBQTdCO2VBQ0gsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsQ0FBQyxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVixFQURmO09BQUEsTUFBQTtlQUdILElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFULEdBQWtCLEdBSGY7O0lBSFM7OzBCQVFoQixHQUFBLEdBQUssU0FBQyxLQUFEO2FBQVcsS0FBQSxJQUFTO0lBQXBCOzswQkFFTCxHQUFBLEdBQUssU0FBQyxLQUFEO2FBQVcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBO0lBQXBCOzswQkFFTCxRQUFBLEdBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsS0FBaEI7YUFDQSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUE7SUFGRDs7MEJBSVYsR0FBQSxHQUFLLFNBQUMsS0FBRCxFQUFRLE9BQVI7YUFBb0IsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0I7SUFBdEM7OzBCQUVMLFdBQUEsR0FBYSxTQUFDLEtBQUQsRUFBUSxPQUFSO01BQ1gsSUFBNkIsSUFBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLENBQTdCO2VBQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsUUFBbEI7O0lBRFc7OzBCQUdiLFVBQUEsR0FBWSxTQUFBO2FBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUMsQ0FBQSxPQUFoQixDQUFYO0lBQUg7OzBCQUVaLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsT0FBZjtNQUNQLElBQUcsSUFBQyxDQUFBLFlBQUo7ZUFDRSxDQUFDLEtBQUQsRUFBVyxJQUFELEdBQU0sS0FBaEIsRUFBc0IsRUFBdEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUEvQixFQURGO09BQUEsTUFBQTtlQUdFLENBQUksSUFBRCxHQUFNLEtBQVQsRUFBZSxFQUFmLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsRUFIRjs7SUFGYzs7MEJBT2hCLElBQUEsR0FBTSxTQUFBO2FBQ0osSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUFXLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBQyxDQUFBLGNBQUQsQ0FBQSxDQUFkO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBREk7Ozs7O0FBOUVSIiwic291cmNlc0NvbnRlbnQiOlsieWFtbCA9IHJlcXVpcmUgXCJqcy15YW1sXCJcblxuRlJPTlRfTUFUVEVSX1JFR0VYID0gLy8vXG4gIF4oPzotLS1cXHMqJCk/ICAjIG1hdGNoIG9wZW4gLS0tIChpZiBhbnkpXG4gIChcbiAgICBbXjpdKzogICAgICAjIG1hdGNoIGF0IGxlYXN0IDEgb3BlbiBrZXlcbiAgICBbXFxzXFxTXSo/ICAgICMgbWF0Y2ggdGhlIHJlc3RcbiAgKVxuICBeLS0tXFxzKiQgICAgICAgIyBtYXRjaCBlbmRpbmcgLS0tXG4gIC8vL21cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRnJvbnRNYXR0ZXJcbiAgIyBvcHRpb25zOlxuICAjICAgc2lsaWVudCA9IHRydWUvZmFsc2VcbiAgY29uc3RydWN0b3I6IChlZGl0b3IsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZWRpdG9yID0gZWRpdG9yXG4gICAgQG9wdGlvbnMgPSBvcHRpb25zXG4gICAgQGNvbnRlbnQgPSB7fVxuICAgIEBsZWFkaW5nRmVuY2UgPSB0cnVlXG4gICAgQGlzRW1wdHkgPSB0cnVlXG4gICAgQHBhcnNlRXJyb3IgPSBudWxsXG5cbiAgICAjIGZpbmQgYW5kIHBhcnNlIGZyb250IG1hdHRlclxuICAgIEBfZmluZEZyb250TWF0dGVyIChtYXRjaCkgPT5cbiAgICAgIHRyeVxuICAgICAgICBAY29udGVudCA9IHlhbWwuc2FmZUxvYWQobWF0Y2gubWF0Y2hbMV0udHJpbSgpKSB8fCB7fVxuXG4gICAgICAgIGlmIHR5cGVvZiBAY29udGVudCAhPSBcIm9iamVjdFwiICMgZXJyb3IgcGFyc2luZyAjMTM2XG4gICAgICAgICAgQGNvbnRlbnQgPSB7fVxuICAgICAgICAgIEBsZWFkaW5nRmVuY2UgPSB0cnVlXG4gICAgICAgICAgQGlzRW1wdHkgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAbGVhZGluZ0ZlbmNlID0gbWF0Y2gubWF0Y2hUZXh0LnN0YXJ0c1dpdGgoXCItLS1cIilcbiAgICAgICAgICBAaXNFbXB0eSA9IGZhbHNlXG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICBAcGFyc2VFcnJvciA9IGVycm9yXG4gICAgICAgIEBjb250ZW50ID0ge31cbiAgICAgICAgdW5sZXNzIG9wdGlvbnNbXCJzaWxlbnRcIl0gPT0gdHJ1ZVxuICAgICAgICAgIGF0b20uY29uZmlybVxuICAgICAgICAgICAgbWVzc2FnZTogXCJbTWFya2Rvd24gV3JpdGVyXSBFcnJvciFcIlxuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkludmFsaWQgRnJvbnQgTWF0dGVyOlxcbiN7ZXJyb3IubWVzc2FnZX1cIlxuICAgICAgICAgICAgYnV0dG9uczogWydPSyddXG5cbiAgX2ZpbmRGcm9udE1hdHRlcjogKG9uTWF0Y2gpIC0+XG4gICAgQGVkaXRvci5idWZmZXIuc2NhbihGUk9OVF9NQVRURVJfUkVHRVgsIG9uTWF0Y2gpXG5cbiAgIyBub3JtYWxpemUgdGhlIGZpZWxkIHRvIGFuIGFycmF5XG4gIG5vcm1hbGl6ZUZpZWxkOiAoZmllbGQpIC0+XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKEBjb250ZW50W2ZpZWxkXSkgPT0gXCJbb2JqZWN0IEFycmF5XVwiXG4gICAgICBAY29udGVudFtmaWVsZF1cbiAgICBlbHNlIGlmIHR5cGVvZiBAY29udGVudFtmaWVsZF0gPT0gXCJzdHJpbmdcIlxuICAgICAgQGNvbnRlbnRbZmllbGRdID0gW0Bjb250ZW50W2ZpZWxkXV1cbiAgICBlbHNlXG4gICAgICBAY29udGVudFtmaWVsZF0gPSBbXVxuXG4gIGhhczogKGZpZWxkKSAtPiBmaWVsZCAmJiBAY29udGVudFtmaWVsZF0/XG5cbiAgZ2V0OiAoZmllbGQpIC0+IEBjb250ZW50W2ZpZWxkXVxuXG4gIGdldEFycmF5OiAoZmllbGQpIC0+XG4gICAgQG5vcm1hbGl6ZUZpZWxkKGZpZWxkKVxuICAgIEBjb250ZW50W2ZpZWxkXVxuXG4gIHNldDogKGZpZWxkLCBjb250ZW50KSAtPiBAY29udGVudFtmaWVsZF0gPSBjb250ZW50XG5cbiAgc2V0SWZFeGlzdHM6IChmaWVsZCwgY29udGVudCkgLT5cbiAgICBAY29udGVudFtmaWVsZF0gPSBjb250ZW50IGlmIEBoYXMoZmllbGQpXG5cbiAgZ2V0Q29udGVudDogLT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShAY29udGVudCkpXG5cbiAgZ2V0Q29udGVudFRleHQ6IC0+XG4gICAgdGV4dCA9IHlhbWwuc2FmZUR1bXAoQGNvbnRlbnQpXG4gICAgaWYgQGxlYWRpbmdGZW5jZVxuICAgICAgW1wiLS0tXCIsIFwiI3t0ZXh0fS0tLVwiLCBcIlwiXS5qb2luKFwiXFxuXCIpXG4gICAgZWxzZVxuICAgICAgW1wiI3t0ZXh0fS0tLVwiLCBcIlwiXS5qb2luKFwiXFxuXCIpXG5cbiAgc2F2ZTogLT5cbiAgICBAX2ZpbmRGcm9udE1hdHRlciAobWF0Y2gpID0+IG1hdGNoLnJlcGxhY2UoQGdldENvbnRlbnRUZXh0KCkpXG4iXX0=
