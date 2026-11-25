import assert from "node:assert/strict";
import test from "node:test";
import {
  arrayFlattened,
  arrayFlattenedOneLine,
} from "../../Week4AdvAsynchronousJavaScript/Day1AdvancedArrayMethods/Exercises/ExercisesXPGold/ArraysDestructuringXPGold.ts";
import { repeat } from "../../Week4AdvAsynchronousJavaScript/Day1AdvancedArrayMethods/Exercises/ExercisesXPGold2/ArraysMethodsXPGold.ts";

test("both flattening exercises preserve exactly the remaining nested layer", () => {
  const expected = [1, 2, 3, [4], [5]];
  assert.deepEqual(arrayFlattened, expected);
  assert.deepEqual(arrayFlattenedOneLine, expected);
});

test("repeat supports integer counts and rejects a positive non-finite or fractional count", () => {
  assert.equal(repeat("ha"), "ha");
  assert.equal(repeat("ha", 3), "hahaha");
  assert.equal(repeat("ha", 0), "");
  assert.throws(() => repeat("ha", Infinity), RangeError);
  assert.throws(() => repeat("ha", 1.5), RangeError);
});
