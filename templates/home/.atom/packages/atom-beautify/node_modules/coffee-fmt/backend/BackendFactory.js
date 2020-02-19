/**
 * BackendFactory.js
 *
 * A factory class that creates compiler and interpreter components.
 */
 
 var CodeGenerator = require('./CodeGenerator').CodeGenerator
, Executor = require('./Executor').Executor
, COMPILE = require('../frontend/Constants').get("COMPILE")
, EXECUTE = require('../frontend/Constants').get("EXECUTE")
;

/**
 * Create a compiler or interpreter back end component.
 * @param operation either "compile" or "execute"
 * @return a compiler or an interpreter back end component.
 * @throws Error if an error occurred.
 */
exports.createBackend = function (operation) {
	operation = operation || COMPILE;
	if (operation.toLowerCase() === COMPILE) {
		return new CodeGenerator();
	} 
	if (operation.toLowerCase() === EXECUTE) {
		return new Executor();
	}
	throw new Error("Backend factory: Invalid operation '" + operation + "'");
};
