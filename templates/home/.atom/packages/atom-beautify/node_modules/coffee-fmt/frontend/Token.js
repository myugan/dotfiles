/**
 * Token.js
 * 
 * The framework class that represents a token returned by the scanner.
 */

var _ = require('lodash')
, CHAR = require('../constants/TokenTypes').get("CHAR")
, extract
, currentChar
, nextChar
, peekChar
;

/**
 * Default method to extract only one-character tokens from the source.
 * Subclasses can override this method to construct language-specific tokens.
 * After extracting the token, the current source line position will be one 
 * beyond the last token character.
 * @throws Error if an error occurred.
 */
extract = function () {
	this.text = "" + this.currentChar();
	this.value = null;
	this.nextChar();
};

/**
 * Call's the source's currentChar() method.
 * @return the current character from the source.
 * @throws Error if an error occurred.
 */
currentChar = function () {
	return this.source.currentChar();
};

/**
 * Call the source's nextChar() method.
 * @return the next character from the source after moving forward.
 * @throws Error if an error occurred.
 */
nextChar = function () {
	return this.source.nextChar();
};

/**
 * Call the source's peekChar() method.
 * @return the next character from the source without moving forward.
 * @throws Error if an error occurred.
 */
peekChar = function () {
	return this.source.peekChar();
};

/**
 * Constructor.
 * @param source the source from where to fetch the token's characters.
 * @throws Error if an error occurred
 */
exports.Token = function (source, subclass) {
	var t = _.extend({
		source: source
		, type: CHAR
		, text: undefined
		, value: undefined
		, lineNum: source.currentLineNum
		, position: source.currentPosition
		, extract: extract
		, currentChar: currentChar
		, nextChar: nextChar
		, peekChar: peekChar
	}, subclass || {})
	;

	return t.extract(), t;
};
