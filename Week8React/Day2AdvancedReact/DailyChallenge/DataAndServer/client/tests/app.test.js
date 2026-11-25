import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";

// Compile the production JSX in memory. Absolute imports reuse this project's
// installed React modules without writing generated files into the repository.
const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const compiled = await transform(source, { loader: "jsx", jsx: "automatic", format: "esm" });
const code = compiled.code.replace(
  /from "(react(?:\/jsx-runtime)?)"/g,
  (_, name) => `from ${JSON.stringify(import.meta.resolve(name))}`
);
const { default: App } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
function instance() {
  const component = new App({});
  component.setState = patch => {
    component.state = { ...component.state, ...patch };
  };
  return component;
}

test("componentDidMount gets the greeting for the h1", async t => {
  t.mock.method(globalThis, "fetch", async url => {
    assert.equal(url, "/api/hello");
    return { ok: true, json: async () => ({ message: "Hello From Express" }) };
  });
  const app = instance();
  await app.componentDidMount();
  assert.equal(app.state.message, "Hello From Express");
  const tree = app.render();
  assert.equal(tree.props.children[0].type, "h1");
  assert.equal(tree.props.children[0].props.children, "Hello From Express");
});

test("POST preserves the JSON ABI and displays its reply below the form", async t => {
  t.mock.method(globalThis, "fetch", async (url, request) => {
    assert.equal(url, "/api/world");
    assert.deepEqual(JSON.parse(request.body), { post: "hello server" });
    return { ok: true, json: async () => ({ message: "echo from server" }) };
  });
  const app = instance();
  app.controller = new AbortController();
  app.state.input = "hello server";
  await app.handleSubmit({ preventDefault() {} });
  assert.equal(app.state.reply, "echo from server");
  assert.equal(app.state.sending, false);
  const children = app.render().props.children;
  assert.equal(children[2].props.children, "echo from server");
  assert.equal(children[2].props.role, "status");
});

test("handles failed greeting, rejected POST and network errors", async t => {
  const mock = t.mock.method(globalThis, "fetch", async () => ({ ok: false }));
  const app = instance();
  await app.componentDidMount();
  assert.match(app.state.message, /server running/);
  mock.mock.mockImplementation(async () => ({
    ok: false,
    json: async () => ({ error: "invalid input" }),
  }));
  await app.handleSubmit({ preventDefault() {} });
  assert.equal(app.state.reply, "invalid input");
  mock.mock.mockImplementation(async () => {
    throw new Error("offline");
  });
  await app.handleSubmit({ preventDefault() {} });
  assert.equal(app.state.reply, "The server did not answer.");
});

test("ignores the result of an aborted mount", async t => {
  let resolve;
  t.mock.method(
    globalThis,
    "fetch",
    () =>
      new Promise(done => {
        resolve = done;
      })
  );
  const app = instance();
  const pending = app.componentDidMount();
  app.componentWillUnmount();
  resolve({ ok: true, json: async () => ({ message: "too late" }) });
  await pending;
  assert.equal(app.state.message, "Loading…");
});
