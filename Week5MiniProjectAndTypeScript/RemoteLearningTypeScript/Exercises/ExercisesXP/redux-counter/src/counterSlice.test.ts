import { test, expect } from "vitest";
import counterReducer, { decrement, increment } from "./counterSlice";
import { createAppStore } from "./store";
import type { AppDispatch, RootState } from "./store";

test("slice starts at zero and preserves the previous state when incremented", () => {
  const initial = counterReducer(undefined, { type: "unknown" });
  const next = counterReducer(initial, increment());
  expect(initial).toEqual({ value: 0 });
  expect(next).toEqual({ value: 1 });
  expect(next).not.toBe(initial);
  expect(counterReducer(next, { type: "unrelated" })).toBe(next);
});

test("typed store applies 0 → 1 → 0 → -1 and new stores reset to zero", () => {
  const store = createAppStore();
  const dispatch: AppDispatch = store.dispatch;
  const read = (): RootState => store.getState();
  expect(read().counter.value).toBe(0);
  dispatch(increment());
  expect(read().counter.value).toBe(1);
  dispatch(decrement());
  expect(read().counter.value).toBe(0);
  dispatch(decrement());
  expect(read().counter.value).toBe(-1);
  expect(createAppStore().getState().counter.value).toBe(0);
});
