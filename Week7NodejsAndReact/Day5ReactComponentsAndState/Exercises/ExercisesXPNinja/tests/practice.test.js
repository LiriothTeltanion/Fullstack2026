import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { validateProfile } from "../src/formValidation.js";
import { startClock } from "../src/clockTicker.js";
import { randomOtherIndex } from "../src/randomPick.js";

const practiceValue = `A${randomBytes(12).toString("hex")}7`;
const valid = () => ({
  fullName: "José Rivera",
  email: "learner@example.test",
  password: practiceValue,
  confirmPassword: practiceValue,
});

test("validates the local profile and returns only normalized public preview fields", () => {
  const result = validateProfile({
    ...valid(),
    fullName: "  Jose\u0301   Rivera  ",
    email: " learner@example.test ",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.preview, { fullName: "José Rivera", email: "learner@example.test" });
  assert.equal(JSON.stringify(result).includes(practiceValue), false);
});

test("accepts Hebrew, apostrophes and documented name boundaries", () => {
  for (const fullName of ["מיה", "O’Neil", "Anne-Marie", "A", "A".repeat(80)]) {
    assert.equal(validateProfile({ ...valid(), fullName }).valid, true, fullName);
  }
});

test("rejects empty, malformed, oversized and invisible names", () => {
  for (const fullName of [
    "",
    "  ",
    "A".repeat(81),
    "Noa\nMaya",
    "Noa\u202e",
    "\u0301",
    "<img src=x>",
    null,
    42,
  ]) {
    assert.ok(validateProfile({ ...valid(), fullName }).errors.fullName, String(fullName));
  }
});

test("rejects malformed email examples and non-string values", () => {
  for (const email of [
    "",
    "no-at-sign",
    "two@@example.test",
    "name@example",
    "a b@example.test",
    "<b>@example.test",
    "name@example..test",
    ".name@example.test",
    "a..b@example.test",
    "a".repeat(250) + "@example.test",
    null,
    [],
  ]) {
    assert.ok(validateProfile({ ...valid(), email }).errors.email, String(email));
  }
});

test("enforces custom password length, letter and number rules", () => {
  for (const password of ["", "A1", "lettersOnly", "1234567890", "A1".repeat(65), null, {}]) {
    assert.ok(validateProfile({ ...valid(), password, confirmPassword: password }).errors.password);
  }
  for (const password of ["Abcdef12", "A1".repeat(64), "אבגדהו12"]) {
    assert.equal(validateProfile({ ...valid(), password, confirmPassword: password }).valid, true);
  }
});

test("requires an exact confirmation and validates every missing field", () => {
  assert.ok(validateProfile({ ...valid(), confirmPassword: "" }).errors.confirmPassword);
  assert.ok(
    validateProfile({ ...valid(), confirmPassword: practiceValue + "x" }).errors.confirmPassword
  );
  assert.deepEqual(Object.keys(validateProfile({}).errors), [
    "fullName",
    "email",
    "password",
    "confirmPassword",
  ]);
  assert.equal(validateProfile(null).valid, false);
});

test("password length counts Unicode code points, including astral emoji at both boundaries", () => {
  for (const password of ["A1" + "🚀".repeat(6), "A1" + "🚀".repeat(126), "𐐀1" + "🚀".repeat(6)]) {
    assert.equal(validateProfile({ ...valid(), password, confirmPassword: password }).valid, true);
  }
  for (const password of ["A1" + "🚀".repeat(5), "A1" + "🚀".repeat(127)]) {
    assert.ok(validateProfile({ ...valid(), password, confirmPassword: password }).errors.password);
  }
});

test("validation does not mutate the input values", () => {
  const input = Object.freeze(valid());
  validateProfile(input);
  assert.deepEqual(input, valid());
});

test("clock schedules seconds and reads actual time when a delayed tick runs", () => {
  let callback;
  let delay;
  let now = 1000;
  const updates = [];
  const stop = startClock(value => updates.push(value), {
    now: () => now,
    schedule: (fn, ms) => {
      callback = fn;
      delay = ms;
      return 17;
    },
    cancel: () => {},
  });
  assert.equal(delay, 1000);
  callback();
  assert.equal(updates[0].getTime(), 1000);
  now = 9400;
  callback();
  assert.equal(updates[1].getTime(), 9400);
  stop();
});

test("clock cleanup is idempotent and blocks an already queued callback", () => {
  let callback;
  const canceled = [];
  let ticks = 0;
  const stop = startClock(() => ticks++, {
    schedule: fn => {
      callback = fn;
      return 23;
    },
    cancel: timer => canceled.push(timer),
  });
  callback();
  stop();
  stop();
  callback();
  assert.equal(ticks, 1);
  assert.deepEqual(canceled, [23]);
});

test("the preserved quote picker stays in range without consecutive repeats", () => {
  let current = 0;
  for (let i = 0; i < 1000; i++) {
    const next = randomOtherIndex(6, current);
    assert.ok(Number.isInteger(next) && next >= 0 && next < 6);
    assert.notEqual(next, current);
    current = next;
  }
  assert.equal(randomOtherIndex(1, 0), 0);
  assert.equal(randomOtherIndex(0, 0), 0);
});
