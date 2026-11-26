import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import http from "node:http";
import test from "node:test";
import { createAccuWeather } from "./accuweather.server.js";
import { createWeatherProxy } from "./weather-proxy.server.js";
import { createAppServer } from "./server.js";

// Original synthetic data, not a captured account response or a shared key.
const accountKey = randomBytes(24).toString("hex");
const city = {
  Key: "215854",
  Type: "City",
  LocalizedName: "Tel Aviv",
  Country: { LocalizedName: "Israel" },
};
function fixture(path, params) {
  if (path.includes("autocomplete")) return [city, { ...city, Key: "poi", Type: "POI" }];
  if (path.includes("geoposition")) return city;
  if (path.includes("currentconditions"))
    return [
      {
        WeatherText: "Clear fixture",
        WeatherIcon: 33,
        Temperature: { Metric: { Value: 20.2 }, Imperial: { Value: 68.4 } },
      },
    ];
  const metric = params.get("metric") === "true";
  return {
    DailyForecasts: Array.from({ length: 5 }, (_, i) => ({
      Date: `2026-11-${26 + i}T07:00:00+02:00`,
      Temperature: {
        Minimum: { Value: metric ? 14 : 57, Unit: metric ? "C" : "F" },
        Maximum: { Value: metric ? 24 : 75, Unit: metric ? "C" : "F" },
      },
      Day: { Icon: 12, IconPhrase: "Rain fixture" },
    })),
  };
}

function setup(options = {}) {
  const calls = [];
  const fetchImpl = async (value, init) => {
    const url = new URL(value);
    assert.equal(url.origin, "https://dataservice.accuweather.com");
    assert.equal(init.headers.Authorization, `Bearer ${accountKey}`);
    assert.equal(init.headers["Accept-Encoding"], "gzip,deflate");
    assert.equal(url.searchParams.has("apikey"), false);
    assert.ok(init.signal instanceof AbortSignal);
    calls.push(url);
    return Response.json(fixture(url.pathname, url.searchParams));
  };
  return {
    calls,
    provider: createAccuWeather({ apiKey: accountKey, fetchImpl, ...options }),
    fetchImpl,
  };
}

test("autocomplete uses the documented fixed endpoint, normalizes cities and caches repeats", async () => {
  const { provider, calls } = setup();
  const result = await provider.search("Tel Aviv");
  assert.deepEqual(result, [
    {
      id: "accuweather:215854",
      provider: "accuweather",
      locationKey: "215854",
      name: "Tel Aviv",
      country: "Israel",
    },
  ]);
  assert.equal(calls[0].pathname, "/locations/v1/cities/autocomplete");
  assert.equal(calls[0].searchParams.get("q"), "Tel Aviv");
  await provider.search("Tel Aviv");
  assert.equal(calls.length, 1);
});

test("current conditions and five daily forecasts use correct units and separate icon semantics", async () => {
  const { provider, calls } = setup();
  const c = await provider.forecast({ key: city.Key, unit: "C" });
  const f = await provider.forecast({ key: city.Key, unit: "F" });
  assert.equal(c.current.temperature, 20);
  assert.equal(f.current.temperature, 68);
  assert.equal(c.current.icon, "🌙");
  assert.equal(c.days[0].icon, "🌧️");
  assert.equal(c.days[0].description, "Rain fixture");
  assert.equal(c.days.length, 5);
  assert.equal(c.days[0].max, 24);
  assert.equal(f.days[0].max, 75);
  assert.equal(calls.length, 3); // Current conditions contain both unit systems.
  assert.ok(
    calls.some(
      url =>
        url.pathname === "/forecasts/v1/daily/5day/215854" &&
        url.searchParams.get("metric") === "true"
    )
  );
  assert.ok(calls.some(url => url.searchParams.get("metric") === "false"));
});

test("the initial coordinates resolve to the same canonical favorite identity as search", async () => {
  const { provider, calls } = setup();
  const result = await provider.forecast({
    latitude: "32.08088",
    longitude: "34.78057",
    unit: "C",
  });
  assert.equal(calls[0].pathname, "/locations/v1/cities/geoposition/search");
  assert.equal(calls[0].searchParams.get("q"), "32.08088,34.78057");
  assert.equal(result.location.id, (await provider.search("Tel Aviv"))[0].id);
});

test("cache respects no-store, max-age, Age and an earlier Expires", async () => {
  for (const headers of [
    { "Cache-Control": "no-store" },
    { "Cache-Control": "no-cache" },
    { "Cache-Control": "max-age=5", Age: "3" },
    { Expires: new Date(3000).toUTCString() },
  ]) {
    let calls = 0,
      clock = 1000;
    const provider = createAccuWeather({
      apiKey: accountKey,
      now: () => clock,
      fetchImpl: async () => {
        calls++;
        return Response.json([city], { headers });
      },
    });
    await provider.search("Tel Aviv");
    await provider.search("Tel Aviv");
    assert.equal(calls, headers["Cache-Control"]?.includes("no-") ? 2 : 1);
    clock = 4000;
    await provider.search("Tel Aviv");
    assert.equal(calls, headers["Cache-Control"]?.includes("no-") ? 3 : 2);
  }
});

test("the per-process upstream budget caps calls, counts failures and resets after24h", async () => {
  let clock = 1000,
    calls = 0;
  const provider = createAccuWeather({
    apiKey: accountKey,
    maxRequests: 2,
    now: () => clock,
    fetchImpl: async () => {
      calls++;
      return Response.json({}, { status: 503 });
    },
  });
  await assert.rejects(() => provider.search("Tel Aviv"));
  await assert.rejects(() => provider.search("Paris"));
  await assert.rejects(
    () => provider.search("London"),
    error => error.code === "LOCAL_LIMIT"
  );
  assert.equal(calls, 2);
  clock += 24 * 60 * 60 * 1000;
  await assert.rejects(
    () => provider.search("London"),
    error => error.code === "UNAVAILABLE"
  );
  assert.equal(calls, 3);
});

test("invalid inputs fail before any provider request", async () => {
  const { provider, calls } = setup();
  for (const q of [null, "", "x", "123", "a".repeat(81)])
    await assert.rejects(
      () => provider.search(q),
      error => error.status === 400
    );
  for (const input of [
    { key: "" },
    { key: "bad/key" },
    { key: city.Key, unit: "K" },
    { latitude: "", longitude: "0" },
    { latitude: "91", longitude: "0" },
  ]) {
    await assert.rejects(
      () => provider.forecast(input),
      error => error.status === 400
    );
  }
  assert.equal(calls.length, 0);
});

test("missing server key is explicit and performs no provider request", async () => {
  const { provider, calls } = setup({ apiKey: "" });
  await assert.rejects(
    () => provider.search("Tel Aviv"),
    error => error.status === 503 && error.code === "NOT_CONFIGURED"
  );
  assert.equal(calls.length, 0);
});

for (const [upstream, expected, code] of [
  [401, 502, "ACCESS_DENIED"],
  [403, 502, "ACCESS_DENIED"],
  [429, 429, "QUOTA"],
  [500, 502, "UNAVAILABLE"],
]) {
  test(`provider ${upstream} produces a sanitized recoverable error`, async () => {
    const provider = createAccuWeather({
      apiKey: accountKey,
      fetchImpl: async () => Response.json({ Message: accountKey }, { status: upstream }),
    });
    await assert.rejects(
      () => provider.search("Tel Aviv"),
      error =>
        error.status === expected && error.code === code && !error.message.includes(accountKey)
    );
  });
}

test("network errors and real abort timeouts cannot reveal upstream details", async () => {
  const network = createAccuWeather({
    apiKey: accountKey,
    fetchImpl: async () => {
      throw new Error(accountKey);
    },
  });
  await assert.rejects(
    () => network.search("Tel Aviv"),
    error => error.status === 502 && !error.message.includes(accountKey)
  );
  const timeout = createAccuWeather({
    apiKey: accountKey,
    timeoutMs: 10,
    fetchImpl: (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
  });
  // Keep this isolated test alive while AbortSignal's unref'ed timer expires.
  const alive = setTimeout(() => {}, 1000);
  try {
    await assert.rejects(
      () => timeout.search("Tel Aviv"),
      error => error.status === 504
    );
  } finally {
    clearTimeout(alive);
  }
});

test("malformed JSON and incomplete data fail safely and do not poison retries", async () => {
  let broken = true;
  const provider = createAccuWeather({
    apiKey: accountKey,
    fetchImpl: async value => {
      const url = new URL(value);
      if (broken) return new Response("not json");
      return Response.json(fixture(url.pathname, url.searchParams));
    },
  });
  await assert.rejects(
    () => provider.search("Tel Aviv"),
    error => error.code === "INVALID_RESPONSE"
  );
  broken = false;
  assert.equal((await provider.search("Tel Aviv")).length, 1);
  let incomplete = true;
  const forecast = createAccuWeather({
    apiKey: accountKey,
    fetchImpl: async value => {
      const url = new URL(value);
      return Response.json(
        incomplete && url.pathname.includes("forecasts")
          ? { DailyForecasts: [] }
          : fixture(url.pathname, url.searchParams)
      );
    },
  });
  await assert.rejects(
    () => forecast.forecast({ key: city.Key }),
    error => error.code === "INVALID_RESPONSE"
  );
  incomplete = false;
  assert.equal((await forecast.forecast({ key: city.Key })).days.length, 5);
});

test("a loopback HTTP proxy exposes only its two GET routes and sanitized JSON", async t => {
  const { fetchImpl } = setup();
  const handler = createWeatherProxy({ apiKey: accountKey, fetchImpl });
  const server = http.createServer((request, response) =>
    handler(request, response, () => response.writeHead(404).end())
  );
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const locations = await fetch(`${origin}/api/weather/accuweather/locations?q=Tel+Aviv`);
  assert.equal(locations.status, 200);
  assert.equal(locations.headers.get("cache-control"), "no-store");
  assert.equal((await locations.json())[0].locationKey, city.Key);
  const forecast = await fetch(`${origin}/api/weather/accuweather/forecast?key=${city.Key}&unit=F`);
  assert.equal((await forecast.json()).days.length, 5);
  assert.equal((await fetch(`${origin}/api/weather/accuweather/forecast?key=`)).status, 400);
  assert.equal(
    (await fetch(`${origin}/api/weather/accuweather/locations`, { method: "POST" })).status,
    405
  );
  assert.equal((await fetch(`${origin}/api/weather/unknown`)).status, 404);
  const responseText = await (
    await fetch(`${origin}/api/weather/accuweather/forecast?key=`)
  ).text();
  assert.equal(responseText.includes(accountKey), false);
});

test("the normal HTTP server returns400 for invalid URLs and catches middleware rejection", async t => {
  const servers = [];
  t.after(async () => {
    for (const server of servers) await new Promise(resolve => server.close(resolve));
  });
  const normal = createAppServer();
  servers.push(normal);
  await new Promise(resolve => normal.listen(0, "127.0.0.1", resolve));
  const malformed = await new Promise((resolve, reject) => {
    const request = http.request(
      { hostname: "127.0.0.1", port: normal.address().port, path: "http://[" },
      response => {
        response.resume();
        response.on("end", () => resolve(response.statusCode));
      }
    );
    request.on("error", reject);
    request.end();
  });
  assert.equal(malformed, 400);
  const failed = createAppServer({
    proxy: async () => {
      throw new Error(accountKey);
    },
  });
  servers.push(failed);
  await new Promise(resolve => failed.listen(0, "127.0.0.1", resolve));
  const response = await fetch(`http://127.0.0.1:${failed.address().port}/`);
  assert.equal(response.status, 500);
  assert.equal((await response.text()).includes(accountKey), false);
});
