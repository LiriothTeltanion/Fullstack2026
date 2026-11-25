import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import React from "react";
import TestRenderer, { act } from "react-test-renderer";

const source = await readFile(
  new URL("../src/components/LifecycleExercises.jsx", import.meta.url),
  "utf8"
);
const { code } = await transform(source, { loader: "jsx", jsx: "automatic", format: "esm" });
const moduleCode = code.replace(
  /from "(react(?:\/jsx-runtime)?)"/g,
  (_, name) => `from ${JSON.stringify(import.meta.resolve(name))}`
);
const { BuggyCounter, ErrorBoundary, FavoriteColor, UnmountDemo } = await import(
  `data:text/javascript;base64,${Buffer.from(moduleCode).toString("base64")}`
);
const element = React.createElement;

test("one shared boundary replaces both counters with error details", t => {
  t.mock.method(console, "error", () => {});
  let tree;
  act(() => {
    tree = TestRenderer.create(
      element(
        ErrorBoundary,
        null,
        element(BuggyCounter, { label: "A" }),
        element(BuggyCounter, { label: "B" })
      )
    );
  });
  for (let i = 0; i < 5; i++) act(() => tree.root.findAllByType("button")[0].props.onClick());
  assert.equal(tree.root.findAllByType("button").length, 0);
  assert.match(
    tree.root.findByProps({ role: "alert" }).findByType("p").children.join(""),
    /reached five/
  );
  assert.match(tree.root.findByType("pre").children.join(""), /BuggyCounter/);
  tree.unmount();
});

test("separate boundaries leave the other counter working", t => {
  t.mock.method(console, "error", () => {});
  let tree;
  act(() => {
    tree = TestRenderer.create(
      element(
        "div",
        null,
        element(ErrorBoundary, null, element(BuggyCounter, { label: "A" })),
        element(ErrorBoundary, null, element(BuggyCounter, { label: "B" }))
      )
    );
  });
  for (let i = 0; i < 5; i++) act(() => tree.root.findAllByType("button")[0].props.onClick());
  assert.equal(tree.root.findAllByType("button").length, 1);
  act(() => tree.root.findByType("button").props.onClick());
  assert.equal(tree.root.findByType("button").children.join(""), "B: 1");
  tree.unmount();
});

test("the unbounded counter throws and clears only its own root", t => {
  t.mock.method(console, "error", () => {});
  let tree;
  act(() => {
    tree = TestRenderer.create(element(BuggyCounter));
  });
  for (let i = 0; i < 4; i++) act(() => tree.root.findByType("button").props.onClick());
  assert.throws(() => act(() => tree.root.findByType("button").props.onClick()), /reached five/);
  assert.equal(tree.toJSON(), null);
});

test("color mounts red, becomes yellow, accepts blue and records updates", async t => {
  const logs = [];
  t.mock.method(console, "log", message => logs.push(message));
  let tree;
  act(() => {
    tree = TestRenderer.create(element(FavoriteColor));
  });
  const instance = tree.root.findByType(FavoriteColor).instance;
  assert.equal(instance.state.favoriteColor, "red");
  assert.equal(instance.shouldComponentUpdate(), true);
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 2100));
  });
  assert.equal(instance.state.favoriteColor, "yellow");
  act(() => tree.root.findByType("button").props.onClick());
  assert.equal(instance.state.favoriteColor, "blue");
  assert.deepEqual(instance.state.updates, ["after update", "after update"]);
  assert.deepEqual(logs, ["after update", "after update"]);
  tree.unmount();
});

test("Delete removes Child and invokes its unmount notification once", t => {
  const alerts = [];
  const previous = globalThis.window;
  globalThis.window = { alert: message => alerts.push(message) };
  t.after(() => {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  });
  let tree;
  act(() => {
    tree = TestRenderer.create(element(UnmountDemo));
  });
  assert.equal(tree.root.findByType("h3").children.join(""), "Hello World!");
  act(() => tree.root.findByType("button").props.onClick());
  assert.equal(tree.root.findAllByType("header").length, 0);
  assert.equal(alerts.length, 1);
  assert.match(alerts[0], /unmounted/);
  tree.unmount();
});
