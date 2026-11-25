import jwt from "jsonwebtoken";

// Reads the JWT from the cookie (browser) or from "Authorization: Bearer <token>"
// (Postman, curl), checks it, and puts the payload on req.user.
export function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = req.cookies.token || (header.startsWith("Bearer ") ? header.slice(7) : null);

  if (!token) {
    return res.status(401).json({ error: "Please log in." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Your session expired. Please log in again." });
  }
}
