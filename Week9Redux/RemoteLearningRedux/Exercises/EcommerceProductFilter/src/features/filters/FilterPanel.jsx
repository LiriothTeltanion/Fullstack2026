import { useDispatch, useSelector } from "react-redux";
import { CATEGORIES, MAX_PRICE } from "../../data/products.js";
import {
  categoryToggled,
  filtersCleared,
  inStockToggled,
  maxPriceChanged,
  searchChanged,
  sortChanged,
} from "./filtersSlice.js";

export default function FilterPanel() {
  const filters = useSelector(state => state.filters);
  const dispatch = useDispatch();

  return (
    <aside className="card filters">
      <label>
        Search
        <input
          type="text"
          value={filters.search}
          onChange={event => dispatch(searchChanged(event.target.value))}
          placeholder="e.g. lamp"
        />
      </label>

      <fieldset style={{ border: 0, padding: 0, marginBottom: 12 }}>
        <legend>Category</legend>
        {CATEGORIES.map(name => (
          <label key={name} style={{ marginBottom: 4 }}>
            <input
              type="checkbox"
              checked={filters.categories.includes(name)}
              onChange={() => dispatch(categoryToggled(name))}
            />{" "}
            {name}
          </label>
        ))}
      </fieldset>

      <label>
        Max price: ₪{filters.maxPrice}
        <input
          type="range"
          min="0"
          max={MAX_PRICE}
          step="10"
          value={filters.maxPrice}
          onChange={event => dispatch(maxPriceChanged(Number(event.target.value)))}
          style={{ width: "100%" }}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={() => dispatch(inStockToggled())}
        />{" "}
        In stock only
      </label>

      <label>
        Sort by
        <select
          value={filters.sortBy}
          onChange={event => dispatch(sortChanged(event.target.value))}
        >
          <option value="featured">Featured</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
          <option value="rating">Best rated</option>
        </select>
      </label>

      <button className="secondary" onClick={() => dispatch(filtersCleared())}>
        Clear filters
      </button>
    </aside>
  );
}
