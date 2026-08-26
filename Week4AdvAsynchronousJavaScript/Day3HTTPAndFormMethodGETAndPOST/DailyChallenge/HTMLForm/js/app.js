// Daily Challenge — HTML Form
// On Send, read the inputs and append the JSON string to the DOM.
// Emojis are allowed (no hearts). Comments in English.

const form = document.getElementById("userForm");
const log = document.getElementById("log");
const clearBtn = document.getElementById("clear");

// Small helper to create elements
function el(tag, text, className) {
  const n = document.createElement(tag);
  if (text != null) n.textContent = text;
  if (className) n.className = className;
  return n;
}

// Append one JSON entry (string + pretty-print)
function appendJsonEntry(obj) {
  const li = document.createElement("li");

  const stamp = new Date().toLocaleTimeString();
  li.appendChild(el("div", "Submitted at " + stamp, "timestamp"));

  // Requirement: append JSON string
  const jsonStr = JSON.stringify(obj);
  const pre = document.createElement("pre");
  pre.textContent = jsonStr;
  li.appendChild(pre);

  // Bonus: pretty JSON for readability
  const pretty = document.createElement("pre");
  pretty.textContent = JSON.stringify(obj, null, 2);
  pretty.setAttribute("aria-label", "Pretty JSON");
  li.appendChild(pretty);

  log.appendChild(li);
}

// Handle submit: prevent navigation, collect values, append JSON string
form.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = Object.fromEntries(data.entries());
  const payload = {
    name: obj.name ?? "",
    lastname: obj.lastname ?? "",
  };
  appendJsonEntry(payload);
});

// Clear output list
clearBtn.addEventListener("click", () => {
  log.innerHTML = "";
});
