import { Router } from "express";
import { getQuestion, submitAnswer, getScore, resetGame } from "../controllers/quizController.js";

const router = Router();

router.get("/", getQuestion); // current question
router.post("/", submitAnswer); // { "answer": "Paris" }
router.get("/score", getScore); // final score
router.post("/reset", resetGame); // play again

export default router;
