import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { build } from "vite";

const folder = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(folder, "..");
const output = process.env.NOTE_QA_OUTPUT;
let browser, server, base;
let checks = 0;
const results = [];
const verify = (condition, message) => {
  checks++;
  assert.ok(condition, message);
};

before(async () => {
  // Build the generic caller with the same app toolchain and actual hook source.
  await build({
    root: app,
    base: "/generic/",
    build: {
      outDir: path.join(folder, "dist"),
      emptyOutDir: true,
      rollupOptions: { input: path.join(folder, "fixtures/generic.html") },
    },
  });
  server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const generic = pathname.startsWith("/generic/");
    const baseline = pathname.startsWith("/baseline/") && process.env.NOTE_BASELINE_DIST;
    const root = generic
      ? path.join(folder, "dist")
      : baseline
        ? process.env.NOTE_BASELINE_DIST
        : path.join(app, "dist");
    const relative = generic
      ? pathname.slice(9)
      : baseline
        ? pathname.slice(10)
        : pathname.slice(1);
    const target = path.resolve(root, relative || "index.html");
    if (!target.startsWith(path.resolve(root) + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      const data = await fs.readFile(target);
      const type =
        { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" }[
          path.extname(target)
        ] ?? "application/octet-stream";
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  });
  if (output) await fs.mkdir(output, { recursive: true });
});

after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  if (output)
    await fs.writeFile(
      path.join(output, "browser-results.json"),
      JSON.stringify({ generated_at: new Date().toISOString(), checks, results }, null, 2)
    );
});

async function withPage(name, action, { width = 1280, baseline = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 950 } });
  const errors = [],
    failures = [],
    external = [];
  await context.route("**/*", route => {
    if (new URL(route.request().url()).origin === base) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("requestfailed", request => failures.push(request.url()));
  try {
    await action(page);
    if (!baseline) verify(errors.length === 0, `${name}: no hard JavaScript errors`);
    verify(failures.length === 0, `${name}: no failed local requests`);
    verify(external.length === 0, `${name}: no external requests`);
    results.push({ name, status: "PASS", errors, failures, external });
  } catch (error) {
    results.push({ name, status: "FAIL", error: String(error), errors, failures, external });
    throw error;
  } finally {
    await context.close();
  }
}

const note = page => page.getByPlaceholder("Write something, then reload the page");
const status = page => page.locator("textarea + p");
const stored = page => page.evaluate(() => localStorage.getItem("gold-note"));
const saved = page =>
  page.waitForFunction(() =>
    document.querySelector("textarea + p")?.textContent.includes("saved in localStorage")
  );

async function failWrites(page, errorName) {
  await page.evaluate(name => {
    const original = Storage.prototype.setItem;
    window.restoreNoteStorage = () => {
      Storage.prototype.setItem = original;
    };
    // Fault injection affects only this demo's synthetic note key.
    Storage.prototype.setItem = function (key, value) {
      if (key === "gold-note") throw new DOMException("Synthetic storage failure", name);
      return original.call(this, key, value);
    };
  }, errorName);
}

if (process.env.NOTE_BASELINE_DIST) {
  test("the original production baseline reproduces false saved feedback and a null crash", async () =>
    withPage(
      "baseline reproduction",
      async page => {
        await page.goto(base + "/baseline/");
        await note(page).fill("Last good text");
        await page.waitForFunction(
          () => localStorage.getItem("gold-note") === JSON.stringify("Last good text")
        );
        await failWrites(page, "QuotaExceededError");
        await note(page).fill("Unsaved baseline edit");
        verify(
          (await stored(page)) === JSON.stringify("Last good text"),
          "baseline write failed and kept old storage"
        );
        verify(
          (await status(page).textContent()).includes("saved in localStorage"),
          "baseline falsely claims save"
        );
        await page.evaluate(() => {
          window.restoreNoteStorage();
          localStorage.setItem("gold-note", "null");
        });
        const crash = page.waitForEvent("pageerror");
        await page.reload();
        await crash;
        verify((await page.locator("main").count()) === 0, "baseline null destroys rendered app");
      },
      { baseline: true }
    ));
}

test("normal notes persist through a real production-page reload", async () =>
  withPage("normal persistence", async page => {
    await page.goto(base);
    await note(page).fill("Synthetic saved note");
    await saved(page);
    verify(
      (await stored(page)) === JSON.stringify("Synthetic saved note"),
      "writes actual browser localStorage"
    );
    await page.reload();
    verify((await note(page).inputValue()) === "Synthetic saved note", "reload restores text");
    verify((await status(page).getAttribute("aria-live")) === "polite", "save feedback is polite");
  }));

for (const errorName of ["QuotaExceededError", "SecurityError"]) {
  test(`${errorName} keeps edits in memory and retries after storage recovers`, async () =>
    withPage(errorName, async page => {
      await page.goto(base);
      await note(page).fill("Last successful note");
      await page.waitForFunction(
        () => localStorage.getItem("gold-note") === JSON.stringify("Last successful note")
      );
      await failWrites(page, errorName);
      await note(page).fill("Memory only edit");
      await page.waitForFunction(() =>
        document.querySelector("textarea + p").textContent.includes("kept in memory")
      );
      verify((await note(page).inputValue()) === "Memory only edit", "edit is retained");
      verify(
        (await stored(page)) === JSON.stringify("Last successful note"),
        "previous successful save is preserved"
      );
      verify(
        !(await status(page).textContent()).includes("saved in localStorage"),
        "no false success"
      );
      verify((await status(page).getAttribute("role")) === "status", "error is a status message");
      if (errorName === "QuotaExceededError") {
        if (output)
          await page.screenshot({ path: path.join(output, "warning-desktop.png"), fullPage: true });
        for (const width of [390, 320]) {
          await page.setViewportSize({ width, height: 950 });
          if (output)
            await page.screenshot({
              path: path.join(output, `warning-${width}.png`),
              fullPage: true,
            });
          const overflow = await page.evaluate(() =>
            [...document.querySelectorAll("body *")]
              .filter(el => el.getBoundingClientRect().right > innerWidth)
              .map(el => ({
                tag: el.tagName,
                class: el.className,
                right: el.getBoundingClientRect().right,
                width: el.getBoundingClientRect().width,
              }))
          );
          verify(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            `warning fits at ${width}: ${JSON.stringify(overflow)}`
          );
        }
      }
      await page.evaluate(() => window.restoreNoteStorage());
      await note(page).fill("Recovered text");
      await saved(page);
      verify((await stored(page)) === JSON.stringify("Recovered text"), "recovery writes new edit");
      await page.reload();
      verify((await note(page).inputValue()) === "Recovered text", "recovery survives reload");
    }));
}

test("malformed and non-text note values fall back without breaking the app", async () =>
  withPage("invalid stored values", async page => {
    await page.goto(base);
    for (const raw of ["null", "42", "{}", "[]", "false", "{invalid"]) {
      await page.evaluate(value => localStorage.setItem("gold-note", value), raw);
      await page.reload();
      await saved(page);
      verify((await note(page).inputValue()) === "", `${raw}: empty text fallback`);
      verify((await stored(page)) === JSON.stringify(""), `${raw}: safe saved text`);
      verify((await page.locator("section").count()) === 3, `${raw}: all demos mounted`);
    }
  }));

test("initially blocked storage still leaves the note editable", async () =>
  withPage("initial read/write denied", async page => {
    await page.addInitScript(() => {
      const read = Storage.prototype.getItem,
        write = Storage.prototype.setItem;
      Storage.prototype.getItem = function (key) {
        if (key === "gold-note") throw new DOMException("Synthetic read denied", "SecurityError");
        return read.call(this, key);
      };
      Storage.prototype.setItem = function (key, value) {
        if (key === "gold-note") throw new DOMException("Synthetic write denied", "SecurityError");
        return write.call(this, key, value);
      };
    });
    await page.goto(base);
    await note(page).fill("Still editable");
    await page.waitForFunction(() =>
      document.querySelector("textarea + p").textContent.includes("kept in memory")
    );
    verify(
      (await note(page).inputValue()) === "Still editable",
      "blocked initial storage keeps app usable"
    );
  }));

test("shopping-cart and previous-value demos retain their normal entry points", async () =>
  withPage("retained demos", async page => {
    await page.goto(base);
    await page.getByRole("button", { name: "Add", exact: true }).first().click();
    verify((await page.locator("main").textContent()).includes("Total: ₪250"), "cart add works");
    await page.getByRole("button", { name: "Clear cart", exact: true }).click();
    verify(
      (await page.locator("main").textContent()).includes("The cart is empty"),
      "cart clear works"
    );
    await page.getByRole("button", { name: "+1", exact: true }).click();
    verify(
      (await page.locator("main").textContent()).includes("Now: 1 · Before: 0"),
      "previous-value increment works"
    );
  }));

test("generic JSON callers and functional setters keep their original contract", async () =>
  withPage("generic hook", async page => {
    await page.goto(base + "/generic/tests/fixtures/generic.html");
    for (const value of [{ count: 7 }, ["first", "second"], null]) {
      await page.evaluate(
        data => localStorage.setItem("generic-probe", JSON.stringify(data)),
        value
      );
      await page.reload();
      await page.getByRole("button", { name: "Update generic value" }).waitFor();
      verify(
        (await page.locator("output").textContent()) === JSON.stringify(value),
        "generic JSON value is preserved"
      );
    }
    await page.getByRole("button", { name: "Update generic value" }).click();
    await page.waitForFunction(
      () => document.querySelector("output").textContent === JSON.stringify({ count: 1 })
    );
    verify(
      (await page.evaluate(() => localStorage.getItem("generic-probe"))) ===
        JSON.stringify({ count: 1 }),
      "functional setter persists"
    );
  }));
