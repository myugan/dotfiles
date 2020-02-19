/**
 * StringToken.js
 *
 * A token that represents a Coffeescript string.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, STRING = require('../../constants/TokenTypes').get("STRING")
, BLOCK_STRING = require('../../constants/TokenTypes').get("BLOCK_STRING")
, EOL = require('../../constants').get("EOL")
, EOF = require('../../constants').get("EOF")
, extract
, extractString
;

extract = function () {
	var S
	, i
	;
	this.text = this.extractString();
	if (this.text && this.type === STRING) {
		this.value = this.text;
	}
	if (this.text && this.type === BLOCK_STRING) {
		S = this.text.split("\n");
		if (S.length === 1) {
			this.value = this.text;
		} else if (S.length > 1) {
			index = 1;
			leastWhitespace = -1;
			for (i = 1; i < S.length; ++i) {
				var leadingWs = 0;
				var j = 0;
				if (S[i].length === 0 || /^\s*$/.test(S[i])) {
					continue;
				}
				while (/\s/.test(S[i].charAt(j))) {
					leadingWs++;
					j++;
				}
				if (leastWhitespace === -1) {
					leastWhitespace = leadingWs;
					index = i;
				} else {
					if ( leadingWs < leastWhitespace) {
						leastWhitespace = leadingWs;
						index = i;
					}
				}
			}
			for (i = 1; i <S.length; ++i) {
				S[i] = S[i].slice(leastWhitespace);
			}
			this.value = S.join("\n");
		}
	}
};

extractString = function () {
	var currentChar = this.currentChar()
	, s = ""
	, S = []
	, escaped
	, wasEscaped
	, quote
	, nextChar
	;
	if (!(/(?:'|")/.test(currentChar))) {
		this.type = ERROR;
		this.value = null;
		return null;
	}
	quote = currentChar;
	S.push(quote);
	escaped = false;
	s += quote;
	currentChar = this.nextChar();
	while (currentChar !== quote || (currentChar === quote && escaped)) {
		wasEscaped = escaped;
		s += currentChar;
		if (escaped === true) {
			escaped = false;
		}
		if (currentChar === "\\" && !wasEscaped) {
			escaped = true;
		}
		if (currentChar === EOL) {
			this.nextChar(); // Move past the DUMMY_CHAR...
		}
		if (currentChar === EOF) {
			this.type = ERROR
			this.value = "Unterminated string literal."
			return null;
		}
		currentChar = this.nextChar();
	}
	S.pop();
	s += quote;
	this.quoteType = quote;
	nextChar = this.nextChar();
	if (s === quote + quote && nextChar === quote) {
		//it's a block comment.
		this.type = BLOCK_STRING;
		s = "";
		var r = '(?:.|\\n)*' + quote + '{3}$';
		r = new RegExp(r);
		currentChar = this.nextChar();
		while (!r.test(s)) {
			s += currentChar;
			if (currentChar === EOL) {
				this.nextChar();
			}
			if (currentChar === EOF) {
				this.type = ERROR
				this.value = "Unterminated string literal."
				return null;
			}
			currentChar = this.nextChar();
		}
		s = quote + quote + quote + s;
	}
	return s;
};

exports.StringToken = function (source) {
	return Token(source, {
		extract: extract
		, extractString: extractString
		, type: STRING
	});
};
