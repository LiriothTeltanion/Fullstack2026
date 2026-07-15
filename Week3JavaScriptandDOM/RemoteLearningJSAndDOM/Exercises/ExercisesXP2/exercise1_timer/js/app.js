// Exercises XP 2 — Exercise 1: Timer
// Part I: after 2s, alert "Hello World"
setTimeout(() => {
  alert("Hello World");
}, 2000);

// Helpers
const container = document.getElementById("container");
const clearBtn = document.getElementById("clear");

function addParagraph(text) {
  const p = document.createElement("p");
  p.textContent = text;
  container.appendChild(p);
}

// Part II: after 2s, add <p>Hello World</p> to #container
setTimeout(() => {
  addParagraph("Hello World");
}, 2000);

// Part III: every 2s add a paragraph; stop via button OR after 5 paragraphs
let intervalId = setInterval(() => {
  addParagraph("Hello World");
  const count = container.querySelectorAll("p").length;
  if (count >= 5) {
    clearInterval(intervalId);
    intervalId = null;
  }
}, 2000);

clearBtn.addEventListener("click", () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
