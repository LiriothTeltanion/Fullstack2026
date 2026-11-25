import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import lusca from "lusca";
import authRoutes from "./routes/authRoutes.js";
import storiesRoutes from "./routes/storiesRoutes.js";
import { IS_PRODUCTION, SESSION_SECRET } from "./settings.js";

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

// The login cookie is sent with every request, so a page on another site could
// try to post as me. lusca keeps a secret in the session and refuses any POST,
// PATCH or DELETE without the matching token in the x-csrf-token header.
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "strict", secure: IS_PRODUCTION },
  })
);
app.use(lusca.csrf());

// The React client asks for the token once and sends it back on every change.
app.get("/api/csrf-token", (req, res) => res.json({ csrfToken: res.locals._csrf }));

app.use("/api/auth", authRoutes);
app.use("/api/stories", storiesRoutes);

app.use((req, res) => res.status(404).json({ error: `No route for ${req.method} ${req.path}` }));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  // lusca sets 403 on the response before passing its "CSRF token missing" error along.
  const status = err.status ?? (res.statusCode >= 400 ? res.statusCode : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
});

export default app;
