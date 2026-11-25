// Runs every exercise once in the terminal: node js/demo.js
import {
  reverseString,
  countVowels,
  capitalizeWords,
  longestWord,
  isPalindrome,
  chunkWords,
} from "./exercises.js";

const sentence = "the quick brown fox jumps over the lazy dog";

console.log("1. reverseString:", reverseString("JavaScript"));
console.log("2. countVowels:", countVowels(sentence));
console.log("3. capitalizeWords:", capitalizeWords(sentence));
console.log("4. longestWord:", longestWord(sentence));
console.log("5. isPalindrome:", isPalindrome("Never odd or even"), isPalindrome("Hello"));
console.log("6. chunkWords:", chunkWords(sentence, 4));
