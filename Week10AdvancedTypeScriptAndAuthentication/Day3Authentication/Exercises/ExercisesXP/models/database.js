import { DatabaseSync } from "node:sqlite";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { DATABASE_FILE } from "../settings.js";

if (DATABASE_FILE !== ":memory:") mkdirSync(dirname(DATABASE_FILE), { recursive: true });
export const database = new DatabaseSync(DATABASE_FILE);
database.exec(
  [
    "PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;",
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,username TEXT NOT NULL UNIQUE,email TEXT NOT NULL UNIQUE,passwordHash TEXT NOT NULL,createdAt TEXT NOT NULL,emailVerified INTEGER NOT NULL DEFAULT 0,confirmationDigest TEXT,confirmationExpiresAt INTEGER);",
    "CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY,userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,refreshId TEXT NOT NULL,expiresAt INTEGER NOT NULL,revoked INTEGER NOT NULL DEFAULT 0);",
    "CREATE INDEX IF NOT EXISTS sessions_user ON sessions(userId);",
  ].join("\n")
);
