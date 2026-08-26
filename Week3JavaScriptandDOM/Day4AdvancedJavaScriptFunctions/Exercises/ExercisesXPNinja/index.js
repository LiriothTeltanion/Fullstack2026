// Exercises XP Ninja — Advanced Functions
// Daily Challenge: Merge Words (Currying)
// Run: node index.js

// Curried function: keeps collecting words until called with no args.
const mergeWords = first => {
  let acc = typeof first === "string" ? first : "";
  const chain = next => {
    if (next === undefined) {
      return acc;
    }
    // Append with a single space between words
    acc += acc ? " " + next : next;
    return chain;
  };
  return chain;
};

// Exports for reuse
module.exports = { mergeWords };

// --- Demo / quick checks ---
if (require.main === module) {
  console.log(mergeWords("Hello")()); // "Hello"
  console.log(mergeWords("There")("is")("no")("spoon.")()); // "There is no spoon."
  console.log(mergeWords()()); // "" (empty string)
  console.log(mergeWords("one")("two")("three")()); // "one two three"
}
