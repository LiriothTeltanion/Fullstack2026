import { useState, type FormEvent } from "react";
import { parseIngredients, type RecipeDraft } from "../models/recipe";

interface RecipeFormProps {
  onSave: (draft: RecipeDraft) => void;
}

export default function RecipeForm({ onSave }: RecipeFormProps) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const list = parseIngredients(ingredients);
    if (!title.trim() || list.length === 0 || !instructions.trim()) {
      setError("A recipe needs a title, at least one ingredient and instructions.");
      return;
    }
    onSave({ title: title.trim(), ingredients: list, instructions: instructions.trim(), minutes });
    setTitle("");
    setIngredients("");
    setInstructions("");
    setMinutes(30);
    setError("");
  };

  return (
    <form className="card recipe-form" onSubmit={handleSubmit}>
      <h2>New recipe</h2>
      <input
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="Title"
        aria-label="Title"
      />
      <textarea
        value={ingredients}
        onChange={event => setIngredients(event.target.value)}
        placeholder="Ingredients, one per line"
        aria-label="Ingredients"
      />
      <textarea
        value={instructions}
        onChange={event => setInstructions(event.target.value)}
        placeholder="Instructions"
        aria-label="Instructions"
      />
      <label className="row">
        Minutes:
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={event => setMinutes(Math.max(1, Number(event.target.value)))}
          style={{ width: "6rem" }}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Save recipe</button>
    </form>
  );
}
