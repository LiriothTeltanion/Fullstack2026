import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_ISSUER } from "../settings.js";
import { activeSession } from "../models/sessionModel.js";
import { findById } from "../models/userModel.js";

export function verifyToken(req, res, next) {
  const header = req.get("Authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = bearer ?? req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Please log in first" });
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: TOKEN_ISSUER,
      audience: "access",
    });
    const session = activeSession(payload.sid);
    const user = findById(Number(payload.sub));
    if (payload.type !== "access" || !session || session.userId !== user?.id || !user.emailVerified)
      throw new Error("Inactive session");
    req.user = { id: user.id, username: user.username, sessionId: session.id };
    next();
  } catch {
    res.status(401).json({ error: "Your session is invalid or has expired" });
  }
}
