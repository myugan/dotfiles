#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
, fs = require('fs')
, coffeeScript = require('../Coffeescript')
, TAB = "\t"
, SPACE = " "
, LF = "\n"
, CR = "\r"
, LINEBREAK = {
	LF: LF
	, CR: CR
	, CRLF: CR + LF
	, LFCR: LF + CR
}
, options = {
	tab: argv.indent_style === "space" ? SPACE : TAB
	, newLine: LINEBREAK[argv.new_line] || LF
	, debug: argv.debug && argv.debug.toLowerCase() === 'true' ? true : false
}
, code
;

var help = "\nUsage: coffee-fmt --indent_style {space|tab} [options] -i path/to/script.coffee >> beautified.coffee \n\n\
    --indent_size N        Integer, number of spaces to use as indentation level. Ignored when using tabs. \n\
    --debug={true|false}   Boolean, it will print all parse info to stdout as well. Defaults to false.\n";

if (argv.help !== undefined || argv.indent_style === undefined || argv.i === undefined) {
	console.log(help);
	process.exit(argv.help !== undefined ? 0 : 1);
}

if (argv.indent_style.toLowerCase() === "space") {
	for (i = 1; i < argv.indent_size;  i+= 1) {
		options.tab += SPACE;
	}
}
options.operation = argv.x ? 'execute' : 'compile';
try {
	code = fs.readFileSync(argv.i);
	console.log(coffeeScript.format(code, options));
} catch (e) {
	console.log(e.stack);
	process.exit(1);
}
process.exit();
