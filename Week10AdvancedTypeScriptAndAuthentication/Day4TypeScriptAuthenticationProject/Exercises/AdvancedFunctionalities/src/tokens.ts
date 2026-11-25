import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { refreshTokens } from "./store.js";
import type { TokenUser, User } from "./types.js";

export function createAccessToken(user: User): string {
  const payload: TokenUser = { id: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, config.accessSecret, { expiresIn: config.accessLifetime });
}

export function createRefreshToken(user: User): string {
  const jti = randomUUID();
  refreshTokens.set(jti, user.id);
  return jwt.sign({ sub: String(user.id) }, config.refreshSecret, {
    jwtid: jti,
    expiresIn: Math.floor(config.refreshLifetimeMs / 1000),
  });
}

export function verifyAccessToken(token: string): TokenUser {
  const payload = jwt.verify(token, config.accessSecret) as jwt.JwtPayload & TokenUser;
  return { id: payload.id, username: payload.username, role: payload.role };
}

// Returns the user id if the refresh token is valid AND still on the server's list.
export function consumeRefreshToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, config.refreshSecret) as jwt.JwtPayload;
    const jti = payload.jti;
    if (!jti || !refreshTokens.has(jti)) return null;
    refreshTokens.delete(jti); // one use only: rotation
    return Number(payload.sub);
  } catch {
    return null;
  }
}

export function revokeRefreshToken(token: string): void {
  const payload = jwt.decode(token) as jwt.JwtPayload | null;
  if (payload?.jti) refreshTokens.delete(payload.jti);
}
