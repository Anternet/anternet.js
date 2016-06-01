const Protocol = require('./lib/protocol');
const Parser = require('./lib/parser');

// export classes
exports.Protocol = Protocol;
exports.Parser = Parser;

// helper functions
exports.create = opts => new Protocol(opts);
