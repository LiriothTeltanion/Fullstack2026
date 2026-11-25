// Exercises XP Gold: middleware in every position (global, per route, 404, errors).
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import requestTime from "./middleware/requestTime.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import postsRouter from "./routes/posts.js";

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
app.use(requestTime); // Exercise 1: runs before every route

app.get("/time", (req, res) => {
  res.json({ requestedAt: req.requestTime, tookMs: Date.now() - req.startMs });
});

app.use("/posts", postsRouter); // Exercises 2 and 3

// Exercise 4: a route that fails on purpose, to see the error handler.
app.get("/broken", () => {
  throw new Error("Something broke on purpose");
});

app.use(notFound);
app.use(errorHandler); // error handlers go last and take four arguments

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
