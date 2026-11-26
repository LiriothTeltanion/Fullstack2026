import assert from "node:assert/strict";
import test from "node:test";
import { formatMessage, validateDraft } from "./contact.js";

test("normalizes a valid name and preserves message paragraphs", () => {
  assert.deepEqual(validateDraft("  Alex   Example ", " Hello\r\n\r\nQuestion. "), {
    name: "Alex Example",
    body: "Hello\n\nQuestion.",
    errors: {},
  });
});
test("empty, missing and whitespace fields report both errors", () => {
  for (const values of [
    [undefined, undefined],
    ["", ""],
    ["  ", "\n  "],
  ]) {
    assert.deepEqual(Object.keys(validateDraft(...values).errors), ["name", "body"]);
  }
});
test("each limit accepts its boundary and rejects one more Unicode character", () => {
  assert.deepEqual(validateDraft("A".repeat(80), "🙂".repeat(2000)).errors, {});
  assert.ok(validateDraft("A".repeat(81), "hello").errors.name);
  assert.ok(validateDraft("Alex", "🙂".repeat(2001)).errors.body);
});
test("handoff text includes the sender and body without claiming delivery", () => {
  const message = formatMessage("Alex Example", "I would like to discuss a project.");
  assert.match(message, /Hello Kevin,/);
  assert.match(message, /discuss a project/);
  assert.match(message, /Best regards,\nAlex Example/);
  assert.doesNotMatch(message, /successfully sent|delivered/iu);
});
