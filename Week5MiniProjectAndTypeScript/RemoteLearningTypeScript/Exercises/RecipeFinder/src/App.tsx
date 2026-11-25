import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  loadRecipes,
  selectRecipe,
  selectRecipeState,
  selectSelectedRecipe,
  selectVisibleRecipes,
  setQuery,
} from "./recipesSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { items, status, error, query } = useAppSelector(selectRecipeState);
  const visible = useAppSelector(selectVisibleRecipes);
  const selected = useAppSelector(selectSelectedRecipe);
  const [input, setInput] = useState("");
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    void dispatch(loadRecipes());
  }, [dispatch]);
  useEffect(() => {
    if (selected) detailHeading.current?.focus();
  }, [selected]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(setQuery(input.trim()));
  }

  function clearSearch() {
    setInput("");
    dispatch(setQuery(""));
  }

  return (
    <div className="page-shell">
      <header className="masthead">
        <a className="wordmark" href="#top">
          pantry<span>notes</span>
          <span aria-hidden="true"> / </span>
        </a>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div>
            <h1 id="page-title">Recipe Finder</h1>
            <p className="intro">Search ingredients, choose a recipe and see how to prepare it.</p>
          </div>
          <div className="pantry-art" aria-hidden="true">
            <div className="plate">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>

        <section className="search-section" aria-labelledby="search-title">
          <div>
            <h2 id="search-title">Search by ingredients</h2>
          </div>
          <form onSubmit={search}>
            <label htmlFor="ingredients">Ingredients</label>
            <div className="search-controls">
              <input
                id="ingredients"
                type="search"
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Try lemon, chickpeas"
                autoComplete="off"
                aria-describedby="search-help"
              />
              <button type="submit">
                Find recipes <span aria-hidden="true">↗</span>
              </button>
            </div>
            <p className="helper" id="search-help">
              Separate ingredients with spaces or commas. Every term must match an ingredient.
            </p>
          </form>
        </section>

        <section className="recipe-workspace" aria-busy={status === "loading" || status === "idle"}>
          <div className="results" aria-labelledby="recipe-results">
            <div className="section-heading">
              <div>
                <h2 id="recipe-results" tabIndex={-1} ref={resultsHeading}>
                  Recipes
                </h2>
              </div>
              {status === "succeeded" && (
                <span className="count" aria-live="polite">
                  {visible.length} of {items.length} recipes
                </span>
              )}
            </div>
            {(status === "idle" || status === "loading") && (
              <div className="state-box" role="status">
                <span className="loading-line" />
                Loading the local recipe collection…
              </div>
            )}
            {status === "failed" && (
              <div className="state-box error-box">
                <p role="alert">{error}</p>
                <button type="button" onClick={() => void dispatch(loadRecipes())}>
                  Try again
                </button>
              </div>
            )}
            {status === "succeeded" && visible.length === 0 && (
              <div className="state-box" role="status">
                <h3>
                  {items.length
                    ? "No recipes match those ingredients."
                    : "The recipe shelf is empty."}
                </h3>
                <p>
                  {items.length
                    ? "Try fewer ingredients or clear your search to explore the collection."
                    : "Add a valid recipe to recipes.json and reload the page."}
                </p>
                {query && (
                  <button type="button" onClick={clearSearch}>
                    Clear search
                  </button>
                )}
              </div>
            )}
            {status === "succeeded" && visible.length > 0 && (
              <>
                {query && (
                  <p className="query-summary">
                    Ingredients: <strong>{query}</strong>{" "}
                    <button className="text-button" type="button" onClick={clearSearch}>
                      Clear search
                    </button>
                  </p>
                )}
                <ul className="recipe-list">
                  {visible.map(recipe => (
                    <li key={recipe.id}>
                      <button
                        className={
                          selected?.id === recipe.id ? "recipe-card selected" : "recipe-card"
                        }
                        type="button"
                        onClick={() => dispatch(selectRecipe(recipe.id))}
                        aria-pressed={selected?.id === recipe.id}
                      >
                        <span className="card-copy">
                          <strong>{recipe.title}</strong>
                          <span>{recipe.description}</span>
                          <small>
                            {recipe.ingredients
                              .slice(0, 3)
                              .map(ingredient => ingredient.name)
                              .join(" · ")}
                          </small>
                        </span>
                        <span className="recipe-time">
                          {recipe.minutes}
                          <small>min</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside className="detail-panel" aria-label="Recipe details">
            {selected ? (
              <article>
                <div className="detail-top">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      dispatch(selectRecipe(null));
                      resultsHeading.current?.focus();
                    }}
                  >
                    Back to recipes
                  </button>
                </div>
                <h2 ref={detailHeading} tabIndex={-1}>
                  {selected.title}
                </h2>
                <p>{selected.description}</p>
                <dl className="facts">
                  <div>
                    <dt>Total time</dt>
                    <dd>{selected.minutes} minutes</dd>
                  </div>
                  <div>
                    <dt>Serves</dt>
                    <dd>{selected.servings}</dd>
                  </div>
                </dl>
                <h3>Ingredients</h3>
                <ul className="ingredient-list">
                  {selected.ingredients.map(ingredient => (
                    <li key={ingredient.name}>
                      <span>{ingredient.name}</span>
                      <strong>{ingredient.quantity}</strong>
                    </li>
                  ))}
                </ul>
                <h3>Preparation</h3>
                <ol className="steps">
                  {selected.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </article>
            ) : (
              <div className="detail-placeholder">
                <span className="placeholder-mark" aria-hidden="true">
                  ✳
                </span>
                <h2>Select a recipe</h2>
                <p>Choose a recipe to see its ingredients, preparation and total time.</p>
              </div>
            )}
          </aside>
        </section>
      </main>
      <footer>
        <span>Pantry Notes / Recipe Finder</span>
        <span>Local recipe collection</span>
      </footer>
    </div>
  );
}
