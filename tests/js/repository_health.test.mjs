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
  assert.ok(packageJson.scripts["typecheck:anchor"]);
  assert.ok(packageJson.scripts["lint:baseline"]);
  assert.ok(fs.existsSync(path.join(ROOT, "eslint.config.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "tools", "verify_eslint_baseline.mjs")));
  assert.ok(!fs.existsSync(path.join(ROOT, ".eslintrc.cjs")));
  assert.ok(!fs.existsSync(path.join(ROOT, ".eslintignore")));
  assert.ok(fs.existsSync(path.join(ROOT, ".github", "workflows", "quality.yml")));
});

test("redundant Week ZIPs are absent", () => {
  const archives = fs.readdirSync(ROOT).filter(name => /^Week.*\.zip$/i.test(name));
  assert.deepEqual(archives, []);
});
