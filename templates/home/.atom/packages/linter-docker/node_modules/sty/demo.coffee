sty = require './src/sty'

functionNames = (name for name of sty)
functionNames.sort()
for name in functionNames
  continue if name in ['disable', 'enable', 'parse'] or name.match /\d+/
  console.log sty[name] name