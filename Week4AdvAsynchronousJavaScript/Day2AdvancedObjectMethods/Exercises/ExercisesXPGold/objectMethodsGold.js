// Exercises XP Gold: advanced object methods
// Run with: node objectMethodsGold.js

// Exercise 1: Object.entries() to build a query string
const filters = { genre: "rock", year: 2024, sort: "popular" };
const queryString = Object.entries(filters)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join("&");
console.log("1. Query string:", `?${queryString}`);

// Exercise 2: Object.fromEntries() to swap keys and values
const colorCodes = { red: "#ff0000", green: "#00ff00", blue: "#0000ff" };
const codesToColors = Object.fromEntries(
  Object.entries(colorCodes).map(([name, hex]) => [hex, name])
);
console.log("2. Inverted:", codesToColors);

// Exercise 3: spread copies only the first level; structuredClone() copies everything
const original = { name: "Lirioth", skills: ["guitar", "piano"] };
const shallow = { ...original };
const deep = structuredClone(original);
shallow.skills.push("drums");
console.log("3. Original after changing the shallow copy:", original.skills);
console.log("   Deep copy did not change:", deep.skills);

// Exercise 4: Object.freeze() stops changes (silently outside strict mode, with an error inside)
const settings = Object.freeze({ theme: "dark", volume: 7 });
try {
  settings.volume = 11;
} catch (error) {
  console.log("4. Frozen object:", error.constructor.name);
}
console.log("   Volume is still", settings.volume, "| isFrozen:", Object.isFrozen(settings));

// Exercise 5: merge user options over defaults with spread
const defaults = { language: "en", notifications: true, fontSize: 16 };
const userOptions = { fontSize: 18, language: "es" };
const finalOptions = { ...defaults, ...userOptions };
console.log("5. Merged options:", finalOptions);

// Exercise 6: count the type of every value with Object.values() and reduce()
const profile = { name: "Dana", age: 27, student: true, city: "Haifa", courses: 3 };
const typeCount = Object.values(profile).reduce((counts, value) => {
  const type = typeof value;
  counts[type] = (counts[type] || 0) + 1;
  return counts;
}, {});
console.log("6. Value types:", typeCount);
