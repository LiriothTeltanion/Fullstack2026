import assert from "node:assert/strict";
import test from "node:test";
import { getForecast } from "./src/api/weather.js";

const city = { latitude: 32.08, longitude: 34.78 };
const current = { temperature_2m: 0, weather_code: 2 };
const daily = {
  time: ["2026-01-01", "2026-01-02"],
  weather_code: [2, 0],
  temperature_2m_max: [1.8, 4.2],
  temperature_2m_min: [-1.6, 0],
};

test("returns actual zero readings and rounds each day's temperatures", async t => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ current, daily }));
  const result = await getForecast(city, "C");
  assert.deepEqual(result.current, { temperature: 0, code: 2 });
  assert.deepEqual(result.days, [
    { date: daily.time[0], code: 2, min: -2, max: 2 },
    { date: daily.time[1], code: 0, min: 0, max: 4 },
  ]);
});

test("rejects missing or misaligned temperatures and accepts a later valid response", async t => {
  const invalid = [
    null,
    { current: { ...current, temperature_2m: null }, daily },
    { current, daily: { ...daily, temperature_2m_max: [2, null] } },
    { current, daily: { ...daily, temperature_2m_min: [-2] } },
    { current, daily: { ...daily, temperature_2m_min: ["0", 1] } },
    { current, daily: { ...daily, time: [] } },
  ];
  let payload;
  t.mock.method(globalThis, "fetch", async () => Response.json(payload));
  for (payload of invalid) {
    await assert.rejects(getForecast(city, "C"), /incomplete temperatures/);
  }
  payload = { current, daily };
  assert.equal((await getForecast(city, "C")).days.length, daily.time.length);
});
