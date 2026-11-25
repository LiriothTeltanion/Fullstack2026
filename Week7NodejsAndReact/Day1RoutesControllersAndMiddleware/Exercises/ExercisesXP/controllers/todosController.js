// Todos live in memory, so they reset when the server restarts.
const todos = [
  { id: 1, title: "Read about express.Router()", completed: true },
  { id: 2, title: "Split routes and controllers", completed: false },
];
let nextId = 3;

export function getTodos(req, res) {
  res.json(todos);
}

export function addTodo(req, res) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  const todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
}

export function updateTodo(req, res) {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = Boolean(completed);
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
