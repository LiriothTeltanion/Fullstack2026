import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import storiesRoutes from "./routes/storiesRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/stories", storiesRoutes);

app.use((req, res) => res.status(404).json({ error: `No route for ${req.method} ${req.path}` }));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
});

export default app;
