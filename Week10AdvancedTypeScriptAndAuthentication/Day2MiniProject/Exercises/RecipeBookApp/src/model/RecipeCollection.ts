import RecipeItem, { type RecipeItemData } from "./RecipeItem";
import type { Recipe, RecipeDraft } from "../models/recipe";
import { loadRecipes } from "../models/storage";

function isRecipe(value: unknown): value is RecipeItemData | Recipe {
  if (!value || typeof value !== "object") return false;
  const recipe = value as Record<string, unknown>;
  return (
    typeof recipe.id === "string" &&
    typeof recipe.title === "string" &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every(ingredient => typeof ingredient === "string") &&
    typeof recipe.instructions === "string" &&
    typeof recipe.minutes === "number" &&
    Number.isFinite(recipe.minutes) &&
    (typeof recipe.isFavorite === "boolean" ||
      (recipe.isFavorite === undefined && typeof recipe.favorite === "boolean"))
  );
}

/** Owns collection updates and persistence under the original storage key. */
export default class RecipeCollection {
  recipes: RecipeItem[] = [];
  storageMessage = "";

  constructor() {
    this.load();
  }

  load(): void {
    const saved = loadRecipes();
    this.recipes = Array.isArray(saved)
      ? saved.filter(isRecipe).map(recipe => new RecipeItem(recipe))
      : [];
  }

  save(): void {
    try {
      localStorage.setItem(
        "recipe-book",
        JSON.stringify(this.recipes.map(recipe => ({ ...recipe, favorite: recipe.isFavorite })))
      );
      this.storageMessage = "";
    } catch {
      this.storageMessage = "Storage is unavailable. Your changes last until this page closes.";
    }
  }

  add(draft: RecipeDraft): void {
    this.recipes.unshift(RecipeItem.create(draft));
    this.save();
  }

  remove(id: string): void {
    this.recipes = this.recipes.filter(recipe => recipe.id !== id);
    this.save();
  }

  toggleFavorite(id: string): void {
    this.recipes.find(recipe => recipe.id === id)?.toggleFavorite();
    this.save();
  }

  clear(): void {
    this.recipes = [];
    this.save();
  }
}
