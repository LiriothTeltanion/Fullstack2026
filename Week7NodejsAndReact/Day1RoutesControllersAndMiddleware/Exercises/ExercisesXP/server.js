// Exercises XP: three routers mounted on one Express app.
import express from "express";
import rateLimit from "express-rate-limit";
import logger from "./middleware/logger.js";
import indexRouter from "./routes/index.js";
import todosRouter from "./routes/todos.js";
import booksRouter from "./routes/books.js";

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
app.use(logger);

app.use("/", indexRouter); // Exercise 1
app.use("/todos", todosRouter); // Exercise 2
app.use("/books", booksRouter); // Exercise 3

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.url}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
