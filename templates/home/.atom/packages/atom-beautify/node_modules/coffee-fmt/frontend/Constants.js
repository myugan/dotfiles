var Immutable = require('immutable')
;

module.exports = Immutable.Map({
	"EOL": "\n"
	, "TOP_DOWN": "top-down"
	, "COFFEESCRIPT": "coffeescript"
	, "COMPILE": "compile"
	, "EXECUTE": "execute"
	, "EOF": null
	, "DUMMY_CHAR": {}
	, "TYPE_EOF": "EOF"
	, "SOURCE_LINE": "SOURCE_LINE"
	, "SOURCE_LINE_FORMAT": "%03d %s"
	, "SYNTAX_ERROR": "SYNTAX_ERROR"
	, "PARSER_SUMMARY": "PARSER_SUMMARY"
	 , "PARSER_SUMMARY_FORMAT": "\n%20d source lines.\n%20d syntax errors.\n%20.2f seconds total parsing time.\n"
	, "INTERPRETER_SUMMARY": "INTERPRETER_SUMMARY"
	 , "INTERPRETER_SUMMARY_FORMAT": "\n%20d statements executed.\n%20d runtime errors.\n%20.2f seconds total execution time.\n"
	, "COMPILER_SUMMARY": "COMPILER_SUMMARY"
	 , "COMPILER_SUMMARY_FORMAT": "\n%20d instructions generated.\n%20.2f seconds total code generation time.\n"
	, "MISCELLANEOUS": "MISCELLANEOUS"
	, "TOKEN": "TOKEN"
	, "ASSIGN": "ASSIGN"
	, "FETCH": "FETCH"
	, "BREAKPOINT": "BREAKPOINT"
	, "RUNTIME_ERROR": "RUNTIME_ERROR"
	, "CALL": "CALL"
	, "RETURN": "RETURN"
});
