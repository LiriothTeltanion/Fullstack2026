// Emoji Guessing Game: an Express server with a small JSON API and static files.
//   GET  /                -> public/index.html (and its CSS and JS)
//   GET  /api/round       -> { roundId, emoji, options }
//   POST /api/guess       -> body { roundId, player, guess } -> { correct, answer, player }
//   GET  /api/leaderboard -> top 5 players
import express from "express";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRound, createScoreboard } from "./game.js";

const PUBLIC_DIR = fileURLToPath(new URL("./public/", import.meta.url));
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };

// The answer stays on the server; the browser only gets the round id
const rounds = new Map();
const scoreboard = createScoreboard();

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("invalid JSON"));
      }
    });
  });
}

async function serveStatic(res, urlPath) {
  const name = urlPath === "/" ? "index.html" : path.basename(urlPath); // no sub-folders, no ../
  try {
    const content = await readFile(path.join(PUBLIC_DIR, name));
    const type = TYPES[path.extname(name)] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    res.end(content);
  } catch {
    sendJson(res, 404, { error: "Not found" });
  }
}

async function handle(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && pathname === "/api/round") {
    const round = createRound();
    const roundId = randomUUID();
    rounds.set(roundId, round.answer);
    return sendJson(res, 200, { roundId, emoji: round.emoji, options: round.options });
  }

  if (req.method === "POST" && pathname === "/api/guess") {
    let body;
    try {
      body = await readBody(req);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
    const { roundId, guess } = body;
    const player = String(body.player ?? "")
      .trim()
      .slice(0, 20);
    if (!player) return sendJson(res, 400, { error: "Please type a player name" });

    const answer = rounds.get(roundId);
    if (!answer) return sendJson(res, 404, { error: "Round not found or already answered" });
    rounds.delete(roundId); // one guess per round

    const correct = guess === answer;
    return sendJson(res, 200, { correct, answer, player: scoreboard.record(player, correct) });
  }

  if (req.method === "GET" && pathname === "/api/leaderboard") {
    return sendJson(res, 200, scoreboard.top(5));
  }

  if (req.method === "GET") return serveStatic(res, pathname);

  sendJson(res, 405, { error: "Method not allowed" });
}

const app = express();
app.use((req, res) => {
  handle(req, res).catch(error => {
    console.error(error);
    sendJson(res, 500, { error: "Server error" });
  });
});

export default app;
