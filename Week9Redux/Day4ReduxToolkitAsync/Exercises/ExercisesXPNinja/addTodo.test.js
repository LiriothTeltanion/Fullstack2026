import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";
import { todosApi } from "./src/features/todos/todosApi.js";

for (const completionOrder of ["newer-first", "older-first"]) {
  test(`a failed creation preserves a different success (${completionOrder})`, async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];
    globalThis.fetch = request =>
      new Promise(resolve => {
        requests.push({ request, resolve });
      });
    const store = configureStore({
      reducer: { [todosApi.reducerPath]: todosApi.reducer },
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(todosApi.middleware),
    });
    const cached = () => todosApi.endpoints.getTodos.select()(store.getState()).data;
    const reply = (entry, status) =>
      entry.resolve(
        new Response(JSON.stringify({ id: 201 }), {
          status,
          headers: { "Content-Type": "application/json" },
        })
      );
    try {
      await store.dispatch(
        todosApi.util.upsertQueryData("getTodos", undefined, [
          { id: 1, title: "Existing fixture", completed: false, userId: 1 },
        ])
      );
      const older = store.dispatch(todosApi.endpoints.addTodo.initiate("Older fixture"));
      const newer = store.dispatch(todosApi.endpoints.addTodo.initiate("Newer fixture"));
      // RTK dispatches fetch asynchronously; wait for the real request boundary.
      const deadline = Date.now() + 3000;
      while (requests.length < 2 && Date.now() < deadline) await setImmediate();
      assert.equal(requests.length, 2);
      assert.equal(new Set(cached().map(todo => todo.id)).size, 3);
      const bodies = await Promise.all(requests.map(entry => entry.request.clone().json()));
      const oldRequest = requests[bodies.findIndex(body => body.title === "Older fixture")];
      const newRequest = requests[bodies.findIndex(body => body.title === "Newer fixture")];
      assert.ok(oldRequest && newRequest);
      if (completionOrder === "newer-first") {
        reply(newRequest, 201);
        await newer;
        reply(oldRequest, 503);
        await older;
      } else {
        reply(oldRequest, 503);
        await older;
        await setImmediate();
        assert.ok(cached().some(todo => todo.title === "Newer fixture"));
        reply(newRequest, 201);
        await newer;
      }
      await setImmediate();
      assert.deepEqual(
        cached()
          .map(todo => todo.title)
          .sort(),
        ["Existing fixture", "Newer fixture"]
      );
    } finally {
      store.dispatch(todosApi.util.resetApiState());
      globalThis.fetch = originalFetch;
      for (const entry of requests) reply(entry, 503);
    }
  });
}
