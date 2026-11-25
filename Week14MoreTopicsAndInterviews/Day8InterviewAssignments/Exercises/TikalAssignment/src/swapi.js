import { chartPlanetNames, populationOf, summarizeVehicles } from "./population.js";

export function createSwapiClient(fetcher = fetch) {
  const cache = new Map();
  function get(url) {
    if (!cache.has(url)) {
      cache.set(
        url,
        fetcher(url)
          .then(response => {
            if (!response.ok) throw new Error("SWAPI returned HTTP " + response.status);
            return response.json();
          })
          .catch(error => {
            cache.delete(url);
            throw error;
          })
      );
    }
    return cache.get(url);
  }
  async function all(url) {
    const results = [];
    let next = url;
    while (next) {
      const page = await get(next);
      results.push(...page.results);
      next = page.next;
    }
    return results;
  }
  return { get, all };
}

export async function loadChallenge(client) {
  const base = "https://swapi.dev/api/";
  const vehicles = await client.all(base + "vehicles/");
  const populated = await Promise.all(
    vehicles.map(async vehicle => {
      const pilots = await Promise.all(
        vehicle.pilots.map(async pilotUrl => {
          const pilot = await client.get(pilotUrl);
          const world = await client.get(pilot.homeworld);
          return {
            name: pilot.name,
            homeworld: { name: world.name, population: populationOf(world.population) },
          };
        })
      );
      return { name: vehicle.name, pilots };
    })
  );
  const planets = await Promise.all(
    chartPlanetNames.map(async name => {
      const matches = await client.all(base + "planets/?search=" + encodeURIComponent(name));
      const planet = matches.find(item => item.name === name);
      if (!planet) throw new Error("SWAPI could not find " + name);
      return { name, population: populationOf(planet.population) };
    })
  );
  return { winners: summarizeVehicles(populated), vehicleCount: vehicles.length, planets };
}
