import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { createDashboard } from "../app.js";

const samplePhrase = "Demo-Garden-Cloud-73";

async function running(database = ":memory:") {
  const { app, db } = createDashboard(database);
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  async function request(path, method = "GET", data, cookie = "", extra = {}) {
    const response = await fetch(base + "/api" + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
        ...extra,
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    return {
      status: response.status,
      cookie: response.headers.get("set-cookie"),
      data: response.status === 204 ? null : await response.json(),
    };
  }
  async function register(username = "sample_sales") {
    const response = await request("/auth/register", "POST", {
      username,
      password: samplePhrase,
    });
    assert.equal(response.status, 201);
    return response.cookie.split(";")[0];
  }
  return {
    request,
    register,
    db,
    close: () =>
      new Promise(resolve =>
        server.close(() => {
          db.close();
          resolve();
        })
      ),
  };
}
const company = {
  name: "Sample Orchard",
  email: "team@example.com",
  phone: "000-000",
  address: "Practice Street",
};
const meeting = (companyId, date = "2026-11-25") => ({
  company_id: companyId,
  date,
  location: "Practice room",
  summary: "Discussed an original sample project.",
});

test("registration, duplicate rejection, cookie flags, login and logout", async () => {
  const service = await running();
  try {
    assert.equal((await service.request("/companies")).status, 401);
    assert.equal(
      (await service.request("/auth/register", "POST", { username: "a", password: "short" }))
        .status,
      400
    );
    const cookie = await service.register();
    assert.equal(
      (
        await service.request("/auth/register", "POST", {
          username: "sample_sales",
          password: samplePhrase,
        })
      ).status,
      409
    );
    assert.equal(
      (
        await service.request("/auth/login", "POST", {
          username: "sample_sales",
          password: "wrong",
        })
      ).status,
      401
    );
    const login = await service.request("/auth/login", "POST", {
      username: "sample_sales",
      password: samplePhrase,
    });
    assert.equal(login.status, 200);
    assert.match(login.cookie, /HttpOnly/);
    assert.match(login.cookie, /SameSite=Strict/);
    const persisted = service.db.prepare("SELECT digest FROM users").get();
    assert.notEqual(persisted.digest, samplePhrase);
    assert.equal(
      (await service.request("/auth/me", "GET", undefined, cookie)).data.username,
      "sample_sales"
    );
    assert.equal((await service.request("/auth/logout", "POST", {}, cookie)).status, 204);
    assert.equal((await service.request("/auth/me", "GET", undefined, cookie)).status, 401);
  } finally {
    await service.close();
  }
});
test("companies and meetings support CRUD and calendar validation", async () => {
  const service = await running();
  try {
    const cookie = await service.register();
    assert.equal((await service.request("/companies", "POST", { name: " " }, cookie)).status, 400);
    const added = await service.request("/companies", "POST", company, cookie);
    assert.equal(added.status, 201);
    const id = added.data.id;
    assert.equal(
      (
        await service.request(
          "/companies/" + id,
          "PUT",
          { ...company, name: "Updated orchard" },
          cookie
        )
      ).status,
      204
    );
    assert.equal(
      (await service.request("/companies", "GET", undefined, cookie)).data[0].name,
      "Updated orchard"
    );
    assert.equal(
      (await service.request("/meetings", "POST", meeting(id, "2026-02-30"), cookie)).status,
      400
    );
    const recorded = await service.request("/meetings", "POST", meeting(id), cookie);
    assert.equal(recorded.status, 201);
    assert.equal(
      (
        await service.request(
          "/meetings/" + recorded.data.id,
          "PUT",
          { ...meeting(id), summary: "Updated summary" },
          cookie
        )
      ).status,
      204
    );
    assert.equal(
      (await service.request("/meetings", "GET", undefined, cookie)).data[0].summary,
      "Updated summary"
    );
    assert.equal(
      (await service.request("/companies/" + id, "DELETE", undefined, cookie)).status,
      409
    );
    assert.equal(
      (await service.request("/meetings/" + recorded.data.id, "DELETE", undefined, cookie)).status,
      204
    );
    assert.equal(
      (await service.request("/companies/" + id, "DELETE", undefined, cookie)).status,
      204
    );
    assert.deepEqual((await service.request("/companies", "GET", undefined, cookie)).data, []);
  } finally {
    await service.close();
  }
});
test("owner isolation blocks cross-account companies, meetings and statistics", async () => {
  const service = await running();
  try {
    const first = await service.register("first_sample");
    const second = await service.register("second_sample");
    const companyId = (await service.request("/companies", "POST", company, first)).data.id;
    const meetingId = (await service.request("/meetings", "POST", meeting(companyId), first)).data
      .id;
    assert.deepEqual((await service.request("/companies", "GET", undefined, second)).data, []);
    assert.equal(
      (await service.request("/companies/" + companyId, "PUT", company, second)).status,
      404
    );
    assert.equal(
      (await service.request("/companies/" + companyId, "DELETE", undefined, second)).status,
      404
    );
    assert.equal(
      (await service.request("/meetings", "POST", meeting(companyId), second)).status,
      400
    );
    assert.equal(
      (await service.request("/meetings/" + meetingId, "DELETE", undefined, second)).status,
      404
    );
    assert.equal(
      (await service.request("/statistics?month=2026-11", "GET", undefined, second)).data.total,
      0
    );
  } finally {
    await service.close();
  }
});
test("monthly counts, percentages, empty months and confirmed cascades", async () => {
  const service = await running();
  try {
    const cookie = await service.register();
    const id = (await service.request("/companies", "POST", company, cookie)).data.id;
    for (const date of ["2026-11-20", "2026-11-20", "2026-11-21", "2026-12-01"])
      await service.request("/meetings", "POST", meeting(id, date), cookie);
    const stats = (await service.request("/statistics?month=2026-11", "GET", undefined, cookie))
      .data;
    assert.equal(stats.total, 3);
    assert.deepEqual(
      stats.days.map(day => day.count),
      [2, 1]
    );
    assert.ok(Math.abs(stats.days.reduce((sum, day) => sum + day.percentage, 0) - 100) < 0.00001);
    assert.equal(
      (await service.request("/statistics?month=2026-10", "GET", undefined, cookie)).data.total,
      0
    );
    assert.equal(
      (await service.request("/statistics?month=2026-99", "GET", undefined, cookie)).status,
      400
    );
    assert.equal(
      (await service.request("/companies/" + id + "?confirm=yes", "DELETE", undefined, cookie))
        .status,
      204
    );
    assert.deepEqual((await service.request("/meetings", "GET", undefined, cookie)).data, []);
  } finally {
    await service.close();
  }
});
test("SQLite records survive app restart while sessions require login again", async () => {
  const directory = await mkdtemp(join(tmpdir(), "sales-practice-"));
  assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + sep));
  const database = join(directory, "sales.sqlite");
  const first = await running(database);
  let cookie;
  try {
    cookie = await first.register();
    const id = (await first.request("/companies", "POST", company, cookie)).data.id;
    await first.request("/meetings", "POST", meeting(id), cookie);
  } finally {
    await first.close();
  }
  const second = await running(database);
  try {
    assert.equal((await second.request("/companies", "GET", undefined, cookie)).status, 401);
    const login = await second.request("/auth/login", "POST", {
      username: "sample_sales",
      password: samplePhrase,
    });
    const nextCookie = login.cookie.split(";")[0];
    assert.equal((await second.request("/companies", "GET", undefined, nextCookie)).data.length, 1);
    assert.equal((await second.request("/meetings", "GET", undefined, nextCookie)).data.length, 1);
  } finally {
    await second.close();
    await rm(directory, { recursive: true, force: true });
  }
});
test("foreign origins cannot mutate dashboard data", async () => {
  const service = await running();
  try {
    const cookie = await service.register();
    assert.equal(
      (
        await service.request("/companies", "POST", company, cookie, {
          Origin: "https://example.com",
        })
      ).status,
      403
    );
    assert.deepEqual((await service.request("/companies", "GET", undefined, cookie)).data, []);
  } finally {
    await service.close();
  }
});
