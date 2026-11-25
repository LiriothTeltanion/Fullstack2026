export const chartPlanetNames = ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"];

export function populationOf(value) {
  if (!/^[0-9]+$/.test(String(value))) return null;
  const population = Number(value);
  return Number.isSafeInteger(population) ? population : null;
}

export function summarizeVehicles(vehicles) {
  const summaries = vehicles.map(vehicle => ({
    ...vehicle,
    totalPopulation: vehicle.pilots.reduce(
      (total, pilot) => total + (pilot.homeworld.population ?? 0),
      0
    ),
    unknownPopulations: vehicle.pilots.filter(pilot => pilot.homeworld.population === null).length,
  }));
  const greatest = Math.max(0, ...summaries.map(vehicle => vehicle.totalPopulation));
  return summaries.filter(vehicle => vehicle.totalPopulation === greatest);
}
