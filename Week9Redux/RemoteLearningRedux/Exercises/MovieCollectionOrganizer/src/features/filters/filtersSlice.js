import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = { genre: "All", status: "all", sortBy: "title" };

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    genreFiltered(state, action) {
      state.genre = action.payload;
    },
    statusFiltered(state, action) {
      state.status = action.payload; // "all" | "watched" | "unwatched"
    },
    sortChanged(state, action) {
      state.sortBy = action.payload; // "title" | "year" | "rating"
    },
    filtersReset() {
      return initialState;
    },
  },
});

export const { genreFiltered, statusFiltered, sortChanged, filtersReset } = filtersSlice.actions;
export default filtersSlice.reducer;

const compare = {
  title: (a, b) => a.title.localeCompare(b.title),
  year: (a, b) => b.year - a.year, // newest first
  rating: (a, b) => b.rating - a.rating || a.title.localeCompare(b.title),
};

export const selectVisibleMovies = createSelector(
  [state => state.movies, state => state.filters],
  (movies, { genre, status, sortBy }) =>
    movies
      .filter(movie => genre === "All" || movie.genre === genre)
      .filter(movie => status === "all" || movie.watched === (status === "watched"))
      .toSorted(compare[sortBy])
);

export const selectStats = createSelector([state => state.movies], movies => ({
  total: movies.length,
  watched: movies.filter(movie => movie.watched).length,
}));
