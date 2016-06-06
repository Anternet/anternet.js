const MsgPack = require('msgpack5');

class Parser extends MsgPack {

  constructor(opts) {
    super(opts);

    this.registerTypes = new Map();
  }

  register(type, constructor, encode, decode) {
    if (this.registerTypes.has(type)) return this;

    this.registerTypes.set(type, constructor);
    super.register(type, constructor, encode, decode);

    return this;
  }

}
module.exports = Parser;
