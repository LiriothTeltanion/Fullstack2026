# 🧪 Remote Exercise - E-commerce Product Filter

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/ecommerce-product-filter-1ca4a441b2.svg" width="100%" alt="Progress card for E-commerce Product Filter">

</div>

A shop page with a filter sidebar. Twelve products can be narrowed down by text, category, maximum price and stock, then sorted, and every filter lives in a Redux slice.

## ▶️ How to run

```bash
npm install
npm run dev
```

## 🎯 The challenge

| Piece | What it does |
|---|---|
| `data/products.js` | The catalog, plus `CATEGORIES` and `MAX_PRICE` worked out from it |
| `productsSlice` | Holds the catalog (no reducers, the list doesn't change) |
| `filtersSlice` | `searchChanged`, `categoryToggled` (several categories at once), `maxPriceChanged`, `inStockToggled`, `sortChanged`, `filtersCleared` |
| `selectVisibleProducts` | Runs the four filters in a row, then sorts with the chosen comparer |
| `FilterPanel` | Search box, category checkboxes, a price slider, the stock checkbox, the sort menu and Clear |
| `ProductGrid` | "Showing X of Y" and one card per product, faded when out of stock |

## 🧠 What I learned

- An empty `categories` array meaning "every category" kept the toggle logic simple
- Chaining small `.filter()` calls, one per rule, is easier to read and debug than one big condition
- The range input gives a string, so `Number(event.target.value)` goes in before dispatching
- Deriving `MAX_PRICE` from the data means the slider still fits if I add a more expensive product

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 9 Remote Learning - Redux - Remote Exercise
