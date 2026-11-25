import { createSelector, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  { id: "b1", title: "Dune", author: "Frank Herbert", genre: "Science fiction" },
  { id: "b2", title: "The Hobbit", author: "J. R. R. Tolkien", genre: "Fantasy" },
  { id: "b3", title: "Dracula", author: "Bram Stoker", genre: "Horror" },
  { id: "b4", title: "Foundation", author: "Isaac Asimov", genre: "Science fiction" },
  { id: "b5", title: "Mistborn", author: "Brandon Sanderson", genre: "Fantasy" },
];

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    bookAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(book) {
        return { payload: { id: nanoid(), ...book } };
      },
    },
    bookRemoved(state, action) {
      return state.filter(book => book.id !== action.payload);
    },
  },
});

export const { bookAdded, bookRemoved } = booksSlice.actions;
export default booksSlice.reducer;

export const selectBooks = state => state.books;
const selectGenre = state => state.filters.genre;

// createSelector remembers the last result and only re-runs when books or genre change.
export const selectVisibleBooks = createSelector([selectBooks, selectGenre], (books, genre) =>
  genre === "All" ? books : books.filter(book => book.genre === genre)
);

export const selectGenres = createSelector([selectBooks], books => [
  "All",
  ...new Set(books.map(book => book.genre)),
]);

export const selectCountByGenre = createSelector([selectBooks], books =>
  books.reduce((counts, book) => {
    counts[book.genre] = (counts[book.genre] ?? 0) + 1;
    return counts;
  }, {})
);
