import knex from "knex";
import { fileURLToPath } from "node:url";

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 5 },
  migrations: {
    // An absolute path, so migrations are found whatever folder node starts in
    directory: fileURLToPath(new URL("../migrations", import.meta.url)),
  },
});

export default db;
