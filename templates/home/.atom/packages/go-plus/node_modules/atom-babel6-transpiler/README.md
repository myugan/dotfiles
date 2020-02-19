# atom-babel6-transpiler

This project implements an [Atom package transpiler]() that transpiles your package's files with Babel 6.

## Usage

1. Install the package
2. Add an `atomTranspilers` entry to your `package.json`
3. Install Babel presets and plugins, and configure Babel as you wish

In detail:

**1.** First, install the package from the npm registry:

    npm install --save atom-babel6-transpiler

**2.** Next, modify your `package.json` to include a reference to the transpiler for any files you want Babel to process as described [in the Atom Flight Manual](). For example, to process every file ending in `.js` in your package, you could use:

```javascript
{
  ...
  "atomTranspilers": [
    {
      "glob": "**/*.js",
      "transpiler": "atom-babel6-transpiler"
    }
  ]
}
```

**3.** Finally, install Babel and all the presets and plugins you want to use as normal. For a simple example, if you wanted to use the ES2015 and React presets, you might run:

    npm install --save babel-preset-es2015 babel-preset-react

and then create a [`.babelrc` file](http://babeljs.io/docs/usage/babelrc/) to configure Babel to use them:

```json
{
  "presets": ["es2015", "react"]
}
```

You may also specify options in your `package.json` inside the optional `options` object; the subkey `babel`, if it exists, will be passed [as options to `babel.transform`](http://babeljs.io/docs/usage/api/#babeltransformcode-optionsdocsusageoptions). Note that if you don't want Babel to search up the directory hierarchy for a `.babelrc` file, you need to add the `"babelrc": false` option to the settings. Otherwise Babel may mistakenly use a user's `.babelrc` from elsewhere on the filesystem when trying to build your package.

```javascript
{
  // ...
  "atomTranspilers": [
    {
      "glob": "**/*.js",
      "transpiler": "atom-babel6-transpiler",
      "options": {
        "babel": {
          "presets": ["es2015", "react"],
          "babelrc": false
        }
      }
    }
  ]
}
```

### Options

You may specify the following options as values of the `options` object in your `package.json`:

|Option|Default|Description|
|--:|---|---|
|`setBabelEnv`|`false`, `true` or a string|Sets the `BABEL_ENV` environment variable. When `true`, sets it to `"development"` when `atom.inDevMode()` or `atom.inSpecMode()` is true and `"production"` otherwise. When given as a string, uses the value of the environment variable of that name instead. The feature returns `BABEL_ENV` to its prior value after transpilation finishes.|
|`babel`|`{}`|Options to pass as the second argument to `babel.transform` (the same options you can put in a `.babelrc`).|
|`cacheKeyFiles`|`[]`|An array of files to include when determining whether or not to use the cache. For example, to force a recompile anytime your `.babelrc` changes, add `.babelrc` to this array.|

## Other Details

### Source Maps

To enable source maps within Atom, set the Babel `sourceMaps` option to `"inline"` in your Babel configuration.

### Babel Environment

Babel supports [an option called `env`](https://babeljs.io/docs/usage/babelrc/#env-option) that allows you to configure Babel on a per-environment basis. The Babel environment is controlled via an environment variable called `BABEL_ENV`; this module automatically sets the environment variable to `"development"` if Atom is in dev mode (`atom.inDevMode()` returns `true`) and `"production"` otherwise.
