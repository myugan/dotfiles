ASStest = require './ass-test'

module.exports =
class ASS
  file: null
  lines: null
  tests: null

  constructor: (@rawData) ->
    @parseData()

  parseData: ->
    @splitDataIntoLines()
    @removeEmptyLinesAndComments()
    @splitLinesIntoTests()

  splitDataIntoLines: ->
    @lines = @rawData.split("\n")

  removeEmptyLinesAndComments: ->
    lines = []
    for line in @lines
      if line.length and (line[0] isnt "#")
        lines.push(line)
    @lines = lines

    # console.log "-----"
    # for line, l in @lines
    #   console.log "#{l}: #{line}"
    # console.log "-----"

  splitLinesIntoTests: ->
    @tests = []
    test = []
    for line in @lines

      # new @id found, add (previous) test if not empty
      if line[0] is '@' and test.length
        @addTest(test)
        test = []

      # add line to current test
      test.push(line)

      # Closing curly brace
      if line[0] is '}'
        @addTest(test)
        test = []

    # Add remains as a test too
    if test.length
      @addTest(test)

  addTest: (test) ->
    if test.length > 1
      @tests.push(new ASStest(@tests.length, test))

  getTests: ->
    @tests
