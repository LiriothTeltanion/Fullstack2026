import { expect, test } from "@playwright/test";

test("invalid prime limits stay editable and memoized buttons keep their distinct behavior", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const number = page.getByRole("spinbutton", { name: "Primes up to" });
  const result = page.locator("#prime-result");
  await expect(result).toContainText("2262 primes");
  for (const value of ["", "-4", "3.5", "200001"]) {
    await number.fill(value);
    await expect(number).toHaveValue(value);
    await expect(number).toHaveAttribute("aria-invalid", "true");
    await expect(result).toHaveText(/whole number/);
  }
  await number.fill("10");
  await expect(result).toHaveText(/Found 4 primes.*last one is 7/);
  const before = await result.textContent();
  await page.getByRole("button", { name: "Toggle box color" }).click();
  await expect(result).toHaveText(before);
  const stable = page.getByRole("button", { name: /^With useCallback/ });
  const fresh = page.getByRole("button", { name: /^Without useCallback/ });
  const first = await stable.textContent();
  const second = await fresh.textContent();
  await page.getByRole("textbox", { name: "Parent render input" }).fill("x");
  await expect(stable).toHaveText(first);
  await expect(fresh).not.toHaveText(second);
  await stable.click();
  await fresh.click();
  await expect(page.getByText("Count: 2", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("typing coalesces into one lookup and a failed lookup can be retried", async ({ page }) => {
  let calls = 0;
  await page.route("https://jsonplaceholder.typicode.com/users", route => {
    calls++;
    return route.fulfill({
      status: calls === 1 ? 503 : 200,
      json: calls === 1 ? [] : [{ id: 1, name: "Mina" }],
    });
  });
  await page.goto("/");
  const search = page.getByRole("textbox", { name: "Search users by name" });
  await search.pressSequentially("min", { delay: 30 });
  await expect(page.getByText("Could not load users.")).toBeVisible();
  expect(calls).toBe(1);
  await page.getByRole("button", { name: "Retry search" }).click();
  await expect(page.getByRole("listitem")).toHaveText("Mina");
  await expect(search).toHaveValue("min");
  await search.fill("unknown");
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByText("No matching users.")).toBeVisible();
  await search.fill("");
  await expect(page.getByText("No matching users.")).toHaveCount(0);
  expect(calls).toBe(3);
});

test("clearing a search while its response is pending keeps stale matches hidden", async ({ page }) => {
  let release;
  let received = false;
  const hold = new Promise(resolve => { release = resolve; });
  await page.route("https://jsonplaceholder.typicode.com/users", async route => {
    received = true;
    await hold;
    await route.fulfill({ json: [{ id: 4, name: "Tea" }] });
  });
  await page.goto("/");
  const search = page.getByRole("textbox", { name: "Search users by name" });
  await search.fill("tea");
  await expect.poll(() => received).toBe(true);
  const cancelled = page.waitForEvent("requestfailed", {
    predicate: request => request.url() === "https://jsonplaceholder.typicode.com/users",
  });
  await search.fill("");
  await cancelled;
  release();
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByText("Could not load users.")).toHaveCount(0);
  await expect(search).toHaveValue("");
});
