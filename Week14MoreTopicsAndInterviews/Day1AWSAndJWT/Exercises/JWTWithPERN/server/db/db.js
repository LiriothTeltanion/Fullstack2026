import knex from "knex";

// One shared Knex instance for the whole app
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

export default db;
