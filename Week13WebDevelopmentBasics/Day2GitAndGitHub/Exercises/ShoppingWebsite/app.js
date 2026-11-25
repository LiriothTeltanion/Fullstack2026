// Riff Shop: renders the products and keeps a cart in localStorage.
const products = [
  { id: 1, name: "Nickel guitar strings", price: 39, category: "guitar", icon: "🎸" },
  { id: 2, name: "Picks, 12 pack", price: 15, category: "guitar", icon: "🔺" },
  { id: 3, name: "Trigger capo", price: 49, category: "guitar", icon: "🗜️" },
  { id: 4, name: "Instrument cable, 3 m", price: 59, category: "studio", icon: "🔌" },
  { id: 5, name: "Closed-back headphones", price: 349, category: "studio", icon: "🎧" },
  { id: 6, name: "Pop filter", price: 45, category: "studio", icon: "🎙️" },
  { id: 7, name: "Digital metronome", price: 79, category: "practice", icon: "⏱️" },
  { id: 8, name: "Folding music stand", price: 89, category: "practice", icon: "📖" },
];

const STORAGE_KEY = "riff-shop-cart";
const money = new Intl.NumberFormat("en-IL", { style: "currency", currency: "ILS" });

const grid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartLines = document.getElementById("cart-lines");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const checkoutNote = document.getElementById("checkout-note");

// The cart is an object: { productId: quantity }
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Private mode can block storage; the cart still works until reload
  }
}

function renderProducts(category) {
  const visible = category === "all" ? products : products.filter(p => p.category === category);
  grid.innerHTML = "";
  for (const product of visible) {
    const item = document.createElement("li");
    item.className = "product";
    item.innerHTML = `
      <div class="product-image" aria-hidden="true">${product.icon}</div>
      <h3>${product.name}</h3>
      <p class="tag">${product.category}</p>
      <p class="price">${money.format(product.price)}</p>
      <button type="button" class="add" data-id="${product.id}">Add to cart</button>`;
    grid.append(item);
  }
}

function renderCart() {
  cartLines.innerHTML = "";
  let total = 0;
  let count = 0;

  for (const [id, quantity] of Object.entries(cart)) {
    const product = products.find(p => p.id === Number(id));
    if (!product) continue;
    total += product.price * quantity;
    count += quantity;

    const line = document.createElement("li");
    line.innerHTML = `
      <span>${product.icon} ${product.name} × ${quantity}</span>
      <span>${money.format(product.price * quantity)}</span>
      <button type="button" class="remove" data-id="${product.id}" aria-label="Remove one ${product.name}">−</button>`;
    cartLines.append(line);
  }

  cartCount.textContent = count;
  cartTotal.textContent = money.format(total);
  cartEmpty.hidden = count > 0;
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
}

function removeOne(id) {
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function toggleCart(open) {
  cartPanel.hidden = !open;
  cartButton.setAttribute("aria-expanded", String(open));
  if (open) document.getElementById("cart-close").focus();
}

// One listener on the grid handles every "Add to cart" button
grid.addEventListener("click", event => {
  const button = event.target.closest(".add");
  if (button) addToCart(Number(button.dataset.id));
});

cartLines.addEventListener("click", event => {
  const button = event.target.closest(".remove");
  if (button) removeOne(Number(button.dataset.id));
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => {
      b.classList.toggle("is-active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    renderProducts(button.dataset.category);
  });
});

cartButton.addEventListener("click", () => toggleCart(cartPanel.hidden));
document.getElementById("cart-close").addEventListener("click", () => {
  toggleCart(false);
  cartButton.focus();
});

document.getElementById("checkout").addEventListener("click", () => {
  const hasItems = Object.keys(cart).length > 0;
  checkoutNote.textContent = hasItems
    ? "Thanks! This is a demo shop, so the order stops here."
    : "Add something to the cart first.";
  if (hasItems) {
    cart = {};
    saveCart();
    renderCart();
  }
});

renderProducts("all");
renderCart();
