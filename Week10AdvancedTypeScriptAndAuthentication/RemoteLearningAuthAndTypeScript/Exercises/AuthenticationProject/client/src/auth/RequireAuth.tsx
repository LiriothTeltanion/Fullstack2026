import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  fallback: ReactNode;
}

// Shows `children` only to a logged-in user, otherwise the fallback (the login page).
export default function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { user, token, loading, sessionMessage, retrySession, logout } = useAuth();
  if (loading) return <p className="muted">Checking your session…</p>;
  if (!user && token) {
    return (
      <section className="card stack">
        <p role="status">{sessionMessage || "Your session has not been checked yet."}</p>
        <button onClick={retrySession}>Retry session</button>
        <button className="secondary" onClick={logout}>
          Back to login
        </button>
      </section>
    );
  }
  return <>{user ? children : fallback}</>;
}
