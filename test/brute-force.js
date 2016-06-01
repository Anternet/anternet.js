const assert = require('assert');
const Anternet = require('../');
const { describe, it } = global;

describe('Brute force', () => {
  it('should run readme example', (done) => {
    const address = '127.0.0.1';
    const port = 12345;
    const testArgs = ['foo', 'bar'];

    const msgType = 1;

    // peer 1
    const anternet1 = Anternet.create();
    anternet1.bind(port);

    anternet1.on(msgType, (rid, args, rinfo) => {
      assert.deepEqual(args, testArgs);
      anternet1.response(rid, args.reverse(), rinfo.port, rinfo.address);
    });

    // peer 2
    const anternet2 = Anternet.create();
    anternet2.request(msgType, testArgs, port, address, (err, args, rinfo) => {
      if (err) return done(err);

      assert.deepEqual(args, ['bar', 'foo']);
      assert.equal(rinfo.address, address);
      assert.equal(rinfo.port, port);

      done();
    });
  });
});
