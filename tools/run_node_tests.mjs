#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = path.resolve(process.argv[2] || ".");
const testRoot = path.join(root, "tests", "js");
const patterns = /\.(?:test|spec)\.(?:js|mjs|cjs)$/i;
const files = [];
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (patterns.test(entry.name)) files.push(full);
  }
}
walk(testRoot);
if (!files.length) {
  console.error(`No JavaScript test files found under ${testRoot}`);
  process.exit(1);
}
const result = spawnSync(process.execPath, ["--test", ...files], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
