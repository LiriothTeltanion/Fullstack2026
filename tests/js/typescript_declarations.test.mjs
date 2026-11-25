import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const checker = path.join(ROOT, "tools/check_typescript_syntax.mjs");

function check(fixtures) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fullstack-ts-declarations-"));
  for (const [name, source] of Object.entries(fixtures))
    fs.writeFileSync(path.join(directory, name), source);
  const before = fs.readdirSync(directory).sort();
  const result = spawnSync(process.execPath, [checker, directory], { encoding: "utf8" });
  assert.equal(result.stderr, "");
  const output = JSON.parse(result.stdout);
  assert.equal(output.missing_typescript, false, "Install the root TypeScript dependency first.");
  assert.deepEqual(
    fs.readdirSync(directory).sort(),
    before,
    "Syntax checking must not emit files."
  );
  return { status: result.status, errors: output.errors };
}

test("valid .d.ts, .d.mts and .d.cts declarations are checked without emission", () => {
  const result = check({
    "global.d.ts": "declare const count: number;\n",
    "esm.d.mts": "export declare const count: number;\n",
    "commonjs.d.cts": "declare const count: number; export = count;\n",
  });
  assert.equal(result.status, 0);
  assert.deepEqual(result.errors, []);
});

test("malformed declarations in each supported format report their own file and line", () => {
  const names = ["broken.d.ts", "broken.d.mts", "broken.d.cts"];
  const result = check(
    Object.fromEntries(names.map(name => [name, "// fixture\nexport declare const count: ;\n"]))
  );
  assert.equal(result.status, 1);
  assert.deepEqual([...new Set(result.errors.map(error => error.path))].sort(), names.sort());
  assert.ok(result.errors.every(error => error.line === 2 && error.message.length > 0));
});

test("ordinary TS, TSX, MTS and CTS sources retain syntax validation", () => {
  const good = check({
    "counter.ts": "export const count: number = 0;\n",
    "view.tsx": "export const View = () => <div />;\n",
    "esm.mts": "export const count: number = 0;\n",
    "commonjs.cts": "const count: number = 0; export = count;\n",
  });
  assert.equal(good.status, 0);
  assert.deepEqual(good.errors, []);
  const bad = check({ "counter.ts": "export const count: number = ;\n" });
  assert.equal(bad.status, 1);
  assert.equal(bad.errors[0].path, "counter.ts");
  assert.equal(bad.errors[0].line, 1);
});
