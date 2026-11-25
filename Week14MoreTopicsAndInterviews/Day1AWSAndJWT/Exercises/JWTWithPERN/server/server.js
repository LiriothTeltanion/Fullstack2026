import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error("Set JWT_SECRET and DATABASE_URL in server/.env (see .env.example).");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
