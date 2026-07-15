import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function findMath(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", ".nova", "node_modules", "reports"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findMath(full);
      if (found) return found;
    } else if (entry.name === "math.js" && full.includes("exercise-5-math-app")) return full;
  }
  return null;
}

test("CommonJS math helpers", () => {
  const target = findMath(ROOT);
  assert.ok(target, "math.js exercise not found");
  const require = createRequire(import.meta.url);
  const { add, multiply } = require(target);
  assert.equal(add(2, 3), 5);
  assert.equal(multiply(4, 5), 20);
});
