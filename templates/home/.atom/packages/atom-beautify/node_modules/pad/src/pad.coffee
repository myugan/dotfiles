
module.exports = (string, size, char=' ') ->
  prefix = typeof string is 'number'
  if prefix
    [size, string] = [string, size]
  string = string.toString()
  pad = ''
  size = size - string.length
  for i in [0 ... size]
    pad += char
  if prefix
  then pad + string
  else string + pad
