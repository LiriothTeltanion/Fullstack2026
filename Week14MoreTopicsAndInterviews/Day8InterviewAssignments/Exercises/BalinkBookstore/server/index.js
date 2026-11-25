import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { stores, books } from "./catalog.js";
import { createOrderStore } from "./orders.js";

export function createFixtureServer() {
  const orderStore = createOrderStore();
  return createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const send = (status, body) => {
      res.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(JSON.stringify(body));
    };
    if (req.method === "GET" && url.pathname === "/api/stores") return send(200, { stores });
    if (req.method === "GET" && url.pathname === "/api/books") return send(200, { books });
    if (req.method === "GET" && url.pathname.startsWith("/api/books/")) {
      const book = books.find(item => item.id === url.pathname.slice(11));
      return book ? send(200, { book }) : send(404, { error: "Book not found." });
    }
    if (req.method === "GET" && url.pathname.startsWith("/api/orders/")) {
      const receipt = orderStore.get(url.pathname.slice(12));
      return receipt
        ? send(200, { order: receipt })
        : send(404, { error: "Practice order not found." });
    }
    if (req.method === "POST" && url.pathname === "/api/orders") {
      try {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 32768) {
            send(413, { error: "Order is too large." });
            return;
          }
        }
        const result = orderStore.create(JSON.parse(body), req.headers["idempotency-key"]);
        return result.error
          ? send(result.status, { error: result.error })
          : send(result.status, { order: result.receipt });
      } catch {
        return send(400, { error: "Send a valid JSON order." });
      }
    }
    send(404, { error: "Route not found." });
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createFixtureServer().listen(Number(process.env.PORT) || 5324, "127.0.0.1", () =>
    console.log("Synthetic bookstore API on http://127.0.0.1:" + (Number(process.env.PORT) || 5324))
  );
}
