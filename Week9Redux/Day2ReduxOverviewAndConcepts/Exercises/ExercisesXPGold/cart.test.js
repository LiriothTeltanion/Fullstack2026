import assert from "node:assert/strict";
import test from "node:test";
import cartReducer, {
  addItem,
  clearCart,
  removeItem,
  setQuantity,
} from "./src/redux/cartReducer.js";
import couponReducer, { applyCoupon, removeCoupon } from "./src/redux/couponReducer.js";
import {
  selectCartCount,
  selectDiscount,
  selectSubtotal,
  selectTotal,
} from "./src/redux/selectors.js";

const notebook = Object.freeze({ id: "p1", name: "Notebook", price: 12 });
test("cart actions add, increment, remove and clear immutable lines", () => {
  const initial = Object.freeze([]);
  const first = cartReducer(initial, addItem(notebook));
  Object.freeze(first[0]);
  Object.freeze(first);
  const second = cartReducer(first, addItem(notebook));
  assert.equal(first[0].quantity, 1);
  assert.equal(second[0].quantity, 2);
  assert.deepEqual(cartReducer(second, removeItem("p1")), []);
  assert.deepEqual(cartReducer(second, clearCart()), []);
});
test("valid whole quantities commit and zero or negative integers retain removal semantics", () => {
  const cart = cartReducer([], addItem(notebook));
  assert.equal(cartReducer(cart, setQuantity("p1", 10))[0].quantity, 10);
  assert.deepEqual(cartReducer(cart, setQuantity("p1", 0)), []);
  assert.deepEqual(cartReducer(cart, setQuantity("p1", -1)), []);
});
test("fractional, non-finite and non-number quantities never corrupt cart state", () => {
  const cart = cartReducer([], addItem(notebook));
  for (const quantity of [
    0.5,
    1.5,
    NaN,
    Infinity,
    -Infinity,
    "2",
    null,
    undefined,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.equal(cartReducer(cart, setQuantity("p1", quantity)), cart);
  }
  assert.equal(cartReducer(cart, setQuantity("missing", 3)), cart);
});
test("adding an existing product cannot overflow its supported integer quantity", () => {
  const cart = [{ ...notebook, quantity: Number.MAX_SAFE_INTEGER }];
  assert.equal(cartReducer(cart, addItem(notebook)), cart);
});
test("coupon normalization, invalid-code feedback and removal preserve derived totals", () => {
  const cart = cartReducer(cartReducer([], addItem(notebook)), setQuantity("p1", 2));
  const coupon = couponReducer(undefined, applyCoupon(" save10 "));
  const state = { cart, coupon };
  assert.equal(coupon.code, "SAVE10");
  assert.equal(selectCartCount(state), 2);
  assert.equal(selectSubtotal(state), 24);
  assert.equal(selectDiscount(state), 2.4);
  assert.equal(selectTotal(state), 21.6);
  assert.ok(couponReducer(undefined, applyCoupon("unknown")).error);
  assert.equal(couponReducer(coupon, removeCoupon()).percent, 0);
});
