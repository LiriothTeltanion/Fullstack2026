import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error("Set JWT_SECRET and DATABASE_URL in server/.env (see .env.example).");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
