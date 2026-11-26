import { nanoid } from "@reduxjs/toolkit";

const KEY = "ninja-notes";
let pendingRecovery = null;
let recoveryNotice = "";
export const getRecoveryNotice = () => recoveryNotice;

function validNote(note) {
  return (
    note &&
    typeof note === "object" &&
    typeof note.text === "string" &&
    ((typeof note.id === "number" && Number.isFinite(note.id)) ||
      (typeof note.id === "string" && note.id.length > 0))
  );
}

// localStorage only exists in the browser, so it is read through globalThis.
export function loadNotes(storage) {
  let saved;
  pendingRecovery = null;
  recoveryNotice = "";
  try {
    saved = (storage ?? globalThis.localStorage)?.getItem(KEY);
    if (!saved) return [];
    const notes = JSON.parse(saved);
    if (!Array.isArray(notes) || !notes.every(validNote)) {
      pendingRecovery = saved;
      recoveryNotice =
        "Saved notes could not be read. The original is preserved; a recovery copy is made before saving new notes.";
      return [];
    }
    const seen = new Set();
    return notes.map(note => {
      if (seen.has(String(note.id))) {
        pendingRecovery = saved;
        recoveryNotice =
          "Repeated saved note IDs were repaired. All note text is retained; a recovery copy is made before saving.";
        const repaired = { ...note, id: nanoid() };
        seen.add(String(repaired.id));
        return repaired;
      }
      seen.add(String(note.id));
      return note;
    });
  } catch {
    if (saved) pendingRecovery = saved;
    recoveryNotice = saved
      ? "Saved notes could not be read. The original is preserved; a recovery copy is made before saving new notes."
      : "Browser storage was unavailable at startup. You can keep notes in this session.";
    return [];
  }
}

export function saveNotes(notes, storage) {
  try {
    const target = storage ?? globalThis.localStorage;
    if (!target) return false;
    // Preserve unusable/duplicate old data verbatim before replacing its key.
    // If the backup cannot be written, leave the original intact; keep working
    // in memory until storage becomes available instead of discarding it.
    if (pendingRecovery !== null) {
      target.setItem(`${KEY}-recovery-${nanoid()}`, pendingRecovery);
      pendingRecovery = null;
    }
    target.setItem(KEY, JSON.stringify(notes));
    return true;
  } catch {
    // storage can be full or blocked; the app keeps working without it
    return false;
  }
}
