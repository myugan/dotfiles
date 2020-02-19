/**
 * CoffeeParserTD.js
 *
 * The top-down CoffeeScript parser.
 */

var Parser = require('../Parser').Parser
, errorHandler = require('./CoffeeErrorHandler')
, MESSAGE_TYPES = require('../../constants/MessageTypes')
, TOKEN_TYPES = require('../../constants/TokenTypes')
, END_OF_FILE = TOKEN_TYPES.get("END_OF_FILE")
, ERROR = TOKEN_TYPES.get("ERROR")
, _ = require('lodash')
, parse
, getErrorCount
;

/**
 * Parse a CoffeeScript source program and generate the symbol table
 * and the intermediate code.
 */
parse = function () {
	var token = this.nextToken()
	, startTime = new Date().valueOf()
	;

	while (token.type !== END_OF_FILE) {
		if (token.type !== ERROR) {
			this.sendMessage({
				type: MESSAGE_TYPES.get("TOKEN")
				, arguments: [
					token.lineNum
					, token.position
					, token.type
					, token.text
					, token.value
				]
			});
		} else {
			errorHandler.flag(token, token.value, this);
		}
		token = this.nextToken();
	}

	elapsedTime = (new Date().valueOf() - startTime)/1000;
	this.sendMessage({
		type: MESSAGE_TYPES.get("PARSER_SUMMARY")
		, arguments: [
			token.lineNum
			, this.getErrorCount()
			, elapsedTime
		]
	});
};

/** 
 * Return the number of syntax errors found by the parser.
 * @return the error count.
 */
getErrorCount = function () {
	return 0;
};

/**
 * Constructor.
 * @param scanner the scanner to be used with this parser.
 */
exports.CoffeeParserTD = function (scanner) {
	return _.extend(new Parser(scanner), {
		parse: parse
		, getErrorCount: getErrorCount
	});
};
