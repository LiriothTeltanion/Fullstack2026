export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  minutes: number;
  favorite: boolean;
}

// What the form sends: everything except the fields the app fills in itself.
export type RecipeDraft = Omit<Recipe, "id" | "favorite">;

export function createRecipe(draft: RecipeDraft): Recipe {
  return { ...draft, id: crypto.randomUUID(), favorite: false };
}

// One ingredient per line in the textarea; empty lines are ignored.
export function parseIngredients(text: string): string[] {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

export function matchesSearch(recipe: Recipe, search: string): boolean {
  const text = search.trim().toLowerCase();
  if (!text) return true;
  return (
    recipe.title.toLowerCase().includes(text) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(text))
  );
}
