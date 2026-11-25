import "dotenv/config";
import pg from "pg";

// Legacy demo tables remain available when STORAGE_MODE=memory is explicitly selected.
export const db = {
  users: [],
  stories: [],
  nextUserId: 1,
  nextStoryId: 1,
  contributors: [],
  nextContributorId: 1,
  refreshSessions: new Map(),
};
export const usePostgres = process.env.STORAGE_MODE !== "memory";
if (usePostgres && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Configure PostgreSQL or explicitly set STORAGE_MODE=memory."
  );
}
export const pool = usePostgres
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
  : null;
