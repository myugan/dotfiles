module.exports =
class ASStest
  nr: null
  id: null
  lines: null
  input: null
  tokens: null
  currentScope: null
  isValid: false

  constructor: (@nr, @lines) ->
    @getID()
    # console.log "Test #{@nr}"
    # console.log "  id: #{@id}"
    @parseInput()
    @parseTokens()
    @isValid = true if @input.length and @tokens.length

  # set @id if specified as first-line
  getID: ->
    if (@lines[0][0] is '@')
      @id = @lines.shift().substring(1)
    else
      @id = 'test-'+(@nr + 1)

  # Lines that start with a single or double quote are considered input, and are concatenated.
  parseInput: ->
    while @lines.length and ((@lines[0][0] is '"') or (@lines[0][0] is "'"))
      input = @lines.shift().trim()
      lastCharacter = input[input.length - 1]
      if (lastCharacter is '+') or (lastCharacter is '{')

        # remove last character (either { or +), and trim whitespace
        input = input.substring(0, input.length - 1).trim()

        # remove encasing quotes
        input = input.substring(1, input.length - 1)

        # transform \n into proper new lines
        input = input.replace(/\\n/g, '\n')

        # insert a new line when concatenating multiple input lines
        # or turn input into a blank line
        if @input then @input += '\n' else @input = ""

        # concatenate
        @input += input

      # We have found a one-liner.Ignore any other (previous) lines of input, and create the token immediately
      else
        line = @parseLine(input)
        if line.type is 'input-and-scope'
          @input = line.input
          @tokens = []
          token =
            value: line.input
            scopes: [ line.scope ]
          @tokens.push(token)

    return

  parseLine: (input) ->
    input = input.trim()
    line =
      type: null
      input: null
      scope: null

    if input is '}'
      line.type = 'remove-scope'

    else if input[input.length - 1] is '{'
      line.type = 'add-scope'
      line.scope = input.substring(0, input.length - 1).trim()

      test = @parseLine(line.scope)
      if test.type is 'token'
        line.type = 'sub-test'
        line.input = test.input
        line.scope = null

    else if (input[0] is input[input.length - 1]) and (input[0] is "'" or input[0] is '"')
      line.type = 'token'
      line.input = input.substring(1, input.length - 1)

    else
      position = null
      for i in [input.length - 1 .. 0]
        if input[i] is ':'
          position = i
          break

      if position isnt null
        line.type = 'input-and-scope'
        line.scope = input.substring(position + 1).trim()
        line.input = input.substring(1, position - 1)
      else
        line = false

    return line

  parseTokens: ->
    if @tokens is null
      @tokens = []
      @currentScope = []
      for line in @lines
        line = @parseLine(line)

        if line.type is 'add-scope'
          @addScope(line.scope)

        if line.type is 'sub-test'
          @addScope(null)

        else if line.type is 'remove-scope'
          @removeScope()

        else if line.type is 'token'
          token =
            value: line.input
            scopes: @getScope()
          @tokens.push(token)

        else if line.type is 'input-and-scope'
          @addScope(line.scope)
          token =
            value: line.input
            scopes: @getScope()
          @removeScope()
          @tokens.push(token)

    # console.log "  tokens:"
    # for token, i in @tokens
    #   console.log "    #{i}: (#{token.value}) = #{token.scopes}"
    return

  addScope: (scope) ->
    @currentScope.push(scope)

  removeScope: ->
    removed = @currentScope.pop()

  getScope: ->
    # Remove empty scopes (created by sub-tests) from currentScope
    return @currentScope.filter (scope) ->
      return scope isnt null
