import { configureStore } from "@reduxjs/toolkit";
import { logger } from "./logger.js";
import notesReducer from "./notesReducer.js";
import { loadNotes, saveNotes } from "./persistence.js";
import undoable from "./undoable.js";

export const store = configureStore({
  reducer: { notes: undoable(notesReducer) },
  preloadedState: { notes: { past: [], present: loadNotes(), future: [] } },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

// Save the visible notes after every change.
store.subscribe(() => saveNotes(store.getState().notes.present));
