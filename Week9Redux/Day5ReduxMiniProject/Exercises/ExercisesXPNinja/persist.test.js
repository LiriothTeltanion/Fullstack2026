import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";
import { loadBoard, persistBoard, saveFailedReducer } from "./src/app/persist.js";
import boardReducer, { cardAdded, cardMoved } from "./src/features/board/boardSlice.js";

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

test("a failed save retains edits in memory and the previous save until a later edit succeeds", t => {
  const original = JSON.stringify({
    cards: { saved: { id: "saved", title: "Previously saved" } },
    columns: { todo: [], doing: ["saved"], done: [] },
  });
  const entries = withStorage(t, original);
  let failWrites = true;
  globalThis.localStorage.setItem = (key, value) => {
    if (failWrites) throw new DOMException("Synthetic storage quota", "QuotaExceededError");
    entries.set(key, value);
  };
  const store = configureStore({
    reducer: { board: boardReducer, saveFailed: saveFailedReducer },
    preloadedState: { board: loadBoard() },
    middleware: defaults => defaults().concat(persistBoard),
  });
  assert.equal(store.getState().saveFailed, false);
  const action = cardAdded("Unsaved fixture");
  store.dispatch(action);
  let notifications = 0;
  const unsubscribe = store.subscribe(() => notifications++);
  store.dispatch(cardMoved({ id: action.payload.id, direction: 1 }));
  assert.equal(notifications, 1);
  assert.equal(store.getState().saveFailed, true);
  assert.ok(store.getState().board.columns.doing.includes(action.payload.id));
  assert.equal(entries.get("kanban-board"), original);

  failWrites = false;
  store.dispatch(cardMoved({ id: action.payload.id, direction: 1 }));
  assert.equal(store.getState().saveFailed, false);
  assert.deepEqual(loadBoard(), store.getState().board);
  assert.ok(loadBoard().columns.done.includes(action.payload.id));
  assert.equal(loadBoard().cards.saved.title, "Previously saved");
  assert.deepEqual(Object.keys(JSON.parse(entries.get("kanban-board"))).sort(), [
    "cards",
    "columns",
  ]);
  notifications = 0;
  store.dispatch(cardMoved({ id: action.payload.id, direction: -1 }));
  assert.equal(notifications, 1);
  unsubscribe();
});

test("unavailable storage is visible in state and a later successful save clears it", t => {
  const entries = withStorage(t, "");
  const available = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: undefined });
  const store = configureStore({
    reducer: { board: boardReducer, saveFailed: saveFailedReducer },
    middleware: defaults => defaults().concat(persistBoard),
  });
  assert.equal(store.getState().saveFailed, true);
  const action = cardAdded("Unavailable storage fixture");
  assert.doesNotThrow(() => store.dispatch(action));
  assert.equal(
    store.getState().board.cards[action.payload.id].title,
    "Unavailable storage fixture"
  );
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: available });
  store.dispatch(cardMoved({ id: action.payload.id, direction: 1 }));
  assert.equal(store.getState().saveFailed, false);
  assert.deepEqual(loadBoard(), store.getState().board);
  assert.ok(entries.get("kanban-board"));
});
