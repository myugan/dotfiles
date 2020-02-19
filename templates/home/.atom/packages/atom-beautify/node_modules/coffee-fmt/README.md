# coffee-fmt


a `gofmt` inspired Coffeescript formatter/beautifier.


	npm install -g coffee-fmt

	coffee-fmt --indent_style [space|tab] \
		 --indent_size [Integer, ignored when using tabs] \
		 --debug=true (This will print all parse info to stdout as well, defaults to false)
		 -i filename.coffee >> transformed.coffee


###js api###

```javascript
	var fmt = require('coffee-fmt')
	, fs = require('fs')
	, coffee
	, options
	;

	options = {
		tab: '\t',
		newLine: '\n'
	};

	coffee = fs.readFileSync('filename.coffee');
	coffee = coffee.toString();

	try {
		coffee = fmt.format(coffee, options);
	} catch (e) {
		//Whoops...something went wrong, error details logged to console.
	}

	console.log(coffee);
```

