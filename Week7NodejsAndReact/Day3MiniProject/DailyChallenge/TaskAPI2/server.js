// Task API 2: the first Task API plus filters, sorting, paging, stats and a toggle.
import express from "express";
import rateLimit from "express-rate-limit";
import tasksRouter from "./routes/tasks.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use("/api/tasks", tasksRouter);
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task API 2 running on http://localhost:${PORT}/api/tasks`);
});
