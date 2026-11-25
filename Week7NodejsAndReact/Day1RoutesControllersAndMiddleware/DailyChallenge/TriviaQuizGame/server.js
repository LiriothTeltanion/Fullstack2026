// Trivia Quiz Game: an Express API under /quiz and a small page in public/.
import express from "express";
import quizRouter from "./routes/quiz.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/quiz", quizRouter);

app.listen(PORT, () => {
  console.log(`Trivia game on http://localhost:${PORT}`);
});
