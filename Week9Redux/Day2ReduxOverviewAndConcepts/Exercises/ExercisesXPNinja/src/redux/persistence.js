const KEY = "ninja-notes";

// localStorage only exists in the browser, so it is read through globalThis.
export function loadNotes() {
  try {
    const saved = globalThis.localStorage?.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(notes));
  } catch {
    // storage can be full or blocked; the app keeps working without it
  }
}
