import { readFile, writeFile, rename, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const FILE = new URL("../data/notes.json", import.meta.url);
let pendingAccess = Promise.resolve();

function withStoreAccess(operation) {
  const result = pendingAccess.catch(() => {}).then(operation);
  pendingAccess = result;
  return result;
}

async function readSnapshot() {
  return JSON.parse(await readFile(FILE, "utf8"));
}

export function readNotes() {
  // Reads share the queue so Windows never replaces a file with an active reader.
  return withStoreAccess(readSnapshot);
}

export async function saveNotes(notes) {
  // Readers see either the complete old file or the complete new file.
  const temporary = new URL(".notes-" + randomUUID() + ".tmp", FILE);
  try {
    await writeFile(temporary, JSON.stringify(notes, null, 2) + "\n");
    await rename(temporary, FILE);
  } finally {
    await rm(temporary, { force: true });
  }
}

export function mutateNotes(change) {
  // Queue the whole read-modify-write cycle so requests retain every change.
  return withStoreAccess(async () => {
    const notes = await readSnapshot();
    const result = change(notes);
    if (result !== undefined) await saveNotes(notes);
    return result;
  });
}
