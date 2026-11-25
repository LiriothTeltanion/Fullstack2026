import { useSelector } from "react-redux";
import { selectVisibleProducts } from "../filters/filtersSlice.js";

export default function ProductGrid() {
  const products = useSelector(selectVisibleProducts);
  const total = useSelector(state => state.products.length);

  return (
    <section>
      <p className="muted" aria-live="polite">
        Showing {products.length} of {total} products
      </p>
      {products.length === 0 && <p>No product matches. Try clearing a filter.</p>}
      <div className="grid">
        {products.map(product => (
          <article key={product.id} className={`card product ${product.inStock ? "" : "out"}`}>
            <h2>{product.name}</h2>
            <p className="muted">{product.category}</p>
            <p>
              <strong>₪{product.price}</strong> · ★ {product.rating.toFixed(1)}
            </p>
            <p className={product.inStock ? "" : "error"}>
              {product.inStock ? "In stock" : "Out of stock"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
