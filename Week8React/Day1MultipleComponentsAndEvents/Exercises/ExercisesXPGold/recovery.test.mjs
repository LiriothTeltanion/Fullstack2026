import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { preview } from "vite";

let server;
let browser;
let url;

before(async () => {
  server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
  url = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chromium" });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

for (const dismiss of ["button", "Escape"]) {
  test(`recover using ${dismiss} without losing the existing like count`, async () => {
    const page = await browser.newPage();
    try {
      await page.goto(url);
      await page.getByRole("button", { name: /Apple/ }).click();
      const opener = page.getByRole("button", { name: "Open missing set list" });
      const dialog = page.getByRole("dialog", { name: "Set list unavailable" });
      const recover = dialog.getByRole("button", { name: "Return to rehearsal" });
      // A second cycle also exercises remounting after a successful recovery.
      for (let attempt = 0; attempt < 2; attempt += 1) {
        await opener.click();
        await dialog.waitFor();
        assert.ok(await dialog.evaluate(element => element.matches(":modal")));
        assert.ok(await recover.evaluate(element => element === document.activeElement));
        if (dismiss === "Escape") await page.keyboard.press("Escape");
        else await recover.click();
        await dialog.waitFor({ state: "detached" });
        assert.ok(await opener.evaluate(element => element === document.activeElement));
        assert.deepEqual(await page.getByRole("listitem").allTextContents(), [
          "Soundcheck",
          "Night Train",
          "Encore",
        ]);
      }
      assert.ok(await page.getByRole("button", { name: /Apple · 1/ }).isVisible());
    } finally {
      await page.close();
    }
  });
}
