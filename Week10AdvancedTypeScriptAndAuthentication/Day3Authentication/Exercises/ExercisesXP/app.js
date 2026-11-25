import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => res.status(404).json({ error: `No route for ${req.method} ${req.path}` }));

// Express 5 sends errors from async handlers here too.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500; // bad JSON in the body arrives with status 400
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
});

export default app;
