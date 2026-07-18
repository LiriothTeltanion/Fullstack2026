// Daily Challenges — Promises & Morse
// Short & simple, with English comments. Use the console to see outputs.

// ---------------------------
// 1st Challenge: Promises
// ---------------------------
// makeAllCaps: if all items are strings, resolve with UPPERCASED array; else reject.
const makeAllCaps = arr =>
  new Promise((resolve, reject) => {
    const allStrings = Array.isArray(arr) && arr.every(x => typeof x === "string");
    if (!allStrings) return reject("All items must be strings.");
    resolve(arr.map(w => w.toUpperCase()));
  });

// sortWords: if array length > 4, resolve with sorted array; else reject.
const sortWords = arr =>
  new Promise((resolve, reject) => {
    if (!Array.isArray(arr)) return reject("Expected an array.");
    if (arr.length > 4)
      resolve([...arr].sort()); // copy, then sort
    else reject("Array must have more than 4 items.");
  });

// Demo buttons for challenge 1
const out1 = document.getElementById("out1");
const log1 = msg => {
  console.log(msg);
  out1.textContent = typeof msg === "string" ? msg : JSON.stringify(msg);
};

document.getElementById("t1a").addEventListener("click", () => {
  // should REJECT: contains a number
  makeAllCaps([1, "pear", "banana"])
    .then(arr => sortWords(arr))
    .then(result => log1(result))
    .catch(error => log1(error));
});

document.getElementById("t1b").addEventListener("click", () => {
  // should REJECT: length <= 4 after uppercase step
  makeAllCaps(["apple", "pear", "banana"])
    .then(arr => sortWords(arr))
    .then(result => log1(result))
    .catch(error => log1(error));
});

document.getElementById("t1c").addEventListener("click", () => {
  // should RESOLVE and print sorted uppercased array
  makeAllCaps(["apple", "pear", "banana", "melon", "kiwi"])
    .then(arr => sortWords(arr))
    .then(result => log1(result)) // ["APPLE","BANANA","KIWI","MELON","PEAR"]
    .catch(error => log1(error));
});

// ---------------------------
/* 2nd Challenge: Morse Translator
   Functions (first two return Promises):
   - toJs(): parse JSON string to object (reject if empty)
   - toMorse(morseJS): prompt for input (or read from #textInput), validate, resolve array of morse codes
   - joinWords(morseArr): join with new lines, display on the page
*/
// Provided JSON string
const morse = `{
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "a": ".-",
  "b": "-...",
  "c": "-.-.",
  "d": "-..",
  "e": ".",
  "f": "..-.",
  "g": "--.",
  "h": "....",
  "i": "..",
  "j": ".---",
  "k": "-.-",
  "l": ".-..",
  "m": "--",
  "n": "-.",
  "o": "---",
  "p": ".--.",
  "q": "--.-",
  "r": ".-.",
  "s": "...",
  "t": "-",
  "u": "..-",
  "v": "...-",
  "w": ".--",
  "x": "-..-",
  "y": "-.--",
  "z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-",
  " ": "/"  // allow spaces between words → slash for readability
}`;

// 1) Convert JSON string to JS object
const toJs = () =>
  new Promise((resolve, reject) => {
    try {
      const obj = JSON.parse(morse);
      if (obj && Object.keys(obj).length > 0) resolve(obj);
      else reject("Morse mapping is empty.");
    } catch (e) {
      reject("Invalid Morse JSON.");
    }
  });

// 2) Ask user for text, validate against morse map, return array of codes
const toMorse = morseJS =>
  new Promise((resolve, reject) => {
    const inputEl = document.getElementById("textInput");
    let txt = (inputEl?.value || "").trim();
    if (!txt) {
      // fall back to prompt if input box is empty
      txt = (prompt("Enter a word or sentence to translate to Morse:") || "").trim();
    }
    if (!txt) return reject("No input provided.");

    const codes = [];
    for (const ch of txt.toLowerCase()) {
      if (!(ch in morseJS)) {
        return reject(`Unsupported character: "${ch}"`);
      }
      codes.push(morseJS[ch]);
    }
    resolve(codes);
  });

// 3) Join with line breaks and display on the page
const joinWords = morseArr => {
  const out = document.getElementById("morseOut");
  out.textContent = morseArr.join("\\n");
};

// Hook the Translate button to the chained flow
document.getElementById("btnTranslate").addEventListener("click", () => {
  document.getElementById("morseOut").textContent = "Translating…";
  toJs()
    .then(obj => toMorse(obj))
    .then(arr => joinWords(arr))
    .catch(err => {
      console.error(err);
      document.getElementById("morseOut").textContent = String(err);
    });
});

// Export for Node tests (optional)
if (typeof module !== "undefined") {
  module.exports = { makeAllCaps, sortWords, toJs, toMorse, joinWords };
}
