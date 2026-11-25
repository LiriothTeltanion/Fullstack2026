import "dotenv/config";
import { createHmac } from "node:crypto";
import { fileURLToPath } from "node:url";

export const PORT = process.env.PORT === undefined ? 5000 : Number(process.env.PORT);
export const JWT_SECRET = process.env.JWT_SECRET;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const ACCESS_TOKEN_SECONDS = Number(process.env.ACCESS_TOKEN_SECONDS ?? 900);
export const REFRESH_TOKEN_SECONDS = Number(process.env.REFRESH_TOKEN_SECONDS ?? 604800);
export const TOKEN_LIFETIME = ACCESS_TOKEN_SECONDS;
export const TOKEN_MAX_AGE_MS = ACCESS_TOKEN_SECONDS * 1000;
export const REFRESH_MAX_AGE_MS = REFRESH_TOKEN_SECONDS * 1000;
export const LOCAL_CONFIRMATION =
  !IS_PRODUCTION && (process.env.EMAIL_CONFIRMATION_MODE ?? "local") === "local";
export const DATABASE_FILE =
  process.env.AUTH_DB_FILE ?? fileURLToPath(new URL("./data/auth.sqlite", import.meta.url));

if (typeof JWT_SECRET !== "string" || JWT_SECRET.length < 32) {
  throw new Error("Set JWT_SECRET to a random value of at least 32 characters.");
}
if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535)
  throw new Error("PORT must be an integer from 0 to 65535.");
if (
  !Number.isInteger(ACCESS_TOKEN_SECONDS) ||
  ACCESS_TOKEN_SECONDS < 1 ||
  !Number.isInteger(REFRESH_TOKEN_SECONDS) ||
  REFRESH_TOKEN_SECONDS <= ACCESS_TOKEN_SECONDS
) {
  throw new Error("Refresh lifetime must exceed the positive access-token lifetime.");
}
export const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  createHmac("sha256", JWT_SECRET).update("fullstack-auth-refresh-key-v1").digest("hex");
if (REFRESH_SECRET.length < 32)
  throw new Error("JWT_REFRESH_SECRET must have at least 32 characters.");
export const TOKEN_ISSUER = "fullstack-auth-exercise";
