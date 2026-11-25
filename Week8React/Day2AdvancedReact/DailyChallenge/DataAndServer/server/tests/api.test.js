import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import app from "../app.js";

test("greeting and POST keep their API contract and validate input types", async t => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const messages = [];
  t.mock.method(console, "log", (...args) => messages.push(args));
  try {
    assert.deepEqual(await (await fetch(base + "/api/hello")).json(), {
      message: "Hello From Express",
    });
    const response = await fetch(base + "/api/world", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: "course demo" }),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      message: "I received your POST request. This is what you sent me: course demo",
    });
    assert.deepEqual(messages, [["Received:", "course demo"]]);
    for (const post of ["", "  ", 42, false, null, {}]) {
      const invalid = await fetch(base + "/api/world", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post }),
      });
      assert.equal(invalid.status, 400);
      assert.equal((await invalid.json()).error, "Please type something first.");
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
