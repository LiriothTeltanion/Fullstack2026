import { createSlice, nanoid } from "@reduxjs/toolkit";

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
        state.items.push(action.payload);
      },
      prepare(name) {
        return { payload: { id: nanoid(), name } };
      },
    },
    categorySelected(state, action) {
      state.selectedId = action.payload;
    },
  },
});

export const { categoryAdded, categorySelected } = categoriesSlice.actions;
export default categoriesSlice.reducer;

export const selectCategories = state => state.categories.items;
export const selectSelectedCategoryId = state => state.categories.selectedId;
