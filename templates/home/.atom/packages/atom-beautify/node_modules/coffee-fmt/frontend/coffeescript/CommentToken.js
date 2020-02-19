/**
 * CommentToken.js
 *
 * A token that represents a Coffeescript comment line.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, COMMENT = require('../../constants/TokenTypes').get("COMMENT")
, BLOCK_COMMENT = require('../../constants/TokenTypes').get("BLOCK_COMMENT")
, EOL = require('../../constants').get("EOL")
, EOF = require('../../constants').get("EOF")
, extract
, extractComment
;

extract = function () {
	var S
	, i
	;
	this.text = this.extractComment();
	if (this.text && this.type === COMMENT) {
		this.value = this.text;
	}
	if (this.text && this.type === BLOCK_COMMENT) {
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

extractComment = function () {
	var currentChar = this.currentChar()
	, s = ""
	;
	if (!(/\#/.test(currentChar))) {
		this.type = ERROR;
		this.value = null;
		return null;
	}
	while (currentChar !== EOL && (!/\#{3}/.test(s))) {
		s += currentChar;
		currentChar = this.nextChar();
	}
	if (/\#{3}/.test(s)) {
		s = "";
		this.type = BLOCK_COMMENT;
		while (!/.*#{3}$/.test(s)) {
			s += currentChar;
			if (currentChar === EOL) {
				this.nextChar(); //Skip the DUMMY_CHAR
			}
			if (currentChar === EOF) {
				this.type = ERROR;
				this.value = "Unterminated block comment.";
				return null;
			}
			currentChar = this.nextChar();
		}
		s = "###" + s;
	}
	return s;
};
exports.CommentToken = function (source) {
	return Token(source, {
		extract: extract
		, extractComment: extractComment
		, type: COMMENT
	});
};
