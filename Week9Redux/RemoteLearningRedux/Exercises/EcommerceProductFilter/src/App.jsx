import FilterPanel from "./features/filters/FilterPanel.jsx";
import ProductGrid from "./features/products/ProductGrid.jsx";

export default function App() {
  return (
    <main>
      <h1>Product filter</h1>
      <div className="shop">
        <FilterPanel />
        <ProductGrid />
      </div>
    </main>
  );
}
