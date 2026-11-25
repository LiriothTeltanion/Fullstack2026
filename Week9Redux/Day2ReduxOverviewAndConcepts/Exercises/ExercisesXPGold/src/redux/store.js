import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartReducer.js";
import couponReducer from "./couponReducer.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    coupon: couponReducer,
  },
});
