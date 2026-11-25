import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import tipsRoutes from "./routes/tipsRoutes.js";

// Building the app in its own file keeps server.js down to "read PORT and listen"
export function createApp() {
  const app = express();
  // Render puts one proxy in front of the app; this lets the limiter see the real client IP.
  app.set("trust proxy", 1);

  // Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    })
  );

  // Only the React site may call this API from a browser
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: Math.round(process.uptime()) });
  });

  app.use("/api/tips", tipsRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
  });

  return app;
}
