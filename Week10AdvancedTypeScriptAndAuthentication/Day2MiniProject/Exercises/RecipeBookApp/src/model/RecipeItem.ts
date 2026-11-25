import { createRecipe, type Recipe, type RecipeDraft } from "../models/recipe";

/** Stored fields also accept recipes saved by the earlier React version. */
export interface RecipeItemData extends Omit<Recipe, "favorite"> {
  isFavorite: boolean;
}

export default class RecipeItem implements RecipeItemData {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  minutes: number;
  isFavorite: boolean;

  constructor(data: RecipeItemData | Recipe) {
    this.id = data.id;
    this.title = data.title;
    this.ingredients = [...data.ingredients];
    this.instructions = data.instructions;
    this.minutes = data.minutes;
    this.isFavorite = "isFavorite" in data ? data.isFavorite : data.favorite;
  }

  static create(draft: RecipeDraft): RecipeItem {
    return new RecipeItem(createRecipe(draft));
  }

  get favorite(): boolean {
    return this.isFavorite;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }
}
