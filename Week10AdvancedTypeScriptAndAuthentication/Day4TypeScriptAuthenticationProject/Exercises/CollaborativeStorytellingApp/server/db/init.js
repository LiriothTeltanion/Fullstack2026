import { readFile } from "node:fs/promises";
import { pool } from "../models/db.js";

if (!pool)
  throw new Error("Set DATABASE_URL and STORAGE_MODE=postgres before applying the schema.");
try {
  await pool.query(await readFile(new URL("./schema.sql", import.meta.url), "utf8"));
  console.log("Storytelling schema is ready.");
} finally {
  await pool.end();
}
