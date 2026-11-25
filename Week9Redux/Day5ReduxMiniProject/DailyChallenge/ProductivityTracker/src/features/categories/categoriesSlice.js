import { createSelector, createSlice, nanoid } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [
      { id: "work", name: "Work" },
      { id: "study", name: "Study" },
      { id: "health", name: "Health" },
    ],
    selectedId: "all",
  },
  reducers: {
    categoryAdded: {
      reducer(state, action) {
        const name = action.payload.name.trim();
        if (
          name &&
          !state.items.some(category => category.name.toLowerCase() === name.toLowerCase())
        ) {
          state.items.push({ ...action.payload, name });
        }
      },
      prepare(name) {
        return { payload: { id: nanoid(), name } };
      },
    },
    categoryEdited(state, action) {
      const category = state.items.find(item => item.id === action.payload.id);
      const name = action.payload.name.trim();
      if (
        category &&
        name &&
        !state.items.some(
          item => item.id !== category.id && item.name.toLowerCase() === name.toLowerCase()
        )
      )
        category.name = name;
    },
    categoryDeleted(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedId === action.payload) state.selectedId = "all";
    },
    categorySelected(state, action) {
      if (
        action.payload === "all" ||
        action.payload === "uncategorized" ||
        state.items.some(category => category.id === action.payload)
      )
        state.selectedId = action.payload;
    },
  },
});

export const { categoryAdded, categoryEdited, categoryDeleted, categorySelected } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;

export const selectCategories = state => state.categories.items;
export const selectSelectedCategoryId = state => state.categories.selectedId;

export const selectCategoryById = createSelector(
  [selectCategories, (state, categoryId = state.categories.selectedId) => categoryId],
  (categories, categoryId) => categories.find(category => category.id === categoryId)
);
