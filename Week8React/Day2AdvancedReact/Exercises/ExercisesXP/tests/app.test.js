import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React, { act } from "react";

test("router recovers from Shop, JSON renders, and the form posts JSON", async t => {
  const requests = [];
  let fail = false;
  const receiver = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    requests.push({
      method: req.method,
      type: req.headers["content-type"],
      body: JSON.parse(body),
    });
    res.writeHead(fail ? 500 : 200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true }));
  }).listen(0, "127.0.0.1");
  await once(receiver, "listening");
  const receiverUrl = `http://127.0.0.1:${receiver.address().port}/fixture`;
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/" });
  const { document } = dom.window;
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const errors = [];
  t.mock.method(console, "error", (...args) => errors.push(args));
  t.mock.method(console, "log", () => {});
  dom.window.addEventListener("error", event => {
    if (event.message.includes("shop is closed")) event.preventDefault();
  });
  const result = await build({
    entryPoints: [fileURLToPath(new URL("../src/App.jsx", import.meta.url))],
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
    packages: "external",
    jsx: "automatic",
    define: { "import.meta.env.VITE_WEBHOOK_URL": JSON.stringify(receiverUrl) },
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
  try {
    await act(async () => root.render(React.createElement(App)));
    const heading = text =>
      [...document.querySelectorAll("h3")].some(node => node.textContent === text);
    const navigate = async path =>
      act(async () => {
        document
          .querySelector(`nav a[href="${path}"]`)
          .dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, button: 0 }));
      });
    assert.ok(heading("Home"));
    await navigate("/profile");
    assert.ok(heading("Profile Screen"));
    await navigate("/shop");
    assert.ok(heading("An error has occurred."));
    assert.equal(document.querySelectorAll("nav a").length, 3);
    await navigate("/");
    assert.ok(heading("Home"));
    assert.ok(!heading("An error has occurred."));
    assert.ok(
      errors.some(args => args.some(value => String(value).includes("Caught by ErrorBoundary")))
    );

    const posts = JSON.parse(
      await readFile(new URL("../src/data/posts.json", import.meta.url), "utf8")
    );
    for (const post of posts) {
      assert.ok(document.body.textContent.includes(post.title));
      assert.ok(document.body.textContent.includes(post.content));
    }
    const complex = JSON.parse(
      await readFile(new URL("../src/data/complexData.json", import.meta.url), "utf8")
    );
    for (const area of complex.Skills) assert.ok(document.body.textContent.includes(area.Area));
    for (const job of complex.Experiences)
      assert.ok(document.body.textContent.includes(job.companyName));

    const form = document.querySelector("form");
    async function submitAndWaitFor(expected) {
      await act(async () =>
        form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }))
      );
      for (let i = 0; i < 250; i++) {
        if (expected.test(document.querySelector('[role="status"]').textContent)) return;
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
        });
      }
      assert.fail("The form did not show the expected receiver status");
    }
    await submitAndWaitFor(/Sent\. Status 200/);
    assert.deepEqual(requests[0], {
      method: "POST",
      type: "application/json",
      body: { key1: "myusername", email: "mymail@gmail.com", name: "Isaac" },
    });
    assert.match(document.querySelector('[role="status"]').textContent, /Sent\. Status 200/);
    fail = true;
    await submitAndWaitFor(/Request failed.*500/);
    assert.match(document.querySelector('[role="status"]').textContent, /Request failed.*500/);
    assert.equal(form.querySelector("button").disabled, false);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    receiver.closeAllConnections();
    await new Promise(resolve => receiver.close(resolve));
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.HTMLElement;
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
