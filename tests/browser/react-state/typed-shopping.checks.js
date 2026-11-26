import { expect, test } from "@playwright/test";

test("a partially damaged save retains valid rows, including duplicate legacy IDs", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    localStorage.setItem(
      "gold-shopping",
      JSON.stringify([
        { id: 7, name: "Rice", quantity: 2, bought: false },
        null,
        { id: 7, name: "Tea", quantity: 1, bought: true },
        { id: 8, name: "Soup", quantity: -1, bought: false },
      ])
    );
    localStorage.setItem("gold-theme", '"invalid-theme"');
    localStorage.setItem("gold-name", '{"name":"wrong shape"}');
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hi", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(2);
  await expect(page.getByRole("checkbox", { name: /Tea/ })).toBeChecked();
  await page.getByRole("listitem").filter({ hasText: "Rice" }).getByRole("button").click();
  await page.reload();
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: /Tea/ })).toBeChecked();
});

test("storage write failures leave the current list editable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage full", "QuotaExceededError");
    };
  });
  await page.goto("/");
  await page.getByRole("textbox", { name: "Item", exact: true }).fill("Bread");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(/this tab/i);
  await page.getByRole("checkbox", { name: /Bread/ }).check();
  await page.getByRole("button", { name: "Clear bought items" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(0);
});

test("items added in the same millisecond remain independent after a reload", async ({ page }) => {
  await page.addInitScript(() => {
    Date.now = () => 1700000000000;
  });
  await page.goto("/");
  const item = page.getByRole("textbox", { name: "Item", exact: true });
  const quantity = page.getByRole("spinbutton", { name: "Quantity" });
  await item.fill("Coffee");
  await quantity.fill("");
  await expect(quantity).toHaveValue("");
  await quantity.fill("2");
  await item.press("Enter");
  await item.fill("Milk");
  await item.press("Enter");
  await page.getByRole("checkbox", { name: /2 × Coffee/ }).check();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /Coffee/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /Milk/ })).not.toBeChecked();
  await page.getByRole("button", { name: "Clear bought items" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(1);
});
