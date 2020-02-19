/**
 * EofToken.js
 * 
 * The generic end-of-file token.
 */

var Token = require('./Token').Token
, _ = require('lodash')
, END_OF_FILE = require('../constants/TokenTypes').get("END_OF_FILE")
, extract
;

/**
 * Do nothing.  Do not consume any source characters.
 * @throws Error if an error occurred.
 */
extract = function () {
};

/**
 * Constructor.
 * @param source the source from where to fetch subsequent characters.
 * @throws Error if an error occurred.
 */
exports.EofToken = function (source) {
	return Token(source, {
		extract: extract
		, type: END_OF_FILE
	});
};
