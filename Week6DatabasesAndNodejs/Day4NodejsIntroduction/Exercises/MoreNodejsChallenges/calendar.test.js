import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { minutesLived, nextHoliday, timeUntilNewYear } from "./calendar.js";

const date = value => new Date(value);
const day = 86_400_000;
const cli = fileURLToPath(new URL("./calendar-cli.js", import.meta.url));

test("the Gregorian New Year countdown rolls over at UTC midnight", () => {
  assert.equal(timeUntilNewYear(date("2024-12-31T23:59:59.750Z")), 250);
  assert.equal(timeUntilNewYear(date("2024-01-01T00:00:00Z")), 366 * day);
  assert.equal(timeUntilNewYear(date("2025-01-01T00:00:00Z")), 365 * day);
  assert.throws(() => timeUntilNewYear(new Date(8_640_000_000_000_000)), /outside/);
});

test("the birth date starts at midnight UTC and only whole minutes count", () => {
  const now = date("2024-03-01T00:01:59Z");
  assert.equal(minutesLived("2024-02-29", now), 1441);
  assert.equal(minutesLived("2024-03-01", now), 1);
});

test("invalid, impossible, and future dates fail with a specific message", () => {
  const now = date("2024-01-01T00:00:00Z");
  assert.throws(() => minutesLived("01/01/2000", now), /YYYY-MM-DD/);
  assert.throws(() => minutesLived("2023-02-29", now), /does not exist/);
  assert.throws(() => minutesLived("2024-01-02", now), /future/);
  assert.throws(() => nextHoliday(date("1969-06-01T00:00:00Z")), /1970 through 2100/);
  assert.throws(() => nextHoliday(date("2101-01-01T00:00:00Z")), /1970 through 2100/);
  for (const fn of [nextHoliday, timeUntilNewYear]) {
    assert.throws(() => fn(date("invalid")), /valid reference date/);
  }
});

test("the Israeli holiday countdown honours the start instant and the end boundary", () => {
  const before = nextHoliday(date("2026-04-01T14:59:59Z"));
  assert.match(before.name, /Passover/);
  assert.equal(before.start.toISOString(), "2026-04-01T15:00:00.000Z");
  assert.equal(before.remainingMs, 1000);
  assert.equal(before.underway, false);
  const during = nextHoliday(before.start);
  assert.equal(during.name, before.name);
  assert.equal(during.remainingMs, 0);
  assert.equal(during.underway, true);
  const after = nextHoliday(date("2026-04-02T15:00:00Z"));
  assert.notEqual(after.name, before.name);
  assert.ok(after.remainingMs > 0);
});

test("the holiday search crosses December into the next calendar year", () => {
  const holiday = nextHoliday(date("2026-12-31T23:59:00Z"));
  assert.equal(holiday.start.getUTCFullYear(), 2027);
  assert.ok(holiday.remainingMs > 0);
});

test("the terminal and interactive forms run the sample without saving a birth date", () => {
  for (const args of [["2000-01-01"], ["--ask"]]) {
    const result = spawnSync(process.execPath, [cli, ...args], {
      input: "2000-01-01\n",
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Minutes lived since midnight UTC: \d+/);
    assert.match(result.stdout, /Public holiday: \S/);
  }
});

test("the CLI handles help, extra arguments, and empty interactive input", () => {
  const run = (...args) =>
    spawnSync(process.execPath, [cli, ...args], { input: "", encoding: "utf8" });
  assert.match(run("--help").stdout, /Usage:/);
  assert.match(run("2000-01-01", "extra").stderr, /Usage:/);
  const invalid = run("2001-02-29");
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /does not exist/);
  const empty = run("--ask");
  assert.equal(empty.status, 1);
  assert.match(empty.stderr, /No birth date/);
});
