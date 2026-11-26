import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_ISSUER } from "../settings.js";

// This project sends the token in the header: "Authorization: Bearer <token>".
export function authenticate(req, res, next) {
  const header = req.get("Authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    req.userId = Number(jwt.verify(token, JWT_SECRET, { issuer: TOKEN_ISSUER }).sub);
    next();
  } catch {
    res.status(401).json({ error: "Token expired or invalid" });
  }
}
