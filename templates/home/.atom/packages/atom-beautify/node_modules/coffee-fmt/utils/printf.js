var sprintf = require('sprintf-js').sprintf
;

exports.printf = function () {
	var args = Array.prototype.slice.call(arguments)
	;

	return console.log(sprintf.apply(sprintf, args));
};
