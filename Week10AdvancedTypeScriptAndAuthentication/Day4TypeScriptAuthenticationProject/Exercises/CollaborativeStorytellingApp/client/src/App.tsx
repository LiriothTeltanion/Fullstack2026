import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorChanged, fetchStories, sessionChanged, sessionChecked } from "./storySlice";
import { type AppDispatch, type RootState } from "./store";
import { api } from "./api";
import AuthForm from "./components/AuthForm";
import StoryCard from "./components/StoryCard";
import StoryForm from "./components/StoryForm";
import type { User } from "./types";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, checking, stories, loading, error } = useSelector(
    (state: RootState) => state.story
  );
  const setUser = useCallback(
    (user: User | null) => {
      dispatch(sessionChanged(user));
    },
    [dispatch]
  );
  const setError = useCallback(
    (message: string) => {
      dispatch(errorChanged(message));
    },
    [dispatch]
  );

  // On load, ask the server whether the cookie still holds a valid session.
  useEffect(() => {
    let active = true;
    api
      .me()
      .then(({ user }) => {
        if (active) setUser(user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) dispatch(sessionChecked());
      });
    return () => {
      active = false;
    };
  }, [dispatch, setUser]);

  const loadStories = useCallback(async () => {
    await dispatch(fetchStories()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (user) loadStories().catch(() => {});
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
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log out");
    }
  };

  if (checking) return <main className="muted">Checking your session...</main>;

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
          {loading && (
            <p role="status" className="muted">
              Loading stories...
            </p>
          )}
          {!loading && stories.length === 0 && (
            <p className="muted">No stories yet. Start the first one.</p>
          )}
          {stories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              currentUser={user}
              onSave={(id, changes) => run(() => api.updateStory(id, changes))}
              onDelete={id => run(() => api.deleteStory(id))}
              onRemoveContributor={id => run(() => api.removeContributor(id))}
              onAddContributor={(id, username) => run(() => api.addContributor(id, username))}
            />
          ))}
        </>
      )}
    </main>
  );
}
