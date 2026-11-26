import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const menu = {
  menu: {
    firstCourse: "Vegetable Soup",
    mainCourse: "Hamburger",
    dessert: "Fruit salad",
  },
};

function send(req, res, status, contentType, body) {
  // Headers describe the representation before end() completes the response.
  res.writeHead(status, {
    "Content-Type": `${contentType}; charset=utf-8`,
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
  });
  res.end(req.method === "HEAD" ? undefined : body);
}

/** A fresh native HTTP server; importing this module never opens a listener. */
export function createPracticeServer() {
  return http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return send(
        req,
        res,
        405,
        "application/json",
        JSON.stringify({ error: "Method not allowed" })
      );
    }
    let pathname;
    try {
      // A fixed base avoids trusting the incoming Host header when reading the path.
      pathname = new URL(req.url, "http://localhost").pathname;
    } catch {
      return send(
        req,
        res,
        400,
        "application/json",
        JSON.stringify({ error: "Invalid request path" })
      );
    }
    if (pathname === "/") {
      return send(
        req,
        res,
        200,
        "text/html",
        `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>My HTTP Server</title></head>
<body>
  <main>
    <h1>Welcome to My Server</h1>
    <p>A small server built with Node's HTTP module.</p>
    <nav aria-label="Server examples"><a href="/hello">Plain text</a> · <a href="/about">About</a> · <a href="/menu">JSON menu</a></nav>
  </main>
</body>
</html>`
      );
    }
    if (pathname === "/hello") {
      return send(req, res, 200, "text/plain", "Hello, this is your server!\n");
    }
    if (pathname === "/about") {
      return send(
        req,
        res,
        200,
        "text/html",
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>About</title></head><body><main><h1>About this server</h1><p>Each request path chooses a response.</p><a href="/">Home</a></main></body></html>'
      );
    }
    if (pathname === "/menu") {
      return send(req, res, 200, "application/json", JSON.stringify(menu));
    }
    return send(req, res, 404, "application/json", JSON.stringify({ error: "Page not found" }));
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const input = process.env.PORT ?? "3000";
  const port = Number(input);
  if (!/^\d+$/.test(input) || !Number.isInteger(port) || port < 0 || port > 65535) {
    throw new RangeError("PORT must be an integer from 0 to 65535");
  }
  const host = process.env.HOST ?? "127.0.0.1";
  const server = createPracticeServer();
  server.on("error", error => {
    console.error(`Could not start HTTP server: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log(`HTTP server ready at http://${host}:${server.address().port}`);
  });
}
