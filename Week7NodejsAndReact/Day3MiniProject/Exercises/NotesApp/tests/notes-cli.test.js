import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const app = path.join(root, "app");
const guard = fileURLToPath(new URL("./offline-guard.cjs", import.meta.url));
const env = { ...process.env, NODE_OPTIONS: "" };
delete env.NODE_PATH;

function fixture(t) {
  const directory = mkdtempSync(path.join(tmpdir(), "notes CLI fixture "));
  const file = path.join(directory, "personal notes.json");
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep));
    rmSync(directory, { recursive: true });
  });
  return { directory, file };
}
function run(file, ...args) {
  const result = spawnSync(process.execPath, ["--require", guard, app, ...args, "--file", file], {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: 10000,
  });
  assert.equal(result.error, undefined);
  return { ...result, output: result.stdout + result.stderr };
}
const bytes = file => readFileSync(file);
const digest = file => createHash("sha256").update(bytes(file)).digest("hex");

test("real add/list/read/remove commands persist across separate Node processes", t => {
  const { file, directory } = fixture(t);
  const title = "Piano practice";
  const body = "Scales first.\nThen a new melody. 🎹 שלום";
  assert.equal(run(file, "add", "--title=" + title, "--body=" + body).status, 0);
  assert.deepEqual(JSON.parse(bytes(file)), [{ title, body }]);
  const listed = run(file, "list");
  assert.equal(listed.status, 0);
  assert.match(listed.stdout, /Notes: 1/);
  assert.ok(listed.stdout.includes(title));
  const read = run(file, "read", "--title=" + title);
  assert.equal(read.status, 0);
  assert.ok(read.stdout.includes(body));
  const removed = run(file, "remove", "--title=" + title);
  assert.equal(removed.status, 0);
  assert.match(removed.stdout, /Note removed/);
  assert.deepEqual(JSON.parse(bytes(file)), []);
  assert.deepEqual(readdirSync(directory), [path.basename(file)]);
});

test("duplicate titles report the existing note and preserve exact file bytes", t => {
  const { file } = fixture(t);
  assert.equal(run(file, "add", "--title=Keep", "--body=Original body").status, 0);
  const before = digest(file);
  const duplicate = run(file, "add", "--title=Keep", "--body=Different body");
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.output, /Note already exists/);
  assert.equal(digest(file), before);
});

test("reading or removing an absent title reports not found without losing other notes", t => {
  const { file } = fixture(t);
  assert.equal(run(file, "add", "--title=Retain", "--body=Preserved").status, 0);
  const before = digest(file);
  for (const command of ["read", "remove"]) {
    const missing = run(file, command, "--title=Absent");
    assert.equal(missing.status, 1);
    assert.match(missing.output, /Note not found/);
    assert.equal(digest(file), before);
  }
});

test("unknown commands and invalid arguments return a failure without creating notes", t => {
  const { file } = fixture(t);
  const unknown = run(file, "unknown");
  assert.equal(unknown.status, 2);
  assert.match(unknown.output, /command not recognized/);
  for (const args of [
    [],
    ["add", "--title=Missing body"],
    ["read"],
    ["add", "--title=   ", "--body=Text"],
    ["list", "--unexpected=value"],
  ]) {
    assert.notEqual(run(file, ...args).status, 0);
    assert.equal(existsSync(file), false);
  }
});

test("new-file list and help are read-only; optional empty bodies remain valid text", t => {
  const { file } = fixture(t);
  const empty = run(file, "list");
  assert.equal(empty.status, 0);
  assert.match(empty.stdout, /Notes: 0/);
  const help = run(file, "--help");
  assert.equal(help.status, 0);
  assert.match(help.stdout, /node app add/);
  assert.equal(existsSync(file), false);
  assert.equal(run(file, "add", "--title=Empty text", "--body=").status, 0);
  assert.deepEqual(JSON.parse(bytes(file)), [{ title: "Empty text", body: "" }]);
});

test("title lookup trims outer whitespace and remains case-sensitive", t => {
  const { file } = fixture(t);
  assert.equal(run(file, "add", "--title=  Tea  ", "--body=First").status, 0);
  assert.equal(run(file, "add", "--title=tea", "--body=Second").status, 0);
  assert.match(run(file, "read", "--title= Tea ").stdout, /Body: First/);
  assert.match(run(file, "read", "--title=tea").stdout, /Body: Second/);
});

test("corrupt or incompatible JSON is preserved instead of reset", t => {
  const { file } = fixture(t);
  for (const invalid of ["{ incomplete", '{"unexpected":"shape"}', '[{"title":"Saved"}]']) {
    writeFileSync(file, invalid);
    const before = digest(file);
    const result = run(file, "add", "--title=New", "--body=Text");
    assert.equal(result.status, 1);
    assert.match(result.output, /no changes were made/);
    assert.equal(digest(file), before);
    assert.equal(existsSync(file + ".lock"), false);
  }
});

test("an existing writer lock is retained and a second writer cannot overwrite notes", t => {
  const { file } = fixture(t);
  assert.equal(run(file, "add", "--title=Saved", "--body=Original").status, 0);
  writeFileSync(file + ".lock", "synthetic fixture lock");
  const before = digest(file);
  const busy = run(file, "add", "--title=Another", "--body=Text");
  assert.equal(busy.status, 1);
  assert.match(busy.output, /Notes file is busy/);
  assert.equal(digest(file), before);
  assert.equal(readFileSync(file + ".lock", "utf8"), "synthetic fixture lock");
});

test("the CLI never changes the web demo's existing JSON fixture", t => {
  const { file } = fixture(t);
  const webFile = path.join(root, "data", "notes.json");
  const before = digest(webFile);
  assert.equal(run(file, "add", "--title=Separate CLI", "--body=Local only").status, 0);
  assert.equal(digest(webFile), before);
});

test("the offline guard rejects a network call before a request can be sent", () => {
  const result = spawnSync(
    process.execPath,
    ["--require", guard, "-e", "fetch('https://example.invalid')"],
    { env, encoding: "utf8" }
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Network access is disabled/);
});
