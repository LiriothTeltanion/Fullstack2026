import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  fallback: ReactNode;
}

// Shows `children` only to a logged-in user, otherwise the fallback (the login page).
export default function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { user, loading } = useAuth();
  if (loading) return <p className="muted">Checking your session…</p>;
  return <>{user ? children : fallback}</>;
}
