import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { fileInfo } from "./file-info.js";
import { datePair, digitsIn, isPracticeFullName, postTitles, sampleUsers } from "./practice.js";

test("file information distinguishes missing files and measures bytes on disk", async t => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "node-gold-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const filename = path.join(directory, "song.txt");
  assert.equal((await fileInfo(filename)).exists, false);
  await writeFile(filename, "café", "utf8");
  const info = await fileInfo(filename);
  assert.equal(info.exists, true);
  assert.equal(info.extension, ".txt");
  assert.equal(info.name, "song.txt");
  assert.equal(info.bytes, (await readFile(filename)).byteLength);
  assert.ok(Number.isFinite(info.modified.getTime()));
  await assert.rejects(fileInfo(directory), /Expected a file/);
});

test("post titles keep API order, handle empty lists and report upstream failures", async () => {
  const fake = data => ({ get: async () => ({ data }) });
  assert.deepEqual(await postTitles(fake([{ title: "First" }, { title: "Encore" }])), [
    "First",
    "Encore",
  ]);
  assert.deepEqual(await postTitles(fake([])), []);
  await assert.rejects(postTitles(fake([{}])), /unexpected response/);
  await assert.rejects(
    postTitles({
      get: async () => {
        throw new Error("offline");
      },
    }),
    /offline/
  );
});

test("five local calendar days cross leap days and year boundaries", () => {
  assert.deepEqual(datePair(new Date(2024, 1, 25)), {
    today: "2024-02-25",
    inFiveDays: "2024-03-01",
  });
  assert.deepEqual(datePair(new Date(2025, 11, 30)), {
    today: "2025-12-30",
    inFiveDays: "2026-01-04",
  });
});

test("Faker generates the requested number of synthetic records", () => {
  const users = sampleUsers(4);
  assert.equal(users.length, 4);
  assert.equal(new Set(users.map(user => user.email)).size, 4);
  for (const user of users) {
    for (const key of ["name", "street", "city", "country"]) assert.ok(user[key].trim());
    assert.match(user.email, /@example\.test$/);
  }
  for (const value of [0, -1, 2.5, 101, NaN]) assert.throws(() => sampleUsers(value), RangeError);
});

test("digit extraction preserves zeros and order without converting to a number", () => {
  assert.equal(digitsIn("t0r4-7"), "047");
  assert.equal(digitsIn("no digits"), "");
});

test("name exercise handles letters, combining marks and uncased scripts", () => {
  for (const name of ["María Pérez", "Jean-Luc Picard", "לירי כהן", "E\u0301lodie Martin"]) {
    assert.equal(isPracticeFullName(name), true, name);
  }
  for (const name of ["Solo", "anna Smith", "Alex  Jones", "Alex Jones\n", "Alex 73"]) {
    assert.equal(isPracticeFullName(name), false, name);
  }
});

test("the terminal entry prints results and fails helpfully for invalid commands", () => {
  const entry = fileURLToPath(new URL("./examples.js", import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [entry, ...args], { encoding: "utf8" });
  const success = run("digits", "a09k8");
  assert.equal(success.status, 0);
  assert.equal(success.stdout.trim(), "098");
  const error = run("users", "0");
  assert.equal(error.status, 1);
  assert.match(error.stderr, /1 to 100/);
  assert.equal(run("unknown").status, 1);
});
