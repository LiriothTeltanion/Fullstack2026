import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeItem, setQuantity } from "../redux/cartReducer.js";
import {
  selectCartCount,
  selectCartItems,
  selectDiscount,
  selectSubtotal,
  selectTotal,
} from "../redux/selectors.js";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const total = useSelector(selectTotal);
  const dispatch = useDispatch();

  return (
    <section className="card">
      <h2>Cart ({count})</h2>
      {items.length === 0 && <p className="muted">The cart is empty.</p>}
      <ul className="plain">
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span className="row">
              <input
                type="number"
                min="0"
                value={item.quantity}
                onChange={event => dispatch(setQuantity(item.id, Number(event.target.value)))}
                aria-label={`Quantity of ${item.name}`}
                style={{ width: "4.5rem" }}
              />
              <span>₪{(item.price * item.quantity).toFixed(2)}</span>
              <button className="danger" onClick={() => dispatch(removeItem(item.id))}>
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
      <p>Subtotal: ₪{subtotal.toFixed(2)}</p>
      {discount > 0 && <p>Discount: -₪{discount.toFixed(2)}</p>}
      <p>
        <strong>Total: ₪{total.toFixed(2)}</strong>
      </p>
      <button className="secondary" onClick={() => dispatch(clearCart())} disabled={!items.length}>
        Clear cart
      </button>
    </section>
  );
}
