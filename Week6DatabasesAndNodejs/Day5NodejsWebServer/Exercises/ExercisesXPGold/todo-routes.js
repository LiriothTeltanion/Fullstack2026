import { Router } from "express";

export function todoRoutes() {
  const router = Router();
  const todos = new Map();
  let nextId = 1;
  router.param("id", (req, res, next, id) => {
    const key = Number(id);
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(key))
      return res.status(400).json({ error: "Invalid todo ID." });
    const task = todos.get(key);
    if (!task) return res.status(404).json({ error: "Todo not found." });
    res.locals.task = task;
    next();
  });

  router.get("/", (_req, res) => res.json([...todos.values()]));
  router.get("/:id", (_req, res) => res.json(res.locals.task));

  function save(req, res) {
    const input = req.body;
    const previous = res.locals.task;
    if (
      !input ||
      Array.isArray(input) ||
      typeof input !== "object" ||
      !Object.keys(input).length ||
      Object.keys(input).some(key => key !== "title" && key !== "completed") ||
      ((!previous || "title" in input) &&
        (typeof input.title !== "string" || !input.title.trim())) ||
      ("completed" in input && typeof input.completed !== "boolean")
    ) {
      return res
        .status(400)
        .json({ error: "Use a nonempty title and an optional boolean completed flag." });
    }
    const task = {
      id: previous?.id ?? nextId++,
      title: input.title?.trim() ?? previous.title,
      completed: input.completed ?? previous?.completed ?? false,
    };
    todos.set(task.id, task);
    return res.status(previous ? 200 : 201).json(task);
  }
  router.post("/", save);
  router.put("/:id", (req, res) => {
    if (typeof req.body?.title !== "string" || typeof req.body?.completed !== "boolean") {
      return res.status(400).json({ error: "Replacing a todo requires both title and completed." });
    }
    return save(req, res);
  });
  router.patch("/:id", save);
  router.delete("/:id", (_req, res) => {
    todos.delete(res.locals.task.id);
    res.sendStatus(204);
  });
  return router;
}
