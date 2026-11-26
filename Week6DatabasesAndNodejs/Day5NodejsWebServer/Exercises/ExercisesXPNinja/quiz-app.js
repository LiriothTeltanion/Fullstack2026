import express from "express";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { questions } from "./quiz-questions.js";

const cookieName = "quiz_session";
const quizDirectory = fileURLToPath(new URL("./quiz-public/", import.meta.url));
const originalDirectory = fileURLToPath(new URL("./public/", import.meta.url));

function cookieId(request) {
  return (request.headers.cookie ?? "")
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith(cookieName + "="))
    ?.slice(cookieName.length + 1);
}

// Every application instance owns its own bounded anonymous session store.
export function createQuizApp({ now = Date.now, ttlMs = 30 * 60_000, maxSessions = 500 } = {}) {
  const app = express();
  const sessions = new Map();
  app.disable("x-powered-by");
  app.use((_request, response, next) => {
    response.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
    );
    response.set("X-Content-Type-Options", "nosniff");
    next();
  });
  app.use("/api/quiz", (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "4kb" }));

  function state(session) {
    const question = questions[session.cursor];
    return {
      score: session.score,
      total: questions.length,
      number: question ? session.cursor + 1 : questions.length,
      answered: session.cursor + (session.answer ? 1 : 0),
      complete: !question,
      question: question
        ? { id: question.id, prompt: question.prompt, choices: question.choices }
        : null,
      feedback: session.answer,
    };
  }

  function current(request, response) {
    // Lazy expiry needs no interval and removes inactive entries on ordinary traffic.
    for (const [id, session] of sessions) {
      if (session.expiresAt <= now()) sessions.delete(id);
    }
    const session = sessions.get(cookieId(request));
    if (!session) {
      response.status(404).json({ error: "No active quiz. Start a new quiz." });
      return null;
    }
    session.expiresAt = now() + ttlMs;
    return session;
  }

  app.post("/api/quiz", (request, response) => {
    for (const [id, session] of sessions) {
      if (session.expiresAt <= now()) sessions.delete(id);
    }
    sessions.delete(cookieId(request));
    if (sessions.size >= maxSessions)
      return response.status(503).json({ error: "Quiz capacity reached. Please try again later." });
    const id = randomUUID();
    const session = {
      cursor: 0,
      score: 0,
      answer: null,
      lastAdvance: null,
      expiresAt: now() + ttlMs,
    };
    sessions.set(id, session);
    response.cookie(cookieName, id, {
      httpOnly: true,
      sameSite: "strict",
      secure: request.secure,
      path: "/api/quiz",
    });
    return response.status(201).json(state(session));
  });

  app.get("/api/quiz", (request, response) => {
    const session = current(request, response);
    if (session) response.json(state(session));
  });

  app.post("/api/quiz/answers", (request, response) => {
    const session = current(request, response);
    if (!session) return;
    const question = questions[session.cursor];
    if (!question)
      return response
        .status(409)
        .json({ error: "This quiz is finished. Start a new quiz to play again." });
    const { questionId, choiceId } = request.body ?? {};
    if (questionId !== question.id)
      return response
        .status(409)
        .json({ error: "The question changed. Reload to resume the current question." });
    if (!question.choices.some(choice => choice.id === choiceId))
      return response.status(400).json({ error: "Choose one of the available answers." });
    // A retry of the same answer is idempotent, including after a lost response.
    if (session.answer) {
      if (session.answer.choiceId !== choiceId)
        return response.status(409).json({ error: "This question was already answered." });
      return response.json(state(session));
    }
    const correct = choiceId === question.correctChoiceId;
    session.score += correct ? 1 : 0;
    session.answer = {
      choiceId,
      correct,
      correctChoiceId: question.correctChoiceId,
      explanation: question.explanation,
    };
    return response.json(state(session));
  });

  app.post("/api/quiz/next", (request, response) => {
    const session = current(request, response);
    if (!session) return;
    const questionId = request.body?.questionId;
    // A retried Next request must not skip the new question.
    if (questionId && questionId === session.lastAdvance) return response.json(state(session));
    const question = questions[session.cursor];
    if (!question || questionId !== question.id)
      return response.status(409).json({ error: "The question changed. Reload to resume." });
    if (!session.answer)
      return response.status(409).json({ error: "Submit an answer before continuing." });
    session.lastAdvance = question.id;
    session.cursor += 1;
    session.answer = null;
    return response.json(state(session));
  });

  app.use("/api", (_request, response) =>
    response.status(404).json({ error: "API route not found." })
  );
  app.use(express.static(quizDirectory));
  app.get("/static-demo", (_request, response) =>
    response.sendFile(originalDirectory + "/index.html")
  );
  // Existing absolute /style.css and /about.html links continue to work here.
  app.use(express.static(originalDirectory, { index: false }));
  app.use((_request, response) => response.status(404).type("text").send("Page not found"));
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    const status = error.status === 413 ? 413 : error.type === "entity.parse.failed" ? 400 : 500;
    response.status(status).json({
      error:
        status === 400
          ? "Send a valid JSON request."
          : status === 413
            ? "Request is too large."
            : "The quiz could not process this request.",
    });
  });
  return app;
}
