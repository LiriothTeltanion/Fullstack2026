import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React, { act } from "react";

test("register/signin routes reach the dashboard and show account errors", async t => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: "http://localhost/dashboard",
  });
  const { document } = dom.window;
  Object.assign(globalThis, {
    window: dom.window,
    document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const accounts = new Map();
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const input = JSON.parse(options.body);
    calls.push({ url, method: options.method, input });
    let status = 200;
    let data;
    if (url === "/api/register") {
      if (accounts.has(input.email)) {
        status = 409;
        data = { error: "already registered" };
      } else {
        const user = { id: 1, name: input.name, email: input.email, joined: "2026-11-25" };
        accounts.set(input.email, { user, password: input.password });
        status = 201;
        data = user;
      }
    } else {
      const account = accounts.get(input.email);
      if (!account || account.password !== input.password) {
        status = 401;
        data = { error: "not registered" };
      } else data = account.user;
    }
    return { ok: status < 400, status, json: async () => data };
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
  const setter = Object.getOwnPropertyDescriptor(
    dom.window.HTMLInputElement.prototype,
    "value"
  ).set;
  async function fill(name, value) {
    await act(async () => {
      const input = document.querySelector(`input[name="${name}"]`);
      setter.call(input, value);
      input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
  }
  async function submit() {
    await act(async () =>
      document
        .querySelector("form")
        .dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }))
    );
  }
  async function follow(path) {
    await act(async () =>
      document
        .querySelector(`a[href="${path}"]`)
        .dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, button: 0 }))
    );
  }
  try {
    await act(async () => root.render(React.createElement(App)));
    assert.equal(dom.window.location.pathname, "/signin");
    await fill("email", "absent@example.test");
    await fill("password", "wrong");
    await submit();
    assert.equal(document.querySelector('[role="alert"]').textContent, "not registered");
    await follow("/register");
    assert.equal(document.querySelector('input[name="email"]').value, "");
    await fill("name", "Demo Learner");
    await fill("email", "demo@example.test");
    await fill("password", "demo-pass");
    await submit();
    assert.equal(dom.window.location.pathname, "/dashboard");
    assert.ok(document.body.textContent.includes("Welcome, Demo Learner"));
    assert.ok(document.body.textContent.includes("demo@example.test"));
    await act(async () => document.querySelector("button").click());
    assert.equal(dom.window.location.pathname, "/signin");
    await follow("/register");
    await fill("name", "Demo Learner");
    await fill("email", "demo@example.test");
    await fill("password", "demo-pass");
    await submit();
    assert.equal(document.querySelector('[role="alert"]').textContent, "already registered");
    await follow("/signin");
    await fill("email", "demo@example.test");
    await fill("password", "wrong");
    await submit();
    assert.equal(document.querySelector('[role="alert"]').textContent, "not registered");
    await fill("password", "demo-pass");
    await submit();
    assert.equal(dom.window.location.pathname, "/dashboard");
    assert.deepEqual(
      calls.find(call => call.url === "/api/register"),
      {
        url: "/api/register",
        method: "POST",
        input: { name: "Demo Learner", email: "demo@example.test", password: "demo-pass" },
      }
    );
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.HTMLElement;
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
