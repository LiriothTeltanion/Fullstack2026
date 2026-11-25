// These tests exercise a local CLI. Reject outbound operations before they can
// reach a network in each CLI child command that explicitly preloads this file.
const rejectNetwork = () => {
  throw new Error("Network access is disabled in Notes CLI tests");
};
for (const module of [require("node:http"), require("node:https")]) {
  module.request = rejectNetwork;
  module.get = rejectNetwork;
}
const net = require("node:net");
net.connect = rejectNetwork;
net.createConnection = rejectNetwork;
net.Socket.prototype.connect = rejectNetwork;
require("node:tls").connect = rejectNetwork;
require("node:dgram").createSocket = rejectNetwork;
globalThis.fetch = rejectNetwork;
require("node:module").syncBuiltinESMExports();
