import { readTasks, saveTasks, nextId } from "../models/taskModel.js";

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
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const tasks = await readTasks();
    const task = {
      id: nextId(tasks),
      title: req.body.title.trim(),
      description: req.body.description?.trim() ?? "",
      completed: req.body.completed ?? false,
    };
    tasks.push(task);
    await saveTasks(tasks);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  const error = validate(req.body, true);
  if (error) return res.status(400).json({ error });
  try {
    const tasks = await readTasks();
    const index = tasks.findIndex(t => t.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Task not found" });

    const { title, description, completed } = req.body;
    const task = tasks[index];
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = completed;

    await saveTasks(tasks);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const tasks = await readTasks();
    const remaining = tasks.filter(t => t.id !== Number(req.params.id));
    if (remaining.length === tasks.length) return res.status(404).json({ error: "Task not found" });
    await saveTasks(remaining);
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
}
