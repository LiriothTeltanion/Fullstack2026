import { createSelector, createSlice } from "@reduxjs/toolkit";

const library = [
  { id: 1, title: "Frankenstein", author: "Mary Shelley", genre: "Horror" },
  { id: 2, title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", genre: "Fantasy" },
  { id: 3, title: "Kindred", author: "Octavia E. Butler", genre: "Science fiction" },
];
const bookSlice = createSlice({ name: "books", initialState: library, reducers: {} });
export default bookSlice.reducer;
export const selectBooks = state => state.books;
const byGenre = genre =>
  createSelector([selectBooks], books => books.filter(book => book.genre === genre));
export const selectHorrorBooks = byGenre("Horror");
export const selectFantasyBooks = byGenre("Fantasy");
export const selectScienceFictionBooks = byGenre("Science fiction");
