import { readFile } from "node:fs/promises";
import { createDatabase } from "../db.js";

const db = createDatabase();
try {
  await db.raw(await readFile(new URL("./schema.sql", import.meta.url), "utf8"));
  console.log("users and login tables are ready");
} finally {
  await db.destroy();
}
