import assert from "node:assert/strict";
import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

// Copy only application code, so a personal notes.json is never loaded or changed.
async function temporaryCli(t) {
  const folder = await mkdtemp(path.join(tmpdir(), "fullstack-notes-test-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  for (const name of ["notes.js", "notesStore.js", "package.json"]) {
    await copyFile(new URL(name, import.meta.url), path.join(folder, name));
  }
  return {
    run: (...args) =>
      spawnSync(process.execPath, [path.join(folder, "notes.js"), ...args], { encoding: "utf8" }),
    read: () => readFile(path.join(folder, "notes.json"), "utf8"),
  };
}

test("documented CLI commands persist, find, read and remove notes", async t => {
  const cli = await temporaryCli(t);
  assert.equal(cli.run("list").stdout.trim(), "No notes yet.");
  const first = cli.run("add", "Shopping", "Guitar strings and a capo");
  assert.equal(first.status, 0);
  assert.match(first.stdout, /Added note #1: Shopping/);
  assert.equal(cli.run("add", "Course", "Finish the Week 6 SQL challenges").status, 0);
  const list = cli.run("list");
  assert.equal(list.status, 0);
  assert.match(list.stdout, /2 note\(s\):/);
  assert.match(list.stdout, /#1 Shopping \(\d{4}-\d{2}-\d{2}\)/);
  assert.match(list.stdout, /#2 Course/);
  const search = cli.run("search", "GUITAR");
  assert.equal(search.status, 0);
  assert.match(search.stdout, /1 match\(es\)/);
  assert.match(search.stdout, /#1 Shopping/);
  const read = cli.run("read", "2");
  assert.equal(read.status, 0);
  assert.match(read.stdout, /Finish the Week 6 SQL challenges/);
  const remove = cli.run("remove", "1");
  assert.equal(remove.status, 0);
  assert.equal(remove.stdout.trim(), "Removed note #1");
  const notes = JSON.parse(await cli.read());
  assert.equal(notes.length, 1);
  assert.equal(notes[0].id, 2);
  assert.equal(cli.run("add", "Music").status, 0);
  assert.equal(JSON.parse(await cli.read())[1].id, 3);
  assert.match(cli.run("read", "3").stdout, /\(empty\)/);
});

test("duplicate titles and missing IDs report errors and preserve saved notes", async t => {
  const cli = await temporaryCli(t);
  assert.equal(cli.run("add", "Shopping", "Strings").status, 0);
  const original = await cli.read();
  const duplicate = cli.run("add", "SHOPPING", "Duplicate");
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /already exists/);
  for (const command of ["read", "remove"]) {
    for (const id of ["99", "bad"]) {
      const result = cli.run(command, id);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /No note with id/);
    }
  }
  assert.equal(cli.run("add").status, 1);
  assert.equal(await cli.read(), original);
});

test("all unregistered commands, including inherited property names, print help and fail", async t => {
  const cli = await temporaryCli(t);
  assert.equal(cli.run("add", "Saved", "Keep this note").status, 0);
  const original = await cli.read();
  for (const command of [undefined, "unknown", ...Object.getOwnPropertyNames(Object.prototype)]) {
    const result = command === undefined ? cli.run() : cli.run(command);
    assert.equal(result.status, 1, String(command));
    assert.equal(
      result.stdout.trim(),
      "Commands: add, list, read, search, remove",
      String(command)
    );
    assert.equal(result.stderr, "", String(command));
  }
  assert.equal(await cli.read(), original);
});
