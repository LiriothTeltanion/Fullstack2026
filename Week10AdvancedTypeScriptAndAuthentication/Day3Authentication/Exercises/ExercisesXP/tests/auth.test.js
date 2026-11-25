import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const here = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const samplePhrase = "Sample-Orchard-Cloud-47";

async function workspace() {
  const directory = await mkdtemp(join(tmpdir(), "jwt-course-"));
  assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + sep));
  return {
    directory,
    file: join(directory, "auth.sqlite"),
    secret: randomBytes(32).toString("hex"),
  };
}
async function boot(state, overrides = {}) {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: here,
    env: {
      ...process.env,
      PORT: "0",
      NODE_ENV: "test",
      EMAIL_CONFIRMATION_MODE: "local",
      JWT_SECRET: state.secret,
      JWT_REFRESH_SECRET: "",
      AUTH_DB_FILE: state.file,
      ACCESS_TOKEN_SECONDS: "900",
      REFRESH_TOKEN_SECONDS: "604800",
      ...overrides,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  let errors = "";
  child.stderr.on("data", chunk => {
    errors += chunk;
  });
  const base = await new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error("Server readiness timed out.")), 8000);
    child.stdout.on("data", chunk => {
      output += chunk;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) {
        clearTimeout(timer);
        resolveReady(match[0]);
      }
    });
    child.once("exit", code => {
      clearTimeout(timer);
      reject(new Error("Server stopped before readiness: " + code + " " + errors.slice(0, 100)));
    });
  });
  async function request(path, method = "GET", data, cookies = "", extra = {}) {
    const response = await fetch(base + "/api" + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(cookies ? { Cookie: cookies } : {}),
        ...extra,
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    const set = response.headers.getSetCookie();
    return {
      status: response.status,
      data: await response.json(),
      set,
      cookies: set.map(cookie => cookie.split(";")[0]).join("; "),
    };
  }
  async function close() {
    if (child.exitCode !== null) return;
    child.kill();
    await once(child, "close");
  }
  return { request, close };
}
async function enroll(service, username = "sample_writer") {
  const registered = await service.request("/auth/register", "POST", {
    username,
    email: username + "@example.com",
    password: samplePhrase,
  });
  assert.equal(registered.status, 201);
  assert.equal(registered.data.user.emailVerified, false);
  assert.equal(
    (
      await service.request("/auth/confirm-email", "POST", {
        token: registered.data.developmentConfirmation.token,
      })
    ).status,
    200
  );
  return service.request("/auth/login", "POST", { username, password: samplePhrase });
}
async function cleanup(state) {
  await rm(state.directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

test("registration validates fields, confirms email once and issues separate cookies", async () => {
  const state = await workspace();
  const service = await boot(state);
  try {
    assert.equal((await service.request("/auth/me")).status, 401);
    for (const patch of [
      { email: "invalid" },
      { username: " " },
      { password: "short" },
      { password: "😀".repeat(20) },
    ]) {
      const response = await service.request("/auth/register", "POST", {
        username: "sample_writer",
        email: "sample@example.com",
        password: samplePhrase,
        ...patch,
      });
      assert.equal(response.status, 400);
    }
    const response = await service.request("/auth/register", "POST", {
      username: "sample_writer",
      email: "sample@example.com",
      password: samplePhrase,
    });
    assert.equal(response.status, 201);
    assert.equal(response.data.user.passwordHash, undefined);
    assert.equal(
      (
        await service.request("/auth/login", "POST", {
          username: "sample_writer",
          password: samplePhrase,
        })
      ).status,
      403
    );
    assert.equal(
      (
        await service.request("/auth/register", "POST", {
          username: "SAMPLE_WRITER",
          email: "second@example.com",
          password: samplePhrase,
        })
      ).status,
      409
    );
    const confirmation = response.data.developmentConfirmation.token;
    assert.equal(
      (await service.request("/auth/confirm-email", "POST", { token: confirmation })).status,
      200
    );
    assert.equal(
      (await service.request("/auth/confirm-email", "POST", { token: confirmation })).status,
      400
    );
    const login = await service.request("/auth/login", "POST", {
      username: "sample_writer",
      password: samplePhrase,
    });
    assert.equal(login.status, 200);
    assert.equal(login.set.length, 2);
    assert.ok(
      login.set.every(cookie => cookie.includes("HttpOnly") && cookie.includes("SameSite=Strict"))
    );
    const ages = login.set.map(cookie => Number(cookie.match(/Max-Age=(\d+)/)[1]));
    assert.ok(Math.max(...ages) > Math.min(...ages));
    assert.equal(
      (await service.request("/auth/profile", "GET", undefined, login.cookies)).data.user
        .emailVerified,
      true
    );
    assert.equal(
      (
        await service.request("/users", "GET", undefined, "", {
          Authorization: "Bearer " + login.data.token,
        })
      ).status,
      200
    );
    const db = new DatabaseSync(state.file);
    assert.notEqual(db.prepare("SELECT passwordHash FROM users").get().passwordHash, samplePhrase);
    assert.equal(db.prepare("SELECT confirmationDigest FROM users").get().confirmationDigest, null);
    db.close();
  } finally {
    await service.close();
    await cleanup(state);
  }
});
test("expired access refreshes, rotation prevents replay and rejects refresh as access", async () => {
  const state = await workspace();
  const service = await boot(state, { ACCESS_TOKEN_SECONDS: "1" });
  try {
    const login = await enroll(service);
    const originalRefresh = login.cookies
      .split("; ")
      .find(cookie => cookie.startsWith("refresh_token="))
      .split("=")[1];
    assert.equal(
      (
        await service.request("/auth/me", "GET", undefined, "", {
          Authorization: "Bearer " + originalRefresh,
        })
      ).status,
      401
    );
    await new Promise(resolveDelay => setTimeout(resolveDelay, 1200));
    assert.equal((await service.request("/auth/me", "GET", undefined, login.cookies)).status, 401);
    const refreshed = await service.request("/auth/refresh", "POST", {}, login.cookies);
    assert.equal(refreshed.status, 200);
    assert.ok(refreshed.cookies !== login.cookies, "Refresh must rotate its cookies.");
    assert.equal(
      (await service.request("/auth/me", "GET", undefined, refreshed.cookies)).status,
      200
    );
    assert.equal((await service.request("/auth/refresh", "POST", {}, login.cookies)).status, 401);
    assert.equal(
      (await service.request("/auth/me", "GET", undefined, refreshed.cookies)).status,
      401
    );
  } finally {
    await service.close();
    await cleanup(state);
  }
});
test("logout revokes persistent access and refresh state", async () => {
  const state = await workspace();
  const service = await boot(state);
  try {
    const login = await enroll(service);
    const logout = await service.request("/auth/logout", "POST", {}, "", {
      Authorization: "Bearer " + login.data.token,
    });
    assert.equal(logout.status, 200);
    assert.ok(logout.set.every(cookie => cookie.includes("Expires=Thu, 01 Jan 1970")));
    assert.equal(
      (
        await service.request("/auth/me", "GET", undefined, "", {
          Authorization: "Bearer " + login.data.token,
        })
      ).status,
      401
    );
    assert.equal((await service.request("/auth/refresh", "POST", {}, login.cookies)).status, 401);
  } finally {
    await service.close();
    await cleanup(state);
  }
});
test("account confirmation and active refresh sessions survive restart", async () => {
  const state = await workspace();
  let service = await boot(state);
  try {
    const login = await enroll(service);
    await service.close();
    service = await boot(state);
    const refreshed = await service.request("/auth/refresh", "POST", {}, login.cookies);
    assert.equal(refreshed.status, 200);
    assert.equal(
      (await service.request("/auth/me", "GET", undefined, refreshed.cookies)).data.user
        .emailVerified,
      true
    );
    await service.request("/auth/logout", "POST", {}, refreshed.cookies);
    await service.close();
    service = await boot(state);
    assert.equal(
      (await service.request("/auth/refresh", "POST", {}, refreshed.cookies)).status,
      401
    );
  } finally {
    await service.close();
    await cleanup(state);
  }
});
test("two concurrent refreshes have one winner and revoke the reused family", async () => {
  const state = await workspace();
  const service = await boot(state);
  try {
    const login = await enroll(service);
    const results = await Promise.all([
      service.request("/auth/refresh", "POST", {}, login.cookies),
      service.request("/auth/refresh", "POST", {}, login.cookies),
    ]);
    assert.deepEqual(results.map(result => result.status).sort(), [200, 401]);
    const winner = results.find(result => result.status === 200);
    assert.equal((await service.request("/auth/me", "GET", undefined, winner.cookies)).status, 401);
  } finally {
    await service.close();
    await cleanup(state);
  }
});
test("login and refresh have independent rate limits", async () => {
  const state = await workspace();
  const service = await boot(state);
  try {
    for (let i = 0; i < 10; i++)
      assert.equal(
        (
          await service.request("/auth/login", "POST", {
            username: "unknown",
            password: samplePhrase,
          })
        ).status,
        401
      );
    assert.equal(
      (
        await service.request("/auth/login", "POST", {
          username: "unknown",
          password: samplePhrase,
        })
      ).status,
      429
    );
    for (let i = 0; i < 30; i++)
      assert.equal((await service.request("/auth/refresh", "POST", {})).status, 401);
    assert.equal((await service.request("/auth/refresh", "POST", {})).status, 429);
  } finally {
    await service.close();
    await cleanup(state);
  }
});
test("expired confirmation and production-local token exposure are rejected", async () => {
  const state = await workspace();
  let service = await boot(state);
  try {
    const response = await service.request("/auth/register", "POST", {
      username: "sample_writer",
      email: "sample@example.com",
      password: samplePhrase,
    });
    const db = new DatabaseSync(state.file);
    db.prepare("UPDATE users SET confirmationExpiresAt=?").run(Date.now() - 1000);
    db.close();
    assert.equal(
      (
        await service.request("/auth/confirm-email", "POST", {
          token: response.data.developmentConfirmation.token,
        })
      ).status,
      400
    );
    await service.close();
    service = await boot(state, { NODE_ENV: "production" });
    const blocked = await service.request("/auth/register", "POST", {
      username: "other_sample",
      email: "other@example.com",
      password: samplePhrase,
    });
    assert.equal(blocked.status, 503);
    assert.equal(blocked.data.developmentConfirmation, undefined);
  } finally {
    await service.close();
    await cleanup(state);
  }
});
