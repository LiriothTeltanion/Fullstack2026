import express from "express";
import rateLimit from "express-rate-limit";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "./db/knex.js";
import { errorHandler } from "./middleware/errorHandler.js";
import messagesRoutes from "./routes/messagesRoutes.js";

// Where "npm run build" puts the React files
const clientDist = fileURLToPath(new URL("../client/dist", import.meta.url));

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

  app.use(express.json());

  // Render calls this to check the service; it also pings the database
  app.get("/api/health", async (req, res) => {
    await db.raw("select 1");
    res.json({ status: "ok" });
  });

  app.use("/api/messages", messagesRoutes);

  // Unknown API paths get JSON, not the React page
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  // In production Express also serves the built React app
  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // Any other GET returns index.html, so React can handle the page
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(errorHandler);
  return app;
}
