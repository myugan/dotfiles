(function() {
  "use strict";
  var Beautifier, JSBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(superClass) {
    extend(JSBeautify, superClass);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "CSScomb";

    JSBeautify.prototype.link = "https://github.com/csscomb/csscomb.js";

    JSBeautify.prototype.options = {
      _: {
        configPath: true,
        predefinedConfig: true
      },
      CSS: true,
      LESS: true,
      SCSS: true
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CSON, Comb, comb, config, expandHomeDir, processedCSS, project, ref, syntax;
        Comb = require('csscomb');
        expandHomeDir = require('expand-home-dir');
        CSON = require('season');
        config = null;
        try {
          project = (ref = atom.project.getDirectories()) != null ? ref[0] : void 0;
          try {
            config = CSON.readFileSync(project != null ? project.resolve('.csscomb.cson') : void 0);
          } catch (error) {
            config = require(project != null ? project.resolve('.csscomb.json') : void 0);
          }
        } catch (error) {
          try {
            config = CSON.readFileSync(expandHomeDir(options.configPath));
          } catch (error) {
            config = Comb.getConfig(options.predefinedConfig);
          }
        }
        comb = new Comb(config);
        syntax = "css";
        switch (language) {
          case "LESS":
            syntax = "less";
            break;
          case "SCSS":
            syntax = "scss";
            break;
          case "Sass":
            syntax = "sass";
        }
        processedCSS = comb.processString(text, {
          syntax: syntax
        });
        return resolve(processedCSS);
      });
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY3NzY29tYi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUNyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBRU4sT0FBQSxHQUFTO01BRVAsQ0FBQSxFQUNFO1FBQUEsVUFBQSxFQUFZLElBQVo7UUFDQSxnQkFBQSxFQUFrQixJQURsQjtPQUhLO01BS1AsR0FBQSxFQUFLLElBTEU7TUFNUCxJQUFBLEVBQU0sSUFOQztNQU9QLElBQUEsRUFBTSxJQVBDOzs7eUJBVVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBSWxCLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVI7UUFDUCxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUjtRQUNoQixJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7UUFFUCxNQUFBLEdBQVM7QUFDVDtVQUNFLE9BQUEsc0RBQXlDLENBQUEsQ0FBQTtBQUN6QztZQUNFLE1BQUEsR0FBUyxJQUFJLENBQUMsWUFBTCxtQkFBa0IsT0FBTyxDQUFFLE9BQVQsQ0FBaUIsZUFBakIsVUFBbEIsRUFEWDtXQUFBLGFBQUE7WUFHRSxNQUFBLEdBQVMsT0FBQSxtQkFBUSxPQUFPLENBQUUsT0FBVCxDQUFpQixlQUFqQixVQUFSLEVBSFg7V0FGRjtTQUFBLGFBQUE7QUFPRTtZQUNFLE1BQUEsR0FBUyxJQUFJLENBQUMsWUFBTCxDQUFrQixhQUFBLENBQWMsT0FBTyxDQUFDLFVBQXRCLENBQWxCLEVBRFg7V0FBQSxhQUFBO1lBSUUsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBTyxDQUFDLGdCQUF2QixFQUpYO1dBUEY7O1FBY0EsSUFBQSxHQUFPLElBQUksSUFBSixDQUFTLE1BQVQ7UUFHUCxNQUFBLEdBQVM7QUFDVCxnQkFBTyxRQUFQO0FBQUEsZUFDTyxNQURQO1lBRUksTUFBQSxHQUFTO0FBRE47QUFEUCxlQUdPLE1BSFA7WUFJSSxNQUFBLEdBQVM7QUFETjtBQUhQLGVBS08sTUFMUDtZQU1JLE1BQUEsR0FBUztBQU5iO1FBUUEsWUFBQSxHQUFlLElBQUksQ0FBQyxhQUFMLENBQW1CLElBQW5CLEVBQXlCO1VBQ3RDLE1BQUEsRUFBUSxNQUQ4QjtTQUF6QjtlQUtmLE9BQUEsQ0FBUSxZQUFSO01BeENrQixDQUFiO0lBREM7Ozs7S0FkOEI7QUFIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSlNCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJDU1Njb21iXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vY3NzY29tYi9jc3Njb21iLmpzXCJcblxuICBvcHRpb25zOiB7XG4gICAgIyBUT0RPOiBBZGQgc3VwcG9ydCBmb3Igb3B0aW9uc1xuICAgIF86XG4gICAgICBjb25maWdQYXRoOiB0cnVlXG4gICAgICBwcmVkZWZpbmVkQ29uZmlnOiB0cnVlXG4gICAgQ1NTOiB0cnVlXG4gICAgTEVTUzogdHJ1ZVxuICAgIFNDU1M6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgIyBjb25zb2xlLmxvZygnQ1NTQ29tYicsIHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKVxuXG4gICAgICAjIFJlcXVpcmVcbiAgICAgIENvbWIgPSByZXF1aXJlKCdjc3Njb21iJylcbiAgICAgIGV4cGFuZEhvbWVEaXIgPSByZXF1aXJlKCdleHBhbmQtaG9tZS1kaXInKVxuICAgICAgQ1NPTiA9IHJlcXVpcmUoJ3NlYXNvbicpXG5cbiAgICAgIGNvbmZpZyA9IG51bGxcbiAgICAgIHRyeSAjIExvYWQgZnJvbSBwcm9qZWN0IGNvbmZpZyBmaWxlLCB0aHJvd2luZyBlcnJvciBpZiBuZWl0aGVyIGV4aXN0XG4gICAgICAgIHByb2plY3QgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKT9bMF1cbiAgICAgICAgdHJ5XG4gICAgICAgICAgY29uZmlnID0gQ1NPTi5yZWFkRmlsZVN5bmMocHJvamVjdD8ucmVzb2x2ZSAnLmNzc2NvbWIuY3NvbicpXG4gICAgICAgIGNhdGNoXG4gICAgICAgICAgY29uZmlnID0gcmVxdWlyZShwcm9qZWN0Py5yZXNvbHZlICcuY3NzY29tYi5qc29uJylcbiAgICAgIGNhdGNoXG4gICAgICAgIHRyeSAjIExvYWQgZnJvbSBjdXN0b20gY29uZmlnXG4gICAgICAgICAgY29uZmlnID0gQ1NPTi5yZWFkRmlsZVN5bmMoZXhwYW5kSG9tZURpciBvcHRpb25zLmNvbmZpZ1BhdGgpXG4gICAgICAgIGNhdGNoXG4gICAgICAgICAgIyBGYWxsYmFjayB0byBbc2VsZWN0ZWRdIENTU2NvbWIgcHJlZGlmaW5lZCBjb25maWdcbiAgICAgICAgICBjb25maWcgPSBDb21iLmdldENvbmZpZyhvcHRpb25zLnByZWRlZmluZWRDb25maWcpXG4gICAgICAjIGNvbnNvbGUubG9nKCdjb25maWcnLCBjb25maWcsIG9wdGlvbnMpXG4gICAgICAjIENvbmZpZ3VyZVxuICAgICAgY29tYiA9IG5ldyBDb21iKGNvbmZpZylcblxuICAgICAgIyBEZXRlcm1pbmUgc3ludGF4IGZyb20gTGFuZ3VhZ2VcbiAgICAgIHN5bnRheCA9IFwiY3NzXCIgIyBEZWZhdWx0XG4gICAgICBzd2l0Y2ggbGFuZ3VhZ2VcbiAgICAgICAgd2hlbiBcIkxFU1NcIlxuICAgICAgICAgIHN5bnRheCA9IFwibGVzc1wiXG4gICAgICAgIHdoZW4gXCJTQ1NTXCJcbiAgICAgICAgICBzeW50YXggPSBcInNjc3NcIlxuICAgICAgICB3aGVuIFwiU2Fzc1wiXG4gICAgICAgICAgc3ludGF4ID0gXCJzYXNzXCJcbiAgICAgICMgVXNlXG4gICAgICBwcm9jZXNzZWRDU1MgPSBjb21iLnByb2Nlc3NTdHJpbmcodGV4dCwge1xuICAgICAgICBzeW50YXg6IHN5bnRheFxuICAgICAgfSlcbiAgICAgICMgY29uc29sZS5sb2coJ3Byb2Nlc3NlZENTUycsIHByb2Nlc3NlZENTUywgc3ludGF4KVxuXG4gICAgICByZXNvbHZlKHByb2Nlc3NlZENTUylcbiAgICApXG4iXX0=
