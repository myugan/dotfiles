var Token = require('../Token').Token
, SPECIAL_SYMBOL = require('../../constants/TokenTypes').get("SPECIAL_SYMBOL")
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, EOL = require('../../constants/TokenTypes').get("EOL")
, extract
;
extract = function () {
	this.text = this.extractOperator();
};

extractOperator = function () {
	var currentChar = this.currentChar()
	, s = ""
	;
	if (!(/^[\!\%\^\&\*\(\)\-\+\=\{\}\|\[\]\\\:\"\;\'\,\.\/\<\>\?]/.test(currentChar))) {
		console.log('error');
		this.type = ERROR;
		this.value = null;
		return null;
	}
	while ([
		'=='
		, '\\'
		, '('
		, ')'
		, '['
		, ']'
		, '{'
		, '}'
		, '~'
		, '!='
		, '!'
		, '&&'
		, '&'
		, '|'
		, '**'
		, '*'
		, '/'
		, '//'
		, '%'
		, '%%'
		, '+='
		, '-='
		, '*='
		, '/='
		, '%='
		, '**='
		, '%%='
		, '//='
		, '?'
		, '.'
		, '..'
		, ','
		, '...'
		, '?.'
		, '?='
		, '='
		, '++'
		, '--'
		, '+'
		, '-'
		, '<'
		, '>'
		, '<='
		, '>='
		, ':'
		, '::'
		, ';'
		, '->'
	].indexOf(s + currentChar) !== -1) {
		s += currentChar;
		currentChar = this.nextChar();
	}
	if (s === '..') {
		this.type = ERROR;
		this.value = null;
		return null;
	}
	this.value = s;
	return s;
};

exports.OperatorToken = function (source) {
	return Token(source, {
		extract: extract
		, extractOperator: extractOperator
		, type: "SPECIAL_SYMBOL"
	});
};
