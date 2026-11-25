// Exercise 1: the smallest web server, answering plain text to every request
import http from "node:http";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`Hello from my first Node.js server. You asked for ${req.url}\n`);
});

server.listen(PORT, () => console.log(`Exercise 1 on http://localhost:${PORT}`));
