import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React, { act } from "react";

test("class meme generator preserves the initial image, edits overlays and handles API failures", async t => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost" });
  const { document } = dom.window;
  Object.assign(globalThis, {
    window: dom.window,
    document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const bundle = await build({
    stdin: {
      contents:
        'export { default } from "./src/App.jsx"; export { default as MemeGenerator } from "./src/components/MemeGenerator.jsx";',
      resolveDir: fileURLToPath(new URL("../", import.meta.url)),
      loader: "jsx",
    },
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
    packages: "external",
    jsx: "automatic",
    loader: { ".svg": "dataurl", ".css": "empty" },
  });
  const code = bundle.outputFiles[0].text.replace(
    /from "([^"]+)"/g,
    (_, name) => `from ${JSON.stringify(import.meta.resolve(name))}`
  );
  const { default: App, MemeGenerator } = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );
  const { createRoot } = await import("react-dom/client");
  let root;
  let respond;
  let rejectRequest;
  const requests = [];
  t.mock.method(globalThis, "fetch", (url, options) => {
    requests.push({ url, ...options });
    return new Promise((resolve, reject) => {
      respond = resolve;
      rejectRequest = reject;
    });
  });
  async function mount() {
    if (root) await act(async () => root.unmount());
    root = createRoot(document.getElementById("root"));
    await act(async () => root.render(React.createElement(App)));
  }
  async function reply(data, ok = true) {
    await act(async () => respond({ ok, json: async () => data }));
  }
  async function fill(name, value) {
    const input = document.querySelector(`input[name="${name}"]`);
    const setter = Object.getOwnPropertyDescriptor(
      dom.window.HTMLInputElement.prototype,
      "value"
    ).set;
    await act(async () => {
      setter.call(input, value);
      input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      input.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
  }
  const initial = "https://i.imgflip.com/1bij.jpg";
  const image = () => document.querySelector(".meme img");
  try {
    await t.test(
      "the named class state and required preview structure remain explicit",
      async () => {
        const instance = new MemeGenerator({});
        assert.deepEqual(instance.state.allMemeImgs, []);
        assert.equal(instance.state.randomImage, initial);
        await mount();
        assert.equal(document.querySelectorAll("h1").length, 1);
        assert.equal(document.querySelector("main h1").textContent, "Create a captioned meme");
        assert.equal(document.querySelectorAll("header h1").length, 0);
        assert.equal(document.querySelectorAll("div.meme > h2.top").length, 1);
        assert.equal(document.querySelectorAll("div.meme > h2.bottom").length, 1);
        assert.equal(document.querySelector("div.meme > img").src, initial);
      }
    );
    await t.test(
      "initial image is present before and after componentDidMount finishes",
      async () => {
        await mount();
        assert.equal(requests[0].url, "https://api.imgflip.com/get_memes");
        assert.equal(image().src, initial);
        assert.ok(document.querySelector("header img"));
        assert.equal(document.querySelector("header p").textContent, "Meme Generator");
        assert.equal(document.querySelectorAll(".meme h2").length, 2);
        assert.equal(document.querySelector("button").disabled, true);
        await reply({
          success: true,
          data: {
            memes: [
              { url: "https://i.imgflip.com/first.jpg", name: "First" },
              { url: "https://i.imgflip.com/second.jpg", name: "Second" },
            ],
          },
        });
        assert.equal(image().src, initial);
        assert.equal(document.querySelector("button").disabled, false);
      }
    );
    await t.test(
      "the header uses the external reference and an original local fallback",
      async () => {
        const headerImage = document.querySelector("header img");
        assert.equal(
          headerImage.src,
          "https://www.pngall.com/wp-content/uploads/2016/05/Trollface.png"
        );
        assert.equal(headerImage.getAttribute("referrerpolicy"), "no-referrer");
        await act(async () => headerImage.dispatchEvent(new dom.window.Event("error")));
        assert.match(headerImage.src, /^data:image\/svg\+xml/);
        assert.equal(headerImage.alt, "Original smiling face icon");
        const fallback = headerImage.src;
        await act(async () => headerImage.dispatchEvent(new dom.window.Event("error")));
        assert.equal(headerImage.src, fallback);
        assert.ok(document.querySelector('input[name="topText"]'));
      }
    );
    await t.test("text, size and color update the overlays and Gen chooses randomly", async () => {
      await fill("topText", "Top from input");
      await fill("bottomText", "Bottom from input");
      await fill("fontSize", "52");
      await fill("color", "#ff0000");
      const headings = document.querySelectorAll(".meme h2");
      assert.equal(headings[0].textContent, "Top from input");
      assert.equal(headings[1].textContent, "Bottom from input");
      assert.equal(headings[0].style.getPropertyValue("--meme-font-size"), "52px");
      assert.equal(headings[1].style.color, "rgb(255, 0, 0)");
      const random = t.mock.method(Math, "random", () => 0.99);
      await act(async () => document.querySelector("button").click());
      assert.equal(image().src, "https://i.imgflip.com/second.jpg");
      assert.equal(document.querySelector("figcaption").textContent, "Second");
      assert.equal(headings[0].textContent, "Top from input");
      random.mock.restore();
    });
    await t.test("image errors are announced without discarding editor controls", async () => {
      await act(async () => image().dispatchEvent(new dom.window.Event("error")));
      assert.match(
        document.querySelector('[role="alert"]').textContent,
        /image could not be loaded/
      );
      assert.ok(image().classList.contains("is-unavailable"));
      assert.ok(document.querySelector('input[name="topText"]'));
    });
    await t.test(
      "HTTP, empty and malformed API responses keep the initial editable meme",
      async () => {
        for (const [data, ok] of [
          [{}, false],
          [{ success: true, data: { memes: [] } }, true],
          [null, true],
        ]) {
          await mount();
          await reply(data, ok);
          assert.equal(image().src, initial);
          assert.equal(document.querySelector("button").disabled, true);
          assert.ok(document.querySelector('[role="alert"]'));
          await fill("topText", "Still editable");
          assert.equal(document.querySelector(".meme h2").textContent, "Still editable");
        }
      }
    );
    await t.test("network rejection preserves editing and announces the failure", async () => {
      await mount();
      await act(async () => rejectRequest(new Error("Network unavailable")));
      assert.match(document.querySelector('[role="alert"]').textContent, /Network unavailable/);
      assert.equal(image().src, initial);
      assert.equal(document.querySelector("button").disabled, true);
      await fill("bottomText", "Editable during network failure");
      assert.equal(
        document.querySelectorAll(".meme h2")[1].textContent,
        "Editable during network failure"
      );
    });
    await t.test("unmount aborts the request and ignores a late reply", async () => {
      await mount();
      const request = requests.at(-1);
      await act(async () => root.unmount());
      root = null;
      assert.equal(request.signal.aborted, true);
      await reply({ success: true, data: { memes: [{ url: initial }] } });
      assert.equal(document.getElementById("root").textContent, "");
    });
  } finally {
    if (root) await act(async () => root.unmount());
    dom.window.close();
    for (const key of ["window", "document", "HTMLElement", "IS_REACT_ACT_ENVIRONMENT"])
      delete globalThis[key];
  }
});
