# *nginx* config file formatter and beautifier
This module beautifies and formats Nginx configuration files like so:

* all lines are indented in uniform manner, with 4 spaces per level
* neighbouring empty lines are collapsed to at most two empty lines
* curly braces placement follows Java convention
* whitespaces are collapsed, except in comments an quotation marks

# Need to format quickly?
Use [vasilevich](https://github.com/vasilevich/) website: [nginxbeautifier.com](https://nginxbeautifier.com)

# Instructions
`npm install nginxbeautify`  

```js
const fs = require('fs');

let file = fs.readFileSync(__dirname + '/nginx.conf').toString();
let Beautify = require('nginxbeautify');
let instance = new Beautify({tabs: 1});

console.log(instance.parse(file));
```

# Options
```js

let Beautify = require('nginxbeautify');
let instance = new Beautify({
    spaces: 0,
    tabs: 0,
    dontJoinCurlyBracet: true
});
```

## Credits

[Michał Słomkowski](https://github.com/1connect) - Original code was ported from [their project](https://github.com/1connect/nginx-config-formatter)([nginxfmt.py](https://github.com/1connect/nginx-config-formatter/blob/master/nginxfmt.py)), and also used their [readme.md](https://github.com/1connect/nginx-config-formatter/blob/master/README.md) as a template. Some methods were rewritten or changed a bit, but most of the code follows their design.

[Yosef](https://github.com/vasilevich/) - Porter of the Python code to js: check out his
  awesome [nginxbeautifier](https://github.com/vasilevich/nginxbeautifier) from where this project was forked from.

[Denys Vitali](https://github.com/denysvitali/) - Creator of this module


## Notes:
I am keeping the same licenese format as the one that was given by the owner of the project the code was ported from: [Apache 2.0](https://github.com/vasilevich/nginxbeautifier/blob/master/LICENSE).
