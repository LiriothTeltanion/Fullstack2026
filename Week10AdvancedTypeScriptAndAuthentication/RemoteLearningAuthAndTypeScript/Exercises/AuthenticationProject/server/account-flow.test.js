import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";

// Only fictitious local accounts and a test-only key are used by this suite.
process.env.JWT_SECRET = randomBytes(32).toString("hex");
const { default: app } = await import("./app.js");
let server;
let base;
let token;
let credentials;
let registration;
let accountCounter = 0;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve, reject) =>
    server.close(error => (error ? reject(error) : resolve()))
  );
});

async function request(path, { method = "GET", body, authenticated = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (authenticated && token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

beforeEach(async () => {
  credentials = {
    name: "Test Reader",
    email: `reader-${++accountCounter}@example.test`,
    password: randomBytes(24).toString("hex"),
  };
  registration = await request("/api/auth/register", {
    method: "POST",
    body: credentials,
    authenticated: false,
  });
  assert.equal(registration.status, 201);
  token = registration.data.token;
});

test("a local reader can register and read a profile", async () => {
  assert.equal(registration.status, 201);
  const profile = await request("/api/profile");
  assert.equal(profile.status, 200);
  assert.equal(profile.data.user.name, credentials.name);
  assert.equal(profile.data.user.bio, "");
});

test("invalid supplied names reject the complete update without changing bio", async () => {
  for (const name of ["", "   ", null, 42]) {
    const result = await request("/api/profile", {
      method: "PUT",
      body: { name, bio: "This must not be saved" },
    });
    assert.equal(result.status, 400);
    assert.match(result.data.error, /Name/);
    const profile = await request("/api/profile");
    assert.equal(profile.data.user.name, credentials.name);
    assert.equal(profile.data.user.bio, "");
  }
});

test("bio-only updates normalize text and allow clearing it", async () => {
  const saved = await request("/api/profile", {
    method: "PUT",
    body: { bio: "  Reading today  " },
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.user.name, credentials.name);
  assert.equal(saved.data.user.bio, "Reading today");
  const cleared = await request("/api/profile", { method: "PUT", body: { bio: "" } });
  assert.equal(cleared.status, 200);
  assert.equal(cleared.data.user.bio, "");
});

test("a valid name/profile update returns normalized saved values", async () => {
  const saved = await request("/api/profile", {
    method: "PUT",
    body: { name: "  Reader Updated  ", bio: "  A short bio  " },
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.user.name, "Reader Updated");
  assert.equal(saved.data.user.bio, "A short bio");
});

test("logging in again returns the existing profile in this process", async () => {
  await request("/api/profile", {
    method: "PUT",
    body: { name: "Reader Updated", bio: "A short bio" },
  });
  const login = await request("/api/auth/login", {
    method: "POST",
    body: { email: credentials.email, password: credentials.password },
    authenticated: false,
  });
  assert.equal(login.status, 200);
  token = login.data.token;
  assert.equal(login.data.user.name, "Reader Updated");
  assert.equal(login.data.user.bio, "A short bio");
});

test("a saved session belongs only to the server process that issued it", () => {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import assert from "node:assert/strict";
    import { readFileSync } from "node:fs";
    import jwt from "jsonwebtoken";
    import { JWT_SECRET, TOKEN_ISSUER } from "./settings.js";
    const savedToken = readFileSync(0, "utf8");
    assert.throws(() => jwt.verify(savedToken, JWT_SECRET, { issuer: TOKEN_ISSUER }), /jwt issuer invalid/);
    process.stdout.write("previous-process-session-unavailable");
  `,
    ],
    {
      cwd: new URL("./", import.meta.url),
      input: token,
      encoding: "utf8",
    }
  );
  assert.equal(output, "previous-process-session-unavailable");
});
