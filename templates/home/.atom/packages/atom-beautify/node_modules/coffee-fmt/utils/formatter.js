var WHITESPACE = require('../constants/TokenTypes').get("WHITESPACE")
, END_OF_LINE = require('../constants/TokenTypes').get("END_OF_LINE")
, BLOCK_STRING = require('../constants/TokenTypes').get("BLOCK_STRING")
, BLOCK_COMMENT = require('../constants/TokenTypes').get("BLOCK_COMMENT")
;
exports.fmt = function (tokenStream, options) {
	tokenStream = tokenStream.reverse();
	var indents = [];
	var isNewLine = true;
	var position = 0;
	var s = "";
	while (tokenStream.length) {
		var token = tokenStream.pop();
		if (isNewLine) {
			whitespaceCount = 0;
			while (token.type === WHITESPACE) {
				whitespaceCount++;
				token = tokenStream.pop();
			}
			if (token.type !== END_OF_LINE) {
				if (indents.length && whitespaceCount <= indents[indents.length - 1].whitespaceCount) {
					while(indents.length && indents[indents.length - 1].whitespaceCount >= whitespaceCount) {
						indents.pop();
					}
					indents.push({whitespaceCount: whitespaceCount});
				} else {
					indents.push({ whitespaceCount: whitespaceCount });
				}
				for (var i =0; i < indents.length - 1; i++) {
					s+= options.tab;
					position += options.tab.length;
				}
			}
			isNewLine = false;
		}
		if (token.type === BLOCK_STRING || token.type === BLOCK_COMMENT) {
			var S = token.value.split("\n");
			var lineBeginning = s.lastIndexOf("\n") + 1 || 0;
			var prefix = "";
			for (i = lineBeginning; i < s.length; ++i) {
				if (/\t/.exec(s.charAt(i))){
					prefix += "\t";
				} else {
					prefix += " ";
				}
			}
			if (S.length > 1) {
				for (i = 1; i < S.length; ++i) {
					S[i] = prefix + S[i];
				}
				S = S.join("\n");
				s += S;
				position += S.length;
			} else {
				s += S[0];
				position += S[0].length;
			}
		} else {
			/*
			 * Remove the extraneous inline whitespace...
			 */
			if (token.type === WHITESPACE) {
				while (tokenStream[tokenStream.length - 1].type === WHITESPACE) {
					tokenStream.pop();
				}
				s += " "; //Single space
				position += " ".length;
			}
			else {
				s += token.value || token.text;
				position += (token.value || token.text).length;
			}
		}
		if (token.type === END_OF_LINE) {
			isNewLine = true;
			position = 0;
		}
	}
	return s;
};
