const KEY = "kanban-board";

export function loadBoard() {
  try {
    const saved = globalThis.localStorage?.getItem(KEY);
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
}

// A custom middleware: after any "board/..." action, save the board.
export const persistBoard = store => next => action => {
  const result = next(action);
  if (action.type.startsWith("board/")) {
    try {
      globalThis.localStorage?.setItem(KEY, JSON.stringify(store.getState().board));
    } catch {
      // storage is optional
    }
  }
  return result;
};
