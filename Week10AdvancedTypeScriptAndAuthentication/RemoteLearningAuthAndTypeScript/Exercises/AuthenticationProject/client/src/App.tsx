import { useAuth } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <main>
      <nav className="top">
        <h1>My account</h1>
        {user && (
          <button className="secondary" onClick={logout}>
            Log out
          </button>
        )}
      </nav>
      <RequireAuth fallback={<AuthPage />}>
        <ProfilePage />
      </RequireAuth>
    </main>
  );
}
