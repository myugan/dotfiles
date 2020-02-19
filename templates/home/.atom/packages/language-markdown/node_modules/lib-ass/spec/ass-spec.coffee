path = require 'path'
ASS = require '../lib/ass'
fs = require 'fs'

ass = null
tests = 0

# Use
#
# jasmine-node --coffee spec/
#
# to execute the test.

describe "Agile Semantics Syntax", ->

  try
    absolutePath = path.join(__dirname, "test.ass")
    fileContents = fs.readFileSync(absolutePath, 'utf8')
    ass = new ASS(fileContents)
    tests = ass.getTests()
  catch error
    console.log error
    ass = null
    tests = 0

  it "loads the library", ->
    expect(ass).not.toEqual(null)

  it "has at least one thing to test", ->
    expect(tests.length).toBeGreaterThan(0)

  it "expects tokens of test-0 and test-1 to be equal", ->
    expect(tests[0].tokens).toEqual(tests[1].tokens)
