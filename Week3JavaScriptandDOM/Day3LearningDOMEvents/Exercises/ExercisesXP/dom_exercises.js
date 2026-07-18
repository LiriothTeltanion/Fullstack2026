// Exercises XP — DOM, Events & Forms
// Short & simple code with English comments.

// ---------------
// Exercise 1
// ---------------
(() => {
  const article = document.querySelector("#ex1 article");

  // Retrieve the h1 and log it
  const h1 = article.querySelector("h1");
  console.log("Exercise 1 — h1:", h1);

  // Remove the last paragraph in the <article>
  const lastP = article.querySelector("p:last-of-type");
  if (lastP) lastP.remove();

  // Click h2 -> background red
  const h2 = article.querySelector("h2");
  h2.addEventListener("click", () => {
    h2.style.backgroundColor = "red";
  });

  // Click h3 -> hide it
  const h3 = article.querySelector("h3");
  h3.addEventListener("click", () => {
    h3.style.display = "none";
  });

  // Button -> make all paragraphs bold
  const boldBtn = document.getElementById("boldBtn");
  boldBtn.addEventListener("click", () => {
    article.querySelectorAll("p").forEach(p => (p.style.fontWeight = "700"));
  });

  // BONUS: hover h1 -> random font size 0..100 px, reset on leave
  h1.addEventListener("mouseenter", () => {
    const px = Math.floor(Math.random() * 101); // 0..100
    h1.style.fontSize = px + "px";
  });
  h1.addEventListener("mouseleave", () => {
    h1.style.fontSize = ""; // reset to default
  });

  // BONUS: hover on 2nd paragraph -> fade out (CSS animation)
  const p2 = document.getElementById("ex1p2");
  if (p2) {
    p2.addEventListener("mouseenter", () => p2.classList.add("fade"));
    // remove class after animation so it can be triggered again
    p2.addEventListener("animationend", () => p2.classList.remove("fade"));
  }
})();

// ---------------
// Exercise 2
// ---------------
(() => {
  const form = document.getElementById("nameForm");
  const out = document.querySelector("#ex2 .usersAnswer");
  const inputF = document.getElementById("fname");
  const inputL = document.getElementById("lname");

  // Retrieve the form and inputs (by id & by name), then log them
  console.log("Exercise 2 — form:", form);
  console.log("Exercise 2 — inputs by id:", inputF, inputL);
  console.log(
    "Exercise 2 — inputs by name:",
    form.querySelector('[name="firstname"]'),
    form.querySelector('[name="lastname"]')
  );

  form.addEventListener("submit", e => {
    e.preventDefault(); // prevent page reload

    const first = inputF.value.trim();
    const last = inputL.value.trim();
    if (!first || !last) {
      alert("Please fill both first name and last name.");
      return;
    }
    // Create and append <li> per value
    const li1 = document.createElement("li");
    li1.textContent = first;
    const li2 = document.createElement("li");
    li2.textContent = last;
    out.appendChild(li1);
    out.appendChild(li2);

    // Optional: clear inputs
    inputF.value = "";
    inputL.value = "";
  });
})();

// ---------------
// Exercise 3
// ---------------
(() => {
  // Global-like variable (module scope) to hold the <strong> elements
  let allBoldItems = [];

  function getBoldItems() {
    // Collect all <strong> inside the paragraph
    allBoldItems = Array.from(document.querySelectorAll("#boldPara strong"));
  }

  function highlight() {
    // Make all bold text blue
    allBoldItems.forEach(el => (el.style.color = "dodgerblue"));
  }

  function returnItemsToDefault() {
    // Reset color back to black
    allBoldItems.forEach(el => (el.style.color = "black"));
  }

  // Init and attach events
  getBoldItems();
  const para = document.getElementById("boldPara");
  para.addEventListener("mouseenter", highlight);
  para.addEventListener("mouseleave", returnItemsToDefault);
})();

// ---------------
// Exercise 4
// ---------------
(() => {
  const form = document.getElementById("MyForm");
  const radiusInput = document.getElementById("radius");
  const volumeInput = document.getElementById("volume");

  form.addEventListener("submit", e => {
    e.preventDefault(); // don't submit
    const r = parseFloat(radiusInput.value);
    if (isNaN(r) || r < 0) {
      alert("Please enter a valid non-negative number for radius.");
      return;
    }
    // Volume of a sphere: (4/3) * π * r^3
    const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
    volumeInput.value = vol.toFixed(4); // keep it readable
  });
})();
