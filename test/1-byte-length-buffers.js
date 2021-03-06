
var test    = require('tape').test
  , msgpack = require('../')

function build(size) {
  var buf

  buf = new Buffer(size)
  buf.fill('a')

  return buf
}

test('encode/decode 2^8-1 bytes buffers', function(t) {

  var encoder = msgpack()
    , all     = []

  all.push(build(Math.pow(2, 8) - 1))
  all.push(build(Math.pow(2, 6) + 1))
  all.push(build(1))
  all.push(new Buffer(0))

  all.forEach(function(orig) {
    t.test('encoding a buffer of length ' + orig.length, function(t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 2 + orig.length, 'must have the right length');
      t.equal(buf.readUInt8(0), 0xc4, 'must have the proper header');
      t.equal(buf.readUInt8(1), orig.length, 'must include the buf length');
      t.equal(buf.toString('utf8', 2), orig.toString('utf8'), 'must decode correctly');
      t.end()
    })

    t.test('decoding a buffer of length ' + orig.length, function(t) {
      var buf = new Buffer(2 + orig.length)
      buf[0] = 0xc4
      buf[1] = orig.length
      orig.copy(buf, 2)
      t.equal(encoder.decode(buf).toString('utf8'), orig.toString('utf8'), 'must decode correctly');
      t.end()
    })

    t.test('mirror test a buffer of length ' + orig.length, function(t) {
      t.equal(encoder.decode(encoder.encode(orig)).toString(), orig.toString(), 'must stay the same');
      t.end()
    })
  })

  t.end()
})
