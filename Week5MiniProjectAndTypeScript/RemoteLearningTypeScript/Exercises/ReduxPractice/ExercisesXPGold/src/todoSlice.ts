import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
}
export interface TodoState {
  items: Todo[];
  storageError: string;
}
export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
export function today(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
export function restoreTodos(raw: string | null): Todo[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (
    !data ||
    typeof data !== "object" ||
    !("version" in data) ||
    data.version !== 1 ||
    !("items" in data) ||
    !Array.isArray(data.items)
  )
    throw new Error("Unsupported saved tasks");
  const seen = new Set<string>();
  return data.items.slice(0, 500).flatMap((value: unknown) => {
    if (!value || typeof value !== "object") return [];
    const t = value as Partial<Todo>;
    if (
      typeof t.id !== "string" ||
      !t.id ||
      seen.has(t.id) ||
      typeof t.title !== "string" ||
      !t.title.trim() ||
      t.title.length > 200 ||
      typeof t.completed !== "boolean" ||
      !validDate(t.dueDate) ||
      typeof t.createdAt !== "string" ||
      !Number.isFinite(Date.parse(t.createdAt))
    )
      return [];
    seen.add(t.id);
    return [
      {
        id: t.id,
        title: t.title.trim(),
        completed: t.completed,
        dueDate: t.dueDate,
        createdAt: t.createdAt,
      },
    ];
  });
}
const initialState: TodoState = { items: [], storageError: "" };
export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      const t = action.payload;
      if (
        state.items.length < 500 &&
        t.title.trim() &&
        t.title.length <= 200 &&
        validDate(t.dueDate) &&
        !state.items.some(x => x.id === t.id)
      )
        state.items.push({ ...t, title: t.title.trim() });
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const t = state.items.find(x => x.id === action.payload);
      if (t) t.completed = !t.completed;
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(x => x.id !== action.payload);
    },
    setStorageError(state, action: PayloadAction<string>) {
      state.storageError = action.payload;
    },
  },
});
export const { addTodo, toggleTodo, deleteTodo, setStorageError } = todoSlice.actions;
export default todoSlice.reducer;
