function focusFirstInput(section) {
  const el = section.querySelector("input, select, textarea, button");
  if (el) el.focus({ preventScroll: true });
}
function setState(mode) {
  const container = document.querySelector(".auth__container");
  const signIn = document.getElementById("signin");
  const signUp = document.getElementById("signup");
  const btnToSignIn = document.getElementById("toSignIn");
  const btnToSignUp = document.getElementById("toSignUp");
  const isSignIn = mode === "signin";
  container.dataset.state = isSignIn ? "signin" : "signup";
  signIn.setAttribute("aria-hidden", String(!isSignIn));
  signUp.setAttribute("aria-hidden", String(isSignIn));
  btnToSignIn.setAttribute("aria-pressed", String(isSignIn));
  btnToSignUp.setAttribute("aria-pressed", String(!isSignIn));
  const target = isSignIn ? signIn : signUp;
  window.setTimeout(() => focusFirstInput(target), 120);
}
document.getElementById("toSignIn").addEventListener("click", () => setState("signin"));
document.getElementById("toSignUp").addEventListener("click", () => setState("signup"));
function handleDemoSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  alert("Form submitted successfully! (Demo)");
}
document.getElementById("signin-form").addEventListener("submit", handleDemoSubmit);
document.getElementById("signup-form").addEventListener("submit", handleDemoSubmit);
document.addEventListener("keydown", e => {
  if (e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    const container = document.querySelector(".auth__container");
    const next = container.dataset.state === "signup" ? "signin" : "signup";
    setState(next);
  }
});
