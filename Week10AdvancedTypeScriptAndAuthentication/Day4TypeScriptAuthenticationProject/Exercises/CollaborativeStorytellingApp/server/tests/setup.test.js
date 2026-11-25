import assert from "node:assert/strict";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { applySchema } from "../db/setup.js";

test("setup creates all tables only inside the selected private schema", async () => {
  const database = new PGlite();
  // pg permits a multi-statement query; PGlite exposes that via exec instead.
  const client = {
    query: (sql, params) => (params ? database.query(sql, params) : database.exec(sql)),
  };
  try {
    await applySchema(client, "storytelling_fixture");
    await applySchema(client, "storytelling_fixture");
    const { rows } = await database.query(
      "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('public','storytelling_fixture') ORDER BY table_name"
    );
    assert.equal(rows.length, 5);
    assert.ok(rows.every(row => row.table_schema === "storytelling_fixture"));
    assert.deepEqual(
      rows.map(row => row.table_name),
      ["http_sessions", "refresh_sessions", "stories", "story_contributors", "users"]
    );
    const { rows: searchPath } = await database.query("SHOW search_path");
    assert.ok(!searchPath[0].search_path.includes("storytelling_fixture"));
    await assert.rejects(applySchema(client, "invalid schema"), /lowercase SQL identifier/);
  } finally {
    await database.close();
  }
});
