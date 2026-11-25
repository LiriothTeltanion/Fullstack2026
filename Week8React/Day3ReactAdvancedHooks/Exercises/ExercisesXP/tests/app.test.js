import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React, { act } from "react";

test("theme context, ref character count and independent todo removal", async t => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/" });
  const { document } = dom.window;
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
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
  const { default: App } = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  const button = text =>
    [...document.querySelectorAll("button")].find(node => node.textContent === text);
  try {
    await act(async () => root.render(React.createElement(App)));
    assert.equal(document.body.className, "light");
    await act(async () => button("Switch to dark").click());
    assert.equal(document.body.className, "dark");
    await act(async () => button("Switch to light").click());
    assert.equal(document.body.className, "light");
    const textarea = document.querySelector('textarea[aria-label="Text to count"]');
    await act(async () => {
      textarea.value = "Kevin";
      textarea.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
    assert.ok(document.body.textContent.includes("Characters: 5"));
    await act(async () => button("Focus the text box").click());
    assert.equal(document.activeElement, textarea);

    t.mock.method(Date, "now", () => 1000);
    const form = document.querySelector("form");
    const input = form.querySelector("input");
    const setter = Object.getOwnPropertyDescriptor(
      dom.window.HTMLInputElement.prototype,
      "value"
    ).set;
    for (const text of ["One", "Two"]) {
      await act(async () => {
        setter.call(input, text);
        input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      });
      await act(async () =>
        form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }))
      );
    }
    assert.equal(document.querySelectorAll("li").length, 2);
    await act(async () => button("Remove").click());
    assert.equal(document.querySelectorAll("li").length, 1);
    assert.ok(document.querySelector("li").textContent.includes("Two"));
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.HTMLElement;
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
