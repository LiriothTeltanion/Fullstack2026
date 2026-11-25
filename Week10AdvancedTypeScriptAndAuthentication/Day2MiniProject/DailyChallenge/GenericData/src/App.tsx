import { useState } from "react";
import DataFetcher from "./components/DataFetcher";
import type { Post, Todo, User } from "./types";

const API = "https://jsonplaceholder.typicode.com";
type Tab = "users" | "posts" | "todos";
const TABS: Tab[] = ["users", "posts", "todos"];

export default function App() {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <main>
      <h1>One component, three kinds of data</h1>
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
