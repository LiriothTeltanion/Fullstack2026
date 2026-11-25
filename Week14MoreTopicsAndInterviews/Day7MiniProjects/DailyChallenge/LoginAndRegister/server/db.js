import "dotenv/config";
import knex from "knex";

export function createDatabase(env = process.env) {
  return knex({
    client: "pg",
    connection: env.DATABASE_URL || {
      host: env.PG_HOST || "127.0.0.1",
      port: Number(env.PG_PORT) || 5432,
      user: env.PG_USER || "postgres",
      password: env.PG_PASSWORD || "",
      database: env.PG_DATABASE || "s14_login_register",
    },
    pool: { min: 0, max: Number(env.PG_POOL_MAX) || 5 },
  });
}
