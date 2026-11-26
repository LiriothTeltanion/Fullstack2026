import test from "node:test";
import assert from "node:assert/strict";
import { getUsers, getUser, getPostsByUser, isValidUserId } from "../src/api.js";

async function withFetch(fetcher, check) {
  const previous = globalThis.fetch;
  globalThis.fetch = fetcher;
  try {
    await check();
  } finally {
    globalThis.fetch = previous;
  }
}
const response = value => ({ ok: true, json: async () => value });

test("users, details and posts use the expected public paths and abort signal", async () => {
  const calls = [];
  const controller = new AbortController();
  await withFetch(
    async (url, options) => {
      calls.push({ url, signal: options.signal });
      return response(
        url.endsWith("/users")
          ? [{ id: 1, name: "Fixture user" }]
          : url.includes("/posts?")
            ? [{ id: 2, title: "Fixture post", body: "Original local fixture" }]
            : { id: 1, name: "Fixture user" }
      );
    },
    async () => {
      await getUsers({ signal: controller.signal });
      await getUser("1", { signal: controller.signal });
      await getPostsByUser(1, { signal: controller.signal });
    }
  );
  assert.deepEqual(
    calls.map(call => call.url),
    [
      "https://jsonplaceholder.typicode.com/users",
      "https://jsonplaceholder.typicode.com/users/1",
      "https://jsonplaceholder.typicode.com/posts?userId=1",
    ]
  );
  assert.ok(calls.every(call => call.signal === controller.signal));
});
test("empty collections are valid and remain distinguishable from errors", async () => {
  await withFetch(
    async () => response([]),
    async () => {
      assert.deepEqual(await getUsers(), []);
      assert.deepEqual(await getPostsByUser(1), []);
    }
  );
});
test("HTTP failures and malformed JSON are reported instead of rendered as success", async () => {
  await withFetch(
    async () => ({ ok: false, status: 503 }),
    async () => assert.rejects(getUsers(), /503/)
  );
  await withFetch(
    async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError("fixture JSON");
      },
    }),
    async () => assert.rejects(getUsers(), /invalid JSON/)
  );
});
test("unexpected API shapes produce a controlled error", async () => {
  await withFetch(
    async () => response({ users: [] }),
    async () => assert.rejects(getUsers(), /invalid user list/)
  );
  await withFetch(
    async () => response(null),
    async () => assert.rejects(getUser(1), /invalid user/)
  );
  await withFetch(
    async () => response([{ title: "Missing body" }]),
    async () => assert.rejects(getPostsByUser(1), /invalid post list/)
  );
});
test("invalid user routes are rejected before a network request", async () => {
  let requests = 0;
  await withFetch(
    async () => {
      requests += 1;
      return response([]);
    },
    async () => {
      for (const id of ["missing", "0", "-1", "1.5", ""]) {
        assert.equal(isValidUserId(id), false);
        await assert.rejects(getUser(id), /valid user number/);
      }
    }
  );
  assert.equal(requests, 0);
});
test("an aborted request keeps its cancellation identity", async () => {
  const error = new Error("Fixture request canceled");
  error.name = "AbortError";
  await withFetch(
    async () => {
      throw error;
    },
    async () => assert.rejects(getUsers(), { name: "AbortError" })
  );
});
