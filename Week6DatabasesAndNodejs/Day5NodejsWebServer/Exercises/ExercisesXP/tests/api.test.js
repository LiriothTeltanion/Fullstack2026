import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../app.js";
import { fetchPosts, POSTS_URL } from "../data/dataService.js";

const fixture = [{ id: 1, userId: 1, title: "Local fixture", body: "Deterministic data" }];

test("Axios data service returns data, checks shape and propagates failures", async () => {
  const client = {
    get: async (url, config) => {
      assert.equal(url, POSTS_URL);
      assert.equal(config.timeout, 5000);
      return { data: fixture };
    },
  };
  assert.deepEqual(await fetchPosts(client), fixture);
  await assert.rejects(fetchPosts({ get: async () => ({ data: {} }) }), /invalid data/);
  await assert.rejects(
    fetchPosts({
      get: async () => {
        throw new Error("offline");
      },
    }),
    /offline/
  );
});

test("Express blog, books and external data routes with an isolated fixture", async () => {
  let fail = false;
  const app = createApp({
    fetchPostsImpl: async () => {
      if (fail) throw new Error("offline");
      return fixture;
    },
  });
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(path, method = "GET", body) {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }
  try {
    assert.deepEqual((await request("/posts")).body, []);
    assert.equal((await request("/posts", "POST", {})).status, 400);
    const created = await request("/posts", "POST", { title: "Title", content: "Content" });
    assert.equal(created.status, 201);
    const id = created.body.id;
    assert.equal((await request(`/posts/${id}`)).body.content, "Content");
    assert.equal(
      (await request(`/posts/${id}`, "PUT", { title: "Edited", content: "Changed" })).body.title,
      "Edited"
    );
    assert.equal((await request(`/posts/${id}`, "DELETE")).status, 204);
    assert.equal((await request(`/posts/${id}`)).status, 404);
    assert.deepEqual((await request("/api/books")).body, []);
    assert.equal((await request("/api/books", "POST", {})).status, 400);
    const book = await request("/api/books", "POST", {
      title: "Example",
      author: "Demo",
      publishedYear: 2026,
    });
    assert.equal(book.status, 201);
    assert.equal((await request(`/api/books/${book.body.id}`)).body.publishedYear, 2026);
    assert.equal((await request("/api/books/999")).status, 404);
    assert.equal(
      (
        await request("/api/books", "POST", {
          title: "Example",
          author: "Demo",
          publishedYear: "bad",
        })
      ).status,
      400
    );
    assert.deepEqual((await request("/external-posts")).body, fixture);
    fail = true;
    assert.equal((await request("/external-posts")).status, 502);
    const invalid = await fetch(base + "/posts", {
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
