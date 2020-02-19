/**
 * Parser.js
 *
 * A language independent framework class.
 * This abstract parser class will be implemented by 
 * language-specific subclasses.
 */

var symTab = null
, EventEmitter = require('events').EventEmitter
, _ = require('lodash')
, parse
, getErrorCount
, currentToken
, nextToken
, sendMessage
;

/**
 * Parse a source program and generate the intermediate code and 
 * the symbol table.  To be implemented by a language specific 
 * parser subclass.
 * @throws Exception if error occurred.
 */
parse = function () {
};

/**
 * Return the number of syntax errors found by the parser.
 * To be implemented by a language specific parser-subclass.
 * @return the error count
 */
getErrorCount = function () {
};

/**
 * Call the scanner's currentToken() method.
 * @return the current token.
 */
currentToken = function () {
	return this.scanner.currentToken();
};

/**
 * Call the scanner's nextToken() method.
 * @return the next token.
 * @throws Exception if an error occurred.
 */
nextToken = function () {
	return this.scanner.nextToken();
};

/**
 * Send a message to listeners.
 * @param message the message to be sent.
 */
sendMessage = function (message) {
	this.emit('message', message);
};

/**
 * Constructor.
 * @param scanner the scanner to be used with this parser.
 */
exports.Parser = function (scanner) {
	var p = {
		scanner: scanner
		, icode: null
		, parse: parse
		, getErrorCount: getErrorCount
		, currentToken: currentToken
		, nextToken: nextToken
		, sendMessage: sendMessage
	}
	;
	return _.extend(p, EventEmitter.prototype);
};
