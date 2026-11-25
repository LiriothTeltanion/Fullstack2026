// One Node process owns the JSON store. Each mutation reads the latest file
// inside the queue and replaces it atomically, so retries never read half a file.
import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const FILE =
  process.env.TASK_API_USERS_FILE || fileURLToPath(new URL("../data/users.json", import.meta.url));
let queue = Promise.resolve();

export async function readUsers() {
  await queue;
  return JSON.parse(await readFile(FILE, "utf8"));
}

export function updateUsers(change) {
  const run = queue.then(async () => {
    const users = JSON.parse(await readFile(FILE, "utf8"));
    const result = await change(users);
    const temporary = `${FILE}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporary, JSON.stringify(users, null, 2) + "\n", { flag: "wx" });
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
