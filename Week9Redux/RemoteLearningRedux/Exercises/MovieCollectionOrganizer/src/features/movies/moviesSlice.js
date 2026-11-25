import { createSlice, nanoid } from "@reduxjs/toolkit";

export const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Animation"];

const moviesSlice = createSlice({
  name: "movies",
  initialState: [
    { id: "m1", title: "Blade Runner 2049", year: 2017, genre: "Sci-Fi", rating: 5, watched: true },
    { id: "m2", title: "Hereditary", year: 2018, genre: "Horror", rating: 4, watched: true },
    { id: "m3", title: "Spirited Away", year: 2001, genre: "Animation", rating: 5, watched: false },
    {
      id: "m4",
      title: "Mad Max: Fury Road",
      year: 2015,
      genre: "Action",
      rating: 4,
      watched: false,
    },
  ],
  reducers: {
    movieAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare({ title, year, genre, rating }) {
        return { payload: { id: nanoid(), title, year, genre, rating, watched: false } };
      },
    },
    watchedToggled(state, action) {
      const movie = state.find(item => item.id === action.payload);
      if (movie) movie.watched = !movie.watched;
    },
    movieRated(state, action) {
      const movie = state.find(item => item.id === action.payload.id);
      if (movie) movie.rating = action.payload.rating;
    },
    movieRemoved(state, action) {
      return state.filter(item => item.id !== action.payload);
    },
  },
});

export const { movieAdded, watchedToggled, movieRated, movieRemoved } = moviesSlice.actions;
export default moviesSlice.reducer;
