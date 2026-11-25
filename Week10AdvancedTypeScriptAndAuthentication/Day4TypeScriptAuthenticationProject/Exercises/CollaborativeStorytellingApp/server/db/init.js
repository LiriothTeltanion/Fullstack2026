import { databaseSchema, pool } from "../models/db.js";
import { applySchema } from "./setup.js";

if (!pool)
  throw new Error("Set DATABASE_URL and STORAGE_MODE=postgres before applying the schema.");
// Provision with a database owner, never the restricted hosted runtime role.
const client = await pool.connect();
try {
  await applySchema(client, databaseSchema);
  console.log("Storytelling schema is ready.");
} finally {
  client.release();
  await pool.end();
}
