import { COLUMNS } from "../features/board/boardSlice.js";

const KEY = "kanban-board";

// Rebuild the index before Redux renders it. Older saves may have missing
// columns, a card listed twice, or a reference left behind after deletion.
function restoreBoard(saved) {
  if (!saved?.cards || typeof saved.cards !== "object" || Array.isArray(saved.cards)) {
    return undefined;
  }

  const cards = Object.fromEntries(
    Object.entries(saved.cards)
      .filter(([, card]) => typeof card?.title === "string")
      .map(([id, card]) => [id, { ...card, id }])
  );
  const unplaced = new Set(Object.keys(cards));
  const columns = {};
  for (const { id } of COLUMNS) {
    const order = saved.columns?.[id];
    // Deleting from the set accepts only the first existing reference to a card.
    columns[id] = Array.isArray(order) ? order.filter(cardId => unplaced.delete(cardId)) : [];
  }
  for (const cardId of unplaced) columns.todo.push(cardId);
  return { cards, columns };
}

export function loadBoard() {
  try {
    const saved = globalThis.localStorage?.getItem(KEY);
    return saved ? restoreBoard(JSON.parse(saved)) : undefined;
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
