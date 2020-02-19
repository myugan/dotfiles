# lib-ass

Use **Agile Semantics Syntax** (ASS) to describe and parse any syntax or grammar in a convenient nested structure. `lib-ass` will convert your `.ass` files into a convenient `JSON`-object, and from there it is up to you.

 [language-markdown](https://atom.io/packages/language-markdown/), where `lib-ass` originated from, makes heave use of `ASS` to increase the speed and flexibility of writing automated tests.

---

## Introduction

Read up on [semantics](https://en.wikipedia.org/wiki/Semantics), and then let's look at a simple example.

```ass
"height: 188cm" {
  attribute {
    "height": key
    ": "
    "188cm": value
  }
}
```

We took the string `height: 188cm`, said it was an `attribute`, and then we split up the contents of the string, and described them into a `key` and a `value` part. We can even go a step further; the `value` consists of two separate semantic elements: an amount and a unit. Let's update our spec:

```ass
"height: 188cm" {
  attribute {
    "height": name
    ": "
    "188cm" {
      value {
        "188": amount
        "cm": unit
      }
    }
  }
}
```

I have swapped the output `"188cm": value` for a new _input_, described it as a `value` as we did before, but now, I've also specified an `amount` and a `unit`.

When `lib-ass` parses this information, it checks its validity, and then converts it to a json-object with every scope resolved on every token. I used two new terms there, `scope` and `token`. Let's look at the semantic structure of our first `ass-test` to see what I mean by them.

```
<input> {
  <scope-1> {
    <token-1>: <scope-2>
    <token-2>
    <token-3>: <scope-3>
  }
}
```

I'm not a native English speaker, but in this context, `scope` can be described as a _meaning_, and `token` can be described as a _thing_. So if we translate the pseudo-code above to a 'normal' sentence, we'd get something like:

> My `<input>` is a `<scope-1>` and consists of `<token-1>`, `<token-2>` and `<token-3>`. `<token-1>` is also a `<scope-2>`, and `<token-2>` is also a `<scope-3>`.

The most interesting thing about this is that `<token-3>` is part of `<scope-1>` AND `<scope-3>`; scope-3 is just more specific than scope-1. We can now describe our `<tokens>` (or output) in the following way:

- `<token-1>`: `<scope-1>` and `<scope-2>`
- `<token-2>`: `<scope-1>`
- `<token-3>`: `<scope-1>` and `<scope-3>`

And that is exactly what `lib-ass` creates from our input, but then in the form of `json`. Whatever you do with that data is up to you. Along with the main library, it is our intention to release several ready-to-go implementations of automated tests that can be run.

---

## Syntax

### File format

An `.ass` file is a plain-text file that can contain `tests`, `comments` and blank lines. Comments are lines that start with a `#` (with optional leading whitespace). Tests are defined below. It is good practice (though optional) to separate your tests with at least a single blank line.

### Test formats

The syntax used in an `.ass` file consists of only a few forms. You can technically infinitely nest and combine these forms.

There are two test formats: the single-line `<token-and-scope>` format, and the multi-line `<token-and-group>` format. Both of them can be preceded by an optional `<id>`.

#### `<token-and-scope>`

```
<id> (optional)
<token>: <scope>
```

#### `<token-and-group>`

```
<id> (optional)
<token> {
  <group>
}
```

To specify an input `<token>` that consists of multiple lines, you can concatenate `<token>`s by using the following syntax:

```
<token-1> +
<token-2> +
<token-3> {
  <group>
}
```

### Data formats

#### `<id>`

An id is a line that starts with a `@` and ends at the end of the line. Any character is (technically) allowed in an `<id>`.

#### `<group>`

A group is a series of objects, grouped together between curly braces. Each object starts on a new line. Indentation within a group is optional, though highly recommended.

The possible objects in a group are: `<token-and-scope>`, `<token-and-group>` and `<token>`. Blank lines and comments may also be part of a `<group>`.

A test with a single `<group>` could look like this:

```
<id> (optional)
<token> {
  <token-and-scope>
  <token>
  <token-and-scope>
  <token-and-group>
}
```

#### `<scope>`

A `<scope>` is a literal string, that depicts _meaning_.

#### `<token>`

A token is a string that starts and ends with either a single or a double quote, that depicts _content_.

---

## An advanced example

The following example describes a piece of `scss` code in `.ass` and the `.json` (just the first bit, I'm lazy) it is converted to. At first glance, the `ASS` looks verbose, and I will immediately admit that it is. But it is also as verbose as you decide to make it. The good thing however is that repeating patterns do not rely on their contexts, and thus can be easily copy-and-pasted. Also, as a personal preference, I've describes several parts more verbose than they need to be; as an example, but also because it helps readibility and eases the re-usability of sections.

```css
article {
  font: 12px/18px sans-serif;
  color: #000000;

  p:not(:last-child) {
    margin-bottom: 9px;
  }
}
```

```ass
@scss-example
"article {" +
"  font: 12px/18px sans-serif;" +
"  color: #000000;" +
"" +
"  p:not(:last-child) {" +
"    margin-bottom: 9px;" +
"  }" +
"}" {
  scss {
    "article" {
      selector {
        "article": html-tag
      }
    }
    " "
    "{": punctuation

    "font: 12px/18px sans-serif;" {
      declaration {
        "font": property
        ":": punctuation
        " "
        "12px" {
          value {
            size {
              "12": amount
              "px": unit
            }
          }
        }
        "/": punctuation
        "18px" {
          value {
            size {
              "18": amount
              "px": unit
            }
          }
        }
        " "
        "sans-serif": font-family
        ";": punctuation
      }
    }

    "color: #000000;" {
      declaration {
        "color": property
        ":": punctuation
        " "
        "#000000" {
          value {
            color {
              rgb {
                "#": punctuation
                "00": red
                "00": green
                "00": blue
              }
            }
          }
        }
        ";": punctuation
      }
    }

    # This is an empty line
    ""

    "p:not(:last-child)" {
      selector {
        "p": html-tag
        ":not(:last-child)" {
          pseudo-selector {
            ":": punctuation
            "not": name
            "(": punctuation
            ":last-child" {
              pseudo-value {
                ":": punctuation
                "last-child"
              }
            }
            ")": punctuation
          }
        }
      }
    }
    " "
    "{": punctuation

    "margin-bottom: 9px;" {
      declaration {
        "margin-bottom": property
        ":": punctuation
        " "
        "9px" {
          value {
            size {
              "9": amount
              "px": unit
            }
          }
        }
        ";": punctuation
      }
    }

    "}": punctuation
    "}": punctuation
  }
}
```

```json
{
  "id": "scss-example",
  "tokens": [
    {
      "value": "article",
      "scopes": ["scss", "selector", "html-tag"]
    },
    {
      "value": " ",
      "scopes": ["scss"]
    },
    {
      "value": "{",
      "scopes": ["scss", "punctuation"]
    },
    {
      "value": "font",
      "scopes": ["scss", "declaration", "property"]
    },
    {
      "value": ":",
      "scopes": ["scss", "declaration", "punctuation"]
    },
    {
      "value": " ",
      "scopes": ["scss", "declaration"]
    },
    {
      "value": "12",
      "scopes": ["scss", "declaration", "value", "size", "amount"]
    },
    {
      "value": "px",
      "scopes": ["scss", "declaration", "value", "size", "unit"]
    },
    {
      "value": "",
      "scopes": ["scss", "declaration", "punctuation"]
    },
    {
      "value": "18",
      "scopes": ["scss", "declaration", "value", "size", "amount"]
    },
    {
      "value": "px",
      "scopes": ["scss", "declaration", "value", "size", "unit"]
    }
  ]
}
```

etc.
