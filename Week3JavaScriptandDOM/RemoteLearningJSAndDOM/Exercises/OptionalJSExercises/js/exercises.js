// Optional JS exercises: six small string and array functions.
// They don't touch the page, so app.js (browser) and demo.js (Node) can both use them.

// 1. Reverse a string without using .reverse()
export function reverseString(text) {
  let reversed = "";
  for (let i = text.length - 1; i >= 0; i--) {
    reversed += text[i];
  }
  return reversed;
}

// 2. Count the vowels in a string
export function countVowels(text) {
  let count = 0;
  for (const char of text.toLowerCase()) {
    if ("aeiou".includes(char)) count++;
  }
  return count;
}

// 3. Capitalize the first letter of every word
export function capitalizeWords(text) {
  return text
    .split(" ")
    .map(word => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(" ");
}

// 4. Find the longest word (the first one wins a tie)
export function longestWord(text) {
  const words = text.split(/\s+/).filter(word => word !== "");
  let longest = "";
  for (const word of words) {
    if (word.length > longest.length) longest = word;
  }
  return longest;
}

// 5. Is it a palindrome? Spaces, punctuation and case are ignored
export function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned !== "" && cleaned === reverseString(cleaned);
}

// 6. Split the words into groups of a given size
export function chunkWords(text, size) {
  const words = text.split(/\s+/).filter(word => word !== "");
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size));
  }
  return chunks;
}
