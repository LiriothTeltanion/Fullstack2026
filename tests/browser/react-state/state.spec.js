import { expect, test } from "@playwright/test";

test("a keyboard voter can identify a tie, a winner and a reset", async ({ page }) => {
  await page.goto("http://127.0.0.1:43175");
  const list = page.getByRole("list");
  const php = list.getByRole("listitem").filter({ hasText: "Php" });
  const python = list.getByRole("listitem").filter({ hasText: "Python" });
  const reset = page.getByRole("button", { name: "Reset votes" });
  const total = page.getByRole("status");
  await expect(reset).toBeDisabled();
  await page.keyboard.press("Tab");
  await expect(php.getByRole("button", { name: /vote for Php/i })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(python.getByRole("button", { name: /vote for Python/i })).toBeFocused();
  await page.keyboard.press("Space");
  for (const row of [php, python]) {
    await expect(row).toContainText("Tied for lead");
    await expect(row).toContainText("50%");
  }
  await page.keyboard.press("Enter");
  await expect(python).toContainText("Leading");
  await expect(python).toContainText("67%");
  await expect(total).toHaveText("Total votes: 3");
  await reset.click();
  await expect(total).toHaveText("Total votes: 0");
  await expect(list.getByText(/Tied for lead|Leading/)).toHaveCount(0);
  await expect(reset).toBeDisabled();
});

test("an invalid signup keeps its draft until a local preview succeeds", async ({ page }) => {
  await page.goto("http://127.0.0.1:43176");
  const name = page.getByRole("textbox", { name: "Name", exact: true });
  const email = page.getByRole("textbox", { name: "Email", exact: true });
  const language = page.getByRole("combobox");
  const newsletter = page.getByRole("checkbox");
  const submit = page.getByRole("button", { name: "Preview signup" });
  await name.fill("    ");
  await email.fill("practice@example.test");
  await language.selectOption("Python");
  await newsletter.check();
  await submit.click();
  await expect(name).toBeFocused();
  await expect(email).toHaveValue("practice@example.test");
  await expect(language).toHaveValue("Python");
  await expect(newsletter).toBeChecked();
  await name.fill("  נועה  ");
  await email.fill("invalid");
  await submit.click();
  await expect(email).toBeFocused();
  await email.fill("practice@example.test");
  await submit.click();
  await expect(page.getByRole("status")).toHaveText(
    "Signup preview for נועה · practice@example.test · Python · newsletter included."
  );
  await expect(name).toHaveValue("");
  await expect(email).toHaveValue("");
  await expect(language).toHaveValue("JavaScript");
  await expect(newsletter).not.toBeChecked();
});
