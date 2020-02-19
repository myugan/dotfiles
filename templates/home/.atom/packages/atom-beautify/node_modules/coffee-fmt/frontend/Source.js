var EOL = require('./Constants').get("EOL")
, EOF = require('./Constants').get("EOF")
, DUMMY_CHAR = require('./Constants').get("DUMMY_CHAR")
, SOURCE_LINE = require('../constants/MessageTypes').get("SOURCE_LINE")
, SOURCE_EOF = require('../constants/MessageTypes').get("SOURCE_EOF")
, EventEmitter = require('events').EventEmitter
, _ = require('lodash')
, currentChar
, nextChar
, peekChar
, readLine
;

/**
 * Return the source character at the current position.
 * @return the source character at the current position.
 * @throws Error if an error occurred.
 */
currentChar = function () {
	var currentPosition = this.currentPosition
	, currentLine = this.currentLine
	, isEndOfLine
	;

	if (currentPosition === -2) {
		this.readLine();
		return this.nextChar();
	} 
 
	if (currentLine == null) {
		return EOF;
	}

	isEndOfLine = currentPosition === -1 ||
		currentPosition === currentLine.length;

	if (isEndOfLine) {
		return EOL;
	}
	
	if (currentPosition === currentLine.length + 1) {
		return DUMMY_CHAR;
	}
	if (currentPosition > currentLine.length + 1) {
		this.readLine();
		return this.nextChar();
	}

	return currentLine.charAt(currentPosition);
};

/**
 * Consume the current source character and return the next character.
 * @return the next source character.
 * @throws Error if an error occurred.
 */
consumeChar = function () {
	this.currentPosition++;
};
nextChar = function () {
	return this.currentPosition++, this.currentChar();
};

/**
 * Return the source character following the current character without 
 * consuming the current character.
 * @return the following character.
 * @throws Error if an error occurred.
 */
peekChar = function () {
	var nextPosition
	;

	this.currentChar();
	if (this.currentLine === null) {
		return EOF;
	}
	nextPosition = this.currentPosition + 1;
	return nextPosition < this.currentLine.length ?
		this.currentLine.charAt(nextPosition) :
		EOL;
};

/**
 * Sends a message to listeners.
 * @params message the message to be sent to listeners
 */
sendMessage = function (message) {
	this.emit('message', message);
};

/**
 * Read the next source line.
 * @throws Error if an error occurred.
 */
readLine = function () {
	var outdex = this.index
	, buffer = this.buffer
	;
	
	if (outdex >= buffer.length) {
		this.currentLine = null;
		this.sendMessage({
			type: SOURCE_EOF
			, arguments: []
		});
		return;
	}
	while (buffer.charAt(outdex) !== EOL && outdex < buffer.length) {
		outdex += 1;
	}
	this.currentLine = buffer.slice(this.index, outdex);
	this.currentLineNum += 1;
	this.currentPosition = -1;
	this.sendMessage({
		type: SOURCE_LINE
		, arguments: [
			this.currentLineNum
			, this.currentLine
		]
	});
	this.index = outdex + 1;
};

/**
 * Constructor.
 * @param the reader for the source program.
 * @throws Error if an I/O error occurred.
 */
exports.Source = function (buffer) {
	buffer = buffer.toString();
	buffer = buffer.replace(/(?:\n\r|\r\n|\r|\n)/g, EOL);
	return _.extend({
		buffer: buffer
		, index: 0
		, currentPosition: -2
		, currentLine: null
		, currentLineNum: 0
		, currentChar: currentChar
		, nextChar: nextChar
		, peekChar: peekChar
		, readLine: readLine
		, sendMessage: sendMessage
	}, EventEmitter.prototype);
};
