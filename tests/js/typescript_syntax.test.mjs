import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("all TypeScript sources and declarations pass syntax diagnostics", context => {
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, "tools/check_typescript_syntax.mjs"), ROOT],
    { encoding: "utf8" }
  );
  assert.equal(result.stderr, "");
  const output = JSON.parse(result.stdout);
  if (output.missing_typescript) {
    context.skip("TypeScript is not installed; run npm install.");
    return;
  }
  assert.equal(result.status, 0);
  assert.deepEqual(output.errors, []);
});
