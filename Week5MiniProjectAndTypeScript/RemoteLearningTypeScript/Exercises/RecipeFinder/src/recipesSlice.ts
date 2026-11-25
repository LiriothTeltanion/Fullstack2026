import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchCatalog, matchesIngredients } from "./catalog";
import type { CatalogStatus, Recipe } from "./types";

export interface RecipesState {
  items: Recipe[];
  status: CatalogStatus;
  error: string | null;
  query: string;
  selectedId: string | null;
}

const initialState: RecipesState = {
  items: [],
  status: "idle",
  error: null,
  query: "",
  selectedId: null,
};
type SliceRoot = { recipes: RecipesState };

export const loadRecipes = createAsyncThunk<Recipe[], void, { state: SliceRoot }>(
  "recipes/load",
  (_, { signal }) => fetchCatalog(signal),
  {
    // A pending action is synchronous: StrictMode cannot duplicate an in-flight request.
    condition: (_, { getState }) => getState().recipes.status !== "loading",
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.selectedId = null;
    },
    selectRecipe(state, action: PayloadAction<string | null>) {
      // Ignore IDs that are absent from the validated catalog.
      state.selectedId =
        action.payload !== null && state.items.some(recipe => recipe.id === action.payload)
          ? action.payload
          : null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadRecipes.pending, state => {
        state.status = "loading";
        state.error = null;
        state.selectedId = null;
      })
      .addCase(loadRecipes.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(loadRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load recipes. Please try again.";
      });
  },
});

export const { setQuery, selectRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
export const selectRecipeState = (state: SliceRoot) => state.recipes;
export const selectVisibleRecipes = createSelector(
  [(state: SliceRoot) => state.recipes.items, (state: SliceRoot) => state.recipes.query],
  (recipes, query) => recipes.filter(recipe => matchesIngredients(recipe, query))
);
export const selectSelectedRecipe = createSelector(
  [(state: SliceRoot) => state.recipes.items, (state: SliceRoot) => state.recipes.selectedId],
  (recipes, id) => recipes.find(recipe => recipe.id === id) ?? null
);
