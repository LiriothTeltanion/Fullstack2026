import "dotenv/config";
import pg from "pg";

// Legacy demo tables remain available when STORAGE_MODE=memory is explicitly selected.
export const db = {
  users: [],
  stories: [],
  comments: [],
  nextUserId: 1,
  nextStoryId: 1,
  nextCommentId: 1,
  contributors: [],
  nextContributorId: 1,
  refreshSessions: new Map(),
};
export const usePostgres = process.env.STORAGE_MODE !== "memory";
export const databaseSchema = process.env.DATABASE_SCHEMA || "public";
if (!/^[a-z_][a-z0-9_]*$/.test(databaseSchema)) {
  throw new Error("DATABASE_SCHEMA must be a lowercase SQL identifier.");
}
// Qualify every relation explicitly; transaction poolers must not rely on SET search_path.
export const tables = Object.freeze(
  Object.fromEntries(
    ["users", "stories", "story_comments", "story_contributors", "refresh_sessions"].map(name => [
      name,
      `"${databaseSchema}"."${name}"`,
    ])
  )
);
if (usePostgres && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Configure PostgreSQL or explicitly set STORAGE_MODE=memory."
  );
}
export const pool = usePostgres
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: true,
      ...(process.env.DATABASE_SSL === "true"
        ? {
            ssl: {
              rejectUnauthorized: true,
              ...(process.env.DATABASE_CA_CERT ? { ca: process.env.DATABASE_CA_CERT } : {}),
            },
          }
        : {}),
    })
  : null;
