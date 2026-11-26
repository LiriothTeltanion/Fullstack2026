# Express Quiz and Preserved Static Server

An original five-question browser quiz served by Express. It shows one multiple-choice question at a time, gives immediate correct/incorrect feedback, tracks the score on the server and displays a final result. The earlier native HTTP static server remains available without source changes.

## Run the quiz

Requires Node.js 22 or later and npm.

```sh
npm ci
npm run quiz
```

Open **http://127.0.0.1:3021**. In PowerShell, choose another port with `$env:PORT = "4000"; npm run quiz`. The quiz binds to loopback by default; `HOST` can be explicitly configured for a trusted local network. There is no hosted deployment or production-service claim.

## Play and resume

1. Start a quiz and select one answer.
2. Submit to see feedback and a short explanation. Incorrect answers receive no point.
3. Continue to the next question. After question five, choose **Show results**.
4. Restart to begin a fresh attempt. Reloading resumes the same browser's active attempt and feedback.

Scoring is server-owned. Retrying an identical answer cannot award another point; changing an already submitted answer or sending a stale question is rejected. Retrying Next cannot skip a question. A failed browser request retains the selection for retry. The answer key is not sent with unanswered questions; correct-answer explanations are revealed only after submission.

## API

All state is bound to an anonymous, HttpOnly, SameSite=Strict session cookie. Cookies use Secure when served over HTTPS. No name, email, password, browser storage or external service is needed.

| Method | Path                | Purpose                                            |
| ------ | ------------------- | -------------------------------------------------- |
| POST   | `/api/quiz`         | Start/restart this browser's quiz                  |
| GET    | `/api/quiz`         | Resume current state                               |
| POST   | `/api/quiz/answers` | Submit `{ "questionId": "http", "choiceId": "a" }` |
| POST   | `/api/quiz/next`    | Advance using the answered `questionId`            |

Responses contain the current question, score, total and optional feedback. Completion returns `complete: true`, `question: null` and the final score. Invalid input is rejected; missing/expired sessions return 404, conflicting transitions 409, malformed JSON 400, oversized JSON 413 and full session capacity 503. The API disables caching. Each application instance has its own store, capped at 500 sessions, with 30 minutes of inactivity expiry. Restarting the process loses all attempts. This is intentionally single-process practice, not a persistent multiplayer service.

## Original static server

```sh
npm start
# Equivalent: node static-server.js
```

Open **http://localhost:3020**. Original request logging, response-time headers, MIME types, errors and rate limiting are retained. All original `public/` files and `static-server.js` are unchanged. The original README is preserved in [STATIC_SERVER.md](STATIC_SERVER.md), with equivalent HTML line breaks replacing two trailing-space Markdown breaks. The quiz also links to the original page at `/static-demo`, with its About and CSS links supported on the quiz origin; this route uses Express rather than the original server's logging/rate-limit implementation.

## Verify and explain

```sh
npm test
npm audit
```

[Regression tests](tests/README.md) cover main/error paths, correct and mixed final scores, answer/Next retries, session isolation, expiry, capacity, reload state and original executable startup. The browser UI uses semantic radio groups, visible keyboard focus, live feedback and responsive layouts, with no third-party assets. Browser QA evidence is kept privately; automated checks do not establish learning mastery or an official grade.

Timers, difficulty selection, leaderboards, database persistence and authentication are deliberately outside this implementation. The five practice questions and explanations are original; no course prompt or question bank is redistributed.

Learning check: explain why a repeated POST must carry the question identifier, and why a process restart clears these sessions.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
