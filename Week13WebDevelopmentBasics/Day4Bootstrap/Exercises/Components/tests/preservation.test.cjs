const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const digest = name =>
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, name)))
    .digest("hex");

test("the gallery and its original support files remain byte-identical", () => {
  const original = {
    "gallery.html": "1b873b932e7fc24afe2ec6ef68805d9af5c930877c2b547e48d72cbe3afb5c7a",
    "app.js": "97dca1ced78f955fa29b2bf9bfaf812da98af82aea2ec40ebada520ea8df4578",
    "style.css": "cb3cb76b80f4cd771de6b531f82903e0e622ee82c83086c5d3a592ef20c77805",
    "GALLERY.md": "53e06f3a7032dc080acef4f93826ffe16911064077d3f70c37f1dc2f4f446686",
  };
  for (const [name, expected] of Object.entries(original))
    assert.equal(digest(name), expected, name);
});

test("the local Bootstrap stylesheet matches the official version and includes its license", () => {
  assert.equal(
    digest("vendor/bootstrap.min.css"),
    "3c8f27e6009ccfd710a905e6dcf12d0ee3c6f2ac7da05b0572d3e0d12e736fc8"
  );
  assert.match(fs.readFileSync(path.join(root, "vendor/LICENSE"), "utf8"), /MIT License/);
});

test("the main entry disables connections and form navigation even before its script runs", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.doesNotMatch(html, /(?:src|href)="https?:/);
});
