import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // The exercise is entirely local; tests never read an existing browser profile.
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    return url.hostname === "127.0.0.1" ? route.continue() : route.abort();
  });
});

test("book validation identifies the field and preserves every draft value", async ({ page }) => {
  await page.goto("http://127.0.0.1:43177");
  const title = page.getByRole("textbox", { name: "Title", exact: true });
  const author = page.getByRole("textbox", { name: "Author", exact: true });
  const genre = page.getByRole("textbox", { name: "Genre", exact: true });
  const add = page.getByRole("button", { name: "Add", exact: true });
  const books = page.getByRole("listitem");
  await title.fill("   ");
  await author.fill("  Fixture Author  ");
  await genre.fill("  Fixture Genre  ");
  await add.click();
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert")).toHaveText(/Enter a title/);
  await expect(author).toHaveValue("  Fixture Author  ");
  await expect(genre).toHaveValue("  Fixture Genre  ");
  await expect(books).toHaveCount(5);
  await title.fill("  Fixture ספר  ");
  await author.fill("  ");
  await add.click();
  await expect(author).toBeFocused();
  await expect(page.getByRole("alert")).toHaveText(/Enter an author/);
  await author.fill("Fixture Author");
  await genre.fill("   ");
  await add.click();
  await expect(genre).toBeFocused();
  await expect(page.getByRole("alert")).toHaveText(/Enter a genre/);
  await expect(title).toHaveValue("  Fixture ספר  ");
  await genre.fill("Fixture Genre");
  await genre.press("Enter");
  await expect(books).toHaveCount(6);
  await expect(page.getByRole("alert")).toHaveCount(0);
  for (const field of [title, author, genre]) await expect(field).toHaveValue("");
  await page.getByRole("button", { name: "Fixture Genre (1)", exact: true }).click();
  await expect(books).toHaveCount(1);
  await expect(books.first()).toContainText("Fixture ספר");
  await books.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(books).toHaveCount(0);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(books).toHaveCount(5);
  expect(
    await page.locator("html").evaluate(element => element.scrollWidth <= element.clientWidth)
  ).toBe(true);
});

test("blank new posts retain their draft and recover through keyboard submission", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:43178");
  const filter = page.getByRole("combobox", { name: "Show posts by" });
  const input = page.getByRole("textbox", { name: "New post", exact: true });
  await expect(input).toBeDisabled();
  await filter.selectOption("u1");
  await input.fill("   ");
  await page.getByRole("button", { name: "Post", exact: true }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("   ");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert")).toHaveText(/Enter a post/);
  await expect(page.getByRole("listitem")).toHaveCount(2);
  await input.fill("  Fixture שלום  ");
  await input.press("Enter");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(input).toHaveValue("");
  await expect(page.getByRole("listitem").first()).toContainText("Noa: Fixture שלום");
  await expect(page.getByRole("listitem")).toHaveCount(3);
});

test("blank edited posts stay editable until valid text is saved", async ({ page }) => {
  await page.goto("http://127.0.0.1:43178");
  const row = page.getByRole("listitem").first();
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  const edit = row.getByRole("textbox", { name: "Edit post", exact: true });
  await edit.fill("   ");
  await row.getByRole("button", { name: "Save", exact: true }).click();
  await expect(edit).toBeVisible();
  await expect(edit).toBeFocused();
  await expect(edit).toHaveValue("   ");
  await expect(edit).toHaveAttribute("aria-invalid", "true");
  await expect(row.getByRole("alert")).toHaveText(/Enter post text/);
  expect(
    await row
      .getByRole("button")
      .evaluateAll(buttons =>
        buttons.every(
          button =>
            button.getBoundingClientRect().right <=
            button.closest("section").getBoundingClientRect().right - 8
        )
      )
  ).toBe(true);
  await expect(page.getByRole("listitem")).toHaveCount(3);
  await edit.fill("  Revised Fixture  ");
  await row.getByRole("button", { name: "Save", exact: true }).click();
  await expect(edit).toHaveCount(0);
  await expect(row).toContainText("Revised Fixture");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("listitem")).toHaveCount(2);
  const filter = page.getByRole("combobox", { name: "Show posts by" });
  await filter.selectOption("u1");
  await page.getByRole("button", { name: "Remove this user", exact: true }).click();
  await expect(filter).toHaveValue("all");
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("listitem")).toContainText("Daniel:");
  expect(
    await page.locator("html").evaluate(element => element.scrollWidth <= element.clientWidth)
  ).toBe(true);
});
