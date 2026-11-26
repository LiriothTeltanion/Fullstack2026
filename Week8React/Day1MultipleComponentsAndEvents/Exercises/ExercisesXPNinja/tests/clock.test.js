import assert from "node:assert/strict";
import { test } from "node:test";
import { getClockFields } from "../src/clock.js";

test("local fields use a human month and a zero-padded 24-hour display", () => {
  const fields = getClockFields(new Date(2026, 0, 15, 3, 4, 5));
  assert.equal(fields.weekday, "Thursday");
  assert.equal(fields.year, 2026);
  assert.equal(fields.month, 1);
  assert.equal(fields.day, 15);
  assert.equal(fields.time, "03:04:05");
});

test("midnight wraps every date field together at the year boundary", () => {
  const end = new Date(2025, 11, 31, 23, 59, 59);
  const fields = getClockFields(new Date(end.getTime() + 1000));
  assert.deepEqual(
    [fields.year, fields.month, fields.day, fields.weekday, fields.time],
    [2026, 1, 1, "Thursday", "00:00:00"]
  );
});

test("leap-day transition follows the calendar", () => {
  const date = new Date(2028, 1, 28, 23, 59, 59);
  const fields = getClockFields(new Date(date.getTime() + 1000));
  assert.deepEqual([fields.month, fields.day, fields.weekday], [2, 29, "Tuesday"]);
});

test("dial hands include fractional minutes and hours", () => {
  const fields = getClockFields(new Date(2026, 0, 15, 15, 30, 30));
  assert.equal(fields.time, "15:30:30");
  assert.equal(fields.hourAngle, 105.25);
  assert.equal(fields.minuteAngle, 183);
  assert.equal(fields.secondAngle, 180);
});

test("noon and midnight share the analog origin, with distinct digital time", () => {
  const midnight = getClockFields(new Date(2026, 0, 15, 0));
  const noon = getClockFields(new Date(2026, 0, 15, 12));
  assert.equal(midnight.hourAngle, 0);
  assert.equal(noon.hourAngle, 0);
  assert.equal(midnight.time, "00:00:00");
  assert.equal(noon.time, "12:00:00");
});

test("invalid dates are rejected instead of rendering NaN", () => {
  for (const value of [new Date(NaN), undefined, "2026-01-01"]) {
    assert.throws(() => getClockFields(value), /valid Date/);
  }
});
