import assert from "node:assert/strict";
import test from "node:test";
import { coordinateFields, parseCoordinates } from "./src/coordinates.js";

test("zero and inclusive geographic limits are valid", () => {
  assert.deepEqual(parseCoordinates(0, 0), { lat: 0, lng: 0 });
  assert.deepEqual(parseCoordinates(-90, -180), { lat: -90, lng: -180 });
  assert.deepEqual(parseCoordinates(90, 180), { lat: 90, lng: 180 });
});

test("decimal and scientific text preserves ordinary numeric input", () => {
  assert.deepEqual(parseCoordinates(" 31.2518 ", "34.7913"), { lat: 31.2518, lng: 34.7913 });
  assert.deepEqual(parseCoordinates("-.5", "1.8e2"), { lat: -0.5, lng: 180 });
});

test("blank fields identify the first field needing attention", () => {
  assert.equal(parseCoordinates("", "").field, "latitude");
  assert.equal(parseCoordinates(" \t\n", 0).field, "latitude");
  assert.equal(parseCoordinates(0, " ").field, "longitude");
});

test("out-of-range values name the correct field and inclusive limits", () => {
  for (const value of [-90.0001, 90.0001]) {
    assert.equal(parseCoordinates(value, 0).field, "latitude");
    assert.match(parseCoordinates(value, 0).error, /-90 to 90/);
  }
  for (const value of [-180.0001, 180.0001]) {
    assert.equal(parseCoordinates(0, value).field, "longitude");
    assert.match(parseCoordinates(0, value).error, /-180 to 180/);
  }
});

test("non-finite and malformed numeric text cannot become selected locations", () => {
  for (const value of [
    NaN,
    Infinity,
    -Infinity,
    "NaN",
    "Infinity",
    "1e999",
    "0x10",
    "0b10",
    "1,2",
    "12north",
  ]) {
    assert.equal(parseCoordinates(value, 0).field, "latitude");
    assert.equal(parseCoordinates(0, value).field, "longitude");
  }
});

test("null, booleans, arrays and objects do not silently coerce to coordinates", () => {
  for (const value of [null, undefined, true, false, [], [12], {}, 12n, Symbol("coordinate")]) {
    assert.equal(parseCoordinates(value, 0).field, "latitude");
    assert.equal(parseCoordinates(0, value).field, "longitude");
  }
});

test("validation does not invoke an object's coercion hooks", () => {
  const value = {
    valueOf() {
      throw new Error("Unexpected numeric coercion");
    },
  };
  assert.equal(parseCoordinates(value, 0).field, "latitude");
});

test("form metadata shares the validator's two geographic ranges", () => {
  assert.deepEqual(
    coordinateFields.map(({ name, min, max }) => ({ name, min, max })),
    [
      { name: "latitude", min: -90, max: 90 },
      { name: "longitude", min: -180, max: 180 },
    ]
  );
});
