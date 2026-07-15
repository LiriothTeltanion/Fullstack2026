import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("repository quality infrastructure exists", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.ok(packageJson.scripts.quality);
  assert.ok(packageJson.scripts["test:python"]);
  assert.ok(fs.existsSync(path.join(ROOT, ".github", "workflows", "quality.yml")));
});

test("redundant Week ZIPs are absent", () => {
  const archives = fs.readdirSync(ROOT).filter(name => /^Week.*\.zip$/i.test(name));
  assert.deepEqual(archives, []);
});
