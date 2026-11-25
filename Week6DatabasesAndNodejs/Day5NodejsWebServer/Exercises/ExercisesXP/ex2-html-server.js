// Exercise 2: send HTML; the Content-Type header tells the browser to render it
import http from "node:http";

const PORT = Number(process.env.PORT) || 3001;

const page = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Exercise 2</title></head>
  <body style="font-family: system-ui; text-align: center">
    <h1>Hi there at the frontend</h1>
    <p>This page was built as a string inside <code>ex2-html-server.js</code>.</p>
  </body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page);
});

server.listen(PORT, () => console.log(`Exercise 2 on http://localhost:${PORT}`));
