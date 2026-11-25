// Small helpers so server.js doesn't repeat the same response code everywhere

export function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

// The body of a request arrives in chunks; collect them, then parse the JSON.
// Rejects with a 400-style error when the body is not valid JSON or too big.
export function readJsonBody(req, maxBytes = 10_000) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > maxBytes) {
        reject(Object.assign(new Error("Body too large"), { status: 413 }));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error("Body is not valid JSON"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}
