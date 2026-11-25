import { readTasks, updateTasks } from "../models/taskStore.js";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

class NotFound extends Error {}

export async function listTasks(req, res, next) {
  try {
    let tasks = await readTasks();
    const { completed, priority, search, sort } = req.query;

    if (completed !== undefined) tasks = tasks.filter(t => String(t.completed) === completed);
    if (priority) tasks = tasks.filter(t => t.priority === priority);
    if (search) tasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    if (sort === "priority") {
      tasks.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    } else if (sort === "dueDate") {
      // Tasks without a date go last.
      tasks.sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const start = (page - 1) * limit;
    res.json({ total: tasks.length, page, limit, tasks: tasks.slice(start, start + limit) });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const tasks = await readTasks();
    const done = tasks.filter(t => t.completed).length;
    const byPriority = { high: 0, medium: 0, low: 0 };
    for (const task of tasks) byPriority[task.priority] += 1;
    res.json({ total: tasks.length, completed: done, open: tasks.length - done, byPriority });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = (await readTasks()).find(t => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  const { title, priority = "medium", dueDate = null } = req.body;
  try {
    const task = await updateTasks(tasks => {
      const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id, title: title.trim(), priority, dueDate, completed: false };
      tasks.push(newTask);
      return newTask;
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

// Runs change(task) on one task, or throws NotFound.
function changeTask(id, change) {
  return updateTasks(tasks => {
    const task = tasks.find(t => t.id === Number(id));
    if (!task) throw new NotFound();
    change(task);
    return task;
  });
}

async function respondWithChange(req, res, next, change) {
  try {
    res.json(await changeTask(req.params.id, change));
  } catch (err) {
    if (err instanceof NotFound) return res.status(404).json({ error: "Task not found" });
    next(err);
  }
}

export function updateTask(req, res, next) {
  const allowed = ["title", "priority", "dueDate", "completed"];
  respondWithChange(req, res, next, task => {
    for (const key of allowed) {
      if (req.body[key] !== undefined)
        task[key] = key === "title" ? req.body.title.trim() : req.body[key];
    }
  });
}

export function toggleTask(req, res, next) {
  respondWithChange(req, res, next, task => {
    task.completed = !task.completed;
  });
}

export async function deleteTask(req, res, next) {
  try {
    await updateTasks(tasks => {
      const index = tasks.findIndex(t => t.id === Number(req.params.id));
      if (index === -1) throw new NotFound();
      tasks.splice(index, 1);
    });
    res.status(204).end();
  } catch (err) {
    if (err instanceof NotFound) return res.status(404).json({ error: "Task not found" });
    next(err);
  }
}
