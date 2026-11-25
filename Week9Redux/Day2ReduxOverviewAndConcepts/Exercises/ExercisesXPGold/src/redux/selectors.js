// Totals are calculated from the cart, never stored, so they can't get out of sync.
export const selectCartItems = state => state.cart;

export const selectCartCount = state => state.cart.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = state =>
  state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectDiscount = state => (selectSubtotal(state) * state.coupon.percent) / 100;

export const selectTotal = state => selectSubtotal(state) - selectDiscount(state);
