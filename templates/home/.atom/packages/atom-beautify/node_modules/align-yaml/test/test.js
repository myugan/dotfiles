var expect = require('chai').expect;
var align = require('../');

var actual = [
  'one: two',
  'three: four',
  'seventeen: five'
].join('\n');


describe('when no length is passed as a second parameter', function () {
  it('should automatically align the output.', function () {

    var expected = [
      'one:       two',
      'three:     four',
      'seventeen: five'
    ].join('\n');

    expect(align(actual)).to.eql(expected);
  });
});

describe('when a length is explicitly passed as a second parameter', function () {
  it('should align using the given number.', function () {

    var expected = [
      'one:            two',
      'three:          four',
      'seventeen:      five'
    ].join('\n');

    expect(align(actual, 5)).to.eql(expected);
  });
});