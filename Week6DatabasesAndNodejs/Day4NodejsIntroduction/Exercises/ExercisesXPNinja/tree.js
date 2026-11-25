// Exercise 2: print a folder as a tree, going into sub-folders with recursion
// Usage: node tree.js [folder]
import { readdir } from "node:fs/promises";
import path from "node:path";

const SKIP = new Set(["node_modules", ".git"]);

async function printTree(folder, prefix = "") {
  const entries = (await readdir(folder, { withFileTypes: true }))
    .filter(entry => !SKIP.has(entry.name))
    // folders first, then files, each group A-Z
    .sort((a, b) => b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name));

  let files = 0;
  for (const [index, entry] of entries.entries()) {
    const last = index === entries.length - 1;
    console.log(`${prefix}${last ? "└── " : "├── "}${entry.name}${entry.isDirectory() ? "/" : ""}`);
    if (entry.isDirectory()) {
      files += await printTree(path.join(folder, entry.name), prefix + (last ? "    " : "│   "));
    } else {
      files++;
    }
  }
  return files;
}

const start = process.argv[2] ?? ".";
console.log(path.basename(path.resolve(start)) + "/");
const total = await printTree(start);
console.log(`\n${total} files`);
