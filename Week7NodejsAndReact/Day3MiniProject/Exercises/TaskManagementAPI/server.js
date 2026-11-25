// Task Management API: CRUD on tasks stored in data/tasks.json.
import express from "express";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
  console.error(err);
  res.status(500).json({ error: "Could not read or save the tasks" });
});

app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
});
