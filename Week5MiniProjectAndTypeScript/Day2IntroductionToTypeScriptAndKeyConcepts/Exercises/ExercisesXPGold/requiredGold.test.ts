import assert from "node:assert/strict";
import test from "node:test";
import {
  processValue,
  sumNumbersInArray,
  introduceAdvancedUser,
  welcomeUser,
  type AdvancedUser,
} from "./requiredGold.ts";

test("processValue formats currency with two decimals and reverses Unicode code points", () => {
  assert.equal(processValue(123.456), "$123.46");
  assert.equal(processValue(0), "$0.00");
  assert.equal(processValue(1e21), "$1000000000000000000000.00");
  assert.equal(processValue(-12.5), "$-12.50");
  assert.equal(processValue("TypeScript"), "tpircSepyT");
  assert.equal(processValue(""), "");
  assert.equal(processValue("A😀B"), "B😀A");
  for (const value of [NaN, Infinity, -Infinity])
    assert.throws(() => processValue(value), RangeError);
  assert.throws(() => processValue(true as never), TypeError);
});
test("sumNumbersInArray sums finite numbers without coercion and preserves the array", () => {
  const values = Object.freeze([1, "2", 3, null, false, NaN, Infinity, undefined, -4, 2.5]);
  assert.equal(sumNumbersInArray(values), 2.5);
  assert.equal(sumNumbersInArray([]), 0);
  assert.equal(sumNumbersInArray(["3", "4"]), 0);
  assert.equal(sumNumbersInArray([-3, 0, 8]), 5);
});
test("AdvancedUser handles absent/present address and welcomeUser defaults its optional greeting", () => {
  const user: AdvancedUser = { name: "Kevin", age: 25 };
  assert.equal(introduceAdvancedUser(user), "Hello, my name is Kevin and I am 25 years old.");
  assert.equal(
    introduceAdvancedUser({ ...user, address: "12 Example Street" }),
    "Hello, my name is Kevin and I am 25 years old. I live at 12 Example Street."
  );
  assert.equal(welcomeUser("Kevin"), "Hello, Kevin!");
  assert.equal(welcomeUser("Dana", "Welcome"), "Welcome, Dana!");
  assert.equal(welcomeUser("Dana", undefined), "Hello, Dana!");
  assert.equal(welcomeUser("Dana", ""), ", Dana!");
});
// These assertions are checked by tsc and are never executed by Node.
function assertCompileTimeConstraints() {
  // @ts-expect-error A boolean is outside the string/number input union.
  processValue(false);
  // @ts-expect-error A user's age is required.
  introduceAdvancedUser({ name: "Kevin" });
  // @ts-expect-error welcomeUser requires a name string, not a user object.
  welcomeUser({ name: "Kevin", age: 25 });
  // @ts-expect-error The required name parameter cannot be omitted.
  welcomeUser();
}

// Retain the compile-time proof without executing invalid calls.
void assertCompileTimeConstraints;
