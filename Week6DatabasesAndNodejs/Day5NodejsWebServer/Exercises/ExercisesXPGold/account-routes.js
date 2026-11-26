import { Router } from "express";
import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function accountRoutes() {
  const router = Router();
  const users = new Map();
  const signingKey = randomBytes(32);
  const issuer = "week6-account-practice";
  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  router.post("/register", async (req, res) => {
    const { username, password } = req.body ?? {};
    if (
      typeof username !== "string" ||
      !username.trim() ||
      username.trim().length > 60 ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password) > 72
    ) {
      return res.status(400).json({
        error:
          "Choose a username (up to 60 characters) and a password of at least 8 characters and at most 72 UTF-8 bytes.",
      });
    }
    const name = username.trim();
    const key = name.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    // A second registration may have completed during the asynchronous hash.
    if (users.has(key)) return res.status(409).json({ error: "Username already registered." });
    const user = { id: randomUUID(), username: name, passwordHash };
    users.set(key, user);
    return res.status(201).json({ id: user.id, username: user.username });
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body ?? {};
    const key = typeof username === "string" ? username.trim().toLowerCase() : "";
    const user = users.get(key);
    if (
      !user ||
      typeof password !== "string" ||
      Buffer.byteLength(password) > 72 ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const token = jwt.sign({ username: user.username }, signingKey, {
      algorithm: "HS256",
      subject: user.id,
      issuer,
      expiresIn: "15m",
    });
    return res.json({ token, tokenType: "Bearer", expiresInSeconds: 900 });
  });

  router.get("/profile", (req, res) => {
    const token = /^Bearer (\S+)$/i.exec(req.get("Authorization") ?? "")?.[1];
    if (!token) return res.sendStatus(401);
    try {
      const claims = jwt.verify(token, signingKey, { algorithms: ["HS256"], issuer });
      return res.json({ id: claims.sub, username: claims.username });
    } catch {
      return res.sendStatus(401);
    }
  });
  return router;
}
