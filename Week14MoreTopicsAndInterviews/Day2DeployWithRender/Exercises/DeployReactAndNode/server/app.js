import cors from "cors";
import express from "express";
import tipsRoutes from "./routes/tipsRoutes.js";

// Building the app in its own file keeps server.js down to "read PORT and listen"
export function createApp() {
  const app = express();

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
