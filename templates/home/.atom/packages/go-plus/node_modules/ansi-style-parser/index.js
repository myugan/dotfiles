var ansiRegEx = require('ansi-regex');

var each = function(obj, fn){
  var key;
  for(key in obj){
    if(obj.hasOwnProperty(key)){
      fn(obj[key], key, obj);
    }
  }
};

var removeElm = function(arr, val){
  var i = arr.indexOf(val);
  if(i >= 0){
    arr.splice(i, 1)
  }
};

//values - first is the code, the reset are escapes
var styles = {
  bold: [1, 21, 22],
  dim: [2, 21, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  lightRed: [91, 39],
  lightGreen: [92, 39],
  lightYellow: [93, 39],
  lightBlue: [94, 39],
  lightMagenta: [95, 39],
  lightCyan: [96, 39],
  lightWhite: [97, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgLightRed: [101, 49],
  bgLightGreen: [102, 49],
  bgLightYellow: [103, 49],
  bgLightBlue: [104, 49],
  bgLightMagenta: [105, 49],
  bgLightCyan: [106, 49],
  bgLightWhite: [107, 49],
};

var code_to_style = {};
var escape_codes = {};
var common_escapes = {};

var addEscapeCode = function(escape_code, code, name){
  if(!escape_codes[escape_code]){
    escape_codes[escape_code] = {};
  }
  escape_codes[escape_code][code] = true;
  escape_codes[escape_code][name] = true;
};

each(styles, function(style, name){
  var code = '\u001b['+style[0]+'m';
  code_to_style[code] = name;

  each(style.slice(1), function(num){
    var esc_code = '\u001b['+num+'m';
    addEscapeCode(esc_code, code, name);
    if(!common_escapes[esc_code]){
      common_escapes[esc_code] = {};
    }
    common_escapes[esc_code][code] = true;
  });
  addEscapeCode('\u001b[m', code, name);
  addEscapeCode('\u001b[0m', code, name);
});

each(common_escapes, function(styles, code){
  each(styles, function(o, style_a){
    each(styles, function(o, style_b){
      if(style_a !== style_b){
        addEscapeCode(style_a, style_b, code_to_style[style_b]);
      }
    });
  });
});

module.exports = function(str){
  var r = [];
  var curr = str;
  var curr_style = [];
  var code;
  var e;
  while(e = ansiRegEx().exec(curr)){
    if(e.index > 0){
      r.push({
        styles: curr_style.slice(0),
        text: curr.substr(0, e.index)
      });
    }
    code = e[0];
    if(escape_codes[code]){
      each(escape_codes[code], function(o, code){
        removeElm(curr_style, code);
      });
    }
    if(code_to_style[code]){
      curr_style.push(code_to_style[code]);
    }
    curr = curr.substr(e.index + e[0].length);
  }
  if(curr.length > 0){
    r.push({
      styles: curr_style,
      text: curr
    });
  }
  return r;
};
