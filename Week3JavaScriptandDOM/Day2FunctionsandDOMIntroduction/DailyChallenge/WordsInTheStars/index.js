// ⭐ Daily Challenge: Words in the Stars
// Last Updated: October 7th, 2025
// 🧠 What you'll practice: functions, string/array methods, loops
// 🎯 Goal: Prompt for comma-separated words and print them in a star frame
//
// Example input: Hello, World, in, a, frame
// Example output:
// *********
// * Hello *
// * World *
// * in    *
// * a     *
// * frame *
// *********

/**
 * Build a rectangular star frame around a list of words. ✨
 * Accepts either a comma-separated string or an array of words.
 * - Trims whitespace
 * - Ignores empty entries
 * - Frame width depends on the longest word
 * @param {string|string[]} input
 * @returns {string} framed output (with \n line breaks)
 */
function wordsInTheStars(input) {
  // 🧹 Normalize to an array of non-empty, trimmed strings
  const words = Array.isArray(input)
    ? input.map(w => String(w).trim()).filter(Boolean)
    : String(input)
        .split(",")
        .map(w => w.trim())
        .filter(Boolean);

  if (words.length === 0) {
    return ""; // nothing to print
  }

  // 📏 Longest word length → defines the frame width
  let maxLen = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > maxLen) maxLen = words[i].length;
  }

  const border = "*".repeat(maxLen + 4); // 2 spaces + 2 stars
  const lines = [];
  lines.push(border);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    // 🧱 Pad each word to align columns inside the frame
    const padded = w + " ".repeat(maxLen - w.length);
    lines.push(`* ${padded} *`);
  }
  lines.push(border);
  return lines.join("\n");
}

// 🧪 Small demo helpers
function demo(input) {
  const out = wordsInTheStars(input);
  if (!out) {
    console.log("⚠️ No words were provided.");
  } else {
    console.log(out);
  }
}

// 🖥️ CLI / runtime entry (Node.js or browser console)
if (typeof module !== "undefined" && require.main === module) {
  // Node.js entry
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // Allow passing the comma-separated words as a single arg or multiple args
    const joined = args.join(" ");
    demo(joined);
  } else {
    // Interactive prompt in Node
    const readline = require("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("📝 Enter words separated by commas: ", answer => {
      demo(answer);
      rl.close();
    });
  }
} else {
  // Browser console fallback: expose the function globally
  // Usage: wordsInTheStars('Hello, World, in, a, frame')
  // Then: console.log(wordsInTheStars(...))
  // ✅ No HTML/CSS required
  // @ts-ignore
  window.wordsInTheStars = wordsInTheStars;
}

module.exports = { wordsInTheStars };
