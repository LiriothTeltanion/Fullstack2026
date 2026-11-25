import assert from "node:assert/strict";
import test from "node:test";
import {
  mapType,
  getProperty,
  multiplyProperty,
  type MappedType,
  type HasNumericProperty,
} from "./requiredNinja.ts";

test("mapType squares numbers and measures strings, including empty inputs", () => {
  const square: MappedType<number> = mapType(-4);
  const length: MappedType<string> = mapType("TypeScript");
  assert.equal(square, 16);
  assert.equal(length, 10);
  assert.equal(mapType(0), 0);
  assert.equal(mapType(1.5), 2.25);
  assert.equal(mapType(""), 0);
  // JavaScript string.length counts UTF-16 code units.
  assert.equal(mapType("😀"), 2);
  for (const value of [NaN, Infinity, Number.MAX_VALUE])
    assert.throws(() => mapType(value), RangeError);
  assert.throws(() => mapType(true as never), TypeError);
});
test("getProperty keeps indexed result types, including optional and symbol properties", () => {
  const symbol = Symbol("score"),
    record = { name: "Kevin", age: 25, active: true, [symbol]: 8 };
  const name: string = getProperty(record, "name");
  const age: number = getProperty(record, "age");
  const active: boolean = getProperty(record, "active");
  assert.equal(name, "Kevin");
  assert.equal(age, 25);
  assert.equal(active, true);
  assert.equal(getProperty(record, symbol), 8);
  const optional: { value?: number } = {};
  const absent: number | undefined = getProperty(optional, "value");
  assert.equal(absent, undefined);
  assert.equal(getProperty({ 0: "first" }, 0), "first");
});
test("multiplyProperty constrains the selected key and never mutates the input", () => {
  const item = Object.freeze({ name: "Notebook", price: 12.5, stock: 4 });
  const numeric: HasNumericProperty<"price"> = item;
  assert.equal(multiplyProperty(numeric, "price", 3), 37.5);
  assert.equal(multiplyProperty(item, "stock", 0), 0);
  assert.equal(multiplyProperty(item, "price", -2), -25);
  assert.equal(item.price, 12.5);
  for (const factor of [NaN, Infinity])
    assert.throws(() => multiplyProperty(item, "price", factor), TypeError);
  assert.throws(() => multiplyProperty({ price: NaN }, "price", 2), TypeError);
  assert.throws(() => multiplyProperty({ price: Number.MAX_VALUE }, "price", 2), RangeError);
  assert.throws(() => multiplyProperty({ price: "12" } as never, "price", 2), TypeError);
});
function assertCompileTimeConstraints() {
  // @ts-expect-error mapType only accepts a number or string.
  mapType(true);
  // @ts-expect-error An unsupported conditional type resolves to never.
  const unsupported: MappedType<boolean> = 1;
  void unsupported;
  // @ts-expect-error The selected key must exist.
  getProperty({ name: "Kevin" }, "missing");
  // @ts-expect-error The name property is inferred as string.
  const wrong: number = getProperty({ name: "Kevin" }, "name");
  void wrong;
  // @ts-expect-error A string property cannot satisfy HasNumericProperty.
  multiplyProperty({ name: "Kevin", age: 25 }, "name", 2);
  // @ts-expect-error The requested numeric key is required.
  multiplyProperty({ age: 25 }, "missing", 2);
}

// Retain the compile-time proof without executing invalid calls.
void assertCompileTimeConstraints;
