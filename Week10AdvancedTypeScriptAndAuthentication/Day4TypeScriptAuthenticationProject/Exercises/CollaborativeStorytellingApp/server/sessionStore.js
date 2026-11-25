import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { databaseSchema, pool } from "./models/db.js";
import { IS_PRODUCTION } from "./settings.js";

const PostgresStore = connectPgSimple(session);

export function createSessionStore(databasePool = pool) {
  if (!databasePool) {
    if (IS_PRODUCTION) throw new Error("Production requires PostgreSQL-backed sessions.");
    return new session.MemoryStore();
  }
  return new PostgresStore({
    pool: databasePool,
    schemaName: databaseSchema,
    tableName: "http_sessions",
    createTableIfMissing: false,
    ttl: 7200,
    // Serverless instances must not keep background pruning timers alive.
    pruneSessionInterval: false,
    errorLog: error => console.error("Session storage failed", { code: error.code ?? "unknown" }),
  });
}
