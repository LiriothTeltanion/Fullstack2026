import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, unlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";

test("task CRUD, JSON validation, concurrent writes and storage recovery", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "task-api-one-"));
  const file = join(temporary, "tasks.json");
  await writeFile(file, "[]");
  process.env.TASK_API_FILE = file;
  const { default: app } = await import("../app.js");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(path = "/tasks", method = "GET", body) {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  }
  try {
    assert.deepEqual((await request()).body, []);
    for (const body of [
      {},
      { title: " " },
      { title: "x", completed: "yes" },
      { title: "x", description: 1 },
    ]) {
      assert.equal((await request("/tasks", "POST", body)).status, 400);
    }
    const added = await Promise.all(
      Array.from({ length: 10 }, (_, i) => request("/tasks", "POST", { title: `Task ${i}` }))
    );
    assert.ok(added.every(item => item.status === 201));
    assert.equal(new Set(added.map(item => item.body.id)).size, 10);
    assert.equal((await request()).body.length, 10);
    assert.equal(JSON.parse(await readFile(file, "utf8")).length, 10);
    const id = added[0].body.id;
    assert.equal((await request(`/tasks/${id}`)).body.title, "Task 0");
    assert.equal((await request(`/tasks/${id}`, "PUT", { completed: true })).body.completed, true);
    assert.equal((await request(`/tasks/${id}`, "DELETE")).status, 200);
    assert.equal((await request(`/tasks/${id}`)).status, 404);
    assert.equal((await request("/tasks/999", "PUT", { title: "Absent" })).status, 404);
    const snapshot = await readFile(file);
    await unlink(file);
    assert.equal((await request()).status, 500);
    await writeFile(file, "{broken");
    assert.equal((await request("/tasks", "POST", { title: "Recover" })).status, 500);
    await writeFile(file, snapshot);
    assert.equal((await request("/tasks", "POST", { title: "Recovered" })).status, 201);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(temporary, { recursive: true, force: true });
  }
});
