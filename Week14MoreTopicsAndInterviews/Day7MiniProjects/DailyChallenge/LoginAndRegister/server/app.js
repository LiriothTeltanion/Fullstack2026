import express from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

function credentials(body) {
  const { email, password } = body ?? {};
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { error: "Please enter a valid email." };
  }
  if (email.trim().length > 255) return { error: "Email is too long." };
  if (
    typeof password !== "string" ||
    !password.trim() ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return { error: "Enter a password of at most 72 UTF-8 bytes." };
  }
  return { email: email.trim().toLowerCase(), password };
}

export function createApp(users) {
  const app = express();
  app.use(express.json({ limit: "16kb" }));
  const api = express.Router();
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
  api.get("/health", (req, res) => res.json({ status: "ok" }));

  api.post("/register", authLimiter, async (req, res, next) => {
    const input = credentials(req.body);
    if (input.error) return res.status(400).json({ error: input.error });
    const { name } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({ error: "Enter a name of at most 100 characters." });
    }
    try {
      const hash = await bcrypt.hash(input.password, 10);
      const user = await users.createUser({ name: name.trim(), email: input.email }, hash);
      return res.status(201).json(user);
    } catch (error) {
      if (error.code === "23505") return res.status(409).json({ error: "already registered" });
      return next(error);
    }
  });

  api.post("/signin", authLimiter, async (req, res, next) => {
    const input = credentials(req.body);
    if (input.error) return res.status(400).json({ error: "not registered" });
    try {
      const login = await users.findLogin(input.email);
      if (!login || !(await bcrypt.compare(input.password, login.hash))) {
        return res.status(401).json({ error: "not registered" });
      }
      const user = await users.findUser(input.email);
      if (!user) return res.status(401).json({ error: "not registered" });
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  });

  // /api is the browser entry. The root mount also supports the exercise's direct REST calls.
  app.use("/api", api);
  app.use("/api", (req, res) => res.status(404).json({ error: "API route not found" }));
  app.use(api);
  const clientBuild = fileURLToPath(new URL("../client/dist/", import.meta.url));
  if (existsSync(clientBuild)) {
    app.use(express.static(clientBuild));
    app.get(["/", "/signin", "/register", "/dashboard"], (req, res) =>
      res.sendFile(clientBuild + "/index.html")
    );
  }
  app.use((req, res) => res.status(404).json({ error: "Route not found" }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed")
      return res.status(400).json({ error: "Invalid JSON body" });
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "Request body is too large" });
    console.error("Login API failed:", error.code || error.name);
    return res.status(503).json({ error: "The account service is temporarily unavailable." });
  });
  return app;
}
