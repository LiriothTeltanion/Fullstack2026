import { validateGreeting } from "./greeting-validation.js";

const form = document.getElementById("greeting-form");
const output = document.getElementById("greeting");
const errorMessage = document.getElementById("error");
const submit = form.querySelector('button[type="submit"]');
let requestVersion = 0;
let controller;

function setBusy(busy) {
  submit.disabled = busy;
  submit.textContent = busy ? "Making your greeting…" : "Make my greeting";
  form.setAttribute("aria-busy", String(busy));
}

// Editing or resetting invalidates an in-flight reply, rather than showing stale input.
function clearResult() {
  requestVersion += 1;
  controller?.abort();
  output.textContent = "";
  errorMessage.textContent = "";
  for (const input of form.querySelectorAll("input")) {
    input.setCustomValidity("");
    input.removeAttribute("aria-invalid");
  }
  setBusy(false);
}

form.addEventListener("input", clearResult);
form.addEventListener("reset", clearResult);
form.addEventListener(
  "invalid",
  event => {
    event.target.setAttribute("aria-invalid", "true");
    errorMessage.textContent =
      event.target.name === "emoji"
        ? "Choose a greeting emoji."
        : "Enter your name before making a greeting.";
  },
  true
);

form.addEventListener("submit", async event => {
  event.preventDefault();
  clearResult();
  const result = validateGreeting({
    name: form.elements.name.value,
    emoji: form.elements.emoji.value,
  });
  if (!result.valid) {
    errorMessage.textContent = Object.values(result.fields).join(" ");
    if (result.fields.name) {
      form.elements.name.setCustomValidity(result.fields.name);
      form.elements.name.setAttribute("aria-invalid", "true");
      form.elements.name.reportValidity();
      errorMessage.textContent = result.fields.name;
    }
    return;
  }

  const version = requestVersion;
  controller = new AbortController();
  setBusy(true);
  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.value),
      signal: controller.signal,
    });
    const data = await response.json();
    if (version !== requestVersion) return;
    if (!response.ok || typeof data.greeting !== "string") {
      throw new Error(data.error || "Could not make a greeting. Please try again.");
    }
    // Never interpret a name or server reply as HTML.
    output.textContent = data.greeting;
  } catch (error) {
    if (version !== requestVersion || error.name === "AbortError") return;
    errorMessage.textContent =
      error instanceof TypeError ? "Could not reach the server. Please try again." : error.message;
  } finally {
    if (version === requestVersion) setBusy(false);
  }
});
