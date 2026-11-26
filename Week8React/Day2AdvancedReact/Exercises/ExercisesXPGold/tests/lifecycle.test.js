import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React, { act, StrictMode } from "react";

let App;
let createRoot;
let dom;
let document;
const savedGlobals = new Map();

before(async () => {
  dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/" });
  document = dom.window.document;
  for (const [name, value] of Object.entries({
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    savedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }

  // Compile the real component tree in memory; tests do not start Vite or write a bundle.
  const result = await build({
    entryPoints: [fileURLToPath(new URL("../src/App.jsx", import.meta.url))],
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
    packages: "external",
    jsx: "automatic",
  });
  const code = result.outputFiles[0].text.replace(
    /from "([^"]+)"/g,
    (_, name) => `from ${JSON.stringify(import.meta.resolve(name))}`
  );
  ({ default: App } = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  ));
  // React DOM must see the DOM globals when its event system is initialized.
  ({ createRoot } = await import("react-dom/client"));
});

after(() => {
  dom?.window.close();
  for (const [name, descriptor] of savedGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
});

async function mount(t, strict = false) {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const logs = [];
  const alerts = [];
  const errors = [];
  t.mock.method(console, "log", (...args) => logs.push(args.join(" ")));
  t.mock.method(console, "error", (...args) => errors.push(args.join(" ")));
  t.mock.method(globalThis, "fetch", () => {
    assert.fail("Lifecycle checks must not access the network");
  });
  const previousAlert = Object.getOwnPropertyDescriptor(globalThis, "alert");
  Object.defineProperty(globalThis, "alert", {
    configurable: true,
    value: message => alerts.push(message),
  });
  const clearTimer = t.mock.method(globalThis, "clearTimeout");
  const root = createRoot(document.getElementById("root"));
  let mounted = true;
  const unmount = async () => {
    if (!mounted) return;
    await act(async () => root.unmount());
    mounted = false;
  };
  t.after(async () => {
    try {
      await unmount();
      assert.deepEqual(errors, [], "React must not report act or cleanup errors");
    } finally {
      if (previousAlert) Object.defineProperty(globalThis, "alert", previousAlert);
      else delete globalThis.alert;
    }
  });
  await act(async () =>
    root.render(
      React.createElement(strict ? StrictMode : React.Fragment, null, React.createElement(App))
    )
  );
  const sections = document.querySelectorAll("section");
  return {
    logs,
    alerts,
    clearTimer,
    unmount,
    color: () => sections[0].querySelector("h3").textContent,
    hooksColor: () => sections[2].querySelector("h3").textContent,
    checkbox: sections[0].querySelector('input[type="checkbox"]'),
    change: sections[0].querySelector("button"),
    remove: sections[1].querySelector("button"),
    child: () => sections[1].querySelector("h3"),
    click: async element => act(async () => element.click()),
    tick: async () => act(async () => t.mock.timers.tick(1000)),
    transitions: () => logs.filter(line => line.startsWith("componentDidUpdate:")),
  };
}

test("normal timer and button updates report the visible previous color", async t => {
  const app = await mount(t);
  assert.equal(app.color(), "My Favorite Color is red");
  assert.equal(app.hooksColor(), "My Favorite Color is red");
  await app.tick();
  assert.equal(app.color(), "My Favorite Color is yellow");
  assert.equal(app.hooksColor(), "My Favorite Color is yellow");
  await app.click(app.change);
  assert.equal(app.color(), "My Favorite Color is blue");
  assert.deepEqual(app.transitions(), [
    "componentDidUpdate: red -> yellow",
    "componentDidUpdate: yellow -> blue",
  ]);
  assert.deepEqual(app.alerts, []);
});

test("reopening updates snapshots the color visible before blocked state changes", async t => {
  const app = await mount(t);
  await app.click(app.checkbox);
  assert.equal(app.checkbox.checked, false);
  await app.tick();
  await app.click(app.change);
  assert.equal(app.color(), "My Favorite Color is red", "blocked renders keep red visible");
  assert.equal(app.hooksColor(), "My Favorite Color is yellow", "the independent hook timer runs");
  assert.deepEqual(app.transitions(), []);
  await app.click(app.checkbox);
  assert.equal(app.checkbox.checked, true);
  assert.equal(app.color(), "My Favorite Color is blue");
  assert.deepEqual(app.transitions(), ["componentDidUpdate: red -> blue"]);
});

test("StrictMode replay and ordinary root cleanup never announce Delete", async t => {
  const app = await mount(t, true);
  assert.equal(app.clearTimer.mock.callCount(), 2, "replay clears class and hook timers");
  assert.deepEqual(app.alerts, [], "development replay is not an intentional Delete");
  await app.unmount();
  assert.equal(app.clearTimer.mock.callCount(), 4, "root cleanup clears both replacement timers");
  assert.deepEqual(app.alerts, [], "ordinary root unmount is not Delete");
  assert.equal(app.logs.filter(line => line === "Child componentWillUnmount: cleanup").length, 1);
  const logsAfterCleanup = [...app.logs];
  await app.tick();
  assert.deepEqual(app.logs, logsAfterCleanup, "no timer work runs after unmount");
  assert.equal(document.getElementById("root").childElementCount, 0);
});

test("Delete announces Child exactly once in StrictMode, including later cleanup", async t => {
  const app = await mount(t, true);
  assert.deepEqual(app.alerts, []);
  assert.equal(app.child().textContent, "Hello World!");
  await app.click(app.remove);
  assert.equal(app.child(), null);
  assert.equal(app.remove.disabled, true);
  assert.deepEqual(app.alerts, ["The component named Child is about to be unmounted."]);
  await app.click(app.remove);
  await app.unmount();
  await app.tick();
  assert.equal(app.alerts.length, 1, "disabled Delete and root cleanup cannot repeat the alert");
});
