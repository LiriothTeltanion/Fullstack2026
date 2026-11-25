import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../tokens.js";
import type { Role } from "../types.js";

// Access tokens travel in the Authorization header: "Bearer <token>".
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing access token" });
    return;
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: "Access token invalid or expired, call /api/auth/refresh" });
  }
}

// Role check, used after requireAuth: requireRole("admin")
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: `This needs the role: ${roles.join(" or ")}` });
      return;
    }
    next();
  };
}
