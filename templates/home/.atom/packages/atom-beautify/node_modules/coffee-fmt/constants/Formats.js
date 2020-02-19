var Immutable = require('immutable')
;

module.exports = Immutable.Map({
	"SOURCE_LINE_FORMAT": "%03d %s"
	, "PARSER_SUMMARY_FORMAT": "\n%20d source lines.\n%20d syntax errors.\n%20.2f seconds total parsing time.\n"
	, "INTERPRETER_SUMMARY_FORMAT": "\n%20d statements executed.\n%20d runtime errors.\n%20.2f seconds total execution time.\n"
	, "COMPILER_SUMMARY_FORMAT": "\n%20d instructions generated.\n%20.2f seconds total code generation time.\n"
	, "TOKEN_FORMAT": ">>> %-15s line=%03d, pos=%2d, text=\"%s\""
	, "VALUE_FORMAT": ">>>                 value=%s"
});
