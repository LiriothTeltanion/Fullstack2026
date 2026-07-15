import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let ts = null;
try {
  const module = await import("typescript");
  ts = module.default || module;
} catch {
  // npm install supplies TypeScript in normal runs and CI.
}
function walk(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", ".nova", "node_modules", "reports"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (/\.tsx?$/i.test(entry.name)) output.push(full);
  }
  return output;
}

test("all TypeScript files transpile without syntax diagnostics", (context) => {
  if (!ts) {
    context.skip("TypeScript is not installed; run npm install.");
    return;
  }
  const failures = [];
  for (const file of walk(ROOT)) {
    const source = fs.readFileSync(file, "utf8");
    const result = ts.transpileModule(source, {
      fileName: file,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      reportDiagnostics: true,
    });
    for (const diagnostic of result.diagnostics || []) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        failures.push(`${path.relative(ROOT, file)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
