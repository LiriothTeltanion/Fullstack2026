import express from "express";
import { fileURLToPath } from "node:url";
import rateLimit from "./middleware/rateLimit.js";
import usersRouter from "./routes/users.js";
import { validateGreeting } from "./public/greeting-validation.js";

// A fresh limiter belongs to each app instance, including isolated HTTP tests.
export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  // Keep the original users exercise. Static assets must not consume its budget.
  app.use("/users", rateLimit({ windowMs: 10_000, max: 5 }), usersRouter);
  app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))));

  app.post(
    "/greeting",
    express.json({ limit: "2kb" }),
    express.urlencoded({ extended: false, limit: "2kb" }),
    (req, res) => {
      const result = validateGreeting(req.body);
      if (!result.valid) {
        return res.status(400).json({ error: "Check your name and emoji.", fields: result.fields });
      }
      const { name, emoji } = result.value;
      return res.json({ name, emoji, greeting: `Hello, ${name}! ${emoji}` });
    }
  );

  // Malformed or oversized input gets a useful response without parser internals.
  app.use((error, req, res, next) => {
    if (error.type === "entity.too.large") {
      return res.status(413).json({ error: "The greeting request is too large." });
    }
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Send a valid JSON greeting request." });
    }
    return next(error);
  });

  return app;
}
