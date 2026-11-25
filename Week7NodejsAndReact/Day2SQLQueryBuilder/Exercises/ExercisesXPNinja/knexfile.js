// Read by the knex CLI (npm run migrate / seed) and by db/db.js.
import "dotenv/config";

export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
    migrations: { directory: "./migrations" },
    seeds: { directory: "./seeds" },
  },
};
