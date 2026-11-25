import { StrictMode } from "react";
import { Provider } from "react-redux";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { createAppStore } from "../src/store";
import recipes from "../public/recipes.json";

afterEach(() => vi.unstubAllGlobals());

function renderApp() {
  const store = createAppStore();
  render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
  return { store, user: userEvent.setup() };
}

function respond(value: unknown = recipes) {
  const mock = vi.fn().mockResolvedValue(new Response(JSON.stringify(value)));
  vi.stubGlobal("fetch", mock);
  return mock;
}

describe("recipe finder with the real React tree and Redux store", () => {
  it("shows loading, fetches once under StrictMode and renders the local JSON collection", async () => {
    let finish!: (response: Response) => void;
    const mock = vi.fn<typeof fetch>(
      () =>
        new Promise<Response>(resolve => {
          finish = resolve;
        })
    );
    vi.stubGlobal("fetch", mock);
    const { store } = renderApp();
    expect(screen.getByRole("status").textContent).toContain("Loading");
    expect(store.getState().recipes.status).toBe("loading");
    await act(async () => {
      finish(new Response(JSON.stringify(recipes)));
    });
    await screen.findByRole("button", { name: /Lemon chickpea bowl/ });
    expect(screen.getByText("6 of 6 recipes")).toBeTruthy();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock.mock.calls[0]?.[0]).toBe("/recipes.json");
  });

  it("searches ingredients case/accent-insensitively, opens full details and moves focus", async () => {
    respond();
    const { store, user } = renderApp();
    await screen.findByRole("button", { name: /Lemon chickpea bowl/ });
    await user.type(screen.getByLabelText("Ingredients"), "  LÉMON, CHICKPEA  ");
    await user.click(screen.getByRole("button", { name: /Find recipes/ }));
    expect(screen.getByText("1 of 6 recipes")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Lemon herb couscous/ })).toBeNull();
    await user.click(screen.getByRole("button", { name: /Lemon chickpea bowl/ }));
    const details = screen.getByRole("complementary", { name: "Recipe details" });
    expect(within(details).getByText("15 minutes")).toBeTruthy();
    expect(within(details).getByText("1 can, drained")).toBeTruthy();
    expect(within(details).getByRole("heading", { name: "Preparation" })).toBeTruthy();
    expect(within(details).getAllByRole("listitem")).toHaveLength(8);
    expect(document.activeElement).toBe(
      within(details).getByRole("heading", { name: "Lemon chickpea bowl" })
    );
    expect(store.getState().recipes.selectedId).toBe("lemon-chickpea-bowl");
    await user.click(screen.getByRole("button", { name: "Back to recipes" }));
    expect(store.getState().recipes.selectedId).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Recipes" }));
  });

  it("shows no results for unmatched terms, clears the search and restores all recipes", async () => {
    respond();
    const { user } = renderApp();
    await screen.findByRole("button", { name: /Lemon chickpea bowl/ });
    await user.type(screen.getByLabelText("Ingredients"), "saffron kiwi");
    await user.click(screen.getByRole("button", { name: /Find recipes/ }));
    expect(screen.getByRole("status").textContent).toContain("No recipes match");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect((screen.getByLabelText("Ingredients") as HTMLInputElement).value).toBe("");
    expect(screen.getByText("6 of 6 recipes")).toBeTruthy();
  });

  it("keeps whitespace-only searches broad and clears an old selection on a new search", async () => {
    respond();
    const { user, store } = renderApp();
    await user.click(await screen.findByRole("button", { name: /Lemon chickpea bowl/ }));
    await user.type(screen.getByLabelText("Ingredients"), "   ");
    await user.click(screen.getByRole("button", { name: /Find recipes/ }));
    expect(screen.getByText("6 of 6 recipes")).toBeTruthy();
    expect(store.getState().recipes.selectedId).toBeNull();
    expect(screen.queryByRole("heading", { name: "Preparation" })).toBeNull();
  });

  it("recovers from a failed HTTP load when the user retries", async () => {
    const mock = vi
      .fn()
      .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(recipes)));
    vi.stubGlobal("fetch", mock);
    const { user, store } = renderApp();
    expect((await screen.findByRole("alert")).textContent).toContain("Could not load");
    expect(store.getState().recipes.status).toBe("failed");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    await screen.findByRole("button", { name: /Lemon chickpea bowl/ });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["network", () => Promise.reject(new TypeError("offline")), "Could not reach"],
    ["malformed JSON", () => Promise.resolve(new Response("{broken")), "invalid data"],
    [
      "invalid record",
      () => Promise.resolve(new Response(JSON.stringify([{ id: "broken" }]))),
      "invalid data",
    ],
  ])("shows an actionable error for %s", async (_, load, message) => {
    vi.stubGlobal("fetch", vi.fn(load));
    renderApp();
    expect((await screen.findByRole("alert")).textContent).toContain(message);
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Lemon chickpea bowl/ })).toBeNull();
  });

  it("represents a valid empty catalog separately from a broken catalog", async () => {
    respond([]);
    renderApp();
    await screen.findByRole("heading", { name: "The recipe shelf is empty." });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("0 of 0 recipes")).toBeTruthy();
  });
});
