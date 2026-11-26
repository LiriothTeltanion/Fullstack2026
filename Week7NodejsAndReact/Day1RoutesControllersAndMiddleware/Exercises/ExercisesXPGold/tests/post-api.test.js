import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("blog routes retain creation timestamps throughout the in-memory CRUD lifecycle", async t => {
  const key = randomBytes(24).toString("hex");
  const server = spawn(process.execPath, ["server.js"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    env: { ...process.env, HOST: "127.0.0.1", PORT: "0", API_KEY: key },
    stdio: ["ignore", "pipe", "pipe"],
  });
  t.after(() => server.kill());
  let output = "";
  const port = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Server startup timed out")), 10000);
    server.once("error", reject);
    server.once("exit", code => reject(new Error(`Server exited before startup: ${code}`)));
    server.stdout.on("data", chunk => {
      output += chunk;
      const address = /Server running on http:\/\/localhost:(\d+)\r?\n/.exec(output);
      if (address) {
        clearTimeout(timeout);
        resolve(Number(address[1]));
      }
    });
  });
  const request = async (path, method = "GET", body, authorized = false) => {
    const headers = { "Content-Type": "application/json" };
    if (authorized) headers["x-api-key"] = key;
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  };
  const initial = await request("/posts");
  assert.equal(initial.status, 200);
  assert.ok(initial.body.every(post => Number.isFinite(Date.parse(post.timestamp))));
  assert.equal((await request("/posts", "POST", { title: "x" })).status, 400);
  const created = await request("/posts", "POST", { title: " New post ", content: " Body " });
  assert.equal(created.status, 201);
  assert.equal(created.body.title, "New post");
  assert.equal(created.body.content, "Body");
  assert.ok(Number.isFinite(Date.parse(created.body.timestamp)));
  const id = created.body.id;
  assert.deepEqual((await request(`/posts/${id}`)).body, created.body);
  const updated = await request(`/posts/${id}`, "PUT", { title: "Updated", content: "Changed" });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.timestamp, created.body.timestamp);
  assert.equal((await request(`/posts/${id}`, "DELETE")).status, 401);
  assert.equal((await request(`/posts/${id}`, "DELETE", undefined, true)).status, 200);
  assert.equal((await request(`/posts/${id}`)).status, 404);
  assert.equal(
    (await request("/posts/999", "PUT", { title: "Missing", content: "Absent" })).status,
    404
  );
  assert.equal((await request("/unmatched")).status, 404);
});
