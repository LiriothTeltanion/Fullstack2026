import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import _ from "lodash";

// The terminal exercise has its own file. The existing web demo keeps notes.json.
export const DEFAULT_NOTES_FILE = fileURLToPath(new URL("./data/cli-notes.json", import.meta.url));

function titleKey(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("A non-empty title is required");
  return value.trim();
}

export function listNotes(file = DEFAULT_NOTES_FILE) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  let notes;
  try {
    notes = JSON.parse(text);
  } catch {
    throw new Error("Notes file contains invalid JSON; no changes were made");
  }
  if (
    !Array.isArray(notes) ||
    !notes.every(
      note =>
        note &&
        typeof note === "object" &&
        typeof note.title === "string" &&
        note.title.trim() &&
        typeof note.body === "string"
    )
  )
    throw new Error(
      "Notes file must contain notes with string titles and bodies; no changes were made"
    );
  return notes;
}

function saveNotes(file, notes) {
  // Finish the new JSON before replacing the old file, so a failed write cannot
  // leave half a document where the user's existing notes used to be.
  const temporary = file + ".tmp-" + process.pid + "-" + randomBytes(6).toString("hex");
  let created = false;
  try {
    const handle = openSync(temporary, "wx", 0o600);
    created = true;
    try {
      writeFileSync(handle, JSON.stringify(notes, null, 2) + "\n");
      fsyncSync(handle);
    } finally {
      closeSync(handle);
    }
    renameSync(temporary, file);
  } finally {
    if (created && existsSync(temporary)) unlinkSync(temporary);
  }
}

function changeNotes(file, change) {
  const target = path.resolve(file);
  mkdirSync(path.dirname(target), { recursive: true });
  const lock = target + ".lock";
  let handle;
  try {
    handle = openSync(lock, "wx", 0o600);
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error("Notes file is busy. Try again after the current writer finishes", {
        cause: error,
      });
    }
    throw error;
  }
  try {
    writeFileSync(handle, String(process.pid));
    const { notes, result } = change(listNotes(target));
    saveNotes(target, notes);
    return result;
  } finally {
    closeSync(handle);
    // Only the lock created by this invocation is released; an existing lock
    // was rejected above and is never removed or taken over automatically.
    unlinkSync(lock);
  }
}

export function addNote(title, body, file = DEFAULT_NOTES_FILE) {
  const key = titleKey(title);
  if (typeof body !== "string") throw new Error("The note body must be text");
  return changeNotes(file, notes => {
    if (_.find(notes, { title: key })) throw new Error("Note already exists");
    const note = { title: key, body };
    return { notes: [...notes, note], result: note };
  });
}

export function readNote(title, file = DEFAULT_NOTES_FILE) {
  const key = titleKey(title);
  const note = _.find(listNotes(file), { title: key });
  if (!note) throw new Error("Note not found");
  return note;
}

export function removeNote(title, file = DEFAULT_NOTES_FILE) {
  const key = titleKey(title);
  return changeNotes(file, notes => {
    if (!_.find(notes, { title: key })) throw new Error("Note not found");
    return { notes: _.filter(notes, note => note.title !== key), result: key };
  });
}
