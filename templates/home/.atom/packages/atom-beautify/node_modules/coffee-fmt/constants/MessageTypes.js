var Immutable = require('immutable')
;

module.exports = Immutable.Map({
	"SOURCE_EOF": __filename + ":source_eof"
	, "SOURCE_LINE": __filename + ":source_line"
	, "SYNTAX_ERROR": __filename + ":syntax_error"
	, "PARSER_SUMMARY": __filename + ":parser_summary"
	, "INTERPRETER_SUMMARY": __filename + ":interpreter_summary"
	, "COMPILER_SUMMARY": __filename + ":compiler_summary"
	, "TOKEN": __filename + ":token"
});
