import { createSelector, createSlice } from "@reduxjs/toolkit";
import { MAX_PRICE } from "../../data/products.js";

const initialState = {
  search: "",
  categories: [], // empty = every category
  maxPrice: MAX_PRICE,
  inStockOnly: false,
  sortBy: "featured",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    searchChanged(state, action) {
      state.search = action.payload;
    },
    categoryToggled(state, action) {
      const name = action.payload;
      state.categories = state.categories.includes(name)
        ? state.categories.filter(item => item !== name)
        : [...state.categories, name];
    },
    maxPriceChanged(state, action) {
      state.maxPrice = action.payload;
    },
    inStockToggled(state) {
      state.inStockOnly = !state.inStockOnly;
    },
    sortChanged(state, action) {
      state.sortBy = action.payload;
    },
    filtersCleared() {
      return initialState;
    },
  },
});

export const {
  searchChanged,
  categoryToggled,
  maxPriceChanged,
  inStockToggled,
  sortChanged,
  filtersCleared,
} = filtersSlice.actions;
export default filtersSlice.reducer;

const sorters = {
  featured: () => 0,
  priceLow: (a, b) => a.price - b.price,
  priceHigh: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export const selectVisibleProducts = createSelector(
  [state => state.products, state => state.filters],
  (products, filters) => {
    const text = filters.search.trim().toLowerCase();
    return products
      .filter(product => !text || product.name.toLowerCase().includes(text))
      .filter(
        product => filters.categories.length === 0 || filters.categories.includes(product.category)
      )
      .filter(product => product.price <= filters.maxPrice)
      .filter(product => !filters.inStockOnly || product.inStock)
      .toSorted(sorters[filters.sortBy]);
  }
);
