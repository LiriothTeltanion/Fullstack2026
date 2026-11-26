const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const output = path.join(__dirname, "test-results");
fs.mkdirSync(output, { recursive: true });
const result = { checks: [], pageErrors: [], failedResources: [], externalRequests: [] };
const check = (name, value, context) => {
  result.checks.push({ name, pass: Boolean(value), context });
  assert.ok(value, `${name}: ${JSON.stringify(context)}`);
};
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const file = path.join(root, pathname === "/" ? "index.html" : pathname);
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile())
    return response.writeHead(404).end();
  response.setHeader("Content-Type", file.endsWith(".css") ? "text/css" : "text/html");
  response.end(fs.readFileSync(file));
});

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PW_CHANNEL
      ? { channel: process.env.PW_CHANNEL }
      : process.platform === "win32"
        ? { channel: "msedge" }
        : {}),
  });
  try {
    const page = await browser.newPage();
    page.on("pageerror", error => result.pageErrors.push(error.message));
    page.on("response", response => {
      if (response.status() >= 400) result.failedResources.push(response.url());
    });
    await page.route("**/*", route => {
      if (route.request().url().startsWith(origin)) return route.continue();
      result.externalRequests.push(route.request().url());
      return route.abort();
    });
    for (const width of [1280, 768, 701, 700, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const file of ["index.html", "bakery.html", "fitness.html", "travel.html"]) {
        const context = { width, file };
        await page.goto(`${origin}/${file}`);
        check(
          "one visible heading",
          (await page.locator("h1").count()) === 1 && (await page.locator("h1").isVisible()),
          context
        );
        const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        check("document fits viewport", documentWidth <= width, { ...context, documentWidth });
        for (const href of await page
          .locator("a[href]")
          .evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))) {
          const exists = href.startsWith("#")
            ? (await page.locator(`[id="${href.slice(1)}"]`).count()) === 1
            : fs.existsSync(path.join(root, href));
          check("navigation target exists", exists, { ...context, href });
        }
        if (file === "index.html") {
          check("three landing choices", (await page.locator(".hub-card").count()) === 3, context);
          await page.keyboard.press("Tab");
          check(
            "first card receives keyboard focus",
            await page
              .locator(".hub-card")
              .first()
              .evaluate(node => document.activeElement === node),
            context
          );
          await Promise.all([page.waitForURL("**/bakery.html"), page.keyboard.press("Enter")]);
          check("Enter opens bakery", page.url().endsWith("/bakery.html"), context);
          await page.getByRole("link", { name: "All pages", exact: true }).click();
          check("All pages returns to hub", page.url().endsWith("/index.html"), context);
          await page.emulateMedia({ reducedMotion: "reduce" });
          check(
            "reduced motion removes hub transition",
            await page
              .locator(".hub-card")
              .first()
              .evaluate(node => getComputedStyle(node).transitionDuration === "0s"),
            context
          );
          await page.emulateMedia({ reducedMotion: "no-preference" });
        } else {
          await page.getByRole("link", { name: "All pages", exact: true }).click();
          check("landing returns to hub", page.url().endsWith("/index.html"), context);
          await page.goto(`${origin}/${file}`);
        }
        if (file === "bakery.html") {
          await page.getByRole("link", { name: "See the menu", exact: true }).click();
          check("menu anchor works", page.url().endsWith("#menu"), context);
          check(
            "six menu items remain",
            (await page.locator(".menu-grid > li").count()) === 6,
            context
          );
        }
        if (file === "fitness.html") {
          await page.getByRole("link", { name: "Book a free class", exact: true }).click();
          check("gym link reaches plans", page.url().endsWith("#plans"), context);
        }
        if (file === "travel.html") {
          const boxes = await page.locator(".travel-hero, .trip").evaluateAll(nodes =>
            nodes.map(node => {
              const r = node.getBoundingClientRect();
              return { x: r.x, y: r.y, bottom: r.bottom };
            })
          );
          check("three travel cards remain", boxes.length === 4, context);
          if (width <= 700)
            check(
              "phone cards stack below the hero",
              boxes.slice(1).every((box, i) => box.x === boxes[0].x && box.y >= boxes[i].bottom),
              { ...context, boxes }
            );
          else
            check(
              "desktop cards retain overlap",
              boxes.slice(1).every(box => box.y < boxes[0].bottom),
              context
            );
          if ([1280, 390, 320].includes(width))
            await page.screenshot({
              path: path.join(output, `travel-${width}.png`),
              fullPage: true,
            });
        }
      }
    }
    check("no page errors", result.pageErrors.length === 0);
    check("no failed local resources", result.failedResources.length === 0);
    check("no external requests", result.externalRequests.length === 0);
    result.status = "PASS";
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
    fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(result, null, 2));
  }
  console.log(JSON.stringify({ status: result.status, checks: result.checks.length }));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
