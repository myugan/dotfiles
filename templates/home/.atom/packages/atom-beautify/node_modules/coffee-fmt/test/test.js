	var fmt = require('./Coffeescript')
	, fs = require('fs')
	, coffee
	, options
	;

	options = {
		tab: '\t',
		newLine: '\n'
	};

	coffee = fs.readFileSync('sample.litcoffee');
	coffee = coffee.toString();

	try {
	coffee = fmt.format(coffee, options);
	} catch (e) {
		console.log("it failed");
	}

	console.log(coffee);
