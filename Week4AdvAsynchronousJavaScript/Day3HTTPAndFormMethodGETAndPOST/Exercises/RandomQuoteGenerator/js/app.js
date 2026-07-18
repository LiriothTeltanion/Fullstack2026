// Random Quote Generator — main logic
// Features:
// - Random non-repeating quote selection
// - Add quotes via form (auto-increment id)
// - Like the current quote
// - Character & word counts for the current quote
// - Filter by author with Previous/Next navigation
// Emojis allowed; no hearts. All comments in English.

/** ------- Data setup ------- */
const quotes = [
  {
    id: 0,
    author: "Marcus Aurelius",
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    likes: 0,
  },
  {
    id: 1,
    author: "Maya Angelou",
    quote: "You will face many defeats in life, but never let yourself be defeated.",
    likes: 0,
  },
  { id: 2, author: "Oscar Wilde", quote: "Be yourself; everyone else is already taken.", likes: 0 },
  { id: 3, author: "Yoda", quote: "Do. Or do not. There is no try.", likes: 0 },
  {
    id: 4,
    author: "Albert Einstein",
    quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    likes: 0,
  },
];
let lastIndex = -1; // remember the last randomly shown index
let currentIndex = 0; // index in quotes[] currently displayed
let filtered = []; // array of indices that match current filter
let filteredPos = 0; // pointer inside filtered[]

/** ------- DOM references ------- */
const quoteTxt = document.getElementById("quoteTxt");
const authorTxt = document.getElementById("authorTxt");
const likeCount = document.getElementById("likeCount");
const metrics = document.getElementById("metrics");
const filterStatus = document.getElementById("filterStatus");

const btnRandom = document.getElementById("btnRandom");
const btnLike = document.getElementById("btnLike");
const btnCharsSpace = document.getElementById("btnCharsSpace");
const btnCharsNoSpace = document.getElementById("btnCharsNoSpace");
const btnWords = document.getElementById("btnWords");

const addForm = document.getElementById("addForm");
const newQuote = document.getElementById("newQuote");
const newAuthor = document.getElementById("newAuthor");

const filterForm = document.getElementById("filterForm");
const filterAuthor = document.getElementById("filterAuthor");
const btnClearFilter = document.getElementById("btnClearFilter");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

/** ------- Helper functions ------- */

// Render quote at quotes[idx]
function render(idx) {
  const q = quotes[idx];
  quoteTxt.textContent = q.quote;
  authorTxt.textContent = `— ${q.author}`;
  likeCount.textContent = q.likes;
  currentIndex = idx;
}

// Get a random index different from lastIndex (ternary to guard small arrays)
function randomIndex() {
  if (quotes.length < 2) return 0;
  let i;
  do {
    i = Math.floor(Math.random() * quotes.length);
  } while (i === lastIndex);
  return i;
}

// Show a fresh random quote (ignores filter; filters are navigated via Prev/Next)
function showRandom() {
  const idx = randomIndex();
  render(idx);
  lastIndex = idx;
  metrics.textContent = "";
}

// Count characters and words of the current quote
function countChars(includeSpaces = true) {
  const s = quotes[currentIndex].quote;
  return includeSpaces ? s.length : s.replace(/\s/g, "").length;
}
function countWords() {
  return quotes[currentIndex].quote.trim().split(/\s+/).filter(Boolean).length;
}

// Update filter UI state
function updateFilterStatus() {
  if (filtered.length === 0) {
    filterStatus.textContent = "No active filter.";
    btnPrev.disabled = true;
    btnNext.disabled = true;
    return;
  }
  const author = quotes[filtered[0]].author;
  filterStatus.textContent = `Filtered by author: ${author} — ${filteredPos + 1} of ${filtered.length}`;
  btnPrev.disabled = filtered.length <= 1;
  btnNext.disabled = filtered.length <= 1;
}

// Navigate inside the filtered list
function showFiltered(pos) {
  if (filtered.length === 0) return;
  filteredPos = (pos + filtered.length) % filtered.length; // wrap around
  render(filtered[filteredPos]);
  metrics.textContent = "";
  updateFilterStatus();
}

/** ------- Event wiring ------- */

// Random button
btnRandom.addEventListener("click", showRandom);

// Like button
btnLike.addEventListener("click", () => {
  quotes[currentIndex].likes += 1;
  likeCount.textContent = quotes[currentIndex].likes;
});

// Metrics buttons
btnCharsSpace.addEventListener("click", () => {
  metrics.textContent = `Characters (with spaces): ${countChars(true)}`;
});
btnCharsNoSpace.addEventListener("click", () => {
  metrics.textContent = `Characters (no spaces): ${countChars(false)}`;
});
btnWords.addEventListener("click", () => {
  metrics.textContent = `Words: ${countWords()}`;
});

// Add new quote
addForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = newQuote.value.trim();
  const author = newAuthor.value.trim();
  if (!text || !author) {
    metrics.textContent = "Please provide both a quote and an author.";
    return;
  }
  // id strategy: next integer after the current max id (robust if deletions are added later)
  const nextId = quotes.length ? Math.max(...quotes.map(q => q.id)) + 1 : 0;
  quotes.push({ id: nextId, author, quote: text, likes: 0 });

  // Reset form and show the new quote
  newQuote.value = "";
  newAuthor.value = "";
  render(quotes.length - 1);
  lastIndex = currentIndex;
  metrics.textContent = "New quote added.";

  // If a filter is active, refresh it
  if (filterAuthor.value.trim()) filterForm.dispatchEvent(new Event("submit"));
});

// Filter by author (case-insensitive contains)
filterForm.addEventListener("submit", e => {
  e.preventDefault();
  const q = filterAuthor.value.trim().toLowerCase();
  filtered = quotes
    .map((qObj, i) => ({ qObj, i }))
    .filter(x => x.qObj.author.toLowerCase().includes(q))
    .map(x => x.i);
  if (filtered.length === 0) {
    filterStatus.textContent = "No quotes match that author.";
    btnPrev.disabled = true;
    btnNext.disabled = true;
    return;
  }
  showFiltered(0);
});

btnClearFilter.addEventListener("click", () => {
  filtered = [];
  filteredPos = 0;
  filterAuthor.value = "";
  updateFilterStatus();
});

btnPrev.addEventListener("click", () => showFiltered(filteredPos - 1));
btnNext.addEventListener("click", () => showFiltered(filteredPos + 1));

/** ------- Initial render ------- */
render(0);
updateFilterStatus();
metrics.textContent = "";
