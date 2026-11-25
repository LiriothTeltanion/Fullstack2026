export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  minutes: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
}

export type CatalogStatus = "idle" | "loading" | "succeeded" | "failed";
