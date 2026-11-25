import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorChanged, fetchStories } from "./storySlice";
import { sessionChanged, sessionChecked } from "./authSlice";
import { type AppDispatch, type RootState } from "./store";
import { api } from "./api";
import { AppLink, navigate, useLocation } from "./navigation";
import { parseRoute, safeReturnTo } from "./routes";
import AuthForm from "./components/AuthForm";
import StoryCard from "./components/StoryCard";
import StoryForm from "./components/StoryForm";
import ThemeToggle from "./components/ThemeToggle";
import type { Story, User } from "./types";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, checking } = useSelector((state: RootState) => state.auth);
  const { stories, loading, loaded, error } = useSelector((state: RootState) => state.story);
  const location = useLocation();
  const route = parseRoute(location);
  const authenticationPage = route.page === "login" || route.page === "register";
  const returnTo = safeReturnTo(new URLSearchParams(location.split("?")[1]).get("next"));
  const setUser = useCallback((value: User | null) => dispatch(sessionChanged(value)), [dispatch]);
  const setError = useCallback((message: string) => dispatch(errorChanged(message)), [dispatch]);

  // The access JWT stays in Redux; refresh cookies restore only this session.
  useEffect(() => {
    let active = true;
    api
      .me()
      .then(({ user: restored }) => {
        if (active) setUser(restored);
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

  useEffect(() => {
    if (checking) return;
    if (!user && !authenticationPage && route.page !== "not-found") {
      navigate("/login?next=" + encodeURIComponent(location), { replace: true });
    } else if (user && authenticationPage) {
      navigate(returnTo, { replace: true });
    }
  }, [checking, user, authenticationPage, route.page, location, returnTo]);

  const loadStories = useCallback(async () => {
    await dispatch(fetchStories()).unwrap();
  }, [dispatch]);
  useEffect(() => {
    if (user) loadStories().catch(() => {});
  }, [user, loadStories]);
  useEffect(() => {
    document.getElementById("page-title")?.focus({ preventScroll: true });
  }, [location]);

  // False means the mutation failed, so child forms must retain their drafts.
  const run = async (action: () => Promise<unknown>): Promise<boolean> => {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return false;
    }
    try {
      await loadStories();
    } catch {
      setError(
        "Your change was saved, but the story list could not refresh. Please retry loading."
      );
    }
    return true;
  };
  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log out");
    }
  };
  const createStory = async (title: string, content: string) => {
    let id: number | undefined;
    const saved = await run(async () => {
      id = (await api.createStory(title, content)).story.id;
    });
    if (saved && id !== undefined) navigate(`/stories/${id}`);
    return saved;
  };
  const deleteStory = async (id: number) => {
    const removed = await run(() => api.deleteStory(id));
    if (removed) navigate("/stories");
    return removed;
  };
  const card = (story: Story, detailView: boolean) =>
    user && (
      <StoryCard
        key={story.id}
        story={story}
        currentUser={user}
        detailView={detailView}
        onEdit={id => navigate(`/stories/${id}/edit`)}
        onSave={(id, changes) => run(() => api.updateStory(id, changes))}
        onDelete={deleteStory}
        onRemoveContributor={id => run(() => api.removeContributor(id))}
        onAddContributor={(id, username) => run(() => api.addContributor(id, username))}
      />
    );

  let content;
  if (checking)
    content = (
      <p role="status" className="muted">
        Checking your session…
      </p>
    );
  else if (authenticationPage && !user)
    content = (
      <AuthForm
        key={route.page}
        mode={route.page === "register" ? "register" : "login"}
        returnTo={returnTo}
        onLoggedIn={value => {
          setUser(value);
          navigate(returnTo, { replace: true });
        }}
      />
    );
  else if (route.page === "not-found")
    content = (
      <section className="card">
        <h2 id="page-title" tabIndex={-1}>
          Page not found
        </h2>
        <p>This address is not a story page.</p>
        <AppLink href="/stories">Back to all stories</AppLink>
      </section>
    );
  else if (user) {
    if (route.page === "new")
      content = (
        <StoryForm
          heading="Start a story"
          onCreate={createStory}
          onCancel={() => navigate("/stories")}
        />
      );
    else if (route.page === "detail" || route.page === "edit") {
      const story = stories.find(item => item.id === route.storyId);
      if ((loading || !loaded) && !story && !error)
        content = <p role="status">Loading this story…</p>;
      else if (!story)
        content = error ? (
          <p className="muted">Please reload the stories to open this page.</p>
        ) : (
          <section className="card">
            <h2 id="page-title" tabIndex={-1}>
              Story not found
            </h2>
            <p>It may have been deleted.</p>
            <AppLink href="/stories">All stories</AppLink>
          </section>
        );
      else if (route.page === "detail")
        content = (
          <>
            <AppLink href="/stories" className="back-link">
              ← All stories
            </AppLink>
            <h2 id="page-title" tabIndex={-1} className="page-heading">
              Story details
            </h2>
            {card(story, true)}
          </>
        );
      else if (
        story.author.id !== user.id &&
        !story.contributors.some(person => person.id === user.id)
      )
        content = (
          <section className="card">
            <h2 id="page-title" tabIndex={-1}>
              Editing is restricted
            </h2>
            <p>Only this story's author and invited collaborators can edit it.</p>
            <AppLink href={`/stories/${story.id}`}>Read the story</AppLink>
          </section>
        );
      else
        content = (
          <StoryForm
            key={story.id}
            initialStory={story}
            heading="Continue the story"
            submitLabel="Save changes"
            onCancel={() => navigate(`/stories/${story.id}`)}
            onCreate={async (title, text) => {
              const saved = await run(() => api.updateStory(story.id, { title, content: text }));
              if (saved) navigate(`/stories/${story.id}`);
              return saved;
            }}
          />
        );
    } else {
      const visible =
        route.page === "mine" ? stories.filter(story => story.author.id === user.id) : stories;
      content = (
        <>
          <div className="page-intro">
            <h2 id="page-title" tabIndex={-1}>
              {route.page === "mine" ? "My stories" : "All stories"}
            </h2>
            <p className="muted">
              {route.page === "mine"
                ? "Stories you started. Invite someone to write the next part."
                : "Read a story, meet its contributors, or start something new."}
            </p>
          </div>
          {loading && (
            <p role="status" className="muted">
              Loading stories…
            </p>
          )}
          {!loading && loaded && visible.length === 0 && (
            <section className="card empty-state">
              <h3>
                {route.page === "mine" ? "Your first story starts here" : "A blank page, together"}
              </h3>
              <p>No stories to show yet.</p>
              <AppLink className="button-link" href="/stories/new">
                Start a story
              </AppLink>
            </section>
          )}
          {visible.map(story => card(story, false))}
        </>
      );
    }
  } else
    content = (
      <p role="status" className="muted">
        Opening sign in…
      </p>
    );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-shell">
        <header className="top">
          <div>
            <h1 className="brand-heading">
              <AppLink href="/stories" className="brand">
                Collaborative stories
              </AppLink>
            </h1>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            {user && (
              <>
                <span className="muted signed-in">
                  Signed in as <strong>{user.username}</strong>
                </span>
                <button className="secondary" onClick={logout}>
                  Log out
                </button>
              </>
            )}
          </div>
        </header>
        <nav className="main-nav" aria-label="Main navigation">
          {user ? (
            <>
              <AppLink href="/stories" aria-current={route.page === "all" ? "page" : undefined}>
                All stories
              </AppLink>
              <AppLink
                href="/stories/mine"
                aria-current={route.page === "mine" ? "page" : undefined}
              >
                My stories
              </AppLink>
              <AppLink href="/stories/new" aria-current={route.page === "new" ? "page" : undefined}>
                Start a story
              </AppLink>
            </>
          ) : (
            <>
              <AppLink href="/login" aria-current={route.page === "login" ? "page" : undefined}>
                Log in
              </AppLink>
              <AppLink
                href="/register"
                aria-current={route.page === "register" ? "page" : undefined}
              >
                Sign up
              </AppLink>
            </>
          )}
        </nav>
        <main id="main-content" tabIndex={-1}>
          {error && (
            <div className="error-banner" role="alert">
              <p>{error}</p>
              {user && (
                <button className="secondary" onClick={() => loadStories().catch(() => {})}>
                  Reload stories
                </button>
              )}
            </div>
          )}
          {content}
        </main>
      </div>
    </>
  );
}
