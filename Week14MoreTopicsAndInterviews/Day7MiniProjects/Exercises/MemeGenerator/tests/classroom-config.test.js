import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test, { after, before } from "node:test";
import { build, createServer, normalizePath, resolveConfig } from "vite";
import configure from "../vite.config.js";

const project = fileURLToPath(new URL("../", import.meta.url));
const originalFixture = "/* Original test fixture. */\nbody { --classroom-fixture: 1; }\n";
let fixture;
let configFile;

before(async () => {
  // Resolve the package dependencies without reading its private classroom file.
  fixture = await mkdtemp(join(project, ".classroom-config-test-"));
  configFile = join(fixture, "vite.config.js");
  await writeFile(configFile, await readFile(new URL("../vite.config.js", import.meta.url)));
  await mkdir(join(fixture, ".classroom"));
  await writeFile(join(fixture, ".classroom", "App.css"), originalFixture);
  await writeFile(
    join(fixture, "index.html"),
    "<!doctype html><html><head></head><body><h1>Fixture</h1></body></html>"
  );
});

after(async () => {
  if (fixture) await rm(fixture, { recursive: true, force: true });
});

function resolved(mode, options = {}, isPreview = false) {
  return resolveConfig(
    { root: fixture, configFile, envFile: false, mode, logLevel: "silent", ...options },
    "serve",
    undefined,
    undefined,
    isPreview
  );
}

test("classroom builds and previews are rejected before checking a private sheet", async () => {
  for (const environment of [
    { command: "build", mode: "classroom" },
    { command: "serve", mode: "classroom", isPreview: true },
  ]) {
    assert.throws(() => configure(environment), /Classroom styles are development-only/);
  }
  await assert.rejects(
    () => resolved("classroom", {}, true),
    /Classroom styles are development-only/
  );
});

test("ordinary development keeps Vite and caller exclusions in its compiled matcher", async () => {
  const defaults = await resolveConfig(
    { root: fixture, configFile: false, envFile: false, logLevel: "silent" },
    "serve"
  );
  const config = await resolved("development", {
    server: { fs: { deny: ["**/fixture-internal/**"] } },
  });
  for (const pattern of defaults.server.fs.deny) {
    assert.ok(config.server.fs.deny.includes(pattern), `Missing Vite exclusion ${pattern}`);
  }
  assert.ok(config.server.fs.deny.includes("**/fixture-internal/**"));
  assert.ok(config.server.fs.deny.includes("**/.classroom/**"));
  // These are fictional names passed to the predicate, never HTTP file requests.
  assert.equal(
    config.fsDenyGlob(normalizePath(join(fixture, ".classroom", "fictional.css"))),
    true
  );
  assert.equal(config.fsDenyGlob(normalizePath(join(fixture, ".env.synthetic"))), true);
  assert.equal(
    config.fsDenyGlob(normalizePath(join(fixture, "fixture-internal", "fictional.txt"))),
    true
  );
  assert.equal(config.fsDenyGlob(normalizePath(join(fixture, "src", "public.css"))), false);
  assert.equal(
    config.plugins.some(plugin => plugin.name === "local-classroom-styles"),
    false
  );
});

test("resolved classroom defaults bind both hosts to loopback", async () => {
  const config = await resolved("classroom");
  assert.equal(config.server.host, "127.0.0.1");
  assert.equal(config.preview.host, "127.0.0.1");
  assert.equal(
    config.fsDenyGlob(normalizePath(join(fixture, ".classroom", "fictional.css"))),
    true
  );
});

test("ordinary builds omit the synthetic private sheet and classroom link", async () => {
  const outDir = join(fixture, "dist");
  await build({
    root: fixture,
    configFile,
    envFile: false,
    mode: "production",
    logLevel: "silent",
    build: { outDir },
  });
  const files = await readdir(outDir, { recursive: true });
  assert.equal(
    files.some(file => file.includes(".classroom")),
    false
  );
  const document = await readFile(join(outDir, "index.html"), "utf8");
  assert.doesNotMatch(document, /__classroom-reference|--classroom-fixture/);
});

test("classroom rejects nonloopback server and preview overrides", async () => {
  for (const options of [
    { server: { host: true } },
    { server: { host: "0.0.0.0" } },
    { server: { host: "::" } },
    { server: { host: "192.0.2.1" } },
    { preview: { host: true } },
    { preview: { host: "0.0.0.0" } },
  ]) {
    await assert.rejects(() => resolved("classroom", options), /requires a loopback host/);
  }
});

test("explicit loopback overrides remain supported", async () => {
  for (const host of ["127.0.0.1", "localhost", "::1"]) {
    const config = await resolved("classroom", { server: { host }, preview: { host } });
    assert.equal(config.server.host, host);
    assert.equal(config.preview.host, host);
  }
});

test("classroom middleware serves the original fixture through its intended development entry", async () => {
  const server = await createServer({
    root: fixture,
    configFile,
    envFile: false,
    mode: "classroom",
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0 },
  });
  try {
    await server.listen();
    const address = server.httpServer.address();
    const origin = `http://127.0.0.1:${address.port}`;
    const document = await fetch(origin);
    assert.equal(document.status, 200);
    assert.match(await document.text(), /href="\/__classroom-reference\.css"/);
    const stylesheet = await fetch(`${origin}/__classroom-reference.css`);
    assert.equal(stylesheet.status, 200);
    assert.match(stylesheet.headers.get("Content-Type"), /text\/css/);
    assert.equal(stylesheet.headers.get("Cache-Control"), "no-store");
    assert.equal(await stylesheet.text(), originalFixture);
  } finally {
    await server.close();
  }
});
