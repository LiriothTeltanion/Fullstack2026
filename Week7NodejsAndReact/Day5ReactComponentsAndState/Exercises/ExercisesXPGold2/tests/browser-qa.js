import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

// A real production build is served on an ephemeral loopback port. Each viewport
// gets a new browser context; no personal browser profile or service is used.
const root = fileURLToPath(new URL("../dist/", import.meta.url));
const out = process.env.FORMS_QA_OUTPUT || fileURLToPath(new URL("./artifacts/", import.meta.url));
await mkdir(out, { recursive: true });
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const path = resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname)
    );
    if (path !== resolve(root) && !path.startsWith(resolve(root) + sep))
      throw new Error("Invalid path");
    const file = path === resolve(root) ? resolve(root, "index.html") : path;
    res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise(done => server.listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
let checks = 0;
const errors = [],
  external = [],
  failures = [],
  views = [];
function check(value, description) {
  assert.ok(value, description);
  checks++;
}
async function focusIs(locator) {
  return locator.evaluate(el => globalThis.document.activeElement === el);
}
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.FORMS_BROWSER_CHANNEL ? { channel: process.env.FORMS_BROWSER_CHANNEL } : {}),
    ...(process.env.FORMS_BROWSER_EXECUTABLE
      ? { executablePath: process.env.FORMS_BROWSER_EXECUTABLE }
      : {}),
  });
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", r => {
      if (r.url().startsWith(origin) && r.status() >= 400)
        failures.push(`${r.status()} ${r.url()}`);
    });
    await page.route("**/*", route => {
      if (
        route
          .request()
          .url()
          .startsWith(origin + "/")
      )
        return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    await page.goto(origin);
    await page.getByRole("heading", { name: "React & Forms", exact: true }).waitFor();
    check((await page.locator("#root").innerText()) !== "", "rendered root");
    const profile = page.getByRole("form", { name: "Profile form", exact: true });
    const practice = page.getByRole("form", { name: "Practice preferences", exact: true });
    const name = profile.getByLabel("Full name", { exact: true });
    const email = profile.getByLabel("Email address", { exact: true });
    const topic = practice.getByLabel("Practice topic", { exact: true });
    const notes = practice.getByLabel("Practice notes (optional)", { exact: true });
    const profileResult = profile.locator("..").getByRole("status");
    const practiceResult = practice.locator("..").getByRole("status");
    await profile.getByRole("button", { name: "Preview profile", exact: true }).click();
    check(await focusIs(name), "empty submit focuses name");
    check((await name.getAttribute("aria-invalid")) === "true", "name invalid semantics");
    check((await email.getAttribute("aria-invalid")) === "true", "email invalid semantics");
    check(
      await name.evaluate(el =>
        globalThis.document
          .getElementById(el.getAttribute("aria-describedby"))
          ?.textContent.includes("Enter")
      ),
      "error association"
    );
    await name.press("Tab");
    check(await focusIs(email), "normal keyboard order reaches email");
    if (width === 320 || width === 1440) {
      await page.screenshot({ path: resolve(out, `forms-errors-${width}.png`), fullPage: true });
    }
    await name.fill("  נועה García  ");
    await email.fill("invalid");
    await profile.getByRole("button", { name: "Preview profile", exact: true }).click();
    check(await focusIs(email), "malformed email receives focus");
    check((await name.inputValue()) === "  נועה García  ", "invalid submit preserves name");
    check((await profileResult.innerText()) === "", "invalid submit does not show success");
    await email.fill("learner@example.test");
    await email.press("Enter");
    check(
      (await profileResult.innerText()).includes("Profile preview ready"),
      "Enter submits profile"
    );
    check(
      (await profileResult.innerText()).includes("נועה García"),
      "trimmed international profile"
    );
    check((await email.getAttribute("aria-invalid")) === "false", "email recovers");

    await practice.getByRole("button", { name: "Preview practice", exact: true }).click();
    check(await focusIs(topic), "missing topic receives focus");
    await topic.selectOption("Accessible forms");
    await practice.getByLabel("Focused", { exact: true }).check();
    await practice.getByLabel("Include a reminder in this preview", { exact: true }).check();
    await notes.fill("🌱".repeat(301));
    await practice.getByRole("button", { name: "Preview practice", exact: true }).click();
    check(await focusIs(notes), "long notes receive focus");
    check((await notes.getAttribute("aria-invalid")) === "true", "long notes invalid semantics");
    check((await topic.inputValue()) === "Accessible forms", "failed submit preserves select");
    await notes.fill("🌱".repeat(300));
    await practice.getByRole("button", { name: "Preview practice", exact: true }).click();
    check(
      (await practiceResult.innerText()).includes("Practice preview ready"),
      "300 code points accepted"
    );
    check(
      (await practiceResult.innerText()).includes("Included in preview"),
      "checkbox boolean saved"
    );
    check((await practiceResult.innerText()).includes("focused"), "radio selection saved");
    check(
      (await profileResult.innerText()).includes("Profile preview ready"),
      "forms keep independent state"
    );
    await notes.fill("  Keyboard navigation first.  ");
    check((await practiceResult.innerText()) === "", "editing clears stale success");
    await practice.getByRole("button", { name: "Preview practice", exact: true }).click();
    check(
      (await practiceResult.innerText()).includes("Keyboard navigation first."),
      "normal text preview"
    );
    await page.getByRole("button", { name: "Dark mode" }).click();
    check((await page.locator("main").getAttribute("class")) === "dark", "dark theme preserved");
    check((await topic.inputValue()) === "Accessible forms", "theme preserves form state");
    check(
      (await profileResult.innerText()).includes("Profile preview ready"),
      "theme preserves submitted state"
    );

    const calculator = page
      .locator("form")
      .filter({ has: page.getByLabel("First number", { exact: true }) });
    await calculator.getByRole("button", { name: "=", exact: true }).click();
    check(
      (await calculator.locator("output").innerText()).includes("Fill in both"),
      "legacy calculator error"
    );
    await calculator.getByLabel("First number", { exact: true }).fill("12");
    await calculator.getByLabel("Second number", { exact: true }).fill("3");
    await calculator.getByLabel("Operation", { exact: true }).selectOption("÷");
    await calculator.getByRole("button", { name: "=", exact: true }).click();
    check((await calculator.locator("output").innerText()) === "4", "legacy calculator success");
    await calculator.getByLabel("Second number", { exact: true }).fill("0");
    await calculator.getByRole("button", { name: "=", exact: true }).click();
    check(
      (await calculator.locator("output").innerText()) === "Cannot divide by 0",
      "legacy division guard"
    );
    const add = page.getByPlaceholder("Add an item");
    await add.fill("Lemons");
    await add.press("Enter");
    check((await page.getByLabel("Lemons", { exact: true }).count()) === 1, "legacy shopping add");
    await page.getByLabel("Lemons", { exact: true }).check();
    check(await page.getByLabel("Lemons", { exact: true }).isChecked(), "legacy shopping toggle");
    await page.getByRole("button", { name: "Remove Lemons", exact: true }).click();
    check(
      (await page.getByLabel("Lemons", { exact: true }).count()) === 0,
      "legacy shopping removal"
    );
    check(
      await page.evaluate(
        () => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth
      ),
      "no horizontal overflow"
    );
    check(
      await page.evaluate(() => {
        const ids = [...globalThis.document.querySelectorAll("[id]")].map(el => el.id);
        return new Set(ids).size === ids.length;
      }),
      "unique control IDs"
    );
    check(
      await page.evaluate(() =>
        [
          ...globalThis.document.querySelectorAll(
            ".practice-card input,.practice-card select,.practice-card textarea"
          ),
        ].every(el => el.labels.length > 0)
      ),
      "all new controls labeled"
    );
    check(
      await page.evaluate(
        () =>
          localStorage.length === 0 &&
          sessionStorage.length === 0 &&
          globalThis.document.cookie === ""
      ),
      "no storage or cookies"
    );
    await page.screenshot({ path: resolve(out, `forms-dark-${width}.png`), fullPage: true });
    await practice.getByRole("button", { name: "Reset practice", exact: true }).click();
    check(await focusIs(topic), "reset restores focus");
    check((await topic.inputValue()) === "", "reset controlled select");
    check(await practice.getByLabel("Steady", { exact: true }).isChecked(), "reset radio default");
    check(
      !(await practice
        .getByLabel("Include a reminder in this preview", { exact: true })
        .isChecked()),
      "reset checkbox"
    );
    check((await notes.inputValue()) === "", "reset textarea");
    check((await practiceResult.innerText()) === "", "reset success message");
    check(
      (await profileResult.innerText()).includes("Profile preview ready"),
      "reset is form-local"
    );
    await profile.getByRole("button", { name: "Reset profile", exact: true }).click();
    check(await focusIs(name), "profile reset focus");
    check(
      (await name.inputValue()) === "" && (await email.inputValue()) === "",
      "profile reset controlled text"
    );
    check((await profileResult.innerText()) === "", "profile reset preview");
    check((await name.getAttribute("aria-invalid")) === "false", "profile reset errors");
    await name.fill("<b>Safe text</b>");
    await email.fill("learner@example.test");
    await profile.getByRole("button", { name: "Preview profile", exact: true }).click();
    check(
      (await profileResult.innerText()).includes("<b>Safe text</b>"),
      "preview escapes markup as text"
    );
    check((await profileResult.locator("b").count()) === 0, "preview inserts no HTML element");
    await name.fill("Updated name");
    check((await profileResult.innerText()) === "", "profile editing clears stale preview");
    await profile.getByRole("button", { name: "Reset profile", exact: true }).click();
    await page.getByRole("button", { name: "Light mode" }).click();
    await page.screenshot({ path: resolve(out, `forms-light-${width}.png`), fullPage: true });
    views.push({ width, checks });
    await context.close();
  }
  check(errors.length === 0, "no hard page errors");
  check(external.length === 0, "no external requests");
  check(failures.length === 0, "local scripts and CSS served successfully");
  await writeFile(
    resolve(out, "browser-results.json"),
    JSON.stringify(
      {
        status: "PASS",
        checks,
        views,
        errors,
        external,
        failures,
        browser: await browser.version(),
      },
      null,
      2
    )
  );
  console.log(`PASS: ${checks} browser assertions; evidence: ${out}`);
} finally {
  await browser?.close();
  await new Promise(done => server.close(done));
}
