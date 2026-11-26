// Riff Shop: renders the products and keeps a cart in localStorage.
const products = [
  {
    id: 1,
    name: "Nickel guitar strings",
    price: 39,
    category: "guitar",
    icon: "🎸",
    image: "assets/products/strings.svg",
    imageAlt: "A packet of nickel guitar strings beside neatly coiled silver strings",
    previousPrice: 49,
  },
  {
    id: 2,
    name: "Picks, 12 pack",
    price: 15,
    category: "guitar",
    icon: "🔺",
    image: "assets/products/picks.svg",
    imageAlt: "Three rounded triangular guitar picks in burnt orange, cream and dark teal",
  },
  {
    id: 3,
    name: "Trigger capo",
    price: 49,
    category: "guitar",
    icon: "🗜️",
    image: "assets/products/capo.svg",
    imageAlt: "A black spring trigger capo with silver hinge and padded jaws",
  },
  {
    id: 4,
    name: "Instrument cable, 3 m",
    price: 59,
    category: "studio",
    icon: "🔌",
    image: "assets/products/cable.svg",
    imageAlt: "A coiled black instrument cable with two silver quarter-inch jack plugs",
  },
  {
    id: 5,
    name: "Closed-back headphones",
    price: 349,
    category: "studio",
    icon: "🎧",
    image: "assets/products/headphones.svg",
    imageAlt: "Closed-back studio headphones with padded headband and two copper-trimmed ear cups",
    previousPrice: 399,
  },
  {
    id: 6,
    name: "Pop filter",
    price: 45,
    category: "studio",
    icon: "🎙️",
    image: "assets/products/pop-filter.svg",
    imageAlt: "A round black microphone pop filter with a mesh screen and curved mounting arm",
  },
  {
    id: 7,
    name: "Digital metronome",
    price: 79,
    category: "practice",
    icon: "⏱️",
    image: "assets/products/metronome.svg",
    imageAlt: "A compact digital metronome showing 76 beats per minute with tempo controls",
  },
  {
    id: 8,
    name: "Folding music stand",
    price: 89,
    category: "practice",
    icon: "📖",
    image: "assets/products/music-stand.svg",
    imageAlt: "A black folding music stand with a wide sheet-music rest and three stable legs",
  },
  {
    id: 9,
    name: "Woven guitar strap",
    price: 29,
    category: "guitar",
    icon: "🎸",
    image: "assets/products/strap.svg",
    imageAlt: "A rust-colored woven guitar strap with leather ends and a brass adjustment buckle",
  },
  {
    id: 10,
    name: "Clip-on tuner",
    price: 69,
    category: "guitar",
    icon: "🎵",
    image: "assets/products/tuner.svg",
    imageAlt: "A clip-on instrument tuner with a green display reading A 440 and a padded clamp",
  },
  {
    id: 11,
    name: "Foam microphone windscreen",
    price: 19,
    category: "studio",
    icon: "🎙️",
    image: "assets/products/windscreen.svg",
    imageAlt: "A charcoal foam microphone windscreen with a rounded top and open lower sleeve",
  },
  {
    id: 12,
    name: "Microphone stand",
    price: 119,
    category: "studio",
    icon: "🎙️",
    image: "assets/products/mic-stand.svg",
    imageAlt: "A black tripod microphone stand with an adjustable boom and microphone clip",
  },
  {
    id: 13,
    name: "Microfiber polishing cloth",
    price: 12,
    category: "practice",
    icon: "🧵",
    image: "assets/products/cloth.svg",
    imageAlt: "A folded mustard-yellow microfiber polishing cloth with stitched edges",
  },
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
      <div class="product-image">
        <img src="${product.image}" alt="${product.imageAlt}" width="512" height="320" />
        ${product.previousPrice ? '<span class="sale-label">Sale</span>' : ""}
      </div>
      <h3>${product.name}</h3>
      <p class="tag">${product.category}</p>
      <p class="price">
        ${product.previousPrice ? `<span class="previous-price">Was <s>${money.format(product.previousPrice)}</s></span>` : ""}
        <span class="current-price">${money.format(product.price)}</span>
      </p>
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

const footerYear = document.getElementById("footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();
