import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createApp } from "../app.js";

async function fixture(t) {
  const server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close(error => (error ? reject(error) : resolve()))
    );
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    get: path => fetch(origin + path),
    post: body =>
      fetch(origin + "/greeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    raw: (body, contentType) =>
      fetch(origin + "/greeting", {
        method: "POST",
        headers: { "Content-Type": contentType },
        body,
      }),
  };
}

test("greets each allowed emoji and normalizes accented/multilingual names", async t => {
  const api = await fixture(t);
  for (const emoji of ["👋", "😊", "☀️", "🎉", "🚀", "💙"]) {
    const response = await api.post({ name: "  Jose\u0301   Rivera  ", emoji });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      name: "José Rivera",
      emoji,
      greeting: `Hello, José Rivera! ${emoji}`,
    });
  }
  const hebrew = await api.post({ name: "מיה", emoji: "💙" });
  assert.equal((await hebrew.json()).greeting, "Hello, מיה! 💙");
  const boundary = await api.post({ name: "A".repeat(60), emoji: "👋" });
  assert.equal(boundary.status, 200);
});

test("rejects missing, wrong-type and unsupported greeting values without changing users", async t => {
  const api = await fixture(t);
  const before = await (await api.get("/users")).json();
  for (const body of [
    {},
    { name: "   ", emoji: "👋" },
    { name: 42, emoji: "👋" },
    { name: ["Noa"], emoji: "👋" },
    { name: { value: "Noa" }, emoji: "👋" },
    { name: "Noa", emoji: ["👋"] },
    { name: "Noa", emoji: null },
    { name: "Noa", emoji: "not-an-emoji" },
    { name: "Noa", emoji: "👋😊" },
    { name: "A".repeat(61), emoji: "👋" },
    { name: "Noa\nMaya", emoji: "👋" },
    { name: "Noa\u202e", emoji: "👋" },
    { name: "\u0301", emoji: "👋" },
    { name: '<img src=x onerror="alert(1)">', emoji: "👋" },
  ]) {
    const response = await api.post(body);
    assert.equal(response.status, 400, JSON.stringify(body));
    const data = await response.json();
    assert.equal(data.error, "Check your name and emoji.");
    assert.ok(Object.keys(data.fields).length > 0);
    assert.equal("greeting" in data, false);
  }
  assert.deepEqual(await (await api.get("/users")).json(), before);
});

test("handles malformed JSON and excessive payloads with clean errors", async t => {
  const api = await fixture(t);
  const malformed = await api.raw('{"name":', "application/json");
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { error: "Send a valid JSON greeting request." });
  const oversized = await api.post({ name: "A".repeat(3000), emoji: "👋" });
  assert.equal(oversized.status, 413);
  assert.deepEqual(await oversized.json(), { error: "The greeting request is too large." });
  for (const body of [null, []]) assert.equal((await api.post(body)).status, 400);
});

test("accepts the native URL-encoded form and rejects repeated input fields", async t => {
  const api = await fixture(t);
  const native = await api.raw(
    new URLSearchParams({ name: "O'Neil", emoji: "🚀" }).toString(),
    "application/x-www-form-urlencoded"
  );
  assert.equal(native.status, 200);
  assert.equal((await native.json()).greeting, "Hello, O'Neil! 🚀");
  const repeated = await api.raw(
    "name=Noa&name=Maya&emoji=" + encodeURIComponent("👋"),
    "application/x-www-form-urlencoded"
  );
  assert.equal(repeated.status, 400);
  assert.ok((await repeated.json()).fields.name);
});

test("serves the root form and all local browser entry points", async t => {
  const api = await fixture(t);
  const root = await api.get("/");
  assert.equal(root.status, 200);
  const html = await root.text();
  assert.match(html, /<form[^>]*method="post"[^>]*action="\/greeting"/);
  assert.equal((html.match(/type="radio"/g) || []).length, 6);
  assert.match(html, /role="status"/);
  assert.match(html, /role="alert"/);
  for (const asset of ["/app.js", "/greeting-validation.js", "/style.css"]) {
    assert.equal((await api.get(asset)).status, 200, asset);
  }
});

test("retains the users filter, paging and parameter routes", async t => {
  const api = await fixture(t);
  const filtered = await api.get("/users?city=tel%20aviv&page=1&limit=2");
  assert.equal(filtered.status, 200);
  const value = await filtered.json();
  assert.equal(value.page, 1);
  assert.equal(value.limit, 2);
  assert.equal(value.total, 3);
  assert.equal(value.data.length, 2);
  assert.ok(value.data.every(user => user.city === "Tel Aviv"));
  const user = await api.get("/users/1");
  assert.equal(user.status, 200);
  assert.equal((await user.json()).id, 1);
  const missing = await api.get("/users/999");
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: "User 999 not found" });
});

test("keeps the original five-request users budget independent of form assets", async t => {
  const api = await fixture(t);
  for (let i = 0; i < 7; i++) {
    assert.equal((await api.get("/")).status, 200);
    assert.equal((await api.post({ name: "Noa", emoji: "😊" })).status, 200);
  }
  for (let i = 0; i < 5; i++) assert.equal((await api.get("/users")).status, 200);
  const limited = await api.get("/users");
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) >= 1);
  assert.match((await limited.json()).error, /^Too many requests, try again in \d+s$/);
  assert.equal((await api.post({ name: "Still works", emoji: "🎉" })).status, 200);
});

test("returns a validation response for an unsupported body type", async t => {
  const api = await fixture(t);
  const response = await api.raw("name=Noa", "text/plain");
  assert.equal(response.status, 400);
  assert.equal((await response.json()).greeting, undefined);
});

test("the normal server entry point serves the form on an ephemeral port", async t => {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill();
      await exited;
    }
  });
  const port = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Normal server did not start")), 8000);
    child.stdout.on("data", chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) {
        clearTimeout(timer);
        resolve(Number(match[1]));
      }
    });
    child.once("exit", code => {
      clearTimeout(timer);
      reject(new Error(`Server exited ${code}`));
    });
  });
  const response = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /A little hello/);
});
