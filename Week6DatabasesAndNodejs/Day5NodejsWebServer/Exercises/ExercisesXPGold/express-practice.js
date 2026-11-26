import express from "express";
import { postRoutes } from "./post-routes.js";
import { accountRoutes } from "./account-routes.js";
import { todoRoutes } from "./todo-routes.js";

export function createPracticeApi({ postsClient } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "24kb" }));
  app.get("/", (_req, res) => res.json({ resources: ["/posts", "/auth", "/todos"] }));
  app.use("/posts", postRoutes(postsClient));
  app.use("/auth", accountRoutes());
  app.use("/todos", todoRoutes());
  app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.parse.failed")
      return res.status(400).json({ error: "Send valid JSON." });
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "Request body too large." });
    return res.status(500).json({ error: "The request could not be completed." });
  });
  return app;
}
