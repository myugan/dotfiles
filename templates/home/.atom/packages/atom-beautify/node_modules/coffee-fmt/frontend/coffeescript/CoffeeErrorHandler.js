/**
 * CoffeeErrorHandler.js
 *
 * Error handler for Coffeescript syntax errors.
 */

var MESSAGES = require('../../constants/MessageTypes')
, MAX_ERRORS = 25
, TOO_MANY_ERRORS = "TOO_MANY_ERRORS"
;

exports.errorCount = 0;

/**
 * Flag an error in the source code.
 * @param token the bad token.
 * @param errorCode the errorCode.
 * @param parser the parser
 * @return the flagger string.
 */
exports.flag = function (token, errorCode, parser) {
	parser.sendMessage({
		type: MESSAGES.get("SYNTAX_ERROR")
		, arguments: [
			token.lineNum
			, token.position
			, token.text
			, errorCode.toString()
		]
	});
	if (++this.errorCount > MAX_ERRORS) {
		this.abortTranslation(TOO_MANY_ERRORS, parser);
	}
};

/**
 * Abort the translation.
 * @param errorCode the error code.
 * @param parser the parser.
 */
exports.abortTranslation = function (errorCode, parser) {
	parser.sendMessage({
		type: MESSAGES.get("SYNTAX_ERROR")
		, arguments: [
			0
			, 0
			, ""
			, "FATAL ERROR:  " + errorCode.toString()
		]
	});
};
