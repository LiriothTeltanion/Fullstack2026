import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { greeting } from "./greet.js";
import { fetchPost } from "./fetch-post.js";
import { readText } from "./read-text.js";
import { cityWeather } from "./weather.js";
import { askCity, formatWeather } from "./weather-dashboard.js";

test("greet trims a display name and file reading keeps UTF-8 content intact", async () => {
  assert.equal(greeting("  María  "), "Welcome to soundcheck, María!");
  assert.throws(() => greeting("  "), /Enter a name/);
  assert.match(await readText(new URL("./sample.txt", import.meta.url)), /\S/);
  await assert.rejects(readText(new URL("./absent-test-file", import.meta.url)), {
    code: "ENOENT",
  });
});

test("fetch validates the post number and verifies the response shape", async () => {
  let calls = 0;
  const client = {
    get: async url => {
      calls++;
      assert.ok(url.endsWith("/2"));
      return { data: { title: "Soundcheck", body: "Test the monitors" } };
    },
  };
  assert.equal((await fetchPost("2", client)).title, "Soundcheck");
  await assert.rejects(fetchPost("-1", client), /positive post/);
  assert.equal(calls, 1);
  await assert.rejects(fetchPost(1, { get: async () => ({ data: {} }) }), /unreadable post/);
});

const city = {
  name: "Be’er Sheva",
  admin1: "Southern District",
  country: "Israel",
  latitude: 31.25,
  longitude: 34.79,
};
const current = { time: "2026-01-01T12:00", temperature_2m: 0, wind_speed_10m: 0 };

test("the dashboard uses the selected city's coordinates and local observation time", async () => {
  const calls = [];
  const client = {
    get: async (url, options) => {
      calls.push({ url, ...options });
      return url.includes("geocoding")
        ? { data: { results: [city] } }
        : { data: { current, timezone: "Asia/Jerusalem" } };
    },
  };
  const result = await cityWeather("  Beer Sheva ", client);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].params.name, "Beer Sheva");
  assert.equal(calls[1].params.latitude, city.latitude);
  assert.equal(calls[1].params.longitude, city.longitude);
  assert.equal(calls[1].params.timezone, "auto");
  assert.match(formatWeather(result), /Be’er Sheva, Southern District, Israel/);
  assert.match(formatWeather(result), /Temperature: 0 °C/);
  assert.match(formatWeather(result), /Wind: 0 km\/h/);
  assert.match(formatWeather(result), /Asia\/Jerusalem/);
});

test("no match skips forecasting and incomplete or unavailable data is reported", async () => {
  let requests = 0;
  await assert.rejects(cityWeather(" "), /Enter a city/);
  await assert.rejects(
    cityWeather("Atlantis", {
      get: async () => {
        requests++;
        return { data: {} };
      },
    }),
    /No city found/
  );
  assert.equal(requests, 1);
  await assert.rejects(
    cityWeather("York", { get: async () => ({ data: { results: [{ name: "York" }] } }) }),
    /incomplete location/
  );
  await assert.rejects(
    cityWeather("York", {
      get: async url =>
        url.includes("geocoding")
          ? { data: { results: [city] } }
          : { data: { current: { ...current, temperature_2m: null } } },
    }),
    /no complete current reading/
  );
  await assert.rejects(
    cityWeather("York", {
      get: async () => {
        throw new Error("offline");
      },
    }),
    /offline/
  );
});

test("interactive input reprompts on blanks and handles closed input", async () => {
  const prompts = [];
  const output = { write: message => prompts.push(message) };
  assert.equal(await askCity(Readable.from(["\nLondon\n"]), output), "London");
  assert.equal(prompts.length, 2);
  await assert.rejects(askCity(Readable.from([]), output), /No city supplied/);
});

test("the actual Commander entry dispatches greet/read and sets a failure exit code", () => {
  const entry = fileURLToPath(new URL("./commands.js", import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [entry, ...args], { encoding: "utf8" });
  assert.equal(run("greet", "Sam", "Reed").stdout.trim(), "Welcome to soundcheck, Sam Reed!");
  assert.equal(run("read", fileURLToPath(new URL("./sample.txt", import.meta.url))).status, 0);
  const invalid = run("fetch", "no");
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /positive post/);
});
