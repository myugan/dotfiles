/**
 * WhitespaceToken.js
 * 
 * The generic whitespace token.
 */

var Token = require('./Token').Token
, WHITESPACE = require('../constants/TokenTypes').get("WHITESPACE")
, extract
;

/**
 * Extract and consume this whitespace character.
 * @throws Error if an error occurred.
 */
extract = function () {
	this.text = this.currentChar();
	this.value = null;
	this.nextChar();
};

/**
 * Constructor
 * @param source the source from where to fetch subsequent characters.
 * @throws Error if an error occurred.
 */
exports.WhitespaceToken = function (source) {
	return Token(source, {
		extract: extract
		, type: WHITESPACE
	});
};
