import { configureStore } from "@reduxjs/toolkit";
import todos, {
  restoreTodos,
  setStorageError,
  type TodoState,
} from "../ExercisesXPGold/src/todoSlice";
import auth from "../ExercisesXPNinja/src/authSlice";
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const STORAGE_KEY = "fullstack-remote-todos-v1";
export function browserStorage(): StorageAdapter | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
export function createAppStore(storage: StorageAdapter | undefined = browserStorage()) {
  const initial: TodoState = { items: [], storageError: "" };
  try {
    initial.items = restoreTodos(storage?.getItem(STORAGE_KEY) || null);
    if (!storage) initial.storageError = "Browser storage is unavailable. Tasks remain in memory.";
  } catch {
    initial.storageError = "Saved tasks could not be read. Starting with an empty list.";
  }
  const store = configureStore({ reducer: { todos, auth }, preloadedState: { todos: initial } });
  // Persist task changes only; auth never enters storage. The reference guard
  // also prevents warning dispatches from recursively saving the same task list.
  let previous = store.getState().todos.items;
  store.subscribe(() => {
    const items = store.getState().todos.items;
    if (items === previous) return;
    previous = items;
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items }));
      if (store.getState().todos.storageError) store.dispatch(setStorageError(""));
    } catch {
      store.dispatch(setStorageError("Tasks could not be saved. They remain in memory."));
    }
  });
  return store;
}
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
