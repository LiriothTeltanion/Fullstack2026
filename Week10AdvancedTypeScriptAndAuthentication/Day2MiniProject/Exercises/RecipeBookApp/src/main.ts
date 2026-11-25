import RecipeItem from "./model/RecipeItem";
import RecipeCollection from "./model/RecipeCollection";
import RecipeTemplate from "./templates/RecipeTemplate";
import { matchesSearch, parseIngredients } from "./models/recipe";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("The #root element is missing from index.html");
root.innerHTML = [
  "<main><h1>My recipe book</h1>",
  '<form id="recipeEntryForm" class="card">',
  '<label>Title <input id="recipeTitle" name="title" required maxlength="150"></label>',
  '<label>Ingredients, one per line <textarea id="ingredients" name="ingredients" required></textarea></label>',
  '<label>Instructions <textarea id="instructions" name="instructions" required></textarea></label>',
  '<label>Minutes <input name="minutes" type="number" min="1" value="25" required></label>',
  '<button type="submit">Save recipe</button></form>',
  '<section class="card row">',
  '<input id="search" placeholder="Search by title or ingredient" aria-label="Search">',
  '<label><input id="favorites-only" type="checkbox"> Favorites only</label>',
  '<span id="count" class="muted"></span>',
  '<button id="clearRecipesButton" type="button" class="danger">Clear all recipes</button></section>',
  '<p id="status" role="status"></p>',
  '<section id="recipeContainer" aria-label="Recipes"></section></main>',
].join("");

const collection = new RecipeCollection();
const search = document.querySelector<HTMLInputElement>("#search")!;
const favoritesOnly = document.querySelector<HTMLInputElement>("#favorites-only")!;
const form = document.querySelector<HTMLFormElement>("#recipeEntryForm")!;
const status = document.querySelector<HTMLElement>("#status")!;
const template = new RecipeTemplate(
  document.querySelector<HTMLElement>("#recipeContainer")!,
  id => {
    collection.toggleFavorite(id);
    render();
  },
  id => {
    collection.remove(id);
    render();
  }
);

function render(): void {
  const visible: RecipeItem[] = collection.recipes.filter(
    recipe => matchesSearch(recipe, search.value) && (!favoritesOnly.checked || recipe.favorite)
  );
  template.render(visible);
  document.querySelector("#count")!.textContent =
    visible.length + " of " + collection.recipes.length;
  status.textContent = collection.storageMessage;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const title = String(data.get("title") ?? "").trim();
  const ingredients = parseIngredients(String(data.get("ingredients") ?? ""));
  const instructions = String(data.get("instructions") ?? "").trim();
  const minutes = Number(data.get("minutes"));
  if (!title || !ingredients.length || !instructions || !Number.isFinite(minutes) || minutes < 1) {
    status.textContent = "Enter a title, ingredients, instructions and a positive cooking time.";
    return;
  }
  collection.add({ title, ingredients, instructions, minutes });
  form.reset();
  render();
});
search.addEventListener("input", render);
favoritesOnly.addEventListener("change", render);
document.querySelector("#clearRecipesButton")!.addEventListener("click", () => {
  if (window.confirm("Delete every recipe in this book?")) {
    collection.clear();
    render();
  }
});
render();
