
var test    = require('tape').test
  , msgpack = require('../')
  , base = 100000

function build(size, value) {
  var map = {}
    , i

  for(i = 0; i < size; i++) {
    map[i + base] = value
  }

  return map
}

function computeLength(mapLength) {
  var length    = 3 // the header
    , multi     = ('' + base).length + 1 + 1 // we have <base + 1> bytes for each key, plus 1 byte for the value

  length += mapLength * multi

  return length
}

test('encode/decode maps up to 15 elements', function(t) {

  var encoder = msgpack()

  function doTest(length) {
    var map = build(length, 42)
      , buf = encoder.encode(map)

    t.test('encoding a map with ' + length + ' elements of ' + map[base], function(t) {
      // the map is full of 1-byte integers
      t.equal(buf.length, computeLength(length), 'must have the right length');
      t.equal(buf.readUInt8(0), 0xde, 'must have the proper header');
      t.equal(buf.readUInt16BE(1), length, 'must include the map length');
      t.end()
    })

    t.test('mirror test for a map of length ' + length + ' with ' + map[base], function(t) {
      t.deepEqual(encoder.decode(buf), map, 'must stay the same');
      t.end()
    })
  }

  doTest(Math.pow(2, 8))
  doTest(Math.pow(2, 8) + 1)
  doTest(Math.pow(2, 12) + 1)
  // too slow
  // doTest(Math.pow(2, 16) - 1)

  t.end()
})
