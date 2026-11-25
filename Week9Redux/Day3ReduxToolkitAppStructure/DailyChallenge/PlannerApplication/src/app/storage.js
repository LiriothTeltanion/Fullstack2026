const KEY = "planner-rtk";

// localStorage is read through globalThis so the file also loads outside the browser.
export function loadState() {
  try {
    const saved = globalThis.localStorage?.getItem(KEY);
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
}

export function saveState(state) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore: the planner still works for this visit
  }
}
