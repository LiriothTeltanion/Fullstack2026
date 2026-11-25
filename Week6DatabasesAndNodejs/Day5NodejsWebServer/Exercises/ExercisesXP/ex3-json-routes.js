// Exercise 3: a few routes, JSON answers and a 404 for everything else
import http from "node:http";

const PORT = Number(process.env.PORT) || 3002;

const users = [
  { id: 1, name: "Dana", role: "student" },
  { id: 2, name: "Omer", role: "mentor" },
];

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Only GET is allowed here" });
  }

  switch (req.url) {
    case "/":
      return sendJson(res, 200, { message: "Welcome to the home route" });
    case "/about":
      return sendJson(res, 200, { app: "Exercise 3", routes: ["/", "/about", "/api/users"] });
    case "/api/users":
      return sendJson(res, 200, users);
    default:
      return sendJson(res, 404, { error: `No route for ${req.url}` });
  }
});

server.listen(PORT, () => console.log(`Exercise 3 on http://localhost:${PORT}`));
