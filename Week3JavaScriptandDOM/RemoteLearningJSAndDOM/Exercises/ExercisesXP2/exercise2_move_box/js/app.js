// Exercises XP 2 — Exercise 2: Move the Box
let moveInterval = null;

function myMove() {
  const box = document.getElementById("animate");
  const container = document.getElementById("container");

  // Clear any existing animation
  if (moveInterval) {
    clearInterval(moveInterval);
    moveInterval = null;
  }

  // Current left position (px)
  let pos = parseInt(getComputedStyle(box).left, 10) || 0;
  const max = container.clientWidth - box.clientWidth; // 400 - 50 = 350

  // Already at the edge: go back to the left and slide again
  if (pos >= max) {
    pos = 0;
    box.style.left = "0px";
  }

  moveInterval = setInterval(() => {
    if (pos >= max) {
      clearInterval(moveInterval);
      moveInterval = null;
    } else {
      pos += 1; // 1px per millisecond
      box.style.left = pos + "px";
    }
  }, 1);
}
