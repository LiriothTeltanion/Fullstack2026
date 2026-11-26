const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const root = path.resolve(__dirname, "..");
const output = process.env.QA_OUTPUT_DIR || path.join(root, ".qa");
const checks = [];
const external = [];
const pageErrors = [];
const requests = [];
let browser;
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const server = http.createServer(async (request, response) => {
  requests.push({ method: request.method, path: request.url });
  try {
    if (request.method !== "GET") {
      response.writeHead(405).end();
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const file = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(404).end();
      return;
    }
    const body = await fs.readFile(file);
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

(async () => {
  try {
    await fs.mkdir(output, { recursive: true });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({
      headless: true,
      ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
    });
    const context = await browser.newContext({ viewport: { width: 1366, height: 950 } });
    await context.route("**/*", route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.push(new URL(route.request().url()).origin);
      return route.abort();
    });
    const page = await context.newPage();
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#primary-links .nav-link").count(), 3);
    assert.equal(await page.locator("#primary-links .nav-link.active").innerText(), "About");
    assert.equal(await page.locator("#primary-links a[aria-current='page']").count(), 1);
    assert.match(await page.locator("#primary-links").innerText(), /Contact/);
    assert.equal(await page.locator("#primary-links .badge").count(), 1);
    assert.equal(await page.locator(".feature-icon").count(), 3);
    assert.equal(
      await page.locator(".feature").nth(2).getByText("New", { exact: true }).count(),
      1
    );
    const columns = await page
      .locator(".feature")
      .evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().y));
    assert.ok(columns.every(y => Math.abs(y - columns[0]) < 1));
    const header = await page
      .locator("#site-header")
      .evaluate(node => getComputedStyle(node).position);
    assert.equal(header, "fixed");
    await page.evaluate(() => scrollTo(0, 450));
    assert.equal(
      await page.locator("#site-header").evaluate(node => node.getBoundingClientRect().top),
      0
    );
    await page.evaluate(() => scrollTo(0, 0));
    assert.equal(await page.locator(".hero").evaluate(node => node.offsetWidth), 1366);
    const formPosition = await page.locator("#demo-form").boundingBox();
    const linksPosition = await page.locator("#primary-links").boundingBox();
    assert.ok(formPosition.x > linksPosition.x + linksPosition.width);
    checks.push(
      "Desktop: three links, initial active state, both badges, three icons/columns, full-width hero, right form and fixed header"
    );

    await page.click("#dropdown-toggle");
    assert.ok(await page.locator("#resource-menu").isVisible());
    await page.keyboard.press("Escape");
    assert.ok(await page.locator("#resource-menu").isHidden());
    assert.equal(await page.evaluate(() => document.activeElement.id), "dropdown-toggle");
    await page.keyboard.press("ArrowDown");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Layout examples");
    await page.keyboard.press("Escape");
    checks.push(
      "Dropdown: mouse activation, ArrowDown focus, Escape dismissal and focus restoration"
    );

    for (const button of await page.locator("[data-detail]").all()) {
      const target = await button.getAttribute("aria-controls");
      await button.click();
      assert.ok(await page.locator("#" + target).isVisible());
      assert.equal(await button.getAttribute("aria-expanded"), "true");
      await button.click();
      assert.ok(await page.locator("#" + target).isHidden());
    }
    await page.locator(".hero .btn-primary").click();
    assert.equal(new URL(page.url()).hash, "#features");
    checks.push(
      "Three detail controls toggle their own panels; primary action follows its real section link"
    );

    await page.locator("#demo-email").fill("example@example.invalid");
    await page.locator("#demo-password").fill(crypto.randomBytes(20).toString("hex"));
    const requestCount = requests.length;
    await page.locator("#demo-signin").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#demo-email").inputValue(), "");
    assert.equal(await page.locator("#demo-password").inputValue(), "");
    assert.match(await page.locator("#demo-status").innerText(), /Nothing was sent or saved/);
    assert.equal(requests.length, requestCount);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.deepEqual(await context.cookies(), []);
    checks.push(
      "Form: keyboard activation clears synthetic fields, announces demo boundary, sends no request and creates no storage/cookies"
    );

    for (const width of [390, 768, 1024, 1366]) {
      await page.setViewportSize({ width, height: 950 });
      const size = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      assert.ok(size.document <= size.viewport + 1, JSON.stringify(size));
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, "desktop.png") });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click("#menu-toggle");
    assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"), "true");
    assert.ok(await page.locator("#demo-email").isVisible());
    await page.getByRole("link", { name: "Home", exact: true }).click();
    assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"), "false");
    const top = await page
      .locator(".hero")
      .evaluate(node => node.getBoundingClientRect().top + scrollY);
    const height = await page.locator("#site-header").evaluate(node => node.offsetHeight);
    // Wait for the ResizeObserver after closing the expanded mobile header.
    await page.waitForFunction(
      () =>
        Math.abs(
          document.querySelector(".hero").getBoundingClientRect().top +
            scrollY -
            document.querySelector("#site-header").offsetHeight
        ) < 2
    );
    assert.ok(Number.isFinite(top) && height > 0);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, "mobile.png") });
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".btn-primary")
        .evaluate(node => getComputedStyle(node).transitionDuration),
      "0s"
    );
    checks.push(
      "Responsive: no overflow at390/768/1024/1366, mobile menu closes on navigation, dynamic header reservation, reduced motion"
    );

    assert.deepEqual(external, []);
    assert.deepEqual(pageErrors, []);
    assert.ok(requests.every(request => request.method === "GET"));
    const result = {
      status: "PASS",
      at: new Date().toISOString(),
      groups: checks,
      group_count: checks.length,
      page_errors: pageErrors,
      external_requests: external,
      non_get_requests: requests.filter(request => request.method !== "GET"),
      screenshots: ["desktop.png", "mobile.png"],
      limitations: "Main layout only; historical gallery checked by hashes, not its CDN behavior.",
    };
    await fs.writeFile(path.join(output, "receipt.json"), JSON.stringify(result, null, 2) + "\n");
    process.stdout.write(JSON.stringify(result) + "\n");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
