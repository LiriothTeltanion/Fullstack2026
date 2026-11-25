// Exercise 1: read information about the computer with the built-in os module
import os from "node:os";

const toGB = bytes => (bytes / 1024 ** 3).toFixed(1);
const uptimeHours = (os.uptime() / 3600).toFixed(1);

console.log("Platform:   ", os.platform(), os.arch());
console.log("CPU cores:  ", os.cpus().length);
console.log("Memory:     ", `${toGB(os.freemem())} GB free of ${toGB(os.totalmem())} GB`);
console.log("Uptime:     ", `${uptimeHours} hours`);
console.log("Node.js:    ", process.version);
console.log("Line ending:", JSON.stringify(os.EOL)); // "\r\n" on Windows, "\n" elsewhere
