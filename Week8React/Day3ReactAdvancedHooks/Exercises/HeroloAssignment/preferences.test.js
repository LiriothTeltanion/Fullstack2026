import assert from "node:assert/strict";
import test from "node:test";
import { parseWeatherPreferences } from "./src/context/preferences.js";

const legacyCity = {
  id: 293397,
  name: "Tel Aviv",
  country: "Israel",
  latitude: 32.08088,
  longitude: 34.78057,
};
const providerCity = {
  id: "accuweather:215854",
  provider: "accuweather",
  locationKey: "215854",
  name: "Tel Aviv",
  country: "Israel",
};

test("malformed JSON and unsupported root values recover usable defaults", () => {
  for (const raw of [null, "{", "null", "[]", "42", '"saved"']) {
    assert.deepEqual(parseWeatherPreferences(raw), { favorites: [], unit: "C", dark: false });
  }
});

test("null or non-array favorites cannot break the next render", () => {
  for (const favorites of [null, {}, "city", 12]) {
    assert.deepEqual(parseWeatherPreferences(JSON.stringify({ favorites })).favorites, []);
  }
});

test("mixed saved entries preserve both supported providers and omit unusable entries", () => {
  const result = parseWeatherPreferences(
    JSON.stringify({ favorites: [legacyCity, null, providerCity, 12, [], { id: 9 }] })
  );
  assert.deepEqual(result.favorites, [legacyCity, providerCity]);
});

test("invalid city labels, identifiers and coordinates do not reach React or the API", () => {
  const variants = [
    { ...legacyCity, name: {} },
    { ...legacyCity, country: {} },
    { ...legacyCity, id: "" },
    { ...legacyCity, latitude: null },
    { ...legacyCity, longitude: 181 },
  ];
  assert.deepEqual(parseWeatherPreferences(JSON.stringify({ favorites: variants })).favorites, []);
});

test("valid preferences and original favorite metadata survive restoration", () => {
  const favorite = { ...legacyCity, note: "existing metadata" };
  assert.deepEqual(
    parseWeatherPreferences(JSON.stringify({ favorites: [favorite], unit: "F", dark: true })),
    { favorites: [favorite], unit: "F", dark: true }
  );
});

test("invalid preference types fall back without sharing mutable defaults", () => {
  const first = parseWeatherPreferences('{"favorites":null,"unit":{},"dark":"false"}');
  assert.deepEqual(first, { favorites: [], unit: "C", dark: false });
  first.favorites.push(legacyCity);
  assert.deepEqual(parseWeatherPreferences(null).favorites, []);
});
