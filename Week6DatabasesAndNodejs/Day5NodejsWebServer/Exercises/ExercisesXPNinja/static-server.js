// Exercises XP Ninja: my own static file server
//  1. serves any file from public/ with the right Content-Type
//  2. refuses paths that try to leave public/ (../)
//  3. logs every request with its status and time, and sends X-Response-Time
//  4. limits each visitor to 20 requests per 10 seconds (429 Too Many Requests)
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 3020;
const PUBLIC_DIR = fileURLToPath(new URL("./public/", import.meta.url));

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

// Exercise 4: remember when each IP made its recent requests
const RATE_LIMIT = 20;
const WINDOW_MS = 10_000;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(time => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

// Exercise 2: turn the URL into a file path that must stay inside PUBLIC_DIR
function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const wanted = decoded.endsWith("/") ? decoded + "index.html" : decoded;
  const fullPath = path.join(PUBLIC_DIR, wanted);
  return fullPath.startsWith(PUBLIC_DIR) ? fullPath : null;
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "X-Response-Time": `${res.elapsed()} ms` });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const started = process.hrtime.bigint();
  res.elapsed = () => (Number(process.hrtime.bigint() - started) / 1e6).toFixed(1);

  // Exercise 3: log once the response has been sent
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} -> ${res.statusCode} (${res.elapsed()} ms)`);
  });

  if (isRateLimited(req.socket.remoteAddress)) {
    return send(res, 429, "Too many requests, wait a few seconds");
  }
  if (req.method !== "GET") {
    return send(res, 405, "Only GET is supported");
  }

  let filePath;
  try {
    filePath = resolveFile(req.url);
  } catch {
    return send(res, 400, "Bad URL"); // e.g. a broken %-escape
  }
  if (!filePath) return send(res, 403, "Forbidden");

  try {
    const content = await readFile(filePath);
    const type = MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream";
    send(res, 200, content, type);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      send(res, 404, `Not found: ${req.url}`);
    } else {
      send(res, 500, "Server error");
    }
  }
});

server.listen(PORT, () => console.log(`Static server on http://localhost:${PORT}`));
