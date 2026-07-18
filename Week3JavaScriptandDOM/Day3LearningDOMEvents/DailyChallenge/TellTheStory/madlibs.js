// Daily Challenge — Mad Libs (short & simple)
// Attach handlers, validate inputs, build a story, and allow shuffling.
// Comments in English for clarity.

const form = document.getElementById("libform");
const storyEl = document.getElementById("story");
const shuffleBtn = document.getElementById("shuffle");
const resetBtn = document.getElementById("reset");

// Three+ tiny template functions. Each receives an object with the words.
const templates = [
  ({ noun, adjective, person, verb, place }) =>
    `${person} ${verb} a ${adjective} ${noun} in ${place}. Everyone cheered!`,
  ({ noun, adjective, person, verb, place }) =>
    `In ${place}, a ${adjective} ${noun} ${verb} while ${person} laughed.`,
  ({ noun, adjective, person, verb, place }) =>
    `${person} found a ${adjective} ${noun} near ${place} and ${verb} all day.`,
  ({ noun, adjective, person, verb, place }) =>
    `They say in ${place}, ${person} can ${verb} with a ${adjective} ${noun}!`,
];

let lastWords = null; // keep the last submitted values
let lastIdx = -1; // remember which template was used last

function readValues() {
  // Get all values and trim them
  const noun = document.getElementById("noun").value.trim();
  const adjective = document.getElementById("adjective").value.trim();
  const person = document.getElementById("person").value.trim();
  const verb = document.getElementById("verb").value.trim();
  const place = document.getElementById("place").value.trim();
  return { noun, adjective, person, verb, place };
}

function validate(values) {
  // Ensure no field is empty; return the first missing key or null
  for (const key of ["noun", "adjective", "person", "verb", "place"]) {
    if (!values[key]) return key;
  }
  return null;
}

function buildStory(words, forceIdx = null) {
  // Pick a random template; avoid repeating the last one if possible
  let idx = forceIdx ?? Math.floor(Math.random() * templates.length);
  if (idx === lastIdx && templates.length > 1) idx = (idx + 1) % templates.length;
  const story = templates[idx](words);
  lastIdx = idx;
  storyEl.textContent = story;
}

form.addEventListener("submit", e => {
  e.preventDefault(); // don't reload the page
  const values = readValues();
  const missing = validate(values);
  if (missing) {
    alert(`Please fill the ${missing}.`);
    document.getElementById(missing).focus();
    return;
  }
  lastWords = values;
  buildStory(lastWords); // create a story
  shuffleBtn.disabled = false; // enable shuffling now that we have words
});

shuffleBtn.addEventListener("click", () => {
  if (!lastWords) return;
  buildStory(lastWords); // generate a different story using same inputs
});

resetBtn.addEventListener("click", () => {
  storyEl.textContent = "";
  shuffleBtn.disabled = true;
  lastWords = null;
  lastIdx = -1;
});
