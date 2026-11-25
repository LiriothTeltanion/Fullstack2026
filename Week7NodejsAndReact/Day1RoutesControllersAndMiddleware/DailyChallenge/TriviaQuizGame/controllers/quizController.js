import { triviaQuestions } from "../data/questions.js";

// One game for the whole server: fine for a single player on localhost.
const game = { current: 0, score: 0 };

function isFinished() {
  return game.current >= triviaQuestions.length;
}

function normalize(text) {
  return String(text).trim().toLowerCase();
}

export function getQuestion(req, res) {
  if (isFinished()) {
    return res.json({ finished: true, message: "No more questions. See /quiz/score" });
  }
  res.json({
    finished: false,
    number: game.current + 1,
    total: triviaQuestions.length,
    question: triviaQuestions[game.current].question,
  });
}

export function submitAnswer(req, res) {
  if (isFinished()) {
    return res.status(400).json({ error: "The quiz is over. POST /quiz/reset to play again." });
  }
  const { answer } = req.body;
  if (typeof answer !== "string" || answer.trim() === "") {
    return res.status(400).json({ error: "Send an answer in the body: { answer }" });
  }

  const { answer: correctAnswer } = triviaQuestions[game.current];
  const correct = normalize(answer) === normalize(correctAnswer);
  if (correct) game.score += 1;
  game.current += 1;

  res.json({
    correct,
    correctAnswer,
    score: game.score,
    finished: isFinished(),
  });
}

export function getScore(req, res) {
  res.json({
    score: game.score,
    answered: game.current,
    total: triviaQuestions.length,
    finished: isFinished(),
  });
}

export function resetGame(req, res) {
  game.current = 0;
  game.score = 0;
  res.json({ message: "New game started" });
}
