const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const build = path.resolve(__dirname, "../dist");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
let server;
let browser;
let origin;
const artifacts = process.env.TEST_ARTIFACT_DIR;
const report = [];
const apiUrl = "https://picsum.photos/v2/list?page=0&limit=2";
const apiFixture = [
  { id: "0", author: "Test illustrator A" },
  { id: "1", author: "Test illustrator B" },
];

before(async () => {
  await fs.access(path.join(build, "index.html"));
  // The server cannot escape dist and exposes no development or external services.
  server = http.createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const file = path.resolve(build, `.${relative === "/" ? "/index.html" : relative}`);
      if (!file.startsWith(`${build}${path.sep}`)) {
        res.writeHead(403).end();
        return;
      }
      const bytes = await fs.readFile(file);
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  const channel = process.env.BROWSER_CHANNEL;
  browser = await chromium.launch({
    headless: true,
    ...(channel && channel !== "chromium" ? { channel } : {}),
  });
  if (artifacts) await fs.mkdir(artifacts, { recursive: true });
});

after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  if (artifacts)
    await fs.writeFile(
      path.join(artifacts, "browser-results.json"),
      JSON.stringify({ observedAt: new Date().toISOString(), cases: report }, null, 2)
    );
});

async function scenario(name, viewport, run) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const failures = [];
  const external = [];
  const expectedErrors = [];
  const unexpectedErrors = [];
  let fixtureRequests = 0;
  // Production React reports caught demonstration errors to console.error. Only
  // those specific messages are accepted; unrelated failures remain test failures.
  const intentional = text =>
    /Minified React error #31|Objects are not valid as a React child|I crashed!|Error boundary caught a render error:|Event handler error handled locally:/.test(
      text
    );
  page.on("console", message => {
    if (message.type() === "error")
      (intentional(message.text()) ||
      ((name === "image-retry" || name === "image-fallback") &&
        message.text() === "Failed to load resource: net::ERR_FAILED")
        ? expectedErrors
        : unexpectedErrors
      ).push(message.text());
  });
  page.on("pageerror", error => unexpectedErrors.push(error.message));
  page.on("response", response => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${new URL(response.url()).pathname}`);
  });
  await context.route("**/*", route => {
    // Stub the API contract and its images, not application components. No remote
    // service is contacted by the regression suite, even when its API is healthy.
    if (route.request().url() === apiUrl) {
      fixtureRequests++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiFixture),
      });
    }
    if (/^https:\/\/picsum\.photos\/id\/[01]\/640\/360$/.test(route.request().url())) {
      fixtureRequests++;
      return route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        path: path.join(
          build,
          "images",
          route.request().url().includes("/id/0/") ? "quiet-harbor.svg" : "night-studio.svg"
        ),
      });
    }
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  try {
    await page.goto(origin);
    await run(page, expectedErrors, failures);
    assert.deepEqual(external, [], "No external application requests");
    assert.deepEqual(unexpectedErrors, [], "No unexplained JavaScript errors");
    assert.deepEqual(failures, [], "No failed local resources");
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      "No horizontal overflow"
    );
    if (artifacts)
      await page.screenshot({ path: path.join(artifacts, `${name}.png`), fullPage: true });
    report.push({
      name,
      viewport,
      status: "PASS",
      expectedErrors: expectedErrors.length,
      externalRequests: external.length,
      offlineFixtureRequests: fixtureRequests,
    });
  } finally {
    await context.close();
  }
}

for (const [label, viewport] of Object.entries({
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
})) {
  test(`${label}: images, paragraph isolation, recovery and event handler`, async () => {
    await scenario(label, viewport, async (page, expectedErrors) => {
      await page.getByRole("button", { name: "Get images", exact: true }).click();
      const images = page.locator(".illustrations img");
      await images.first().waitFor();
      assert.equal(await images.count(), 2);
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".illustrations img")].every(
          img => img.complete && img.naturalWidth > 0
        )
      );
      assert.equal(
        await images.evaluateAll(nodes => nodes.every(img => img.complete && img.naturalWidth > 0)),
        true
      );
      const columns = await page.locator(".practice-card").evaluateAll(nodes =>
        nodes.map(node => ({
          x: node.getBoundingClientRect().x,
          y: node.getBoundingClientRect().y,
        }))
      );
      assert.equal(
        label === "desktop" ? columns[0].y === columns[1].y : columns[0].y < columns[1].y,
        true
      );
      await page.getByRole("button", { name: "Replace string with object" }).click();
      await page.getByText("Only this paragraph needs a restart.", { exact: true }).waitFor();
      assert.equal(await page.locator(".paragraph-slot [role=alert]").count(), 1);
      assert.equal(await page.locator(".text-column > p").first().isVisible(), true);
      assert.equal(await images.count(), 2);
      await page.getByRole("button", { name: "Get images", exact: true }).click();
      await page.getByRole("button", { name: "Get images", exact: true }).waitFor();
      assert.equal(await page.locator(".paragraph-slot [role=alert]").count(), 1);
      await page.locator(".paragraph-slot summary").click();
      assert.match(await page.locator(".paragraph-slot pre").textContent(), /ObjectParagraph|at /);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false
      );
      if (artifacts)
        await page.screenshot({
          path: path.join(artifacts, `${label}-paragraph-fallback.png`),
          fullPage: true,
        });
      await page.getByRole("button", { name: "Restore paragraph" }).click();
      await page.locator(".object-paragraph").waitFor();
      assert.match(await page.locator(".object-paragraph").textContent(), /I live to crash/);
      assert.equal(await page.locator(".crash").count(), 0);
      const beforeEvent = expectedErrors.length;
      await page.getByRole("button", { name: "Invoke event handler" }).click();
      await page.getByRole("status").filter({ hasText: "handled locally" }).waitFor();
      assert.equal(await page.locator(".crash").count(), 0);
      assert.equal(
        expectedErrors
          .slice(beforeEvent)
          .some(text => text.includes("Event handler error handled locally:")),
        true
      );
      assert.equal(
        expectedErrors.some(text => text.includes("Error boundary caught a render error:")),
        true
      );
      assert.equal(await images.count(), 2);
    });
  });
}

test("image request loading, failure, malformed data and retry", async () => {
  await scenario("image-retry", { width: 390, height: 844 }, async page => {
    let release;
    let requestStarted;
    const requested = new Promise(resolve => {
      requestStarted = resolve;
    });
    await page.route(apiUrl, async route => {
      requestStarted();
      await new Promise(resolve => {
        release = resolve;
      });
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    });
    await page.getByRole("button", { name: "Get images", exact: true }).click();
    await requested;
    assert.equal(await page.getByRole("button", { name: "Loading images…" }).isDisabled(), true);
    release();
    await page.getByRole("status").filter({ hasText: "original local illustrations" }).waitFor();
    assert.equal(await page.locator(".illustrations img").count(), 2);
    await page.unroute(apiUrl);
    await page.route(apiUrl, route =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" })
    );
    await page.route("**/images.json", route =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"images":[]}' })
    );
    await page.getByRole("button", { name: "Get images", exact: true }).click();
    await page.getByRole("alert").filter({ hasText: "could not load" }).waitFor();
    await page.unroute("**/images.json");
    await page.route("**/images.json", route => route.abort("failed"));
    await page.getByRole("button", { name: "Get images", exact: true }).click();
    await page.getByRole("button", { name: "Get images", exact: true }).waitFor();
    assert.equal(await page.getByRole("alert").filter({ hasText: "could not load" }).count(), 1);
    await page.unroute("**/images.json");
    await page.unroute(apiUrl);
    await page.getByRole("button", { name: "Get images", exact: true }).click();
    await page.locator(".illustrations img").first().waitFor();
    assert.equal(await page.getByRole("alert").count(), 0);
    assert.equal(await page.locator(".illustrations img").count(), 2);
  });
});

test("failed remote image loads fall back to labelled original illustrations", async () => {
  await scenario("image-fallback", { width: 1440, height: 1000 }, async page => {
    await page.route("https://picsum.photos/id/**", route => route.abort("failed"));
    await page.getByRole("button", { name: "Get images", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "original local illustrations" }).waitFor();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".illustrations img")].every(
        img => img.complete && img.naturalWidth > 0
      )
    );
    assert.equal(await page.locator(".illustrations img").count(), 2);
    assert.equal(
      await page
        .locator(".illustrations img")
        .evaluateAll(images => images.every(img => new URL(img.src).origin === location.origin)),
      true
    );
  });
});

test("preserved shared, separate and whole-app counter boundaries recover", async () => {
  await scenario("counter-simulations", { width: 1440, height: 1000 }, async page => {
    await page.getByRole("link", { name: "Counter simulations" }).click();
    await page.getByRole("heading", { name: "Week 8 Day 1 · Error Boundary" }).waitFor();
    const sections = page.locator("main section");
    for (let i = 0; i < 5; i++) await sections.nth(0).locator(".counter").first().click();
    assert.equal(await sections.nth(0).locator(".counter").count(), 0);
    await sections.nth(0).getByRole("button", { name: "Try again" }).click();
    assert.deepEqual(await sections.nth(0).locator(".counter").allTextContents(), ["0", "0"]);
    for (let i = 0; i < 5; i++) await sections.nth(1).locator(".counter").first().click();
    assert.equal(await sections.nth(1).locator(".counter").count(), 1);
    await sections.nth(1).locator(".counter").click();
    assert.equal(await sections.nth(1).locator(".counter").textContent(), "1");
    for (let i = 0; i < 5; i++) await sections.nth(2).locator(".counter").click();
    await page.getByText("The whole app crashed.", { exact: true }).waitFor();
    assert.equal(await page.locator("header").count(), 0);
    await page.getByRole("button", { name: "Try again" }).click();
    await page.getByRole("link", { name: "Paragraph boundary" }).click();
    await page.locator(".object-paragraph").waitFor();
  });
});
