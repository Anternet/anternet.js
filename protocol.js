const EventEmitter = require('events');
const dgram = require('dgram');
const Parser = require('./lib/parser');
const RidMap = require('./lib/rid-map');


const RID_MAX = 0xffff;
const RID_TIMEOUT = 10e3;

class Protocol extends EventEmitter {

  constructor(opts = {}) {
    super();

    this.rids = new RidMap(RID_MAX);
    this.parser = opts.parser || new Parser();
  }


  /** protocol methods **/

  send(msgType, rid, args, port, address, callback) {
    if (this.socket === undefined) this.bind();

    let data = [msgType, rid];
    if (args) data = data.concat(args);

    const buf = this.encode(data);
    this.socket.send(buf, 0, buf.length, port, address, callback);

    return this;
  }

  request(msgType, args, port, address, callback) {
    if (msgType <= 0) throw new Error('Error code must be positive');

    const rid = this.rids.add({
      port,
      address,
      callback,
      timeout: setTimeout(() => {
        delete this.rids.delete(rid);

        callback(new Error('TIMEOUT'));
      }, RID_TIMEOUT),
    });

    this.send(msgType, rid, args, port, address);
  }

  response(rid, args, port, address, callback) {
    return this.send(0, rid, args, port, address, callback);
  }

  error(errCode, rid, msg, port, address, callback) {
    if (errCode >= 0) throw new Error('Error code must be no-positive');
    return this.send(errCode, rid, msg, port, address, callback);
  }


  /** socket methods **/

  bind(...args) {
    if (!(args[0] instanceof dgram.Socket)) {
      const socket = dgram.createSocket('udp4');

      this.bindSocket(socket);
      socket.bind.apply(socket, args);
    } else {
      this.bindSocket.bind(this, args);
    }
  }

  bindSocket(socket, callback) {
    if (callback) this.once('listening', callback);

    socket.on('close', () => {
      this.socket = null;
      this.emit('close');
    });

    socket.on('error', (err) => {
      if (!this.emit('error', err)) throw err;

      this.socket = null;
    });

    socket.on('listening', () => {
      this.emit('listening');
    });

    socket.on('message', (buf, rinfo) => {
      let data;

      try {
        data = this.decode(buf);
      } catch (err) {
        return;
      }

      this.emit('message', data, rinfo);
      this.handleMessage(data, rinfo);
    });

    this.socket = socket;
  }

  address() {
    return this.socket.address();
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }


  /** parser methods **/

  decode(...args) {
    return this.parser.decode.apply(this.parser, args);
  }

  encode(...args) {
    return this.parser.encode.apply(this.parser, args);
  }

  register(...args) {
    return this.parser.register.apply(this.parser, args);
  }


  /** messages methods **/

  handleMessage(data, rinfo) {
    if (!Array.isArray(data) || data.length < 2) return;

    const type = data.shift();
    const rid = data.shift();
    if (typeof type !== 'number' || typeof rid !== 'number') return;

    if (type > 0) {
      if (this.emit(type, rid, data, rinfo)) return;

      this.error(this.constructor.Errors.UNKNOWN_REQUEST, rid, 'Unknown Request', rinfo.port, rinfo.address);
      return;
    }

    const obj = this.rids.get(rid);
    if (!obj || obj.port !== rinfo.port || obj.address !== rinfo.address) return;

    if (type === 0) {
      if (obj.callback(null, data, rinfo) === true) return;
    } else if (type < 0) {
      const err = new Error(data.shift() || (`Error Code: ${type}`));
      err.code = type;

      obj.callback(err, data, rinfo);
    }

    clearTimeout(obj.timeout);
    delete this.rids.delete(rid);
  }
}

module.exports = Protocol;

Protocol.Errors = {
  GENERAL: -1,
  UNKNOWN_REQUEST: -4,
  BAD_PARAM: -5,
  NOT_FOUND: -6,
};

Protocol.Parser = Parser;
