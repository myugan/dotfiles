const repeat = require('repeat-string');
const getLongest = require('longest');

module.exports = function(str, pad) {
  var props = str.match(/^\s*[\S]+:/gm);
  var longest = getLongest(props).length + (pad || 0);

  return str.split('\n').map(function(str) {
    var line = /^(\s*.+[^:#]: )\s*(.*)/gm;

    return str.replace(line, function(match, $1, $2) {
      var len = longest - $1.length + 1;
      return $1 + repeat(' ', len) + $2;
    });
  }).join('\n');
};