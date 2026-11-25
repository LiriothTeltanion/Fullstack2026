// The data part of the notes app: load, save and change the list of notes.
// Notes live in notes.json next to this file (git-ignored, it is my own data).
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const NOTES_FILE = fileURLToPath(new URL("./notes.json", import.meta.url));

export async function loadNotes(file = NOTES_FILE) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return []; // no file yet = no notes yet
    throw error;
  }
}

export async function saveNotes(notes, file = NOTES_FILE) {
  await writeFile(file, JSON.stringify(notes, null, 2) + "\n");
}

export function addNote(notes, title, body) {
  if (notes.some(note => note.title.toLowerCase() === title.toLowerCase())) {
    throw new Error(`A note called "${title}" already exists`);
  }
  const id = notes.reduce((max, note) => Math.max(max, note.id), 0) + 1;
  return [...notes, { id, title, body, created: new Date().toISOString().slice(0, 10) }];
}

export function removeNote(notes, id) {
  const remaining = notes.filter(note => note.id !== id);
  if (remaining.length === notes.length) throw new Error(`No note with id ${id}`);
  return remaining;
}

export function searchNotes(notes, text) {
  const needle = text.toLowerCase();
  return notes.filter(
    note => note.title.toLowerCase().includes(needle) || note.body.toLowerCase().includes(needle)
  );
}
