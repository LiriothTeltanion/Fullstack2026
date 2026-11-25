import { createSlice } from "@reduxjs/toolkit";
import { products } from "../../data/products.js";

// The catalog never changes in this exercise, so the slice has no reducers.
const productsSlice = createSlice({
  name: "products",
  initialState: products,
  reducers: {},
});

export default productsSlice.reducer;
