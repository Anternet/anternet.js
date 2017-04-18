# anternet.js

[![Join the chat at https://gitter.im/Anternet/anternet.js](https://badges.gitter.im/Anternet/anternet.js.svg)](https://gitter.im/Anternet/anternet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![build](https://img.shields.io/travis/Anternet/anternet.js.svg?branch=master)](https://travis-ci.org/Anternet/anternet.js)
[![npm](https://img.shields.io/npm/v/anternet.svg)](https://npmjs.org/package/anternet)
[![Join the chat at https://gitter.im/Anternet/anternet.js](https://badges.gitter.im/Anternet/anternet.js.svg)](https://gitter.im/Anternet/anternet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/l/anternet.svg)](LICENSE)


[Anternet](https://npmjs.org/package/anternet) is a framework of libraries based on UDP protocol for peer-to-peer communications.
 

## Libraries

* [anternet-group](https://npmjs.org/package/anternet-group) - Join and get other peers based on a group id
* [anternet-channel](https://npmjs.org/package/anternet-channel) - Listening to broadcasts form other peers
* [anternet-broadcast](https://npmjs.org/package/anternet-broadcast) - Broadcast to other peers that listening on given channel 
* [anternet-peer](https://npmjs.org/package/anternet-peer) - Peer extension 
* [anternet-peers-set](https://npmjs.org/package/anternet-peers-set) - Storing and sharing set of peers
* [shared-vars](https://npmjs.org/package/shared-vars) - Share variables between two or more endpoints

**More libraries is on the way..**

## Example

```js
const Anternet = require('anternet');

const msgType = 1; // can be any positive number
const address = '127.0.0.1';
const port = 12345;

  
// peer 1
const anternet1 = new Anternet();
anternet1.bind(port);

anternet1.on(msgType, (rid, args, rinfo) => {
  anternet1.response(rid, args.reverse(), rinfo.port, rinfo.address);
});

// peer 2
const anternet2 = new Anternet();
anternet2.request(msgType, ['foo', 'bar'], port, address, (err, args, rinfo) => {
  console.log(args); // [ "bar", "foo" ]
});
```

## License

[MIT License](LICENSE).
Copyright &copy; 2016 [Moshe Simantov](https://github.com/moshest)



