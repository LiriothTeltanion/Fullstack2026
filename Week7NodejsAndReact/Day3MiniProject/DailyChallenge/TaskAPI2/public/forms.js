const form = document.querySelector("[data-user-form]");
const button = form.querySelector("button");
const result = document.getElementById("result");
const inputs = [...form.querySelectorAll("input")];
let sending = false;

function updateButton() {
  button.disabled = sending || inputs.some(input => !input.value.trim() || !input.validity.valid);
}

form.addEventListener("input", updateButton);
window.addEventListener("pageshow", updateButton);
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  sending = true;
  updateButton();
  result.textContent = "Sending…";
  try {
    const response = await fetch(form.getAttribute("action"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    result.textContent = body.message || `Registered ${body.user.username}. You can now log in.`;
    form.reset();
  } catch (error) {
    result.textContent = error.message;
  } finally {
    sending = false;
    updateButton();
  }
});
updateButton();
