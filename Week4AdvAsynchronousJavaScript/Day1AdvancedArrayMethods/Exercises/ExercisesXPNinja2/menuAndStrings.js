export function reviewMenu(menu, vegetarianWords, mainCourse) {
  const hasDessert = menu.some(dish => dish.type === "dessert") ? "Yes" : "No";
  const allStarters = menu.every(dish => dish.type === "starter");
  const withMain = menu.some(dish => dish.type === "main") ? menu : [...menu, mainCourse];
  const dishes = withMain.map(dish => ({
    ...dish,
    vegetarian: vegetarianWords.some(word => dish.name.toLowerCase().includes(word.toLowerCase())),
  }));
  return { hasDessert, allStarters, dishes };
}

export function string_chop(text, size) {
  if (!Number.isSafeInteger(size) || size < 1)
    throw new RangeError("Chunk size must be a positive integer.");
  const characters = Array.from(text);
  const chunks = [];
  for (let i = 0; i < characters.length; i += size) {
    chunks.push(characters.slice(i, i + size).join(""));
  }
  return chunks;
}

export function search_word(text, word) {
  // Tokenize both punctuation-separated and accented words without interpreting the query as a regular expression.
  const words = text.match(/[\p{L}\p{N}_]+/gu) ?? [];
  const total = words.filter(value => value.toLowerCase() === word.toLowerCase()).length;
  return "'" + word + "' was found " + total + " times.";
}

export function reverseArray(values) {
  for (let left = 0, right = values.length - 1; left < right; left++, right--) {
    [values[left], values[right]] = [values[right], values[left]];
  }
  return values;
}

if (import.meta.main) {
  const sample = [
    { type: "starter", name: "Vegetable soup" },
    { type: "dessert", name: "Vanilla custard" },
  ];
  console.log(
    reviewMenu(sample, ["vegetable", "houmous", "eggs", "vanilla", "potatoes"], {
      type: "main",
      name: "Potatoes and herbs",
    })
  );
  console.log(
    string_chop("developers", 2),
    search_word("The quick brown fox", "fox"),
    reverseArray([1, 2, 3, 4, 5])
  );
}
