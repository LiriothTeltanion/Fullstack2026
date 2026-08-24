import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function findMathFiles(dir, matches = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", ".nova", ".private", "node_modules", "reports"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMathFiles(full, matches);
    } else if (entry.name === "math.js" && full.includes("exercise-5-math-app")) {
      matches.push(full);
    }
  }
  return matches;
}

test("CommonJS math helpers", () => {
  const matches = findMathFiles(ROOT);
  assert.equal(
    matches.length,
    1,
    `expected exactly one exercise-5-math-app/math.js, found: ${matches.join(", ") || "none"}`,
  );
  const [target] = matches;
  const require = createRequire(import.meta.url);
  const { add, multiply } = require(target);
  assert.equal(add(2, 3), 5);
  assert.equal(multiply(4, 5), 20);
});
