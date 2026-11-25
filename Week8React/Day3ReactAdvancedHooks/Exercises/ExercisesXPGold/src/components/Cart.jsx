import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const { items, total, dispatch } = useCart();

  return (
    <div>
      <h3>Cart</h3>
      {items.length === 0 ? (
        <p className="muted">The cart is empty.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} × {item.qty}{" "}
              <button onClick={() => dispatch({ type: "decrease", id: item.id })}>−</button>
            </li>
          ))}
        </ul>
      )}
      <p>
        <strong>Total: ₪{total}</strong>
      </p>
      <button onClick={() => dispatch({ type: "clear" })} disabled={!items.length}>
        Clear cart
      </button>
    </div>
  );
}

export default Cart;
