import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../settings.js";

export function requireAuth(req, res, next) {
  const bearer = req.get("authorization");
  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Please log in" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.kind && payload.kind !== "access") throw new Error("Wrong token kind");
    req.user = { id: Number(payload.sub), username: payload.username };
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please log in again" });
  }
}
