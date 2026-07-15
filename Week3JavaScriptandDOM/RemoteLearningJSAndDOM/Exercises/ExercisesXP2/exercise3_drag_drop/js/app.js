// Exercises XP 2 — Exercise 3: Drag & Drop
const target = document.getElementById("target");
const box = document.getElementById("box");

let dragging = false;
let startX = 0;
let startY = 0;
let boxStartLeft = 0;
let boxStartTop = 0;

// Remember the original location to snap back if not dropped inside target
const original = { left: box.offsetLeft, top: box.offsetTop };

box.addEventListener("pointerdown", (e) => {
  dragging = true;
  box.setPointerCapture(e.pointerId);
  startX = e.clientX;
  startY = e.clientY;
  // current numeric left/top
  boxStartLeft = box.offsetLeft;
  boxStartTop = box.offsetTop;
});

box.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  box.style.left = boxStartLeft + dx + "px";
  box.style.top = boxStartTop + dy + "px";
});

function isInsideTarget(el, tgt) {
  const r1 = el.getBoundingClientRect();
  const r2 = tgt.getBoundingClientRect();
  return (
    r1.left >= r2.left &&
    r1.top >= r2.top &&
    r1.right <= r2.right &&
    r1.bottom <= r2.bottom
  );
}

box.addEventListener("pointerup", (e) => {
  if (!dragging) return;
  dragging = false;
  box.releasePointerCapture(e.pointerId);

  if (isInsideTarget(box, target)) {
    // Place the box centered inside the target
    const tr = target.getBoundingClientRect();
    const br = box.getBoundingClientRect();
    const left = tr.left + tr.width / 2 - br.width / 2 + window.scrollX;
    const top = tr.top + tr.height / 2 - br.height / 2 + window.scrollY;

    // Because #box is absolutely positioned in the page flow,
    // set left/top to that center position relative to the document.
    box.style.left = left + "px";
    box.style.top = top + "px";
  } else {
    // Snap back to original place
    box.style.left = original.left + "px";
    box.style.top = original.top + "px";
  }
});
