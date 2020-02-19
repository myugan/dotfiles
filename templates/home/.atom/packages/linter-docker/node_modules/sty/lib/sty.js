(function() {
  var code, codeRegex, codeStr, codes, name, num, numRegex, resetRegex, resetStr, styleStr, supported, tagRegex, _fn;
  supported = (require('tty')).isatty(process.stdout);
  exports.disable = function() {
    return supported = false;
  };
  exports.enable = function() {
    return supported = true;
  };
  codes = {
    bold: 1,
    underline: 4,
    reverse: 7,
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37
  };
  for (name in codes) {
    code = codes[name];
    if (code >= 30 && code < 40) {
      codes["bg" + name] = code + 10;
    }
  }
  codes.b = codes.bold;
  codes.u = codes.underline;
  for (num = 0; num <= 109; num++) {
    codes[num] = num;
  }
  resetStr = "\x1B[0m";
  codeStr = function(code) {
    var x;
    if (code instanceof Array) {
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = code.length; _i < _len; _i++) {
          x = code[_i];
          _results.push(codeStr(x));
        }
        return _results;
      })()).join('');
    } else {
      return "\x1B[" + code + "m";
    }
  };
  resetRegex = /\x1B\[0m/g;
  codeRegex = /\x1B\[\d+m/g;
  tagRegex = /(<\w+>|<A\d+>)|(<\/\w+>|<A\d+>)/i;
  numRegex = /\d+/;
  styleStr = function(str, code) {
    str = ('' + str).replace(resetRegex, "" + resetStr + (codeStr(code)));
    return "" + (codeStr(code)) + str + resetStr;
  };
  _fn = function(name, code) {
    return exports[name] = function(str) {
      if (str == null) {
        str = '';
      }
      if (supported) {
        return styleStr(str, code);
      } else {
        return str;
      }
    };
  };
  for (name in codes) {
    code = codes[name];
    _fn(name, code);
  }
  exports.parse = function(str) {
    var activeCodes, match, result, tag;
    if (str == null) {
      str = '';
    }
    result = '';
    activeCodes = [];
    while (match = str.match(tagRegex)) {
      result += str.slice(0, match.index);
      if (match[1]) {
        tag = match[1].slice(1, -1).toLowerCase();
        if (tag.match(numRegex)) {
          tag = tag.slice(1);
        }
        if (tag in codes) {
          if (activeCodes && supported) {
            result += resetStr;
          }
          activeCodes.push(codes[tag]);
          if (supported) {
            result += codeStr(activeCodes);
          }
        } else {
          result += match[1];
        }
      } else {
        tag = match[2].slice(2, -1).toLowerCase();
        if (tag.match(numRegex)) {
          tag = tag.slice(1);
        }
        if (tag in codes) {
          activeCodes.splice(activeCodes.indexOf(codes[tag]), 1);
          if (supported) {
            result += resetStr + codeStr(activeCodes);
          }
        } else {
          result += match[2];
        }
      }
      str = str.slice(match.index + (match[1] || match[2]).length);
    }
    if (activeCodes && supported) {
      result += str + resetStr;
    }
    return result;
  };
}).call(this);
