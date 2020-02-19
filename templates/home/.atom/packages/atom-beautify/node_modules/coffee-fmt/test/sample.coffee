
###
	SkinnyMochaHalfCaffScript Compiler v1.0
	Released under the MIT License
###### An inline block comment ###

### A different inline block comment ###
# Assignment:
number   = 42
opposite = true

# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Arrays:
list = [1, 2, 3, 4, 5]

# Objects:
math =
  root:   Math.sqrt
  square: square
  cube:   (x) -> x * square x

# Splats:
race = (winner, runners...) ->
  print winner, runners

# Existence:
alert "I knew it!" if elvis?

# Array comprehensions:
cubes = (math.cube num for num in list)

# Strings:
"I knew it!"
"I \"knew\" it!"
"I \\\"knew\\\" it!"
"I \\"knew\" it!"

"A multi-\
line \
string."
"A broken
multi-line string."

html =		"""
		<strong>
			cup of coffeescript
		</strong>
		"""
#       <strong>
#         cup of coffeescript
#       </strong>
#       """

foo = ''' bar ''';

 detail = """See issue https://github.com/Glavin001/atom-beautify/issues/308

                               To stop seeing this message:
                               - Uncheck (disable) the deprecated \"Beautify On Save\" option
                               To enable Beautify on Save for a particular language:
                               - Go to Atom Beautify's package settings
                               - Find option for \"Language Config - <Your Language> - Beautify On Save\"
                               - Check (enable) Beautify On Save option for that particular language
                               """
