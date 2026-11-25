import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const FILE =
  process.env.TASK_API_FILE || fileURLToPath(new URL("../data/tasks.json", import.meta.url));
let queue = Promise.resolve();

export async function readTasks() {
  await queue;
  return JSON.parse(await readFile(FILE, "utf8"));
}

// Read, change and atomically replace inside one queue to preserve concurrent writes.
export function updateTasks(change) {
  const run = queue.then(async () => {
    const tasks = JSON.parse(await readFile(FILE, "utf8"));
    const result = change(tasks);
    const temporary = FILE + "." + randomUUID() + ".tmp";
    try {
      await writeFile(temporary, JSON.stringify(tasks, null, 2) + "\n", { flag: "wx" });
      await rename(temporary, FILE);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

// Retain the original model export for callers replacing the whole list.
export function saveTasks(tasks) {
  return updateTasks(current => {
    current.splice(0, current.length, ...tasks);
  });
}

export function nextId(tasks) {
  return Math.max(0, ...tasks.map(task => task.id)) + 1;
}
