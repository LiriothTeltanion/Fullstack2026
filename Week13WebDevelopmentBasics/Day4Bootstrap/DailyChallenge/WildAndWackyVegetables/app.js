const form = document.getElementById("search-form");
form.addEventListener("submit", event => {
  event.preventDefault();
  const term = document.getElementById("search").value.trim().toLowerCase();
  let matches = 0;
  document.querySelectorAll("#vegetable-rows tr").forEach(row => {
    row.hidden = !row.textContent.toLowerCase().includes(term);
    if (!row.hidden) matches++;
  });
  document.getElementById("search-status").textContent = matches + " matching vegetables";
});
