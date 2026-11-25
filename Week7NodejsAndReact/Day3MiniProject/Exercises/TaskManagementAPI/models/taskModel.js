// All file access lives here, so the controller never touches fs.
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data/tasks.json", import.meta.url);

export async function readTasks() {
  const text = await readFile(FILE, "utf8");
  return JSON.parse(text);
}

export async function saveTasks(tasks) {
  await writeFile(FILE, JSON.stringify(tasks, null, 2) + "\n");
}

export function nextId(tasks) {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;
}
