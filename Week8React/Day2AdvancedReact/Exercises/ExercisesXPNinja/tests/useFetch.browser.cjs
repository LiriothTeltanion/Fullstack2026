const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const tag = "regression";
const output = path.join(__dirname, "test-results");
fs.mkdirSync(output, { recursive: true });
const results = { tag, root, checks: [], defects: [], pageErrors: [], externalRequests: [] };
const check = (name, value) => {
  results.checks.push({ name, pass: Boolean(value) });
  assert.ok(value, name);
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const file = path.join(root, "dist", pathname === "/" ? "index.html" : pathname);
  if (!file.startsWith(path.join(root, "dist")) || !fs.existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader(
    "Content-Type",
    file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html"
  );
  response.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    ...(process.env.PW_CHANNEL
      ? { channel: process.env.PW_CHANNEL }
      : process.platform === "win32"
        ? { channel: "msedge" }
        : {}),
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", error => results.pageErrors.push(error.message));
    let mode = "normal";
    const calls = [];
    await page.route("**/*", async route => {
      const requestUrl = route.request().url();
      if (requestUrl.startsWith(url)) return route.continue();
      if (!requestUrl.startsWith("https://jsonplaceholder.typicode.com/")) {
        results.externalRequests.push(requestUrl);
        return route.abort();
      }
      const pathname = new URL(requestUrl).pathname;
      calls.push(pathname);
      const currentMode = mode;
      if (pathname === "/users" && currentMode === "users-error")
        return route.fulfill({ status: 503, body: "{}" });
      if (pathname === "/posts" && currentMode === "posts-error") return route.abort("failed");
      if (pathname.startsWith("/todos/")) {
        const id = Number(pathname.split("/").pop());
        await delay(id === 2 ? 1000 : 40);
        if (id === 4) return route.fulfill({ status: 503, body: "{}" });
        return route.fulfill({
          json: { id, title: `Original test task ${id}`, completed: id % 2 === 0 },
        });
      }
      if (pathname === "/users") {
        await delay(100);
        return route.fulfill({
          json: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            name: i === 0 ? "Ada Test" : `User ${i + 1}`,
            email: `user${i + 1}@example.test`,
          })),
        });
      }
      if (pathname === "/posts") {
        await delay(150);
        return route.fulfill({
          json:
            currentMode === "empty"
              ? []
              : Array.from({ length: 100 }, (_, i) => ({
                  id: i + 1,
                  title: `Original test post ${i + 1}`,
                })),
        });
      }
      return route.abort();
    });
    await page.goto(url);
    const todo = page.locator("section").nth(0),
      users = page.locator("section").nth(1),
      posts = page.locator("section").nth(2);
    await todo.getByText("#1 Original test task 1", { exact: false }).waitFor();
    check(
      "first todo cannot go below one",
      await todo.getByRole("button", { name: "Previous", exact: true }).isDisabled()
    );
    await users.getByPlaceholder("Search by name").waitFor();
    check("all ten users visible", (await users.locator("li").count()) === 10);
    const userFetches = calls.filter(p => p === "/users").length;
    await users.getByPlaceholder("Search by name").fill("aDA");
    check("case insensitive search", (await users.locator("li").count()) === 1);
    check("search counter", await users.getByText("1 of 10 users", { exact: true }).isVisible());
    await users.getByPlaceholder("Search by name").fill("does-not-exist");
    check(
      "zero search results",
      await users.getByText("0 of 10 users", { exact: true }).isVisible()
    );
    await users.getByPlaceholder("Search by name").fill("");
    check("search reuses fetched array", calls.filter(p => p === "/users").length === userFetches);
    await posts.getByText("Page 1 of 20", { exact: true }).waitFor();
    check("five posts initially", (await posts.locator("li").count()) === 5);
    check(
      "first page previous disabled",
      await posts.getByRole("button", { name: "Previous", exact: true }).isDisabled()
    );
    for (let i = 2; i <= 20; i++) {
      await posts.getByRole("button", { name: "Next", exact: true }).click();
      check(`page ${i} has five posts`, (await posts.locator("li").count()) === 5);
    }
    check("last page label", await posts.getByText("Page 20 of 20", { exact: true }).isVisible());
    check(
      "last page next disabled",
      await posts.getByRole("button", { name: "Next", exact: true }).isDisabled()
    );
    check("last page starts at96", (await posts.locator("ol").getAttribute("start")) === "96");
    await todo.getByRole("button", { name: "Next", exact: true }).click();
    await todo.getByText("Loading todo 2…", { exact: true }).waitFor();
    check(
      "slow todo loading shown",
      await todo.getByText("Loading todo 2…", { exact: true }).isVisible()
    );
    await todo.getByRole("button", { name: "Next", exact: true }).click();
    await todo.getByText("#3 Original test task 3", { exact: false }).waitFor();
    await delay(1100);
    check(
      "old slow answer cannot overwrite task3",
      (await todo.textContent()).includes("#3 Original test task 3") &&
        !(await todo.textContent()).includes("#2 Original test task 2")
    );
    await todo.getByRole("button", { name: "Next", exact: true }).click();
    await todo.getByText("Error: HTTP 503", { exact: true }).waitFor();
    const stale = (await todo.textContent()).includes("#3 Original test task 3");
    if (stale)
      results.defects.push({
        name: "stale-success-shown-after-error",
        detail: "Request for task4 failed503 but task3 success remained visible beside the error.",
      });
    check("failed request never presents previous todo as current", !stale);
    await page.screenshot({ path: path.join(output, `${tag}-desktop.png`), fullPage: true });
    await todo.getByRole("button", { name: "Next", exact: true }).click();
    await todo.getByText("#5 Original test task 5", { exact: false }).waitFor();
    check("URL change recovers after HTTP error", (await todo.locator(".error").count()) === 0);
    check("sibling search persists", (await users.locator("li").count()) === 10);
    check(
      "sibling page persists",
      await posts.getByText("Page 20 of 20", { exact: true }).isVisible()
    );
    mode = "users-error";
    await page.reload();
    await users.getByText("Error: HTTP 503", { exact: true }).waitFor();
    check(
      "users HTTP error surfaced",
      await users.getByText("Error: HTTP 503", { exact: true }).isVisible()
    );
    mode = "posts-error";
    await page.reload();
    await posts.locator(".error").waitFor();
    check(
      "posts network error surfaced",
      (await posts.locator(".error").textContent()).includes("Error:")
    );
    mode = "normal";
    await page.reload();
    await users.getByText("10 of 10 users", { exact: true }).waitFor();
    await posts.getByText("Page 1 of 20", { exact: true }).waitFor();
    check(
      "reload recovery users and posts",
      await posts.getByText("Page 1 of 20", { exact: true }).isVisible()
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(output, `${tag}-mobile.png`), fullPage: true });
    check(
      "mobile has no horizontal overflow",
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
    );
    check("no runtime page errors", results.pageErrors.length === 0);
    results.status = results.defects.length ? "REPRODUCED_DEFECT" : "PASS";
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
    fs.writeFileSync(path.join(output, `${tag}-qa.json`), JSON.stringify(results, null, 2));
  }
  console.log(
    JSON.stringify({
      status: results.status,
      checks: results.checks.length,
      defects: results.defects,
    })
  );
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
