document.getElementById("account-demo").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("account-status").textContent =
    "The form is valid. This local layout demo does not create or authenticate accounts.";
});
