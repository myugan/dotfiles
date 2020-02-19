/**
 * EolToken.js
 * 
 * The generic end-of-line token.
 */

var Token = require('./Token').Token
, _ = require('lodash')
, END_OF_LINE = require('../constants/TokenTypes').get("END_OF_LINE")
, extract
;

/**
 * Extract and consume this newline character.
 * @throws Error if an error occurred.
 */
extract = function () {
	this.text = this.currentChar();
	this.value = null;
	this.nextChar();
};

/**
 * Constructor
 * @param source the source from where to fetch subsequent characters
 * @throws Error if an error occurred.
 */
exports.EolToken = function (source) {
	return Token(source, {
		extract: extract
		, type: END_OF_LINE
	});
};
