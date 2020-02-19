(function() {
  var $, FrontMatter, config, create, getDateTime, getEditor, getFileRelativeDir, getFileSlug, getFrontMatter, getFrontMatterDate, getTemplateVariables, parseFrontMatterDate, path, utils,
    slice = [].slice;

  $ = require("atom-space-pen-views").$;

  path = require("path");

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("./front-matter");

  create = function() {
    var data, key;
    key = arguments[0], data = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    data = $.extend.apply($, [{}, getTemplateVariables()].concat(slice.call(data)));
    return utils.template(config.get(key), data);
  };

  getTemplateVariables = function() {
    return $.extend({
      site: config.get("siteUrl")
    }, config.get("templateVariables") || {});
  };

  getDateTime = function(date) {
    if (date == null) {
      date = new Date();
    }
    return utils.getDate(date);
  };

  getFrontMatterDate = function(dateTime) {
    return utils.template(config.get("frontMatterDate"), dateTime);
  };

  parseFrontMatterDate = function(str) {
    var dateHash, fn;
    fn = utils.untemplate(config.get("frontMatterDate"));
    dateHash = fn(str);
    if (dateHash) {
      return utils.parseDate(dateHash);
    }
  };

  getFrontMatter = function(frontMatter) {
    return {
      layout: frontMatter.getLayout(),
      published: frontMatter.getPublished(),
      title: frontMatter.getTitle(),
      slug: frontMatter.getSlug(),
      date: frontMatter.getDate(),
      extension: frontMatter.getExtension()
    };
  };

  getFileSlug = function(filePath) {
    var filename, hash, i, len, template, templates;
    if (!filePath) {
      return "";
    }
    filename = path.basename(filePath);
    templates = [config.get("newPostFileName"), config.get("newDraftFileName"), "{slug}{extension}"];
    for (i = 0, len = templates.length; i < len; i++) {
      template = templates[i];
      hash = utils.untemplate(template)(filename);
      if (hash && (hash["slug"] || hash["title"])) {
        return hash["slug"] || hash["title"];
      }
    }
  };

  getFileRelativeDir = function(filePath) {
    var fileDir, siteDir;
    if (!filePath) {
      return "";
    }
    siteDir = utils.getSitePath(config.get("siteLocalDir"), filePath);
    fileDir = path.dirname(filePath);
    return path.relative(siteDir, fileDir);
  };

  getEditor = function(editor) {
    var data, frontMatter;
    frontMatter = new FrontMatter(editor, {
      silent: true
    });
    data = frontMatter.getContent();
    data["category"] = frontMatter.getArray(config.get("frontMatterNameCategories", {
      allow_blank: false
    }))[0];
    data["tag"] = frontMatter.getArray(config.get("frontMatterNameTags", {
      allow_blank: false
    }))[0];
    data["directory"] = getFileRelativeDir(editor.getPath());
    data["slug"] = getFileSlug(editor.getPath()) || utils.slugize(data["title"], config.get("slugSeparator"));
    data["extension"] = path.extname(editor.getPath()) || config.get("fileExtension");
    return data;
  };

  module.exports = {
    create: create,
    getTemplateVariables: getTemplateVariables,
    getDateTime: getDateTime,
    getFrontMatter: getFrontMatter,
    getFrontMatterDate: getFrontMatterDate,
    parseFrontMatterDate: parseFrontMatterDate,
    getEditor: getEditor,
    getFileSlug: getFileSlug
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9oZWxwZXJzL3RlbXBsYXRlLWhlbHBlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9MQUFBO0lBQUE7O0VBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBQ04sSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFHZCxNQUFBLEdBQVMsU0FBQTtBQUNQLFFBQUE7SUFEUSxvQkFBSztJQUNiLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBRixVQUFTLENBQUEsRUFBQSxFQUFJLG9CQUFBLENBQUEsQ0FBd0IsU0FBQSxXQUFBLElBQUEsQ0FBQSxDQUFyQztXQUNQLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBTSxDQUFDLEdBQVAsQ0FBVyxHQUFYLENBQWYsRUFBZ0MsSUFBaEM7RUFGTzs7RUFJVCxvQkFBQSxHQUF1QixTQUFBO1dBQ3JCLENBQUMsQ0FBQyxNQUFGLENBQVM7TUFBRSxJQUFBLEVBQU0sTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFYLENBQVI7S0FBVCxFQUEwQyxNQUFNLENBQUMsR0FBUCxDQUFXLG1CQUFYLENBQUEsSUFBbUMsRUFBN0U7RUFEcUI7O0VBR3ZCLFdBQUEsR0FBYyxTQUFDLElBQUQ7O01BQUMsT0FBTyxJQUFJLElBQUosQ0FBQTs7V0FDcEIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkO0VBRFk7O0VBR2Qsa0JBQUEsR0FBcUIsU0FBQyxRQUFEO1dBQ25CLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBTSxDQUFDLEdBQVAsQ0FBVyxpQkFBWCxDQUFmLEVBQThDLFFBQTlDO0VBRG1COztFQUdyQixvQkFBQSxH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TCxHQUFvQixJQUFJLENBQUMsT0FBTCxDQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBYixDQUFBLElBQWtDLE1BQU0sQ0FBQyxHQUFQLENBQVcsZUFBWDtXQUN0RDtFQVJVOztFQVVaLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsTUFBUjtJQUNBLG9CQUFBLEVBQXNCLG9CQUR0QjtJQUVBLFdBQUEsRUFBYSxXQUZiO0lBR0EsY0FBQSxFQUFnQixjQUhoQjtJQUlBLGtCQUFBLEVBQW9CLGtCQUpwQjtJQUtBLG9CQUFBLEVBQXNCLG9CQUx0QjtJQU1BLFNBQUEsRUFBVyxTQU5YO0lBT0EsV0FBQSxFQUFhLFdBUGI7O0FBOURGIiwic291cmNlc0NvbnRlbnQiOlsieyR9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuRnJvbnRNYXR0ZXIgPSByZXF1aXJlIFwiLi9mcm9udC1tYXR0ZXJcIlxuXG4jIEFsbCB0ZW1wbGF0ZSBzaG91bGQgYmUgY3JlYXRlZCBmcm9tIGhlcmVcbmNyZWF0ZSA9IChrZXksIGRhdGEuLi4pIC0+XG4gIGRhdGEgPSAkLmV4dGVuZCh7fSwgZ2V0VGVtcGxhdGVWYXJpYWJsZXMoKSwgZGF0YS4uLilcbiAgdXRpbHMudGVtcGxhdGUoY29uZmlnLmdldChrZXkpLCBkYXRhKVxuXG5nZXRUZW1wbGF0ZVZhcmlhYmxlcyA9IC0+XG4gICQuZXh0ZW5kKHsgc2l0ZTogY29uZmlnLmdldChcInNpdGVVcmxcIikgfSwgY29uZmlnLmdldChcInRlbXBsYXRlVmFyaWFibGVzXCIpIHx8IHt9KVxuXG5nZXREYXRlVGltZSA9IChkYXRlID0gbmV3IERhdGUoKSkgLT5cbiAgdXRpbHMuZ2V0RGF0ZShkYXRlKVxuXG5nZXRGcm9udE1hdHRlckRhdGUgPSAoZGF0ZVRpbWUpIC0+XG4gIHV0aWxzLnRlbXBsYXRlKGNvbmZpZy5nZXQoXCJmcm9udE1hdHRlckRhdGVcIiksIGRhdGVUaW1lKVxuXG5wYXJzZUZyb250TWF0dGVyRGF0ZSA9IChzdHIpIC0+XG4gIGZuID0gdXRpbHMudW50ZW1wbGF0ZShjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJEYXRlXCIpKVxuICBkYXRlSGFzaCA9IGZuKHN0cilcbiAgdXRpbHMucGFyc2VEYXRlKGRhdGVIYXNoKSBpZiBkYXRlSGFzaFxuXG5nZXRGcm9udE1hdHRlciA9IChmcm9udE1hdHRlcikgLT5cbiAgbGF5b3V0OiBmcm9udE1hdHRlci5nZXRMYXlvdXQoKVxuICBwdWJsaXNoZWQ6IGZyb250TWF0dGVyLmdldFB1Ymxpc2hlZCgpXG4gIHRpdGxlOiBmcm9udE1hdHRlci5nZXRUaXRsZSgpXG4gIHNsdWc6IGZyb250TWF0dGVyLmdldFNsdWcoKVxuICBkYXRlOiBmcm9udE1hdHRlci5nZXREYXRlKClcbiAgZXh0ZW5zaW9uOiBmcm9udE1hdHRlci5nZXRFeHRlbnNpb24oKVxuXG5nZXRGaWxlU2x1ZyA9IChmaWxlUGF0aCkgLT5cbiAgcmV0dXJuIFwiXCIgdW5sZXNzIGZpbGVQYXRoXG5cbiAgZmlsZW5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKVxuICB0ZW1wbGF0ZXMgPSBbY29uZmlnLmdldChcIm5ld1Bvc3RGaWxlTmFtZVwiKSwgY29uZmlnLmdldChcIm5ld0RyYWZ0RmlsZU5hbWVcIiksIFwie3NsdWd9e2V4dGVuc2lvbn1cIl1cbiAgZm9yIHRlbXBsYXRlIGluIHRlbXBsYXRlc1xuICAgIGhhc2ggPSB1dGlscy51bnRlbXBsYXRlKHRlbXBsYXRlKShmaWxlbmFtZSlcbiAgICBpZiBoYXNoICYmIChoYXNoW1wic2x1Z1wiXSB8fCBoYXNoW1widGl0bGVcIl0pICMgdGl0bGUgaXMgdGhlIGxlZ2FjeSBzbHVnIGFsaWFzIGluIGZpbGVuYW1lXG4gICAgICByZXR1cm4gaGFzaFtcInNsdWdcIl0gfHwgaGFzaFtcInRpdGxlXCJdXG5cbmdldEZpbGVSZWxhdGl2ZURpciA9IChmaWxlUGF0aCkgLT5cbiAgcmV0dXJuIFwiXCIgdW5sZXNzIGZpbGVQYXRoXG5cbiAgc2l0ZURpciA9IHV0aWxzLmdldFNpdGVQYXRoKGNvbmZpZy5nZXQoXCJzaXRlTG9jYWxEaXJcIiksIGZpbGVQYXRoKVxuICBmaWxlRGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBwYXRoLnJlbGF0aXZlKHNpdGVEaXIsIGZpbGVEaXIpXG5cbmdldEVkaXRvciA9IChlZGl0b3IpIC0+XG4gIGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKGVkaXRvciwgeyBzaWxlbnQ6IHRydWUgfSlcbiAgZGF0YSA9IGZyb250TWF0dGVyLmdldENvbnRlbnQoKVxuICBkYXRhW1wiY2F0ZWdvcnlcIl0gPSBmcm9udE1hdHRlci5nZXRBcnJheShjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJOYW1lQ2F0ZWdvcmllc1wiLCBhbGxvd19ibGFuazogZmFsc2UpKVswXVxuICBkYXRhW1widGFnXCJdID0gZnJvbnRNYXR0ZXIuZ2V0QXJyYXkoY29uZmlnLmdldChcImZyb250TWF0dGVyTmFtZVRhZ3NcIiwgYWxsb3dfYmxhbms6IGZhbHNlKSlbMF1cbiAgZGF0YVtcImRpcmVjdG9yeVwiXSA9IGdldEZpbGVSZWxhdGl2ZURpcihlZGl0b3IuZ2V0UGF0aCgpKVxuICBkYXRhW1wic2x1Z1wiXSA9IGdldEZpbGVTbHVnKGVkaXRvci5nZXRQYXRoKCkpIHx8IHV0aWxzLnNsdWdpemUoZGF0YVtcInRpdGxlXCJdLCBjb25maWcuZ2V0KFwic2x1Z1NlcGFyYXRvclwiKSlcbiAgZGF0YVtcImV4dGVuc2lvblwiXSA9IHBhdGguZXh0bmFtZShlZGl0b3IuZ2V0UGF0aCgpKSB8fCBjb25maWcuZ2V0KFwiZmlsZUV4dGVuc2lvblwiKVxuICBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY3JlYXRlOiBjcmVhdGVcbiAgZ2V0VGVtcGxhdGVWYXJpYWJsZXM6IGdldFRlbXBsYXRlVmFyaWFibGVzXG4gIGdldERhdGVUaW1lOiBnZXREYXRlVGltZVxuICBnZXRGcm9udE1hdHRlcjogZ2V0RnJvbnRNYXR0ZXJcbiAgZ2V0RnJvbnRNYXR0ZXJEYXRlOiBnZXRGcm9udE1hdHRlckRhdGVcbiAgcGFyc2VGcm9udE1hdHRlckRhdGU6IHBhcnNlRnJvbnRNYXR0ZXJEYXRlXG4gIGdldEVkaXRvcjogZ2V0RWRpdG9yXG4gIGdldEZpbGVTbHVnOiBnZXRGaWxlU2x1Z1xuIl19
