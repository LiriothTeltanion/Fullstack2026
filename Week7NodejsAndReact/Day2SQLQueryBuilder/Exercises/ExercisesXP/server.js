// Exercises XP: a blog API (Exercise 1) and a books API (Exercise 2) on Knex.
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import postsRouter from "./routes/posts.js";
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
app.use("/posts", postsRouter);
app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database errors from the controllers end up here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Database error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
