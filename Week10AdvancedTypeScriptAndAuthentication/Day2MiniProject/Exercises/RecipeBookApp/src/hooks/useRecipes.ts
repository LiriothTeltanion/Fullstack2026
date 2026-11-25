import { useEffect, useState } from "react";
import { createRecipe, type Recipe, type RecipeDraft } from "../models/recipe";
import { loadRecipes, saveRecipes } from "../models/storage";

// All recipe changes go through this hook, so components never touch localStorage.
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes);

  useEffect(() => saveRecipes(recipes), [recipes]);

  const addRecipe = (draft: RecipeDraft) =>
    setRecipes(current => [createRecipe(draft), ...current]);

  const toggleFavorite = (id: string) =>
    setRecipes(current =>
      current.map(recipe => (recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe))
    );

  const deleteRecipe = (id: string) =>
    setRecipes(current => current.filter(recipe => recipe.id !== id));

  return { recipes, addRecipe, toggleFavorite, deleteRecipe };
}
