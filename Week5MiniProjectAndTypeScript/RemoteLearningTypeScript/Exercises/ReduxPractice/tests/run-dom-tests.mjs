import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dom = new JSDOM('<div id="root"></div>', { url: "http://127.0.0.1:5404/#/ninja/profile" });
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  FormData: dom.window.FormData,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: dom.window.localStorage,
});
const source =
  'export {default as App} from "./app/App";export {createAppStore,STORAGE_KEY} from "./app/store";export {restoreTodos,addTodo} from "./ExercisesXPGold/src/todoSlice";';
const bundle = await build({
  stdin: { contents: source, resolveDir: root, loader: "tsx" },
  bundle: true,
  format: "cjs",
  platform: "node",
  packages: "external",
  write: false,
  jsx: "automatic",
});
const runtime = new Module(path.join(root, "tests/runtime.cjs"));
runtime.paths = Module._nodeModulePaths(root);
runtime._compile(bundle.outputFiles[0].text, path.join(root, "tests/runtime.cjs"));
const { App, createAppStore, STORAGE_KEY, restoreTodos, addTodo } = runtime.exports,
  own = createRequire(path.join(root, "package.json"));
const React = own("react"),
  { createRoot } = own("react-dom/client"),
  { act } = React;
const data = new Map(),
  storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
const store = createAppStore(storage),
  view = createRoot(document.getElementById("root"));
const pause = ms => new Promise(r => setTimeout(r, ms));
async function settle() {
  await act(async () => {
    await pause(200);
  });
}
const button = t => [...document.querySelectorAll("button")].find(x => x.textContent === t);
async function click(el) {
  assert.ok(el);
  await act(async () => el.click());
}
async function set(el, value) {
  assert.ok(el);
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      el instanceof window.HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : el instanceof window.HTMLSelectElement
          ? window.HTMLSelectElement.prototype
          : window.HTMLInputElement.prototype,
      "value"
    ).set.call(el, value);
    el.dispatchEvent(
      new window.Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true })
    );
  });
}
async function submit() {
  await act(async () =>
    document
      .querySelector("form")
      .dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }))
  );
}
try {
  await act(async () => view.render(React.createElement(App, { store })));
  await settle();
  assert.equal(window.location.hash, "#/ninja/login");
  assert.match(document.body.textContent, /Sign in to your practice profile/);
  await set(document.querySelector("input[type=password]"), "bad");
  await submit();
  assert.match(document.body.textContent, /fictional practice password/);
  assert.equal(document.querySelector("input[type=password]").value, "");
  await set(document.querySelector("input[type=email]"), "wrong@example.test");
  await set(document.querySelector("input[type=password]"), "practice123");
  await submit();
  await settle();
  assert.equal(store.getState().auth.isAuthenticated, false);
  assert.match(document.body.textContent, /fictional demo@example.test account/);
  await set(document.querySelector("input[type=email]"), "demo@example.test");
  await set(document.querySelector("input[type=password]"), "practice123");
  await submit();
  await settle();
  assert.equal(window.location.hash, "#/ninja/profile");
  assert.match(document.body.textContent, /Signed in as Practice Developer/);
  assert.equal(JSON.stringify(store.getState()).includes("practice123"), false);
  assert.equal([...data.values()].join("").includes("practice123"), false);
  await set(document.querySelector("input:not([type=email])"), " ");
  await submit();
  await settle();
  assert.match(document.body.textContent, /Enter a name/);
  assert.equal(store.getState().auth.user.name, "Practice Developer");
  await set(document.querySelector("input:not([type=email])"), "Practice Kevin");
  await set(document.querySelector("textarea"), "A fictional practice profile.");
  await submit();
  await settle();
  assert.match(document.body.textContent, /Profile updated/);
  assert.equal(store.getState().auth.user.name, "Practice Kevin");
  await click(button("Sign out"));
  await settle();
  assert.equal(window.location.hash, "#/ninja/login");
  assert.equal(store.getState().auth.user, null);
  console.log(
    "PASS Ninja DOM: private-route redirect, bad password, async rejected/accepted login, invalid/valid update, logout redirect, no password in Redux/storage"
  );
  await click([...document.querySelectorAll("a")].find(x => x.textContent === "Gold · tasks"));
  await settle();
  await submit();
  assert.match(document.body.textContent, /Enter a title/);
  const taskTitle = () => document.querySelector("form input:not([type=date])"),
    date = () => document.querySelector("input[type=date]");
  await set(taskTitle(), "Finish coding");
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(
    date(),
    "1999-01-01"
  );
  await submit();
  assert.equal(store.getState().todos.items[0].dueDate, "1999-01-01");
  assert.equal(document.querySelectorAll(".task.overdue").length, 1);
  await set(taskTitle(), "Write README");
  await set(date(), "2099-01-01");
  await submit();
  assert.equal(document.querySelectorAll(".task").length, 2);
  await click(document.querySelector("input[type=checkbox]"));
  assert.equal(document.querySelectorAll(".task.completed").length, 1);
  const filter = document.querySelector("select");
  await set(filter, "completed");
  assert.equal(document.querySelectorAll(".task").length, 1);
  assert.match(document.body.textContent, /Finish coding/);
  await set(filter, "incomplete");
  assert.equal(document.querySelectorAll(".task").length, 1);
  assert.match(document.body.textContent, /Write README/);
  await set(filter, "overdue");
  assert.equal(document.querySelectorAll(".task").length, 0);
  await set(filter, "all");
  await click(document.querySelector("input[type=checkbox]"));
  await set(filter, "overdue");
  assert.equal(document.querySelectorAll(".task").length, 1);
  await click(document.querySelector('button[aria-label="Delete Finish coding"]'));
  assert.equal(store.getState().todos.items.length, 1);
  const restored = createAppStore(storage);
  assert.equal(restored.getState().todos.items[0].title, "Write README");
  assert.equal(restored.getState().auth.isAuthenticated, false);
  assert.equal(data.has(STORAGE_KEY), true);
  assert.equal([...data.keys()].length, 1);
  console.log(
    "PASS Gold DOM: empty validation, add, overdue/completed highlighting, toggle, all4 filters, delete, storage reload; auth not persisted"
  );
  await act(async () => view.unmount());
  const broken = createAppStore({
    getItem: () => "{broken",
    setItem() {
      throw new Error("quota");
    },
  });
  assert.equal(broken.getState().todos.items.length, 0);
  assert.match(broken.getState().todos.storageError, /could not be read/);
  broken.dispatch(
    addTodo({
      id: "task1",
      title: "Survives quota",
      completed: false,
      dueDate: "2099-01-01",
      createdAt: new Date().toISOString(),
    })
  );
  assert.equal(broken.getState().todos.items.length, 1);
  assert.match(broken.getState().todos.storageError, /could not be saved/);
  const valid = restored.getState().todos.items[0];
  assert.equal(
    restoreTodos(
      JSON.stringify({
        version: 1,
        items: [valid, valid, { ...valid, id: "invalid", dueDate: "2026-02-31" }, null],
      })
    ).length,
    1
  );
  assert.throws(() => restoreTodos(JSON.stringify({ version: 9, items: [] })));
  console.log(
    "PASS persistence negatives: malformed JSON, quota failure retaining memory, invalid calendar date, duplicate IDs, wrong schema version"
  );
} finally {
  await act(async () => {
    try {
      view.unmount();
    } catch {}
  });
  dom.window.close();
}
