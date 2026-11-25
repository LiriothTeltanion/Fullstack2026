# 🎮 Mini Project - Shopping Website

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/shopping-website-a42400536b.svg" width="100%" alt="Progress card for Shopping Website">

</div>

Riff Shop, a small music gear store: eight products, category filters and a slide-in cart that remembers what I added after a reload. The products live in an array in [app.js](app.js), and the page builds the cards from it.

## ▶️ How to run

Open [index.html](index.html) in a browser. Nothing to install; the cart is stored in `localStorage` under `riff-shop-cart`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `renderProducts(category)` | Filters the `products` array (or shows all) and rebuilds the product grid |
| `renderCart()` | Rebuilds the cart lines, the item count badge and the total, and hides "Your cart is empty." when needed |
| `addToCart(id)` / `removeOne(id)` | Change the quantity in the `cart` object (`{ productId: quantity }`), then save and re-render |
| `loadCart()` / `saveCart()` | Read and write `localStorage`, wrapped in `try/catch` for private browsing |
| `toggleCart(open)` | Shows the cart panel, updates `aria-expanded` and moves focus to the close button |

Prices go through `Intl.NumberFormat` with `currency: "ILS"`. The checkout button only empties the cart and says the shop is a demo.

## 🧠 What I learned

- One click listener on the grid with `event.target.closest(".add")` handles every "Add to cart" button, even ones created later
- Storing quantities by id keeps the cart small, and the product details always come from the array
- `display: flex` on the cart panel would beat the `hidden` attribute, so the CSS also has `.cart[hidden] { display: none; }`
- `aria-pressed` on the filter buttons tells a screen reader which category is selected

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 2 - Git and GitHub - Mini Project
