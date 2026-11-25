// Tooltips and toasts are the only components Bootstrap doesn't start by itself.
/* global bootstrap */

document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
  new bootstrap.Tooltip(element);
});

const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("demoToast"));
document.getElementById("toastButton").addEventListener("click", () => toast.show());
