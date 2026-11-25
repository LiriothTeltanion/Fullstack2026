import { useState } from "react";
import type { Recipe } from "../models/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecipeCard({ recipe, onToggleFavorite, onDelete }: RecipeCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article className="card recipe">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3>
          <button
            className="star"
            onClick={() => onToggleFavorite(recipe.id)}
            aria-pressed={recipe.favorite}
            aria-label={recipe.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {recipe.favorite ? "★" : "☆"}
          </button>
          {recipe.title} <span className="muted">· {recipe.minutes} min</span>
        </h3>
        <span className="row">
          <button className="secondary" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "Hide" : "Show"}
          </button>
          <button className="danger" onClick={() => onDelete(recipe.id)}>
            Delete
          </button>
        </span>
      </div>
      {open && (
        <>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <p>{recipe.instructions}</p>
        </>
      )}
    </article>
  );
}
