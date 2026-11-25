// Reads and writes data/tasks.json. Writes go one after another through a
// promise chain, so two quick requests cannot overwrite each other.
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data/tasks.json", import.meta.url);
let queue = Promise.resolve();

export async function readTasks() {
  return JSON.parse(await readFile(FILE, "utf8"));
}

// change(tasks) edits the array and returns whatever the controller needs.
export function updateTasks(change) {
  const run = queue.then(async () => {
    const tasks = await readTasks();
    const result = change(tasks);
    await writeFile(FILE, JSON.stringify(tasks, null, 2) + "\n");
    return result;
  });
  queue = run.catch(() => {}); // keep the chain alive after an error
  return run;
}
