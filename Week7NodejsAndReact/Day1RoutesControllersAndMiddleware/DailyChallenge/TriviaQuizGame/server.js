// Trivia Quiz Game: an Express API under /quiz and a small page in public/.
import express from "express";
import rateLimit from "express-rate-limit";
import quizRouter from "./routes/quiz.js";

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
app.use(express.static("public"));
app.use("/quiz", quizRouter);

app.listen(PORT, () => {
  console.log(`Trivia game on http://localhost:${PORT}`);
});
