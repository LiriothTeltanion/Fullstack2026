import express from "express";
import rateLimit from "express-rate-limit";
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sessionDuration = 8 * 60 * 60 * 1000;
function text(value, maximum = 200) {
  return typeof value === "string" && value.trim().length <= maximum ? value.trim() : "";
}
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
export function createDashboard(databasePath) {
  if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(
    [
      "PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;",
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, digest TEXT NOT NULL);",
      "CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id), name TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '');",
      "CREATE TABLE IF NOT EXISTS meetings (id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id), company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE, date TEXT NOT NULL, location TEXT NOT NULL, summary TEXT NOT NULL);",
      "CREATE INDEX IF NOT EXISTS meetings_owner_date ON meetings(owner_id,date);",
    ].join("\n")
  );
  const app = express();
  const sessions = new Map();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
      "Content-Security-Policy":
        "default-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'",
    });
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.get("origin")) {
      try {
        if (new URL(req.get("origin")).host !== req.get("host"))
          return res.status(403).json({ error: "Use the dashboard's own origin." });
      } catch {
        return res.status(403).json({ error: "Invalid origin." });
      }
    }
    next();
  });
  app.use(express.json({ limit: "32kb" }));
  app.use(
    "/api/auth",
    rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false })
  );
  function startSession(res, userId) {
    const token = randomBytes(32).toString("hex");
    for (const [key, session] of sessions) if (session.expires <= Date.now()) sessions.delete(key);
    sessions.set(token, { userId, expires: Date.now() + sessionDuration });
    res.cookie("sales_session", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionDuration,
    });
  }
  function requireUser(req, res, next) {
    const cookies = Object.fromEntries(
      (req.get("cookie") ?? "").split(";").map(part => {
        const index = part.indexOf("=");
        return [part.slice(0, index).trim(), part.slice(index + 1).trim()];
      })
    );
    const session = sessions.get(cookies.sales_session);
    if (!session || session.expires <= Date.now())
      return res.status(401).json({ error: "Please sign in." });
    req.userId = session.userId;
    req.sessionToken = cookies.sales_session;
    next();
  }
  app.post("/api/auth/register", (req, res) => {
    const username = text(req.body?.username, 32);
    const phrase = req.body?.password;
    if (
      !/^[a-zA-Z0-9_-]{3,32}$/.test(username) ||
      typeof phrase !== "string" ||
      phrase.length < 10 ||
      phrase.length > 128
    )
      return res
        .status(400)
        .json({ error: "Use a 3–32 character username and a 10–128 character password." });
    const salt = randomBytes(16).toString("hex");
    const digest = scryptSync(phrase, salt, 64).toString("hex");
    try {
      const result = db
        .prepare("INSERT INTO users (username,salt,digest) VALUES (?,?,?)")
        .run(username, salt, digest);
      startSession(res, Number(result.lastInsertRowid));
      return res.status(201).json({ username });
    } catch (error) {
      if (String(error.message).includes("UNIQUE"))
        return res.status(409).json({ error: "That username is taken." });
      throw error;
    }
  });
  app.post("/api/auth/login", (req, res) => {
    const username = text(req.body?.username, 32);
    const phrase = req.body?.password;
    if (typeof phrase !== "string" || phrase.length > 128)
      return res.status(400).json({ error: "Enter a username and password." });
    const user = db.prepare("SELECT * FROM users WHERE username=?").get(username);
    const digest = scryptSync(phrase, user?.salt ?? "unknown-user-comparison", 64);
    if (!user || !timingSafeEqual(digest, Buffer.from(user.digest, "hex")))
      return res.status(401).json({ error: "The credentials did not match." });
    startSession(res, user.id);
    res.json({ username: user.username });
  });
  app.post("/api/auth/logout", requireUser, (req, res) => {
    sessions.delete(req.sessionToken);
    res.clearCookie("sales_session", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.sendStatus(204);
  });
  app.use("/api", requireUser);
  app.get("/api/auth/me", (req, res) =>
    res.json(db.prepare("SELECT username FROM users WHERE id=?").get(req.userId))
  );
  function companyFor(req, id = req.params.id) {
    return db.prepare("SELECT * FROM companies WHERE id=? AND owner_id=?").get(id, req.userId);
  }
  function companyInput(body) {
    const limits = { name: 120, email: 200, phone: 80, address: 300 };
    if (
      Object.entries(limits).some(
        ([key, limit]) =>
          body?.[key] !== undefined &&
          (typeof body[key] !== "string" || body[key].trim().length > limit)
      )
    )
      return null;
    const name = text(body?.name, 120);
    const email = text(body?.email ?? "", 200);
    const phone = text(body?.phone ?? "", 80);
    const address = text(body?.address ?? "", 300);
    if (!name || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return null;
    return [name, email, phone, address];
  }
  app.get("/api/companies", (req, res) =>
    res.json(
      db
        .prepare(
          "SELECT id,name,email,phone,address FROM companies WHERE owner_id=? ORDER BY name,id"
        )
        .all(req.userId)
    )
  );
  app.get("/api/companies/:id", (req, res) => {
    const company = companyFor(req);
    if (!company) return res.status(404).json({ error: "Company not found." });
    const { id, name, email, phone, address } = company;
    res.json({ id, name, email, phone, address });
  });
  app.post("/api/companies", (req, res) => {
    const values = companyInput(req.body);
    if (!values)
      return res.status(400).json({ error: "Enter a company name and a valid email if supplied." });
    const result = db
      .prepare("INSERT INTO companies (name,email,phone,address,owner_id) VALUES (?,?,?,?,?)")
      .run(...values, req.userId);
    res.status(201).json({ id: Number(result.lastInsertRowid) });
  });
  app.put("/api/companies/:id", (req, res) => {
    if (!companyFor(req)) return res.status(404).json({ error: "Company not found." });
    const values = companyInput(req.body);
    if (!values) return res.status(400).json({ error: "Enter a company name and valid email." });
    db.prepare(
      "UPDATE companies SET name=?,email=?,phone=?,address=? WHERE id=? AND owner_id=?"
    ).run(...values, req.params.id, req.userId);
    res.sendStatus(204);
  });
  app.delete("/api/companies/:id", (req, res) => {
    const company = companyFor(req);
    if (!company) return res.status(404).json({ error: "Company not found." });
    const linked = db
      .prepare("SELECT count(*) AS count FROM meetings WHERE company_id=?")
      .get(company.id).count;
    if (linked && req.query.confirm !== "yes")
      return res
        .status(409)
        .json({ error: "This company has meetings. Confirm deletion to remove them together." });
    db.prepare("DELETE FROM companies WHERE id=? AND owner_id=?").run(company.id, req.userId);
    res.sendStatus(204);
  });
  function meetingInput(req) {
    const companyId = Number(req.body?.company_id);
    const date = req.body?.date;
    const location = text(req.body?.location, 200);
    const summary = text(req.body?.summary, 5000);
    if (
      !Number.isSafeInteger(companyId) ||
      !companyFor(req, companyId) ||
      !validDate(date) ||
      !location ||
      !summary
    )
      return null;
    return [companyId, date, location, summary];
  }
  app.get("/api/meetings", (req, res) =>
    res.json(
      db
        .prepare(
          "SELECT m.id,m.company_id,c.name AS company_name,m.date,m.location,m.summary FROM meetings m JOIN companies c ON c.id=m.company_id WHERE m.owner_id=? ORDER BY m.date DESC,m.id DESC"
        )
        .all(req.userId)
    )
  );
  app.get("/api/meetings/:id", (req, res) => {
    const meeting = db
      .prepare(
        "SELECT m.id,m.company_id,c.name AS company_name,m.date,m.location,m.summary FROM meetings m JOIN companies c ON c.id=m.company_id WHERE m.id=? AND m.owner_id=?"
      )
      .get(req.params.id, req.userId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found." });
    res.json(meeting);
  });
  app.post("/api/meetings", (req, res) => {
    const values = meetingInput(req);
    if (!values)
      return res
        .status(400)
        .json({ error: "Choose your company, a real date, location and summary." });
    const result = db
      .prepare(
        "INSERT INTO meetings (company_id,date,location,summary,owner_id) VALUES (?,?,?,?,?)"
      )
      .run(...values, req.userId);
    res.status(201).json({ id: Number(result.lastInsertRowid) });
  });
  app.put("/api/meetings/:id", (req, res) => {
    if (
      !db
        .prepare("SELECT id FROM meetings WHERE id=? AND owner_id=?")
        .get(req.params.id, req.userId)
    )
      return res.status(404).json({ error: "Meeting not found." });
    const values = meetingInput(req);
    if (!values)
      return res
        .status(400)
        .json({ error: "Choose your company, a real date, location and summary." });
    db.prepare(
      "UPDATE meetings SET company_id=?,date=?,location=?,summary=? WHERE id=? AND owner_id=?"
    ).run(...values, req.params.id, req.userId);
    res.sendStatus(204);
  });
  app.delete("/api/meetings/:id", (req, res) => {
    const result = db
      .prepare("DELETE FROM meetings WHERE id=? AND owner_id=?")
      .run(req.params.id, req.userId);
    if (!result.changes) return res.status(404).json({ error: "Meeting not found." });
    res.sendStatus(204);
  });
  app.get("/api/statistics", (req, res) => {
    const month = req.query.month ?? new Date().toISOString().slice(0, 7);
    if (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month))
      return res.status(400).json({ error: "Use a month in YYYY-MM format." });
    const days = db
      .prepare(
        "SELECT date,count(*) AS count FROM meetings WHERE owner_id=? AND substr(date,1,7)=? GROUP BY date ORDER BY date"
      )
      .all(req.userId, month);
    const total = days.reduce((sum, day) => sum + day.count, 0);
    res.json({
      month,
      total,
      days: days.map(day => ({ ...day, percentage: total ? (day.count / total) * 100 : 0 })),
    });
  });
  app.use(express.static(join(here, "public")));
  app.use("/api", (req, res) => res.status(404).json({ error: "API route not found." }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.parse.failed")
      return res.status(400).json({ error: "Send valid JSON." });
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "The request is too large." });
    res.status(500).json({ error: "The request could not be completed." });
  });
  return { app, db };
}
