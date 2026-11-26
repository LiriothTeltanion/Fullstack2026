import test from "node:test";
import assert from "node:assert/strict";
import { getPhotoQuery, normalizeApiKey } from "../src/gallerySettings.js";

for (const term of [
  "birds",
  "100%",
  "café",
  "שלום",
  "%2F",
  "literal%2Fterm",
  "a/b",
  "%25",
  "%E0%A4%A",
]) {
  test(`search preserves ${JSON.stringify(term)} with or without a trailing slash`, () => {
    const path = `/search/${encodeURIComponent(term)}`;
    assert.equal(getPhotoQuery(path), term);
    assert.equal(getPhotoQuery(`${path}/`), term);
  });
}

test("category routes decode exactly once too", () => {
  assert.equal(getPhotoQuery("/mountain"), "mountain");
  assert.equal(getPhotoQuery("/%252F"), "%2F");
  assert.equal(getPhotoQuery("/caf%C3%A9/"), "café");
});

test("malformed routes return an error sentinel without throwing", () => {
  for (const path of ["/search/%", "/search/%E0%A4%A", "/search/%ZZ/"]) {
    assert.equal(getPhotoQuery(path), null);
  }
  assert.equal(getPhotoQuery("/search/%20").trim(), "");
});

test("missing, blank and unmodified example keys are not configured", () => {
  for (const key of [undefined, "", "   ", "your-pexels-api-key", "  your-pexels-api-key  "]) {
    assert.equal(normalizeApiKey(key), "");
  }
});

test("configured keys are trimmed before use", () => {
  assert.equal(normalizeApiKey("  synthetic-test-key  "), "synthetic-test-key");
});
