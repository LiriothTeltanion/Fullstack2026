import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";
import directory, {
  fetchPostsByUser,
  fetchUsers,
} from "./src/features/directory/directorySlice.js";

test("the directory shares an in-flight user load and reuses a successful result", async t => {
  const store = configureStore({ reducer: { directory } });
  const users = [{ id: 1, name: "Ada" }];
  const request = t.mock.method(globalThis, "fetch", async () => Response.json(users));

  const first = store.dispatch(fetchUsers());
  const duplicate = store.dispatch(fetchUsers());
  await Promise.all([first, duplicate]);
  await store.dispatch(fetchUsers());

  assert.equal(request.mock.callCount(), 1);
  assert.deepEqual(store.getState().directory.users, users);
});

test("a failed user load can be retried without reloading the app", async t => {
  const store = configureStore({ reducer: { directory } });
  const request = t.mock.method(globalThis, "fetch", async () => Response.json([]));
  request.mock.mockImplementationOnce(async () => new Response(null, { status: 503 }));

  await store.dispatch(fetchUsers());
  assert.equal(store.getState().directory.usersStatus, "failed");
  await store.dispatch(fetchUsers());
  assert.equal(store.getState().directory.usersStatus, "succeeded");
  assert.equal(request.mock.callCount(), 2);
});

test("an invalid users response leaves the directory usable and retryable", async t => {
  const store = configureStore({ reducer: { directory } });
  const users = [{ id: 1, name: "Ada" }];
  const request = t.mock.method(globalThis, "fetch", async () => Response.json(users));
  for (const body of [null, {}, [null], [{ id: 1, name: {} }]]) {
    request.mock.mockImplementationOnce(async () => Response.json(body));
    await store.dispatch(fetchUsers());
    assert.equal(store.getState().directory.usersStatus, "failed");
    assert.deepEqual(store.getState().directory.users, []);
  }
  await store.dispatch(fetchUsers());
  assert.deepEqual(store.getState().directory.users, users);
});

test("malformed posts can be retried without disturbing another user's cached list", async t => {
  const store = configureStore({ reducer: { directory } });
  const posts = [{ id: 10, title: "Morning notes" }];
  const request = t.mock.method(globalThis, "fetch", async () => Response.json(posts));
  await store.dispatch(fetchPostsByUser(1));
  for (const body of [null, [null], [{ id: 20 }]]) {
    request.mock.mockImplementationOnce(async () => Response.json(body));
    await store.dispatch(fetchPostsByUser(2));
    const entries = store.getState().directory.postsByUser;
    assert.equal(entries[2].status, "failed");
    assert.deepEqual(entries[2].items, []);
    assert.deepEqual(entries[1].items, posts);
  }
  request.mock.mockImplementationOnce(async () => Response.json([]));
  await store.dispatch(fetchPostsByUser(2));
  assert.equal(store.getState().directory.postsByUser[2].status, "succeeded");
  assert.deepEqual(store.getState().directory.postsByUser[2].items, []);
});
