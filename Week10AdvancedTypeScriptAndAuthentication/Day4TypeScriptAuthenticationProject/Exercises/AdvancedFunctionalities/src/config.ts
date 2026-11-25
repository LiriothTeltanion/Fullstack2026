import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing. Copy .env.example to .env and fill it in.`);
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  accessSecret: required("ACCESS_TOKEN_SECRET"),
  refreshSecret: required("REFRESH_TOKEN_SECRET"),
  sessionSecret: required("SESSION_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  accessLifetime: "10m",
  refreshLifetimeMs: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
