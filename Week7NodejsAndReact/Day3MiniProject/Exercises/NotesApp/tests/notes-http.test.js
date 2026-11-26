import test from "node:test";
import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { once } from "node:events";
import net from "node:net";

test("Notes API serializes mutations and retains recoverable errors", async t => {
  const project = fileURLToPath(new URL("../", import.meta.url));
  const fixture = await mkdtemp(join(tmpdir(), "notes-http-regression-"));
  for (const path of ["server.js", "controllers", "models", "routes", "public"]) {
    await cp(join(project, path), join(fixture, path), { recursive: true });
  }
  await writeFile(join(fixture, "package.json"), '{"type":"module"}');
  await mkdir(join(fixture, "data"));
  const dataFile = join(fixture, "data", "notes.json");
  await writeFile(dataFile, "[]\n");
  await symlink(
    resolve(project, "node_modules"),
    join(fixture, "node_modules"),
    process.platform === "win32" ? "junction" : "dir"
  );
  const available = net.createServer();
  await new Promise(ok => available.listen(0, "127.0.0.1", ok));
  const port = available.address().port;
  await new Promise(ok => available.close(ok));
  const base = "http://127.0.0.1:" + port;
  const child = spawn(process.execPath, ["server.js"], {
    cwd: fixture,
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });
  const closed = once(child, "exit");
  async function request(method, path, body) {
    const response = await fetch(base + "/api/notes" + path, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }
  async function create(title) {
    return request("POST", "", { title, body: "Temporary fixture" });
  }
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        await request("GET", "");
        ready = true;
        break;
      } catch {
        await new Promise(ok => setTimeout(ok, 20));
      }
    }
    assert.equal(ready, true, "fixture server started");
    await t.test("create, search, edit and delete through HTTP", async () => {
      const created = await create("First");
      assert.equal(created.status, 201);
      const id = created.body.id;
      assert.equal((await request("GET", "?q=temporary")).body[0].id, id);
      const updated = await request("PUT", "/" + id, {
        title: "Edited",
        body: "Changed",
      });
      assert.equal(updated.status, 200);
      assert.equal(updated.body.id, id);
      assert.equal(updated.body.title, "Edited");
      assert.equal((await request("DELETE", "/" + id)).status, 204);
      assert.deepEqual((await request("GET", "")).body, []);
      assert.equal((await request("DELETE", "/" + id)).status, 404);
    });
    await t.test("invalid input leaves the file unchanged", async () => {
      const before = await readFile(dataFile, "utf8");
      assert.equal((await create("   ")).status, 400);
      assert.equal((await request("POST", "", { title: "Bad", body: 1 })).status, 400);
      assert.equal(await readFile(dataFile, "utf8"), before);
    });
    await t.test("ten concurrent successful creates retain ten unique notes", async () => {
      const results = await Promise.all(
        Array.from({ length: 10 }, (_, i) => create("Parallel " + i))
      );
      assert.ok(results.every(result => result.status === 201));
      assert.equal(new Set(results.map(result => result.body.id)).size, 10);
      const notes = (await request("GET", "")).body;
      assert.equal(notes.length, 10);
      assert.equal(new Set(notes.map(note => note.title)).size, 10);
    });
    await t.test("concurrent updates and deletion preserve independent changes", async () => {
      const notes = (await request("GET", "")).body;
      const [first, second, third] = notes;
      const results = await Promise.all([
        request("PUT", "/" + first.id, { title: "Changed A", body: "A" }),
        request("PUT", "/" + second.id, { title: "Changed B", body: "B" }),
        request("DELETE", "/" + third.id),
      ]);
      assert.deepEqual(
        results.map(result => result.status),
        [200, 200, 204]
      );
      const after = (await request("GET", "")).body;
      assert.equal(after.length, 9);
      assert.equal(after.find(note => note.id === first.id).title, "Changed A");
      assert.equal(after.find(note => note.id === second.id).title, "Changed B");
      assert.equal(
        after.some(note => note.id === third.id),
        false
      );
    });
    await t.test("malformed JSON returns 400 and the next correct request succeeds", async () => {
      const response = await fetch(base + "/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"title":',
      });
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: "Invalid JSON body" });
      assert.equal((await create("After invalid JSON")).status, 201);
    });
    await t.test("readers observe valid snapshots while writes are queued", async () => {
      const before = (await request("GET", "")).body.length;
      const results = await Promise.all([
        ...Array.from({ length: 10 }, (_, i) => create("Snapshot " + i)),
        ...Array.from({ length: 10 }, () => request("GET", "")),
      ]);
      assert.ok(results.slice(0, 10).every(result => result.status === 201));
      assert.ok(
        results.slice(10).every(result => result.status === 200 && Array.isArray(result.body))
      );
      assert.equal((await request("GET", "")).body.length, before + 10);
    });
    await t.test(
      "internal error remains generic and a failed mutation does not poison the queue",
      async () => {
        const backup = await readFile(dataFile, "utf8");
        await writeFile(dataFile, "{broken");
        const failure = await create("Read failure");
        assert.equal(failure.status, 500);
        assert.deepEqual(failure.body, {
          error: "Could not read or save the notes",
        });
        await writeFile(dataFile, backup);
        assert.equal((await create("Queue recovered")).status, 201);
      }
    );
  } finally {
    child.kill();
    await closed;
    await rm(fixture, { recursive: true, force: true });
  }
});
