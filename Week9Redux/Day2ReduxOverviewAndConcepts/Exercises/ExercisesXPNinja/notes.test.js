import test from "node:test";
import assert from "node:assert/strict";
import notesReducer, { addNote, deleteNote } from "./src/redux/notesReducer.js";
import undoable, { undo, redo } from "./src/redux/undoable.js";
import { loadNotes, saveNotes } from "./src/redux/persistence.js";

function storage(saved) {
  const values = new Map(saved === undefined ? [] : [["ninja-notes", saved]]);
  return {
    values,
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}
test("note identities remain distinct even when the system clock repeats", () => {
  const original = Date.now;
  Date.now = () => 1;
  try {
    const actions = Array.from({ length: 100 }, (_, i) => addNote(`Note ${i}`));
    assert.equal(new Set(actions.map(action => action.payload.id)).size, 100);
    let notes = actions.slice(0, 2).reduce(notesReducer, []);
    notes = notesReducer(notes, deleteNote(notes[0].id));
    assert.equal(notes.length, 1);
    assert.equal(notes[0].text, "Note 1");
  } finally {
    Date.now = original;
  }
});
test("undo, redo and no-op deletion preserve the expected history", () => {
  const reduce = undoable(notesReducer);
  const first = reduce(undefined, addNote("First"));
  const second = reduce(first, addNote("Second"));
  const back = reduce(second, undo());
  assert.deepEqual(back.present, first.present);
  assert.deepEqual(reduce(back, redo()).present, second.present);
  assert.equal(reduce(back, deleteNote("missing")), back);
  assert.equal(reduce(back, addNote("  ")), back);
});
test("valid legacy saved notes keep their contents and IDs", () => {
  const notes = [
    { id: 123, text: "  Keep my spacing  " },
    { id: "new-id", text: "Second" },
  ];
  assert.deepEqual(loadNotes(storage(JSON.stringify(notes))), notes);
});
test("malformed JSON or shape cannot break rendering and is preserved before replacement", () => {
  for (const raw of ["not JSON", '{"oldFormat":[]}', '[{"id":1,"text":null}]']) {
    const saved = storage(raw);
    assert.deepEqual(loadNotes(saved), []);
    assert.equal(saved.getItem("ninja-notes"), raw);
    const next = [{ id: "fresh", text: "New note" }];
    assert.equal(saveNotes(next, saved), true);
    assert.deepEqual(JSON.parse(saved.getItem("ninja-notes")), next);
    const backups = [...saved.values].filter(([key]) => key.startsWith("ninja-notes-recovery-"));
    assert.equal(backups.length, 1);
    assert.equal(backups[0][1], raw);
  }
});
test("duplicate legacy or string-equivalent IDs are repaired without dropping notes", () => {
  const original = [
    { id: 1, text: "One" },
    { id: 1, text: "Two" },
    { id: "1", text: "Three" },
  ];
  const saved = storage(JSON.stringify(original));
  const result = loadNotes(saved);
  assert.deepEqual(
    result.map(note => note.text),
    ["One", "Two", "Three"]
  );
  assert.equal(new Set(result.map(note => String(note.id))).size, 3);
  assert.equal(saved.values.size, 1);
});
test("if a recovery backup cannot be saved the original value is never overwritten", () => {
  const raw = '{"oldFormat":[]}';
  const saved = storage(raw);
  loadNotes(saved);
  saved.setItem = () => {
    throw new Error("Fixture storage full");
  };
  assert.equal(saveNotes([{ id: "new", text: "Session only" }], saved), false);
  assert.equal(saved.getItem("ninja-notes"), raw);
});
test("blocked storage does not prevent in-memory use", () => {
  const blocked = {
    getItem() {
      throw new Error("Fixture storage blocked");
    },
    setItem() {
      throw new Error("Fixture storage blocked");
    },
  };
  assert.deepEqual(loadNotes(blocked), []);
  assert.equal(saveNotes([], blocked), false);
  assert.equal(notesReducer([], addNote("Session note")).length, 1);
});
