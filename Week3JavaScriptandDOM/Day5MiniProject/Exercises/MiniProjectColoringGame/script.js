// state 🎯
const grid = document.getElementById("grid");
const picker = document.getElementById("colorPicker");
const sizeSel = document.getElementById("sizeSelect");
const clearBtn = document.getElementById("clearBtn");
let color = picker.value;
let drawing = false;

// build grid (responsive squares) 🎨
function build(size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < size * size; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    fragment.appendChild(cell);
  }
  grid.appendChild(fragment);
}

// paint cell 🖌️
function paint(target) {
  target.style.background = color;
}

// check if element is a grid cell 🔍
function isCell(element) {
  return element instanceof HTMLElement && element.classList.contains("cell");
}

// mouse events 🐭
document.addEventListener("mousedown", () => {
  drawing = true;
});

document.addEventListener("mouseup", () => {
  drawing = false;
});

document.addEventListener("mouseleave", () => {
  drawing = false;
});

// delegate painting events from grid container 🧭
grid.addEventListener("mousedown", event => {
  if (isCell(event.target)) {
    paint(event.target);
  }
});

grid.addEventListener("mouseover", event => {
  if (drawing && isCell(event.target)) {
    paint(event.target);
  }
});

// color change 🌈
picker.addEventListener("input", event => {
  color = event.target.value;
});

document.querySelectorAll(".swatch").forEach(swatch => {
  swatch.onclick = () => {
    color = swatch.dataset.color;
    picker.value = color;
  };
});

// size change 📐
sizeSel.onchange = () => {
  build(parseInt(sizeSel.value, 10));
};

// clear 🧼
clearBtn.onclick = () => {
  grid.querySelectorAll(".cell").forEach(cell => {
    cell.style.background = "";
  });
};

// start 🚀
build(parseInt(sizeSel.value, 10));
