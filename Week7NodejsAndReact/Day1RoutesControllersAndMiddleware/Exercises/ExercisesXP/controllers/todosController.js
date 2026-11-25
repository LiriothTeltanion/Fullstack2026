// Todos live in memory, so they reset when the server restarts.
const todos = [
  { id: 1, title: "Read about express.Router()", completed: true },
  { id: 2, title: "Split routes and controllers", completed: false },
];
let nextId = 3;

// Validate the entire update before touching the in-memory record. In particular,
// Boolean("false") is true, so completed must already be a JSON boolean.
function todoChanges(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Send a JSON object" };
  }
  const changes = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "title must be non-empty text" };
    }
    changes.title = body.title.trim();
  }
  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      return { error: "completed must be a boolean" };
    }
    changes.completed = body.completed;
  }
  return { changes };
}

export function getTodos(req, res) {
  res.json(todos);
}

export function addTodo(req, res) {
  const result = todoChanges(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  if (result.changes.title === undefined) {
    return res.status(400).json({ error: "title is required" });
  }
  const todo = { id: nextId++, title: result.changes.title, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
}

export function updateTodo(req, res) {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const result = todoChanges(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  if (!Object.keys(result.changes).length) {
    return res.status(400).json({ error: "Send a title or completed value" });
  }
  Object.assign(todo, result.changes);
  res.json(todo);
}

export function deleteTodo(req, res) {
  const index = todos.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const [removed] = todos.splice(index, 1);
  res.json({ message: "Todo deleted", todo: removed });
}
