import { readFile } from "node:fs/promises";

export function readText(filename) {
  return readFile(filename, "utf8");
}
