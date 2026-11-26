import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

const idle = () => new Promise(resolve => setTimeout(resolve, 30));
async function eventually(predicate) {
  for (let attempt = 0; attempt < 100 && !predicate(); attempt++) await idle();
  assert.ok(predicate(), "The expected rendered state appeared within three seconds");
}

test("typed greeting and counter behavior work through the normal application entry", async () => {
  const bundle = await build({
    entryPoints: [fileURLToPath(new URL("../src/main.tsx", import.meta.url))],
    bundle: true,
    write: false,
    platform: "browser",
    format: "iife",
    jsx: "automatic",
    loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"development"' },
  });
  const dom = new JSDOM('<div id="root"></div>', {
    url: "http://127.0.0.1/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  // Keep the existing user-list example local and deterministic while testing the real app.
  dom.window.fetch = async () => ({
    ok: true,
    json: async () => [{ id: 1, name: "Fixture reader", email: "reader@example.invalid" }],
  });
  try {
    dom.window.eval(bundle.outputFiles[0].text);
    const document = dom.window.document;
    await eventually(() => document.querySelector(".big"));
    assert.match(document.body.textContent, /Hello, Kevin/);
    assert.match(document.body.textContent, /3 unread messages/);
    assert.match(document.body.textContent, /0 unread messages/);
    assert.match(document.body.textContent, /29 years old/);

    const button = label =>
      [...document.querySelectorAll("button")].find(node => node.textContent === label);
    assert.equal(document.querySelector(".big").textContent, "10");
    assert.match(document.querySelector('[aria-label="Counter action"]').textContent, /none/);
    button("+1").click();
    await eventually(() => document.querySelector(".big").textContent === "11");
    assert.equal(document.querySelector(".big").textContent, "11");
    assert.match(document.querySelector('[aria-label="Counter action"]').textContent, /increment/);
    button("-1").click();
    await eventually(() => document.querySelector(".big").textContent === "10");
    assert.equal(document.querySelector(".big").textContent, "10");
    assert.match(document.querySelector('[aria-label="Counter action"]').textContent, /decrement/);
    assert.match(document.body.textContent, /Anonymous/);
    await eventually(() => document.body.textContent.includes("Fixture reader"));
    assert.match(document.body.textContent, /Fixture reader/);
  } finally {
    dom.window.close();
  }
});
