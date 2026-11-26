const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const build = path.resolve(__dirname, "../dist");
const artifacts = process.env.TEST_ARTIFACT_DIR;
const results = [];
let server;
let browser;
let origin;

before(async () => {
  await fs.access(path.join(build, "index.html"));
  server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const file = path.resolve(build, `.${pathname === "/" ? "/index.html" : pathname}`);
      if (!file.startsWith(build + path.sep)) return response.writeHead(403).end();
      const contentType = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      };
      response.writeHead(200, {
        "Content-Type": contentType[path.extname(file)] || "application/octet-stream",
      });
      response.end(await fs.readFile(file));
    } catch {
      response.writeHead(404).end();
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
      JSON.stringify({ observedAt: new Date().toISOString(), results }, null, 2)
    );
});

async function scenario(name, options, instant, run) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  const failures = [];
  const external = [];
  let assertions = 0;
  const check = (actual, expected, label) => {
    assert.deepEqual(actual, expected, label);
    assertions++;
  };
  page.on("pageerror", error => errors.push(error.message));
  page.on("requestfailed", request => failures.push(request.url()));
  page.on("response", response => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  await page.route("**/*", route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  try {
    // Freeze time through the normal browser API; product code has no test hooks.
    const date = new Date(instant);
    await page.clock.install({ time: date });
    await page.clock.pauseAt(date);
    await page.addInitScript(() => {
      // Observe lifecycle cleanup without replacing the real callback behavior.
      const active = new Set();
      const start = window.setInterval.bind(window);
      const clear = window.clearInterval.bind(window);
      window.__clockIntervals = active;
      window.setInterval = (callback, delay, ...args) => {
        const id = start(callback, delay, ...args);
        if (delay === 1000) active.add(id);
        return id;
      };
      window.clearInterval = id => {
        active.delete(id);
        clear(id);
      };
    });
    await page.goto(origin);
    await page.getByRole("heading", { name: "Compass clock", exact: true }).waitFor();
    await run(page, check);
    check(errors, [], "No hard JavaScript errors");
    check(failures, [], "No failed local resources");
    check(external, [], "No external requests");
    const dimensions = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    check(dimensions.document <= dimensions.viewport, true, "No horizontal document overflow");
    if (artifacts)
      await page.screenshot({ path: path.join(artifacts, `${name}.png`), fullPage: true });
    results.push({
      name,
      status: "PASS",
      assertions,
      options,
      errors,
      failures,
      external,
      dimensions,
    });
  } finally {
    await context.close();
  }
}

test("desktop clock fields, dial angles, and a real interval tick agree", async () => {
  await scenario(
    "desktop-clock",
    { viewport: { width: 1440, height: 1000 }, timezoneId: "Asia/Jerusalem" },
    "2026-01-15T01:30:30Z",
    async (page, check) => {
      check(await page.getByTestId("clock-time").textContent(), "03:30:30", "24-hour local time");
      const expected = {
        weekday: "Thursday",
        year: "2026",
        month: "1",
        day: "15",
        hours: "3",
        minutes: "30",
        seconds: "30",
      };
      for (const [field, value] of Object.entries(expected))
        check(await page.locator(`[data-field="${field}"]`).textContent(), value, field);
      check(
        await page.locator('[data-hand="hour"]').getAttribute("transform"),
        "rotate(105.25 160 160)",
        "Fractional hour hand"
      );
      check(
        await page.locator('[data-hand="minute"]').getAttribute("transform"),
        "rotate(183 160 160)",
        "Fractional minute hand"
      );
      check(
        await page.locator('[data-hand="second"]').getAttribute("transform"),
        "rotate(180 160 160)",
        "Second hand"
      );
      await page.clock.runFor(1000);
      await page.getByTestId("clock-time").filter({ hasText: "03:30:31" }).waitFor();
      check(
        await page.locator('[data-field="seconds"]').textContent(),
        "31",
        "Fields advance with display"
      );
      check(
        await page.locator('[data-hand="second"]').getAttribute("transform"),
        "rotate(186 160 160)",
        "Dial advances too"
      );
    }
  );
});

test("mobile clock rolls year and weekday together in a different timezone", async () => {
  await scenario(
    "mobile-midnight",
    {
      viewport: { width: 390, height: 844 },
      timezoneId: "America/Los_Angeles",
      reducedMotion: "reduce",
    },
    "2026-01-01T07:59:59Z",
    async (page, check) => {
      check(await page.getByTestId("clock-time").textContent(), "23:59:59", "Before midnight");
      await page.clock.runFor(1000);
      await page.getByTestId("clock-time").filter({ hasText: "00:00:00" }).waitFor();
      for (const [field, value] of Object.entries({
        weekday: "Thursday",
        year: "2026",
        month: "1",
        day: "1",
      }))
        check(await page.locator(`[data-field="${field}"]`).textContent(), value, field);
      check(
        await page.locator('[data-hand="hour"]').getAttribute("transform"),
        "rotate(0 160 160)",
        "Midnight dial origin"
      );
      check(
        await page.getByTestId("clock-date").textContent(),
        "Thursday, 1 January 2026",
        "Readable date"
      );
    }
  );
});

test("unmount clears the interval and remount reads current wall time", async () => {
  await scenario(
    "lifecycle-recovery",
    { viewport: { width: 1280, height: 900 }, timezoneId: "UTC" },
    "2026-01-15T12:00:00Z",
    async (page, check) => {
      check(await page.evaluate(() => window.__clockIntervals.size), 1, "One active interval");
      await page.getByRole("button", { name: "Original widgets", exact: true }).click();
      check(
        await page.evaluate(() => window.__clockIntervals.size),
        0,
        "Interval removed on unmount"
      );
      await page.clock.fastForward(3600000);
      check(await page.getByTestId("clock-time").count(), 0, "Clock remains unmounted");
      await page.getByRole("button", { name: "Compass clock", exact: true }).click();
      check(
        await page.getByTestId("clock-time").textContent(),
        "13:00:00",
        "Remount reads actual wall time"
      );
      for (let index = 0; index < 3; index++) {
        await page.getByRole("button", { name: "Original widgets", exact: true }).click();
        check(await page.evaluate(() => window.__clockIntervals.size), 0, "No orphan timer");
        await page.getByRole("button", { name: "Compass clock", exact: true }).click();
        check(await page.evaluate(() => window.__clockIntervals.size), 1, "No duplicated timer");
      }
    }
  );
});

test("preserved widgets and keyboard navigation still work", async () => {
  await scenario(
    "original-widgets",
    { viewport: { width: 1440, height: 1000 }, timezoneId: "UTC" },
    "2026-01-15T12:00:00Z",
    async (page, check) => {
      await page.getByRole("button", { name: "Original widgets", exact: true }).focus();
      await page.keyboard.press("Enter");
      await page.getByRole("tab", { name: "CSS", exact: true }).click();
      check(
        await page.getByRole("tab", { name: "CSS", exact: true }).getAttribute("aria-selected"),
        "true",
        "Original tabs"
      );
      check(
        await page.getByText("The look of the page.", { exact: true }).count(),
        1,
        "Original tab content"
      );
      await page.getByRole("button", { name: "4 stars", exact: true }).click();
      check(
        await page.getByText("You rated 4 out of 5", { exact: true }).count(),
        1,
        "Original rating"
      );
      const box = await page.locator(".tracker").boundingBox();
      await page.mouse.move(box.x + 40, box.y + 50);
      const coordinates = (await page.locator(".tracker").textContent()).match(
        /x: (\d+), y: (\d+)/
      );
      // Fractional CSS positions round to device pixels when moving the mouse.
      // One pixel of tolerance still rejects viewport rather than box coordinates.
      check(Boolean(coordinates), true, "Original tracker reports coordinates");
      check(Math.abs(Number(coordinates[1]) - 40) <= 1, true, "Original relative mouse x");
      check(Math.abs(Number(coordinates[2]) - 50) <= 1, true, "Original relative mouse y");
    }
  );
});

test("small screen keeps all date fields and navigation accessible", async () => {
  await scenario(
    "small-screen",
    { viewport: { width: 320, height: 780 }, timezoneId: "Asia/Jerusalem" },
    "2026-01-15T01:30:30Z",
    async (page, check) => {
      check(await page.locator("[data-field]").count(), 7, "All date/time fields");
      check(
        await page
          .getByRole("button", { name: "Compass clock", exact: true })
          .getAttribute("aria-pressed"),
        "true",
        "Selected practice labelled"
      );
      check(
        await page.getByRole("img", { name: "Compass dial showing 03:30:30", exact: true }).count(),
        1,
        "Dial accessible name"
      );
    }
  );
});
