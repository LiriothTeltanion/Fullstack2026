import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import AuthForm from "./components/AuthForm";
import StoryCard from "./components/StoryCard";
import StoryForm from "./components/StoryForm";
import type { Story, User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState("");

  // On load, ask the server whether the cookie still holds a valid session.
  useEffect(() => {
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  const loadStories = useCallback(async () => {
    try {
      setStories((await api.stories()).stories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load stories");
    }
  }, []);

  useEffect(() => {
    if (user) loadStories();
  }, [user, loadStories]);

  // Runs an API call, shows its error if it fails, then reloads the list.
  const run = async (action: () => Promise<unknown>) => {
    setError("");
    try {
      await action();
      await loadStories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setStories([]);
  };

  if (checking) return <main className="muted">Checking your session…</main>;

  return (
    <main>
      <header className="top">
        <h1>Collaborative stories</h1>
        {user && (
          <span className="row">
            <span className="muted">Signed in as {user.username}</span>
            <button className="secondary" onClick={logout}>
              Log out
            </button>
          </span>
        )}
      </header>

      {!user ? (
        <AuthForm onLoggedIn={setUser} />
      ) : (
        <>
          <StoryForm onCreate={(title, content) => run(() => api.createStory(title, content))} />
          {error && <p className="error">{error}</p>}
          {stories.length === 0 && <p className="muted">No stories yet. Start the first one.</p>}
          {stories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              currentUser={user}
              onSave={(id, changes) => run(() => api.updateStory(id, changes))}
              onDelete={id => run(() => api.deleteStory(id))}
              onAddContributor={(id, username) => run(() => api.addContributor(id, username))}
            />
          ))}
        </>
      )}
    </main>
  );
}
