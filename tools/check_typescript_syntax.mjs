#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = path.resolve(process.argv[2] || ".");
const skip = new Set([".git", ".nova", "node_modules", "dist", "build", "reports", "coverage"]);

async function loadTypeScript() {
  try {
    return await import("typescript");
  } catch {
    const local = path.join(root, "node_modules", "typescript", "lib", "typescript.js");
    if (fs.existsSync(local)) return import(pathToFileURL(local).href);
    return null;
  }
}

function walk(directory, out = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skip.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const tsModule = await loadTypeScript();
if (!tsModule) {
  console.log(JSON.stringify({ missing_typescript: true, errors: [] }));
  process.exit(2);
}
const ts = tsModule.default || tsModule;
const errors = [];
for (const file of walk(root)) {
  const source = fs.readFileSync(file, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      noEmitOnError: false,
    },
    fileName: file,
    reportDiagnostics: true,
  });
  for (const diagnostic of result.diagnostics || []) {
    if (diagnostic.category !== ts.DiagnosticCategory.Error) continue;
    let line = null;
    if (typeof diagnostic.start === "number") {
      const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
      line = sf.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    }
    errors.push({
      path: path.relative(root, file).split(path.sep).join("/"),
      line,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
    });
  }
}
console.log(JSON.stringify({ missing_typescript: false, errors }));
process.exit(errors.length ? 1 : 0);
