import { test, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { createAppStore } from "./store";

test("the actual counter UI dispatches Increment and Decrement: 0 → 1 → 0 → -1", () => {
  const store = createAppStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const value = screen.getByLabelText("Counter value");
  expect(value).toHaveTextContent(/^0$/);
  fireEvent.click(screen.getByRole("button", { name: "Increment" }));
  expect(value).toHaveTextContent(/^1$/);
  fireEvent.click(screen.getByRole("button", { name: "Decrement" }));
  expect(value).toHaveTextContent(/^0$/);
  fireEvent.click(screen.getByRole("button", { name: "Decrement" }));
  expect(value).toHaveTextContent(/^-1$/);
  expect(store.getState().counter.value).toBe(-1);
});
