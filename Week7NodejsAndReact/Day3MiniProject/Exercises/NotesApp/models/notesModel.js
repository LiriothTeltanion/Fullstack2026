import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data/notes.json", import.meta.url);

export async function readNotes() {
  return JSON.parse(await readFile(FILE, "utf8"));
}

export async function saveNotes(notes) {
  await writeFile(FILE, JSON.stringify(notes, null, 2) + "\n");
}
