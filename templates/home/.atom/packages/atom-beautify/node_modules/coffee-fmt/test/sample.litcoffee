# Coffee-Formatter

## Introduction

CoffeeFormatter (abbreviated as CF) is a, guess what, formatter for CoffeeScript.  Let me know if you were actually expecting otherwise lol.

The code is written in Literate CoffeeScript.  Checkout Wikipedia for what "Literate Programming" means.

## Code

### Dependencies ###


CF relies on the following packages:

* `lazy` for reading files line by line.  An example is given [here](http://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js).
* `fs` for file io.
* `optimist` for command line parsing.

Code:

    Lazy = require 'lazy'
    fs = require 'fs'

By default, we use a tab width of 2 and use spaces exclusively.  This is the style most widely used in the community.  For a detailed guide of CoffeeScript style, check out [this](https://github.com/polarmobile/coffeescript-style-guide).

    argv = (require 'optimist')
      .default('tab-width', 2)
      .default('use-space', true)
      .argv

## Constants

We define a set of constants, including:

Two-space operators.  These operators should have one space both before and after.

    TWO_SPACE_OPERATORS = ['?=', '=', '+=', '-=', '==', '<=', '>=', '!',
                        '>', '<', '+', '-', '*', '/', '%']

One-space operators.  They should have one space after.

    ONE_SPACE_OPERATORS = [':', '?', ')', '}', ',']


## Helper Functions

Given a line and an index, the function determines whether or not the index is inside of a CoffeeScript string or part of a CoffeeScript comment.

    inStringOrComment = (index, line) ->
      for c, i in line
        if c == '#' and i <= index
          return true
        if c == "'" or c == '"'
          subLine = line.substr (i + 1)
          for cc, ii in subLine
            if cc == c
              if i <= index <= (ii + i + 1)
                return true
              else
                return inStringOrComment (index - (ii + 1)), (line.substr (ii + 1))
        # Match regex
        if c == "/"
          subLine = line.substr (i + 1)
          for cc, ii in subLine
            if cc == " "
              continue
            if cc == c
              if i <= index <= (ii + i + 1)
                return true
              else
                return inStringOrComment (index - (ii + 1)), (line.substr (ii + 1))

      return false

The negation:

    notInStringOrComment = (index, line) ->
      return not inStringOrComment(index, line)

`getExtension()` returns the extension of a filename, excluding the dot.

    getExtension = (filename) ->
      i = filename.lastIndexOf '.'
      return if i < 0 then '' else filename.substr (i+1)

This function makes sure that there is one and only one space before and after the operators defined in `TWO_SPACE_OPERATORS`.  Before it inserts spaces, however, it makes sure that the operator in question is not part of a string.

The idea behind this implementation is that, we can firstly add one space both before and after the operator, and then use `shortenSpaces` (described later) to get rid of any additional spaces.

The boolean logic is much more complex than I would like.  It should be refactored at some point.

    formatTwoSpaceOperator = (line) ->
      for operator in TWO_SPACE_OPERATORS
        newLine = ''
        skipNext = false
        for c, i in line
          # Test if the operator is at i
          if (line.substr(i).indexOf(operator) == 0) and (notInStringOrComment i, line) and
          (not ((operator.length == 1) and
          ((line[i + 1] in TWO_SPACE_OPERATORS) or
          (line[i-1] in TWO_SPACE_OPERATORS))))
            newLine += " #{operator} " # Insert a space before and after
            skipNext = true if operator.length == 2
          else
            unless skipNext
              newLine += c
            skipNext = false

        line = shortenSpaces newLine

      return line

This method shortens consecutive spaces into one single space.

    formatOneSpaceOperator = (line) ->
      for operator in ONE_SPACE_OPERATORS
        newLine = ''
        for c, i in line
          thisCharAndNextOne = line.substr(i, 2)
          if (line.substr(i).indexOf(operator) == 0) and
          (notInStringOrComment i, line) and

One exception has to be accounted for, which is expression of the form `Object::property`

          (line.substr(i).indexOf('::') != 0) and
          (line.substr(i-1).indexOf('::') != 0) and

Another exception: `if (options = arguments[i])?`

          (line.substr(i+1).indexOf('?') != 0) and

And also `),` `).` `)[` and `))` shouldnt be separated by space:

          (thisCharAndNextOne isnt "),") and
          (thisCharAndNextOne isnt ")(") and
          (thisCharAndNextOne isnt ").") and
          (thisCharAndNextOne isnt ")[") and
          (thisCharAndNextOne isnt "))")
            newLine += "#{operator} " # Insert a space after
          else
            newLine += c

        line = shortenSpaces newLine

      return line

Note that the function should not shorten indentations.

    shortenSpaces = (line) ->
      trimTrailing = (str) ->
        str.replace /\s\s*$/, ""

      prevChar = null
      newLine = ''

      for c, i in line
        if c == ' '
          newLine += c
        else
          line = line.substring(i)
          break

      for c, i in line
        unless notInStringOrComment(i, line) and (c == ' ' == prevChar)
          newLine = newLine + c
        prevChar = c

      return trimTrailing newLine

## Body

The body of this module does the following:

1. Parse command line.
2. Read the files specified by the user.
3. Perform formatting.

We loop through `argv._`, which should be a list of filenames given by the user.

    for filename in argv._

Then we check if the extension is "coffee".  Literate CoffeeScript will also be supported at some point.

      if (getExtension filename) isnt 'coffee'
        console.log "#{filename} doesn't appear to be a CoffeeScript file. Skipping..."
        console.log "Use --force to format it anyway."

If the extension is "coffee", we proceed to the actual formatting.

Firstly, we read the file line by line:

      else
        file = ''

        lazy = new Lazy(fs.createReadStream filename, encoding: 'utf8')

        lazy.on 'end', ->
          fs.writeFileSync filename, file

        lazy.lines
          .forEach (line) ->
            line = String(line)

For some weird reason regarding IO, empty line is read as '0'. Therefore I have to check against 0.  This may cause weird bugs if a line actually contains only '0'.

            if line != '0'
              newLine = line

`newLine` is used to hold a processed line.  `file` is used to hold the processed file.

Now we add spaces before and after a binary operator, using the helper function:

              newLine = formatTwoSpaceOperator newLine

Do the same for single-space operators:

              newLine = formatOneSpaceOperator newLine

Shorten any consecutive spaces into a single space:

              newLine = shortenSpaces newLine

              file += newLine + '\n'
            else
              file += '\n'

After the `forEach` completes, we have a file that is formatted line by line.  However, a comprehensive formatter needs to consider the code in a block level.  Specifically:

* Indentation should be formatted according to the parameters specified by the user.

This haven't been implemented yet.

## Exports

### Test only

The following exports are for testing only and should be commented out in production:

    exports.shortenSpaces = shortenSpaces
    exports.formatTwoSpaceOperator = formatTwoSpaceOperator
    exports.notInStringOrComment = notInStringOrComment
    exports.formatOneSpaceOperator = formatOneSpaceOperator
