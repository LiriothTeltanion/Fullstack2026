// Prices in shekels.
export const products = [
  { id: 1, name: "Wireless mouse", category: "Electronics", price: 89, rating: 4.4, inStock: true },
  {
    id: 2,
    name: "Mechanical keyboard",
    category: "Electronics",
    price: 349,
    rating: 4.7,
    inStock: true,
  },
  { id: 3, name: "USB-C hub", category: "Electronics", price: 159, rating: 4.1, inStock: false },
  {
    id: 4,
    name: "Noise-cancelling headphones",
    category: "Electronics",
    price: 899,
    rating: 4.8,
    inStock: true,
  },
  { id: 5, name: "Running shoes", category: "Sports", price: 420, rating: 4.5, inStock: true },
  { id: 6, name: "Yoga mat", category: "Sports", price: 95, rating: 4.2, inStock: true },
  { id: 7, name: "Water bottle", category: "Sports", price: 49, rating: 4.0, inStock: false },
  { id: 8, name: "Desk lamp", category: "Home", price: 129, rating: 4.3, inStock: true },
  { id: 9, name: "Coffee grinder", category: "Home", price: 239, rating: 4.6, inStock: true },
  { id: 10, name: "Throw blanket", category: "Home", price: 149, rating: 3.9, inStock: true },
  { id: 11, name: "JavaScript book", category: "Books", price: 159, rating: 4.4, inStock: true },
  { id: 12, name: "Sci-fi novel", category: "Books", price: 69, rating: 4.1, inStock: false },
];

export const CATEGORIES = [...new Set(products.map(product => product.category))];
export const MAX_PRICE = Math.max(...products.map(product => product.price));
