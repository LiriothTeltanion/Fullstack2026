import { readFile } from "node:fs/promises";

export async function applySchema(client, schema) {
  if (!/^[a-z_][a-z0-9_]*$/.test(schema)) {
    throw new Error("DATABASE_SCHEMA must be a lowercase SQL identifier.");
  }
  await client.query("BEGIN");
  try {
    // Setup alone sets a transaction-local path; runtime queries are qualified.
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    await client.query(`SET LOCAL search_path TO "${schema}"`);
    await client.query(await readFile(new URL("./schema.sql", import.meta.url), "utf8"));
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
