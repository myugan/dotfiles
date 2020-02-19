(function() {
  var $, FOOTNOTE_REGEX, FOOTNOTE_TEST_REGEX, IMG_EXTENSIONS, IMG_OR_TEXT, IMG_REGEX, IMG_TAG_ATTRIBUTE, IMG_TAG_REGEX, INLINE_LINK_REGEX, INLINE_LINK_TEST_REGEX, LINK_ID, OPEN_TAG, REFERENCE_DEF_REGEX, REFERENCE_DEF_REGEX_OF, REFERENCE_LINK_REGEX, REFERENCE_LINK_REGEX_OF, REFERENCE_LINK_TEST_REGEX, SLUGIZE_CONTROL_REGEX, SLUGIZE_SPECIAL_REGEX, TABLE_ONE_COLUMN_ROW_REGEX, TABLE_ONE_COLUMN_SEPARATOR_REGEX, TABLE_ROW_REGEX, TABLE_SEPARATOR_REGEX, TEMPLATE_REGEX, UNTEMPLATE_REGEX, URL_AND_TITLE, URL_REGEX, capitalize, cleanDiacritics, createTableRow, createTableSeparator, createUntemplateMatcher, escapeRegExp, findLinkInRange, getAbsolutePath, getBufferRangeForScope, getDate, getHomedir, getJSON, getPackagePath, getProjectPath, getScopeDescriptor, getSitePath, getTextBufferRange, incrementChars, isFootnote, isImage, isImageFile, isImageTag, isInlineLink, isReferenceDefinition, isReferenceLink, isTableRow, isTableSeparator, isUpperCase, isUrl, normalizeFilePath, os, parseDate, parseFootnote, parseImage, parseImageTag, parseInlineLink, parseReferenceDefinition, parseReferenceLink, parseTableRow, parseTableSeparator, path, scanLinks, setTabIndex, slugize, template, untemplate, wcswidth,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = require("atom-space-pen-views").$;

  os = require("os");

  path = require("path");

  wcswidth = require("wcwidth");

  getJSON = function(uri, succeed, error) {
    if (uri.length === 0) {
      return error();
    }
    return $.getJSON(uri).done(succeed).fail(error);
  };

  escapeRegExp = function(str) {
    if (!str) {
      return "";
    }
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  capitalize = function(str) {
    if (!str) {
      return "";
    }
    return str.replace(/^[a-z]/, function(c) {
      return c.toUpperCase();
    });
  };

  isUpperCase = function(str) {
    if (str.length > 0) {
      return str[0] >= 'A' && str[0] <= 'Z';
    } else {
      return false;
    }
  };

  incrementChars = function(str) {
    var carry, chars, index, lowerCase, nextCharCode, upperCase;
    if (str.length < 1) {
      return "a";
    }
    upperCase = isUpperCase(str);
    if (upperCase) {
      str = str.toLowerCase();
    }
    chars = str.split("");
    carry = 1;
    index = chars.length - 1;
    while (carry !== 0 && index >= 0) {
      nextCharCode = chars[index].charCodeAt() + carry;
      if (nextCharCode > "z".charCodeAt()) {
        chars[index] = "a";
        index -= 1;
        carry = 1;
        lowerCase = 1;
      } else {
        chars[index] = String.fromCharCode(nextCharCode);
        carry = 0;
      }
    }
    if (carry === 1) {
      chars.unshift("a");
    }
    str = chars.join("");
    if (upperCase) {
      return str.toUpperCase();
    } else {
      return str;
    }
  };

  cleanDiacritics = function(str) {
    var from, to;
    if (!str) {
      return "";
    }
    from = "ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșšŝťțŭùúüűûñÿýçżźž";
    to = "aaaaaaaaaccceeeeeghiiiijllnnoooooooossssttuuuuuunyyczzz";
    from += from.toUpperCase();
    to += to.toUpperCase();
    to = to.split("");
    from += "ß";
    to.push('ss');
    return str.replace(/.{1}/g, function(c) {
      var index;
      index = from.indexOf(c);
      if (index === -1) {
        return c;
      } else {
        return to[index];
      }
    });
  };

  SLUGIZE_CONTROL_REGEX = /[\u0000-\u001f]/g;

  SLUGIZE_SPECIAL_REGEX = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]+/g;

  slugize = function(str, separator) {
    var escapedSep;
    if (separator == null) {
      separator = '-';
    }
    if (!str) {
      return "";
    }
    escapedSep = escapeRegExp(separator);
    return cleanDiacritics(str).trim().toLowerCase().replace(SLUGIZE_CONTROL_REGEX, '').replace(SLUGIZE_SPECIAL_REGEX, separator).replace(new RegExp(escapedSep + '{2,}', 'g'), separator).replace(new RegExp('^' + escapedSep + '+|' + escapedSep + '+$', 'g'), '');
  };

  getPackagePath = function() {
    var segments;
    segments = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    segments.unshift(atom.packages.resolvePackagePath("markdown-writer"));
    return path.join.apply(null, segments);
  };

  getProjectPath = function(filePath) {
    var paths, projectPath;
    projectPath = atom.project.relativizePath(filePath)[0];
    if (projectPath) {
      return projectPath;
    }
    paths = atom.project.getPaths();
    if (paths && paths.length > 0) {
      return paths[0];
    }
    return atom.config.get("core.projectHome");
  };

  getSitePath = function(configPath, filePath) {
    return getAbsolutePath(configPath || getProjectPath(filePath));
  };

  getHomedir = function() {
    var env, home, user;
    if (typeof os.homedir === "function") {
      return os.homedir();
    }
    env = process.env;
    home = env.HOME;
    user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
    if (process.platform === "win32") {
      return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home;
    } else if (process.platform === "darwin") {
      return home || (user ? "/Users/" + user : void 0);
    } else if (process.platform === "linux") {
      return home || (process.getuid() === 0 ? "/root" : void 0) || (user ? "/home/" + user : void 0);
    } else {
      return home;
    }
  };

  getAbsolutePath = function(path) {
    var home;
    home = getHomedir();
    if (home) {
      return path.replace(/^~($|\/|\\)/, home + '$1');
    } else {
      return path;
    }
  };

  setTabIndex = function(elems) {
    var elem, i, j, len1, results1;
    results1 = [];
    for (i = j = 0, len1 = elems.length; j < len1; i = ++j) {
      elem = elems[i];
      results1.push(elem[0].tabIndex = i + 1);
    }
    return results1;
  };

  TEMPLATE_REGEX = /[\<\{]([\w\.\-]+?)[\>\}]/g;

  UNTEMPLATE_REGEX = /(?:\<|\\\{)([\w\.\-]+?)(?:\>|\\\})/g;

  template = function(text, data, matcher) {
    if (matcher == null) {
      matcher = TEMPLATE_REGEX;
    }
    return text.replace(matcher, function(match, attr) {
      if (data[attr] != null) {
        return data[attr];
      } else {
        return match;
      }
    });
  };

  untemplate = function(text, matcher) {
    var keys;
    if (matcher == null) {
      matcher = UNTEMPLATE_REGEX;
    }
    keys = [];
    text = escapeRegExp(text).replace(matcher, function(match, attr) {
      keys.push(attr);
      if (["year"].indexOf(attr) !== -1) {
        return "(\\d{4})";
      } else if (["month", "day", "hour", "minute", "second"].indexOf(attr) !== -1) {
        return "(\\d{2})";
      } else if (["i_month", "i_day", "i_hour", "i_minute", "i_second"].indexOf(attr) !== -1) {
        return "(\\d{1,2})";
      } else if (["extension"].indexOf(attr) !== -1) {
        return "(\\.\\w+)";
      } else {
        return "([\\s\\S]+)";
      }
    });
    return createUntemplateMatcher(keys, RegExp("^" + text + "$"));
  };

  createUntemplateMatcher = function(keys, regex) {
    return function(str) {
      var matches, results;
      if (!str) {
        return;
      }
      matches = regex.exec(str);
      if (!matches) {
        return;
      }
      results = {
        "_": matches[0]
      };
      keys.forEach(function(key, idx) {
        return results[key] = matches[idx + 1];
      });
      return results;
    };
  };

  parseDate = function(hash) {
    var date, key, map, value, values;
    date = new Date();
    map = {
      setYear: ["year"],
      setMonth: ["month", "i_month"],
      setDate: ["day", "i_day"],
      setHours: ["hour", "i_hour"],
      setMinutes: ["minute", "i_minute"],
      setSeconds: ["second", "i_second"]
    };
    for (key in map) {
      values = map[key];
      value = values.find(function(val) {
        return !!hash[val];
      });
      if (value) {
        value = parseInt(hash[value], 10);
        if (key === 'setMonth') {
          value = value - 1;
        }
        date[key](value);
      }
    }
    return getDate(date);
  };

  getDate = function(date) {
    if (date == null) {
      date = new Date();
    }
    return {
      year: "" + date.getFullYear(),
      month: ("0" + (date.getMonth() + 1)).slice(-2),
      day: ("0" + date.getDate()).slice(-2),
      hour: ("0" + date.getHours()).slice(-2),
      minute: ("0" + date.getMinutes()).slice(-2),
      second: ("0" + date.getSeconds()).slice(-2),
      i_month: "" + (date.getMonth() + 1),
      i_day: "" + date.getDate(),
      i_hour: "" + date.getHours(),
      i_minute: "" + date.getMinutes(),
      i_second: "" + date.getSeconds()
    };
  };

  IMG_TAG_REGEX = /<img(.*?)\/?>/i;

  IMG_TAG_ATTRIBUTE = /([a-z]+?)=('|")(.*?)\2/ig;

  isImageTag = function(input) {
    return IMG_TAG_REGEX.test(input);
  };

  parseImageTag = function(input) {
    var attributes, img, pattern;
    img = {};
    attributes = IMG_TAG_REGEX.exec(input)[1].match(IMG_TAG_ATTRIBUTE);
    pattern = RegExp("" + IMG_TAG_ATTRIBUTE.source, "i");
    attributes.forEach(function(attr) {
      var elem;
      elem = pattern.exec(attr);
      if (elem) {
        return img[elem[1]] = elem[3];
      }
    });
    return img;
  };

  URL_AND_TITLE = /(\S*?)(?: +["'\\(]?(.*?)["'\\)]?)?/.source;

  IMG_OR_TEXT = /(!\[.*?\]\(.+?\)|[^\[]+?)/.source;

  OPEN_TAG = /(?:^|[^!])(?=\[)/.source;

  LINK_ID = /[^\[\]]+/.source;

  IMG_REGEX = RegExp("!\\[(.*?)\\]\\(" + URL_AND_TITLE + "\\)");

  isImage = function(input) {
    return IMG_REGEX.test(input);
  };

  parseImage = function(input) {
    var image;
    image = IMG_REGEX.exec(input);
    if (image && image.length >= 2) {
      return {
        alt: image[1],
        src: image[2],
        title: image[3] || ""
      };
    } else {
      return {
        alt: input,
        src: "",
        title: ""
      };
    }
  };

  IMG_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  isImageFile = function(file) {
    var ref;
    return file && (ref = path.extname(file).toLowerCase(), indexOf.call(IMG_EXTENSIONS, ref) >= 0);
  };

  INLINE_LINK_REGEX = RegExp("\\[" + IMG_OR_TEXT + "\\]\\(" + URL_AND_TITLE + "\\)");

  INLINE_LINK_TEST_REGEX = RegExp("" + OPEN_TAG + INLINE_LINK_REGEX.source);

  isInlineLink = function(input) {
    return INLINE_LINK_TEST_REGEX.test(input);
  };

  parseInlineLink = function(input) {
    var link;
    link = INLINE_LINK_REGEX.exec(input);
    if (link && link.length >= 2) {
      return {
        text: link[1],
        url: link[2],
        title: link[3] || ""
      };
    } else {
      return {
        text: input,
        url: "",
        title: ""
      };
    }
  };

  scanLinks = function(editor, cb) {
    return editor.buffer.scan(RegExp("" + INLINE_LINK_REGEX.source, "g"), function(match) {
      var rg;
      rg = match.range;
      rg.start.column += match.match[1].length + 3;
      rg.end.column -= 1;
      return cb(rg);
    });
  };

  REFERENCE_LINK_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = escapeRegExp(id);
    }
    return RegExp("\\[(" + id + ")\\] ?\\[\\]|\\[" + IMG_OR_TEXT + "\\] ?\\[(" + id + ")\\]");
  };

  REFERENCE_DEF_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = escapeRegExp(id);
    }
    return RegExp("^ *\\[(" + id + ")\\]: +" + URL_AND_TITLE + "$", "m");
  };

  REFERENCE_LINK_REGEX = REFERENCE_LINK_REGEX_OF(LINK_ID, {
    noEscape: true
  });

  REFERENCE_LINK_TEST_REGEX = RegExp("" + OPEN_TAG + REFERENCE_LINK_REGEX.source);

  REFERENCE_DEF_REGEX = REFERENCE_DEF_REGEX_OF(LINK_ID, {
    noEscape: true
  });

  isReferenceLink = function(input) {
    return REFERENCE_LINK_TEST_REGEX.test(input);
  };

  parseReferenceLink = function(input, editor) {
    var def, id, link, text;
    link = REFERENCE_LINK_REGEX.exec(input);
    text = link[2] || link[1];
    id = link[3] || link[1];
    def = void 0;
    editor && editor.buffer.scan(REFERENCE_DEF_REGEX_OF(id), function(match) {
      return def = match;
    });
    if (def) {
      return {
        id: id,
        text: text,
        url: def.match[2],
        title: def.match[3] || "",
        definitionRange: def.range
      };
    } else {
      return {
        id: id,
        text: text,
        url: "",
        title: "",
        definitionRange: null
      };
    }
  };

  isReferenceDefinition = function(input) {
    var def;
    def = REFERENCE_DEF_REGEX.exec(input);
    return !!def && def[1][0] !== "^";
  };

  parseReferenceDefinition = function(input, editor) {
    var def, id, link;
    def = REFERENCE_DEF_REGEX.exec(input);
    id = def[1];
    link = void 0;
    editor && editor.buffer.scan(REFERENCE_LINK_REGEX_OF(id), function(match) {
      return link = match;
    });
    if (link) {
      return {
        id: id,
        text: link.match[2] || link.match[1],
        url: def[2],
        title: def[3] || "",
        linkRange: link.range
      };
    } else {
      return {
        id: id,
        text: "",
        url: def[2],
        title: def[3] || "",
        linkRange: null
      };
    }
  };

  FOOTNOTE_REGEX = /\[\^(.+?)\](:)?/;

  FOOTNOTE_TEST_REGEX = RegExp("" + OPEN_TAG + FOOTNOTE_REGEX.source);

  isFootnote = function(input) {
    return FOOTNOTE_TEST_REGEX.test(input);
  };

  parseFootnote = function(input) {
    var footnote;
    footnote = FOOTNOTE_REGEX.exec(input);
    return {
      label: footnote[1],
      isDefinition: footnote[2] === ":",
      content: ""
    };
  };

  TABLE_SEPARATOR_REGEX = /^(\|)?((?:\s*(?:-+|:-*:|:-*|-*:)\s*\|)+(?:\s*(?:-+|:-*:|:-*|-*:)\s*|\s+))(\|)?$/;

  TABLE_ONE_COLUMN_SEPARATOR_REGEX = /^(\|)(\s*:?-+:?\s*)(\|)$/;

  isTableSeparator = function(line) {
    return TABLE_SEPARATOR_REGEX.test(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.test(line);
  };

  parseTableSeparator = function(line) {
    var columns, extraPipes, matches;
    matches = TABLE_SEPARATOR_REGEX.exec(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.exec(line);
    extraPipes = !!(matches[1] || matches[matches.length - 1]);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: true,
      extraPipes: extraPipes,
      columns: columns,
      columnWidths: columns.map(function(col) {
        return col.length;
      }),
      alignments: columns.map(function(col) {
        var head, tail;
        head = col[0] === ":";
        tail = col[col.length - 1] === ":";
        if (head && tail) {
          return "center";
        } else if (head) {
          return "left";
        } else if (tail) {
          return "right";
        } else {
          return "empty";
        }
      })
    };
  };

  TABLE_ROW_REGEX = /^(\|)?(.+?\|.+?)(\|)?$/;

  TABLE_ONE_COLUMN_ROW_REGEX = /^(\|)(.+?)(\|)$/;

  isTableRow = function(line) {
    return TABLE_ROW_REGEX.test(line) || TABLE_ONE_COLUMN_ROW_REGEX.test(line);
  };

  parseTableRow = function(line) {
    var columns, extraPipes, matches;
    if (isTableSeparator(line)) {
      return parseTableSeparator(line);
    }
    matches = TABLE_ROW_REGEX.exec(line) || TABLE_ONE_COLUMN_ROW_REGEX.exec(line);
    extraPipes = !!(matches[1] || matches[matches.length - 1]);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: false,
      extraPipes: extraPipes,
      columns: columns,
      columnWidths: columns.map(function(col) {
        return wcswidth(col);
      })
    };
  };

  createTableSeparator = function(options) {
    var columnWidth, i, j, ref, row;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = j = 0, ref = options.numOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!options.extraPipes && (i === 0 || i === options.numOfColumns - 1)) {
        columnWidth += 1;
      } else {
        columnWidth += 2;
      }
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(":" + "-".repeat(columnWidth - 2) + ":");
          break;
        case "left":
          row.push(":" + "-".repeat(columnWidth - 1));
          break;
        case "right":
          row.push("-".repeat(columnWidth - 1) + ":");
          break;
        default:
          row.push("-".repeat(columnWidth));
      }
    }
    row = row.join("|");
    if (options.extraPipes) {
      return "|" + row + "|";
    } else {
      return row;
    }
  };

  createTableRow = function(columns, options) {
    var columnWidth, i, j, len, ref, row;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = j = 0, ref = options.numOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!columns[i]) {
        row.push(" ".repeat(columnWidth));
        continue;
      }
      len = columnWidth - wcswidth(columns[i]);
      if (len < 0) {
        throw new Error("Column width " + columnWidth + " - wcswidth('" + columns[i] + "') cannot be " + len);
      }
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(" ".repeat(len / 2) + columns[i] + " ".repeat((len + 1) / 2));
          break;
        case "left":
          row.push(columns[i] + " ".repeat(len));
          break;
        case "right":
          row.push(" ".repeat(len) + columns[i]);
          break;
        default:
          row.push(columns[i] + " ".repeat(len));
      }
    }
    row = row.join(" | ");
    if (options.extraPipes) {
      return "| " + row + " |";
    } else {
      return row;
    }
  };

  URL_REGEX = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/i;

  isUrl = function(url) {
    return URL_REGEX.test(url);
  };

  normalizeFilePath = function(path) {
    return path.split(/[\\\/]/).join('/');
  };

  getScopeDescriptor = function(cursor, scopeSelector) {
    var scopes;
    scopes = cursor.getScopeDescriptor().getScopesArray().filter(function(scope) {
      return scope.indexOf(scopeSelector) >= 0;
    });
    if (scopes.indexOf(scopeSelector) >= 0) {
      return scopeSelector;
    } else if (scopes.length > 0) {
      return scopes[0];
    }
  };

  getBufferRangeForScope = function(editor, cursor, scopeSelector) {
    var pos, range;
    if (!scopeSelector) {
      return;
    }
    pos = cursor.getBufferPosition();
    range = editor.bufferRangeForScopeAtPosition(scopeSelector, pos);
    if (range) {
      return range;
    }
    if (!cursor.isAtBeginningOfLine()) {
      range = editor.bufferRangeForScopeAtPosition(scopeSelector, [pos.row, pos.column - 1]);
      if (range) {
        return range;
      }
    }
    if (!cursor.isAtEndOfLine()) {
      range = editor.bufferRangeForScopeAtPosition(scopeSelector, [pos.row, pos.column + 1]);
      if (range) {
        return range;
      }
    }
  };

  getTextBufferRange = function(editor, scopeSelector, opts) {
    var cursor, range, scope, selectBy, selection, wordRange, wordRegex;
    if (opts == null) {
      opts = {};
    }
    selection = opts.selection || editor.getLastSelection();
    selectBy = opts.selectBy || "nearestWord";
    cursor = selection.cursor;
    range = selection.getText() ? selection.getBufferRange() : (scope = getScopeDescriptor(cursor, scopeSelector)) ? getBufferRangeForScope(editor, cursor, scope) : selectBy === "nearestWord" ? (wordRegex = cursor.wordRegExp({
      includeNonWordCharacters: false
    }), cursor.getCurrentWordBufferRange({
      wordRegex: wordRegex
    })) : selectBy === "currentWord" ? cursor.getCurrentWordBufferRange() : selectBy === "currentNonTrailWord" ? (wordRange = cursor.getCurrentWordBufferRange(), wordRange && wordRange.end.column === cursor.getBufferColumn() ? selection.getBufferRange() : wordRange) : selectBy === "currentLine" ? cursor.getCurrentLineBufferRange() : selectBy === "currentParagraph" ? cursor.getCurrentParagraphBufferRange() : void 0;
    return range || selection.getBufferRange();
  };

  findLinkInRange = function(editor, range) {
    var link, selection;
    selection = editor.getTextInRange(range);
    if (selection === "") {
      return;
    }
    if (isUrl(selection)) {
      return {
        text: "",
        url: selection,
        title: ""
      };
    }
    if (isInlineLink(selection)) {
      return parseInlineLink(selection);
    }
    if (isReferenceLink(selection)) {
      link = parseReferenceLink(selection, editor);
      link.linkRange = range;
      return link;
    } else if (isReferenceDefinition(selection)) {
      selection = editor.lineTextForBufferRow(range.start.row);
      range = editor.bufferRangeForBufferRow(range.start.row);
      link = parseReferenceDefinition(selection, editor);
      link.definitionRange = range;
      return link;
    }
  };

  module.exports = {
    getJSON: getJSON,
    escapeRegExp: escapeRegExp,
    capitalize: capitalize,
    isUpperCase: isUpperCase,
    incrementChars: incrementChars,
    slugize: slugize,
    normalizeFilePath: normalizeFilePath,
    getPackagePath: getPackagePath,
    getProjectPath: getProjectPath,
    getSitePath: getSitePath,
    getHomedir: getHomedir,
    getAbsolutePath: getAbsolutePath,
    setTabIndex: setTabIndex,
    template: template,
    untemplate: untemplate,
    getDate: getDate,
    parseDate: parseDate,
    isImageTag: isImageTag,
    parseImageTag: parseImageTag,
    isImage: isImage,
    parseImage: parseImage,
    scanLinks: scanLinks,
    isInlineLink: isInlineLink,
    parseInlineLink: parseInlineLink,
    isReferenceLink: isReferenceLink,
    parseReferenceLink: parseReferenceLink,
    isReferenceDefinition: isReferenceDefinition,
    parseReferenceDefinition: parseReferenceDefinition,
    isFootnote: isFootnote,
    parseFootnote: parseFootnote,
    isTableSeparator: isTableSeparator,
    parseTableSeparator: parseTableSeparator,
    createTableSeparator: createTableSeparator,
    isTableRow: isTableRow,
    parseTableRow: parseTableRow,
    createTableRow: createTableRow,
    isUrl: isUrl,
    isImageFile: isImageFile,
    getTextBufferRange: getTextBufferRange,
    findLinkInRange: findLinkInRange
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi91dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdxQ0FBQTtJQUFBOzs7RUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUjs7RUFDTixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLFFBQUEsR0FBVyxPQUFBLENBQVEsU0FBUjs7RUFNWCxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLEtBQWY7SUFDUixJQUFrQixHQUFHLENBQUMsTUFBSixLQUFjLENBQWhDO0FBQUEsYUFBTyxLQUFBLENBQUEsRUFBUDs7V0FDQSxDQUFDLENBQUMsT0FBRixDQUFVLEdBQVYsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsT0FBcEIsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztFQUZROztFQUlWLFlBQUEsR0FBZSxTQUFDLEdBQUQ7SUFDYixJQUFBLENBQWlCLEdBQWpCO0FBQUEsYUFBTyxHQUFQOztXQUNBLEdBQUcsQ0FBQyxPQUFKLENBQVksd0JBQVosRUFBc0MsTUFBdEM7RUFGYTs7RUFJZixVQUFBLEdBQWEsU0FBQyxHQUFEO0lBQ1gsSUFBQSxDQUFpQixHQUFqQjtBQUFBLGFBQU8sR0FBUDs7V0FDQSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosRUFBc0IsU0FBQyxDQUFEO2FBQU8sQ0FBQyxDQUFDLFdBQUYsQ0FBQTtJQUFQLENBQXRCO0VBRlc7O0VBSWIsV0FBQSxHQUFjLFNBQUMsR0FBRDtJQUNaLElBQUcsR0FBRyxDQUFDLE1BQUosR0FBYSxDQUFoQjthQUF3QixHQUFJLENBQUEsQ0FBQSxDQUFKLElBQVUsR0FBVixJQUFpQixHQUFJLENBQUEsQ0FBQSxDQUFKLElBQVUsSUFBbkQ7S0FBQSxNQUFBO2FBQ0ssTUFE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LEVBQVksVUF6Q1o7SUEwQ0EsYUFBQSxFQUFlLGFBMUNmO0lBMkNBLGNBQUEsRUFBZ0IsY0EzQ2hCO0lBNkNBLEtBQUEsRUFBTyxLQTdDUDtJQThDQSxXQUFBLEVBQWEsV0E5Q2I7SUFnREEsa0JBQUEsRUFBb0Isa0JBaERwQjtJQWlEQSxlQUFBLEVBQWlCLGVBakRqQjs7QUFocUJGIiwic291cmNlc0NvbnRlbnQiOlsieyR9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbm9zID0gcmVxdWlyZSBcIm9zXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG53Y3N3aWR0aCA9IHJlcXVpcmUgXCJ3Y3dpZHRoXCJcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBHZW5lcmFsIFV0aWxzXG4jXG5cbmdldEpTT04gPSAodXJpLCBzdWNjZWVkLCBlcnJvcikgLT5cbiAgcmV0dXJuIGVycm9yKCkgaWYgdXJpLmxlbmd0aCA9PSAwXG4gICQuZ2V0SlNPTih1cmkpLmRvbmUoc3VjY2VlZCkuZmFpbChlcnJvcilcblxuZXNjYXBlUmVnRXhwID0gKHN0cikgLT5cbiAgcmV0dXJuIFwiXCIgdW5sZXNzIHN0clxuICBzdHIucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCBcIlxcXFwkJlwiKVxuXG5jYXBpdGFsaXplID0gKHN0cikgLT5cbiAgcmV0dXJuIFwiXCIgdW5sZXNzIHN0clxuICBzdHIucmVwbGFjZSAvXlthLXpdLywgKGMpIC0+IGMudG9VcHBlckNhc2UoKVxuXG5pc1VwcGVyQ2FzZSA9IChzdHIpIC0+XG4gIGlmIHN0ci5sZW5ndGggPiAwIHRoZW4gKHN0clswXSA+PSAnQScgJiYgc3RyWzBdIDw9ICdaJylcbiAgZWxzZSBmYWxzZVxuXG4jIGluY3JlbWVudCB0aGUgY2hhcnM6IGEgLT4gYiwgeiAtPiBhYSwgYXogLT4gYmFcbmluY3JlbWVudENoYXJzID0gKHN0cikgLT5cbiAgcmV0dXJuIFwiYVwiIGlmIHN0ci5sZW5ndGggPCAxXG5cbiAgdXBwZXJDYXNlID0gaXNVcHBlckNhc2Uoc3RyKVxuICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSBpZiB1cHBlckNhc2VcblxuICBjaGFycyA9IHN0ci5zcGxpdChcIlwiKVxuICBjYXJyeSA9IDFcbiAgaW5kZXggPSBjaGFycy5sZW5ndGggLSAxXG5cbiAgd2hpbGUgY2FycnkgIT0gMCAmJiBpbmRleCA+PSAwXG4gICAgbmV4dENoYXJDb2RlID0gY2hhcnNbaW5kZXhdLmNoYXJDb2RlQXQoKSArIGNhcnJ5XG5cbiAgICBpZiBuZXh0Q2hhckNvZGUgPiBcInpcIi5jaGFyQ29kZUF0KClcbiAgICAgIGNoYXJzW2luZGV4XSA9IFwiYVwiXG4gICAgICBpbmRleCAtPSAxXG4gICAgICBjYXJyeSA9IDFcbiAgICAgIGxvd2VyQ2FzZSA9IDFcbiAgICBlbHNlXG4gICAgICBjaGFyc1tpbmRleF0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG5leHRDaGFyQ29kZSlcbiAgICAgIGNhcnJ5ID0gMFxuXG4gIGNoYXJzLnVuc2hpZnQoXCJhXCIpIGlmIGNhcnJ5ID09IDFcblxuICBzdHIgPSBjaGFycy5qb2luKFwiXCIpXG4gIGlmIHVwcGVyQ2FzZSB0aGVuIHN0ci50b1VwcGVyQ2FzZSgpIGVsc2Ugc3RyXG5cbiMgaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nL2Jsb2IvbWFzdGVyL2NsZWFuRGlhY3JpdGljcy5qc1xuY2xlYW5EaWFjcml0aWNzID0gKHN0cikgLT5cbiAgcmV0dXJuIFwiXCIgdW5sZXNzIHN0clxuXG4gIGZyb20gPSBcIsSFw6DDocOkw6LDo8Olw6bEg8SHxI3EicSZw6jDqcOrw6rEncSlw6zDrcOvw67EtcWCxL7FhMWIw7LDs8O2xZHDtMO1w7DDuMWbyJnFocWdxaXIm8Wtw7nDusO8xbHDu8Oxw7/DvcOnxbzFusW+XCJcbiAgdG8gPSBcImFhYWFhYWFhYWNjY2VlZWVlZ2hpaWlpamxsbm5vb29vb29vb3Nzc3N0dHV1dXV1dW55eWN6enpcIlxuXG4gIGZyb20gKz0gZnJvbS50b1VwcGVyQ2FzZSgpXG4gIHRvICs9IHRvLnRvVXBwZXJDYXNlKClcblxuICB0byA9IHRvLnNwbGl0KFwiXCIpXG5cbiAgIyBmb3IgdG9rZW5zIHJlcXVpcmVpbmcgbXVsdGl0b2tlbiBvdXRwdXRcbiAgZnJvbSArPSBcIsOfXCJcbiAgdG8ucHVzaCgnc3MnKVxuXG4gIHN0ci5yZXBsYWNlIC8uezF9L2csIChjKSAtPlxuICAgIGluZGV4ID0gZnJvbS5pbmRleE9mKGMpXG4gICAgaWYgaW5kZXggPT0gLTEgdGhlbiBjIGVsc2UgdG9baW5kZXhdXG5cblNMVUdJWkVfQ09OVFJPTF9SRUdFWCA9IC9bXFx1MDAwMC1cXHUwMDFmXS9nXG5TTFVHSVpFX1NQRUNJQUxfUkVHRVggPSAvW1xcc35gIUAjXFwkJVxcXiZcXCpcXChcXClcXC1fXFwrPVxcW1xcXVxce1xcfVxcfFxcXFw7OlwiJzw+LFxcLlxcP1xcL10rL2dcblxuIyBodHRwczovL2dpdGh1Yi5jb20vaGV4b2pzL2hleG8tdXRpbC9ibG9iL21hc3Rlci9saWIvc2x1Z2l6ZS5qc1xuc2x1Z2l6ZSA9IChzdHIsIHNlcGFyYXRvciA9ICctJykgLT5cbiAgcmV0dXJuIFwiXCIgdW5sZXNzIHN0clxuXG4gIGVzY2FwZWRTZXAgPSBlc2NhcGVSZWdFeHAoc2VwYXJhdG9yKVxuXG4gIGNsZWFuRGlhY3JpdGljcyhzdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgIyBSZW1vdmUgY29udHJvbCBjaGFyYWN0ZXJzXG4gICAgLnJlcGxhY2UoU0xVR0laRV9DT05UUk9MX1JFR0VYLCAnJylcbiAgICAjIFJlcGxhY2Ugc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgLnJlcGxhY2UoU0xVR0laRV9TUEVDSUFMX1JFR0VYLCBzZXBhcmF0b3IpXG4gICAgIyBSZW1vdmUgY29udGlub3VzIHNlcGFyYXRvcnNcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZWRTZXAgKyAnezIsfScsICdnJyksIHNlcGFyYXRvcilcbiAgICAjIFJlbW92ZSBwcmVmaXhpbmcgYW5kIHRyYWlsaW5nIHNlcGFydG9yc1xuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ14nICsgZXNjYXBlZFNlcCArICcrfCcgKyBlc2NhcGVkU2VwICsgJyskJywgJ2cnKSwgJycpXG5cbmdldFBhY2thZ2VQYXRoID0gKHNlZ21lbnRzLi4uKSAtPlxuICBzZWdtZW50cy51bnNoaWZ0KGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKFwibWFya2Rvd24td3JpdGVyXCIpKVxuICBwYXRoLmpvaW4uYXBwbHkobnVsbCwgc2VnbWVudHMpXG5cbiMgUHJvamVjdCBwYXRoIGlzIHJlc29sdmVkIHJlbGF0aXZlIHRoZSByZWZlcmVuY2UgZmlsZSBwYXRoLCBuZWVkZWQgd2hlbiBtdWx0aXBsZVxuIyBwcm9qZWN0cyBhcmUgb3BlbmVkIGluIEF0b21cbmdldFByb2plY3RQYXRoID0gKGZpbGVQYXRoKSAtPlxuICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cbiAgcmV0dXJuIHByb2plY3RQYXRoIGlmIHByb2plY3RQYXRoXG4gICMgZmFsbGJhY2sgdG8gZmlyc3QgcHJvamVjdCBvcGVuZWRcbiAgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICByZXR1cm4gcGF0aHNbMF0gaWYgcGF0aHMgJiYgcGF0aHMubGVuZ3RoID4gMFxuICAjIGZhbGxiYWNrIHRvIGFsd2F5cyBnaXZlIGEgcGF0aCBpZiB0aGVyZSdzIG5vIHByb2plY3QgcGF0aHNcbiAgYXRvbS5jb25maWcuZ2V0KFwiY29yZS5wcm9qZWN0SG9tZVwiKVxuXG5nZXRTaXRlUGF0aCA9IChjb25maWdQYXRoLCBmaWxlUGF0aCkgLT5cbiAgZ2V0QWJzb2x1dGVQYXRoKGNvbmZpZ1BhdGggfHwgZ2V0UHJvamVjdFBhdGgoZmlsZVBhdGgpKVxuXG4jIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvb3MtaG9tZWRpci9ibG9iL21hc3Rlci9pbmRleC5qc1xuZ2V0SG9tZWRpciA9IC0+XG4gIHJldHVybiBvcy5ob21lZGlyKCkgaWYgdHlwZW9mKG9zLmhvbWVkaXIpID09IFwiZnVuY3Rpb25cIlxuXG4gIGVudiA9IHByb2Nlc3MuZW52XG4gIGhvbWUgPSBlbnYuSE9NRVxuICB1c2VyID0gZW52LkxPR05BTUUgfHwgZW52LlVTRVIgfHwgZW52LkxOQU1FIHx8IGVudi5VU0VSTkFNRVxuXG4gIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gXCJ3aW4zMlwiXG4gICAgZW52LlVTRVJQUk9GSUxFIHx8IGVudi5IT01FRFJJVkUgKyBlbnYuSE9NRVBBVEggfHwgaG9tZVxuICBlbHNlIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gXCJkYXJ3aW5cIlxuICAgIGhvbWUgfHwgKFwiL1VzZXJzL1wiICsgdXNlciBpZiB1c2VyKVxuICBlbHNlIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gXCJsaW51eFwiXG4gICAgaG9tZSB8fCAoXCIvcm9vdFwiIGlmIHByb2Nlc3MuZ2V0dWlkKCkgPT0gMCkgfHwgKFwiL2hvbWUvXCIgKyB1c2VyIGlmIHVzZXIpXG4gIGVsc2VcbiAgICBob21lXG5cbiMgQmFzaWNhbGx5IGV4cGFuZCB+LyB0byBob21lIGRpcmVjdG9yeVxuIyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3VudGlsZGlmeS9ibG9iL21hc3Rlci9pbmRleC5qc1xuZ2V0QWJzb2x1dGVQYXRoID0gKHBhdGgpIC0+XG4gIGhvbWUgPSBnZXRIb21lZGlyKClcbiAgaWYgaG9tZSB0aGVuIHBhdGgucmVwbGFjZSgvXn4oJHxcXC98XFxcXCkvLCBob21lICsgJyQxJykgZWxzZSBwYXRoXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgR2VuZXJhbCBWaWV3IEhlbHBlcnNcbiNcblxuc2V0VGFiSW5kZXggPSAoZWxlbXMpIC0+XG4gIGVsZW1bMF0udGFiSW5kZXggPSBpICsgMSBmb3IgZWxlbSwgaSBpbiBlbGVtc1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIFRlbXBsYXRlXG4jXG5cblRFTVBMQVRFX1JFR0VYID0gLy8vXG4gIFtcXDxcXHtdICAgICAgICAjIHN0YXJ0IHdpdGggPCBvciB7XG4gIChbXFx3XFwuXFwtXSs/KSAgIyBhbnkgcmVhc29uYWJsZSB3b3JkcywgLSBvciAuXG4gIFtcXD5cXH1dICAgICAgICAjIGVuZCB3aXRoID4gb3IgfVxuICAvLy9nXG5cblVOVEVNUExBVEVfUkVHRVggPSAvLy9cbiAgKD86XFw8fFxcXFxcXHspICAgIyBzdGFydCB3aXRoIDwgb3IgXFx7XG4gIChbXFx3XFwuXFwtXSs/KSAgIyBhbnkgcmVhc29uYWJsZSB3b3JkcywgLSBvciAuXG4gICg/OlxcPnxcXFxcXFx9KSAgICMgZW5kIHdpdGggPiBvciBcXH1cbiAgLy8vZ1xuXG50ZW1wbGF0ZSA9ICh0ZXh0LCBkYXRhLCBtYXRjaGVyID0gVEVNUExBVEVfUkVHRVgpIC0+XG4gIHRleHQucmVwbGFjZSBtYXRjaGVyLCAobWF0Y2gsIGF0dHIpIC0+XG4gICAgaWYgZGF0YVthdHRyXT8gdGhlbiBkYXRhW2F0dHJdIGVsc2UgbWF0Y2hcblxuIyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJldmVyc2UgcGFyc2UgdGhlIHRlbXBsYXRlLCBlLmcuXG4jXG4jIFBhc3MgYHVudGVtcGxhdGUoXCJ7eWVhcn0te21vbnRofVwiKWAgcmV0dXJucyBhIGZ1bmN0aW9uIGBmbmAsIHRoYXQgYGZuKFwiMjAxNS0xMVwiKSAjID0+IHsgXzogXCIyMDE1LTExXCIsIHllYXI6IDIwMTUsIG1vbnRoOiAxMSB9YFxuI1xudW50ZW1wbGF0ZSA9ICh0ZXh0LCBtYXRjaGVyID0gVU5URU1QTEFURV9SRUdFWCkgLT5cbiAga2V5cyA9IFtdXG5cbiAgdGV4dCA9IGVzY2FwZVJlZ0V4cCh0ZXh0KS5yZXBsYWNlIG1hdGNoZXIsIChtYXRjaCwgYXR0cikgLT5cbiAgICBrZXlzLnB1c2goYXR0cilcbiAgICBpZiBbXCJ5ZWFyXCJdLmluZGV4T2YoYXR0cikgIT0gLTEgdGhlbiBcIihcXFxcZHs0fSlcIlxuICAgIGVsc2UgaWYgW1wibW9udGhcIiwgXCJkYXlcIiwgXCJob3VyXCIsIFwibWludXRlXCIsIFwic2Vjb25kXCJdLmluZGV4T2YoYXR0cikgIT0gLTEgdGhlbiBcIihcXFxcZHsyfSlcIlxuICAgIGVsc2UgaWYgW1wiaV9tb250aFwiLCBcImlfZGF5XCIsIFwiaV9ob3VyXCIsIFwiaV9taW51dGVcIiwgXCJpX3NlY29uZFwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXGR7MSwyfSlcIlxuICAgIGVsc2UgaWYgW1wiZXh0ZW5zaW9uXCJdLmluZGV4T2YoYXR0cikgIT0gLTEgdGhlbiBcIihcXFxcLlxcXFx3KylcIlxuICAgIGVsc2UgXCIoW1xcXFxzXFxcXFNdKylcIlxuXG4gIGNyZWF0ZVVudGVtcGxhdGVNYXRjaGVyKGtleXMsIC8vLyBeICN7dGV4dH0gJCAvLy8pXG5cbmNyZWF0ZVVudGVtcGxhdGVNYXRjaGVyID0gKGtleXMsIHJlZ2V4KSAtPlxuICAoc3RyKSAtPlxuICAgIHJldHVybiB1bmxlc3Mgc3RyXG5cbiAgICBtYXRjaGVzID0gcmVnZXguZXhlYyhzdHIpXG4gICAgcmV0dXJuIHVubGVzcyBtYXRjaGVzXG5cbiAgICByZXN1bHRzID0geyBcIl9cIiA6IG1hdGNoZXNbMF0gfVxuICAgIGtleXMuZm9yRWFjaCAoa2V5LCBpZHgpIC0+IHJlc3VsdHNba2V5XSA9IG1hdGNoZXNbaWR4ICsgMV1cbiAgICByZXN1bHRzXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgRGF0ZSBhbmQgVGltZVxuI1xuXG5wYXJzZURhdGUgPSAoaGFzaCkgLT5cbiAgZGF0ZSA9IG5ldyBEYXRlKClcblxuICBtYXAgPVxuICAgIHNldFllYXI6IFtcInllYXJcIl1cbiAgICBzZXRNb250aDogW1wibW9udGhcIiwgXCJpX21vbnRoXCJdXG4gICAgc2V0RGF0ZTogW1wiZGF5XCIsIFwiaV9kYXlcIl1cbiAgICBzZXRIb3VyczogW1wiaG91clwiLCBcImlfaG91clwiXVxuICAgIHNldE1pbnV0ZXM6IFtcIm1pbnV0ZVwiLCBcImlfbWludXRlXCJdXG4gICAgc2V0U2Vjb25kczogW1wic2Vjb25kXCIsIFwiaV9zZWNvbmRcIl1cblxuICBmb3Iga2V5LCB2YWx1ZXMgb2YgbWFwXG4gICAgdmFsdWUgPSB2YWx1ZXMuZmluZCAodmFsKSAtPiAhIWhhc2hbdmFsXVxuICAgIGlmIHZhbHVlXG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KGhhc2hbdmFsdWVdLCAxMClcbiAgICAgIHZhbHVlID0gdmFsdWUgLSAxIGlmIGtleSA9PSAnc2V0TW9udGgnXG4gICAgICBkYXRlW2tleV0odmFsdWUpXG5cbiAgZ2V0RGF0ZShkYXRlKVxuXG5nZXREYXRlID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSAtPlxuICB5ZWFyOiBcIlwiICsgZGF0ZS5nZXRGdWxsWWVhcigpXG4gICMgd2l0aCBwcmVwZW5kZWQgMFxuICBtb250aDogKFwiMFwiICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMilcbiAgZGF5OiAoXCIwXCIgKyBkYXRlLmdldERhdGUoKSkuc2xpY2UoLTIpXG4gIGhvdXI6IChcIjBcIiArIGRhdGUuZ2V0SG91cnMoKSkuc2xpY2UoLTIpXG4gIG1pbnV0ZTogKFwiMFwiICsgZGF0ZS5nZXRNaW51dGVzKCkpLnNsaWNlKC0yKVxuICBzZWNvbmQ6IChcIjBcIiArIGRhdGUuZ2V0U2Vjb25kcygpKS5zbGljZSgtMilcbiAgIyB3aXRob3V0IHByZXBlbmQgMFxuICBpX21vbnRoOiBcIlwiICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpXG4gIGlfZGF5OiBcIlwiICsgZGF0ZS5nZXREYXRlKClcbiAgaV9ob3VyOiBcIlwiICsgZGF0ZS5nZXRIb3VycygpXG4gIGlfbWludXRlOiBcIlwiICsgZGF0ZS5nZXRNaW51dGVzKClcbiAgaV9zZWNvbmQ6IFwiXCIgKyBkYXRlLmdldFNlY29uZHMoKVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEltYWdlIEhUTUwgVGFnXG4jXG5cbklNR19UQUdfUkVHRVggPSAvLy8gPGltZyAoLio/KVxcLz8+IC8vL2lcbklNR19UQUdfQVRUUklCVVRFID0gLy8vIChbYS16XSs/KT0oJ3xcIikoLio/KVxcMiAvLy9pZ1xuXG4jIERldGVjdCBpdCBpcyBhIEhUTUwgaW1hZ2UgdGFnXG5pc0ltYWdlVGFnID0gKGlucHV0KSAtPiBJTUdfVEFHX1JFR0VYLnRlc3QoaW5wdXQpXG5wYXJzZUltYWdlVGFnID0gKGlucHV0KSAtPlxuICBpbWcgPSB7fVxuICBhdHRyaWJ1dGVzID0gSU1HX1RBR19SRUdFWC5leGVjKGlucHV0KVsxXS5tYXRjaChJTUdfVEFHX0FUVFJJQlVURSlcbiAgcGF0dGVybiA9IC8vLyAje0lNR19UQUdfQVRUUklCVVRFLnNvdXJjZX0gLy8vaVxuICBhdHRyaWJ1dGVzLmZvckVhY2ggKGF0dHIpIC0+XG4gICAgZWxlbSA9IHBhdHRlcm4uZXhlYyhhdHRyKVxuICAgIGltZ1tlbGVtWzFdXSA9IGVsZW1bM10gaWYgZWxlbVxuICByZXR1cm4gaW1nXG5cblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBTb21lIHNoYXJlZCByZWdleCBiYXNpY3NcbiNcblxuIyBbdXJsfHVybCBcInRpdGxlXCJdXG5VUkxfQU5EX1RJVExFID0gLy8vXG4gIChcXFMqPykgICAgICAgICAgICAgICAgICAjIGEgdXJsXG4gICg/OlxuICAgIFxcICsgICAgICAgICAgICAgICAgICAgIyBzcGFjZXNcbiAgICBbXCInXFxcXChdPyguKj8pW1wiJ1xcXFwpXT8gIyBxdW90ZWQgdGl0bGVcbiAgKT8gICAgICAgICAgICAgICAgICAgICAgIyBtaWdodCBub3QgcHJlc2VudFxuICAvLy8uc291cmNlXG5cbiMgW2ltYWdlfHRleHRdXG5JTUdfT1JfVEVYVCA9IC8vLyAoIVxcWy4qP1xcXVxcKC4rP1xcKSB8IFteXFxbXSs/KSAvLy8uc291cmNlXG4jIGF0IGhlYWQgb3Igbm90ICFbLCB3b3JrYXJvdW5kIG9mIG5vIG5lZy1sb29rYmVoaW5kIGluIEpTXG5PUEVOX1RBRyA9IC8vLyAoPzpefFteIV0pKD89XFxbKSAvLy8uc291cmNlXG4jIGxpbmsgaWQgZG9uJ3QgY29udGFpbnMgWyBvciBdXG5MSU5LX0lEID0gLy8vIFteXFxbXFxdXSsgLy8vLnNvdXJjZVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEltYWdlXG4jXG5cbklNR19SRUdFWCAgPSAvLy9cbiAgISBcXFsgKC4qPykgXFxdICAgICAgICAgICAgIyAhW2VtcHR5fHRleHRdXG4gICAgXFwoICN7VVJMX0FORF9USVRMRX0gXFwpICMgKGltYWdlIHBhdGgsIGFueSBkZXNjcmlwdGlvbilcbiAgLy8vXG5cbmlzSW1hZ2UgPSAoaW5wdXQpIC0+IElNR19SRUdFWC50ZXN0KGlucHV0KVxucGFyc2VJbWFnZSA9IChpbnB1dCkgLT5cbiAgaW1hZ2UgPSBJTUdfUkVHRVguZXhlYyhpbnB1dClcblxuICBpZiBpbWFnZSAmJiBpbWFnZS5sZW5ndGggPj0gMlxuICAgIHJldHVybiBhbHQ6IGltYWdlWzFdLCBzcmM6IGltYWdlWzJdLCB0aXRsZTogaW1hZ2VbM10gfHwgXCJcIlxuICBlbHNlXG4gICAgcmV0dXJuIGFsdDogaW5wdXQsIHNyYzogXCJcIiwgdGl0bGU6IFwiXCJcblxuSU1HX0VYVEVOU0lPTlMgPSBbXCIuanBnXCIsIFwiLmpwZWdcIiwgXCIucG5nXCIsIFwiLmdpZlwiLCBcIi5pY29cIl1cblxuaXNJbWFnZUZpbGUgPSAoZmlsZSkgLT5cbiAgZmlsZSAmJiAocGF0aC5leHRuYW1lKGZpbGUpLnRvTG93ZXJDYXNlKCkgaW4gSU1HX0VYVEVOU0lPTlMpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgSW5saW5lIGxpbmtcbiNcblxuSU5MSU5FX0xJTktfUkVHRVggPSAvLy9cbiAgXFxbICN7SU1HX09SX1RFWFR9IFxcXSAgICMgW2ltYWdlfHRleHRdXG4gIFxcKCAje1VSTF9BTkRfVElUTEV9IFxcKSAjICh1cmwgXCJhbnkgdGl0bGVcIilcbiAgLy8vXG5cbklOTElORV9MSU5LX1RFU1RfUkVHRVggPSAvLy9cbiAgI3tPUEVOX1RBR31cbiAgI3tJTkxJTkVfTElOS19SRUdFWC5zb3VyY2V9XG4gIC8vL1xuXG5pc0lubGluZUxpbmsgPSAoaW5wdXQpIC0+IElOTElORV9MSU5LX1RFU1RfUkVHRVgudGVzdChpbnB1dClcbnBhcnNlSW5saW5lTGluayA9IChpbnB1dCkgLT5cbiAgbGluayA9IElOTElORV9MSU5LX1JFR0VYLmV4ZWMoaW5wdXQpXG5cbiAgaWYgbGluayAmJiBsaW5rLmxlbmd0aCA+PSAyXG4gICAgdGV4dDogbGlua1sxXSwgdXJsOiBsaW5rWzJdLCB0aXRsZTogbGlua1szXSB8fCBcIlwiXG4gIGVsc2VcbiAgICB0ZXh0OiBpbnB1dCwgdXJsOiBcIlwiLCB0aXRsZTogXCJcIlxuXG5zY2FuTGlua3MgPSAoZWRpdG9yLCBjYikgLT5cbiAgZWRpdG9yLmJ1ZmZlci5zY2FuIC8vLyAje0lOTElORV9MSU5LX1JFR0VYLnNvdXJjZX0gLy8vZywgKG1hdGNoKSAtPlxuICAgIHJnID0gbWF0Y2gucmFuZ2VcbiAgICByZy5zdGFydC5jb2x1bW4gKz0gbWF0Y2gubWF0Y2hbMV0ubGVuZ3RoICsgMyAjIFtdKFxuICAgIHJnLmVuZC5jb2x1bW4gLT0gMVxuICAgIGNiKHJnKVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIFJlZmVyZW5jZSBsaW5rXG4jXG5cbiMgTWF0Y2ggcmVmZXJlbmNlIGxpbmsgW3RleHRdW2lkXVxuUkVGRVJFTkNFX0xJTktfUkVHRVhfT0YgPSAoaWQsIG9wdHMgPSB7fSkgLT5cbiAgaWQgPSBlc2NhcGVSZWdFeHAoaWQpIHVubGVzcyBvcHRzLm5vRXNjYXBlXG4gIC8vL1xuICBcXFsoI3tpZH0pXFxdXFwgP1xcW1xcXSAgICAgICAgICAgICAgICMgW3RleHRdW11cbiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBvclxuICBcXFsje0lNR19PUl9URVhUfVxcXVxcID9cXFsoI3tpZH0pXFxdICMgW2ltYWdlfHRleHRdW2lkXVxuICAvLy9cblxuIyBNYXRjaCByZWZlcmVuY2UgbGluayBkZWZpbml0aW9ucyBbaWRdOiB1cmxcblJFRkVSRU5DRV9ERUZfUkVHRVhfT0YgPSAoaWQsIG9wdHMgPSB7fSkgLT5cbiAgaWQgPSBlc2NhcGVSZWdFeHAoaWQpIHVubGVzcyBvcHRzLm5vRXNjYXBlXG4gIC8vL1xuICBeICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHN0YXJ0IG9mIGxpbmVcbiAgXFwgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICMgYW55IGxlYWRpbmcgc3BhY2VzXG4gIFxcWygje2lkfSlcXF06XFwgKyAgICAgICAgICAgICAgICMgW2lkXTogZm9sbG93ZWQgYnkgc3BhY2VzXG4gICN7VVJMX0FORF9USVRMRX0gICAgICAgICAgICAgICMgbGluayBcInRpdGxlXCJcbiAgJFxuICAvLy9tXG5cbiMgUkVGRVJFTkNFX0xJTktfUkVHRVguZXhlYyhcIlt0ZXh0XVtpZF1cIilcbiMgPT4gW1wiW3RleHRdW2lkXVwiLCB1bmRlZmluZWQsIFwidGV4dFwiLCBcImlkXCJdXG4jXG4jIFJFRkVSRU5DRV9MSU5LX1JFR0VYLmV4ZWMoXCJbdGV4dF1bXVwiKVxuIyA9PiBbXCJbdGV4dF1bXVwiLCBcInRleHRcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXG5SRUZFUkVOQ0VfTElOS19SRUdFWCA9IFJFRkVSRU5DRV9MSU5LX1JFR0VYX09GKExJTktfSUQsIG5vRXNjYXBlOiB0cnVlKVxuUkVGRVJFTkNFX0xJTktfVEVTVF9SRUdFWCA9IC8vL1xuICAje09QRU5fVEFHfVxuICAje1JFRkVSRU5DRV9MSU5LX1JFR0VYLnNvdXJjZX1cbiAgLy8vXG5cblJFRkVSRU5DRV9ERUZfUkVHRVggPSBSRUZFUkVOQ0VfREVGX1JFR0VYX09GKExJTktfSUQsIG5vRXNjYXBlOiB0cnVlKVxuXG5pc1JlZmVyZW5jZUxpbmsgPSAoaW5wdXQpIC0+IFJFRkVSRU5DRV9MSU5LX1RFU1RfUkVHRVgudGVzdChpbnB1dClcbnBhcnNlUmVmZXJlbmNlTGluayA9IChpbnB1dCwgZWRpdG9yKSAtPlxuICBsaW5rID0gUkVGRVJFTkNFX0xJTktfUkVHRVguZXhlYyhpbnB1dClcbiAgdGV4dCA9IGxpbmtbMl0gfHwgbGlua1sxXVxuICBpZCAgID0gbGlua1szXSB8fCBsaW5rWzFdXG5cbiAgIyBmaW5kIGRlZmluaXRpb24gYW5kIGRlZmluaXRpb25SYW5nZSBpZiBlZGl0b3IgaXMgZ2l2ZW5cbiAgZGVmICA9IHVuZGVmaW5lZFxuICBlZGl0b3IgJiYgZWRpdG9yLmJ1ZmZlci5zY2FuIFJFRkVSRU5DRV9ERUZfUkVHRVhfT0YoaWQpLCAobWF0Y2gpIC0+IGRlZiA9IG1hdGNoXG5cbiAgaWYgZGVmXG4gICAgaWQ6IGlkLCB0ZXh0OiB0ZXh0LCB1cmw6IGRlZi5tYXRjaFsyXSwgdGl0bGU6IGRlZi5tYXRjaFszXSB8fCBcIlwiLFxuICAgIGRlZmluaXRpb25SYW5nZTogZGVmLnJhbmdlXG4gIGVsc2VcbiAgICBpZDogaWQsIHRleHQ6IHRleHQsIHVybDogXCJcIiwgdGl0bGU6IFwiXCIsIGRlZmluaXRpb25SYW5nZTogbnVsbFxuXG5pc1JlZmVyZW5jZURlZmluaXRpb24gPSAoaW5wdXQpIC0+XG4gIGRlZiA9IFJFRkVSRU5DRV9ERUZfUkVHRVguZXhlYyhpbnB1dClcbiAgISFkZWYgJiYgZGVmWzFdWzBdICE9IFwiXlwiICMgbm90IGEgZm9vdG5vdGVcblxucGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uID0gKGlucHV0LCBlZGl0b3IpIC0+XG4gIGRlZiAgPSBSRUZFUkVOQ0VfREVGX1JFR0VYLmV4ZWMoaW5wdXQpXG4gIGlkICAgPSBkZWZbMV1cblxuICAjIGZpbmQgbGluayBhbmQgbGlua1JhbmdlIGlmIGVkaXRvciBpcyBnaXZlblxuICBsaW5rID0gdW5kZWZpbmVkXG4gIGVkaXRvciAmJiBlZGl0b3IuYnVmZmVyLnNjYW4gUkVGRVJFTkNFX0xJTktfUkVHRVhfT0YoaWQpLCAobWF0Y2gpIC0+IGxpbmsgPSBtYXRjaFxuXG4gIGlmIGxpbmtcbiAgICBpZDogaWQsIHRleHQ6IGxpbmsubWF0Y2hbMl0gfHwgbGluay5tYXRjaFsxXSwgdXJsOiBkZWZbMl0sXG4gICAgdGl0bGU6IGRlZlszXSB8fCBcIlwiLCBsaW5rUmFuZ2U6IGxpbmsucmFuZ2VcbiAgZWxzZVxuICAgIGlkOiBpZCwgdGV4dDogXCJcIiwgdXJsOiBkZWZbMl0sIHRpdGxlOiBkZWZbM10gfHwgXCJcIiwgbGlua1JhbmdlOiBudWxsXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgRm9vdG5vdGVcbiNcblxuRk9PVE5PVEVfUkVHRVggPSAvLy8gXFxbIFxcXiAoLis/KSBcXF0gKDopPyAvLy9cbkZPT1ROT1RFX1RFU1RfUkVHRVggPSAvLy9cbiAgI3tPUEVOX1RBR31cbiAgI3tGT09UTk9URV9SRUdFWC5zb3VyY2V9XG4gIC8vL1xuXG5pc0Zvb3Rub3RlID0gKGlucHV0KSAtPiBGT09UTk9URV9URVNUX1JFR0VYLnRlc3QoaW5wdXQpXG5wYXJzZUZvb3Rub3RlID0gKGlucHV0KSAtPlxuICBmb290bm90ZSA9IEZPT1ROT1RFX1JFR0VYLmV4ZWMoaW5wdXQpXG4gIGxhYmVsOiBmb290bm90ZVsxXSwgaXNEZWZpbml0aW9uOiBmb290bm90ZVsyXSA9PSBcIjpcIiwgY29udGVudDogXCJcIlxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIFRhYmxlXG4jXG5cblRBQkxFX1NFUEFSQVRPUl9SRUdFWCA9IC8vL1xuICBeXG4gIChcXHwpPyAgICAgICAgICAgICAgICAjIHN0YXJ0cyB3aXRoIGFuIG9wdGlvbmFsIHxcbiAgKFxuICAgKD86XFxzKig/Oi0rfDotKjp8Oi0qfC0qOilcXHMqXFx8KSsgICAgIyBvbmUgb3IgbW9yZSB0YWJsZSBjZWxsXG4gICAoPzpcXHMqKD86LSt8Oi0qOnw6LSp8LSo6KVxccyp8XFxzKykgICAjIGxhc3QgdGFibGUgY2VsbCwgb3IgZW1wdHkgY2VsbFxuICApXG4gIChcXHwpPyAgICAgICAgICAgICAgICAjIGVuZHMgd2l0aCBhbiBvcHRpb25hbCB8XG4gICRcbiAgLy8vXG5cblRBQkxFX09ORV9DT0xVTU5fU0VQQVJBVE9SX1JFR0VYID0gLy8vIF4gKFxcfCkgKFxccyo6Py0rOj9cXHMqKSAoXFx8KSAkIC8vL1xuXG5pc1RhYmxlU2VwYXJhdG9yID0gKGxpbmUpIC0+XG4gIFRBQkxFX1NFUEFSQVRPUl9SRUdFWC50ZXN0KGxpbmUpIHx8XG4gICAgVEFCTEVfT05FX0NPTFVNTl9TRVBBUkFUT1JfUkVHRVgudGVzdChsaW5lKVxuXG5wYXJzZVRhYmxlU2VwYXJhdG9yID0gKGxpbmUpIC0+XG4gIG1hdGNoZXMgPSBUQUJMRV9TRVBBUkFUT1JfUkVHRVguZXhlYyhsaW5lKSB8fFxuICAgIFRBQkxFX09ORV9DT0xVTU5fU0VQQVJBVE9SX1JFR0VYLmV4ZWMobGluZSlcbiAgZXh0cmFQaXBlcyA9ICEhKG1hdGNoZXNbMV0gfHwgbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdKVxuICBjb2x1bW5zID0gbWF0Y2hlc1syXS5zcGxpdChcInxcIikubWFwIChjb2wpIC0+IGNvbC50cmltKClcblxuICByZXR1cm4ge1xuICAgIHNlcGFyYXRvcjogdHJ1ZVxuICAgIGV4dHJhUGlwZXM6IGV4dHJhUGlwZXNcbiAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgY29sdW1uV2lkdGhzOiBjb2x1bW5zLm1hcCAoY29sKSAtPiBjb2wubGVuZ3RoXG4gICAgYWxpZ25tZW50czogY29sdW1ucy5tYXAgKGNvbCkgLT5cbiAgICAgIGhlYWQgPSBjb2xbMF0gPT0gXCI6XCJcbiAgICAgIHRhaWwgPSBjb2xbY29sLmxlbmd0aCAtIDFdID09IFwiOlwiXG5cbiAgICAgIGlmIGhlYWQgJiYgdGFpbFxuICAgICAgICBcImNlbnRlclwiXG4gICAgICBlbHNlIGlmIGhlYWRcbiAgICAgICAgXCJsZWZ0XCJcbiAgICAgIGVsc2UgaWYgdGFpbFxuICAgICAgICBcInJpZ2h0XCJcbiAgICAgIGVsc2VcbiAgICAgICAgXCJlbXB0eVwiXG4gIH1cblxuVEFCTEVfUk9XX1JFR0VYID0gLy8vXG4gIF5cbiAgKFxcfCk/ICAgICAgICAgICAgICAgICMgc3RhcnRzIHdpdGggYW4gb3B0aW9uYWwgfFxuICAoLis/XFx8Lis/KSAgICAgICAgICAgIyBhbnkgY29udGVudCB3aXRoIGF0IGxlYXN0IDIgY29sdW1uc1xuICAoXFx8KT8gICAgICAgICAgICAgICAgIyBlbmRzIHdpdGggYW4gb3B0aW9uYWwgfFxuICAkXG4gIC8vL1xuXG5UQUJMRV9PTkVfQ09MVU1OX1JPV19SRUdFWCA9IC8vLyBeIChcXHwpICguKz8pIChcXHwpICQgLy8vXG5cbmlzVGFibGVSb3cgPSAobGluZSkgLT5cbiAgVEFCTEVfUk9XX1JFR0VYLnRlc3QobGluZSkgfHwgVEFCTEVfT05FX0NPTFVNTl9ST1dfUkVHRVgudGVzdChsaW5lKVxuXG5wYXJzZVRhYmxlUm93ID0gKGxpbmUpIC0+XG4gIHJldHVybiBwYXJzZVRhYmxlU2VwYXJhdG9yKGxpbmUpIGlmIGlzVGFibGVTZXBhcmF0b3IobGluZSlcblxuICBtYXRjaGVzID0gVEFCTEVfUk9XX1JFR0VYLmV4ZWMobGluZSkgfHwgVEFCTEVfT05FX0NPTFVNTl9ST1dfUkVHRVguZXhlYyhsaW5lKVxuICBleHRyYVBpcGVzID0gISEobWF0Y2hlc1sxXSB8fCBtYXRjaGVzW21hdGNoZXMubGVuZ3RoIC0gMV0pXG4gIGNvbHVtbnMgPSBtYXRjaGVzWzJdLnNwbGl0KFwifFwiKS5tYXAgKGNvbCkgLT4gY29sLnRyaW0oKVxuXG4gIHJldHVybiB7XG4gICAgc2VwYXJhdG9yOiBmYWxzZVxuICAgIGV4dHJhUGlwZXM6IGV4dHJhUGlwZXNcbiAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgY29sdW1uV2lkdGhzOiBjb2x1bW5zLm1hcCAoY29sKSAtPiB3Y3N3aWR0aChjb2wpXG4gIH1cblxuIyBkZWZhdWx0czpcbiMgICBudW1PZkNvbHVtbnM6IDNcbiMgICBjb2x1bW5XaWR0aDogM1xuIyAgIGNvbHVtbldpZHRoczogW11cbiMgICBleHRyYVBpcGVzOiB0cnVlXG4jICAgYWxpZ25tZW50OiBcImxlZnRcIiB8IFwicmlnaHRcIiB8IFwiY2VudGVyXCIgfCBcImVtcHR5XCJcbiMgICBhbGlnbm1lbnRzOiBbXVxuY3JlYXRlVGFibGVTZXBhcmF0b3IgPSAob3B0aW9ucykgLT5cbiAgb3B0aW9ucy5jb2x1bW5XaWR0aHMgPz0gW11cbiAgb3B0aW9ucy5hbGlnbm1lbnRzID89IFtdXG5cbiAgcm93ID0gW11cbiAgZm9yIGkgaW4gWzAuLm9wdGlvbnMubnVtT2ZDb2x1bW5zIC0gMV1cbiAgICBjb2x1bW5XaWR0aCA9IG9wdGlvbnMuY29sdW1uV2lkdGhzW2ldIHx8IG9wdGlvbnMuY29sdW1uV2lkdGhcblxuICAgICMgZW1wdHkgc3BhY2VzIHdpbGwgYmUgaW5zZXJ0ZWQgd2hlbiBqb2luIHBpcGVzLCBzbyBuZWVkIHRvIGNvbXBlbnNhdGUgaGVyZVxuICAgIGlmICFvcHRpb25zLmV4dHJhUGlwZXMgJiYgKGkgPT0gMCB8fCBpID09IG9wdGlvbnMubnVtT2ZDb2x1bW5zIC0gMSlcbiAgICAgIGNvbHVtbldpZHRoICs9IDFcbiAgICBlbHNlXG4gICAgICBjb2x1bW5XaWR0aCArPSAyXG5cbiAgICBzd2l0Y2ggb3B0aW9ucy5hbGlnbm1lbnRzW2ldIHx8IG9wdGlvbnMuYWxpZ25tZW50XG4gICAgICB3aGVuIFwiY2VudGVyXCJcbiAgICAgICAgcm93LnB1c2goXCI6XCIgKyBcIi1cIi5yZXBlYXQoY29sdW1uV2lkdGggLSAyKSArIFwiOlwiKVxuICAgICAgd2hlbiBcImxlZnRcIlxuICAgICAgICByb3cucHVzaChcIjpcIiArIFwiLVwiLnJlcGVhdChjb2x1bW5XaWR0aCAtIDEpKVxuICAgICAgd2hlbiBcInJpZ2h0XCJcbiAgICAgICAgcm93LnB1c2goXCItXCIucmVwZWF0KGNvbHVtbldpZHRoIC0gMSkgKyBcIjpcIilcbiAgICAgIGVsc2VcbiAgICAgICAgcm93LnB1c2goXCItXCIucmVwZWF0KGNvbHVtbldpZHRoKSlcblxuICByb3cgPSByb3cuam9pbihcInxcIilcbiAgaWYgb3B0aW9ucy5leHRyYVBpcGVzIHRoZW4gXCJ8I3tyb3d9fFwiIGVsc2Ugcm93XG5cbiMgY29sdW1uczogW3ZhbHVlc11cbiMgZGVmYXVsdHM6XG4jICAgbnVtT2ZDb2x1bW5zOiAzXG4jICAgY29sdW1uV2lkdGg6IDNcbiMgICBjb2x1bW5XaWR0aHM6IFtdXG4jICAgZXh0cmFQaXBlczogdHJ1ZVxuIyAgIGFsaWdubWVudDogXCJsZWZ0XCIgfCBcInJpZ2h0XCIgfCBcImNlbnRlclwiIHwgXCJlbXB0eVwiXG4jICAgYWxpZ25tZW50czogW11cbmNyZWF0ZVRhYmxlUm93ID0gKGNvbHVtbnMsIG9wdGlvbnMpIC0+XG4gIG9wdGlvbnMuY29sdW1uV2lkdGhzID89IFtdXG4gIG9wdGlvbnMuYWxpZ25tZW50cyA/PSBbXVxuXG4gIHJvdyA9IFtdXG4gIGZvciBpIGluIFswLi5vcHRpb25zLm51bU9mQ29sdW1ucyAtIDFdXG4gICAgY29sdW1uV2lkdGggPSBvcHRpb25zLmNvbHVtbldpZHRoc1tpXSB8fCBvcHRpb25zLmNvbHVtbldpZHRoXG5cbiAgICBpZiAhY29sdW1uc1tpXVxuICAgICAgcm93LnB1c2goXCIgXCIucmVwZWF0KGNvbHVtbldpZHRoKSlcbiAgICAgIGNvbnRpbnVlXG5cbiAgICBsZW4gPSBjb2x1bW5XaWR0aCAtIHdjc3dpZHRoKGNvbHVtbnNbaV0pXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sdW1uIHdpZHRoICN7Y29sdW1uV2lkdGh9IC0gd2Nzd2lkdGgoJyN7Y29sdW1uc1tpXX0nKSBjYW5ub3QgYmUgI3tsZW59XCIpIGlmIGxlbiA8IDBcblxuICAgIHN3aXRjaCBvcHRpb25zLmFsaWdubWVudHNbaV0gfHwgb3B0aW9ucy5hbGlnbm1lbnRcbiAgICAgIHdoZW4gXCJjZW50ZXJcIlxuICAgICAgICByb3cucHVzaChcIiBcIi5yZXBlYXQobGVuIC8gMikgKyBjb2x1bW5zW2ldICsgXCIgXCIucmVwZWF0KChsZW4gKyAxKSAvIDIpKVxuICAgICAgd2hlbiBcImxlZnRcIlxuICAgICAgICByb3cucHVzaChjb2x1bW5zW2ldICsgXCIgXCIucmVwZWF0KGxlbikpXG4gICAgICB3aGVuIFwicmlnaHRcIlxuICAgICAgICByb3cucHVzaChcIiBcIi5yZXBlYXQobGVuKSArIGNvbHVtbnNbaV0pXG4gICAgICBlbHNlXG4gICAgICAgIHJvdy5wdXNoKGNvbHVtbnNbaV0gKyBcIiBcIi5yZXBlYXQobGVuKSlcblxuICByb3cgPSByb3cuam9pbihcIiB8IFwiKVxuICBpZiBvcHRpb25zLmV4dHJhUGlwZXMgdGhlbiBcInwgI3tyb3d9IHxcIiBlbHNlIHJvd1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIFVSTFxuI1xuXG5VUkxfUkVHRVggPSAvLy9cbiAgXlxuICAoPzpcXHcrOik/XFwvXFwvICAgICAgICAgICAgICAgICAgICAgICAjIGFueSBwcmVmaXgsIGUuZy4gaHR0cDovL1xuICAoW15cXHNcXC5dK1xcLlxcU3syfXxsb2NhbGhvc3RbXFw6P1xcZF0qKSAjIHNvbWUgZG9tYWluXG4gIFxcUyogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHBhdGhcbiAgJFxuICAvLy9pXG5cbmlzVXJsID0gKHVybCkgLT4gVVJMX1JFR0VYLnRlc3QodXJsKVxuXG4jIE5vcm1hbGl6ZSBhIGZpbGUgcGF0aCB0byBVUkwgc2VwYXJhdG9yXG5ub3JtYWxpemVGaWxlUGF0aCA9IChwYXRoKSAtPiBwYXRoLnNwbGl0KC9bXFxcXFxcL10vKS5qb2luKCcvJylcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBBdG9tIFRleHRFZGl0b3JcbiNcblxuIyBSZXR1cm4gc2NvcGVTZWxlY3RvciBpZiB0aGVyZSBpcyBhbiBleGFjdCBtYXRjaCxcbiMgZWxzZSByZXR1cm4gYW55IHNjb3BlIGRlc2NyaXB0b3IgY29udGFpbnMgc2NvcGVTZWxlY3RvclxuZ2V0U2NvcGVEZXNjcmlwdG9yID0gKGN1cnNvciwgc2NvcGVTZWxlY3RvcikgLT5cbiAgc2NvcGVzID0gY3Vyc29yLmdldFNjb3BlRGVzY3JpcHRvcigpXG4gICAgLmdldFNjb3Blc0FycmF5KClcbiAgICAuZmlsdGVyKChzY29wZSkgLT4gc2NvcGUuaW5kZXhPZihzY29wZVNlbGVjdG9yKSA+PSAwKVxuXG4gIGlmIHNjb3Blcy5pbmRleE9mKHNjb3BlU2VsZWN0b3IpID49IDBcbiAgICByZXR1cm4gc2NvcGVTZWxlY3RvclxuICBlbHNlIGlmIHNjb3Blcy5sZW5ndGggPiAwXG4gICAgcmV0dXJuIHNjb3Blc1swXVxuXG5nZXRCdWZmZXJSYW5nZUZvclNjb3BlID0gKGVkaXRvciwgY3Vyc29yLCBzY29wZVNlbGVjdG9yKSAtPlxuICByZXR1cm4gdW5sZXNzIHNjb3BlU2VsZWN0b3IgIyByZW1vdmUgdW5kZWZpbmVkIHNjb3BlU2VsZWN0b3JcblxuICBwb3MgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICByYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvclNjb3BlQXRQb3NpdGlvbihzY29wZVNlbGVjdG9yLCBwb3MpXG4gIHJldHVybiByYW5nZSBpZiByYW5nZVxuXG4gICMgQXRvbSBCdWcgMTogbm90IHJldHVybmluZyB0aGUgY29ycmVjdCBidWZmZXIgcmFuZ2Ugd2hlbiBjdXJzb3IgaXMgYXQgdGhlIGVuZCBvZiBhIGxpbmsgd2l0aCBzY29wZSxcbiAgIyByZWZlciBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2lzc3Vlcy83OTYxXG4gICNcbiAgIyBIQUNLIG1vdmUgdGhlIGN1cnNvciBwb3NpdGlvbiBvbmUgY2hhciBiYWNrd2FyZCwgYW5kIHRyeSB0byBnZXQgdGhlIGJ1ZmZlciByYW5nZSBmb3Igc2NvcGUgYWdhaW5cbiAgdW5sZXNzIGN1cnNvci5pc0F0QmVnaW5uaW5nT2ZMaW5lKClcbiAgICByYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvclNjb3BlQXRQb3NpdGlvbihzY29wZVNlbGVjdG9yLCBbcG9zLnJvdywgcG9zLmNvbHVtbiAtIDFdKVxuICAgIHJldHVybiByYW5nZSBpZiByYW5nZVxuXG4gICMgQXRvbSBCdWcgMjogbm90IHJldHVybmluZyB0aGUgY29ycmVjdCBidWZmZXIgcmFuZ2Ugd2hlbiBjdXJzb3IgaXMgYXQgdGhlIGhlYWQgb2YgYSBsaXN0IGxpbmsgd2l0aCBzY29wZSxcbiAgIyByZWZlciBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2lzc3Vlcy8xMjcxNFxuICAjXG4gICMgSEFDSyBtb3ZlIHRoZSBjdXJzb3IgcG9zaXRpb24gb25lIGNoYXIgZm9yd2FyZCwgYW5kIHRyeSB0byBnZXQgdGhlIGJ1ZmZlciByYW5nZSBmb3Igc2NvcGUgYWdhaW5cbiAgdW5sZXNzIGN1cnNvci5pc0F0RW5kT2ZMaW5lKClcbiAgICByYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvclNjb3BlQXRQb3NpdGlvbihzY29wZVNlbGVjdG9yLCBbcG9zLnJvdywgcG9zLmNvbHVtbiArIDFdKVxuICAgIHJldHVybiByYW5nZSBpZiByYW5nZVxuXG4jIEdldCB0aGUgdGV4dCBidWZmZXIgcmFuZ2UgaWYgc2VsZWN0aW9uIGlzIG5vdCBlbXB0eSwgb3IgZ2V0IHRoZVxuIyBidWZmZXIgcmFuZ2UgaWYgaXQgaXMgaW5zaWRlIGEgc2NvcGUgc2VsZWN0b3IsIG9yIHRoZSBjdXJyZW50IHdvcmQuXG4jXG4jIG9wdHNbXCJzZWxlY3Rpb25cIl06IG9wdGlvbmFsLCB3aGVuIG5vdCBwcm92aWRlZCBvciBlbXB0eSwgdXNlIHRoZSBsYXN0IHNlbGVjdGlvblxuIyBvcHRzW1wic2VsZWN0QnlcIl06XG4jICAtIG5vcGU6IGRvIG5vdCB1c2UgYW55IHNlbGVjdCBieVxuIyAgLSBuZWFyZXN0V29yZDogdHJ5IHNlbGVjdCBuZWFyZXN0IHdvcmQsIGRlZmF1bHRcbiMgIC0gY3VycmVudExpbmU6IHRyeSBzZWxlY3QgY3VycmVudCBsaW5lXG5nZXRUZXh0QnVmZmVyUmFuZ2UgPSAoZWRpdG9yLCBzY29wZVNlbGVjdG9yLCBvcHRzID0ge30pIC0+XG4gIHNlbGVjdGlvbiA9IG9wdHMuc2VsZWN0aW9uIHx8IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKClcbiAgc2VsZWN0QnkgPSBvcHRzLnNlbGVjdEJ5IHx8IFwibmVhcmVzdFdvcmRcIlxuXG4gIGN1cnNvciA9IHNlbGVjdGlvbi5jdXJzb3JcbiAgcmFuZ2UgPSBpZiBzZWxlY3Rpb24uZ2V0VGV4dCgpXG4gICAgICAgICAgICBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICAgIGVsc2UgaWYgc2NvcGUgPSBnZXRTY29wZURlc2NyaXB0b3IoY3Vyc29yLCBzY29wZVNlbGVjdG9yKVxuICAgICAgICAgICAgZ2V0QnVmZmVyUmFuZ2VGb3JTY29wZShlZGl0b3IsIGN1cnNvciwgc2NvcGUpXG4gICAgICAgICAgZWxzZSBpZiBzZWxlY3RCeSA9PSBcIm5lYXJlc3RXb3JkXCJcbiAgICAgICAgICAgIHdvcmRSZWdleCA9IGN1cnNvci53b3JkUmVnRXhwKGluY2x1ZGVOb25Xb3JkQ2hhcmFjdGVyczogZmFsc2UpXG4gICAgICAgICAgICBjdXJzb3IuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSh3b3JkUmVnZXg6IHdvcmRSZWdleClcbiAgICAgICAgICBlbHNlIGlmIHNlbGVjdEJ5ID09IFwiY3VycmVudFdvcmRcIlxuICAgICAgICAgICAgY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2UoKVxuICAgICAgICAgIGVsc2UgaWYgc2VsZWN0QnkgPT0gXCJjdXJyZW50Tm9uVHJhaWxXb3JkXCJcbiAgICAgICAgICAgIHdvcmRSYW5nZSA9IGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKClcbiAgICAgICAgICAgICMgdGVzdCBpZiBjdXJzb3IgaXMgYXQgdGhlIGVuZCBvZiB3b3JkXG4gICAgICAgICAgICBpZiB3b3JkUmFuZ2UgJiYgd29yZFJhbmdlLmVuZC5jb2x1bW4gPT0gY3Vyc29yLmdldEJ1ZmZlckNvbHVtbigpXG4gICAgICAgICAgICAgIHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHdvcmRSYW5nZVxuICAgICAgICAgIGVsc2UgaWYgc2VsZWN0QnkgPT0gXCJjdXJyZW50TGluZVwiXG4gICAgICAgICAgICBjdXJzb3IuZ2V0Q3VycmVudExpbmVCdWZmZXJSYW5nZSgpXG4gICAgICAgICAgZWxzZSBpZiBzZWxlY3RCeSA9PSBcImN1cnJlbnRQYXJhZ3JhcGhcIlxuICAgICAgICAgICAgY3Vyc29yLmdldEN1cnJlbnRQYXJhZ3JhcGhCdWZmZXJSYW5nZSgpICMgY291bGQgZ2V0IHVuZGVmaW5lZCB3aGVuIGN1cnNvciBpcyBvbiBhbiBlbXB0eSBsaW5lXG5cbiAgIyByZXR1cm4gcmFuZ2Ugb3IgZGVmYXVsdCBzZWxlY3Rpb24gcmFuZ2UsIG1ha2Ugc3VyZSB0aGVyZSBpcyBhIHJhbmdlIHJldHVybmVkXG4gIHJhbmdlIHx8IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG5cbiMgRmluZCBhIHBvc3NpYmxlIGxpbmsgdGFnIGluIHRoZSByYW5nZSBmcm9tIGVkaXRvciwgcmV0dXJuIHRoZSBmb3VuZCBsaW5rIGRhdGEgb3IgbmlsXG4jXG4jIERhdGEgZm9ybWF0OiB7IHRleHQ6IFwiXCIsIHVybDogXCJcIiwgdGl0bGU6IFwiXCIsIGlkOiBudWxsLCBsaW5rUmFuZ2U6IG51bGwsIGRlZmluaXRpb25SYW5nZTogbnVsbCB9XG4jXG4jIE5PVEU6IElmIGlkIGlzIG5vdCBudWxsLCBhbmQgYW55IG9mIGxpbmtSYW5nZS9kZWZpbml0aW9uUmFuZ2UgaXMgbnVsbCwgaXQgbWVhbnMgdGhlIGxpbmsgaXMgYW4gb3JwaGFuXG5maW5kTGlua0luUmFuZ2UgPSAoZWRpdG9yLCByYW5nZSkgLT5cbiAgc2VsZWN0aW9uID0gZWRpdG9yLmdldFRleHRJblJhbmdlKHJhbmdlKVxuICByZXR1cm4gaWYgc2VsZWN0aW9uID09IFwiXCJcblxuICByZXR1cm4gdGV4dDogXCJcIiwgdXJsOiBzZWxlY3Rpb24sIHRpdGxlOiBcIlwiIGlmIGlzVXJsKHNlbGVjdGlvbilcbiAgcmV0dXJuIHBhcnNlSW5saW5lTGluayhzZWxlY3Rpb24pIGlmIGlzSW5saW5lTGluayhzZWxlY3Rpb24pXG5cbiAgaWYgaXNSZWZlcmVuY2VMaW5rKHNlbGVjdGlvbilcbiAgICBsaW5rID0gcGFyc2VSZWZlcmVuY2VMaW5rKHNlbGVjdGlvbiwgZWRpdG9yKVxuICAgIGxpbmsubGlua1JhbmdlID0gcmFuZ2VcbiAgICByZXR1cm4gbGlua1xuICBlbHNlIGlmIGlzUmVmZXJlbmNlRGVmaW5pdGlvbihzZWxlY3Rpb24pXG4gICAgIyBIQUNLIGNvcnJlY3QgdGhlIGRlZmluaXRpb24gcmFuZ2UsIEF0b20ncyBsaW5rIHNjb3BlIGRvZXMgbm90IGluY2x1ZGVcbiAgICAjIGRlZmluaXRpb24ncyB0aXRsZSwgc28gbm9ybWFsaXplIHRvIGJlIHRoZSByYW5nZSBzdGFydCByb3dcbiAgICBzZWxlY3Rpb24gPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocmFuZ2Uuc3RhcnQucm93KVxuICAgIHJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93KHJhbmdlLnN0YXJ0LnJvdylcblxuICAgIGxpbmsgPSBwYXJzZVJlZmVyZW5jZURlZmluaXRpb24oc2VsZWN0aW9uLCBlZGl0b3IpXG4gICAgbGluay5kZWZpbml0aW9uUmFuZ2UgPSByYW5nZVxuICAgIHJldHVybiBsaW5rXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgRXhwb3J0c1xuI1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGdldEpTT046IGdldEpTT05cbiAgZXNjYXBlUmVnRXhwOiBlc2NhcGVSZWdFeHBcbiAgY2FwaXRhbGl6ZTogY2FwaXRhbGl6ZVxuICBpc1VwcGVyQ2FzZTogaXNVcHBlckNhc2VcbiAgaW5jcmVtZW50Q2hhcnM6IGluY3JlbWVudENoYXJzXG4gIHNsdWdpemU6IHNsdWdpemVcbiAgbm9ybWFsaXplRmlsZVBhdGg6IG5vcm1hbGl6ZUZpbGVQYXRoXG5cbiAgZ2V0UGFja2FnZVBhdGg6IGdldFBhY2thZ2VQYXRoXG4gIGdldFByb2plY3RQYXRoOiBnZXRQcm9qZWN0UGF0aFxuICBnZXRTaXRlUGF0aDogZ2V0U2l0ZVBhdGhcbiAgZ2V0SG9tZWRpcjogZ2V0SG9tZWRpclxuICBnZXRBYnNvbHV0ZVBhdGg6IGdldEFic29sdXRlUGF0aFxuXG4gIHNldFRhYkluZGV4OiBzZXRUYWJJbmRleFxuXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVxuICB1bnRlbXBsYXRlOiB1bnRlbXBsYXRlXG5cbiAgZ2V0RGF0ZTogZ2V0RGF0ZVxuICBwYXJzZURhdGU6IHBhcnNlRGF0ZVxuXG4gIGlzSW1hZ2VUYWc6IGlzSW1hZ2VUYWdcbiAgcGFyc2VJbWFnZVRhZzogcGFyc2VJbWFnZVRhZ1xuICBpc0ltYWdlOiBpc0ltYWdlXG4gIHBhcnNlSW1hZ2U6IHBhcnNlSW1hZ2VcblxuICBzY2FuTGlua3M6IHNjYW5MaW5rc1xuICBpc0lubGluZUxpbms6IGlzSW5saW5lTGlua1xuICBwYXJzZUlubGluZUxpbms6IHBhcnNlSW5saW5lTGlua1xuICBpc1JlZmVyZW5jZUxpbms6IGlzUmVmZXJlbmNlTGlua1xuICBwYXJzZVJlZmVyZW5jZUxpbms6IHBhcnNlUmVmZXJlbmNlTGlua1xuICBpc1JlZmVyZW5jZURlZmluaXRpb246IGlzUmVmZXJlbmNlRGVmaW5pdGlvblxuICBwYXJzZVJlZmVyZW5jZURlZmluaXRpb246IHBhcnNlUmVmZXJlbmNlRGVmaW5pdGlvblxuXG4gIGlzRm9vdG5vdGU6IGlzRm9vdG5vdGVcbiAgcGFyc2VGb290bm90ZTogcGFyc2VGb290bm90ZVxuXG4gIGlzVGFibGVTZXBhcmF0b3I6IGlzVGFibGVTZXBhcmF0b3JcbiAgcGFyc2VUYWJsZVNlcGFyYXRvcjogcGFyc2VUYWJsZVNlcGFyYXRvclxuICBjcmVhdGVUYWJsZVNlcGFyYXRvcjogY3JlYXRlVGFibGVTZXBhcmF0b3JcbiAgaXNUYWJsZVJvdzogaXNUYWJsZVJvd1xuICBwYXJzZVRhYmxlUm93OiBwYXJzZVRhYmxlUm93XG4gIGNyZWF0ZVRhYmxlUm93OiBjcmVhdGVUYWJsZVJvd1xuXG4gIGlzVXJsOiBpc1VybFxuICBpc0ltYWdlRmlsZTogaXNJbWFnZUZpbGVcblxuICBnZXRUZXh0QnVmZmVyUmFuZ2U6IGdldFRleHRCdWZmZXJSYW5nZVxuICBmaW5kTGlua0luUmFuZ2U6IGZpbmRMaW5rSW5SYW5nZVxuIl19
