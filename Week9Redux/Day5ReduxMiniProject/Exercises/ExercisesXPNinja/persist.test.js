import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";
import { loadBoard, persistBoard } from "./src/app/persist.js";
import boardReducer, { cardMoved } from "./src/features/board/boardSlice.js";

// Use an in-memory storage adapter so tests never touch a developer's board.
function withStorage(t, initial) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const entries = new Map([["kanban-board", initial]]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: key => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, value),
    },
  });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else delete globalThis.localStorage;
  });
  return entries;
}

test("restores ordered cards once, repairs missing columns and retains unassigned cards", t => {
  const saved = JSON.stringify({
    cards: {
      first: { id: "first", title: "First" },
      second: { title: "Second" },
      note: { id: "note", title: "A draft" },
    },
    columns: { doing: ["second", "deleted", "first", "second"], done: ["first"] },
  });
  const storage = withStorage(t, saved);
  const board = loadBoard();
  assert.deepEqual(board.columns, { todo: ["note"], doing: ["second", "first"], done: [] });
  assert.equal(board.cards.second.id, "second");
  assert.equal(storage.get("kanban-board"), saved);

  const store = configureStore({
    reducer: { board: boardReducer },
    preloadedState: { board },
    middleware: defaults => defaults().concat(persistBoard),
  });
  store.dispatch(cardMoved({ id: "note", direction: 1 }));
  assert.deepEqual(loadBoard().columns.doing, ["second", "first", "note"]);
});

test("keeps a deliberately empty board empty", t => {
  withStorage(t, JSON.stringify({ cards: {}, columns: { todo: [], doing: [], done: [] } }));
  assert.deepEqual(loadBoard(), { cards: {}, columns: { todo: [], doing: [], done: [] } });
});

test("unreadable or unrelated saved data falls back to the initial board", t => {
  const storage = withStorage(t, "");
  for (const value of ["{", "null", "{}", '{"cards":[]}']) {
    storage.set("kanban-board", value);
    assert.equal(loadBoard(), undefined);
    assert.equal(storage.get("kanban-board"), value);
  }
});
