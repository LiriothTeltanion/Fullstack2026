// Exercises XP Ninja 2: more array methods
// Run with: node arrayMethodsNinja2.js

const games = [
  { title: "Hollow Knight", genre: "Metroidvania", year: 2017, rating: 9.1 },
  { title: "Celeste", genre: "Platformer", year: 2018, rating: 9.0 },
  { title: "Hades", genre: "Roguelike", year: 2020, rating: 9.3 },
  { title: "Dead Cells", genre: "Roguelike", year: 2018, rating: 8.7 },
  { title: "Ori", genre: "Metroidvania", year: 2015, rating: 8.9 },
];

// Exercise 1: sort by two keys (genre A-Z, then rating high to low).
// toSorted() returns a new array, so `games` keeps its order.
const sorted = games.toSorted((a, b) => a.genre.localeCompare(b.genre) || b.rating - a.rating);
console.log("1. Sorted:");
sorted.forEach(game => console.log(`   ${game.genre.padEnd(13)} ${game.rating} ${game.title}`));
console.log("   Original first title is still:", games[0].title);

// Exercise 2: some() and every()
console.log(
  "2. Any game before 2016?",
  games.some(game => game.year < 2016)
);
console.log(
  "   Every rating above 8.5?",
  games.every(game => game.rating > 8.5)
);

// Exercise 3: find(), findIndex() and findLast()
console.log("3. First roguelike:", games.find(game => game.genre === "Roguelike").title);
console.log(
  "   Index of Celeste:",
  games.findIndex(game => game.title === "Celeste")
);
console.log("   Last game from 2018:", games.findLast(game => game.year === 2018).title);

// Exercise 4: count per genre with reduce(), then turn the object into sorted entries
const perGenre = games.reduce((counts, game) => {
  counts[game.genre] = (counts[game.genre] ?? 0) + 1;
  return counts;
}, {});
const ranking = Object.entries(perGenre).sort(([, a], [, b]) => b - a);
console.log("4. Games per genre:", ranking);

// Exercise 5: Array.from() to build a range, and a matrix transpose with map()
const range = Array.from({ length: 5 }, (_, i) => (i + 1) * 10);
console.log("5. Range:", range);

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
];
const transposed = matrix[0].map((_, col) => matrix.map(row => row[col]));
console.log("   Transposed:", transposed);
