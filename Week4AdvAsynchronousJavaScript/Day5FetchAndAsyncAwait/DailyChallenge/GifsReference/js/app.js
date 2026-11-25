// Daily Challenge: Gifs (Week 4, Day 5)
// One random GIF per search from the Giphy "random" endpoint, each with its own
// DELETE button, plus a DELETE ALL button for the whole list.

const form = document.getElementById("gif-form");
const input = document.getElementById("category");
const statusLine = document.getElementById("status");
const gifList = document.getElementById("gifs");
const deleteAllButton = document.getElementById("delete-all");

// config.js is optional on purpose: without it the page still loads and
// tells me what is missing instead of crashing
const apiKey = window.GIPHY_CONFIG?.apiKey?.trim() ?? "";

function hasRealKey() {
  return apiKey !== "" && !/^(YOUR|REPLACE|EXAMPLE|PLACEHOLDER)[_-]/i.test(apiKey);
}

function showStatus(message, isError = false) {
  statusLine.textContent = message;
  statusLine.classList.toggle("error", isError);
}

// Ask Giphy for one random GIF with this tag and return its data object
async function fetchRandomGif(category) {
  const url = new URL("https://api.giphy.com/v1/gifs/random");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("tag", category);
  url.searchParams.set("rating", "g");

  const response = await fetch(url);
  // fetch only rejects when there is no network, so a 401 or 429 lands here
  if (!response.ok) {
    throw new Error(`Giphy answered ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json.data;
}

// Build one card: the image and a DELETE button that removes only this card
function renderGif(gif, category) {
  const card = document.createElement("figure");
  card.className = "gif";

  const image = document.createElement("img");
  // The URL lives in the "images" sub-object; fixed_height keeps cards even
  image.src = gif.images.fixed_height.url;
  image.alt = gif.title ? gif.title : `Random GIF for "${category}"`;
  image.loading = "lazy";

  const caption = document.createElement("figcaption");
  caption.textContent = category;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn danger small";
  deleteButton.textContent = "DELETE";
  deleteButton.setAttribute("aria-label", `Delete the ${category} GIF`);
  deleteButton.addEventListener("click", () => {
    card.remove();
    showStatus(`Deleted the ${category} GIF.`);
  });

  card.append(image, caption, deleteButton);
  gifList.prepend(card);
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const category = input.value.trim();

  if (!category) {
    showStatus("Type a category first.", true);
    return;
  }
  if (!hasRealKey()) {
    showStatus(
      "Missing Giphy API key: copy js/config.example.js to js/config.js and add your key.",
      true
    );
    return;
  }

  showStatus(`Looking for a ${category} GIF…`);
  try {
    const gif = await fetchRandomGif(category);
    // With no match the random endpoint answers 200 with an empty data array
    if (!gif || Array.isArray(gif) || !gif.images) {
      showStatus(`No GIF found for "${category}". Try another word.`, true);
      return;
    }
    renderGif(gif, category);
    showStatus(`Added a ${category} GIF.`);
    input.value = "";
  } catch (error) {
    showStatus(`Could not load a GIF: ${error.message}`, true);
  }
});

deleteAllButton.addEventListener("click", () => {
  gifList.replaceChildren();
  showStatus("All GIFs deleted.");
});
