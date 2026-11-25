import type { Recipe } from "./types";

function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A JSON file is an external boundary even when it is shipped with the app. */
export function parseCatalog(value: unknown): Recipe[] {
  if (!Array.isArray(value)) throw new Error("Recipe data must be an array.");
  const seen = new Set<string>();
  return value.map((item: unknown) => {
    if (
      !record(item) ||
      !nonempty(item.id) ||
      !nonempty(item.title) ||
      !nonempty(item.description) ||
      !Number.isInteger(item.minutes) ||
      Number(item.minutes) <= 0 ||
      !Number.isInteger(item.servings) ||
      Number(item.servings) <= 0 ||
      !Array.isArray(item.ingredients) ||
      item.ingredients.length === 0 ||
      !item.ingredients.every(
        (ingredient: unknown) =>
          record(ingredient) && nonempty(ingredient.name) && nonempty(ingredient.quantity)
      ) ||
      !Array.isArray(item.steps) ||
      item.steps.length === 0 ||
      !item.steps.every(nonempty)
    ) {
      throw new Error("Recipe data contains an invalid record.");
    }
    const id = item.id.trim();
    if (seen.has(id)) throw new Error("Recipe identifiers must be unique.");
    seen.add(id);
    return {
      id,
      title: item.title.trim(),
      description: item.description.trim(),
      minutes: Number(item.minutes),
      servings: Number(item.servings),
      ingredients: item.ingredients.map((ingredient: Record<string, string>) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
      })),
      steps: item.steps.map((step: string) => step.trim()),
    };
  });
}

/** Every comma/space-delimited term must match an ingredient, ignoring case and accents. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesIngredients(recipe: Recipe, query: string): boolean {
  const terms = normalize(query)
    .split(/[\s,]+/)
    .filter(Boolean);
  const pantry = normalize(recipe.ingredients.map(ingredient => ingredient.name).join(" "));
  return terms.every(term => pantry.includes(term));
}

export async function fetchCatalog(signal: AbortSignal): Promise<Recipe[]> {
  let response: Response;
  try {
    response = await fetch(`${import.meta.env.BASE_URL}recipes.json`, { signal });
  } catch {
    throw new Error("Could not reach the local recipe file. Please try again.");
  }
  if (!response.ok) {
    throw new Error("Could not load the local recipe file. Please try again.");
  }
  try {
    return parseCatalog(await response.json());
  } catch {
    throw new Error(
      "The recipe file contains invalid data. Please check recipes.json and try again."
    );
  }
}
