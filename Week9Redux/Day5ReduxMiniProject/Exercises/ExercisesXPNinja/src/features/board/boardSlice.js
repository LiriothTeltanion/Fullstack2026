import { createSlice, nanoid } from "@reduxjs/toolkit";

export const COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const initialState = {
  cards: {
    c1: { id: "c1", title: "Sketch the board layout" },
    c2: { id: "c2", title: "Write boardSlice" },
    c3: { id: "c3", title: "Set up the store" },
  },
  // Each column only keeps the ids of its cards, in order.
  columns: { todo: ["c1"], doing: ["c2"], done: ["c3"] },
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    cardAdded: {
      reducer(state, action) {
        const { id, title, columnId } = action.payload;
        state.cards[id] = { id, title };
        state.columns[columnId].push(id);
      },
      prepare(title, columnId = "todo") {
        return { payload: { id: nanoid(), title, columnId } };
      },
    },
    cardRenamed(state, action) {
      const card = state.cards[action.payload.id];
      if (card) card.title = action.payload.title;
    },
    cardDeleted(state, action) {
      const id = action.payload;
      delete state.cards[id];
      for (const columnId of Object.keys(state.columns)) {
        state.columns[columnId] = state.columns[columnId].filter(cardId => cardId !== id);
      }
    },
    // direction: -1 moves the card one column to the left, +1 to the right
    cardMoved(state, action) {
      const { id, direction } = action.payload;
      const from = COLUMNS.findIndex(column => state.columns[column.id].includes(id));
      const to = from + direction;
      if (from === -1 || to < 0 || to >= COLUMNS.length) return;
      state.columns[COLUMNS[from].id] = state.columns[COLUMNS[from].id].filter(
        cardId => cardId !== id
      );
      state.columns[COLUMNS[to].id].push(id);
    },
    boardReset() {
      return initialState;
    },
  },
});

export const { cardAdded, cardRenamed, cardDeleted, cardMoved, boardReset } = boardSlice.actions;
export default boardSlice.reducer;

export const selectColumnCards = (state, columnId) =>
  state.board.columns[columnId].map(id => state.board.cards[id]);
