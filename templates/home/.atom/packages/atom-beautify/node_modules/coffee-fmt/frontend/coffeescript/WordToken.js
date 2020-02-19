var Token = require('../Token').Token
, IDENTIFIER = require('../../constants/TokenTypes').get("IDENTIFIER")
, RESERVED_WORD = require('../../constants/TokenTypes').get("RESERVED_WORD")
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, reservedWords = require('../../constants/ReservedWords')
, extract
;

extract = function () {
	var currentChar = this.currentChar()
	, s = ""
	;

	if (/^[\s\d/\!\#\%\^\&\*\(\)\-\+\=\{\}\|\[\]\\\:\"\;\'\,\.\/\<\>\?]/.test(currentChar)) {
		this.type = ERROR;
		this.value = null;
		return null;
	}
	while (/^[^\s/\!\#\%\^\&\*\(\)\-\+\=\{\}\|\[\]\\\:\"\;\'\,\.\/\<\>\?]/.test(currentChar)) {
		s += currentChar;
		currentChar = this.nextChar();
	}
	this.text = s;
	this.value = s;
};
exports.WordToken = function (source) {
	return Token(source, {
		extract: extract
		, type: IDENTIFIER
	});
};
