import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { createQuizApp } from "../quiz-app.js";
import { questions } from "../quiz-questions.js";

async function fixture(t, options) {
  const server = createQuizApp(options).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise(resolve => {
        server.closeAllConnections();
        server.close(resolve);
      })
  );
  const origin = "http://127.0.0.1:" + server.address().port;
  async function request(path = "", { method = "GET", body, cookie, raw } = {}) {
    const headers = {};
    if (cookie) headers.Cookie = cookie;
    if (body !== undefined || raw !== undefined) headers["Content-Type"] = "application/json";
    const response = await fetch(origin + "/api/quiz" + path, {
      method,
      headers,
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
    return { status: response.status, headers: response.headers, body: await response.json() };
  }
  async function start(cookie) {
    const response = await request("", { method: "POST", body: {}, cookie });
    return { ...response, cookie: response.headers.get("set-cookie")?.split(";")[0] };
  }
  const answer = (cookie, question, choiceId = question.correctChoiceId) =>
    request("/answers", { method: "POST", cookie, body: { questionId: question.id, choiceId } });
  const next = (cookie, question) =>
    request("/next", { method: "POST", cookie, body: { questionId: question.id } });
  return { origin, request, start, answer, next };
}

test("start exposes exactly one question without answer keys; reload resumes", async t => {
  const f = await fixture(t);
  assert.equal((await f.request()).status, 404);
  const quiz = await f.start();
  assert.equal(quiz.status, 201);
  assert.equal(quiz.body.question.id, questions[0].id);
  assert.equal(quiz.body.question.choices.length, 3);
  assert.equal(quiz.body.score, 0);
  assert.equal(quiz.body.total, 5);
  assert.equal(quiz.body.feedback, null);
  assert.equal(JSON.stringify(quiz.body).includes("correctChoiceId"), false);
  assert.match(quiz.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(quiz.headers.get("set-cookie"), /SameSite=Strict/i);
  assert.equal(quiz.headers.get("cache-control"), "no-store");
  assert.deepEqual((await f.request("", { cookie: quiz.cookie })).body, quiz.body);
});

test("correct answer scores once even when concurrent retries arrive", async t => {
  const f = await fixture(t);
  const { cookie } = await f.start();
  const replies = await Promise.all([
    f.answer(cookie, questions[0]),
    f.answer(cookie, questions[0]),
  ]);
  assert.equal(replies[0].body.feedback.correct, true);
  assert.equal(replies[0].body.score, 1);
  assert.deepEqual(replies[0].body, replies[1].body);
  assert.equal((await f.answer(cookie, questions[0], "b")).status, 409);
  assert.equal((await f.request("", { cookie })).body.score, 1);
});

test("incorrect answer gives immediate feedback without a point", async t => {
  const f = await fixture(t);
  const { cookie } = await f.start();
  const answer = await f.answer(cookie, questions[0], "b");
  assert.equal(answer.body.score, 0);
  assert.equal(answer.body.feedback.correct, false);
  assert.equal(answer.body.feedback.correctChoiceId, "a");
  assert.ok(answer.body.feedback.explanation.length > 0);
  assert.deepEqual((await f.request("", { cookie })).body, answer.body);
});

test("cannot skip questions; Next retries cannot advance twice", async t => {
  const f = await fixture(t);
  const { cookie } = await f.start();
  assert.equal((await f.next(cookie, questions[0])).status, 409);
  await f.answer(cookie, questions[0]);
  const next = await f.next(cookie, questions[0]);
  const retried = await f.next(cookie, questions[0]);
  assert.equal(next.body.question.id, questions[1].id);
  assert.deepEqual(retried.body, next.body);
  assert.equal((await f.answer(cookie, questions[0])).status, 409);
  assert.equal((await f.request("", { cookie })).body.score, 1);
});

test("invalid choices and malformed JSON leave the score untouched", async t => {
  const f = await fixture(t);
  const { cookie } = await f.start();
  assert.equal((await f.answer(cookie, questions[0], "not-an-option")).status, 400);
  assert.equal((await f.request("/answers", { method: "POST", cookie, body: {} })).status, 409);
  const malformed = await f.request("/answers", { method: "POST", cookie, raw: "{" });
  assert.equal(malformed.status, 400);
  assert.equal(malformed.body.error, "Send a valid JSON request.");
  assert.equal((await f.request("", { cookie })).body.score, 0);
});

test("complete quiz reports the exact final score and forbids extra answers", async t => {
  const f = await fixture(t);
  const { cookie } = await f.start();
  let result;
  for (const question of questions) {
    await f.answer(cookie, question);
    result = await f.next(cookie, question);
  }
  assert.equal(result.body.complete, true);
  assert.equal(result.body.question, null);
  assert.equal(result.body.score, 5);
  assert.equal(result.body.answered, 5);
  assert.deepEqual((await f.next(cookie, questions.at(-1))).body, result.body);
  assert.equal((await f.answer(cookie, questions.at(-1))).status, 409);
});

test("mixed answers produce a final score of two out of five", async t => {
  const f = await fixture(t);
  const { cookie } = await f.start();
  let result;
  for (const [index, question] of questions.entries()) {
    const choice =
      index < 2
        ? question.correctChoiceId
        : question.choices.find(item => item.id !== question.correctChoiceId).id;
    await f.answer(cookie, question, choice);
    result = await f.next(cookie, question);
  }
  assert.equal(result.body.score, 2);
  assert.equal(result.body.total, 5);
});

test("two browsers stay isolated; restarting one leaves the other intact", async t => {
  const f = await fixture(t);
  const first = await f.start();
  const second = await f.start();
  assert.notEqual(first.cookie, second.cookie);
  await f.answer(first.cookie, questions[0]);
  assert.equal((await f.request("", { cookie: second.cookie })).body.score, 0);
  const fresh = await f.start(first.cookie);
  assert.equal(fresh.body.score, 0);
  assert.equal((await f.request("", { cookie: first.cookie })).status, 404);
  assert.equal((await f.request("", { cookie: second.cookie })).status, 200);
});

test("sessions expire and free bounded capacity without evicting other players", async t => {
  let time = 1000;
  const f = await fixture(t, { now: () => time, ttlMs: 100, maxSessions: 1 });
  const quiz = await f.start();
  assert.equal((await f.start()).status, 503);
  time = 1101;
  assert.equal((await f.request("", { cookie: quiz.cookie })).status, 404);
  assert.equal((await f.start()).status, 201);
});

test("separate application instances never share their sessions", async t => {
  const one = await fixture(t);
  const two = await fixture(t);
  const quiz = await one.start();
  assert.equal((await two.request("", { cookie: quiz.cookie })).status, 404);
  assert.equal((await one.request("", { cookie: quiz.cookie })).status, 200);
});

test("quiz page and preserved static pages are served from the same origin", async t => {
  const f = await fixture(t);
  for (const route of ["/", "/quiz.css", "/quiz.js", "/static-demo", "/about.html", "/style.css"]) {
    const response = await fetch(f.origin + route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
    await response.text();
  }
  assert.equal((await f.request("/missing")).status, 404);
});

test("original static-server executable still starts and retains its response header", async t => {
  const portProbe = createServer().listen(0, "127.0.0.1");
  await once(portProbe, "listening");
  const port = portProbe.address().port;
  await new Promise(resolve => portProbe.close(resolve));
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL("../static-server.js", import.meta.url))],
    { env: { ...process.env, PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"] }
  );
  t.after(async () => {
    if (child.exitCode === null) {
      child.kill();
      await once(child, "exit");
    }
  });
  await Promise.race([
    once(child.stdout, "data"),
    once(child, "error").then(([error]) => {
      throw error;
    }),
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error("Original server did not start")), 5000);
      timer.unref();
    }),
  ]);
  const response = await fetch("http://127.0.0.1:" + port + "/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("x-response-time"), /ms$/);
  assert.match(await response.text(), /Served by my own static server/);
  const missing = await fetch("http://127.0.0.1:" + port + "/ordinary-missing-page.html");
  assert.equal(missing.status, 404);
  await missing.text();
});
