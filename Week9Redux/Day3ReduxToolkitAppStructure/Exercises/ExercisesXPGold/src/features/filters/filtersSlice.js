import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: { genre: "All" },
  reducers: {
    genreChanged(state, action) {
      state.genre = action.payload;
    },
  },
});

export const { genreChanged } = filtersSlice.actions;
export default filtersSlice.reducer;
