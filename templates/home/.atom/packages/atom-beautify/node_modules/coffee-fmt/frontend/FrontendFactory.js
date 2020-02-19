/**
 * FrontendFactory.js
 *
 * A factory class that creates parsers for specific source languages.
 */
 
var TOP_DOWN = require('./Constants').get("TOP_DOWN")
, COFFEESCRIPT = require('./Constants').get("COFFEESCRIPT")
, CoffeeScanner = require('./coffeescript/CoffeeScanner').CoffeeScanner
, CoffeeParserTD = require('./coffeescript/CoffeeParserTD').CoffeeParserTD
;

/**
 * Create a parser.
 * @param language the name of the source language (e.g., "Coffeescript")
 * @param type the type of parser (e.g., "top-down").
 * @param source the source object
 * @return the parser.
 * @throws Error if an error occurred.
 */
 exports.createParser = function (language, type, source) {
	var scanner
	;
	if (language.toLowerCase() === COFFEESCRIPT &&
			type.toLowerCase() === TOP_DOWN) {
		scanner = new CoffeeScanner(source);
		return new CoffeeParserTD(scanner);
	} else if (language.toLowerCase() !== COFFEESCRIPT) {
		throw new Error("Parser factory: Invalid language '" + language + "'");
	} else {
		throw new Error("Parser factory: Invalid type '" + type + "'");
	}
};
