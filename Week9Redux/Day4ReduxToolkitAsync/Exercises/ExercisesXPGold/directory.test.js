import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";
import directory, { fetchUsers } from "./src/features/directory/directorySlice.js";

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
