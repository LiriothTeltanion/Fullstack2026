import "dotenv/config";
import { randomUUID } from "node:crypto";

export const PORT = Number(process.env.PORT) || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_LIFETIME = "1h";
// Accounts are in memory, so a restarted process starts a new session lifetime too.
export const TOKEN_ISSUER = randomUUID();

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
}
