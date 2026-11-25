// Task Management API: CRUD on tasks stored in data/tasks.json.
import express from "express";
import rateLimit from "express-rate-limit";
import tasksRouter from "./routes/tasks.js";

const app = express();

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
app.use("/tasks", tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Catches file errors and broken JSON in the request body.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "The request body is not valid JSON" });
  }
  console.error("Task storage failed:", err.code || err.name);
  res.status(500).json({ error: "Could not read or save the tasks" });
});

export default app;
