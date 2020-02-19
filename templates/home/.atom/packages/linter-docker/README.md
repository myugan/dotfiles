linter-docker
=========================

This plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to [dockerlint](https://github.com/RedCoolBeans/dockerlint).

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### Plugin installation
```
$ apm install linter-docker
```

### Development
If you are developing this plugin, it's easy to load using `apm link`

First make sure you don't have linter-docker installed.
```bash
apm uninstall linter-docker
```

Clone this repository and then from the linter-docker directory:
```bash
npm install
apm link
```

You can reload Atom with `ctrl+opt+cmd+l` and to open the inspector `opt+cmd+i`.

To put it all back:
```bash
apm unlink
apm install linter-docker
```

### Testing and Linting
Use `npm run test` to execute the tests.

Use `npm run lint` to lint the project.

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. Welcome to the club

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass ESLint linter.
- Vertical whitespace helps readability, don’t be afraid to use it.

Thank you for helping out!

## Donation
[![Share the love!](https://chewbacco-stuff.s3.amazonaws.com/donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8)
