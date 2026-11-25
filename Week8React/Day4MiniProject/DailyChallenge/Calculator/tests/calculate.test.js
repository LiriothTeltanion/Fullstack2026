import test from "node:test";
import assert from "node:assert/strict";
import { calculate } from "../src/utils/calculate.js";

test("performs each supported operation", () => {
  assert.equal(calculate("2", "3", "add").result, 5);
  assert.equal(calculate("2", "3", "subtract").result, -1);
  assert.equal(calculate("-2", "3", "multiply").result, -6);
  assert.equal(calculate("9", "4", "divide").result, 2.25);
});

test("removes decimal noise without erasing small or overflowing large values", () => {
  assert.equal(calculate("0.1", "0.2", "add").result, 0.3);
  assert.equal(calculate("1e-12", "1e-12", "add").result, 2e-12);
  assert.equal(calculate("1e300", "1e300", "add").result, 2e300);
  assert.equal(calculate(String(Number.MIN_VALUE), "1", "multiply").result, Number.MIN_VALUE);
});

test("preserves safe integers and meaningful floating-point precision", () => {
  assert.equal(calculate("9007199254740990", "1", "add").result, Number.MAX_SAFE_INTEGER);
  assert.equal(calculate("1.2345678901234567", "0", "add").result, 1.2345678901234567);
  assert.equal(calculate("1", "3", "divide").result, 1 / 3);
});

test("returns errors for blank, non-finite and invalid values", () => {
  for (const input of ["", "  ", "abc", "Infinity", "-Infinity", "1e309"]) {
    assert.ok(calculate(input, "2", "add").error, input);
    assert.ok(calculate("2", input, "add").error, input);
  }
  assert.ok(calculate("1", "0", "divide").error);
  assert.ok(calculate("1", "-0", "divide").error);
  assert.ok(calculate("1e308", "1e308", "add").error);
  assert.ok(calculate("1e308", "2", "multiply").error);
  assert.ok(calculate("1", "2", "unknown").error);
  assert.ok(calculate("1", "2", "__proto__").error);
});
