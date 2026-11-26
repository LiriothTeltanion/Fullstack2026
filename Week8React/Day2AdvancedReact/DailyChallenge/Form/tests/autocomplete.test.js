import test, { after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

// Use the app's normal JSX transform, without adding a second test framework.
const vite = await createServer({
  root: fileURLToPath(new URL("..", import.meta.url)),
  server: { middlewareMode: true },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, entries: [] },
});
after(() => vite.close());
const { default: CountryAutocomplete } = await vite.ssrLoadModule(
  "/src/components/CountryAutocomplete.jsx"
);

function component(items) {
  const instance = new CountryAutocomplete({ countries: items });
  // Exercise class transitions synchronously; real DOM interaction is checked separately.
  instance.setState = (change, callback) => {
    const update = typeof change === "function" ? change(instance.state, instance.props) : change;
    instance.state = { ...instance.state, ...update };
    callback?.();
  };
  return instance;
}

function key(instance, value) {
  instance.handleKeyDown({ key: value, nativeEvent: {}, preventDefault() {} });
}

test("a supplied country list reports its own size", () => {
  const html = renderToStaticMarkup(createElement(CountryAutocomplete, { countries: ["Canada"] }));
  assert.match(html, /list of 1 countr(?:y|ies)/);
});

test("multiple widgets have distinct IDs and local ARIA references", () => {
  const html = renderToStaticMarkup(
    createElement(
      "main",
      null,
      createElement(CountryAutocomplete),
      createElement(CountryAutocomplete)
    )
  );
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const attribute of ["for", "aria-labelledby", "aria-controls", "aria-describedby"]) {
    for (const match of html.matchAll(new RegExp(`${attribute}="([^"]+)"`, "g"))) {
      for (const id of match[1].split(" ")) assert.ok(ids.includes(id), `Missing target: ${id}`);
    }
  }
});

test("replacing an open list resets its keyboard index before another selection", () => {
  const instance = component(["Canada", "Cameroon"]);
  instance.state = { ...instance.state, query: "ca", open: true, activeIndex: 1 };
  const previousProps = instance.props;
  instance.props = { countries: ["Canada"] };
  instance.componentDidUpdate(previousProps, instance.state);
  assert.equal(instance.state.activeIndex, -1);
  key(instance, "Enter");
  assert.equal(instance.state.query, "ca");
  assert.equal(instance.state.selected, "");
  key(instance, "ArrowDown");
  key(instance, "Enter");
  assert.equal(instance.state.selected, "Canada");
});

test("removing a selected country retains editable text but clears stale confirmation", () => {
  const instance = component(["Canada"]);
  instance.selectCountry("Canada");
  const previousProps = instance.props;
  instance.props = { countries: ["France"] };
  instance.componentDidUpdate(previousProps, instance.state);
  assert.equal(instance.state.query, "Canada");
  assert.equal(instance.state.selected, "");
  assert.equal(instance.state.open, false);
});

test("a stale Enter event never selects an undefined or removed country", () => {
  const instance = component(["Canada"]);
  instance.state = { ...instance.state, query: "ca", open: true, activeIndex: 5 };
  key(instance, "Enter");
  assert.equal(instance.state.query, "ca");
  assert.equal(instance.state.selected, "");
  instance.selectCountry("Atlantis");
  assert.equal(instance.state.selected, "");
});

test("clearing refocuses after state is reset and composition keys do not select", () => {
  const instance = component(["Canada"]);
  instance.state = { ...instance.state, query: "ca", open: true, activeIndex: 0 };
  instance.handleKeyDown({ key: "Enter", nativeEvent: { isComposing: true } });
  assert.equal(instance.state.selected, "");
  let stateAtFocus;
  instance.input.current = {
    focus() {
      stateAtFocus = { ...instance.state };
    },
  };
  instance.clear();
  assert.equal(stateAtFocus.query, "");
  assert.equal(stateAtFocus.open, false);
  assert.equal(stateAtFocus.cleared, true);
});
