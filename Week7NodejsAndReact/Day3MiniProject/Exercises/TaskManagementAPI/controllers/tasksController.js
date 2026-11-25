import { readTasks, updateTasks, nextId } from "../models/taskModel.js";

function validate({ title, description, completed }, isUpdate = false) {
  if (!isUpdate || title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") return "title must be a non-empty string";
  }
  if (description !== undefined && typeof description !== "string")
    return "description must be a string";
  if (completed !== undefined && typeof completed !== "boolean")
    return "completed must be true or false";
  return null;
}

export async function getTasks(req, res, next) {
  try {
    res.json(await readTasks());
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  const error = validate(req.body ?? {});
  if (error) return res.status(400).json({ error });
  try {
    const task = await updateTasks(tasks => {
      const created = {
        id: nextId(tasks),
        title: req.body.title.trim(),
        description: req.body.description?.trim() ?? "",
        completed: req.body.completed ?? false,
      };
      tasks.push(created);
      return created;
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  const error = validate(req.body ?? {}, true);
  if (error) return res.status(400).json({ error });
  try {
    const task = await updateTasks(tasks => {
      const found = tasks.find(candidate => candidate.id === Number(req.params.id));
      if (!found) return null;
      const { title, description, completed } = req.body ?? {};
      if (title !== undefined) found.title = title.trim();
      if (description !== undefined) found.description = description.trim();
      if (completed !== undefined) found.completed = completed;
      return found;
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const removed = await updateTasks(tasks => {
      const index = tasks.findIndex(task => task.id === Number(req.params.id));
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    });
    if (!removed) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
}
