import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { requireAuth } from "./middleware/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

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
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
});

export default app;
