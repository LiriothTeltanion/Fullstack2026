import { useCart } from "../context/CartContext.jsx";

const products = [
  { id: 1, name: "Keyboard", price: 250 },
  { id: 2, name: "Mouse", price: 90 },
  { id: 3, name: "Headphones", price: 320 },
];

function ProductList() {
  const { dispatch } = useCart();

  return (
    <div>
      <h3>Products</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} · ₪{product.price}{" "}
            <button onClick={() => dispatch({ type: "add", product })}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
