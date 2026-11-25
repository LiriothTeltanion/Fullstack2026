import { test } from "node:test";
import assert from "node:assert/strict";
import { populationOf, summarizeVehicles } from "../src/population.js";
import { createSwapiClient, loadChallenge } from "../src/swapi.js";

test("population parsing preserves zero and rejects unknown or unsafe values", () => {
  assert.equal(populationOf("0"), 0);
  assert.equal(populationOf("200000"), 200000);
  for (const value of ["unknown", "", "1.5", "-1", "9007199254740992"])
    assert.equal(populationOf(value), null);
});
test("totals count each pilot, retain ties and label unknown values", () => {
  const pilot = (name, population) => ({ name, homeworld: { name: "Sample", population } });
  const winners = summarizeVehicles([
    { name: "A", pilots: [pilot("One", 10), pilot("Two", 10), pilot("Three", null)] },
    { name: "B", pilots: [pilot("Four", 20)] },
    { name: "C", pilots: [] },
  ]);
  assert.deepEqual(
    winners.map(vehicle => vehicle.name),
    ["A", "B"]
  );
  assert.equal(winners[0].totalPopulation, 20);
  assert.equal(winners[0].unknownPopulations, 1);
  assert.deepEqual(summarizeVehicles([]), []);
});
test("client shares in-flight calls, follows pages and allows failed calls to retry", async () => {
  const counts = new Map();
  const client = createSwapiClient(async url => {
    counts.set(url, (counts.get(url) ?? 0) + 1);
    if (url === "fail" && counts.get(url) === 1) return { ok: false, status: 503 };
    return { ok: true, json: async () => ({ results: [url], next: url === "one" ? "two" : null }) };
  });
  await Promise.all([client.get("same"), client.get("same")]);
  assert.equal(counts.get("same"), 1);
  assert.deepEqual(await client.all("one"), ["one", "two"]);
  await assert.rejects(client.get("fail"), /503/);
  await client.get("fail");
  assert.equal(counts.get("fail"), 2);
});
test("challenge consumes paginated synthetic vehicles and the five requested planets", async () => {
  const base = "https://swapi.dev/api/";
  const client = createSwapiClient(async url => ({
    ok: true,
    json: async () => {
      if (url === base + "vehicles/")
        return { results: [{ name: "Sample speeder", pilots: ["pilot"] }], next: null };
      if (url === "pilot") return { name: "Sample pilot", homeworld: "world" };
      if (url === "world") return { name: "Sample world", population: "42" };
      return {
        results: [{ name: decodeURIComponent(url.split("=")[1]), population: "10" }],
        next: null,
      };
    },
  }));
  const data = await loadChallenge(client);
  assert.equal(data.winners[0].totalPopulation, 42);
  assert.equal(data.planets.length, 5);
  assert.equal(data.vehicleCount, 1);
});
