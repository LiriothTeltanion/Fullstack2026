import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createPracticeServer } from "../simple-server.js";

async function start(t) {
  const server = createPracticeServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    const closed = once(server, "close");
    server.close();
    server.closeAllConnections();
    await closed;
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test("home responds with the required HTML heading and HTML content type", async t => {
  const base = await start(t);
  const res = await fetch(base);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /^text\/html; charset=utf-8$/);
  const html = await res.text();
  assert.match(html, /<h1>Welcome to My Server<\/h1>/);
  assert.match(html, /<html lang="en">/);
  assert.equal(Number(res.headers.get("content-length")), Buffer.byteLength(html));
});

test("plain text and about routes demonstrate distinct native HTTP responses", async t => {
  const base = await start(t);
  const plain = await fetch(`${base}/hello`);
  assert.equal(plain.status, 200);
  assert.match(plain.headers.get("content-type"), /^text\/plain/);
  assert.equal(await plain.text(), "Hello, this is your server!\n");
  const about = await fetch(`${base}/about`);
  assert.equal(about.status, 200);
  assert.match(about.headers.get("content-type"), /^text\/html/);
  assert.match(await about.text(), /<h1>About this server<\/h1>/);
});

test("menu returns the specified nested JSON representation", async t => {
  const base = await start(t);
  const res = await fetch(`${base}/menu`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /^application\/json/);
  assert.deepEqual(await res.json(), {
    menu: { firstCourse: "Vegetable Soup", mainCourse: "Hamburger", dessert: "Fruit salad" },
  });
});

test("query strings preserve the selected route and unknown paths are404", async t => {
  const base = await start(t);
  assert.equal((await fetch(`${base}/menu?source=test`)).status, 200);
  const res = await fetch(`${base}/missing`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: "Page not found" });
});

test("HEAD has representation headers without a body; unsupported methods are405", async t => {
  const base = await start(t);
  const head = await fetch(`${base}/menu`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.match(head.headers.get("content-type"), /^application\/json/);
  assert.ok(Number(head.headers.get("content-length")) > 0);
  assert.equal(await head.text(), "");
  const post = await fetch(`${base}/menu`, { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
  assert.deepEqual(await post.json(), { error: "Method not allowed" });
});

test("the documented executable starts normally with a temporary PORT override", async t => {
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL("../simple-server.js", import.meta.url))],
    {
      env: { ...process.env, PORT: "0", HOST: "127.0.0.1" },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill();
      await exited;
    }
  });
  const output = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Server startup timed out")), 5000);
    child.once("error", error => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", () => {
      clearTimeout(timeout);
      reject(new Error("Server exited before startup"));
    });
    child.stdout.once("data", chunk => {
      clearTimeout(timeout);
      resolve(chunk.toString());
    });
  });
  const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
  assert.ok(url);
  assert.equal((await fetch(`${url}/menu`)).status, 200);
});
