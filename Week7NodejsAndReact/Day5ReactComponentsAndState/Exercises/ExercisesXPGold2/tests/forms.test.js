import test from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_PRACTICE,
  EMPTY_PROFILE,
  practicePreview,
  profilePreview,
  validatePractice,
  validateProfile,
} from "../src/formState.js";

test("empty profile identifies both required fields in focus order", () => {
  assert.deepEqual(Object.keys(validateProfile(EMPTY_PROFILE)), ["fullName", "email"]);
});
test("international names and a trimmed email produce a safe text snapshot", () => {
  const value = { fullName: "  נועה García  ", email: " learner@example.test " };
  assert.deepEqual(validateProfile(value), {});
  assert.deepEqual(profilePreview(value), {
    fullName: "נועה García",
    email: "learner@example.test",
  });
  assert.equal(value.fullName, "  נועה García  ");
});
test("name limits count Unicode code points and reject control characters", () => {
  const valid = { fullName: "🌍".repeat(80), email: "a@example.test" };
  assert.deepEqual(validateProfile(valid), {});
  assert.ok(validateProfile({ ...valid, fullName: "🌍".repeat(81) }).fullName);
  assert.ok(validateProfile({ ...valid, fullName: "A\u0000B" }).fullName);
});
test("malformed, whitespace-only and overlong emails are rejected", () => {
  for (const email of [
    " ",
    "learner",
    "a@@example.test",
    "a@.test",
    "a@b.",
    "a b@c.test",
    `${"a".repeat(250)}@b.test`,
  ]) {
    assert.ok(validateProfile({ fullName: "Learner", email }).email, email);
  }
});
test("practice topic and pace use a fixed set of choices", () => {
  assert.deepEqual(Object.keys(validatePractice(EMPTY_PRACTICE)), ["topic"]);
  assert.ok(validatePractice({ ...EMPTY_PRACTICE, topic: "Not an option" }).topic);
  assert.ok(validatePractice({ ...EMPTY_PRACTICE, topic: "React state", pace: "unknown" }).pace);
  assert.deepEqual(validatePractice({ ...EMPTY_PRACTICE, topic: "React state" }), {});
});
test("optional notes count Unicode consistently at the exact boundary", () => {
  const valid = { ...EMPTY_PRACTICE, topic: "Accessible forms", notes: " 🌱".trim().repeat(300) };
  assert.deepEqual(validatePractice(valid), {});
  assert.ok(validatePractice({ ...valid, notes: valid.notes + "🌱" }).notes);
});
test("practice snapshots preserve controlled boolean and trim notes without mutation", () => {
  const values = {
    ...EMPTY_PRACTICE,
    topic: "React state",
    reminders: true,
    notes: "  Keyboard first  ",
  };
  assert.deepEqual(practicePreview(values), { ...values, notes: "Keyboard first" });
  assert.equal(values.notes, "  Keyboard first  ");
  assert.equal(EMPTY_PRACTICE.reminders, false);
});
