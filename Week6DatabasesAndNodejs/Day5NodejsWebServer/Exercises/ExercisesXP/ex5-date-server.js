// Exercise 5: a server that uses my own module (dateUtils.js)
import http from "node:http";
import { formatNow, daysUntil } from "./dateUtils.js";

const PORT = Number(process.env.PORT) || 3004;

const server = http.createServer((req, res) => {
  const body = [
    `Now: ${formatNow()}`,
    `Days until New Year: ${daysUntil(1, 1)}`,
    `Days until 1 April: ${daysUntil(4, 1)}`,
  ].join("\n");

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body + "\n");
});

server.listen(PORT, () => console.log(`Exercise 5 on http://localhost:${PORT}`));
