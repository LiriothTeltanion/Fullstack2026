import type RecipeItem from "../model/RecipeItem";

/** Uses textContent so recipe text never becomes executable markup. */
export default class RecipeTemplate {
  constructor(
    private readonly container: HTMLElement,
    private readonly onFavorite: (id: string) => void,
    private readonly onDelete: (id: string) => void
  ) {}

  render(recipes: RecipeItem[]): void {
    this.container.replaceChildren();
    if (!recipes.length) {
      const empty = document.createElement("p");
      empty.textContent = "No recipes match. Add a recipe or change the filters.";
      this.container.append(empty);
    }
    for (const recipe of recipes) {
      const article = document.createElement("article");
      article.className = "card";
      const heading = document.createElement("h2");
      heading.textContent = recipe.title;
      const minutes = document.createElement("p");
      minutes.className = "muted";
      minutes.textContent = recipe.minutes + " minutes";
      const favorite = document.createElement("button");
      favorite.type = "button";
      favorite.textContent = recipe.favorite ? "â˜… Favorite" : "â˜† Favorite";
      favorite.setAttribute("aria-pressed", String(recipe.favorite));
      favorite.addEventListener("click", () => this.onFavorite(recipe.id));
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Ingredients and instructions";
      const ingredients = document.createElement("ul");
      for (const ingredient of recipe.ingredients) {
        const line = document.createElement("li");
        line.textContent = ingredient;
        ingredients.append(line);
      }
      const instructions = document.createElement("p");
      instructions.textContent = recipe.instructions;
      details.append(summary, ingredients, instructions);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "danger";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => this.onDelete(recipe.id));
      article.append(heading, minutes, favorite, details, remove);
      this.container.append(article);
    }
  }
}
