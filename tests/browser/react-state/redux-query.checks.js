import { expect, test } from "@playwright/test";

async function fixture(page) {
  const pending = [];
  const unexpected = [];
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === "127.0.0.1") return route.continue();
    if (url.hostname !== "jsonplaceholder.typicode.com") {
      unexpected.push(request.url());
      return route.abort();
    }
    if (request.method() === "GET") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            title: `Fixture todo ${i + 1}`,
            completed: false,
            userId: 1,
          }))
        ),
      });
    }
    const status = await new Promise(resolve => pending.push({ resolve }));
    return route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ id: 201 }),
    });
  });
  await page.goto("http://127.0.0.1:43179");
  await expect(page.getByRole("listitem")).toHaveCount(8);
  return { pending, unexpected, errors };
}

test("a failed creation restores its draft and allows a successful retry", async ({ page }) => {
  const { pending, unexpected, errors } = await fixture(page);
  const input = page.getByRole("textbox", { name: "New todo", exact: true });
  const add = page.getByRole("button", { name: "Add", exact: true });
  await input.fill("   ");
  await add.click();
  await expect(input).toBeFocused();
  await expect(page.getByRole("alert")).toHaveText(/Enter a todo/);
  await input.fill("  Retry ספר  ");
  await input.press("Enter");
  await expect(page.getByRole("listitem")).toHaveCount(9);
  await expect(add).toBeDisabled();
  await expect.poll(() => pending.length).toBe(1);
  pending.shift().resolve(503);
  await expect(page.getByRole("listitem")).toHaveCount(8);
  await expect(input).toHaveValue("  Retry ספר  ");
  await expect(input).toBeFocused();
  await expect(page.getByRole("alert")).toHaveText(/Could not add the todo/);
  await input.press("Enter");
  await expect.poll(() => pending.length).toBe(1);
  pending.shift().resolve(201);
  await expect(add).toBeEnabled();
  await expect(input).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: "Retry ספר", exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});

for (const nextDraft of ["New independent draft", ""]) {
  test(`failure preserves a newer draft (${nextDraft || "deliberately cleared"})`, async ({
    page,
  }) => {
    const { pending, unexpected, errors } = await fixture(page);
    const input = page.getByRole("textbox", { name: "New todo", exact: true });
    const add = page.getByRole("button", { name: "Add", exact: true });
    await input.fill("First pending fixture");
    await add.click();
    await expect.poll(() => pending.length).toBe(1);
    await input.fill("A draft typed during the request");
    await input.fill(nextDraft);
    await input.press("Enter");
    await expect(add).toBeDisabled();
    expect(pending).toHaveLength(1);
    pending.shift().resolve(503);
    await expect(page.getByRole("listitem")).toHaveCount(8);
    await expect(page.getByRole("alert")).toHaveText(/Could not add the todo/);
    await expect(input).toHaveValue(nextDraft);
    expect(
      await page.locator("html").evaluate(element => element.scrollWidth <= element.clientWidth)
    ).toBe(true);
    expect(unexpected).toEqual([]);
    expect(errors).toEqual([]);
  });
}
