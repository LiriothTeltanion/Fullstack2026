import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createWeatherProxy } from "./weather-proxy.server.js";

const root = path.resolve(fileURLToPath(new URL("./dist/", import.meta.url)));
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};
export function createAppServer({
  proxy = createWeatherProxy({ apiKey: process.env.ACCUWEATHER_API_KEY }),
} = {}) {
  return http.createServer((request, response) => {
    Promise.resolve()
      .then(() =>
        proxy(request, response, async () => {
          if (request.method !== "GET" && request.method !== "HEAD")
            return response.writeHead(405).end();
          let pathname;
          try {
            pathname = new URL(request.url, "http://localhost").pathname;
          } catch {
            return response.writeHead(400).end("The request URL is invalid.");
          }
          // Serve only the built client. Source, environment and server files stay private.
          const relative =
            pathname === "/" || pathname === "/favorites" ? "index.html" : pathname.slice(1);
          const file = path.resolve(root, relative);
          if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html"))
            return response.writeHead(404).end();
          try {
            const content = await readFile(file);
            response.writeHead(200, {
              "Content-Type": types[path.extname(file)] || "application/octet-stream",
              "X-Content-Type-Options": "nosniff",
            });
            response.end(request.method === "HEAD" ? undefined : content);
          } catch {
            response
              .writeHead(404)
              .end("Build the client with npm run build before starting the server.");
          }
        })
      )
      .catch(() => {
        if (response.writableEnded) return;
        if (response.headersSent) return response.destroy();
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("The server could not complete this request.");
      });
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createAppServer().listen(port, process.env.HOST || "127.0.0.1", () =>
    console.log(`Herolo Weather ready on port ${port}`)
  );
}
