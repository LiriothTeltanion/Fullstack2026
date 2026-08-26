// Exercises XP Gold — DOM & Forms (All UI generated via JS)

const root = document.getElementById("root");

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.substring(2), v);
    else node.setAttribute(k, v);
  });
  for (const c of children)
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

// Exercise 1 — Music select
(function () {
  const block = el(
    "section",
    { class: "block" },
    el("h2", { text: "Exercise 1: Select a kind of Music 🎵" })
  );
  const select = el(
    "select",
    { id: "genres" },
    el("option", { value: "rock", text: "Rock" }),
    el("option", { value: "blues", text: "Blues", selected: "" })
  );
  const output = el("p", { class: "muted" }, "Selected: ", el("strong", { id: "selectedGenre" }));
  // Add Classic and select it by default
  select.appendChild(el("option", { value: "classic", text: "Classic", selected: "" }));
  function sync() {
    document.getElementById("selectedGenre").textContent = select.value;
  }
  select.addEventListener("change", sync);
  sync();
  block.appendChild(
    el("div", { class: "row" }, el("label", { for: "genres", text: "Genres:" }), select)
  );
  block.appendChild(output);
  root.appendChild(block);
})();

// Exercise 2 — Delete colors
(function () {
  const block = el(
    "section",
    { class: "block" },
    el("h2", { text: "Exercise 2: Delete colors 🎨" })
  );
  const colorSelect = el(
    "select",
    { id: "colorSelect" },
    el("option", { text: "Red" }),
    el("option", { text: "Green" }),
    el("option", { text: "White" }),
    el("option", { text: "Black" })
  );
  const button = el("input", { type: "button", value: "Select and Remove" });
  const info = el("p", { class: "muted", text: "Choose a color, then click the button." });

  window.removecolor = function removecolor() {
    const idx = colorSelect.selectedIndex;
    if (idx >= 0) {
      const removed = colorSelect.options[idx].textContent;
      colorSelect.remove(idx);
      info.textContent = colorSelect.options.length
        ? `Removed: ${removed} ✅`
        : "List is now empty.";
    }
  };

  button.addEventListener("click", () => window.removecolor());

  const form = el("form", {}, el("div", { class: "row" }, colorSelect, button));
  block.appendChild(form);
  block.appendChild(info);
  root.appendChild(block);
})();

// Exercise 3 — Shopping list
(function () {
  const block = el(
    "section",
    { class: "block" },
    el("h2", { text: "Exercise 3: Create a shopping list 🛒" })
  );
  let shoppingList = [];
  const input = el("input", { type: "text", placeholder: "What do you need to buy?" });
  const addBtn = el("button", { type: "button", text: "AddItem" });
  const clearBtn = el("button", { type: "button", text: "ClearAll" });
  const list = el("ul");
  const status = el("p", { class: "muted", text: "List is empty." });

  function render() {
    list.innerHTML = "";
    for (const item of shoppingList) list.appendChild(el("li", {}, item));
    status.textContent = shoppingList.length ? `Items: ${shoppingList.length}` : "List is empty.";
  }

  window.addItem = function addItem() {
    const val = input.value.trim();
    if (!val) return;
    shoppingList.push(val);
    input.value = "";
    render();
  };

  window.clearAll = function clearAll() {
    shoppingList = [];
    render();
  };

  addBtn.addEventListener("click", window.addItem);
  clearBtn.addEventListener("click", window.clearAll);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") window.addItem();
  });

  block.appendChild(el("div", { class: "row" }, input, addBtn, clearBtn));
  block.appendChild(status);
  block.appendChild(list);
  root.appendChild(block);
  render();
})();
