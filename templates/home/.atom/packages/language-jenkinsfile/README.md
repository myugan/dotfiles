# Jenkinsfile language support in Atom

[![Build Status](https://travis-ci.org/BastienAr/language-jenkinsfile.svg?branch=master)](https://travis-ci.org/BastienAr/language-jenkinsfile)

[groovy-language](https://github.com/Jakehp/language-groovy) modifications to adds syntax highlighting and snippets to Jenkinsfile files in Atom.

Originally forked
from the [groovy-language](https://github.com/Jakehp/language-groovy).

Contributions are *greatly* appreciated. Please fork this repository, open a pull request to add snippets, make grammar tweaks, fix issues, etc.

## Installation

```shell
apm install language-jenkinsfile
```
If `apm` is not recognized, open Atom, open the Atom menu, and select "Install Shell Commands". Then try running the command again.

## Local Development

You can use `apm` to link the local copy and install the dependencies:

```shell
> apm dev language-jenkinsfile /path/to/your/cloned/fork
```

The package will appear in the *Development* section of Atom's packages. Re-open your window in Development Mode (*View->Developer->Open in Dev Mode*) and test your changes.
