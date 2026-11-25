import assert from "node:assert/strict";
import test from "node:test";
import { parseRoute, safeReturnTo } from "../src/routes.ts";

test("static pages keep distinct URLs and trailing slash support", () => {
  const pages = { "/": "all", "/stories": "all", "/stories/mine": "mine", "/stories/new": "new", "/login": "login", "/register": "register" };
  for (const [path, page] of Object.entries(pages)) {
    assert.equal(parseRoute(path).page, page);
    assert.equal(parseRoute(path + "/").page, page);
  }
});

test("detail and edit deep links preserve safe numeric story identities", () => {
  assert.deepEqual(parseRoute("/stories/17?view=reader"), { page: "detail", storyId: 17 });
  assert.deepEqual(parseRoute("/stories/17/edit/"), { page: "edit", storyId: 17 });
  for (const path of ["/stories/0", "/stories/-1", "/stories/1.5", "/stories/9007199254740992", "/stories/1/extra", "/unknown"]) {
    assert.equal(parseRoute(path).page, "not-found", path);
  }
});

test("login return paths retain known local pages and reject foreign targets or loops", () => {
  assert.equal(safeReturnTo("/stories/7/edit"), "/stories/7/edit");
  assert.equal(safeReturnTo("/stories/mine"), "/stories/mine");
  for (const candidate of [null, "", "https://example.invalid", "//example.invalid/path", "/\\example.invalid", "/stories\n", "/login", "/register?next=/login", "/missing"]) {
    assert.equal(safeReturnTo(candidate), "/stories", String(candidate));
  }
});
