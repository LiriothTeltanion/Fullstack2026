// Connects the six exercise functions to the page.
import {
  reverseString,
  countVowels,
  capitalizeWords,
  longestWord,
  isPalindrome,
  chunkWords,
} from "./exercises.js";

const form = document.getElementById("exercise-form");
const input = document.getElementById("text-input");
const select = document.getElementById("exercise-select");
const output = document.getElementById("output");

// Each option value points to a function that returns the text to show.
const runners = {
  reverse: text => reverseString(text),
  vowels: text => `${countVowels(text)} vowel(s)`,
  capitalize: text => capitalizeWords(text),
  longest: text => longestWord(text) || "(no words)",
  palindrome: text => (isPalindrome(text) ? "Yes, it's a palindrome" : "No, not a palindrome"),
  chunks: text =>
    chunkWords(text, 3)
      .map(group => `[${group.join(", ")}]`)
      .join(" "),
};

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === "") {
    output.textContent = "Type something first.";
    return;
  }
  output.textContent = runners[select.value](text);
});
