import "dotenv/config";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
});

export default db;
