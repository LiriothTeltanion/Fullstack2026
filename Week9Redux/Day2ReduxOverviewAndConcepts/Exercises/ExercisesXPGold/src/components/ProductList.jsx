import { useDispatch } from "react-redux";
import { products } from "../data/products.js";
import { addItem } from "../redux/cartReducer.js";

export default function ProductList() {
  const dispatch = useDispatch();

  return (
    <section className="card">
      <h2>Products</h2>
      <ul className="plain">
        {products.map(product => (
          <li key={product.id}>
            <span>
              {product.name} <span className="muted">₪{product.price.toFixed(2)}</span>
            </span>
            <button onClick={() => dispatch(addItem(product))}>Add to cart</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
