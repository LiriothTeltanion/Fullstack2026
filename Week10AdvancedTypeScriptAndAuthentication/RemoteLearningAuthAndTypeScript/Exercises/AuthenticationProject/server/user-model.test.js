import assert from "node:assert/strict";
import test from "node:test";
import { createUser, findByEmail, findById } from "./models/userModel.js";

test("sequential insertion preserves the first normalized email and the next ID", () => {
  const first = createUser({
    name: "Local Reader",
    email: "  Reader@Example.test  ",
    passwordHash: "synthetic-first-hash",
  });
  assert.equal(first.email, "reader@example.test");
  const original = structuredClone(first);

  const duplicate = createUser({
    name: "Other Reader",
    email: "READER@EXAMPLE.TEST",
    passwordHash: "synthetic-second-hash",
  });
  assert.equal(duplicate, undefined);
  assert.strictEqual(findByEmail(" Reader@example.test "), first);
  assert.strictEqual(findById(first.id), first);
  assert.deepEqual(first, original, "duplicate insertion must preserve the existing account");

  const second = createUser({
    name: "Second Reader",
    email: "second@example.test",
    passwordHash: "synthetic-third-hash",
  });
  assert.equal(second.id, first.id + 1, "a rejected duplicate must not consume an ID");
});
