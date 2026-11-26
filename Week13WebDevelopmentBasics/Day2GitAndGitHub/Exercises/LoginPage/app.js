// Small helpers for the login page. Nothing is sent anywhere.
const form = document.getElementById("login-form");
const fields = document.getElementById("demo-fields");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("toggle-password");
const message = document.getElementById("message");

// Show or hide the password text
toggleButton.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleButton.textContent = isHidden ? "Hide" : "Show";
  toggleButton.setAttribute("aria-pressed", String(isHidden));
});

form.addEventListener("submit", event => {
  // The browser already checked "required", "type=email" and "minlength"
  event.preventDefault();
  const email = emailInput.value.trim();
  message.textContent = `Looks good, ${email}. This demo stops here because there is no server.`;
  form.reset();
  passwordInput.type = "password";
  toggleButton.textContent = "Show";
  toggleButton.setAttribute("aria-pressed", "false");
});

// Enable input only after the demo can handle a submission locally.
message.textContent = "";
fields.disabled = false;
