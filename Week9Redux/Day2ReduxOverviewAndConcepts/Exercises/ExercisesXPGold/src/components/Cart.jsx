import { useDispatch, useSelector } from "react-redux";
import { useEffect, useId, useState } from "react";
import { clearCart, removeItem, setQuantity } from "../redux/cartReducer.js";
import {
  selectCartCount,
  selectCartItems,
  selectDiscount,
  selectSubtotal,
  selectTotal,
} from "../redux/selectors.js";

function QuantityEditor({ item }) {
  const dispatch = useDispatch();
  const [draft, setDraft] = useState(String(item.quantity));
  const [error, setError] = useState("");
  const id = useId();
  // An Add-to-cart action can change the saved quantity outside this editor.
  useEffect(() => {
    setDraft(String(item.quantity));
    setError("");
  }, [item.quantity]);
  function submit(event) {
    event.preventDefault();
    const value = Number(draft);
    if (!draft.trim() || !Number.isSafeInteger(value) || value < 0) {
      setError("Enter a whole quantity of 0 or more.");
      event.currentTarget.elements.quantity.focus();
      return;
    }
    dispatch(setQuantity(item.id, value));
    setError("");
  }
  return (
    <div className="quantity-editor">
      <form className="row" onSubmit={submit} noValidate>
        <input
          type="number"
          name="quantity"
          min="0"
          step="1"
          value={draft}
          onChange={event => {
            setDraft(event.target.value);
            setError("");
          }}
          aria-label={`Quantity of ${item.name}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button type="submit" aria-label={`Update quantity of ${item.name}`}>
          Update
        </button>
      </form>
      {error && (
        <p className="error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

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
      <p className="muted">
        Edit a quantity, then choose Update or press Enter. Confirming 0 removes the item.
      </p>
      {items.length === 0 && <p className="muted">The cart is empty.</p>}
      <ul className="plain">
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span className="row">
              <QuantityEditor item={item} />
              <span>₪{(item.price * item.quantity).toFixed(2)}</span>
              <button
                className="danger"
                aria-label={`Remove ${item.name} from cart`}
                onClick={() => dispatch(removeItem(item.id))}
              >
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
