import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import lusca from "lusca";
import { config } from "./config.js";
import { requireAuth } from "./middleware/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use(express.json());
app.use(cookieParser());

// The refresh token rides in a cookie, so a form on another site could trigger
// /api/auth/refresh. lusca keeps a secret in the session and refuses any POST,
// PATCH or DELETE that doesn't send the matching token in the x-csrf-token header.
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "strict", secure: config.isProduction },
  })
);
app.use(lusca.csrf());

// Clients call this once and send the token back on every request that changes data.
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: res.locals._csrf });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Any logged-in user, whatever the role.
app.get("/api/dashboard", requireAuth, (req, res) => {
  res.json({ message: `Welcome back, ${req.user?.username}`, role: req.user?.role });
});

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);
  // lusca sets 403 on the response before passing its "CSRF token missing" error along.
  const status = err.status ?? (res.statusCode >= 400 ? res.statusCode : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
});

export default app;
