// Exercises XP Ninja: my own rate limiter, query filters and router.param().
import express from "express";
import rateLimit from "./middleware/rateLimit.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Exercise 1: at most 5 requests per IP every 10 seconds.
app.use(rateLimit({ windowMs: 10_000, max: 5 }));

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
