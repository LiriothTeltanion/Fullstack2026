import type { Recipe } from "./recipe";

const KEY = "recipe-book";

const STARTER: Recipe[] = [
  {
    id: "starter-shakshuka",
    title: "Shakshuka",
    ingredients: [
      "4 eggs",
      "5 tomatoes",
      "1 red pepper",
      "2 garlic cloves",
      "1 tsp cumin",
      "1 tsp paprika",
    ],
    instructions:
      "Fry the pepper and garlic, add the chopped tomatoes and spices, simmer 10 minutes, crack in the eggs and cover until set.",
    minutes: 25,
    favorite: true,
  },
];

export function loadRecipes(): Recipe[] {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as Recipe[]) : STARTER;
  } catch {
    return STARTER;
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(recipes));
  } catch {
    // not fatal: the book still works until the page is closed
  }
}
