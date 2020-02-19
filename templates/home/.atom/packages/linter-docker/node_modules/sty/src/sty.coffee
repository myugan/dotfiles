supported = (require 'tty').isatty process.stdout
exports.disable = -> supported = false
exports.enable = -> supported = true

codes =
  bold: 1
  underline: 4
  reverse: 7
  black: 30
  red: 31
  green: 32
  yellow: 33
  blue: 34
  magenta: 35
  cyan: 36
  white: 37

# Background colors:
for name, code of codes
  codes["bg#{name}"] = code + 10 if code >= 30 and code < 40

# Aliases:
codes.b = codes.bold
codes.u = codes.underline

# Allow code numbers as well
codes[num] = num for num in [0..109]

# ANSI string sequences
resetStr = "\x1B[0m"
codeStr = (code) ->
  if code instanceof Array
    (codeStr x for x in code).join ''
  else
    "\x1B[#{code}m"

# Regexes
resetRegex = /\x1B\[0m/g
codeRegex = /\x1B\[\d+m/g
tagRegex = /(<\w+>|<A\d+>)|(<\/\w+>|<A\d+>)/i
numRegex = /\d+/

styleStr = (str, code) ->
  str = ('' + str).replace resetRegex, "#{resetStr}#{codeStr code}" # allow nesting
  "#{codeStr code}#{str}#{resetStr}"

for name, code of codes then do (name, code) ->
  exports[name] = (str = '') -> if supported then styleStr str, code else str

exports.parse = (str = '') ->
  result = ''
  activeCodes = []
  
  while match = str.match tagRegex
    result += str[0...match.index]
    if match[1] # open tag
      tag = match[1][1...-1].toLowerCase()
      if tag.match numRegex then tag = tag[1..]
      if tag of codes
        result += resetStr if activeCodes and supported
        activeCodes.push codes[tag]
        result += codeStr activeCodes if supported
      else
        result += match[1]
    else        # close tag
      tag = match[2][2...-1].toLowerCase()
      if tag.match numRegex then tag = tag[1..]
      if tag of codes
        activeCodes.splice activeCodes.indexOf(codes[tag]), 1
        result += resetStr + codeStr activeCodes if supported
      else
        result += match[2]
    str = str[match.index + (match[1] or match[2]).length..]
  
  result += str + resetStr if activeCodes and supported
  result