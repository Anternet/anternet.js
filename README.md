# anternet.js

[![build](https://img.shields.io/travis/Anternet/anternet.js.svg?branch=master)](https://travis-ci.org/Anternet/anternet.js)
[![npm](https://img.shields.io/npm/v/anternet.svg)](https://npmjs.org/package/anternet)
[![Join the chat at https://gitter.im/Anternet/anternet.js](https://badges.gitter.im/Anternet/anternet.js.svg)](https://gitter.im/Anternet/anternet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/l/anternet.svg)](LICENSE)


[Anternet](https://npmjs.org/package/anternet) is a framework of libraries based on UDP protocol for peer-to-peer communications.
 

## Libraries

* [shared-vars.js](https://github.com/Anternet/shared-vars.js) - Share variables between two or more endpoints

**More libraries is on the way..**

## Example

```js
const Anternet = require('anternet');
const msgType = 1; // can be any positive number

  
// peer 1
const anternet1 = new Anternet();
anternet1.bind(12345);

anternet1.on(msgType, (rid, args, rinfo) => {
  anternet1.response(rid, args.reverse(), rinfo.port, rinfo.address);
});

// peer 2
const anternet2 = new Anternet();
anternet2.request(msgType, ['foo', 'bar'], 12345, '127.0.0.1', (err, args, rinfo) => {
  console.log(args); // [ "bar", "foo" ]
});
```

## License

[MIT License](LICENSE).
Copyright &copy; 2016 [Moshe Simantov](https://github.com/moshest)



