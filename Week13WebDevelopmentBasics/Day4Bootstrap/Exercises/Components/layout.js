// This page demonstrates layout and disclosure controls, never authentication.
const menuButton = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
const dropdownButton = document.getElementById("dropdown-toggle");
const dropdown = document.getElementById("resource-menu");
const header = document.getElementById("site-header");

function setDropdown(open, focusFirst = false) {
  dropdownButton.setAttribute("aria-expanded", String(open));
  dropdown.hidden = !open;
  dropdown.classList.toggle("show", open);
  if (open && focusFirst) dropdown.querySelector("a").focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("show", open);
  if (!open) setDropdown(false);
});

dropdownButton.addEventListener("click", () => {
  setDropdown(dropdownButton.getAttribute("aria-expanded") !== "true");
});
dropdownButton.addEventListener("keydown", event => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setDropdown(true, true);
  }
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !dropdown.hidden) {
    setDropdown(false);
    dropdownButton.focus();
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".resource-dropdown")) setDropdown(false);
});

// Native links remain useful without JavaScript. Selection changes only the
// current-page hint; it does not imitate authentication or call a service.
document.querySelectorAll("#primary-links .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll("#primary-links .nav-link").forEach(item => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  });
});
document.querySelectorAll("#navigation a").forEach(link => {
  link.addEventListener("click", () => {
    setDropdown(false);
    navigation.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-detail]").forEach(button => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.detail);
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  });
});

const form = document.getElementById("demo-form");
function explainDemo(event) {
  event.preventDefault();
  // Deliberately do not read field values, serialize a form, use storage, or
  // perform a request. Clear any pretend values immediately on activation.
  form.reset();
  document.getElementById("demo-status").textContent =
    "Layout demo only. Nothing was sent or saved; both fields have been cleared.";
}
form.addEventListener("submit", explainDemo);
document.getElementById("demo-signin").addEventListener("click", explainDemo);

// A fixed responsive header can grow when its menu opens or text is enlarged.
// Keep the content below its measured height instead of assuming one row.
function reserveHeaderSpace() {
  document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
}
new ResizeObserver(reserveHeaderSpace).observe(header);
reserveHeaderSpace();
