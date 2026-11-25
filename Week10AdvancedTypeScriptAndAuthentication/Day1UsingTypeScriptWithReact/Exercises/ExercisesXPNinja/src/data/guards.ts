export interface Country {
  code: string;
  name: string;
  population: number;
  continent: "Asia" | "Europe" | "Americas" | "Africa" | "Oceania";
}

const CONTINENTS = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

// Exercise 3: a type guard. JSON.parse returns `unknown` data; this checks it at runtime.
export function isCountry(value: unknown): value is Country {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.code === "string" &&
    typeof item.name === "string" &&
    typeof item.population === "number" &&
    typeof item.continent === "string" &&
    CONTINENTS.includes(item.continent)
  );
}

export function parseCountries(json: string): { valid: Country[]; rejected: number } {
  const data: unknown = JSON.parse(json);
  if (!Array.isArray(data)) return { valid: [], rejected: 0 };
  const valid = data.filter(isCountry);
  return { valid, rejected: data.length - valid.length };
}
