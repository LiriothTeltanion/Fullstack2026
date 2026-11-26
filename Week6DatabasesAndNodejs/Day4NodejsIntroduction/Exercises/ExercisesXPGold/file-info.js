import { stat } from "node:fs/promises";
import path from "node:path";

export async function fileInfo(filePath) {
  const fullPath = path.resolve(filePath);
  const details = {
    path: fullPath,
    name: path.basename(fullPath),
    extension: path.extname(fullPath),
  };
  try {
    const entry = await stat(fullPath);
    if (!entry.isFile()) throw new Error(`Expected a file: ${fullPath}`);
    return {
      ...details,
      exists: true,
      bytes: entry.size,
      created: entry.birthtime,
      modified: entry.mtime,
    };
  } catch (error) {
    if (error.code === "ENOENT") return { ...details, exists: false };
    throw error;
  }
}
