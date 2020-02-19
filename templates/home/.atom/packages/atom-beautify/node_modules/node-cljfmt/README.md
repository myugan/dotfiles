# node-cljfmt

A small cli utility that runs https://github.com/weavejester/cljfmt on a file.

## Installation

```
npm install -g node-cljfmt`
```

## Usage

```
cljfmt <filename>
cljfmt --edn=<options.edn> <filename>
```

options.edn is an optional file containing a map of cljfmt options as laid out here: https://github.com/weavejester/cljfmt#configuration

## Developing

You can build the exectuable `bin/cljfmt` with the following:

```
# lein cljsbuild once release
# chmod +x bin/cljfmt
```
