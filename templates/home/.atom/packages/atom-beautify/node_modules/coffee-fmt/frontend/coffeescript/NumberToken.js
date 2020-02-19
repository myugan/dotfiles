/**
 * NumberToken.js
 * The Coffeescript number token.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, NUMBER = require('../../constants/TokenTypes').get("NUMBER")
, extract
, extractNumber
, extractBinaryNumber
, extractHexadecimalNumber
;

extractBinaryNumber = function () {
	var currentChar = this.currentChar()
	, s = ""
	;
	
	s += currentChar; // '0'
	s += this.nextChar(); // 'B' or 'b'
	currentChar = this.nextChar();
	while (/^0(?:b|B)[01]+$/.test(s + currentChar)) {
		s += currentChar;
		currentChar = this.nextChar();
	}
	if (s.toLowerCase() === "0b") {
		this.type = ERROR;
		this.value = "Missing binary digits after '0b'";
		return null;
	}

	return s;
};
extractHexadecimalNumber = function () {
	var currentChar = this.currentChar()
	, s = ""
	;
	s += currentChar; // '0'
	s += this.nextChar(); // 'X' or 'x'
	currentChar = this.nextChar();

	while(/^0(?:x|X)[0-9a-fA-F]+$/.test(s + currentChar)) {
		s += currentChar;
		currentChar = this.nextChar();
	}
	if (s.toLowerCase() === "0x") {
		this.type = ERROR;
		this.value = "Missing hex digits after '0x'";
		return null;
	}

	return s;
};
extractNumber = function () {
	var currentChar = this.currentChar()
	, s = ""
	;

	if (currentChar === '0' && /^[bBxX]/.test(this.peekChar())) {
		if (this.peekChar().toLowerCase() === 'b') {
			return this.extractBinaryNumber();
		} else {
			return this.extractHexadecimalNumber();
		}
	}
	while (/^\d+(?:\.\d+)?(?:(?:e|E)(?:\+|\-)?\d*)?$/.test(s + currentChar)) {
		s += currentChar;
		currentChar = this.nextChar();
		if (/^[\.]/.test(currentChar)) {
			if (/^\d/.test(this.peekChar())) {
				s += currentChar;
				currentChar = this.nextChar();
			}
		}
	}

	return s;
};
/**
 * Extract a Coffeescript number token from the source.
 * @throws Error if an error occurred.
 */
extract = function () {
	this.text = this.extractNumber();
	this.value = this.text || this.value;
};



exports.NumberToken = function (source) {
	return Token(source, {
		extract: extract
		, extractNumber: extractNumber
		, extractBinaryNumber: extractBinaryNumber
		, extractHexadecimalNumber: extractHexadecimalNumber 
		, type: NUMBER
	});
};
