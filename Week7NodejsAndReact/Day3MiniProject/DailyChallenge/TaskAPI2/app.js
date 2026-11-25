// Express app separated from the listener so requests can be tested on a temporary port.
import express from "express";
import rateLimit from "express-rate-limit";
import tasksRouter from "./routes/tasks.js";
import errorHandler from "./middleware/errorHandler.js";
import usersRouter from "./routes/users.js";
import { fileURLToPath } from "node:url";

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
app.get("/", (req, res) => res.redirect("/register.html"));
app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))));
app.use("/", usersRouter);
app.use("/api/tasks", tasksRouter);
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

export default app;
