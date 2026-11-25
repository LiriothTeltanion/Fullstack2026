import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();
app.disable("x-powered-by");
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("X-Content-Type-Options", "nosniff");
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.get("origin")) {
    try {
      if (new URL(req.get("origin")).host !== req.get("host"))
        return res.status(403).json({ error: "Use the API's own origin." });
    } catch {
      return res.status(403).json({ error: "Invalid origin." });
    }
  }
  next();
});
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res) =>
  res.status(404).json({ error: "No route for " + req.method + " " + req.path })
);
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) console.error("Authentication API error:", err.code ?? err.name);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
});
export default app;
