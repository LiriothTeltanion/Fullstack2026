import { useState } from "react";
import RecipeCard from "./components/RecipeCard";
import RecipeForm from "./components/RecipeForm";
import { useRecipes } from "./hooks/useRecipes";
import { matchesSearch } from "./models/recipe";

export default function App() {
  const { recipes, addRecipe, toggleFavorite, deleteRecipe } = useRecipes();
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const visible = recipes.filter(
    recipe => matchesSearch(recipe, search) && (!favoritesOnly || recipe.favorite)
  );

  return (
    <main>
      <h1>My recipe book</h1>
      <RecipeForm onSave={addRecipe} />
      <section className="card row">
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search by title or ingredient"
          aria-label="Search"
        />
        <label>
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={event => setFavoritesOnly(event.target.checked)}
          />{" "}
          Favorites only
        </label>
        <span className="muted">
          {visible.length} of {recipes.length}
        </span>
      </section>
      {visible.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteRecipe}
        />
      ))}
    </main>
  );
}
