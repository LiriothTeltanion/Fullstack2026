import test from "node:test";
import assert from "node:assert/strict";
import { countries, filterCountries } from "../src/countries.js";
import { validate } from "../src/validate.js";

test("country prefixes ignore case and outer whitespace while preserving labels", () => {
  assert.deepEqual(filterCountries("  UN "), ["United Kingdom", "United States"]);
  assert.deepEqual(filterCountries("is"), ["Israel"]);
  assert.deepEqual(filterCountries("ca"), ["Canada"]);
});
test("empty and unknown queries do not manufacture suggestions", () => {
  assert.deepEqual(filterCountries("  "), []);
  assert.deepEqual(filterCountries("Atlantis"), []);
  assert.deepEqual(filterCountries("an"), []);
});
test("a supplied list supports diacritics and remains unchanged", () => {
  const items = Object.freeze(["Åland", "Argentina"]);
  assert.deepEqual(filterCountries("al", items), ["Åland"]);
  assert.deepEqual(items, ["Åland", "Argentina"]);
  assert.equal(Object.isFrozen(countries), true);
  assert.equal(new Set(countries).size, countries.length);
});
test("the retained sign-up validator accepts valid synthetic input", () => {
  assert.deepEqual(
    validate({
      username: "Test visitor",
      email: "visitor@example.test",
      password: "example123",
      confirm: "example123",
      terms: true,
    }),
    {}
  );
});
test("the retained sign-up validator still explains each invalid field", () => {
  const errors = validate({
    username: "x",
    email: "bad",
    password: "short",
    confirm: "different",
    terms: false,
  });
  assert.deepEqual(Object.keys(errors), ["username", "email", "password", "confirm", "terms"]);
});
