import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../settings.js";

// Accepts the token from the httpOnly cookie or from an "Authorization: Bearer ..." header.
export function verifyToken(req, res, next) {
  const header = req.get("Authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = req.cookies?.token ?? bearer;

  if (!token) {
    return res.status(401).json({ error: "Please log in first" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: Number(payload.sub), username: payload.username };
    next();
  } catch {
    res.status(401).json({ error: "Your session is invalid or has expired" });
  }
}
