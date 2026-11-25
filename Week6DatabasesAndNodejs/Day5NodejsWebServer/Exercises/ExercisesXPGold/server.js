// Exercises XP Gold: query strings, POST bodies and a small in-memory todo API
// with only the built-in http module.
import http from "node:http";
import { sendJson, readJsonBody } from "./httpHelpers.js";

const PORT = Number(process.env.PORT) || 3010;

// Exercise 1: greetings in three languages, picked with ?lang=
const GREETINGS = { en: "Hello", es: "Hola", he: "Shalom" };

// Exercise 3: the "database" is an array that lives as long as the server runs
const todos = [{ id: 1, title: "Read about the http module", done: true }];
let nextId = 2;

async function handle(req, res) {
  // new URL() needs a base, the host header gives one
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean); // "/todos/2" -> ["todos", "2"]

  // Exercise 1: GET /greet?name=Kevin&lang=es
  if (req.method === "GET" && url.pathname === "/greet") {
    const name = url.searchParams.get("name") || "stranger";
    const lang = url.searchParams.get("lang") || "en";
    if (!(lang in GREETINGS)) {
      return sendJson(res, 400, {
        error: `lang must be one of ${Object.keys(GREETINGS).join(", ")}`,
      });
    }
    return sendJson(res, 200, { message: `${GREETINGS[lang]}, ${name}` });
  }

  // Exercise 2: POST /echo sends the JSON body back with a little extra
  if (req.method === "POST" && url.pathname === "/echo") {
    const body = await readJsonBody(req);
    return sendJson(res, 200, { received: body, keys: Object.keys(body).length });
  }

  // Exercise 3: /todos and /todos/:id
  if (parts[0] === "todos") {
    const id = parts[1] ? Number(parts[1]) : null;
    const todo = todos.find(item => item.id === id);

    if (req.method === "GET" && id === null) return sendJson(res, 200, todos);

    if (req.method === "POST" && id === null) {
      const { title } = await readJsonBody(req);
      if (typeof title !== "string" || title.trim() === "") {
        return sendJson(res, 400, { error: "title is required" });
      }
      const created = { id: nextId++, title: title.trim(), done: false };
      todos.push(created);
      return sendJson(res, 201, created);
    }

    if (id !== null && !todo) return sendJson(res, 404, { error: `No todo ${id}` });

    if (req.method === "GET") return sendJson(res, 200, todo);

    if (req.method === "PATCH") {
      todo.done = !todo.done; // toggle
      return sendJson(res, 200, todo);
    }

    if (req.method === "DELETE") {
      todos.splice(todos.indexOf(todo), 1);
      res.writeHead(204);
      return res.end();
    }
  }

  sendJson(res, 404, { error: `No route for ${req.method} ${url.pathname}` });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(error => {
    sendJson(res, error.status ?? 500, { error: error.message });
  });
});

server.listen(PORT, () => console.log(`XP Gold server on http://localhost:${PORT}`));
