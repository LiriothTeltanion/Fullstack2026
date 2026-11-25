import { useState } from "react";
import DataFetcher from "./components/DataFetcher";
import type { Post, RecipeResponse, Todo, User } from "./types";

const API = "https://jsonplaceholder.typicode.com";
type Tab = "recipes" | "users" | "posts" | "todos";
const TABS: Tab[] = ["recipes", "users", "posts", "todos"];

export default function App() {
  const [tab, setTab] = useState<Tab>("recipes");

  return (
    <main>
      <h1>One component, four kinds of data</h1>
      <div className="row tabs" role="tablist">
        {TABS.map(name => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            className={tab === name ? "" : "secondary"}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {tab === "recipes" && (
        <DataFetcher<RecipeResponse>
          title="Recipes and nutrition"
          url="https://dummyjson.com/recipes?limit=12"
          render={data => (
            <ul className="plain">
              {data.recipes.map(recipe => (
                <li key={recipe.id}>
                  <strong>{recipe.name}</strong>
                  <p>
                    {recipe.caloriesPerServing} calories per serving · {recipe.servings} servings
                  </p>
                  <p className="muted">{recipe.ingredients.join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        />
      )}

      {tab === "users" && (
        <DataFetcher<User[]>
          title="Users"
          url={`${API}/users`}
          render={users => (
            <ul className="plain">
              {users.map(user => (
                <li key={user.id}>
                  {user.name} <span className="muted">{user.company.name}</span>
                </li>
              ))}
            </ul>
          )}
        />
      )}

      {tab === "posts" && (
        <DataFetcher<Post[]>
          title="Posts"
          url={`${API}/posts?_limit=8`}
          render={posts => (
            <ol>
              {posts.map(post => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ol>
          )}
        />
      )}

      {tab === "todos" && (
        <DataFetcher<Todo[]>
          title="Todos"
          url={`${API}/todos?_limit=10`}
          render={todos => (
            <p>
              {todos.filter(todo => todo.completed).length} of {todos.length} todos are completed.
            </p>
          )}
        />
      )}
    </main>
  );
}
