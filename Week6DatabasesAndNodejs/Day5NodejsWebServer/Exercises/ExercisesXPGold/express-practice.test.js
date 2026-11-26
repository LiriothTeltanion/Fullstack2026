import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { test } from "node:test";
import { createPracticeApi } from "./express-practice.js";

// Exercise actual HTTP middleware and routing. Only the third-party post provider
// is replaced locally so CRUD tests never depend on an external write service.
async function setup(t, postsClient) {
  const server = createPracticeApi({ postsClient }).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return async (method, route, body, headers = {}) => {
    const response = await fetch(origin + route, {
      method,
      headers: {
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return {
      status: response.status,
      data: response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : await response.text(),
    };
  };
}

test("post CRUD uses the expected methods, paths and validation", async t => {
  const calls = [];
  const post = { title: "First", body: "Soundcheck", userId: 1 };
  const request = await setup(t, {
    request: async options => {
      calls.push(options);
      return { data: options.data || (options.url === "/posts" ? [post] : post) };
    },
  });
  assert.deepEqual((await request("GET", "/posts")).data, [post]);
  assert.equal((await request("GET", "/posts/1")).status, 200);
  assert.equal((await request("POST", "/posts", post)).status, 201);
  assert.equal((await request("PUT", "/posts/1", post)).status, 200);
  assert.equal((await request("DELETE", "/posts/1")).status, 204);
  assert.equal((await request("POST", "/posts", { ...post, title: " " })).status, 400);
  assert.equal((await request("GET", "/posts/no")).status, 400);
  assert.deepEqual(
    calls.map(c => [c.method, c.url]),
    [
      ["get", "/posts"],
      ["get", "/posts/1"],
      ["post", "/posts"],
      ["put", "/posts/1"],
      ["delete", "/posts/1"],
    ]
  );
});

test("the posts proxy distinguishes a missing post from an unavailable provider", async t => {
  const request = await setup(t, {
    request: async ({ url }) => {
      if (url === "/posts/9")
        throw Object.assign(new Error("Missing"), { response: { status: 404 } });
      throw new Error("Offline");
    },
  });
  assert.equal((await request("GET", "/posts/9")).status, 404);
  assert.equal((await request("GET", "/posts")).status, 502);
});

test("registration, login and authenticated profile form a complete local flow", async t => {
  const request = await setup(t);
  const payload = { username: "  Studio  ", password: randomBytes(18).toString("hex") };
  const attempts = await Promise.all([
    request("POST", "/auth/register", payload),
    request("POST", "/auth/register", payload),
  ]);
  assert.deepEqual(attempts.map(a => a.status).sort(), [201, 409]);
  const created = attempts.find(a => a.status === 201).data;
  assert.deepEqual(Object.keys(created).sort(), ["id", "username"]);
  assert.equal(created.username, "Studio");
  const loggedIn = await request("POST", "/auth/login", { ...payload, username: "studio" });
  assert.equal(loggedIn.status, 200);
  assert.deepEqual(
    (
      await request("GET", "/auth/profile", undefined, {
        Authorization: "Bearer " + loggedIn.data.token,
      })
    ).data,
    created
  );
  assert.equal((await request("GET", "/auth/profile")).status, 401);
  assert.equal(
    (await request("POST", "/auth/login", { ...payload, password: payload.password + "!" })).status,
    401
  );
  assert.equal(
    (await request("POST", "/auth/register", { ...payload, password: "short" })).status,
    400
  );
});

test("todos keep stable IDs and a boolean completion flag throughout CRUD", async t => {
  const request = await setup(t);
  assert.deepEqual((await request("GET", "/todos")).data, []);
  const a = await request("POST", "/todos", { title: "  Rehearse ", completed: true });
  assert.deepEqual(a, { status: 201, data: { id: 1, title: "Rehearse", completed: true } });
  assert.equal((await request("PATCH", "/todos/1", { completed: "false" })).status, 400);
  assert.equal((await request("PATCH", "/todos/1", { completed: false })).data.completed, false);
  assert.equal((await request("GET", "/todos/1")).data.title, "Rehearse");
  assert.equal(
    (await request("PUT", "/todos/1", { title: "Record", completed: true })).data.title,
    "Record"
  );
  assert.equal((await request("DELETE", "/todos/1")).status, 204);
  assert.equal((await request("GET", "/todos/1")).status, 404);
  assert.equal((await request("POST", "/todos", { title: "Encore" })).data.id, 2);
  assert.equal((await request("POST", "/todos", { title: " " })).status, 400);
});
