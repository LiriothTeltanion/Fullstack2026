// Module: products
// Purpose: Provide a tiny in-memory products catalog for demos (CommonJS).
// Author: Kevin "Lirioth" Cusnir
// Date: 2025-10-19 | TZ: Asia/Jerusalem
// Notes: Comments in ENGLISH; emojis sparingly.

/**
 * @typedef {Object} Product
 * @property {string} name  - Display name.
 * @property {number} price - Price in USD (for demo).
 * @property {string} category - Simple category label.
 */

// 💡 Keep samples simple and culturally neutral.
/** @type {Product[]} */
const products = [
  { name: "Mechanical Keyboard", price: 99, category: "Peripherals" },
  { name: "Gaming Mouse", price: 49, category: "Peripherals" },
  { name: "USB-C Hub", price: 39, category: "Accessories" },
  { name: "27-inch Monitor", price: 229, category: "Displays" },
  { name: "Noise-Canceling Headphones", price: 149, category: "Audio" },
];

// CommonJS export ✅
module.exports = products;
