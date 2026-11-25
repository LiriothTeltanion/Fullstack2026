import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import app from "../app.js";
import { EMOJIS } from "../game.js";

test("Express game serves the form, scores guesses and rejects replay", async () => {
  assert.equal(typeof app.use, "function");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  async function getRound() {
    const response = await fetch(base + "/api/round");
    assert.equal(response.status, 200);
    const round = await response.json();
    assert.equal(round.options.length, 4);
    assert.ok(!("answer" in round));
    return round;
  }
  async function guess(round, answer) {
    return fetch(base + "/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundId: round.roundId, player: "Demo", guess: answer }),
    });
  }
  try {
    const html = await (await fetch(base)).text();
    assert.match(html, /<form/);
    for (let i = 0; i < 3; i++) {
      const round = await getRound();
      const answer = EMOJIS.find(item => item.emoji === round.emoji).name;
      assert.ok(round.options.includes(answer));
      const response = await guess(round, answer);
      const data = await response.json();
      assert.equal(data.correct, true);
      assert.equal(data.player.score, i === 2 ? 4 : i + 1);
      assert.equal((await guess(round, answer)).status, 404);
    }
    const round = await getRound();
    const answer = EMOJIS.find(item => item.emoji === round.emoji).name;
    const wrong = round.options.find(option => option !== answer);
    const feedback = await (await guess(round, wrong)).json();
    assert.equal(feedback.correct, false);
    assert.equal(feedback.player.streak, 0);
    const top = await (await fetch(base + "/api/leaderboard")).json();
    assert.equal(top[0].name, "Demo");
    assert.equal(top[0].score, 4);
    const invalid = await fetch(base + "/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{broken",
    });
    assert.equal(invalid.status, 400);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
