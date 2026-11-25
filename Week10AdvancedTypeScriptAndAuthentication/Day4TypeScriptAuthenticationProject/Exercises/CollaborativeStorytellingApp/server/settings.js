import "dotenv/config";

export const PORT = Number(process.env.PORT) || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const TOKEN_LIFETIME = "2h";
export const TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
}
